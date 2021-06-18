import React, { useEffect, useState } from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createWeb3Modal } from 'web3/createWeb3Modal';

import { useConnectWallet } from 'hooks/connectWallet';
import { networkSetup } from 'helpers/networkSetup';

const Header = () => {
  const { t } = useTranslation();
  const [web3Modal, setModal] = useState(null);
  const { connectWallet, web3, address, networkId, connected, connectWalletPending } = useConnectWallet();

  useEffect(() => {
      setModal(createWeb3Modal(t));
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
      networkSetup(process.env.REACT_APP_NETWORK_ID).catch(e => {
        console.error(e);
        alert(t('Network-Error'));
      });
    }
  }, [web3, address, networkId, connectWalletPending, t]);

  return (
    <header class="mb-auto">
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#">Disrupt Vaults</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <div>{}</div>
              <Button
              onClick={() => connectWallet(web3Modal)}
            >Connect</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
