import { uniswapV2RouterABI } from 'configure';
import BigNumber from 'bignumber.js';

export const fetchPrice = async ({ web3, address, routerAddress, tvl, busdDepositTokenPath }) => {

  const contract = new web3.eth.Contract(uniswapV2RouterABI, routerAddress);
  const amounts = await contract.methods.getAmountsOut(tvl, busdDepositTokenPath).call({ from: address });

  return new BigNumber(amounts[amounts.length-1]).toNumber();
};