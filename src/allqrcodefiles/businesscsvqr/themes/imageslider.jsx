import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BusinessSlider = ({ business_slider_images, business_display_theme }) => {
  return (
    <>
      {business_slider_images && business_slider_images.length > 0 && (
        <div className={`${business_display_theme}-gallery-container`}>
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]} // Include the modules here
            className={`${business_display_theme}-gallery`}
          >
            {business_slider_images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slider ${index + 1}`}
                  className={`${business_display_theme}-gallery-image`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default BusinessSlider;
