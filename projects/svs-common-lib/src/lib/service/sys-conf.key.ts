/**
 * 系统配置字典表键值
 */
export class SysConfKey {
  /**
   * 登记台是否签字
   */
  public static signRequired = 'signRequired';
  /**
   * 接种台核验功能
   */
  public static checkTraceCode = 'checkTraceCode';
  /**
   * 预约优先
   */
  public static regVip = 'regVip';
  /**
   * 强制确认监管码
   */
  public static isForcedConfirmCode = 'isForcedConfirmCode';
  /**
   * 是否登记叫号
   */
  public static isRegisterCall = 'isRegisterCall';
  /**
   * 科室叫号延迟[秒]
   */
  public static queueDelay = 'queueDelay';
  /**
   * 队列访问地址
   */
  public static pulsarUrl = 'pulsarUrl';
  /**
   * 自助取号打印小票
   */
  public static printQueueNoAfterRetrieving = 'printQueueNoAfterRetrieving';
  /**
   * 登记台打印登记小票
   */
  public static printQueueNoAfterRegister = 'printQueueNoAfterRegister';
  /**
   * 身份证读取的方式，默认 0 - http
   */
  public static idCardScanWay = 'idCardScanWay';
  /**
   * 签字版类型
   */
  public static signType = 'changeSignature';
  /**
   * 是否需要收银台，如果需要，则付款订单会进入到收银台缴费，如果不需要，则付款订单会直接到接种台，订单状态会修改为 4 - 无需付款
   */
  public static needPay = 'needPay';

  /**
   * 接种台冰箱配置策略，自由配置和固定配置
   */
  public static vaccinateRefrigeratorStrategy = 'vaccinateRefrigeratorStrategy';

}
