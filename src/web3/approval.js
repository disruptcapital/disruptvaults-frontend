import { erc20ABI } from 'configure';
import BigNumber from 'bignumber.js';
import { transactionToast } from 'common/toasts';

export const approval = ({ web3, address, depositTokenAddress, vaultAddress }) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(erc20ABI, depositTokenAddress);

    contract.methods
      .approve(vaultAddress, web3.utils.toWei('8000000000', 'ether'))
      .send({ from: address })
      .on('transactionHash', function (hash) {
        transactionToast(hash);
      })
      .on('receipt', function (receipt) {
        resolve(new BigNumber(8000000000).toNumber());
      })
      .on('error', function (error) {
        reject(error);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllowance = async ({ web3, address, depositTokenAddress, vaultAddress }) => {
  const contract = new web3.eth.Contract(erc20ABI, depositTokenAddress);
  return new BigNumber(await contract.methods.allowance(address, vaultAddress).call());
};
