import React, { useState, useEffect } from 'react';
import { useConnectWallet } from 'features/home/redux/hooks';
import { erc20ABI, vaultABI } from 'configure/abi';
import BigNumber from 'bignumber.js';
import
{
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
import { withdraw } from 'web3/withdraw';
import { fetchBalance } from 'web3/fetchBalance';
import { fetchPrice } from 'web3/fetchPrice';
import NumberFormat from 'react-number-format';
import { messageToast } from 'common/toasts';
import { byDecimals, convertAmountToRawNumber, isZero } from 'common/bignumber';
import { MultiCall } from 'eth-multicall';

const Vault = (props) =>
{
	const { web3, address } = useConnectWallet();
	const { pool = {} } = props;
	const { depositTokenAddress, vaultAddress, busdDepositTokenPath, routerAddress } = pool;
	const [iouBalance, setIOUBalance] = useState(new BigNumber(0));
	const [currentBalance, setCurrentBalance] = useState(0);
	const [depositedAmount, setDepositedAmount] = useState(0);
	const [sharesByDecimals, setSharesByDecimals] = useState(0);
	const [amountToDeposit, setAmountToDeposit] = useState();
	const [amountToWithdraw, setAmountToWithdraw] = useState();
	const [isAllowed, setIsAllowed] = useState(null);
	const [tvl, setTvl] = useState(0);
	const [tvlPrice, setTVLPrice] = useState(new BigNumber(0));
	const [pricePerFullShare, setPricePerFullShare] = useState(new BigNumber());
	const { execute: approve, allowance } = useApprove();


	const [vaultInfo, setVaultInfo] = useState();
	const [tokenInfo, setTokenInfo] = useState();



	useEffect(() =>
	{
		setIsAllowed(allowance > 0);
	}, [allowance]);

	const { slowRefresh } = useRefresh();


	useEffect(() =>
	{
		if (!web3) return;
		const multicall = new MultiCall(web3, pool.multicall);
		const vaultContract = new web3.eth.Contract(vaultABI, vaultAddress);
		const depositTokenContract = new web3.eth.Contract(erc20ABI, pool.depositTokenAddress);

		const vaultCalls = [];
		const depositTokenCalls = [];

		vaultCalls.push({
			balance: vaultContract.methods.balance(),
			pricePerFullShare: vaultContract.methods.getPricePerFullShare(),
			totalSupply: vaultContract.methods.totalSupply(),
			balanceOf: vaultContract.methods.balanceOf(address)
		});


		depositTokenCalls.push({
			balance: depositTokenContract.methods.balanceOf(address)
		});

		depositTokenCalls.push({
			balance: depositTokenContract.methods.balanceOf(address)
		});

		multicall
			.all([depositTokenCalls, vaultCalls])
			.then(([depositTokenCallResults, vaultCallResults]) =>
			{
				setVaultInfo({
					balance: new BigNumber(vaultCallResults[0].balance),
					pricePerFullShare: new BigNumber(vaultCallResults[0].pricePerFullShare),
					totalSupply: new BigNumber(vaultCallResults[0].totalSupply),
					balanceOf: new BigNumber(vaultCallResults[0].balanceOf),
				});

				setTokenInfo({
					balance: new BigNumber(depositTokenCallResults[0].balance)
				});


			});

	}, [slowRefresh, web3, address, depositTokenAddress, vaultAddress]);


	useEffect(() =>
	{
		async function update({ web3, address, depositTokenAddress, vaultAddress })
		{
			const allowance = await getAllowance({ web3, address, depositTokenAddress, vaultAddress });
			setIsAllowed(allowance > 0);
		}

		if (web3)
		{
			update({ web3, address, depositTokenAddress, vaultAddress });
		}
	}, [slowRefresh, web3, address, depositTokenAddress, vaultAddress]);

	useEffect(() =>
	{
		async function update({ web3, address, routerAddress, tvl, busdDepositTokenPath })
		{
			if (tvl && busdDepositTokenPath)
			{
				const t = convertAmountToRawNumber(tvl, 18);
				const price = await fetchPrice({ web3, address, routerAddress, t, busdDepositTokenPath });
				setTVLPrice(price);
			}
		}

		if (web3)
		{
			update({ web3, address, routerAddress, tvl, busdDepositTokenPath });
		}
	}, [slowRefresh, web3, address, routerAddress, tvl, busdDepositTokenPath]);


	// Updates vault deposited balance and TVL
	useEffect(async () =>
	{

		async function update({ vaultInfo })
		{
			setTvl(byDecimals(vaultInfo.balance).toNumber());

			setDepositedAmount(
				vaultInfo.balanceOf.isZero() || vaultInfo.totalSupply.isZero()
					? 0
					: byDecimals(vaultInfo.balanceOf
						.multipliedBy(vaultInfo.balance)
						.dividedBy(vaultInfo.totalSupply))
						.toNumber(),
			);
			let sharesbydec = byDecimals(vaultInfo.balance);
			setSharesByDecimals(sharesbydec);

			setCurrentBalance(tokenInfo.balance.isZero() ? 0 : byDecimals(tokenInfo.balance).toFormat(4));
			setPricePerFullShare(byDecimals(vaultInfo.pricePerFullShare));
			setIOUBalance(vaultInfo.balanceOf);
		}
		if (vaultInfo && tokenInfo)
		{
			await update({ vaultInfo });
		}
	}, [vaultInfo, tokenInfo]);

	const handleDeposit = (e, isAll) =>
	{
		const amount = isAll ? null : convertAmountToRawNumber(amountToDeposit, 18).toString();
		deposit({ web3, address, vaultAddress, amount, isAll })
			.then((data) =>
			{
				messageToast('Your deposit was successful.');
				setAmountToDeposit('');
				fetchBalance({ web3, address, tokenAddress: depositTokenAddress }).then((data) =>
				{
					setCurrentBalance(byDecimals(data).toFormat(4));
				});

				fetchBalance({ web3, address, tokenAddress: vaultAddress }).then((data) =>
				{
					var dataBn = new BigNumber(data);
					setIOUBalance(dataBn);
				});


			})
			.catch((error) =>
			{
				messageToast('An error occurred while depositing to the vault.');
			});
	};

	const handleWithdrawal = (e, isAll) =>
	{
		let withdrawAll = isAll;
		let amount = null;
		if (!isAll)
		{
			const amountToWithdrawBN = new BigNumber(amountToWithdraw);
			const sharesAmount = amountToWithdrawBN.dividedBy(pricePerFullShare).decimalPlaces(18, BigNumber.ROUND_UP);

			amount = convertAmountToRawNumber(sharesAmount, 18);
			if (sharesAmount.times(100).dividedBy(sharesByDecimals).isGreaterThan(99))
			{
				withdrawAll = true;
				amount = null;
			}
			withdraw({ web3, address, vaultAddress, amount, isAll: withdrawAll })
				.then((data) =>
				{
					messageToast('Your withdrawal was successful.');
					setAmountToWithdraw('');
					fetchBalance({ web3, address, tokenAddress: depositTokenAddress }).then((data) =>
					{
						setCurrentBalance(byDecimals(data).toFormat(4));
					});

					fetchBalance({ web3, address, tokenAddress: vaultAddress }).then((data) =>
					{
						var dataBn = new BigNumber(data);
						setIOUBalance(dataBn);
					});
				})
				.catch((error) =>
				{
					messageToast('An error occurred while withdrawing from the vault.');
				});
		} else
		{
			withdraw({ web3, address, vaultAddress, amount, isAll })
				.then((data) =>
				{
					messageToast('Your withdrawal was successful.');
					fetchBalance({ web3, address, tokenAddress: depositTokenAddress }).then((data) =>
					{
						setCurrentBalance(byDecimals(data).toFormat(4));
					});

					fetchBalance({ web3, address, tokenAddress: vaultAddress }).then((data) =>
					{
						var dataBn = new BigNumber(data);
						setIOUBalance(dataBn);
					});
				})
				.catch((error) =>
				{
					messageToast('An error occurred while withdrawing from the vault.');
				});
		}
	};

	const handleApproval = () =>
	{
		approve(web3, address, depositTokenAddress, vaultAddress);
	};

	const [activeTab, setActiveTab] = useState('deposit');

	const handleTabClick = (value) =>
	{
		if (value === activeTab)
		{
			return;
		}
		setActiveTab(value);
	};

	return (
		<StyledCard>
			<VaultHeader pool={pool} tvl={formatTvl(byDecimals(tvlPrice))} />
			<MDBCardBody>
				<div className="d-flex justify-content-evenly mb-3">
					<div>
						<div>{currentBalance}</div>
						<StyledSecondary align="center">Wallet</StyledSecondary>
					</div>
					<div>
						<div>{byDecimals(iouBalance.multipliedBy(pricePerFullShare)).toFormat(4)}</div>
						<StyledSecondary align="center">Deposited</StyledSecondary>
					</div>
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
									disabled={currentBalance === 0}
									value={amountToDeposit}
									onValueChange={(values) =>
									{
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
									disabled={depositedAmount === 0}
									className="form-control mb-3"
									value={amountToWithdraw}
									onValueChange={(values) =>
									{
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
								<StyledButton onClick={handleDeposit} disabled={currentBalance === 0} style={{ marginRight: '2px' }}>
									Deposit
								</StyledButton>
								<StyledButton onClick={(e) => handleDeposit(e, true)} disabled={currentBalance === 0}>
									Deposit All
								</StyledButton>
							</>
						) : (
							<StyledButton onClick={handleApproval}>Approve</StyledButton>
						)}
					</div>
				)}
				{activeTab === 'withdrawal' && (
					<div class="d-flex">
						<StyledButton onClick={handleWithdrawal} disabled={depositedAmount === 0} style={{ marginRight: '2px' }}>
							Withdraw
						</StyledButton>
						<StyledButton onClick={(e) => handleWithdrawal(e, true)} disabled={depositedAmount === 0}>
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

  ${({ theme }) => theme.mediaQueries.md} {
    width: 45%;
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
  color: ${({ theme }) => `${theme.text} !important`};
  :disabled {
    background-color: ${({ theme }) => `${theme.disabledBg} !important`};
    opacity: 0.65;
  }
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => `${theme.text} !important`};
`;

export default Vault;
