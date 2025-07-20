import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../services/api';
import { setCredentials } from '../../store/authSlice';
import { ROUTES } from '../../constants';
import LogoFdaily from '../../styles/Logo-Fdaily.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {      
      const response = await login({ email, password }).unwrap();
      
      // Hiển thị thông báo thành công
      setSuccess(true);
      
      // Dispatch credentials
      dispatch(setCredentials(response.data));
      
      // Đợi animation thông báo thành công chạy xong rồi mới chuyển trang
      setTimeout(() => {
        if (response.data.user.role === 'ROLE_ADMIN') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.HOME);
        }
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Notification Portal - Fixed position */}
      {(error || success) && (
        <div className="fixed top-4 right-4 z-50 min-w-[300px] max-w-[90vw] animate-slideInDown">
          {error && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Đăng nhập thất bại</h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-red-50 h-1">
                <div className="bg-red-500 h-1 animate-countdown" />
              </div>
            </div>
          )}
          {success && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 text-green-500 relative">
                    <svg className="animate-circle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Đăng nhập thành công</h3>
                  <p className="mt-1 text-sm text-gray-500">Đang chuyển hướng...</p>
                </div>
              </div>
              <div className="bg-green-50 h-1">
                <div className="bg-green-500 h-1 animate-countdown" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-[90%] xl:max-w-[70%] 2xl:max-w-[60%] aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex h-full">
          {/* Left side - Hero Section */}
          <div className="w-1/2 relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] bg-cover bg-center mix-blend-overlay opacity-20 animate-kenburns" />
              
              {/* Animated shapes */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Floating circles */}
                <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
                <div className="absolute bottom-[30%] right-[25%] w-24 h-24 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
                <div className="absolute top-[60%] left-[30%] w-20 h-20 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float animation-delay-4000" />
                
                {/* Moving light effects */}
                <div className={`absolute top-0 left-[-100%] w-[120%] h-[100px] bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform rotate-45 transition-transform duration-3000 ${animationStarted ? 'translate-x-full' : ''}`} style={{ animation: 'moveLight 8s linear infinite' }} />
                <div className={`absolute bottom-0 right-[-100%] w-[120%] h-[80px] bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -rotate-45 transition-transform duration-3000 ${animationStarted ? '-translate-x-full' : ''}`} style={{ animation: 'moveLight 8s linear infinite 4s' }} />
              </div>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-[8%]">
              <img
                src={LogoFdaily}
                alt="FFAIDAY"
                className="w-[30%] h-auto mb-[8%] animate-float drop-shadow-2xl transition-all duration-700 hover:scale-110 hover:rotate-3"
              />
              <h1 className="text-[min(4vw,2.25rem)] font-bold tracking-tight mb-[5%] text-center opacity-0 animate-slideUpFade">
                <span className="inline-block hover:scale-105 transition-transform duration-300">Thời</span>{' '}
                <span className="inline-block hover:scale-105 transition-transform duration-300">trang</span>{' '}
                <span className="inline-block hover:scale-105 transition-transform duration-300">cho</span>
                <br/>
                <span className="text-green-400 inline-block mt-2 hover:scale-105 transition-transform duration-300">cuộc sống mới</span>
              </h1>
              <p className="text-[min(2vw,1.125rem)] text-green-100 text-center opacity-0 animate-slideUpFade animation-delay-300">
                Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo
              </p>

              {/* Animated decorative lines */}
              <div className="absolute bottom-[8%] left-0 w-full px-[8%]">
                <div className="grid grid-cols-3 gap-4 opacity-0 animate-fadeIn animation-delay-500">
                  <div className="h-1 bg-gradient-to-r from-green-400 to-green-500 rounded transform origin-left animate-scaleX"></div>
                  <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 rounded transform origin-left animate-scaleX animation-delay-200"></div>
                  <div className="h-1 bg-gradient-to-r from-green-600 to-green-700 rounded transform origin-left animate-scaleX animation-delay-400"></div>
                </div>
              </div>

              {/* Animated particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `floatParticle ${5 + i}s linear infinite ${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-1/2 flex items-center justify-center bg-white animate-slideInRight">
            <div className="w-[80%] max-w-[400px]">
              <div className="text-center mb-[8%]">
                <h2 className="text-[min(3vw,1.875rem)] font-bold text-gray-900 animate-fadeIn">
                  Chào mừng trở lại
          </h2>
                <p className="mt-2 text-[min(1.8vw,1rem)] text-gray-600 animate-fadeIn animation-delay-200">
            Đăng nhập để tiếp tục mua sắm
          </p>
        </div>

              <form onSubmit={handleSubmit} className="space-y-[5%]">
                <div className="space-y-[4%]">
                  <div className="transform transition-all duration-200 hover:scale-[1.01]">
                    <label
                      htmlFor="email"
                      className="block text-[min(1.6vw,0.875rem)] font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-[min(2vh,0.75rem)] text-[min(1.8vw,1rem)] text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-200 hover:scale-[1.01]">
                    <label
                      htmlFor="password"
                      className="block text-[min(1.6vw,0.875rem)] font-medium text-gray-700 mb-2"
                    >
                  Mật khẩu
                </label>
                    <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-[min(2vh,0.75rem)] text-[min(1.8vw,1rem)] text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                </div>
              </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`relative w-full flex items-center justify-center px-6 py-[min(2vh,0.75rem)] text-[min(1.8vw,1rem)] font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 ${
                      isLoading 
                        ? 'bg-green-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <svg className="h-5 w-5 text-green-500 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        Đăng nhập
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes moveLight {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        @keyframes kenburns {
          0% { transform: scale(1) translate(0); }
          50% { transform: scale(1.1) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0); }
        }

        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.5; }
          100% { transform: translateY(-40px) scale(1); opacity: 0; }
        }

        @keyframes scaleX {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes circle {
          from { transform: rotate(-90deg) scale(0); }
          to { transform: rotate(0deg) scale(1); }
        }

        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite;
        }

        .animate-scaleX {
          animation: scaleX 1s ease-out forwards;
        }

        .animate-slideUpFade {
          animation: slideUpFade 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animate-countdown {
          animation: countdown 1.5s linear forwards;
        }

        .animate-circle {
          animation: circle 0.3s ease-out forwards;
        }

        .animate-slideInDown {
          animation: slideInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage; 