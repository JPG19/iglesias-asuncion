import { useState, useContext } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

import { MyContext } from '../../../src/pages/_app';

const Add = () => {
  const { user, currentPosition } = useContext(MyContext);
  const [churchSent, setChurchSent] = useState<boolean>(false);
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mapPosition, setMapPosition] = useState<any>({
    lat: currentPosition.lat || 0,
    lng: currentPosition.lng || 0,
  });
  // If the user doesn't have a photo, he is the administrator
  const providerPassword =
    user?.providerData?.length > 0 &&
    user?.providerData[0]?.providerId === 'password';

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    height: '400px',
    margin: '25px auto',
  };

  const addChurch = async (e: any) => {
    setLoading(true)
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('Reviews', "" as any);
    formData.append('SocialLinks', "" as any);
    formData.append('Location', `${mapPosition.lat}, ${mapPosition.lng}`);

    // Check if the checkbox is unchecked and, if so, add it to the formData with a value of false
    if (!formData.has('Baptism')) {
      formData.append('Baptism', false as any);
    }
    else {
      formData.append('Baptism', true as any);
    }

    if (!formData.has('Confirmation')) {
      formData.append('Confirmation', false as any);
    }
    else {
      formData.append('Baptism', true as any);
    }


    if (!formData.has('FirstCommunion')) {
      formData.append('FirstCommunion', false as any);
    }
    else {
      formData.append('FirstCommunion', true as any);
    }

    if (!formData.has('Wedding')) {
      formData.append('Wedding', false as any);
    }
    else {
      formData.append('Wedding', true as any);
    }

    const imageInputContainer = document.getElementById('images-container');
    const inputElements = imageInputContainer
      ? imageInputContainer.querySelectorAll('input')
      : [];

    const imagesArray: any = [];

    inputElements?.forEach((input) => {
      imagesArray.push(input.value);
    });
    formData.append('Images', imagesArray);

    const jsonObject: any = {};

    formData?.forEach((value, key) => {
      jsonObject[key] = value;
    });

    // You now have the form data as a JSON object

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonObject), // Convert data to a JSON string
    };

    const churchesUrl = process.env.NEXT_PUBLIC_CHURCHES_API_URL
    const prodUrl = `${churchesUrl}/${jsonObject?.ChurchId}`;
    
    try {
      const response = await fetch(prodUrl, options);
      const data = await response.json();
      

      if (data.message === "ChurchId already exists") {
        setErrorMessage("Una iglesia con ese mismo ID ya existe")
      }

      if (data.success === true) {
        setChurchSent(true)
        setErrorMessage("")

        setTimeout(() => {
          setChurchSent(false)
        }, 2000)
      }
    } catch (e) {
      console.error('POST request failed:', e);
    } finally {
      setLoading(false)
    }
  };

  const addImageInput = () => {
    const clonedImageInputs: any = [...images];
    const inputIndex = clonedImageInputs.length;
    const newButton = (
      <input
        key={`image-${inputIndex}`}
        id={`image-${inputIndex}`}
        type='text'
      />
    );
    clonedImageInputs.push(newButton);
    setImages(clonedImageInputs);
  };

  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const handleMapClick = (e: any) => {
    // Update the marker's position to the clicked location
    setMapPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  if (!providerPassword) {
    return null;
  }

  return (
    <section className='add-section'>
      <form onSubmit={addChurch} className='max-w-7xl mx-auto p-5'>
        <h2 style={{ color: 'white', fontWeight: '800' }}>
          Agrega una Iglesia
        </h2>

        <label>Id </label>
        <input type='text' name='ChurchId' required />

        <label>Nombre </label>
        <input type='text' name='Name' required />

        <label>Telefono</label>
        <input type='phone' name='Phone' required />

        <label>Email</label>
        <input type='email' name='Email' required />

        <label>Horarios</label>
        <input type='text' name='Schedule' required />

        <div className='flex-container'>
          <div className='checkbox-container'>
            <label>Bautismo</label>
            <input type='checkbox' name='Baptism' />
          </div>

          <div className='checkbox-container'>
            <label>Casamiento</label>
            <input type='checkbox' name='Wedding' />
          </div>

          <div className='checkbox-container'>
            <label>Primera Comunión</label>
            <input type='checkbox' name='FirstCommunion' />
          </div>

          <div className='checkbox-container'>
            <label>Confirmación</label>
            <input type='checkbox' name='Confirmation' />
          </div>
        </div>

        <label>Imagenes:</label>
        <button type='button' onClick={() => addImageInput()}>
          Agregar Imagen
        </button>
        <div className='Image' id='images-container'>
          {images}
        </div>

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
        )}

        <button
          style={{ cursor: 'pointer', width: '100%' }}
          type='submit'
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
        {errorMessage ? <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p> : null}
        {churchSent ? <p style={{ color: 'lightgreen', textAlign: 'center' }}>Iglesia Agregada</p> : null}
      </form>
    </section>
  );
};

Add.displayName = 'pages/Add';

export default Add;
