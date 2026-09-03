"use client";
import React from "react";
import {
  Job,
  GovtJob,
  PrivateJob,
} from "@/lib/jobs-data";
import {
  Landmark,
  Building2,
  Calendar,
  Clock,
  FileDown,
  ExternalLink,
  MapPin,
  Briefcase,
  Users,
  GraduationCap,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onOpenDetails: (job: Job) => void;
  isBookmarked: boolean;
  onToggleBookmark: (job: Job) => void;
  onShare: (job: Job) => void;
}

export function JobCard({
  job,
  onOpenDetails,
  isBookmarked,
  onToggleBookmark,
  onShare,
}: JobCardProps) {
  const isGovt = job.category === "government";
  const govtJob = isGovt ? (job as GovtJob) : null;
  const privJob = !isGovt ? (job as PrivateJob) : null;

  // Calculate days remaining for Government Job
  const getDeadlineStatus = (lastDateStr?: string) => {
    if (!lastDateStr) return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(lastDateStr);
      deadline.setHours(0, 0, 0, 0);

      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { text: "Expired", color: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50" };
      } else if (diffDays === 0) {
        return { text: "⚡ Last Day Today!", color: "bg-red-500 text-white animate-pulse" };
      } else if (diffDays <= 4) {
        return { text: `🔥 ${diffDays} Days Left`, color: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-800" };
      } else {
        return { text: `⏳ ${diffDays} Days Left`, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" };
      }
    } catch {
      return null;
    }
  };

  const deadlineStatus = govtJob ? getDeadlineStatus(govtJob.last_date_to_apply) : null;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-slate-900 border ${
        isGovt
          ? "border-amber-200/60 dark:border-amber-900/30 hover:border-amber-400/80 hover:shadow-xl hover:shadow-amber-500/10"
          : "border-indigo-200/60 dark:border-indigo-900/30 hover:border-indigo-400/80 hover:shadow-xl hover:shadow-indigo-500/10"
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isGovt ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Sarkari Bharti
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Private / Tech
              </span>
            )}

            {/* Department / Sector or Company Badge */}
            {isGovt && govtJob && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {govtJob.gov_sector}
              </span>
            )}

            {!isGovt && privJob && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3 h-3 text-slate-500" />
                {privJob.work_location}
              </span>
            )}
          </div>

          {/* Action Buttons: Bookmark & Share */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleBookmark(job)}
              title={isBookmarked ? "Remove bookmark" : "Save job"}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? "bg-amber-500 text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => onShare(job)}
              title="Share job details"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Title & Organization */}
        <div className="cursor-pointer" onClick={() => onOpenDetails(job)}>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {isGovt && govtJob && (
              <span className="text-amber-700 dark:text-amber-400">
                {govtJob.department_or_board}
              </span>
            )}
            {!isGovt && privJob && (
              <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                {privJob.company_name}
              </span>
            )}
          </div>
        </div>

        {/* Key Highlight Metrics Row */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          {isGovt && govtJob && (
            <>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Posts</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {govtJob.vacancies_count > 0
                      ? `${govtJob.vacancies_count.toLocaleString()} Vacancies`
                      : "Multiple Posts"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Eligibility</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {govtJob.qualification}
                  </div>
                </div>
              </div>
            </>
          )}

          {!isGovt && privJob && (
            <>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Salary / CTC</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {privJob.salary_range}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Experience</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {privJob.experience_level}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Private Tags or Govt Highlights */}
        {!isGovt && privJob && privJob.skills_tags && privJob.skills_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {privJob.skills_tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {isGovt && govtJob && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Posted: {govtJob.posted_date}
            </span>
            {deadlineStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] border ${deadlineStatus.color}`}
              >
                {deadlineStatus.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="pt-2 flex items-center gap-2.5">
        {/* PDF Notification Download (Govt only) */}
        {isGovt && govtJob?.notification_pdf_url && (
          <a
            href={govtJob.notification_pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-rose-500" />
            Official PDF
          </a>
        )}

        {/* Details button if not govt with PDF */}
        {(!isGovt || !govtJob?.notification_pdf_url) && (
          <button
            onClick={() => onOpenDetails(job)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            View Details
          </button>
        )}

        {/* Apply Link */}
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
            isGovt
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-orange-500/20"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/20"
          }`}
        >
          Apply Online
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
