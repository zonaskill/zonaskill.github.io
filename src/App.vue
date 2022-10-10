<template>
  <div id="app">
    <div class="container">
      <h1>Payment link generator</h1>

      <el-row :gutter="10">
        <el-col :xs="24" :md="24" :lg="12">
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
                <div class="dropdown-item" v-for="item in assets" :key="item.asset_id" :command="item.asset_id" @click="onAssetChoose(item)">
                  <img :src="item.icon_url" :alt="item.symbol" />
                  <span>{{ item.symbol }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import assets from './assets/data.json';
export default {
  name: 'App',
  components: {},
  data() {
    return {
      assets: assets.sort((itemA, itemB) => Number(itemB.price_usd) - Number(itemA.price_usd)),

      assetId: 'fd11b6e3-0b87-41f1-a41f-f0e9b49e5bf0',

      isAssetPickerShow: false,
    };
  },
  computed: {
    currentAsset() {
      return this.assets.find(item => item.asset_id === this.assetId);
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

  @media (min-width: 576px) {
    max-width: 540px;
  }

  @media (min-width: 768px) {
    max-width: 720px;
  }

  @media (min-width: 992px) {
    max-width: 960px;
  }
}

#app {
  margin-top: 60px;
}

.dropdown {
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
</style>
