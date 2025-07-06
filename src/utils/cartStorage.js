import { dispatchCartUpdate } from './events';

const CART_STORAGE_KEY = 'cart';

// Lấy giỏ hàng từ localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

// Lưu giỏ hàng vào localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (product, quantity = 1) => {
  try {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    // Convert price to number if it's a string
    const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    if (existingItem) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * numericPrice;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      cart.push({
        id: product.id,
        name: product.name,
        price: numericPrice, // Store as number
        image: product.image,
        quantity: quantity,
        total: quantity * numericPrice
      });
    }

    saveCart(cart);
    return cart;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return [];
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = (productId, quantity) => {
  try {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
      if (quantity > 0) {
        // Ensure price is a number
        const numericPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        // Cập nhật số lượng và tổng tiền
        item.quantity = quantity;
        item.total = quantity * numericPrice;
        saveCart(cart);
      } else {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        removeFromCart(productId);
        return getCart();
      }
    }

    return cart;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return [];
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (productId) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return [];
  }
};

// Tính tổng số lượng sản phẩm trong giỏ hàng
export const getCartItemCount = () => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
};

// Tính tổng tiền giỏ hàng
export const getCartTotal = () => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => {
      // Ensure price is a number
      const numericPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      // Calculate item total based on price and quantity
      const itemTotal = numericPrice * item.quantity;
      return total + itemTotal;
    }, 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}; 