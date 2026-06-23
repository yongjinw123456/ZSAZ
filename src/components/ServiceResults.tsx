import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Calendar, ClipboardCheck, ArrowLeft, Clock, 
  Play, CheckCircle, Download, Star, X, Eye, ThumbsUp, AlertCircle
} from 'lucide-react';

// Define Work Order interface
interface WorkOrder {
  id: string;
  time: string;
  expert: string;
  status: '调度中' | '服务中' | '已完成';
  category7: string;
  category9: string;
  projectName: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  reportName: string;
  details: string;
  rating: number | null;
  comment: string;
}

export function ServiceResults() {
  // Navigation State: 'overview' | 'work-orders'
  const [viewState, setViewState] = useState<'overview' | 'work-orders'>('overview');
  
  // Filtering States
  const [timeFilter, setTimeFilter] = useState<'this-year' | 'last-1-month' | 'last-3-months' | 'last-year' | 'custom'>('this-year');
  const [customStartDate, setCustomStartDate] = useState('2026-01-01');
  const [customEndDate, setCustomEndDate] = useState('2026-12-31');
  const [useAQClass, setUseAQClass] = useState(false);
  
  // Selected filter on list page (if any)
  // 'status' filter or 'category' filter
  const [activeStatusFilter, setActiveStatusFilter] = useState<'调度中' | '服务中' | '已完成' | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // Dialog States
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [commentVal, setCommentVal] = useState('');
  
  // Toast state for downloads
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to trigger transient toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Mock initial dataset covering realistic dates in 2025 & 2026
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'FW202606001',
      time: '2026-06-15',
      expert: '张卫国',
      status: '已完成',
      category7: '安全生产宣传教育培训',
      category9: '安全生产宣传教育培训',
      projectName: '宏达化工危险化学品生产安全专题培训',
      contactPerson: '林经理',
      contactPhone: '138****8811',
      address: '高新区化工产业园12号',
      reportName: '安全生产培训成果评估报告_FW202606001.pdf',
      details: '开展了为期两天的主要负责人及安全管理人员安全生产专题培训。培训内容涵盖危险源辨识、双重预防机制构建。共54人参训，53人考核合格。',
      rating: 5,
      comment: '专家讲解非常生动，贴合企业实际情况，对我们双预控制度建设很有启发。'
    },
    {
      id: 'FW202606002',
      time: '2026-06-20',
      expert: '李建明',
      status: '服务中',
      category7: '应急预案编制与应急演练',
      category9: '应急预案编制与应急演练',
      projectName: '中石化加油站防渗改造及应急联合演练',
      contactPerson: '王站长',
      contactPhone: '139****1234',
      address: '河东区滨河大道加油站',
      reportName: '危险化学品突发泄漏应急演练报告.pdf',
      details: '现场协调配合加油站防渗漏应急处置演练，专家现场指导消防灭火器及围油栏的布设，进行预案符合性评估。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202606003',
      time: '2026-06-21',
      expert: '周安全',
      status: '调度中',
      category7: '安全风险辨识评估',
      category9: '安全风险辨识评估',
      projectName: '德旺金属制品表面涂装线有限空间评估',
      contactPerson: '赵厂长',
      contactPhone: '135****5678',
      address: '工业园南区300号',
      reportName: '有限空间作业安全专项辨识报告.pdf',
      details: '调度专家拟定于24日进场，开展静电喷涂线有限空间和粉尘涉爆场所安全风险辨识及定量分级分析。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202606105',
      time: '2026-06-18',
      expert: '陈高工',
      status: '已完成',
      category7: '安全生产科技推广',
      category9: '安全生产科技推广',
      projectName: '泰安建材矿山智能监控感知设备部署评估',
      contactPerson: '顾总工',
      contactPhone: '150****6688',
      address: '泰安镇北侧露天采石场',
      reportName: '边坡在线监测系统运行效效及接入方案.pdf',
      details: '对矿山边坡雷达在线监测、车辆疲劳驾驶监控系统的运行现状进行了第三方评估，验证了信号报警联动机制的精准性。',
      rating: 4,
      comment: '技术服务专业，指导了平台报警阈值设置。'
    },
    {
      id: 'FW202606109',
      time: '2026-06-12',
      expert: '沈安全',
      status: '已完成',
      category7: '安全生产标准化建设',
      category9: '安全生产标准化建设',
      projectName: '华特精密机械安全标准化二级达标辅导',
      contactPerson: '钱科长',
      contactPhone: '182****5544',
      address: '西外环路88号智能制造港',
      reportName: '企业安全生产标准化运行辅导记录薄.pdf',
      details: '第二阶段现场指导，核查13个标准化 elements。落实了警示牌补充、防护罩增设等整改复核项目。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202605110',
      time: '2026-05-10',
      expert: '张卫国',
      status: '已完成',
      category7: '重大事故隐患排查',
      category9: '生产安全及重大隐患排查',
      projectName: '锦天新材高压电气与动能管道专项红外探伤',
      contactPerson: '刘厂长',
      contactPhone: '130****9080',
      address: '高新区建业路44号',
      reportName: '重大电气回路安全热成像探伤诊断报告.pdf',
      details: '使用红外成象仪排查了企业配电室配电柜24路回路，发现3处接线端子局部发热异常隐患，已被建议立即空载更换。',
      rating: 5,
      comment: '排查出关键接头隐患，避免了潜在停电和火灾风险，太值了！'
    },
    {
      id: 'FW202605202',
      time: '2026-05-18',
      expert: '吴高工',
      status: '服务中',
      category7: '安全生产宣传教育培训',
      category9: '安全生产宣传教育培训',
      projectName: '港务公司码头装卸起重机械盲区防撞安全培训',
      contactPerson: '徐主管',
      contactPhone: '137****4433',
      address: '新港口物流基地3号靠泊港口',
      reportName: '特种设备驾驶人员安全操作规程课件.pdf',
      details: '由于近期华东地区雨季增多，主要针对吊装盲区视频监控及司机视线模糊问题提供专项带班讲解辅导。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202605208',
      time: '2026-05-24',
      expert: '李建明',
      status: '已完成',
      category7: '应急预案编制与应急演练',
      category9: '应急预案编制与应急演练',
      projectName: '源达制药2026综合防汛防台演练桌面推演',
      contactPerson: '孙总监',
      contactPhone: '158****9988',
      address: '南外环化工工业区5号',
      reportName: '源达制药防台防汛桌面演练评估报告.pdf',
      details: '召集各应急小组成员，以今年超强台风登陆为假想背景，进行了应急指挥调度、积水抽排与危险化学品紧急转移的流程推演与科学评估。',
      rating: 5,
      comment: '桌面推演流程顺畅，演练评语切中要害，对应急预案修订帮助很大。'
    },
    {
      id: 'FW202604015',
      time: '2026-04-12',
      expert: '钱专家',
      status: '已完成',
      category7: '安全风险辨识评估',
      category9: '安全风险辨识评估',
      projectName: '百江燃气灌装站储罐区HAZOP分析诊断',
      contactPerson: '马站长',
      contactPhone: '159****2311',
      address: '开发区南十路与东二环交汇处',
      reportName: '百江灌装站核心工艺HAZOP分析成果表.pdf',
      details: '针对液化石油气储罐、工艺管网、紧急切断阀进行了安全保障HAZOP危险与可操作性深度审查。',
      rating: 5,
      comment: '专业性极高，HAZOP辨识对系统安全联锁设计有很好的指导。'
    },
    {
      id: 'FW202604088',
      time: '2026-04-28',
      expert: '陈高工',
      status: '已完成',
      category7: '其他事故预防服务',
      category9: '其他与事故预防相关的工作',
      projectName: '立邦涂料调配车间防静电接地系统季度巡检',
      contactPerson: '董经经理',
      contactPhone: '136****1726',
      address: '城北建材高新园1号',
      reportName: '车间静电释放及防静电设备接地极阻值量测单.pdf',
      details: '现场量测了防振调色罐、投料孔等50余处接地桩，阻值均在10Ω以下，符合规范。',
      rating: 4,
      comment: '检查认真，对有些老化变脆的接地夹提出了更换建议。'
    },
    {
      id: 'FW202604099',
      time: '2026-04-30',
      expert: '沈安全',
      status: '服务中',
      category7: '安全生产标准化建设',
      category9: '安全生产标准化建设',
      projectName: '苏博特新材安全生产法律法规梳理及一站式诊断',
      contactPerson: '金总',
      contactPhone: '189****9900',
      address: '江宁科技园科创路50号',
      reportName: '适用合规常态风险清单及差距矩阵.pdf',
      details: '协助梳理了2026年最新修订的国家安全生产标准并对照车间现状，找出缺失项目，落实制度补充任务。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202603011',
      time: '2026-03-05',
      expert: '张卫国',
      status: '已完成',
      category7: '重大事故隐患排查',
      category9: '生产安全及重大隐患排查',
      projectName: '苏美达船舶合拢车间特种起重机械承载安全性专项红外探伤与负重检测',
      contactPerson: '程主任',
      contactPhone: '131****8877',
      address: '长江路船舶基地7号泊位',
      reportName: '150吨行吊轨道及主梁焊缝无损检测记录表.pdf',
      details: '对主跨重型桥式吊机主梁进行了超声、红外焊缝无损巡检，共发现两处焊缝存在微小内部气孔，已标记不影响安全运行，建议在下个季度大修时进行熔覆焊重制。',
      rating: 5,
      comment: '大国重器，需要专家精准把脉，师傅很细心！'
    },
    {
      id: 'FW202603099',
      time: '2026-03-25',
      expert: '吴高工',
      status: '服务中',
      category7: '其他事故预防服务',
      category9: '职业病危害防护评估',
      projectName: '佳能电子净化车间有机溶剂浓度及防毒面具过滤检测',
      contactPerson: '郑科长',
      contactPhone: '186****7722',
      address: '电子信息产业区B4栋',
      reportName: '防毒面具密封及耗材寿命季度检测报告.pdf',
      details: '该项目在合规开关下属于「职业病危害防护评估」，主要检查车间苯系物、异丙醇环境浓度和滤毒盒吸附饱和指标。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202602014',
      time: '2026-02-12',
      expert: '李建明',
      status: '已完成',
      category7: '安全风险辨识评估',
      category9: '安全风险辨识评估',
      projectName: '华电电厂燃煤输送皮带栈桥防火防爆安全评估',
      contactPerson: '胡厂长',
      contactPhone: '133****1155',
      address: '新港沿江路电厂二期',
      reportName: '燃料皮带及转运站粉尘爆炸防范和气体联动检测评估.pdf',
      details: '现场针对转运通道粉尘蓄积浓度、喷淋消防装置自拉通系统、瓦斯联动检测进行了技术论证与评测。',
      rating: 4,
      comment: '指导了瓦斯探测器探头高度的规范化摆放，很及时。'
    },
    {
      id: 'FW202602055',
      time: '2026-02-28',
      expert: '周安全',
      status: '服务中',
      category7: '其他事故预防服务',
      category9: '安全生产咨询与评价',
      projectName: '万达广场大型商业综合体配电电网无功补偿及热安全论证',
      contactPerson: '范主管',
      contactPhone: '138****3399',
      address: '中山南路万达广场商业区',
      reportName: '大商场高配电消防预警及红外探伤评测报告.pdf',
      details: '在国标合规分类下属于「安全生产咨询与评价」。主要分析综合体高压电网运行负荷安全性，提供现场咨询。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202601002',
      time: '2026-01-15',
      expert: '陈高工',
      status: '已完成',
      category7: '安全生产宣传教育培训',
      category9: '安全生产宣传教育培训',
      projectName: '新中洲重工起重伤害典型事故复盘沙盘讲解',
      contactPerson: '李经理',
      contactPhone: '137****1122',
      address: '重工城工业园区15号',
      reportName: '安全教育现场宣讲会考核结果与课后反馈明细.pdf',
      details: '分享近年来国内重工企业起重作业、机械伤害的真实惨剧并结合本企业行车布置进行反思性剖析。共85名一线的班组长、安全技术员参与听课，整体评价极佳。',
      rating: 5,
      comment: '用活生生的案例教导员工，极其具有警示教育意义，员工反响热烈！'
    },
    {
      id: 'FW202601050',
      time: '2026-01-22',
      expert: '沈安全',
      status: '服务中',
      category7: '重大事故隐患排查',
      category9: '生产安全及重大隐患排查',
      projectName: '中港油气管道阀门跨接及阴极保护阻值复测',
      contactPerson: '姜站长',
      contactPhone: '136****5577',
      address: '城外临江油气接收总站',
      reportName: '管道分支阀门跨接接地与阻极监测整改清单.pdf',
      details: '对地下20公里主干接气、受气控制阀、接地引下线阻值进行了抽测，其中2处有腐蚀生锈，正在指导施工方更换。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202601088',
      time: '2026-01-28',
      expert: '吴高工',
      status: '调度中',
      category7: '安全生产科技推广',
      category9: '安全生产科技推广',
      projectName: '格力电器高噪声打磨工段协作机器人防冲撞技术调试',
      contactPerson: '于总监',
      contactPhone: '135****4422',
      address: '家电新城B区11栋',
      reportName: '协作机器人红外感应防护升级实操说明书.pdf',
      details: '对格力空调外壳打磨线自动化柔性单元的激光雷达防碰撞停机极限响应时间进行调度对接和后期部署调试。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202511005',
      time: '2025-11-15',
      expert: '钱专家',
      status: '已完成',
      category7: '重大事故隐患排查',
      category9: '生产安全及重大隐患排查',
      projectName: '上一年度：丰达精密锻造冲压车间光电安全保护光栅完好率专项核查',
      contactPerson: '郭主管',
      contactPhone: '139****1100',
      address: '北城锻造集聚区55号',
      reportName: '丰达锻造光栅急停灵敏度专项验证名册.pdf',
      details: '2025年项目，回溯测试。核实了锻压机15台光栅保护遮挡急停反应时间都在0.15秒内，符合技术准入条件。',
      rating: 5,
      comment: '2025优秀辅导服务。隐患排查不打折扣，保障了工人们的手部操作安全！'
    },
    {
      id: 'FW202512089',
      time: '2025-12-18',
      expert: '张卫国',
      status: '已完成',
      category7: '安全生产标准化建设',
      category9: '安全生产标准化建设',
      projectName: '上一年度：金华特造纸危废品库升级达标指导',
      contactPerson: '徐班长',
      contactPhone: '138****0022',
      address: '金华特老厂区西角',
      reportName: '造纸危废库围堰、防流失、耐酸碱改建辅导表.pdf',
      details: '2025年项目，回溯测试。帮助造纸企业按照危废库国标规范，完成挡雨棚、防渗漏防腐地面、导流沟的设计和验收准备。',
      rating: 4,
      comment: '专家对国家新版危废库要求的尺寸及标识细节非常清楚，改动后一次性达标过关。'
    },
    {
      id: 'FW202602088',
      time: '2026-02-20',
      expert: '周安全',
      status: '调度中',
      category7: '其他事故预防服务',
      category9: '职业病危害防护评估',
      projectName: '中兴新材高温烧结炉作业区作业劳动防护配套与热值隔绝调度',
      contactPerson: '韩科长',
      contactPhone: '151****2200',
      address: '苏南晶谷工业区8号厂区',
      reportName: '烧结车间职业危害危害警示标志及风帘优化方案.pdf',
      details: '处于排程调度状态，专家计划对烧结炉周边的强辐射热风流组织进行热场分析，保障工人无职业中暑可能。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202606222',
      time: '2026-06-22',
      expert: '张卫国',
      status: '调度中',
      category7: '应急预案编制与应急演练',
      category9: '应急预案编制与应急演练',
      projectName: '龙湖瑞府地下管网有限空间防窒息快速救援特训',
      contactPerson: '潘主管',
      contactPhone: '137****9922',
      address: '瑞府一期中央广场地下通道',
      reportName: '地下雨污水井密闭空间救援实演手册.pdf',
      details: '当前处于待调度确认状态，指派张工进场教授防毒面罩正压式呼吸器穿戴以及三脚架速提救援演练。',
      rating: null,
      comment: ''
    },
    {
      id: 'FW202606211',
      time: '2026-06-21',
      expert: '周安全',
      status: '调度中',
      category7: '安全风险辨识评估',
      category9: '安全生产咨询与评价',
      projectName: '凯瑞化工新建液氩制备装置及管道防腐蚀评价',
      contactPerson: '罗经理',
      contactPhone: '138****5533',
      address: '凯瑞化工第二厂区内',
      reportName: '新建特种介质承压危险源点评估论证.pdf',
      details: '调度对接，探讨气化设备投料前防结冰及热膨胀冷缩的第三方安全论证，出具符合性咨询报告。',
      rating: null,
      comment: ''
    }
  ]);

  // Seven legal services
  const category7List = [
    '安全生产宣传教育培训',
    '应急预案编制与应急演练',
    '安全风险辨识评估',
    '安全生产科技推广',
    '安全生产标准化建设',
    '重大事故隐患排查',
    '其他事故预防服务'
  ];

  // Nine national standard services
  const category9List = [
    '安全生产宣传教育培训',
    '应急预案编制与应急演练',
    '安全风险辨识评估',
    '安全生产科技推广',
    '安全生产标准化建设',
    '生产安全及重大隐患排查',
    '职业病危害防护评估',
    '安全生产咨询与评价',
    '其他与事故预防相关的工作'
  ];

  const currentCategoryList = useMemo(() => {
    return useAQClass ? category9List : category7List;
  }, [useAQClass]);

  // Filter dataset dynamically based on Left Side Time Filter & Custom Inputs
  const filteredByTimeWorkOrders = useMemo(() => {
    return workOrders.filter(order => {
      const date = order.time; // YYYY-MM-DD
      
      if (timeFilter === 'last-1-month') {
        // e.g. from 2026-05-23 to 2026-06-23
        return date >= '2026-05-23' && date <= '2026-06-23';
      }
      if (timeFilter === 'last-3-months') {
        // e.g. from 2026-03-23 to 2026-06-23
        return date >= '2026-03-23' && date <= '2026-06-23';
      }
      if (timeFilter === 'last-year') {
        // 2025 Jan 1 to Dec 31
        return date >= '2025-01-01' && date <= '2025-12-31';
      }
      if (timeFilter === 'custom') {
        return date >= customStartDate && date <= customEndDate;
      }
      // Default: 'this-year' (2026 Jan 1 to Dec 31)
      return date >= '2026-01-01' && date <= '2026-12-31';
    });
  }, [workOrders, timeFilter, customStartDate, customEndDate]);

  // Master stats derived from filteredByTime
  const masterStats = useMemo(() => {
    let dispatching = 0;
    let inProgress = 0;
    let completed = 0;

    filteredByTimeWorkOrders.forEach(order => {
      if (order.status === '调度中') dispatching++;
      else if (order.status === '服务中') inProgress++;
      else if (order.status === '已完成') completed++;
    });

    return { dispatching, inProgress, completed, total: filteredByTimeWorkOrders.length };
  }, [filteredByTimeWorkOrders]);

  // Cards state data mapping
  // Counts the number of work orders for each category after time filtering
  const categoryStats = useMemo(() => {
    const statsMap: Record<string, { total: number; dispatching: number; inProgress: number; completed: number }> = {};
    
    currentCategoryList.forEach(cat => {
      statsMap[cat] = { total: 0, dispatching: 0, inProgress: 0, completed: 0 };
    });

    filteredByTimeWorkOrders.forEach(order => {
      const cat = useAQClass ? order.category9 : order.category7;
      if (statsMap[cat]) {
        statsMap[cat].total++;
        if (order.status === '调度中') statsMap[cat].dispatching++;
        else if (order.status === '服务中') statsMap[cat].inProgress++;
        else if (order.status === '已完成') statsMap[cat].completed++;
      } else {
        // Fallback to "other" if categories don't match standard exactly
        const fallback = useAQClass ? '其他与事故预防相关的工作' : '其他事故预防服务';
        if (statsMap[fallback]) {
          statsMap[fallback].total++;
          if (order.status === '调度中') statsMap[fallback].dispatching++;
          else if (order.status === '服务中') statsMap[fallback].inProgress++;
          else if (order.status === '已完成') statsMap[fallback].completed++;
        }
      }
    });

    return statsMap;
  }, [filteredByTimeWorkOrders, currentCategoryList, useAQClass]);

  // Filter list page data specifically if activeStatusFilter or activeCategoryFilter is set
  const filteredListOrders = useMemo(() => {
    return filteredByTimeWorkOrders.filter(order => {
      if (activeStatusFilter && order.status !== activeStatusFilter) {
        return false;
      }
      if (activeCategoryFilter) {
        const cat = useAQClass ? order.category9 : order.category7;
        if (cat !== activeCategoryFilter) {
          // Check for fallback as well
          const fallback = useAQClass ? '其他与事故预防相关的工作' : '其他事故预防服务';
          if (activeCategoryFilter === fallback) {
            return cat !== fallback && !currentCategoryList.includes(cat);
          }
          return false;
        }
      }
      return true;
    });
  }, [filteredByTimeWorkOrders, activeStatusFilter, activeCategoryFilter, useAQClass, currentCategoryList]);

  // Click handler on general overview stats
  const handleStatClick = (status: '调度中' | '服务中' | '已完成') => {
    setActiveStatusFilter(status);
    setActiveCategoryFilter(null);
    setViewState('work-orders');
  };

  // Click handler on category cards
  const handleCardClick = (category: string) => {
    setActiveCategoryFilter(category);
    setActiveStatusFilter(null);
    setViewState('work-orders');
  };

  // Show details of a work order
  const handleViewDetail = (order: WorkOrder) => {
    setSelectedOrder(order);
  };

  // Close details modal
  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  // Open evaluation form
  const handleOpenRating = () => {
    if (!selectedOrder) return;
    setRatingVal(selectedOrder.rating || 5);
    setCommentVal(selectedOrder.comment || '');
    setIsRatingOpen(true);
  };

  // Save evaluation form
  const handleSaveRating = () => {
    if (!selectedOrder) return;
    setWorkOrders(prev => prev.map(o => {
      if (o.id === selectedOrder.id) {
        const updated = { ...o, rating: ratingVal, comment: commentVal };
        // Update currently viewed selectedOrder reference in real time
        setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));
    setIsRatingOpen(false);
    triggerToast(`评价保存成功! 已对工单 ${selectedOrder.id} 进行星级确认。`);
  };

  // Mock download report
  const handleDownloadReport = (fileName: string) => {
    triggerToast(`正在启动安全防灾专网下载器...\n成功提取并下载: ${fileName}`);
  };

  return (
    <div id="service-results-root" className="h-full flex flex-col overflow-hidden bg-slate-50 relative">
      
      {/* Dynamic Alert Banner/Toast */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center border border-slate-700 backdrop-blur animate-in fade-in duration-300">
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
          <span className="whitespace-pre-line text-slate-100 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper - desktop single page layout */}
      <div className="flex-1 flex flex-col p-5 overflow-hidden gap-4 min-h-0">
        
        {/* VIEW 1: Overview Dashboard (Three-tier minimalist structure) */}
        {viewState === 'overview' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 animate-in fade-in duration-200">
            
            {/* TIER 1: Header Filtering Zone (Strictly 2 filters, side-by-side) */}
            <div className="bg-white px-5 py-3.5 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 shrink-0">
              
              {/* Left Side: Service Time Selection */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>服务周期:</span>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    id="service-results-time-select"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 focus:outline-none"
                  >
                    <option value="this-year">本年度 (2026年)</option>
                    <option value="last-1-month">近 1 个月 (5.23 - 6.23)</option>
                    <option value="last-3-months">近 3 个月 (3.23 - 6.23)</option>
                    <option value="last-year">上一年度 (2025年)</option>
                    <option value="custom">─ 自定义检索范围 ─</option>
                  </select>

                  {/* Custom Date Inputs shown reactively when 'custom' is active */}
                  {timeFilter === 'custom' && (
                    <div className="flex items-center gap-1.5 animate-in slide-in-from-left-2 duration-200">
                      <input 
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] h-[28px] px-1 rounded focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-gray-400 text-xs">至</span>
                      <input 
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] h-[28px] px-1 rounded focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Compliance Toggle (Standard switch toggle) */}
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input 
                    id="compliance-toggle-checkbox"
                    type="checkbox" 
                    checked={useAQClass} 
                    onChange={(e) => setUseAQClass(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-2.5 text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <ShieldCheck className={`w-3.5 h-3.5 ${useAQClass ? 'text-blue-600' : 'text-gray-400'}`} />
                    按 AQ9010 标准国标分类查看
                  </span>
                </label>
              </div>

            </div>

            {/* TIER 2: Global Service Progress Totals (Clickable digits) */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs shrink-0">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>全局事故预防服务总览进度 (当前周期共 {masterStats.total} 项服务)</span>
                <span className="text-gray-300 text-[10px]">点击即可直接穿透状态工单</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                
                {/* Dispatching (调度中) */}
                <div 
                  id="stat-dispatching"
                  onClick={() => handleStatClick('调度中')}
                  className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="text-[11px] font-bold text-indigo-600 flex items-center justify-center gap-1 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-pulse" />
                    <span>调度中</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-900 tracking-tight py-0.5">
                    {masterStats.dispatching}
                  </div>
                  <span className="text-[10px] text-indigo-500/80">待落实计划或排期</span>
                </div>

                {/* In Progress (服务中) */}
                <div 
                  id="stat-processing"
                  onClick={() => handleStatClick('服务中')}
                  className="bg-amber-50/50 hover:bg-amber-50 border border-amber-100/50 rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="text-[11px] font-bold text-amber-600 flex items-center justify-center gap-1 mb-0.5">
                    <Play className="w-3 h-3 text-amber-500 shrink-0 rotate-12" />
                    <span>服务中</span>
                  </div>
                  <div className="text-2xl font-black text-amber-900 tracking-tight py-0.5">
                    {masterStats.inProgress}
                  </div>
                  <span className="text-[10px] text-amber-500/80">专家现场及过程编写</span>
                </div>

                {/* Completed (已完成) */}
                <div 
                  id="stat-completed"
                  onClick={() => handleStatClick('已完成')}
                  className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1 mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>已完成</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-950 tracking-tight py-0.5">
                    {masterStats.completed}
                  </div>
                  <span className="text-[10px] text-emerald-500/80">已递交报告并可评价</span>
                </div>

              </div>
            </div>

            {/* TIER 3: Category Service Cards Grid (Adaptive layout based on state) */}
            <div className="flex-1 min-h-0 bg-white p-4.5 rounded-xl border border-gray-200/80 shadow-xs flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <ClipboardCheck className="w-4 h-4 text-blue-500" />
                  {useAQClass ? 'AQ9010 事故预防国标服务大类 (9类分类)' : '基础安责险法定预防服务 (7类大项)'}
                </span>
                <span className="text-[10px] text-gray-400">一屏直观卡片：点击进入专项工单列表</span>
              </div>

              {/* Cards layout: adaptively scales grid columns depending on 7 or 9 categories */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                <div className={`grid gap-3.5 ${useAQClass ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                  {currentCategoryList.map((category, idx) => {
                    const stat = categoryStats[category] || { total: 0, dispatching: 0, inProgress: 0, completed: 0 };
                    
                    return (
                      <div 
                        key={idx}
                        id={`category-card-${idx}`}
                        onClick={() => handleCardClick(category)}
                        className="bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-blue-50/10 cursor-pointer p-3.5 rounded-xl transition-all duration-150 flex flex-col justify-between h-[115px] select-none"
                      >
                        <div className="text-xs font-bold text-gray-700 leading-tight block truncate-2-lines line-clamp-2" title={category}>
                          {category}
                        </div>
                        
                        <div className="flex items-baseline gap-1 mt-1 pb-1">
                          <span className="text-2xl font-black text-slate-800 leading-none">{stat.total}</span>
                          <span className="text-[10px] text-gray-400">次服务</span>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200/60 pt-2 text-[10.5px] text-gray-500">
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1"></span>
                            调{stat.dispatching}
                          </span>
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1"></span>
                            服{stat.inProgress}
                          </span>
                          <span className="flex items-center text-slate-700 font-semibold">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></span>
                            完{stat.completed}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: Work Order List (最简设计) */}
        {viewState === 'work-orders' && (
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden min-h-0 animate-in fade-in duration-200">
            
            {/* Header / Sub-filter feedback bar with Back button */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  id="work-order-back-btn"
                  onClick={() => setViewState('overview')}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium shadow-2xs hover:shadow-xs transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>返回服务成果总览</span>
                </button>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <div className="text-xs text-gray-700 flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">
                    {activeCategoryFilter ? `按类型筛选: ${activeCategoryFilter}` : '按全部项展示'}
                  </span>
                  {activeStatusFilter && (
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {activeStatusFilter}
                    </span>
                  )}
                  <span className="text-gray-400">({filteredListOrders.length} 个结果)</span>
                </div>
              </div>

              {/* Minimalist interactive clear / reset filter */}
              <div className="flex items-center gap-2">
                {(activeCategoryFilter || activeStatusFilter) && (
                  <button 
                    onClick={() => {
                      setActiveCategoryFilter(null);
                      setActiveStatusFilter(null);
                    }}
                    className="text-[10.5px] text-gray-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    清除子项过滤
                  </button>
                )}
              </div>
            </div>

            {/* List Table Container */}
            <div className="flex-1 overflow-auto min-h-0">
              {filteredListOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-gray-400">
                  <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-xs font-semibold">在此过滤条件下没有找到工单记录</p>
                  <p className="text-[10px] text-gray-400 mt-1">请尝试切换顶部的时期筛选器，或点击清除子域限制</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[650px] text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600 font-bold">
                      <th className="py-3 px-5 w-[140px]">工单编号</th>
                      <th className="py-3 px-4">服务企业及项目</th>
                      <th className="py-3 px-4 w-[100px]">服务时间</th>
                      <th className="py-3 px-4 w-[90px]">服务专家</th>
                      <th className="py-3 px-4 w-[90px] text-center">状态</th>
                      <th className="py-3 px-5 w-[90px] text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="py-3 px-5 font-mono font-medium text-slate-800">{order.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-800 leading-tight truncate max-w-[320px]" title={order.projectName}>
                            {order.projectName}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[320px]">
                            {useAQClass ? order.category9 : order.category7}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono">{order.time}</td>
                        <td className="py-3 px-4 text-gray-700 font-medium">{order.expert}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === '已完成' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/55' :
                            order.status === '服务中' ? 'bg-amber-50 text-amber-600 border border-amber-200/55' :
                            'bg-indigo-50 text-indigo-600 border border-indigo-200/55'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <button 
                            id={`view-detail-${order.id}`}
                            onClick={() => handleViewDetail(order)}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 mx-auto hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>查看详情</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination/Status Indicators at footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center text-[10.5px] text-gray-400 shrink-0">
              <div>显示 {filteredListOrders.length} / {workOrders.length} 个事故预防服务项</div>
              <div className="flex items-center gap-1">
                <span>安责险智能风评风控专网保障 · 仅保留单条查看下载</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* POPUP 1: Work Order Details Drawer/Dialog (查看详情) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150 mx-4">
            
            {/* Dialog Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                  工单号: {selectedOrder.id}
                </span>
                <h3 className="text-base font-black text-gray-950 mt-1">事故预防服务详情</h3>
              </div>
              <button 
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                id="close-detail-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[400px] pr-1.5 text-xs text-gray-600">
              
              {/* Project / Title info */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">项目名称</div>
                <div className="text-gray-900 font-bold text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {selectedOrder.projectName}
                </div>
              </div>

              {/* Status and core metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400">服务时间</span>
                  <div className="text-gray-800 font-semibold font-mono mt-0.5 bg-gray-50/50 p-1.5 rounded">{selectedOrder.time}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400">服务状态/专家</span>
                  <div className="text-gray-800 font-semibold mt-0.5 bg-gray-50/50 p-1.5 rounded flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${selectedOrder.status === '已完成' ? 'bg-emerald-500' : selectedOrder.status === '服务中' ? 'bg-amber-500' : 'bg-indigo-500'}`}></span>
                    <span>{selectedOrder.status} ({selectedOrder.expert})</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Location Details */}
              <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase">企业联络详情</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 font-medium">
                  <div>联络人: <span className="font-semibold text-gray-900">{selectedOrder.contactPerson}</span></div>
                  <div>手机: <span className="font-semibold text-gray-900 font-mono">{selectedOrder.contactPhone}</span></div>
                </div>
                <div className="text-[11px] text-gray-600 mt-1 truncate" title={selectedOrder.address}>
                  地址: {selectedOrder.address}
                </div>
              </div>

              {/* Progress Detail description */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase">工作成果详情/描述</div>
                <p className="text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 leading-relaxed text-[11.5px]">
                  {selectedOrder.details}
                </p>
              </div>

              {/* Report Downloader Zone */}
              <div className="bg-blue-50/40 border border-blue-100/60 p-3 rounded-lg flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-blue-500 font-bold block">服务报告档案</div>
                  <div className="text-gray-700 font-bold text-xs truncate mt-0.5" title={selectedOrder.reportName}>
                    {selectedOrder.reportName}
                  </div>
                </div>
                <button 
                  id="report-download-btn"
                  onClick={() => handleDownloadReport(selectedOrder.reportName)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all focus:ring-2 focus:ring-blue-300 shadow-xs text-[10.5px] uppercase shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载报告</span>
                </button>
              </div>

              {/* Rating representation if completed */}
              {selectedOrder.status === '已完成' && (
                <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">客户质量满意度反馈</div>
                    {selectedOrder.rating ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= (selectedOrder.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-gray-200">({selectedOrder.rating}分)</span>
                      </div>
                    ) : (
                      <span className="text-[10.5px] text-slate-300 font-semibold block mt-0.5">尚未作出评价反馈</span>
                    )}
                    {selectedOrder.comment && (
                      <p className="text-[10.5px] text-slate-400 mt-1.5 italic font-medium leading-normal">
                        " {selectedOrder.comment} "
                      </p>
                    )}
                  </div>
                  
                  <button 
                    id="trigger-evaluation-btn"
                    onClick={handleOpenRating}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-2 rounded-lg transition-all text-xs shrink-0 flex items-baseline gap-0.5"
                  >
                    <span>{selectedOrder.rating ? '修改评价' : '添加评价'}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Dialog Footer */}
            <div className="border-t border-gray-100 pt-3 flex justify-end">
              <button 
                onClick={handleCloseDetail}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP 2: 5-Star Rating & Comment Modal (评价) */}
      {isRatingOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-sm p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150 mx-4">
            
            {/* Rating Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">满意度服务评价</h3>
              <button 
                onClick={() => setIsRatingOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stars selection */}
            <div className="text-center py-2">
              <span className="text-xs text-gray-400 block mb-2">点击星星为专家服务打分</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    id={`rating-star-btn-${star}`}
                    onClick={() => setRatingVal(star)}
                    className="transition-transform active:scale-125 focus:outline-none"
                    type="button"
                  >
                    <Star 
                      className={`w-7 h-7 ${star <= ratingVal ? 'fill-amber-400 text-amber-400 shadow-sm' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-500 block mt-1.5">
                {ratingVal === 5 ? '极佳，超出预期！' :
                 ratingVal === 4 ? '优秀，值得推荐。' :
                 ratingVal === 3 ? '一般，仍需改善。' :
                 ratingVal === 2 ? '较差，体验不佳。' : '极差，很不满意。'}
              </span>
            </div>

            {/* Comment Message box */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-gray-400 block">意见或服务改进评语 (选填)</label>
              <textarea
                id="rating-comment-textarea"
                rows={3}
                value={commentVal}
                onChange={(e) => setCommentVal(e.target.value)}
                placeholder="请详细描述对安全防灾专家的总体印象，或是改进建议..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-gray-800 placeholder:text-gray-300 resize-none"
              />
            </div>

            {/* Rating Footer actions */}
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsRatingOpen(false)}
                className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                id="submit-rating-btn"
                onClick={handleSaveRating}
                className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg font-bold transition-all shadow-xs"
              >
                保存评分
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
