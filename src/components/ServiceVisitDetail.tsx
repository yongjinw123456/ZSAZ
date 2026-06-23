import React, { useState } from "react";
import { ArrowLeft, Star, Download, Printer, Save, File, Trash2, Upload } from "lucide-react";
import { ServiceVisitRecord } from "../types";

export function ServiceVisitDetail({ record, onBack }: { record: ServiceVisitRecord, onBack: () => void }) {
  const [formData, setFormData] = useState<Partial<ServiceVisitRecord>>({
    ...record,
    q1_score: record.q1_score || 0,
    q2_answer: record.q2_answer || undefined,
    q3_answer: record.q3_answer || undefined,
    q4_answer: record.q4_answer || undefined,
    q5_answer: record.q5_answer || undefined,
    q6_answer: record.q6_answer || undefined,
    q7_answer: record.q7_answer || undefined,
    q8_answer: record.q8_answer || undefined,
    q9_answer: record.q9_answer || undefined,
    remark: record.remark || "",
  });

  const [activeTab, setActiveTab] = useState("visit");

  const updateField = (field: keyof ServiceVisitRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentDateTime = `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().substring(0, 5)}`;

  const StarSelector = ({ score, onChange }: { score: number, onChange: (val: number) => void }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-6 h-6 cursor-pointer hover:scale-110 transition-transform ${i <= score ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            onClick={() => onChange(i)}
          />
        ))}
        {score > 0 && <span className="ml-2 text-sm font-medium text-yellow-600">{score} 分</span>}
      </div>
    );
  };

  const RadioGroup = ({ value, options, onChange }: { value?: number, options: { label: string, val: number }[], onChange: (val: number) => void }) => {
    return (
      <div className="flex items-center gap-5 flex-wrap">
        {options.map((opt) => (
          <label key={opt.val} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${value === opt.val ? 'border-blue-600' : 'border-gray-400 group-hover:border-blue-400'}`}>
              {value === opt.val && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </div>
            <span className={`text-sm select-none ${value === opt.val ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{opt.label}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">返回列表</span>
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <h2 className="text-lg font-semibold text-gray-800">{record.service_name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 scroll-smooth">
        <div className="max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-20">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button 
              className={`px-8 py-3.5 text-sm font-medium transition-colors ${activeTab === 'visit' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('visit')}
            >
              服务回访
            </button>
            <button 
              className={`px-8 py-3.5 text-sm font-medium transition-colors ${activeTab === 'closure' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('closure')}
            >
              隐患闭环
            </button>
          </div>

          <div className="p-8">
            <h3 className="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-6">标准化回访表</h3>
            
            {/* Split layout questions */}
            <div className="border border-gray-200 rounded-md overflow-hidden flex flex-col">
              
              <div className="flex border-b border-gray-200 bg-gray-50/30">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 1. 企业对本次服务评分
                </div>
                <div className="w-2/3 p-4">
                  <StarSelector score={formData.q1_score || 0} onChange={(val) => updateField('q1_score', val)} />
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 2. 企业是否收到服务报告
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q2_answer} 
                    options={[{label: '是', val: 1}, {label: '否', val: 2}]} 
                    onChange={val => updateField('q2_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200 bg-gray-50/30">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 3. 企业对服务的专业性是否满意
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q3_answer} 
                    options={[{label: '非常满意', val: 1}, {label: '满意', val: 2}, {label: '一般', val: 3}, {label: '不满意', val: 4}, {label: '非常不满意', val: 5}]} 
                    onChange={val => updateField('q3_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 4. 本次服务是否对企业有帮助
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q4_answer} 
                    options={[{label: '是', val: 1}, {label: '否', val: 2}, {label: '一般', val: 3}]} 
                    onChange={val => updateField('q4_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200 bg-gray-50/30">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 5. 专家的服务态度是否满意
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q5_answer} 
                    options={[{label: '非常满意', val: 1}, {label: '满意', val: 2}, {label: '一般', val: 3}, {label: '不满意', val: 4}, {label: '非常不满意', val: 5}]} 
                    onChange={val => updateField('q5_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 6. 专家是否按时到场
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q6_answer} 
                    options={[{label: '是', val: 1}, {label: '否', val: 2}, {label: '迟到 15 分钟内', val: 3}, {label: '迟到 30 分钟以上', val: 4}]} 
                    onChange={val => updateField('q6_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200 bg-gray-50/30">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 7. 专家的精神面貌
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q7_answer} 
                    options={[{label: '好', val: 1}, {label: '一般', val: 2}, {label: '差', val: 3}]} 
                    onChange={val => updateField('q7_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-center bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 8. 专家是否存在推销或收费行为
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q8_answer} 
                    options={[{label: '是', val: 1}, {label: '否', val: 2}]} 
                    onChange={val => updateField('q8_answer', val)} 
                  />
                </div>
              </div>

              <div className="flex">
                <div className="w-1/3 p-4 border-r border-gray-200 text-sm font-medium text-gray-700 flex items-start pt-5 bg-[#f7f9fb]">
                  <span className="text-red-500 mr-1">*</span> 9. 企业是否有企业服务需求
                </div>
                <div className="w-2/3 p-4">
                  <RadioGroup 
                    value={formData.q9_answer} 
                    options={[{label: '无', val: 1}, {label: '有', val: 2}]} 
                    onChange={val => updateField('q9_answer', val)} 
                  />
                  {formData.q9_answer === 2 && (
                    <div className="mt-4">
                      <textarea 
                        className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                        placeholder="请详细说明企业的具体服务需求..."
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mt-10 mb-6">基础信息</h3>
            <div className="grid grid-cols-2 gap-6 bg-[#fcfcfc] p-6 border border-gray-200 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">回访人</label>
                <input 
                  type="text" 
                  value="王强" 
                  readOnly 
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500 mr-1">*</span> 回访日期
                </label>
                <input 
                  type="text" 
                  defaultValue={currentDateTime}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  placeholder="请输入补充说明、异常问题等..."
                  value={formData.remark}
                  onChange={e => updateField('remark', e.target.value)}
                ></textarea>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mt-10 mb-6">附件材料</h3>
            <div className="grid grid-cols-2 gap-8">
              
              {/* Enterprise Attachments */}
              <div className="border border-gray-200 rounded p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-800">
                    <span className="text-red-500 mr-1">*</span>企业附件 (签字确认单/录音)
                  </label>
                  <label className="cursor-pointer text-blue-600 text-sm hover:underline flex items-center gap-1">
                    <Upload className="w-4 h-4" /> 批量上传
                    <input type="file" multiple className="hidden" accept=".pdf,.jpg,.png,.mp3" />
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded text-sm group">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">企业签字确认单_2026.pdf</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-blue-600 hover:text-blue-800"><Download className="w-4 h-4" /></button>
                      <button className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {formData.enterprise_attachment && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded text-sm group">
                      <div className="flex items-center gap-2">
                         <File className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{formData.enterprise_attachment}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-blue-600 hover:text-blue-800"><Download className="w-4 h-4" /></button>
                        <button className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-4">支持 PDF, JPG, PNG, MP3。单文件不超过 50MB。必须上传至少1份佐证材料。</div>
              </div>

              {/* Insurance Attachments */}
              <div className="border border-gray-200 rounded p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-800">
                    保司附件 (保险公司确认材料)
                  </label>
                   <label className="cursor-pointer text-blue-600 text-sm hover:underline flex items-center gap-1">
                    <Upload className="w-4 h-4" /> 批量上传
                    <input type="file" multiple className="hidden" accept=".pdf,.jpg,.png,.mp3" />
                  </label>
                </div>
                 <div className="space-y-3">
                  {record.insurance_attachment ? record.insurance_attachment.split(',').map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded text-sm group">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{file}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-blue-600 hover:text-blue-800"><Download className="w-4 h-4" /></button>
                        <button className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded">暂无附件</div>
                  )}
                </div>
                 <div className="text-xs text-gray-400 mt-4">支持 PDF, JPG, PNG, MP3。单文件不超过 50MB。</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Floating Action footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-center gap-4 z-20">
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors shadow-sm bg-white font-medium text-sm">
          <Printer className="w-4 h-4" />
          打印
        </button>
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors shadow-sm bg-white font-medium text-sm">
          <Download className="w-4 h-4" />
          导出 PDF
        </button>
        <button className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm border border-blue-600">
          <Save className="w-4 h-4" />
          保存回访记录
        </button>
      </div>

    </div>
  );
}
