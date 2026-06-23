import React, { useState } from "react";
import { Star, Upload, Search, RotateCcw, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ServiceVisitRecord, SERVICE_TYPES } from "../types";
import { mockVisitRecords } from "../data";

interface ServiceVisitListProps {
  onViewDetail: (record: ServiceVisitRecord) => void;
}

export function ServiceVisitList({ onViewDetail }: ServiceVisitListProps) {
  const [data, setData] = useState<ServiceVisitRecord[]>(mockVisitRecords);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchType, setSearchType] = useState("");

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const handleSearch = () => {
    // In a real app, this would fetch from an API
    let filtered = [...mockVisitRecords];
    if (searchKeyword) {
      filtered = filtered.filter(item => item.service_name.includes(searchKeyword));
    }
    if (searchType) {
      filtered = filtered.filter(item => item.service_type === Number(searchType));
    }
    if (searchStartDate) {
      filtered = filtered.filter(item => item.review_time >= searchStartDate);
    }
    if (searchEndDate) {
      filtered = filtered.filter(item => item.review_time <= searchEndDate);
    }
    setData(filtered);
  };

  const handleReset = () => {
    setSearchKeyword("");
    setSearchStartDate("");
    setSearchEndDate("");
    setSearchType("");
    setData(mockVisitRecords);
  };

  const StarRating = ({ score }: { score: number }) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= score ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="bg-white border-b border-gray-100 flex items-center px-4 py-3 gap-2 text-sm text-gray-500 rounded-t-lg shadow-sm mx-4">
        <span className="font-medium text-gray-700">服务回访管理</span>
        <span className="text-gray-300">/</span>
        <span>回访列表</span>
      </div>

      <div className="flex-1 bg-white m-4 mt-0 shadow-sm rounded-b-lg border border-gray-100 flex flex-col relative overflow-hidden">
        {/* Filter Area */}
        <div className="flex items-center flex-wrap gap-4 p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">服务名称:</span>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-60 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
              placeholder="请输入企业名称或服务名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">回访时间:</span>
            <div className="flex items-center gap-1 border border-gray-300 rounded bg-white px-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <input
                type="date"
                className="py-1.5 text-sm outline-none bg-transparent"
                value={searchStartDate}
                onChange={(e) => setSearchStartDate(e.target.value)}
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                className="py-1.5 text-sm outline-none bg-transparent"
                value={searchEndDate}
                onChange={(e) => setSearchEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">服务类型:</span>
            <select
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">全部</option>
              {Object.entries(SERVICE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
             <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-blue-500 text-blue-600 rounded bg-blue-50 hover:bg-blue-100 transition-colors text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </button>
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm border border-blue-600 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              查询
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f8fc] border-b border-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 font-medium border-x border-gray-100 w-12 text-center">序号</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100">服务名称</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">服务类型</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">服务完成时间</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">回访人</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">回访时间</th>
                <th className="px-6 py-3.5 font-medium border-r border-gray-100 text-center">服务评分</th>
                <th className="px-6 py-3.5 font-medium text-center">保司附件</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.service_id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 border-x border-gray-100 text-center text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 border-r border-gray-100">
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => onViewDetail(row)}
                    >
                      {row.service_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">{SERVICE_TYPES[row.service_type]}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-gray-600">{row.service_finish_time}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">{row.reviewer_name}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center font-mono text-gray-600">{row.review_time}</td>
                  <td className="px-6 py-4 border-r border-gray-100 text-center">
                    <StarRating score={row.service_score} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => {
                        setActiveUploadId(row.service_id);
                        setUploadModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline flex items-center justify-center gap-1 w-full"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      上传附件
                    </button>
                    {row.insurance_attachment && (
                      <div className="text-xs text-gray-400 mt-1">已上传</div>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Static Mock) */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-500">
            共 <span className="font-medium text-gray-900">{data.length}</span> 条记录
          </div>
          <div className="flex items-center gap-3">
            <select className="border border-gray-300 rounded px-2 py-1 text-sm outline-none" defaultValue="20 条/页">
              <option>10 条/页</option>
              <option>20 条/页</option>
              <option>50 条/页</option>
              <option>100 条/页</option>
            </select>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button className="px-2 py-1 bg-gray-50 text-gray-400 border-r border-gray-300 hover:bg-gray-100" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 text-sm bg-blue-50 text-blue-600 font-medium">1</div>
              <button className="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              前往 <input type="text" className="w-10 border border-gray-300 rounded text-center py-1 outline-none focus:border-blue-500" defaultValue="1" /> 页
            </div>
          </div>
        </div>
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[480px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-gray-800">上传保司附件</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group hover:border-blue-500">
                <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover:text-blue-500" />
                <div className="text-gray-700 font-medium mb-1">点击或将文件拖拽到这里上传</div>
                <div className="text-xs text-gray-400">支持 PDF, JPG, PNG, MP3 格式，单个文件不超过 50MB</div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-colors text-sm"
              >
                取消
              </button>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm shadow-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
