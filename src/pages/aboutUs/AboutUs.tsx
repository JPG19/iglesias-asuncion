import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className='about-us'>
      <main className='max-w-7xl mx-auto p-5'>
        <div className='introduction'>
          <h3>
            El sistema localizador de iglesias en Paraguay tiene sus inicios en
            2023. El impacto del proyecto alcanza a nivel local dentro de la
            ciudad de Asuncion y esperamos expeandirnos a todo el Paraguay
          </h3>
          <p>
            Somos una congregacion que nacio en el corazón de Dios, y de los
            esfuerzos del equipo administrador quien comenzó este proyecto con
            la intencion de facilitar obra con estudios biblicos y discipulado,
            a personas de hable hispana.
          </p>
        </div>

        <div className='intro-video'>
          <video controls width='480' height='270'>
            Your browser does not support the video tag.
          </video>

          <p>
            Un mensaje corto para usted de parte de nuestro administrador Juan
            Pablo Garcia
          </p>
        </div>

        <div className='mission'>

          <div>
            <h3>Nuestra Mision</h3>
            <p>
              Conectar a todos los paraguayos con las hermosas iglesias
              esparcidas por la ciudad de Asuncion y proveer toda la informacion
              necesaria de las iglesias en un solo sitio.
            </p>
          </div>
        </div>
      </main>
    </section>
  );
};

export default AboutUs;
