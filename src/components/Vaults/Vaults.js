import React from 'react';
import { getNetworkPools } from 'common/getNetworkData';
import Vault from './Vault';

const Vaults = (props) => {
  let pools = getNetworkPools();

  return (
    <div className="d-flex flex-wrap">
      {pools.map((pool) => (
        <Vault pool={pool}></Vault>
      ))}
    </div>
  );
};

export default Vaults;
