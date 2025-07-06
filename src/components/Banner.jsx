import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useGetSlidersQuery } from '../services/slider.service';

const Banner = () => {
  const { data: sliderResponse, isLoading } = useGetSlidersQuery();
  
  // Sort sliders by order (1 to 3)
  const sortedSliders = React.useMemo(() => {
    if (!sliderResponse?.data) return [];
    return [...sliderResponse.data].sort((a, b) => a.order - b.order);
  }, [sliderResponse?.data]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear',
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden bg-gray-100">
        <div className="relative pb-[56.25%] md:pb-[45%] xl:pb-[40%]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      <Slider {...settings} className="banner-slider">
        {sortedSliders.map((slide) => (
          <div key={slide.id} className="relative w-full">
            <div className="relative pb-[56.25%] md:pb-[45%] xl:pb-[40%]">
              <img
                src={slide.image}
                alt={`Slider ${slide.order}`}
                className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                style={{
                  imageRendering: 'crisp-edges',
                  WebkitFontSmoothing: 'antialiased',
                  backfaceVisibility: 'hidden',
                  filter: 'contrast(1.1) brightness(1.05)',
                }}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="max-w-xl space-y-4 md:space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white opacity-0 animate-fadeInUp"
                      style={{
                        animation: 'fadeInUp 0.5s ease-out 0.2s forwards',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}>
                    {slide.title || 'Khám phá sản phẩm'}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 opacity-0 animate-fadeInUp max-w-lg"
                     style={{
                       animation: 'fadeInUp 0.5s ease-out 0.3s forwards',
                       textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                     }}>
                    {slide.description || 'Sản phẩm chất lượng cao dành cho bé yêu của bạn'}
                  </p>
                  <div className="opacity-0 animate-fadeInUp"
                       style={{animation: 'fadeInUp 0.5s ease-out 0.4s forwards'}}>
                    <Link 
                      to={ROUTES.PRODUCTS}
                      className="inline-flex items-center bg-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full
                               hover:bg-pink-700 transition-all duration-300 transform hover:scale-105
                               shadow-lg hover:shadow-xl text-base md:text-lg font-medium"
                    >
                      Khám phá ngay
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom styles for the slider */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .banner-slider {
          margin-bottom: 0;
        }
        
        .banner-slider .slick-slide > div {
          line-height: 0;
        }
        
        .banner-slider .slick-dots {
          bottom: 20px;
          z-index: 10;
        }
        
        .banner-slider .slick-dots li {
          margin: 0 4px;
        }
        
        .banner-slider .slick-dots li button:before {
          color: white;
          opacity: 0.7;
          font-size: 8px;
        }
        
        .banner-slider .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        
        .banner-slider .slick-prev,
        .banner-slider .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }
        
        .banner-slider .slick-prev {
          left: 25px;
        }
        
        .banner-slider .slick-next {
          right: 25px;
        }
        
        .banner-slider .slick-prev:before,
        .banner-slider .slick-next:before {
          font-size: 40px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        
        .banner-slider .slick-prev:hover:before,
        .banner-slider .slick-next:hover:before {
          opacity: 1;
        }
        
        .banner-slider .slick-slide {
          transition: all 0.4s ease-in-out;
        }
        
        @media (max-width: 768px) {
          .banner-slider .slick-dots {
            bottom: 15px;
          }
          
          .banner-slider .slick-dots li {
            margin: 0 3px;
          }
          
          .banner-slider .slick-dots li button:before {
            font-size: 6px;
          }
          
          .banner-slider .slick-prev,
          .banner-slider .slick-next {
            display: none !important;
          }
        }
        
        @media (max-width: 640px) {
          .banner-slider .slick-dots {
            bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner; 