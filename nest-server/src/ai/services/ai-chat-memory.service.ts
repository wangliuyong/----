import { Injectable } from '@nestjs/common';
import { MemorySaver } from '@langchain/langgraph-checkpoint';

/**
 * AI 对话短期记忆：基于 LangGraph MemorySaver 按 thread_id 持久化 Agent 状态。
 * 进程内存储，重启后清空；生产多实例部署可替换为 Redis/Postgres checkpointer。
 */
@Injectable()
export class AiChatMemoryService {
  /** LangChain 内置内存检查点，供 createAgent checkpointer 使用 */
  private readonly checkpointer = new MemorySaver();

  getCheckpointer(): MemorySaver {
    return this.checkpointer;
  }

  /** 清除指定会话线程的全部 checkpoint（对应前端「清空」） */
  async clearThread(threadId: string): Promise<void> {
    const id = threadId?.trim();
    if (!id) return;
    await this.checkpointer.deleteThread(id);
  }
}
