import { vaultABI } from 'configure';
import BigNumber from 'bignumber.js';

export const fetchPricePerFullShare = async ({ web3, address, vaultAddress }) => {
  const contract = new web3.eth.Contract(vaultABI, vaultAddress);
  const ppfs = await contract.methods.getPricePerFullShare().call({ from: address });

  return new BigNumber(ppfs);
};
