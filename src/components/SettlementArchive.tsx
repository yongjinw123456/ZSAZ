import React, { useState } from 'react';
import { Download, Search, History } from 'lucide-react';

export function SettlementArchive() {
  const [list] = useState([
    { id: 'S20260588', month: '2026-05', target: '中国平安财产保险股份有限公司', amount: 48000.00, time: '2026-06-20 09:12', invoice: 'INV29901428', status: '已归档' },
    { id: 'S20260512', month: '2026-05', target: '江苏国泰安全技术服务有限公司', amount: 12500.00, time: '2026-06-15 14:00', invoice: 'INV29901111', status: '已归档' },
  ]);

  const [timelineView, setTimelineView] = useState<string | null>(null);

  const mockTimeline = [
    { time: '2026-06-01 10:00:00', user: '系统', action: '生成月度结算单' },
    { time: '2026-06-03 14:20:00', user: '张三 (保险公司)', action: '提交对账单，存在金额差异' },
    { time: '2026-06-04 09:15:00', user: '李四 (运营人员)', action: '人工确认差异 (系统计算错误)', remark: '部分退保保单未剔除' },
    { time: '2026-06-04 10:00:00', user: '李四 (运营人员)', action: '对账完成，流转至待支付' },
    { time: '2026-06-20 09:12:00', user: '王五 (财务人员)', action: '确认支付完成并上传凭证' },
    { time: '2026-06-21 11:30:00', user: '系统', action: '自动归档完成' }
  ];

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shadow-sm mx-4 rounded-t-lg shrink-0">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">结算管理</span>
          <span className="mx-2">/</span>
          <span>结算档案归档</span>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input type="text" placeholder="搜索单号/发票号" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none pl-8 w-48" />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          </div>
          <input type="month" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none" />
          <input type="text" placeholder="主体名称" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none w-32" />
          <button className="bg-blue-60 text-blue-600 border border-blue-200 px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors flex items-center gap-1">
             <Download className="w-3.5 h-3.5" /> 批量导出归档
          </button>
        </div>
      </div>

      <div className="mx-4 mt-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden mb-4">
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f0f4f8] text-gray-700">
              <tr>
                <th className="px-6 py-3.5 border border-gray-100 w-12 text-center"><input type="checkbox" /></th>
                <th className="px-6 py-3.5 border border-gray-100">结算单编号</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">结算月份</th>
                <th className="px-6 py-3.5 border border-gray-100">主体名称</th>
                <th className="px-6 py-3.5 border border-gray-100 text-right">支付金额</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">支付时间</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">发票编号</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">归档状态</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-x border-gray-100 text-center"><input type="checkbox" /></td>
                  <td className="px-6 py-4 border-r border-gray-100 font-mono text-gray-600">{item.id}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono">{item.month}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right font-medium text-gray-800">￥{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-xs text-gray-500">{item.time}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-xs text-gray-600">{item.invoice}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <div className="flex items-center gap-3 justify-center text-blue-600 flex-wrap max-w-[200px] mx-auto">
                      <button className="hover:text-blue-800 hover:underline font-medium text-xs">下载PDF</button>
                      <button className="hover:text-blue-800 hover:underline font-medium text-xs">下载凭证</button>
                      <button className="hover:text-blue-800 hover:underline font-medium text-xs">下载发票</button>
                      <button onClick={() => setTimelineView(item.id)} className="hover:text-blue-800 font-medium text-xs flex items-center gap-1"><History className="w-3.5 h-3.5" /> 流程记录</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {timelineView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-[450px] bg-white h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">全流程记录 <span className="text-sm font-mono text-gray-500 font-normal ml-2">{timelineView}</span></h3>
              <button onClick={() => setTimelineView(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 pb-4">
                {mockTimeline.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white shadow-sm"></div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500 font-mono">{step.time}</div>
                      <div className="text-sm font-medium text-gray-800">{step.action}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">操作人: {step.user}</div>
                      {step.remark && (
                        <div className="mt-1 bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs px-2 py-1.5 rounded w-fit">
                          备注: {step.remark}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
