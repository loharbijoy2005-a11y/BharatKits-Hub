export type JobCategory = "government" | "private";

export interface BaseJob {
  id: string;
  job_hash: string;
  category: JobCategory;
  title: string;
  slug?: string;
  description: string;
  apply_url: string;
  posted_date: string;
  is_active: boolean;
}

export interface GovtJob extends BaseJob {
  category: "government";
  department_or_board: string; // e.g. SSC, UPSC, RRB, IBPS, State PSC, Police, Defence
  gov_sector: string; // Central, State, Railway, Defence, Banking, PSU, Teaching
  notification_pdf_url?: string;
  vacancies_count: number;
  last_date_to_apply: string;
  qualification: string; // 10th, 12th, Graduate, B.Tech, Diploma
  age_limit: string; // e.g. 18 - 32 Years
  exam_date?: string;
  fee_details?: string;
  state_or_location: string;
}

export interface PrivateJob extends BaseJob {
  category: "private";
  company_name: string;
  company_logo_url?: string;
  work_location: string;
  experience_level: string; // Fresher (0-1 yrs), Mid-Level (2-5 yrs), Senior (5+ yrs), Internship
  employment_type: string; // Full-time, Part-time, Internship, Contract
  salary_range: string;
  skills_tags: string[];
  source_portal: string;
}

export type Job = GovtJob | PrivateJob;

export interface JobFilterState {
  category: "all" | "government" | "private";
  searchQuery: string;
  govBoard: string;
  state: string;
  qualification: string;
  experience: string;
  employmentType: string;
  onlyActive: boolean;
}

export const INITIAL_JOBS_DATA: Job[] = [
  // ==========================================
  // 🏛️ SARKARI (GOVERNMENT) JOBS
  // ==========================================
  {
    id: "gov-1",
    job_hash: "gov_ssc_cgl_2026",
    category: "government",
    title: "SSC CGL 2026 - Combined Graduate Level Examination",
    department_or_board: "Staff Selection Commission (SSC)",
    gov_sector: "Central Government",
    description:
      "Staff Selection Commission conducts the Combined Graduate Level Examination (CGL) for recruitment to Group 'B' and Group 'C' posts in various Ministries, Departments, and Organizations of the Government of India. Includes posts like Assistant Section Officer (ASO), Inspector of Income Tax, Central Excise Inspector, Assistant Audit Officer (AAO), and Sub-Inspector in CBI.",
    apply_url: "https://ssc.gov.in/",
    notification_pdf_url: "https://ssc.gov.in/api/attachment/uploads/docUpload/CGL_2026_Notice.pdf",
    vacancies_count: 14582,
    posted_date: "2026-08-25",
    last_date_to_apply: "2026-09-28",
    qualification: "Bachelor's Degree in Any Discipline from a recognized University",
    age_limit: "18 - 32 Years (Age relaxation as per GOI rules for SC/ST/OBC/PwD)",
    exam_date: "Tier-I CBT: November 2026",
    fee_details: "₹100 (Women, SC, ST, PwD, and ESM candidates are exempt)",
    state_or_location: "All India",
    is_active: true,
  },
  {
    id: "gov-2",
    job_hash: "gov_upsc_cse_2026",
    category: "government",
    title: "UPSC Civil Services Examination (IAS / IPS / IFS) 2026",
    department_or_board: "Union Public Service Commission (UPSC)",
    gov_sector: "All India Services / Central Services",
    description:
      "Union Public Service Commission invites applications for the Civil Services (Preliminary) Examination for recruitment to Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), Indian Revenue Service (IRS), and other premier Group A & B services.",
    apply_url: "https://upsconline.nic.in/",
    notification_pdf_url: "https://upsc.gov.in/sites/default/files/Notification-CSP-2026.pdf",
    vacancies_count: 1105,
    posted_date: "2026-08-20",
    last_date_to_apply: "2026-09-22",
    qualification: "Graduation in any discipline from a recognized University / Final year eligible",
    age_limit: "21 - 32 Years (OBC: 35 Years, SC/ST: 37 Years)",
    exam_date: "Prelims: 24th May 2026",
    fee_details: "₹100 (Female/SC/ST/PwBD candidates exempt from fee)",
    state_or_location: "All India",
    is_active: true,
  },
  {
    id: "gov-3",
    job_hash: "gov_rrb_ntpc_2026",
    category: "government",
    title: "RRB Non-Technical Popular Categories (NTPC) Recruitment 2026",
    department_or_board: "Railway Recruitment Board (RRB)",
    gov_sector: "Indian Railways",
    description:
      "Ministry of Railways invites online applications through Railway Recruitment Boards for Non-Technical Popular Categories (NTPC) Graduate & Under Graduate posts across all 21 Railway zones. Posts include Station Master, Goods Guard, Senior Commercial cum Ticket Clerk, Junior Accounts Assistant, and Train Clerk.",
    apply_url: "https://www.rrbapply.gov.in/",
    notification_pdf_url: "https://indianrailways.gov.in/railwayboard/uploads/directorate/recruitment/CEN_01_2026_NTPC.pdf",
    vacancies_count: 11558,
    posted_date: "2026-08-28",
    last_date_to_apply: "2026-10-15",
    qualification: "12th Pass (for Under-Graduate Posts) / Bachelor's Degree (for Graduate Posts)",
    age_limit: "18 - 36 Years (3 Years COVID-19 / Age relaxation included)",
    exam_date: "CBT 1: Dec 2026 - Jan 2027",
    fee_details: "Gen/OBC: ₹500 (₹400 refundable on CBT-1 attendance), SC/ST/Women: ₹250 (full refund)",
    state_or_location: "All India (21 RRB Zones)",
    is_active: true,
  },
  {
    id: "gov-4",
    job_hash: "gov_ibps_po_2026",
    category: "government",
    title: "IBPS Probationary Officers / Management Trainees (CRP PO/MT-XVI)",
    department_or_board: "Institute of Banking Personnel Selection (IBPS)",
    gov_sector: "Public Sector Banking",
    description:
      "Recruitment of Probationary Officers / Management Trainees in 11 Participating Public Sector Banks (Bank of Baroda, Canara Bank, PNB, Union Bank of India, Indian Bank, etc.). Great career path with attractive pay scale and bank allowances.",
    apply_url: "https://www.ibps.in/",
    notification_pdf_url: "https://www.ibps.in/wp-content/uploads/Notification_CRP_PO_XVI.pdf",
    vacancies_count: 4455,
    posted_date: "2026-08-18",
    last_date_to_apply: "2026-09-15",
    qualification: "A Degree (Graduation) in any discipline from a recognized University",
    age_limit: "20 - 30 Years (Relaxation for SC/ST: 5 yrs, OBC: 3 yrs)",
    exam_date: "Online Prelims: October 2026",
    fee_details: "₹175 for SC/ST/PwBD; ₹850 for all other categories",
    state_or_location: "All India",
    is_active: true,
  },
  {
    id: "gov-5",
    job_hash: "gov_isro_scientist_2026",
    category: "government",
    title: "ISRO Scientist/Engineer 'SC' Recruitment (ECE, CSE, Mech)",
    department_or_board: "Indian Space Research Organisation (ISRO)",
    gov_sector: "Space Research / Defence",
    description:
      "ISRO Centralised Recruitment Board (ICRB) invites applications for Scientist/Engineer 'SC' in Level 10 of Pay Matrix (₹56,100 basic + allowances) for major space research centers (VSSC, URSC, SAC, SDSC SHAR, LPSC).",
    apply_url: "https://www.isro.gov.in/Careers.html",
    notification_pdf_url: "https://www.isro.gov.in/media_isro/pdf/recruitmentNotice/ISRO_ICRB_2026.pdf",
    vacancies_count: 320,
    posted_date: "2026-08-30",
    last_date_to_apply: "2026-09-25",
    qualification: "B.E / B.Tech or equivalent in First Class with an aggregate minimum of 65% marks or CGPA 6.84/10",
    age_limit: "18 - 28 Years",
    exam_date: "Written Test: Nov 2026",
    fee_details: "₹250 for all applicants",
    state_or_location: "Bengaluru / Sriharikota / Thiruvananthapuram",
    is_active: true,
  },
  {
    id: "gov-6",
    job_hash: "gov_sbi_clerk_2026",
    category: "government",
    title: "SBI Junior Associates (Customer Support & Sales) Clerk 2026",
    department_or_board: "State Bank of India (SBI)",
    gov_sector: "Banking",
    description:
      "State Bank of India invites applications from eligible Indian citizens for appointment as Junior Associate (Customer Support & Sales) in clerical cadre across all state circles in India.",
    apply_url: "https://bank.sbi/careers",
    notification_pdf_url: "https://bank.sbi/documents/crpd-r-2026-JA.pdf",
    vacancies_count: 8773,
    posted_date: "2026-09-01",
    last_date_to_apply: "2026-09-30",
    qualification: "Graduation in any discipline from a recognized University",
    age_limit: "20 - 28 Years",
    exam_date: "Preliminary Exam: Nov/Dec 2026",
    fee_details: "₹750 (General/OBC/EWS), SC/ST/PwD: Nil",
    state_or_location: "All India (State-wise allocation)",
    is_active: true,
  },
  {
    id: "gov-7",
    job_hash: "gov_delhi_police_2026",
    category: "government",
    title: "Delhi Police Constable (Executive) Male & Female Recruitment",
    department_or_board: "Staff Selection Commission (SSC) / Delhi Police",
    gov_sector: "Police & Security",
    description:
      "Recruitment of Constable (Executive) Male and Female in Delhi Police Examination conducted by SSC. Attractive central pay scale (Level-3: ₹21,700 - ₹69,100) with central police allowances.",
    apply_url: "https://ssc.gov.in/",
    notification_pdf_url: "https://delhipolice.gov.in/recruitment/Constable_Exec_2026.pdf",
    vacancies_count: 7547,
    posted_date: "2026-08-15",
    last_date_to_apply: "2026-09-18",
    qualification: "10+2 (Senior Secondary) pass from a recognized Board (Valid LMV Driving License for Male candidates)",
    age_limit: "18 - 25 Years",
    exam_date: "Computer Based Exam: Nov 2026",
    fee_details: "₹100 (SC/ST/Women Exempt)",
    state_or_location: "Delhi NCR / All India",
    is_active: true,
  },
  {
    id: "gov-8",
    job_hash: "gov_nda_cds_2026",
    category: "government",
    title: "UPSC Combined Defence Services (CDS) & NDA-NA II Examination 2026",
    department_or_board: "Union Public Service Commission (UPSC) / Armed Forces",
    gov_sector: "Defence (Army, Navy, Air Force)",
    description:
      "Admission to Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), and Officers Training Academy (OTA) for commissioned officer roles.",
    apply_url: "https://upsconline.nic.in/",
    notification_pdf_url: "https://upsc.gov.in/sites/default/files/Notice-CDS-II-2026.pdf",
    vacancies_count: 459,
    posted_date: "2026-08-10",
    last_date_to_apply: "2026-09-12",
    qualification: "Degree of a recognized University / B.E/B.Tech for Navy & Air Force",
    age_limit: "19 - 24 Years (Unmarried candidates only)",
    exam_date: "Written Exam: Sep 2026",
    fee_details: "₹200 (Female/SC/ST candidates exempt)",
    state_or_location: "All India (SSB centers across India)",
    is_active: true,
  },

  // ==========================================
  // 💼 PRIVATE SECTOR & TECH JOBS
  // ==========================================
  {
    id: "priv-1",
    job_hash: "priv_razorpay_frontend_2026",
    category: "private",
    title: "Software Development Engineer - Frontend (React / Next.js)",
    company_name: "Razorpay",
    company_logo_url: "https://images.seeklogo.com/logo-png/43/2/razorpay-logo-png_seeklogo-434850.png",
    work_location: "Bengaluru (Hybrid)",
    experience_level: "Fresher / 1-3 Years",
    employment_type: "Full-time",
    salary_range: "₹14,00,000 - ₹20,00,000 P.A. + ESOPs",
    skills_tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Web Performance"],
    description:
      "Join the Core Payments Frontend team at Razorpay. Build high-reliability, responsive checkouts and merchant dashboard experiences used by millions of merchants daily across India and Southeast Asia.",
    apply_url: "https://razorpay.com/jobs/",
    source_portal: "Razorpay Careers / Greenhouse",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "priv-2",
    job_hash: "priv_swiggy_backend_2026",
    category: "private",
    title: "Backend Engineer II (Golang / High Throughput Distributed Systems)",
    company_name: "Swiggy",
    company_logo_url: "https://images.seeklogo.com/logo-png/33/2/swiggy-logo-png_seeklogo-337588.png",
    work_location: "Bengaluru / Remote",
    experience_level: "Mid-Level (2-5 Years)",
    employment_type: "Full-time",
    salary_range: "₹22,00,000 - ₹34,00,000 P.A. + Benefits",
    skills_tags: ["Golang", "Kafka", "PostgreSQL", "Redis", "Distributed Systems", "AWS"],
    description:
      "Scale the order dispatch, fulfillment and instamart delivery platforms handling 50k+ requests per second during peak hours. Focus on zero-downtime architecture and low-latency APIs.",
    apply_url: "https://careers.swiggy.com/",
    source_portal: "Swiggy Careers",
    posted_date: "2026-09-01",
    is_active: true,
  },
  {
    id: "priv-3",
    job_hash: "priv_zomato_data_analyst_2026",
    category: "private",
    title: "Business & Data Analyst (Growth & Delivery Ops)",
    company_name: "Zomato",
    company_logo_url: "https://images.seeklogo.com/logo-png/39/2/zomato-logo-png_seeklogo-392471.png",
    work_location: "Gurugram / Delhi NCR",
    experience_level: "Fresher / 0-2 Years",
    employment_type: "Full-time",
    salary_range: "₹8,00,000 - ₹12,50,000 P.A.",
    skills_tags: ["SQL", "Python", "Tableau", "Power BI", "Data Modeling", "Excel"],
    description:
      "Analyze consumer behavior, hyperlocal demand forecasting, delivery turnaround times, and merchant promotions. Work closely with city heads and product leaders to unlock double-digit growth.",
    apply_url: "https://www.zomato.com/careers",
    source_portal: "Zomato Careers",
    posted_date: "2026-08-31",
    is_active: true,
  },
  {
    id: "priv-4",
    job_hash: "priv_tcs_nextstep_2026",
    category: "private",
    title: "Systems Engineer & Graduate Trainee (Batch 2025/2026)",
    company_name: "Tata Consultancy Services (TCS)",
    company_logo_url: "https://images.seeklogo.com/logo-png/43/2/tcs-tata-consultancy-services-logo-png_seeklogo-432247.png",
    work_location: "Pan India (Hyderabad, Pune, Chennai, Mumbai, Kolkata, NCR)",
    experience_level: "Fresher (0 Years / Campus)",
    employment_type: "Full-time",
    salary_range: "₹3,80,000 - ₹7,50,000 P.A. (Ninja & Digital Cadre)",
    skills_tags: ["Java", "Python", "C++", "SQL", "Cloud Fundamentals", "Problem Solving"],
    description:
      "TCS National Qualifier Test (NQT) recruitment drive for B.E/B.Tech/MCA/M.Sc graduates. Multiple tracks including TCS Ninja, Digital, and Prime engineering bands.",
    apply_url: "https://www.tcs.com/careers",
    source_portal: "TCS NextStep Portal",
    posted_date: "2026-08-27",
    is_active: true,
  },
  {
    id: "priv-5",
    job_hash: "priv_phonepe_devops_2026",
    category: "private",
    title: "DevOps & Cloud Infrastructure Engineer (Kubernetes / Terraform)",
    company_name: "PhonePe",
    company_logo_url: "https://images.seeklogo.com/logo-png/39/1/phonepe-logo-png_seeklogo-391494.png",
    work_location: "Bengaluru (On-site)",
    experience_level: "Senior (4-8 Years)",
    employment_type: "Full-time",
    salary_range: "₹26,00,000 - ₹42,00,000 P.A. + Retention Bonus",
    skills_tags: ["Kubernetes", "Docker", "Terraform", "CI/CD", "AWS", "Prometheus", "Linux"],
    description:
      "Manage massive UPI payment gateway clusters with 99.999% availability SLAs. Design automated failover pipelines, container orchestration, and multi-region disaster recovery.",
    apply_url: "https://www.phonepe.com/careers/",
    source_portal: "PhonePe Careers",
    posted_date: "2026-09-02",
    is_active: true,
  },
  {
    id: "priv-6",
    job_hash: "priv_infosys_genai_2026",
    category: "private",
    title: "AI / Machine Learning Engineer (LLMs & Agentic AI Systems)",
    company_name: "Infosys AI Labs",
    company_logo_url: "https://images.seeklogo.com/logo-png/7/2/infosys-logo-png_seeklogo-74312.png",
    work_location: "Bengaluru / Hyderabad / Remote",
    experience_level: "Mid-Level (2-5 Years)",
    employment_type: "Full-time",
    salary_range: "₹16,00,000 - ₹28,00,000 P.A.",
    skills_tags: ["Python", "PyTorch", "HuggingFace", "LangChain", "Vector DBs", "RAG Systems"],
    description:
      "Build enterprise-grade generative AI assistants, retrieval augmented generation (RAG) pipelines, and multimodal document intelligence tools for Fortune 500 enterprise clients.",
    apply_url: "https://www.infosys.com/careers.html",
    source_portal: "Infosys Careers",
    posted_date: "2026-08-29",
    is_active: true,
  },
  {
    id: "priv-7",
    job_hash: "priv_cred_mobile_2026",
    category: "private",
    title: "Mobile App Developer (React Native / Flutter / iOS)",
    company_name: "CRED",
    company_logo_url: "https://ui-avatars.com/api/?name=CRED&background=000&color=fff",
    work_location: "Bengaluru",
    experience_level: "Mid-Level (2-4 Years)",
    employment_type: "Full-time",
    salary_range: "₹18,00,000 - ₹30,00,000 P.A. + Generous ESOPs",
    skills_tags: ["React Native", "Flutter", "Swift", "Kotlin", "Fluid UI Animations", "Design Systems"],
    description:
      "Craft award-winning 120fps micro-interactions, neo-brutalist financial user interfaces, and secure biometric payment authentication flows.",
    apply_url: "https://cred.club/careers",
    source_portal: "CRED Careers / Lever",
    posted_date: "2026-09-01",
    is_active: true,
  },
  {
    id: "priv-8",
    job_hash: "priv_zepto_qa_2026",
    category: "private",
    title: "SDET / QA Automation Engineer (Cypress / Playwright / Appium)",
    company_name: "Zepto",
    company_logo_url: "https://ui-avatars.com/api/?name=Zepto&background=8E24AA&color=fff",
    work_location: "Mumbai / Remote",
    experience_level: "Fresher / 1-3 Years",
    employment_type: "Full-time",
    salary_range: "₹9,00,000 - ₹15,00,000 P.A.",
    skills_tags: ["Playwright", "Cypress", "Appium", "JavaScript", "API Testing", "Postman"],
    description:
      "Ensure frictionless 10-minute grocery delivery app performance. Develop end-to-end regression suites for rider apps, store picker terminals, and customer checkout flows.",
    apply_url: "https://www.zeptonow.com/careers",
    source_portal: "Zepto Careers",
    posted_date: "2026-08-30",
    is_active: true,
  },
];

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
