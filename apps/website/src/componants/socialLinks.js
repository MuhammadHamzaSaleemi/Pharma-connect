const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/pharmaconnect-pakistan/",
    icon: (
      <path
        fill="currentColor"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5z"
      />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pharmaconnect_pakistan/",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/pharmaconnectpakistan/",
    icon: (
      <path
        fill="currentColor"
        d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"
      />
    ),
  },
];

export default function SocialLinks() {
  return SOCIALS.map(({ label, href, icon }) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        {icon}
      </svg>
    </a>
  ));
}
