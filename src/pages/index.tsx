import Head from "next/head";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { MyContext } from "../../src/pages/_app";
import Slider from "../components/Slider";
import Dropdown from "@/components/Dropdown";
import DraggableSlider from "@/components/DraggableSlider";
import Loading from "@/components/Loading";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

// Define the types for our churches and location
interface Church {
  Name: string;
  Location: string; // Format: "latitude, longitude"
}

export default function Home({ churches }: any) {
  const [filteredChurches, setFilteredChurches] = useState<any>(churches);
  const [activeInput, setActiveInput] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const searchInputRef = useRef(null);
  const filter = useRef<{ [key: string]: string | number | boolean | null }>(
    {}
  ); // Initialize as an empty object
  const { currentPosition, churchesWithLocation } = useContext(MyContext);

  // Handle search input changes
  const handleSearch = useCallback(
    (key: string, value: string | number | boolean | null) => {
      // Update filter state
      if (value !== undefined && value !== null && value !== "") {
        filter.current[key] = value;
      } else {
        delete filter.current[key];
      }

      const filterKeys = Object.keys(filter.current);
      // Filter churches based on search term
      if (churchesWithLocation) {
        const filtered = churchesWithLocation.filter((church: any) => {
          let checks = 0;
          filterKeys.forEach((k) => {
            const filterValue = filter.current[k];

            if (
              typeof filterValue === "string" &&
              church[k].toLowerCase().includes(filterValue)
            ) {
              checks = checks + 1;
            } else if (
              typeof filterValue === "number" &&
              filterValue >= church[k]
            ) {
              // It's distance
              checks = checks + 1;
            }
            if (typeof filterValue === "boolean" && church[k] === filterValue) {
              checks = checks + 1;
            }
          });

          return checks === filterKeys.length;
        });
        setFilteredChurches(filtered);
      }
      setInitialLoading(false);
    },
    [churchesWithLocation]
  );

  useEffect(() => {
    if (churchesWithLocation && currentPosition.error) {
      setInitialLoading(false);
    }
  }, [churchesWithLocation, currentPosition]);

  const churchesArray = (currentPosition?.error || Object.keys(currentPosition).length === 0) ? churches : filteredChurches

  return (
    <>
      <Head>
        <title>Localizador de Iglesias</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto p-5 w-full">
        <div
          className="title-container"
          style={{ maxWidth: "1200px", margin: "auto" }}
        >
          <h1
            style={{ fontSize: "2rem", fontWeight: "700" }}
            className="mb-8 text-center"
          >
            Iglesias de Asuncion
          </h1>

          <input
            placeholder="Busca una iglesia"
            onChange={(e) => {
              const inputValue = e.target.value.trim().toLowerCase();
              handleSearch("Name", inputValue);
            }}
            ref={searchInputRef}
          />

          {Object.keys(currentPosition).length > 0 && !currentPosition.error ? (
            <DraggableSlider handleSearch={handleSearch} />
          ) : null}

          <div className="dropdown-container flex justify-center gap-4 pt-4">
            <Dropdown
              text="Bautismo"
              type="boolean"
              name="Baptism"
              handleSearch={handleSearch}
            />

            <Dropdown
              text="Primera Comunion"
              type="boolean"
              name="FirstCommunion"
              handleSearch={handleSearch}
            />

            <Dropdown
              text="Confirmacion"
              type="boolean"
              name="Confirmation"
              handleSearch={handleSearch}
            />

            <Dropdown
              text="Matrimonio"
              type="boolean"
              name="Wedding"
              handleSearch={handleSearch}
            />
          </div>

          {activeInput ? (
            <button
              onClick={() => {
                setFilteredChurches(churches);
                setActiveInput(false);
                // @ts-ignore
                searchInputRef.current.value = "";
              }}
            >
              X
            </button>
          ) : null}
        </div>

        {initialLoading ? (
          <div className="pt-12">
            <Loading />
          </div>
        ) : null}

        {!initialLoading && churchesArray.length > 0 ? (
          <Slider content={churchesArray} />
        ) : null}
        {!initialLoading && churchesArray.length === 0 ? (
          <div
            style={{ maxWidth: "1200px", margin: "auto", marginTop: "2rem" }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              No hay Iglesias para mostrar
            </h2>
          </div>
        ) : null}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_CHURCHES_API_URL as string);
  const churches: any = await res.json();

  return {
    props: {
      churches: churches,
    },
  };
}
