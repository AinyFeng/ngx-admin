import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

/**
 * Created by Administrator on 2019/7/11.
 */

/**
 * 工具类，提供常用的转换工具
 */
@Injectable()
export class TransformUtils {
  // /**
  //  * 日期转换工具
  //  * @param transformDate
  //  * @returns {string|null}
  //  */
  // dateTransform (transformDate: any ): any {
  //   return this.datePipe.transform(transformDate, 'yyyy-MM-dd');
  // }
  //
  // /**
  //  * 时间转换工具
  //  * @param transformDateTime
  //  * @returns {string|null}
  //  */
  //  dateTimeTransform (transformDateTime: any ): any {
  //   return this.datePipe.transform(transformDateTime, 'yyyy-MM-dd HH:mm:ss');
  // }

  /**
   * 根据生日计算年龄
   * @param birthDateTime
   * @returns age: any, month: any
   * @deprecated
   */
  static getAge(birthDateTime: number | Date | string) {
    // console.log(data);
    const birthDate = new Date(birthDateTime);
    let returnAge;
    let returnMonth;
    let birthYear = birthDate.getFullYear();
    let birthMonth = birthDate.getMonth() + 1;
    let birthDay = birthDate.getDate();

    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    if (nowYear === birthYear) {
      returnAge = 0; // 同年 则为0岁
      returnMonth = nowMonth - birthMonth; // 月之差
    } else {
      let ageDiff = nowYear - birthYear; // 年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          let dayDiff = nowDay - birthDay; // 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
            returnMonth = 11;
          } else {
            returnAge = ageDiff;
            returnMonth = 0;
          }
        } else {
          let monthDiff = nowMonth - birthMonth; // 月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
            returnMonth = nowMonth + 12 - birthMonth;
          } else {
            returnAge = ageDiff;
            returnMonth = monthDiff;
          }
        }
      } else {
        returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return {
      age: returnAge,
      month: returnAge === 0 && returnMonth === 0 ? '不满1' : returnMonth
    }; // 返回周岁年龄
  }

  /**
   * 根据 string 日期获取年龄和月龄: 20180307 -> { age: xxx, month: xxx }
   * @param date string
   */
  static getAgeAndMonthFromDateString(date: string) {
    if (!date || date.trim() === '') return;
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6);
    const dateStr = year + '-' + month + '-' + day + ' 00:00:00';
    return this.getAgeFromBirthDate(dateStr);
  }

  static getAgeAndMonth(birthDateTime: number | Date | string) {
    // console.log(data);
    const birthDate = new Date(birthDateTime);
    let returnAge;
    let returnMonth;
    let birthYear = birthDate.getFullYear();
    let birthMonth = birthDate.getMonth() + 1;
    let birthDay = birthDate.getDate();

    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    if (nowYear === birthYear) {
      returnAge = 0; // 同年 则为0岁
      returnMonth = nowMonth - birthMonth; // 月之差
    } else {
      let ageDiff = nowYear - birthYear; // 年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          let dayDiff = nowDay - birthDay; // 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
            returnMonth = 11;
          } else {
            returnAge = ageDiff;
            returnMonth = 0;
          }
        } else {
          let monthDiff = nowMonth - birthMonth; // 月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
            returnMonth = nowMonth + 12 - birthMonth;
          } else {
            returnAge = ageDiff;
            returnMonth = monthDiff;
          }
        }
      } else {
        returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return {
      age: returnAge,
      month: returnAge === 0 && returnMonth === 0 ? '不满1' : returnMonth
    }; // 返回周岁年龄
  }

  /**
   * 修改获取年龄日期
   * @param dateString
   */
  static getAgeFromBirthDate(dateString: string | Date | number) {
    const now = new Date();

    const yearNow = now.getFullYear();
    const monthNow = now.getMonth();
    const dateNow = now.getDate();

    const dob = new Date(dateString);

    const yearDob = dob.getFullYear();
    const monthDob = dob.getMonth();
    const dateDob = dob.getDate();
    let age = {};
    let monthAge;
    let dateAge;

    let yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      monthAge = monthNow - monthDob;
    else {
      yearAge--;
      monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      dateAge = dateNow - dateDob;
    else {
      monthAge--;
      dateAge = 31 + dateNow - dateDob;
      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }
    return {
      age: yearAge,
      month: monthAge,
      days: dateAge
    };
  }
}
