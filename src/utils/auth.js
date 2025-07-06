import { ROUTES } from '../constants';

/**
 * Xử lý logout khỏi ứng dụng
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} logoutMutation - RTK Query logout mutation
 * @param {Function} logoutAction - Redux logout action
 * @param {Function} navigate - React Router navigate function
 */
export const handleLogout = async (dispatch, logoutMutation, logoutAction, navigate) => {
  try {
    // Gọi API logout
    await logoutMutation();
    
    // Xóa dữ liệu persist trong localStorage
    localStorage.removeItem('persist:root');
    
    // Clear redux state
    dispatch(logoutAction());
    
    // Chuyển hướng về trang login
    navigate(ROUTES.LOGIN);
  } catch (error) {
    console.error('Logout error:', error);
    // Vẫn thực hiện cleanup ngay cả khi API fail
    localStorage.removeItem('persist:root');
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  }
}; 