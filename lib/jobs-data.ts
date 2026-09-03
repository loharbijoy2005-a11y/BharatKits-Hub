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

export const INITIAL_JOBS_DATA: Job[] = [];

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
