const RECIPIENT = '3539c3ce-52c0-4b0b-9573-c035ecb98d48';
const ETH_UUID = '43d61dcd-e413-450d-80b8-101d5e903357';
const EOS_UUID = '6cfe566e-4aad-470b-8c9a-2fd35b49c68d';
const TRX_UUID = '25dabac5-056a-48ff-b9f9-f67395dc407c';
const SCHEME_MAP = {
  'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 'bitcoin', // https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
  '43d61dcd-e413-450d-80b8-101d5e903357': 'ethereum',
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
  '64692c23-8971-4cf4-84a7-4dd1271dd887': 'solana',
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
      // 一部分钱包识别amount eg. imToken
      // 一部分钱包识别value|uint eg. MetaMask
      if (asset_id === ETH_UUID) {
        value = `${prefix}:${destination}?amount=${amount}&value=${amount}e18`;
      } else {
        value = `${prefix}:${asset_key}@1/transfer?address=${destination}&uint256=${amount}e${decimals}&amount=${amount}`;
      }
    } else if (prefix === 'solana') {
      console.log(amount);
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
  const { asset_id, chain_id, asset_key, amount, destination, decimals } = asset;
  let error = null;
  let value = null;
  if (chain_id !== ETH_UUID) {
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
    protocol    string   // 协议名，钱包用来区分不同协议，本协议为 TokenPocket
    version     string   // 协议版本信息，如2.0
    dappName    string   // dapp名字，用于在钱包APP中展示，可选
    dappIcon    string   // dapp图标Url，用于在钱包APP中展示，可选
    action      string   // 转账设置为transfer,必须
    actionId    string   // dapp 生成的，唯一标识本次操作  
    blockchain  string   // 网络  "eos evm网络 tron iost"
    blockchains array    // 网络 [{"chainId": "1","network": "ethereum"}]，如果该操作针对evm网络钱包或者eosio网络钱包，推荐使用该字段替换blockchain字段
    from        string   // 付款钱包或者账号，可选
    to          string   // 收款钱包或者账号，必须
    amount      number   // 转账数量，必须
    contract    string   
    symbol      string   
    decimal     number   // evm网络使用该字段设置转账代币的decimal,其他使用precision
    precision   number   // 转账的token的精度，小数点后面的位数，必须
    memo        string   	     
    callbackUrl string   // dapp server 用于接收操作结果，如果是deeplink或者扫二维码方式拉起钱包操作，想要接收到操作结果，该字段必须提供
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
