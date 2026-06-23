import React, { useState, useEffect } from 'react';
import { 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Bar, BarChart, LabelList, ReferenceLine
} from 'recharts';
import { 
  ArrowUp, ArrowDown, AlertCircle, FilterX, Activity, CheckCircle, 
  Clock, ShieldCheck, Users, Target, Zap, AlertTriangle, RefreshCcw, Building2,
  FileText, Briefcase, FileSignature, DollarSign, Wallet
} from 'lucide-react';

// Custom Label for Pie Chart with rich safety boundary checks to avoid NaN or crash
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  if (cx === undefined || cy === undefined || innerRadius === undefined || outerRadius === undefined) {
    return null;
  }
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (isNaN(x) || isNaN(y)) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="#4B5563" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central" 
      fontSize={11} 
      className="font-semibold"
    >
      {name} {((percent || 0) * 100).toFixed(0)}%
    </text>
  );
};

export function DataStatistics() {
  const [period, setPeriod] = useState('本年度');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const resetFilters = () => {
    setActiveFilter(null);
    setSelectedServiceType(null);
    setSelectedIndustry(null);
  };

  // 16 Core Metrics Data
  const metrics = [
    // Row 1: Operational Health
    { id: 'total', name: '服务总次数', value: '4,280', MoM: 12.5, YoY: 18.2, isPosGood: true, unit: '次', icon: <Activity />, color: 'text-blue-600 bg-blue-50' },
    { id: 'completed', name: '已完成次数', value: '3,800', MoM: 15.2, YoY: 16.5, isPosGood: true, unit: '次', icon: <CheckCircle />, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'rate', name: '服务完成率', value: '88.7', MoM: 2.1, YoY: -1.2, isPosGood: true, unit: '%', warnLevel: 2, hoverText: '标准: >90%', icon: <Target />, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'overdue', name: '逾期未完成次数', value: '45', MoM: -5.4, YoY: -12.1, isPosGood: false, unit: '次', warnLevel: 1, hoverText: '超出容忍阈值', icon: <Clock />, color: 'text-orange-600 bg-orange-50' },
    
    // Row 2: Customer Experience
    { id: 'satisfaction', name: '平均满意度', value: '4.8', MoM: 0.1, YoY: 0.2, isPosGood: true, unit: '分', icon: <Users />, color: 'text-purple-600 bg-purple-50' },
    { id: 'complaints', name: '投诉工单总数', value: '12', MoM: 20.0, YoY: -5.0, isPosGood: false, unit: '单', warnLevel: 3, hoverText: '环比波动较大', icon: <AlertCircle />, color: 'text-rose-600 bg-rose-50' },
    { id: 'complaintRate', name: '投诉率', value: '0.3', MoM: 0.1, YoY: -0.1, isPosGood: false, unit: '%', icon: <FileText />, color: 'text-pink-600 bg-pink-50' },
    { id: 'firstResolution', name: '一次解决率', value: '92.5', MoM: 3.5, YoY: 5.2, isPosGood: true, unit: '%', icon: <ShieldCheck />, color: 'text-teal-600 bg-teal-50' },
    
    // Row 3: Accident Prevention Value
    { id: 'companies', name: '覆盖企业总数', value: '850', MoM: 5.0, YoY: 25.0, isPosGood: true, unit: '家', icon: <Building2 />, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'hazards', name: '隐患排查总数', value: '12,420', MoM: 8.3, YoY: 15.4, isPosGood: true, unit: '条', icon: <AlertTriangle />, color: 'text-amber-600 bg-amber-50' },
    { id: 'hazardClosed', name: '隐患整改闭环率', value: '82.5', MoM: -1.5, YoY: -3.0, isPosGood: true, unit: '%', warnLevel: 2, hoverText: '标准: >85%', icon: <FileSignature />, color: 'text-lime-600 bg-lime-50' },
    { id: 'hazardAvg', name: '平均单次排查隐患', value: '2.9', MoM: -0.2, YoY: 0.5, isPosGood: true, unit: '条', icon: <Briefcase />, color: 'text-slate-600 bg-slate-50' },
    
    // Row 4: Commercial
    { id: 'activeCompanies', name: '在保企业数', value: '1,200', MoM: 2.5, YoY: 18.0, isPosGood: true, unit: '家', icon: <Building2 />, color: 'text-blue-700 bg-blue-100' },
    { id: 'serviceValue', name: '保费关联服务金额', value: '450', MoM: 4.2, YoY: 22.0, isPosGood: true, unit: '万', icon: <Wallet />, color: 'text-emerald-700 bg-emerald-100' },
    { id: 'expenses', name: '服务费支出', value: '380', MoM: 5.5, YoY: 19.5, isPosGood: true, unit: '万', icon: <DollarSign />, color: 'text-orange-700 bg-orange-100' },
    { id: 'costPerService', name: '人均服务成本', value: '880', MoM: -2.0, YoY: -5.0, isPosGood: false, unit: '元', icon: <Users />, color: 'text-indigo-700 bg-indigo-100' },
  ];

  // Dynamic Multipliers - set safe lower floors so we never show empty/blank charts!
  const fMult = activeFilter ? 0.8 : 1.0;
  const sMult = selectedServiceType ? 0.75 : 1.0;
  const iMult = selectedIndustry ? 0.7 : 1.0;
  const combo = fMult * sMult * iMult;

  // Chart 1: Trend Data (Stacked Bar + Line)
  const trendData = [
    { month: '1月', completed: Math.max(50, Math.floor(250 * combo)), overdue: Math.max(2, Math.floor(10 * combo)), processing: Math.max(10, Math.floor(50 * combo)), rate: 80.6 },
    { month: '2月', completed: Math.max(40, Math.floor(210 * combo)), overdue: Math.max(3, Math.floor(15 * combo)), processing: Math.max(12, Math.floor(55 * combo)), rate: 75.0 },
    { month: '3月', completed: Math.max(60, Math.floor(320 * combo)), overdue: Math.max(2, Math.floor(12 * combo)), processing: Math.max(8, Math.floor(40 * combo)), rate: 86.0 },
    { month: '4月', completed: Math.max(80, Math.floor(390 * combo)), overdue: Math.max(1, Math.floor(8 * combo)),  processing: Math.max(6, Math.floor(30 * combo)), rate: 91.1 },
    { month: '5月', completed: Math.max(70, Math.floor(340 * combo)), overdue: Math.max(4, Math.floor(20 * combo)), processing: Math.max(9, Math.floor(45 * combo)), rate: 83.9 },
    { month: '6月', completed: Math.max(90, Math.floor(410 * combo)), overdue: Math.max(1, Math.floor(5 * combo)),  processing: Math.max(7, Math.floor(35 * combo)), rate: 91.1 },
    { month: '7月', completed: Math.max(95, Math.floor(430 * combo)), overdue: Math.max(2, Math.floor(10 * combo)), processing: Math.max(5, Math.floor(20 * combo)), rate: 93.4 },
    { month: '8月', completed: Math.max(85, Math.floor(380 * combo)), overdue: Math.max(5, Math.floor(25 * combo)), processing: Math.max(10, Math.floor(50 * combo)), rate: 83.5 },
    { month: '9月', completed: Math.max(100, Math.floor(450 * combo)), overdue: Math.max(1, Math.floor(6 * combo)),  processing: Math.max(5, Math.floor(25 * combo)), rate: 93.5 },
    { month: '10月', completed: Math.max(110, Math.floor(480 * combo)), overdue: Math.max(1, Math.floor(4 * combo)), processing: Math.max(6, Math.floor(30 * combo)), rate: 93.3 },
    { month: '11月', completed: Math.max(105, Math.floor(460 * combo)), overdue: Math.max(2, Math.floor(9 * combo)), processing: Math.max(8, Math.floor(40 * combo)), rate: 90.3 },
    { month: '12月', completed: Math.max(120, Math.floor(500 * combo)), overdue: Math.max(1, Math.floor(5 * combo)), processing: Math.max(4, Math.floor(15 * combo)), rate: 96.1 },
  ];

  // Chart 2: Service Type Donut
  const serviceTypeData = [
    { name: '隐患排查', value: Math.max(15, Math.floor(45 * combo)) },
    { name: '安全培训', value: Math.max(10, Math.floor(25 * combo)) },
    { name: '应急演练', value: Math.max(5, Math.floor(15 * combo)) },
    { name: '风险评估', value: Math.max(3, Math.floor(10 * combo)) },
    { name: '其他服务', value: Math.max(2, Math.floor(5 * combo)) },
  ];
  const ST_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#9CA3AF'];

  // Chart 3: Industry Pie
  const industryData = [
    { name: '化工', value: Math.max(15, Math.floor(130 * combo)) },
    { name: '建筑', value: Math.max(12, Math.floor(95 * combo)) },
    { name: '矿山', value: Math.max(8, Math.floor(75 * combo)) },
    { name: '一般工贸', value: Math.max(10, Math.floor(65 * combo)) },
    { name: '交通运输', value: Math.max(6, Math.floor(45 * combo)) },
  ];
  const IND_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#14B8A6', '#06B6D4'];

  // Chart 4: Quality Bar
  const qualityData = [
    { rating: '5分', value: Math.max(200, Math.floor(3200 * combo)), percent: 84, fill: '#059669' },
    { rating: '4分', value: Math.max(30, Math.floor(450 * combo)), percent: 12, fill: '#34D399' },
    { rating: '3分', value: Math.max(8, Math.floor(100 * combo)), percent: 3, fill: '#FBBF24' },
    { rating: '2分', value: Math.max(2, Math.floor(30 * combo)), percent: 0.8, fill: '#F97316' },
    { rating: '1分', value: Math.max(1, Math.floor(20 * combo)), percent: 0.2, fill: '#EF4444' },
  ];

  // Real-time ticker
  const [tickerOffset, setTickerOffset] = useState(0);
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      if (delta > 16) {
        setTickerOffset(prev => prev > 100 ? -100 : prev + 0.03);
        lastTime = time;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F3F4F6] relative pb-[40px] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 shadow-sm z-20 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center">
              服务核心指标与全景数据
              {isRefreshing && <RefreshCcw className="w-4 h-4 ml-3 text-blue-500 animate-spin" />}
            </h1>
            <p className="text-xs text-gray-500 mt-1">支持全域数据跨维联动与实时下钻分析</p>
          </div>
          {(activeFilter || selectedServiceType || selectedIndustry) && (
            <button 
              onClick={resetFilters}
              className="ml-4 flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm animate-in fade-in zoom-in"
            >
              <FilterX className="w-3.5 h-3.5" />
              清除筛选 {activeFilter && `(${metrics.find(m => m.id === activeFilter)?.name})`}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors active:scale-95" title="刷新数据">
             <RefreshCcw className="w-4 h-4" />
          </button>
          <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
            {['本年度', '本季度', '本月'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  period === p 
                    ? 'bg-white text-blue-600 shadow-sm border-gray-200' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar pb-10">
        
        {/* 16 Metrics - 4x4 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((card) => {
            const isActive = activeFilter === card.id;
            // Determine styles based on warning level
            let borderClass = 'border-gray-100';
            let alertIcon = null;
            if (card.warnLevel === 1) {
              borderClass = 'border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
              alertIcon = <div className="absolute top-2 right-2 flex items-center w-5 h-5 bg-red-100 text-red-600 rounded-full justify-center opacity-80 z-20 cursor-help" title={card.hoverText}><AlertCircle className="w-3 h-3" /></div>;
            } else if (card.warnLevel === 2) {
              borderClass = 'border-amber-300';
              alertIcon = <div className="absolute top-2 right-2 flex items-center w-5 h-5 bg-amber-100 text-amber-600 rounded-full justify-center opacity-80 z-20 cursor-help" title={card.hoverText}><AlertTriangle className="w-3 h-3" /></div>;
            } else if (card.warnLevel === 3) {
              alertIcon = <div className="absolute top-2 right-2 flex items-center w-5 h-5 bg-blue-100 text-blue-500 rounded-full justify-center opacity-80 z-20 cursor-help" title={card.hoverText}><Zap className="w-3 h-3" /></div>;
            }

            if (isActive) borderClass = 'border-blue-500 ring-1 ring-blue-500';

            return (
              <div 
                key={card.id} 
                onClick={() => setActiveFilter(isActive ? null : card.id)}
                className={`group relative bg-white rounded-xl p-4 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-visible ${borderClass}`}
              >
                {alertIcon}

                {/* Hover Tooltip (YoY & MoM) */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-gray-800 text-white text-[11px] p-2 rounded shadow-xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none before:content-[''] before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-2 before:h-2 before:bg-gray-800 before:rotate-45">
                  <div className="flex justify-between gap-6 mb-1">
                    <span className="text-gray-300">环比上月:</span>
                    <span className={`font-bold flex items-center ${card.MoM >= 0 ? (card.isPosGood ? 'text-emerald-400' : 'text-red-400') : (card.isPosGood ? 'text-red-400' : 'text-emerald-400')}`}>
                      {card.MoM >= 0 ? <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDown className="w-2.5 h-2.5 mr-0.5" />}
                      {Math.abs(card.MoM)}%
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-gray-300">同比去年:</span>
                    <span className={`font-bold flex items-center ${card.YoY >= 0 ? (card.isPosGood ? 'text-emerald-400' : 'text-red-400') : (card.isPosGood ? 'text-red-400' : 'text-emerald-400')}`}>
                      {card.YoY >= 0 ? <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDown className="w-2.5 h-2.5 mr-0.5" />}
                      {Math.abs(card.YoY)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    {React.cloneElement(card.icon as React.ReactElement, { className: 'w-4 h-4' })}
                  </div>
                  <div className="text-gray-500 text-xs font-semibold">{card.name}</div>
                </div>
                
                <div className="flex items-baseline gap-1 relative z-10">
                  <div className={`text-2xl font-bold font-sans tracking-tight ${card.warnLevel === 1 ? 'text-red-600' : card.warnLevel === 2 ? 'text-amber-600' : 'text-gray-900'}`}>
                    {card.value}
                  </div>
                  {card.unit && <span className="text-xs text-gray-400 font-medium">{card.unit}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2x2 Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Left: Trend Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[380px]">
            <h3 className="text-base font-bold text-gray-800 flex items-center mb-4 shrink-0">
              <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>
              月度服务完成趋势
            </h3>
            <div className="h-[290px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '13px', paddingTop: '4px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#374151', paddingBottom: '4px', borderBottom: '1px solid #E5E7EB' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                  
                  <Bar yAxisId="left" dataKey="completed" stackId="a" fill="#10B981" name="已完成" barSize={16} />
                  <Bar yAxisId="left" dataKey="processing" stackId="a" fill="#3B82F6" name="处理中" />
                  <Bar yAxisId="left" dataKey="overdue" stackId="a" fill="#EF4444" name="逾期" radius={[4, 4, 0, 0]} />
                  
                  <Line yAxisId="right" type="monotone" dataKey="rate" name="完成率(%)" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} />
                  <ReferenceLine yAxisId="right" y={85} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '行业平均完成率(85%)', fill: '#EF4444', fontSize: 10, position: 'insideBottomRight', offset: 10 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Right: Service Type Donut */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[380px]">
            <h3 className="text-base font-bold text-gray-800 flex items-center mb-4 shrink-0">
              <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
              服务类型分布
            </h3>
            <div className="h-[290px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    onClick={(data) => setSelectedServiceType(data.name === selectedServiceType ? null : data.name)}
                    labelLine={false}
                  >
                    {serviceTypeData.map((entry, index) => {
                      const isDimmed = selectedServiceType && selectedServiceType !== entry.name;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={ST_COLORS[index % ST_COLORS.length]} 
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          strokeWidth={selectedServiceType === entry.name ? 3 : 0}
                          stroke="#fff"
                          opacity={isDimmed ? 0.3 : 1}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, '占比']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[28px]">
                <div className="text-2xl font-bold text-gray-800">4,280</div>
                <div className="text-[11px] text-gray-500 font-medium">总次数</div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Industry Chart (PieChart) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[380px] relative overflow-hidden">
            <h3 className="text-base font-bold text-gray-800 flex items-center mb-4 z-10 shrink-0 relative">
              <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
              核心行业服务占比
            </h3>
            <div className="h-[290px] w-full relative z-0">
              {selectedIndustry ? (
                <div className="absolute inset-0 bg-white/95 backdrop-blur z-20 p-2 animate-in fade-in slide-in-from-bottom-4 flex flex-col z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-orange-100 shrink-0">
                    <div className="text-sm font-bold text-orange-600 flex items-center">
                       <Building2 className="w-4 h-4 mr-1.5" />
                       {selectedIndustry} 重点企业清单
                    </div>
                    <button onClick={() => setSelectedIndustry(null)} className="text-xs text-gray-500 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded">返回图表</button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex justify-between items-center p-3 rounded bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-colors cursor-pointer">
                         <div>
                           <div className="font-semibold text-gray-800 text-xs mb-1">{selectedIndustry}监测企业 {i}厂</div>
                           <div className="text-[10px] text-gray-500 flex gap-3">
                             <span>覆盖率: 100%</span>
                             <span>排查数: {i * 12 + 5}</span>
                             <span className={i > 3 ? 'text-red-500 font-bold' : ''}>逾期: {i > 3 ? 1 : 0}</span>
                           </div>
                         </div>
                         <div className="text-orange-500"><Activity className="w-4 h-4" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      onClick={(data) => setSelectedIndustry(data.name)}
                      label={renderCustomizedLabel}
                      labelLine={{ stroke: '#D1D5DB', strokeWidth: 1 }}
                    >
                      {industryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={IND_COLORS[index % IND_COLORS.length]} 
                          className="cursor-pointer hover:opacity-85 transition-opacity" 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, '服务数']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Bottom Right: Quality Bar */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[380px]">
            <h3 className="text-base font-bold text-gray-800 flex items-center mb-4 shrink-0">
              <div className="w-1 h-4 bg-emerald-500 rounded-full mr-2"></div>
              服务质量分布 (满意度)
            </h3>
            <div className="h-[290px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 13, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    formatter={(value: number, name: string, props: any) => [`${value} 单 (${props.payload.percent}%)`, '数量']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="cursor-pointer hover:brightness-110 transition-all" />
                    ))}
                    <LabelList dataKey="value" position="top" style={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }} offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Warning Marquee (Bottom Fixed) */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-gray-200 flex items-center px-4 overflow-hidden shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-30">
        <div className="flex items-center font-bold z-10 pr-4 shrink-0 bg-white shadow-[10px_0_10px_-5px_rgba(255,255,255,1)]">
           <Zap className="w-4 h-4 mr-2 text-rose-500 animate-pulse" />
           <span className="text-gray-800 text-sm">预警中心</span>
        </div>
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
           <div 
             className="absolute whitespace-nowrap flex gap-16 font-medium text-sm hover:[animation-play-state:paused] cursor-pointer"
             style={{ transform: `translateX(${-tickerOffset}%)` }}
           >
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-700 group-hover:text-red-900 group-hover:underline">【紧急】中山市东凤化工厂重大隐患整改今日超期！</span> <button className="ml-2 text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">一键处理</button></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <span className="text-amber-700 group-hover:text-amber-900 group-hover:underline">【警告】华南地区检测机构本月服务出现3起批量逾期</span> <button className="ml-2 text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">点击督办</button></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <span className="text-blue-700 group-hover:text-blue-900 group-hover:underline">【提示】有 12 名专家资质将于本月到期，请及时更新库信息</span></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-700 group-hover:text-red-900 group-hover:underline">【紧急】交通运输类企业本月投诉率激增，已触发高压线</span> <button className="ml-2 text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">一键处理</button></div>
             
             {/* Duplicated for seamless scrolling */}
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-700 group-hover:text-red-900 group-hover:underline">【紧急】中山市东凤化工厂重大隐患整改今日超期！</span> <button className="ml-2 text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">一键处理</button></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <span className="text-amber-700 group-hover:text-amber-900 group-hover:underline">【警告】华南地区检测机构本月服务出现3起批量逾期</span> <button className="ml-2 text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">点击督办</button></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <span className="text-blue-700 group-hover:text-blue-900 group-hover:underline">【提示】有 12 名专家资质将于本月到期，请及时更新库信息</span></div>
             <div className="flex items-center gap-2 group"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-700 group-hover:text-red-900 group-hover:underline">【紧急】交通运输类企业本月投诉率激增，已触发高压线</span> <button className="ml-2 text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">一键处理</button></div>
           </div>
        </div>
        <div className="bg-white pl-4 border-l border-gray-100 z-10 shadow-[-10px_0_10px_-5px_rgba(255,255,255,1)]">
           <button className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap px-2">全部预警</button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}} />
    </div>
  );
}
