import { Inter } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/style.scss";
import { AuthProvider } from "../context/AuthContext";
import QueryProvider from "../providers/QueryProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../lib/site";

// Site-wide UI/body font. Inter is a variable font: one self-hosted, preloaded file covers every
// weight, and next/font adds a metric-matched fallback so text doesn't shift when it loads.
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PharmaConnect Pakistan | Pharmacy Jobs, Internships & Career Guides",
    template: "%s | PharmaConnect",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Icon font for the Tailwind homepage, subset to only the glyphs page.js uses (~9KB vs ~950KB full). Keep icon_names in sync with page.js. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add_circle,arrow_forward,arrow_outward,article,biotech,bolt,bookmark,bookmark_border,calendar_today,chat,check,check_circle,chevron_left,chevron_right,clinical_notes,close,expand_less,expand_more,favorite,filter_alt_off,filter_list,flag,groups,home,info,inventory_2,local_hospital,local_pharmacy,location_on,lock,mail,medical_services,menu,notifications_active,policy,progress_activity,public,schedule,school,science,search,search_off,share,sort,timer,trending_up,tune,verified,verified_user,visibility,visibility_off,work&display=swap"
        />
      </head>
      <body className={sans.variable}>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q7RM0C9T8Z"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Q7RM0C9T8Z');`}
        </Script>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
