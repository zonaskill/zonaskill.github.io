<template>
  <div id="app">
    <div class="container">
      <h1>Payment link generator</h1>

      <el-row :gutter="10">
        <el-col>
          <el-dropdown @command="handleCommand">
            <div class="dropdown-toggler">
              <div class="dropdown-toggler-container" v-if="!currentAsset">Select</div>
              <div class="dropdown-toggler-container" v-else>
                <img :src="currentAsset.icon_url" :alt="currentAsset.symbol" />
                <span>{{ currentAsset.symbol }}</span>
              </div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in assets" :key="item.asset_id" :command="item.asset_id">
                <div class="dropdonw-item-container">
                  <img :src="item.icon_url" :alt="item.symbol" />
                  <span>{{ item.symbol }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      assets: assets,

      assetId: '',
    };
  },
  computed: {
    currentAsset() {
      return this.assets.find(item => item.asset_id === this.assetId);
    },
  },
  mounted() {
  },
  methods: {
    handleCommand(command) {
      this.assetId = command;
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
</style>
