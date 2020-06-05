/*
 * 接种本类型
 * */
export const INOCULATION_TYPE = [
  { label: '安徽省儿童预防接种证2016版', value: 'ah2016' },
  { label: '安徽省儿童预防接种证2017版', value: 'ah2017' },
  // { label: '儿童预防接种证国家版', value: 'nation' },
  // { label: '儿童预防接种证国家版新', value: 'nationNew' },
  // { label: '江西省儿童预防接种证', value: 'jx' },
  // { label: '江西省儿童预防接种证2016版', value: 'jx2016' },
  // { label: '云南省儿童预防接种证2017版', value: 'yn2017' },
  // { label: '云南省儿童预防接种证2018版', value: 'yn2018' },
  { label: '上海市预防接种证2018版', value: 'sh2018' },
  { label: '安徽省儿童预防接种证', value: 'ahNation' },
  { label: '安徽省儿童预防接种证2019版包河制', value: 'ah2019bhMade' },
  { label: '安徽省儿童预防接种证2019版(小)', value: 'ah2019Small' }
];
/*
 * 所有接种本上的页码
 * */
export const PAGE_SIZE = {
  ahNation: ['1~2', '3~4', '5~6', '7~8', '空白页'],
  ah2017: ['1~2', '3~4', '空白页'],
  ah2016: ['1~2', '3~4', '空白页'],
  sh2018: ['1~2', '3', '空白页'],
  ah2019Small: ['1~2', '3~4', '5~6', '7~8', '空白页'],
  ah2019bhMade: ['1', '2~3', '4~5', '6~7', '8', '空白页']
};
