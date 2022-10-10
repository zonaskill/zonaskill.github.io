<template>
  <div id="app">
    <div class="container">
      <h1>Payment link generator</h1>

      <el-row :gutter="10">
        <el-col :xs="24" :md="12">
          <div class="dropdown">
            <div class="dropdown-toggler" @click="onAssetPickerChange">
              <div class="dropdown-toggler-container" v-if="!currentAsset">Select</div>
              <div class="dropdown-toggler-container" v-else>
                <img :src="currentAsset.icon_url" :alt="currentAsset.symbol" />
                <span>{{ currentAsset.symbol }}</span>
              </div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>

            <div class="dropdown-menu" v-show="isAssetPickerShow">
              <div class="dropdown-menu-container">
                <div class="dropdown-item" v-for="item in assets" :key="item.asset_id" @click="onAssetChoose(item)">
                  <img :src="item.icon_url" :alt="item.symbol" />
                  <span>{{ item.symbol }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :md="12">
          <div class="dropdown">
            <div class="dropdown-toggler" @click="onPaymentMethodsPickerChange">
              <div class="dropdown-toggler-container" v-if="!currentPaymentMethod">Select</div>
              <div class="dropdown-toggler-container" v-else>
                <img :src="currentPaymentMethod.icon" :alt="currentPaymentMethod.name" />
                <span>{{ currentPaymentMethod.name }}</span>
              </div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>

            <div class="dropdown-menu" v-show="isPaymentMethodPickerShow">
              <div class="dropdown-menu-container">
                <div class="dropdown-item" v-for="item in paymentMethods" :key="item.value" @click="onPaymentMethodChoose(item)">
                  <img :src="item.icon" :alt="item.name" />
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="btn-group">
        <el-button type="primary" @click="onURLGenerate">Generate URL</el-button>
      </div>

      <div class="result" v-if="qrcodeValue">
        <el-link type="primary" @click="copyText(qrcodeValue)" :underline="false">
          {{ qrcodeValue }}
        </el-link>
        <qriously v-if="navEnv.isInDesktop" class="qrcode-wrapper" :value="qrcodeValue" :size="500" level="H" />
        <div class="result-btn" v-else>
          <el-button type="primary" @click="openApp">Open App</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assets from './assets/data.json';
import { getParser } from 'bowser';

function copy(str) {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('style', 'visibility: inherit;height: 1px;z-index: -1000;position: absolute;top: 0;');
  hiddenInput.setAttribute('class', 'needsclick');
  hiddenInput.contentEditable = true;
  hiddenInput.value = str;
  document.body.appendChild(hiddenInput);
  if (hiddenInput.select) {
    hiddenInput.select();
  }
  if (hiddenInput.setSelectionRange) {
    hiddenInput.setSelectionRange(0, hiddenInput.value.length);
  }
  const result = document.execCommand('copy');
  hiddenInput.remove();

  if (!result) {
    prompt('请手动复制以下内容', str); // eslint-disable-line no-alert
    return false;
  }

  return true;
}

export default {
  name: 'App',
  data() {
    return {
      assets: assets,
      assetId: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
      isAssetPickerShow: false,

      paymentMethods: [
        {
          icon: require('./assets/general-scheme.png'),
          name: 'General Scheme',
          value: 'scheme',
        },
        {
          icon: 'https://metamask.io/icons/icon-48x48.png',
          name: 'MetaMask',
          value: 'metamask',
        },
      ],
      paymentMethod: 'scheme',
      isPaymentMethodPickerShow: false,

      qrcodeValue: '',
    };
  },
  computed: {
    currentAsset() {
      return this.assets.find(item => item.asset_id === this.assetId);
    },

    currentPaymentMethod() {
      return this.paymentMethods.find(item => item.value === this.paymentMethod);
    },

    navEnv() {
      const result = getParser(navigator.userAgent);
      const obj = {};
      obj.isInDesktop = result.parsedResult.platform.type === 'desktop';
      obj.isInAndroid = result.parsedResult.os.name === 'Android';
      obj.isInIos = result.parsedResult.os.name === 'iOS';
      return obj;
    },
  },
  methods: {
    onAssetPickerChange() {
      this.isAssetPickerShow = !this.isAssetPickerShow;
    },
    onAssetChoose(item) {
      this.assetId = item.asset_id;
      this.isAssetPickerShow = false;
    },

    onPaymentMethodsPickerChange() {
      this.isPaymentMethodPickerShow = !this.isPaymentMethodPickerShow;
    },
    onPaymentMethodChoose(item) {
      this.paymentMethod = item.value;
      this.isPaymentMethodPickerShow = false;
    },

    copyURL() {},

    onURLGenerate() {
      const { currentAsset, paymentMethod } = this;
      if (paymentMethod === 'scheme') {
        const schemeMap = {
          'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 'bitcoin',
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
        };
        const { asset_id, chain_id, amount, destination, tag } = currentAsset;
        const prefix = schemeMap[chain_id];
        if (!prefix) {
          this.$message({
            message: 'This crypto does not support General Scheme',
            type: 'error',
          });
          return;
        }

        this.qrcodeValue = `${prefix}:${destination}?amount=${
          amount || 1
        }&asset=${asset_id}&recipient=3539c3ce-52c0-4b0b-9573-c035ecb98d48&memo=${encodeURIComponent(tag)}`;
        return;
      }

      if (paymentMethod === 'metamask') {
        const { asset_id, chain_id, asset_key, amount, destination, decimals } = currentAsset;
        if (chain_id !== '43d61dcd-e413-450d-80b8-101d5e903357') {
          this.$message({
            message: 'This crypto does not support MetaMask',
            type: 'error',
          });
          return;
        }
        if (asset_id === '43d61dcd-e413-450d-80b8-101d5e903357') {
          this.qrcodeValue = `https://metamask.app.link/send/${destination}?value=${amount || 1}e18`;
          return;
        }
        this.qrcodeValue = `https://metamask.app.link/send/${asset_key}/transfer?address=${destination}&unit256=${amount || 1}e${decimals || 18}`;
        return;
      }
    },

    openApp() {
      window.location.href = this.qrcodeValue;
    },

    copyText(str) {
      if (copy(str)) {
        this.$message({
          message: 'Copied!',
          type: 'success',
        });
      }
    },
  },
};
</script>

<style lang="stylus">
body {
  margin: 0px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-weight: normal;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

.container {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: auto;
  margin-right: auto;

  @media only screen and (min-width: 576px) {
    max-width: 540px;
  }

  @media only screen and (min-width: 768px) {
    max-width: 720px;
  }

  @media only screen and (min-width: 992px) {
    max-width: 960px;
  }
}

#app {
  padding: 60px 0;
}

.dropdown {
  margin-top: 40px;
  position: relative;

  .dropdown-toggler {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #DCDFE6;
    height: 40px;
    padding: 0 16px;
    border-radius: 4px;
  }

  .dropdown-toggler-container {
    display: flex;
    align-items: center;

    img {
      margin-right: 8px;
      width: 28px;
      height: 28px;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    background: #fff;

    .dropdown-menu-container {
      max-height: 300px;
      overflow: hidden scroll;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      margin: 4px 0;
      height: 40px;
      padding: 0 16px;

      img {
        margin-right: 8px;
        width: 28px;
        height: 28px;
      }
    }
  }
}

.btn-group {
  margin-top: 40px;
  text-align: center;
}

.result {
  margin-top: 40px;
  text-align: center;

  a {
    word-break: break-all;
  }

  .qrcode-wrapper {
    margin: 40px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;

    canvas {
      width: 300px;
      height: 300px;
    }
  }

  .result-btn {
    margin-top: 40px;
  }
}
</style>
