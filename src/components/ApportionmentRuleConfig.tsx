import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  cycle: string;
  targetType: string;
  baseRatio: number;
  useFloating: boolean;
  validStart: string;
  validEnd: string;
  status: '生效' | '已失效';
}

const MOCK_RULES: Rule[] = [
  { id: 'R20260601', name: '2026年度默认分摊规则', cycle: '按月', targetType: '保险公司', baseRatio: 60, useFloating: true, validStart: '2026-01-01', validEnd: '2026-12-31', status: '生效' },
  { id: 'R20260602', name: '2025年度分摊规则', cycle: '按月', targetType: '服务机构', baseRatio: 40, useFloating: false, validStart: '2025-01-01', validEnd: '2025-12-31', status: '已失效' },
];

export function ApportionmentRuleConfig() {
  const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [activeRule, setActiveRule] = useState<Partial<Rule>>({});
  const [floatingConfig, setFloatingConfig] = useState([{ min: 4.5, max: 5.0, adjust: 5 }]);
  const [ratioError, setRatioError] = useState(false);

  const handleAddRow = () => setFloatingConfig([...floatingConfig, { min: 0, max: 0, adjust: 0 }]);
  const handleRemoveRow = (idx: number) => setFloatingConfig(floatingConfig.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (activeRule.baseRatio !== undefined && (activeRule.baseRatio < 0 || activeRule.baseRatio > 100)) {
       setRatioError(true);
       return;
    }
    
    if (drawerMode === 'create') {
      setRules([{ 
        id: `R${new Date().getTime().toString().slice(-8)}`, 
        name: activeRule.name || '未命名规则',
        cycle: '按月', 
        targetType: activeRule.targetType || '保险公司',
        baseRatio: activeRule.baseRatio || 0,
        useFloating: !!activeRule.useFloating,
        validStart: activeRule.validStart || '',
        validEnd: activeRule.validEnd || '',
        status: '生效'
      }, ...rules]);
    } else if (drawerMode === 'edit') {
      setRules(rules.map(r => r.id === activeRule.id ? { ...r, ...activeRule } as Rule : r));
    }
    
    setDrawerMode(null);
    alert("规则保存成功！");
  };

  const handleInvalidate = (id: string) => {
    if (window.confirm("确定作废该分摊规则吗？作废后将不再适用于后续结算")) {
       setRules(rules.map(r => r.id === id ? { ...r, status: '已失效' } : r));
    }
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-gray-50">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shadow-sm mx-4 rounded-t-lg shrink-0">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">集中服务费分摊管理</span>
          <span className="mx-2">/</span>
          <span>分摊规则配置</span>
        </div>
        <button 
          onClick={() => {
            setActiveRule({ targetType: '保险公司', baseRatio: 0, useFloating: false });
            setFloatingConfig([{ min: 4.5, max: 5.0, adjust: 5 }]);
            setRatioError(false);
            setDrawerMode('create');
          }}
          className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          新增分摊规则
        </button>
      </div>

      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f8fc] border-b border-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 font-medium border-x border-gray-100">规则编号</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">规则名称</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">适用周期</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">分摊主体类型</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-right">基础计提比例</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">浮动系数开关</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">生效时间</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">失效时间</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">状态</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${rule.status === '已失效' ? 'text-gray-400' : 'text-gray-700'}`}>
                  <td className="px-6 py-4 border-x border-gray-100 font-mono">{rule.id}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-medium">{rule.name}</td>
                  <td className="px-6 py-4 border-r border-gray-100">{rule.cycle}</td>
                  <td className="px-6 py-4 border-r border-gray-100">{rule.targetType}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-right">{rule.baseRatio}%</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">{rule.useFloating ? '开启' : '关闭'}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-mono text-xs">{rule.validStart}</td>
                  <td className="px-6 py-4 border-r border-gray-100 font-mono text-xs">{rule.validEnd}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${rule.status === '生效' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-3 text-blue-600">
                      <button onClick={() => { setActiveRule(rule); setDrawerMode('view'); }} className="hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors">查看</button>
                      <button onClick={() => { setActiveRule(rule); setDrawerMode('edit'); setRatioError(false); }} className="hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors">编辑</button>
                      {rule.status === '生效' && (
                        <button onClick={() => handleInvalidate(rule.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">作废</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {drawerMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-[600px] bg-white h-full shadow-2xl flex flex-col transform transition-transform">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {drawerMode === 'create' ? '新增分摊规则' : drawerMode === 'edit' ? '编辑分摊规则' : '查看规则详情'}
              </h3>
              <button onClick={() => setDrawerMode(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">规则名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={activeRule.name || ''}
                    onChange={(e) => setActiveRule({...activeRule, name: e.target.value})}
                    disabled={drawerMode === 'view'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                    placeholder="例如：2026年度江苏地区分摊规则"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生效开始日期 <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={activeRule.validStart || ''}
                    onChange={(e) => setActiveRule({...activeRule, validStart: e.target.value})}
                    disabled={drawerMode === 'view'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生效结束日期 <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={activeRule.validEnd || ''}
                    onChange={(e) => setActiveRule({...activeRule, validEnd: e.target.value})}
                    disabled={drawerMode === 'view'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">分摊主体 <span className="text-red-500">*</span></label>
                   <select 
                     value={activeRule.targetType || '保险公司'}
                     onChange={(e) => setActiveRule({...activeRule, targetType: e.target.value})}
                     disabled={drawerMode === 'view'}
                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                   >
                     <option value="保险公司">保险公司</option>
                     <option value="服务机构">服务机构</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">基础保费计提比例 (%) <span className="text-red-500">*</span></label>
                   <input 
                    type="number" 
                    min="0" max="100"
                    value={activeRule.baseRatio === undefined ? '' : activeRule.baseRatio}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setActiveRule({...activeRule, baseRatio: isNaN(val) ? 0 : val});
                      setRatioError(val < 0 || val > 100);
                    }}
                    disabled={drawerMode === 'view'}
                    className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 ${ratioError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'}`} 
                  />
                  {ratioError && <div className="text-red-500 text-xs mt-1">请输入 0-100 之间的数值</div>}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={!!activeRule.useFloating} 
                        onChange={(e) => setActiveRule({...activeRule, useFloating: e.target.checked})}
                        disabled={drawerMode === 'view'}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">启用浮动系数</span>
                  </label>
                </div>

                {activeRule.useFloating && (
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-700">
                      <span>评分区间设置</span>
                      {drawerMode !== 'view' && (
                        <button onClick={handleAddRow} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                          <Plus className="w-4 h-4" /> 新增区间
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {floatingConfig.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="number" value={item.min} disabled={drawerMode==='view'} className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none text-center disabled:bg-gray-100" />
                          <span className="text-gray-400">-</span>
                          <input type="number" value={item.max} disabled={drawerMode==='view'} className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none text-center disabled:bg-gray-100" />
                          <span className="text-gray-600 text-sm ml-2">分, 调整比例 (%)</span>
                          <input type="number" value={item.adjust} disabled={drawerMode==='view'} className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none text-center disabled:bg-gray-100" />
                          {drawerMode !== 'view' && (
                            <button onClick={() => handleRemoveRow(idx)} className="ml-auto text-red-400 hover:text-red-600 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">例外情形说明</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 h-24"
                  placeholder="请输入不进行分摊或特殊处理的情形说明..."
                  disabled={drawerMode === 'view'}
                ></textarea>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
               <button 
                 onClick={() => setDrawerMode(null)}
                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
               >
                 {drawerMode === 'view' ? '关闭' : '取消'}
               </button>
               {drawerMode !== 'view' && (
                 <button 
                   onClick={handleSave}
                   className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                 >
                   保存规则
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
