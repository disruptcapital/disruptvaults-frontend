import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './common/store';

import 'mdb-ui-kit/css/mdb.min.css';
import 'mdb-ui-kit/js/mdb.min.js';
import './App.scss';

import { Vaults } from 'components/Vaults';
import { Header } from 'components/Header';
import { createWeb3Modal } from 'web3/createWeb3Modal';
import { useConnectWallet, useDisconnectWallet } from 'features/home/redux/hooks';
import { networkSetup } from 'common/networkSetup';
import useDarkMode from 'features/home/hooks/useDarkMode';

const App = () => {
  const [web3Modal, setModal] = useState(null);
  const { connectWallet, web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const { darkMode, setDarkMode } = useDarkMode();
  //const theme = createTheme(darkMode);

  useEffect(() => {
    setModal(createWeb3Modal());
  }, [setModal]);

  useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet]);

  useEffect(() => {
    if (
      web3 &&
      address &&
      !connectWalletPending &&
      networkId &&
      Boolean(networkId !== Number(process.env.REACT_APP_NETWORK_ID))
    ) {
      networkSetup(process.env.REACT_APP_NETWORK_ID).catch((e) => {
        console.error(e);
        alert('Network-Error');
      });
    }
  }, [web3, address, networkId, connectWalletPending]);
  return (
    <div id="app" className="h-100">
      <div>
        <Header
          address={address}
          connected={connected}
          connectWallet={() => connectWallet(web3Modal)}
          disconnectWallet={() => disconnectWallet(web3, web3Modal)}
          darkMode={darkMode}
          setDarkMode={() => setDarkMode(!darkMode)}
        />
        <main className="px-3 text-center">
          <h2>Compounding...</h2>
          <p>Binance Smart Chain yield aggregators with a fresh perspective.</p>
          <Vaults />
        </main>
        <footer className="mt-auto text-white-50 text-center">
          <p>
            Yield Optimizing Strategies by{' '}
            <a href="https://twitter.com/disrupttechno" className="text-white">
              @disruptcapital
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
