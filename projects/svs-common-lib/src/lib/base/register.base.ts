//
export const REG_QUEUE_ACTION = {
  GET_CALL_NUMBER: '0', // 取号
  REGISTER_CALL: '1', // 登记台叫号
  REGISTER_PASS: '2', // 登记台过号
  REGISTER_CONFIRM: '3', // 确认登记
  PAYED_CALL: '4', // 缴费叫号
  PAYED_COMPLETE: '5', // 缴费完成
  VACCINATE_CALL: '6', // 接种叫号
  VACCINATE_PASS: '7', // 接种过号
  VACCINATE_CONFIRM: '8', // 接种完成
  OBSERVATION_CONFIRM: '10', // 留观确认
  CANCEL_CALL_NUMBER: '11' // 取消排号
};

// 顺序： 待登记 --- 登记中 --- 待缴费 ---- 待接种  --- 接种中 --- 接种完成 --- 留观中 --- 留观确认 --- 结束（已取消）
//                   | ---- 待接种 ----------------
export const REG_QUEUE_STATUS = {
  TO_REGISTER: '0', // 待登记
  REGISTERING: '1', // 登记中
  TO_PAY: '3', // 待缴费
  PAYING: '4', // 缴费中
  TO_VACCINATE: '6', // 待接种
  VACCINATING: '7', // 接种中，
  VACCINATED: '8', // 接种完成
  OBSERVING: '9', // 留观中
  OBSERVATION_CONFIRM: '11', // 留观确认
  CANCEL_STATUS: '12' // 已取消
};

export const REG_QUEUE_PASS_STATUS = {
  PASS: '1',
  AVAILABLE: '0'
};

export const QUEUE_ROOM_TYPE = {
  regist: '0',
  vaccinate: '1',
  observation: '2',
  pay: '3'
};
