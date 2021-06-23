import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './common/store';

//import 'mdb-ui-kit/css/mdb.min.css';
//import 'mdb-ui-kit/js/mdb.min.js';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'mdb-react-ui-kit/dist/mdb-react-ui-kit.js';
import './App.scss';

import { Vaults } from 'components/Vaults';
import { Header } from 'components/Header';
import { createWeb3Modal } from 'web3/createWeb3Modal';
import { useConnectWallet, useDisconnectWallet } from 'features/home/redux/hooks';
import { networkSetup } from 'common/networkSetup';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components';

const App = () => {
  const [web3Modal, setModal] = useState(null);
  const { connectWallet, web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const { theme = {}, isDarkMode, setIsDarkMode } = useTheme();

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

  const bg = isDarkMode ? '/images/dark.jpg' : '/images/light.jpg';
  const StyledMain = styled.main`
    background-image: url(${(props) => props.img});
  `;
  return (
    <div id="app" className="h-100">
      <div>
        <Header
          address={address}
          connected={connected}
          connectWallet={() => connectWallet(web3Modal)}
          disconnectWallet={() => disconnectWallet(web3, web3Modal)}
        />
        <StyledMain id="intro" className="bg-image shadow-2-strong" img={`${process.env.PUBLIC_URL}${bg}`}>
          <div class="mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', overflowY: 'scroll', marginTop: '60px' }}>
            <div class="container-fluid">
              <div class="row mt-3">
                <div class="col-md-12">
                  <div class="text-center" style={{ color: theme.text }}>
                    <h1 class="mb-3">Compounding...</h1>
                    <h5 class="mb-4">Yield aggregators with a fresh perspective</h5>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <Vaults />
                </div>
              </div>
            </div>
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
        </StyledMain>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </Provider>
  );
};

export default AppWrapper;
