const RECIPIENT = '3539c3ce-52c0-4b0b-9573-c035ecb98d48';
const ETH_UUID = '43d61dcd-e413-450d-80b8-101d5e903357';
const EOS_UUID = '6cfe566e-4aad-470b-8c9a-2fd35b49c68d';
const TRX_UUID = '25dabac5-056a-48ff-b9f9-f67395dc407c';
const SCHEME_MAP = {
  'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 'bitcoin', // https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
  '43d61dcd-e413-450d-80b8-101d5e903357': 'ethereum', // https://eips.ethereum.org/EIPS/eip-681
  '17f78d7c-ed96-40ff-980c-5dc62fecbc85': 'binancecoin',
  'eea900a8-b327-488c-8d8d-1428702fe240': 'mobilecoin',
  '05c5ac01-31f9-4a69-aa8a-ab796de1d041': 'monero',
  'fd11b6e3-0b87-41f1-a41f-f0e9b49e5bf0': 'bitcoincash',
  '574388fd-b93f-4034-a682-01c2bc095d17': 'bitcoinsv',
  '76c802a2-7c88-447f-a93e-c29c9e5dd9c8': 'litecoin',
  '6472e7e3-75fd-48b6-b1dc-28d294ee1476': 'dash',
  '23dfb5a5-5d7b-48b6-905f-3970e3176e27': 'ripple',
  'c996abc9-d94e-4494-b1cf-2a3fd3ac5714': 'zcash',
  'a2c5d22b-62a2-4c13-b3f0-013290dbac60': 'horizen',
  '56e63c06-b506-4ec5-885a-4a5ac17b83c1': 'stellar',
  '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': 'dogecoin',
  '64692c23-8971-4cf4-84a7-4dd1271dd887': 'solana', // https://docs.solanapay.com/spec
};

const BIT_KEEP_CHAIN_MAP = {
  '43d61dcd-e413-450d-80b8-101d5e903357': 'eth',
  'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 'btc',
  '64692c23-8971-4cf4-84a7-4dd1271dd887': 'sol',
  '25dabac5-056a-48ff-b9f9-f67395dc407c': 'trx',
  '17f78d7c-ed96-40ff-980c-5dc62fecbc85': 'bnb',
  '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': 'doge',
  '6cfe566e-4aad-470b-8c9a-2fd35b49c68d': 'eos',
  'd243386e-6d84-42e6-be03-175be17bf275': 'ckb',
  '6472e7e3-75fd-48b6-b1dc-28d294ee1476': 'dash',
  '882eb041-64ea-465f-a4da-817bd3020f52': 'ar',
};

const TRUST_CHAIN_MAP = {
  //https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  'c6d0c728-2624-429b-8e0d-d9d19b6592fa': '0', // BTC
  '43d61dcd-e413-450d-80b8-101d5e903357': '60', // ETH
  '25dabac5-056a-48ff-b9f9-f67395dc407c': '195', // TRX
  '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': '3', // DOGE
  '6cfe566e-4aad-470b-8c9a-2fd35b49c68d': '194', // EOS
  '64692c23-8971-4cf4-84a7-4dd1271dd887': '501', // SOL
  '54c61a72-b982-4034-a556-0d99e3c21e39': '354', // DOT
  'd243386e-6d84-42e6-be03-175be17bf275': '309', // CKB
  '1949e683-6a08-49e2-b087-d6b72398588f': '9006', // BSC
  'b7938396-3f94-4e0a-9179-d3440718156f': '966', // Polygon MATIC
};

export const callScheme = asset => {
  const { asset_id, chain_id, amount, destination, tag, asset_key, decimals } = asset;
  const prefix = SCHEME_MAP[chain_id];
  let error = null;
  let value = null;
  if (prefix) {
    if (prefix === 'bitcoin') {
      value = `bitcoin:${destination}?amount=${amount}`;
    } else if (prefix === 'ethereum') {
      // ?????????????????????amount eg. imToken
      // ?????????????????????value|uint eg. MetaMask
      if (asset_id === ETH_UUID) {
        value = `${prefix}:${destination}?amount=${amount}&value=${amount}e18`;
      } else {
        value = `${prefix}:${asset_key}@1/transfer?address=${destination}&uint256=${amount}e${decimals}&amount=${amount}`;
      }
    } else if (prefix === 'solana') {
      value = `${prefix}:${destination}?amount=${amount}`;
    } else {
      value = `${prefix}:${destination}?amount=${amount}&asset=${asset_id}&recipient=${RECIPIENT}&memo=${encodeURIComponent(tag)}`;
    }
  } else {
    error = 'This crypto does not support "Scan to pay"';
  }
  return { error, value };
};

export const callMetaMask = asset => {
  // https://metamask.github.io/metamask-deeplinks/
  const { asset_id, chain_id, asset_key, amount, destination, decimals } = asset;
  let error = null;
  let value = null;
  if (chain_id === ETH_UUID) {
    if (asset_id === ETH_UUID) {
      value = `https://metamask.app.link/send/${destination}?value=${amount}e18`;
    } else {
      value = `https://metamask.app.link/send/${asset_key}/transfer?address=${destination}&uint256=${amount}e${decimals}`;
    }
  } else {
    error = 'This crypto does not support MetaMask';
  }
  return { error, value };
};

export const callMixin = asset => {
  // https://developers.mixin.one/docs/schema
  const { amount, asset_id } = asset;
  return {
    error: null,
    value: `mixin://pay?amount=${amount}&asset=${asset_id}&recipient=${RECIPIENT}`,
  };
};

export const callTokenPocket = asset => {
  // https://github.com/TP-Lab/tp-wallet-sdk
  const { chain_id, asset_key, symbol, amount, destination, tag, decimals } = asset;
  /**
    protocol    string   // ????????????????????????????????????????????????????????? TokenPocket
    version     string   // ????????????????????????2.0
    dappName    string   // dapp????????????????????????APP??????????????????
    dappIcon    string   // dapp??????Url??????????????????APP??????????????????
    action      string   // ???????????????transfer,??????
    actionId    string   // dapp ????????????????????????????????????  
    blockchain  string   // ??????  "eos evm?????? tron iost"
    blockchains array    // ?????? [{"chainId": "1","network": "ethereum"}]????????????????????????evm??????????????????eosio??????????????????????????????????????????blockchain??????
    from        string   // ?????????????????????????????????
    to          string   // ?????????????????????????????????
    amount      number   // ?????????????????????
    contract    string   
    symbol      string   
    decimal     number   // evm??????????????????????????????????????????decimal,????????????precision
    precision   number   // ?????????token?????????????????????????????????????????????
    memo        string   	     
    callbackUrl string   // dapp server ????????????????????????????????????deeplink????????????????????????????????????????????????????????????????????????????????????????????????
   */
  const params = {
    protocol: 'TokenPocket',
    version: '2.0',
    action: 'transfer',
    to: destination,
    amount: amount,
    contract: asset_key,
    symbol: symbol,
    memo: tag,
  };
  if (chain_id === ETH_UUID) {
    params.blockchains = [{ chainId: '1', network: 'ethereum' }];
    params.decimal = decimals;
    return { error: null, value: `tpoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}` };
  }
  if (chain_id === EOS_UUID) {
    params.blockchain = 'eos';
    params.precision = decimals;
    return { error: null, value: `tpoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}` };
  }

  if (chain_id === TRX_UUID) {
    params.blockchain = 'tron';
    params.precision = decimals;
    return { error: null, value: `tpoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}` };
  }

  return { error: 'This crypto does not support TokenPocket', value: null };
};

export const callBitKeep = asset => {
  // https://docs.bitkeep.com/guide/mobile/Deeplink.html#send-the-transaction
  const { asset_id, chain_id, asset_key, amount, destination, tag, symbol } = asset;
  const params = {
    action: 'send',
    to: destination,
    amount,
    symbol: symbol.toLowerCase(),
  };
  if (asset_id === chain_id) {
    // params.contract = '0x';
  } else {
    params.contract = asset_key;
  }
  if (tag) {
    params.memo = tag;
  }
  if (BIT_KEEP_CHAIN_MAP[chain_id]) {
    params.chain = BIT_KEEP_CHAIN_MAP[chain_id];
    return {
      error: null,
      value:
        'https://bkcode.vip?' +
        Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&'),
    };
  } else {
    return {
      error: 'This crypto does not support BitKeep',
      value: null,
    };
  }
};

export const callTrustWallet = asset => {
  // https://developer.trustwallet.com/deeplinking
  const { asset_id, chain_id, asset_key, amount, destination, tag } = asset;
  if (!TRUST_CHAIN_MAP[chain_id]) {
    return {
      error: 'This crypto does not support trust wallet',
      value: null,
    };
  }
  let url = `https://link.trustwallet.com/send?address=${destination}&amount=${amount}&memo=${tag}`;
  if (asset_id === chain_id) {
    url += `&asset=c${TRUST_CHAIN_MAP[chain_id]}`;
  } else {
    url += `&asset=c${TRUST_CHAIN_MAP[chain_id]}_t${asset_key}`;
  }
  return {
    error: null,
    value: url,
  };
};

export const callTonKepper = asset => {
  const { asset_id, amount, destination } = asset;
  if (asset_id !== 'ef660437-d915-4e27-ad3f-632bfb6ba0ee') {
    return {
      error: 'This crypto does not support Tonkeeper',
      value: null,
    };
  }
  let url = `https://app.tonkeeper.com/transfer/${destination}?amount=${amount * 1000000000}`;
  return {
    error: null,
    value: url,
  };
};
