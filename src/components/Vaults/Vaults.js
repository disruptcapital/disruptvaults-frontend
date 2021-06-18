import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {getNetworkPools} from '../../helpers/getNetworkData';
import {useConnectWallet} from '../../hooks/connectWallet';
import {erc20ABI} from '../../configure/abi';

const Vaults = (props) => {
  const { web3, address, networkId, connected, connectWalletPending }  = useConnectWallet();
  let pools = getNetworkPools();
  
    useEffect(() => {
  //     console.log(web3);
  //     var btdContract = new web3.eth.Contract(erc20ABI, '0xa28a2359b0e66234e6f7e0b6d9732f333d1008e2');

  //     btdContract.methods.decimals().call().then(dec => {
  //       setDecimals(dec);
  //       console.log(dec);
  //     });
   }, [web3]);

  
  let [decimals, setDecimals] = useState(0);


  let deposit = () => {
    console.log("Deposit Clicked");
  };
 
  let depositAll = () => {
    console.log("depositAll Clicked");
  };

  let withdraw = () => {
    console.log("Withdraw Clicked");
  };

  let withdrawAll = () => {
    console.log("WithdrawAll Clicked");
  };


  return (
    <Container className="text-dark text-left">
      {pools.map(pool =>  (
      <Accordion className="vault">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1">            
            <div class="row">
              <div class="col-12">
                Name: {pool.name} <br/>
                Use: Your momma <br />
                decimals: {decimals} ( this is here just for contract testing )<br />
                APR: 3,242,342% <br />89
                Daily: 0.99% <br />
                TVL: A whole shit ton
              </div>
              <div class="col-6">
                Owned: 342332432 <br />
              </div>
              <div class="col-6">
                 Deposited: 4532543 <br />
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="text-black">
              <div class="row">
                <div class="col-6">                  
                  <input type="number" class="form-control" placeholder="Deposit Amount"></input>
                  <button class="btn btn-primary" onClick={deposit}>Approve</button> ( Should only show when token has NOT been approved )<br />
                  <button class="btn btn-primary" onClick={deposit}>Deposit</button> ( Should only show when token has been approved )<br />
                  <button class="btn btn-secondary" onClick={depositAll}>Deposit All </button>( Should only show when token has been approved )<br />
                </div>
                <div class="col-6">
                  <input type="number" class="form-control" placeholder="Withdraw Amount"></input>
                  <button class="btn btn-primary" onClick={withdraw}>Withdraw</button>
                  <button class="btn btn-secondary" onClick={withdrawAll}>Withdraw All</button>                  
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's st</p>
                </div>
                <div class="col-6">
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standa</p>
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      ))};

      
    </Container>
  );
};

export default Vaults;
