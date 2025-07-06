import { useParams, Link } from 'react-router-dom';
import { useGetPostBySlugQuery } from '../../services/post.service';
import { ROUTES } from '../../constants';
import { FaCalendarAlt, FaEye, FaUser, FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useEffect } from 'react';

const PostDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetPostBySlugQuery(slug);

  const post = data?.data;

  useEffect(() => {
    if (post) {
      // Scroll to top when post loads
      window.scrollTo(0, 0);
    }
  }, [post]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-[64px] md:pt-[72px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-[64px] md:pt-[72px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-gray-600 mb-8">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link
              to={ROUTES.POSTS}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-[64px] md:pt-[72px]">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            to={ROUTES.POSTS}
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại danh sách bài viết
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-8 md:py-8">
        <div className="mx-auto px-2 md:px-8 lg:px-16 xl:px-32" style={{maxWidth: '100vw'}}>
          <div className="w-full max-w-[90vw] mx-auto">
            {/* Article Header */}
            <header className="mb-12 text-center">
              {/* Featured Badge */}
              {post.featured && (
                <div className="inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  Bài viết nổi bật
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center text-gray-500 text-sm mb-8 gap-4">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{post.author?.name || 'Admin'}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FaEye className="mr-2" />
                  <span>{post.viewCount || 0} lượt xem</span>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg mb-8 max-w-3xl mx-auto">
                  <p className="text-lg text-gray-700 italic">
                    {post.excerpt}
                  </p>
                </div>
              )}
            </header>

            {/* Featured Image */}
            {post.thumbnail && (
              <div className="mb-12 flex justify-center">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full max-w-4xl h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="w-[85vw] mx-auto mb-12">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Article Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Hình ảnh bài viết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {post.images.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.altText || `Hình ảnh ${index + 1}`}
                        className="w-full h-auto"
                      />
                      {image.caption && (
                        <div className="p-4">
                          <p className="text-sm text-gray-600 text-center">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-8 mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
                  Chia sẻ bài viết này
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Chia sẻ trên Facebook"
                  >
                    <FaFacebook />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                    title="Chia sẻ trên Twitter"
                  >
                    <FaTwitter />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    title="Chia sẻ trên LinkedIn"
                  >
                    <FaLinkedin />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                    title="Sao chép link"
                  >
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>

            {/* Related Posts Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">
                  Bài viết liên quan
                </h3>
                <Link
                  to={ROUTES.POSTS}
                  className="inline-flex items-center bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Xem tất cả bài viết
                  <FaArrowLeft className="ml-2 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetailPage; 