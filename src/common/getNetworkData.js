import { connectors } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import {
  avalanchePools,
  avalancheStakePools,
  avaxAddressBook,
  avalancheZaps,
  bscPools,
  bscStakePools,
  bscAddressBook,
  bscZaps,
  testnetPools,
  testnetStakePools,
  testnetAddressBook,
  testnetZaps,
  fantomPools,
  fantomStakePools,
  fantomAddressBook,
  fantomZaps,
  hecoPools,
  hecoStakePools,
  hecoAddressBook,
  hecoZaps,
  nativeCoins,
  polygonPools,
  polygonStakePools,
  polygonAddressBook,
  polygonZaps,
} from 'configure';

const networkTxUrls = {
  56: (hash) => `https://bscscan.com/tx/${hash}`,
  97: (hash) => `https://testnet.bscscan.com/tx/${hash}`,
  128: (hash) => `https://hecoinfo.com/tx/${hash}`,
  43114: (hash) => `https://cchain.explorer.avax.network/tx/${hash}/token-transfers`,
  137: (hash) => `https://explorer-mainnet.maticvigil.com/tx/${hash}/token-transfers`,
  250: (hash) => `https://ftmscan.com/tx/${hash}`,
};

const networkFriendlyName = {
  56: 'BSC',
  97: 'TestNet',
  128: 'HECO',
  43114: 'AVAX',
  137: 'Polygon',
  250: 'Fantom',
};

export const getNetworkCoin = () => {
  return nativeCoins.find((coin) => coin.chainId === process.env.REACT_APP_NETWORK_ID);
};

export const getNetworkPools = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscPools;
    case '97':
      return testnetPools;
    case '128':
      return hecoPools;
    case '43114':
      return avalanchePools;
    case '137':
      return polygonPools;
    case '250':
      return fantomPools;
    default:
      return [];
  }
};

export const getNetworkTokens = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscAddressBook.tokens;
    case '97':
      return testnetAddressBook.tokens;
    case '128':
      return hecoAddressBook.tokens;
    case '43114':
      return avaxAddressBook.tokens;
    case '137':
      return polygonAddressBook.tokens;
    case '250':
      return fantomAddressBook.tokens;
    default:
      throw new Error(
        `Create address book for this chainId first. Check out https://github.com/beefyfinance/address-book`,
      );
  }
};

export const getNetworkBurnTokens = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return {
        [bscAddressBook.tokens.GARUDA.symbol]: bscAddressBook.tokens.GARUDA,
        [bscAddressBook.tokens.SDUMP.symbol]: bscAddressBook.tokens.SDUMP,
      };
    case '97':
      return {};
    case '128':
      return {};
    case '43114':
      return {};
    case '137':
      return {};
    case '250':
      return {};
    default:
      throw new Error(
        `Create address book for this chainId first. Check out https://github.com/beefyfinance/address-book`,
      );
  }
};

export const getNetworkZaps = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscZaps;
    case '97':
      return testnetZaps;
    case '128':
      return hecoZaps;
    case '43114':
      return avalancheZaps;
    case '137':
      return polygonZaps;
    case '250':
      return fantomZaps;
    default:
      return [];
  }
};

export const getNetworkStakePools = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscStakePools;
    case '97':
      return testnetStakePools;
    case '128':
      return hecoStakePools;
    case '43114':
      return avalancheStakePools;
    case '137':
      return polygonStakePools;
    case '250':
      return fantomStakePools;
    default:
      return [];
  }
};

export const getNetworkStables = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return [
        'BUSD',
        'USDT',
        'USDC',
        'DAI',
        'VAI',
        'QUSD',
        'UST',
        'VENUS BLP',
        '3EPS',
        'fUSDT',
        '4BELT',
        'IRON',
        'DOLLY',
      ];
    case '97':
      return ['BUSD'];
    case '128':
      return ['USDT', 'HUSD'];
    case '43114':
      return ['USDT', 'DAI', 'BUSD', 'zDAI', 'zUSDT'];
    case '137':
      return ['USDC', 'USDT', 'maUSDC', 'DAI', 'IRON'];
    case '250':
      return ['USDC', 'USDT', 'DAI', 'fUSDT'];
    default:
      return [];
  }
};

export const getNetworkMulticall = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return '0xB94858b0bB5437498F5453A16039337e5Fdc269C';
    case '97':
      throw 'WTF IS THIS?';
    case '128':
      return '0x2776CF9B6E2Fa7B33A37139C3CB1ee362Ff0356e';
    case '43114':
      return '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76';
    case '137':
      return '0xC3821F0b56FA4F4794d5d760f94B812DE261361B';
    case '250':
      return '0xC9F6b1B53E056fd04bE5a197ce4B2423d456B982';
    default:
      return '';
  }
};

export const getNetworkConnectors = (t) => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return {
        network: 'binance',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: 'Home-BrowserWallet',
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://bsc-dataseed.binance.org/',
                56: 'https://bsc-dataseed.binance.org/',
              },
            },
          },
          'custom-binance': {
            display: {
              name: 'Binance',
              description: 'Binance Chain Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/binance-wallet.png`,
            },
            package: 'binance',
            connector: async (ProviderPackage, options) => {
              const provider = window.BinanceChain;
              await provider.enable();
              return provider;
            },
          },
          'custom-math': {
            display: {
              name: 'Math',
              description: 'Math Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/math-wallet.svg`,
            },
            package: 'math',
            connector: connectors.injected,
          },
          'custom-twt': {
            display: {
              name: 'Trust',
              description: 'Trust Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/trust-wallet.svg`,
            },
            package: 'twt',
            connector: connectors.injected,
          },
          'custom-safepal': {
            display: {
              name: 'SafePal',
              description: 'SafePal App',
              logo: `${process.env.PUBLIC_URL}/images/wallets/safepal-wallet.svg`,
            },
            package: 'safepal',
            connector: connectors.injected,
          },
        },
      };
    case '97':
      return {
        network: 'binance',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: 'Home-BrowserWallet',
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://bsc-dataseed.binance.org/',
                97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
              },
            },
          },
          'custom-binance': {
            display: {
              name: 'Binance',
              description: 'Binance Chain Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/binance-wallet.png`,
            },
            package: 'binance',
            connector: async (ProviderPackage, options) => {
              const provider = window.BinanceChain;
              await provider.enable();
              return provider;
            },
          },
          'custom-math': {
            display: {
              name: 'Math',
              description: 'Math Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/math-wallet.svg`,
            },
            package: 'math',
            connector: connectors.injected,
          },
          'custom-twt': {
            display: {
              name: 'Trust',
              description: 'Trust Wallet',
              logo: `${process.env.PUBLIC_URL}/images/wallets/trust-wallet.svg`,
            },
            package: 'twt',
            connector: connectors.injected,
          },
          'custom-safepal': {
            display: {
              name: 'SafePal',
              description: 'SafePal App',
              logo: `${process.env.PUBLIC_URL}/images/wallets/safepal-wallet.svg`,
            },
            package: 'safepal',
            connector: connectors.injected,
          },
        },
      };
    default:
      return {};
  }
};
export const getNetworkTxUrl = networkTxUrls[process.env.REACT_APP_NETWORK_ID];
export const getNetworkFriendlyName = () => networkFriendlyName[process.env.REACT_APP_NETWORK_ID];
