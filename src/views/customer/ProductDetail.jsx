import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useGetProductByIdQuery } from '../../services/products.service';
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
const [detail] =  useGetProductByIdQuery();
  const handleAddToCart = () => {
    // Implementation of adding to cart
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Thêm vào giỏ
      </button>
      <Link
        to={ROUTES.CHECKOUT}
        className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
      >
        Mua ngay
      </Link>
    </div>
  );
};

export default ProductDetail; 