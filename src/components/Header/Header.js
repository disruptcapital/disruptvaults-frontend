import React, { useEffect, useRef, useState } from 'react';
import { renderIcon } from '@download/blockies';
import { DisruptVaultsIcon, SunIcon, LoggedOut, MoonIcon } from 'icons';
import 'scss/_hamburger.scss';

const Header = (props) => {
  const { address, connected, connectWallet, disconnectWallet, setDarkMode, darkMode } = props;
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);
  const [shortAddress, setShortAddress] = useState('');

  const [hamburgerActive, setHamburgerActive] = useState(false);

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
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <DisruptVaultsIcon />
          <button
            className={
              hamburgerActive
                ? 'navbar-toggler hamburger hamburger--spin is-active'
                : 'navbar-toggler hamburger hamburger--spin'
            }
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#menuContent"
            aria-controls="menuContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setHamburgerActive(!hamburgerActive)}
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
          <div class="collapse navbar-collapse" id="menuContent">
            <ul class="navbar-nav d-flex flex-row align-items-center ms-auto">
              {connected ? (
                <li class="nav-item d-flex me-3">
                  <span
                    style={{
                      marginRight: '10px',
                      lineHeight: '32px',
                    }}
                  >
                    {shortAddress}
                  </span>
                  <span>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <img src={dataUrl} class="rounded-circle" alt="address"></img>
                  </span>
                </li>
              ) : (
                <li class="nav-item me-3">
                  <LoggedOut />
                </li>
              )}
              <li class="nav-item me-3">
                <a href="#!" role="button" onClick={setDarkMode}>
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </a>
              </li>
              <li class="nav-item">
                <button
                  type="button"
                  class="btn btn-primary btn-rounded"
                  onClick={connected ? disconnectWallet : connectWallet}
                  style={{
                    minWidth: '130px',
                  }}
                >
                  {connected ? <>{'Disconnect'}</> : <>{'Connect'}</>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
