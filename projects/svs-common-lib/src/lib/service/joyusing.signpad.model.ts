/**
 * 捷宇星身份证读取实体类
 */
export class JiexingIdCardModel {
  name: string;
  sex: string;
  nation: string;
  addr: string;
  birth: string;
  id_num: string;
  base64_ID: string;
  validityTime: string;
  depart: string;
}

export enum SignErrorMsg {
  '成功',
  '输入参数错误' = -1,
  '签字超时' = -2,
  '打开签字板失败' = -3,
  '写数据错误' = -4,
  '读数据错误' = -5,
  '告知书文件不存在' = -6,
  '签字板返回错误信息' = -7,
  '读取文件错误' = -8,
  '取消签字板操作' = -9,
  '内存不足，内存错误' = -10
}
