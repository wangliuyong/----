import { Module } from '@nestjs/common';
import { RbacModule } from '../rbac/rbac.module';
import { AdminAiController } from './admin-ai.controller';
import { AiController } from './ai.controller';
import { AiChatLogService } from './services/ai-chat-log.service';
import { AiChatMemoryService } from './services/ai-chat-memory.service';
import { AiChatService } from './services/ai-chat.service';
import { AiConfigService } from './services/ai-config.service';
import { AiEmbeddingsService } from './services/ai-embeddings.service';
import { AiIngestService } from './services/ai-ingest.service';
import { AiSyncCandidatesService } from './services/ai-sync-candidates.service';
import { AiVectorStoreService } from './services/ai-vector-store.service';

/** AI 小助手模块：RAG 向量库 + LangChain Agent + 管理端同步 */
@Module({
  imports: [RbacModule],
  controllers: [AiController, AdminAiController],
  providers: [
    AiConfigService,
    AiEmbeddingsService,
    AiVectorStoreService,
    AiIngestService,
    AiSyncCandidatesService,
    AiChatLogService,
    AiChatMemoryService,
    AiChatService,
  ],
  exports: [AiConfigService, AiEmbeddingsService, AiVectorStoreService],
})
export class AiModule {}
