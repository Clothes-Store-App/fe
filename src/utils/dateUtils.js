/**
 * Format ngày tháng theo định dạng dd/MM/yyyy HH:mm
 * @param {string} dateString - Chuỗi ngày tháng cần format
 * @returns {string} Chuỗi ngày tháng đã được format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Kiểm tra nếu ngày không hợp lệ
  if (isNaN(date.getTime())) {
    return '';
  }

  // Lấy các thành phần ngày tháng
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Trả về định dạng: dd/MM/yyyy HH:mm
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}; 