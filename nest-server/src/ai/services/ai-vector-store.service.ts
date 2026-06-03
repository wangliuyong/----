import { Injectable } from '@nestjs/common';
import * as lancedb from '@lancedb/lancedb';
import type { Connection, Table } from '@lancedb/lancedb';
import { AiEmbeddingsService } from './ai-embeddings.service';
import * as fs from 'fs';
import * as path from 'path';

/** LanceDB 表中单条向量记录结构 */
export type VectorChunkRecord = Record<string, unknown> & {
  id: string;
  text: string;
  vector: number[];
  source: string;
  sourceId: string;
  title: string;
  slug: string;
};

/** 相似度检索结果 */
export interface VectorSearchResult {
  text: string;
  source: string;
  sourceId: string;
  title: string;
  slug: string;
  score: number;
}

const TABLE_NAME = 'knowledge_chunks';

/**
 * LanceDB 向量库封装：增删查与按 source 统计。
 * 向量维度随 Embedding 模型配置动态调整，变更时自动重建表。
 */
@Injectable()
export class AiVectorStoreService {
  private db: Connection | null = null;
  private table: Table | null = null;
  /** 当前表对应的向量维度 */
  private tableDim = 0;

  constructor(private readonly embeddings: AiEmbeddingsService) {}

  /** 配置变更后清除表缓存，下次操作按新维度重建 */
  resetTable() {
    this.table = null;
    this.tableDim = 0;
  }

  private getDbPath() {
    return process.env.LANCE_DB_PATH ?? './data/lancedb';
  }

  private async getConnection(): Promise<Connection> {
    if (!this.db) {
      const dbPath = this.getDbPath();
      fs.mkdirSync(path.resolve(dbPath), { recursive: true });
      this.db = await lancedb.connect(dbPath);
    }
    return this.db;
  }

  /** 确保表存在且向量维度与当前 Embedding 配置一致 */
  private async ensureTable(dim: number) {
    const db = await this.getConnection();
    const names = await db.tableNames();

    if (names.includes(TABLE_NAME)) {
      if (this.tableDim === dim && this.table) return;
      /** 维度变更：删除旧表并重建，避免写入失败 */
      await db.dropTable(TABLE_NAME);
      this.table = null;
      this.tableDim = 0;
    }

    const placeholder: VectorChunkRecord = {
      id: '__init__',
      text: '',
      vector: new Array(dim).fill(0),
      source: '',
      sourceId: '',
      title: '',
      slug: '',
    };
    this.table = await db.createTable(TABLE_NAME, [placeholder as Record<string, unknown>]);
    await this.table.delete('id = "__init__"');
    this.tableDim = dim;
  }

  private async getTable(): Promise<Table> {
    const dim = await this.embeddings.getDimensions();
    await this.ensureTable(dim);
    if (!this.table) throw new Error('LanceDB 表未初始化');
    return this.table;
  }

  async deleteBySource(source: string) {
    const table = await this.getTable();
    try {
      await table.delete(`source = '${source.replace(/'/g, "''")}'`);
    } catch {
      /* 表为空或无匹配时忽略 */
    }
  }

  async addChunks(
    chunks: Array<{
      text: string;
      source: string;
      sourceId: string;
      title: string;
      slug?: string;
    }>,
  ): Promise<number> {
    if (!chunks.length) return 0;

    const texts = chunks.map((c) => c.text);
    const vectors = await this.embeddings.embedDocuments(texts);
    const table = await this.getTable();

    const records: VectorChunkRecord[] = chunks.map((c, i) => ({
      id: `${c.source}-${c.sourceId}-${i}-${Date.now()}`,
      text: c.text,
      vector: vectors[i] ?? [],
      source: c.source,
      sourceId: c.sourceId,
      title: c.title,
      slug: c.slug ?? '',
    }));

    await table.add(records as Record<string, unknown>[]);
    return records.length;
  }

  async similaritySearch(query: string, topK = 5): Promise<VectorSearchResult[]> {
    const table = await this.getTable();
    const queryVector = await this.embeddings.embedQuery(query);

    const rows = (await table
      .vectorSearch(queryVector)
      .limit(topK)
      .toArray()) as Array<VectorChunkRecord & { _distance?: number }>;

    return rows.map((row) => ({
      text: row.text,
      source: row.source,
      sourceId: row.sourceId,
      title: row.title,
      slug: row.slug,
      score: row._distance ?? 0,
    }));
  }

  async statsBySource(): Promise<Record<string, number>> {
    try {
      const table = await this.getTable();
      const rows = (await table.query().toArray()) as VectorChunkRecord[];
      const stats: Record<string, number> = {
        articles: 0,
        projects: 0,
        messages: 0,
        logs: 0,
      };
      for (const row of rows) {
        if (stats[row.source] !== undefined) {
          stats[row.source] += 1;
        }
      }
      return stats;
    } catch {
      return { articles: 0, projects: 0, messages: 0, logs: 0 };
    }
  }
}
