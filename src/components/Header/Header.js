import React, { useEffect, useRef, useState } from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { renderIcon } from '@download/blockies';

const Header = (props) => {
  const { address, connected, connectWallet, disconnectWallet } = props;
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (!connected) {
      return;
    }

    const canvas = canvasRef.current;
    renderIcon({ seed: address.toLowerCase() }, canvas);
    const updatedDataUrl = canvas.toDataURL();
    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
    if (address.length < 11) {
      setShortAddress(address);
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [dataUrl, address, connected]);

  return (
    <header className="mb-auto">
      <Navbar expand="sm" variant="dark">
        <Container>
          <Navbar.Brand href="#">Disrupt Vaults</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button onClick={connected ? disconnectWallet : connectWallet}>
                {connected ? (
                  <>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <img src={dataUrl} class="img-thumbnail" alt="address"></img>
                    {/*<Avatar
                alt="address"
                src={dataUrl}
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '4px',
                }}
              />*/}
                    {shortAddress}
                  </>
                ) : (
                  <>{'Connect'}</>
                )}
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
