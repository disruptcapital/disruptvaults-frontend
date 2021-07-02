import { vaultABI } from 'configure';
import { transactionToast, messageToast } from 'common/toasts';

const _deposit = ({ web3, address, vaultAddress, amount, isAll }) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(vaultABI, vaultAddress);

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

export const deposit = ({ web3, address, vaultAddress, amount, isAll }) => {
  _deposit({ web3, address, vaultAddress, amount, isAll })
    .then((data) => {
      messageToast('Your deposit was successful.');
      //update balances
    })
    .catch((error) => {
      messageToast('An error occurred while depositing to the vault.');
    });
};
