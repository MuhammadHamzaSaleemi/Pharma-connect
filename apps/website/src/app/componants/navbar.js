"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  LuSearch,
  FiUser,
  FiSettings,
  FiLock,
  FiLogOut,
} from "../assets/icons/vander";
import { useAuth } from "../../context/AuthContext";

// Menu is data-driven so links can be added/removed without touching JSX.
// `roles` restricts an item to signed-in users whose role is in the list;
// `requiresAuth` restricts to any signed-in user; omit both for a public item.
const NAV_MENU = [
  {
    label: "Home",
    href: "/",
    matches: ["/"],
  },
  {
    label: "Jobs",
    href: "/jobs",
    matches:["/jobs"]
    // matches: ['/job-categories', '/job-grid-one', '/job-grid-two', '/job-grid-three', '/job-grid-four', '/job-list-one', '/job-list-two', '/job-detail-one', '/job-detail-two', '/job-detail-three', '/job-apply', '/job-post', '/career'],
    // submenu: [
    //     { label: 'Job Categories', href: '/job-categories' },
    //     {
    //         label: 'Job Grids', href: '#', matches: ['/job-grid-one', '/job-grid-two', '/job-grid-three', '/job-grid-four'],
    //         submenu: [
    //             { label: 'Job Grid One', href: '/job-grid-one' },
    //             { label: 'Job Grid Two', href: '/job-grid-two' },
    //             { label: 'Job Grid Three', href: '/job-grid-three' },
    //             { label: 'Job Grid Four', href: '/job-grid-four' },
    //         ],
    //     },
    //     {
    //         label: 'Job Lists', href: '#', matches: ['/job-list-one', '/job-list-two'],
    //         submenu: [
    //             { label: 'Job List One', href: '/job-list-one' },
    //             { label: 'Job List Two', href: '/job-list-two' },
    //         ],
    //     },
    //     {
    //         label: 'Job Detail', href: '#', matches: ['/job-detail-one', '/job-detail-two', '/job-detail-three'],
    //         submenu: [
    //             { label: 'Job Detail One', href: '/job-detail-one' },
    //             { label: 'Job Detail Two', href: '/job-detail-two' },
    //             { label: 'Job Detail Three', href: '/job-detail-three' },
    //         ],
    //     },
    //     { label: 'Job Apply', href: '/job-apply' },
    //     // Posting a job is limited to staff-side roles, not ordinary self-registered viewers.
    //     { label: 'Job Post', href: '/job-post', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACIST'] },
    //     { label: 'Career', href: '/career' },
    // ],
  },
  // {
  //     label: 'Employers', href: '#', matches: ['/employers', '/employer-profile'],
  //     submenu: [
  //         { label: 'Employers', href: '/employers' },
  //         { label: 'Employer Profile', href: '/employer-profile', requiresAuth: true },
  //     ],
  // },
  // {
  //     label: 'Candidates', href: '#', matches: ['/candidates', '/candidate-profile', '/candidate-profile-setting'],
  //     submenu: [
  //         { label: 'Candidates', href: '/candidates' },
  //         { label: 'Candidate Profile', href: '/candidate-profile', requiresAuth: true },
  //         { label: 'Profile Setting', href: '/candidate-profile-setting', requiresAuth: true },
  //     ],
  // },
  {
    label: "About Us",
    href: "/aboutus",
    matches: ["/aboutus"],
  },
    {
    label: "Blogs",
    href: "/blogs",
    matches: ["/blogs"],
  },
//   {
//     label: "Pages",
//     href: "#",
//     matches: [
//       "/aboutus",
//       "/services",
//       "/pricing",
//       "/helpcenter-overview",
//       "/helpcenter-faqs",
//       "/helpcenter-guides",
//       "/helpcenter-support",
//       "/blogs",
//       "/blog-sidebar",
//       "/blog-detail",
//       "/login",
//       "/signup",
//       "/reset-password",
//       "/lock-screen",
//       "/terms",
//       "/privacy",
//     ],
//     submenu: [
//       { label: "About Us", href: "/aboutus" },
//       { label: "Services", href: "/services" },
//       { label: "Pricing", href: "/pricing" },
//       {
//         label: "Helpcenter",
//         href: "#",
//         matches: [
//           "/helpcenter-overview",
//           "/helpcenter-faqs",
//           "/helpcenter-guides",
//           "/helpcenter-support",
//         ],
//         submenu: [
//           { label: "Overview", href: "/helpcenter-overview" },
//           { label: "FAQs", href: "/helpcenter-faqs" },
//           { label: "Guides", href: "/helpcenter-guides" },
//           { label: "Support", href: "/helpcenter-support" },
//         ],
//       },
//       {
//         label: "Blog",
//         href: "#",
//         matches: ["/blogs", "/blog-sidebar", "/blog-detail"],
//         submenu: [
//           { label: " Blogs", href: "/blogs" },
//           { label: " Blog Sidebar", href: "/blog-sidebar" },
//           { label: " Blog Detail", href: "/blog-detail" },
//         ],
//       },
//       {
//         label: "Auth Pages",
//         href: "#",
//         matches: ["/login", "/signup", "/reset-password", "/lock-screen"],
//         submenu: [
//           { label: " Login", href: "/login", hideWhenAuthed: true },
//           { label: " Signup", href: "/signup", hideWhenAuthed: true },
//           { label: " Forgot Password", href: "/reset-password" },
//           { label: " Lock Screen", href: "/lock-screen" },
//         ],
//       },
//       {
//         label: "Utility",
//         href: "#",
//         matches: ["/terms", "/privacy"],
//         submenu: [
//           { label: "Terms of Services", href: "/terms" },
//           { label: "Privacy Policy", href: "/privacy" },
//         ],
//       },
//       {
//         label: "Special",
//         href: "#",
//         matches: ["/comingsoon", "/maintenance", "/error"],
//         submenu: [
//           { label: " Coming Soon", href: "/comingsoon" },
//           { label: " Maintenance", href: "/maintenance" },
//           { label: " 404! Error", href: "/error" },
//         ],
//       },
//     ],
//   },
  { label: "Contact Us", href: "/contactus" },
];

function canShowMenuItem(item, { isAuthenticated, role }) {
  if (item.hideWhenAuthed && isAuthenticated) return false;
  if (item.roles) return isAuthenticated && item.roles.includes(role);
  if (item.requiresAuth) return isAuthenticated;
  return true;
}

function isItemActive(item, pathname) {
  if (item.matches) return item.matches.includes(pathname);
  return item.href === pathname;
}

function MenuItem({ item, pathname, authState, depth }) {
  if (!canShowMenuItem(item, authState)) return null;

  const active = isItemActive(item, pathname);

  if (item.submenu) {
    const arrowClass = depth === 0 ? "menu-arrow" : "submenu-arrow";
    const visibleChildren = item.submenu.filter((child) =>
      canShowMenuItem(child, authState),
    );
    if (visibleChildren.length === 0) return null;

    return (
      <li className={`${active ? "active" : ""} has-submenu parent-menu-item`}>
        <Link href={item.href}>{item.label}</Link>
        <span className={arrowClass}></span>
        <ul className="submenu">
          {visibleChildren.map((child) => (
            <MenuItem
              key={child.label}
              item={child}
              pathname={pathname}
              authState={authState}
              depth={depth + 1}
            />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className={active ? "active" : ""}>
      <Link href={item.href} className="sub-menu-item">
        {item.label}
      </Link>
    </li>
  );
}

export default function Navbar({ navClass, navLight }) {
  let [isOpen, setMenu] = useState(true);
  let [scroll, setScroll] = useState(false);
  let [search, setSearch] = useState(false);
  let [cartitem, setCartitem] = useState(false);

  let pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const authState = { isAuthenticated, role: user?.role };

  useEffect(() => {
    function scrollHandler() {
      setScroll(window.scrollY > 50);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", scrollHandler);
      window.scrollTo(0, 0);
    }

    let searchModal = () => {
      setSearch(false);
    };
    document.addEventListener("mousedown", searchModal);

    let cartModal = () => {
      setCartitem(false);
    };
    document.addEventListener("mousedown", cartModal);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("mousedown", searchModal);
      document.removeEventListener("mousedown", cartModal);
    };
  }, []);
  const toggleMenu = () => {
    setMenu(!isOpen);
    if (document.getElementById("navigation")) {
      const anchorArray = Array.from(
        document.getElementById("navigation").getElementsByTagName("a"),
      );
      anchorArray.forEach((element) => {
        element.addEventListener("click", (elem) => {
          const target = elem.target.getAttribute("href");
          if (target !== "") {
            if (elem.target.nextElementSibling) {
              var submenu = elem.target.nextElementSibling.nextElementSibling;
              submenu.classList.toggle("open");
            }
          }
        });
      });
    }
  };

  const handleLogout = async () => {
    setCartitem(false);
    await logout();
    router.push("/");
  };

  return (
    <header id="topnav" className={`${scroll ? "nav-sticky" : ""} ${navClass}`}>
      <div className="container">
        {navLight === true ? (
          <Link className="logo" href="/">
            <span className="logo-light-mode">
              <Image
                src="/images/logo.png"
                width={130}
                height={50}
                className="l-dark"
                alt=""
              />
              <Image
                src="/images/logo.png"
                width={130}
                height={50}
                className="l-light"
                alt=""
              />
            </span>
            <Image
              src="/images/logo.png"
              width={130}
              height={50}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        ) : (
          <Link className="logo" href="/">
            <span className="logo-light-mode">
              <Image
                src="/images/logo.png"
                width={130}
                height={50}
                className="l-dark"
                alt=""
              />
              <Image
                src="/images/logo.png"
                width={130}
                height={50}
                className="l-light"
                alt=""
              />
            </span>
            <Image
              src="/images/logo.png"
              width={130}
              height={50}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        )}
        <div className="menu-extras">
          <div className="menu-item">
            <Link
              href="#"
              className="navbar-toggle"
              id="isToggle"
              onClick={toggleMenu}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>

        <ul className="buy-button list-inline mb-0">
          {/* {!isLoading && !isAuthenticated && (
                    <li className="list-inline-item ps-1 mb-0">
                        <Link href="/login" className="btn btn-sm btn-primary me-1">Login</Link>
                        <Link href="/signup" className="btn btn-sm btn-primary">Signup</Link>
                    </li>
                )} */}

          {/* {!isLoading && isAuthenticated && (
                    <li className="list-inline-item ps-1 mb-0">
                        <div className="dropdown dropdown-primary">
                            <button type="button" onClick={()=>setCartitem(!cartitem)} className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary">
                                <Image src="/images/team/01.jpg" height={32} width={32} className="img-fluid rounded-pill" alt=""/>
                            </button>
                            <div style={{display: cartitem === true ? 'block' : 'none'}}>
                                <div className={` dropdown-menu dd-menu dropdown-menu-end bg-white rounded shadow border-0 mt-3 show`}>
                                    <span className="dropdown-item fw-semibold fs-6 text-truncate d-block" style={{cursor:'default'}}>{user?.name}</span>
                                    <span className="dropdown-item small text-muted d-block" style={{cursor:'default'}}>{user?.role}</span>
                                    <div className="dropdown-divider border-top"></div>
                                    <Link href="candidate-profile" className="dropdown-item fw-medium fs-6"><FiUser className="fea icon-sm me-2 align-middle" />Profile</Link>
                                    <Link href="candidate-profile-setting" className="dropdown-item fw-medium fs-6"><FiSettings className="fea icon-sm me-2 align-middle"/>Settings</Link>
                                    <div className="dropdown-divider border-top"></div>
                                    <Link href="lock-screen" className="dropdown-item fw-medium fs-6"><FiLock className="fea icon-sm me-2 align-middle"/>Lockscreen</Link>
                                    <button type="button" onClick={handleLogout} className="dropdown-item fw-medium fs-6 border-0 bg-transparent w-100 text-start"><FiLogOut className="fea icon-sm me-2 align-middle"/>Logout</button>
                                </div>
                            </div>
                        </div>
                    </li>
                )} */}
        </ul>

        <div id="navigation">
          <ul className="navigation-menu nav-right nav-light">
            {NAV_MENU.map((item) => (
              <MenuItem
                key={item.label}
                item={item}
                pathname={pathname}
                authState={authState}
                depth={0}
              />
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
