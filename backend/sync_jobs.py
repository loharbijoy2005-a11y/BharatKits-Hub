import json
import os

with open('backend/all_scraped_jobs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, item in enumerate(data):
    item['id'] = f'job-{i+1}'
    cat = item.get('category', 'government')
    
    # Common fields
    item['title'] = item.get('title', 'Recruitment Opening')
    item['description'] = item.get('description', '') or f"Job opening for {item['title']}."
    item['apply_url'] = item.get('apply_url', '')
    item['posted_date'] = item.get('posted_date', '2026-09-03')
    item['is_active'] = bool(item.get('is_active', True))
    
    # Official Source Domain
    item['official_source_domain'] = item.get('official_source_domain') or (
        item['apply_url'].split('//')[-1].split('/')[0].replace('www.', '') if item.get('apply_url') else 'gov.in'
    )
    
    # State normalization
    item['state'] = item.get('state') or item.get('state_or_location') or item.get('work_location') or 'All India'
    if isinstance(item['state'], list):
        item['state'] = ', '.join(item['state'])
    
    # Authoritative Sector normalization
    sector = item.get('sector') or item.get('gov_sector') or ('Private & Corporate' if cat == 'private' else 'Central SSC & UPSC')
    item['sector'] = sector
        
    if cat in ('government', 'teaching'):
        item['department_or_board'] = item.get('department_or_board') or item.get('department_or_company') or 'Govt / Board'
        item['gov_sector'] = sector
        item['notification_pdf_url'] = item.get('notification_pdf_url') or item.get('official_pdf') or None
        item['official_pdf_fallback'] = item.get('official_pdf_fallback') or item.get('apply_url')
        item['has_direct_pdf'] = bool(item.get('has_direct_pdf', False))
        item['vacancies_count'] = int(item.get('vacancies_count') or 0)
        item['last_date_to_apply'] = item.get('last_date_to_apply') or item.get('last_date') or '2026-10-30'
        item['qualification'] = item.get('qualification') or '10th / 12th / Graduate / B.Ed'
        item['age_limit'] = item.get('age_limit') or '18 - 40 Years'
        item['salary_range'] = item.get('salary') or item.get('salary_range') or 'As per Govt Norms'
        item['state_or_location'] = item['state']
        
        item.pop('work_location', None)
        item.pop('company_name', None)
        item.pop('company_logo_url', None)
        item.pop('experience_level', None)
        item.pop('employment_type', None)
        item.pop('skills_tags', None)
        item.pop('source_portal', None)
    else:
        item['company_name'] = item.get('company_name') or item.get('department_or_company') or 'Tech Company'
        item['company_logo_url'] = item.get('company_logo_url') or f"https://ui-avatars.com/api/?name={item['company_name']}&background=4F46E5&color=fff"
        item['work_location'] = item['state']
        item['experience_level'] = item.get('experience_level') or 'Fresher / 1-3 Years'
        emp = item.get('employment_type') or 'Full-time'
        item['employment_type'] = ', '.join(emp) if isinstance(emp, list) else str(emp)
        item['salary_range'] = item.get('salary') or item.get('salary_range') or 'Competitive / Best in Industry'
        tags = item.get('skills_tags') or ['Tech', 'Software', 'Engineering']
        item['skills_tags'] = tags if isinstance(tags, list) else [str(tags)]
        item['source_portal'] = item.get('source_portal') or 'Direct ATS'
        
        item.pop('department_or_board', None)
        item.pop('gov_sector', None)
        item.pop('notification_pdf_url', None)
        item.pop('official_pdf_fallback', None)
        item.pop('has_direct_pdf', None)
        item.pop('vacancies_count', None)
        item.pop('last_date_to_apply', None)
        item.pop('age_limit', None)
        item.pop('fee_details', None)
        item.pop('state_or_location', None)

with open('backend/all_scraped_jobs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

header_part = """export type JobCategory = "government" | "private" | "teaching";

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
  official_source_domain?: string;
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

export const INITIAL_JOBS_DATA: Job[] = """ + json.dumps(data, indent=2, ensure_ascii=False) + """;

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

  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(clean)) return clean;

  const dmy = clean.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const monthMap: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const dMonY = clean.match(/^(\\d{1,2})\\s+([A-Za-z]+)\\s+(\\d{4})$/);
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
"""

with open('lib/jobs-data.ts', 'w', encoding='utf-8') as f:
    f.write(header_part)

print(f"Successfully synced {len(data)} jobs to lib/jobs-data.ts with complete 10-sector taxonomy!")
