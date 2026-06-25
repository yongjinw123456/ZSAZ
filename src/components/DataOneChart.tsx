import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LabelList
} from 'recharts';
import { 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Coins, 
  Users, 
  Activity, 
  Search, 
  BarChart2, 
  Calendar, 
  ArrowRight, 
  Building2, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown, 
  MapPin, 
  Flame, 
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';

// Static colors for Recharts Cell rendering
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#14B8A6'];
const RISK_COLORS = {
  high: '#EF4444', 
  medium: '#F59E0B', 
  low: '#10B981'
};

const ACCIDENT_COLORS = ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export function DataOneChart() {
  // Current Active Tab: 'overview' | 'underwriting' | 'claims' | 'risk-control' | 'red-black' | 'prevention-stats'
  const [activeTab, setActiveTab] = useState<'overview' | 'underwriting' | 'claims' | 'risk-control' | 'red-black' | 'prevention-stats'>('overview');

  // Interactive filters
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // --- MOCK DATABASE ---
  
  // 1. Core Overview Data
  const overviewStats = {
    enterpriseCount: 3840,
    coverageRate: 92.4, // Overall: 92.4%. Warn: high-risk industry < 95% is red. Currently we show chemical coverage as 91.2% which is highlighted as red in the warning section.
    serviceRate: 88.6,  // Completing: 88.6%. Warn < 90% is red.
    hazardClosedRate: 81.5, // Closed-loop: 81.5%. Warn < 85% is red.
    majorHazards: 3,     // Major hazards: 3. Warn > 0 is blinking red.
    claimsCount: 156,    // Total claims cases
  };

  // Pie Chart: Industry insurance percentage
  const industryInsuranceData = [
    { name: '危化行业', value: 820 },
    { name: '建筑工程', value: 1140 },
    { name: '非煤矿山', value: 380 },
    { name: '一般工贸', value: 1200 },
    { name: '交通运输/其他', value: 300 },
  ];

  // Bar Chart: Service type completion numbers / rates
  const serviceCompletionRateData = [
    { name: '隐患排查', rate: 91.2, completed: 1450, total: 1590 },
    { name: '安全培训', rate: 84.5, completed: 820, total: 970 },
    { name: '应急演练', rate: 87.8, completed: 430, total: 490 },
  ];

  // Pie Chart: Enterprise risk levels
  const enterpriseRiskData = [
    { name: '高风险企业 (红色)', value: 450, code: 'high', fill: RISK_COLORS.high },
    { name: '中风险企业 (黄色)', value: 1380, code: 'medium', fill: RISK_COLORS.medium },
    { name: '低风险企业 (蓝色/绿色)', value: 2010, code: 'low', fill: RISK_COLORS.low },
  ];

  // Line Chart: Past 6 months claim count trend
  const claimTrendData = [
    { month: '1月', count: 18, amount: 145 },
    { month: '2月', count: 12, amount: 98 },
    { month: '3月', count: 24, amount: 210 },
    { month: '4月', count: 15, amount: 115 },
    { month: '5月', count: 28, amount: 320 },
    { month: '6月', count: 31, amount: 290 },
  ];

  // --- TAB 3.1: Underwriting Analysis Data ---
  // Bar Chart: Industry insurance coverage rates (%)
  const industryCoverageData = [
    { name: '化工化学品', rate: 91.2, value: '化工安全', isHighRisk: true },
    { name: '建筑与隧道施工', rate: 94.5, value: '重特大施工类', isHighRisk: true },
    { name: '金属及非煤矿山', rate: 97.2, value: '高危大类', isHighRisk: true },
    { name: '涉氨制冷工贸', rate: 93.6, value: '涉爆涉危害', isHighRisk: true },
    { name: '一般制造加工', rate: 88.4, value: '一般工贸', isHighRisk: false },
    { name: '现代物流与服务', rate: 84.8, value: '普适服务业', isHighRisk: false },
  ];

  // Line Chart: past 12 Months underwriting trend (New vs Renewed)
  const monthlyUnderwriteTrend = [
    { month: '25-07', newAdds: 45, renews: 180 },
    { month: '25-08', newAdds: 55, renews: 195 },
    { month: '25-09', newAdds: 60, renews: 210 },
    { month: '25-10', newAdds: 38, renews: 240 },
    { month: '25-11', newAdds: 42, renews: 220 },
    { month: '25-12', newAdds: 80, renews: 295 },
    { month: '26-01', newAdds: 95, renews: 310 },
    { month: '26-02', newAdds: 20, renews: 140 },
    { month: '26-03', newAdds: 65, renews: 250 },
    { month: '26-04', newAdds: 74, renews: 280 },
    { month: '26-05', newAdds: 88, renews: 320 },
    { month: '26-06', newAdds: 105, renews: 340 },
  ];

  // Table: Uninsured enterprises list
  const uninsuredEnterprises = [
    { id: 'UE-001', name: '万通化学特种气体有限公司', industry: '化工化学品', region: '临港经济开发区', dueTime: '2026-04-12', severity: '高危行业' },
    { id: 'UE-002', name: '大丰矿业开采第极三分厂', industry: '金属及非煤矿山', region: '西山矿区地带', dueTime: '2026-05-01', severity: '矿山高危' },
    { id: 'UE-003', name: '建工四局江景名邸施工项目部', industry: '建筑与隧道施工', region: '高新技术产业城', dueTime: '2026-05-18', severity: '重特大工期' },
    { id: 'UE-004', name: '宏发冷链物流速冻车间', industry: '涉氨制冷工贸', region: '北郊仓储枢纽', dueTime: '2026-06-10', severity: '一般监管' },
    { id: 'UE-005', name: '金马机械精细打磨抛光厂', industry: '建筑与隧道施工', region: '经济技术开发区', dueTime: '2026-06-20', severity: '粉尘涉爆类' },
  ];

  // --- TAB 3.2: Claims Analysis Data ---
  // Pie Chart: Accident types percentage
  const accidentTypeData = [
    { name: '高处坠落', value: 42, color: '#F43F5E' },
    { name: '物体打击', value: 25, color: '#F59E0B' },
    { name: '机械伤害', value: 18, color: '#10B981' },
    { name: '触电及火灾', value: 11, color: '#3B82F6' },
    { name: '其他生产事故', value: 4, color: '#8B5CF6' },
  ];

  // Bar Chart: Claims amount ranked by industry (万元)
  const industryClaimsPayoutData = [
    { name: '建筑与隧道施工', amount: 845 },
    { name: '化工化学品', amount: 620 },
    { name: '金属及非煤矿山', amount: 510 },
    { name: '涉氨制冷工贸', amount: 330 },
    { name: '一般制造加工', amount: 210 },
    { name: '现代物流与服务', amount: 95 },
  ];

  // Table: Overdue pending case list
  const overdueClaimsList = [
    { id: 'CLAIM20260401', enterprise: '高天重型锻造机械公司', crashTime: '2026-04-05', overdueDays: 78, lossAmount: '¥12.5万', status: '待审核补充资料' },
    { id: 'CLAIM20260422', enterprise: '明州华立化工物流园', crashTime: '2026-04-20', overdueDays: 63, lossAmount: '¥34.0万', status: '公估定损争议争议中' },
    { id: 'CLAIM20260510', enterprise: '第一建筑工程高新车间项目', crashTime: '2026-05-02', overdueDays: 51, lossAmount: '¥8.5万', status: '承保理算核赔中' },
    { id: 'CLAIM20260528', enterprise: '新天地爆破开凿第十工段', crashTime: '2026-05-15', overdueDays: 38, lossAmount: '¥115.0万', status: '案情复杂待复勘' },
  ];

  // --- TAB 3.3: Risk Control Services Analysis ---
  // Line Chart: past 6 Months service completion trends (%)
  const monthlyServiceTrend = [
    { month: '1月', targetRate: 90, actualRate: 85.2, completed: 420 },
    { month: '2月', targetRate: 90, actualRate: 82.4, completed: 310 },
    { month: '3月', targetRate: 90, actualRate: 86.8, completed: 530 },
    { month: '4月', targetRate: 90, actualRate: 89.5, completed: 720 },
    { month: '5月', targetRate: 90, actualRate: 91.2, completed: 880 },
    { month: '6月', targetRate: 90, actualRate: 88.6, completed: 970 },
  ];

  // Pie Chart: Hazard Levels percentage
  const hazardLevelData = [
    { name: '一般隐患', value: 8420, color: '#10B981' },
    { name: '较大隐患', value: 1250, color: '#F59E0B' },
    { name: '重大隐患', value: 24, color: '#EF4444' }, // Only 24 major ones
  ];

  // Table: Service organization quality ranking
  const serviceProviderRanking = [
    { rank: 1, name: '中安国泰安全生产技术研究院', count: 480, rate: 98.5, score: 4.88, level: '优秀 (红榜)' },
    { rank: 2, name: '安科达职业防灾安全评价中心', count: 320, rate: 96.2, score: 4.82, level: '优秀' },
    { rank: 3, name: '中金国健防灾减灾顾问集团', count: 290, rate: 94.0, score: 4.75, level: '良好' },
    { rank: 4, name: '泰达安全生产科技检测研究所', count: 440, rate: 89.2, score: 4.61, level: '合格' },
    { rank: 5, name: '宏基安全检测事务所(自查组)', count: 180, rate: 82.5, score: 4.25, level: '待整改 (黑榜)' },
  ];

  // --- TAB 3.4: Red/Black Regulatory Analysis ---
  // Bar Chart: red/black list statistics
  const redBlackStatsData = [
    { name: '红榜优秀机构', value: 8, fill: '#EF4444' }, // Red theme for top rank/red chart
    { name: '黑榜督办机构', value: 3, fill: '#1F2937' }, // Dark charcoal/black
    { name: '正常合规机构', value: 24, fill: '#3B82F6' },
  ];

  // Black List rectification progress
  const blackListProgress = [
    { name: '宏基安全检测事务所(自查组)', progress: 45, reason: '服务批量逾期、专家态度恶劣', deadline: '2026-06-30' },
    { name: '恒达联泰环评技术顾问公司', progress: 68, reason: '隐患排查报告套用模板失真', deadline: '2026-07-15' },
    { name: '聚力生产安防设备服务总站', progress: 90, reason: '重大事故隐患现场漏检严重', deadline: '2026-06-25' },
  ];

  // Table: Current red/black lists of entities
  const currentRedBlackListTable = [
    { name: '中安国泰安全生产技术研究院', rank: '红榜 (推荐)', reason: '排查重大火险缺陷4起并现场排除，获得企业零投诉锦旗', updateTime: '2026-06-12' },
    { name: '安科达职业防灾安全评价中心', rank: '红榜 (推荐)', reason: '首创全息数字化远程实景安全培训演兵系统，覆盖人数破万', updateTime: '2026-06-18' },
    { name: '宏基安全检测事务所(自查组)', rank: '黑榜 (督办)', reason: '服务隐患大项多次漏检、企业投诉率高于该区域均值的 12%', updateTime: '2026-06-10' },
    { name: '龙岩精工特种设备探伤站', rank: '黑榜 (督办)', reason: '未携高低压探伤装备，虚填防雷耐冲击检核，欺瞒企业主', updateTime: '2026-06-15' },
  ];

  // --- TAB 3.5: Accident Prevention statistical Analysis ---
  // Pie Chart: Service type distributions
  const annualServiceDistribution = [
    { name: '重大事故隐患排查', value: 45, color: '#3B82F6' },
    { name: '安全宣传与教育培训', value: 30, color: '#10B981' },
    { name: '应急响应与拉网式演练', value: 15, color: '#F59E0B' },
    { name: '安全红线风险评估辅导', value: 10, color: '#8B5CF6' },
  ];

  // Bar Chart: Regional service counts comparison
  const regionalServiceCounts = [
    { name: '香洲区', count: 850 },
    { name: '斗门区', count: 720 },
    { name: '金湾区', count: 640 },
    { name: '横琴新区', count: 320 },
    { name: '临港高新区', count: 210 },
  ];

  // Table: annual performance statistics
  const annualPerformanceStatTable = [
    { indicator: '总计预防风险巡视次数', val: '2,548 次', goalRate: '100.0%', comment: '超额完成12%' },
    { indicator: '安全隐患专项排查量', val: '9,694 条', goalRate: '98.5%', comment: '排查到闭环全覆盖' },
    { indicator: '隐患整改闭环落实数', val: '7,901 条', goalRate: '81.5%', comment: '15天内流转整改中' },
    { indicator: '全员安全自护培训人次', val: '31,520 人次', goalRate: '124.0%', comment: '微课视频全面下发考核' },
    { indicator: '重特大重大隐患复核督排', val: '24 起', goalRate: '100%', comment: '无遗留漏洞，无死灰复燃' },
  ];

  return (
    <div id="regulatory-dashboard-portal" className="h-full flex flex-col overflow-hidden bg-slate-100 font-sans relative">
      
      {/* 1. Dashboard Master Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-indigo-100 text-indigo-700 text-xs font-black rounded-md">
              监管端
            </span>
            <h1 className="text-base font-bold text-gray-900">安全风险防范“数据一张图”</h1>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              全市安责险监管中心
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            汇总全市在保、承保、理赔、红黑督办、事故防灾的全局数据运行特征。一屏交互点击多维度专项分析，赋能闭环防灾救灾。
          </p>
        </div>

        {/* Outer Tab group buttons - Toggle Overview and 5 special regulatory pages */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>核心风险总览</span>
          </button>
          
          <button
            onClick={() => setActiveTab('underwriting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'underwriting' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-500" />
            <span>承保监管分析</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'claims' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>理赔监管分析</span>
          </button>

          <button
            onClick={() => setActiveTab('risk-control')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'risk-control' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>风控服务监管</span>
          </button>

          <button
            onClick={() => setActiveTab('red-black')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'red-black' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5 text-amber-500" />
            <span>红黑榜监管</span>
          </button>

          <button
            onClick={() => setActiveTab('prevention-stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'prevention-stats' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>事故预防服务统计分析</span>
          </button>
        </div>
      </div>

      {/* 2. Main Scrollable Content Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar min-h-0 bg-[#f1f5f9]">
        
        {/* ========================================== */}
        {/* VIEW 1: RISK DATA OVERVIEW (核心风险总览看板) */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Top 6 High-Contrast Stat Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              
              {/* Card 1: 在保企业 */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
                <div className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">在保企业总数</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-800">{overviewStats.enterpriseCount}</span>
                  <span className="text-[10px] text-gray-500">家</span>
                </div>
                <div className="text-[9px] text-emerald-500 mt-2 flex items-center font-bold">
                  <span>✓ 履责率 99.8%</span>
                </div>
              </div>

              {/* Card 2: 投保覆盖率 (*Warn rule: High-risk sector <95% highlighted in red in subtext, overall rate can be displayed nicely) */}
              <div className={`bg-white border rounded-xl p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden ${
                overviewStats.coverageRate < 95 ? 'border-amber-300' : 'border-slate-200'
              }`}>
                <div className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">整体投保覆盖率</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-850">{overviewStats.coverageRate}%</span>
                </div>
                <div className="text-[9px] text-rose-500 mt-2 flex items-center font-bold gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                  <span>危化行业91.2% (低于95%)</span>
                </div>
              </div>

              {/* Card 3: 服务完成率 (*Warn <90% red-marked) */}
              <div className={`bg-white border rounded-xl p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden ${
                overviewStats.serviceRate < 90 ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
              }`}>
                <div className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">服务完成率</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${overviewStats.serviceRate < 90 ? 'text-red-650' : 'text-slate-850'}`}>
                    {overviewStats.serviceRate}%
                  </span>
                </div>
                <div className="text-[9px] text-red-500 mt-2 flex items-center font-bold gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                  <span>低于标准90%触发预警</span>
                </div>
              </div>

              {/* Card 4: 隐患整改率 (*Warn <85% red-marked) */}
              <div className={`bg-white border rounded-xl p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden ${
                overviewStats.hazardClosedRate < 85 ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
              }`}>
                <div className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">隐患整改闭环率</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${overviewStats.hazardClosedRate < 85 ? 'text-red-600' : 'text-slate-800'}`}>
                    {overviewStats.hazardClosedRate}%
                  </span>
                </div>
                <div className="text-[9px] text-red-500 mt-2 flex items-center font-bold gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                  <span>低于标准85%标红警告</span>
                </div>
              </div>

              {/* Card 5: 重大隐患数 (*Warn >0 blinking red badge/card) */}
              <div className={`border rounded-xl p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                overviewStats.majorHazards > 0 
                  ? 'border-red-500 bg-red-50/40 animate-pulse-slow shadow-md' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="text-red-700 text-[10px] font-black tracking-tight uppercase flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  重大未销案隐患
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-red-600">{overviewStats.majorHazards}</span>
                  <span className="text-[10px] text-red-700 font-bold">处挂牌待办</span>
                </div>
                <div className="text-[8.5px] text-red-600 font-black mt-1 leading-snug">
                  ⚠ 紧急！有超期未改项
                </div>
              </div>

              {/* Card 6: 累计理赔案件 */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
                <div className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">累计理赔案件 (本年度)</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-850">{overviewStats.claimsCount}</span>
                  <span className="text-[10px] text-gray-500">笔出险</span>
                </div>
                <div className="text-[9px] text-gray-500 mt-2 flex items-font">
                  <span>赔付额度 584万元</span>
                </div>
              </div>

            </div>

            {/* 2x2 Middle Grid Core Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* CH 1: Industry Insurance Ratio (Pie) */}
              <div id="chart-ratio-1" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[340px]">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                    <span>行业投保企业占比饼图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">主要管控高危类型企业的承保与在保分布结构</p>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryInsuranceData}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {industryInsuranceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} 家`, '在保数']} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Service Completion Rates (Bar) */}
              <div id="chart-ratio-2" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[340px]">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                    <span>服务类型完成率特征柱状图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">三大常设风控体系对应排查深度、培训受教与拉练合格度</p>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceCompletionRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <YAxis domain={[0, 100]} unit="%" style={{ fontSize: '10px' }} />
                      <Tooltip formatter={(value) => [`${value}%`, '完成比例']} />
                      <Bar dataKey="rate" name="完成率 (%)" radius={[4, 4, 0, 0]} barSize={26}>
                        {serviceCompletionRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.rate < 90 ? '#F43F5E' : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 3: Enterprise Risk Distribution (Pie) */}
              <div id="chart-ratio-3" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[340px]">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                    <span>企业风险评定等级占比饼图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">综合企业历史出险概率、行业本身固有风险级别核算</p>
                </div>
                <div className="flex-1 min-h-0 relative flex items-center justify-center">
                  <div className="w-2/3 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={enterpriseRiskData}
                          cx="50%"
                          cy="45%"
                          outerRadius={75}
                          dataKey="value"
                        >
                          {enterpriseRiskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} 家`, '企业量']} />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Quick Side Legend Stats helper */}
                  <div className="w-1/3 text-xs space-y-2 border-l border-slate-100 pl-3">
                    <div className="text-red-500 font-bold">高危红区: 450家</div>
                    <div className="text-amber-500 font-bold">中风险黄: 1380家</div>
                    <div className="text-emerald-500 font-bold">低风险蓝绿: 2010家</div>
                  </div>
                </div>
              </div>

              {/* CH 4: Claim cases trend (Line) */}
              <div id="chart-ratio-4" className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[340px]">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                    <span>近六月理赔案件演阶折线图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">监测全市各工况在不同汛期、温湿度高频多发季节的事故数</p>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={claimTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" style={{ fontSize: '11px' }} />
                      <YAxis style={{ fontSize: '10px' }} />
                      <Tooltip formatter={(value) => [`${value} 起`, '出险报案']} />
                      <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="count" name="理赔报案数" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Bottom 3 priority Warning Tickers */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <span className="p-1 px-1.5 bg-rose-500/20 rounded border border-rose-500 flex items-center gap-1 text-[9.5px] font-black text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  全市最高优先级预警提醒
                </span>
                <span className="text-xs text-slate-350 font-bold hidden md:inline">|</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-805 text-[11px] flex gap-2 items-start">
                  <span className="text-red-500 font-bold shrink-0">① 重大隐患超期</span>
                  <p className="text-slate-300">香洲特种造纸厂挂历锅炉锈蚀，未落实15日内强制整改复消</p>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-805 text-[11px] flex gap-2 items-start">
                  <span className="text-amber-500 font-bold shrink-0">② 高危未参保</span>
                  <p className="text-slate-300">斗门中化加油站等3家企业保单已过期15天尚未续保</p>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-805 text-[11px] flex gap-2 items-start">
                  <span className="text-orange-500 font-bold shrink-0">③ 机构批量逾期</span>
                  <p className="text-slate-300">宏基安全事务所累计有7笔常设事故预防巡检逾期超过3天</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: UNDERWRITING ANALYSIS (承保监管分析) */}
        {/* ========================================== */}
        {activeTab === 'underwriting' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CH 1: Industry insurance coverage rate (Horizontal Bar, red highlight if high-risk < 95%) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
                    <span>行业投保覆盖率对比柱状图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">监管大类对应承保完备性特征，高危大类覆盖小于95%标红警告</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={industryCoverageData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} unit="%" style={{ fontSize: '10px' }} />
                      <YAxis dataKey="name" type="category" style={{ fontSize: '9px', fontWeight: 'bold' }} width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, '投保覆盖率']} />
                      <Bar dataKey="rate" name="覆盖率 (%)" radius={[0, 4, 4, 0]} barSize={16}>
                        {industryCoverageData.map((entry, index) => {
                          const isWarning = entry.isHighRisk && entry.rate < 95;
                          return (
                            <Cell key={`cell-${index}`} fill={isWarning ? '#EF4444' : '#10B981'} />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Monthly trend on new and renew (LineChart, 12 months) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
                    <span>近12月承保趋势折线图 (新参量 vs 续保量)</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">掌握全市月度续保稳定增长与新落户高危实体保费支撑</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyUnderwriteTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" style={{ fontSize: '10px' }} />
                      <YAxis style={{ fontSize: '10px' }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="newAdds" name="新增投保企业" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="renews" name="续保转存企业" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table: Uninsured enterprises */}
              <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex justify-between items-center">
                  <span className="text-xs font-bold text-red-650 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    高危待督办：全市辖区未投保重点高危安全实体清单
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black font-mono">
                    急需对接发令 {uninsuredEnterprises.length} 家
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-2.5 px-6">企业全称</th>
                        <th className="py-2.5 px-4">工业类别</th>
                        <th className="py-2.5 px-4">所在辖区属地</th>
                        <th className="py-2.5 px-4">理论应投时间上限</th>
                        <th className="py-2.5 px-6 text-right">监管建议动作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {uninsuredEnterprises.map((e, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-6 font-bold text-gray-800">{e.name}</td>
                          <td className="py-3 px-4">
                            <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[9px] px-2 py-0.5 rounded font-bold">
                              {e.industry}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500">{e.region}</td>
                          <td className="py-3 px-4 font-mono text-gray-600 font-bold">{e.dueTime}</td>
                          <td className="py-3 px-6 text-right">
                            <button className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-2xs active:scale-[0.98] text-white text-[10.5px] font-bold px-3 py-1 rounded-lg transition-all">
                              派单催缴
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 3: CLAIMS REGULATORY ANALYSIS (理赔监管分析) */}
        {/* ========================================== */}
        {activeTab === 'claims' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CH 1: Accident high rate distribution pie */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-red-500 rounded-full"></span>
                    <span>重大安全生产事故类型占比饼图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">高处坠落与物体打击位列前茅，指引常设预防服务应该往高处防坠器防备倾斜</p>
                </div>
                <div className="flex-grow min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accidentTypeData}
                        cx="50%"
                        cy="45%"
                        outerRadius={75}
                        dataKey="value"
                      >
                        {accidentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} 起`, '出险占比']} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Claims payout ranked by industry */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-red-500 rounded-full"></span>
                    <span>各行业累计已赔付金额对比柱状图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">累计核付及理赔中预计流失保金排行 (单位：万元)</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={industryClaimsPayoutData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                      <YAxis style={{ fontSize: '10px' }} />
                      <Tooltip formatter={(value) => [`¥${value} 万元`, '已决/未决理赔总额']} />
                      <Bar dataKey="amount" name="领发理赔金额" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={26}>
                        {industryClaimsPayoutData.map((e, index) => (
                          <Cell key={index} fill={ACCIDENT_COLORS[index % ACCIDENT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table: Overdue claims pending lists */}
              <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                    超期催核：全市安责险案案联查超期未结案件
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black font-mono">
                    挂案积压督导 {overdueClaimsList.length} 起
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-2.5 px-6">出险理赔编号</th>
                        <th className="py-2.5 px-4">报案出险企业</th>
                        <th className="py-2.5 px-4">出险发生日期</th>
                        <th className="py-2.5 px-4 text-right">超期天数</th>
                        <th className="py-2.5 px-4">保额损失估值</th>
                        <th className="py-2.5 px-6">卡死阻塞症结状态/阶段</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {overdueClaimsList.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-6 font-mono font-bold text-slate-800">{c.id}</td>
                          <td className="py-3 px-4 font-semibold text-gray-950">{c.enterprise}</td>
                          <td className="py-3 px-4 font-mono text-gray-500">{c.crashTime}</td>
                          <td className="py-3 px-4 text-right font-black text-rose-600 font-mono">
                            {c.overdueDays} 天 ⚠
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-700">{c.lossAmount}</td>
                          <td className="py-3 px-6">
                            <span className="text-amber-700 font-bold text-[10.5px]">
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 4: RISK CONTROL SERVICE (风控服务监管分析) */}
        {/* ========================================== */}
        {activeTab === 'risk-control' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CH 1: Monthly service completion rate (Line, past 6 months) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span>
                    <span>近 6 个月预警计划风控完成率趋势折线图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">蓝色折线走势对照考核督查下达的 90% 红线。近几月受汛期影响有波折</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyServiceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" style={{ fontSize: '10px' }} />
                      <YAxis style={{ fontSize: '10px' }} unit="%" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="actualRate" name="季度在轨实际完成率 (%)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="targetRate" name="行业保费合格及格红线 (90%)" stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Hazard Severity levels percentage (Pie) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span>
                    <span>排查事故隐患大类等级饼图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">目前较大隐患和重大隐患是核心消缺挂账大头，坚持挂账销案</p>
                </div>
                <div className="flex-grow min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hazardLevelData}
                        cx="50%"
                        cy="45%"
                        outerRadius={75}
                        dataKey="value"
                      >
                        {hazardLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} 条`, '数量']} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table: Service organization ranking */}
              <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    信用管护：全市辖区执业风控服务商质效评定榜表
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-black font-mono">
                    入主库机构 5 强
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-2.5 px-6 text-center">综合名次</th>
                        <th className="py-2.5 px-4">风控技术服务商名称</th>
                        <th className="py-2.5 px-4 text-right">出动预防排查频次</th>
                        <th className="py-2.5 px-4 text-right">限期完成履责率</th>
                        <th className="py-2.5 px-4 text-right">随单回访平均满意度</th>
                        <th className="py-2.5 px-6 text-right">评级与归类</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {serviceProviderRanking.map((prov, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-6 text-center font-bold">
                            <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10.5px] ${
                              prov.rank === 1 ? 'bg-amber-100 text-amber-700 font-extrabold' :
                              prov.rank === 2 ? 'bg-slate-200 text-slate-700' :
                              prov.rank === 3 ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-gray-600'
                            }`}>
                              {prov.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">{prov.name}</td>
                          <td className="py-3 px-4 text-right font-mono text-gray-650">{prov.count} 次</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{prov.rate}%</td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">{prov.score}分</td>
                          <td className="py-3 px-6 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              prov.level.includes('红榜') ? 'bg-red-50 text-red-700 border border-red-200' :
                              prov.level.includes('黑榜') ? 'bg-slate-900 text-amber-400 font-mono' :
                              prov.level === '良好' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-650'
                            }`}>
                              {prov.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 5: RED/BLACK REGULATORY (红黑榜监管分析) */}
        {/* ========================================== */}
        {activeTab === 'red-black' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CH 1: Red/Black list quantity bar */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-full"></span>
                    <span>红黑榜在册机构数量对比柱状图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">目前大多数机构处于合规绿色范围，仅有个别因失职或投诉进入黑榜待纠偏</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={redBlackStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                      <YAxis style={{ fontSize: '10px' }} />
                      <Tooltip formatter={(value) => [`${value} 家`, '机构数量']} />
                      <Bar dataKey="value" name="入编机构数" barSize={32}>
                        {redBlackStatsData.map((e, index) => (
                          <Cell key={index} fill={e.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Blacklist progress bar */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-full"></span>
                    <span>黑榜退场整改机制时效进度条</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">针对黑榜两家和自查组整改成效。进度达100%并通过复验后可申请撤销黑榜</p>
                </div>
                <div className="flex-grow overflow-y-auto space-y-4 pt-2">
                  {blackListProgress.map((bp, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-800">
                        <span className="font-extrabold truncate max-w-[200px]" title={bp.name}>{bp.name}</span>
                        <span className={`font-mono font-bold ${
                          bp.progress < 50 ? 'text-red-500' : bp.progress < 80 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          进度 {bp.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            bp.progress < 50 ? 'bg-red-500' : bp.progress < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${bp.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span className="truncate max-w-[250px]">上榜原因: {bp.reason}</span>
                        <span>整改截止限期: <b className="text-gray-600 font-mono">{bp.deadline}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table: Current red/black lists details */}
              <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    信用档案：本期安责险双向荣誉/黑标闭环记录表
                  </span>
                  <span className="text-[10.5px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded font-semibold">
                    全市联合调度归档
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-2.5 px-6">企业 / 服务机构名称</th>
                        <th className="py-2.5 px-4">上榜榜单评级</th>
                        <th className="py-2.5 px-6">代表性入围触发行为或核心原因简述</th>
                        <th className="py-2.5 px-4 text-right">上榜核录时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {currentRedBlackListTable.map((rb, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-6 font-bold text-gray-950">{rb.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border tracking-wide ${
                              rb.rank.includes('红榜') 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {rb.rank}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-gray-600 line-clamp-2">{rb.reason}</td>
                          <td className="py-3 px-4 text-right font-mono text-gray-500">{rb.updateTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 6: ACCIDENT PREVENTION (事故预防服务统计工作) */}
        {/* ========================================== */}
        {activeTab === 'prevention-stats' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CH 1: Annual service types percentage (Pie) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-purple-500 rounded-full"></span>
                    <span>年度安全防灾预防服务类型分布饼图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">一般隐患与安全用电、动火排查占据全域服务的 45% 比例</p>
                </div>
                <div className="flex-grow min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={annualServiceDistribution}
                        cx="50%"
                        cy="45%"
                        outerRadius={75}
                        dataKey="value"
                      >
                        {annualServiceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '占比']} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CH 2: Regional service counts (Bar) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs h-[340px] flex flex-col">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-purple-500 rounded-full"></span>
                    <span>各区县累计巡防次数对比柱状图</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">香洲及斗门工业高集成片区累计安全培训及点对点辅导量级较广</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalServiceCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                      <YAxis style={{ fontSize: '10px' }} />
                      <Tooltip formatter={(value) => [`${value} 次`, '累计履责次数']} />
                      <Bar dataKey="count" name="履责总次数" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table: annual prevention performance stats */}
              <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    成效总览：本期全市安责险防灾减灾成效联合审计表
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-black font-mono">
                    2026年数据全面汇缴
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-2.5 px-6">防灾成效专项指标描述</th>
                        <th className="py-2.5 px-4 text-right">核定统计总量</th>
                        <th className="py-2.5 px-4 text-right">已完成年度预设目标比率</th>
                        <th className="py-2.5 px-6">经办人研判意见及后续建议</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {annualPerformanceStatTable.map((stat, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-6 font-bold text-slate-800">{stat.indicator}</td>
                          <td className="py-3 px-4 text-right font-black font-mono text-gray-800">{stat.val}</td>
                          <td className="py-3 px-4 text-right font-mono text-indigo-600 font-bold">{stat.goalRate}</td>
                          <td className="py-3 px-6 text-gray-500 font-medium">{stat.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94A3B8;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite;
        }
      `}} />
    </div>
  );
}
