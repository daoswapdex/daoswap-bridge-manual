import Numeral from "numeral";
import { BigNumber } from "bignumber.js";
import _Decimal from "decimal.js-light";
import toFormat from "toformat";

// format libraries
const Decimal = toFormat(_Decimal);
BigNumber.set({ EXPONENTIAL_AT: 50 });

// 脱敏方法
export function addressDesensitization(value, beforeLength, afterLength = 4) {
  if (!value) return "";

  if (!beforeLength) {
    beforeLength = 4;
  }
  if (!afterLength) {
    afterLength = 4;
  }
  value = value.toString();
  return (
    value.substring(0, beforeLength) +
    "*****" +
    value.substring(value.length - afterLength)
  );
}

export const toK = num => {
  return Numeral(num).format("0.[00]a");
};

export const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// using a currency library here in case we want to add more in future
var priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

export const toSignificant = (number, significantDigits) => {
  Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP });
  const updated = new Decimal(number).toSignificantDigits(significantDigits);
  return updated.toFormat(updated.decimalPlaces(), { groupSeparator: "" });
};

export const formattedNum = (number, usd = false) => {
  if (isNaN(number) || number === "" || number === undefined) {
    return usd ? "$0" : 0;
  }
  const num = parseFloat(number);

  if (num > 500000000) {
    return (usd ? "$" : "") + toK(num.toFixed(0), true);
  }

  if (num === 0) {
    if (usd) {
      return "$0";
    }
    return 0;
  }

  if (num < 0.0001 && num > 0) {
    return usd ? "< $0.0001" : "< 0.0001";
  }

  if (num > 1000) {
    return usd
      ? "$" + Number(parseFloat(num).toFixed(0)).toLocaleString()
      : "" + Number(parseFloat(num).toFixed(0)).toLocaleString();
  }

  if (usd) {
    if (num < 0.1) {
      return "$" + Number(parseFloat(num).toFixed(4));
    } else {
      const usdString = priceFormatter.format(num);
      return "$" + usdString.slice(1, usdString.length);
    }
  }

  return Number(parseFloat(num).toFixed(5));
};
