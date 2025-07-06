import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Select, Upload, Row, Col, Card, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import QuillEditor from '../../../components/common/QuillEditor';
import { POST_STATUS, POST_STATUS_LABELS } from '../../../constants';
import { useCreatePostMutation, useGenerateAIContentMutation } from '../../../services/post.service';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const { TextArea } = Input;

const defaultForm = {
  title: '',
  content: '',
  excerpt: '',
  status: POST_STATUS.DRAFT,
  metaTitle: '',
  metaDescription: '',
  featured: false,
  thumbnail: null,
  images: [],
  slug: '',
};

const PostFormCreate = () => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [aiInput, setAiInput] = useState({ topic: '', keywords: '', description: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const navigate = useNavigate();

  const [createPost] = useCreatePostMutation();
  const [generateAIContent] = useGenerateAIContentMutation();

  // Antd Upload handler
  const handleThumbnailChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const fileObj = info.fileList[info.fileList.length - 1].originFileObj;
      setForm(prev => ({ ...prev, thumbnail: fileObj }));
    } else {
      setForm(prev => ({ ...prev, thumbnail: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      if (name === 'title') {
        setForm(prev => {
          if (!slugEdited || !prev.slug) {
            return { ...prev, slug: slugify(value, { lower: true, strict: true }) };
          }
          return prev;
        });
      }
    }
  };

  const handleQuillChange = (value) => {
    setForm(prev => ({ ...prev, content: value }));
  };

  const handleSlugChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setSlugEdited(false);
      setForm(prev => ({ ...prev, slug: '' }));
    } else {
      setSlugEdited(true);
      setForm(prev => ({ ...prev, slug: slugify(val, { lower: true, strict: true }) }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          data.append('images', JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });
      await createPost(data).unwrap();
      message.success('Tạo bài viết thành công!');
      navigate('/admin/posts');
    } catch (err) {
      setErrors(err?.data?.errors || {});
      message.error('Tạo bài viết thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  // Đơn giản hóa modules, bỏ handler upload ảnh để test editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // Xử lý sinh nội dung AI
  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const res = await generateAIContent(aiInput).unwrap();
      let aiResult = res?.data?.aiResult || '';
      aiResult = aiResult.replace(/```json|```/g, '').trim();
      aiResult = aiResult.replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');
      let json;
      try {
        aiResult = aiResult.replace(/\\n/g, '');
        json = JSON.parse(aiResult);
      } catch (err) {
        try {
          aiResult = aiResult.replace(/\\n/g, '');
          json = JSON.parse(aiResult);
        } catch (err2) {
          message.error('Sinh nội dung AI thất bại!');
          return;
        }
      }
      const newFormData = {
        title: json.title || '',
        excerpt: json.excerpt || '',
        content: json.content || '',
        metaTitle: json.metaTitle || '',
        metaDescription: json.metaDescription || ''
      };
      setForm(prevForm => {
        const updated = { ...prevForm, ...newFormData };
        // Nếu user chưa sửa slug thủ công thì tự động sinh lại slug từ title mới
        if (!slugEdited && newFormData.title) {
          updated.slug = slugify(newFormData.title, { lower: true, strict: true });
        }
        return updated;
      });
      setAiInput({ topic: '', keywords: '', description: '' });
    } catch (err) {
      message.error('Sinh nội dung AI thất bại!');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Spin spinning={aiLoading || submitting} size="large" tip="Đang xử lý...">
      <Row justify="center" style={{ width: '100%', margin: 0 }}>
        <Col span={22} style={{ maxWidth: '90vw' }}>
          <Card title="Tạo bài viết mới" variant="borderless" style={{ margin: '32px 0', boxShadow: '0 2px 8px #f0f1f2' }}>
            {/* PHẦN NHẬP AI, KHÔNG NẰM TRONG FORM */}
            <Card type="inner" title="Tạo nội dung bài viết tự động bằng AI" style={{ marginBottom: 24, background: '#f0f7ff' }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Chủ đề bài viết" required>
                    <Input
                      name="topic"
                      placeholder="Chủ đề bài viết (bắt buộc)"
                      value={aiInput.topic}
                      onChange={e => setAiInput(prev => ({ ...prev, topic: e.target.value }))}
                      required
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Từ khóa (phân cách bởi dấu phẩy)">
                    <Input
                      name="keywords"
                      placeholder="Từ khóa"
                      value={aiInput.keywords}
                      onChange={e => setAiInput(prev => ({ ...prev, keywords: e.target.value }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Mô tả ngắn (tùy chọn)">
                    <Input
                      name="description"
                      placeholder="Mô tả ngắn"
                      value={aiInput.description}
                      onChange={e => setAiInput(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" loading={aiLoading} className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleGenerateAI} disabled={!aiInput.topic}>
                {aiLoading ? 'Đang sinh nội dung...' : 'Sinh nội dung AI'}
              </Button>
            </Card>
            {/* FORM CHÍNH */}
            <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
              <Form.Item label="Tiêu đề bài viết" required validateStatus={errors.title ? 'error' : ''} help={errors.title}>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  minLength={5}
                  maxLength={200}
                  placeholder="Nhập tiêu đề bài viết"
                  size="large"
                />
              </Form.Item>
              <Form.Item label="Slug (đường dẫn SEO)" required validateStatus={errors.slug ? 'error' : ''} help={errors.slug}>
                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="Slug sẽ tự sinh từ tiêu đề, bạn có thể sửa nếu muốn"
                  size="large"
                />
              </Form.Item>
              <Form.Item label="Tóm tắt" validateStatus={errors.excerpt ? 'error' : ''} help={errors.excerpt}>
                <TextArea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  placeholder="Tóm tắt ngắn về bài viết"
                />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Meta Title" validateStatus={errors.metaTitle ? 'error' : ''} help={errors.metaTitle}>
                    <Input
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      maxLength={60}
                      placeholder="Meta title cho SEO"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Meta Description" validateStatus={errors.metaDescription ? 'error' : ''} help={errors.metaDescription}>
                    <TextArea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      maxLength={160}
                      rows={2}
                      placeholder="Meta description cho SEO"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Nội dung" required validateStatus={errors.content ? 'error' : ''} help={errors.content}>
                <QuillEditor
                  value={form.content}
                  onChange={handleQuillChange}
                  modules={modules}
                  style={{ minHeight: 300 }}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Trạng thái">
                    <Select
                      name="status"
                      value={form.status}
                      onChange={value => setForm(prev => ({ ...prev, status: value }))}
                      options={Object.entries(POST_STATUS_LABELS).map(([key, label]) => ({ value: key, label }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Bài viết nổi bật">
                    <Checkbox
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                    >
                      Đánh dấu nổi bật
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Ảnh thumbnail">
                    <Upload
                      name="thumbnail"
                      listType="picture"
                      maxCount={1}
                      beforeUpload={() => false}
                      onChange={handleThumbnailChange}
                    >
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              {/* TODO: Thêm UI upload nhiều ảnh gallery nếu cần */}
              <Form.Item style={{ textAlign: 'right' }}>
                <Button type="button" className="bg-pink-600 text-white rounded-md hover:bg-pink-700 px-4 py-2 rounded" htmlType="submit" size="large" loading={submitting}>
                  {submitting ? 'Đang lưu...' : 'Lưu bài viết'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default PostFormCreate; 