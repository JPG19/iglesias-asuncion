import { useState, useMemo, useContext, useEffect } from "react";
import Image from "next/image";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { useMediaQuery } from "react-responsive";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
// import useGeolocation from '@/hooks/useGeolocation';
import Loading from "@/components/Loading";
import ToggleSwitch from "../../components/ToggleSwitch";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { MyContext } from "../../../src/pages/_app";
import { ChurchType } from "../../components/types";

export const getStaticPaths = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_CHURCHES_API_URL as string);
  const churches: any = await res.json();

  const paths = churches?.map((church: any) => ({
    params: { id: church.ChurchId, data: churches },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: any) => {
  const id = context.params.id;
  const churchesUrl = process.env.NEXT_PUBLIC_CHURCHES_API_URL;
  const res = await fetch(`${churchesUrl}/${id}`);
  const church = await res.json();

  return {
    props: {
      church,
    },
  };
};

const Church = ({ church }: { church: ChurchType }) => {
  // const [reviews, setReviews] = useState(church.Reviews || []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  // const { location, loading, error } = useGeolocation(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) as any
  const { currentPosition } = useContext(MyContext);
  const containerStyle = {
    width: "100%",
    maxWidth: "1400px",
    height: "400px",
    margin: "25px auto",
  };

  // useEffect(() => {
  //   if (church.Reviews) {
  //     setReviews(church.Reviews)
  //   }
  // }, [church])

  const biggerThanLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

  const slidesPerView = useMemo(() => {
    if (biggerThanLaptop) return 3;
    return 1;
  }, [biggerThanLaptop]);

  const position = useMemo(() => {
    const [latString, lngString] = church.Location?.split(",");
    return {
      lat: parseFloat(latString),
      lng: parseFloat(lngString),
    };
  }, [church]);

  // const { user } = useContext(MyContext);

  // function that updates dynamo table
  // async function sendReview() {
  //   // @ts-ignore
  //   const comment = document.getElementById('review')?.value;
  //   const existingReviews = church?.Reviews || [];

  //   const reviews = [
  //     ...existingReviews,
  //     {
  //       name: user.displayName ?? "Admin",
  //       comment,
  //     },
  //   ];

  //   try {
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         reviews,
  //       }),
  //     })

  //     const data = await response.json()
  //     setReviews(reviews)
  //   } catch(e) {
  //     console.error(e)
  //   }
  // }

  // const hasAlreadyCommented = useMemo(() => {
  //   if (!user) return false;
  //   return reviews?.some((review) => review.name === user.displayName);
  // }, [reviews, user]);

  // const isLoggedIn = Object.keys(user || {})?.length > 0;

  if (!isLoaded) {
    return <Loading />;
  }

  const blueDotStyle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#4285F4", // Blue color
    fillOpacity: 1,
    scale: 8, // Size of the dot
    strokeColor: "white",
    strokeWeight: 2, // Border size
  };

  return (
    <>
      <main className="p-5 max-w-7xl mx-auto">
        <Swiper
          // install Swiper modules
          className="church-swiper"
          slidesPerView={slidesPerView}
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ clickable: true }}
        >
          {church?.Images?.map((src: string, index) => {
            if (src) {
              return (
                <SwiperSlide key={index}>
                  <Image
                    src={src}
                    alt={church.Name}
                    width={400}
                    height={400}
                    priority={true}
                  />
                </SwiperSlide>
              );
            }
          })}
        </Swiper>

        <div className="pt-5 text-center">
          <h2 className="text-2xl text-white font-bold">{church.Name}</h2>

          <div className="grid-container">
            <div className="grid-item">
              <h3>Horario</h3>
              <p>{church.Schedule}</p>
            </div>

            <div className="grid-item">
              <h3>Sacerdotes</h3>
              <p>{church.Priests.join(", ")}</p>
            </div>

            <div className="grid-item">
              <h3>Capacidad</h3>
              <p>{church.Capacity} Asientos</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToggleSwitch
            checked={church.Baptism}
            label="Bautismo"
            disabled={true}
            className="pt-4 flex-1 min-w-[300px]"
            textClassName={church.Baptism ? "text-white" : ""}
          />

          <ToggleSwitch
            checked={church.FirstCommunion}
            label="Primera Comunión"
            disabled={true}
            className="pt-4 flex-1 min-w-[300px]"
            textClassName={church.FirstCommunion ? "text-white" : ""}
          />

          <ToggleSwitch
            checked={church.Confirmation}
            label="Confirmación"
            disabled={true}
            className="pt-4 flex-1 min-w-[300px]"
            textClassName={church.Confirmation ? "text-white" : ""}
          />

          <ToggleSwitch
            checked={church.Wedding}
            label="Boda"
            disabled={true}
            className="pt-4 flex-1 min-w-[300px]"
            textClassName={church.Wedding ? "text-white" : ""}
          />
        </div>

        <div className="pt-5 contact">
          <h3 style={{ fontWeight: "700" }}>Haz una reserva</h3>

          <div className="flex-container">
            <a href={`tel:${church.Phone}`}>
              Telefono <LocalPhoneIcon />
            </a>

            <a
              href={`mailto:${church.Email}?subject=Reserva&body=Hola! Quisiera hacer una reserva`}
            >
              Email <EmailIcon />
            </a>
          </div>
        </div>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
          >
            <MarkerF position={position} />
            {/* Blue marker for the user's position */}
            {currentPosition && Object.keys(currentPosition).length > 0 ? (
              <MarkerF position={currentPosition} icon={blueDotStyle} />
            ) : null}
          </GoogleMap>
        ) : (
          <></>
        )}

        {/* Review section */}

        {/* <div className='reviews'>
          <h3>Reseñas</h3>

          {reviews.length === 0 ? (
            <p>No hay reseñas</p>
          ) : (
            reviews?.map((review, index) => (
              <div key={index} className='review bg-red-900'>
                <h4>{review.name}</h4>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>

        {hasAlreadyCommented ? null : isLoggedIn ? (
          <div className='comment-section'>
            <label>Dejar una reseña:</label>

            <textarea id='review' />

            <button onClick={() => sendReview()}>Enviar</button>
          </div>
        ) : null} */}
      </main>
    </>
  );
};

export default Church;
