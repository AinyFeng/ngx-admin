import { saveAs } from 'file-saver';

/**
 * 文件类型
 */
export const FILE_TYPE = {
  EXCEL2003: 'application/vnd.ms-excel'
};

/**
 * 文件后缀名
 */
export const FILE_TYPE_SUFFIX = {
  EXCEL2003: '.xls',
};

/**
 * 文件下载工具类
 */
export class FileDownloadUtils {
  static downloadFile(data: any, type: string, fileName: string) {
    const blob = new Blob([data], { type: type });
    saveAs(blob, fileName);
  }
}
