import React, { useMemo } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, perPage, onPerPageChange }) => {
  const pageSizeOptions = [10, 20, 50, 100];

  const pageNumbers = useMemo(() => {
    const delta = 1; // Số lượng trang hiển thị bên cạnh trang hiện tại
    const pages = [];
    
    // Luôn hiển thị trang đầu
    pages.push(1);
    
    // Tính toán range của các trang cần hiển thị
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Thêm dấu ... sau trang 1 nếu cần
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Thêm các trang ở giữa
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Thêm dấu ... trước trang cuối nếu cần
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Thêm trang cuối nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Hiển thị</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-pink-500 focus:border-pink-500"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700">dòng mỗi trang</span>
      </div>

      <nav className="flex justify-center" aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`block px-3 py-2 ml-0 leading-tight rounded-l-lg border ${
                currentPage === 1
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 border-gray-300'
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          {pageNumbers.map((number, index) => (
            <li key={index}>
              {number === '...' ? (
                <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(number)}
                  className={`px-3 py-2 leading-tight border ${
                    currentPage === number
                      ? 'text-white bg-pink-500 border-pink-500 hover:bg-pink-600'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 border-gray-300'
                  }`}
                >
                  {number}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`block px-3 py-2 leading-tight rounded-r-lg border ${
                currentPage === totalPages
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 border-gray-300'
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};


export default Pagination; 