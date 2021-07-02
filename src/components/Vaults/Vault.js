import React, { useState, useEffect } from 'react';
import { useConnectWallet } from 'features/home/redux/hooks';
import { erc20ABI, vaultABI } from 'configure/abi';
import BigNumber from 'bignumber.js';
import {
  MDBCard,
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
import VaultHeader from 'features/vault/components/VaultHeader';
import { StyledSecondary } from 'components/Styled';
import useApprove from 'hooks/useApprove';
import useRefresh from 'hooks/useRefresh';
import { getAllowance } from 'web3/approval';
import { formatTvl } from 'common/format';
import { deposit } from 'web3/deposit';
import NumberFormat from 'react-number-format';

const Vault = (props) => {
  const { web3, address } = useConnectWallet();
  const { pool = {} } = props;
  const { depositTokenAddress, vaultAddress } = pool;

  const [sharesBalance, setSharesBalance] = useState(new BigNumber(0));
  const [currentBalance, setCurrentBalance] = useState(0);
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [sharesByDecimals, setSharesByDecimals] = useState(0);
  const [amountToDeposit, setAmountToDeposit] = useState();
  const [amountToWithdraw, setAmountToWithdraw] = useState();
  const [isAllowed, setIsAllowed] = useState(null);
  const [decimalDivisor, setDecimalDivisor] = useState(new BigNumber(10).pow(18));
  const [tvl, setTvl] = useState(0);
  const [pricePerFullShare, setPricePerFullShare] = useState(new BigNumber());
  const [shareDecimals, setShareDecimals] = useState(18);

  const { execute: approve, allowance } = useApprove();
  useEffect(() => {
    setIsAllowed(allowance > 0);
  }, [allowance]);

  const { slowRefresh } = useRefresh();
  useEffect(() => {
    async function update({ web3, address, depositTokenAddress, vaultAddress }) {
      const allowance = await getAllowance({ web3, address, depositTokenAddress, vaultAddress });
      setIsAllowed(allowance > 0);
    }

    if (web3) {
      update({ web3, address, depositTokenAddress, vaultAddress });
    }
  }, [slowRefresh, web3, address, depositTokenAddress, vaultAddress]);

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
        setShareDecimals(parseInt(dec));
        setDecimalDivisor(new BigNumber(10).pow(decimalsBn.toNumber()));

        depositTokenContract.methods
          .balanceOf(address)
          .call()
          .then((balance) => {
            var balanceBn = new BigNumber(balance);
            const formattedBalance = balanceBn.dividedBy(decimalDivisor).toNumber();
            setCurrentBalance(formattedBalance);
          });

        vaultContract.methods
          .getPricePerFullShare()
          .call()
          .then((ppfs) => {
            let ppfsBN = new BigNumber(ppfs);
            setPricePerFullShare(ppfsBN.dividedBy(decimalDivisor));
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
                setSharesBalance(iouBalanceBn);
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
                    let sharesbydec = byDecimals(vaultBalanceBn, shareDecimals);
                    setSharesByDecimals(sharesbydec);
                  });
              });
          });
      });
  }, [web3, slowRefresh]);

  const handleDeposit = (e, isAll) => {
    const amount = isAll ? null : decimalDivisor.multipliedBy(amountToDeposit).toString();
    deposit({ web3, address, vaultAddress, amount, isAll });
  };

  let withdraw = async () => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress);
    const amountToWithdrawBN = new BigNumber(amountToWithdraw);
    const sharesAmount = amountToWithdrawBN.dividedBy(pricePerFullShare).decimalPlaces(18, BigNumber.ROUND_UP);

    var theAmount = convertAmountToRawNumber(sharesAmount, 18);
    if (sharesAmount.times(100).dividedBy(sharesByDecimals).isGreaterThan(99)) {
      vaultContract.methods
        .withdrawAll()
        .send({ from: address })
        .then(() => {});
    } else {
      vaultContract.methods
        .withdraw(theAmount.toString())
        .send({ from: address })
        .then(() => {});
    }
  };

  function byDecimals(number, tokenDecimals = 18) {
    const decimals = new BigNumber(10).exponentiatedBy(tokenDecimals);
    let withDecimals = new BigNumber(number);

    try {
      withDecimals.dividedBy(decimals).decimalPlaces(tokenDecimals);
    } catch (err) {
      //console.log(err);
    }
    return withDecimals;
  }

  const withdrawAll = () => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.vaultAddress);
    vaultContract.methods
      .withdrawAll()
      .send({ from: address })
      .then(() => {});
  };

  const handleApproval = () => {
    approve(web3, address, depositTokenAddress, vaultAddress);
  };

  const [activeTab, setActiveTab] = useState('deposit');

  const handleTabClick = (value) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
  };

  function convertAmountToRawNumber(value, decimals = 18) {
    return new BigNumber(value)
      .times(new BigNumber('10').pow(decimals))
      .decimalPlaces(0, BigNumber.ROUND_DOWN)
      .toString(10);
  }

  return (
    <StyledCard>
      <VaultHeader pool={pool} tvl={formatTvl(tvl)} />
      <MDBCardBody>
        <div>{`Owned: ${currentBalance}`}</div>
        <div>
          Deposited: {byDecimals(sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)), 18).toFormat(8)}{' '}
        </div>
        <MDBTabs fill className="mb-3">
          <MDBTabsItem>
            <StyledTabsLink onClick={() => handleTabClick('deposit')} active={activeTab === 'deposit'}>
              Deposit
            </StyledTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <StyledTabsLink onClick={() => handleTabClick('withdrawal')} active={activeTab === 'withdrawal'}>
              Withdrawal
            </StyledTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          <MDBTabsPane show={activeTab === 'deposit'}>
            {isAllowed && (
              <div class="form-outline">
                <StyledNumberFormat
                  thousandSeparator={true}
                  className="form-control mb-3"
                  value={amountToDeposit}
                  onValueChange={(values) => {
                    setAmountToDeposit(values.floatValue);
                  }}
                />

                <StyledLabel
                  className="form-label"
                  style={
                    amountToDeposit !== undefined
                      ? { transform: 'translateY(-1rem) translateY(0.1rem) scale(0.8)' }
                      : {}
                  }
                >
                  Deposit Amount
                </StyledLabel>
                <div class="form-notch">
                  <div class="form-notch-leading"></div>
                  <div
                    class="form-notch-middle"
                    style={
                      amountToDeposit !== undefined ? { borderTop: 'none', width: '100.8px' } : { width: '100.8px' }
                    }
                  ></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>
            )}
            <StyledDescription>
              Deposit fee: 0.0%
              <br />
              Withdrawal fee: 0.0%
            </StyledDescription>
            <StyledSecondary align="center">
              You will receive TUSK-BNB token as a receipt for your deposited TUSK-BNB LP assets. This token is needed
              to withdraw your TUSK-BNB LP.
            </StyledSecondary>
          </MDBTabsPane>
          <MDBTabsPane show={activeTab === 'withdrawal'}>
            {isAllowed && (
              <div class="form-outline">
                <StyledNumberFormat
                  thousandSeparator={true}
                  disabled={depositedAmount == 0}
                  className="form-control mb-3"
                  value={amountToWithdraw}
                  onValueChange={(values) => {
                    setAmountToWithdraw(values.floatValue);
                  }}
                />

                <StyledLabel
                  className="form-label"
                  style={
                    amountToWithdraw !== undefined
                      ? { transform: 'translateY(-1rem) translateY(0.1rem) scale(0.8)' }
                      : {}
                  }
                >
                  Withdrawal Amount
                </StyledLabel>
                <div class="form-notch">
                  <div class="form-notch-leading"></div>
                  <div
                    class="form-notch-middle"
                    style={
                      amountToWithdraw !== undefined ? { borderTop: 'none', width: '120.8px' } : { width: '120.8px' }
                    }
                  ></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>
            )}
            <StyledDescription>Withdrawal will result in: </StyledDescription>
            <StyledSecondary align="center">Redeem disruptTUSK token for TUSK</StyledSecondary>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBCardBody>
      <div>
        {activeTab === 'deposit' && (
          <div class="d-flex">
            {isAllowed ? (
              <>
                <StyledButton onClick={handleDeposit} style={{ marginRight: '2px' }}>
                  Deposit
                </StyledButton>
                <StyledButton onClick={(e) => handleDeposit(e, true)}>Deposit All</StyledButton>
              </>
            ) : (
              <StyledButton onClick={handleApproval}>Approve</StyledButton>
            )}
          </div>
        )}
        {activeTab === 'withdrawal' && (
          <div class="d-flex">
            <StyledButton onClick={withdraw} disabled={depositedAmount == 0} style={{ marginRight: '2px' }}>
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
  margin: 15px;
  border-radius: 0;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 50%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  background: ${({ theme }) => theme.bgSecondary};

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 46%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 30%;
  }
`;

const StyledDescription = styled.div`
  color: ${({ theme }) => theme.disabled};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledButton = styled(MDBBtn)`
  width: 100%;
  border-radius: 0;
  box-shadow: none;
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

const StyledNumberFormat = styled(NumberFormat)`
  color: ${({ theme }) => `${theme.text}`};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => `${theme.text} !important`};
`;

export default Vault;
