import React, { useState } from 'react';
import { Calculator, RotateCcw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const CERT_OPTIONS = [
  { label: '未达标', factor: 1.1 },
  { label: '三级生产标准化达标企业', factor: 1.0 },
  { label: '二级生产标准化达标企业', factor: 0.9 },
  { label: '一级生产标准化达标企业', factor: 0.8 },
];

const ACCIDENT_OPTIONS = [
  { label: '近 1 年发生一般事故', factor: 1.3 },
  { label: '近 2 年未发生事故', factor: 1.0 },
  { label: '连续三年及以上未发生事故', factor: 0.95 },
  { label: '连续四年及以上未发生事故', factor: 0.9 },
];

const RISK_OPTIONS = [
  { label: '高（1.2）', factor: 1.2 },
  { label: '中（1.0）', factor: 1.0 },
  { label: '低（0.9）', factor: 0.9 },
];

const CREDIT_OPTIONS = [
  { label: '失信（1.3）', factor: 1.3 },
  { label: 'C 类（1.1）', factor: 1.1 },
  { label: 'B 类（1.0）', factor: 1.0 },
  { label: '诚信 A 类（0.9）', factor: 0.9 },
  { label: 'AA 类（0.8）', factor: 0.8 },
];

const BLACKLIST_OPTIONS = [
  { label: '被纳入黑名单（1.5）', factor: 1.5 },
  { label: '未被纳入安全生产领域联合惩戒黑名单', factor: 1.0 },
];

const SCALE_OPTIONS = [
  { label: '1-300 人', factor: 1.0 },
  { label: '301-1000 人', factor: 0.95 },
  { label: '1001-5000 人', factor: 0.9 },
  { label: '5001 人以上', factor: 0.85 },
];

const LIMIT_OPTIONS = [
  { label: '10万', value: 10 },
  { label: '15万', value: 15 },
  { label: '20万', value: 20 },
  { label: '30万', value: 30 },
  { label: '50万', value: 50 },
  { label: '100万', value: 100 },
];

const RESCUE_OPTIONS = [
  { label: '1万', value: 1 },
  { label: '2万', value: 2 },
  { label: '5万', value: 5 },
  { label: '10万', value: 10 },
];

const METHOD_OPTIONS = [
  { label: '新保', value: 0 },
  { label: '续保', value: 1 },
];

const INITIAL_STATE = {
  method: 0,
  inner_staff: '50',
  outer_staff: '12',
  limit: 1, // index 1 is 15
  add_employer: true,
  add_medical: true,
  rescue_limit: 0, // index 0 is 1
  cert: 1,
  accident: 3,
  risk: 2,
  credit: 3,
  blacklist: 1,
  scale: 0,
};

export function PremiumCalculatorWeb() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [result, setResult] = useState('0.00');
  const [isCalculating, setIsCalculating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success' | 'warning' | 'error'} | null>(null);
  
  const [showDetail, setShowDetail] = useState(false);
  const [calcDetail, setCalcDetail] = useState<any>(null);

  const showToast = (msg: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage({msg, type});
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleClear = () => {
    if (confirm('确定清除所有参数，恢复默认值吗？')) {
      setForm(INITIAL_STATE);
      setResult('0.00');
      showToast('已清除所有参数', 'success');
      setCalcDetail(null);
      setShowDetail(false);
    }
  };

  const handleCalculate = () => {
    if (isCalculating) return;

    // Validate
    const inner = parseInt(form.inner_staff);
    const outer = parseInt(form.outer_staff);
    if (isNaN(inner) || inner < 1 || inner > 10000) {
      showToast('内勤投保人数须为1-10000之间的整数', 'error');
      return;
    }
    if (isNaN(outer) || outer < 0 || outer > 10000) {
      showToast('外勤投保人数须为0-10000之间的整数', 'error');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const scale_val = SCALE_OPTIONS[form.scale].factor;
      const limit_val = LIMIT_OPTIONS[form.limit].value;
      const base_premium = (inner * 15 + outer * 30) * scale_val * (limit_val / 15);
      
      const add_emp_prem = form.add_employer ? base_premium * 0.2 : 0;
      const add_med_prem = form.add_medical ? base_premium * 0.15 : 0;
      
      const rescue_val = RESCUE_OPTIONS[form.rescue_limit].value;
      const rescue_prem = rescue_val * 50 * (inner + outer);

      const cert_val = CERT_OPTIONS[form.cert].factor;
      const acc_val = ACCIDENT_OPTIONS[form.accident].factor;
      const risk_val = RISK_OPTIONS[form.risk].factor;
      const credit_val = CREDIT_OPTIONS[form.credit].factor;
      const bl_val = BLACKLIST_OPTIONS[form.blacklist].factor;
      
      const float_factor = cert_val * acc_val * risk_val * credit_val * bl_val;
      
      const final_premium = (base_premium + add_emp_prem + add_med_prem + rescue_prem) * float_factor;

      setResult(formatNumber(final_premium));
      setIsCalculating(false);
      showToast('保费试算完成', 'success');

      setCalcDetail({
        inner_staff: inner,
        outer_staff: outer,
        base_premium: base_premium.toFixed(2),
        add_employer: add_emp_prem.toFixed(2),
        add_medical: add_med_prem.toFixed(2),
        rescue: rescue_prem.toFixed(2),
        float_factor: float_factor.toFixed(4),
        final_premium: formatNumber(final_premium),
        method: METHOD_OPTIONS[form.method].label,
        scale_label: SCALE_OPTIONS[form.scale].label,
      });
      setShowDetail(true);
    }, 600);
  };

  const handleSelectChange = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));

    if (key === 'method' && value === 1) {
      showToast('续保需上传上年度保单凭证', 'warning');
    }
    if (key === 'accident' && value === 0) {
      showToast('一般事故将上浮保费 30%', 'warning');
    }
    if (key === 'credit' && value === 0) {
      showToast('失信企业保费上浮 30%，且需提前提交整改证明', 'warning');
    }
    if (key === 'blacklist' && value === 0) {
      showToast('黑名单企业保费上浮 50%，需应急管理部门审核', 'warning');
    }
    if (key === 'scale') {
      showToast(`已调整为对应的基础费率档位: ${SCALE_OPTIONS[value].factor}`, 'success');
    }
  };

  const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="flex-1 w-full flex bg-gray-50 h-full relative">
      
      {/* Notifications */}
      {toastMessage && (
        <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-top-4
          ${toastMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
            toastMessage.type === 'warning' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 
            'bg-green-50 text-green-700 border border-green-200'}
        `}>
          <AlertCircle className="w-4 h-4" />
          {toastMessage.msg}
        </div>
      )}

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
               <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">保费试算器</h1>
              <p className="text-sm text-gray-500 mt-1">适用于中山市一般行业安全生产责任保险。高危行业请使用专属计算工具。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-1 md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2 mb-2">基本投保信息</div>

            <FormGroup label="投保方式">
              <div className="flex gap-4">
                {METHOD_OPTIONS.map((opt, i) => (
                  <label key={i} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${form.method === i ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="method" checked={form.method === i} onChange={() => handleSelectChange('method', i)} className="hidden" />
                    {form.method === i && <CheckCircle2 className="w-4 h-4" />}
                    {opt.label}
                  </label>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="投保人数调整档位">
              <select value={form.scale} onChange={(e) => handleSelectChange('scale', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {SCALE_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label} (C={opt.factor})</option>)}
              </select>
            </FormGroup>

            <FormGroup label="内勤投保人数 (人)">
              <input type="number" min="1" max="10000" value={form.inner_staff} onChange={(e) => {
                 setForm({...form, inner_staff: e.target.value});
              }} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white" />
            </FormGroup>

            <FormGroup label="外勤投保人数 (人)">
              <input type="number" min="0" max="10000" value={form.outer_staff} onChange={(e) => {
                 setForm({...form, outer_staff: e.target.value});
                 if (e.target.value === '0') showToast('外勤人数为 0 将不计入外勤保费', 'warning');
              }} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white" />
            </FormGroup>

            <FormGroup label="伤亡赔偿限额 (万/人)">
               <select value={form.limit} onChange={(e) => handleSelectChange('limit', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {LIMIT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
              </select>
            </FormGroup>
            
            <FormGroup label="每次事故救援限额 (万)">
               <select value={form.rescue_limit} onChange={(e) => handleSelectChange('rescue_limit', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {RESCUE_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
              </select>
            </FormGroup>

            {/* Additional Insurance */}
            <div className="col-span-1 md:col-span-2 flex gap-8 py-4 border-y border-gray-100 my-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${form.add_employer ? 'bg-blue-600' : ''}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${form.add_employer ? 'translate-x-4' : ''}`}></div>
                </div>
                <input type="checkbox" className="hidden" checked={form.add_employer} onChange={(e) => {
                  setForm({...form, add_employer: e.target.checked, add_medical: !e.target.checked ? false : form.add_medical});
                }} />
                <span className="font-medium text-gray-700">附加雇主责任险</span>
              </label>

              <label className={`flex items-center gap-3 ${!form.add_employer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${form.add_medical ? 'bg-blue-600' : ''}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${form.add_medical ? 'translate-x-4' : ''}`}></div>
                </div>
                <input type="checkbox" className="hidden" checked={form.add_medical} disabled={!form.add_employer} onChange={(e) => {
                  setForm({...form, add_medical: e.target.checked});
                }} />
                <span className="font-medium text-gray-700">附加雇主责任险医疗险</span>
              </label>
            </div>

            <div className="col-span-1 md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2 mt-4 mb-2">浮动费率系数配置</div>

            <FormGroup label="企业安全生产达标认证">
              <select value={form.cert} onChange={(e) => handleSelectChange('cert', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {CERT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label} (C={opt.factor})</option>)}
              </select>
            </FormGroup>

            <FormGroup label="事故记录和等级（安监部门认定）">
              <select value={form.accident} onChange={(e) => handleSelectChange('accident', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {ACCIDENT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label} (C={opt.factor})</option>)}
              </select>
            </FormGroup>

            <FormGroup label="安全风险程度">
              <select value={form.risk} onChange={(e) => handleSelectChange('risk', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {RISK_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
              </select>
            </FormGroup>

            <FormGroup label="安全生产诚信等级">
              <select value={form.credit} onChange={(e) => handleSelectChange('credit', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                {CREDIT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
              </select>
            </FormGroup>

            <div className="col-span-1 md:col-span-2">
              <FormGroup label="安全生产领域联合惩戒“黑名单”">
                <select value={form.blacklist} onChange={(e) => handleSelectChange('blacklist', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                  {BLACKLIST_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
                </select>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Right Fixed Calculation Panel */}
      <div className="w-[380px] bg-white border-l border-gray-200 shadow-[-4px_0_15px_rgba(0,0,0,0.03)] flex flex-col z-10 shrink-0 h-full">
        <div className="p-6 bg-blue-600 text-white flex flex-col items-center justify-center py-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-10 translate-y-10"></div>
           <div className="text-blue-100 text-sm mb-2 font-medium">预计最终保费 (元)</div>
           <div className={`font-mono transition-all duration-300 ${isCalculating ? 'text-blue-200' : 'text-white text-5xl font-bold tracking-tight'}`}>
              {isCalculating ? '计算中...' : result}
           </div>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 text-lg transition-colors shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isCalculating ? '计算中...' : '开始试算'}
          </button>
          
          <button 
            onClick={handleClear}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl flex justify-center items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> 清除参数及结果
          </button>
        </div>

        {showDetail && calcDetail && (
           <div className="flex-1 overflow-y-auto px-6 pb-6 mt-2 border-t border-gray-100 pt-6 animate-in slide-in-from-right">
             <div className="flex items-center gap-2 mb-4 font-bold text-gray-800">
                <FileText className="w-5 h-5 text-blue-600" />
                保费计算明细
             </div>

             <div className="space-y-4 text-sm text-gray-600">
               <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                 <div className="flex justify-between font-medium text-gray-800 mb-2 border-b border-gray-200 pb-2">基础保费</div>
                 <div className="flex justify-between"><span>基础保费</span> <span>￥{calcDetail.base_premium}</span></div>
                 <div className="flex justify-between"><span>附加雇主险</span> <span>￥{calcDetail.add_employer}</span></div>
                 <div className="flex justify-between"><span>附加医疗险</span> <span>￥{calcDetail.add_medical}</span></div>
                 <div className="flex justify-between"><span>救援费用险</span> <span>￥{calcDetail.rescue}</span></div>
               </div>

               <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2">
                 <div className="flex justify-between font-medium text-blue-900 mb-2 border-b border-blue-200/50 pb-2">系数组合</div>
                 <div className="flex justify-between font-mono font-medium text-blue-700">
                   <span>综合浮动系数乘数</span> <span>× {calcDetail.float_factor}</span>
                 </div>
               </div>
             </div>

             <button onClick={() => showToast('已成功导出试算单 PDF', 'success')} className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-xl flex items-center justify-center transition-colors">
               导出 PDF 存根
             </button>
           </div>
        )}
      </div>

    </div>
  );
}
