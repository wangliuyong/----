import { CalendarOutlined, FolderOutlined, LinkOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input } from 'antd';

/** 侧栏发布设置：分类、标签、Slug、时间、摘要 */
export default function ArticleMetaSidebar() {
  return (
    <div className="article-meta-sidebar">
      <section className="article-meta-sidebar__block">
        <h4 className="article-meta-sidebar__heading">
          <FolderOutlined aria-hidden />
          分类与标签
        </h4>
        <Form.Item name="category" label="分类">
          <Input placeholder="如：前端、随笔" />
        </Form.Item>
        <Form.Item name="tags" label="标签">
          <Input placeholder="逗号分隔多个标签" />
        </Form.Item>
      </section>

      <section className="article-meta-sidebar__block">
        <h4 className="article-meta-sidebar__heading">
          <LinkOutlined aria-hidden />
          链接与时间
        </h4>
        <Form.Item name="slug" label="URL Slug">
          <Input placeholder="留空则自动生成" />
        </Form.Item>
        <Form.Item name="publishedAt" label="发布时间">
          <DatePicker
            showTime
            className="article-meta-sidebar__full"
            format="YYYY-MM-DD HH:mm"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>
      </section>

      <section className="article-meta-sidebar__block">
        <h4 className="article-meta-sidebar__heading">摘要</h4>
        <Form.Item name="summary" label={null} className="article-meta-sidebar__summary">
          <Input.TextArea
            placeholder="用于列表展示与 SEO，可选"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </section>
    </div>
  );
}
