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
                <span>{{ currentAsset.amount }} {{ currentAsset.display_symbol }}</span>
              </div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>

            <div class="dropdown-menu" v-show="isAssetPickerShow">
              <div class="dropdown-menu-container">
                <div class="dropdown-item" v-for="item in assets" :key="item.asset_id" @click="onAssetChoose(item)">
                  <img :src="item.icon_url" :alt="item.symbol" />
                  <span>{{ item.amount }} {{ item.display_symbol }}</span>
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
import copy from './assets/copy-text';
import { callScheme, callMetaMask, callMixin, callTokenPocket, callBitKeep, callTrustWallet, callTonKepper } from './assets/call-app';

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
          name: 'Scan to pay',
          value: 'scheme',
        },
        {
          icon: 'https://metamask.io/icons/icon-48x48.png',
          name: 'MetaMask',
          value: 'metamask',
        },
        {
          icon: 'https://tokenpocket.pro/favicon.png',
          name: 'Token Pocket',
          value: 'tokenpocket',
        },
        {
          icon: 'https://mixin.one/assets/icons/favicon.ico',
          name: 'Mixin Messenger',
          value: 'mixin',
        },
        {
          icon: 'https://docs.bitkeep.com/bitkeep-icon.svg',
          name: 'BitKeep',
          value: 'bitkeep',
        },
        {
          icon: 'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F2744446184-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-LeGDgApX5LA1FGVGo-z%252Favatar.png%3Fgeneration%3D1557214716602218%26alt%3Dmedia',
          name: 'Trust Wallet',
          value: 'trust',
        },
        {
          icon: 'https://tonkeeper.com/assets/favicon.png',
          name: 'Tonkeeper',
          value: 'tonkeeper',
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
      this.isPaymentMethodPickerShow = false;
      this.isAssetPickerShow = !this.isAssetPickerShow;
    },
    onAssetChoose(item) {
      this.assetId = item.asset_id;
      this.isAssetPickerShow = false;
    },

    onPaymentMethodsPickerChange() {
      this.isAssetPickerShow = false;
      this.isPaymentMethodPickerShow = !this.isPaymentMethodPickerShow;
    },
    onPaymentMethodChoose(item) {
      this.paymentMethod = item.value;
      this.isPaymentMethodPickerShow = false;
    },

    onURLGenerate() {
      const { currentAsset, paymentMethod } = this;
      let func = null;
      switch (paymentMethod) {
        case 'scheme':
          func = callScheme;
          break;
        case 'metamask':
          func = callMetaMask;
          break;
        case 'mixin':
          func = callMixin;
          break;
        case 'tokenpocket':
          func = callTokenPocket;
          break;
        case 'bitkeep':
          func = callBitKeep;
          break;
        case 'trust':
          func = callTrustWallet;
          break;
        case 'tonkeeper':
          func = callTonKepper;
          break;
        default:
          func = () => ({ error: 'Not Support', value: null });
      }

      const { error, value } = func(currentAsset);
      if (error) {
        return this.$message({
          message: error,
          type: 'warning',
        });
      }
      this.qrcodeValue = value;
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
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

.container {
  box-sizing: border-box;
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
