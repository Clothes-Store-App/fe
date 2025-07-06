import { useState } from 'react';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Giả lập gửi form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại với bạn sớm.');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-pink-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-pink-50" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Liên hệ với chúng tôi</h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc góp ý nào.
          </p>
        </div>
      </div>

      {/* Contact section */}
      <div className="relative bg-white">
        <div className="absolute w-full h-1/2 bg-pink-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto lg:max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact information */}
              <div className="lg:col-span-1">
                <div className="px-6 py-8 bg-pink-600 rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium text-white">Thông tin liên hệ</h3>
                  <dl className="mt-8 space-y-6">
                    <dt><span className="sr-only">Hệ thống cửa hàng</span></dt>
                    <dd className="flex text-base text-pink-50">
                      <svg className="flex-shrink-0 w-6 h-6 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="ml-3">
                        <strong>CN1:</strong> 84 Âu Cơ, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng<br />
                        <strong>CN3:</strong> 368 Tôn Đản, Hoà An, Cẩm Lệ, Đà Nẵng<br />
                        <strong>CN4:</strong> DT 602 Hoà Sơn, An Ngãi Đông, Hoà Vang, Đà Nẵng (Sát bên Nhà Thuốc Long Châu)<br />
                        <strong>CN5:</strong> 865 Nguyễn Lương Bằng
                      </span>
                    </dd>
                    <dt><span className="sr-only">Hotline & CSKH</span></dt>
                    <dd className="flex text-base text-pink-50">
                      <svg className="flex-shrink-0 w-6 h-6 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="ml-3">
                        <strong>Hotline:</strong> 0906532932<br />
                        <strong>CSKH:</strong> 0902741222 (Zalo)<br />
                        <strong>CSKH:</strong> 0798932932 (Zalo)
                      </span>
                    </dd>
                    <dt><span className="sr-only">Email</span></dt>
                    <dd className="flex text-base text-pink-50">
                      <svg className="flex-shrink-0 w-6 h-6 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="ml-3">info@milkstore.com</span>
                    </dd>
                  </dl>
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-white">Giờ làm việc</h4>
                    <div className="mt-4 text-pink-50">
                      <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                      <p>Thứ 7 - Chủ nhật: 8:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-white">Theo dõi chúng tôi</h4>
                    <div className="mt-4 flex space-x-4">
                      <a href="#" className="text-pink-200 hover:text-white">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-pink-200 hover:text-white">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-lg rounded-lg">
                  <div className="px-6 py-8">
                    <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">Gửi tin nhắn cho chúng tôi</h3>
                    <p className="mt-3 text-lg text-gray-500">
                      Điền thông tin của bạn vào form dưới đây, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Họ và tên
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Nội dung tin nhắn
                        </label>
                        <div className="mt-1">
                          <textarea
                            name="message"
                            id="message"
                            rows={4}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="block w-full shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Vị trí cửa hàng</h2>
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8374988491937!2d108.15699631478386!3d16.073861988876706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218e6e72e66f5%3A0x46619a0e2d55370a!2zODQgw4J1IEPGoSwgSG_DoCBLaMOhbmggQuG6r2MsIExpw6puIENoaeG7g3UsIMSQw6AgTuG6tW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1647856421012!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí cửa hàng"
              className="absolute inset-0"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Chi nhánh 1',
                address: '84 Âu Cơ, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng',
                link: 'https://goo.gl/maps/example1'
              },
              {
                name: 'Chi nhánh 3',
                address: '368 Tôn Đản, Hoà An, Cẩm Lệ, Đà Nẵng',
                link: 'https://goo.gl/maps/example3'
              },
              {
                name: 'Chi nhánh 4',
                address: 'DT 602 Hoà Sơn, An Ngãi Đông, Hoà Vang, Đà Nẵng',
                link: 'https://goo.gl/maps/example4'
              },
              {
                name: 'Chi nhánh 5',
                address: '865 Nguyễn Lương Bằng',
                link: 'https://goo.gl/maps/example5'
              }
            ].map((branch, index) => (
              <div key={index} className="bg-pink-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-pink-600 mb-2">{branch.name}</h3>
                <p className="text-gray-600 mb-4">{branch.address}</p>
                <a
                  href={branch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-pink-600 hover:text-pink-700"
                >
                  <span>Xem trên bản đồ</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 