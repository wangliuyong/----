import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAiConfigDto } from '../dto/update-ai-config.dto';

/** 解析后的 AI 运行时配置（含明文 Key，仅服务端使用） */
export interface ResolvedAiConfig {
  apiKey: string;
  baseUrl: string;
  chatModel: string;
  embeddingModel: string;
  embeddingDimensions: number;
}

/** 管理端展示用 AI 配置（Key 脱敏） */
export interface PublicAiConfig {
  openaiBaseUrl: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
  hasApiKey: boolean;
  apiKeyMasked: string | null;
  fromEnv: boolean;
}

/** 前端提交时用于「不修改 Key」的占位符 */
export const AI_CONFIG_KEY_PLACEHOLDER = '********';

/**
 * AI 配置服务：DB 优先，环境变量兜底；管理端可在线修改。
 * 通义千问（dashscope）未显式配置模型时自动选用 qwen-plus / text-embedding-v3。
 */
@Injectable()
export class AiConfigService {
  constructor(private readonly prisma: PrismaService) {}

  /** 获取运行时配置（DB → env），无 Key 时返回 null */
  async getResolvedConfig(): Promise<ResolvedAiConfig | null> {
    const row = await this.ensureRow();
    const apiKey = row.openaiApiKey?.trim() || process.env.OPENAI_API_KEY?.trim() || '';
    if (!apiKey) return null;

    const baseUrl =
      row.openaiBaseUrl?.trim() ||
      process.env.OPENAI_BASE_URL?.trim() ||
      'https://api.openai.com/v1';

    const isDashscope = baseUrl.includes('dashscope');

    const chatModel =
      row.openaiChatModel?.trim() ||
      process.env.OPENAI_CHAT_MODEL?.trim() ||
      (isDashscope ? 'qwen-plus' : 'gpt-4o-mini');

    const embeddingModel =
      row.openaiEmbeddingModel?.trim() ||
      process.env.OPENAI_EMBEDDING_MODEL?.trim() ||
      (isDashscope ? 'text-embedding-v3' : 'text-embedding-3-small');

    const embeddingDimensions =
      row.embeddingDimensions ??
      (process.env.AI_EMBEDDING_DIMENSIONS
        ? Number(process.env.AI_EMBEDDING_DIMENSIONS)
        : null) ??
      inferEmbeddingDimensions(embeddingModel);

    return { apiKey, baseUrl, chatModel, embeddingModel, embeddingDimensions };
  }

  /** 是否已配置 API Key */
  async isConfigured(): Promise<boolean> {
    const cfg = await this.getResolvedConfig();
    return Boolean(cfg?.apiKey);
  }

  /** 管理端读取配置（Key 脱敏） */
  async getPublicConfig(): Promise<PublicAiConfig> {
    const resolved = await this.getResolvedConfig();
    const row = await this.ensureRow();
    const envKey = process.env.OPENAI_API_KEY?.trim() || '';
    const dbKey = row.openaiApiKey?.trim() || '';
    const effectiveKey = dbKey || envKey;
    const fromEnv = Boolean(envKey && !dbKey);

    const baseUrl =
      row.openaiBaseUrl?.trim() ||
      process.env.OPENAI_BASE_URL?.trim() ||
      'https://api.openai.com/v1';

    const isDashscope = baseUrl.includes('dashscope');

    const chatModel =
      row.openaiChatModel?.trim() ||
      process.env.OPENAI_CHAT_MODEL?.trim() ||
      (isDashscope ? 'qwen-plus' : 'gpt-4o-mini');

    const embeddingModel =
      row.openaiEmbeddingModel?.trim() ||
      process.env.OPENAI_EMBEDDING_MODEL?.trim() ||
      (isDashscope ? 'text-embedding-v3' : 'text-embedding-3-small');

    const embeddingDimensions =
      row.embeddingDimensions ??
      (process.env.AI_EMBEDDING_DIMENSIONS
        ? Number(process.env.AI_EMBEDDING_DIMENSIONS)
        : null) ??
      inferEmbeddingDimensions(embeddingModel);

    return {
      openaiBaseUrl: baseUrl,
      openaiChatModel: chatModel,
      openaiEmbeddingModel: embeddingModel,
      embeddingDimensions,
      hasApiKey: Boolean(effectiveKey || resolved?.apiKey),
      apiKeyMasked: effectiveKey ? maskApiKey(effectiveKey) : null,
      fromEnv,
    };
  }

  /** 更新配置（写入 DB）；返回最新公开配置 */
  async updateConfig(dto: UpdateAiConfigDto): Promise<PublicAiConfig> {
    await this.ensureRow();
    const data: Record<string, string | number | null> = {};

    if (dto.openaiBaseUrl !== undefined) {
      data.openaiBaseUrl = dto.openaiBaseUrl.trim() || 'https://api.openai.com/v1';
    }

    const incomingKey = dto.openaiApiKey?.trim();
    if (
      incomingKey &&
      incomingKey !== AI_CONFIG_KEY_PLACEHOLDER &&
      !incomingKey.includes('*')
    ) {
      data.openaiApiKey = incomingKey;
    }

    if (dto.openaiChatModel !== undefined) {
      data.openaiChatModel = dto.openaiChatModel.trim() || null;
    }
    if (dto.openaiEmbeddingModel !== undefined) {
      data.openaiEmbeddingModel = dto.openaiEmbeddingModel.trim() || null;
    }
    if (dto.embeddingDimensions !== undefined) {
      data.embeddingDimensions = dto.embeddingDimensions;
    }

    if (Object.keys(data).length) {
      await this.prisma.aiConfig.update({ where: { id: 1 }, data });
    }

    return this.getPublicConfig();
  }

  private async ensureRow() {
    return this.prisma.aiConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        openaiBaseUrl: 'https://api.openai.com/v1',
        openaiApiKey: null,
      },
    });
  }
}

/** 根据 embedding 模型推断默认向量维度 */
export function inferEmbeddingDimensions(model: string): number {
  const m = model.toLowerCase();
  if (m.includes('text-embedding-v3') || m.includes('text-embedding-v4')) return 1024;
  if (m.includes('text-embedding-3') || m.includes('text-embedding-ada')) return 1536;
  return 1536;
}

function maskApiKey(key: string): string {
  if (key.length <= 8) return '********';
  return `${key.slice(0, 3)}...${key.slice(-4)}`;
}
