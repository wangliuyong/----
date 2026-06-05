import { CalendarOutlined } from '@ant-design/icons';
import { Collapse, DatePicker, Form, Input, type CollapseProps } from 'antd';

/** 侧栏发布设置：分类、标签、Slug、时间、摘要 */
export default function ArticleMetaSidebar() {
  /** 默认全部展开，减少点击成本 */
  const collapseItems: CollapseProps['items'] = [
    {
      key: 'taxonomy',
      label: '分类与标签',
      children: (
        <>
          <Form.Item
            name="category"
            label="分类"
            tooltip="用于博客列表筛选，如前端、随笔"
          >
            <Input placeholder="如：前端、随笔" />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
            tooltip="多个标签用英文逗号分隔"
          >
            <Input placeholder="React, TypeScript" />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'publish',
      label: '链接与时间',
      children: (
        <>
          <Form.Item
            name="slug"
            label="URL Slug"
            tooltip="留空将根据标题自动生成"
          >
            <Input placeholder="seo使用" />
          </Form.Item>
          <Form.Item name="publishedAt" label="发布时间">
            <DatePicker
              showTime
              className="article-meta-sidebar__full"
              format="YYYY-MM-DD HH:mm"
              suffixIcon={<CalendarOutlined />}
              placeholder="选择发布时间"
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'summary',
      label: '摘要',
      children: (
        <>
          <p className="article-meta-sidebar__hint">
            用于列表展示与搜索引擎摘要，建议 80-160 字
          </p>
          <Form.Item name="summary" label={null} className="article-meta-sidebar__summary">
            <Input.TextArea
              placeholder="简要概括文章要点"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="article-meta-sidebar">
      <Collapse
        bordered={false}
        defaultActiveKey={['taxonomy', 'publish', 'summary']}
        expandIconPosition="end"
        className="article-meta-sidebar__collapse"
        items={collapseItems}
      />
    </div>
  );
}
