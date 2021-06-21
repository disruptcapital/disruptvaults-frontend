import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { getNetworkPools } from 'common/getNetworkData';
import { useConnectWallet } from 'features/home/redux/hooks';
import { erc20ABI, vaultABI } from '../../configure/abi';
import BigNumber from 'bignumber.js';
const Vault = (props) => {
  const { web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const pool = props.pool;
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(async () => {
    if (!web3) return; 

    console.log(pool);

    // console.log(web3);
    var depositTokenContract = new web3.eth.Contract(erc20ABI, pool.depositTokenAddress);
    var vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress);

    
    depositTokenContract.methods.decimals().call().then(dec => {
      depositTokenContract.methods.balanceOf(address).call().then((balance) => {
          var decimalsBn = new BigNumber(dec);
          var decimalDivisor = (new BigNumber(10)).pow(decimalsBn.toNumber());
          var balanceBn = new BigNumber(balance);
          var balance = balanceBn.div(decimalDivisor).toNumber();
          setCurrentBalance(balance);
      });


    });
    // btdContract.methods.decimals().call().then(dec => {
    //   setDecimals(dec);
    //   console.log(dec);
    // });
 }, [web3]);


  let [decimals, setDecimals] = useState(0);

  let deposit = () => {
    console.log('Deposit Clicked');
  };

  let depositAll = () => {
    console.log('depositAll Clicked');
  };

  let withdraw = () => {
    console.log('Withdraw Clicked');
  };

  let withdrawAll = () => {
    console.log('WithdrawAll Clicked');
  };


  return (
    <Accordion className="vault">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              <div class="row">
                <div class="col-12">
                  Name: {pool.name} <br />
                  Uses: Your momma <br />
                  decimals: {decimals} ( this is here just for contract testing )<br />
                  APR: 3,242,342% <br />
                  89 Daily: 0.99% <br />
                  TVL: A whole shit ton
                </div>
                <div class="col-6">
                  Owned: {currentBalance} <br />
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
                    <button class="btn btn-primary" onClick={deposit}>
                      Approve
                    </button>{' '}
                    ( Should only show when token has NOT been approved )<br />
                    <button class="btn btn-primary" onClick={deposit}>
                      Deposit
                    </button>{' '}
                    ( Should only show when token has been approved )<br />
                    <button class="btn btn-secondary" onClick={depositAll}>
                      Deposit All{' '}
                    </button>
                    ( Should only show when token has been approved )<br />
                  </div>
                  <div class="col-6">
                    <input type="number" class="form-control" placeholder="Withdraw Amount"></input>
                    <button class="btn btn-primary" onClick={withdraw}>
                      Withdraw
                    </button>
                    <button class="btn btn-secondary" onClick={withdrawAll}>
                      Withdraw All
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's st
                    </p>
                  </div>
                  <div class="col-6">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standa
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        
  );
};

export default Vault;
