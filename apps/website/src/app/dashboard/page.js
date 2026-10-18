'use client'
import React from "react";
import Link from "next/link";
import { LuBriefcase, LuGraduationCap, LuHourglass, LuNewspaper, LuUsers, LuChevronRight, LuCheckCircle2 } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { canAccessPath } from "../../lib/roles";
import { formatEnumLabel } from "../../lib/enumOptions";
import StatCards from "../../componants/admin/ui/StatCards";
import { useJobStatsQuery } from "../../services/jobs/jobs.queries";
import { useScholarshipStatsQuery } from "../../services/scholarships/scholarships.queries";
import { useBlogStatsQuery } from "../../services/blogs/blogs.queries";
import { useUserStatsQuery } from "../../services/users/users.queries";

const JOBS = '/dashboard/jobs';
const SCHOLARSHIPS = '/dashboard/scholarships';
const BLOGS = '/dashboard/blogs';
const USERS = '/dashboard/users';

const DAY_MS = 24 * 60 * 60 * 1000;
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const relativeDays = (date) => rtf.format(Math.round((new Date(date).getTime() - Date.now()) / DAY_MS), 'day');
// The cleanup runs at midnight, so a job already past its 21 days goes tonight, not "yesterday".
const deletesIn = (date) => (new Date(date).getTime() <= Date.now() ? 'tonight' : relativeDays(date));

const FIELD_LABELS = { excerpt: 'excerpt', featuredImage: 'image', seoTitle: 'SEO title', seoDescription: 'SEO description' };

// One colour per content type, shared by the stat cards, activity icons and bars.
const TONES = {
    job: { chip: 'bg-blue-50 text-blue-600', bar: 'bg-blue-500' },
    scholarship: { chip: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
    blog: { chip: 'bg-violet-50 text-violet-600', bar: 'bg-violet-500' },
    user: { chip: 'bg-slate-100 text-slate-600', bar: 'bg-slate-500' },
    warning: { chip: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
};

const STATUS_TONES = {
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    PUBLISHED: 'bg-emerald-50 text-emerald-700',
    DRAFT: 'bg-gray-100 text-gray-600',
    INACTIVE: 'bg-amber-50 text-amber-700',
    CLOSED: 'bg-rose-50 text-rose-700',
    EXPIRED: 'bg-rose-50 text-rose-700',
};

// Spacing and outlines use arbitrary values / rings: Bootstrap's !important p-/m-/gap-N,
// .border and .shadow-sm utilities override the same-named Tailwind classes.
const PANEL = 'flex min-w-0 flex-col rounded-xl bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-gray-200 sm:px-[24px]';

export default function DashboardHome() {
    const { user, accessToken } = useAuth();
    const can = (path) => canAccessPath(user?.role, path);
    // A null token keeps the query disabled, so each role only fetches what the API lets it see.
    const tokenFor = (path) => (can(path) ? accessToken : null);

    const jobs = useJobStatsQuery(tokenFor(JOBS)).data;
    const scholarships = useScholarshipStatsQuery(tokenFor(SCHOLARSHIPS)).data;
    const blogs = useBlogStatsQuery(tokenFor(BLOGS)).data;
    const users = useUserStatsQuery(tokenFor(USERS)).data;

    // Loaded once every query this role runs has data.
    const loaded = [[JOBS, jobs], [SCHOLARSHIPS, scholarships], [BLOGS, blogs], [USERS, users]]
        .every(([path, data]) => !can(path) || data);

    const kpis = [
        can(JOBS) && { label: 'Live jobs', value: jobs?.byStatus.ACTIVE, hint: jobs && `${jobs.byStatus.DRAFT} drafts · ${jobs.total} total`, href: JOBS, icon: LuBriefcase, tone: TONES.job.chip },
        can(JOBS) && { label: 'Deleting within 7 days', value: jobs?.expiringSoon, hint: 'Auto-removed 21 days after posting', href: JOBS, icon: LuHourglass, tone: TONES.warning.chip },
        can(SCHOLARSHIPS) && { label: 'Live scholarships', value: scholarships?.byStatus.ACTIVE, hint: scholarships && `${scholarships.closingSoon} closing within 45 days`, href: SCHOLARSHIPS, icon: LuGraduationCap, tone: TONES.scholarship.chip },
        can(BLOGS) && { label: 'Published posts', value: blogs?.byStatus.PUBLISHED, hint: blogs && `${blogs.byStatus.DRAFT} drafts · ${blogs.featured} featured`, href: BLOGS, icon: LuNewspaper, tone: TONES.blog.chip },
        can(USERS) && { label: 'Active users', value: users?.byStatus.ACTIVE, hint: users && `${users.byStatus.PENDING_VERIFICATION} pending · ${users.byStatus.SUSPENDED} suspended`, href: USERS, icon: LuUsers, tone: TONES.user.chip },
    ].filter(Boolean);

    const attention = [
        jobs?.expiringSoon > 0 && {
            title: 'Jobs about to be deleted', count: jobs.expiringSoon, href: JOBS, urgent: true,
            items: jobs.expiringJobs.map((job) => ({ id: job.id, label: job.title, sub: job.company, meta: deletesIn(job.deletesAt) })),
        },
        scholarships?.closingSoon > 0 && {
            title: 'Scholarship deadlines in the next 45 days', count: scholarships.closingSoon, href: SCHOLARSHIPS, urgent: true,
            items: scholarships.closingSoonItems.map((item) => ({ id: item.id, label: item.country, meta: `closes ${relativeDays(item.endDate)}` })),
        },
        blogs?.incomplete > 0 && {
            title: 'Published posts with missing fields', count: blogs.incomplete, href: BLOGS,
            items: blogs.incompleteItems.map((blog) => ({ id: blog.id, label: blog.title, sub: `Missing ${blog.missing.map((field) => FIELD_LABELS[field]).join(', ')}` })),
        },
        blogs?.staleDrafts > 0 && {
            title: 'Drafts untouched for 2+ weeks', count: blogs.staleDrafts, href: BLOGS,
            items: blogs.staleDraftItems.map((blog) => ({ id: blog.id, label: blog.title, meta: `edited ${relativeDays(blog.updatedAt)}` })),
        },
        users?.byStatus.PENDING_VERIFICATION > 0 && {
            title: 'Accounts pending verification', count: users.byStatus.PENDING_VERIFICATION, href: USERS, items: [],
        },
    ].filter(Boolean);
    const attentionTotal = attention.reduce((sum, group) => sum + group.count, 0);

    const recent = [
        ...(jobs?.recent ?? []).map((item) => ({ ...item, type: 'Job', href: JOBS, icon: LuBriefcase, tone: TONES.job.chip })),
        ...(scholarships?.recent ?? []).map((item) => ({ ...item, title: `${item.country} scholarship`, type: 'Scholarship', href: SCHOLARSHIPS, icon: LuGraduationCap, tone: TONES.scholarship.chip })),
        ...(blogs?.recent ?? []).map((item) => ({ ...item, type: 'Blog', href: BLOGS, icon: LuNewspaper, tone: TONES.blog.chip })),
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8);

    return (
        <div className="flex w-full flex-col gap-[16px] sm:gap-[24px]">
            <div className="flex flex-col gap-[4px]">
                <h2 className="mb-0 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h2>
                <p className="mb-0 text-sm text-gray-500">
                    {!loaded
                        ? 'Gathering your overview…'
                        : attentionTotal > 0
                            ? `${attentionTotal} ${attentionTotal === 1 ? 'item needs' : 'items need'} your attention.`
                            : 'You are all caught up.'}
                </p>
            </div>

            {/* The page's flex gap already spaces it. */}
            <StatCards cards={kpis} stats={loaded} className="" />

            <div className="grid grid-cols-1 gap-[16px] sm:gap-[24px] lg:grid-cols-3">
                <section className={`${PANEL} lg:col-span-2`}>
                    <PanelHeader title="Needs attention" subtitle="Things to act on before they affect the live site" />
                    {!loaded ? (
                        <SkeletonRows count={4} />
                    ) : attention.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-[8px] py-[32px] text-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <LuCheckCircle2 className="h-6 w-6" />
                            </span>
                            <p className="mb-0 text-sm font-medium text-gray-900">Nothing needs attention</p>
                            <p className="mb-0 text-xs text-gray-500">Deadlines, expiring jobs and incomplete posts will show up here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[12px]">
                            {attention.map((group) => <AttentionGroup key={group.title} {...group} />)}
                        </div>
                    )}
                </section>

                <section className={PANEL}>
                    <PanelHeader title="Recently updated" subtitle="Latest changes across your sections" />
                    {!loaded ? (
                        <SkeletonRows count={6} />
                    ) : recent.length === 0 ? (
                        <p className="mb-0 py-[24px] text-center text-sm text-gray-400">Nothing yet.</p>
                    ) : (
                        <ul className="-mx-[8px] mb-0 flex flex-col pl-0">
                            {recent.map(({ id, type, title, status, updatedAt, href, icon: Icon, tone }) => (
                                <li key={`${type}-${id}`} className="list-none">
                                    <Link href={href} className="flex items-center gap-[12px] rounded-lg px-[8px] py-[8px] text-gray-800 no-underline transition-colors hover:bg-gray-50">
                                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${tone}`}>
                                            <Icon className="h-4 w-4" aria-label={type} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-gray-900">{title}</span>
                                            <span className="block text-xs text-gray-500">{relativeDays(updatedAt)}</span>
                                        </span>
                                        <StatusPill status={status} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

function PanelHeader({ title, subtitle }) {
    return (
        <div className="mb-[16px]">
            <h3 className="mb-0 text-base font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mb-0 mt-[2px] text-xs text-gray-500">{subtitle}</p>}
        </div>
    );
}

function StatusPill({ status }) {
    return (
        <span className={`flex-shrink-0 whitespace-nowrap rounded-full px-[8px] py-[2px] text-[11px] font-medium ${STATUS_TONES[status] ?? STATUS_TONES.DRAFT}`}>
            {formatEnumLabel(status)}
        </span>
    );
}

function SkeletonRows({ count }) {
    return (
        <div className="flex flex-col gap-[12px]" aria-label="Loading">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="h-[36px] animate-pulse rounded-lg bg-gray-100" />
            ))}
        </div>
    );
}

// Urgent groups (things that change the live site on their own) get an amber accent.
function AttentionGroup({ title, count, href, items, urgent }) {
    return (
        <div className="overflow-hidden rounded-lg ring-1 ring-gray-200">
            <Link
                href={href}
                className={`group flex items-center gap-[10px] px-[14px] py-[10px] no-underline transition-colors ${urgent ? 'bg-amber-50/60 hover:bg-amber-50' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
                <span className={`min-w-[24px] rounded-full px-[8px] py-[1px] text-center text-xs font-semibold tabular-nums ${urgent ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'}`}>
                    {count}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{title}</span>
                <span className="flex flex-shrink-0 items-center gap-[2px] text-xs font-medium text-gray-400 group-hover:text-blue-600">
                    View <LuChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
            </Link>
            {items.length > 0 && (
                <ul className="mb-0 pl-0">
                    {items.map((item) => (
                        <li key={item.id} className="flex list-none items-center justify-between gap-[12px] px-[14px] py-[9px] text-sm [border-top:1px_solid_rgb(243_244_246)]">
                            <span className="min-w-0">
                                <span className="block truncate text-gray-800">{item.label}</span>
                                {item.sub && <span className="block truncate text-xs text-gray-500">{item.sub}</span>}
                            </span>
                            {item.meta && (
                                <span className={`flex-shrink-0 whitespace-nowrap text-xs font-medium ${urgent ? 'text-amber-700' : 'text-gray-500'}`}>{item.meta}</span>
                            )}
                        </li>
                    ))}
                    {count > items.length && (
                        <li className="list-none px-[14px] py-[8px] text-xs text-gray-400 [border-top:1px_solid_rgb(243_244_246)]">
                            +{count - items.length} more
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

// Horizontal bars as plain divs; no chart library needed for a handful of counts.
function BarList({ title, subtitle, items, format = (label) => label, bar }) {
    const max = Math.max(1, ...items.map((item) => item.count));
    return (
        <section className={PANEL}>
            <PanelHeader title={title} subtitle={subtitle} />
            {items.length === 0 ? (
                <p className="mb-0 py-[16px] text-center text-sm text-gray-400">No data yet.</p>
            ) : (
                <ul className="mb-0 flex flex-col gap-[12px] pl-0">
                    {items.map((item) => (
                        <li key={item.label} className="list-none text-sm">
                            <div className="mb-[6px] flex items-baseline justify-between gap-[12px]">
                                <span className="truncate text-gray-700">{format(item.label)}</span>
                                <span className="font-semibold tabular-nums text-gray-900">{item.count}</span>
                            </div>
                            <div className="h-[6px] overflow-hidden rounded-full bg-gray-100">
                                <div className={`h-full rounded-full ${bar}`} style={{ width: `${(item.count / max) * 100}%` }} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
