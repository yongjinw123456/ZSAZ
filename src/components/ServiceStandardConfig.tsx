import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, Check, ArrowUp, ArrowDown, Search, 
  Play, CheckCircle, ChevronRight, Layers, FileText, 
  RefreshCw, AlertCircle, Settings, Shield, Info, Sliders, 
  X, ChevronDown, ExternalLink, HelpCircle, Sparkles
} from 'lucide-react';

// Define TS Interfaces for Configuration State
export interface ServiceStep {
  id: string;
  name: string;
  role: string;
  duration: number;
  durationUnit: '天' | '小时' | '工作日'; 
  deliverable: string;
  description: string;
}

export interface ServiceStandard {
  id: string;
  name: string;
  code: string;
  description: string;
  isStatutory: boolean; // True for the core 7 items
  applicableIndustries: string[];
  qualityTarget: string;
  steps: ServiceStep[];
}

// Initial 7 core regulatory safety production categories with high-fidelity, professional steps
const DEFAULT_7_STANDARDS: ServiceStandard[] = [
  {
    id: 'STD-001',
    name: '安全生产宣传教育培训',
    code: 'AQ-PX-01',
    description: '针对投保企业的主要负责人、安全管理人员及特种作业人员开展安责险法定宣教和安全技能提升。通过案例宣讲和考核闭环，全面增强一线人员的安全红线意识及防灾避险技能。',
    isStatutory: true,
    applicableIndustries: ['机械制造', '工贸轻工', '危险化学品', '建筑施工'],
    qualityTarget: '高危岗位参训率100%，理论考核及格率不低于95%，教学满意评分达90分以上。',
    steps: [
      {
        id: 'STEP-PX-1',
        name: '培训需求调研与方案定制',
        role: '服务工程师/专家',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《安全培训定制实施方案书》、《课程内容清单》',
        description: '摸排企业生产现场工艺和设备类型，收集企业近期事故隐患数据，制定针对性的专项培训方案。'
      },
      {
        id: 'STEP-PX-2',
        name: '培训教案及课件预审',
        role: '安全技术专家',
        duration: 2,
        durationUnit: '天',
        deliverable: '《专项培训课件(PPT)》、《课堂随堂测试卷》',
        description: '编写契合企业特点的讲义。由总工程师对重难点、法规引用、典型案例分析进行二级审核。'
      },
      {
        id: 'STEP-PX-3',
        name: '现场教学实施与扫码签到',
        role: '授课讲师/专家',
        duration: 1,
        durationUnit: '天',
        deliverable: '《参训学员签到表》、《授课活动影像记录》',
        description: '进行多媒体演示授课、现场沙盘演练和真实隐患照片解析互动；实行电子签到卡全流程考勤管理。'
      },
      {
        id: 'STEP-PX-4',
        name: '随堂考核与训后结果登记',
        role: '服务工程师/专家',
        duration: 1,
        durationUnit: '天',
        deliverable: '《综合成绩记录单》、《学员满意度评估矩阵》',
        description: '课后组织微信扫码随堂考核，对未通过的学生提供即时补考通知，确保安全常识人人过关。'
      }
    ]
  },
  {
    id: 'STD-002',
    name: '应急预案编制与应急演练',
    code: 'AQ-YL-02',
    description: '协助企业排查危险源突发情况，修订和论证具有高度可执行性的专项或综合应急预案。指导并执导事故演练，健全快速拉通响应与高效自救互救机制。',
    isStatutory: true,
    applicableIndustries: ['危险化学品', '矿山开采', '金属冶炼', '高科技电子'],
    qualityTarget: '预案评审会签通过率100%，演练指令响应偏差控制在3分钟以内，参演人员熟练度达标。',
    steps: [
      {
        id: 'STEP-YL-1',
        name: '企业应变能力诊断与预案编修',
        role: '应急专家小组',
        duration: 5,
        durationUnit: '工作日',
        deliverable: '《企业应急资源调查表》、《预案符合性评估清单》',
        description: '审查原预案缺陷，结合多发灾害（如防汛、泄露）重新修订和完善专业性响应预案。'
      },
      {
        id: 'STEP-YL-2',
        name: '专家指导演练桌面推演与方案确定',
        role: '服务工程师',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《应急实战演练脚本》、《演练动员布置会议纪要》',
        description: '在进行大规模实操前，组织主要应急岗位人员开展虚拟桌面沙盘，理顺应急指挥流程。'
      },
      {
        id: 'STEP-YL-3',
        name: '现场实演过程执导与应急判定',
        role: '应急安全专家',
        duration: 1,
        durationUnit: '天',
        deliverable: '《现场计时记录单》、《参演设备响应检测单》',
        description: '指导抢修组、救护组、警戒组按指令响应。专家现场旁听其对讲，测量个人防护设备穿戴实效。'
      },
      {
        id: 'STEP-YL-4',
        name: '演练后综评与纠偏整改方案',
        role: '应急安全专家',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《演练总结与提升评估报告》、《预案优化建议明细》',
        description: '对现场发现的抢险路线错误、器材缺失等问题，提供专项修正表，并指导修正预案条款。'
      }
    ]
  },
  {
    id: 'STD-003',
    name: '安全风险辨识评估',
    code: 'AQ-FX-03',
    description: '深入生产车间、化学品仓库、配电重型机房进行网格化排查。运用HAZOP、JHA、LEC等工程学定量和定性方法，辨识作业环境的不安全状态与管理疏失，输出风险判定清册。',
    isStatutory: true,
    applicableIndustries: ['离散制造', '工贸轻工', '仓储物流', '机械加工'],
    qualityTarget: '全厂重大危险点发现率100%，完成红橙黄蓝四色风险绘图并落实岗位风险告知义务。',
    steps: [
      {
        id: 'STEP-FX-1',
        name: '基础资料调研与台账录入',
        role: '服务工程师',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《辨识前置资料收取清单》、《设备设施及物料清册》',
        description: '收集平面图、工艺流程、原辅材料等，针对性编制高频潜在事故网格化检查表。'
      },
      {
        id: 'STEP-FX-2',
        name: '专家现场巡视测绘与隐患挖掘',
        role: '安全技术专家',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《现场踏勘草稿本》、《工艺控制点测度快照》',
        description: '前往一线逐个工作岗位排查，用LEC法估算风险概率、设备暴露和后果严重性。'
      },
      {
        id: 'STEP-FX-3',
        name: '绘制四色图与风险分类建账',
        role: '安全技术专家',
        duration: 4,
        durationUnit: '工作日',
        deliverable: '《厂区重大安全风险四色图》、《分级分管隐患控制台账》',
        description: '对辨识完的项目通过图谱和数据库，按红（极高）、橙（高）、黄（中）、蓝（低）标注定位。'
      },
      {
        id: 'STEP-FX-4',
        name: '评估报告编制、校审与印发',
        role: '总工程师/评委',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《企业安全风险辨识评估报告(全本)》',
        description: '严格执行审核人、批准人双级签字。向企业呈送书面蓝本以备安监核查，并张贴防护警告。'
      }
    ]
  },
  {
    id: 'STD-004',
    name: '安全生产科技推广',
    code: 'AQ-TG-04',
    description: '引导并资助投保企业部署领先防灾科技、数据互连边缘硬件及智能防撞装置（如高大危险边坡雷达检测、有限空间毒气在线传输等），提升本质安全水平。',
    isStatutory: true,
    applicableIndustries: ['露天开采', '精细化工', '重大基建', '钢材锻造'],
    qualityTarget: '推荐技术方案实施连通率达100%，前端报警到监控人员手机时效低于5秒。',
    steps: [
      {
        id: 'STEP-TG-1',
        name: '科技应用差距诊断与科技设备匹配',
        role: '科技工程师/专家',
        duration: 4,
        durationUnit: '工作日',
        deliverable: '《本质安全强化与装备配适方案》、《性价比对表》',
        description: '比对同行业先进物防、技防技术，针对性推荐诸如智能视频火焰识别、重型机械防碰撞激光等科技手段。'
      },
      {
        id: 'STEP-TG-2',
        name: '技术架构图审核与对接调试',
        role: '服务工程师',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《传感器点位配置图谱》、《网关接入技术图表》',
        description: '确定智能检测探头、网关的最佳覆盖半径与抗干扰防护指标，落实调试和网络对接。'
      },
      {
        id: 'STEP-TG-3',
        name: '现场设备投运与预警时效实测',
        role: '安全技术专家',
        duration: 1,
        durationUnit: '工作日',
        deliverable: '《系统数据吞吐量测试单》、《报警延时测量明细》',
        description: '在现场吹入模拟标定气体或在盲区防撞区阻挡，验证声光报警器和风控专网的连通响应极限。'
      },
      {
        id: 'STEP-TG-4',
        name: '成效核估与数据归档',
        role: '安全技术专家',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《科技防灾推广成效评价书》、《物联监测年报》',
        description: '登记设备月均误报次数并提出滤噪算法优化配置，形成一厂一册科技赋能案卷。'
      }
    ]
  },
  {
    id: 'STD-005',
    name: '安全生产标准化建设',
    code: 'AQ-BZ-05',
    description: '指导企业按照国家或行业安全标准化规范（三级/二级），全面梳理现场与内控要素的合规性。纠正管理断条和记录紊乱，达到常态常效。',
    isStatutory: true,
    applicableIndustries: ['纺织制造', '轻工工贸', '物流集约', '非煤矿山'],
    qualityTarget: '标准化核心十三要素全覆盖，辅导后达标自评得分在80分或85分以上，一次性通过外部审验。',
    steps: [
      {
        id: 'STEP-BZ-1',
        name: '对表自检与启动全员宣贯',
        role: '标准化辅导组',
        duration: 5,
        durationUnit: '工作日',
        deliverable: '《标准化动员会议简要》、《自评体系实施大纲》',
        description: '组织多部门联合动员，细分标准化核心十三大要素工作任务，确定责任落实表。'
      },
      {
        id: 'STEP-BZ-2',
        name: '核心要素实地差距核实与隐患核销',
        role: '安全技术专家',
        duration: 7,
        durationUnit: '工作日',
        deliverable: '《要素缺项漏项判定表》、《限期制度修订汇总》',
        description: '一面对照车间生产防爆距离等硬核要素，一面理顺岗位责任人清单，开列清单。'
      },
      {
        id: 'STEP-BZ-3',
        name: '常态台账补充与运行监视辅导',
        role: '服务工程师',
        duration: 12,
        durationUnit: '工作日',
        deliverable: '《上墙宣贯看板》、《标准化十三要素标准化卷宗》',
        description: '辅导并演练日常的重大设备巡查、特种用电票证审签流程，杜绝账实不符，常态长久运行。'
      },
      {
        id: 'STEP-BZ-4',
        name: '模拟外部专家考评大演练',
        role: '外部资深评议组',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《模拟现场打分报告》、《临阵丢分整改追踪》',
        description: '模拟外部评审团上门检查，进行逐一要素点算扣分点，针对性的辅导企业突审答辩。'
      },
      {
        id: 'STEP-BZ-5',
        name: '评审卷宗组装与受理达标',
        role: '标准化辅导组',
        duration: 4,
        durationUnit: '工作日',
        deliverable: '《安全生产标准化审查整备全案卷》、《审签受理书》',
        description: '打包汇总申报书料、向安监正式申报迎审、落实最终颁证认证。'
      }
    ]
  },
  {
    id: 'STD-006',
    name: '重大事故隐患排查',
    code: 'AQ-ZC-06',
    description: '严格对照最新防灾条例与行业《重大事故隐患判定标准》，对高空、防爆电气、特种叉车设备及动火票证管理等开展全面地毯式诊断，杜绝系统性安全溃堤。',
    isStatutory: true,
    applicableIndustries: ['油气储运', '危险化学品', '表面粉尘涉爆', '冶金有色'],
    qualityTarget: '重大事故安全隐患清零率100%，判定分析标准引用精确度100%，确保企业零伤亡隐患。',
    steps: [
      {
        id: 'STEP-ZC-1',
        name: '编制隐患专项清排路线及检查方案',
        role: '安全技术专家',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《企业特有重大事故隐患判别标准手册》、《排查方案》',
        description: '根据企业特色经营门类匹配对应条款，圈定如精细化工危险度、涉爆粉尘抑爆器等关键排程。'
      },
      {
        id: 'STEP-ZC-2',
        name: '专家深入一线全面实勘与仪器诊断',
        role: '资深注册安全工程师',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《便携手持检测仪记录原始簿》、《现场诊断快照表》',
        description: '依靠特种红外防爆测尘仪、漏电测试仪、无损检测等手段对盲区死角作拉网排查。'
      },
      {
        id: 'STEP-ZC-3',
        name: '出具重大隐患限期整改责任告知书',
        role: '安全技术专家',
        duration: 1,
        durationUnit: '天',
        deliverable: '《重大事故隐患判定告诫书》、《隐患整改闭环路线书》',
        description: '开具隐患项目，附注法条对照说明，制定“时间、责任、资金、措施、预案”五落实治理意见。'
      },
      {
        id: 'STEP-ZC-4',
        name: '限期回查追踪与整改销号',
        role: '注册安全工程师',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《重大隐患销项评核认定表》、《闭环通过整改报告》',
        description: '在上门复核整改成效。在满足技术安全性后正式签字销号，完成该季度隐患穿透。'
      }
    ]
  },
  {
    id: 'STD-007',
    name: '其他事故预防服务',
    code: 'AQ-QT-07',
    description: '安责险合规范围内的个性化预防技术支持，包括职业暴露环境检测、防坠落保护系统巡检、节假日临检，以及防灾防损咨询论证等。',
    isStatutory: true,
    applicableIndustries: ['跨国企业', '大商办写字楼', '劳动密集型加工', '市政公用'],
    qualityTarget: '特约指标测度符合国家抽采样精度规定，成果下载无阻碍响应率99%以上。',
    steps: [
      {
        id: 'STEP-QT-1',
        name: '诉求及防灾现状意向对齐书编写',
        role: '服务工程师',
        duration: 2,
        durationUnit: '工作日',
        deliverable: '《预防服务定制说明书》、《现场诊断确认函》',
        description: '开展前期合规需求和检测环境比对。约定特殊有害噪音、电介质绝缘等定制检测细节。'
      },
      {
        id: 'STEP-QT-2',
        name: '专项实施大纲批准与前置准备',
        role: '安全技术专家',
        duration: 1,
        durationUnit: '天',
        deliverable: '《特定技术诊断操作方案书》、《仪器合规溯源鉴定表》',
        description: '批准专项分析手册。校准和封存所需设备：雷击保护桩电阻测试探针，甲醛职业有害采样仪等。'
      },
      {
        id: 'STEP-QT-3',
        name: '实测工程量作业与防灾防灾防灾',
        role: '安全技术专家',
        duration: 3,
        durationUnit: '工作日',
        deliverable: '《多点多岗位采样原始比对库》、《安全工程实操作画》',
        description: '完成现场物化成分采集、特大行车电磁稳定性量测，提供高空临边防护安全拉锁负重试验。'
      },
      {
        id: 'STEP-QT-4',
        name: '成果归档及云端提供客户随时调阅',
        role: '服务工程师',
        duration: 1,
        durationUnit: '天',
        deliverable: '《专项事故预防特定评测总结单》、《系统报告签发电子卡》',
        description: '汇总检测数据，出具权威防灾改善指导单与符合性签认，交付系统成果中心提供随想调阅。'
      }
    ]
  }
];

// Presets flow template list for the quick template fast-loading feature
const WORKFLOW_TEMPLATES = [
  {
    name: "标准专家服务服务流程 (4个节点)",
    description: "全面、严密的专家级闭环流程，涵盖全面摸排调研、双工程师审查、现场实测与多方位评价，符合绝大多数法定保险事故预防需要。",
    steps: [
      { name: "调研评估与针对方案制订", role: "安全技术专家", duration: 3, durationUnit: "工作日", deliverable: "《调研档案及服务特约方案》", description: "现场收集一手信息、制定检查主线。" },
      { name: "现场勘测实地挖潜隐患", role: "注册安全工程师", duration: 2, durationUnit: "天", deliverable: "《一网多机缺陷明细台账》", description: "细化车间各个用能及消防设备点位检测。" },
      { name: "审核报告双审与出具签发", role: "资深总工程师", duration: 2, durationUnit: "工作日", deliverable: "《安全防灾诊断签发全案》", description: "逐个工艺及指标推导逻辑复核审查，双级权威盖章。" },
      { name: "跟踪指导复审与成果交付", role: "服务工程师", duration: 1, durationUnit: "天", deliverable: "《验收合格闭环回单》", description: "协助企业查收报告、答疑并收集回访满意度。" }
    ]
  },
  {
    name: "轻量安全宣传与培训流程 (3个节点)",
    description: "适用于安全宣传、专题知识课堂等轻型授课场景，重视课前需求对齐、课中扫码互动和课后扫码百分百通关检测。",
    steps: [
      { name: "安全培训需求与大纲对齐", role: "培训讲师", duration: 2, durationUnit: "工作日", deliverable: "《大纲规划与课程PPT草案》", description: "对投保企业的岗位特色和事故高发案例进行定向课件适配。" },
      { name: "现场教案宣讲及安全演板", role: "授课专家", duration: 1, durationUnit: "天", deliverable: "《扫码签到表与一线培训照片》", description: "注重实效与警示教育，全员必过，现场授课影像存档备审。" },
      { name: "随堂手机在线考核评级", role: "服务工程师", duration: 1, durationUnit: "小时", deliverable: "《全员成绩及问卷评估年鉴》", description: "利用小程序或考卷扫码开展测验，不通过实行现场或限期补考。" }
    ]
  },
  {
    name: "深度重大事故安全排查流程 (5个节点)",
    description: "最高安全等级的隐患排查。从前置梳理判定规章开始，经历专家上门、大纲诊断、法律告知和注册专家上门二次验收，确保风险彻底清零。",
    steps: [
      { name: "行业重大事故隐患判别法条梳理", role: "法规顾问组", duration: 1, durationUnit: "工作日", deliverable: "《重大隐患条款判定指导册》", description: "结合行业法规收集针对该特定企业高危设备的红线指引。" },
      { name: "车间工艺与重点设施防爆大勘察", role: "国家级安全技术专家", duration: 4, durationUnit: "工作日", deliverable: "《现场原始仪器测试红外日志》", description: "现场进行微点位探伤、热辐射和粉尘测定，无死角挖缺隐患。" },
      { name: "重特大安全事故判别告知与督整", role: "注册安全工程师", duration: 1, durationUnit: "天", deliverable: "《五落实重大隐患整改告知单》", description: "给出明确整改限期，说明法定义务及延期整改隐性法律风险。" },
      { name: "高危点复检认定与动态核销", role: "注册安全工程师", duration: 2, durationUnit: "工作日", deliverable: "《闭环回执整改销号台账》", description: "专家二度莅临车间，亲测防爆及抑压动作灵敏度并确认销号。" },
      { name: "季度本质安全分析及科技上建", role: "服务工程师", duration: 2, durationUnit: "工作日", deliverable: "《本质安全长远提升建议》", description: "结合问题发生频次，指导企业追加智能物联和长效防范系统。" }
    ]
  }
];

export function ServiceStandardConfig() {
  // State 1: Master service standard records loaded from localStorage or default list
  const [standards, setStandards] = useState<ServiceStandard[]>(() => {
    const saved = localStorage.getItem('abx_service_standards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return DEFAULT_7_STANDARDS;
      }
    }
    return DEFAULT_7_STANDARDS;
  });

  // Local Storage synchronizer
  useEffect(() => {
    localStorage.setItem('abx_service_standards', JSON.stringify(standards));
  }, [standards]);

  // State 2: Selected service standard index
  const [selectedId, setSelectedId] = useState<string>('STD-001');

  // Search keyword inside standard sidebar
  const [searchQuery, setSearchQuery] = useState('');

  // Active Standard Record
  const activeStandard = useMemo(() => {
    return standards.find(std => std.id === selectedId) || null;
  }, [standards, selectedId]);

  // Sidebar Filtered List
  const filteredStandards = useMemo(() => {
    if (!searchQuery.trim()) return standards;
    const q = searchQuery.toLowerCase();
    return standards.filter(std => 
      std.name.toLowerCase().includes(q) || 
      std.code.toLowerCase().includes(q) ||
      std.description.toLowerCase().includes(q)
    );
  }, [standards, searchQuery]);

  // Form State under "Selected standard details" (controlled component-like local edits with autosave/manual save options)
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editQuality, setEditQuality] = useState('');
  const [editIndustries, setEditIndustries] = useState<string[]>([]);
  const [newIndustryInput, setNewIndustryInput] = useState('');
  const [configTab, setConfigTab] = useState<'workflow' | 'basic'>('workflow');

  // Step modal list or creation controllers
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepFormName, setStepFormName] = useState('');
  const [stepFormRole, setStepFormRole] = useState('服务工程师/专家');
  const [stepFormDuration, setStepFormDuration] = useState<number>(3);
  const [stepFormUnit, setStepFormUnit] = useState<'天' | '小时' | '工作日'>('工作日');
  const [stepFormDeliverable, setStepFormDeliverable] = useState('');
  const [stepFormDesc, setStepFormDesc] = useState('');

  // Toast Notification triggers
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Sync edit states whenever activeStandard shifts
  useEffect(() => {
    if (activeStandard) {
      setEditName(activeStandard.name);
      setEditCode(activeStandard.code);
      setEditDesc(activeStandard.description);
      setEditQuality(activeStandard.qualityTarget);
      setEditIndustries(activeStandard.applicableIndustries || []);
      setEditingStepId(null); // Reset step editor
    }
  }, [activeStandard]);

  // Auto calculate total accumulated timeframe of current standard Steps
  const calculatedTotalLength = useMemo(() => {
    if (!activeStandard || !activeStandard.steps.length) return "未设计步骤";
    const groupUnits: Record<string, number> = { '天': 0, '小时': 0, '工作日': 0 };
    activeStandard.steps.forEach(s => {
      groupUnits[s.durationUnit] = (groupUnits[s.durationUnit] || 0) + s.duration;
    });

    const parts: string[] = [];
    if (groupUnits['工作日'] > 0) parts.push(`${groupUnits['工作日']}个工作日`);
    if (groupUnits['天'] > 0) parts.push(`${groupUnits['天']}天`);
    if (groupUnits['小时'] > 0) parts.push(`${groupUnits['小时']}小时`);
    return parts.join(' + ');
  }, [activeStandard]);

  // Core Service Save handler (Update main description parameters)
  const handleSaveBasicDetails = () => {
    if (!activeStandard) return;
    if (!editName.trim()) {
      triggerToast("服务名称不可为空!", "warning");
      return;
    }
    
    setStandards(prev => prev.map(s => {
      if (s.id === selectedId) {
        return {
          ...s,
          name: editName,
          code: editCode,
          description: editDesc,
          qualityTarget: editQuality,
          applicableIndustries: editIndustries
        };
      }
      return s;
    }));
    triggerToast("服务大项基本标准与业务参数已成功保存", "success");
  };

  // Quick reset parameters to preset statutory ones
  const handleResetToPresets = () => {
    if (window.confirm("确定清除所有本地编辑并恢复系统预设安责险七大项法定服务标准吗？此操作无法撤销。")) {
      setStandards(DEFAULT_7_STANDARDS);
      setSelectedId('STD-001');
      localStorage.setItem('abx_service_standards', JSON.stringify(DEFAULT_7_STANDARDS));
      triggerToast("已全部复原并同步至法定默认标准", "info");
    }
  };

  // Add a fully custom standard
  const handleAddCustomStandard = () => {
    const newId = `STD-CUST-${Date.now().toString().slice(-4)}`;
    const newStd: ServiceStandard = {
      id: newId,
      name: '新增事故预防定制服务',
      code: `AQ-CUST-${newId.slice(-4)}`,
      description: '为特定企业、特殊保单特别配属的预防性技术服务规范标准。可包含特定网格化隐患排雷方案。',
      isStatutory: false,
      applicableIndustries: ['所有行业'],
      qualityTarget: '依特约保单质量条款进行专家评核',
      steps: [
        {
          id: `STEP-CUST-${Date.now()}-1`,
          name: '现场对接与合同特约核对',
          role: '服务工程师',
          duration: 1,
          durationUnit: '工作日',
          deliverable: '《服务说明书书签收联》',
          description: '与企业管理责任人对接服务周期和点位数量。'
        },
        {
          id: `STEP-CUST-${Date.now()}-2`,
          name: '工程诊断并交付结论纸质报告',
          role: '注册安全工程师',
          duration: 3,
          durationUnit: '工作日',
          deliverable: '《专项安全风控技术诊断书》',
          description: '开展实走检测、出具改进意见与系统归档。'
        }
      ]
    };

    setStandards(prev => [...prev, newStd]);
    setSelectedId(newId);
    triggerToast(`服务选项 '${newStd.name}' 已成功新建！`, "success");
  };

  // Delete a customized standard standard
  const handleDeleteStandard = (id: string, name: string) => {
    const isStatutory = standards.find(s => s.id === id)?.isStatutory;
    if (isStatutory) {
      triggerToast("此为安责险国家法定基本预防服务，依法不允许直接卸除！", "warning");
      return;
    }

    if (window.confirm(`确定删除自定义服务 standard '${name}' 吗？`)) {
      setStandards(prev => prev.filter(s => s.id !== id));
      setSelectedId('STD-001');
      triggerToast("自定义服务标准已移除", "info");
    }
  };

  // Add Industry pill
  const handleAddIndustry = () => {
    if (!newIndustryInput.trim()) return;
    if (editIndustries.includes(newIndustryInput.trim())) {
      setNewIndustryInput('');
      return;
    }
    setEditIndustries(prev => [...prev, newIndustryInput.trim()]);
    setNewIndustryInput('');
  };

  // Remove Industry pill
  const handleRemoveIndustry = (ind: string) => {
    setEditIndustries(prev => prev.filter(i => i !== ind));
  };


  // Quick Load template workflow into current activeStandard steps list
  const handleLoadWorkflowTemplate = (tpl: typeof WORKFLOW_TEMPLATES[0]) => {
    if (!activeStandard) return;
    if (window.confirm(`确认将加载模版「${tpl.name}」？此操作将彻底替换当前服务下的所有配置流程步骤！`)) {
      const processedSteps: ServiceStep[] = tpl.steps.map((s, idx) => ({
        id: `STEP-TPL-${Date.now()}-${idx}`,
        name: s.name,
        role: s.role,
        duration: s.duration,
        durationUnit: s.durationUnit as any,
        deliverable: s.deliverable,
        description: s.description
      }));

      setStandards(prev => prev.map(s => {
        if (s.id === selectedId) {
          return {
            ...s,
            steps: processedSteps
          };
        }
        return s;
      }));
      triggerToast("工作流程标准化步骤模板已加载并替换成功！", "success");
    }
  };


  // Move Step index index up or down
  const handleMoveStep = (stepIndex: number, direction: 'up' | 'down') => {
    if (!activeStandard) return;
    const stepsCopy = [...activeStandard.steps];
    
    if (direction === 'up' && stepIndex === 0) return;
    if (direction === 'down' && stepIndex === stepsCopy.length - 1) return;

    const targetIdx = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    // Swap elements
    const temp = stepsCopy[stepIndex];
    stepsCopy[stepIndex] = stepsCopy[targetIdx];
    stepsCopy[targetIdx] = temp;

    setStandards(prev => prev.map(s => {
      if (s.id === selectedId) {
        return { ...s, steps: stepsCopy };
      }
      return s;
    }));
    triggerToast(`动作步骤已${direction === 'up' ? '前调' : '后延'}级别`, "success");
  };

  // Create or launch clean step form to add/edit step
  const handleOpenAddStepForm = () => {
    setStepFormName('');
    setStepFormRole('服务工程师/专家');
    setStepFormDuration(3);
    setStepFormUnit('工作日');
    setStepFormDeliverable('');
    setStepFormDesc('');
    setEditingStepId('NEW'); // Marker representing user is configuring a new step
  };

  const handleOpenEditStepForm = (step: ServiceStep) => {
    setStepFormName(step.name);
    setStepFormRole(step.role);
    setStepFormDuration(step.duration);
    setStepFormUnit(step.durationUnit);
    setStepFormDeliverable(step.deliverable);
    setStepFormDesc(step.description);
    setEditingStepId(step.id);
  };

  // Save Step Action Form
  const handleSaveStepForm = () => {
    if (!activeStandard) return;
    if (!stepFormName.trim()) {
      triggerToast("请填写基本的步骤名称！", "warning");
      return;
    }

    if (editingStepId === 'NEW') {
      // Append step
      const nextStep: ServiceStep = {
        id: `STEP-CUST-${Date.now()}`,
        name: stepFormName,
        role: stepFormRole,
        duration: Number(stepFormDuration) || 1,
        durationUnit: stepFormUnit,
        deliverable: stepFormDeliverable || '无需产出',
        description: stepFormDesc || '由安全技术专家到场诊断规范化该步骤具体动作。'
      };

      setStandards(prev => prev.map(s => {
        if (s.id === selectedId) {
          return {
            ...s,
            steps: [...s.steps, nextStep]
          };
        }
        return s;
      }));
      triggerToast("成功新增服务标准步骤节点！", "success");
    } else {
      // Edit step
      setStandards(prev => prev.map(s => {
        if (s.id === selectedId) {
          return {
            ...s,
            steps: s.steps.map(st => {
              if (st.id === editingStepId) {
                return {
                  ...st,
                  name: stepFormName,
                  role: stepFormRole,
                  duration: Number(stepFormDuration) || 1,
                  durationUnit: stepFormUnit,
                  deliverable: stepFormDeliverable,
                  description: stepFormDesc
                };
              }
              return st;
            })
          };
        }
        return s;
      }));
      triggerToast("步骤细节规范已成功保存！", "success");
    }

    // Clear step form state
    setEditingStepId(null);
  };

  // Delete individual step
  const handleDeleteStep = (stepId: string) => {
    if (!activeStandard) return;
    if (activeStandard.steps.length === 1) {
      triggerToast("服务核心标准中必须保留至少 1 个完整的服务流节点步骤！", "warning");
      return;
    }
    if (window.confirm("确认要删除当前步骤节点吗？")) {
      setStandards(prev => prev.map(s => {
        if (s.id === selectedId) {
          return {
            ...s,
            steps: s.steps.filter(st => st.id !== stepId)
          };
        }
        return s;
      }));
      setEditingStepId(null);
      triggerToast("该流程节点已从该服务项中删去", "info");
    }
  };

  return (
    <div id="service-standard-config-root" className="h-full flex flex-col overflow-hidden bg-slate-50 relative">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-xl border backdrop-blur animate-in fade-in duration-300 text-xs font-semibold
          ${toast.type === 'success' ? 'bg-emerald-900/95 text-white border-emerald-500' : 
            toast.type === 'warning' ? 'bg-red-900/95 text-white border-red-500' : 'bg-slate-900/95 text-white border-slate-700'}"
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-red-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Control Plane Header Tab */}
      <div className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="p-1 px-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Sliders className="w-4 h-4" />
            </span>
            事故预防服务标准配置
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            配置并健全保险事故预防基本服务。支持配置基础名称、服务适用业务字段、工作步骤及交付产出流。
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            id="reset-presets-btn"
            onClick={handleResetToPresets}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-gray-200 hover:bg-slate-50/50 px-3.5 py-2 rounded-lg font-bold shadow-2xs transition-all active:scale-[0.98]"
            title="恢复安责险国家法定7大基本预防项默认设置"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>恢复安责险7大默认项</span>
          </button>
          
          <button
            id="add-custom-standard-btn"
            onClick={handleAddCustomStandard}
            className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>新增自定义技术服务项</span>
          </button>
        </div>
      </div>

      {/* Split Work Panels Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side standard selection list rail (1/3 Width) */}
        <div className="w-72 bg-white border-r border-gray-200/80 flex flex-col shrink-0 min-h-0">
          
          {/* List Search Bar */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                id="standard-search-input"
                type="text" 
                placeholder="搜索服务名称 / 代码..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold"
              >
                重置
              </button>
            )}
          </div>

          {/* List items scroll container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5 min-h-0">
            {filteredStandards.length === 0 ? (
              <div className="py-12 px-4 text-center text-gray-400 flex flex-col items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gray-300 mb-2" />
                <p className="text-xs font-semibold">未匹配到服务项</p>
                <p className="text-[10px] mt-0.5">请修改检索词或新建自定义项</p>
              </div>
            ) : (
              filteredStandards.map((std, idx) => {
                const isActive = std.id === selectedId;
                const stepsCount = std.steps.length;
                return (
                  <div
                    key={std.id}
                    id={`side-item-${std.id}`}
                    onClick={() => {
                      setSelectedId(std.id);
                    }}
                    className={`group p-3 rounded-xl cursor-pointer border text-left transition-all ${
                      isActive 
                        ? 'bg-indigo-50/60 border-indigo-200 shadow-sm relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-indigo-600'
                        : 'bg-white border-transparent hover:bg-slate-50/70 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wide shrink-0 ${
                        std.isStatutory 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200/40'
                      }`}>
                        {std.isStatutory ? '安责法定' : '自定义项'}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 group-hover:text-indigo-400 transition-colors">
                        {std.code}
                      </span>
                    </div>

                    <div className="mt-1.5 font-bold text-xs text-gray-800 leading-snug group-hover:text-indigo-900 break-words">
                      {std.name}
                    </div>

                    <div className="mt-2.5 flex justify-between items-center text-[10px] text-gray-400 border-t border-dashed border-gray-100 pt-2">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span>{stepsCount}个设计节点</span>
                      </span>

                      {!std.isStatutory && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStandard(std.id, std.name);
                          }}
                          className="text-red-400 hover:text-red-700 font-bold p-1 rounded hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="移除自建预防项"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="bg-slate-50 p-3 rounded-b-xl border-t border-gray-100 text-[10px] text-gray-400 text-center flex flex-col gap-1 shrink-0">
            <span>列表支持自定义追加</span>
            <span className="font-mono">已载入合计 {standards.length} 类标准</span>
          </div>
        </div>

        {/* Right side designer details area (2/3 Width) */}
        {activeStandard ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
            
            {/* Simplify tab bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-1 flex justify-between items-center shrink-0 shadow-2xs">
              <div className="flex gap-6">
                <button
                  id="tab-workflow-steps"
                  onClick={() => setConfigTab('workflow')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all flex items-center gap-1.5 ${
                    configTab === 'workflow'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>⚙️ 服务动作设计与工序规程 ({activeStandard.steps.length}级步骤)</span>
                </button>
                <button
                  id="tab-basic-properties"
                  onClick={() => setConfigTab('basic')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all flex items-center gap-1.5 ${
                    configTab === 'basic'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>💼 基础属性与服务验收标准</span>
                </button>
              </div>
              
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                标准编号: <span className="font-mono text-indigo-600">{activeStandard.id}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* TIER 1: Standard Name & Business Properties Form */}
              {configTab === 'basic' && (
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
                
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-400 font-mono tracking-wider">[{activeStandard.id}]</span>
                    <h3 className="text-sm font-black text-gray-900">服务标准根属性定义</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">更新标识：2026合规标准</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Name field */}
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">服务大类名称（最多30字）</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="例如: 压力容器定期现场检测与无损探伤"
                      className="w-full text-xs bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-white rounded-lg p-2 focus:outline-none transition-all text-gray-800 font-bold"
                    />
                  </div>

                  {/* Standard code */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">标准特征辨识码</label>
                    <input 
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      placeholder="例如: AQ-WY-XG"
                      className="w-full text-xs bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-white rounded-lg p-2 focus:outline-none transition-all text-gray-700 font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-12 space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">事故预防标准大纲描述</label>
                    <textarea 
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="简短归纳此项法律预防规定下的服务工作覆盖细则..."
                      rows={2}
                      className="w-full text-xs bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-white rounded-lg p-2 focus:outline-none transition-all text-gray-600 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Applicable Industries tags */}
                  <div className="md:col-span-12 space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">适用国民经济工贸行业范围</label>
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-gray-200 rounded-lg min-h-[38px]">
                      {editIndustries.map((ind, iIdx) => (
                        <span 
                          key={iIdx}
                          className="bg-white border border-gray-200 text-gray-700 text-[10px] pl-2 pr-1 py-0.5 rounded-full font-semibold flex items-center gap-1 hover:border-red-400 group/ind"
                        >
                          <span>{ind}</span>
                          <button 
                            onClick={() => handleRemoveIndustry(ind)}
                            className="text-gray-400 hover:text-red-500 rounded-full hover:bg-slate-100 p-0.5 transition-all"
                            title="剔除"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}

                      <div className="flex items-center gap-1 ml-1">
                        <input 
                          type="text"
                          placeholder="+ 新增"
                          value={newIndustryInput}
                          onChange={(e) => setNewIndustryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddIndustry();
                            }
                          }}
                          className="bg-transparent text-[10px] text-gray-700 py-0.5 max-w-[65px] placeholder:text-gray-400 focus:outline-none"
                        />
                        {newIndustryInput.trim() && (
                          <button 
                            onClick={handleAddIndustry}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded p-0.5 transition-all text-[9px] font-bold"
                          >
                            确认
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quality objective */}
                  <div className="md:col-span-12 space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                      <span>核审与验收质量目标</span>
                      <span className="text-[9.5px] text-gray-400 italic font-normal">(用于年度专家风控评分评优参考)</span>
                    </label>
                    <input 
                      type="text"
                      value={editQuality}
                      onChange={(e) => setEditQuality(e.target.value)}
                      placeholder="标准完成标准, 如：隐患排查整改报告上传率100%"
                      className="w-full text-xs bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-white rounded-lg p-2 focus:outline-none transition-all text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center bg-indigo-50/20 p-2.5 rounded-lg border border-indigo-50/50">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>设计完成节点会自动汇总，建议定期点击<b>[保存基础标准参数]</b></span>
                  </div>
                  <button 
                    onClick={handleSaveBasicDetails}
                    id="save-basic-standard-details-btn"
                    className="flex items-center gap-1 text-xs text-white bg-slate-800 hover:bg-slate-900 border border-transparent hover:border-slate-800 px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>保存基础标准参数</span>
                  </button>
                </div>

              </div>
            )}

              {/* TIER 2 & 3 & 4: Workflow Configs */}
              {configTab === 'workflow' && (
                <>
                  {/* TIER 2: Fast Template Workflow Loading panel */}
                  <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-5 rounded-xl text-white border border-indigo-800 shadow-md">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>专家工作流模板载入</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      可针对当前服务大项，一键覆盖载入行业预设的系统极佳推荐工作流，随后再基于其作微调：
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {WORKFLOW_TEMPLATES.map((tpl, iIdx) => (
                    <div 
                      key={iIdx}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01]"
                      onClick={() => handleLoadWorkflowTemplate(tpl)}
                    >
                      <div>
                        <div className="text-xs font-bold text-amber-200 line-clamp-1">{tpl.name}</div>
                        <p className="text-[10px] text-slate-300 leading-normal mt-1 line-clamp-3">
                          {tpl.description}
                        </p>
                      </div>
                      <div className="text-[9.5px] font-semibold text-indigo-300 mt-2 flex justify-between items-center pt-2 border-t border-white/5">
                        <span>总包含 {tpl.steps.length} 级步骤</span>
                        <span className="bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-bold hover:bg-indigo-500/40">点击应用 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIER 3: Visual Sequential Pipeline Visualizer (Connected Nodes) */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">FLOW PREVIEW</span>
                    <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5 mt-0.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      串联流式设计预览路轨
                    </h3>
                  </div>
                  <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                    设计总时长: {calculatedTotalLength}
                  </span>
                </div>

                {/* Pipeline UI chain representation */}
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-200">
                  <div className="flex flex-wrap items-center gap-y-4 gap-x-2">
                    {activeStandard.steps.length === 0 ? (
                      <p className="text-[11px] text-gray-400 py-3 block text-center w-full">请通过底部组件，添加服务标准步骤设计</p>
                    ) : (
                      activeStandard.steps.map((st, sIdx) => {
                        const isLast = sIdx === activeStandard.steps.length - 1;
                        return (
                          <React.Fragment key={st.id}>
                            <div className="bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs p-3 rounded-lg flex items-center gap-2 max-w-[210px] shrink-0">
                              <span className="text-[10px] font-black w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                {sIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="text-[11.5px] font-bold text-slate-800 truncate" title={st.name}>
                                  {st.name}
                                </div>
                                <div className="text-[10px] text-gray-400 flex justify-between gap-2 mt-0.5 select-none">
                                  <span className="text-indigo-600 font-semibold">{st.role}</span>
                                  <span className="bg-gray-100 text-gray-600 px-1 rounded">{st.duration}{st.durationUnit}</span>
                                </div>
                              </div>
                            </div>
                            
                            {!isLast && (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 stroke-[3px] shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* TIER 4: Service Flow Step-by-Step Interactive Designer */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-indigo-600" />
                      动作单元与交付物流程细化设计
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      设计每个步骤的责任主体、建议执行限期。拖动或使用上下移按纽，重组技术动作。
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddStepForm}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加流程步骤</span>
                  </button>
                </div>

                {/* Form to insert / modify single detail parameters on step list */}
                {editingStepId !== null && (
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-indigo-200/60 shadow-inner grid grid-cols-1 md:grid-cols-12 gap-3.5 animate-in slide-in-from-top duration-200">
                    <div className="md:col-span-12 flex justify-between items-center border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-indigo-950">
                        {editingStepId === 'NEW' ? '➕ 拟定新步骤节点信息' : '📝 编辑步骤节点属性'}
                      </span>
                      <button 
                        onClick={() => setEditingStepId(null)}
                        className="text-gray-400 hover:text-gray-600 text-[10.5px]"
                      >
                        取消编辑
                      </button>
                    </div>

                    <div className="md:col-span-8 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">步骤名称</label>
                      <input 
                        type="text"
                        value={stepFormName}
                        onChange={(e) => setStepFormName(e.target.value)}
                        placeholder="例如: 安全自检大纲编写及评审"
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">责任主体 (主控方)</label>
                      <select 
                        value={stepFormRole}
                        onChange={(e) => setStepFormRole(e.target.value)}
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none"
                      >
                        <option value="服务工程师/专家">服务工程师/专家</option>
                        <option value="注册安全工程师">注册安全工程师</option>
                        <option value="国家级安全技术专家">国家级安全技术专家</option>
                        <option value="应急专家小组">应急专家小组</option>
                        <option value="被投保企业">被投保企业</option>
                        <option value="保险统括人/公估">保险统括人/公估</option>
                        <option value="标准化辅导组">标准化辅导组</option>
                        <option value="外部资深评议组">外部资深评议组</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">标准时限制</label>
                      <input 
                        type="number"
                        min={1}
                        value={stepFormDuration}
                        onChange={(e) => setStepFormDuration(Number(e.target.value) || 1)}
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">时间单位</label>
                      <select
                        value={stepFormUnit}
                        onChange={(e) => setStepFormUnit(e.target.value as any)}
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none"
                      >
                        <option value="工作日">工作日</option>
                        <option value="天">天</option>
                        <option value="小时">小时</option>
                      </select>
                    </div>

                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">关键交付成果/表样文件</label>
                      <input 
                        type="text"
                        value={stepFormDeliverable}
                        onChange={(e) => setStepFormDeliverable(e.target.value)}
                        placeholder="例如: 《项目现场勘察图表及交底建议书》"
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-12 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">实施动作规程细则</label>
                      <textarea 
                        value={stepFormDesc}
                        onChange={(e) => setStepFormDesc(e.target.value)}
                        placeholder="在此说明该技术环节需要开展的工艺要素查考、设备探伤或测试具体要求..."
                        rows={2}
                        className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded p-1.5 focus:outline-none resize-none leading-relaxed text-gray-600"
                      />
                    </div>

                    <div className="md:col-span-12 flex justify-end gap-2 border-t border-gray-200/60 pt-2.5">
                      {editingStepId !== 'NEW' && (
                        <button
                          onClick={() => handleDeleteStep(editingStepId)}
                          className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold transition-all mr-auto flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>删除该流程节点</span>
                        </button>
                      )}

                      <button
                        onClick={() => setEditingStepId(null)}
                        className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition-all"
                      >
                        取消
                      </button>

                      <button
                        onClick={handleSaveStepForm}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>确定保存本步配置</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step List detailed representation */}
                <div className="space-y-3">
                  {activeStandard.steps.map((step, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === activeStandard.steps.length - 1;
                    return (
                      <div 
                        key={step.id} 
                        className={`bg-slate-50/50 hover:bg-white p-4 rounded-xl border border-gray-200/80 hover:border-indigo-200/80 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                          editingStepId === step.id ? 'ring-2 ring-indigo-500/30' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          
                          {/* Heading indicators */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] bg-slate-200/80 text-slate-800 font-black w-6 h-4 rounded flex items-center justify-center font-mono">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-gray-900 leading-snug">{step.name}</span>
                            
                            {/* Role badge */}
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.2 rounded">
                              {step.role}
                            </span>

                            {/* Duration badge */}
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-mono">
                              建议时限: {step.duration} {step.durationUnit}
                            </span>
                          </div>

                          {/* Deliverables */}
                          <div className="flex items-start gap-1.5 pt-1 text-[11px] text-gray-500 select-none">
                            <span className="font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1 rounded">须得交付件:</span>
                            <span className="font-medium text-slate-700">{step.deliverable || '无特定产出大纲'}</span>
                          </div>

                          {/* Detail summary text */}
                          <p className="text-[10.5px] text-gray-400 leading-normal pl-0 truncate-2-lines line-clamp-2" title={step.description}>
                            {step.description}
                          </p>

                        </div>

                        {/* Action controllers per card */}
                        <div className="flex items-center gap-1 border-t md:border-t-0 border-gray-100/60 pt-2.5 md:pt-0 w-full md:w-auto shrink-0 justify-end">
                          
                          {/* Move up */}
                          <button
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={isFirst}
                            className={`p-1.5 rounded hover:bg-slate-100/80 transition-colors ${
                              isFirst ? 'text-gray-200 cursor-not-allowed' : 'text-slate-500'
                            }`}
                            title="提升流式节点级别(前移)"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move down */}
                          <button
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={isLast}
                            className={`p-1.5 rounded hover:bg-slate-100/80 transition-colors ${
                              isLast ? 'text-gray-200 cursor-not-allowed' : 'text-slate-500'
                            }`}
                            title="延展流式节点排序(后移)"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick editing of step items */}
                          <button
                            id={`edit-step-btn-${step.id}`}
                            onClick={() => handleOpenEditStepForm(step)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded transition-colors ml-1"
                            title="修改该级规范规程"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
              
              </>
            )}

            </div>

            {/* Sticky designer footer parameters */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-inner">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <span>正在编辑:</span> 
                <span className="font-bold text-slate-800 font-mono">[{activeStandard.code}] {activeStandard.name}</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold ml-1">
                  总计设计了 {activeStandard.steps.length} 级步骤
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 mr-2">设置即刻入库，已保存至LocalStorage</span>
                <button 
                  onClick={handleSaveBasicDetails}
                  className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-bold px-5 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>全部持久化保存</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400 bg-slate-50">
            <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm font-semibold">请在左侧选择对应预防服务标准细则进行编辑</p>
          </div>
        )}

      </div>

    </div>
  );
}
