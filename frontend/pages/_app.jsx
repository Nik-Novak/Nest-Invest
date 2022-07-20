//@ts-check
import '../styles/globals.css'

import store from '../redux/store';
import { Provider } from 'react-redux';
import AuthGuard from '../components/AuthGuard';
import React from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthGuard redirectUrl='/login'>
        <Component {...pageProps} />
      </AuthGuard>
    </Provider>
  );
}

export default MyApp
