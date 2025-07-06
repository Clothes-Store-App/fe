import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetPostsQuery, useDeletePostMutation } from '../../../services/post.service';
import { POST_STATUS_LABELS } from '../../../constants';
import { Table, Button, Tag, Popconfirm, Space, Input, Select, Card, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const PostList = () => {
  const [filter, setFilter] = useState({ status: '', search: '', page: 1, limit: 10 });
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading } = useGetPostsQuery(filter);
  const [deletePost] = useDeletePostMutation();

  const posts = data?.data?.posts || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handlePageChange = (page, pageSize) => {
    setFilter((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleFilterChange = (name, value) => {
    setFilter((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap();
      message.success('Đã xóa bài viết!');
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  // Chỉ search khi bấm Enter
  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setFilter(prev => ({ ...prev, search: searchValue, page: 1 }));
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      align: 'center',
      render: (thumb) => thumb ? (
        <img src={thumb} alt="thumb" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
      ) : (
        <div style={{ width: 56, height: 56, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12 }}>No image</div>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ fontWeight: 500, maxWidth: 220, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <Tag color={status === 'PUBLISHED' ? 'green' : status === 'DRAFT' ? 'orange' : 'default'}>{POST_STATUS_LABELS[status]}</Tag>
    },
    {
      title: 'Nổi bật',
      dataIndex: 'featured',
      key: 'featured',
      align: 'center',
      render: (featured) => featured ? <Tag color="gold">Nổi bật</Tag> : null
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Link to={`/admin/posts/detail/${record.id}`} title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
          <Link to={`/admin/posts/edit/${record.id}`} title="Sửa bài viết">
            <Button icon={<EditOutlined />} size="small" />
          </Link>
          <Popconfirm title="Xác nhận xóa bài viết này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card title="Danh sách bài viết" extra={<Link to="/admin/posts/add"><button className="bg-pink-600 rounded-md hover:bg-pink-700 text-white px-4 py-2" icon={<PlusOutlined />}>Thêm bài viết</button></Link>}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm tiêu đề..."
          value={searchValue}
          onChange={handleSearchInput}
          onKeyDown={handleSearchKeyDown}
          style={{ width: 220 }}
          allowClear
        />
        <Select
          placeholder="Tất cả trạng thái"
          value={filter.status}
          onChange={value => handleFilterChange('status', value)}
          style={{ width: 180 }}
          allowClear
        >
          <Option value="">Tất cả trạng thái</Option>
          {Object.entries(POST_STATUS_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          onChange: handlePageChange,
          showTotal: (total) => `Tổng ${total} bài viết`
        }}
        bordered
        size="middle"
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default PostList; 