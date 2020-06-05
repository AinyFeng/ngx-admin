// import { Moment } from 'moment';
// const moment = require('moment');
import * as moment_ from 'moment';

const moment = moment_;

export class DateUtils {
  public static calDays(t1: number, t2: number) {
    const t = Math.abs(t1 - t2);
    console.log(t);
    const hours = t / (1000 * 60 * 60);
    console.log(hours);
    let days = Math.floor(hours / 24);
    const leftHours = Math.floor(hours % 24);
    return { days: days, hours: leftHours };
  }

  public static getFormatDateTime(d: any) {
    if (!d) return;
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const days = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month > 9 ? month : '0' + month}-${
      days > 9 ? days : '0' + days
    } ${hours > 9 ? hours : '0' + hours}:${
      minutes > 9 ? minutes : '0' + minutes
    }:${seconds > 9 ? seconds : '0' + seconds}`;
  }

  public static getNewDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const days = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month > 9 ? month : '0' + month}-${
      days > 9 ? days : '0' + days
    } ${hours > 9 ? hours : '0' + hours}:${
      minutes > 9 ? minutes : '0' + minutes
    }:${seconds > 9 ? seconds : '0' + seconds}`;
  }

  /**
   *
   * @param date
   */
  public static formatStartDate(date: Date) {
    if (!date) return;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month > 9 ? month : '0' + month}-${
      day > 9 ? day : '0' + day
    } 00:00:00`;
  }

  /**
   * 选择时结束时间带23:59:59
   *
   */
  public static formatEndDate(date: Date) {
    if (!date) return;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month > 9 ? month : '0' + month}-${
      day > 9 ? day : '0' + day
    } 23:59:59`;
  }

  /**
   *
   * @param d
   */
  public static formatToDate(d: Date | number) {
    if (!d) return;
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month > 9 ? month : '0' + month}-${
      day > 9 ? day : '0' + day
    }`;
  }

  /**
   * 判断单双周
   * @param date Date对象
   */
  static getWeekNumber(date: Date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // @ts-ignore
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  /**
   * 计算输入日期与当前日期之间 的天数
   * @param selectedDate
   */
  static countDaysBetweenSelectDateAndCurrentDate(selectedDate: Date) {
    const todayTime = new Date().getTime();
    const selectedTime = selectedDate.getTime();
    return Math.floor((selectedTime - todayTime) / 24 / 60 / 60 / 1000);
  }

  /**
   * 接收 Date() 或者 日期字符串以及时间格式，得到对应的日期字符串
   * @param date  format
   * @param date 如果取当天 date 传空值即可
   * @param format  日期字符串支持的格式有 20190830、2019-08-30、2019.08.30、2019/08/30
   */
  public static getFormatTime(
    date: string | Date,
    format = 'YYYY-MM-DD HH:mm:ss'
  ) {
    return moment(date).format(format);
  }

  // public static getFormatTime(
  //   date: string | Date,
  //   format = 'YYYY-MM-DD HH:mm:ss'
  // ) {
  //   return moment(date).format(format);
  // }

  // /**
  //  *  返回 距离当前日期(时间点)之前或者之后的 （天 月 年 周 时 分 秒）的日期字符串
  //  *  @param date 如果取当天 date 传空值即可
  //  *  @param format 日期字符串支持的格式有 20190830、2019-08-30、2019.08.30、2019/08/30， 可以拼接时分秒
  //  * @param addNum  正数代表加一段时间   负数代表减一段时间
  //  * @param addTypes  hours、 minutes、 seconds、 days 、weeks、 month 、year、
  //  */
  // public static XXXgetFormatAddTime(
  //   date: string | Date,
  //   addNum: number,
  //   format: string = 'YYYY-MM-DD HH:mm:ss',
  //   addTypes: string = 'days'
  // ) {
  //   let t = moment(date);
  //   return t.add(addNum, addTypes).format(format);
  // }

  // /**
  //  *  计算输入日期 与 当前日期 的间隔（天数、周数、月数）
  //  *  @param date  日期  传空值默认为当天
  //  *  @param diffType  years, months, weeks, days, hours, minutes, seconds
  //  *  date 不传时分秒的话 默认 00：00
  //  */
  // public static getTimeDiff(
  //   date: String | Date | Number | Moment,
  //   diffType = 'days'
  // ) {
  //   const startDate = moment();
  //   const endDate = moment(date);
  //   return endDate.diff(startDate, diffType);
  // }

  /**
   *  转换 日期 为 时间戳
   *  @param date
   */
  public static getTimestamp(date: Date | string) {
    // if (date typeof === 'string')
    // moment().format('x') // 返回值为字符串类型  毫秒为单位
    if (date instanceof Date) {
      return date.valueOf();
    } else {
      const tempDate = new Date(date);
      return tempDate.valueOf();
    }
  }

  /**
   *  转换 时间戳 为 日期字符串
   *  @param date  时间戳
   *  @param format  格式
   */
  public static getTimeFromTimestamp(
    date: number,
    format = 'YYYY-MM-DD HH:mm:ss'
  ) {
    return moment(date).format(format);
  }

  /**
   * 判断是否是今天
   * @param d
   */
  public static isToday(d: number | Date) {
    if (!d) return undefined;
    return moment().isSame(d, 'day');
  }

  /**
   * 判断当前时间是否大于输入时间
   * @param d
   */
  public static isAfter(d: number | Date) {
    if (!d) return false;
    return moment(d).isAfter();
  }
}
