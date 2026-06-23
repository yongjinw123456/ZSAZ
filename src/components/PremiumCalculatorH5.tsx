import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, AlertCircle } from 'lucide-react';

const CERT_OPTIONS = [
  { label: '未达标', short: '未达标', factor: 1.1 },
  { label: '三级生产标准化达标企业', short: '三级达标', factor: 1.0 },
  { label: '二级生产标准化达标企业', short: '二级达标', factor: 0.9 },
  { label: '一级生产标准化达标企业', short: '一级达标', factor: 0.8 },
];

const ACCIDENT_OPTIONS = [
  { label: '近 1 年发生一般事故', short: '近1年一般事故', factor: 1.3 },
  { label: '近 2 年未发生事故', short: '近2年无事故', factor: 1.0 },
  { label: '连续三年及以上未发生事故', short: '连续三年无事故', factor: 0.95 },
  { label: '连续四年及以上未发生事故', short: '连续四年无事故', factor: 0.9 },
];

const RISK_OPTIONS = [
  { label: '高（1.2）', short: '高 (1.2)', factor: 1.2 },
  { label: '中（1.0）', short: '中 (1.0)', factor: 1.0 },
  { label: '低（0.9）', short: '低 (0.9)', factor: 0.9 },
];

const CREDIT_OPTIONS = [
  { label: '失信（1.3）', short: '失信 (1.3)', factor: 1.3 },
  { label: 'C 类（1.1）', short: 'C类 (1.1)', factor: 1.1 },
  { label: 'B 类（1.0）', short: 'B类 (1.0)', factor: 1.0 },
  { label: '诚信 A 类（0.9）', short: 'A类 (0.9)', factor: 0.9 },
  { label: 'AA 类（0.8）', short: 'AA类 (0.8)', factor: 0.8 },
];

const BLACKLIST_OPTIONS = [
  { label: '被纳入黑名单（1.5）', short: '被纳入', factor: 1.5 },
  { label: '未被纳入安全生产领域联合惩戒黑名单', short: '未纳入', factor: 1.0 },
];

const SCALE_OPTIONS = [
  { label: '1-300 人', short: '1-300 人', factor: 1.0, min: 1, max: 300 },
  { label: '301-1000 人', short: '301-1000 人', factor: 0.95, min: 301, max: 1000 },
  { label: '1001-5000 人', short: '1001-5000 人', factor: 0.9, min: 1001, max: 5000 },
  { label: '5001 人以上', short: '5001人以上', factor: 0.85, min: 5001, max: Infinity },
];

const LIMIT_OPTIONS = [
  { label: '10万', short: '10', value: 10 },
  { label: '15万', short: '15', value: 15 },
  { label: '20万', short: '20', value: 20 },
  { label: '30万', short: '30', value: 30 },
  { label: '50万', short: '50', value: 50 },
  { label: '100万', short: '100', value: 100 },
];

const RESCUE_OPTIONS = [
  { label: '1万', short: '1', value: 1 },
  { label: '2万', short: '2', value: 2 },
  { label: '5万', short: '5', value: 5 },
  { label: '10万', short: '10', value: 10 },
];

const METHOD_OPTIONS = [
  { label: '新保', short: '新保' },
  { label: '续保', short: '续保' },
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

export function PremiumCalculatorH5() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [result, setResult] = useState('0.00');
  const [isCalculating, setIsCalculating] = useState(false);
  const [highlightResult, setHighlightResult] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals state
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [numInput, setNumInput] = useState('');
  
  const [showDetail, setShowDetail] = useState(false);
  const [calcDetail, setCalcDetail] = useState<any>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(msg);
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
      // Calculation Logic
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
      setHighlightResult(true);
      setTimeout(() => setHighlightResult(false), 500);
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

    }, 800);
  };

  const handleSelectOption = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
    setActivePopup(null);
    
    // Hooks for certain selections
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

  const openNumInput = (key: string) => {
    setNumInput(form[key as keyof typeof form] as string);
    setActivePopup(key);
  };

  const confirmNumInput = () => {
    const v = parseInt(numInput);
    if (activePopup === 'inner_staff') {
      if (isNaN(v) || v < 1 || v > 10000) {
        showToast('请输入 1-10000 之间的整数', 'error');
        return;
      }
    } else if (activePopup === 'outer_staff') {
      if (isNaN(v) || v < 0 || v > 10000) {
        showToast('请输入 0-10000 之间的整数', 'error');
        return;
      }
      if (v === 0) showToast('外勤人数为 0 将不计入外勤保费', 'warning');
    }
    
    setForm({ ...form, [activePopup!]: numInput });
    setActivePopup(null);
  };

  const renderButton = (key: string, label: string, valueStr: string, onClick: () => void, disabled: boolean = false) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col justify-center items-center active:scale-95 transition-transform ${disabled ? 'opacity-50' : ''}`}
    >
      <span className="text-gray-500 text-xs mb-1 truncate w-full text-center">{label}</span>
      <span className={`text-lg font-bold truncate w-full text-center ${valueStr === '取消' || valueStr === '不投保' ? 'text-gray-400' : 'text-gray-900'}`}>
        {valueStr}
      </span>
    </button>
  );

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center overflow-hidden w-full relative">
      {/* Mobile Simulator Container */}
      <div className="w-full max-w-[420px] h-full h-max-[850px] bg-gray-50 shadow-2xl relative flex flex-col overflow-hidden sm:rounded-3xl sm:h-[90%] sm:border-8 border-gray-900 shrink-0">
        
        {/* Top Nav */}
        <div className="bg-[#2A2B2E] text-white flex items-center justify-center h-12 relative shrink-0">
           <button className="absolute left-3 w-8 h-8 flex items-center justify-center">
             <ChevronLeft className="w-6 h-6 text-white" />
           </button>
           <h1 className="font-bold text-lg">保费试算器</h1>
        </div>

        {/* Result Area */}
        <div className="bg-[#2A2B2E] h-28 flex flex-col items-center justify-center relative shrink-0">
          <div className="text-gray-400 text-sm mb-1">预计保费 (元)</div>
          <div className={`transition-all duration-300 font-mono ${isCalculating ? 'text-gray-500 scale-95' : 'text-white'} ${highlightResult ? 'scale-110 text-blue-400' : 'text-4xl'}`}>
            {isCalculating ? '计算中...' : result}
          </div>
        </div>

        {/* Product Label */}
        <div className="bg-blue-600 text-white font-bold text-sm text-center py-2 shrink-0 group relative cursor-help">
          中山一般行业安责险
          <div className="absolute hidden group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded w-max z-10 font-normal shadow-lg">
            本试算器仅适用于中山市一般行业安全生产责任保险，高危行业请使用专属试算工具
          </div>
        </div>

        {/* Form Matrix Scroll Area */}
        <div className="flex-1 overflow-y-auto w-full p-4 pb-24 scrollbars-hidden relative">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {renderButton('method', '投保方式', METHOD_OPTIONS[form.method].short, () => setActivePopup('method'))}
            {renderButton('scale', '投保人数调整', SCALE_OPTIONS[form.scale].short, () => setActivePopup('scale'))}
            {renderButton('inner_staff', '内勤投保人数', form.inner_staff, () => openNumInput('inner_staff'))}
            {renderButton('outer_staff', '外勤投保人数', form.outer_staff, () => openNumInput('outer_staff'))}
            
            {renderButton('limit', '伤亡赔偿限额(万)', LIMIT_OPTIONS[form.limit].short, () => setActivePopup('limit'))}
            {renderButton('rescue_limit', '救援费用保额(万)', RESCUE_OPTIONS[form.rescue_limit].short, () => setActivePopup('rescue_limit'))}
            
            {renderButton('add_employer', '附加雇主责任险', form.add_employer ? '投保' : '不投保', () => {
              setForm(prev => ({
                 ...prev, 
                 add_employer: !prev.add_employer,
                 add_medical: !prev.add_employer ? prev.add_medical : false // if turning off emp, turn off med
              }))
            })}
            {renderButton('add_medical', '附加医疗险', form.add_medical ? '投保' : '不投保', () => {
              setForm(prev => ({...prev, add_medical: !prev.add_medical}))
            }, !form.add_employer)}

            {renderButton('cert', '企业安全达标认证', CERT_OPTIONS[form.cert].short, () => setActivePopup('cert'))}
            {renderButton('accident', '事故记录和等级', ACCIDENT_OPTIONS[form.accident].short, () => setActivePopup('accident'))}
            {renderButton('risk', '安全风险程度', RISK_OPTIONS[form.risk].short, () => setActivePopup('risk'))}
            {renderButton('credit', '安全生产诚信等级', CREDIT_OPTIONS[form.credit].short, () => setActivePopup('credit'))}
            <div className="col-span-2">
              {renderButton('blacklist', '联合惩戒"黑名单"', BLACKLIST_OPTIONS[form.blacklist].short, () => setActivePopup('blacklist'))}
            </div>
          </div>
        </div>

        {/* Fixed Right Actions */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20 pointer-events-none pr-3">
          <button 
            onClick={handleClear} 
            className="w-12 h-16 bg-white rounded-l-xl rounded-r-sm shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-[10px] text-gray-500 font-medium font-sans leading-tight pointer-events-auto border-t border-b border-l border-gray-100 active:bg-gray-50"
          >
            <span>A C</span>
            <span>清除</span>
          </button>
          
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-12 h-32 bg-blue-600 rounded-l-xl rounded-r-sm shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center font-bold text-white pointer-events-auto active:bg-blue-700 disabled:opacity-80 transition-colors"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '4px' }}
          >
            {isCalculating ? '计算中' : '试算(元)'}
          </button>
        </div>

        {/* Popup Modals */}
        {activePopup && (
           <div className="absolute inset-0 bg-black/60 z-30 flex items-end animate-in fade-in duration-200">
             <div className="w-full bg-white rounded-t-2xl shadow-xl flex flex-col animate-in slide-in-from-bottom duration-300 pb-safe">
               <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-2xl">
                 <h3 className="font-bold text-gray-800 text-sm">
                   {activePopup === 'method' && '投保方式'}
                   {activePopup === 'inner_staff' && '内勤投保人数'}
                   {activePopup === 'outer_staff' && '外勤投保人数'}
                   {activePopup === 'limit' && '伤亡赔偿限额'}
                   {activePopup === 'rescue_limit' && '每次事故救援限额'}
                   {activePopup === 'cert' && '安全生产达标认证'}
                   {activePopup === 'accident' && '事故记录(安监部门)'}
                   {activePopup === 'risk' && '安全风险程度'}
                   {activePopup === 'credit' && '安全生产诚信等级'}
                   {activePopup === 'blacklist' && '安全联合惩戒黑名单'}
                   {activePopup === 'scale' && '投保人数调整档位'}
                 </h3>
                 <button onClick={() => setActivePopup(null)} className="text-gray-400 p-1"><X className="w-5 h-5"/></button>
               </div>

               <div className="p-4 max-h-[60vh] overflow-y-auto">
                 {/* Number Input Modal */}
                 {(activePopup === 'inner_staff' || activePopup === 'outer_staff') && (
                   <div className="flex flex-col gap-4">
                     <input 
                       type="number" 
                       autoFocus
                       value={numInput}
                       onChange={e => setNumInput(e.target.value)}
                       className="w-full h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold font-mono outline-none focus:border-blue-600 transition-colors"
                       placeholder="请输入数字"
                     />
                     <button onClick={confirmNumInput} className="w-full h-12 bg-blue-600 rounded-xl font-bold text-white active:opacity-80">
                        确认保存
                     </button>
                   </div>
                 )}

                 {/* Radio Lists */}
                 {activePopup !== 'inner_staff' && activePopup !== 'outer_staff' && (
                   <div className="flex flex-col gap-2">
                     {activePopup === 'method' && METHOD_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('method', idx)} className={`w-full p-4 rounded-xl text-center font-medium ${form.method === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}>{opt.label}</button>
                     ))}
                     {activePopup === 'limit' && LIMIT_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('limit', idx)} className={`w-full p-4 rounded-xl text-center font-medium ${form.limit === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}>{opt.label}</button>
                     ))}
                     {activePopup === 'rescue_limit' && RESCUE_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('rescue_limit', idx)} className={`w-full p-4 rounded-xl text-center font-medium ${form.rescue_limit === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}>{opt.label}</button>
                     ))}
                     {activePopup === 'cert' && CERT_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('cert', idx)} className={`w-full p-4 rounded-xl flex justify-between font-medium ${form.cert === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-sm">C={opt.factor}</span></button>
                     ))}
                     {activePopup === 'accident' && ACCIDENT_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('accident', idx)} className={`w-full p-4 rounded-xl flex items-center justify-between font-medium text-sm ${form.accident === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-xs text-right min-w-[36px]">C={opt.factor}</span></button>
                     ))}
                     {activePopup === 'risk' && RISK_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('risk', idx)} className={`w-full p-4 rounded-xl flex justify-between font-medium ${form.risk === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-sm">C={opt.factor}</span></button>
                     ))}
                     {activePopup === 'credit' && CREDIT_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('credit', idx)} className={`w-full p-4 rounded-xl flex justify-between font-medium ${form.credit === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-sm">C={opt.factor}</span></button>
                     ))}
                     {activePopup === 'blacklist' && BLACKLIST_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('blacklist', idx)} className={`w-full p-4 rounded-xl flex justify-between font-medium ${form.blacklist === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-sm">C={opt.factor}</span></button>
                     ))}
                     {activePopup === 'scale' && SCALE_OPTIONS.map((opt, idx) => (
                       <button key={idx} onClick={() => handleSelectOption('scale', idx)} className={`w-full p-4 rounded-xl flex justify-between font-medium ${form.scale === idx ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}><span>{opt.label}</span><span className="text-gray-400 text-sm">C={opt.factor}</span></button>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
        )}

        {/* Global Toast */}
        {toastMessage && (
          <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-xs shadow-lg font-medium whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> {toastMessage}
          </div>
        )}

        {/* Calc Detail Modal */}
        {showDetail && calcDetail && (
           <div className="absolute inset-0 bg-white z-40 flex flex-col p-6 overflow-y-auto w-full animate-in slide-in-from-bottom">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-xl text-gray-900 border-b-2 border-blue-600 pb-1">保费试算明细单</h3>
               <button onClick={() => setShowDetail(false)} className="bg-gray-100 p-2 rounded-full"><X className="w-5 h-5"/></button>
             </div>

             <div className="flex flex-col gap-4 text-sm text-gray-700 font-mono">
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between font-sans"><span className="text-gray-500">投保方式</span> <span className="font-medium text-gray-900">{calcDetail.method}</span></div>
                  <div className="flex justify-between font-sans"><span className="text-gray-500">内勤/外勤</span> <span className="font-medium text-gray-900">{calcDetail.inner_staff} 人 / {calcDetail.outer_staff} 人</span></div>
                  <div className="flex justify-between font-sans"><span className="text-gray-500">调整档位</span> <span className="font-medium text-gray-900">{calcDetail.scale_label}</span></div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                  <h4 className="font-bold text-gray-900 font-sans border-b border-blue-100 pb-2">基础保费计算</h4>
                  <div className="flex justify-between"><span>基础保费</span> <span>￥{calcDetail.base_premium}</span></div>
                  <div className="flex justify-between text-gray-500"><span>└ 附加雇主险 (20%)</span> <span>￥{calcDetail.add_employer}</span></div>
                  <div className="flex justify-between text-gray-500"><span>└ 附加医疗险 (15%)</span> <span>￥{calcDetail.add_medical}</span></div>
                  <div className="flex justify-between text-gray-500"><span>└ 救援费用保费</span> <span>￥{calcDetail.rescue}</span></div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                  <h4 className="font-bold text-gray-900 font-sans border-b border-indigo-100 pb-2">浮动系数综合乘数</h4>
                  <div className="flex justify-between text-lg font-bold text-indigo-700"><span>总系数</span> <span>{calcDetail.float_factor}</span></div>
                </div>

                <div className="mt-4 p-5 bg-[#2A2B2E] text-white rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-gray-400 text-xs mb-1 font-sans">最终保费结果</div>
                  <div className="text-3xl font-bold font-mono tracking-tight text-blue-400">￥{calcDetail.final_premium}</div>
                </div>

                <button onClick={() => showToast('已下载试算单 PDF', 'success')} className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center font-sans tracking-wide">
                  导出为 PDF 存根
                </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
