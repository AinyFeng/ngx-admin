export class OldDicTransformUtil {
  /**
   * svs1.0旧字典中在册状态的转换
   */
  static getProfileStatus(
    profileStatus: string,
    newStatus: any,
    oldStatus: any
  ): any {
    const situation = oldStatus['stations'];
    let status = '';
    for (const i in situation) {
      if (situation.hasOwnProperty(i)) {
        if (situation[i].value === profileStatus) {
          if (situation[i].label === '在册') {
            status = newStatus[0].value;
          }
          if (situation[i].label === '离册') {
            status = newStatus[3].value;
          }
          if (
            situation[i].label === '删除' ||
            situation[i].label === '服务器删除'
          ) {
            status = newStatus[9].value;
          }
          if (situation[i].label === '死亡') {
            status = newStatus[5].value;
          }
          if (situation[i].label === '空挂户') {
            status = newStatus[6].value;
          }
        }
      }
    }
    return status;
  }

  /**
   * svs1.0旧字典中民族的转换
   */
  static transformNationCode(
    nationCode: string,
    newNations: any,
    oldNations: any
  ): any {
    const nations = oldNations['nation'];
    let code = '';
    for (const i in nations) {
      if (nations.hasOwnProperty(i)) {
        if (nationCode === nations[i].value) {
          for (const key in newNations) {
            if (newNations.hasOwnProperty(key)) {
              if (nations[i].label === newNations[key].name) {
                code = newNations[key].code;
              }
              if (nations[i].label === '外国血统') {
                code = newNations[56].code;
              }
            }
          }
        }
      }
    }
    return code;
  }

  /**
   * 旧字典中户口类别转换
   * */
  static transformIdTypeCode(
    idTypeCode: string,
    newIdType: any,
    oldIdType: any
  ): any {
    const oldValue = oldIdType['properties'];
    let code = '';
    for (const i in oldValue) {
      if (oldValue.hasOwnProperty(i)) {
        if (idTypeCode === oldValue[i].value) {
          for (const j in newIdType) {
            if (newIdType.hasOwnProperty(j)) {
              if (oldValue[i].label === newIdType[j].label) {
                code = newIdType[j].value;
              }
            }
          }
        }
      }
    }
    return code;
  }
}
