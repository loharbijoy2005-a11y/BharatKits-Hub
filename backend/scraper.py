#!/usr/bin/env python3
"""
==============================================================================
ALL INDIA CENTRALIZED JOB PORTAL - LIVE SCRAPING & INGESTION PIPELINE
==============================================================================
1. National Career Service (NCS - ncs.gov.in) Aggregator
2. Weekly Employment News (Rozgar Samachar) & Public Govt Portals Extractor
3. Multi-Feed Private Job Engine (Live API & Public ATS Endpoints)
4. Robust URL Resolution & Link Verification
5. Deduplication & Supabase Upsert (Strictly NO hardcoded fake jobs)
==============================================================================
"""
import os
import sys
import re
import json
import time
import hashlib
import logging
import argparse
from urllib.parse import urljoin, urlparse, urlunparse
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional, Tuple
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment configuration
load_dotenv()

# Structured Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("MasterJobIngestionEngine")

DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
REQUEST_TIMEOUT = 12
VERIFICATION_TIMEOUT = 5

VALID_SECTORS = [
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
]

# ==============================================================================
# UNIVERSAL DATE NORMALIZER
# Converts all raw Indian job date formats to ISO-8601 (YYYY-MM-DD) or None.
# ==============================================================================

VAGUE_DATE_KEYWORDS = (
    "open", "ongoing", "walk", "immediate", "rolling", "till", "notified", "filled", "announced",
)

MONTH_MAP = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}


def normalize_date_to_iso(raw: Optional[str]) -> Optional[str]:
    """Convert any raw Indian job date string to ISO-8601 YYYY-MM-DD, or None."""
    if not raw:
        return None

    clean = raw.strip()
    lower = clean.lower()

    if any(kw in lower for kw in VAGUE_DATE_KEYWORDS):
        return None

    # Pattern 1: YYYY-MM-DD (already ISO)
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", clean)
    if m:
        return clean

    # Pattern 2: DD/MM/YYYY
    m = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", clean)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return date(y, mo, d).isoformat()
        except ValueError:
            return None

    # Pattern 3: DD-MM-YYYY
    m = re.fullmatch(r"(\d{1,2})-(\d{1,2})-(\d{4})", clean)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return date(y, mo, d).isoformat()
        except ValueError:
            return None

    # Pattern 4: DD Mon YYYY  (e.g. "15 Oct 2026", "05 Sep 2026")
    m = re.fullmatch(r"(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})", clean)
    if m:
        d, mon_str, y = int(m.group(1)), m.group(2).lower(), int(m.group(3))
        mo = MONTH_MAP.get(mon_str[:3])
        if mo:
            try:
                return date(y, mo, d).isoformat()
            except ValueError:
                return None

    # Pattern 5: DD Month YYYY  (e.g. "15 October 2026")
    m = re.fullmatch(r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", clean)
    if m:
        d, mon_str, y = int(m.group(1)), m.group(2).lower(), int(m.group(3))
        mo = MONTH_MAP.get(mon_str[:3])
        if mo:
            try:
                return date(y, mo, d).isoformat()
            except ValueError:
                return None

    return None


def compute_is_closed(parsed_iso: Optional[str]) -> Optional[bool]:
    """Return True if deadline has passed, False if still active, None if unknown."""
    if not parsed_iso:
        return None
    try:
        deadline = date.fromisoformat(parsed_iso)
        return deadline < date.today()
    except ValueError:
        return None

# ==============================================================================
# DYNAMIC LIVE PORTAL WEB SCRAPER & SANITIZATION PIPELINE
# ==============================================================================

def extract_live_portal_data(url: str, html_content: Optional[str] = None) -> Dict[str, Any]:
    """
    Extracts dynamic closing dates and vacancy figures directly from source websites.
    NO hardcoded fallback dates or mock values. Returns null if unparseable.
    Prints diagnostic logs for HTTP status code, raw HTML length, extracted raw text, and parsed JSON.
    """
    headers = {
        "User-Agent": DEFAULT_USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    
    status_code = 200
    if not html_content:
        try:
            resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            status_code = resp.status_code
            if resp.status_code == 200:
                html_content = resp.text
            else:
                logger.error(f"[SCRAPER DRY-RUN] Target URL: {url} | HTTP Status: {resp.status_code} | Raw HTML Length: 0 bytes")
                return {
                    "source_url": url,
                    "error": f"HTTP {resp.status_code}",
                    "raw_closing_date": None,
                    "parsed_iso_date": None,
                    "remaining_days": None,
                    "raw_vacancies": None,
                    "parsed_vacancies": None,
                    "is_closed": False,
                }
        except Exception as e:
            logger.error(f"[SCRAPER DRY-RUN] Target URL: {url} | Error fetching HTTP content: {e}")
            return {
                "source_url": url,
                "error": str(e),
                "raw_closing_date": None,
                "parsed_iso_date": None,
                "remaining_days": None,
                "raw_vacancies": None,
                "parsed_vacancies": None,
                "is_closed": False,
            }

    html_len = len(html_content) if html_content else 0
    soup = BeautifulSoup(html_content, "html.parser") if html_content else None
    text_content = soup.get_text(separator=" ") if soup else ""
    raw_snippet = text_content[:500].strip()

    # Multi-fallback RegEx & Selectors for Closing Date
    raw_date = None
    date_patterns = [
        r"(?:Last Date|Closing Date|Apply By|End Date)\s*[:\-]?\s*([0-9]{1,2}[\/\-\s.][A-Za-z0-9]+[\/\-\s.][0-9]{4})",
        r"(?:Last Date|Closing Date|Apply By|End Date)\s*[:\-]?\s*([0-9]{4}[\/\-][0-9]{1,2}[\/\-][0-9]{1,2})",
        r"\b([0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+[0-9]{4})\b",
    ]

    for pat in date_patterns:
        match = re.search(pat, text_content, re.IGNORECASE)
        if match:
            raw_date = match.group(1).strip()
            break

    # Multi-fallback RegEx & Selectors for Vacancy Figures
    raw_vacancies = None
    vacancy_patterns = [
        r"(?:Vacancies|Total Posts|No\. of Posts|Seats|Openings)\s*[:\-]?\s*([0-9,]+(?:\s+Posts|\s+Vacancies)?)",
        r"\b([0-9,]{3,7})\s+(?:Vacancies|Posts|Positions)\b",
    ]

    for pat in vacancy_patterns:
        match = re.search(pat, text_content, re.IGNORECASE)
        if match:
            raw_vacancies = match.group(1).strip()
            break

    parsed_iso = normalize_date_to_iso(raw_date) if raw_date else None
    rem_days = None
    if parsed_iso:
        try:
            target = datetime.strptime(parsed_iso, "%Y-%m-%d").date()
            rem_days = (target - date.today()).days
        except Exception:
            rem_days = None

    parsed_vacs = None
    if raw_vacancies:
        m_vac = re.search(r"\b(\d{1,3}(?:,\d{3})+|\d{2,6})\b", raw_vacancies)
        if m_vac:
            try:
                parsed_vacs = int(m_vac.group(1).replace(",", ""))
            except ValueError:
                parsed_vacs = None

    result = {
        "source_url": url,
        "raw_closing_date": raw_date,
        "parsed_iso_date": parsed_iso,
        "remaining_days": rem_days,
        "raw_vacancies": raw_vacancies,
        "parsed_vacancies": parsed_vacs,
        "is_closed": rem_days < 0 if rem_days is not None else False
    }

    # Console dry-run log deliverable output
    safe_sample = raw_snippet[:200].encode("ascii", "ignore").decode("ascii")
    logger.info(f"[SCRAPER DRY-RUN] Target URL: {url}")
    logger.info(f"[SCRAPER DRY-RUN] HTTP Status Code: {status_code} | Raw HTML Length: {html_len} bytes")
    logger.info(f"[SCRAPER DRY-RUN] Raw Extracted Text Sample (before date formatting): {safe_sample}...")
    logger.info(f"[SCRAPER DRY-RUN] Final Parsed JSON Object: {json.dumps(result)}")

    return result


# ==============================================================================
# 1. SECTOR CLASSIFICATION RULE ENGINE
# ==============================================================================

class SectorClassificationEngine:
    """Classifies any Indian job opening into one of the 10 authoritative sectors."""

    @classmethod
    def classify(cls, title: str, dept_or_comp: str = "", source: str = "", category: str = "government") -> str:
        text = f"{title} {dept_or_comp} {source}".lower()

        if category == "private" or any(k in text for k in ["ats", "greenhouse", "lever", "arbeitnow", "jobicy", "software", "developer", "frontend", "backend", "fullstack", "react", "golang", "devops", "bpo", "operations manager"]):
            if not any(k in text for k in ["upsc", "ssc", "rrb", "tet", "post office", "police", "aiims", "nhm", "high court", "drdo", "isro"]):
                return "Private & Corporate"

        if re.search(r"\b(post office|india post|gds|gramin dak sevak|gram dak sevak|gram sevak|sachiv|patwari|panchayat|postman|mail guard|dak vibhag)\b", text, re.I):
            return "Panchayat & Postal"

        if re.search(r"\b(tet|ctet|kvs|nvs|dsssb|teacher|prt|tgt|pgt|professor|lecturer|shikshak|b\.ed|d\.el\.ed|shiksha|reet|htet|jtet|btet|uptet|university faculty|guest faculty)\b", text, re.I):
            return "Teaching & Education"

        if re.search(r"\b(aiims|nurse|nursing|norcet|nhm|pharmacist|medical|hospital|doctor|cho|anm|gnm|mbbs|health officer|ayush|paramedical|lab technician)\b", text, re.I):
            return "Medical & Health"

        if re.search(r"\b(rrb|rrc|railway|ntpc|alp|loco pilot|group d|technician|irctc|konkan railway|metro rail|dmrc)\b", text, re.I):
            return "Railway"

        if re.search(r"\b(police|constable|sub-inspector|\bsi\b|army|navy|air force|afcat|crpf|bsf|cisf|itbp|ssb|defence|agniveer|commandant|rpf|assam rifles|coast guard)\b", text, re.I):
            return "Police & Defence"

        if re.search(r"\b(bank|ibps|sbi|rbi|nabard|sidbi|lic|insurance|niacl|gic|po|clerk|specialist officer|financial analyst)\b", text, re.I):
            return "Banking & Finance"

        if re.search(r"\b(ssc|upsc|cgl|chsl|mts|cpo|nda|cds|civil services|ias|ips|ifs|central secretariat|high court|supreme court|court staff|judicial)\b", text, re.I):
            return "Central SSC & UPSC"

        if re.search(r"\b(isro|drdo|csir|coal india|bhel|ongc|ntpc|iocl|bpcl|gail|bel|sail|gate|scientist|engineer|trainee|psu|barc|hal|ecil|nalco)\b", text, re.I):
            return "PSU & Engineering"

        if re.search(r"\b(psc|wbpsc|uppsc|bpsc|jpsc|mpsc|kpsc|tnpsc|gpsc|appsc|tspsc|opsc|rpsc|sssc|hssc|rsmssb|bssc|jssc|subordinate|collectorate)\b", text, re.I):
            return "State PSC & Subordinate"

        return "State PSC & Subordinate" if category == "government" else "Private & Corporate"


# ==============================================================================
# 2. URL SANITIZER & LINK VERIFIER
# ==============================================================================

class URLSanitizer:
    DISALLOWED_PREFIXES = ("javascript:", "void(0)", "void 0", "mailto:", "tel:", "#", "about:blank")

    @staticmethod
    def clean_text(text: Optional[str]) -> str:
        if not text:
            return ""
        return " ".join(text.split()).strip()

    @classmethod
    def sanitize_url(cls, raw_url: Optional[str], base_url: str = "") -> Optional[str]:
        if not raw_url:
            return None

        clean = raw_url.strip()
        lower_clean = clean.lower()

        if any(lower_clean.startswith(prefix) for prefix in cls.DISALLOWED_PREFIXES):
            return None

        if base_url:
            try:
                clean = urljoin(base_url, clean)
            except Exception:
                pass

        try:
            parsed = urlparse(clean)
            if parsed.scheme not in ("http", "https") or not parsed.netloc:
                return None

            norm_path = "/".join(seg for seg in parsed.path.split("/") if seg or seg == "")
            if not norm_path.startswith("/"):
                norm_path = "/" + norm_path

            cleaned_url = urlunparse((parsed.scheme, parsed.netloc, norm_path, parsed.params, parsed.query, ""))
            return cleaned_url
        except Exception:
            return None


class LinkVerifier:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update({
            "User-Agent": DEFAULT_USER_AGENT,
            "Accept": "application/pdf,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })

    def verify_link(self, target_url: Optional[str], fallback_url: str) -> Tuple[str, bool]:
        if not target_url:
            return fallback_url, False

        clean_target = URLSanitizer.sanitize_url(target_url, base_url=fallback_url)
        if not clean_target:
            return fallback_url, False

        try:
            resp = self.session.head(
                clean_target,
                timeout=VERIFICATION_TIMEOUT,
                allow_redirects=True,
            )

            if resp.status_code in (405, 403, 501):
                resp = self.session.get(
                    clean_target,
                    timeout=VERIFICATION_TIMEOUT,
                    stream=True,
                    allow_redirects=True,
                )

            if 200 <= resp.status_code < 300:
                return clean_target, True
            else:
                return fallback_url, False
        except Exception:
            return fallback_url, False


class DeduplicationEngine:
    @staticmethod
    def generate_hash(category: str, title: str, apply_url: str, dept_or_comp: str = "") -> str:
        raw_payload = f"{category.lower()}::{dept_or_comp.lower()}::{title.lower()}::{apply_url.strip().lower()}"
        return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()


class BaseIngestor:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update({
            "User-Agent": DEFAULT_USER_AGENT,
            "Accept": "application/json, text/html, application/xml, text/xml, */*",
        })
        self.verifier = LinkVerifier(self.session)

    def fetch_url(self, url: str, retries: int = 2) -> Optional[requests.Response]:
        for attempt in range(retries + 1):
            try:
                resp = self.session.get(url, timeout=REQUEST_TIMEOUT)
                if resp.status_code == 200:
                    return resp
            except Exception as e:
                if attempt == retries:
                    logger.warning(f"Failed to fetch {url} after {retries} retries: {e}")
                time.sleep(1)
        return None


# ==============================================================================
# 3. MASTER PIPE 1: NATIONAL CAREER SERVICE (NCS - ncs.gov.in) AGGREGATOR
# ==============================================================================

class NCSIngestor(BaseIngestor):
    """
    Ingests public job disclosures directly from National Career Service (NCS).
    STRICTLY NO hardcoded fallback jobs or static dates.
    """

    NCS_PORTAL_BASE = "https://www.ncs.gov.in"

    def fetch_ncs_jobs(self) -> List[Dict[str, Any]]:
        jobs = []
        logger.info("Ingesting from Master Pipe 1: National Career Service (NCS)...")

        target_url = "https://www.ncs.gov.in/job-seeker/Pages/Search.aspx"
        try:
            # Perform live extraction with full dry-run console logging
            live_data = extract_live_portal_data(target_url)
            
            resp = self.fetch_url(target_url)
            if not resp or resp.status_code != 200:
                logger.error(f"[NCS SCRAPER ERROR] Failed to fetch live page from {target_url}. Returning empty list [].")
                return []

            soup = BeautifulSoup(resp.text, "html.parser")
            # Parse live job elements if present in response
            job_cards = soup.find_all("div", class_=re.compile(r"job-card|vacancy|search-result", re.I))

            for card in job_cards:
                title_elem = card.find(["a", "h3", "h4"], text=True)
                if not title_elem:
                    continue
                title = URLSanitizer.clean_text(title_elem.get_text())
                href = title_elem.get("href", "")
                clean_apply = URLSanitizer.sanitize_url(href, base_url=self.NCS_PORTAL_BASE) or target_url
                
                # Extract date directly from card text
                card_text = card.get_text()
                raw_date = None
                date_match = re.search(r"(?:Last Date|Closing Date)\s*[:\-]?\s*([0-9]{1,2}[\/\-\s.][A-Za-z0-9]+[\/\-\s.][0-9]{4})", card_text, re.I)
                if date_match:
                    raw_date = date_match.group(1).strip()

                parsed_date = normalize_date_to_iso(raw_date)
                closed = compute_is_closed(parsed_date)

                dept = "National Career Service (NCS)"
                detected_sector = SectorClassificationEngine.classify(title, dept, "NCS", "government")
                cat = "teaching" if detected_sector == "Teaching & Education" else "government"

                jobs.append({
                    "job_hash": DeduplicationEngine.generate_hash(cat, title, clean_apply, dept),
                    "title": title,
                    "category": cat,
                    "sector": detected_sector,
                    "gov_sector": detected_sector,
                    "state": "All India",
                    "state_or_location": "All India",
                    "department_or_company": dept,
                    "department_or_board": dept,
                    "qualification": "As per notification",
                    "last_date": raw_date or "Open until filled",
                    "last_date_to_apply": parsed_date,
                    "last_date_parsed": parsed_date,
                    "is_closed": bool(closed) if closed is not None else False,
                    "salary": "As per Govt Norms",
                    "salary_range": "As per Govt Norms",
                    "apply_url": clean_apply,
                    "official_pdf": clean_apply,
                    "notification_pdf_url": None,
                    "official_pdf_fallback": clean_apply,
                    "has_direct_pdf": False,
                    "vacancies_count": 0,
                    "fee_details": "As per official notification",
                    "age_limit": "18 - 40 Years",
                    "description": f"Live vacancy disclosure aggregated from National Career Service for {title}.",
                    "posted_date": date.today().isoformat(),
                    "source_portal": "NCS (ncs.gov.in)",
                    "is_active": True,
                })
        except Exception as e:
            logger.error(f"[NCS SCRAPER EXCEPTION] {e}. Returning empty list [].")
            return []

        logger.info(f"NCSIngestor aggregated {len(jobs)} live vacancies from NCS.")
        return jobs


# ==============================================================================
# 4. MASTER PIPE 2: EMPLOYMENT NEWS (ROZGAR SAMACHAR) GAZETTE EXTRACTOR
# ==============================================================================

class EmploymentNewsGazetteIngestor(BaseIngestor):
    """
    Ingests live notices from Employment News (Rozgar Samachar) and Government portals.
    STRICTLY NO hardcoded fallback jobs or static dates.
    """

    EN_PORTAL_BASE = "https://employmentnews.gov.in"

    def fetch_gazette_jobs(self) -> List[Dict[str, Any]]:
        jobs = []
        logger.info("Ingesting from Master Pipe 2: Employment News (Rozgar Samachar) Gazette...")

        target_url = "https://employmentnews.gov.in"
        try:
            live_data = extract_live_portal_data(target_url)

            resp = self.fetch_url(target_url)
            if not resp or resp.status_code != 200:
                logger.error(f"[EMPLOYMENT NEWS SCRAPER ERROR] Failed to fetch content from {target_url}. Returning empty list [].")
                return []

            soup = BeautifulSoup(resp.text, "html.parser")
            notice_items = soup.find_all(["a", "div"], class_=re.compile(r"notice|vacancy|news|item", re.I))

            for item in notice_items:
                title = URLSanitizer.clean_text(item.get_text())
                href = item.get("href", "")
                if len(title) < 15 or not href:
                    continue

                clean_apply = URLSanitizer.sanitize_url(href, base_url=self.EN_PORTAL_BASE) or target_url
                raw_date = None
                date_match = re.search(r"(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})", title)
                if date_match:
                    raw_date = date_match.group(1).strip()

                parsed_date = normalize_date_to_iso(raw_date)
                closed = compute_is_closed(parsed_date)
                dept = "Government Gazette / Employment News"
                detected_sector = SectorClassificationEngine.classify(title, dept, "Gazette", "government")
                cat = "teaching" if detected_sector == "Teaching & Education" else "government"

                jobs.append({
                    "job_hash": DeduplicationEngine.generate_hash(cat, title, clean_apply, dept),
                    "title": title,
                    "category": cat,
                    "sector": detected_sector,
                    "gov_sector": detected_sector,
                    "state": "All India",
                    "state_or_location": "All India",
                    "department_or_company": dept,
                    "department_or_board": dept,
                    "qualification": "As per official gazette",
                    "last_date": raw_date or "Open until filled",
                    "last_date_to_apply": parsed_date,
                    "last_date_parsed": parsed_date,
                    "is_closed": bool(closed) if closed is not None else False,
                    "salary": "As per Govt Norms",
                    "salary_range": "As per Govt Norms",
                    "apply_url": clean_apply,
                    "official_pdf": clean_apply,
                    "notification_pdf_url": None,
                    "official_pdf_fallback": clean_apply,
                    "has_direct_pdf": False,
                    "vacancies_count": 0,
                    "fee_details": "As per notification",
                    "age_limit": "18 - 40 Years",
                    "description": f"Official notice aggregated from Employment News for {title}.",
                    "posted_date": date.today().isoformat(),
                    "source_portal": "Employment News",
                    "is_active": True,
                })
        except Exception as e:
            logger.error(f"[EMPLOYMENT NEWS SCRAPER EXCEPTION] {e}. Returning empty list [].")
            return []

        logger.info(f"EmploymentNewsGazetteIngestor aggregated {len(jobs)} live gazette notifications.")
        return jobs


# ==============================================================================
# 5. MASTER PIPE 3: MULTI-FEED PRIVATE & CORPORATE ATS ENGINE
# ==============================================================================

class MultiFeedPrivateIngestor(BaseIngestor):
    """
    Ingests live ATS feeds (Arbeitnow, Jobicy).
    STRICTLY NO hardcoded fallback jobs or static dates.
    """

    def fetch_private_jobs(self) -> List[Dict[str, Any]]:
        jobs = []
        logger.info("Ingesting from Master Pipe 3: Multi-Feed Private ATS Engine...")

        endpoints = [
            {"url": "https://arbeitnow.com/api/job-board-api", "base": "https://arbeitnow.com"},
            {"url": "https://jobicy.com/api/v2/remote-jobs?geo=apac", "base": "https://jobicy.com"},
        ]

        for ep in endpoints:
            try:
                # Dry-run logging for API endpoints
                live_diag = extract_live_portal_data(ep["url"])

                resp = self.fetch_url(ep["url"])
                if not resp or resp.status_code != 200:
                    logger.warning(f"Private API endpoint {ep['url']} failed with status {resp.status_code if resp else 'No response'}.")
                    continue

                data = resp.json()
                items = data.get("jobs", data.get("data", []))

                for item in items[:25]:
                    title = URLSanitizer.clean_text(item.get("jobTitle", item.get("title", "")))
                    company = URLSanitizer.clean_text(item.get("companyName", item.get("company_name", "Company")))
                    raw_apply = item.get("url", item.get("jobSlug", "")).strip()

                    clean_apply = URLSanitizer.sanitize_url(raw_apply, base_url=ep["base"])
                    if not title or not clean_apply:
                        continue

                    loc = item.get("jobGeo", item.get("location", "Bengaluru / Remote"))
                    norm_loc = ", ".join(loc) if isinstance(loc, list) else str(loc)
                    job_hash = DeduplicationEngine.generate_hash("private", title, clean_apply, company)

                    jobs.append({
                        "job_hash": job_hash,
                        "title": title,
                        "category": "private",
                        "sector": "Private & Corporate",
                        "state": "Karnataka" if "Bengaluru" in norm_loc else "All India",
                        "state_or_location": norm_loc or "Bengaluru / Remote",
                        "work_location": norm_loc or "Bengaluru / Remote",
                        "department_or_company": company,
                        "company_name": company,
                        "company_logo_url": item.get("companyLogo", f"https://ui-avatars.com/api/?name={company}&background=4F46E5&color=fff"),
                        "qualification": "Graduate / B.E / B.Tech",
                        "experience_level": item.get("jobLevel", "Fresher / 1-3 Years"),
                        "employment_type": "Full-time",
                        "last_date": "Open until filled",
                        "last_date_parsed": None,
                        "is_closed": False,
                        "salary": "Competitive / Best in Industry",
                        "salary_range": "Competitive / Best in Industry",
                        "skills_tags": ["Tech", "Software", "Engineering"],
                        "apply_url": clean_apply,
                        "official_pdf": clean_apply,
                        "has_direct_pdf": False,
                        "description": f"Live opening at {company} for {title}. Location: {norm_loc}.",
                        "posted_date": date.today().isoformat(),
                        "source_portal": "Public ATS Feed",
                        "is_active": True,
                    })
            except Exception as e:
                logger.warning(f"Error fetching private endpoint {ep['url']}: {e}")

        logger.info(f"MultiFeedPrivateIngestor aggregated {len(jobs)} live private vacancies.")
        return jobs


# ==============================================================================
# 6. SUPABASE INGESTOR & BATCH UPSERT
# ==============================================================================

class SupabaseIngestor:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        self.supabase_key = (
            os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            or os.getenv("SUPABASE_KEY")
            or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        )
        self.client = None

        if self.supabase_url and self.supabase_key:
            try:
                from supabase import create_client
                self.client = create_client(self.supabase_url, self.supabase_key)
                logger.info("Connected successfully to Supabase PostgreSQL.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.client = None

    def upsert_all(self, jobs: List[Dict[str, Any]]) -> Dict[str, int]:
        if not jobs:
            logger.info("No jobs to upsert (0 scraped records).")
            return {"total": 0, "inserted": 0}

        unique_map = {j["apply_url"]: j for j in jobs}
        unique_jobs = list(unique_map.values())
        logger.info(f"Unique jobs: {len(unique_jobs)} (from {len(jobs)} total scraped records)")

        inserted_count = 0
        if self.client:
            batch_size = 50
            for i in range(0, len(unique_jobs), batch_size):
                batch = unique_jobs[i : i + batch_size]
                sanitized_batch = []
                for item in batch:
                    cat = item.get("category", "government")
                    sector = item.get("sector") or ("Private & Corporate" if cat == "private" else "Central SSC & UPSC")
                    if sector not in VALID_SECTORS:
                        sector = "Private & Corporate" if cat == "private" else "Central SSC & UPSC"

                    clean = {
                        "job_hash": item.get("job_hash") or DeduplicationEngine.generate_hash(cat, item["title"], item["apply_url"]),
                        "category": "government" if cat in ("government", "teaching") else "private",
                        "title": item.get("title", ""),
                        "apply_url": item.get("apply_url", ""),
                        "posted_date": item.get("posted_date", date.today().isoformat()),
                        "description": item.get("description", ""),
                        "is_active": True,
                    }
                    if cat in ("government", "teaching"):
                        clean["department_or_board"] = item.get("department_or_company") or item.get("department_or_board") or "Govt / Board"
                        clean["gov_sector"] = sector
                        clean["state_or_location"] = item.get("state") or item.get("state_or_location") or "All India"
                        clean["qualification"] = item.get("qualification") or "Graduate / B.Ed / 10th / 12th"
                        raw_ld = item.get("last_date") or item.get("last_date_to_apply") or ""
                        parsed_ld = item.get("last_date_parsed") or normalize_date_to_iso(raw_ld)
                        
                        clean["last_date_to_apply"] = parsed_ld or raw_ld or None
                        clean["last_date_parsed"] = parsed_ld
                        clean["is_closed"] = bool(compute_is_closed(parsed_ld)) if parsed_ld else False
                        clean["salary_range"] = item.get("salary") or item.get("salary_range") or "As per Govt Norms"
                        clean["fee_details"] = item.get("fee_details") or "As per official notification"
                        clean["age_limit"] = item.get("age_limit") or "18 - 40 Years"
                        clean["vacancies_count"] = item.get("vacancies_count", 0)
                        clean["notification_pdf_url"] = item.get("notification_pdf_url") or item.get("official_pdf")
                    else:
                        clean["company_name"] = item.get("department_or_company") or item.get("company_name") or "Company"
                        clean["company_logo_url"] = item.get("company_logo_url") or f"https://ui-avatars.com/api/?name={clean['company_name']}&background=4F46E5&color=fff"
                        clean["work_location"] = item.get("state") or item.get("work_location") or "Bengaluru / Remote"
                        clean["qualification"] = item.get("qualification") or "B.E / B.Tech / Graduate"
                        clean["experience_level"] = item.get("experience_level") or "Fresher / 1-3 Years"
                        clean["employment_type"] = item.get("employment_type") or "Full-time"
                        clean["salary_range"] = item.get("salary") or item.get("salary_range") or "Competitive / Best in Industry"
                        clean["skills_tags"] = item.get("skills_tags") or ["Tech", "Software"]
                        clean["source_portal"] = item.get("source_portal") or "ATS Direct"

                    sanitized_batch.append(clean)

                try:
                    self.client.table("jobs").upsert(sanitized_batch, on_conflict="job_hash").execute()
                    inserted_count += len(sanitized_batch)
                except Exception as e:
                    logger.error(f"Supabase upsert error: {e}")

            logger.info(f"Successfully upserted {inserted_count} jobs to Supabase database.")

        output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "all_scraped_jobs.json")
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(unique_jobs, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved local backup snapshot: {output_file}")
        except Exception as e:
            logger.error(f"Failed to save local JSON: {e}")

        return {"total": len(jobs), "inserted": inserted_count or len(unique_jobs)}


# ==============================================================================
# 7. MASTER PIPELINE ORCHESTRATOR
# ==============================================================================

def run_ingestion_pipeline(dry_run: bool = False, export_json: Optional[str] = None):
    start_time = datetime.now()
    logger.info("====================================================================")
    logger.info("STARTING ALL INDIA LIVE CENTRALIZED INGESTION PIPELINE")
    logger.info("====================================================================")

    session = requests.Session()
    ncs_ingestor = NCSIngestor(session)
    gazette_ingestor = EmploymentNewsGazetteIngestor(session)
    private_ingestor = MultiFeedPrivateIngestor(session)

    # 1. Pipe 1: National Career Service (NCS) Aggregator
    logger.info("--- Phase 1: Ingesting National Career Service (NCS) Feed ---")
    ncs_jobs = ncs_ingestor.fetch_ncs_jobs()

    # 2. Pipe 2: Weekly Employment News (Rozgar Samachar) Gazette
    logger.info("--- Phase 2: Ingesting Employment News (Rozgar Samachar) Gazette ---")
    gazette_jobs = gazette_ingestor.fetch_gazette_jobs()

    # 3. Pipe 3: Multi-Feed Private ATS Listings
    logger.info("--- Phase 3: Ingesting Multi-Feed Private ATS Listings ---")
    private_jobs = private_ingestor.fetch_private_jobs()

    all_jobs = ncs_jobs + gazette_jobs + private_jobs
    logger.info(f"--- Phase 4: Ingestion Complete. Total Aggregated: {len(all_jobs)} ---")

    if dry_run:
        logger.info("[DRY RUN MODE] Live inspection complete without database write.")
    else:
        db = SupabaseIngestor()
        stats = db.upsert_all(all_jobs)
        logger.info(f"Pipeline Execution Stats: {stats}")

    if export_json:
        with open(export_json, "w", encoding="utf-8") as f:
            json.dump(all_jobs, f, indent=2, ensure_ascii=False)
        logger.info(f"Exported raw payload to {export_json}")

    elapsed = (datetime.now() - start_time).total_seconds()
    logger.info(f"Pipeline executed successfully in {elapsed:.2f} seconds.")
    logger.info("====================================================================")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="All India Centralized Job Ingestion Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Execute scrapers without DB write")
    parser.add_argument("--export-json", type=str, default=None, help="File path to save JSON output")
    args = parser.parse_args()

    run_ingestion_pipeline(dry_run=args.dry_run, export_json=args.export_json)
