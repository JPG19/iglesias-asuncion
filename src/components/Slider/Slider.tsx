import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ChurchIcon from "@mui/icons-material/Church";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { useEffect, useState } from "react";

const Slider = ({ content = [] }: any) => {
  const [sliderContent, setSliderContent] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSliderContent([]);
    // setIsLoading(true);

    setTimeout(() => {
      setSliderContent(content);
      // setIsLoading(false);
    }, 50);
  }, [content]);

  return (
    <>
      <Swiper
        // install Swiper modules
        modules={[Grid, Pagination, Navigation]}
        grid={{
          rows: 2,
          fill: "row",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          850: {
            slidesPerView: 2,
          },
        }}
        spaceBetween={30}
        className="churches-swiper"
      >
        {sliderContent?.map((church: any) => {
          const src = church.Images
            ? church.Images[0]
            : "/images/placeholder.png";
          return (
            <SwiperSlide className="rounded-tl-3xl" key={church.ChurchId}>
              <Link href={`/churches/${church.ChurchId}`}>
                <Image
                  src={src}
                  alt={church.Name}
                  width={500}
                  height={600}
                  priority={true}
                  style={{ height: "300px", width: "100%", aspectRatio: '16/9' }}
                />
                <div className="p-2 text-white rounded-b-lg bg-red-900 below">
                  <h3>
                    <ChurchIcon /> {church.Name}
                  </h3>
                  <p>
                    <AccessTimeFilledIcon /> {church.Schedule}
                  </p>

                  {"distance" in church ? (
                    <p>
                      <DirectionsRunIcon />
                      {`${church.distance}km`}
                    </p>
                  ) : null}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default Slider;
