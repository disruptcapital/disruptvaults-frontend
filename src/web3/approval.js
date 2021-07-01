import { erc20ABI } from 'configure';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { getNetworkTxUrl } from 'common/getNetworkData';

const ApprovalToast = (hash) => (
  <div>
    {`Approval has been submitted to the the network. You can check your status `}
    <a href={getNetworkTxUrl(hash)} target="_blank" rel="noreferrer">
      here
    </a>
  </div>
);

export const approval = ({ web3, address, depositTokenAddress, vaultAddress }) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(erc20ABI, depositTokenAddress);

    contract.methods
      .approve(vaultAddress, web3.utils.toWei('8000000000', 'ether'))
      .send({ from: address })
      .on('transactionHash', function (hash) {
        toast(ApprovalToast(hash), {
          position: 'top-right',
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });
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
