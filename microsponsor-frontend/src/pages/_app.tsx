import type { AppProps } from 'next/app';
import { Connect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import '../styles/globals.css';

// Configure network for Stacks
const network = new StacksTestnet(); // Change to StacksMainnet for production

const userSession = {
  appConfig: {
    name: 'MicroSponsor',
    appIcon: '/favicon.ico',
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'MicroSponsor',
          icon: '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
      network={network}
    >
      <Component {...pageProps} />
    </Connect>
  );
}
