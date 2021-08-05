import { uniswapV2RouterABI } from 'configure';
import BigNumber from 'bignumber.js';

export const fetchPrice = async ({ web3, address, routerAddress, t, busdDepositTokenPath }) => {
  try {
    const contract = new web3.eth.Contract(uniswapV2RouterABI, routerAddress);
    const amounts = await contract.methods.getAmountsOut(t, busdDepositTokenPath).call({ from: address });

    return new BigNumber(amounts[amounts.length - 1]);
  } catch (err) {
    console.log('fetchPrice: ' + err);
    return 0;
  }
};
