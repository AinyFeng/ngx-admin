/**
 * 订单状态
 */
export const ORDER_STATUS = {
  FREE: '0', // 免费
  TO_PAY: '1', // 待缴费
  PAID: '2', // 已缴费
  CANCELLED: '3', // 已取消
  VACCINATED: '8', // 已接种
  REFUND: '9' // 已退款
};

/**
 * 发票状态
 */
export const INVOICE_STATUS = {
  UNINVOICED: '0', // 未开票
  INVOICED: '1', // 已开票
  WRITE_BACK: '2' // 已冲红
};

