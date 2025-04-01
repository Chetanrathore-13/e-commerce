import React from 'react'
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Banner1 from "../assets/Media/80.jpg"
import Banner2 from "../assets/Media/Banner2.jpg"
import Banner3 from "../assets/Media/Banner3.jpg"

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Hero2 from '../Component/Hero2';
import Banner from '../Component/Banner';
import Lehenga from '../Component/Lehenga';
import MenCollections from '../Component/MenCollections';
import BannerTwo from '../Component/BannerTwo';
import CategoryShow from '../Component/CategoryShow';
import LehengaCollection from '../Component/LehengaCollection';
import Trending from '../Component/Trending';
import ClientDiaries from '../Component/ClientDiaries';




function Home() {
  return (
    <>
      
    <div >
    <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className=" h-127 w-full object-cover"
      >
        <SwiperSlide >
          <img src={Banner1} alt="Slide 1" className="w-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner2} alt="Slide 2" className="w-full" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner3} alt="Slide 3" className="w-full" />
        </SwiperSlide>
      </Swiper>
    </div>
    <Hero2 />
    <LehengaCollection />
    <Banner />
    <Lehenga />
    <MenCollections />
   <Trending />
    <BannerTwo />
    <CategoryShow />
    <ClientDiaries />
    </>
    
  )
}

export default Home