"use client";
import React from "react";
import { Job, GovtJob, PrivateJob, getJobDeadlineInfo } from "@/lib/jobs-data";
import {
  Landmark,
  Building2,
  Calendar,
  FileDown,
  ExternalLink,
  MapPin,
  Briefcase,
  Users,
  GraduationCap,
  Sparkles,
  Share2,
  Bookmark,
  BookOpen,
  Lock,
  CheckCircle,
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
  const isGovt = job.category === "government" || job.category === "teaching";
  const isTeaching = job.category === "teaching";
  const govtJob = isGovt ? (job as GovtJob) : null;
  const privJob = !isGovt ? (job as PrivateJob) : null;

  // Accurate deadline status calculation
  const deadlineInfo = getJobDeadlineInfo(job);
  const isClosed = deadlineInfo.isClosed;

  const getDeadlineStatus = () => {
    if (isClosed) {
      return {
        text: "🚫 Application Closed",
        color:
          "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
      };
    }

    if (deadlineInfo.diffDays === null) {
      return {
        text: "🟢 Open Applications",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      };
    }

    const diffDays = deadlineInfo.diffDays;
    if (diffDays === 0) {
      return { text: "⚡ Last Day Today!", color: "bg-red-500 text-white animate-pulse border-red-600" };
    } else if (diffDays <= 4) {
      return {
        text: `🔥 ${diffDays} Day${diffDays === 1 ? "" : "s"} Left`,
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      };
    } else {
      return {
        text: `⏳ ${diffDays} Days Left`,
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-slate-900 border ${
        isClosed
          ? "opacity-85 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-md"
          : isTeaching
          ? "border-rose-200/60 dark:border-rose-900/30 hover:border-rose-400/80 hover:shadow-xl hover:shadow-rose-500/10"
          : isGovt
          ? "border-amber-200/60 dark:border-amber-900/30 hover:border-amber-400/80 hover:shadow-xl hover:shadow-amber-500/10"
          : "border-indigo-200/60 dark:border-indigo-900/30 hover:border-indigo-400/80 hover:shadow-xl hover:shadow-indigo-500/10"
      }`}
    >
      {/* Top Header Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isTeaching ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60">
                <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Teaching / TET
              </span>
            ) : isGovt ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Sarkari / State Govt
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Private / Tech
              </span>
            )}

            {/* Sector / Category Tag */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {job.sector || (isGovt ? govtJob?.gov_sector : "Corporate")}
            </span>

            {/* State Tag */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3 h-3 text-rose-500" />
              {job.state || (isGovt ? govtJob?.state_or_location : privJob?.work_location)}
            </span>

            {/* Application Status Badge */}
            {isClosed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                <Lock className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Active
              </span>
            )}
          </div>

          {/* Action Bookmark & Share Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onShare(job)}
              title="Share on WhatsApp"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleBookmark(job)}
              title={isBookmarked ? "Remove Bookmark" : "Save Job"}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Job Title & Organization */}
        <div className="mb-4">
          <h3
            onClick={() => onOpenDetails(job)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {job.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            {isGovt ? (
              <span>🏛️ {govtJob?.department_or_board}</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <img
                  src={privJob?.company_logo_url}
                  alt={privJob?.company_name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                {privJob?.company_name}
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics / Eligibility Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {isGovt && govtJob && (
            <>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Eligibility</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {govtJob.qualification}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <Users className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Vacancies</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {(govtJob.vacancies_count || 0) > 0
                      ? `${govtJob.vacancies_count.toLocaleString()} Posts`
                      : "Official Notice"}
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

        {/* Private Tags */}
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

        {/* Posted & Deadline Status Row */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1 truncate max-w-[55%]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {isGovt && govtJob?.last_date
                ? `Last Date: ${govtJob.last_date}`
                : `Posted: ${job.posted_date || "Today"}`}
            </span>
          </span>
          {deadlineStatus && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] shrink-0 border ${deadlineStatus.color}`}
            >
              {deadlineStatus.text}
            </span>
          )}
        </div>

        {/* Official Date Verification Advisory Note */}
        <div className="mb-4 px-2.5 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300">
          <span className="shrink-0 text-amber-600 dark:text-amber-400">📌</span>
          <span className="leading-tight font-medium">
            <strong>Note:</strong> Application date ek baar official website par bhi zaroor verify kar lein.
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-2 flex items-center gap-2.5">
        {/* PDF Notification Download or Official Notice Board (Govt & Teaching) */}
        {isGovt && govtJob && (
          <a
            href={
              govtJob.has_direct_pdf && govtJob.notification_pdf_url
                ? govtJob.notification_pdf_url
                : govtJob.official_pdf_fallback || govtJob.apply_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            {govtJob.has_direct_pdf && govtJob.notification_pdf_url ? (
              <>
                <FileDown className="w-3.5 h-3.5 text-rose-500" />
                Download PDF
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                Notice Board
              </>
            )}
          </a>
        )}

        {/* Details button for Private Jobs */}
        {!isGovt && (
          <button
            onClick={() => onOpenDetails(job)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            View Details
          </button>
        )}

        {/* Primary Apply Online Button */}
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
            isClosed
              ? "bg-slate-600 hover:bg-slate-700 shadow-slate-500/20"
              : isTeaching
              ? "bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 shadow-rose-500/20"
              : isGovt
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-orange-500/20"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/20"
          }`}
        >
          {isClosed ? "View Listing" : "Apply Online"}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

