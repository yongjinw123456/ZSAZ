import React, { useState } from 'react';
import { FileText, Download, Upload } from 'lucide-react';

export function SettlementOrderGenerate() {
  const [activeTab, setActiveTab] = useState<'pending' | 'generated'>('pending');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock data
  const pendingList = [
    { id: '1', target: '中国平安财产保险股份有限公司扬州中心支公司', month: '2026-06', amount: '￥32,500.00', status: '待生成' },
    { id: '2', target: '江苏国泰安全技术服务有限公司', month: '2026-06', amount: '￥8,200.00', status: '待生成' },
  ];

  const generatedList = [
    { id: 'S20260601', month: '2026-06', target: '太平洋财产保险股份有限公司', amount: '￥15,800.00', time: '2026-06-20 14:30', status: '待对账' },
    { id: 'S20260602', month: '2026-06', target: '方圆安全监测技术中心', amount: '￥4,500.00', time: '2026-06-19 09:12', status: '已完成' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('结算单生成成功！已移至已生成列表。');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shadow-sm mx-4 rounded-t-lg shrink-0">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">结算管理</span>
          <span className="mx-2">/</span>
          <span>结算单生成</span>
        </div>
        
        <div className="flex gap-3">
          <input type="month" defaultValue="2026-06" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none" />
          <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none">
            <option value="">全部主体类型</option>
            <option value="保险公司">保险公司</option>
            <option value="服务机构">服务机构</option>
          </select>
        </div>
      </div>

      <div className="mx-4 mt-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden mb-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 text-sm font-medium transition-all relative ${activeTab === 'pending' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'} `}
          >
            待生成结算单
            {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
          </button>
          <button 
            onClick={() => setActiveTab('generated')}
            className={`px-4 py-3 text-sm font-medium transition-all relative ${activeTab === 'generated' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'} `}
          >
            已生成结算单
            {activeTab === 'generated' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === 'pending' ? (
             <div className="p-4 flex flex-col gap-4">
                {selectedIds.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded flex items-center justify-between">
                    <span className="text-sm text-blue-700">已选择 {selectedIds.length} 条待结算记录</span>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm"
                    >
                      {isGenerating ? '批量生成中...' : '批量生成结算单'}
                    </button>
                  </div>
                )}
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f0f4f8] text-gray-700">
                    <tr>
                      <th className="px-6 py-3.5 border border-gray-100 w-12 text-center">
                         <input 
                           type="checkbox" 
                           onChange={(e) => setSelectedIds(e.target.checked ? pendingList.map(item => item.id) : [])}
                           checked={selectedIds.length === pendingList.length && pendingList.length > 0}
                         />
                      </th>
                      <th className="px-6 py-3.5 border border-gray-100">主体名称</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">分摊月份</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-right">应结算金额</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">状态</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-x border-gray-100 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id)}
                            onChange={(e) => {
                               if (e.target.checked) {
                                 setSelectedIds([...selectedIds, item.id]);
                               } else {
                                 setSelectedIds(selectedIds.filter(id => id !== item.id));
                               }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center font-mono">{item.month}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-right font-medium text-red-600">{item.amount}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center text-gray-400">{item.status}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center">
                          <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="text-blue-600 hover:underline hover:text-blue-800 disabled:text-gray-400 disabled:no-underline font-medium"
                          >
                            {isGenerating ? '生成中...' : '生成结算单'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          ) : (
             <div className="p-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f0f4f8] text-gray-700">
                    <tr>
                      <th className="px-6 py-3.5 border border-gray-100">结算单编号</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">结算月份</th>
                      <th className="px-6 py-3.5 border border-gray-100">主体名称</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-right">应支付金额</th>
                      <th className="px-6 py-3.5 border border-gray-100">生成时间</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">状态</th>
                      <th className="px-6 py-3.5 border border-gray-100 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-x border-gray-100 font-mono text-gray-600">{item.id}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center font-mono">{item.month}</td>
                        <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-right font-medium text-red-600">{item.amount}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-gray-500 font-mono text-xs">{item.time}</td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-100 text-center">
                          <div className="flex items-center gap-3 justify-center text-blue-600">
                            <button className="hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                               <FileText className="w-3.5 h-3.5" /> 预览
                            </button>
                            <button onClick={() => alert("发送成功！")} className="hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                               <Upload className="w-3.5 h-3.5" /> 推送至主体端
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
