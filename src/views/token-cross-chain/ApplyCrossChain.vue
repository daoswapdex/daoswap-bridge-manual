<template>
  <div class="fill-height">
    <v-container v-if="web3 && connected" class="fill-height">
      <v-row justify="center">
        <v-col md="6">
          <!-- 操作 -->
          <v-card class="fill-width mt-10">
            <v-card outlined>
              <v-card-title>
                <v-avatar size="24" class="mr-2">
                  <img :src="require('@/assets/logo.png')" alt="DAO" />
                </v-avatar>
                <span class="title font-weight-bold text-h5">
                  {{ $t("Apply Cross Chain") }}
                </span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text v-if="isOpen">
                <form>
                  <v-card-text>
                    <v-text-field
                      :label="
                        `${$t(
                          'At least'
                        )} ${minApplyAmount} ${tokenSymbol}, ${$t(
                          'At mostest'
                        )} ${maxApplyAmount} ${tokenSymbol}`
                      "
                      v-model="applyAmount"
                      :error-messages="applyAmountErrors"
                      required
                      @input="$v.applyAmount.$touch()"
                      @blur="$v.applyAmount.$touch()"
                      :autofocus="applyAmountFocus"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      large
                      color="#93B954"
                      dark
                      width="80%"
                      :disabled="!(submitLoading && accountAssets.balance > 0)"
                      @click="
                        accountAssets.allowanceAmount &&
                        accountAssets.allowanceAmount >= applyAmount
                          ? submit()
                          : handleApprove()
                      "
                    >
                      {{
                        accountAssets.allowanceAmount &&
                        accountAssets.allowanceAmount >= applyAmount
                          ? $t("Apply")
                          : $t("Approve")
                      }}
                    </v-btn>
                  </v-card-actions>
                </form>
              </v-card-text>
              <v-card-text v-else>
                <v-row align="center">
                  <v-col class="subtitle-1" cols="12">
                    {{ $t("Not within the application time frame") }}
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <v-row align="center">
                  <v-col class="subtitle-2" cols="12" style="color: #ff5252">
                    {{
                      $t(
                        "The wallet address of BSC is the same as your HECO's, please make sure your current wallet is available in BSC before applying."
                      )
                    }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card>
          <!-- 当前钱包账号 -->
          <v-card justify="center" class="fill-width mt-10">
            <v-card-title>
              <span class="title font-weight-bold text-h5">
                {{ $t("Current Token Address") }}
              </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col
                  class="body-1"
                  cols="12"
                  @click="handleCopy(address, $event)"
                >
                  <p>
                    {{ address }}
                    <v-icon>mdi-content-copy</v-icon>
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- 官方说明 -->
          <v-card justify="center" class="fill-width mt-10">
            <v-card-text>
              <v-row align="center">
                <v-col class="body-1" cols="12">
                  <p @click="handleCopy(DAOAddress, $event)">
                    DAO contract: {{ DAOAddress }}
                    <v-icon>mdi-content-copy</v-icon>
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- 遮罩层 -->
          <v-overlay z-index="9999" opacity="0.7" :value="loading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <!-- 提示层 -->
          <v-snackbar
            v-model="operationResult.snackbar"
            :color="operationResult.color"
            centered
            top
            timeout="4000"
          >
            {{ $t(operationResult.text) }}
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col md="6">
          <v-card justify="center" class="fill-width">
            <v-card-actions class="justify-center">
              <!-- 连接钱包 -->
              <v-btn
                class="mr-2"
                v-if="!connected"
                color="#93B954"
                block
                @click="onConnect"
              >
                {{ $t("Connect Wallet") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, decimal } from "vuelidate/lib/validators";
import clip from "@/utils/clipboard";
import { DAOAddress, TokenCrossChainContractAddress } from "@/constants";
import {
  getContract,
  getContractByABI,
  weiToEther,
  etherToWei
} from "@/utils/web3";
import { JSBI } from "@/utils/jsbi";
// 引入合约 ABI 文件
import ERC20DAO from "@/constants/contractJson/ERC20DAO.json";
import ApplyCrossChain_ABI from "@/constants/contractJson/ApplyCrossChain_abi.json";

export default {
  name: "ApplyCrossChain",
  mixins: [validationMixin],
  validations: {
    applyAmount: { required, decimal }
  },
  data: () => ({
    loading: false,
    DAOAddress,
    tokenSymbol: "DAO",
    // 表单数据
    applyAmountFocus: true,
    applyAmount: undefined,
    // 当前账户相关信息
    accountAssets: {
      balance: 0,
      allowanceAmount: 0, // 已授权额度
      totalAmount: 0
    },
    // 合约数据
    currentDayTimestamp: 0,
    minApplyAmount: 0.01,
    maxApplyAmount: 0,
    isWhitelist: false,
    startTime: 0,
    endTime: 0,
    isOpen: false,
    // 提示框
    operationResult: {
      color: "success",
      snackbar: false,
      text: `Hello`
    }
  }),
  created() {
    if (this.web3 && this.connected) {
      this.getInfo();
    } else {
      this.onConnect();
    }
  },
  watch: {
    web3(web3) {
      if (web3) {
        this.getInfo();
      }
    },
    address(address) {
      if (address) {
        this.getInfo();
      }
    }
  },
  computed: {
    connected() {
      return this.$store.state.web3.connected;
    },
    web3() {
      return this.$store.state.web3.web3;
    },
    address() {
      return this.$store.state.web3.address;
    },
    applyAmountErrors() {
      const errors = [];
      if (!this.$v.applyAmount.$dirty) return errors;
      !this.$v.applyAmount.decimal &&
        errors.push(this.$t("ApplyForm.Invalid amount"));
      !this.$v.applyAmount.required &&
        errors.push(this.$t("ApplyForm.The amount is required"));

      const applyAmountValue = parseFloat(this.$v.applyAmount.$model);
      if (applyAmountValue <= 0) {
        errors.push(this.$t("ApplyForm.The amount is be gt zero"));
      }
      if (!this.isWhitelist) {
        if (applyAmountValue > 0 && applyAmountValue < this.minApplyAmount) {
          errors.push(
            this.$t("ApplyForm.The amount does not meet the requirements")
          );
        }
        if (parseFloat(applyAmountValue) > this.maxApplyAmount) {
          errors.push(
            this.$t("ApplyForm.The amount exceeds the max apply amount")
          );
        }
      }
      if (applyAmountValue > this.accountAssets.balance) {
        errors.push(this.$t("ApplyForm.The amount exceeds the balance"));
      }
      return errors;
    },
    submitLoading() {
      return this.applyAmount && this.applyAmountErrors.length <= 0;
    }
  },
  methods: {
    // 连接钱包 OK
    onConnect() {
      this.$store.dispatch("web3/connect");
    },
    // 断开连接钱包 OK
    closeWallet() {
      this.$store.dispatch("web3/closeWallet");
    },
    // 复制地址
    handleCopy(text, event) {
      clip(text, event);
      this.operationResult.color = "success";
      this.operationResult.snackbar = true;
      this.operationResult.text = "Cope Success";
    },
    // 获取信息
    async getInfo() {
      this.loading = true;
      try {
        // await this.getAccountAssets();
        await this.getContractInfo();
      } catch (error) {
        console.info(error);
      }
      this.loading = false;
    },
    // 获取账号信息
    async getAccountAssets() {
      // // 查询当前账号余额
      // const contractERC20DAO = getContract(ERC20DAO, DAOAddress, this.web3);
      // const balance = await contractERC20DAO.methods
      //   .balanceOf(this.address)
      //   .call();
      // const allowance = await contractERC20DAO.methods
      //   .allowance(this.address, TokenCrossChainContractAddress)
      //   .call();
      // this.accountAssets.balance = weiToEther(balance, this.web3);
      // this.accountAssets.allowanceAmount = weiToEther(allowance, this.web3);
    },
    // 获取合约信息
    async getContractInfo() {
      const contract = getContractByABI(
        ApplyCrossChain_ABI,
        TokenCrossChainContractAddress,
        this.web3
      );
      const crossTokenAddress = await contract.methods
        .crossTokenAddress()
        .call();
      // 查询当前账号余额
      const contractERC20 = getContract(ERC20DAO, crossTokenAddress, this.web3);
      const balance = await contractERC20.methods
        .balanceOf(this.address)
        .call();
      const allowance = await contractERC20.methods
        .allowance(this.address, TokenCrossChainContractAddress)
        .call();
      this.accountAssets.balance = weiToEther(balance, this.web3);
      this.accountAssets.allowanceAmount = weiToEther(allowance, this.web3);
      this.tokenSymbol = await contractERC20.methods.symbol().call();
      // get current day timestamp
      this.currentDayTimestamp = await contract.methods
        .getCurrentDayTimestamp()
        .call();
      // get apply amount limit
      // 最大每日限额 = 计算出来的每日最大限额 - 每日已申请额度
      const applyLimit = await contract.methods.getApplyLimitAmount().call({
        from: this.address
      });
      const maxAmountForDay = applyLimit[0];
      // 获取最大总申请额度
      let maxAmountForTotal = applyLimit[1];
      const timestampList = await contract.methods
        .getTimpstampListByAccount()
        .call({
          form: this.address
        });
      if (timestampList.length > 0) {
        const getResult = timestampList.map(async item => {
          const amount = await contract.methods.getApplyAmount(item).call({
            from: this.address
          });
          const diffAmountForTotal = JSBI.subtract(
            JSBI.BigInt(maxAmountForTotal),
            JSBI.BigInt(amount)
          );
          maxAmountForTotal = diffAmountForTotal.toString();
        });
        await Promise.all(getResult);
      }
      // 如果最大总申请额度大于或等于每日最大限额，以每日最大限额为准
      // 如果最大总申请额度小于每日最大限额，以最大总申请额度为准
      const realMaxAmountLimit = JSBI.lessThan(
        JSBI.BigInt(maxAmountForDay),
        JSBI.BigInt(maxAmountForTotal)
      )
        ? JSBI.greaterThanOrEqual(JSBI.BigInt(maxAmountForDay), JSBI.BigInt(0))
          ? maxAmountForDay
          : 0
        : JSBI.greaterThanOrEqual(
            JSBI.BigInt(maxAmountForTotal),
            JSBI.BigInt(0)
          )
        ? maxAmountForTotal
        : 0;

      // this.minApplyAmount = 1;
      this.maxApplyAmount = weiToEther(
        realMaxAmountLimit.toString(),
        this.web3
      );
      // get is in white list
      this.isWhitelist = await contract.methods.isWhitelist().call({
        from: this.address
      });
      // this.isWhitelist =
      //   isWhitelist &&
      //   JSBI.greaterThan(JSBI.BigInt(applyLimit[0]), JSBI.BigInt(0)) &&
      //   JSBI.greaterThan(JSBI.BigInt(applyLimit[1]), JSBI.BigInt(0));
      // get dayCap
      const dayCap = await contract.methods.dayCap().call();
      // get dayTotalAmount
      const dayTotalAmount = await contract.methods
        .getApplyDayAmount(this.currentDayTimestamp)
        .call();
      // get apply amount
      const currentDayApplyAmount = await contract.methods
        .getApplyAmount(this.currentDayTimestamp)
        .call({
          from: this.address
        });
      // get start time
      const startTime = await contract.methods.startTime().call({
        from: this.address
      });
      // get end time
      const endTime = await contract.methods.endTime().call({
        from: this.address
      });
      this.startTime = JSBI.add(
        JSBI.BigInt(startTime),
        JSBI.BigInt(this.currentDayTimestamp)
      ).toString();
      this.endTime = JSBI.add(
        JSBI.BigInt(endTime),
        JSBI.BigInt(this.currentDayTimestamp)
      ).toString();
      const nowTime = Math.floor(Date.now() / 1000);
      this.isOpen =
        JSBI.lessThanOrEqual(
          JSBI.BigInt(this.startTime),
          JSBI.BigInt(nowTime)
        ) &&
        JSBI.greaterThanOrEqual(
          JSBI.BigInt(this.endTime),
          JSBI.BigInt(nowTime)
        );
      // 计算最多可申请数量
      const remainingApplyAmount = JSBI.subtract(
        JSBI.BigInt(dayCap),
        JSBI.BigInt(dayTotalAmount)
      );
      const enableApplyAmount = JSBI.subtract(
        JSBI.BigInt(realMaxAmountLimit.toString()),
        JSBI.BigInt(currentDayApplyAmount)
      );
      this.maxApplyAmount = JSBI.lessThan(
        remainingApplyAmount,
        enableApplyAmount
      )
        ? weiToEther(
            JSBI.greaterThanOrEqual(remainingApplyAmount, JSBI.BigInt(0))
              ? remainingApplyAmount.toString()
              : "0",
            this.web3
          )
        : weiToEther(
            JSBI.greaterThanOrEqual(enableApplyAmount, JSBI.BigInt(0))
              ? enableApplyAmount.toString()
              : "0",
            this.web3
          );
    },
    // 授权
    handleApprove() {
      this.loading = true;
      // 执行合约
      getContract(ERC20DAO, DAOAddress, this.web3)
        .methods.approve(
          TokenCrossChainContractAddress,
          etherToWei(this.applyAmount, this.web3)
        )
        .send({ from: this.address })
        .then(() => {
          this.loading = false;
          this.operationResult.color = "success";
          this.operationResult.snackbar = true;
          this.operationResult.text = "Approve Success";
          this.getInfo();
        })
        .catch(e => {
          this.loading = false;
          console.info(e);
        });
    },
    // 提交
    async submit() {
      if (this.$v.$invalid) {
        // error info
        if (this.$v.applyAmount.$invalid) {
          this.applyAmountFocus = true;
        }
        this.$v.$touch();
      } else {
        this.$v.$touch();
        this.loading = true;
        getContractByABI(
          ApplyCrossChain_ABI,
          TokenCrossChainContractAddress,
          this.web3
        )
          .methods.applyCrossChain(etherToWei(this.applyAmount, this.web3))
          .send({ from: this.address })
          .then(() => {
            this.loading = false;
            this.operationResult.color = "success";
            this.operationResult.snackbar = true;
            this.operationResult.text = "Apply Cross Chain Success";
            this.getInfo();
          })
          .catch(e => {
            this.loading = false;
            console.info(e);
          });
      }
    }
  }
};
</script>

<style lang="sass">
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg
  background-color: rgb(147, 185, 84) !important
  border-color: rgb(147, 185, 84) !important
  opacity: 0.5 !important

.v-btn--disabled
  background-color: rgb(147, 185, 84) !important
  border-color: rgb(147, 185, 84) !important
  opacity: 0.5 !important
</style>
