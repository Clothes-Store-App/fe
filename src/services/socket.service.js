import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) return;

    // Sử dụng URL từ environment variable
    const socketUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

    this.socket = io(socketUrl, {
      withCredentials: true, // Cho phép gửi cookies
      transports: ['websocket'],
      autoConnect: false // Không tự động kết nối khi khởi tạo
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      // Authenticate as admin - cookies sẽ tự động được gửi
      this.socket.emit('admin_connect');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('auth_error', (error) => {
      console.error('Socket authentication error:', error);
      this.disconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    // Bắt đầu kết nối
    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  onNotification(callback) {
    if (!this.socket) return;
    this.socket.on('notification', callback);
  }

  offNotification(callback) {
    if (!this.socket) return;
    this.socket.off('notification', callback);
  }
}

// Export singleton instance
export default new SocketService(); 