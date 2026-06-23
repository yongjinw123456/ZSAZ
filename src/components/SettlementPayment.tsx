import React, { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

export function SettlementPayment() {
  const [list, setList] = useState([
    { id: 'S20260601', target: '太平洋财产保险股份有限公司', amount: 15500.00, time: '2026-06-21 14:30', status: '待支付' },
    { id: 'S20260588', target: '中国平安财产保险股份有限公司', amount: 48000.00, time: '2026-06-20 09:12', status: '已支付' },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentUpload, setPaymentUpload] = useState<string | null>(null);

  const pendingAmount = list.filter(i => i.status === '待支付').reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = list.filter(i => i.status === '已支付').reduce((sum, i) => sum + i.amount, 0);

  const handleBatchConfirm = () => {
    if (selectedIds.length === 0) return;
    if (confirm("确定将所选结算单状态更为支付中吗？")) {
      setList(list.map(item => selectedIds.includes(item.id) ? { ...item, status: '支付中' } : item));
      setSelectedIds([]);
      alert("批量状态已更新为：支付中");
    }
  };

  const handleUploadComplete = () => {
    if (!paymentUpload) return;
    setList(list.map(item => item.id === paymentUpload ? { ...item, status: '已支付' } : item));
    setPaymentUpload(null);
    alert("支付凭证已上传，状态更新为：已支付");
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shadow-sm mx-4 rounded-t-lg shrink-0">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">结算管理</span>
          <span className="mx-2">/</span>
          <span>支付管理</span>
        </div>
      </div>

      <div className="mx-4 mt-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden mb-4">
        
        {/* Actions bar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="text-sm text-gray-600">
             待支付：<span className="font-medium text-red-600">￥{pendingAmount.toFixed(2)}</span>
             <span className="mx-4 text-gray-300">|</span>
             已支付：<span className="font-medium text-green-600">￥{paidAmount.toFixed(2)}</span>
           </div>
           {selectedIds.length > 0 && (
             <button 
               onClick={handleBatchConfirm}
               className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
             >
               <CheckCircle2 className="w-4 h-4" /> 批量确认支付
             </button>
           )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f0f4f8] text-gray-700">
              <tr>
                <th className="px-6 py-3.5 border border-gray-100 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={(e) => setSelectedIds(e.target.checked ? list.filter(i=>i.status==='待支付').map(item => item.id) : [])}
                      checked={selectedIds.length > 0 && selectedIds.length === list.filter(i=>i.status==='待支付').length}
                    />
                </th>
                <th className="px-6 py-3.5 border border-gray-100">结算单编号</th>
                <th className="px-6 py-3.5 border border-gray-100">主体名称</th>
                <th className="px-6 py-3.5 border border-gray-100 text-right">应支付金额</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">对账完成时间</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">状态</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-x border-gray-100 text-center">
                    {item.status === '待支付' && (
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, item.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== item.id));
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 font-mono text-gray-600">{item.id}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right font-medium text-red-600">￥{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-xs text-gray-500">{item.time}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === '待支付' ? 'bg-orange-100 text-orange-700' : item.status === '支付中' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    {item.status === '待支付' && (
                      <button onClick={() => {
                        if (confirm("确定进入支付中状态？")) setList(list.map(i => i.id === item.id ? { ...i, status: '支付中' } : i));
                      }} className="text-blue-600 hover:underline font-medium text-xs">确认支付</button>
                    )}
                    {item.status === '支付中' && (
                      <button onClick={() => setPaymentUpload(item.id)} className="text-green-600 hover:underline font-medium text-xs">上传支付凭证</button>
                    )}
                    {item.status === '已支付' && <span className="text-gray-400 text-xs">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paymentUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded-lg shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">上传支付凭证 ({paymentUpload})</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 cursor-pointer" onClick={handleUploadComplete}>
              <Upload className="w-10 h-10 text-blue-500 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">点击上传转账回单 / 凭证</p>
              <p className="text-xs text-gray-400">支持 PDF, JPG, PNG 格式</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setPaymentUpload(null)} className="px-4 py-2 border rounded text-sm text-gray-600">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
