import { useState, useContext } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

import { MyContext } from '../../../src/pages/_app';

const Contact = () => {
  // const { currentPosition } = useContext(MyContext);
  const [result, setResult] = useState<boolean>(false);
  // const [mapPosition, setMapPosition] = useState<any>({
  //   lat: currentPosition.lat || 0,
  //   lng: currentPosition.lng || 0
  // });
  
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  // });

  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAIL_JS_ADD_TEMPLATE || '',
        e.target,
        process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY
      )
      .then(
        (result: any) => {
          console.log(result.text);
        },
        (error: any) => {
          console.log(error.text);
        }
      );
    e.target.reset();
    setResult(true);
    setTimeout(() => {
      setResult(false);
    }, 4000);
  };

  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    height: '400px',
    marginBottom: '25px',
  };

  return (
    <div className='grid justify-center items-center contact' style={{ height: '800px' }}>
      <motion.form
        initial='hidden'
        animate='visible'
        variants={variants}
        transition={{
          duration: 1,
        }}
        onSubmit={sendEmail}
        className='grid gap-4 max-w-lg p-5'
      >
        <h2 style={{ color: 'white', fontWeight: '800' }}>
          No encontras la iglesia que buscas?
        </h2>
        <p className='text-white'>
          Envianos un mensaje con el nombre y la ubicacion de la iglesia para que la agreguemos
        </p>

        <label>Nombre</label>
        <input type='text' name='name' required />

        <label>Correo</label>
        <input type='email' name='email' required />

        <label>Su mensaje</label>
        <textarea style={{ padding: '6px' }} name='message' required />

        

        {/* <label>Nombre de la Iglesia</label>
        <input type='text' name='churchName' required />

        <label>Direccion de la iglesia</label>
        <input hidden name="churchLocation" value={`${mapPosition.lat}, ${mapPosition.lng}`} />
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapPosition}
            zoom={10}
            onClick={handleMapClick}
          >
            <MarkerF position={mapPosition} />
            <></>
          </GoogleMap>
        ) : (
          <></>
        )} */}

        <button
          style={{ cursor: 'pointer' }}
          type='submit'
          disabled={result ? true : false}
        >
          Enviar
        </button>
        {result ? <p className='text-white'>Solicitud enviada</p> : null}
      </motion.form>
    </div>
  );
};

Contact.displayName = 'pages/Contact';

export default Contact;
