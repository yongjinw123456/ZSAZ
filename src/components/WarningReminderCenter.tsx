import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ArrowUp, ArrowDown, AlertCircle, AlertTriangle, Info, CheckCircle2, FileText, Upload, X, Bell } from 'lucide-react';

export function WarningReminderCenter() {
  const [activeTab, setActiveTab] = useState('hazard');
  const [activeDetail, setActiveDetail] = useState<any>(null);
  const [processRemark, setProcessRemark] = useState("");

  // Hardcode static data for dashboard metrics
  const cards = [
    { name: '预警总数量', value: '4,520', YoY: '+5%', isUp: true },
    { name: '未处理预警数', value: '25', YoY: '-12%', isUp: false, highlight: true },
    { name: '今日新增预警', value: '8', YoY: '+2', isUp: true },
    { name: '已闭环预警数', value: '4,495', YoY: '+8%', isUp: true },
    { name: '平均处理时长', value: '1.5天', YoY: '-0.2天', isUp: false },
    { name: '预警闭环率', value: '99.4%', YoY: '+0.5%', isUp: true },
  ];

  // Data for charts
  const trendData = [
    { month: '1月', 新增预警: 400, 闭环预警: 390 },
    { month: '2月', 新增预警: 350, 闭环预警: 345 },
    { month: '3月', 新增预警: 480, 闭环预警: 470 },
    { month: '4月', 新增预警: 420, 闭环预警: 410 },
    { month: '5月', 新增预警: 510, 闭环预警: 490 },
    { month: '6月', 新增预警: 380, 闭环预警: 375 },
  ];

  const pieData = [
    { name: '隐患整改', value: 45 },
    { name: '保险续约', value: 25 },
    { name: '服务逾期', value: 15 },
    { name: '结算逾期', value: 10 },
    { name: '资质到期', value: 5 },
  ];
  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'];

  const timeData = [
    { name: '隐患整改', 时长: 1.2 },
    { name: '保险续约', 时长: 0.5 },
    { name: '服务逾期', 时长: 2.1 }, // Example over standard
    { name: '结算逾期', 时长: 3.5 },
    { name: '资质到期', 时长: 2.0 },
  ];

  const industryData = [
    { name: '化工制造', 数量: 12 },
    { name: '建筑施工', 数量: 8 },
    { name: '机械加工', 数量: 5 },
    { name: '交通运输', 数量: 3 },
    { name: '纺织服装', 数量: 2 },
  ];

  const tabs = [
    { id: 'insurance', name: '保险续约预警' },
    { id: 'hazard', name: '隐患整改预警' },
    { id: 'service', name: '服务逾期预警' },
    { id: 'settlement', name: '结算逾期预警' },
    { id: 'expert', name: '专家资质到期预警' },
  ];

  const allWarnings = [
    {
      id: "WRN-20260622-001",
      tab: "hazard",
      type: "urgent",
      target: "扬州某某化工有限公司",
      content: "重大隐患（储罐区气体泄漏监测失效）即将于 3天 后逾期未整改",
      level: "重大隐患",
      time: "2026-06-21 14:30:00",
      status: "待处理",
      duration: "剩 3 天"
    },
    {
      id: "WRN-20260622-002",
      tab: "hazard",
      type: "important",
      target: "江苏某某制造厂",
      content: "一般隐患（消防通道堵塞）累计逾期 5天 未完成整改",
      level: "一般隐患",
      time: "2026-06-20 09:15:00",
      status: "处理中",
      duration: "逾期 5 天"
    },
    {
      id: "WRN-20260622-003",
      tab: "hazard",
      type: "general",
      target: "扬州某某建筑集团",
      content: "建筑施工升降机维护记录不合规",
      level: "一般隐患",
      time: "2026-06-18 11:20:00",
      status: "已闭环",
      duration: "已完成"
    },
    {
      id: "INS-20260622-001",
      tab: "insurance",
      type: "urgent",
      target: "扬州某某金属加工厂",
      content: "安责险保单（单号: P23984210）将在 7 天后到期",
      level: "保险续约",
      time: "2026-06-21 09:00:00",
      status: "待处理",
      duration: "剩 7 天"
    },
    {
      id: "SRV-20260622-001",
      tab: "service",
      type: "important",
      target: "扬州某某化工有限公司",
      content: "6月份月度巡查服务任务逾期未执行",
      level: "服务逾期",
      time: "2026-06-20 18:00:00",
      status: "待处理",
      duration: "逾期 2 天"
    },
    {
      id: "SET-20260622-001",
      tab: "settlement",
      type: "important",
      target: "江苏国泰安全技术服务",
      content: "2026年5月份服务费结算单对账逾期",
      level: "结算逾期",
      time: "2026-06-15 10:00:00",
      status: "处理中",
      duration: "逾期 7 天"
    },
    {
      id: "EXP-20260622-001",
      tab: "expert",
      type: "general",
      target: "李建国 (安全专家)",
      content: "注册安全工程师职业资格证书即将在 30 天后到期",
      level: "资质到期",
      time: "2026-06-10 14:00:00",
      status: "待处理",
      duration: "剩 30 天"
    }
  ];

  const [allWarningsState, setAllWarningsState] = useState(allWarnings);
  const listData = allWarningsState.filter(w => w.tab === activeTab);

  const pendingCount = allWarningsState.filter(w => w.status === '待处理').length;
  // Dynamic pending counts by tab
  const tabPendingCounts: Record<string, number> = {};
  tabs.forEach(t => {
    tabPendingCounts[t.id] = allWarningsState.filter(w => w.tab === t.id && w.status === '待处理').length;
  });

  const handleProcessSubmit = () => {
    if (!activeDetail) return;
    setAllWarningsState(prev => prev.map(w => 
      w.id === activeDetail.id ? { ...w, status: '处理中' } : w
    ));
    setActiveDetail({...activeDetail, status: '处理中'});
    alert("处理意见已提交 (状态更为: 处理中)");
  };

  const handleCloseLoop = () => {
    if (!activeDetail) return;
    if (confirm("确定将该预警标记为已闭环吗？")) {
      setAllWarningsState(prev => prev.map(w => 
        w.id === activeDetail.id ? { ...w, status: '已闭环' } : w
      ));
      setActiveDetail(null);
      alert("预警已闭环");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'important': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待处理': return <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded text-xs">待处理</span>;
      case '处理中': return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded text-xs">处理中</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded text-xs">已闭环</span>;
    }
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50 overflow-y-auto">
      
      {/* Top dashboard section */}
      <div className="px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            预警数据统计看板
          </div>
          <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
             <AlertCircle className="w-3.5 h-3.5" /> {pendingCount} 个未处理预警
          </div>
        </div>

        {/* Top 6 KPI cards */}
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-lg p-4 shadow-sm border relative group transition-all cursor-default ${i === 1 ? 'border-red-200 bg-red-50/10' : 'border-gray-100'}`}
            >
              <div className="text-gray-500 text-xs mb-1 font-medium">{card.name}</div>
              <div className={`text-2xl font-bold ${i === 1 ? 'text-red-500' : 'text-gray-800'}`}>{i === 1 ? pendingCount : card.value}</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-hover:-translate-y-[120%] transition-all pointer-events-none whitespace-nowrap z-10 flex items-center gap-1">
                同比上月 
                <span className={`flex items-center ${card.isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {card.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {card.YoY}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Charts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[260px]">
          {/* Pie: Type Distribution */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center justify-center">
             <h3 className="text-xs font-semibold text-gray-700 w-full mb-2">预警类型分布</h3>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                   {pieData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={{fontSize: '12px'}} />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2 px-2">
                {pieData.slice(0,3).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1 text-[10px] text-gray-500">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div> {d.name}
                  </div>
                ))}
             </div>
          </div>

          {/* Line: Monthly Trend */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col lg:col-span-1">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">月度预警趋势</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{fontSize: '12px'}} />
                <Line type="monotone" dataKey="新增预警" stroke="#EF4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="闭环预警" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar: Standard duration */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">处理时效(天)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{fontSize: '12px'}} />
                <Bar dataKey="时长">
                  {timeData.map((e, index) => (
                    <Cell key={`c-${index}`} fill={e.时长 > 2 ? '#EF4444' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar: Output Industry */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">未处理预警 TOP行业</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{fontSize: '12px'}} />
                <Bar dataKey="数量" fill="#F59E0B" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom List with Tabs */}
      <div className="mx-4 mt-6 flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden min-h-[400px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50/50 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all relative flex items-center gap-2 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {tab.name}
              {tabPendingCounts[tab.id] > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {tabPendingCounts[tab.id]}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* List Content Mock */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#f2f8fc] text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 font-medium border-x border-gray-100">预警编号/级别</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">预警对象</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 w-1/3">预警内容</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">触发/剩余时间</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">状态</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.map(item => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${item.status === '已闭环' ? 'opacity-70' : ''}`}>
                  <td className="px-6 py-4 border-x border-gray-100">
                    <div className="flex items-center gap-2">
                      {getIcon(item.type)}
                      <span className="text-gray-600 font-mono text-xs">{item.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                  <td className="px-6 py-4 border-r border-gray-100">
                    <span className="text-gray-600">{item.content}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 font-mono text-xs text-gray-500">
                    <div>{item.time}</div>
                    <div className={`mt-1 font-medium ${item.duration === '已完成' ? 'text-green-500' : 'text-red-500'}`}>{item.duration}</div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-blue-600 text-xs">
                       <button onClick={() => {
                          setActiveDetail(item);
                          setProcessRemark("");
                       }} className="hover:text-blue-800 font-medium px-2 py-1 bg-white border border-blue-200 rounded">处理</button>
                       {item.status !== '已闭环' && <button onClick={() => alert("系统短信提醒和弹窗已发送")} className="hover:text-blue-800 font-medium px-2 py-1 bg-blue-50 border border-transparent rounded">一键提醒</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Slider Detailed Drawer */}
      {activeDetail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end transition-opacity">
          <div className="w-[600px] h-full bg-white shadow-2xl flex flex-col transform transition-transform">
             <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50 shrink-0">
               <div className="flex items-center gap-3">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   预警处理详情 <span className="font-mono text-gray-400 text-sm font-normal ml-2">#{activeDetail.id}</span>
                 </h3>
               </div>
               <div className="flex items-center gap-4">
                 {getStatusBadge(activeDetail.status)}
                 <button onClick={() => setActiveDetail(null)} className="text-gray-400 hover:text-gray-600">
                   <X className="w-5 h-5" />
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Info Card */}
              <div className={`bg-white p-5 rounded-lg border shadow-sm relative overflow-hidden ${activeDetail.type === 'urgent' ? 'border-red-100' : activeDetail.type === 'important' ? 'border-yellow-100' : 'border-blue-100'}`}>
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${activeDetail.type === 'urgent' ? 'bg-red-500' : activeDetail.type === 'important' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  预警基本信息
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><span className="text-gray-500 inline-block w-20">情况类别:</span> <span className={`font-medium px-2 py-0.5 rounded ${activeDetail.type === 'urgent' ? 'text-red-600 bg-red-50' : activeDetail.type === 'important' ? 'text-yellow-600 bg-yellow-50' : 'text-blue-600 bg-blue-50'}`}>{activeDetail.level}</span></div>
                  <div><span className="text-gray-500 inline-block w-20">触发时间:</span> {activeDetail.time}</div>
                  <div><span className="text-gray-500 inline-block w-20">预警对象:</span> <span className="font-medium">{activeDetail.target}</span></div>
                  <div><span className="text-gray-500 inline-block w-20">时效:</span> <span className="font-bold text-red-500">{activeDetail.duration}</span></div>
                  <div className="col-span-2"><span className="text-gray-500 inline-block w-20">预警内容:</span> <span className="font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded inline-block w-[calc(100%-6rem)] align-top">{activeDetail.content}</span></div>
                </div>
              </div>

              {/* Related Data Card (Mock) */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">关联业务数据</h4>
                <div className="border border-gray-100 rounded p-4 bg-gray-50/50 flex flex-col gap-3 text-sm">
                  <div className="text-gray-500 text-center py-4">系统已自动关联相关业务数据（如工单、保单或结算数据），可点击查阅。</div>
                  <div className="flex justify-center">
                    <button className="flex items-center gap-1 text-blue-600 hover:underline"><FileText className="w-4 h-4"/> 查看业务详情档案</button>
                  </div>
                </div>
              </div>

              {/* Processing Area */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                <h4 className="font-semibold text-gray-800 mb-1">处理记录</h4>
                
                {activeDetail.status !== '待处理' && (
                  <div className="flex gap-4 p-4 rounded bg-gray-50 border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    <div>
                       <div className="font-medium text-sm text-gray-800 mb-1">系统已发送催办通知，已联系负责人催促应对处理。</div>
                       <div className="text-xs text-gray-400 flex items-center gap-2">
                         <span>处理人: 王强 (运营)</span>
                         <span>今天 10:15:00</span>
                       </div>
                    </div>
                  </div>
                )}

                {activeDetail.status !== '已闭环' && (
                  <>
                    <textarea 
                      className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 transition-all h-24"
                      placeholder="请输入具体的处理意见或跟进情况..."
                      value={processRemark}
                      onChange={e => setProcessRemark(e.target.value)}
                    ></textarea>
                    
                    <div>
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        <Upload className="w-4 h-4" /> 上传处理凭证 (图片/文件)
                      </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-100 pt-4">
                      <button 
                        onClick={handleProcessSubmit}
                        className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium text-sm transition-colors"
                      >
                        提交处理意见
                      </button>
                      <button 
                        onClick={handleCloseLoop}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        闭环预警
                      </button>
                    </div>
                  </>
                )}
                 {activeDetail.status === '已闭环' && (
                  <div className="text-center py-6 text-gray-500 flex flex-col items-center gap-2 bg-gray-50 rounded border border-gray-100">
                     <CheckCircle2 className="w-8 h-8 text-green-500" />
                     该预警已闭环，处理完毕。
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
