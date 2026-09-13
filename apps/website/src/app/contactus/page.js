import React from "react";

import SiteHeader from "../componants/siteHeader";
import SiteFooter from "../componants/siteFooter";
import ScrollTop from "../componants/scrollTop";
import ContactExplorer from "../componants/contactExplorer";

export default function ContactUs() {
    return (
        <div className="bg-surface font-sans text-on-surface antialiased">
            <SiteHeader />
            <main className="w-full pt-20 bg-surface">
                <ContactExplorer />
            </main>
            <SiteFooter />
            <ScrollTop />
        </div>
    );
}
