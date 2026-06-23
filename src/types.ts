export interface ServiceVisitRecord {
  service_id: string;
  service_name: string;
  service_type: number;
  service_finish_time: string;
  reviewer_id: string;
  reviewer_name: string;
  review_time: string;
  service_score: number;
  insurance_attachment: string; // Comma separated URLs

  // Detail fields
  review_id?: string;
  q1_score?: number;
  q2_answer?: number;
  q3_answer?: number;
  q4_answer?: number;
  q5_answer?: number;
  q6_answer?: number;
  q7_answer?: number;
  q8_answer?: number;
  q9_answer?: number;
  remark?: string;
  enterprise_attachment?: string;
}

export const SERVICE_TYPES: Record<number, string> = {
  1: '隐患排查服务',
  2: '安全培训服务',
  3: '应急演练服务',
  4: '风险评估服务',
  5: '其他服务'
};
