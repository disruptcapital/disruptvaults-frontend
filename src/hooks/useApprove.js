import {useCallback, useEffect, useState} from 'react';
import { approval } from 'web3/approval';
import { toast } from 'react-toastify';

import {
    VAULT_FETCH_APPROVAL_BEGIN,
    VAULT_FETCH_APPROVAL_SUCCESS,
    VAULT_FETCH_APPROVAL_FAILURE,
  } from 'constants/constants';

const useApprove = () => {
    const [status, setStatus] = useState(null);
    const [allowance, setAllowance] = useState(0);
    const [error, setError] = useState(null);

    const execute = useCallback((web3, address, depositTokenAddress, vaultAddress) => {
      setStatus(VAULT_FETCH_APPROVAL_BEGIN);
      setAllowance(null);
      setError(null);

      return approval({
        web3,
        address,
        depositTokenAddress,
        vaultAddress,
      })
        .then(data => {
          setAllowance(data);
          setStatus(VAULT_FETCH_APPROVAL_SUCCESS);
          toast('Approving access to the vault was successful.', {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
        })
        .catch(error => {
          setError(error);
          setStatus(VAULT_FETCH_APPROVAL_FAILURE);
          toast('An error occurred while approving access to the vault.', {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
        });
    }, [approval]);

    return { execute, status, allowance, error };
  };

  export default useApprove;