import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetPublishedPostsQuery } from '../../services/post.service';
import { ROUTES } from '../../constants';
import Pagination from '../../components/common/Pagination';
import { FaCalendarAlt, FaEye, FaUser, FaArrowRight } from 'react-icons/fa';

const PostsPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState('');
  
  const { data, isLoading, error } = useGetPublishedPostsQuery({
    page,
    limit: perPage,
    search: searchQuery || undefined,
    featured: featured || undefined
  });

  const posts = data?.data?.posts || [];
  const pagination = data?.data?.pagination || { page: 1, limit: perPage, total: 0, totalPages: 1 };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(searchInput);
      setPage(1);
    }
  };

  const handleFilterChange = (value) => {
    setFeatured(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-[64px] md:pt-[72px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Có lỗi xảy ra
            </h1>
            <p className="text-gray-600 mb-8">
              Không thể tải danh sách bài viết. Vui lòng thử lại sau.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-[64px] md:pt-[72px]">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-pink-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-800 mb-4">
            Bài viết & Tin tức
          </h1>
          <p className="text-lg md:text-xl text-pink-700 max-w-2xl mx-auto">
            Khám phá những bài viết hữu ích về sức khỏe, dinh dưỡng và các sản phẩm sữa chất lượng
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={featured}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Tất cả bài viết</option>
                  <option value="true">Bài viết nổi bật</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading && page === 1 ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Không có bài viết nào phù hợp với từ khóa tìm kiếm.' : 'Hiện tại chưa có bài viết nào.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setFeatured('');
                    setPage(1);
                  }}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Xem tất cả bài viết
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Post Image */}
                    <Link to={ROUTES.POST_DETAIL.replace(':slug', post.slug)}>
                      <div className="relative h-48 overflow-hidden">
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                        {post.featured && (
                          <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Nổi bật
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <FaEye className="mr-1" />
                        <span>{post.viewCount || 0} lượt xem</span>
                      </div>

                      <Link to={ROUTES.POST_DETAIL.replace(':slug', post.slug)}>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-pink-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {truncateText(post.excerpt, 120)}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUser className="mr-2" />
                          <span>{post.author?.name || 'Admin'}</span>
                        </div>
                        <Link
                          to={ROUTES.POST_DETAIL.replace(':id', post.id)}
                          className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors"
                        >
                          Đọc thêm
                          <FaArrowRight className="ml-2 text-sm" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                perPage={perPage}
                onPerPageChange={handlePerPageChange}
              />

              {/* Pagination Info */}
              {pagination.total > 0 && (
                <div className="text-center mt-8 text-gray-600">
                  <p>
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 
                    trong tổng số {pagination.total} bài viết
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostsPage; 