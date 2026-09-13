import React from "react";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import Icon from "./msIcon";
import Badge from "./badge";
import { formatEnumLabel } from "../../lib/enumOptions";
import "../assets/css/tailwind.css";

const TAG_CHAR_LIMIT = 35;

function truncate(text, limit = TAG_CHAR_LIMIT) {
  if (!text || text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}

export function daysAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  return days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"} ago`;
}

const JOB_CARD_STYLES = [
  { icon: "local_hospital", tone: "bg-primary/10 text-primary" },
  { icon: "science", tone: "bg-teal-clinical/10 text-teal-clinical" },
  { icon: "inventory_2", tone: "bg-berry-accent/10 text-berry-deep" },
  { icon: "school", tone: "bg-status-warning/10 text-status-warning" },
  { icon: "local_pharmacy", tone: "bg-cyan-bright/10 text-cyan-bright" },
  { icon: "clinical_notes", tone: "bg-verified-green/10 text-verified-green" },
];

// This card also renders inside the Bootstrap-styled /jobs page (via
// JobResults), which still uses Bootstrap's own bare `.border` / `.shadow-sm`
// classes elsewhere on that page. Tailwind defines those same class names
// with different values, so whichever stylesheet loads last would otherwise
// win for every element sharing the name — not just this card. `!` forces
// these two to always resolve from Tailwind regardless of load order.
export default function JobCard({ job, index }) {
  const style = JOB_CARD_STYLES[index % JOB_CARD_STYLES.length];

  return (
    <div className="bg-surface-card rounded-2xl p-space-lg !shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between !border border-border-subtle hover:border-primary/30 group">
      <div>
        <div className="flex items-start justify-between gap-space-xs mb-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.tone}`}
            >
              <Icon name={style.icon} className="text-[22px]" />
            </div>
            <div className="flex flex-col gap-0 min-w-0">
              <p className="text-xs text-navy-surface font-bold leading-none line-clamp-2 group-hover:text-primary transition-colors m-0">
                {job.company}
              </p>

              <div className="flex items-center gap-1 text-on-surface-variant leading-none mt-1">
                <Icon name="schedule" className="text-[14px]" />
                <span className="text-[11px] leading-none">
                  {daysAgo(job.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {job.workType && (
            <Badge
              tone="primary"
              dot={false}
              uppercase={false}
              className="shrink-0"
            >
              {formatEnumLabel(job.workType)}
            </Badge>
          )}
        </div>

        <h6 className="text-sm text-navy-surface font-bold leading-snug line-clamp-2 mb-space-xs">
          {job.title}
        </h6>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-space-sm">
          <Icon name="location_on" className="text-[16px] text-teal-clinical" />
          <span className="truncate">{job.city}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-space-md">
          {job.qualification && (
            <Badge tone="neutral" dot={false} uppercase={false} title={job.qualification}>
              {truncate(job.qualification)}
            </Badge>
          )}
          {job.experience && (
            <Badge tone="neutral" dot={false} uppercase={false} title={job.experience}>
              {truncate(job.experience)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between ">
        <Badge tone="verified" dot={false} uppercase={false}>
          <Icon name="verified" className="text-[14px]" />
          Verified Source
        </Badge>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:text-primary-container rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Details
          <IoIosArrowForward size={14} />
        </Link>
      </div>
    </div>
  );
}
