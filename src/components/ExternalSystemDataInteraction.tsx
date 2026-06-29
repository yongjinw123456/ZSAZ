import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, List, Activity, CheckCircle2, Server } from 'lucide-react';

export function ExternalSystemDataInteraction() {
  const pushStats = [
    { name: '承保数据', pushedCount: '124,532', status: '正常推送', icon: <FileText className="w-6 h-6 text-blue-500" /> },
    { name: '理赔数据', pushedCount: '18,450', status: '正常推送', icon: <AlertTriangle className="w-6 h-6 text-rose-500" /> },
    { name: '风控服务数据', pushedCount: '45,210', status: '正常推送', icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> },
    { name: '红黑榜数据', pushedCount: '1,205', status: '正常推送', icon: <List className="w-6 h-6 text-purple-500" /> },
    { name: '事故预防服务数据', pushedCount: '32,150', status: '正常推送', icon: <Activity className="w-6 h-6 text-amber-500" /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Server className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">安全生产责任保险信息共享平台</h1>
          <p className="text-sm text-slate-500 mt-1">外部系统数据交互实时监控看板</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-7xl">
          {pushStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-indigo-400 transition-colors" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {stat.status}
                </div>
              </div>
              
              <h3 className="text-slate-600 font-semibold mb-2">{stat.name}</h3>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-slate-800 tracking-tight">{stat.pushedCount}</span>
                <span className="text-xs text-slate-400 font-medium">条已推送</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
