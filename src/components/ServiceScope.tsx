import React from 'react';
import { Layers, ShieldCheck, Zap, CheckCircle2, ChevronRight, Activity, BookOpen, Mic, Trophy, FileText, Target, Users } from 'lucide-react';

export function ServiceScope() {
  const routineServices = [
    { name: '风险诊断（风险辨识和隐患排查）', icon: <Activity className="w-4 h-4" /> },
    { name: '企业安全生产档案整理', icon: <FileText className="w-4 h-4" /> },
    { name: '应急救援演练指导及预案编制', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: '入场培训', icon: <Users className="w-4 h-4" /> },
    { name: '集中培训', icon: <BookOpen className="w-4 h-4" /> },
    { name: '安全生产标准化建设指导评审', icon: <CheckCircle2 className="w-4 h-4" /> },
    { name: '“双重预防机制”建设指导评审', icon: <Layers className="w-4 h-4" /> },
    { name: '宣传教育', icon: <Mic className="w-4 h-4" /> },
    { name: '在线培训课堂', icon: <BookOpen className="w-4 h-4" /> },
    { name: '专家顾问咨询', icon: <Users className="w-4 h-4" /> },
    { name: '大型论坛', icon: <Mic className="w-4 h-4" /> },
    { name: '大型宣传活动', icon: <Target className="w-4 h-4" /> },
    { name: '体验课堂', icon: <Zap className="w-4 h-4" /> },
    { name: '研讨会', icon: <Users className="w-4 h-4" /> },
    { name: '安全知识竞赛', icon: <Trophy className="w-4 h-4" /> },
  ];

  const customServices = [
    { name: '专项安全管理辅导与咨询' },
    { name: '安全生产合规性评估和辅导' },
    { name: '安全管理系统诊断与提升' },
    { name: '专项隐患治理' },
    { name: '安全管理专项深度咨询' },
    { name: '涉危使用企业专项安全评估' },
    { name: '施工机具硬件检测' },
    { name: '小散工程安全生产专项服务' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Layers className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">服务范围配置</h1>
          <p className="text-sm text-slate-500 mt-1">查看本系统已配置的事故预防及风控服务范围与类目</p>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-8">
        
        {/* 常规服务项目 */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
              <h2 className="text-base font-bold text-slate-800">1. 常规服务项目</h2>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              共 {routineServices.length} 项
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routineServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                  <div className="mt-0.5 p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 leading-snug block">{service.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 高端定制类服务 */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span>
              <h2 className="text-base font-bold text-slate-800">5. 高端定制类服务</h2>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              共 {customServices.length} 项
            </span>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-5">高端定制类服务包含但不限于以下专项内容，具体依企业深层次合规与风控需求而定：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {customServices.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2.5 group">
                  <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                    <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700 transition-colors">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
