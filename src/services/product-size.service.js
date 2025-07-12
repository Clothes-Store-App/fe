import { api } from './api';

// Export the hooks for use in components
export const {
  useGetProductSizesQuery,
  useGetProductSizeQuery,
} = api;

// Helper functions for working with product sizes
export const productSizeService = {
  // Convert API response to a more usable format if needed
  formatSizeData: (sizes) => {
    return sizes?.map(size => ({
      id: size.id,
      name: size.size_name,
      createdAt: size.createdAt,
      updatedAt: size.updatedAt
    })) || [];
  },

  // Get size name by ID
  getSizeName: (sizes, sizeId) => {
    const size = sizes?.find(s => s.id === sizeId);
    return size ? size.size_name : '';
  }
};

export default productSizeService; 