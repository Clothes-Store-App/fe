// Custom event dispatcher for cart updates
export const dispatchCartUpdate = () => {
  // Dispatch event for same tab
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  
  // Dispatch storage event for cross-tab communication
  const event = new StorageEvent('storage', {
    key: 'cart',
    newValue: localStorage.getItem('cart'),
    storageArea: localStorage
  });
  window.dispatchEvent(event);
}; 