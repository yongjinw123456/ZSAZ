import React, { useState, useMemo } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  FileText, 
  Image as ImageIcon, 
  ChevronRight, 
  Trash2, 
  RefreshCw, 
  UploadCloud, 
  X, 
  User, 
  Check, 
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  ThumbsUp,
  Inbox
} from 'lucide-react';

interface EvaluationItem {
  id: string;
  enterpriseName: string;
  serviceName: string;
  completedTime: string;
  serviceType: string;
  evaluated: boolean;
  score?: number;
  tags?: string[];
  comment?: string;
  evaluatedTime?: string;
}

interface ComplaintItem {
  id: string;
  type: string;
  submittedTime: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected'; // 待处理, 处理中, 已办结, 已驳回
  content: string;
  associatedOrder: string;
  images: string[];
  phone: string;
  timeline: { time: string; title: string; desc: string; operator?: string }[];
  resultRating?: number; // 评价处理结果
}

export function ServiceFeedback({ initialSubMenu }: { initialSubMenu: 'evaluation' | 'complaint' }) {
  // Navigation tabs (Evaluation vs. Complaints)
  const [activeMenu, setActiveMenu] = useState<'evaluation' | 'complaint'>(initialSubMenu);

  // --- TAB 1: Evaluation State ---
  const [evalTab, setEvalTab] = useState<'pending' | 'completed'>('pending');
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([
    {
      id: 'EV-001',
      enterpriseName: 'XX 企业',
      serviceName: '重大事故隐患排查',
      completedTime: '2026-06-15',
      serviceType: '隐患排查服务',
      evaluated: false,
    },
    {
      id: 'EV-002',
      enterpriseName: 'XX 企业',
      serviceName: '应急预案编制与应急演练',
      completedTime: '2026-06-21',
      serviceType: '应急演练服务',
      evaluated: false,
    },
    {
      id: 'EV-003',
      enterpriseName: '高大制造限公司',
      serviceName: '安全风险辨识评估',
      completedTime: '2026-06-22',
      serviceType: '风险评估服务',
      evaluated: false,
    },
    // Mock computed history items
    {
      id: 'EV-101',
      enterpriseName: '高大企业',
      serviceName: '安全生产培训',
      completedTime: '2026-06-10',
      serviceType: '宣传教育培训',
      evaluated: true,
      score: 5,
      tags: ['专业高效', '态度很好', '报告详细'],
      comment: '培训非常专业，老师讲解得非常生动！',
      evaluatedTime: '2026-06-12'
    },
    {
      id: 'EV-102',
      enterpriseName: '宏达制造',
      serviceName: '本质安全科技推广',
      completedTime: '2026-06-05',
      serviceType: '安全生产科技推广',
      evaluated: true,
      score: 4,
      tags: ['专业高效', '报告详细'],
      comment: '科技推广方案切合我们生产实际，传感器点位对接很顺畅。',
      evaluatedTime: '2026-06-06'
    }
  ]);

  // Date Filter inside Completed evaluation list
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'quarter'>('all');

  // Submit Evaluation Modal
  const [activeEvalItem, setActiveEvalItem] = useState<EvaluationItem | null>(null);
  const [evalScore, setEvalScore] = useState<number>(5);
  const [selectedEvalTags, setSelectedEvalTags] = useState<string[]>([]);
  const [evalComment, setEvalComment] = useState<string>('');

  // Read-only detail modal
  const [viewEvalDetail, setViewEvalDetail] = useState<EvaluationItem | null>(null);

  // Preset feedback tags for selection
  const RATING_TAG_PRESETS = ['专业高效', '态度很好', '报告详细', '准时到场'];

  // --- TAB 2: Complaint State ---
  const [complaintTab, setComplaintTab] = useState<'submit' | 'records'>('submit');
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
    {
      id: 'TS202606001',
      type: '服务时效问题',
      submittedTime: '2026-06-18 10:24:00',
      status: 'processing', // 处理中
      content: '约定的重大事故隐患排查专家，原定于上午9点到达车间，但最终迟到了将近40分钟。没有任何提前联系告知，导致我们在现场等候的几位工艺负责人空等，希望能加强专家的时间意识。',
      associatedOrder: '安全风险辨识评估工单 (20260512)',
      images: ['/raw_scene_log_01.png'],
      phone: '13812345678',
      timeline: [
        { time: '2026-06-18 10:24:00', title: '投诉成功提交', desc: '投诉信息已成功归入反馈管理中心，等待运营主管分配。' },
        { time: '2026-06-19 14:15:22', title: '专家组核查受案', desc: '经办人：运营组赵主管。已与预防工程师及服务中心核对车间迟到实况，正在核查具体延迟原因。' }
      ]
    },
    {
      id: 'TS202606002',
      type: '系统使用问题',
      submittedTime: '2026-06-10 09:44:12',
      status: 'resolved', // 已办结
      content: '在成果中心点击下载事故预防诊断建议书PDF时，进度条卡在99%，重试多次依然出错。急需打印该报告用于应对当地安监稽查，劳烦技术老师排查修复，感谢！',
      associatedOrder: '重大事故隐患排查(20260601)',
      images: [],
      phone: '13812345678',
      timeline: [
        { time: '2026-06-10 09:44:12', title: '投诉成功提交', desc: '系统bug反馈已录入反馈处理中心。' },
        { time: '2026-06-11 11:30:15', title: '问题排查修复中', desc: '经办人：技术专员小李。排查核实发现该保单报告由于合并特大图档导致流渲染异常。已精简分包分发。' },
        { time: '2026-06-11 16:30:00', title: '处理完成并回复', desc: '回复内容：报告下载PDF通道已完成重新打包部署。您可以重新登陆企业端成果中心点选下载全本。如有疑问可随时致电保障中心。' }
      ],
      resultRating: undefined // Ready for client review
    }
  ]);

  // Complaint Form Inputs
  const [compType, setCompType] = useState<string>('服务质量问题');
  const [compOrder, setCompOrder] = useState<string>('通用投诉');
  const [compContent, setCompContent] = useState<string>('');
  const [compFiles, setCompFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [compPhone, setCompPhone] = useState<string>('13812345678'); // Auto filled, editable

  // Read-only Complaint Detail Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  
  // Interactive star feedback inside Resolved Complaint Modal
  const [tempResolveScore, setTempResolveScore] = useState<number>(5);

  // Notification Banner State
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered Evaluation list
  const filteredCompletedEvals = useMemo(() => {
    const historical = evaluations.filter(e => e.evaluated);
    if (timeFilter === 'all') return historical;
    
    return historical.filter(e => {
      const year = new Date(e.completedTime).getFullYear();
      const month = new Date(e.completedTime).getMonth() + 1;
      if (timeFilter === 'month') {
        // Mock current month is June
        return month === 6 && year === 2026;
      } else if (timeFilter === 'quarter') {
        // Last 3 months (April, May, June)
        return month >= 4 && month <= 6 && year === 2026;
      }
      return true;
    });
  }, [evaluations, timeFilter]);

  // Open Evaluate Dialog
  const openEvalModal = (item: EvaluationItem) => {
    setActiveEvalItem(item);
    setEvalScore(5);
    setSelectedEvalTags([]);
    setEvalComment('');
  };

  // Save/Submit rating
  const submitRating = () => {
    if (!activeEvalItem) return;

    setEvaluations(prev => prev.map(item => {
      if (item.id === activeEvalItem.id) {
        return {
          ...item,
          evaluated: true,
          score: evalScore,
          tags: selectedEvalTags,
          comment: evalComment || '企业提交了满意评分',
          evaluatedTime: new Date().toISOString().slice(0, 10)
        };
      }
      return item;
    }));

    // Trigger toast & reset dialog
    showToast('评价提交成功，感谢您的反馈！', 'success');
    setActiveEvalItem(null);
  };

  // Toggle tag selection in rating dialog
  const toggleRatingTag = (tag: string) => {
    setSelectedEvalTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Handle Drag & Drop / File Select Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    if (compFiles.length + files.length > 3) {
      showToast('凭证文件数量超出限制，最多支持上传3个文件', 'error');
      return;
    }

    const newFilesList = [...compFiles];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
      newFilesList.push({
        name: f.name,
        size: `${sizeMB} MB`,
        type: f.type
      });
    }
    setCompFiles(newFilesList);
    showToast('凭证文件已暂存，等待随单提交', 'success');
  };

  // Remove uploaded item from preview list
  const deleteUploadedFile = (idx: number) => {
    setCompFiles(prev => prev.filter((_, i) => i !== idx));
    showToast('凭证文件已剔除', 'info');
  };

  // Reset Complaint Form
  const resetComplaintForm = () => {
    setCompType('服务质量问题');
    setCompOrder('通用投诉');
    setCompContent('');
    setCompFiles([]);
    setCompPhone('13812345678');
    showToast('表单已重置清空', 'info');
  };

  // Submit Complaint Form Action
  const handleComplaintSubmit = () => {
    if (!compContent.trim() || compContent.length < 50 || compContent.length > 500) {
      showToast('投诉内容长度须在 50 至 500 字之间，请予以充实或化简', 'error');
      return;
    }

    if (!compPhone.trim()) {
      showToast('联系电话为必填项！', 'error');
      return;
    }

    // Append new complaint record
    const newId = `TS202606${(complaints.length + 1).toString().padStart(3, '0')}`;
    const newComplaint: ComplaintItem = {
      id: newId,
      type: compType,
      submittedTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'pending', // 待处理
      content: compContent,
      associatedOrder: compOrder,
      images: compFiles.map(f => f.name),
      phone: compPhone,
      timeline: [
        { 
          time: new Date().toISOString().replace('T', ' ').slice(0, 19), 
          title: '投诉成功提交', 
          desc: '您的反馈已成功转入运营级闭环中心。我们将在 3 个工作日内进行核查处置并给您答复。' 
        }
      ]
    };

    setComplaints([newComplaint, ...complaints]);
    
    // Clear and Toast
    setCompContent('');
    setCompFiles([]);
    setComplaintTab('records'); // Switch to view records list
    showToast('投诉提交成功，我们将在 3 个工作日内处理并回复您', 'success');
  };

  // Submit Complaint rating processing feedback
  const submitComplaintFeedback = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          resultRating: tempResolveScore
        };
      }
      return c;
    }));

    // Update the dialog state instantly
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint(prev => prev ? { ...prev, resultRating: tempResolveScore } : null);
    }

    showToast('处理满意度评价已成功留档，感谢您的信赖！', 'success');
  };

  return (
    <div id="service-feedback-portal" className="h-full flex flex-col overflow-hidden bg-[#f0f4f8] relative">
      
      {/* Dynamic Toast Alert Portal inside Viewport */}
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-xl border backdrop-blur animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-semibold
          ${toast.type === 'success' ? 'bg-emerald-900/95 text-white border-emerald-500' : 
            toast.type === 'error' ? 'bg-rose-900/95 text-white border-rose-500' : 'bg-slate-900/95 text-white border-slate-700'}`}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Clock className="w-4 h-4 text-blue-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Container Header Workspace */}
      <div className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 bg-blue-100 text-blue-700 rounded-md">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h1 className="text-base font-bold text-gray-900">企业服务反馈中心</h1>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium border border-slate-200">
              企业端 &gt; 服务反馈
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            针对安全防灾服务进行专业评分，或向我们发起投诉建议，信息在3条精炼步骤内极速交底，同步运营端全流程闭环管护。
          </p>
        </div>

        {/* Parallel Double top-level SubMenus (Evaluating vs Complaints) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            id="sub-menu-eval-btn"
            onClick={() => setActiveMenu('evaluation')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMenu === 'evaluation' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>服务评价</span>
            {evaluations.filter(e => !e.evaluated).length > 0 && (
              <span className="bg-rose-500 text-white font-mono text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {evaluations.filter(e => !e.evaluated).length}
              </span>
            )}
          </button>
          
          <button
            id="sub-menu-comp-btn"
            onClick={() => setActiveMenu('complaint')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMenu === 'complaint' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>投诉建议</span>
            {complaints.filter(c => c.status === 'processing' || c.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-white font-mono text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {complaints.filter(c => c.status === 'processing' || c.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Content Panel Viewport */}
      <div className="flex-1 overflow-hidden min-h-0">
        
        {/* VIEW A: SERVICE EVALUATIONS (服务评价) */}
        {activeMenu === 'evaluation' && (
          <div className="h-full flex flex-col overflow-hidden">
            
            {/* Top Internal Tab Selection */}
            <div className="bg-white border-b border-gray-100 px-6 py-2 flex justify-between items-center shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => setEvalTab('pending')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all relative ${
                    evalTab === 'pending'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  待评价列表
                  {evaluations.filter(e => !e.evaluated).length > 0 && (
                    <span className="ml-1.5 bg-rose-500 text-white text-[9.5px] px-1.5 py-0.2 rounded-full font-mono">
                      {evaluations.filter(e => !e.evaluated).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setEvalTab('completed')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all relative ${
                    evalTab === 'completed'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  历史已评价
                  <span className="ml-1.5 bg-slate-100 text-slate-500 text-[9.5px] px-1.5 py-0.2 rounded-full font-mono border border-slate-200">
                    {evaluations.filter(e => e.evaluated).length}
                  </span>
                </button>
              </div>

              {/* Filtering mechanism for historical tab */}
              {evalTab === 'completed' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">服务时间区间:</span>
                  <select
                    value={timeFilter}
                    onChange={(e: any) => setTimeFilter(e.target.value)}
                    className="bg-slate-50 border border-gray-200 rounded px-2.5 py-1 text-[11px] text-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">查看全部历史评价</option>
                    <option value="month">仅本月内完工件 (2026年6月)</option>
                    <option value="quarter">第二季度完成阶段 (4月-6月)</option>
                  </select>
                </div>
              )}

              {/* Explanation tip for pending tab */}
              {evalTab === 'pending' && (
                <div className="flex items-center gap-1.5 bg-indigo-50/70 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-[10px] max-w-sm">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>服务完工超过 <b>7天</b> 未评价，系统将自动核算为五星极优好评并归档为历史。</span>
                </div>
              )}
            </div>

            {/* List scroll panel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {/* EVAL SUB TAB 1: PENDING RATING */}
              {evalTab === 'pending' && (
                <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-6">企业关联/服务工单名称</th>
                          <th className="py-3 px-4">完成时间</th>
                          <th className="py-3 px-4">所属对口技术大类</th>
                          <th className="py-3 px-6 text-right">服务操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {evaluations.filter(e => !e.evaluated).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 px-6 text-center text-gray-400">
                              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                              <p className="font-semibold text-xs text-gray-600">已圆满审结所有带评价事务！</p>
                              <p className="text-[10px] text-gray-400 mt-1">谢谢您的反馈和配合，我们会严控事故防灾时效。</p>
                            </td>
                          </tr>
                        ) : (
                          evaluations.filter(e => !e.evaluated).map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-4 px-6 font-semibold text-gray-800">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium mr-2">
                                  {item.id}
                                </span>
                                {item.enterpriseName} &gt; <span className="text-gray-900 font-bold">{item.serviceName}</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-gray-500">{item.completedTime}</td>
                              <td className="py-4 px-4">
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                                  {item.serviceType}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => openEvalModal(item)}
                                  className="bg-blue-600 hover:bg-blue-700 hover:shadow-xs active:scale-[0.98] text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 inline-flex"
                                >
                                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                  <span>立即评价</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* EVAL SUB TAB 2: COMPLETED RATING LIST */}
              {evalTab === 'completed' && (
                <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-6">企业关联/服务工单名称</th>
                          <th className="py-3 px-4">服务完工日</th>
                          <th className="py-3 px-4">服务类型</th>
                          <th className="py-3 px-4">核准满意度评分</th>
                          <th className="py-3 px-4">评价落款时间</th>
                          <th className="py-3 px-6 text-right">详情</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {filteredCompletedEvals.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 px-6 text-center text-gray-400">
                              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="font-semibold text-xs text-gray-600">在此日期区间未查出合规历史评价</p>
                              <p className="text-[10px] text-gray-400 mt-1">请重调上方服务时间区间条件筛选查看。</p>
                            </td>
                          </tr>
                        ) : (
                          filteredCompletedEvals.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-4 px-6 font-semibold text-gray-800">
                                {item.enterpriseName} &gt; <span className="text-gray-900 font-bold">{item.serviceName}</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-gray-500">{item.completedTime}</td>
                              <td className="py-4 px-4">
                                <span className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-gray-200">
                                  {item.serviceType}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star 
                                      key={idx} 
                                      className={`w-3.5 h-3.5 ${
                                        idx < (item.score || 5) 
                                          ? 'text-amber-400 fill-amber-400' 
                                          : 'text-gray-200'
                                      }`} 
                                    />
                                  ))}
                                  <span className="ml-1.5 text-[11px] font-bold text-gray-700">{(item.score || 5)}.0</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-mono text-slate-500">{item.evaluatedTime || '-'}</td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setViewEvalDetail(item)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-bold"
                                >
                                  查看详情
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW B: COMPLAINTS & SUGGESTIONS (投诉建议) */}
        {activeMenu === 'complaint' && (
          <div className="h-full flex flex-col overflow-hidden">
            
            {/* Split Top Tab */}
            <div className="bg-white border-b border-gray-100 px-6 py-2 flex justify-between items-center shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => setComplaintTab('submit')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all relative ${
                    complaintTab === 'submit'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  我要提交投诉
                </button>

                <button
                  onClick={() => setComplaintTab('records')}
                  className={`py-3 text-xs font-bold tracking-wide border-b-2 transition-all relative ${
                    complaintTab === 'records'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  我的申诉反馈记录
                  <span className="ml-1.5 bg-slate-100 text-slate-600 text-[9.5px] px-1.5 py-0.2 rounded-full font-mono border border-slate-200">
                    {complaints.length}
                  </span>
                </button>
              </div>

              <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-500" />
                <span>投诉热点：1分内快速发起，客服组多维度在3个工作日内响应复核回复。</span>
              </div>
            </div>

            {/* Content panel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {/* COMPLAINT SUB TAB 1: FORM VIEW */}
              {complaintTab === 'submit' && (
                <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 space-y-6">
                  
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>1分钟快速建立问题反馈</span>
                      <span className="text-[10.5px] font-normal text-rose-500">(*为必填项)</span>
                    </h2>
                    <p className="text-[10.5px] text-gray-400 mt-1">
                      针对下发防灾标准的到场速度、专家操守、检验成果有瑕庇、或者系统使用卡死，均可发起。我们坚守100%督办机制。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                    
                    {/* Complaint Type selection */}
                    <div className="md:col-span-12 space-y-2">
                      <label className="block text-xs font-black text-gray-700">
                        投诉问题定位大类 <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {[
                          '服务质量问题',
                          '服务时效问题（迟到、逾期）',
                          '专家行为问题（推销、态度差）',
                          '系统使用问题',
                          '其他建议'
                        ].map((type) => {
                          const isSelected = compType === type;
                          return (
                            <div
                              key={type}
                              onClick={() => setCompType(type)}
                              className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-2xs'
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50/50 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-[11px] leading-snug">{type.replace(/（.*）/, '')}</div>
                              <div className="text-[8.5px] text-gray-400 scale-[0.9] origin-center mt-1 leading-none">
                                {type.includes('迟到') ? '时效稽查' : 
                                 type.includes('推销') ? '操守风控' : 
                                 type.includes('质量') ? '技术偏差' : 
                                 type.includes('系统') ? '系统报错' : '其他建言'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Associated Order Selection */}
                    <div className="md:col-span-12 space-y-1.5">
                      <label className="block text-xs font-black text-gray-700">
                        关联对应事故预防工单 <span className="text-gray-400">(可选, 不选默认定调通用投诉)</span>
                      </label>
                      <select
                        value={compOrder}
                        onChange={(e) => setCompOrder(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg p-2.5 outline-none transition-all"
                      >
                        <option value="通用投诉">-- 请点击关联近3个月内完工保单工单 (不选择代表通用服务问题) --</option>
                        <option value="重大事故隐患排查 (工单号: EV-001)">XX 企业 &gt; 重大事故隐患排查 (完成：2026-06-15)</option>
                        <option value="应急预案编制与应急演练 (工单号: EV-002)">XX 企业 &gt; 应急预案编制与应急演练 (完成：2026-06-21)</option>
                        <option value="安全风险辨识评估辅导 (工单号: EV-003)">高大制造限公司 &gt; 安全风险辨识评估 (完成：2026-06-22)</option>
                      </select>
                    </div>

                    {/* Details content Description box */}
                    <div className="md:col-span-12 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-black text-gray-700">
                          投诉问题及事实核实具体陈述 <span className="text-rose-500">*</span>
                        </label>
                        <span className={`text-[10px] font-bold ${
                          compContent.length < 50 || compContent.length > 500 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          当前字数: {compContent.length} / 限制 50 - 500 字
                        </span>
                      </div>
                      
                      <textarea
                        value={compContent}
                        onChange={(e) => setCompContent(e.target.value)}
                        placeholder="为了便于专家组及技术人员深入现场二次排查纠偏，请详细描述您遇到的问题或建议，字数限50字以上。列如：专家来现场开展特种用电探伤，未持有高低防电测试工具就直接通过观察，出具不配用表结论..."
                        rows={5}
                        className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 focus:bg-white p-3 rounded-lg outline-none transition-all placeholder:text-gray-400 leading-relaxed text-gray-700 resize-none"
                      />
                      {compContent.length > 0 && compContent.length < 50 && (
                        <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>还需要再补充 {50 - compContent.length} 个字方能提交</span>
                        </p>
                      )}
                    </div>

                    {/* File Attachment Upload */}
                    <div className="md:col-span-12 space-y-1.5">
                      <label className="block text-xs font-black text-gray-700">
                        现场证明凭证文件或照片上传 <span className="text-gray-400">(可选, 最多可存放 3 张图片或 1 份 PDF 备份)</span>
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-200/90 rounded-xl hover:border-blue-500 transition-all p-6 text-center cursor-pointer relative bg-slate-50/50 hover:bg-slate-50">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-gray-600">点击上传 或 拖拽照片文件至此</p>
                        <p className="text-[10.5px] text-gray-400 mt-1">
                          支持上传 1-3 张图片（JPG/PNG）或且 1 份 PDF 文件（单文件限容量不超过 5MB）
                        </p>
                      </div>

                      {/* Display Uploaded File list */}
                      {compFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {compFiles.map((f, fIdx) => (
                            <div 
                              key={fIdx}
                              className="bg-white border border-gray-200 p-2 rounded-lg text-[11px] flex items-center gap-2 shadow-2xs group"
                            >
                              {f.type.includes('pdf') ? (
                                <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              ) : (
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-700 truncate max-w-[150px]">{f.name}</p>
                                <p className="text-[9px] text-gray-400 font-mono">{f.size}</p>
                              </div>
                              <button
                                onClick={() => deleteUploadedFile(fIdx)}
                                className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-slate-100/80 transition-colors ml-1"
                                title="删除"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact details */}
                    <div className="md:col-span-12 space-y-1.5">
                      <label className="block text-xs font-black text-gray-700">
                        经办对口联系电话 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={compPhone}
                          onChange={(e) => setCompPhone(e.target.value)}
                          placeholder="请输入随单回访电话号码..."
                          className="w-full bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-3 py-2.5 outline-none transition-all font-mono font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">系统已自企业基础账户信息库预拉电话数据，支持手动覆盖修改。</p>
                    </div>

                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-end gap-3.5">
                    <button
                      onClick={resetComplaintForm}
                      className="px-5 py-2 border border-gray-200 text-gray-500 hover:bg-slate-50 font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                      表单重置
                    </button>
                    <button
                      onClick={handleComplaintSubmit}
                      disabled={compContent.length < 50}
                      className={`px-6 py-2 font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                        compContent.length < 50 
                          ? 'bg-slate-300 cursor-not-allowed opacity-80' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>立即提交投诉</span>
                    </button>
                  </div>

                </div>
              )}

              {/* COMPLAINT SUB TAB 2: HISTORY RECORD LIST */}
              {complaintTab === 'records' && (
                <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-6">投诉流水编号</th>
                          <th className="py-3 px-4">纠纷问题类型</th>
                          <th className="py-3 px-4">投诉提交日期时间</th>
                          <th className="py-3 px-4">跟踪流程处理状态</th>
                          <th className="py-3 px-6 text-right">经办动作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {complaints.map((item) => {
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-4 px-6 font-bold font-mono text-gray-900">
                                {item.id}
                              </td>
                              <td className="py-4 px-4 font-semibold text-gray-800">
                                {item.type}
                              </td>
                              <td className="py-4 px-4 font-mono text-gray-500">{item.submittedTime}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-black border tracking-wide ${
                                  item.status === 'pending' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                  item.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {item.status === 'pending' ? '⚬ 待处理' :
                                   item.status === 'processing' ? '● 处理中' :
                                   item.status === 'resolved' ? '✓ 已办结' : '✕ 已驳回'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedComplaint(item);
                                    setTempResolveScore(item.resultRating || 5);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                                >
                                  {item.status === 'processing' ? '查看进度' : '查看详情'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* ======================= MODAL PORTALS ==================== */}
      {/* ========================================================= */}

      {/* Modal 1: Submit Service Rating Modal */}
      {activeEvalItem && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider font-mono">
                  {activeEvalItem.id}
                </span>
                <h3 className="text-xs font-bold text-gray-900 mt-1">满意度评价反馈确认</h3>
              </div>
              <button 
                onClick={() => setActiveEvalItem(null)} 
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-slate-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs text-slate-700">
              
              {/* Order quick metadata view */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">工单关联对象</p>
                <p className="font-bold text-slate-800 text-[12px] mt-0.5">
                  {activeEvalItem.enterpriseName} &gt; {activeEvalItem.serviceName}
                </p>
                <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
                  <span>完成时间: <b className="font-mono">{activeEvalItem.completedTime}</b></span>
                  <span>类别: <b className="text-blue-600">{activeEvalItem.serviceType}</b></span>
                </div>
              </div>

              {/* Score section (Default 5 star clickable) */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-gray-600 block">总体满意度评分 (默认为5星好评) <span className="text-rose-500">*</span></label>
                <div className="flex items-center justify-center gap-1.5 py-2">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const filled = idx < evalScore;
                    return (
                      <button
                        key={idx}
                        onClick={() => setEvalScore(idx + 1)}
                        className="transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            filled 
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs' 
                              : 'text-gray-200'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                  {evalScore === 5 ? '「五星级 · 专业高效极致完工」' :
                   evalScore === 4 ? '「四星级 · 质量可靠配合优良」' :
                   evalScore === 3 ? '「三星级 · 表现平平差强人意」' :
                   evalScore === 2 ? '「二星级 · 稍显迟钝技术失水」' : '「一星级 · 亟待专项核查督纠」'}
                </p>
              </div>

              {/* Tag preset selectors chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">服务标签特写评定 (可选, 点击支持多选分类)</label>
                <div className="flex flex-wrap gap-1.5">
                  {RATING_TAG_PRESETS.map((tag) => {
                    const isSelected = selectedEvalTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleRatingTag(tag)}
                        className={`px-3 py-1 text-[10.5px] rounded-full font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short comments textbox */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-gray-600">补充具体留言说明 (建议选用)</label>
                  <span className="text-[10px] text-gray-400">{evalComment.length} / 100 字</span>
                </div>
                <textarea
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value.slice(0, 100))}
                  placeholder="如有其他建设性意见，请在此处给工程师或平台留言反馈，限100字..."
                  rows={3}
                  className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg p-2.5 outline-none text-xs text-gray-700 resize-none leading-relaxed transition-all placeholder:text-gray-400"
                />
              </div>

            </div>

            <div className="bg-slate-50 px-5 py-3.5 border-t border-gray-100 flex justify-end gap-2.5">
              <button
                onClick={() => setActiveEvalItem(null)}
                className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-gray-500 transition-colors"
              >
                取消
              </button>
              <button
                onClick={submitRating}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 hover:shadow-xs rounded-lg text-xs font-bold text-white transition-all active:scale-[0.98]"
              >
                提交评价
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: View Rating Details (Read Only) */}
      {viewEvalDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>详尽完工评价信息查询</span>
              </h3>
              <button 
                onClick={() => setViewEvalDetail(null)} 
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-slate-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">项目/大项</span>
                <p className="font-bold text-gray-900 text-[12.5px] mt-0.5">{viewEvalDetail.enterpriseName} &gt; {viewEvalDetail.serviceName}</p>
                <p className="text-[10px] text-slate-400 mt-1">服务类型：{viewEvalDetail.serviceType} | 完工日：{viewEvalDetail.completedTime}</p>
              </div>

              <div>
                <span className="text-[10.5px] text-gray-400 font-bold block mb-1">满意度评分</span>
                <div className="flex items-center gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${
                        idx < (viewEvalDetail.score || 5) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="ml-2 font-bold text-slate-800 text-xs">{(viewEvalDetail.score || 5)}.0 星评级</span>
                </div>
              </div>

              {viewEvalDetail.tags && viewEvalDetail.tags.length > 0 && (
                <div>
                  <span className="text-[10.5px] text-gray-400 font-bold block mb-1">选列标签要素</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewEvalDetail.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10.5px] text-gray-400 font-bold block mb-1">补充点评说明</span>
                <p className="p-3 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed italic border border-slate-100">
                  “ {viewEvalDetail.comment || '未填写具体说明。' } ”
                </p>
              </div>

              {viewEvalDetail.evaluatedTime && (
                <div className="text-[10px] text-gray-400 text-right">
                  <span>发表评价完成：{viewEvalDetail.evaluatedTime}</span>
                </div>
              )}

            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewEvalDetail(null)}
                className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-colors"
              >
                返回阅读
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 3: View Complaint Status, Timeline Tracker and Submit Evaluation for Resolved Complaints */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <span className="bg-slate-200/80 text-slate-700 font-bold px-2 py-0.5 rounded font-mono text-[9px]">
                  {selectedComplaint.id}
                </span>
                <span className={`ml-2 px-2 py-0.5 rounded text-[9px] font-black border tracking-wider uppercase ${
                  selectedComplaint.status === 'pending' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                  selectedComplaint.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  selectedComplaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {selectedComplaint.status === 'pending' ? '待处理' :
                   selectedComplaint.status === 'processing' ? '受理跟进中' :
                   selectedComplaint.status === 'resolved' ? '处理结办' : '已驳回'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)} 
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-slate-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-5 text-xs text-slate-700">
              
              {/* Core summary card */}
              <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                    {selectedComplaint.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">完工时间：{selectedComplaint.submittedTime}</span>
                </div>
                
                <p className="text-gray-900 font-semibold text-xs leading-relaxed">
                  反映诉求：{selectedComplaint.content}
                </p>

                <div className="pt-2 border-t border-dashed border-gray-200 text-[10px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>相关订单：<b>{selectedComplaint.associatedOrder}</b></span>
                  <span>留档手机：<b className="font-mono text-slate-600">{selectedComplaint.phone}</b></span>
                </div>

                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] text-gray-400 font-bold">附带凭证文件件 ({selectedComplaint.images.length})：</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedComplaint.images.map((img, i) => (
                        <div key={i} className="bg-white border border-gray-200 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-semibold text-slate-600">
                          {img.toLowerCase().includes('pdf') ? (
                            <FileText className="w-3 h-3 text-rose-500" />
                          ) : (
                            <ImageIcon className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>{img}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Handling Timeline Stages */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1 border-b border-gray-100 pb-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>处理动态实时追踪轨迹 timeline</span>
                </p>

                <div className="relative pl-6 border-l border-slate-200 space-y-5 ml-2 mt-2">
                  {selectedComplaint.timeline.map((node, nIdx) => {
                    const isLast = nIdx === selectedComplaint.timeline.length - 1;
                    return (
                      <div key={nIdx} className="relative">
                        
                        {/* Timeline node badge icon */}
                        <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-mono leading-none ${
                          isLast 
                          ? 'bg-blue-600 border-blue-200 text-white animate-pulse' 
                          : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {nIdx + 1}
                        </span>

                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <h4 className="font-bold text-slate-800 text-[11.5px]">{node.title}</h4>
                            <span className="text-[9.5px] font-mono text-gray-400">{node.time}</span>
                          </div>
                          <p className="text-[10.5px] text-gray-400 leading-normal">
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resolved exclusive feedback area (评价处理结果) */}
              {selectedComplaint.status === 'resolved' && (
                <div className="pt-4 border-t border-dashed border-gray-200 space-y-2.5">
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                      <span>企业评价本次投诉解决结果</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">
                      您的评价是评判保费服务团队及纠正效率的关键考量，请慎重点击，登记后永久留底生效。
                    </p>

                    {selectedComplaint.resultRating !== undefined ? (
                      <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100 text-xs">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>已登记本单处理满意度系数为:</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < (selectedComplaint.resultRating || 5) 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-gray-200'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="font-bold">({selectedComplaint.resultRating}.0 星好评)</span>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
                        {/* Interactive stars */}
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const active = i < tempResolveScore;
                            return (
                              <button
                                key={i}
                                onClick={() => setTempResolveScore(i + 1)}
                                className="transition-transform hover:scale-125 focus:outline-none"
                              >
                                <Star 
                                  className={`w-5 h-5 ${
                                    active 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-gray-200'
                                  }`} 
                                />
                              </button>
                            );
                          })}
                          <span className="text-[11px] font-bold text-gray-500 ml-1">({tempResolveScore}.0分)</span>
                        </div>

                        <button
                          onClick={() => submitComplaintFeedback(selectedComplaint.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded"
                        >
                          确认此评分
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-colors"
              >
                完结返回
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
