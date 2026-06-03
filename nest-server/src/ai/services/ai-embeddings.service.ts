import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { AiConfigService } from './ai-config.service';

/** 通义千问 dashscope embedding 单次 batch 上限为 10 */
const DASHSCOPE_EMBEDDING_BATCH_SIZE = 10;
const DEFAULT_EMBEDDING_BATCH_SIZE = 64;

/**
 * OpenAI 兼容 Embedding 工厂（配置来自 AiConfigService：DB 优先，env 兜底）。
 * embedDocuments 按 provider 分批调用，避免 dashscope「batch size > 10」报错。
 */
@Injectable()
export class AiEmbeddingsService {
  private embeddings: OpenAIEmbeddings | null = null;
  private cacheKey = '';

  constructor(private readonly aiConfig: AiConfigService) {}

  resetCache() {
    this.embeddings = null;
    this.cacheKey = '';
  }

  /** 解析 embedding 批量大小（env 优先，dashscope 默认 10） */
  private resolveBatchSize(baseUrl: string): number {
    const fromEnv = process.env.AI_EMBEDDING_BATCH_SIZE?.trim();
    if (fromEnv) {
      const n = Number(fromEnv);
      if (Number.isFinite(n) && n >= 1) return Math.floor(n);
    }
    return baseUrl.includes('dashscope')
      ? DASHSCOPE_EMBEDDING_BATCH_SIZE
      : DEFAULT_EMBEDDING_BATCH_SIZE;
  }

  async getEmbeddings(): Promise<OpenAIEmbeddings> {
    const resolved = await this.aiConfig.getResolvedConfig();
    if (!resolved) {
      throw new Error('未配置 OPENAI_API_KEY，请在 AI 小助手管理中设置');
    }

    const batchSize = this.resolveBatchSize(resolved.baseUrl);
    const fingerprint = [
      resolved.baseUrl,
      resolved.apiKey.slice(-6),
      resolved.embeddingModel,
      resolved.embeddingDimensions,
      batchSize,
    ].join(':');

    if (!this.embeddings || this.cacheKey !== fingerprint) {
      this.embeddings = new OpenAIEmbeddings({
        apiKey: resolved.apiKey,
        model: resolved.embeddingModel,
        dimensions: resolved.embeddingDimensions,
        batchSize,
        configuration: { baseURL: resolved.baseUrl },
      });
      this.cacheKey = fingerprint;
    }
    return this.embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    return (await this.getEmbeddings()).embedQuery(text);
  }

  /**
   * 分批向量化文档，兼容 dashscope 等 batch 上限较低的 provider
   */
  async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!texts.length) return [];

    const resolved = await this.aiConfig.getResolvedConfig();
    if (!resolved) {
      throw new Error('未配置 OPENAI_API_KEY，请在 AI 小助手管理中设置');
    }

    const batchSize = this.resolveBatchSize(resolved.baseUrl);
    const embeddings = await this.getEmbeddings();
    const vectors: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchVectors = await embeddings.embedDocuments(batch);
      vectors.push(...batchVectors);
    }

    return vectors;
  }

  /** 当前配置下的向量维度 */
  async getDimensions(): Promise<number> {
    const resolved = await this.aiConfig.getResolvedConfig();
    if (!resolved) throw new Error('未配置 OPENAI_API_KEY');
    return resolved.embeddingDimensions;
  }
}
