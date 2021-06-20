import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { getNetworkPools } from '../../helpers/getNetworkData';
import { useConnectWallet } from '../../hooks/connectWallet';
import { erc20ABI } from '../../configure/abi';

const Vault = (props) => {
  const { web3, address, networkId, connected, connectWalletPending } = useConnectWallet();

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
          decimals: {decimals} <br />
          <pre>
            Name: {pool.name} <br />
            earnedTokenAddress: {pool.earnedTokenAddress}
          </pre>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body className="text-black">
            <div class="row">
              <div class="col-6">
                <input type="number" placeholder="Deposit Amount"></input>
                <button class="btn btn-primary" onClick={deposit}>
                  Deposit
                </button>
                <button class="btn btn-secondary" onClick={depositAll}>
                  Deposit All
                </button>
              </div>
              <div class="col-6">
                <input type="number" placeholder="Withdraw Amount"></input>
                <button class="btn btn-primary" onClick={withdraw}>
                  Withdraw
                </button>
                <button class="btn btn-secondary" onClick={withdrawAll}>
                  Withdraw All
                </button>
              </div>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default Vault;
