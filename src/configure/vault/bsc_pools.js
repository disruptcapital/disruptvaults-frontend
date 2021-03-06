export const bscPools = [
  {
    id: 'cake-DISRUPTED_TUSK_BNB',
    logo: 'images/bnb-pairs/TUSK-BNB.svg',
    name: 'TUSK-BNB LP',
    token: 'TUSK-BNB LP',
    tokenDescription: 'Pancake (Blizzard)',
    depositTokenAddress: '0x3a783A73148F3152e51864849493fe49D438aA94',
    tokenDecimals: 18,
    tokenDescriptionUrl: '#',
    earnedToken: 'DISRUPTED_TUSK_BNB',
    earnedTokenAddress: '0x34f5f8e050c71345e0DACdd00a4b38a72fdFc165',
    vaultAddress: '0x34f5f8e050c71345e0DACdd00a4b38a72fdFc165',
    pricePerFullShare: 1,
    tvl: 0,
    oracle: 'lps',
    oracleId: 'cake-btd-busd',
    oraclePrice: 0,
    depositsPaused: false,
    status: 'active',
    platform: 'Other',
    assets: ['TUSK', 'BNB'],
    callFee: 0.5,
    buyTokenUrl:
      'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xD1102332a213E21faF78B69C03572031F3552c33&outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    busdDepositTokenPath: [
      '0x3a783A73148F3152e51864849493fe49D438aA94',
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    ],
    multicall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
    depositDescription:
      'You will receive TUSK-BNB token as a receipt for your deposited TUSK-BNB LP assets. This token is needed to withdraw your TUSK-BNB LP.',
    withdrawDescription: 'Redeem disruptTUSK token for TUSK',
  },
  {
    id: 'cake-DISRPTD_RBTCAKE',
    logo: 'images/single-assets/CAKE.svg',
    name: 'CAKE',
    token: 'CAKE',
    tokenDescription: 'Cake (Rabbit)',
    depositTokenAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    tokenDecimals: 18,
    tokenDescriptionUrl: '#',
    earnedToken: 'CAKE',
    earnedTokenAddress: '0x4B1922cFbD72276ade6a05564D240508720cCc63',
    vaultAddress: '0x4B1922cFbD72276ade6a05564D240508720cCc63',
    pricePerFullShare: 1,
    tvl: 0,
    oracle: 'lps',
    oracleId: 'cake-btd-busd',
    oraclePrice: 0,
    depositsPaused: false,
    status: 'active',
    platform: 'Other',
    assets: ['CAKE'],
    callFee: 0.5,
    buyTokenUrl:
      'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xD1102332a213E21faF78B69C03572031F3552c33&outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    busdDepositTokenPath: ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
    multicall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
    depositDescription:
      'You will receive CAKE-BNB token as a receipt for your deposited CAKE-BNB LP assets. This token is needed to withdraw your CAKE-BNB LP.',
    withdrawDescription: 'Redeem disruptCAKE token for CAKE',
  },
];
