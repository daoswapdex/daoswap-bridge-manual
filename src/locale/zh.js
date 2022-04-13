import { default as zhHans } from "vuetify/lib/locale/zh-Hans";

export default {
  $vuetify: { ...zhHans },
  Hello: "Hello",

  Home: "首页",
  Swap: "兑换",
  Pool: "流动池",
  DAO: "DAO",
  Node: "节点",
  Relation: "关联关系",

  Close: "关闭",
  "No Data": "暂无数据",

  "Connect Wallet": "连接钱包",
  "Disconnect Wallet": "断开钱包连接",
  "Current Token Address": "当前钱包地址",
  "Account address copied successfully": "钱包地址复制成功",
  Approve: "授权",
  to: "到",
  usdt: "USDT",
  Claim: "提取",
  "Approve Success": "授权成功",
  "Claim Success": "提取成功",

  "DAO is offical goverance token for DAOSWAP.":
    "DAO是DAOSWAP官方社区治理代币。",
  "DAT is PE credential to exchange DAO by staking DAT.":
    "DAT是DAO的私募质押凭证，可以1比1兑换DAO。",
  "Cope Success": "复制成功",

  Status: "进展",
  Beneficiary: "受益人地址",
  Balance: "分期合约余额",
  ReleasableAmount: "可提取金额",
  Released: "已提取金额",
  Start: "开始时间",
  Duration: "释放周期",
  "Receive Amount": "得到数量",
  "Releasable Amount": "待释放",
  "Released Amount": "已释放",

  Just: "刚刚",
  "minute ago": "分钟前",
  "hour ago": "小时前",
  "1 day ago": "1天前",
  months: "月",
  weeks: "周",
  days: "天",
  hours: "时",
  minutes: "分钟",
  seconds: "秒",

  "At least": "最少",
  "At mostest": "最多",
  Operation: "操作",

  ACC: "跨链",
  "Apply Cross Chain": "跨链桥",
  "Enter the cross chain amount": "输入跨链额度",
  Apply: "申请",
  "Authorized quota": "已授权额度",
  ApplyForm: {
    "Apply Amount": "申请额度",
    "The amount exceeds the allowance amount": "金额超过账户授权额度",
    "The amount exceeds the balance": "金额超过可用账户余额",
    "The amount exceeds the max apply amount": "金额超过最大可申请额度",
    "The amount is be gt zero": "申请额度必须大于0",
    "Invalid amount": "不可用的数值",
    "The amount is required": "请填写申请额度",
    "The amount does not meet the requirements": "申请额度不符合要求"
  },
  "Apply Cross Chain Success": "申请跨链成功",
  "Not within the application time frame": "不在申请时间范围内",
  "The wallet address of BSC is the same as your HECO's, please make sure your current wallet is available in BSC before applying.":
    "BSC的钱包地址与你HECO申请的一样，请在申请前确保你当前申请的钱包在BSC可用。"
};
