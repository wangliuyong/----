import type { Message } from '../../types';

/** /admin/messages 页面入参 */
export interface MessagesPageProps {
  apiBase: string;
  messages: Message[];
  onRefresh: () => void;
}
