import React from 'react';
import { Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const Vaults = (props) => {
  return (
    <Container className="text-dark text-left">
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1">
            Vault 1
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="text-black">Unique vault strategy</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <br></br>
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1">
            Vault 2
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="text-black">Unique vault strategy</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Container>
  );
};

export default Vaults;
