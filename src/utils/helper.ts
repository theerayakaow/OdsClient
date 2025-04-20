import Decimal from "decimal.js";

export const MAX_WITHDRAW = new Decimal('999999999999999.99');

export const formatWithComma = (value: string, decimals = 0) => {
    const parts = value.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.length > 1
        ? `${intPart}.${parts[1].slice(0, decimals)}`
        : intPart;
};

export const formatNumber = (value: number) =>
    value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });