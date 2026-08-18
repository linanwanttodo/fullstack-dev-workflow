export function applyCoupon(subtotal, coupon) {
  if (!coupon || typeof coupon.percent !== "number") {
    return { subtotal, discount: 0, total: subtotal };
  }
  if (coupon.percent < 0 || coupon.percent > 100) {
    throw new Error("coupon percent out of range");
  }
  const discount = (subtotal * coupon.percent) / 100;
  return {
    subtotal,
    discount: Math.round(discount * 100) / 100,
    total: subtotal - discount,
  };
}