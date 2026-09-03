import json

with open('backend/all_scraped_jobs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, item in enumerate(data):
    item['id'] = f'job-{i+1}'
    cat = item.get('category', 'government')
    
    # Common fields
    item['title'] = item.get('title', 'Recruitment Opening')
    item['description'] = item.get('description', '') or f"Job opening for {item['title']}."
    item['apply_url'] = item.get('apply_url', '')
    item['posted_date'] = item.get('posted_date', '2026-09-01')
    item['is_active'] = True
    
    if cat == 'government':
        item['category'] = 'government'
        item['department_or_board'] = item.get('department_or_board') or 'Govt of India / State Dept'
        item['gov_sector'] = item.get('gov_sector') or 'Central / State Govt'
        item['notification_pdf_url'] = item.get('notification_pdf_url') or None
        item['vacancies_count'] = int(item.get('vacancies_count') or 0)
        item['last_date_to_apply'] = item.get('last_date_to_apply') or '2026-09-30'
        item['qualification'] = item.get('qualification') or '10th / 12th / Graduate / Diploma'
        item['age_limit'] = item.get('age_limit') or '18 - 35 Years'
        item['exam_date'] = item.get('exam_date') or 'To be notified'
        item['fee_details'] = item.get('fee_details') or 'Gen/OBC: ₹100, SC/ST: ₹0'
        loc = item.get('state_or_location') or item.get('work_location') or 'All India'
        item['state_or_location'] = ', '.join(loc) if isinstance(loc, list) else str(loc)
        
        # Clean private-only keys if present
        item.pop('work_location', None)
        item.pop('company_name', None)
        item.pop('company_logo_url', None)
        item.pop('experience_level', None)
        item.pop('employment_type', None)
        item.pop('salary_range', None)
        item.pop('skills_tags', None)
        item.pop('source_portal', None)
    else:
        item['category'] = 'private'
        item['company_name'] = item.get('company_name') or 'Tech Company'
        item['company_logo_url'] = item.get('company_logo_url') or f"https://ui-avatars.com/api/?name={item['company_name']}&background=4F46E5&color=fff"
        loc = item.get('work_location') or item.get('state_or_location') or 'Bengaluru / Remote'
        item['work_location'] = ', '.join(loc) if isinstance(loc, list) else str(loc)
        item['experience_level'] = item.get('experience_level') or 'Fresher / 1-3 Years'
        emp = item.get('employment_type') or 'Full-time'
        item['employment_type'] = ', '.join(emp) if isinstance(emp, list) else str(emp)
        item['salary_range'] = item.get('salary_range') or 'Best in Industry / Competitive'
        tags = item.get('skills_tags') or ['Tech', 'Software', 'Engineering']
        item['skills_tags'] = tags if isinstance(tags, list) else [str(tags)]
        item['source_portal'] = item.get('source_portal') or 'Direct / ATS'
        
        # Clean govt-only keys if present
        item.pop('department_or_board', None)
        item.pop('gov_sector', None)
        item.pop('notification_pdf_url', None)
        item.pop('vacancies_count', None)
        item.pop('last_date_to_apply', None)
        item.pop('qualification', None)
        item.pop('age_limit', None)
        item.pop('exam_date', None)
        item.pop('fee_details', None)
        item.pop('state_or_location', None)

with open('backend/all_scraped_jobs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

ts_content = f"""export type JobCategory = "government" | "private";

export interface BaseJob {{
  id: string;
  job_hash: string;
  category: JobCategory;
  title: string;
  slug?: string;
  description: string;
  apply_url: string;
  posted_date: string;
  is_active: boolean;
}}

export interface GovtJob extends BaseJob {{
  category: "government";
  department_or_board: string;
  gov_sector: string;
  notification_pdf_url?: string | null;
  vacancies_count: number;
  last_date_to_apply: string;
  qualification: string;
  age_limit: string;
  exam_date?: string;
  fee_details?: string;
  state_or_location: string;
}}

export interface PrivateJob extends BaseJob {{
  category: "private";
  company_name: string;
  company_logo_url?: string;
  work_location: string;
  experience_level: string;
  employment_type: string;
  salary_range: string;
  skills_tags: string[];
  source_portal: string;
}}

export type Job = GovtJob | PrivateJob;

export interface JobFilterState {{
  category: "all" | "government" | "private";
  searchQuery: string;
  govBoard: string;
  state: string;
  qualification: string;
  experience: string;
  employmentType: string;
  onlyActive: boolean;
}}

export const INITIAL_JOBS_DATA: Job[] = {json.dumps(data, indent=2, ensure_ascii=False)};

export const GOV_BOARDS_LIST = [
  "All Boards",
  "Staff Selection Commission (SSC)",
  "Union Public Service Commission (UPSC)",
  "Railway Recruitment Board (RRB)",
  "Banking / IBPS / SBI",
  "Defence / Armed Forces",
  "ISRO / DRDO / PSUs",
  "State Police & Administrative Services",
  "Teaching / KVS / NVS",
];

export const INDIAN_STATES_LIST = [
  "All India",
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Bihar",
  "West Bengal",
  "Rajasthan",
  "Madhya Pradesh",
  "Gujarat",
  "Punjab & Haryana",
  "Odisha",
  "Kerala",
  "Assam & North East",
];

export const QUALIFICATIONS_LIST = [
  "All Qualifications",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate / Bachelor's Degree",
  "B.E / B.Tech",
  "Post Graduate / Master's Degree",
];

export const EXP_LEVELS_LIST = [
  "All Experience Levels",
  "Fresher (0-1 yrs)",
  "Mid-Level (2-5 yrs)",
  "Senior (5+ yrs)",
  "Internship",
];
"""

with open('lib/jobs-data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully formatted and synced {len(data)} jobs to lib/jobs-data.ts!")
