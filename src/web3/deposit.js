import { vaultABI } from 'configure';
import { transactionToast } from 'common/toasts';

export const deposit = async ({ web3, address, vaultAddress, amount, isAll }) => {
  const contract = new web3.eth.Contract(vaultABI, vaultAddress);
  const data = await _deposit({ contract, address, amount, isAll });
  return data;
};

const _deposit = ({ contract, address, amount, isAll }) => {
  return new Promise((resolve, reject) => {
    if (isAll) {
      contract.methods
        .depositAll()
        .send({ from: address })
        .on('transactionHash', function (hash) {
          transactionToast(hash);
        })
        .on('receipt', function (receipt) {
          resolve();
        })
        .on('error', function (error) {
          reject(error);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      contract.methods
        .deposit(amount)
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
