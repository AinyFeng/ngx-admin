import { Pipe, PipeTransform } from '@angular/core';
import { DicDataService } from '../../service/dic.data.service';
import { FieldNameUtils } from '../../utils/field.name.utils';

/*
 * 在使用的时候统一为驼峰命名法
 * | id | 字段类型 - 中文 | 字段类型 - type (驼峰命名) | code | Description  |
 */
/*
1	可用状态	usable_status	0	停用
2	可用状态	usable_status	1	启用
3	学校类型	school_type	0	幼儿园
4	学校类型	school_type	1	小学
5	是否附带产科	obstetrics_status	0	附带
6	是否附带产科	obstetrics_status	1	不附带
7	与受种人关系	family_relation	0	本人
8	与受种人关系	family_relation	1	父亲
9	与受种人关系	family_relation	2	母亲
10	与受种人关系	family_relation	3	兄弟
11	与受种人关系	family_relation	4	兄妹
12	与受种人关系	family_relation	5	姐妹
13	与受种人关系	family_relation	6	祖孙
14	与受种人关系	family_relation	7	叔侄
15	与受种人关系	family_relation	8	其他
16	签字来源	sign_source	0	微信
17	签字来源	sign_source	1	面签
18	签字来源	sign_source	2	自助机
19	签字来源	sign_source	3	App
20	部门类型	department_type	0	登记台
21	部门类型	department_type	1	接种台
22	部门类型	department_type	2	收费台
23	部门类型	department_type	3	主任室
24	部门类型	department_type	4	药械室
25	职员状态	staff_status	0	离职
26	职员状态	staff_status	1	在职
27	职员状态	staff_status	2	借调
28	职员角色	staff_role	0	主任
29	职员角色	staff_role	1	副主任
30	职员角色	staff_role	2	医生
31	职员角色	staff_role	3	护士
32	企业类型	enterprise_type	0	事业单位
33	企业类型	enterprise_type	1	私营企业
34	设备状态	facility_status	0	正常
35	设备状态	facility_status	1	损坏
36	设备状态	facility_status	2	报修
37	设备状态	facility_status	3	报废
38	疫苗状态	vaccine_status	D	非活疫苗
39	疫苗状态	vaccine_status	L	减活疫苗
40	疫苗状态	vaccine_status	M	非活和减活联合疫苗
41	批次状态	batch_status	0	停用
42	批次状态	batch_status	1	召回
43	批次状态	batch_status	2	在用
44	固定资产来源	fixed_assets_source	0	中央财政
45	固定资产来源	fixed_assets_source	1	省财政
46	固定资产来源	fixed_assets_source	2	市财政
47	固定资产来源	fixed_assets_source	3	县财政
48	固定资产来源	fixed_assets_source	4	国际项目
49	固定资产来源	fixed_assets_source	5	自购
50	固定资产来源	fixed_assets_source	6	其他
51	计量单位	measure_unit	0	支
52	计量单位	measure_unit	1	粒
53	疫苗是否进口	vaccine_import_status	0	非进口
54	疫苗是否进口	vaccine_import_status	1	进口
55	生物类别	biology_category	0	病毒疫苗
56	生物类别	biology_category	1	细菌疫苗
57	生物类别	biology_category	2	混合疫苗
58	生物类别	biology_category	3	被动免疫制剂
59	生物类别	biology_category	4	试剂
60	生物类别	biology_category	5	其他
61	接种方式	vaccinate_way	0	划痕
62	接种方式	vaccinate_way	1	肌肉
63	接种方式	vaccinate_way	2	肌肉或皮下
64	接种方式	vaccinate_way	3	口服
65	接种方式	vaccinate_way	4	皮下
66	接种方式	vaccinate_way	5	皮内
67	接种部位	vaccinate_part	0	左上臂三角肌
68	接种部位	vaccinate_part	1	右上臂三角肌
69	接种部位	vaccinate_part	2	左臀
70	接种部位	vaccinate_part	3	右臀
71	接种部位	vaccinate_part	4	左大腿前外/内侧
72	接种部位	vaccinate_part	5	右大腿前外/内侧
73	接种部位	vaccinate_part	6	左前臂掌侧
74	接种部位	vaccinate_part	7	右前臂掌侧
75	接种部位	vaccinate_part	8	口服或其他部位
82	接种状态	vaccinate_status	0	未确认
83	接种状态	vaccinate_status	1	可接种
84	接种状态	vaccinate_status	2	接种中
85	接种状态	vaccinate_status	3	接种完成
86	接种类型	vaccinate_type	0	常规接种
87	接种类型	vaccinate_type	1	群体接种
88	接种类型	vaccinate_type	2	应急接种
89	接种类型	vaccinate_type	3	加强接种
90	接种类型	vaccinate_type	4	其他接种
91	接种数据来源	data_source_type	0	接种生成
92	接种数据来源	data_source_type	1	其他系统导入
93	接种数据来源	data_source_type	2	补录
94	接种数据来源	data_source_type	3	省平台下载
95	接种数据来源	data_source_type	4	产科补录
96	疫苗类型	vaccine_type	0	一类
97	疫苗类型	vaccine_type	1	二类
98	接种单位类型	vaccinate_unit_type	0	事业单位
99	接种单位类型	vaccinate_unit_type	1	学校
100	容器类型	container_type	0	安瓶
101	容器类型	container_type	1	西林
102	容器类型	container_type	2	预填充
103	容器类型	container_type	3	西林+预填充
104	容器类型	container_type	4	BOPP膜
105	容器类型	container_type	5	复合膜袋
106	容器类型	container_type	6	双铝包装
107	剂型	dosage_form	0	液体
108	剂型	dosage_form	1	冻干
109	剂型	dosage_form	2	丸剂
110	剂型	dosage_form	3	肠溶胶囊
111	剂型	dosage_form	4	冻干+液体
112	剂型	dosage_form	5	其他
113	剂型	dosage_form	6	糖丸
114	剂型	dosage_form	7	胶囊
115	是否国家标准编码	nation_standard_code	0	国家标准编码
116	是否国家标准编码	nation_standard_code	1	自定义编码
117	性别	gender_code	m	男
118	性别	gender_code	f	女
119	证件类型	id_card_type	1	大陆居民身份证
120	证件类型	id_card_type	2	护照
121	证件类型	id_card_type	3	军官证（士兵证）
122	证件类型	id_card_type	4	港澳居民来往内地通行证
123	证件类型	id_card_type	5	台湾居民来往内地通行证
124	建档类型	profile_type	1	新生儿建卡
125	建档类型	profile_type	2	成人建卡
126	建档类型	profile_type	3	狂犬
127	建档类型	profile_type	4	省外迁入
128	建档类型	profile_type	5	补卡
129	在册状态	profile_status	1	在册
130	在册状态	profile_status	2	在册
131	在册状态	profile_status	3	在册
132	在册状态	profile_status	4	离册
133	在册状态	profile_status	5	离册
234	在册状态	profile_status	6	死亡
235	在册状态	profile_status	7	空挂户
236	在册状态	profile_status	8	空挂户
237	在册状态	profile_status	9	空挂户
238	在册状态	profile_status	10	省平台删除
134	户口类型	id_type	1	本县
135	户口类型	id_type	2	本市
136	户口类型	id_type	3	本省
137	户口类型	id_type	4	外省
138	户口类型	id_type	5	境外
139	户口类型	id_type	6	港澳台
140	居住类型	residential_type	1	本地
141	居住类型	residential_type	2	外来
142	居住类型	residential_type	3	流动
143	所属区块	belong_district	1	区站建卡
144	所属区块	belong_district	2	流动自来
145	所属区块	belong_district	3	流动摸底
146	所属区块	belong_district	4	临时接种
147	所属区块	belong_district	5	异地接种
148	所属区块	belong_district	6	新生儿
149	出入库流水-出入库类型	stock_change_event	1	平台出入库
150	出入库流水-出入库类型	stock_change_event	2	跨门诊调拨
151	出入库流水-出入库类型	stock_change_event	3	门诊内调剂
152	出入库流水-出入库类型	stock_change_event	4	批量接种
153	出入库流水-出入库类型	stock_change_event	5	接种出库
154	出入库流水-出入库类型	stock_change_event	6	报损出库
155	出入库流水-出入库类型	stock_change_event	7	其他出入库
156	省市平台入库是否接收	is_accept	0	否
157	省市平台入库是否接收	is_accept	1	是
158	入库验收登记-表单一致	sheet_comparison	0	不符合
159	入库验收登记-表单一致	sheet_comparison	1	符合
160	入库验收登记-数量一致	number_comparison	0	不符合
161	入库验收登记-数量一致	number_comparison	1	符合
162	入库验收登记-温度正常	temperature_record	0	不正常
163	入库验收登记-温度正常	temperature_record	1	正常
164	门诊内调拨-调拨类型	allot_type	1	分发
165	门诊内调拨-调拨类型	allot_type	2	退回
166	门诊内调拨-调拨类型	allot_type	3	调剂
167	报损出库-报损原因	break_type	1	暴露超时
168	报损出库-报损原因	break_type	2	打碎
169	报损出库-报损原因	break_type	3	疫苗浑浊
170	报损出库-报损原因	break_type	99	其他
171	库存合议-合议项	modify_option	1	值
172	库存合议-合议项	modify_option	2	批号
173	库存合议-合议项	modify_option	3	操作人
174	库存统计-生成方式	generate_type	1	系统自动生成
175	库存统计-生成方式	generate_type	2	人工触发
176	档案信息-建档来源	profile_source_type	0	APP建档
177	档案信息-建档来源	profile_source_type	1	微信建档
178	档案信息-建档来源	profile_source_type	2	POV建档
179	禁忌症类型	taboo_type	1	免疫缺陷病，如白血病、淋巴瘤等(全部活疫苗)
180	禁忌症类型	taboo_type	2	恶性肿瘤(全部活疫苗)&quot;&gt;恶性肿瘤(全部活疫苗)
181	禁忌症类型	taboo_type	3	应用皮质类固醇、烷化剂及抗代谢药物(全部活疫苗)
182	禁忌症类型	taboo_type	4	放射治疗、使用免疫抑制剂治疗者(全部活疫苗)
183	禁忌症类型	taboo_type	5	脾缺损(全部活疫苗)&quot;&gt;脾缺损(全部活疫苗)
184	禁忌症类型	taboo_type	6	4周内使用过免疫球蛋白者(全部活疫苗)
185	禁忌症类型	taboo_type	7	妊娠期妇女(风疹、流感、腮腺炎、水痘疫苗)
186	禁忌症类型	taboo_type	8	对鸡蛋有过敏史者(麻疹、风疹、腮腺炎疫苗)
187	禁忌症类型	taboo_type	9	患急性传染病或其他严重疾病者(所有疫苗)
188	禁忌症类型	taboo_type	10	癫痫等神经系统疾病或既往精神病(乙脑.DPT.  A群流脑)
189	禁忌症类型	taboo_type	11	种某疫苗曾有过敏反应等严重异常反应者(同种疫苗)
190	禁忌症类型	taboo_type	12	湿疹等严重皮肤病（BCG）
191	禁忌症类型	taboo_type	13	结核菌素（PPD）试验阳性（BCG）
192	禁忌症类型	taboo_type	14	肾炎及恢复期（DPT）
193	禁忌症类型	taboo_type	15	骨髓或实体器官移植（BCG  、OPV）
194	禁忌症类型	taboo_type	16	其他
210	预约来源	reservation_type	0	POV预约
211	预约来源	reservation_type	1	微信预约
212	预约来源	reservation_type	2	APP预约
217	在册状态变更	profile_status_change	1	本地
218	在册状态变更	profile_status_change	2	外地转来
219	在册状态变更	profile_status_change	3	入托
220	在册状态变更	profile_status_change	4	临时外转
221	在册状态变更	profile_status_change	5	迁出
222	在册状态变更	profile_status_change	6	死亡
223	在册状态变更	profile_status_change	7	空挂户
224	在册状态变更	profile_status_change	8	临时接种
225	在册状态变更	profile_status_change	9	异地接种
226	在册状态变更原因	profile_status_change_reason	1	跟随父母去打工
227	在册状态变更原因	profile_status_change_reason	2	移居
228	在册状态变更原因	profile_status_change_reason	3	返乡
229	在册状态变更原因	profile_status_change_reason	4	逾期三个月未接种且查无此人
230	在册状态变更原因	profile_status_change_reason	5	无法删除的重卡
231	在册状态变更原因	profile_status_change_reason	6	其它
232	在册状态变更原因	profile_status_change_reason	7	平台迁入
233	在册状态变更原因	profile_status_change_reason	8	平台迁出
239	队列状态	reg_queue_status	0	待登记
240	队列状态	reg_queue_status	1	登记中
241	队列状态	reg_queue_status	2	登记完成
242	队列状态	reg_queue_status	3	待缴费
243	队列状态	reg_queue_status	4	缴费中
244	队列状态	reg_queue_status	5	缴费完成
245	队列状态	reg_queue_status	6	待接种
246	队列状态	reg_queue_status	7	接种中
247	队列状态	reg_queue_status	8	接种完成
248	队列状态	reg_queue_status	9	留观中
249	队列状态	reg_queue_status	10	留观结束
250	队列状态	reg_queue_status	11	留观确认
251	队列操作	reg_queue_action	0	取号
252	队列操作	reg_queue_action	1	登记台叫号
253	队列操作	reg_queue_action	2	登记台过号
254	队列操作	reg_queue_action	3	确认登记
255	队列操作	reg_queue_action	5	缴费完成
256	队列操作	reg_queue_action	6	接种叫号
257	队列操作	reg_queue_action	7	接种过号
258	队列操作	reg_queue_action	8	确认接种
259	队列操作	reg_queue_action	9	留观完成
260	队列操作	reg_queue_action	10	留观确认
261	动物名称	animal	0	狗
262	动物名称	animal	1	猫
263	动物名称	animal	2	老鼠
264	动物名称	animal	3	猪
265	动物名称	animal	4	驴
266	动物名称	animal	5	羊
267	动物名称	animal	6	马
268	动物名称	animal	7	牛
269	动物名称	animal	8	狐
270	动物名称	animal	9	鼬
271	动物名称	animal	10	狼
272	动物名称	animal	11	蝙蝠
273	动物名称	animal	12	獾
274	动物名称	animal	13	其它
275	受伤部位	injury_site	0	左手
276	受伤部位	injury_site	1	右手
277	受伤部位	injury_site	2	左臂
278	受伤部位	injury_site	3	右臂
279	受伤部位	injury_site	4	左大腿
280	受伤部位	injury_site	5	右大腿
281	受伤部位	injury_site	6	左小腿
282	受伤部位	injury_site	7	右小腿
283	受伤部位	injury_site	8	左脸
284	受伤部位	injury_site	9	右脸
285	受伤部位	injury_site	10	左脚
286	受伤部位	injury_site	11	右脚
287	受伤部位	injury_site	12	头部
288	受伤部位	injury_site	13	颈部
289	受伤部位	injury_site	14	其它
290	受伤方式	injury_type	0	咬伤
291	受伤方式	injury_type	1	抓伤
292	受伤方式	injury_type	2	舔伤
293	处理地点	handle_place	0	本门诊
294	处理地点	handle_place	1	家里
295	处理地点	handle_place	2	诊所
296	处理地点	handle_place	3	医院
297	处理地点	handle_place	4	其它
298	过号状态	pass_status	0	否
299	过号状态	pass_status	1	是
300	队列操作	reg_queue_action	4	缴费叫号
301	队列操作	reg_queue_action	11	取消排号
302	队列状态	reg_queue_status	12	已取消
303	接种状态	vaccinate_status	99	不可接种
304	预约状态	reservation_status	0	待确认
305	预约状态	reservation_status	1	已确认
306	预约状态	reservation_status	2	已完成
307	预约状态	reservation_status	3	作废
308	工作日周期	working_round	0	单周
309	工作日周期	working_round	1	双周
310	工作日周期	working_round	2	单月
311	支付方式	pay_way	0	现金支付
312	支付方式	pay_way	1	移动支付
313	支付方式	pay_way	2	转账支付
314	支付方式	pay_way	3	医保收费
*/
/*
*@usage 用法说明
*<p>性别： {{ f | dicPipe:'genderCode'}}</p>
*/

@Pipe({
  name: 'dicPipe',
  pure: true
})

/**
 * 字典表的pipe
 */
export class DictionaryPipe implements PipeTransform {
  dicData: any;

  constructor(private dicSvc: DicDataService) {
    this.dicData = this.dicSvc.getDicData();
  }

  transform(value: any, type: string): any {
    if (!value || !type) {
      return '-';
    }
    if (value.toString().trim() === '' || type.trim() === '') {
      return '-';
    }
    if (!this.dicData) {
      return '-';
    }
    if (type.indexOf('_') !== -1) {
      type = FieldNameUtils.toHump(type);
    }
    const valArr = this.dicData[type];
    if (!valArr) return;
    let ret = '-';
    valArr.forEach(item => {
      if (item['value'] === value) {
        ret = item['label'];
      }
    });
    return ret;
  }
}
