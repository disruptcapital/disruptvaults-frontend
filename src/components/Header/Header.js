import React, { useEffect, useRef, useState } from 'react';
import { renderIcon } from '@download/blockies';
import { DisruptVaultsIcon, SunIcon, LoggedOut, MoonIcon } from 'icons';
import useTheme from 'hooks/useTheme';
import usePrevious from 'hooks/usePrevious';
import 'scss/_hamburger.scss';
import styled from 'styled-components';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';

const Header = (props) => {
  const { address, connected, connectWallet, disconnectWallet } = props;
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [shortAddress, setShortAddress] = useState('');
  const { theme = {}, isDarkMode, setIsDarkMode } = useTheme();
  const prevTheme = usePrevious(theme.name);

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

  const StyledNav = styled(MDBNavbar)`
    min-height: 56px;
    z-index: 2000;
    background-color: ${({ theme }) => theme.bgSecondary};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.text};
  `;

  const StyledCollapse = styled(MDBCollapse)`
    ${prevTheme !== theme.name && 'transition: none;'}
  `;

  return (
    <header>
      <StyledNav expand="lg" fixed>
        <MDBContainer fluid>
          <MDBNavbarBrand href="#">
            <DisruptVaultsIcon color={theme.text} />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNav(!showNav)}
            className={
              showNav
                ? 'navbar-toggler hamburger hamburger--spin is-active'
                : 'navbar-toggler hamburger hamburger--spin'
            }
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </MDBNavbarToggler>
          <StyledCollapse navbar show={showNav}>
            <MDBNavbarNav right fullWidth={false} className="align-items-lg-center align-items-sm-end ms-auto">
              {connected ? (
                <MDBNavbarItem className="me-lg-3 mb-lg-0 me-sm-2 mb-sm-2">
                  <span
                    style={{
                      marginRight: '10px',
                      lineHeight: '32px',
                      color: `${theme.text}`,
                    }}
                  >
                    {shortAddress}
                  </span>
                  <span>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <img src={dataUrl} className="rounded-circle" alt="address"></img>
                  </span>
                </MDBNavbarItem>
              ) : (
                <MDBNavbarItem className="me-lg-3 mb-lg-0 me-sm-2 mb-sm-2">
                  <LoggedOut />
                </MDBNavbarItem>
              )}
              <MDBNavbarItem className="me-lg-3 mb-lg-0 me-sm-2 mb-sm-2">
                <a href="#!" role="button" onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </a>
              </MDBNavbarItem>
              <MDBNavbarItem className="me-sm-2">
                <button
                  type="button"
                  className="btn btn-primary btn-rounded"
                  onClick={connected ? disconnectWallet : connectWallet}
                  style={{
                    minWidth: '130px',
                  }}
                >
                  {connected ? <>{'Disconnect'}</> : <>{'Connect'}</>}
                </button>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </StyledCollapse>
        </MDBContainer>
      </StyledNav>
    </header>
  );
};

export default Header;
