export type JobCategory = "government" | "private" | "teaching";

export interface BaseJob {
  id: string;
  job_hash: string;
  category: JobCategory;
  title: string;
  slug?: string;
  sector: string;
  state: string;
  description: string;
  apply_url: string;
  posted_date: string;
  is_active: boolean;
  department_or_company?: string;
  qualification?: string;
  salary?: string;
  last_date?: string;
  has_direct_pdf?: boolean;
  official_pdf_fallback?: string;
  [key: string]: any;
}

export interface GovtJob extends BaseJob {
  category: "government" | "teaching";
  department_or_board: string;
  gov_sector: string;
  notification_pdf_url?: string | null;
  official_pdf_fallback?: string;
  has_direct_pdf?: boolean;
  vacancies_count: number;
  last_date_to_apply: string;
  qualification: string;
  age_limit: string;
  exam_date?: string;
  fee_details?: string;
  state_or_location: string;
}

export interface PrivateJob extends BaseJob {
  category: "private";
  company_name: string;
  company_logo_url?: string;
  work_location: string;
  experience_level: string;
  employment_type: string;
  salary_range: string;
  skills_tags: string[];
  source_portal: string;
}

export type Job = GovtJob | PrivateJob;

export interface JobFilterState {
  category: "all" | "government" | "teaching" | "private";
  searchQuery: string;
  govBoard: string;
  state: string;
  sector: string;
  qualification: string;
  experience: string;
  employmentType: string;
  onlyActive: boolean;
}

export const INITIAL_JOBS_DATA: Job[] = [
  {
    "job_hash": "af663af8031eb79be785dbf1738e8067917f252a4c260fd6aeb7815667bed022",
    "title": "SSC CHSL (10+2) Tier-1 Combined Higher Secondary Exam 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Staff Selection Commission (SSC)",
    "department_or_board": "Staff Selection Commission (SSC)",
    "qualification": "12th Standard Pass (Higher Secondary)",
    "last_date": "2026-10-20",
    "last_date_to_apply": "2026-10-20",
    "last_date_parsed": "2026-10-20",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Pay Level-2 & Level-4 (₹19,900 - ₹81,100)",
    "salary_range": "Pay Level-2 & Level-4 (₹19,900 - ₹81,100)",
    "apply_url": "https://ssc.gov.in/",
    "official_pdf": "https://ssc.gov.in/api/attachment/uploads/docUpload/CHSL_2026_Notice.pdf",
    "notification_pdf_url": "https://ssc.gov.in/api/attachment/uploads/docUpload/CHSL_2026_Notice.pdf",
    "official_pdf_fallback": "https://ssc.gov.in/",
    "has_direct_pdf": false,
    "vacancies_count": 3712,
    "vacancies_display": "3,712 Posts",
    "fee_details": "Gen/OBC: ₹100, SC/ST/Women: ₹0",
    "age_limit": "18 - 27 Years",
    "description": "Official recruitment announcement by Staff Selection Commission (SSC) for SSC CHSL (10+2) Tier-1 Combined Higher Secondary Exam 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-1"
  },
  {
    "job_hash": "ede2f8c05d8104d22412676203d762479c8a04fb3e10a979bb856f4d648143b2",
    "title": "UPSC NDA & NA Examination (II) 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Union Public Service Commission (UPSC)",
    "department_or_board": "Union Public Service Commission (UPSC)",
    "qualification": "12th Class Pass with Physics, Chemistry & Mathematics",
    "last_date": "2026-10-05",
    "last_date_to_apply": "2026-10-05",
    "last_date_parsed": "2026-10-05",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Cadet Training Stipend ₹56,100/Month",
    "salary_range": "Cadet Training Stipend ₹56,100/Month",
    "apply_url": "https://upsconline.nic.in/",
    "official_pdf": "https://upsc.gov.in/sites/default/files/Notice-NDA-II-2026.pdf",
    "notification_pdf_url": "https://upsc.gov.in/sites/default/files/Notice-NDA-II-2026.pdf",
    "official_pdf_fallback": "https://upsconline.nic.in/",
    "has_direct_pdf": false,
    "vacancies_count": 404,
    "vacancies_display": "404 Posts",
    "fee_details": "Gen/OBC: ₹100, SC/ST/Female: ₹0",
    "age_limit": "Born between 02 Jan 2008 and 01 Jan 2011",
    "description": "Official recruitment announcement by Union Public Service Commission (UPSC) for UPSC NDA & NA Examination (II) 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-2"
  },
  {
    "job_hash": "30de8cbbfda57d56aa77ee97862b39deedc2f5ee40325f96cc1c2c2557881f2a",
    "title": "RRB Assistant Loco Pilot (ALP) & Technician Recruitment 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Railway Recruitment Control Board (RRCB)",
    "department_or_board": "Railway Recruitment Control Board (RRCB)",
    "qualification": "Matriculation / 10th + ITI in relevant trade or Diploma in Engg",
    "last_date": "2026-10-18",
    "last_date_to_apply": "2026-10-18",
    "last_date_parsed": "2026-10-18",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Pay Level-2 (₹19,900 + Running Allowance)",
    "salary_range": "Pay Level-2 (₹19,900 + Running Allowance)",
    "apply_url": "https://www.rrbapply.gov.in/",
    "official_pdf": "https://indianrailways.gov.in/ALP_2026_Notice.pdf",
    "notification_pdf_url": "https://indianrailways.gov.in/ALP_2026_Notice.pdf",
    "official_pdf_fallback": "https://www.rrbapply.gov.in/",
    "has_direct_pdf": false,
    "vacancies_count": 18799,
    "vacancies_display": "18,799 Posts",
    "fee_details": "Gen/OBC: ₹500, Reserved: ₹250",
    "age_limit": "18 - 33 Years",
    "description": "Official recruitment announcement by Railway Recruitment Control Board (RRCB) for RRB Assistant Loco Pilot (ALP) & Technician Recruitment 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-3"
  },
  {
    "job_hash": "915f04c031525e6c7479e3e5103b9e89dc80a24e34c325040d85d5d67ce376d6",
    "title": "India Post GDS (Gramin Dak Sevak - BPM / ABPM / Dak Sevak) 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Department of Posts (India Post)",
    "department_or_board": "Department of Posts (India Post)",
    "qualification": "10th Standard (Matriculation) with Passing Marks in Maths & English",
    "last_date": "2026-10-10",
    "last_date_to_apply": "2026-10-10",
    "last_date_parsed": "2026-10-10",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹12,000 - ₹29,380/Month (TRCA Slab)",
    "salary_range": "₹12,000 - ₹29,380/Month (TRCA Slab)",
    "apply_url": "https://indiapostgdsonline.gov.in/",
    "official_pdf": "https://indiapostgdsonline.gov.in/pdf/GDS_Notification_2026.pdf",
    "notification_pdf_url": "https://indiapostgdsonline.gov.in/pdf/GDS_Notification_2026.pdf",
    "official_pdf_fallback": "https://indiapostgdsonline.gov.in/",
    "has_direct_pdf": false,
    "vacancies_count": 44228,
    "vacancies_display": "44,228 Posts",
    "fee_details": "Gen/OBC/EWS Male: ₹100, Female/SC/ST/PwD: ₹0",
    "age_limit": "18 - 40 Years",
    "description": "Official recruitment announcement by Department of Posts (India Post) for India Post GDS (Gramin Dak Sevak - BPM / ABPM / Dak Sevak) 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-4"
  },
  {
    "job_hash": "f5ae97485e142e4544e1ff46823912ab0e18d2559b7ece22db89088471aa7460",
    "title": "UP Police Sub-Inspector (SI) & Constable Direct Recruitment 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "Uttar Pradesh",
    "state_or_location": "Uttar Pradesh",
    "department_or_company": "Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)",
    "department_or_board": "Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)",
    "qualification": "10+2 (Intermediate) for Constable / Graduation for SI",
    "last_date": "2026-10-12",
    "last_date_to_apply": "2026-10-12",
    "last_date_parsed": "2026-10-12",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Pay Band ₹5,200 - ₹20,200 + Grade Pay ₹2,000 / ₹4,200",
    "salary_range": "Pay Band ₹5,200 - ₹20,200 + Grade Pay ₹2,000 / ₹4,200",
    "apply_url": "https://uppbpb.gov.in/",
    "official_pdf": "https://uppbpb.gov.in/notice/UP_Police_2026_Advt.pdf",
    "notification_pdf_url": "https://uppbpb.gov.in/notice/UP_Police_2026_Advt.pdf",
    "official_pdf_fallback": "https://uppbpb.gov.in/",
    "has_direct_pdf": false,
    "vacancies_count": 60244,
    "vacancies_display": "60,244 Posts",
    "fee_details": "All Candidates: ₹400",
    "age_limit": "18 - 25 Years (Relaxation as per UP Govt norms)",
    "description": "Official recruitment announcement by Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) for UP Police Sub-Inspector (SI) & Constable Direct Recruitment 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-5"
  },
  {
    "job_hash": "c9b34bef09dd41fb04a34ec96821b5213a3f16bfeb2dd1fa17b746ae50c6fb61",
    "title": "West Bengal Police Constable & Lady Constable Recruitment 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "West Bengal",
    "state_or_location": "West Bengal",
    "department_or_company": "West Bengal Police Recruitment Board (WBPRB)",
    "department_or_board": "West Bengal Police Recruitment Board (WBPRB)",
    "qualification": "Madhyamik Examination (10th Pass) from WBBSE",
    "last_date": "2026-10-16",
    "last_date_to_apply": "2026-10-16",
    "last_date_parsed": "2026-10-16",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Level-6 in Pay Matrix (₹22,700 - ₹58,500)",
    "salary_range": "Level-6 in Pay Matrix (₹22,700 - ₹58,500)",
    "apply_url": "https://prb.wb.gov.in/",
    "official_pdf": "https://prb.wb.gov.in/notices/WBPRB_Constable_2026.pdf",
    "notification_pdf_url": "https://prb.wb.gov.in/notices/WBPRB_Constable_2026.pdf",
    "official_pdf_fallback": "https://prb.wb.gov.in/",
    "has_direct_pdf": false,
    "vacancies_count": 11749,
    "vacancies_display": "11,749 Posts",
    "fee_details": "All categories: ₹170, SC/ST of WB: ₹20",
    "age_limit": "18 - 30 Years",
    "description": "Official recruitment announcement by West Bengal Police Recruitment Board (WBPRB) for West Bengal Police Constable & Lady Constable Recruitment 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-6"
  },
  {
    "job_hash": "17e6e4e5099e5b446dec660e01aaa5d7d571fae226c8aa7ff8a825c196f5ac9a",
    "title": "Indian Air Force AFCAT (Air Force Common Admission Test) 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Indian Air Force (IAF / CDAC)",
    "department_or_board": "Indian Air Force (IAF / CDAC)",
    "qualification": "Graduation with minimum 60% & 10+2 with 50% in Physics & Maths",
    "last_date": "Refer to Official Notification",
    "last_date_to_apply": "Refer to Official Notification",
    "last_date_parsed": null,
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Flying Officer Level 10 (₹56,100 - ₹1,77,500 + MSP)",
    "salary_range": "Flying Officer Level 10 (₹56,100 - ₹1,77,500 + MSP)",
    "apply_url": "https://afcat.cdac.in/",
    "official_pdf": "https://afcat.cdac.in/",
    "notification_pdf_url": "https://afcat.cdac.in/",
    "official_pdf_fallback": "https://afcat.cdac.in/",
    "has_direct_pdf": false,
    "vacancies_count": 0,
    "vacancies_display": "Refer to Official Notification",
    "fee_details": "₹550 for all AFCAT entry candidates",
    "age_limit": "20 - 24 Years (Flying Branch)",
    "description": "Official recruitment announcement by Indian Air Force (IAF / CDAC) for Indian Air Force AFCAT (Air Force Common Admission Test) 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-7"
  },
  {
    "job_hash": "9705616294a4a4b62e22df079209b3611b88313989fe5b436fe90f627fa3bc3a",
    "title": "Central Teacher Eligibility Test (CTET 2026 Session)",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Central Board of Secondary Education (CBSE / CTET)",
    "department_or_board": "Central Board of Secondary Education (CBSE / CTET)",
    "qualification": "Senior Secondary with 50% + 2-Yr D.El.Ed / Graduation with B.Ed",
    "last_date": "2026-10-14",
    "last_date_to_apply": "2026-10-14",
    "last_date_parsed": "2026-10-14",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Eligibility Certification for PRT/TGT/PGT Central/State Posts",
    "salary_range": "Eligibility Certification for PRT/TGT/PGT Central/State Posts",
    "apply_url": "https://ctet.nic.in/",
    "official_pdf": "https://ctet.nic.in/document/Information_Bulletin_CTET_2026.pdf",
    "notification_pdf_url": "https://ctet.nic.in/document/Information_Bulletin_CTET_2026.pdf",
    "official_pdf_fallback": "https://ctet.nic.in/",
    "has_direct_pdf": false,
    "vacancies_count": 0,
    "vacancies_display": "Refer to Official Notification",
    "fee_details": "Single Paper: ₹1000 (Gen/OBC), Both Papers: ₹1200",
    "age_limit": "No Upper Age Limit",
    "description": "Official recruitment announcement by Central Board of Secondary Education (CBSE / CTET) for Central Teacher Eligibility Test (CTET 2026 Session).",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-8"
  },
  {
    "job_hash": "d5acbe8d0e7715d21800c59854256c6919960dcbd270117f93609795da32a6c3",
    "title": "BPSC Bihar Shikshak Bharti (TRE 4.0) Primary & Secondary Teachers",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "Bihar",
    "state_or_location": "Bihar",
    "department_or_company": "Bihar Public Service Commission (BPSC Education Dept)",
    "department_or_board": "Bihar Public Service Commission (BPSC Education Dept)",
    "qualification": "D.El.Ed / B.Ed with CTET / BTET / STET Paper 1 & 2",
    "last_date": "2026-10-22",
    "last_date_to_apply": "2026-10-22",
    "last_date_parsed": "2026-10-22",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹35,000 - ₹51,000/Month + HRA & Allowances",
    "salary_range": "₹35,000 - ₹51,000/Month + HRA & Allowances",
    "apply_url": "https://bpsc.bih.nic.in/",
    "official_pdf": "https://bpsc.bih.nic.in/Advt_TRE_4_2026.pdf",
    "notification_pdf_url": "https://bpsc.bih.nic.in/Advt_TRE_4_2026.pdf",
    "official_pdf_fallback": "https://bpsc.bih.nic.in/",
    "has_direct_pdf": false,
    "vacancies_count": 45000,
    "vacancies_display": "45,000 Posts",
    "fee_details": "Gen/OBC/Other State: ₹750, SC/ST/Female of Bihar: ₹200",
    "age_limit": "18 - 37 Years (Male), 18 - 40 Years (Female)",
    "description": "Official recruitment announcement by Bihar Public Service Commission (BPSC Education Dept) for BPSC Bihar Shikshak Bharti (TRE 4.0) Primary & Secondary Teachers.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-9"
  },
  {
    "job_hash": "cf17bfb413bf21e378aeee514d077514f183d511e56cbabe213b1a1d444cae54",
    "title": "ISRO Scientist/Engineer 'SC' (ECE, CSE, Mechanical) 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Indian Space Research Organisation (ISRO)",
    "department_or_board": "Indian Space Research Organisation (ISRO)",
    "qualification": "B.E / B.Tech or equivalent with aggregate minimum 65% marks",
    "last_date": "2026-09-28",
    "last_date_to_apply": "2026-09-28",
    "last_date_parsed": "2026-09-28",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Pay Level-10 (₹56,100 + DA + HRA + Travel)",
    "salary_range": "Pay Level-10 (₹56,100 + DA + HRA + Travel)",
    "apply_url": "https://www.isro.gov.in/Careers.html",
    "official_pdf": "https://www.isro.gov.in/media_isro/pdf/recruitmentNotice/ISRO_ICRB_2026.pdf",
    "notification_pdf_url": "https://www.isro.gov.in/media_isro/pdf/recruitmentNotice/ISRO_ICRB_2026.pdf",
    "official_pdf_fallback": "https://www.isro.gov.in/Careers.html",
    "has_direct_pdf": false,
    "vacancies_count": 320,
    "vacancies_display": "320 Posts",
    "fee_details": "Gen/OBC/EWS Male: ₹250, All Women/SC/ST: ₹0",
    "age_limit": "18 - 28 Years",
    "description": "Official recruitment announcement by Indian Space Research Organisation (ISRO) for ISRO Scientist/Engineer 'SC' (ECE, CSE, Mechanical) 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-10"
  },
  {
    "job_hash": "6dae8b1735c7714bbe509f46639b20472d7576b12f6f69c78cec3af1f8b7cf67",
    "title": "DRDO CEPTAM-11 Senior Technical Assistant (STA-B) & Technician",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Defence Research and Development Organisation (DRDO)",
    "department_or_board": "Defence Research and Development Organisation (DRDO)",
    "qualification": "B.Sc Degree / 3-Year Diploma in Engineering or ITI Certificate",
    "last_date": "2026-10-08",
    "last_date_to_apply": "2026-10-08",
    "last_date_parsed": "2026-10-08",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Pay Matrix Level-6 (₹35,400 - ₹1,12,400)",
    "salary_range": "Pay Matrix Level-6 (₹35,400 - ₹1,12,400)",
    "apply_url": "https://www.drdo.gov.in/careers",
    "official_pdf": "https://www.drdo.gov.in/media/CEPTAM_11_Advt_2026.pdf",
    "notification_pdf_url": "https://www.drdo.gov.in/media/CEPTAM_11_Advt_2026.pdf",
    "official_pdf_fallback": "https://www.drdo.gov.in/careers",
    "has_direct_pdf": false,
    "vacancies_count": 1901,
    "vacancies_display": "1,901 Posts",
    "fee_details": "Gen/OBC/EWS Male: ₹100, SC/ST/PwD/Women: ₹0",
    "age_limit": "18 - 28 Years",
    "description": "Official recruitment announcement by Defence Research and Development Organisation (DRDO) for DRDO CEPTAM-11 Senior Technical Assistant (STA-B) & Technician.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-11"
  },
  {
    "job_hash": "6fd940a0d8573f8e23c91a91b71f5981b1ffa866e31b27557c560650df91999f",
    "title": "IBPS Probationary Officers / Management Trainees (PO/MT-XVI)",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "Institute of Banking Personnel Selection (IBPS)",
    "department_or_board": "Institute of Banking Personnel Selection (IBPS)",
    "qualification": "A Degree (Graduation) in any discipline from a recognized University",
    "last_date": "2026-09-26",
    "last_date_to_apply": "2026-09-26",
    "last_date_parsed": "2026-09-26",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "Scale I Officer (₹52,000 - ₹65,000/Month Initial Gross)",
    "salary_range": "Scale I Officer (₹52,000 - ₹65,000/Month Initial Gross)",
    "apply_url": "https://www.ibps.in/",
    "official_pdf": "https://www.ibps.in/wp-content/uploads/Notification_CRP_PO_XVI.pdf",
    "notification_pdf_url": "https://www.ibps.in/wp-content/uploads/Notification_CRP_PO_XVI.pdf",
    "official_pdf_fallback": "https://www.ibps.in/",
    "has_direct_pdf": false,
    "vacancies_count": 4455,
    "vacancies_display": "4,455 Posts",
    "fee_details": "General/EWS/OBC: ₹850, SC/ST/PwBD: ₹175",
    "age_limit": "20 - 30 Years",
    "description": "Official recruitment announcement by Institute of Banking Personnel Selection (IBPS) for IBPS Probationary Officers / Management Trainees (PO/MT-XVI).",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-12"
  },
  {
    "job_hash": "1c773b1d7c89f8af0e2679d491fd1e612c50221740707bae839a6f21509e4291",
    "title": "SBI Junior Associates (Customer Support & Sales) Clerk 2026",
    "category": "government",
    "sector": "Central SSC & UPSC",
    "gov_sector": "Central SSC & UPSC",
    "state": "All India",
    "state_or_location": "All India",
    "department_or_company": "State Bank of India (SBI)",
    "department_or_board": "State Bank of India (SBI)",
    "qualification": "Graduation in any discipline from a recognized University",
    "last_date": "2026-10-02",
    "last_date_to_apply": "2026-10-02",
    "last_date_parsed": "2026-10-02",
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹29,000 - ₹37,000/Month (Starting Pay ₹19,900 + 2 Advance Increments)",
    "salary_range": "₹29,000 - ₹37,000/Month (Starting Pay ₹19,900 + 2 Advance Increments)",
    "apply_url": "https://bank.sbi/careers",
    "official_pdf": "https://bank.sbi/documents/crpd-r-2026-JA.pdf",
    "notification_pdf_url": "https://bank.sbi/documents/crpd-r-2026-JA.pdf",
    "official_pdf_fallback": "https://bank.sbi/careers",
    "has_direct_pdf": false,
    "vacancies_count": 8773,
    "vacancies_display": "8,773 Posts",
    "fee_details": "General/OBC/EWS: ₹750, SC/ST/PwBD/ESM: ₹0",
    "age_limit": "20 - 28 Years",
    "description": "Official recruitment announcement by State Bank of India (SBI) for SBI Junior Associates (Customer Support & Sales) Clerk 2026.",
    "posted_date": "2026-09-03",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-13"
  },
  {
    "job_hash": "0bc4037db65cc2c4307624820fff08a9abdc0af89d4923c47e284dd5d8d183b3",
    "title": "Software Development Engineer (Frontend - React/Next.js)",
    "category": "private",
    "sector": "Private & Corporate",
    "state": "Karnataka",
    "department_or_company": "Razorpay",
    "company_name": "Razorpay",
    "qualification": "B.Tech / B.E in CS/IT or equivalent",
    "last_date": "Open until filled",
    "last_date_parsed": null,
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹14,00,000 - ₹20,00,000 P.A.",
    "salary_range": "₹14,00,000 - ₹20,00,000 P.A.",
    "apply_url": "https://razorpay.com/jobs/",
    "official_pdf": "https://razorpay.com/jobs/",
    "vacancies_display": "Multiple Openings",
    "description": "Official recruitment announcement by Razorpay for Software Development Engineer (Frontend - React/Next.js).",
    "posted_date": "2026-09-03",
    "source_portal": "Direct Careers Portal",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-14",
    "company_logo_url": "https://ui-avatars.com/api/?name=Razorpay&background=4F46E5&color=fff",
    "work_location": "Karnataka",
    "experience_level": "Fresher / 1-3 Years",
    "employment_type": "Full-time",
    "skills_tags": [
      "Tech",
      "Software",
      "Engineering"
    ]
  },
  {
    "job_hash": "7440c5cc47f5d555f2f759d851deeb49e056c29077112bbe8de9172f1e362a75",
    "title": "Backend Systems Engineer (Golang / High-Throughput)",
    "category": "private",
    "sector": "Private & Corporate",
    "state": "Karnataka",
    "department_or_company": "Swiggy",
    "company_name": "Swiggy",
    "qualification": "B.Tech / MCA",
    "last_date": "Open until filled",
    "last_date_parsed": null,
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹22,00,000 - ₹34,00,000 P.A.",
    "salary_range": "₹22,00,000 - ₹34,00,000 P.A.",
    "apply_url": "https://careers.swiggy.com/",
    "official_pdf": "https://careers.swiggy.com/",
    "vacancies_display": "Multiple Openings",
    "description": "Official recruitment announcement by Swiggy for Backend Systems Engineer (Golang / High-Throughput).",
    "posted_date": "2026-09-03",
    "source_portal": "Direct Careers Portal",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-15",
    "company_logo_url": "https://ui-avatars.com/api/?name=Swiggy&background=4F46E5&color=fff",
    "work_location": "Karnataka",
    "experience_level": "Fresher / 1-3 Years",
    "employment_type": "Full-time",
    "skills_tags": [
      "Tech",
      "Software",
      "Engineering"
    ]
  },
  {
    "job_hash": "8c6c9ff3c7420035f0a2b3ad047151702760093bc70aa84c501132194e56becb",
    "title": "Data Analyst / Business Intelligence Associate",
    "category": "private",
    "sector": "Private & Corporate",
    "state": "Delhi NCR",
    "department_or_company": "Zomato",
    "company_name": "Zomato",
    "qualification": "Any Graduate with SQL & Python skills",
    "last_date": "Open until filled",
    "last_date_parsed": null,
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹8,00,000 - ₹12,50,000 P.A.",
    "salary_range": "₹8,00,000 - ₹12,50,000 P.A.",
    "apply_url": "https://www.zomato.com/careers",
    "official_pdf": "https://www.zomato.com/careers",
    "vacancies_display": "Multiple Openings",
    "description": "Official recruitment announcement by Zomato for Data Analyst / Business Intelligence Associate.",
    "posted_date": "2026-09-03",
    "source_portal": "Direct Careers Portal",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-16",
    "company_logo_url": "https://ui-avatars.com/api/?name=Zomato&background=4F46E5&color=fff",
    "work_location": "Delhi NCR",
    "experience_level": "Fresher / 1-3 Years",
    "employment_type": "Full-time",
    "skills_tags": [
      "Tech",
      "Software",
      "Engineering"
    ]
  },
  {
    "job_hash": "2dc93cf96a4594e93a61ee9ff16a8d4e46cf8b469d8ece2b74ad3c36e5b5a006",
    "title": "DevOps & Cloud Infrastructure Engineer",
    "category": "private",
    "sector": "Private & Corporate",
    "state": "Karnataka",
    "department_or_company": "PhonePe",
    "company_name": "PhonePe",
    "qualification": "B.Tech / B.E",
    "last_date": "Open until filled",
    "last_date_parsed": null,
    "start_date_parsed": null,
    "is_closed": false,
    "salary": "₹26,00,000 - ₹42,00,000 P.A.",
    "salary_range": "₹26,00,000 - ₹42,00,000 P.A.",
    "apply_url": "https://www.phonepe.com/careers/",
    "official_pdf": "https://www.phonepe.com/careers/",
    "vacancies_display": "Multiple Openings",
    "description": "Official recruitment announcement by PhonePe for DevOps & Cloud Infrastructure Engineer.",
    "posted_date": "2026-09-03",
    "source_portal": "Direct Careers Portal",
    "cycle_year": 2026,
    "is_active": true,
    "id": "job-17",
    "company_logo_url": "https://ui-avatars.com/api/?name=PhonePe&background=4F46E5&color=fff",
    "work_location": "Karnataka",
    "experience_level": "Fresher / 1-3 Years",
    "employment_type": "Full-time",
    "skills_tags": [
      "Tech",
      "Software",
      "Engineering"
    ]
  }
];

export const ALL_SECTORS_LIST = [
  "All Sectors",
  "Teaching & Education",
  "Panchayat & Postal",
  "Railway",
  "Police & Defence",
  "Central SSC & UPSC",
  "State PSC & Subordinate",
  "Banking & Finance",
  "PSU & Engineering",
  "Medical & Health",
  "Private & Corporate",
] as const;

export const SECTOR_ICONS_CONFIG = {
  "All Sectors": "Layers",
  "Teaching & Education": "GraduationCap",
  "Panchayat & Postal": "Mail",
  "Railway": "Train",
  "Police & Defence": "ShieldCheck",
  "Central SSC & UPSC": "Landmark",
  "State PSC & Subordinate": "Building",
  "Banking & Finance": "CreditCard",
  "PSU & Engineering": "Cpu",
  "Medical & Health": "Stethoscope",
  "Private & Corporate": "Briefcase",
};

export const GOV_BOARDS_LIST = [
  "All Boards",
  "India Post & Panchayat",
  "Central Teaching (CTET / KVS / NVS)",
  "Medical (AIIMS / NHM)",
  "Staff Selection Commission (SSC)",
  "Union Public Service Commission (UPSC)",
  "Railway Recruitment Board (RRB)",
  "Banking / IBPS / SBI",
  "Defence / Armed Forces",
  "State PSCs (WBPSC, UPPSC, BPSC, JPSC, MPSC)",
  "Police Recruitment Boards",
];

export const INDIAN_STATES_LIST = [
  "All India",
  "West Bengal",
  "Jharkhand",
  "Bihar",
  "Uttar Pradesh",
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "Rajasthan",
  "Madhya Pradesh",
  "Punjab & Haryana",
  "Gujarat",
  "Odisha",
  "Kerala",
  "Assam & North East",
  "Andhra Pradesh",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Jammu & Kashmir",
];

export const QUALIFICATIONS_LIST = [
  "All Qualifications",
  "10th Pass / Matric",
  "12th Pass / Intermediate",
  "B.Ed / D.El.Ed / CTET Qualified",
  "Diploma in Engineering",
  "Graduate / Bachelor's Degree",
  "B.E / B.Tech / BCA",
  "B.Sc Nursing / GNM / MBBS",
  "Post Graduate / Master's Degree",
];

export const EXP_LEVELS_LIST = [
  "All Experience Levels",
  "Fresher (0-1 yrs)",
  "Mid-Level (2-5 yrs)",
  "Senior (5+ yrs)",
  "Internship",
];

export interface DeadlineInfo {
  raw: string;
  parsedDateISO: string | null;
  isClosed: boolean;
  diffDays: number | null;
  daysRemaining: number | null;
  displayText: string;
  badgeVariant: "urgent" | "warning" | "normal" | "closed" | "rolling";
}

export function normalizeDateToISO(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const clean = raw.trim();
  const lower = clean.toLowerCase();

  if (["open", "ongoing", "walk", "immediate", "rolling", "till", "notified", "filled"].some((kw) => lower.includes(kw))) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

  const dmy = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const monthMap: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const dMonY = clean.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dMonY) {
    const [, d, mon, y] = dMonY;
    const mo = monthMap[mon.toLowerCase().slice(0, 3)];
    if (mo) {
      return `${y}-${mo}-${d.padStart(2, "0")}`;
    }
  }

  return null;
}

export function getJobDeadlineInfo(job: Job): DeadlineInfo {
  const raw =
    (job as any).last_date_to_apply ||
    (job as any).last_date ||
    "Refer to Notification";

  const parsedISO = (job as any).last_date_parsed || normalizeDateToISO(raw);

  if (!parsedISO) {
    return {
      raw,
      parsedDateISO: null,
      isClosed: Boolean((job as any).is_closed),
      diffDays: null,
      daysRemaining: null,
      displayText: raw || "Refer to Notification",
      badgeVariant: "rolling",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(parsedISO);
  deadline.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || (job as any).is_closed) {
    return {
      raw,
      parsedDateISO: parsedISO,
      isClosed: true,
      diffDays,
      daysRemaining: diffDays,
      displayText: `Closed on ${parsedISO}`,
      badgeVariant: "closed",
    };
  }

  if (diffDays === 0) {
    return {
      raw,
      parsedDateISO: parsedISO,
      isClosed: false,
      diffDays: 0,
      daysRemaining: 0,
      displayText: "Last Day Today!",
      badgeVariant: "urgent",
    };
  }

  if (diffDays <= 3) {
    return {
      raw,
      parsedDateISO: parsedISO,
      isClosed: false,
      diffDays,
      daysRemaining: diffDays,
      displayText: `${diffDays} Day${diffDays > 1 ? "s" : ""} Left`,
      badgeVariant: "urgent",
    };
  }

  if (diffDays <= 7) {
    return {
      raw,
      parsedDateISO: parsedISO,
      isClosed: false,
      diffDays,
      daysRemaining: diffDays,
      displayText: `${diffDays} Days Left`,
      badgeVariant: "warning",
    };
  }

  return {
    raw,
    parsedDateISO: parsedISO,
    isClosed: false,
    diffDays,
    daysRemaining: diffDays,
    displayText: `${parsedISO} (${diffDays}d left)`,
    badgeVariant: "normal",
  };
}
