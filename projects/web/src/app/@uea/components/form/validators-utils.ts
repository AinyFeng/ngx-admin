import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

/**
 * 表单验证工具类
 */
export class ValidatorsUtils {
  /**
   * 验证输入的名称是否符合要求
   * 1. 必须是汉子或英文
   * 2. 不能有数字
   * 3. 长度不能超过30个字符
   * @param name
   */
  static validateInputName(name: string): ValidatorFn {
    const msg =
      '姓名可为汉字或者英文（30位以内），英文不限大小写且首尾必须是字母，可用空格或\'.\'';
    const msg2 = '姓名不可全部为 ... ';
    const chinReg = /^[.*\u4e00-\u9fa5*.*]+$/;
    const engReg = /^[.*a-zA-Z*.*\s*]+$/;
    const dotReg = /^\.{3,}$/;
    return (self: AbstractControl): { [key: string]: any } | null => {
      const val = self.value;
      if (val === null || val.toString().trim() === '') return null;
      const chinFlag = chinReg.test(val);
      const digitsFlag = engReg.test(val);
      const dotFlag = dotReg.test(val);
      if (!chinFlag && !digitsFlag) {
        return {
          inputError: {
            message: msg
          }
        };
      }
      if (dotFlag) {
        return {
          inputError: {
            message: msg2
          }
        };
      }
      return null;
    };
  }

  /**
   * 检查输入的手机号
   * @param name
   */
  static validatePhoneNo(name: string): ValidatorFn {
    const phoneReg = /^1[3456789]\d{9}$/;
    return (self: AbstractControl): { [key: string]: any } | null => {
      const val = self.value;
      if (val === null || val.toString().trim() === '') return null;
      if (!phoneReg.test(val)) {
        return {
          phoneError: {
            message: '输入格式有误'
          }
        };
      }
      return null;
    };
  }

  /**
   * 验证身份证是否符合要求
   * 只能验证第二代身份证
   * @param cardNo
   */
  static validateIdCardNo(cardNo: string): ValidatorFn {
    const idCardNoReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return (self: AbstractControl): { [key: string]: any } | null => {
      const val = self.value;
      if (val === null || val.toString().trim() === '') return null;
      if (self.parent === undefined) return null;
      if (self.parent.controls['idCardType'].value !== '01') return null;
      if (
        self.parent.controls['guardianIdCardType'] &&
        self.parent.controls['guardianIdCardType'].value !== '01'
      )
        return null;
      if (!idCardNoReg.test(val)) {
        return {
          idCardError: {
            message: '身份证格式有误'
          }
        };
      }
      return null;
    };
  }

  /**
   * 校验免疫接种卡卡号
   * @param cardNo
   */
  static validateImmuVacCard(cardNo: string): ValidatorFn {
    const immunityVacCardReg = new RegExp('[a-zA-Z0-9\-{0,2}]{10,20}$');
    // const immunityVacCardReg = new RegExp('[a-zA-Z0-9]{10,20}$');
    return (self: AbstractControl): { [key: string]: any } | null => {
      const val = self.value;
      // console.log('输入的值', val);
      if (val === null || val.toString().trim() === '') return null;
      // console.log('验证是否通过', !immunityVacCardReg.test(val));
      if (!immunityVacCardReg.test(val)) {
        return {
          immuVacCardError: {
            message: '免疫卡号格式不正确'
          }
        };
      }
      return null;
    };
  }
}
