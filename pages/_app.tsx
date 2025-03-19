//pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MiniKitProvider from '../components/MiniKitProvider';
import { UserProvider } from '../components/UserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MiniKitProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </MiniKitProvider>
  );
}

export default MyApp;
