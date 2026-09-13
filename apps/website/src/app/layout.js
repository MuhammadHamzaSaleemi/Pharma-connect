import { Plus_Jakarta_Sans } from 'next/font/google'
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/scss/style.scss"
import "./assets/css/materialdesignicons.min.css"
import { AuthProvider } from '../context/AuthContext'
import QueryProvider from '../providers/QueryProvider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight:["200","300","400","500","600","700","800"],
  variable: '--font-jakarta',
  })

export const metadata = {
  title: 'PharmaConnect',
  description: 'PharmaConnect - Job Board',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Icon font for the Tailwind homepage, subset to only the glyphs page.js uses (~9KB vs ~950KB full). Keep icon_names in sync with page.js. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add_circle,arrow_forward,article,biotech,bolt,bookmark,bookmark_border,calendar_today,chat,check,check_circle,chevron_left,chevron_right,clinical_notes,close,expand_more,favorite,filter_alt_off,filter_list,flag,groups,home,info,inventory_2,local_hospital,local_pharmacy,location_on,mail,medical_services,menu,notifications_active,policy,progress_activity,public,schedule,school,science,search,search_off,share,sort,timer,trending_up,tune,verified,verified_user,visibility,work&display=swap"
        />
      </head>
      <body className={jakarta.variable}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
