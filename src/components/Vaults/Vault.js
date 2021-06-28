import React, { useState, useEffect } from 'react';
import { useConnectWallet } from 'features/home/redux/hooks';
import { erc20ABI, vaultABI } from '../../configure/abi';
import BigNumber from 'bignumber.js';
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBInput,
} from 'mdb-react-ui-kit';
import styled from 'styled-components';

const Vault = (props) => {
  const { web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const { pool } = props;

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
            const formattedBalance = balanceBn.dividedBy(decimalDivisor).toNumber();
            setCurrentBalance(formattedBalance);
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

  const depositAll = () => {
    console.log('depositAll Clicked');
  };

  let withdraw = () => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress); 
    vaultContract.methods.withdraw(decimalDivisor.multipliedBy(amountToWithdraw).toString()).send({from: address}).then(() => {

    });
  };

  const withdrawAll = () => {
    console.log('WithdrawAll Clicked');
  };

  const approve = () => {
    const depositTokenContract = new web3.eth.Contract(erc20ABI, pool.depositTokenAddress);
    depositTokenContract.methods
      .approve(pool.vaultAddress, '115792089237316195423570985008687907853269984665640564039377283796003129639935')
      .send({ from: address })
      .then(() => {});
  };

  const [basicActive, setBasicActive] = useState('deposit');

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  return (
    <StyledCard>
      <StyledVaultHeader>
        <div className="m-2">
          <StyledCardImage
            className="img-fluid"
            overlay="white-light"
            hover
            src={`${process.env.PUBLIC_URL}/${pool.logo}`}
          />
        </div>
        <div style={{flexGrow: '1'}}>
          <h5 className="mt-2 mb-0 font-weight-bold">{pool.name}</h5>
          <StyledParagraphSmall className="font-weight-light">Uses: {pool.tokenDescription}</StyledParagraphSmall>
          <div class="d-flex justify-content-evenly">
          <div class="text-center"><div>999.99%</div><div>APY</div></div>
          <div class="text-center"><div>999.99%</div><div>Daily</div></div>
          <div class="text-center"><div>{tvl}%</div><div>TVL</div></div>
          
        </div>
        </div>
        
      </StyledVaultHeader>
      <MDBCardBody>
          <div>{`Owned: ${currentBalance}`}</div>
          <div>Deposited: {depositedAmount}</div>
        <MDBTabs fill className="mb-3">
          <MDBTabsItem>
            <StyledTabsLink onClick={() => handleBasicClick('deposit')} active={basicActive === 'deposit'}>
              Deposit
            </StyledTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <StyledTabsLink onClick={() => handleBasicClick('withdrawal')} active={basicActive === 'withdrawal'}>
              Withdrawal
            </StyledTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          <MDBTabsPane show={basicActive === 'deposit'}>
            {isAllowed && <StyledMDBInput label="Deposit Amount" type="number" className="mb-3" value={amountToDeposit} onChange={(e) => setAmountToDeposit(e.target.value)}/>}
            <StyledDescription>
              Deposit fee: 0.0%
              <br />
              Withdrawal fee: 0.0%
            </StyledDescription>
            <StyledDescriptionSmall>
              You will receive TUSK-BNB token as a receipt for your deposited TUSK-BNB LP assets. This
              token is needed to withdraw your TUSK-BNB LP.
            </StyledDescriptionSmall>
          </MDBTabsPane>
          <MDBTabsPane show={basicActive === 'withdrawal'}>
            {isAllowed && (
              <StyledMDBInput label="Withdraw Amount" type="number" disabled={depositedAmount == 0} className="mb-3" value={amountToWithdraw}
              onChange={(e) => setAmountToWithdraw(e.target.value)}/>
            )}
            <StyledDescription>Withdrawal will result in: </StyledDescription>
            <StyledDescriptionSmall>Redeem disruptTUSK token for TUSK</StyledDescriptionSmall>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBCardBody>
      <div>
        {basicActive === 'deposit' && (
          <div class="d-flex">
            {isAllowed ? (
              <>
                <StyledButton onClick={deposit}>Deposit</StyledButton>
                <StyledButton onClick={depositAll}>Deposit All</StyledButton>
              </>
            ) : (
              <StyledButton onClick={approve}>Approve</StyledButton>
            )}
          </div>
        )}
        {basicActive === 'withdrawal' && (
          <div class="d-flex">
            <StyledButton onClick={withdraw} disabled={depositedAmount == 0}>
              Withdraw
            </StyledButton>
            <StyledButton onClick={withdrawAll} disabled={depositedAmount == 0}>
              Withdraw All
            </StyledButton>
          </div>
        )}
      </div>
    </StyledCard>
  );
};

const StyledCard = styled(MDBCard)`
  width: 100%;
  margin: 5px;
  border-radius: 0;
  background: ${({ theme }) => theme.bgSecondary};

  ${({ theme }) => theme.mediaQueries.md} {
    width: 48%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 32%;
  }
`;
const StyledCardImage = styled(MDBCardImage)`
  width: 80px;
  height: 80px;
`;
const StyledParagraphSmall = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text};
`;

const StyledVaultHeader = styled.div`
  display: flex !important;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%);
`;

const StyledDescription = styled.div`
  color: ${({ theme }) => theme.disabled};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledDescriptionSmall = styled.div`
  color: ${({ theme }) => theme.disabled};
  font-size: 12px;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledButton = styled(MDBBtn)`
  width: 100%;
  border-radius: 0;
  box-shadow: none;
  margin: 1px;
`;

const StyledTabsLink = styled(MDBTabsLink)`
  &.nav-link {
    color: ${({ theme }) => `${theme.text}`};

    &.active {
      background-color: transparent;
    }
    &:hover {
      background-color: ${({ theme }) => `${theme.bg} !important`};
    }
  }
`;

const StyledMDBInput = styled(MDBInput)`
  &.form-control ~ .form-label {
    color: ${({ theme }) => `${theme.text}`};
  }
`;

export default Vault;
