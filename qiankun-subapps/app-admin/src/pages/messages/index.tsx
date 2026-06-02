import { MessagesPanel } from '../../components/AdminPanels';
import type { MessagesPageProps } from './types';

/** /admin/messages — 留言列表 */
export default function MessagesPage({ apiBase, messages, onRefresh }: MessagesPageProps) {
  return <MessagesPanel apiBase={apiBase} messages={messages} onRefresh={onRefresh} />;
}
