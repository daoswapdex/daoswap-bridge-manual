<template>
  <div>
    <v-app-bar app color="#93B954" dark>
      <v-btn text to="/">
        <v-img
          alt="Daoswap"
          class="shrink mr-2"
          contain
          :src="require('@/assets/logo-white.png')"
          transition="scale-transition"
          width="40"
        />
        <span class="text-md-h5 text-sm-body-2 hidden-sm-and-down"
          >Daoswap</span
        >
      </v-btn>
      <v-spacer></v-spacer>
      <v-tabs
        class="hidden-sm-and-down mr-2"
        optional
        background-color="transparent"
      >
        <v-tab to="/">{{ $t("Home") }}</v-tab>
        <!-- <v-tab to="/angel">{{ $t("Angel") }}</v-tab> -->
        <v-tab to="/pe">{{ $t("PE") }}</v-tab>
        <!-- <v-tab to="/about">{{ $t("About") }}</v-tab> -->
      </v-tabs>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      />
      <!-- 连接钱包 -->
      <v-btn
        class="mr-2"
        v-if="!connected"
        color="deep-orange darken-4 white--text"
        @click="onConnect"
      >
        {{ $t("Connect Wallet") }}
      </v-btn>
      <!-- 地址显示 -->
      <!-- <v-menu v-else class="mr-2" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            {{ $t("Current Token Address") }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item link>
            <v-list-item-title
              :v-text="address"
              @click="handleCopy(address, $event)"
              >{{ address }}</v-list-item-title
            >
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item link>
            <v-list-item-title
              :v-text="$t('Disconnect Wallet')"
              @click="closeWallet"
              >{{ $t("Disconnect Wallet") }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu> -->
      <!-- 多语言切换 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in localeList" :key="item.locale" link>
            <v-list-item-title
              v-text="item.title"
              @click="changeLang(item.locale)"
            ></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list shaped>
        <v-list-item-group v-model="group" color="#93B954">
          <v-list-item to="/">
            <v-list-item-title>{{ $t("Home") }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item to="/angel">
            <v-list-item-title>{{ $t("Angel") }}</v-list-item-title>
          </v-list-item> -->
          <v-list-item to="/pe">
            <v-list-item-title>{{ $t("PE") }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item to="/about">
            <v-list-item-title>{{ $t("About") }}</v-list-item-title>
          </v-list-item> -->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- 提示层 -->
    <v-snackbar
      v-model="operationResult.snackbar"
      color="success"
      top
      timeout="2000"
    >
      {{ $t(operationResult.text) }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red darken-2"
          text
          v-bind="attrs"
          @click="operationResult.snackbar = false"
        >
          {{ $t("Close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";

export default {
  name: "Header",
  data: () => ({
    // 当前包含语言
    localeList: [
      {
        locale: "zh",
        title: "中文"
      },
      {
        locale: "en",
        title: "English"
      }
    ],
    // 导航
    drawer: false,
    group: null,
    // 提示框
    operationResult: {
      snackbar: false,
      text: `Hello`
    }
  }),
  methods: {
    changeLang(locale) {
      this.$i18n.locale = locale;
    },
    // 复制地址
    handleCopy(text, event) {
      this.operationResult.snackbar = true;
      this.operationResult.text = this.$i18n.t(
        "Account address copied successfully"
      );
      clip(text, event);
    },
    // 连接钱包 OK
    onConnect() {
      this.$store.dispatch("web3/connect");
    },
    // 断开连接钱包 OK
    closeWallet() {
      this.$store.dispatch("web3/closeWallet");
    }
  },
  computed: {
    connected() {
      return this.$store.state.web3.connected;
    },
    address() {
      return this.$store.state.web3.address;
    }
  }
};
</script>
