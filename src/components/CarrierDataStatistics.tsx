import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Activity, 
  HeartHandshake, 
  ShieldAlert, 
  BadgeDollarSign,
  ChevronRight
} from 'lucide-react';

// --- Mock Data ---

const METRICS_DATA = [
  {
    category: '运营健康度',
    icon: <Activity className="w-4 h-4 text-blue-500" />,
    items: [
      { name: '服务总次数', value: '12,450', unit: '次', mom: '+5.2%', yoy: '+12.4%', isAbnormal: false },
      { name: '已完成次数', value: '11,820', unit: '次', mom: '+4.8%', yoy: '+11.2%', isAbnormal: false },
      { name: '服务完成率', value: '94.9', unit: '%', mom: '-0.3%', yoy: '+1.1%', isAbnormal: false },
      { name: '逾期未完成次数', value: '142', unit: '次', mom: '+15.4%', yoy: '+8.7%', isAbnormal: true },
    ]
  },
  {
    category: '客户体验',
    icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
    items: [
      { name: '平均满意度', value: '4.8', unit: '分', mom: '+0.1', yoy: '+0.3', isAbnormal: false },
      { name: '投诉工单总数', value: '24', unit: '单', mom: '-12.0%', yoy: '-25.0%', isAbnormal: false },
      { name: '投诉率', value: '0.19', unit: '%', mom: '-0.02%', yoy: '-0.05%', isAbnormal: false },
      { name: '一次解决率', value: '91.5', unit: '%', mom: '+1.2%', yoy: '+3.4%', isAbnormal: false },
    ]
  },
  {
    category: '事故预防价值',
    icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
    items: [
      { name: '覆盖企业总数', value: '3,850', unit: '家', mom: '+2.1%', yoy: '+15.8%', isAbnormal: false },
      { name: '隐患排查总数', value: '45,210', unit: '个', mom: '+8.5%', yoy: '+22.4%', isAbnormal: false },
      { name: '隐患整改闭环率', value: '88.4', unit: '%', mom: '-2.1%', yoy: '+5.6%', isAbnormal: true },
      { name: '平均单次排查隐患数', value: '3.6', unit: '个', mom: '+0.2', yoy: '+0.8', isAbnormal: false },
    ]
  },
  {
    category: '商业可持续',
    icon: <BadgeDollarSign className="w-4 h-4 text-purple-500" />,
    items: [
      { name: '在保企业数', value: '4,120', unit: '家', mom: '+1.5%', yoy: '+10.2%', isAbnormal: false },
      { name: '保费关联服务金额', value: '1.25', unit: '亿', mom: '+4.2%', yoy: '+18.5%', isAbnormal: false },
      { name: '事故预防服务费支出', value: '1,850', unit: '万', mom: '+6.5%', yoy: '+25.4%', isAbnormal: false },
      { name: '人均服务成本', value: '450', unit: '元', mom: '-1.5%', yoy: '-5.2%', isAbnormal: false },
    ]
  }
];

const TREND_DATA = [
  { month: '25年7月', total: 850, completed: 800, overdue: 12, rate: 94.1 },
  { month: '25年8月', total: 920, completed: 880, overdue: 8, rate: 95.6 },
  { month: '25年9月', total: 980, completed: 920, overdue: 15, rate: 93.8 },
  { month: '25年10月', total: 1050, completed: 1010, overdue: 10, rate: 96.1 },
  { month: '25年11月', total: 1100, completed: 1050, overdue: 18, rate: 95.4 },
  { month: '25年12月', total: 1250, completed: 1180, overdue: 25, rate: 94.4 },
  { month: '26年1月', total: 1150, completed: 1100, overdue: 14, rate: 95.6 },
  { month: '26年2月', total: 880, completed: 850, overdue: 5, rate: 96.5 },
  { month: '26年3月', total: 1350, completed: 1280, overdue: 30, rate: 94.8 },
  { month: '26年4月', total: 1420, completed: 1350, overdue: 22, rate: 95.0 },
  { month: '26年5月', total: 1500, completed: 1420, overdue: 35, rate: 94.6 },
  { month: '26年6月', total: 1245, completed: 1182, overdue: 28, rate: 94.9 },
];

const AGENCY_COMPLETION_DATA = [
  { name: '华北安全技术', total: 1250, completed: 1180, rate: 94.4 },
  { name: '安联职业学院', total: 980, completed: 950, rate: 96.9 },
  { name: '蓝天防汛突击队', total: 850, completed: 820, rate: 96.4 },
  { name: '扬州地质勘测', total: 650, completed: 610, rate: 93.8 },
  { name: '正信科技评价所', total: 520, completed: 490, rate: 94.2 },
];

const INDUSTRY_DATA = [
  { name: '化工行业', value: 35 },
  { name: '建筑施工', value: 25 },
  { name: '工贸企业', value: 15 },
  { name: '交通运输', value: 10 },
  { name: '非煤矿山', value: 10 },
  { name: '其他行业', value: 5 },
];

const AGENCY_SATISFACTION_TREND_DATA = [
  { month: '25年12月', '华北安全技术': 4.7, '安联职业学院': 4.8, '蓝天防汛突击队': 4.6 },
  { month: '26年1月', '华北安全技术': 4.8, '安联职业学院': 4.8, '蓝天防汛突击队': 4.7 },
  { month: '26年2月', '华北安全技术': 4.7, '安联职业学院': 4.9, '蓝天防汛突击队': 4.7 },
  { month: '26年3月', '华北安全技术': 4.8, '安联职业学院': 4.8, '蓝天防汛突击队': 4.8 },
  { month: '26年4月', '华北安全技术': 4.9, '安联职业学院': 4.9, '蓝天防汛突击队': 4.8 },
  { month: '26年5月', '华北安全技术': 4.8, '安联职业学院': 4.9, '蓝天防汛突击队': 4.9 },
  { month: '26年6月', '华北安全技术': 4.9, '安联职业学院': 4.9, '蓝天防汛突击队': 4.8 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];
const PIE_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#8B5CF6'];

export function CarrierDataStatistics() {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const MetricCard: React.FC<{ item: any }> = ({ item }) => {
    const isHovered = hoveredMetric === item.name;
    const valueColor = item.isAbnormal ? 'text-rose-600' : 'text-slate-800';
    const bgClass = item.isAbnormal ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200';

    return (
      <div 
        className={`relative p-4 rounded-xl border ${bgClass} shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group overflow-hidden`}
        onMouseEnter={() => setHoveredMetric(item.name)}
        onMouseLeave={() => setHoveredMetric(null)}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-slate-500">{item.name}</span>
          {item.isAbnormal && (
            <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
          )}
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold font-mono tracking-tight ${valueColor}`}>
            {item.value}
          </span>
          <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
        </div>

        {/* Hover overlay with MoM and YoY */}
        <div className={`absolute inset-0 bg-slate-900/95 p-4 flex flex-col justify-center items-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">环比 (MoM)</span>
              <span className={`text-sm font-mono font-bold flex items-center ${item.mom.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.mom.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {item.mom}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">同比 (YoY)</span>
              <span className={`text-sm font-mono font-bold flex items-center ${item.yoy.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.yoy.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {item.yoy}
              </span>
            </div>
          </div>
          <div className="mt-auto pt-2 w-full text-center">
            <span className="text-[10px] text-blue-400 flex items-center justify-center gap-1 group-hover:underline">
              查看明细 <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar p-5 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            保司数据统计概览
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
              实时监控
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">集中呈现安责险事故预防服务的整体运行态势，支撑各角色快速掌握服务规模与成效。</p>
        </div>
      </div>

      {/* Metrics Grid (16 metrics in 4x4) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 shrink-0">
        {METRICS_DATA.map((category, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
              {category.icon}
              {category.category}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {category.items.map((item, i) => (
                <MetricCard key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Charts (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        
        {/* Chart 1: 月度服务完成趋势双轴图 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">月度服务完成趋势</h3>
              <p className="text-[10px] text-slate-500">近 12 个月服务总量、完成量及逾期量趋势</p>
            </div>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 outline-none">
              <option>近12个月</option>
              <option>本年度</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={10} stroke="#94a3b8" tickMargin={8} />
                <YAxis yAxisId="left" fontSize={10} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" fontSize={10} stroke="#94a3b8" domain={[90, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" name="服务总量" dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar yAxisId="left" name="已完成量" dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar yAxisId="left" name="逾期量" dataKey="overdue" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
                <Line yAxisId="right" name="完成率(%)" type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 各机构服务完成情况 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">各机构服务完成情况</h3>
              <p className="text-[10px] text-slate-500">主要服务机构的排查完成量及总任务量</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENCY_COMPLETION_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" fontSize={10} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" fontSize={10} stroke="#64748b" width={85} tickMargin={8} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar name="完成量" dataKey="completed" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar name="总任务量" dataKey="total" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: 行业服务占比饼图 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">行业服务占比</h3>
              <p className="text-[10px] text-slate-500">各高危行业服务分布 (支持下钻明细)</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INDUSTRY_DATA}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="value"
                  >
                    {INDUSTRY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="cursor-pointer hover:opacity-80 outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-2 pl-4">
              {INDUSTRY_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono font-medium text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: 服务机构满意度趋势图 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">各服务机构满意度趋势</h3>
              <p className="text-[10px] text-slate-500">不同服务机构在每个月的平均服务满意度评分走势</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={AGENCY_SATISFACTION_TREND_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={10} stroke="#94a3b8" tickMargin={8} />
                <YAxis domain={[4.0, 5.0]} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line name="华北安全技术" type="monotone" dataKey="华北安全技术" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line name="安联职业学院" type="monotone" dataKey="安联职业学院" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line name="蓝天防汛突击队" type="monotone" dataKey="蓝天防汛突击队" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
