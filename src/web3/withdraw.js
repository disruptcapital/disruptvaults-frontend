import { vaultABI } from '../configure';
import { transactionToast } from 'common/toasts';

export const withdraw = async ({ web3, address, vaultAddress, amount, isAll }) => {
  const contract = new web3.eth.Contract(vaultABI, vaultAddress);
  const data = await _withdraw({ contract, address, vaultAddress, amount, isAll });
  return data;
};

const _withdraw = ({ contract, address, vaultAddress, amount, isAll }) => {
  return new Promise((resolve, reject) => {
    if (isAll) {
      contract.methods
        .withdrawAll()
        .send({ from: address })
        .on('transactionHash', function (hash) {
          transactionToast(hash);
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          resolve();
        })
        .on('error', function (error) {
          console.log(error);
          reject(error);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } else {
      contract.methods
        .withdraw(amount)
        .send({ from: address })
        .on('transactionHash', function (hash) {
          transactionToast(hash);
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          resolve();
        })
        .on('error', function (error) {
          console.log(error);
          reject(error);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }
  });
};
