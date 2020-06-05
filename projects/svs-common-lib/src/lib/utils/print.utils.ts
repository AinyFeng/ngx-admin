import { Lodop } from '@delon/abc';

export class PrintUtils {
  /**
   * 根据输入模板参数和传入数据生成安徽票据打印内容
   * @param LODOP 打印机实例
   * @param templateJson 安徽模板参数项
   * @param contentJson 安徽内容入参
   */

  /*
  LODOP.PRINT_INIT("");
  LODOP.ADD_PRINT_SETUP_BKIMG("D:\\workspace\\SVS2.0_WEB\\src\\assets\\images\\receipt-template\\安徽省医疗门诊收费票据-5017.png");
  LODOP.SET_SHOW_MODE("BKIMG_WIDTH","210.08mm");
  LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","124.09mm");
  LODOP.ADD_PRINT_TEXT(164,97,101,50,"第一个药品(药品名称/规格)-vacProductName/");
  LODOP.ADD_PRINT_TEXT(164,237,39,50,"第一个数量-quantity");
  LODOP.ADD_PRINT_TEXT(164,286,45,50,"第一个金额-amount");
  LODOP.ADD_PRINT_TEXT(164,336,50,50,"第一个个人支付金额-personalPayAmount");
  LODOP.ADD_PRINT_TEXT(164,409,91,50,"第二个药品");
  LODOP.ADD_PRINT_TEXT(164,539,33,50,"第二个数量");
  LODOP.ADD_PRINT_TEXT(164,587,36,50,"第二个金额");
  LODOP.ADD_PRINT_TEXT(164,633,62,50,"第二个个人支付金额");
  LODOP.ADD_PRINT_TEXT(508,97,103,50,"第三个药品");
  LODOP.ADD_PRINT_TEXT(210,238,37,50,"新加文本10");
  LODOP.ADD_PRINT_TEXT(212,287,42,50,"新加文本11");
  LODOP.ADD_PRINT_TEXT(397,165,42,50,"医保统筹支付-medicalInsurancePayAmount");
  LODOP.ADD_PRINT_TEXT(398,278,43,50,"个人账户支付-personalAccountPayAmount");
  LODOP.ADD_PRINT_TEXT(397,391,68,50,"其他医保支付-otherMedicalInsurancePayAmount");
  LODOP.ADD_PRINT_TEXT(421,154,149,50,"收款单位-payeePov");
  LODOP.ADD_PRINT_TEXT(425,385,135,50,"收款人-payee");

  templateJson 格式：
  "taskName": "打印收费票据",
  "printMode": ["PRINT_NOCOLLATE", 1],
  "bkImg": "'<img border=\\'0\\' src=\\'../../../assets/images/receipt-template/安徽省医疗门诊收费票据-5017.png\\'>'",
  "showModeWidth": ["BKIMG_WIDTH", "210.00mm"],
  "showModeHeight": ["BKIMG_HEIGHT", "126.00mm"],
  "serialNo": [70, 148, 100, 50],
  "name": [96, 130, 47, 50],
  "medicalHospitalType": [72, 358, 100, 50],
  "gender": [94,262,32,50],
  "medicalType": [95,353,79,50],
  "totalAmountChinese": [361,159,100,50],
  "totalAmountDigits": [362,491,100,50],
  "personalPayAmount": [389,544,100,50],
  "year": [413,527,53,50],
  "month": [413,582,36,50],
  "day": [413,624,27,50],
  "medicalInsurancePayAmount": [397,165,42,50],
  "personalAccountPayAmount": [398,278,43,50],
  "otherMedicalInsurancePayAmount": [397,391,68,50],
  "payeePov": [421,154,149,50],
  "payee": [425,385,135,50]

  contentJson 格式:
  {
    serialNo: '', 业务流水号
    medicalInstitution: '', 医疗机构类型
    name: '', 姓名
    gender: '', 性别
    medicalInsuranceType: '', 医保类型
    totalAmountChinese: '', 合计（大写）
    totalAmountDigits: '', 合计（￥）
    medicalInsurancePayAmount: 999, 医保统筹支付
    personalAccountPayAmount: 444, 个人账户支付
    otherMedicalInsurancePayAmount: 58, 其他医保支付
    personalPayAmount: 584, 个人支付金额
    payeePov: '收款单位',
    payee: '收款人',
    date: '2019-01-01 12:00:00',
    vacProducts: [
        {
          vacProductNameList: '冻干狂苗', 疫苗名称
          vacSpecifications: '1.0ml', 疫苗规格
          quantityList: 5, 疫苗数量
          amountList: 100, 疫苗金额
          personalPayAmountList: 50, 个人支付金额
        }
    ]
  }

  安徽单据最多打印6条数据
 */
  static setAnhuiReceiptTemplate(
    LODOP: Lodop,
    templateJson: any,
    contentJson: any
  ): Lodop {
    // 初始化显示在打印机列表中的标题
    LODOP.PRINT_INIT(templateJson['taskName']);
    // 设置打印模式
    LODOP.SET_PRINT_MODE(
      templateJson['printMode'][0],
      templateJson['printMode'][1]
    );
    // 设置打印预览背景图
    LODOP.ADD_PRINT_SETUP_BKIMG(templateJson['bkImg']);
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    // 设置显示模式
    LODOP.SET_SHOW_MODE(
      templateJson['showModeWidth'][0],
      templateJson['showModeWidth'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['showModeHeight'][0],
      templateJson['showModeHeight'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['pageBkImgTop'][0],
      templateJson['pageBkImgTop'][1]
    );
    LODOP.SET_PRINT_PAGESIZE(
      templateJson['printPageSize'][0],
      templateJson['printPageSize'][1],
      templateJson['printPageSize'][2],
      templateJson['printPageSize'][3]
    );

    // 计算位移的基数
    const marginLeftUnit = templateJson['marginLeft'];
    const marginTopUnit = templateJson['marginTop'];
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const params = contentJson[i];
        const lodopParams = templateJson[i];
        switch (i) {
          case 'vacProducts':
            // 对疫苗产品列表进行循环
            const length = params.length;
            for (let j = 0; j < length; j++) {
              // 获取疫苗产品列表的一个疫苗产品
              const vac = params[j];
              let marginLeft = 0;
              let marginTop = 0;
              // 计算位移位置
              // 所有奇数列的位置都要加上marginLeft
              if (j % 2 !== 0) {
                marginLeft = marginLeftUnit;
              }
              // 所有超过 1 的都要加上marginTop
              if (j > 1) {
                if (j % 2 === 0) marginTop = marginTopUnit * (j / 2);
                else marginTop = marginTopUnit * ((j - 1) / 2);
              }

              console.log(vac);
              // 遍历疫苗产品的字段内容
              for (const k in vac) {
                if (vac.hasOwnProperty(k)) {
                  // 获取打印参数中此项的位置信息
                  const lodopVacParams = templateJson[k];
                  const top = lodopVacParams[0] + marginTop;
                  const left = lodopVacParams[1] + marginLeft;
                  const width = lodopVacParams[2];
                  const height = lodopVacParams[3];
                  LODOP.ADD_PRINT_TEXT(top, left, width, height, vac[k]);
                }
              }
            }
            break;
          default:
            LODOP.ADD_PRINT_TEXT(
              lodopParams[0],
              lodopParams[1],
              lodopParams[2],
              lodopParams[3],
              contentJson[i]
            );
        }
      }
    }
    return LODOP;
  }

  /**
   *
   * 根据输入模板参数和传入数据生成上海票据打印内容
   * @param LODOP 打印机实例
   * @param templateJson 上海模板参数项
   * @param contentJson 上海内容入参
   */
  /*
  打印票据设计参数
  LODOP.PRINT_INIT("");
  LODOP.ADD_PRINT_SETUP_BKIMG("D:\\workspace\\SVS2.0_WEB\\src\\assets\\images\\receipt-template\\上海市医疗门诊急诊收费票据样本-5018.png");
  LODOP.SET_SHOW_MODE("BKIMG_WIDTH","210.00mm");
  LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","130.00mm");
  LODOP.ADD_PRINT_TEXT(80,140,103,50,"业务流水号");
  LODOP.ADD_PRINT_TEXT(80,331,123,50,"医疗机构类型");
  LODOP.ADD_PRINT_TEXT(103,109,95,50,"姓名");
  LODOP.ADD_PRINT_TEXT(103,242,26,50,"男");
  LODOP.ADD_PRINT_TEXT(103,314,122,50,"医保类型");
  LODOP.ADD_PRINT_TEXT(155,326,70,50,"项一编码");
  LODOP.ADD_PRINT_TEXT(155,411,88,50,"项一名称");
  LODOP.ADD_PRINT_TEXT(155,510,37,50,"项一规格");
  LODOP.ADD_PRINT_TEXT(155,556,30,50,"项一数量");
  LODOP.ADD_PRINT_TEXT(155,595,38,50,"项一单价");
  LODOP.ADD_PRINT_TEXT(155,640,53,50,"项一金额");
  LODOP.ADD_PRINT_TEXT(155,88,100,50,"大项一");
  LODOP.ADD_PRINT_TEXT(155,502,100,50,"大项一金额");
  LODOP.ADD_PRINT_TEXT(276,144,100,50,"合计（大写）");
  LODOP.ADD_PRINT_TEXT(300,133,58,50,"现金支付");
  LODOP.ADD_PRINT_TEXT(300,253,68,50,"个人账户支付");
  LODOP.ADD_PRINT_TEXT(350,150,51,50,"医保统筹支付");
  LODOP.ADD_PRINT_TEXT(350,237,79,50,"附加支付");
  LODOP.ADD_PRINT_TEXT(340,186,49,50,"分类自负");
  LODOP.ADD_PRINT_TEXT(340,264,39,50,"自负");
  LODOP.ADD_PRINT_TEXT(355,105,51,50,"自费");
  LODOP.ADD_PRINT_TEXT(380,149,82,50,"当年账户余额");
  LODOP.ADD_PRINT_TEXT(380,270,75,50,"历年账户余额");
  LODOP.ADD_PRINT_TEXT(440,162,100,50,"收款单位");
  LODOP.ADD_PRINT_TEXT(440,360,100,50,"收款员");
  LODOP.ADD_PRINT_TEXT(440,534,100,50,"日期");

  contentJson 格式:
  {
    "serialNo": "业务流水号",
    "medicalInstitution": [80,331,123,50],
    "name": [103,109,95,50],
    "gender": [103,242,26,50],
    "medicalInsuranceType": [103,314,122,50],
    "categoryList": [
      {
        "categoryName": "大类项目一名称",
        "categoryPayAmount": "大类项目一金额",
      },
      {
        "categoryName": "大类项目二名称",
        "categoryPayAmount": "大类项目二金额",
      }
    ],
    "vacProducts": [
      {
        "vacProductCode": "项目一编码",
        "vacProductName": "项目一疫苗名称",
        "vacSpecifications": "项目一疫苗规格",
        "vacProductQuantity": "项目一疫苗数量",
        "vacPrice": "项目一疫苗单价",
        "vacProductAmount": "项目一疫苗总金额",
      },
      {
        "vacProductCode": "项目二编码",
        "vacProductName": "项目二疫苗名称",
        "vacSpecifications": "项目二疫苗规格",
        "vacProductQuantity": "项目二疫苗数量",
        "vacPrice": "项目二疫苗单价",
        "vacProductAmount": "项目二疫苗总金额",
      }
    ],
    "totalAmountChinese": [361,159,100,50],
    "cashPayment": [300,133,58,50],
    "personalAccountPayAmount": [300,253,68,50],
    "medicalInsurancePayAmount": [350,150,51,50],
    "additionalPayment": [350,237,79,50],
    "classificationOwnPayment": [340,186,49,50],
    "ownPayment": [340,264,39,50],
    "ownExpense": [355,105,51,50],
    "curYearAccountBalance": [380,149,82,50],
    "allYearAccountBalance": [380,270,75,50],
    "payeePov": [440,162,100,50],
    "payee": [440,360,100,50],
    "date": [440,534,100,50]
  }
 */
  static setShangHaiReceiptTemplate(
    LODOP: Lodop,
    templateJson: any,
    contentJson: any
  ): Lodop {
    // 初始化显示在打印机列表中的标题
    LODOP.PRINT_INIT(templateJson['taskName']);
    // 设置打印模式
    LODOP.SET_PRINT_MODE(
      templateJson['printMode'][0],
      templateJson['printMode'][1]
    );
    // 设置显示模式
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_SHOW_MODE(
      templateJson['showModeWidth'][0],
      templateJson['showModeWidth'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['showModeHeight'][0],
      templateJson['showModeHeight'][1]
    );
    // 设置打印预览背景图
    LODOP.ADD_PRINT_SETUP_BKIMG(templateJson['bkImg']);
    LODOP.SET_SHOW_MODE(
      templateJson['pageBkImgTop'][0],
      templateJson['pageBkImgTop'][1]
    );
    LODOP.SET_PRINT_PAGESIZE(
      templateJson['printPageSize'][0],
      templateJson['printPageSize'][1],
      templateJson['printPageSize'][2],
      templateJson['printPageSize'][3]
    );
    // 计算位移的基数
    const marginTopUnit = templateJson['marginTop'];

    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const params = contentJson[i];
        const lodopParams = templateJson[i];
        switch (i) {
          case 'categoryList':
            const categoryLength = params.length;
            for (let j = 0; j < categoryLength; j++) {
              // 获取到一个大项目对象
              const categoryItem = params[j];
              // 计算偏移位置
              const marginTop = marginTopUnit * j;
              for (let k in categoryItem) {
                if (categoryItem.hasOwnProperty(k)) {
                  // 获取打印参数中此项的位置信息
                  const lodopVacParams = templateJson[k];
                  const top = lodopVacParams[0] + marginTop;
                  const left = lodopVacParams[1];
                  const width = lodopVacParams[2];
                  const height = lodopVacParams[3];
                  LODOP.ADD_PRINT_TEXT(
                    top,
                    left,
                    width,
                    height,
                    categoryItem[k]
                  );
                }
              }
            }
            break;
          case 'vacProducts':
            // 对疫苗产品列表进行循环
            const length = params.length;
            for (let j = 0; j < length; j++) {
              // 获取疫苗产品列表的一个疫苗产品
              const vac = params[j];

              // 计算位移位置
              const marginTop = marginTopUnit * j;

              console.log(vac);
              // 遍历疫苗产品的字段内容
              for (const k in vac) {
                if (vac.hasOwnProperty(k)) {
                  // 获取打印参数中此项的位置信息
                  const lodopVacParams = templateJson[k];
                  const top = lodopVacParams[0] + marginTop;
                  const left = lodopVacParams[1];
                  const width = lodopVacParams[2];
                  const height = lodopVacParams[3];
                  LODOP.ADD_PRINT_TEXT(top, left, width, height, vac[k]);
                }
              }
            }
            break;
          default:
            LODOP.ADD_PRINT_TEXT(
              lodopParams[0],
              lodopParams[1],
              lodopParams[2],
              lodopParams[3],
              contentJson[i]
            );
        }
      }
    }
    return LODOP;
  }

  /**
   *
   * 根据输入模板参数和传入数据生成江西票据打印内容
   * @param LODOP 打印机实例
   * @param templateJson 江西模板参数项
   * @param contentJson 江西内容入参
   */
  /*
   LODOP.PRINT_INITA(-1,4,460,772,"");
   LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
   LODOP.SET_SHOW_MODE("BKIMG_WIDTH","119.86mm");
   LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","502.94mm");
   LODOP.ADD_PRINT_TEXT(79,114,95,50,"业务流水号");
   LODOP.ADD_PRINT_TEXT(79,230,100,50,"医疗机构类型");
   LODOP.ADD_PRINT_TEXT(101,89,92,50,"李春辉");
   LODOP.ADD_PRINT_TEXT(99,213,18,50,"男");
   LODOP.ADD_PRINT_TEXT(98,281,100,50,"医保类型");
   LODOP.ADD_PRINT_TEXT(159,66,153,50,"疫苗项目名称");
   LODOP.ADD_PRINT_TEXT(157,234,40,50,"数量");
   LODOP.ADD_PRINT_TEXT(159,285,33,50,"疫苗总金额");
   LODOP.ADD_PRINT_TEXT(158,334,62,50,"个人支付金额");
   LODOP.ADD_PRINT_TEXT(658,104,137,50,"合计（大写）");
   LODOP.ADD_PRINT_TEXT(663,283,100,50,"合计（数字）");
   LODOP.ADD_PRINT_TEXT(677,124,76,50,"医保统筹支付");
   LODOP.ADD_PRINT_TEXT(679,233,63,50,"个人账户支付");
   LODOP.ADD_PRINT_TEXT(680,345,71,50,"其它医保支付");
   LODOP.ADD_PRINT_TEXT(698,127,100,50,"个人支付金额");
   LODOP.ADD_PRINT_TEXT(718,125,83,50,"收款单位");
   LODOP.ADD_PRINT_TEXT(718,270,46,50,"收款人");
   LODOP.ADD_PRINT_TEXT(714,328,70,50,"日期");

   contentJson 格式：
   {
      "serialNo": "513151351351351",
      "medicalInstitution": "江西某医院",
      "name": "张无忌",
      "gender": "男",
      "medicalInsuranceType": "自费",
      "totalAmountChinese": 玖佰玖拾元整, 总金额大写
      "totalAmountDigits": "￥990",  总金额（￥数字）
      "medicalInsurancePayAmount": 5660,  医保统筹支付总金额
      "personalAccountPayAmount": 500, 个人账户支付总金额
      "otherMedicalInsurancePayAmount": 1000,  其它支付总金额
      "personalTotalPayAmount": 15500, 个人支付总金额
      "payeePov": "收款部门",
      "payee": "收款人",
      "date": "5019-01-01",
      "vacProducts": [
        {
          "vacProductName": "破伤风/10ml", 疫苗产品名称/规格
          "vacProductQuantity": 99, 疫苗数量
          "vacProductAmount": 9900, 疫苗金额
          "personalPayAmount": 1000  个人支付金额
        }
      ]
  }
  */
  static setJiangXiReceiptTemplate(
    LODOP: Lodop,
    templateJson: any,
    contentJson: any
  ): Lodop {
    // 初始化显示在打印机列表中的标题
    LODOP.PRINT_INIT(templateJson['taskName']);
    // 设置打印模式
    LODOP.SET_PRINT_MODE(
      templateJson['printMode'][0],
      templateJson['printMode'][1]
    );
    // 设置显示模式
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_SHOW_MODE(
      templateJson['showModeWidth'][0],
      templateJson['showModeWidth'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['showModeHeight'][0],
      templateJson['showModeHeight'][1]
    );
    // 设置打印预览背景图
    LODOP.ADD_PRINT_SETUP_BKIMG(templateJson['bkImg']);
    LODOP.SET_SHOW_MODE(
      templateJson['pageBkImgTop'][0],
      templateJson['pageBkImgTop'][1]
    );
    LODOP.SET_PRINT_PAGESIZE(
      templateJson['printPageSize'][0],
      templateJson['printPageSize'][1],
      templateJson['printPageSize'][2],
      templateJson['printPageSize'][3]
    );
    // 计算位移的基数
    const marginTopUnit = templateJson['marginTop'];
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const params = contentJson[i];
        const lodopParams = templateJson[i];
        switch (i) {
          case 'vacProducts':
            // 对疫苗产品列表进行循环
            const length = params.length;
            for (let j = 0; j < length; j++) {
              // 获取疫苗产品列表的一个疫苗产品
              const vac = params[j];

              // 计算位移位置
              const marginTop = marginTopUnit * j;

              console.log(vac);
              // 遍历疫苗产品的字段内容
              for (const k in vac) {
                if (vac.hasOwnProperty(k)) {
                  // 获取打印参数中此项的位置信息
                  const lodopVacParams = templateJson[k];
                  const top = lodopVacParams[0] + marginTop;
                  const left = lodopVacParams[1];
                  const width = lodopVacParams[2];
                  const height = lodopVacParams[3];
                  LODOP.ADD_PRINT_TEXT(top, left, width, height, vac[k]);
                }
              }
            }
            break;
          default:
            LODOP.ADD_PRINT_TEXT(
              lodopParams[0],
              lodopParams[1],
              lodopParams[2],
              lodopParams[3],
              contentJson[i]
            );
        }
      }
    }
    return LODOP;
  }

  /**
   *
   * 根据输入模板参数和传入数据生成云南票据打印内容
   * @param LODOP 打印机实例
   * @param templateJson 云南模板参数项
   * @param contentJson 云南内容入参
   */
  /*
  LODOP.PRINT_INIT("");
  LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
  LODOP.ADD_PRINT_SETUP_BKIMG("D:\\workspace\\SVS2.0_WEB\\src\\assets\\images\\receipt-template\\云南省医疗门诊收费票据-5018.png");
  LODOP.SET_SHOW_MODE("BKIMG_WIDTH","125.00mm");
  LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","70.00mm");
  LODOP.ADD_PRINT_TEXT(218,298,113,50,"注意");
  LODOP.ADD_PRINT_TEXT(218,61,224,50,"电子票号");
  LODOP.ADD_PRINT_TEXT(22,108,134,50,"业务流水号");
  LODOP.ADD_PRINT_TEXT(42,121,133,50,"医疗机构类型");
  LODOP.ADD_PRINT_TEXT(60,89,181,50,"姓名");
  LODOP.ADD_PRINT_TEXT(60,310,67,50,"性别");
  LODOP.ADD_PRINT_TEXT(82,112,100,50,"医保类型");
  LODOP.ADD_PRINT_TEXT(81,260,139,50,"社会保障号码");
  LODOP.ADD_PRINT_TEXT(100,64,155,50,"疫苗产品名称");
  LODOP.ADD_PRINT_TEXT(100,244,53,50,"数量");
  LODOP.ADD_PRINT_TEXT(100,316,71,50,"金额");
  LODOP.ADD_PRINT_TEXT(182,114,185,50,"合计（大写）");
  LODOP.ADD_PRINT_TEXT(182,332,66,50,"合计（￥数字）");
  LODOP.ADD_PRINT_TEXT(224,133,81,50,"收款单位");
  LODOP.ADD_PRINT_TEXT(222,279,62,50,"收款人");
  LODOP.ADD_PRINT_TEXT(223,366,66,50,"日期");

  contentJson 结构：
  {
     "serialNo": "515613513513513",
     "medicalInstitution": "医疗机构名称",
     "name": "张无忌",
     "gender": "男",
     "medicalInsuranceType": "自费",
     "socialSecurityNumber": "15151351351435135",
     "vacProducts": [
      {
        "vacProductName": "乙肝疫苗",
        "vacProductQuantity": 2,
        "vacProductAmount": 500,
      }
     ],
     "totalAmountChinese": "伍佰伍拾陆元整",
     "totalAmountDigits": "￥556.00",
     "payeePov": "某一个医院",
     "payee": "收款人",
     "date": "5019-01-01",
  }

  最多可以打印五条疫苗产品记录

  */
  static setYunNamReceiptTemplate(
    LODOP: Lodop,
    templateJson: any,
    contentJson: any
  ): Lodop {
    // 初始化显示在打印机列表中的标题
    LODOP.PRINT_INIT(templateJson['taskName']);
    // 设置打印模式
    LODOP.SET_PRINT_MODE(
      templateJson['printMode'][0],
      templateJson['printMode'][1]
    );
    // 设置显示模式
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_SHOW_MODE(
      templateJson['showModeWidth'][0],
      templateJson['showModeWidth'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['showModeHeight'][0],
      templateJson['showModeHeight'][1]
    );
    // 设置打印预览背景图
    LODOP.ADD_PRINT_SETUP_BKIMG(templateJson['bkImg']);
    LODOP.SET_SHOW_MODE(
      templateJson['pageBkImgTop'][0],
      templateJson['pageBkImgTop'][1]
    );
    LODOP.SET_SHOW_MODE(
      templateJson['pageBkImgLeft'][0],
      templateJson['pageBkImgLeft'][1]
    );
    LODOP.SET_PRINT_PAGESIZE(
      templateJson['printPageSize'][0],
      templateJson['printPageSize'][1],
      templateJson['printPageSize'][2],
      templateJson['printPageSize'][3]
    );
    // 打印注意事项
    LODOP.ADD_PRINT_TEXT(
      templateJson['notice'][0],
      templateJson['notice'][1],
      templateJson['notice'][2],
      templateJson['notice'][3],
      templateJson['notice'][4]
    );
    // 计算位移的基数
    const marginTopUnit = templateJson['marginTop'];
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const params = contentJson[i];
        const lodopParams = templateJson[i];
        switch (i) {
          case 'vacProducts':
            // 对疫苗产品列表进行循环
            const length = params.length;
            for (let j = 0; j < length; j++) {
              // 获取疫苗产品列表的一个疫苗产品
              const vac = params[j];

              // 计算位移位置
              const marginTop = marginTopUnit * j;
              // 遍历疫苗产品的字段内容
              for (const k in vac) {
                if (vac.hasOwnProperty(k)) {
                  // 获取打印参数中此项的位置信息
                  const lodopVacParams = templateJson[k];
                  const top = lodopVacParams[0] + marginTop;
                  const left = lodopVacParams[1];
                  const width = lodopVacParams[2];
                  const height = lodopVacParams[3];
                  LODOP.ADD_PRINT_TEXT(top, left, width, height, vac[k]);
                }
              }
            }
            break;
          default:
            LODOP.ADD_PRINT_TEXT(
              lodopParams[0],
              lodopParams[1],
              lodopParams[2],
              lodopParams[3],
              contentJson[i]
            );
        }
      }
    }
    return LODOP;
  }

  /**
   * 接种记录模板
   * @params model  选择的打印模板
   * @params currentPage  选择的哪一个页面
   * @params printRecordData  打印的的接种记录
   * @params images  打印接种记录背景图
   * @params settings  打印设置
   */
  static setVaccRecordTemplate(
    LODOP: Lodop,
    model: any,
    currentPage: any,
    printRecordData: any,
    images: any,
    settings: any
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种记录');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    LODOP.ADD_PRINT_SETUP_BKIMG(images.src[currentPage].bgImgSrc);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', images['bgImgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', images['bgImgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    // 安徽省国家版接种本ahNation
    if (model === 'ahNation') {
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 9) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][1] + settings['marginLeft'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][1] + settings['marginLeft'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][1] + settings['marginLeft'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.loseEfficacyDate
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][1] + settings['marginLeft'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][1] + settings['marginLeft'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine6'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine6'][1] + settings['marginLeft'],
            images['baseLine6'][2],
            images['baseLine6'][3],
            singleRecord.actualVaccinatePovCode
          );
          if (settings['doctorName']) {
            LODOP.ADD_PRINT_IMAGE(
              images['baseLine7'][0] +
                settings['marginTop'] +
                (singleRecord.sort - 1) * images['isoChromatic'],
              images['baseLine7'][1] + settings['marginLeft'],
              images['baseLine7'][2],
              images['baseLine7'][3],
              `<img border='0' src ='../../../../assets/images/test.png' />`
            );
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
          // LODOP.ADD_PRINT_TEXT(images['baseLine7'][0] + (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine7'][1], images['baseLine7'][2], images['baseLine7'][3], singleRecord.vaccinateDoctorCode);
        } else {
          if (singleRecord.sort >= 9 && singleRecord.sort <= 18) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine1'][1] + settings['marginLeft'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine2'][1] + settings['marginLeft'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine3'][1] + settings['marginLeft'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.loseEfficacyDate
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine4'][1] + settings['marginLeft'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine5'][1] + settings['marginLeft'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine6'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine6'][1] + settings['marginLeft'],
              images['baseLine6'][2],
              images['baseLine6'][3],
              singleRecord.actualVaccinatePovCode
            );
            if (settings['doctorName']) {
              LODOP.ADD_PRINT_IMAGE(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 9) * images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                `<img border='0' src='../../../../assets/images/test.png' />`
              );
              LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            if (singleRecord.sort < 59) {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    (singleRecord.sort - 50 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            } else {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    images['marginTop'] +
                    (singleRecord.sort - 59 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            }
          }
        }
      }
    }
    // 安徽省接种本2017版
    if (model === 'ah2017') {
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 15) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][1] + settings['marginLeft'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][1] + settings['marginLeft'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][1] + settings['marginLeft'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][1] + settings['marginLeft'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.loseEfficacyDate
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][1] + settings['marginLeft'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine6'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine6'][1] + settings['marginLeft'],
            images['baseLine6'][2],
            images['baseLine6'][3],
            singleRecord.actualVaccinatePovCode
          );
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
          if (settings['doctorName']) {
            LODOP.ADD_PRINT_IMAGE(
              images['baseLine7'][0] +
                settings['marginTop'] +
                (singleRecord.sort - 1) * images['isoChromatic'],
              images['baseLine7'][1] + settings['marginLeft'],
              images['baseLine7'][2],
              images['baseLine7'][3],
              `<img border='0' src ='../../../../assets/images/test.png' />`
            );
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
          // LODOP.ADD_PRINT_TEXT(images['baseLine7'][0] + (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine7'][1], images['baseLine7'][2], images['baseLine7'][3], singleRecord.vaccinateDoctorCode);
        } else {
          if (singleRecord.sort >= 15 && singleRecord.sort <= 26) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine1'][1] + settings['marginLeft'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine2'][1] + settings['marginLeft'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine3'][1] + settings['marginLeft'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine4'][1] + settings['marginLeft'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.loseEfficacyDate
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine5'][1] + settings['marginLeft'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine6'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine6'][1] + settings['marginLeft'],
              images['baseLine6'][2],
              images['baseLine6'][3],
              singleRecord.actualVaccinatePovCode
            );
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
            if (settings['doctorName']) {
              LODOP.ADD_PRINT_IMAGE(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 15) * images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                `<img border='0' src='../../../../assets/images/test.png' />`
              );
              LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            if (singleRecord.sort < 65) {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    (singleRecord.sort - 50 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            } else {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    images['marginTop'] +
                    (singleRecord.sort - 65 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            }
          }
        }
      }
    }
    // 安徽省接种本2016版
    if (model === 'ah2016') {
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 15) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][1] + settings['marginLeft'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][1] + settings['marginLeft'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][1] + settings['marginLeft'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][1] + settings['marginLeft'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][1] + settings['marginLeft'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.actualVaccinatePovCode
          );
          if (settings['doctorName']) {
            LODOP.ADD_PRINT_IMAGE(
              images['baseLine6'][0] +
                settings['marginTop'] +
                (singleRecord.sort - 1) * images['isoChromatic'],
              images['baseLine6'][1] + settings['marginLeft'],
              images['baseLine6'][2],
              images['baseLine6'][3],
              `<img border='0' src ='../../../../assets/images/test.png' />`
            );
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
          // LODOP.ADD_PRINT_TEXT(images['baseLine7'][0] + (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine7'][1], images['baseLine7'][2], images['baseLine7'][3], singleRecord.vaccinateDoctorCode);
        } else {
          if (singleRecord.sort >= 15 && singleRecord.sort <= 29) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine1'][1] + settings['marginLeft'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine2'][1] + settings['marginLeft'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine3'][1] + settings['marginLeft'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine4'][1] + settings['marginLeft'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 15) * images['isoChromatic'],
              images['baseLine5'][1] + settings['marginLeft'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.actualVaccinatePovCode
            );
            if (settings['doctorName']) {
              LODOP.ADD_PRINT_IMAGE(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 15) * images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                `<img border='0' src='../../../../assets/images/test.png' />`
              );
              LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            if (singleRecord.sort < 65) {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine6'][0] +
                    settings['marginTop'] +
                    (singleRecord.sort - 50 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine6'][1] + settings['marginLeft'],
                  images['baseLine6'][2],
                  images['baseLine6'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            } else {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 65 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine6'][0] +
                    settings['marginTop'] +
                    images['marginTop'] +
                    (singleRecord.sort - 65 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine6'][1] + settings['marginLeft'],
                  images['baseLine6'][2],
                  images['baseLine6'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            }
          }
        }
      }
    }
    // 安徽预防接种证2019版(小)
    if (model === 'ah2019Small') {
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 9) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][1] + settings['marginLeft'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][1] + settings['marginLeft'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][1] + settings['marginLeft'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.loseEfficacyDate
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][1] + settings['marginLeft'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][1] + settings['marginLeft'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine6'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine6'][1] + settings['marginLeft'],
            images['baseLine6'][2],
            images['baseLine6'][3],
            singleRecord.actualVaccinatePovCode
          );
          if (settings['doctorName']) {
            LODOP.ADD_PRINT_IMAGE(
              images['baseLine7'][0] +
                settings['marginTop'] +
                (singleRecord.sort - 1) * images['isoChromatic'],
              images['baseLine7'][1] + settings['marginLeft'],
              images['baseLine7'][2],
              images['baseLine7'][3],
              `<img border='0' src ='../../../../assets/images/test.png' />`
            );
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
          // LODOP.ADD_PRINT_TEXT(images['baseLine7'][0] + (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine7'][1], images['baseLine7'][2], images['baseLine7'][3], singleRecord.vaccinateDoctorCode);
        } else {
          if (singleRecord.sort >= 9 && singleRecord.sort <= 18) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine1'][1] + settings['marginLeft'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine2'][1] + settings['marginLeft'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine3'][1] + settings['marginLeft'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.loseEfficacyDate
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine4'][1] + settings['marginLeft'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine5'][1] + settings['marginLeft'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine6'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine6'][1] + settings['marginLeft'],
              images['baseLine6'][2],
              images['baseLine6'][3],
              singleRecord.actualVaccinatePovCode
            );
            if (settings['doctorName']) {
              LODOP.ADD_PRINT_IMAGE(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 9) * images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                `<img border='0' src='../../../../assets/images/test.png' />`
              );
              LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            if (singleRecord.sort < 59) {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    (singleRecord.sort - 50 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            } else {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    images['marginTop'] +
                    (singleRecord.sort - 59 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            }
          }
        }
      }
    }
    // 安徽预防接种证2019bhMade(大)
    if (model === 'ah2019bhMade') {
      /*

LODOP.PRINT_INITA(0,0,790,1086,"");
LODOP.ADD_PRINT_SETUP_BKIMG("E:\\workspace\\code\\SVS2.0_WEB\\src\\assets\\images\\vaccinationRecord\\ah2019baoheMade\\ah2019包河制003接种记录.jpg");
LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
LODOP.SET_SHOW_MODE("BKIMG_TOP",0);
LODOP.SET_SHOW_MODE("BKIMG_WIDTH","209.02mm");
LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","287.34mm");
LODOP.ADD_PRINT_TEXT(125,182,75,20,"2019-10-22");
LODOP.ADD_PRINT_TEXT(124,255,105,20,"疫苗批号");
LODOP.ADD_PRINT_TEXT(125,366,65,20,"有效期");
LODOP.ADD_PRINT_TEXT(123,431,65,20,"生产企业");
LODOP.ADD_PRINT_TEXT(125,501,64,20,"左上臂");
LODOP.ADD_PRINT_TEXT(122,566,90,20,"接种单位");
LODOP.ADD_PRINT_TEXT(124,661,70,20,"接种人员");
LODOP.ADD_PRINT_TEXT(166,181,75,20,"2019-10-23");
LODOP.ADD_PRINT_TEXT(670,181,75,20,"2019-10-24");
LODOP.ADD_PRINT_TEXT(123,94,68,20,"疫苗");
LODOP.ADD_PRINT_TEXT(125,163,18,20,"2");

      * */
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 9) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][1] + settings['marginLeft'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][1] + settings['marginLeft'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][1] + settings['marginLeft'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.loseEfficacyDate
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][1] + settings['marginLeft'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][1] + settings['marginLeft'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine6'][0] +
              settings['marginTop'] +
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine6'][1] + settings['marginLeft'],
            images['baseLine6'][2],
            images['baseLine6'][3],
            singleRecord.actualVaccinatePovCode
          );
          if (settings['doctorName']) {
            LODOP.ADD_PRINT_IMAGE(
              images['baseLine7'][0] +
                settings['marginTop'] +
                (singleRecord.sort - 1) * images['isoChromatic'],
              images['baseLine7'][1] + settings['marginLeft'],
              images['baseLine7'][2],
              images['baseLine7'][3],
              `<img border='0' src ='../../../../assets/images/test.png' />`
            );
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
          // LODOP.ADD_PRINT_TEXT(images['baseLine7'][0] + (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine7'][1], images['baseLine7'][2], images['baseLine7'][3], singleRecord.vaccinateDoctorCode);
        } else {
          if (singleRecord.sort >= 9 && singleRecord.sort <= 18) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine1'][1] + settings['marginLeft'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine2'][1] + settings['marginLeft'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine3'][1] + settings['marginLeft'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.loseEfficacyDate
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine4'][1] + settings['marginLeft'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine5'][1] + settings['marginLeft'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine6'][0] +
                settings['marginTop'] +
                images['marginTop'] +
                (singleRecord.sort - 9) * images['isoChromatic'],
              images['baseLine6'][1] + settings['marginLeft'],
              images['baseLine6'][2],
              images['baseLine6'][3],
              singleRecord.actualVaccinatePovCode
            );
            if (settings['doctorName']) {
              LODOP.ADD_PRINT_IMAGE(
                images['baseLine7'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 9) * images['isoChromatic'],
                images['baseLine7'][1] + settings['marginLeft'],
                images['baseLine7'][2],
                images['baseLine7'][3],
                `<img border='0' src='../../../../assets/images/test.png' />`
              );
              LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            if (singleRecord.sort < 59) {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  images['marginTop'] +
                  (singleRecord.sort - 59 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    images['marginTop'] +
                    (singleRecord.sort - 59 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            } else {
              LODOP.ADD_PRINT_TEXT(
                images['baseLine8'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine8'][1] + settings['marginLeft'],
                images['baseLine8'][2],
                images['baseLine8'][3],
                singleRecord.vaccineBroadHeadingName
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine9'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine9'][1] + settings['marginLeft'],
                images['baseLine9'][2],
                images['baseLine9'][3],
                singleRecord.vaccinateInjectNumber
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine1'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine1'][1] + settings['marginLeft'],
                images['baseLine1'][2],
                images['baseLine1'][3],
                singleRecord.vaccinateTime
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine2'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine2'][1] + settings['marginLeft'],
                images['baseLine2'][2],
                images['baseLine2'][3],
                singleRecord.vaccineBatchNo
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine3'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine3'][1] + settings['marginLeft'],
                images['baseLine3'][2],
                images['baseLine3'][3],
                singleRecord.loseEfficacyDate
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine4'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine4'][1] + settings['marginLeft'],
                images['baseLine4'][2],
                images['baseLine4'][3],
                singleRecord.vaccineManufactureCode
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine5'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine5'][1] + settings['marginLeft'],
                images['baseLine5'][2],
                images['baseLine5'][3],
                singleRecord.part
              );
              LODOP.ADD_PRINT_TEXT(
                images['baseLine6'][0] +
                  settings['marginTop'] +
                  (singleRecord.sort - 50 + settings['startLine'] - 1) *
                    images['isoChromatic'],
                images['baseLine6'][1] + settings['marginLeft'],
                images['baseLine6'][2],
                images['baseLine6'][3],
                singleRecord.actualVaccinatePovCode
              );
              if (settings['doctorName']) {
                LODOP.ADD_PRINT_IMAGE(
                  images['baseLine7'][0] +
                    settings['marginTop'] +
                    (singleRecord.sort - 50 + settings['startLine'] - 1) *
                      images['isoChromatic'],
                  images['baseLine7'][1] + settings['marginLeft'],
                  images['baseLine7'][2],
                  images['baseLine7'][3],
                  `<img border='0' src='../../../../assets/images/test.png' />`
                );
                LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
              }
            }
          }
        }
      }
    }

    // 上海市2018版
    if (model === 'sh2018') {
      LODOP.SET_PRINT_STYLE('Angle', 270);
      for (let i = 0; i < printRecordData.length; i++) {
        // 单条接种记录
        const singleRecord = printRecordData[i];
        if (singleRecord.sort < 24) {
          LODOP.ADD_PRINT_TEXT(
            images['baseLine1'][0] + settings['marginTop'],
            images['baseLine1'][1] +
              settings['marginLeft'] -
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine1'][2],
            images['baseLine1'][3],
            singleRecord.vaccinateTime
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine2'][0] + settings['marginTop'],
            images['baseLine2'][1] +
              settings['marginLeft'] -
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine2'][2],
            images['baseLine2'][3],
            singleRecord.vaccineManufactureCode
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine3'][0] + settings['marginTop'],
            images['baseLine3'][1] +
              settings['marginLeft'] -
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine3'][2],
            images['baseLine3'][3],
            singleRecord.vaccineBatchNo
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine4'][0] + settings['marginTop'],
            images['baseLine4'][1] +
              settings['marginLeft'] -
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine4'][2],
            images['baseLine4'][3],
            singleRecord.part
          );
          LODOP.ADD_PRINT_TEXT(
            images['baseLine5'][0] + settings['marginTop'],
            images['baseLine5'][1] +
              settings['marginLeft'] -
              (singleRecord.sort - 1) * images['isoChromatic'],
            images['baseLine5'][2],
            images['baseLine5'][3],
            singleRecord.actualVaccinatePovCode
          );
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
          if (settings['doctorName']) {
            // LODOP.ADD_PRINT_IMAGE(images['baseLine6'][0] + settings['marginTop'], images['baseLine6'][1] + settings['marginLeft'] - (singleRecord.sort - 1) * images['isoChromatic'], images['baseLine6'][2], images['baseLine6'][3], `<img border='0' src ='../../../../assets/images/test.png' />`);
            // LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
          }
        } else {
          if (singleRecord.sort >= 24 && singleRecord.sort <= 46) {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine1'][0] +
                settings['marginTop'] +
                images['marginTop'],
              images['baseLine1'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 24) * images['isoChromatic'],
              images['baseLine1'][2],
              images['baseLine1'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine2'][0] +
                settings['marginTop'] +
                images['marginTop'],
              images['baseLine2'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 24) * images['isoChromatic'],
              images['baseLine2'][2],
              images['baseLine2'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine3'][0] +
                settings['marginTop'] +
                images['marginTop'],
              images['baseLine3'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 24) * images['isoChromatic'],
              images['baseLine3'][2],
              images['baseLine3'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine4'][0] +
                settings['marginTop'] +
                images['marginTop'],
              images['baseLine4'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 24) * images['isoChromatic'],
              images['baseLine4'][2],
              images['baseLine4'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine5'][0] +
                settings['marginTop'] +
                images['marginTop'],
              images['baseLine5'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 24) * images['isoChromatic'],
              images['baseLine5'][2],
              images['baseLine5'][3],
              singleRecord.actualVaccinatePovCode
            );
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
            if (settings['doctorName']) {
              // LODOP.ADD_PRINT_IMAGE(images['baseLine6'][0] + settings['marginTop'] + images['marginTop'], images['baseLine6'][1] + settings['marginLeft'] - (singleRecord.sort - 24) * images['isoChromatic'], images['baseLine6'][2], images['baseLine6'][3], `<img border='0' src='../../../../assets/images/test.png' />`);
              // LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          } else {
            LODOP.ADD_PRINT_TEXT(
              images['baseLine7'][0] + settings['marginTop'],
              images['baseLine7'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine7'][2],
              images['baseLine7'][3],
              singleRecord.vaccineBroadHeadingName
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine8'][0] + settings['marginTop'],
              images['baseLine8'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine8'][2],
              images['baseLine8'][3],
              singleRecord.vaccinateInjectNumber
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine9'][0] + settings['marginTop'],
              images['baseLine9'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine9'][2],
              images['baseLine9'][3],
              singleRecord.vaccinateTime
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine10'][0] + settings['marginTop'],
              images['baseLine10'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine10'][2],
              images['baseLine10'][3],
              singleRecord.vaccineManufactureCode
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine11'][0] + settings['marginTop'],
              images['baseLine11'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine11'][2],
              images['baseLine11'][3],
              singleRecord.vaccineBatchNo
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine12'][0] + settings['marginTop'],
              images['baseLine12'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine12'][2],
              images['baseLine12'][3],
              singleRecord.part
            );
            LODOP.ADD_PRINT_TEXT(
              images['baseLine13'][0] + settings['marginTop'],
              images['baseLine13'][1] +
                settings['marginLeft'] -
                (singleRecord.sort - 50 + settings['startLine'] - 1) *
                  images['isoChromatic'],
              images['baseLine13'][2],
              images['baseLine13'][3],
              singleRecord.actualVaccinatePovCode
            );
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', '6.5');
            if (settings['doctorName']) {
              // LODOP.ADD_PRINT_IMAGE(images['baseLine14'][0] + settings['marginTop'], images['baseLine14'][1] + settings['marginLeft'] - (singleRecord.sort - 50 + settings['startLine'] - 1) * images['isoChromatic'], images['baseLine14'][2], images['baseLine14'][3], `<img border='0' src='../../../../assets/images/test.png' />`);
              // LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
            }
          }
        }
      }
    }
    return LODOP;
  }

  /**
   * @author ainy
   * @params:
   * @date 2019/10/18 0018
   */
  // 安徽预防接种证2019版包河制
  static setAh2019bhMadeTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const lodopParams = templateJson[i];
        LODOP.ADD_PRINT_TEXT(
          lodopParams[0] + settings.marginTop,
          lodopParams[1] + settings.marginLeft,
          lodopParams[2],
          lodopParams[3],
          contentJson[i]
        );
      }
    }
    /*LODOP.ADD_PRINT_TEXT(915, 523, 101, 20, '138456234562');
    LODOP.ADD_PRINT_TEXT(709, 525, 70, 20, '父亲姓名');
    LODOP.ADD_PRINT_TEXT(967, 563, 37, 20, '12');
    LODOP.ADD_PRINT_TEXT(878, 563, 42, 20, '07');
    LODOP.ADD_PRINT_TEXT(781, 563, 51, 20, '1989');
    LODOP.ADD_PRINT_TEXT(928, 596, 60, 20, '性别女');
    LODOP.ADD_PRINT_TEXT(705, 599, 78, 20, '儿童姓名');
    LODOP.ADD_PRINT_TEXT(752, 636, 159, 20, '出生证号码');
    LODOP.ADD_PRINT_TEXT(682, 677, 127, 20, '340826198905264523');
    LODOP.ADD_PRINT_TEXT(699, 712, 140, 20, '340826198905264523');
    LODOP.ADD_PRINT_TEXT(614, 375, 111, 20, '江南美林苑');
    LODOP.ADD_PRINT_TEXT(951, 409, 67, 20, '宿松');
    LODOP.ADD_PRINT_TEXT(862, 411, 58, 20, '合肥');
    LODOP.ADD_PRINT_TEXT(759, 410, 85, 20, '安徽');
    LODOP.ADD_PRINT_TEXT(917, 451, 85, 20, '体重多少');
    LODOP.ADD_PRINT_TEXT(710, 453, 115, 20, '合肥市省立儿童医院');
    LODOP.ADD_PRINT_TEXT(915, 487, 110, 20, '13985642563');
    LODOP.ADD_PRINT_TEXT(707, 489, 80, 20, '母亲姓名');
    LODOP.ADD_PRINT_TEXT(862, 227, 147, 20, '1245652356');
    LODOP.ADD_PRINT_TEXT(925, 265, 110, 20, '禁忌症');
    LODOP.ADD_PRINT_TEXT(690, 266, 100, 20, '过敏史');
    LODOP.ADD_PRINT_TEXT(603, 302, 110, 20, '未知的地方');
    LODOP.ADD_PRINT_TEXT(967, 342, 69, 20, '江淮');
    LODOP.ADD_PRINT_TEXT(886, 342, 75, 20, '宁波');
    LODOP.ADD_PRINT_TEXT(779, 341, 80, 20, '浙江');
    LODOP.ADD_PRINT_TEXT(996, 89, 47, 20, '18');
    LODOP.ADD_PRINT_TEXT(964, 89, 44, 20, '10');
    LODOP.ADD_PRINT_TEXT(921, 87, 49, 20, '2019');*/
    LODOP.ADD_PRINT_BARCODE(
      607,
      67,
      105,
      138,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
    return LODOP;
  }

  // 安徽预防接种证2019版(小)
  static setAh2019SmallTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const lodopParams = templateJson[i];
        LODOP.ADD_PRINT_TEXT(
          lodopParams[0] + settings.marginTop,
          lodopParams[1] + settings.marginLeft,
          lodopParams[2],
          lodopParams[3],
          contentJson[i]
        );
      }
    }
    LODOP.ADD_PRINT_BARCODE(
      432,
      42,
      95,
      127,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);

    /*
    LODOP.ADD_PRINT_TEXT(511,511,137,20,"儿童编码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(500,485,150,20,"省份证号码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(522,327,100,20,"出生医院");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(692,350,110,20,"母亲手机号码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(519,352,69,20,"母亲姓名");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(688,376,120,20,"父亲手机号码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(517,379,79,20,"父亲姓名");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(701,401,47,20,"06");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(658,400,43,20,"12");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(590,401,45,20,"1993");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(706,430,74,20,"性别男");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(514,433,100,20,"儿童姓名");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(559,459,137,20,"出生证号");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(432,275,115,20,"香格里拉");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(727,301,51,20,"香江");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(647,298,50,20,"长沙");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(563,301,49,20,"湖南");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(714,322,78,20,"出生体重");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(694,71,40,20,"2019");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(652,172,132,20,"接种单位电话");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(707,194,70,20,"禁忌症");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(506,194,74,20,"过敏史");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(434,227,115,20,"不知道哦啊");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(708,244,45,20,"望江");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(643,248,48,20,"合肥");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(572,245,46,20,"安徽");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(756,73,31,20,"18");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(731,72,32,20,"10");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_BARCODE(432,42,95,127,"Code39","123456789012");
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);*/
    return LODOP;
  }

  //  安徽预防接种证2016版(小)
  static setAh2016SmallTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const lodopParams = templateJson[i];
        LODOP.ADD_PRINT_TEXT(
          lodopParams[0] + settings.marginTop,
          lodopParams[1] + settings.marginLeft,
          lodopParams[2],
          lodopParams[3],
          contentJson[i]
        );
      }
    }
    /*LODOP.ADD_PRINT_TEXT(453,383,41,20,"1998");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(605,410,62,20,"男");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(453,410,110,20,"儿童姓名");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(453,437,155,20,"出生证号");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(453,465,152,20,"身份证号码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(453,486,164,20,"儿童编码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(535,384,31,20,"18");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(498,383,32,20,"08");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(602,253,85,20,"香格里拉");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(557,255,37,20,"小小");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(504,255,43,20,"山丘");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(450,253,47,20,"河南");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(604,305,100,20,"详细地址");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(556,305,48,20,"宿松");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(501,303,47,20,"合肥");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(448,304,48,20,"安徽");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(619,330,53,20,"关系");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(461,334,85,20,"监护人姓名");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(606,358,68,20,"体重");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(454,360,90,20,"出生医院");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(516,165,118,20,"接种医院");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(658,80,28,20,"10");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(574,79,39,20,"2019");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(610,111,100,20,"接种单位");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(625,165,105,20,"接种电话");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(619,79,29,20,"21");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_BARCODE(403,35,95,119,"Code39","123456789012");
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);*/
    LODOP.ADD_PRINT_BARCODE(
      403,
      35,
      95,
      119,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
    return LODOP;
  }

  // 安徽预防接种证2017版(小)
  static setAh2017SmallTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const lodopParams = templateJson[i];
        LODOP.ADD_PRINT_TEXT(
          lodopParams[0] + settings.marginTop,
          lodopParams[1] + settings.marginLeft,
          lodopParams[2],
          lodopParams[3],
          contentJson[i]
        );
      }
    }
    LODOP.ADD_PRINT_BARCODE(
      442,
      34,
      100,
      128,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
    /*LODOP.PRINT_INITA(0,0,529,771,"");
    LODOP.ADD_PRINT_TEXT(668,346,44,20,"关系");
    LODOP.ADD_PRINT_TEXT(503,348,80,20,"监护人姓名");
    LODOP.ADD_PRINT_TEXT(652,373,54,20,"体重");
    LODOP.ADD_PRINT_TEXT(486,370,106,20,"出生医院");
    LODOP.ADD_PRINT_TEXT(571,396,34,20,"12");
    LODOP.ADD_PRINT_TEXT(538,396,31,20,"06");
    LODOP.ADD_PRINT_TEXT(486,395,43,20,"1989");
    LODOP.ADD_PRINT_TEXT(646,419,58,20,"性别");
    LODOP.ADD_PRINT_TEXT(486,421,76,20,"儿童姓名");
    LODOP.ADD_PRINT_TEXT(485,451,130,20,"出生证号");
    LODOP.ADD_PRINT_TEXT(485,477,154,20,"身份证号码");
    LODOP.ADD_PRINT_TEXT(486,504,161,20,"儿童编码");
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);
    LODOP.ADD_PRINT_TEXT(601,267,47,20,"补补");
    LODOP.ADD_PRINT_TEXT(542,268,43,20,"长沙");
    LODOP.ADD_PRINT_TEXT(485,266,40,20,"湖南");
    LODOP.ADD_PRINT_TEXT(645,319,100,20,"美丽的地方");
    LODOP.ADD_PRINT_TEXT(616,86,41,20,"2019");
    LODOP.ADD_PRINT_TEXT(600,317,39,20,"宿松");
    LODOP.ADD_PRINT_TEXT(539,316,39,20,"合肥");
    LODOP.ADD_PRINT_TEXT(492,322,42,20,"安徽");
    LODOP.ADD_PRINT_TEXT(644,267,100,20,"位置的地方");
    LODOP.ADD_PRINT_TEXT(661,87,30,20,"10");
    LODOP.ADD_PRINT_TEXT(666,174,100,20,"接种电话");
    LODOP.ADD_PRINT_TEXT(556,175,105,20,"接种单位");
    LODOP.ADD_PRINT_TEXT(647,116,111,20,"发证医院");
    LODOP.ADD_PRINT_TEXT(704,87,28,20,"21");
    LODOP.ADD_PRINT_BARCODE(442,34,100,128,"Code39","123456789012");
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);*/
    return LODOP;
  }

  // 安徽预防接种证ahNation版
  static setAhNationTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        const lodopParams = templateJson[i];
        LODOP.ADD_PRINT_TEXT(
          lodopParams[0] + settings.marginTop,
          lodopParams[1] + settings.marginLeft,
          lodopParams[2],
          lodopParams[3],
          contentJson[i]
        );
      }
    }
    LODOP.ADD_PRINT_BARCODE(
      590,
      57,
      100,
      133,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);

    /*LODOP.PRINT_INITA(0,0,790,1074,"");
    LODOP.ADD_PRINT_TEXT(915,541,100,20,"父亲手机号码");
    LODOP.ADD_PRINT_TEXT(682,543,75,20,"父亲姓名");
    LODOP.ADD_PRINT_TEXT(931,579,37,20,"12");
    LODOP.ADD_PRINT_TEXT(783,577,49,20,"1983");
    LODOP.ADD_PRINT_TEXT(953,615,54,20,"性别");
    LODOP.ADD_PRINT_TEXT(683,620,90,20,"儿童姓名");
    LODOP.ADD_PRINT_TEXT(745,656,154,20,"出生证号码");
    LODOP.ADD_PRINT_TEXT(876,577,36,20,"08");
    LODOP.ADD_PRINT_TEXT(662,693,157,20,"身份证号码");
    LODOP.ADD_PRINT_TEXT(677,734,158,20,"儿童编码");
    LODOP.ADD_PRINT_TEXT(572,319,100,20,"西湖");
    LODOP.ADD_PRINT_TEXT(943,351,42,20,"望江");
    LODOP.ADD_PRINT_TEXT(853,353,43,20,"宁波");
    LODOP.ADD_PRINT_TEXT(758,350,47,20,"浙江");
    LODOP.ADD_PRINT_TEXT(571,392,100,20,"江南美林苑");
    LODOP.ADD_PRINT_TEXT(960,425,38,20,"蜀山");
    LODOP.ADD_PRINT_TEXT(856,428,46,20,"合肥");
    LODOP.ADD_PRINT_TEXT(745,429,49,20,"安徽");
    LODOP.ADD_PRINT_TEXT(944,465,47,20,"体重");
    LODOP.ADD_PRINT_TEXT(695,467,100,20,"出生医院");
    LODOP.ADD_PRINT_TEXT(916,508,100,20,"母亲手机号码");
    LODOP.ADD_PRINT_TEXT(684,507,79,20,"母亲姓名");
    LODOP.ADD_PRINT_TEXT(940,273,93,20,"禁忌症");
    LODOP.ADD_PRINT_TEXT(669,275,94,20,"过敏史");
    LODOP.ADD_PRINT_TEXT(856,238,122,20,"单位联系电话");
    LODOP.ADD_PRINT_TEXT(801,157,131,20,"发证机关");
    LODOP.ADD_PRINT_TEXT(971,94,38,20,"10");
    LODOP.ADD_PRINT_TEXT(925,96,43,20,"2019");
    LODOP.ADD_PRINT_TEXT(1006,90,33,20,"22");
    LODOP.ADD_PRINT_BARCODE(590,57,100,133,"Code39","123456789012");
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.SET_PRINT_STYLEA(0,"Angle",270);*/
    return LODOP;
  }

  // 上海预防接种证sh2018版(大)
  static setSh2018BigTemplate(
    LODOP: Lodop,
    templateJson,
    contentJson,
    settings
  ): Lodop {
    // 打印初始化,打印标题
    LODOP.PRINT_INIT('打印接种本档案信息');
    // 设置打印模式
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1);
    // 装载背景图片
    // LODOP.ADD_PRINT_SETUP_BKIMG(templateJson.caseImage);
    // 背景图片宽 px
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', templateJson['imgBgWidth']);
    // 背景图片高 px
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', templateJson['imgBgHeight']);
    LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0);
    LODOP.SET_SHOW_MODE('BKIMG_TOP', 0);
    // 背景图片预览不打印
    LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1);
    LODOP.SET_PRINT_STYLE('Angle', 270);
    for (let i in contentJson) {
      if (contentJson.hasOwnProperty(i)) {
        if (templateJson.hasOwnProperty(i)) {
          const lodopParams = templateJson[i];
          LODOP.ADD_PRINT_TEXT(
            lodopParams[0] + settings.marginTop,
            lodopParams[1] + settings.marginLeft,
            lodopParams[2],
            lodopParams[3],
            contentJson[i]
          );
        }
      }
    }
    LODOP.ADD_PRINT_TEXT(670, 570, 192, 20, contentJson.idCardNo);
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3);
    LODOP.ADD_PRINT_BARCODE(
      908,
      607,
      75,
      95,
      'QRCode',
      contentJson.profileCode
    );
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);

    /* LODOP.PRINT_INITA(0,0,788,1073,"");
     LODOP.ADD_PRINT_TEXT(654,690,105,20,"姓名");
     LODOP.ADD_PRINT_TEXT(634,656,24,20,"男");
     LODOP.ADD_PRINT_TEXT(799,628,21,20,"否");
     LODOP.ADD_PRINT_TEXT(820,603,27,20,"08");
     LODOP.ADD_PRINT_TEXT(716,602,38,20,"1987");
     LODOP.ADD_PRINT_TEXT(745,629,19,20,"是");
     LODOP.ADD_PRINT_TEXT(692,659,19,20,"女");
     LODOP.ADD_PRINT_TEXT(777,600,27,20,"12");
     LODOP.ADD_PRINT_TEXT(750,493,48,20,"合肥");
     LODOP.ADD_PRINT_TEXT(670,570,192,20,"340822198702151123");
     LODOP.ADD_PRINT_TEXT(693,493,45,20,"安徽");
     LODOP.ADD_PRINT_TEXT(675,414,115,20,"母亲手机号码");
     LODOP.ADD_PRINT_TEXT(673,440,118,20,"父亲手机号码");
     LODOP.ADD_PRINT_TEXT(845,496,130,20,"新云水云间");
     LODOP.ADD_PRINT_TEXT(794,494,46,20,"蜀山");
     LODOP.ADD_PRINT_TEXT(913,382,114,20,"母亲姓名");
     LODOP.ADD_PRINT_TEXT(683,379,110,20,"父亲姓名");
     LODOP.ADD_PRINT_TEXT(880,324,39,20,"2019");
     LODOP.ADD_PRINT_TEXT(816,354,147,20,"发证单位");
     LODOP.ADD_PRINT_TEXT(984,321,25,20,"22");
     LODOP.ADD_PRINT_TEXT(939,323,34,20,"10");
     LODOP.ADD_PRINT_BARCODE(908,607,75,95,"Code39","123456789012");
     LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
     LODOP.SET_PRINT_STYLEA(0,"Angle",270);*/

    return LODOP;
  }
}
