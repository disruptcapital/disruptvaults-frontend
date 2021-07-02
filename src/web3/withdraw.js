import { vaultABI } from '../configure';
import { transactionToast, messageToast } from 'common/toasts';

export const withdraw = ({ web3, address, vaultAddress, amount, isAll }) => {
  _withdraw({ web3, address, vaultAddress, amount, isAll })
    .then((data) => {
      messageToast('Your withdrawal was successful.');
      //update balances
    })
    .catch((error) => {
      messageToast('An error occurred while withdrawing from the vault.');
    });
};

const _withdraw = ({ web3, address, vaultAddress, amount, isAll }) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(vaultABI, vaultAddress);

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
