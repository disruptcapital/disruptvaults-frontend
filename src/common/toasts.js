import { toast } from 'react-toastify';
import { getNetworkTxUrl } from 'common/getNetworkData';

const TransactionToast = (hash) => (
  <div>
    {`Your transaction has been submitted to the the network. You can check your status `}
    <a href={getNetworkTxUrl(hash)} target="_blank" rel="noreferrer">
      here
    </a>
  </div>
);

export const messageToast = (message) => {
  toast(message, {
    position: 'top-right',
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const transactionToast = (hash) => {
  messageToast(TransactionToast(hash));
};
