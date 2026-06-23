import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  FileText, 
  Calendar, 
  Building, 
  UserCheck, 
  X, 
  RotateCw, 
  ArrowUpDown, 
  Download, 
  Bell, 
  ArrowRight,
  ChevronRight,
  Percent,
  Check,
  Building2,
  FileSpreadsheet,
  AlertOctagon,
  Activity,
  Award,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// Define the TS Interfaces per strict specifications
interface PremiumPolicy {
  id: string;             // 保单编号
  enterprise: string;     // 企业名称
  carrier: string;        // 承保保险公司
  industry: string;       // 所属行业
  status: 'valid' | 'expired'; // 保单状态 (有效/已到期)
  startDate: string;      // 保单起始时间
  endDate: string;        // 保单到期时间
  premium: number;        // 保费总额 (万元)
  serviceFeeRate: number; // 默认应计提服务费占比 (系统计提默认15%或可调)
  serviceFeeActual: number; // 实际支出服务费金额 (万元)
  apportionDetails: {     // 费用分摊明细
    inspectorFee: number; // 隐患排查占比 (万元)
    trainingFee: number;  // 培训教育占比 (万元)
    drillFee: number;     // 演练服务占比 (万元)
    otherFee: number;     // 其他防灾宣传 (万元)
  };
  associatedWorks: {      // 关联的已核销服务工单
    workId: string;
    workName: string;
    completedDate: string;
    cost: number;
    agency: string;
  }[];
  accrualHistory: {       // 计提记录
    date: string;
    amount: number;
    description: string;
  }[];
  spendHistory: {         // 逐笔支出流水
    date: string;
    amount: number;
    category: string;
    receiver: string;
  }[];
}

export function ServiceFeeManagement() {
  // 3.3 Built-in extraction standard regulation (Default 15%, flexible)
  const [minExtractionRate, setMinExtractionRate] = useState<number>(15);
  
  // States for query conditions (Section 3.1)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'' | 'valid' | 'expired'>('');
  const [selectedCompliance, setSelectedCompliance] = useState<'all' | 'compliant' | 'non_compliant'>('all');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');

  // Initial rich mockup policies database following specifications strictly
  const [policies, setPolicies] = useState<PremiumPolicy[]>([
    {
      id: 'AZX-2026-001',
      enterprise: '海天特种化工集团股份有限公司',
      carrier: '中国人保财险 (PICC)',
      industry: '危化行业',
      status: 'valid',
      startDate: '2026-01-10',
      endDate: '2027-01-09',
      premium: 120.0,
      serviceFeeRate: 15.0, // Used to compute required accrual amount
      serviceFeeActual: 21.6, // Ratio = 18%, Compliant (>=15%)
      apportionDetails: { inspectorFee: 10.0, trainingFee: 6.0, drillFee: 4.0, otherFee: 1.6 },
      associatedWorks: [
        { workId: 'WK-2026-081', workName: '一季度危化罐区深度安检排查', completedDate: '2026-03-15', cost: 10.0, agency: '华北安全生产技术中心' },
        { workId: 'WK-2026-104', workName: '特种设备作业安全技能大讲常案', completedDate: '2026-04-20', cost: 6.0, agency: '安联职业教育学院' },
        { workId: 'WK-2026-212', workName: '储罐气体泄漏消防疏散实战演练', completedDate: '2026-05-18', cost: 5.6, agency: '蓝天应急防汛突击队' }
      ],
      accrualHistory: [
        { date: '2026-01-11', amount: 18.0, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-03-16', amount: 10.0, category: '重大事故隐患排查', receiver: '华北安全生产技术中心' },
        { date: '2026-04-21', amount: 6.0, category: '安全宣传与教育培训', receiver: '安联职业教育学院' },
        { date: '2026-05-19', amount: 5.6, category: '应急救援拉网演操', receiver: '蓝天应急防汛突击队' }
      ]
    },
    {
      id: 'AZX-2026-002',
      enterprise: '建工四局高新技术开发区基建项目部',
      carrier: '中国平安财险',
      industry: '建筑工程',
      status: 'valid',
      startDate: '2026-02-15',
      endDate: '2027-02-14',
      premium: 85.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 3.5, // Ratio = 4.11%, Non-compliant (<15%) -> Underfunded
      apportionDetails: { inspectorFee: 2.0, trainingFee: 1.0, drillFee: 0.5, otherFee: 0.0 },
      associatedWorks: [
        { workId: 'WK-2026-092', workName: '基坑开挖沉降风险上门评定', completedDate: '2026-03-11', cost: 2.0, agency: '扬州地质防灾勘测研究中心' }
      ],
      accrualHistory: [
        { date: '2026-02-16', amount: 12.75, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-03-12', amount: 2.0, category: '重大事故隐患排查', receiver: '扬州地质防灾勘测研究中心' },
        { date: '2026-04-05', amount: 1.5, category: '安全生产及劳动保护警示宣教', receiver: '平安财险客户服务组' }
      ]
    },
    {
      id: 'AZX-2026-003',
      enterprise: '常青粉尘涉爆重工设备制造厂',
      carrier: '中国太平洋财险',
      industry: '非煤矿山',
      status: 'valid',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      premium: 60.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 10.2, // Ratio = 17%, Compliant (>=15%)
      apportionDetails: { inspectorFee: 5.0, trainingFee: 3.0, drillFee: 2.0, otherFee: 0.2 },
      associatedWorks: [
        { workId: 'WK-2026-115', workName: '涉爆除尘系统防爆泄压门隐患排查', completedDate: '2026-04-10', cost: 5.0, agency: '扬州正信科技安全评价所' },
        { workId: 'WK-2026-189', workName: '全员防爆防潮工艺规准讲座', completedDate: '2026-05-15', cost: 3.0, agency: '太平洋财险防灾处' }
      ],
      accrualHistory: [
        { date: '2026-03-02', amount: 9.0, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-04-11', amount: 5.0, category: '重大事故隐患排查', receiver: '扬州正信科技安全评价所' },
        { date: '2026-05-16', amount: 5.2, category: '安全规章宣传教育', receiver: '太平洋财险防灾处' }
      ]
    },
    {
      id: 'AZX-2025-099',
      enterprise: '顺辉危化危险品运输储配站',
      carrier: '国寿财险',
      industry: '交通运输/其他',
      status: 'expired', // Expired
      startDate: '2025-05-20',
      endDate: '2026-05-19',
      premium: 50.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 4.8, // Ratio = 9.6%, Non-compliant (<15%)
      apportionDetails: { inspectorFee: 3.0, trainingFee: 1.0, drillFee: 0.0, otherFee: 0.8 },
      associatedWorks: [
        { workId: 'WK-2025-502', workName: '危化运输罐车防静电接地防溢装测检查', completedDate: '2025-08-14', cost: 3.0, agency: '江苏危险品特种检测院' }
      ],
      accrualHistory: [
        { date: '2025-05-21', amount: 7.5, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2025-08-15', amount: 3.0, category: '重大事故隐患排查', receiver: '江苏危险品特种检测院' },
        { date: '2025-10-12', amount: 1.8, category: '其他防灾技术辅导', receiver: '国寿财务报销组' }
      ]
    },
    {
      id: 'AZX-2026-004',
      enterprise: '大洋船舶机械重装有限公司',
      carrier: '中国人保财险 (PICC)',
      industry: '一般工贸',
      status: 'valid',
      startDate: '2026-04-12',
      endDate: '2027-04-11',
      premium: 95.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 18.5, // Ratio = 19.47%, Compliant (>=15%)
      apportionDetails: { inspectorFee: 8.0, trainingFee: 5.0, drillFee: 4.0, otherFee: 1.5 },
      associatedWorks: [
        { workId: 'WK-2026-302', workName: '大型桥式起重机门限防坠大排查', completedDate: '2026-05-02', cost: 8.0, agency: '人保工程专家团队' },
        { workId: 'WK-2026-312', workName: '有限空间重力承揽急救模拟实战拉练', completedDate: '2026-06-10', cost: 9.0, agency: '扬州蓝天安防演习服务处' }
      ],
      accrualHistory: [
        { date: '2026-04-13', amount: 14.25, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-05-03', amount: 8.0, category: '重大事故隐患排查', receiver: '人保工程专家团队' },
        { date: '2026-06-11', amount: 10.5, category: '现场多重应急突击演练', receiver: '扬州蓝天安防演习服务处' }
      ]
    },
    {
      id: 'AZX-2026-005',
      enterprise: '万丰粉体涂料打磨作业分局',
      carrier: '中华联合财险',
      industry: '危化行业',
      status: 'valid',
      startDate: '2026-01-25',
      endDate: '2027-01-24',
      premium: 40.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 2.2, // Ratio = 5.5%, Non-compliant (<15%)
      apportionDetails: { inspectorFee: 1.5, trainingFee: 0.7, drillFee: 0.0, otherFee: 0.0 },
      associatedWorks: [
        { workId: 'WK-2026-019', workName: '高浓度抛光涉爆车间粉尘复消检测', completedDate: '2026-02-18', cost: 1.5, agency: '中南安全科技评价中心' }
      ],
      accrualHistory: [
        { date: '2026-01-26', amount: 6.0, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-02-19', amount: 1.5, category: '重大事故隐患排查', receiver: '中南安全科技评价中心' },
        { date: '2026-03-30', amount: 0.7, category: '安全培训教育', receiver: '中华联合防灾组' }
      ]
    },
    {
      id: 'AZX-2026-006',
      enterprise: '苏中建工华南路高架施工二部',
      carrier: '大地保险公司',
      industry: '建筑工程',
      status: 'valid',
      startDate: '2026-03-10',
      endDate: '2027-03-09',
      premium: 100.0,
      serviceFeeRate: 15.0,
      serviceFeeActual: 16.5, // Ratio = 16.5%, Compliant (>=15%)
      apportionDetails: { inspectorFee: 7.5, trainingFee: 4.5, drillFee: 3.0, otherFee: 1.5 },
      associatedWorks: [
        { workId: 'WK-2026-250', workName: '特重大型塔吊超力矩防倾覆检测', completedDate: '2026-04-20', cost: 7.5, agency: '建安机械风险评估所' },
        { workId: 'WK-2026-258', workName: '施工全栈工人高空急救与包扎演练', completedDate: '2026-05-25', cost: 5.0, agency: '红十字应急教导基地' }
      ],
      accrualHistory: [
        { date: '2026-03-11', amount: 15.0, description: '根据15%的最低起提标准系统自动核定预配置计提' }
      ],
      spendHistory: [
        { date: '2026-04-21', amount: 7.5, category: '重大事故隐患排查', receiver: '建安机械风险评估所' },
        { date: '2026-05-26', amount: 9.0, category: '现场多重应急突击演练', receiver: '红十字应急教导基地' }
      ]
    }
  ]);

  // Selected policy details modal state (Section 3.3 Clicking View Details)
  const [selectedDetailedPolicyId, setSelectedDetailedPolicyId] = useState<string | null>(null);

  // Spending addition mock form states
  const [showAddSpendingModal, setShowAddSpendingModal] = useState(false);
  const [targetPolicyId, setTargetPolicyId] = useState('');
  const [spendingAmount, setSpendingAmount] = useState('');
  const [spendingCategory, setSpendingCategory] = useState('重大事故隐患排查');
  const [spendingOperator, setSpendingOperator] = useState('');
  const [spendingDate, setSpendingDate] = useState('2026-06-20');
  const [spendingNotes, setSpendingNotes] = useState('');

  // Sorting metrics
  const [sortField, setSortField] = useState<'id' | 'premium' | 'serviceFeeActual' | 'ratio'>('ratio');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-select combinations computed mapping for unique values to show in standard select dropdown filters
  const carrierOptions = useMemo(() => Array.from(new Set(policies.map(p => p.carrier))), [policies]);
  const industryOptions = useMemo(() => Array.from(new Set(policies.map(p => p.industry))), [policies]);

  // Calculate policy status, ratio, requirements, and compliance dynamically per rule
  const computedPolicies = useMemo(() => {
    return policies.map(policy => {
      // 3.2 应计提服务费金额 (Required target premium * extraction minimum standard baseline)
      const requiredServiceFee = parseFloat(((policy.premium * minExtractionRate) / 100).toFixed(2));
      const ratio = policy.premium > 0 ? (policy.serviceFeeActual / policy.premium) * 100 : 0;
      const isCompliant = ratio >= minExtractionRate;

      return {
        ...policy,
        requiredServiceFee,
        ratio: parseFloat(ratio.toFixed(2)),
        isCompliant
      };
    });
  }, [policies, minExtractionRate]);

  // Sorting comparator handler
  const handleSortToggle = (field: 'id' | 'premium' | 'serviceFeeActual' | 'ratio') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Section 3.1: Filtering policies lists in real-time
  const filteredPolicies = useMemo(() => {
    let result = [...computedPolicies];

    // Search bar (Enterprise Name or Policy Number)
    if (searchTerm.trim() !== '') {
      const criteria = searchTerm.toLowerCase();
      result = result.filter(
        p => p.enterprise.toLowerCase().includes(criteria) || 
             p.id.toLowerCase().includes(criteria)
      );
    }

    // Carrier filtering
    if (selectedCarrier !== '') {
      result = result.filter(p => p.carrier === selectedCarrier);
    }

    // Industry filtering
    if (selectedIndustry !== '') {
      result = result.filter(p => p.industry === selectedIndustry);
    }

    // Policy status filtering
    if (selectedStatus !== '') {
      result = result.filter(p => p.status === selectedStatus);
    }

    // Compliance state filtering
    if (selectedCompliance === 'compliant') {
      result = result.filter(p => p.isCompliant);
    } else if (selectedCompliance === 'non_compliant') {
      result = result.filter(p => !p.isCompliant);
    }

    // Premium range filtering dates
    if (startDateStr !== '') {
      result = result.filter(p => p.startDate >= startDateStr);
    }
    if (endDateStr !== '') {
      result = result.filter(p => p.endDate <= endDateStr);
    }

    // Sorting implementation
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
    });

    return result;
  }, [computedPolicies, searchTerm, selectedCarrier, selectedIndustry, selectedStatus, selectedCompliance, startDateStr, endDateStr, sortField, sortOrder]);

  // 3.2: 5 core premium calculation metrics computed values
  const aggregateMetrics = useMemo(() => {
    const totalPremium = filteredPolicies.reduce((sum, p) => sum + p.premium, 0);
    // Calculated based on the computed policy extraction target minimum standard values (e.g. 15% rate)
    const totalRequiredFee = filteredPolicies.reduce((sum, p) => sum + p.requiredServiceFee, 0);
    const totalActualSpent = filteredPolicies.reduce((sum, p) => sum + p.serviceFeeActual, 0);
    const averageRatio = totalPremium > 0 ? (totalActualSpent / totalPremium) * 100 : 0;
    
    const totalCount = filteredPolicies.length;
    const compliantCount = filteredPolicies.filter(p => p.isCompliant).length;
    const nonCompliantCount = totalCount - compliantCount;
    const complianceRate = totalCount > 0 ? (compliantCount / totalCount) * 100 : 0;

    return {
      totalPremium: parseFloat(totalPremium.toFixed(2)),
      totalRequiredFee: parseFloat(totalRequiredFee.toFixed(2)),
      totalActualSpent: parseFloat(totalActualSpent.toFixed(2)),
      averageRatio: parseFloat(averageRatio.toFixed(2)),
      compliantCount,
      nonCompliantCount,
      complianceRate: parseFloat(complianceRate.toFixed(1))
    };
  }, [filteredPolicies]);

  // View details data target accessor
  const selectedPolicyDetails = useMemo(() => {
    if (!selectedDetailedPolicyId) return null;
    return computedPolicies.find(p => p.id === selectedDetailedPolicyId) || null;
  }, [selectedDetailedPolicyId, computedPolicies]);

  // 3.4 Report Export Mock Handler (Sec 3.4)
  const handleReportExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["保单编号,企业名称,承保保险公司,所属行业,有效期,保费总额(万元),应计提额(万元),实际支出费额(万元),支出占比,是否达标"].join(",") + "\n"
      + filteredPolicies.map(p => 
          `"${p.id}","${p.enterprise}","${p.carrier}","${p.industry}","${p.startDate}~${p.endDate}",${p.premium},${p.requiredServiceFee},${p.serviceFeeActual},"${p.ratio}%","${p.isCompliant ? '达标' : '不达标'}"`
        ).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `全市安责险事故预防服务费使用报表台账_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('【数据报表导出成功】已为您转换生成标准的保单事故预防服务经费台账凭证（CSV格式），即刻下载。');
  };

  // 3.4 Remind Notify Handler (Sec 3.4)
  const [remindingPolicyId, setRemindingPolicyId] = useState<string | null>(null);
  const [remindSuccessMsg, setRemindSuccessMsg] = useState('');

  const sendWarningCorrectionReminder = (policy: any) => {
    setRemindingPolicyId(policy.id);
    // Simulate API delay
    setTimeout(() => {
      setRemindingPolicyId(null);
      alert(`【一键预警催缴送达成功】\n已向「${policy.carrier}」网关下发事故预防费追加督办指令：\n对于受保单位「${policy.enterprise}」，要求于3个工作日内补齐至足额事故预防常设项目（${minExtractionRate}%提取标准扣缴），避免安全评级挂牌处罚。`);
    }, 850);
  };

  // Recharts visualization data helper (aggregated allocated sums of categories)
  const chartApportionmentDistribution = useMemo(() => {
    const result = {
      inspector: 0,
      training: 0,
      drill: 0,
      other: 0
    };
    filteredPolicies.forEach(p => {
      result.inspector += p.apportionDetails.inspectorFee;
      result.training += p.apportionDetails.trainingFee;
      result.drill += p.apportionDetails.drillFee;
      result.other += p.apportionDetails.otherFee;
    });

    return [
      { name: '重大事故隐患排查', value: parseFloat(result.inspector.toFixed(2)) },
      { name: '安全规章与宣传培训', value: parseFloat(result.training.toFixed(2)) },
      { name: '现场多重应急拉网演练', value: parseFloat(result.drill.toFixed(2)) },
      { name: '其他防灾物资及技术推广', value: parseFloat(result.other.toFixed(2)) }
    ].filter(item => item.value > 0);
  }, [filteredPolicies]);

  // Color mapping constant for categories
  const APP_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div id="service-fee-reg-root" className="flex-1 flex flex-col h-full bg-[#f1f5f9] overflow-hidden font-sans">
      
      {/* Dynamic Title / Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0 shadow-3xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200 rounded">
              监管督办
            </span>
            <h1 className="text-base font-bold text-gray-900">事故预防服务费管理</h1>
            <span className="text-[10px] text-gray-400 bg-slate-100 border border-slate-205 px-2 py-0.5 rounded-full font-bold">
              安责险专项征提平台
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            动态分析保司安全提取动作。根据指导标准评估实际支出比例、计提费用划拨明细与关联已核销服务工单状态。
          </p>
        </div>

        {/* Dynamic configuration target rate setup widget */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-gray-650 font-medium">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>最低计提划拨标准底线:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setMinExtractionRate(prev => Math.max(10, prev - 1))}
              className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-gray-700 transition"
              title="降1%"
            >
              -
            </button>
            <span className="font-mono text-xs font-black text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded min-w-[42px] text-center">
              {minExtractionRate}%
            </span>
            <button 
              onClick={() => setMinExtractionRate(prev => Math.min(30, prev + 1))}
              className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-gray-700 transition"
              title="增1%"
            >
              +
            </button>
            <span className="text-[10px] text-gray-400 leading-none">系统默认为 15%</span>
          </div>
        </div>
      </div>

      {/* Main Viewport Content Scroller */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* 3.1: 多维度筛选查询面板 (TOP ROW) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-3xs p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>多条件组合高级智能筛选</span>
            </span>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCarrier('');
                setSelectedIndustry('');
                setSelectedStatus('');
                setSelectedCompliance('all');
                setStartDateStr('');
                setEndDateStr('');
              }}
              className="text-[11px] text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 hover:underline transition border-none bg-transparent cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>重置条件</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
            
            {/* Search Input Filter */}
            <div className="col-span-2 relative">
              <label className="text-[10px] text-gray-400 font-bold block mb-1">企业名称 / 保单编号模糊搜索</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="如: 常青粉尘 / AZX-..."
                  className="w-full bg-white border border-gray-300 rounded-lg pl-8.5 pr-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium"
                />
              </div>
            </div>

            {/* Carrier Dropout filter */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">承保保险公司</label>
              <select
                value={selectedCarrier}
                onChange={(e) => setSelectedCarrier(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
              >
                <option value="">全部合作保司</option>
                {carrierOptions.map(car => (
                  <option key={car} value={car}>{car}</option>
                ))}
              </select>
            </div>

            {/* Industry dropout filter */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">所属高危行业</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
              >
                <option value="">全部高危行业</option>
                {industryOptions.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Status dropdown filter */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">保单有效有效期状态</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
              >
                <option value="">全部保单状态</option>
                <option value="valid">有效 (保期内在保)</option>
                <option value="expired">已到期 (历史保单)</option>
              </select>
            </div>

            {/* Compliance criteria filter dropdown */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">服务费占比达标认定</label>
              <select
                value={selectedCompliance}
                onChange={(e) => setSelectedCompliance(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
              >
                <option value="all">全部提取状态</option>
                <option value="compliant">达标 (已完成 ≥ {minExtractionRate}%)</option>
                <option value="non_compliant">不达标 (低于最低占比规准)</option>
              </select>
            </div>

          </div>

          {/* Date range filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dashed border-gray-100 text-xs text-gray-500">
            <span className="font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>保费到期时间跨度区间:</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="bg-white border border-gray-300 rounded px-2.5 py-1 text-[11px] outline-none"
              />
              <span className="text-gray-400">至</span>
              <input
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="bg-white border border-gray-300 rounded px-2.5 py-1 text-[11px] outline-none"
              />
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1 ml-auto">
              <span>● 为您在保单有效期范围内完成联动关联匹配过滤</span>
            </div>
          </div>
        </div>

        {/* 3.2: 核心指标汇总区块 (MID ROW) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Stats Box 1: 总保费规模 */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-2xs transition">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">总保费累计规模</span>
              <span className="p-1 bg-blue-50 rounded text-blue-600 text-xs">
                <Building className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black font-mono text-slate-850 tracking-tight">
                  {aggregateMetrics.totalPremium.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500">万元</span>
              </div>
              <p className="text-[9.5px] text-gray-400 mt-1 leading-normal">范围：当前筛选出的有效/历史实缴投保规模</p>
            </div>
          </div>

          {/* Stats Box 2: 应计提服务费总额 */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-2xs transition">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">应计提服务费总额</span>
              <span className="p-1 bg-indigo-50 rounded text-indigo-600 text-xs">
                <Percent className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black font-mono text-slate-850 tracking-tight">
                  {aggregateMetrics.totalRequiredFee.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500">万元</span>
              </div>
              <p className="text-[9.5px] text-indigo-600 font-bold mt-1 leading-normal">
                按最低提取 {minExtractionRate}% 基准折算
              </p>
            </div>
          </div>

          {/* Stats Box 3: 累计实际支出金额 */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-2xs transition">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">累计实际服务支出</span>
              <span className="p-1 bg-teal-50 rounded text-teal-600 text-xs font-bold font-mono">
                ¥
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black font-mono text-emerald-650 tracking-tight">
                  {aggregateMetrics.totalActualSpent.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">万元</span>
              </div>
              <p className="text-[9.5px] text-teal-600 font-medium mt-1 leading-normal">已流转核销的线上服务支出</p>
            </div>
          </div>

          {/* Stats Box 4: 平均服务费占比 */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:shadow-2xs transition">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">平均服务费累计占比</span>
              <span className="p-1 bg-amber-50 rounded text-amber-600 text-xs">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black font-mono text-slate-850 tracking-tight">
                  {aggregateMetrics.averageRatio.toFixed(1)}%
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">实际支出占总实缴保费之全局比例</p>
            </div>
          </div>

          {/* Stats Box 5: 达标保单占比 (RED RED ON non-compliant) */}
          <div className={`p-4.5 rounded-xl border shadow-3xs flex flex-col justify-between hover:shadow-2xs transition ${
            aggregateMetrics.nonCompliantCount > 0 
              ? 'bg-rose-50/40 border-red-300 shadow-rose-100/50' 
              : 'bg-white border-slate-205'
          }`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">在保达标保单占比</span>
              <span className={`p-1 rounded text-xs ${aggregateMetrics.nonCompliantCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-800'}`}>
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-black font-mono ${aggregateMetrics.nonCompliantCount > 0 ? 'text-red-650' : 'text-slate-850'}`}>
                  {aggregateMetrics.complianceRate.toFixed(1)}%
                </span>
                <span className="text-[10px] font-sans font-bold text-gray-400">
                  ({aggregateMetrics.compliantCount}家)
                </span>
              </div>
              
              {/* Highlight non-compliance counts in RED according to specification */}
              <div className="mt-1 text-[9.5px] leading-tight font-extrabold text-red-600 bg-red-100/65 rounded px-2 py-0.5 border border-red-150 animate-pulse w-max">
                不达标企业数: {aggregateMetrics.nonCompliantCount} 家
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM DOUBLE GRID: Charts (Left) & Policies Details List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main List Area: 3.3 保单服务费明细列表 (8 COLS) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-3xs flex flex-col overflow-hidden">
            
            {/* Table Control Header and Export Trigger button */}
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-800">
                <span className="p-1 px-2 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded">台账</span>
                <span className="font-bold">全市各排队保单计提详情</span>
                <span className="font-mono text-gray-405">({filteredPolicies.length}条结果)</span>
              </div>

              {/* 3.4 Auxiliary Actions: Excel Export Trigger & Add spent (Sec 3.4) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTargetPolicyId(filteredPolicies[0]?.id || '');
                    setShowAddSpendingModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg px-3 py-1.5 text-[11px] transition shadow-3xs hover:shadow-2xs cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>追加已核销预防服务额</span>
                </button>

                <button
                  onClick={handleReportExport}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-semibold transition shadow-3xs hover:shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>一键导出 Excel 报表</span>
                </button>
              </div>
            </div>

            {/* Strict spec representation table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f0f4f8] border-b border-slate-200 text-gray-650 font-bold uppercase tracking-wider">
                    <th className="py-2 px-4 text-[10px]">保单编号及被保主体</th>
                    <th className="py-2 px-4 text-[10px]">行业 / 保司</th>
                    <th className="py-2 px-4 text-[10px]">保单有效期</th>
                    <th className="py-2 px-4 text-right text-[10px]">总保费 (万元)</th>
                    <th className="py-2 px-4 text-right text-[10px]">应计提 (万元)</th>
                    <th className="py-2 px-4 text-right text-[10px] text-indigo-650">实际支出 (万元)</th>
                    <th className="py-2 px-4 text-center text-[10px]">服务费占比</th>
                    <th className="py-2 px-4 text-center text-[10px]">达标判定</th>
                    <th className="py-2 px-4 text-center text-[10px] text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-gray-400">
                        <div className="text-3xl mb-2">🔍</div>
                        <p className="font-bold text-xs text-gray-500">未检索到对应条件的安责险防灾计提明细档案</p>
                        <p className="text-[10px] text-gray-400 mt-1">请重置上侧的高级过滤选项并重新匹配。</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPolicies.map((p) => {
                      return (
                        <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                          
                          {/* 基础信息 1: 保单号+企业名称 */}
                          <td className="py-2.5 px-4">
                            <div className="font-black text-slate-900 font-mono text-[11px]">{p.id}</div>
                            <div className="text-slate-600 font-medium text-[11px] truncate mt-0.5 max-w-[170px]" title={p.enterprise}>
                              {p.enterprise}
                            </div>
                          </td>

                          {/* 基础信息 2: 行业与保司 */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <span className="p-1 bg-slate-100 text-slate-700 text-[9px] font-black rounded">
                              {p.industry}
                            </span>
                            <div className="text-[10px] text-gray-405 mt-1 font-bold">{p.carrier}</div>
                          </td>

                          {/* 基础信息 3: 保单有效期 */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <div className="text-[10px] font-mono font-medium text-gray-700">{p.startDate}</div>
                            <div className="text-[10.5px] text-gray-405 mt-0.5 font-sans">至 {p.endDate}</div>
                          </td>

                          {/* 费用信息 1: 保费总额 */}
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {p.premium.toFixed(1)}
                          </td>

                          {/* 费用信息 2: 应计提服务费部分金额 */}
                          <td className="py-2.5 px-4 text-right font-medium text-gray-500 font-mono">
                            {p.requiredServiceFee.toFixed(2)}
                          </td>

                          {/* 费用信息 3: 实际支出费用金额 */}
                          <td className="py-2.5 px-4 text-right font-black text-indigo-700 font-mono">
                            {p.serviceFeeActual.toFixed(2)}
                          </td>

                          {/* 费用信息 4: 支出占比 (%) */}
                          <td className="py-2.5 px-4 text-center">
                            <span className="font-extrabold font-mono text-slate-800 text-[11px]">
                              {p.ratio.toFixed(1)}%
                            </span>
                            {/* Tiny progress status bar representation */}
                            <div className="w-12 h-1 bg-gray-150 rounded overflow-hidden mt-1 mx-auto">
                              <div 
                                className={`h-full ${p.isCompliant ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
                                style={{ width: `${Math.min(100, (p.ratio / minExtractionRate) * 100)}%` }}
                              />
                            </div>
                          </td>

                          {/* 费用状态 5: 达标判定判定 */}
                          <td className="py-2.5 px-4 text-center">
                            {p.isCompliant ? (
                              <span className="inline-flex items-center gap-0.5 p-1 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded font-black text-[9px]">
                                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>达标</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 p-1 bg-red-50 text-red-700 border border-red-150 rounded font-black text-[9px] animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                                <span>不达标</span>
                              </span>
                            )}
                          </td>

                          {/* Operations and Warning remind trigger */}
                          <td className="py-2.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Details button trigger modal overlay */}
                              <button
                                onClick={() => setSelectedDetailedPolicyId(p.id)}
                                className="px-2 py-1 text-[10.5px] font-bold text-slate-700 hover:text-indigo-700 hover:bg-slate-100 border border-gray-300 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>查看详情</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              {/* Click reminder dispatch warning if not compliant */}
                              {!p.isCompliant && (
                                <button
                                  disabled={remindingPolicyId === p.id}
                                  onClick={() => sendWarningCorrectionReminder(p)}
                                  className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-205 rounded-lg hover:bg-amber-100 transition shadow-2xs flex items-center gap-0.5 cursor-pointer"
                                  title="向相应保司发送催提通知"
                                >
                                  {remindingPolicyId === p.id ? (
                                    <span className="w-2 h-2 rounded bg-amber-500 animate-ping inline-block" />
                                  ) : (
                                    <Bell className="w-3 h-3 text-amber-600" />
                                  )}
                                  <span>督办催提</span>
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Instructions helper info bar */}
            <div className="p-3 bg-[#eef2f6]/60 border-t border-slate-150 text-[10.5px] text-gray-405 flex items-center gap-2">
              <span className="p-0.5 px-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[8.5px] rounded tracking-wide font-black uppercase">
                合规提示
              </span>
              <span>
                系统已设置对于不达标保单的智能追偿机制：点击「督办催提」按钮可将违约罚单邮件直接送达承保机构分管领导，督促完成事故预防费追加划拨。
              </span>
            </div>

          </div>

          {/* Visual distribution chart (4 COLS) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-3xs p-4.5 flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">事故预防费支出行业分配</h3>
                  <p className="text-[10px] text-gray-400">目前筛选出的保单中各主要资金划拨用途总体情况</p>
                </div>
                <span className="text-[9px] bg-slate-50 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded font-mono">
                  CHART VALUE
                </span>
              </div>

              <div className="w-full h-[200px] relative">
                {chartApportionmentDistribution.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-center text-gray-405 text-xs">
                    暂无可用于分析的多维度资金明细支出图，请调整上方筛选。
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartApportionmentDistribution} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={8} tickFormatter={(val) => val.slice(0, 4)} />
                      <YAxis fontSize={9} />
                      <Tooltip formatter={(value) => [`${value} 万元`, '支出总额']} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={26}>
                        {chartApportionmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={APP_COLORS[index % APP_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Chart Legend items list */}
              <div className="space-y-1.5 pt-3.5 border-t border-gray-100 text-xs mt-3">
                {chartApportionmentDistribution.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10.5px] text-gray-500 font-semibold p-1 hover:bg-slate-50 rounded-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: APP_COLORS[idx % APP_COLORS.length] }} />
                      <span className="text-slate-700 text-[11px] font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono text-slate-800 font-bold">{item.value.toFixed(1)} 万元</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/75 p-3.5 rounded-xl border border-amber-100 text-[10px] text-amber-800 leading-normal flex gap-1.5 items-start mt-4">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-extrabold text-[11px] mb-0.5 text-amber-900">安全生产责任险指南督查底线</p>
                <span>各保险人在保单生效起30日内必须按合规提取指导比率在平台上传预算计提台账。提取不合规保司，计入下季度年度绩效评核黑榜。</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ============= 3.3 PREVENTATIVE DETAILS MODAL VIEW ========= */}
      {/* ======================================================== */}
      {selectedPolicyDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2.5xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header part of Modal */}
            <div className="bg-slate-900 text-white p-5.5 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded tracking-wider uppercase">
                    POLICY ACCRUAL LEDGER
                  </span>
                  <span className="text-xs text-slate-400 font-mono">| {selectedPolicyDetails.id}</span>
                </div>
                <h3 className="text-sm font-black text-white">
                  保单防灾服务经费使用追溯详情: {selectedPolicyDetails.enterprise}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetailedPolicyId(null)}
                className="text-white hover:text-red-400 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition duration-150 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics display bar */}
            <div className="bg-[#f0f4f8] p-4.5 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs shrink-0 font-medium">
              <div>
                <span className="text-gray-400 block font-bold mb-0.5">保险合同保费</span>
                <span className="font-black text-slate-900 font-mono text-sm">
                  {selectedPolicyDetails.premium.toFixed(1)} <span className="text-[10px] font-normal">万元</span>
                </span>
                <p className="text-[9.5px] text-gray-400 mt-1">承保人：{selectedPolicyDetails.carrier}</p>
              </div>
              <div>
                <span className="text-gray-400 block font-bold mb-0.5">应提取事故预防费额</span>
                <span className="font-black text-indigo-700 font-mono text-sm">
                  {selectedPolicyDetails.requiredServiceFee.toFixed(2)} <span className="text-[10px] font-normal">万元</span>
                </span>
                <p className="text-[9.5px] text-indigo-600 mt-1">底限提取系数率：{minExtractionRate}%</p>
              </div>
              <div>
                <span className="text-gray-400 block font-bold mb-0.5">实际预防总支出费额</span>
                <span className="font-black text-emerald-600 font-mono text-sm">
                  {selectedPolicyDetails.serviceFeeActual.toFixed(2)} <span className="text-[10px] font-normal">万元</span>
                </span>
                <p className="text-[9.5px] text-emerald-600 mt-1">当前完成提取率：{selectedPolicyDetails.ratio}%</p>
              </div>
              <div>
                <span className="text-gray-400 block font-bold mb-0.5">合规认评鉴别</span>
                <div className="mt-0.5">
                  {selectedPolicyDetails.isCompliant ? (
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-250 rounded font-black text-[10.5px]">
                      提取合规达标
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-250 rounded font-black text-[10.5px] animate-pulse">
                      提取经费不足
                    </span>
                  )}
                </div>
                <p className="text-[9.5px] text-gray-400 mt-1.5">有效期: {selectedPolicyDetails.startDate}~{selectedPolicyDetails.endDate}</p>
              </div>
            </div>

            {/* Scrollable Tabs detail space inside modal */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
              
              {/* Portion 1: 该保单的服务费计提记录 (1) */}
              <div className="space-y-2">
                <span className="font-black text-slate-800 border-l-3 border-blue-500 pl-2 block">
                  1. 服务费系统计提拨备记录 (Accrual Target Log)
                </span>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-slate-50/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f4f8] text-gray-650">
                      <tr>
                        <th className="px-4 py-2 font-bold">计提记录时间</th>
                        <th className="px-4 py-2 font-bold text-right">计提到账基准额 (万元)</th>
                        <th className="px-4 py-2 font-bold">监管划拨标准参考比例</th>
                        <th className="px-4 py-2 font-bold">计提备注摘要</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {selectedPolicyDetails.accrualHistory.map((acc, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 font-mono text-gray-600">{acc.date}</td>
                          <td className="px-4 py-2.5 text-right font-black text-slate-900 font-mono">{acc.amount.toFixed(2)}</td>
                          <td className="px-4 py-2.5 font-semibold text-blue-700 font-mono">{minExtractionRate}% 基准折算度</td>
                          <td className="px-4 py-2.5 text-gray-500 font-medium">{acc.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portion 2: 逐笔支出流水 (2) */}
              <div className="space-y-2">
                <span className="font-black text-slate-800 border-l-3 border-teal-500 pl-2 block">
                  2. 分项实际支付与核报记录流水 (Preventative Expenditure Details)
                </span>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f4f8] text-gray-650">
                      <tr>
                        <th className="px-4 py-2 font-bold">记账划拨日期</th>
                        <th className="px-4 py-2 font-bold">用途科目类别</th>
                        <th className="px-4 py-2 font-bold text-right">流转支付金额 (万元)</th>
                        <th className="px-4 py-2 font-bold">接受预拨款项服务商/负责人</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {selectedPolicyDetails.spendHistory.map((sh, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 font-mono text-gray-650">{sh.date}</td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[9.5px]">
                              {sh.category}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-black text-slate-800 font-mono">{sh.amount.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-gray-700 font-bold">{sh.receiver}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portion 3: 关联的已核销服务工单清单 (3) */}
              <div className="space-y-2">
                <span className="font-black text-slate-800 border-l-3 border-amber-500 pl-2 block">
                  3. 平台对标核销已办结的事故预防工单清单 (Associated Finished Worksheets)
                </span>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-slate-50/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f4f8] text-gray-650">
                      <tr>
                        <th className="px-4 py-2 font-bold">工单编号</th>
                        <th className="px-4 py-2 font-bold">预防专项服务工作名称</th>
                        <th className="px-4 py-2 font-bold">办结对账核销日期</th>
                        <th className="px-4 py-2 font-bold">实际核抵成本 (万元)</th>
                        <th className="px-4 py-2 font-bold">专家服务机构姓名</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {selectedPolicyDetails.associatedWorks.map((work, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 font-mono font-bold text-gray-500">{work.workId}</td>
                          <td className="px-4 py-2.5 text-slate-800 font-bold">{work.workName}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-600">{work.completedDate}</td>
                          <td className="px-4 py-2.5 font-black text-emerald-650 font-mono">{work.cost.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-slate-500 font-semibold">{work.agency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portion 4: Apportion (费用分摊明细) (4) */}
              <div className="space-y-2.5">
                <span className="font-black text-slate-800 border-l-3 border-indigo-500 pl-2 block">
                  4. 国家专项费用分类支出额限度评估 (Cost Apportionment Details)
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#eef2f6]/50 p-4 rounded-xl border border-slate-201 text-center">
                  <div className="bg-white p-3 rounded-lg border border-slate-201">
                    <span className="text-gray-450 block text-[10.5px]">重大事故隐患排查</span>
                    <p className="text-sm font-black text-blue-700 font-mono mt-1">
                      {selectedPolicyDetails.apportionDetails.inspectorFee.toFixed(2)} 万元
                    </p>
                    <div className="w-full bg-blue-100 h-1 rounded mt-1.5 overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${selectedPolicyDetails.serviceFeeActual > 0 ? (selectedPolicyDetails.apportionDetails.inspectorFee / selectedPolicyDetails.serviceFeeActual) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-201">
                    <span className="text-gray-450 block text-[10.5px]">安全生产宣传教育培训</span>
                    <p className="text-sm font-black text-emerald-600 font-mono mt-1">
                      {selectedPolicyDetails.apportionDetails.trainingFee.toFixed(2)} 万元
                    </p>
                    <div className="w-full bg-emerald-100 h-1 rounded mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedPolicyDetails.serviceFeeActual > 0 ? (selectedPolicyDetails.apportionDetails.trainingFee / selectedPolicyDetails.serviceFeeActual) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-201">
                    <span className="text-gray-450 block text-[10.5px]">现场多重应急突击演练</span>
                    <p className="text-sm font-black text-amber-600 font-mono mt-1">
                      {selectedPolicyDetails.apportionDetails.drillFee.toFixed(2)} 万元
                    </p>
                    <div className="w-full bg-amber-100 h-1 rounded mt-1.5 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${selectedPolicyDetails.serviceFeeActual > 0 ? (selectedPolicyDetails.apportionDetails.drillFee / selectedPolicyDetails.serviceFeeActual) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-201">
                    <span className="text-gray-450 block text-[10.5px]">其他防灾物资推广等</span>
                    <p className="text-sm font-black text-pink-650 font-mono mt-1">
                      {selectedPolicyDetails.apportionDetails.otherFee.toFixed(2)} 万元
                    </p>
                    <div className="w-full bg-pink-100 h-1 rounded mt-1.5 overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${selectedPolicyDetails.serviceFeeActual > 0 ? (selectedPolicyDetails.apportionDetails.otherFee / selectedPolicyDetails.serviceFeeActual) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions of Modal */}
            <div className="bg-slate-50 border-t border-slate-201 p-4.5 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedDetailedPolicyId(null)}
                className="px-4.5 py-2 bg-slate-800 text-white hover:bg-slate-700 hover:shadow shadow-3xs rounded-xl font-bold cursor-pointer"
              >
                <span>关闭返回台账列表</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============= ADDITIONAL MOCK SPENDING DIALOGUE ======== */}
      {/* ======================================================== */}
      {showAddSpendingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // Compute dynamic addition handler
              if (!targetPolicyId) {
                alert('请先选择一份目标被保保单！');
                return;
              }
              const numVal = parseFloat(spendingAmount);
              if (isNaN(numVal) || numVal <= 0) {
                alert('请输入合法的数字支出(万元)！');
                return;
              }

              setPolicies(prev => prev.map(p => {
                if (p.id === targetPolicyId) {
                  const updatedActual = parseFloat((p.serviceFeeActual + numVal).toFixed(2));
                  
                  // Dynamically expand apportion and spent details
                  const updatedApportion = { ...p.apportionDetails };
                  if (spendingCategory.includes('排查')) {
                    updatedApportion.inspectorFee = parseFloat((updatedApportion.inspectorFee + numVal).toFixed(2));
                  } else if (spendingCategory.includes('培训')) {
                    updatedApportion.trainingFee = parseFloat((updatedApportion.trainingFee + numVal).toFixed(2));
                  } else if (spendingCategory.includes('演练')) {
                    updatedApportion.drillFee = parseFloat((updatedApportion.drillFee + numVal).toFixed(2));
                  } else {
                    updatedApportion.otherFee = parseFloat((updatedApportion.otherFee + numVal).toFixed(2));
                  }

                  const newWorkId = `WK-NEW-${Math.floor(Math.random() * 800) + 100}`;
                  const updatedWorks = [
                    ...p.associatedWorks,
                    {
                      workId: newWorkId,
                      workName: `追加「${spendingCategory}」专家线下整改`,
                      completedDate: spendingDate,
                      cost: numVal,
                      agency: spendingOperator || '合作公共防务服务测评处'
                    }
                  ];

                  const updatedSpendHistory = [
                    ...p.spendHistory,
                    {
                      date: spendingDate,
                      amount: numVal,
                      category: spendingCategory,
                      receiver: spendingOperator || '合作公共防务服务测评处'
                    }
                  ];

                  return {
                    ...p,
                    serviceFeeActual: updatedActual,
                    apportionDetails: updatedApportion,
                    associatedWorks: updatedWorks,
                    spendHistory: updatedSpendHistory
                  };
                }
                return p;
              }));

              setShowAddSpendingModal(false);
              setTargetPolicyId('');
              setSpendingAmount('');
              setSpendingOperator('');
              setSpendingNotes('');
              alert('【追加计拨核报成功】已经将这一笔事故预防款项分摊并在对应的保单、工单及费用比例中进行了全账更新！');
            }}
            className="bg-white rounded-2.5xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
          >
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black">
                  一键追加保险公司事故预防服务支出
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddSpendingModal(false)}
                className="text-white hover:text-red-400 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-5.5 space-y-4 text-xs font-semibold text-gray-700">
              
              {/* Select target Policy ID */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">选择对应划拨的安责险保单 (Policy Account)</label>
                <select
                  required
                  value={targetPolicyId}
                  onChange={(e) => setTargetPolicyId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-bold"
                >
                  <option value="">-- 请选择被投保高危企业保单台账 --</option>
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.enterprise} (保费: {p.premium} 万元)
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount output spent */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">支出经费金额 (单位：万元)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={spendingAmount}
                  onChange={(e) => setSpendingAmount(e.target.value)}
                  placeholder="如: 4.5"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-mono font-black"
                />
              </div>

              {/* Service categories */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">经费执行服务科目类别</label>
                <select
                  value={spendingCategory}
                  onChange={(e) => setSpendingCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-bold"
                >
                  <option value="重大事故隐患排查">重大事故隐患排查</option>
                  <option value="安全生产宣传教育培训">安全生产宣传教育培训</option>
                  <option value="现场多重应急突击演练">现场多重应急突击演练</option>
                  <option value="防灾科技装备技术推广">其他防灾宣传推广支出</option>
                </select>
              </div>

              {/* Service agency execution */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">经办专家服务机构</label>
                <input
                  type="text"
                  value={spendingOperator}
                  onChange={(e) => setSpendingOperator(e.target.value)}
                  placeholder="如: 齐鲁安全注册评价研究中心 (留空系统自创)"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">核销登记支出日期</label>
                <input
                  required
                  type="date"
                  value={spendingDate}
                  onChange={(e) => setSpendingDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">追加划款明细说明用途</label>
                <textarea
                  value={spendingNotes}
                  onChange={(e) => setSpendingNotes(e.target.value)}
                  placeholder="如：对高风险作业区新设三防传感器，补齐提取底线不足规准整改"
                  rows={2}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="bg-slate-50 border-t border-slate-201 p-4.5 flex justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddSpendingModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 rounded-xl font-bold font-sans"
              >
                <span>取消</span>
              </button>
              <button
                type="submit"
                className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 hover:shadow text-white rounded-xl font-bold font-sans cursor-pointer"
              >
                <span>确定追加</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
