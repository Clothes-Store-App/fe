import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BottomNavigation from '../../components/BottomNavigation';
import ChatBot from '../../components/ChatBot';
import { Toaster } from 'react-hot-toast';
import '../../styles/mobile.css';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen safe-area-padding">
      <Toaster 
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          duration: 3000,
        }}
      />
      <Header />
      <main className="flex-grow  ">
        <div className="pull-to-refresh-space lg:hidden" />
        <Outlet />
      </main>
      <Footer className="hidden lg:block" />
      <BottomNavigation />
      <ChatBot />
    </div>
  );
};

export default CustomerLayout; 