import React, { useContext, useState, useEffect } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import ToggleSwitch from "../ToggleSwitch";

// import useGeolocation from '@/hooks/useGeolocation';
import Modal from "../Modal";
import { MyContext } from "../../../src/pages/_app";

function error(err: any) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const Header = () => {
  const router = useRouter();
  const { pathname } = router;
  // const { user, setUser } = useContext(MyContext);
  const { currentPosition, setCurrentPosition, getCurrentPosition } =
    useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  // const { location, loading, error } = useGeolocation(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) as any

  // const logout = () => {
  //   localStorage.clear();
  //   window.location.reload();
  //   setUser({});
  // };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storageUser: any = JSON.parse(
  //       localStorage.getItem("user") as string
  //     );

  //     if (storageUser) {
  //       setUser(storageUser);
  //     }
  //   }
  // }, [setUser]);

  // If the user doesn't have a photo, he is the administrator
  // const providerPassword =
  //   user?.providerData?.length > 0 &&
  //   user?.providerData[0]?.providerId === "password";
  // console.log('window.location: ', window.location.pathname)

  const hasCurrentPosition = Object.keys(currentPosition).length === 2;

  return (
    <header className="p-4 text-white">
      <nav className="flex items-center gap-4">
        <Link className={`${pathname === "/" ? "active" : ""}`} href="/">
          Inicio
        </Link>

        {pathname === "/" ? (
          <ToggleSwitch
            checked={hasCurrentPosition}
            label="Ubicacion"
            className="max-w-[200px] cursor-not-allowed"
            onChange={(e) => {
              if (e) {
                getCurrentPosition();
              } else {
                setCurrentPosition({});
              }
            }}
            id="toggleposition"
            textClassName={hasCurrentPosition ? "text-white" : "text-black"}
          />
        ) : null}
        {/* <Link href='/contact'>Contact</Link> */}
        {/* <Link
          className={`${pathname === '/aboutUs' ? 'active' : ''}`}
          href='/aboutUs'
        >
          Nosotros
        </Link> */}
        {/* <Link
          className={`${pathname === '/contact' ? 'active' : ''}`}
          href='/contact'
        >
          Contacto
        </Link> */}

        {/* {providerPassword ? (
          <Link
            className={`${pathname === "/add" ? "active" : ""}`}
            href="/add"
          >
            Agregar Iglesia
          </Link>
        ) : null} */}

        {/* {user.uid ? (
          <button style={{ marginLeft: 'auto' }} onClick={logout}>
            Cerrar Sesion
          </button>
        ) : (
          <button
            style={{ marginLeft: 'auto' }}
            onClick={() => setShowModal(true)}
          >
            Iniciar Sesion
          </button>
        )} */}

        {/* {user.uid ? (
          <>
            {!providerPassword ? (
              <Image
                src={user?.providerData[0]?.photoURL}
                width={45}
                height={45}
                alt='User thumbnail'
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <Person2Icon />
            )}
          </>
        ) : null} */}
      </nav>
      {showModal ? <Modal setShowModal={setShowModal} /> : null}
    </header>
  );
};

export default Header;
