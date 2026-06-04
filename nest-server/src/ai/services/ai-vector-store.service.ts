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

/** 管理端知识库列表项（不含 vector 数组，减小传输体积） */
export interface KnowledgeChunkListItem {
  id: string;
  source: string;
  sourceId: string;
  title: string;
  slug: string;
  textPreview: string;
  textLength: number;
}

export interface ListKnowledgeChunksParams {
  source?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface ListKnowledgeChunksResult {
  items: KnowledgeChunkListItem[];
  total: number;
  page: number;
  pageSize: number;
}

const TABLE_NAME = 'knowledge_chunks';

/**
 * LanceDB 向量库封装：增删查与按 source 统计。
 * 向量维度随 Embedding 模型配置变更时需重建表；进程重启后应复用磁盘已有表，不可误删。
 */
@Injectable()
export class AiVectorStoreService {
  private db: Connection | null = null;
  private table: Table | null = null;
  /** 当前内存中绑定的表向量维度（进程重启后为 0，需从 LanceDB 重新探测） */
  private tableDim = 0;

  constructor(private readonly embeddings: AiEmbeddingsService) { }

  /** 配置变更后清除内存缓存，下次操作重新 openTable（不直接删盘） */
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

  /** 从已有表抽样读取向量维度；空表时返回 null */
  private async readTableVectorDim(table: Table): Promise<number | null> {
    try {
      const rows = (await table.query().limit(1).toArray()) as VectorChunkRecord[];
      const vector = rows[0]?.vector;
      if (Array.isArray(vector) && vector.length > 0) {
        return vector.length;
      }
    } catch {
      /* 空表或尚未写入数据 */
    }
    return null;
  }

  /** 确保表存在且向量维度与当前 Embedding 配置一致 */
  private async ensureTable(dim: number) {
    const db = await this.getConnection();
    const names = await db.tableNames();

    if (names.includes(TABLE_NAME)) {
      // 内存缓存仍有效
      if (this.table && this.tableDim === dim) return;

      const opened = await db.openTable(TABLE_NAME);
      const existingDim = await this.readTableVectorDim(opened);

      // 仅当已入库向量维度与当前模型不一致时才 drop（如更换 embedding 模型）
      if (existingDim !== null && existingDim !== dim) {
        await db.dropTable(TABLE_NAME);
        this.table = null;
        this.tableDim = 0;
      } else {
        this.table = opened;
        this.tableDim = existingDim ?? dim;
        return;
      }
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
      await table.delete(`source = '${this.escapeSqlLiteral(source)}'`);
    } catch {
      /* 表为空或无匹配时忽略 */
    }
  }

  /** 按主键删除单条或多条向量记录 */
  async deleteByIds(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    const table = await this.getTable();
    let deleted = 0;
    for (const id of ids) {
      const trimmed = id?.trim();
      if (!trimmed) continue;
      try {
        await table.delete(`id = '${this.escapeSqlLiteral(trimmed)}'`);
        deleted += 1;
      } catch {
        /* 无匹配或已删除时忽略 */
      }
    }
    return deleted;
  }

  /**
   * 分页列出 LanceDB 中的向量块（内存过滤 + 切片；适合管理端浏览与删除）。
   */
  async listChunks(params: ListKnowledgeChunksParams = {}): Promise<ListKnowledgeChunksResult> {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

    try {
      const table = await this.getTable();
      let rows = (await table.query().toArray()) as VectorChunkRecord[];

      if (params.source?.trim()) {
        const source = params.source.trim();
        rows = rows.filter((r) => r.source === source);
      }

      const keyword = params.keyword?.trim().toLowerCase();
      if (keyword) {
        rows = rows.filter(
          (r) =>
            String(r.text ?? '')
              .toLowerCase()
              .includes(keyword) ||
            String(r.title ?? '')
              .toLowerCase()
              .includes(keyword) ||
            String(r.sourceId ?? '')
              .toLowerCase()
              .includes(keyword) ||
            String(r.slug ?? '')
              .toLowerCase()
              .includes(keyword),
        );
      }

      rows.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      const total = rows.length;
      const start = (page - 1) * pageSize;
      const slice = rows.slice(start, start + pageSize);

      const items: KnowledgeChunkListItem[] = slice.map((r) => {
        const text = String(r.text ?? '');
        const previewLen = 240;
        return {
          id: String(r.id),
          source: String(r.source ?? ''),
          sourceId: String(r.sourceId ?? ''),
          title: String(r.title ?? ''),
          slug: String(r.slug ?? ''),
          textPreview: text.length > previewLen ? `${text.slice(0, previewLen)}…` : text,
          textLength: text.length,
        };
      });

      return { items, total, page, pageSize };
    } catch {
      return { items: [], total: 0, page, pageSize };
    }
  }

  /** 单条详情（含完整文本，供管理端弹窗查看） */
  async getChunkById(id: string): Promise<(KnowledgeChunkListItem & { text: string }) | null> {
    const trimmed = id?.trim();
    if (!trimmed) return null;
    try {
      const table = await this.getTable();
      const rows = (await table.query().toArray()) as VectorChunkRecord[];
      const row = rows.find((r) => String(r.id) === trimmed);
      if (!row) return null;
      const text = String(row.text ?? '');
      return {
        id: String(row.id),
        source: String(row.source ?? ''),
        sourceId: String(row.sourceId ?? ''),
        title: String(row.title ?? ''),
        slug: String(row.slug ?? ''),
        textPreview: text,
        textLength: text.length,
        text,
      };
    } catch {
      return null;
    }
  }

  /** LanceDB delete 过滤值转义（单引号） */
  private escapeSqlLiteral(value: string): string {
    return value.replace(/'/g, "''");
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
