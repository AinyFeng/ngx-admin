export class FieldNameUtils {
  // 下划线转换驼峰
  static toHump(name) {
    if (!name) return;
    const reg = new RegExp(/_(\w)/, 'g');
    return name.replace(reg, (all, letter) => {
      return letter.toUpperCase();
    });
  }

  // 驼峰转换下划线
  static toLine(name) {
    if (!name) return;
    const reg = new RegExp(/([A-Z])/g, '_$1');
    return name.replace(reg).toLowerCase();
  }
}
