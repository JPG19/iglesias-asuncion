import React, { useContext, useEffect, useRef } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import emailjs from '@emailjs/browser';

import { auth, provider } from '../../firebaseConfig';
import { MyContext } from '../../../src/pages/_app';

const Modal = ({ setShowModal }: any) => {
  const { user, setUser, setCurrentPosition } = useContext(MyContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const login = () => {
    signInWithPopup(auth, provider)
      .then((data: any) => {
        const { user } = data;

        // If it's the first login then send a welcome email
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          const templateParams = {
            to: user.email,
            name: user.displayName,
          };

          emailjs
            .send(
              process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID || '',
              process.env.NEXT_PUBLIC_EMAIL_JS_WELCOME_TEMPLATE || '',
              templateParams,
              process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY
            )
            .then(
              (result: any) => {
                console.log('email sent: ', result.text);
              },
              (error: any) => {
                console.log(error.text);
              }
            );
        }

        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowModal(false);
      })
      .catch((e) => {
        console.log('error:', e);
      });
  };

  const loginCredentials = async () => {
    // @ts-ignore
    const emailValue = emailRef?.current?.value as any;
    // @ts-ignore
    const passwordValue = passwordRef.current?.value;

    try {
      const data = await signInWithEmailAndPassword(auth, emailValue, passwordValue); 

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setShowModal(false);
      // Redirect or perform other actions upon successful login
    } catch (error) {
      console.error('Login Credentials error:', error);
    }
  };

  const registerUser = async () => {
    // @ts-ignore
    const emailValue = emailRef?.current?.value as any;
    // @ts-ignore
    const passwordValue = passwordRef.current?.value;

    try {
      const signIn = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );

      if (signIn.user.uid) {
        setShowModal(false);
      }
      // Redirect or perform other actions upon successful login
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageUser: any = JSON.parse(
        localStorage.getItem('user') as string
      );

      if (storageUser) {
        setUser(storageUser);
      }
    }
  }, [setUser]);

  return (
    <div className='modal'>
      <CloseIcon className='close-icon' onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }} />
      <h2>Inicia Sesion</h2>
      <label>Email</label>
      <input ref={emailRef} type='text'></input>
      <label>Contraseña</label>
      <input ref={passwordRef} type='password'></input>

      <button onClick={() => loginCredentials()}>Inciar Sesion</button>

      {/* <p>
        No tienes un usuario?{' '}
        <span onClick={() => registerUser()}>Registrate!</span>
      </p> */}

      <div className='alt-login'>
        <p style={{ padding: '10px' }}>Podes conectarte tambien mediante</p>
        <GoogleIcon onClick={login} style={{ cursor: 'pointer', fontSize: '2rem' }} />
      </div>
    </div>
  );
};

export default Modal;
