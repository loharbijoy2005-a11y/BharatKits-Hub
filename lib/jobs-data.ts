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

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const VAGUE_DATE_KEYWORDS = [
  "open", "ongoing", "walk", "immediate", "rolling", "till", "notified", "filled", "announced",
];

export function normalizeDateToISO(raw?: string | null): string | null {
  if (!raw) return null;
  const clean = raw.trim();
  const lower = clean.toLowerCase();

  if (VAGUE_DATE_KEYWORDS.some((kw) => lower.includes(kw))) {
    return null;
  }

  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const dashMatch = clean.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (dashMatch) {
    const day = dashMatch[1].padStart(2, "0");
    const month = dashMatch[2].padStart(2, "0");
    const year = dashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const textMatch = clean.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (textMatch) {
    const day = textMatch[1].padStart(2, "0");
    const monthPrefix = textMatch[2].toLowerCase().substring(0, 3);
    const year = textMatch[3];
    if (monthPrefix in MONTH_MAP) {
      const monthNum = (MONTH_MAP[monthPrefix] + 1).toString().padStart(2, "0");
      return `${year}-${monthNum}-${day}`;
    }
  }

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
}

export function getJobDeadlineInfo(job: Partial<Job>): {
  isClosed: boolean;
  diffDays: number | null;
  parsedDateISO: string | null;
} {
  const rawDate = job.last_date_parsed || job.last_date_to_apply || job.last_date;
  const parsedDateISO = normalizeDateToISO(rawDate);

  if (!parsedDateISO) {
    return {
      isClosed: Boolean(job.is_closed),
      diffDays: null,
      parsedDateISO: null,
    };
  }

  const parts = parsedDateISO.split("-").map(Number);
  const deadline = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isClosed = diffDays < 0 || Boolean(job.is_closed);

  return {
    isClosed,
    diffDays,
    parsedDateISO,
  };
}

export const INITIAL_JOBS_DATA: Job[] = [
  // ==========================================
  // CENTRAL GOVERNMENT & SSC / UPSC JOBS
  // ==========================================
  {
    id: "govt-ssc-cgl-2026",
    job_hash: "ssc-cgl-2026-hash",
    category: "government",
    title: "SSC CGL Recruitment 2026 (Group B & C Posts)",
    sector: "Central SSC & UPSC",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Staff Selection Commission (SSC)",
    gov_sector: "Central SSC & UPSC",
    qualification: "Graduate / Bachelor's Degree",
    vacancies_count: 17727,
    last_date: "2026-10-15",
    last_date_to_apply: "2026-10-15",
    last_date_parsed: "2026-10-15",
    salary: "₹35,400 - ₹1,42,400 (Level 6 to Level 8)",
    salary_range: "₹35,400 - ₹1,42,400",
    apply_url: "https://ssc.gov.in/",
    notification_pdf_url: "https://ssc.gov.in/",
    official_pdf_fallback: "https://ssc.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 30 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST/Women: ₹0",
    description: "Staff Selection Commission invites online applications for Combined Graduate Level Examination (CGL) for recruitment into Assistant Section Officer, Inspector, Tax Assistant, and Auditor posts across Central Ministries.",
    posted_date: "2026-09-01",
    is_active: true,
  },
  {
    id: "govt-ssc-chsl-2026",
    job_hash: "ssc-chsl-2026-hash",
    category: "government",
    title: "SSC CHSL Recruitment 2026 (LDC, DEO, JSA)",
    sector: "Central SSC & UPSC",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Staff Selection Commission (SSC)",
    gov_sector: "Central SSC & UPSC",
    qualification: "12th Pass / Intermediate",
    vacancies_count: 3712,
    last_date: "2026-10-28",
    last_date_to_apply: "2026-10-28",
    last_date_parsed: "2026-10-28",
    salary: "₹19,900 - ₹63,200 (Level 2 & Level 4)",
    salary_range: "₹19,900 - ₹63,200",
    apply_url: "https://ssc.gov.in/",
    notification_pdf_url: "https://ssc.gov.in/",
    official_pdf_fallback: "https://ssc.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 27 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST/Women: ₹0",
    description: "SSC Combined Higher Secondary Level (10+2) examination for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) in Central Govt offices.",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "govt-ssc-gd-constable-2026",
    job_hash: "ssc-gd-constable-2026-hash",
    category: "government",
    title: "SSC GD Constable Recruitment 2026 (BSF, CISF, CRPF, SSB)",
    sector: "Police & Defence",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Staff Selection Commission (SSC)",
    gov_sector: "Police & Defence",
    qualification: "10th Pass / Matric",
    vacancies_count: 39481,
    last_date: "2026-11-15",
    last_date_to_apply: "2026-11-15",
    last_date_parsed: "2026-11-15",
    salary: "₹21,700 - ₹69,100 (Level 3 Pay Matrix)",
    salary_range: "₹21,700 - ₹69,100",
    apply_url: "https://ssc.gov.in/",
    notification_pdf_url: "https://ssc.gov.in/",
    official_pdf_fallback: "https://ssc.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 23 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST/Women: ₹0",
    description: "Recruitment for General Duty Constables in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF. Computer Based Examination followed by Physical Efficiency Test (PET/PST).",
    posted_date: "2026-09-04",
    is_active: true,
  },
  {
    id: "govt-upsc-ias-civil-services-2026",
    job_hash: "upsc-ias-2026-hash",
    category: "government",
    title: "UPSC Civil Services (IAS / IFS / IPS) Examination 2026",
    sector: "Central SSC & UPSC",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Union Public Service Commission (UPSC)",
    gov_sector: "Central SSC & UPSC",
    qualification: "Graduate / Bachelor's Degree",
    vacancies_count: 1056,
    last_date: "2026-10-10",
    last_date_to_apply: "2026-10-10",
    last_date_parsed: "2026-10-10",
    salary: "₹56,100 - ₹2,50,000 (Level 10 to Level 17)",
    salary_range: "₹56,100 - ₹2,50,000",
    apply_url: "https://upsconline.nic.in/",
    notification_pdf_url: "https://upsc.gov.in/",
    official_pdf_fallback: "https://upsc.gov.in/",
    has_direct_pdf: false,
    age_limit: "21 - 32 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST/PWD/Female: ₹0",
    description: "Premier recruitment examination conducted by UPSC for IAS, IPS, IFS, IRS, and Group A Central Services.",
    posted_date: "2026-09-01",
    is_active: true,
  },

  // ==========================================
  // RAILWAY JOBS (RRB)
  // ==========================================
  {
    id: "govt-rrb-ntpc-2026",
    job_hash: "rrb-ntpc-2026-hash",
    category: "government",
    title: "RRB NTPC & Graduate Cadre Posts Recruitment 2026",
    sector: "Railway",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Railway Recruitment Board (RRB)",
    gov_sector: "Railway",
    qualification: "Graduate / 12th Pass",
    vacancies_count: 11558,
    last_date: "2026-10-30",
    last_date_to_apply: "2026-10-30",
    last_date_parsed: "2026-10-30",
    salary: "₹29,200 - ₹35,400 (Level 5 & 6)",
    salary_range: "₹29,200 - ₹35,400",
    apply_url: "https://www.rrbapply.gov.in/",
    notification_pdf_url: "https://www.rrbapply.gov.in/",
    official_pdf_fallback: "https://www.rrbapply.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 33 Years",
    fee_details: "Gen/OBC: ₹500, SC/ST: ₹250",
    description: "Indian Railways Non-Technical Popular Categories (NTPC) including Station Master, Goods Train Manager, Senior Clerk, and Commercial Apprentice across 21 RRB zones.",
    posted_date: "2026-09-03",
    is_active: true,
  },
  {
    id: "govt-rrb-alp-technician-2026",
    job_hash: "rrb-alp-2026-hash",
    category: "government",
    title: "RRB Assistant Loco Pilot (ALP) & Technician Grade 3",
    sector: "Railway",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Railway Recruitment Board (RRB)",
    gov_sector: "Railway",
    qualification: "10th Pass + ITI / Diploma in Engineering",
    vacancies_count: 18799,
    last_date: "2026-11-08",
    last_date_to_apply: "2026-11-08",
    last_date_parsed: "2026-11-08",
    salary: "₹19,900 - ₹35,000 + Running Allowance",
    salary_range: "₹19,900 - ₹35,000",
    apply_url: "https://www.rrbapply.gov.in/",
    notification_pdf_url: "https://www.rrbapply.gov.in/",
    official_pdf_fallback: "https://www.rrbapply.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 33 Years",
    fee_details: "Gen/OBC: ₹500, SC/ST: ₹250",
    description: "Railway recruitment for Assistant Loco Pilots (ALP) and Technicians in Mechanical, Electrical, Signal, and Telecom branches.",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "govt-rrb-group-d-2026",
    job_hash: "rrb-group-d-2026-hash",
    category: "government",
    title: "RRB Group D (Track Maintainer Grade IV, Helper, Assistant)",
    sector: "Railway",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Railway Recruitment Cell (RRC)",
    gov_sector: "Railway",
    qualification: "10th Pass / ITI",
    vacancies_count: 32000,
    last_date: "2026-11-20",
    last_date_to_apply: "2026-11-20",
    last_date_parsed: "2026-11-20",
    salary: "₹18,000 - ₹56,900 (Level 1 Pay Matrix)",
    salary_range: "₹18,000 - ₹56,900",
    apply_url: "https://www.rrbapply.gov.in/",
    notification_pdf_url: "https://www.rrbapply.gov.in/",
    official_pdf_fallback: "https://www.rrbapply.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 33 Years",
    fee_details: "Gen/OBC: ₹500, SC/ST: ₹250",
    description: "RRC Level 1 posts recruitment for Track Maintainers, Pointsman, Gateman, and Technical Helpers in various Railway divisions.",
    posted_date: "2026-09-04",
    is_active: true,
  },

  // ==========================================
  // BANKING & FINANCE JOBS
  // ==========================================
  {
    id: "govt-ibps-po-2026",
    job_hash: "ibps-po-2026-hash",
    category: "government",
    title: "IBPS Probationary Officer (PO / MT XIV) Recruitment",
    sector: "Banking & Finance",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Institute of Banking Personnel Selection (IBPS)",
    gov_sector: "Banking & Finance",
    qualification: "Graduate / Bachelor's Degree",
    vacancies_count: 6128,
    last_date: "2026-09-30",
    last_date_to_apply: "2026-09-30",
    last_date_parsed: "2026-09-30",
    salary: "₹52,000 - ₹65,000 / month Gross Salary",
    salary_range: "₹52,000 - ₹65,000",
    apply_url: "https://www.ibps.in/",
    notification_pdf_url: "https://www.ibps.in/",
    official_pdf_fallback: "https://www.ibps.in/",
    has_direct_pdf: false,
    age_limit: "20 - 30 Years",
    fee_details: "Gen/OBC/EWS: ₹850, SC/ST/PWD: ₹175",
    description: "Common Recruitment Process for selection of Probationary Officers / Management Trainees in 11 participating Public Sector Banks in India.",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "govt-sbi-clerk-2026",
    job_hash: "sbi-clerk-2026-hash",
    category: "government",
    title: "SBI Junior Associate (Customer Support & Sales / Clerk)",
    sector: "Banking & Finance",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "State Bank of India (SBI)",
    gov_sector: "Banking & Finance",
    qualification: "Graduate / Bachelor's Degree",
    vacancies_count: 8773,
    last_date: "2026-10-18",
    last_date_to_apply: "2026-10-18",
    last_date_parsed: "2026-10-18",
    salary: "₹19,900 - ₹47,920 + Allowances",
    salary_range: "₹19,900 - ₹47,920",
    apply_url: "https://sbi.co.in/web/careers",
    notification_pdf_url: "https://sbi.co.in/web/careers",
    official_pdf_fallback: "https://sbi.co.in/web/careers",
    has_direct_pdf: false,
    age_limit: "20 - 28 Years",
    fee_details: "Gen/OBC/EWS: ₹750, SC/ST/PWD: ₹0",
    description: "State Bank of India recruitment for Junior Associates in clerical cadre across all SBI circles in India. Prelims & Mains online exam.",
    posted_date: "2026-09-03",
    is_active: true,
  },

  // ==========================================
  // POSTAL & PANCHAYAT JOBS
  // ==========================================
  {
    id: "govt-india-post-gds-2026",
    job_hash: "gds-2026-hash",
    category: "government",
    title: "India Post GDS Recruitment 2026 (Gramin Dak Sevak)",
    sector: "Panchayat & Postal",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Department of Posts (India Post)",
    gov_sector: "Panchayat & Postal",
    qualification: "10th Pass / Matric",
    vacancies_count: 44228,
    last_date: "2026-11-10",
    last_date_to_apply: "2026-11-10",
    last_date_parsed: "2026-11-10",
    salary: "₹12,000 - ₹29,380 (TRCA Allowance)",
    salary_range: "₹12,000 - ₹29,380",
    apply_url: "https://indiapostgdsonline.gov.in/",
    notification_pdf_url: "https://indiapostgdsonline.gov.in/",
    official_pdf_fallback: "https://indiapostgdsonline.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 40 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST/PWD: ₹0",
    description: "Department of Posts engagement for Gramin Dak Sevak (GDS), Branch Postmaster (BPM), and Assistant Branch Postmaster (ABPM) across all postal circles. Direct 10th marks merit selection.",
    posted_date: "2026-09-02",
    is_active: true,
  },

  // ==========================================
  // DEFENCE & POLICE RECRUITMENT
  // ==========================================
  {
    id: "govt-indian-army-agniveer-2026",
    job_hash: "army-agniveer-2026-hash",
    category: "government",
    title: "Indian Army Agniveer Rally Recruitment 2026 (GD, Technical, Tradesman)",
    sector: "Police & Defence",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Indian Army (Join Indian Army)",
    gov_sector: "Police & Defence",
    qualification: "8th Pass / 10th Pass / 12th Pass",
    vacancies_count: 25000,
    last_date: "2026-10-31",
    last_date_to_apply: "2026-10-31",
    last_date_parsed: "2026-10-31",
    salary: "₹30,000 - ₹40,000 + Seva Nidhi Package",
    salary_range: "₹30,000 - ₹40,000",
    apply_url: "https://joinindianarmy.nic.in/",
    notification_pdf_url: "https://joinindianarmy.nic.in/",
    official_pdf_fallback: "https://joinindianarmy.nic.in/",
    has_direct_pdf: false,
    age_limit: "17.5 - 21 Years",
    fee_details: "All Candidates: ₹250",
    description: "Indian Army Agnipath scheme online Common Entrance Examination (CEE) followed by Physical Fitness Rally for GD, Clerk, Technical, and Tradesmen entries.",
    posted_date: "2026-09-01",
    is_active: true,
  },
  {
    id: "govt-upsc-cds-2026",
    job_hash: "upsc-cds-2026-hash",
    category: "government",
    title: "UPSC Combined Defence Services (CDS Examination)",
    sector: "Police & Defence",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Union Public Service Commission (UPSC)",
    gov_sector: "Police & Defence",
    qualification: "Graduate / B.E / B.Tech",
    vacancies_count: 459,
    last_date: "2026-10-20",
    last_date_to_apply: "2026-10-20",
    last_date_parsed: "2026-10-20",
    salary: "₹56,100 - ₹1,77,500 (Level 10 Pay Matrix)",
    salary_range: "₹56,100 - ₹1,77,500",
    apply_url: "https://upsconline.nic.in/",
    notification_pdf_url: "https://upsc.gov.in/",
    official_pdf_fallback: "https://upsc.gov.in/",
    has_direct_pdf: false,
    age_limit: "19 - 24 Years",
    fee_details: "Gen/OBC: ₹200, Female/SC/ST: ₹0",
    description: "UPSC entrance for Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), and Officer Training Academy (OTA).",
    posted_date: "2026-09-01",
    is_active: true,
  },

  // ==========================================
  // STATE GOVERNMENT JOBS (WB, BIHAR, UP, JH, RJ)
  // ==========================================
  {
    id: "govt-wb-police-constable-2026",
    job_hash: "wb-police-constable-hash",
    category: "government",
    title: "West Bengal Police Constable & Lady Constable Recruitment",
    sector: "State PSC & Subordinate",
    state: "West Bengal",
    state_or_location: "West Bengal",
    department_or_board: "West Bengal Police Recruitment Board (WBPRB)",
    gov_sector: "State PSC & Subordinate",
    qualification: "10th Pass / Madhyamik",
    vacancies_count: 10255,
    last_date: "2026-10-25",
    last_date_to_apply: "2026-10-25",
    last_date_parsed: "2026-10-25",
    salary: "₹22,700 - ₹58,500 (Pay Level 6)",
    salary_range: "₹22,700 - ₹58,500",
    apply_url: "https://prb.wb.gov.in/",
    notification_pdf_url: "https://prb.wb.gov.in/",
    official_pdf_fallback: "https://prb.wb.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 30 Years",
    fee_details: "All Candidates: ₹170, SC/ST (WB only): ₹20",
    description: "Recruitment of Constables and Lady Constables in West Bengal Police. Selection process includes Preliminary Written Test, PMT/PET, Final Exam, and Interview.",
    posted_date: "2026-09-03",
    is_active: true,
  },
  {
    id: "govt-bihar-bssc-inter-level-2026",
    job_hash: "bihar-bssc-inter-level-hash",
    category: "government",
    title: "Bihar BSSC Second Inter Level Combined Exam (Revenue Staff, LDC)",
    sector: "State PSC & Subordinate",
    state: "Bihar",
    state_or_location: "Bihar",
    department_or_board: "Bihar Staff Selection Commission (BSSC)",
    gov_sector: "State PSC & Subordinate",
    qualification: "12th Pass / Intermediate",
    vacancies_count: 12199,
    last_date: "2026-11-12",
    last_date_to_apply: "2026-11-12",
    last_date_parsed: "2026-11-12",
    salary: "₹19,900 - ₹63,200 (Pay Level 2 & 3)",
    salary_range: "₹19,900 - ₹63,200",
    apply_url: "https://bssc.bihar.gov.in/",
    notification_pdf_url: "https://bssc.bihar.gov.in/",
    official_pdf_fallback: "https://bssc.bihar.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 37 Years",
    fee_details: "Gen/OBC/BC: ₹540, SC/ST/Female: ₹135",
    description: "Bihar SSC recruitment for Revenue Employee (Rajaswa Karmachari), Panchayat Secretary, LDC, and Clerical vacancies across Bihar departments.",
    posted_date: "2026-09-04",
    is_active: true,
  },
  {
    id: "govt-up-police-constable-2026",
    job_hash: "up-police-constable-2026-hash",
    category: "government",
    title: "UP Police Constable Recruitment 2026 (Civil Police & PAC)",
    sector: "Police & Defence",
    state: "Uttar Pradesh",
    state_or_location: "Uttar Pradesh",
    department_or_board: "UP Police Recruitment & Promotion Board (UPPRPB)",
    gov_sector: "Police & Defence",
    qualification: "12th Pass / Intermediate",
    vacancies_count: 60244,
    last_date: "2026-10-14",
    last_date_to_apply: "2026-10-14",
    last_date_parsed: "2026-10-14",
    salary: "₹21,700 - ₹69,100 (Grade Pay ₹2000)",
    salary_range: "₹21,700 - ₹69,100",
    apply_url: "https://uppbpb.gov.in/",
    notification_pdf_url: "https://uppbpb.gov.in/",
    official_pdf_fallback: "https://uppbpb.gov.in/",
    has_direct_pdf: false,
    age_limit: "18 - 25 Years",
    fee_details: "All Candidates: ₹400",
    description: "Massive Uttar Pradesh Police recruitment for Civil Police Constables. OMR Based Written Exam followed by Physical Standard Test and Running.",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "govt-jssc-cgl-2026",
    job_hash: "jssc-cgl-2026-hash",
    category: "government",
    title: "Jharkhand JSSC CGL Combined Graduate Level Exam",
    sector: "State PSC & Subordinate",
    state: "Jharkhand",
    state_or_location: "Jharkhand",
    department_or_board: "Jharkhand Staff Selection Commission (JSSC)",
    gov_sector: "State PSC & Subordinate",
    qualification: "Graduate / Bachelor's Degree",
    vacancies_count: 2017,
    last_date: "2026-10-22",
    last_date_to_apply: "2026-10-22",
    last_date_parsed: "2026-10-22",
    salary: "₹35,400 - ₹1,12,400 (Level 6)",
    salary_range: "₹35,400 - ₹1,12,400",
    apply_url: "https://jssc.jharkhand.gov.in/",
    notification_pdf_url: "https://jssc.jharkhand.gov.in/",
    official_pdf_fallback: "https://jssc.jharkhand.gov.in/",
    has_direct_pdf: false,
    age_limit: "21 - 35 Years",
    fee_details: "Gen/OBC: ₹100, SC/ST (JH): ₹50",
    description: "JSSC recruitment for Assistant Branch Officer, Block Supply Officer, Junior Secretariat Assistant, and Planning Assistant.",
    posted_date: "2026-09-03",
    is_active: true,
  },

  // ==========================================
  // TEACHING & EDUCATION JOBS
  // ==========================================
  {
    id: "govt-bpsc-teacher-2026",
    job_hash: "bpsc-teacher-hash",
    category: "teaching",
    title: "BPSC TRE 4.0 Teacher Recruitment 2026 (Primary & Secondary)",
    sector: "Teaching & Education",
    state: "Bihar",
    state_or_location: "Bihar",
    department_or_board: "Bihar Public Service Commission (BPSC)",
    gov_sector: "Teaching & Education",
    qualification: "B.Ed / D.El.Ed / CTET / STET Qualified",
    vacancies_count: 19500,
    last_date: "2026-11-05",
    last_date_to_apply: "2026-11-05",
    last_date_parsed: "2026-11-05",
    salary: "₹25,000 - ₹35,000 + Allowances",
    salary_range: "₹25,000 - ₹35,000",
    apply_url: "https://bpsc.bih.nic.in/",
    notification_pdf_url: "https://bpsc.bih.nic.in/",
    official_pdf_fallback: "https://bpsc.bih.nic.in/",
    has_direct_pdf: false,
    age_limit: "18 - 40 Years",
    fee_details: "Gen/OBC: ₹750, SC/ST/Female: ₹200",
    description: "Bihar Public Service Commission Teacher Recruitment Exam (TRE 4.0) for Primary (1-5), Middle (6-8), and Secondary/Higher Secondary School Teachers.",
    posted_date: "2026-09-04",
    is_active: true,
  },
  {
    id: "govt-ctet-kvs-teacher-2026",
    job_hash: "kvs-teacher-2026-hash",
    category: "teaching",
    title: "KVS PRT, TGT & PGT Teacher Recruitment 2026",
    sector: "Teaching & Education",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Kendriya Vidyalaya Sangathan (KVS)",
    gov_sector: "Teaching & Education",
    qualification: "B.Ed / CTET Qualified / Master's Degree",
    vacancies_count: 13404,
    last_date: "2026-11-18",
    last_date_to_apply: "2026-11-18",
    last_date_parsed: "2026-11-18",
    salary: "₹35,400 - ₹1,51,100 (Level 6 to Level 8)",
    salary_range: "₹35,400 - ₹1,51,100",
    apply_url: "https://kvsangathan.nic.in/",
    notification_pdf_url: "https://kvsangathan.nic.in/",
    official_pdf_fallback: "https://kvsangathan.nic.in/",
    has_direct_pdf: false,
    age_limit: "30 - 40 Years",
    fee_details: "Gen/OBC: ₹1500, SC/ST/PH: ₹0",
    description: "Kendriya Vidyalaya Sangathan recruitment for Primary Teachers (PRT), Trained Graduate Teachers (TGT), and Post Graduate Teachers (PGT) across KV schools in India.",
    posted_date: "2026-09-02",
    is_active: true,
  },

  // ==========================================
  // PSU & ENGINEERING JOBS
  // ==========================================
  {
    id: "govt-isro-scientist-2026",
    job_hash: "isro-scientist-hash",
    category: "government",
    title: "ISRO Scientist / Engineer 'SC' & Technical Assistant",
    sector: "PSU & Engineering",
    state: "All India",
    state_or_location: "All India",
    department_or_board: "Indian Space Research Organisation (ISRO)",
    gov_sector: "PSU & Engineering",
    qualification: "B.E / B.Tech / Diploma in Engineering",
    vacancies_count: 320,
    last_date: "2026-10-18",
    last_date_to_apply: "2026-10-18",
    last_date_parsed: "2026-10-18",
    salary: "₹56,100 - ₹1,77,500 (Level 10)",
    salary_range: "₹56,100 - ₹1,77,500",
    apply_url: "https://www.isro.gov.in/Careers.html",
    notification_pdf_url: "https://www.isro.gov.in/Careers.html",
    official_pdf_fallback: "https://www.isro.gov.in/Careers.html",
    has_direct_pdf: false,
    age_limit: "18 - 35 Years",
    fee_details: "Gen/OBC: ₹250, SC/ST/PWD: ₹0",
    description: "ISRO Centralised Recruitment Board (ICRB) recruitment for Scientists/Engineers in Electronics, Mechanical, Computer Science, and Technical Assistant diploma streams.",
    posted_date: "2026-09-02",
    is_active: true,
  },

  // ==========================================
  // PRIVATE & TECH CORPORATE JOBS
  // ==========================================
  {
    id: "priv-tcs-offcampus-2026",
    job_hash: "tcs-offcampus-2026-hash",
    category: "private",
    title: "TCS Off-Campus Hiring 2026 - Ninja & Digital Engineer",
    company_name: "Tata Consultancy Services (TCS)",
    company_logo_url: "",
    work_location: "Pan India (Bangalore, Pune, Kolkata, Hyderabad, Noida)",
    experience_level: "Fresher (0-1 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹3.6 - ₹7.0 LPA",
    skills_tags: ["Java", "Python", "SQL", "C++", "Data Structures"],
    source_portal: "TCS NextStep Portal",
    sector: "Private & Corporate",
    state: "All India",
    department_or_company: "Tata Consultancy Services",
    qualification: "B.E / B.Tech / BCA / MCA / B.Sc",
    description: "Tata Consultancy Services is hiring fresh engineering graduates and postgraduates for Ninja and Digital developer profiles through NQT test.",
    posted_date: "2026-09-04",
    apply_url: "https://www.tcs.com/careers",
    is_active: true,
  },
  {
    id: "priv-infosys-specialist-2026",
    job_hash: "infosys-specialist-hash",
    category: "private",
    title: "Infosys Specialist Programmer & System Engineer",
    company_name: "Infosys Limited",
    company_logo_url: "",
    work_location: "Bangalore, Mysore, Hyderabad, Pune, Chennai",
    experience_level: "Fresher (0-1 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹4.5 - ₹9.5 LPA",
    skills_tags: ["Java", "Python", "Fullstack", "Cloud", "DSA"],
    source_portal: "Infosys Careers",
    sector: "Private & Corporate",
    state: "All India",
    department_or_company: "Infosys Limited",
    qualification: "B.E / B.Tech / M.E / M.Tech / MCA",
    description: "Infosys is inviting applications for Specialist Programmer and System Engineer roles across top delivery centers in India.",
    posted_date: "2026-09-03",
    apply_url: "https://www.infosys.com/careers/",
    is_active: true,
  },
  {
    id: "priv-accenture-assoc-soft-2026",
    job_hash: "accenture-assoc-soft-hash",
    category: "private",
    title: "Accenture Associate Software Engineer & Cloud Trainee",
    company_name: "Accenture India",
    company_logo_url: "",
    work_location: "Gurgaon, Mumbai, Bangalore, Kolkata, Hyderabad",
    experience_level: "Fresher (0-1 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹4.6 - ₹6.5 LPA",
    skills_tags: ["Cloud AWS", "JavaScript", "SQL", "DotNET", "React"],
    source_portal: "Accenture Jobs Hub",
    sector: "Private & Corporate",
    state: "All India",
    department_or_company: "Accenture India",
    qualification: "Graduate / Bachelor's Degree",
    description: "Accenture is hiring Associate Software Engineers for technology consulting, cloud engineering, and enterprise software deployment.",
    posted_date: "2026-09-02",
    apply_url: "https://www.accenture.com/in-en/careers",
    is_active: true,
  },
  {
    id: "priv-hdfc-cx-officer-2026",
    job_hash: "hdfc-cx-officer-hash",
    category: "private",
    title: "HDFC Bank Customer Experience & Relationship Officer",
    company_name: "HDFC Bank Ltd",
    company_logo_url: "",
    work_location: "Pan India Branches",
    experience_level: "Fresher (0-2 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹3.2 - ₹5.0 LPA",
    skills_tags: ["Banking", "Customer Service", "Financial Sales", "Communication"],
    source_portal: "HDFC Bank Careers",
    sector: "Banking & Finance",
    state: "All India",
    department_or_company: "HDFC Bank Ltd",
    qualification: "Graduate / Any Bachelor Degree",
    description: "HDFC Bank is recruiting Customer Experience Officers and Branch Relationship Managers for retail banking services across major cities.",
    posted_date: "2026-09-01",
    apply_url: "https://www.hdfcbank.com/personal/about-us/careers",
    is_active: true,
  },
  {
    id: "priv-wipro-elite-2026",
    job_hash: "wipro-elite-hash",
    category: "private",
    title: "Wipro Elite Software Engineer Trainee (NTH)",
    company_name: "Wipro Limited",
    company_logo_url: "",
    work_location: "Bangalore, Chennai, Pune, Hyderabad, Kochi",
    experience_level: "Fresher (0-1 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹3.5 - ₹5.2 LPA",
    skills_tags: ["C#", "Java", "Python", "Web Development", "SQL"],
    source_portal: "Wipro Careers",
    sector: "Private & Corporate",
    state: "All India",
    department_or_company: "Wipro Limited",
    qualification: "B.E / B.Tech / B.Sc / BCA",
    description: "Wipro National Talent Hunt (NTH) hiring for engineering and science graduates for software development and IT infrastructure management.",
    posted_date: "2026-09-03",
    apply_url: "https://careers.wipro.com/",
    is_active: true,
  },
  {
    id: "priv-flipkart-sde-2026",
    job_hash: "flipkart-sde-hash",
    category: "private",
    title: "Flipkart Software Development Engineer I (SDE-1)",
    company_name: "Flipkart",
    company_logo_url: "",
    work_location: "Bangalore / Remote Hybrid",
    experience_level: "Mid-Level (1-3 yrs)",
    employment_type: "Full-Time",
    salary_range: "₹14.0 - ₹22.0 LPA",
    skills_tags: ["Java", "Distributed Systems", "Node.js", "React", "Kafka"],
    source_portal: "Flipkart Careers",
    sector: "Private & Corporate",
    state: "Karnataka",
    department_or_company: "Flipkart",
    qualification: "B.E / B.Tech / M.Tech in CS/IT",
    description: "Flipkart engineering team is hiring SDE-1 developers to build high-scale e-commerce logistics, payment systems, and customer backend microservices.",
    posted_date: "2026-09-04",
    apply_url: "https://www.flipkartcareers.com/",
    is_active: true,
  },
  {
    id: "priv-amazon-support-assoc-2026",
    job_hash: "amazon-support-assoc-hash",
    category: "private",
    title: "Amazon Customer Service & Operations Specialist",
    company_name: "Amazon India",
    company_logo_url: "",
    work_location: "Virtual / Work From Home & Hubs (Delhi, Hyd, Blr)",
    experience_level: "Fresher (0-1 yrs)",
    employment_type: "Full-Time / Shift",
    salary_range: "₹3.0 - ₹4.5 LPA",
    skills_tags: ["Customer Support", "Communication", "Problem Solving"],
    source_portal: "Amazon Jobs India",
    sector: "Private & Corporate",
    state: "All India",
    department_or_company: "Amazon India",
    qualification: "Graduate / Any Degree",
    description: "Amazon India is hiring Customer Support Associates for voice, chat, and e-commerce logistics operations.",
    posted_date: "2026-09-03",
    apply_url: "https://www.amazon.jobs/en/locations/india",
    is_active: true,
  },
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
