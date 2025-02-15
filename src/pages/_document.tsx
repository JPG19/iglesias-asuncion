import { Html, Head, Main, NextScript } from 'next/document';

const style = {
  display: 'flex',
  ['flex-direction']: 'column',
  minHeight: '100vh',
};

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
