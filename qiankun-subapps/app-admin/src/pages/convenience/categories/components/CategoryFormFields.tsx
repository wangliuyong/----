import { Form, Input, InputNumber, Select, Switch } from 'antd';
import type { FormInstance } from 'antd';
import type { ConvCategoryItem } from '../../../../types/convenience';

interface Props {
  form: FormInstance;
  categories: ConvCategoryItem[];
}

/** 分类表单字段 */
export default function ConvCategoryFormFields({ form, categories }: Props) {
  const isEdit = Boolean(form.getFieldValue('id'));

  return (
    <>
      {!isEdit && (
        <Form.Item name="id" label="分类 ID" rules={[{ required: true, message: '请填写分类 ID' }]}>
          <InputNumber min={1} style={{ width: '100%' }} placeholder="需手动指定，如 63" />
        </Form.Item>
      )}
      <Form.Item name="parentId" label="父分类">
        <Select
          allowClear
          placeholder="留空为一级分类"
          options={categories
            .filter((c) => !c.parentId)
            .map((c) => ({ value: c.id, label: c.name }))}
        />
      </Form.Item>
      <Form.Item name="name" label="名称" rules={[{ required: true, message: '请填写名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="sort" label="排序" initialValue={0}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="enabled" label="启用" valuePropName="checked" initialValue>
        <Switch />
      </Form.Item>
    </>
  );
}

export const CONV_CATEGORY_COLUMNS = [
  { title: 'ID', dataIndex: 'id', width: 72 },
  { title: '名称', dataIndex: 'name' },
  { title: '父分类 ID', dataIndex: 'parentId', width: 100, render: (v: number | null) => v ?? '-' },
  { title: '排序', dataIndex: 'sort', width: 80 },
  {
    title: '启用',
    dataIndex: 'enabled',
    width: 80,
    render: (v: boolean) => (v ? '是' : '否'),
  },
];
