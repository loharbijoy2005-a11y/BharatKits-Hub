export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "land" | "identity" | "ration" | "edistrict" | "transport" | "business" | "welfare";
  state?: string; // State / UT name or undefined for Central / All-India
  tags: string[];
  featured?: boolean;
}

export const ALL_INDIAN_STATES = [
  "All India (Central)",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const POPULAR_STATES = [
  "Uttar Pradesh",
  "Bihar",
  "West Bengal",
  "Maharashtra",
  "Rajasthan",
  "Madhya Pradesh",
  "Gujarat",
  "Karnataka",
  "Punjab",
  "Haryana",
  "Delhi (NCT)",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Telangana",
  "Odisha",
  "Jharkhand",
];

export const govtServices: ServiceItem[] = [
  // ==========================================
  // PAN CARD SERVICES (Verified & 100% Working)
  // ==========================================
  {
    id: "pan-instant-epan",
    title: "Instant Digital e-PAN (Income Tax Dept)",
    description: "Allotment or download of paperless digital e-PAN using Aadhaar authentication & mobile OTP.",
    url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan",
    category: "identity",
    tags: ["pan card", "instant epan", "digital pan card", "aadhaar pan", "income tax pan", "download pan", "pan online"],
    featured: true,
  },
  {
    id: "pan-protean-apply",
    title: "Apply New PAN Card (Protean / Form 49A)",
    description: "Official Protean (formerly NSDL) online portal to apply for a new PAN card, reprint physical card, or request corrections.",
    url: "https://onlineservices.proteantech.in/paam/endUserRegisterContact.html",
    category: "identity",
    tags: ["nsdl pan", "protean pan", "new pan card", "pan application", "form 49a", "physical pan card", "tin nsdl"],
    featured: true,
  },
  {
    id: "pan-protean-nsdl",
    title: "Protean TIN-PAN Official Hub",
    description: "Main Protean TIN-PAN services portal to track PAN status, know AO code, download forms, and check guidelines.",
    url: "https://www.protean-tinpan.com/",
    category: "identity",
    tags: ["nsdl pan", "protean pan", "tin pan", "track pan card", "pan guidelines"],
    featured: true,
  },
  {
    id: "pan-utiitsl",
    title: "UTIITSL PAN Card Services",
    description: "Apply online for new PAN, track application status, download e-PAN, request address update or correction via UTIITSL.",
    url: "https://www.pan.utiitsl.com/PAN/",
    category: "identity",
    tags: ["uti pan", "utiitsl pan", "track pan card", "uti pan correction", "pan card apply"],
    featured: true,
  },
  {
    id: "pan-aadhaar-link",
    title: "Link Aadhaar with PAN / Check Status",
    description: "Check if your PAN card is active and linked with Aadhaar, or complete mandatory PAN-Aadhaar linking online.",
    url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status",
    category: "identity",
    tags: ["link aadhaar pan", "pan aadhar link status", "check pan link", "income tax link aadhaar"],
    featured: true,
  },
  {
    id: "pan-verify",
    title: "Verify PAN Details & Status (ITD)",
    description: "Check whether a PAN number is valid, active, and matches name and date of birth in Income Tax database.",
    url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPANToken",
    category: "identity",
    tags: ["verify pan", "pan card check", "check pan status", "know your pan", "active pan check"],
  },

  // ==========================================
  // NATIONAL IDENTITY & CITIZEN SERVICES
  // ==========================================
  {
    id: "uidai-myaadhaar",
    title: "UIDAI myAadhaar Portal",
    description: "Download e-Aadhaar PDF, update address online, check Aadhaar-bank seeding status, lock/unlock biometrics, and order PVC card.",
    url: "https://myaadhaar.uidai.gov.in/",
    category: "identity",
    tags: ["aadhaar card", "uidai", "download aadhaar", "myaadhaar", "pvc card", "aadhaar update", "biometric lock"],
    featured: true,
  },
  {
    id: "voter-eci",
    title: "ECI Voters' Service Portal",
    description: "Register new voter ID (Form 6), download digital e-EPIC card, request address shift/correction (Form 8), and search electoral roll.",
    url: "https://voters.eci.gov.in/",
    category: "identity",
    tags: ["voter id", "nvsp", "eci", "e-epic", "voter card download", "voter list", "electoral roll"],
    featured: true,
  },
  {
    id: "passport-seva",
    title: "Passport Seva Kendra (PSK)",
    description: "Apply for Fresh Passport, Re-issue, Tatkaal appointment booking, police clearance certificate (PCC), and track status.",
    url: "https://www.passportindia.gov.in/",
    category: "identity",
    tags: ["passport", "passport seva", "psk appointment", "tatkaal passport", "track passport"],
  },
  {
    id: "digilocker",
    title: "DigiLocker National Digital Wallet",
    description: "Access and share 100% authentic electronic government certificates, Marksheets, Driving Licence, RC, and Insurance copies.",
    url: "https://www.digilocker.gov.in/",
    category: "identity",
    tags: ["digilocker", "digital certificates", "marksheets", "driving licence digilocker", "govt wallet"],
  },

  // ==========================================
  // TRANSPORT & VEHICLE SERVICES
  // ==========================================
  {
    id: "parivahan-sarathi",
    title: "Sarathi Driving Licence Portal",
    description: "Apply for Learner's Licence (LL), Permanent Driving Licence (DL), DL Renewal, Slot Booking, and Duplicate Licence.",
    url: "https://sarathi.parivahan.gov.in/",
    category: "transport",
    tags: ["driving licence", "sarathi parivahan", "learning licence", "dl renewal", "rto licence"],
  },
  {
    id: "parivahan-vahan",
    title: "Vahan Vehicle RC Portal",
    description: "Vehicle Registration Certificate (RC) details, transfer of ownership, Hypothecation removal, Fitness certificate & NOC.",
    url: "https://vahan.parivahan.gov.in/",
    category: "transport",
    tags: ["vehicle rc", "vahan", "rc transfer", "gadi rc", "noc vehicle", "fitness certificate"],
  },
  {
    id: "parivahan-echallan",
    title: "e-Challan Payment & Dispute Portal",
    description: "Check pending traffic challans for any vehicle number or DL, pay traffic fines online, and submit dispute grievances.",
    url: "https://echallan.parivahan.gov.in/",
    category: "transport",
    tags: ["echallan", "traffic challan", "pay challan", "gadi fine", "traffic police challan"],
  },

  // ==========================================
  // TAXES, GST & BUSINESS SERVICES
  // ==========================================
  {
    id: "income-tax-efiling",
    title: "Income Tax e-Filing Portal (ITR)",
    description: "File annual Income Tax Returns (ITR-1 to 4), track refund processing, e-Verify returns, and view AIS / Form 26AS tax credits.",
    url: "https://www.incometax.gov.in/",
    category: "business",
    tags: ["itr filing", "income tax return", "itr refund", "26as", "ais statement", "tax portal"],
  },
  {
    id: "gst-portal",
    title: "GST e-Filing & Search Portal",
    description: "File monthly GSTR-1, GSTR-3B, GSTR-9 annual returns, search GSTIN taxpayer details, and track tax refund credits.",
    url: "https://www.gst.gov.in/",
    category: "business",
    tags: ["gst portal", "gst return", "gstr 3b", "gstr 1", "search gst", "gstin number"],
  },
  {
    id: "udyam-msme",
    title: "Udyam MSME Registration (Zero Fee)",
    description: "Register Micro, Small, and Medium Enterprises online for free without intermediaries to obtain government MSME certificate.",
    url: "https://udyamregistration.gov.in/",
    category: "business",
    tags: ["udyam registration", "msme certificate", "small business reg", "udyam zero fee"],
  },

  // ==========================================
  // WELFARE, PENSION & EMPLOYMENT
  // ==========================================
  {
    id: "eshram-portal",
    title: "e-Shram National Worker Database",
    description: "National database of unorganized workers to get UAN e-Shram card and avail Rs. 2 Lakh accidental insurance and central welfare schemes.",
    url: "https://eshram.gov.in/",
    category: "welfare",
    tags: ["eshram", "e shram card", "shramik card", "labour card", "unorganized workers scheme"],
  },
  {
    id: "pm-kisan",
    title: "PM-Kisan Samman Nidhi Portal",
    description: "Check PM-Kisan beneficiary payment status (Rs. 6,000/yr), complete biometric eKYC, update bank details, and register new farmers.",
    url: "https://pmkisan.gov.in/",
    category: "welfare",
    tags: ["pm kisan", "kisan samman nidhi", "pm kisan status", "farmer subsidy", "pm kisan ekyc"],
  },
  {
    id: "epfo-member",
    title: "EPFO Member e-Sewa (PF Portal)",
    description: "Check EPF Passbook balance, activate UAN, file online PF withdrawal claims (Form 19, 10C, 31 Advance), and transfer PF.",
    url: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
    category: "welfare",
    tags: ["epfo", "pf withdrawal", "epf passbook", "uan login", "provident fund", "pf claim"],
  },
  {
    id: "ncs-job-portal",
    title: "National Career Service (NCS Govt)",
    description: "Ministry of Labour & Employment verified job portal for govt & private vacancies, job fairs, and national skill training.",
    url: "https://www.ncs.gov.in/",
    category: "welfare",
    tags: ["ncs", "national career service", "sarkari job", "employment portal", "ncs registration"],
  },

  // ==========================================
  // ALL 28 STATES & UNION TERRITORIES
  // (Land Records / Parcha / Bhulekh, Ration, e-District)
  // ==========================================

  // --- 1. WEST BENGAL ---
  {
    id: "wb-land-banglarbhumi",
    title: "Banglarbhumi Land Records & Porcha",
    description: "Search West Bengal Land Records, check Khatian / Plot info, download Porcha (RoR), track Mutation status & Mouza Maps online.",
    url: "https://banglarbhumi.gov.in/",
    category: "land",
    state: "West Bengal",
    tags: ["banglarbhumi", "porcha", "khatian", "plot information", "land records wb", "mutation status", "parcha", "west bengal land"],
    featured: true,
  },
  {
    id: "wb-ration-wbpds",
    title: "WBPDS Digital Ration Card Portal",
    description: "Search West Bengal Digital Ration Card details (AAY, SPHH, PHH, RKSY), check e-Ration status, link Aadhaar with Ration.",
    url: "https://food.wb.gov.in/",
    category: "ration",
    state: "West Bengal",
    tags: ["wb ration card", "wbpds", "khadya sathi", "ration status wb", "digital ration"],
  },
  {
    id: "wb-edistrict",
    title: "West Bengal e-District 2.0",
    description: "Apply online for SC/ST/OBC Caste Certificate, Residential Certificate, Income Certificate, and Land Domicile in West Bengal.",
    url: "https://edistrict.wb.gov.in/",
    category: "edistrict",
    state: "West Bengal",
    tags: ["wb edistrict", "caste certificate wb", "income certificate wb", "residential certificate", "domicile wb"],
  },

  // --- 2. UTTAR PRADESH ---
  {
    id: "up-bhulekh",
    title: "UP Bhulekh Land Records (Khasra/Khatauni/Parcha)",
    description: "Search Uttar Pradesh plot Khasra/Khatauni, verified Land Parcha, RoR certified copy, Gata unique code, and Bhu-Naksha map.",
    url: "https://upbhulekh.gov.in/",
    category: "land",
    state: "Uttar Pradesh",
    tags: ["up bhulekh", "khasra", "khatauni", "land parcha up", "bhu naksha up", "gata number", "up land records", "parcha"],
    featured: true,
  },
  {
    id: "up-ration-fcs",
    title: "FCS UP Ration Card Portal",
    description: "Search UP Ration Card eligibility list (Patrata Suchi), download Ration Card slips, add family members, and check quota.",
    url: "https://fcs.up.gov.in/",
    category: "ration",
    state: "Uttar Pradesh",
    tags: ["up ration card", "fcs up", "patrata suchi", "up rashan", "ration list up"],
  },
  {
    id: "up-edistrict",
    title: "e-District Uttar Pradesh (Jati/Aay/Niwas)",
    description: "Apply for Caste (Jati), Income (Aay), Domicile (Niwas/Nivas), and Birth/Death certificates in Uttar Pradesh.",
    url: "https://edistrict.up.gov.in/",
    category: "edistrict",
    state: "Uttar Pradesh",
    tags: ["up edistrict", "jati praman patra", "aay praman patra", "niwas praman patra", "up certificates"],
  },

  // --- 3. BIHAR ---
  {
    id: "bihar-bhumi",
    title: "Bihar Bhumi Jankari & Jamabandi (Land Parcha)",
    description: "View Bihar Jamabandi Register-II, Land Parcha, Khasra-Khata details, Land Possession Certificate (LPC), and Dakhil Kharij mutation.",
    url: "https://biharbhumi.bihar.gov.in/",
    category: "land",
    state: "Bihar",
    tags: ["bihar bhumi", "jamabandi bihar", "land parcha bihar", "dakhil kharij", "lpc bihar", "khatiyan bihar", "parcha", "bihar land"],
    featured: true,
  },
  {
    id: "bihar-ration-epds",
    title: "EPDS Bihar Ration Card Portal",
    description: "Search Bihar Ration Card online list, download RC details, apply for new ration card (RCMS), and check district-wise allocations.",
    url: "http://epds.bihar.gov.in/",
    category: "ration",
    state: "Bihar",
    tags: ["bihar ration card", "epds bihar", "rcms bihar", "bihar rashan list", "ration search bihar"],
  },
  {
    id: "bihar-rtps",
    title: "RTPS Bihar Citizen Services (Service Online)",
    description: "Apply online for Jati (Caste), Aay (Income), Niwas (Residential), and Non-Creamy Layer (NCL/OBC/EWS) certificates in Bihar.",
    url: "https://serviceonline.bihar.gov.in/",
    category: "edistrict",
    state: "Bihar",
    tags: ["rtps bihar", "serviceonline bihar", "jati aay niwas bihar", "bihar ews certificate", "rtps 2"],
  },

  // --- 4. MAHARASHTRA ---
  {
    id: "maha-bhulekh",
    title: "Mahabhulekh Land Records (7/12 Satbara & 8A)",
    description: "Check Maharashtra 7/12 (Satbara) Utara, 8A land holding, Ferfar (mutation extracts), and Property Card records online.",
    url: "https://bhulekh.mahabhumi.gov.in/",
    category: "land",
    state: "Maharashtra",
    tags: ["mahabhulekh", "7 12 satbara", "satbara utara", "8a maharashtra", "ferfar", "mahabhumi", "land parcha", "maharashtra land"],
    featured: true,
  },
  {
    id: "maha-food-ration",
    title: "Maha Food & Civil Supplies (Ration)",
    description: "Search Maharashtra Ration Card status, RC details (AEPDS Maha), and Fair Price Shop (FPS) allocations.",
    url: "https://mahafood.gov.in/",
    category: "ration",
    state: "Maharashtra",
    tags: ["maharashtra ration card", "mahafood", "aepds maharashtra", "ration card 12 digit"],
  },
  {
    id: "maha-aaplesarkar",
    title: "Aaple Sarkar Maharashtra e-District",
    description: "Apply for Caste Certificate, Non-Creamy Layer, Domicile/Age Nationality, Income Certificate, and Land Revenue extracts in Maharashtra.",
    url: "https://aaplesarkar.mahaonline.gov.in/",
    category: "edistrict",
    state: "Maharashtra",
    tags: ["aaple sarkar", "caste certificate maharashtra", "domicile maharashtra", "income certificate maha"],
  },

  // --- 5. RAJASTHAN ---
  {
    id: "rajasthan-apnakhata",
    title: "Apna Khata / E-Dharti Rajasthan (Jamabandi/Nakal)",
    description: "View Rajasthan Jamabandi Nakal (Land Parcha), Khasra Girdawari, Bhu-Naksha maps, and Namantaran (mutation) status online.",
    url: "https://apnakhata.rajasthan.gov.in/",
    category: "land",
    state: "Rajasthan",
    tags: ["apna khata", "e dharti", "jamabandi rajasthan", "khasra nakal", "parcha rajasthan", "rajasthan land records"],
    featured: true,
  },
  {
    id: "rajasthan-food",
    title: "Food & Civil Supplies Rajasthan (Ration)",
    description: "Search Rajasthan Ration Card list, check NFSA status, Jan Aadhaar card integration, and dealer allotment.",
    url: "https://food.rajasthan.gov.in/",
    category: "ration",
    state: "Rajasthan",
    tags: ["rajasthan ration card", "food rajasthan", "nfsa rajasthan", "jan aadhaar ration"],
  },
  {
    id: "rajasthan-jansoochna",
    title: "Jan Soochna & e-Mitra Rajasthan",
    description: "All-in-one public information portal for caste, domicile, scholarships, pension, and government welfare benefits in Rajasthan.",
    url: "https://jansoochna.rajasthan.gov.in/",
    category: "edistrict",
    state: "Rajasthan",
    tags: ["jan soochna portal", "emitra rajasthan", "rajasthan caste certificate", "mool niwas rajasthan"],
  },

  // --- 6. MADHYA PRADESH ---
  {
    id: "mp-bhulekh",
    title: "MP Bhulekh Land Records (Khasra/Khatauni/B1)",
    description: "Search Madhya Pradesh Khasra/Khatauni copy, Land Parcha, B-1 Kishbandi Khatauni, Bhu-Naksha, and diverged land records.",
    url: "https://mpbhulekh.gov.in/",
    category: "land",
    state: "Madhya Pradesh",
    tags: ["mp bhulekh", "khasra khatauni mp", "b1 kistbandi", "land parcha mp", "bhu naksha mp", "madhya pradesh land"],
    featured: true,
  },
  {
    id: "mp-samagra",
    title: "Samagra Samajik Suraksha & Ration MP",
    description: "Check Samagra Family ID (SSSM ID), link Aadhaar eKYC, and search MP Food Security Ration eligibility.",
    url: "https://samagra.gov.in/",
    category: "ration",
    state: "Madhya Pradesh",
    tags: ["samagra portal", "samagra id", "mp ration card", "sssm id", "mp food security"],
  },
  {
    id: "mp-edistrict",
    title: "MP e-District (Lok Seva Guarantee)",
    description: "Online citizen services for Jati (Caste), Mool Niwas (Domicile), and Aay (Income) certificates under MP Lok Seva.",
    url: "https://mpedistrict.gov.in/",
    category: "edistrict",
    state: "Madhya Pradesh",
    tags: ["mp edistrict", "lok seva mp", "mool niwas mp", "jati praman patra mp"],
  },

  // --- 7. GUJARAT ---
  {
    id: "gujarat-anyror",
    title: "AnyROR Gujarat Land Records (7/12, 8A, VF6)",
    description: "Search Rural & Urban Land Records of Gujarat, 7/12 (Saat-Baara) Utara, 8A Khata, VF6 Mutation entry, and Notice 135-D.",
    url: "https://anyror.gujarat.gov.in/",
    category: "land",
    state: "Gujarat",
    tags: ["anyror gujarat", "anyror 7 12", "satbara gujarat", "8a gujarat", "vf6 mutation", "gujarat land records", "parcha"],
    featured: true,
  },
  {
    id: "gujarat-digital",
    title: "Digital Gujarat Portal & Ration Services",
    description: "Unified citizen portal for Gujarat Ration card services, Caste/Non-Creamy Layer certificates, and income certificates.",
    url: "https://www.digitalgujarat.gov.in/",
    category: "edistrict",
    state: "Gujarat",
    tags: ["digital gujarat", "gujarat ration", "gujarat caste certificate", "gujarat domicile"],
  },

  // --- 8. KARNATAKA ---
  {
    id: "karnataka-bhoomi",
    title: "Bhoomi Karnataka Land Portal (RTC / Pahani)",
    description: "Search Karnataka RTC (Record of Rights, Tenancy and Crop - Pahani), Mutation status, Mutation register, and survey maps.",
    url: "https://landrecords.karnataka.gov.in/",
    category: "land",
    state: "Karnataka",
    tags: ["bhoomi karnataka", "rtc pahani", "karnataka land records", "mutation status karnataka", "land parcha"],
    featured: true,
  },
  {
    id: "karnataka-ahara",
    title: "Ahara Karnataka Ration Card Portal",
    description: "Search Karnataka Ration Card status, apply for new BPL/APL cards, check member details and coupon allocations.",
    url: "https://ahara.kar.nic.in/",
    category: "ration",
    state: "Karnataka",
    tags: ["ahara karnataka", "karnataka ration card", "bpl card karnataka", "ahara kar nic in"],
  },
  {
    id: "karnataka-sevasindhu",
    title: "Seva Sindhu Karnataka e-District",
    description: "Karnataka government integrated portal for Gruha Lakshmi, Caste & Income certificates, Domicile, and citizen welfare schemes.",
    url: "https://sevasindhu.karnataka.gov.in/",
    category: "edistrict",
    state: "Karnataka",
    tags: ["seva sindhu", "karnataka certificates", "caste income karnataka", "gruha lakshmi"],
  },

  // --- 9. PUNJAB ---
  {
    id: "punjab-plrs",
    title: "PLRS Punjab Land Records (Fard / Jamabandi)",
    description: "Search Punjab Land Records Society (PLRS) Jamabandi, Fard online copy (Land Parcha), Mutation (Inteqal), and Roznamcha.",
    url: "https://plrs.org.in/",
    category: "land",
    state: "Punjab",
    tags: ["plrs punjab", "punjab fard", "jamabandi punjab", "inteqal", "punjab land records", "parcha punjab"],
    featured: true,
  },
  {
    id: "punjab-esewa",
    title: "e-Sewa Punjab & Ration Portal",
    description: "Citizen portal for Punjab Ration cards, SC/BC Caste Certificate, Residence Certificate, and Rural Area Certificates.",
    url: "https://esewa.punjab.gov.in/",
    category: "edistrict",
    state: "Punjab",
    tags: ["esewa punjab", "punjab ration card", "punjab caste certificate", "residence certificate punjab"],
  },

  // --- 10. HARYANA ---
  {
    id: "haryana-jamabandi",
    title: "Jamabandi Haryana Land Records (Nakal/RoR)",
    description: "Search Haryana Jamabandi Nakal (Land Parcha), Mutation status, Registry appointment, Collector rates, and cadastral maps.",
    url: "https://jamabandi.nic.in/",
    category: "land",
    state: "Haryana",
    tags: ["jamabandi haryana", "nakal haryana", "haryana land records", "inteqal haryana", "parcha haryana"],
    featured: true,
  },
  {
    id: "haryana-saral",
    title: "Antyodaya SARAL & Parivar Pehchan Patra (PPP)",
    description: "Apply for Haryana Family ID (PPP), Ration card, SC/OBC certificate, Resident certificate, and income verification.",
    url: "https://saralharyana.gov.in/",
    category: "edistrict",
    state: "Haryana",
    tags: ["saral haryana", "parivar pehchan patra", "ppp haryana", "haryana ration card", "haryana domicile"],
  },

  // --- 11. ANDHRA PRADESH ---
  {
    id: "ap-meebhoomi",
    title: "Meebhoomi Andhra Pradesh Land Records (Adangal/1-B)",
    description: "Check AP Land Records, Adangal (Pahani), 1-B Record of Rights (RoR), Village Map, FMB, and electronic Passbook online.",
    url: "https://meebhoomi.ap.gov.in/",
    category: "land",
    state: "Andhra Pradesh",
    tags: ["meebhoomi", "adangal ap", "1b ror", "ap land records", "andhra land parcha", "passbook ap"],
    featured: true,
  },
  {
    id: "ap-epds",
    title: "EPDS Andhra Pradesh Ration Card Portal",
    description: "Search AP Rice Card / Ration Card details, check status by Aadhaar number, and verify monthly quota allotment.",
    url: "https://epds2.ap.gov.in/",
    category: "ration",
    state: "Andhra Pradesh",
    tags: ["ap ration card", "ap rice card", "epds ap", "meeseva ration"],
  },
  {
    id: "ap-meeseva",
    title: "AP Meeseva Citizen Portal",
    description: "Apply for Integrated Caste & Residence certificates, Income certificates, Family Member certificates in Andhra Pradesh.",
    url: "https://ap.meeseva.gov.in/",
    category: "edistrict",
    state: "Andhra Pradesh",
    tags: ["ap meeseva", "meeseva portal", "ap caste certificate", "ap residence certificate"],
  },

  // --- 12. TELANGANA ---
  {
    id: "telangana-dharani",
    title: "Dharani Integrated Land Records Telangana",
    description: "Search Telangana Land Records, ROR 1-B, Pahani, Mutation, Registered Document details, and slot booking for registries.",
    url: "https://dharani.telangana.gov.in/",
    category: "land",
    state: "Telangana",
    tags: ["dharani telangana", "dharani portal", "pahani telangana", "ror 1b tg", "telangana land records", "parcha"],
    featured: true,
  },
  {
    id: "telangana-meeseva",
    title: "Telangana Meeseva & Food Security Portal",
    description: "Check Telangana FSC Food Security Ration Card, apply for Community & Date of Birth, Income, and Residence certificates.",
    url: "https://tg.meeseva.gov.in/",
    category: "edistrict",
    state: "Telangana",
    tags: ["tg meeseva", "telangana ration card", "fsc card tg", "telangana caste certificate"],
  },

  // --- 13. TAMIL NADU ---
  {
    id: "tn-pattachitta",
    title: "AnyWhere AnyTime Patta & Chitta Extract (Tamil Nadu)",
    description: "View and verify Tamil Nadu Patta / Chitta extracts (Land Parcha), FMB sketches, TSLR extracts, and Poramboke land status.",
    url: "https://eservices.tn.gov.in/eservicesnew/land/chitta.html",
    category: "land",
    state: "Tamil Nadu",
    tags: ["patta chitta", "tamil nadu land records", "fmb sketch", "tslr extract", "patta transfer", "parcha tn"],
    featured: true,
  },
  {
    id: "tn-tnpds",
    title: "TNPDS Smart Ration Card Portal",
    description: "Search Tamil Nadu Smart Family Card details, download e-Ration card, add/remove family members, and check PDS shop stock.",
    url: "https://www.tnpds.gov.in/",
    category: "ration",
    state: "Tamil Nadu",
    tags: ["tnpds", "smart ration card tn", "tamil nadu ration", "tn food card"],
  },
  {
    id: "tn-tnesevai",
    title: "TNeGA e-Sevai Citizen Portal",
    description: "Apply for Community (Caste) Certificate, Nativity (Domicile) Certificate, Income Certificate, and Legal Heir Certificate in Tamil Nadu.",
    url: "https://www.tnesevai.tn.gov.in/",
    category: "edistrict",
    state: "Tamil Nadu",
    tags: ["tnesevai", "tnega", "community certificate tn", "nativity certificate tn", "income certificate tn"],
  },

  // --- 14. ODISHA ---
  {
    id: "odisha-bhulekh",
    title: "Bhulekh Odisha Land Records (RoR / Khatiyan)",
    description: "Search Odisha Record of Rights (RoR), Khatiyan details, Plot info (Land Parcha), Map views, and Tahasil mutation records.",
    url: "https://bhulekh.ori.nic.in/",
    category: "land",
    state: "Odisha",
    tags: ["bhulekh odisha", "ror odisha", "khatiyan odisha", "odisha land records", "parcha odisha"],
    featured: true,
  },
  {
    id: "odisha-ration-edistrict",
    title: "Odisha e-District & Food Supplies",
    description: "Apply for Resident/Caste/Income certificates and check Odisha NFSA & SFSS Ration Card beneficiary lists.",
    url: "https://edistrict.odisha.gov.in/",
    category: "edistrict",
    state: "Odisha",
    tags: ["odisha edistrict", "odisha ration card", "food odisha", "caste certificate odisha"],
  },

  // --- 15. JHARKHAND ---
  {
    id: "jharkhand-jharbhoomi",
    title: "Jharbhoomi Jharkhand Land Records (Khatian / Parcha)",
    description: "Check Jharkhand Land Records, Apna Khata, Register-II, Khasra details, Land Possession Certificate (LPC), and mutation records.",
    url: "https://jharbhoomi.jharkhand.gov.in/",
    category: "land",
    state: "Jharkhand",
    tags: ["jharbhoomi", "jharkhand land records", "apna khata jharkhand", "khatian jharkhand", "parcha jharkhand", "register 2"],
    featured: true,
  },
  {
    id: "jharkhand-aahar",
    title: "Aahar Jharkhand Ration Portal (JSFSS)",
    description: "Search Jharkhand Ration Card distribution, check green ration cards, dealer list, and monthly foodgrain entitlement.",
    url: "https://aahar.jharkhand.gov.in/",
    category: "ration",
    state: "Jharkhand",
    tags: ["aahar jharkhand", "jharkhand ration card", "jsfss", "green ration card"],
  },
  {
    id: "jharkhand-jharsewa",
    title: "JharSewa Jharkhand Citizen e-District",
    description: "Apply for JharSewa Caste Certificate, Local Resident Certificate (Residential), and Income Certificate in Jharkhand.",
    url: "https://jharsewa.jharkhand.gov.in/",
    category: "edistrict",
    state: "Jharkhand",
    tags: ["jharsewa", "jharkhand caste certificate", "jharkhand resident certificate", "jharsewa login"],
  },

  // --- 16. CHHATTISGARH ---
  {
    id: "cg-bhuiyan",
    title: "Bhuiyan CG Land Records (Khasra P-II / B-I)",
    description: "Search Chhattisgarh Land Records, Khasra (P-II), Khatauni (B-I), Land Parcha, Digital Signatures, and Bhu-Naksha map.",
    url: "https://bhuiyan.cg.nic.in/",
    category: "land",
    state: "Chhattisgarh",
    tags: ["bhuiyan cg", "cg land records", "khasra p2", "khatauni b1", "parcha cg", "chhattisgarh bhulekh"],
    featured: true,
  },
  {
    id: "cg-khadya",
    title: "CG Khadya Ration Portal & e-District",
    description: "Search Chhattisgarh Ration Card list, check PDS allocations, and apply for citizen certificates on e-District CG.",
    url: "https://khadya.cg.nic.in/",
    category: "ration",
    state: "Chhattisgarh",
    tags: ["cg khadya", "chhattisgarh ration card", "cg edistrict", "ration suchi cg"],
  },

  // --- 17. ASSAM ---
  {
    id: "assam-basundhara",
    title: "Mission Basundhara / Dharitree Assam Land Records",
    description: "Search Assam Jamabandi, Dag details, Patta information (Land Parcha), Mutation by inheritance, and Village land maps.",
    url: "https://basundhara.assam.gov.in/",
    category: "land",
    state: "Assam",
    tags: ["mission basundhara", "dharitree assam", "jamabandi assam", "patta assam", "assam land records", "parcha assam"],
    featured: true,
  },
  {
    id: "assam-sewasetu",
    title: "Sewa Setu Assam Citizen Portal & Ration",
    description: "Apply for Caste, PRC (Permanent Resident Certificate), Non-Creamy Layer, and National Food Security Ration cards in Assam.",
    url: "https://sewasetu.assam.gov.in/",
    category: "edistrict",
    state: "Assam",
    tags: ["sewa setu assam", "prc assam", "caste certificate assam", "assam ration card"],
  },

  // --- 18. KERALA ---
  {
    id: "kerala-erekha",
    title: "E-Rekha Kerala Survey & Land Records",
    description: "Search Kerala Resurvey Records, Field Measurement Book (FMB) sketches, Village survey maps, and settlement registers.",
    url: "https://erekha.kerala.gov.in/",
    category: "land",
    state: "Kerala",
    tags: ["erekha kerala", "kerala land records", "fmb sketch kerala", "resurvey kerala"],
  },
  {
    id: "kerala-edistrict-ration",
    title: "e-District Kerala & Civil Supplies Ration",
    description: "Citizen portal for Kerala Electronic Ration Cards, Caste/Community certificates, Nativity certificates, and Income proofs.",
    url: "https://edistrict.kerala.gov.in/",
    category: "edistrict",
    state: "Kerala",
    tags: ["edistrict kerala", "civil supplies kerala", "kerala ration card", "nativity kerala"],
  },

  // --- 19. UTTARAKHAND ---
  {
    id: "uk-bhulekh",
    title: "Devbhoomi Bhulekh Uttarakhand (Khatauni/Parcha)",
    description: "Search Uttarakhand Khatauni copy, Land Parcha, Khasra details, Certified RoR, and district mutation registers.",
    url: "https://bhulekh.uk.gov.in/",
    category: "land",
    state: "Uttarakhand",
    tags: ["bhulekh uk", "devbhoomi bhulekh", "uttarakhand land records", "khatauni uk", "parcha uttarakhand"],
  },
  {
    id: "uk-edistrict",
    title: "e-Services Uttarakhand (e-District)",
    description: "Apply online for Jati (Caste), Sthaniya Niwas (Domicile), Aay (Income), and Ration card verification in Uttarakhand.",
    url: "https://eservices.uk.gov.in/",
    category: "edistrict",
    state: "Uttarakhand",
    tags: ["uk edistrict", "uttarakhand caste certificate", "sthaniya niwas uk", "uk ration card"],
  },

  // --- 20. HIMACHAL PRADESH ---
  {
    id: "hp-himbhoomi",
    title: "Himbhoomi Himachal Pradesh Land Records",
    description: "Search Himachal Pradesh Jamabandi Nakal (Land Parcha), Shajra Nasb pedigree table, Mutation status, and Land verification.",
    url: "https://lrc.hp.nic.in/",
    category: "land",
    state: "Himachal Pradesh",
    tags: ["himbhoomi", "hp land records", "jamabandi hp", "shajra nasb", "himachal land parcha"],
  },
  {
    id: "hp-edistrict",
    title: "e-District Himachal Pradesh & ePDS",
    description: "Apply for Bonafide Himachali certificate, Category certificates, and check HP Digital Ration Cards.",
    url: "https://edistrict.hp.gov.in/",
    category: "edistrict",
    state: "Himachal Pradesh",
    tags: ["hp edistrict", "bonafide himachali", "epds hp", "hp ration card"],
  },

  // --- 21. GOA ---
  {
    id: "goa-dslr",
    title: "DSLR Goa Land Records (Form I & XIV)",
    description: "Search Goa Land Records Form I & XIV, Mutation extracts, Title confirmation, and Cadastral survey plans online.",
    url: "https://dslr.goa.gov.in/",
    category: "land",
    state: "Goa",
    tags: ["dslr goa", "goa land records", "form 1 and 14 goa", "mutation goa"],
  },
  {
    id: "goa-online",
    title: "GoaOnline Citizen Services Portal",
    description: "Apply for Residence Certificate, Caste Certificate, Income Certificate, and Ration card updates in Goa.",
    url: "https://goaonline.gov.in/",
    category: "edistrict",
    state: "Goa",
    tags: ["goa online", "goa caste certificate", "goa residence certificate", "goa ration card"],
  },

  // --- 22. TRIPURA ---
  {
    id: "tripura-jami",
    title: "Jami Tripura Land Records Portal (Khatian/Plot)",
    description: "Search Tripura Khatian details (Land Parcha), Plot information, Mutation status, and Mouza land map views.",
    url: "https://jami.tripura.gov.in/",
    category: "land",
    state: "Tripura",
    tags: ["jami tripura", "tripura land records", "khatian tripura", "parcha tripura"],
  },

  // --- 23. MANIPUR ---
  {
    id: "manipur-louchapathap",
    title: "Loucha Pathap Manipur Land Records",
    description: "Search Manipur Jamabandi / Patta (Land Parcha), Dag information, Mutation details, and Land tax records.",
    url: "https://louchapathap.nic.in/",
    category: "land",
    state: "Manipur",
    tags: ["loucha pathap", "manipur land records", "patta manipur", "dag manipur"],
  },

  // --- 24. MEGHALAYA ---
  {
    id: "meghalaya-edistrict",
    title: "Meghalaya e-District & Land Services",
    description: "Apply for Scheduled Tribe (ST) Certificate, Permanent Resident Certificate, and Food Security Ration in Meghalaya.",
    url: "https://megedistrict.gov.in/",
    category: "edistrict",
    state: "Meghalaya",
    tags: ["meghalaya edistrict", "prc meghalaya", "st certificate meghalaya", "meghalaya ration"],
  },

  // --- 25. MIZORAM ---
  {
    id: "mizoram-landrevenue",
    title: "Land Revenue & Settlement Mizoram",
    description: "Check Land Settlement status, Land Holding certificates, and citizen e-Services in Mizoram.",
    url: "https://landrevenue.mizoram.gov.in/",
    category: "land",
    state: "Mizoram",
    tags: ["mizoram land revenue", "mizoram land records", "land holding mizoram"],
  },

  // --- 26. NAGALAND ---
  {
    id: "nagaland-edistrict",
    title: "Nagaland e-District Services Portal",
    description: "Online citizen services for Indigenous Inhabitant Certificate, Backward Tribe Certificate, and Ration records in Nagaland.",
    url: "https://edistrict.nagaland.gov.in/",
    category: "edistrict",
    state: "Nagaland",
    tags: ["nagaland edistrict", "indigenous certificate nagaland", "nagaland citizen services"],
  },

  // --- 27. SIKKIM ---
  {
    id: "sikkim-landrevenue",
    title: "Sikkim Land Revenue & Disaster Management",
    description: "Official portal for Sikkim Land Revenue records, Mutation, Plot verification, and citizen certificates.",
    url: "https://sikkimlrd.gov.in/",
    category: "land",
    state: "Sikkim",
    tags: ["sikkim land revenue", "sikkim land records", "sikkim mutation"],
  },

  // --- 28. ARUNACHAL PRADESH ---
  {
    id: "arunachal-eservice",
    title: "Service Plus Arunachal Pradesh (e-District)",
    description: "Apply for APST (Scheduled Tribe) Certificate, PRC, Domicile, and Revenue land services in Arunachal Pradesh.",
    url: "https://eservice.arunachal.gov.in/",
    category: "edistrict",
    state: "Arunachal Pradesh",
    tags: ["arunachal eservice", "apst certificate", "prc arunachal", "arunachal revenue"],
  },

  // ==========================================
  // UNION TERRITORIES
  // ==========================================

  // --- 29. DELHI (NCT) ---
  {
    id: "delhi-dlrc",
    title: "DLRC Delhi Land Records (Khasra/Khatauni)",
    description: "Search Delhi Land Records, verified Khasra/Khatauni details, Jamabandi, and Revenue Court status in NCT of Delhi.",
    url: "https://dlrc.delhigovt.nic.in/",
    category: "land",
    state: "Delhi (NCT)",
    tags: ["delhi land records", "dlrc delhi", "khasra delhi", "khatauni delhi", "parcha delhi"],
    featured: true,
  },
  {
    id: "delhi-edistrict",
    title: "e-District Delhi Citizen Services & Ration",
    description: "Apply for SC/ST/OBC Certificate, Domicile Certificate, Income Certificate, and check Delhi e-Ration Card status.",
    url: "https://edistrict.delhigovt.nic.in/",
    category: "edistrict",
    state: "Delhi (NCT)",
    tags: ["edistrict delhi", "delhi caste certificate", "delhi domicile", "delhi ration card", "nfs delhi"],
  },

  // --- 30. JAMMU & KASHMIR ---
  {
    id: "jk-landrecords",
    title: "J&K Land Records (Apki Zameen Apki Nigrani)",
    description: "Search Jammu & Kashmir Jamabandi, Girdawari, Mutation records (Land Parcha), and digitized cadastral maps.",
    url: "https://landrecords.jk.gov.in/",
    category: "land",
    state: "Jammu & Kashmir",
    tags: ["jk land records", "apki zameen apki nigrani", "jamabandi jk", "parcha jk", "girdawari jk"],
  },
  {
    id: "jk-eunnat",
    title: "J&K e-Unnat Single Window Citizen Portal",
    description: "Apply for Domicile Certificate, Category Certificates, and check J&K Food & Civil Supplies Ration cards.",
    url: "https://eunnat.jk.gov.in/",
    category: "edistrict",
    state: "Jammu & Kashmir",
    tags: ["eunnat jk", "jk domicile certificate", "jk ration card"],
  },

  // --- 31. PUDUCHERRY ---
  {
    id: "puducherry-nilamagal",
    title: "Nilamagal Puducherry Land Records",
    description: "Search Puducherry Patta / Chitta details (Land Parcha), FMB sketch, and settlement records online.",
    url: "https://nilamagal.py.gov.in/",
    category: "land",
    state: "Puducherry",
    tags: ["nilamagal puducherry", "patta puducherry", "puducherry land records"],
  },
  {
    id: "puducherry-edistrict",
    title: "Puducherry e-District Citizen Services",
    description: "Apply for Residence, Community, Nativity, and Income certificates in Union Territory of Puducherry.",
    url: "https://edistrict.py.gov.in/",
    category: "edistrict",
    state: "Puducherry",
    tags: ["puducherry edistrict", "residence certificate puducherry"],
  },

  // --- 32. CHANDIGARH ---
  {
    id: "chandigarh-services",
    title: "Chandigarh Administration e-Services",
    description: "Official portal for Chandigarh property & land services, Residence proofs, and digital citizen services.",
    url: "https://chdservices.gov.in/",
    category: "edistrict",
    state: "Chandigarh",
    tags: ["chandigarh services", "chandigarh property", "chandigarh residence"],
  },

  // --- 33. LADAKH ---
  {
    id: "ladakh-edistrict",
    title: "e-District Ladakh Citizen Portal",
    description: "Apply for Resident Certificate, ST/Category certificates, and revenue services in UT of Ladakh.",
    url: "https://edistrict.ladakh.gov.in/",
    category: "edistrict",
    state: "Ladakh",
    tags: ["ladakh edistrict", "resident certificate ladakh", "ladakh revenue"],
  },

  // --- 34. DADRA & NAGAR HAVELI AND DAMAN & DIU ---
  {
    id: "dnh-dd-services",
    title: "DNH & DD Service Online e-District",
    description: "Citizen portal for Domicile, Caste, Income, and Land Revenue services in Dadra & Nagar Haveli and Daman & Diu.",
    url: "https://serviceonline.gov.in/dnh/",
    category: "edistrict",
    state: "Dadra and Nagar Haveli and Daman and Diu",
    tags: ["dnh dd services", "daman diu edistrict", "dadra nagar haveli portal"],
  },

  // --- 35. ANDAMAN & NICOBAR ---
  {
    id: "andaman-edistrict",
    title: "Andaman & Nicobar e-District Services",
    description: "Apply for Local Certificate, Tribal Certificate, Income proof, and land records in Andaman & Nicobar Islands.",
    url: "https://edistrict.andaman.gov.in/",
    category: "edistrict",
    state: "Andaman and Nicobar Islands",
    tags: ["andaman edistrict", "andaman nicobar portal", "tribal certificate andaman"],
  },

  // --- 36. LAKSHADWEEP ---
  {
    id: "lakshadweep-portal",
    title: "Lakshadweep Citizen & Revenue Portal",
    description: "Official Administration portal for ST certificates, Resident documentation, and civic services in Lakshadweep.",
    url: "https://lakshadweep.gov.in/",
    category: "edistrict",
    state: "Lakshadweep",
    tags: ["lakshadweep portal", "lakshadweep services"],
  },
];
