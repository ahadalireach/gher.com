/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const ImageSwiper = ({ property }) => {
  SwiperCore.use([Navigation]);

  return (
    <Swiper
      navigation
      pagination={{ clickable: true }}
      className="swiper-container mb-10"
      style={{
        "--swiper-navigation-color": "#fff",
        "--swiper-pagination-bullet-active-color": "#fff",
        "--swiper-pagination-bullet-inactive-color": "#bbb",
        "--swiper-pagination-bullet-size": "10px",
        "--swiper-pagination-bullet-horizontal-gap": "6px",
      }}
    >
      {property?.imageUrls.map((url) => (
        <SwiperSlide key={url} className="relative">
          <div
            className="h-[720px] w-full"
            style={{
              backgroundImage: `url(${url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              objectFit: "cover",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSwiper;
