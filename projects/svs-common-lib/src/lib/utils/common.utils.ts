export class CommonUtils {
  /**
   * 生成uuid 方法
   * @param len 需要的uuid的长度
   * @param radix 分隔符，比如'-'
   */
  static uuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
      ''
    );
    let uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      let r;
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  /**
   * 检查输入对象是否是空值
   * @param object
   */
  static checkJsonObjectEmpty(object: any) {
    if (object) {
      // console.log('++++++++++++');
      const keys = Object.keys(object);
      if (keys.length === 0) return true;
      return false;
    }
    return true;
  }

  /**
   * 将数字金额转大写
   * @param price
   */
  static digitUppercase(price) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    let num = Math.abs(price);
    let s = '';
    fraction.forEach((item, index) => {
      s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
        /零./,
        ''
      );
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
      let p = '';
      for (let j = 0; j < unit[1].length && num > 0; j += 1) {
        p = digit[num % 10] + unit[1][j] + p;
        num = Math.floor(num / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }

    return s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  }
}
