import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './common/store';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './App.scss';

import { Vaults } from 'components/Vaults';
import { Header } from 'components/Header';
import Web3Modal from 'web3modal';
import { getNetworkConnectors } from 'common/getNetworkData';
import { useConnectWallet, useDisconnectWallet } from 'features/home/redux/hooks';
import { networkSetup } from 'common/networkSetup';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import useTheme from 'hooks/useTheme';
import { GlobalStyles } from './global';
import styled from 'styled-components';
import { MDBContainer } from 'mdb-react-ui-kit';

const App = () => {
  const [web3Modal, setModal] = useState(null);
  const { connectWallet, web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const { theme = {}, isDarkMode, setIsDarkMode } = useTheme();

  useEffect(() => {
    setModal(new Web3Modal({ ...getNetworkConnectors(), theme: theme.name || 'light' }));
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
    <>
      <GlobalStyles />
      <Header
        address={address}
        connected={connected}
        connectWallet={() => connectWallet(web3Modal)}
        disconnectWallet={() => disconnectWallet(web3, web3Modal)}
      />
      <main style={{ marginTop: '60px' }}>
        <MDBContainer breakpoint="xl">
          <div class="d-flex flex-column mt-3 ms-auto text-center" style={{ color: theme.text }}>
            <h1 class="m-3">Compounding...</h1>
            <h5 class="mb-4">Yield aggregators with a fresh perspective</h5>
          </div>

          <div class="mb-3">
            <Vaults />
          </div>
        </MDBContainer>
      </main>
      <StyledFooter className="mt-auto text-center">
        <p>
          Yield Optimizing Strategies by <a href="https://twitter.com/disruptvaults" target="_blank">@disruptcapital</a>.
        </p>
      </StyledFooter>
    </>
  );
};

const StyledFooter = styled.footer`
  color: ${({ theme }) => theme.text};
`;

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
