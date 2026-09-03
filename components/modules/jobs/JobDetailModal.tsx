"use client";
import React, { useState } from "react";
import { Job, GovtJob, PrivateJob, getJobDeadlineInfo } from "@/lib/jobs-data";
import {
  X,
  ExternalLink,
  FileDown,
  Calendar,
  Building2,
  Landmark,
  MapPin,
  Clock,
  Sparkles,
  Users,
  GraduationCap,
  Share2,
  Check,
  CreditCard,
  ShieldCheck,
  Bookmark,
  Lock,
} from "lucide-react";

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (job: Job) => void;
}

export function JobDetailModal({
  job,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: JobDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const isGovt = job.category === "government" || job.category === "teaching";
  const isTeaching = job.category === "teaching";
  const govtJob = isGovt ? (job as GovtJob) : null;
  const privJob = !isGovt ? (job as PrivateJob) : null;

  const deadlineInfo = getJobDeadlineInfo(job);
  const isClosed = deadlineInfo.isClosed;

  const handleShareWhatsApp = () => {
    const text = `📢 *Job Alert:* ${job.title}\n🏢 *Org/Company:* ${
      isGovt ? govtJob?.department_or_board : privJob?.company_name
    }\n🔗 *Apply Here:* ${job.apply_url}\n\nDiscovered via BharatKits All India Job Portal`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${job.title} - Apply at: ${job.apply_url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2 flex-wrap">
            {isGovt ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Landmark className="w-3.5 h-3.5" />
                Sarkari Notification
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                <Building2 className="w-3.5 h-3.5" />
                Private Career Post
              </span>
            )}
            {isClosed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                <Lock className="w-3 h-3" />
                Application Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Active
              </span>
            )}
            <span className="text-xs text-slate-500">Posted: {job.posted_date || "Recent"}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-base font-bold text-slate-700 dark:text-slate-300">
              {isGovt ? govtJob?.department_or_board : privJob?.company_name}
            </div>
          </div>

          {/* Sarkari Highlights Grid */}
          {isGovt && govtJob && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Total Vacancies</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {govtJob.vacancies_count > 0 ? `${govtJob.vacancies_count.toLocaleString()} Posts` : "Multiple Positions"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Educational Criteria</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {govtJob.qualification}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Last Date to Apply</div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {govtJob.last_date_to_apply || govtJob.last_date || "Open until filled"}
                    {isClosed && " (Expired)"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Application Fee</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {govtJob.fee_details || "As per notification rules"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Private Highlights Grid */}
          {!isGovt && privJob && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Offered CTC / Salary</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {privJob.salary_range}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Job Location</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {privJob.work_location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Experience Required</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {privJob.experience_level}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Employment Type</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {privJob.employment_type}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
              Overview & Notification Details
            </h4>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {job.description}
            </div>
          </div>

          {/* Tags for Private */}
          {!isGovt && privJob?.skills_tags && privJob.skills_tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                Skills & Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {privJob.skills_tags.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share & Quick Utility Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
              {copied ? "Link Copied!" : "Copy Apply Link"}
            </button>

            <button
              onClick={() => onToggleBookmark(job)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isBookmarked
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center gap-3">
          {isGovt && govtJob && (
            <a
              href={
                govtJob.has_direct_pdf && govtJob.notification_pdf_url
                  ? govtJob.notification_pdf_url
                  : govtJob.official_pdf_fallback || govtJob.apply_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
            >
              {govtJob.has_direct_pdf && govtJob.notification_pdf_url ? (
                <>
                  <FileDown className="w-4 h-4 text-rose-500" />
                  Download Official PDF
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  View Official Notice Board
                </>
              )}
            </a>
          )}

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all ${
              isGovt
                ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:brightness-110 shadow-orange-500/25"
                : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:brightness-110 shadow-indigo-500/25"
            }`}
          >
            Apply on Official Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
