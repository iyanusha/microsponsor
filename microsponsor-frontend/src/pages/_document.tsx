import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4f46e5" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
