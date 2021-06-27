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
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [amountToDeposit, setAmountToDeposit] = useState(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);
  const [isAllowed, setIsAllowed] = useState(false);
  const [decimalDivisor, setDecimalDivisor] = useState(new BigNumber(10).pow(18));
  const [tvl, setTvl] = useState(0);

  useEffect(() => {
    if (!web3) return;

    const depositTokenContract = new web3.eth.Contract(erc20ABI, pool.depositTokenAddress);
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress);

    // Number of decimals for deposit token
    depositTokenContract.methods
      .decimals()
      .call()
      .then((dec) => {
        var decimalsBn = new BigNumber(dec);
        setDecimalDivisor(new BigNumber(10).pow(decimalsBn.toNumber()));

        depositTokenContract.methods
          .balanceOf(address)
          .call()
          .then((balance) => {
            var balanceBn = new BigNumber(balance);
            var balance = balanceBn.dividedBy(decimalDivisor).toNumber();
            setCurrentBalance(balance);
          });

        // Getting token allowance status
        depositTokenContract.methods
          .allowance(address, pool.vaultAddress)
          .call()
          .then((allowance) => {
            var allowanceBn = new BigNumber(allowance);

            setIsAllowed(allowanceBn > 0);
          });

        // Total supply of IOU tokens
        vaultContract.methods
          .totalSupply()
          .call()
          .then((totalSupply) => {
            var totalSupplyBn = new BigNumber(totalSupply);

            // IOU tokens owned by user
            vaultContract.methods
              .balanceOf(address)
              .call()
              .then((iouBalance) => {
                var iouBalanceBn = new BigNumber(iouBalance);

                // Number of deposit tokens inside the vault.
                vaultContract.methods
                  .balance()
                  .call()
                  .then((vaultBalance) => {
                    var vaultBalanceBn = new BigNumber(vaultBalance);
                    setTvl(vaultBalanceBn.dividedBy(decimalDivisor).toNumber());
                    setDepositedAmount(
                      iouBalanceBn
                        .dividedBy(totalSupplyBn)
                        .multipliedBy(vaultBalanceBn)
                        .dividedBy(decimalDivisor)
                        .toNumber(),
                    );
                  });
              });
          });
      });
  }, [web3]);

  let deposit = () => {
    
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress); 
    vaultContract.methods.deposit(decimalDivisor.multipliedBy(amountToDeposit).toString()).send({from: address}).then(() => {

    });
  };

  let depositAll = () => {
    console.log('depositAll Clicked');
  };

  let withdraw = () => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress); 
    vaultContract.methods.withdraw(decimalDivisor.multipliedBy(amountToWithdraw).toString()).send({from: address}).then(() => {

    });
  };

  let withdrawAll = () => {
    console.log('WithdrawAll Clicked');
  };

  let approve = () => {



    const depositTokenContract = new web3.eth.Contract(erc20ABI, pool.depositTokenAddress);  
    depositTokenContract.methods.approve(pool.vaultAddress, "115792089237316195423570985008687907853269984665640564039377283796003129639935").send({from: address}).then(() => {

    });
    
  };

  return (
    <Accordion className="vault">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
          <div class="row">
            <div class="col-12">
              Name: {pool.name} <br />
              Uses: {pool.tokenDescription} <br />
              APR: ???% <br />
              Daily: ???% <br />
              TVL: {tvl}
            </div>
            <div class="col-6">
              Owned: {currentBalance} <br />
            </div>
            <div class="col-6">
              Deposited: {depositedAmount} <br />
            </div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body className="text-black">
            <div class="row">
              <div class="col-6">
                {!isAllowed && (
                  <div>
                    <button class="btn btn-primary" onClick={approve}>
                      Approve
                    </button>{' '}
                  </div>
                )}
                {isAllowed && (
                  <div>
                    <input type="number" class="form-control" placeholder="Deposit Amount" value={amountToDeposit} onChange={(e) => setAmountToDeposit(e.target.value)}></input>
                    <br />
                    <button class="btn btn-primary" onClick={deposit}>
                      Deposit
                    </button>{' '}
                    <button class="btn btn-secondary" onClick={depositAll}>
                      Deposit All{' '}
                    </button>
                  </div>
                )}
              </div>
              <div class="col-6">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Withdraw Amount"
                  value={amountToWithdraw}
                  onChange={(e) => setAmountToWithdraw(e.target.value)}
                  disabled={depositedAmount == 0}
                ></input>
                <button class="btn btn-primary" onClick={withdraw} disabled={depositedAmount == 0}>
                  Withdraw
                </button>
                <button class="btn btn-secondary" onClick={withdrawAll} disabled={depositedAmount == 0}>
                  Withdraw All
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's st
                </p>
              </div>
              <div class="col-6">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standa
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
