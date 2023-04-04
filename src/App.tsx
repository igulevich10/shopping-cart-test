import React from 'react';
import { AppProvider, Page } from '@shopify/polaris';
import "@shopify/polaris/build/esm/styles.css";
import Cart from './components/Cart/Cart';
import enTranslations from '@shopify/polaris/locales/en.json';
import './App.scss';

const App = () => {
  return (
    <AppProvider i18n={enTranslations}>
      <Page>
        <Cart />
      </Page>
    </AppProvider>
  )
}

export default App;