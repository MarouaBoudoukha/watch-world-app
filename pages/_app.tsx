//pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MiniKitProvider from '../components/MiniKitProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MiniKitProvider>
      <Component {...pageProps} />
    </MiniKitProvider>
  );
}

export default MyApp;
