import { applyCoupon } from "./pricing.js";

const subtotal = 33.33;
const coupon = { percent: 10 };
const result = applyCoupon(subtotal, coupon);

console.log(`subtotal: ${result.subtotal}`);
console.log(`discount: ${result.discount}`);
console.log(`total:   ${result.total}`);