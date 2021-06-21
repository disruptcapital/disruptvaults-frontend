import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { getNetworkPools } from 'common/getNetworkData';
import { useConnectWallet } from 'features/home/redux/hooks';
import { erc20ABI } from '../../configure/abi';
import Vault from './Vault';

const Vaults = (props) => {
  const { web3, address, networkId, connected, connectWalletPending }  = useConnectWallet();
  let pools = getNetworkPools();
  let data = [];
   

  


  return (
    <Container className="text-dark text-left">
      {pools.map((pool) => (
        <>
        <Vault pool={pool}></Vault>
        </>
      ))}
      ;
    </Container>
  );
};

export default Vaults;
