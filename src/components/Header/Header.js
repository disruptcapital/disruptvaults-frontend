import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
const Header = () => {
  return (
    <header class="mb-auto">
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#">Disrupt Vaults</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Techno</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
