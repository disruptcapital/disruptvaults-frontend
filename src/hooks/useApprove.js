import { useCallback, useState } from 'react';
import { approval } from 'web3/approval';
import { messageToast } from 'common/toasts';
import BigNumber from 'bignumber.js';

import {
  VAULT_FETCH_APPROVAL_BEGIN,
  VAULT_FETCH_APPROVAL_SUCCESS,
  VAULT_FETCH_APPROVAL_FAILURE,
} from 'constants/constants';

const useApprove = () => {
  const [status, setStatus] = useState(null);
  const [allowance, setAllowance] = useState(0);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (web3, address, depositTokenAddress, vaultAddress) => {
      setStatus(VAULT_FETCH_APPROVAL_BEGIN);
      setAllowance(null);
      setError(null);

      return approval({
        web3,
        address,
        depositTokenAddress,
        vaultAddress,
      })
        .then((data) => {
          setAllowance(new BigNumber(data));
          setStatus(VAULT_FETCH_APPROVAL_SUCCESS);
          messageToast('Approving access to the vault was successful.');
        })
        .catch((error) => {
          setError(error);
          setStatus(VAULT_FETCH_APPROVAL_FAILURE);
          messageToast('An error occurred while approving access to the vault.');
        });
    },
    [],
  );

  return { execute, status, allowance, error };
};

export default useApprove;
