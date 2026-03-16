import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { StacksProvider } from '../contexts/StacksProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StacksProvider>
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="application-name" content="MicroSponsor" />
        </Head>
        <Component {...pageProps} />
      </>
    </StacksProvider>
  );
}
