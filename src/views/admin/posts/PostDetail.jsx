import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetPostByIdQuery } from "../../../services/post.service";
import { Card, Button, Tag, Row, Col, Typography, Space } from "antd";
import { POST_STATUS_LABELS } from "../../../constants";

const { Title, Text, Paragraph } = Typography;

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostByIdQuery(id);
  const post = data?.data || {};

  if (isLoading) return <div>Đang tải chi tiết bài viết...</div>;
  if (!post.id) return <div>Không tìm thấy bài viết</div>;

  return (
    <Row justify="center" style={{ width: "100%", margin: 0 }}>
      <Col span={22} style={{ maxWidth: "90vw" }}>
        <Card
          variant="borderless"
          style={{ margin: "32px 0", boxShadow: "0 2px 8px #f0f1f2" }}
          styles={{ body: { padding: 32 } }}
        >
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                {post.title}
              </Title>
            </Col>
            <Col>
              <Space className="mt-2">
                <Button onClick={() => navigate(-1)}>Quay lại</Button>
                <Link to={`/admin/posts/edit/${post.id}`}>
                  <Button
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2"
                  >
                    Sửa
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Tag
                color={
                  post.status === "PUBLISHED"
                    ? "green"
                    : post.status === "DRAFT"
                    ? "orange"
                    : "default"
                }
              >
                {POST_STATUS_LABELS[post.status] || post.status}
              </Tag>
            </Col>
            <Col>
              {post.featured ? (
                <Tag color="gold">Nổi bật</Tag>
              ) : (
                <Tag>Mặc định</Tag>
              )}
            </Col>
            <Col>
              <Text type="secondary">
                Ngày tạo: {new Date(post.createdAt).toLocaleString()}
              </Text>
            </Col>
          </Row>
          {post.thumbnail && (
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img
                src={post.thumbnail}
                alt="Thumbnail"
                style={{
                  maxHeight: 240,
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #eee",
                }}
              />
            </div>
          )}
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            <b>Tóm tắt:</b> {post.excerpt}
          </Paragraph>
          <div
            className="prose max-w-none mb-4"
            style={{
              background: "#fafbfc",
              borderRadius: 8,
              padding: 24,
              marginBottom: 24,
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col xs={24} md={12}>
              <Text type="secondary">
                <b>Meta Title:</b> {post.metaTitle}
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">
                <b>Meta Description:</b> {post.metaDescription}
              </Text>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default PostDetail;
