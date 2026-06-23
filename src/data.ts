import { ServiceVisitRecord } from "./types";

export const mockVisitRecords: ServiceVisitRecord[] = [
  {
    service_id: "SRV2026062200001",
    service_name: "扬州某某化工有限公司 > 隐患排查服务",
    service_type: 1,
    service_finish_time: "2026-06-20",
    reviewer_id: "REV001",
    reviewer_name: "王强",
    review_time: "2026-06-22",
    service_score: 5,
    insurance_attachment: "",
  },
  {
    service_id: "SRV2026062200002",
    service_name: "江苏某某制造厂 > 安全培训服务",
    service_type: 2,
    service_finish_time: "2026-06-18",
    reviewer_id: "REV001",
    reviewer_name: "王强",
    review_time: "2026-06-19",
    service_score: 4,
    insurance_attachment: "file1.pdf",
    
    // Draft detail mapped mock
    review_id: "REV_REC_002",
    q1_score: 4,
    q2_answer: 1,
    q3_answer: 2,
    q4_answer: 1,
    q5_answer: 2,
    q6_answer: 1,
    q7_answer: 1,
    q8_answer: 2,
    q9_answer: 1,
    remark: "企业反映培训效果较好，希望增加实操环节。",
    enterprise_attachment: "sign.jpg"
  },
  {
    service_id: "SRV2026062200003",
    service_name: "扬州某某电子科技有限公司 > 应急演练服务",
    service_type: 3,
    service_finish_time: "2026-06-15",
    reviewer_id: "REV002",
    reviewer_name: "李娜",
    review_time: "2026-06-16",
    service_score: 3,
    insurance_attachment: "file2.pdf,file3.jpg",
  },
  {
    service_id: "SRV2026062200004",
    service_name: "扬州某某建筑集团 > 风险评估服务",
    service_type: 4,
    service_finish_time: "2026-06-10",
    reviewer_id: "REV001",
    reviewer_name: "王强",
    review_time: "2026-06-12",
    service_score: 5,
    insurance_attachment: "",
  }
];
