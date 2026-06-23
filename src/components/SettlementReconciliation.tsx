import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

export function SettlementReconciliation() {
  const [list, setList] = useState([
    { id: 'S20260601', target: '太平洋财产保险股份有限公司', amount: 15800.00, submitAmount: 0, diffAmount: 0, status: '待对账', submitTime: '2026-06-20 14:30' },
    { id: 'S20260602', target: '方圆安全监测技术中心', amount: 4500.00, submitAmount: 4500.00, diffAmount: 0, status: '已对账', submitTime: '2026-06-19 09:12' },
  ]);

  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'diff'>('upload');
  const [diffReason, setDiffReason] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleUploadComplete = () => {
    setUploadStep('diff');
  };

  const handleConfirmDiff = () => {
    if (!activeUploadId) return;
    setList(list.map(item => item.id === activeUploadId ? { ...item, status: '待支付', submitAmount: 15500.00, diffAmount: -300 } : item));
    setActiveUploadId(null);
    setUploadStep('upload');
    alert("对账已确认完成，流转至待支付");
  };

  const handleRejectSubmit = () => {
    if (!rejectId) return;
    setList(list.map(item => item.id === rejectId ? { ...item, status: '已驳回' } : item));
    setRejectId(null);
    setRejectReason('');
    alert("对账已驳回");
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shadow-sm mx-4 rounded-t-lg shrink-0">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">结算管理</span>
          <span className="mx-2">/</span>
          <span>对账管理</span>
        </div>
        
        <div className="flex gap-3">
          <input type="month" defaultValue="2026-06" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none" />
          <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none">
            <option value="">全部状态</option>
            <option value="待对账">待对账</option>
            <option value="已对账">已对账</option>
            <option value="已驳回">已驳回</option>
          </select>
        </div>
      </div>

      <div className="mx-4 mt-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden mb-4">
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f0f4f8] text-gray-700">
              <tr>
                <th className="px-6 py-3.5 border border-gray-100">结算单编号</th>
                <th className="px-6 py-3.5 border border-gray-100">主体名称</th>
                <th className="px-6 py-3.5 border border-gray-100 text-right">应支付金额</th>
                <th className="px-6 py-3.5 border border-gray-100 text-right">对方提交金额</th>
                <th className="px-6 py-3.5 border border-gray-100 text-right">差异金额</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">状态</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">提交时间</th>
                <th className="px-6 py-3.5 border border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-x border-gray-100 font-mono text-gray-600">{item.id}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-medium text-gray-800">{item.target}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right font-medium text-gray-800">￥{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right text-gray-600">{item.submitAmount ? `￥${item.submitAmount.toFixed(2)}` : '-'}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right">
                    <span className={item.diffAmount < 0 ? 'text-red-500' : item.diffAmount > 0 ? 'text-green-500' : 'text-gray-400'}>
                      {item.diffAmount !== 0 ? `￥${item.diffAmount.toFixed(2)}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === '待对账' ? 'bg-orange-100 text-orange-700' : item.status === '已驳回' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-xs text-gray-500">{item.submitTime}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    {item.status === '待对账' && (
                      <div className="flex items-center gap-3 justify-center text-blue-600">
                        <button onClick={() => { setActiveUploadId(item.id); setUploadStep('upload'); }} className="hover:text-blue-800 hover:underline font-medium text-xs">
                           上传对账单
                        </button>
                        <button onClick={() => { setRejectId(item.id); }} className="hover:text-red-600 hover:underline font-medium text-xs text-gray-500">
                           驳回
                        </button>
                      </div>
                    )}
                    {item.status !== '待对账' && <span className="text-gray-400 text-xs">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeUploadId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[600px] rounded-lg shadow-xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800">对账处理 ({activeUploadId})</h3>
              <button onClick={() => setActiveUploadId(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {uploadStep === 'upload' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer" onClick={handleUploadComplete}>
                  <Upload className="w-10 h-10 text-blue-500 mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">点击或拖拽上传 Excel 格式对账单</p>
                  <p className="text-xs text-gray-400">支持 .xlsx, .xls</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-red-50 border border-red-100 rounded p-4 text-sm">
                    <h4 className="font-semibold text-red-700 mb-2">发现差异明细</h4>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-red-900 border-b border-red-200">
                          <th className="py-2">工单编号</th>
                          <th>系统金额</th>
                          <th>对方金额</th>
                          <th className="text-right">差异</th>
                        </tr>
                      </thead>
                      <tbody className="text-red-800 font-mono">
                        <tr>
                          <td className="py-2">WK-2026-89A1</td>
                          <td>￥3,000.00</td>
                          <td>￥2,700.00</td>
                          <td className="text-right">￥-300.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">差异原因标记</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 mb-3">
                      <option>系统计算错误</option>
                      <option>对方数据错误</option>
                      <option>特殊调整</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="填写调整说明备注..." 
                      value={diffReason}
                      onChange={(e) => setDiffReason(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setActiveUploadId(null)}
                className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                取消
              </button>
              {uploadStep === 'diff' && (
                <button 
                  onClick={handleConfirmDiff}
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> 对账完成
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[400px] rounded-lg shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">驳回对账</h3>
            <textarea 
              className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:ring-1 h-24 mb-4"
              placeholder="请输入驳回意见并退回主体端重新提交..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectId(null)} className="px-4 py-2 border rounded text-sm text-gray-600">取消</button>
              <button onClick={handleRejectSubmit} className="px-4 py-2 bg-red-600 rounded text-white text-sm">确定驳回</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
