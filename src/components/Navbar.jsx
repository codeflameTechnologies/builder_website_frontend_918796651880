import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isAdminLoggedIn } from "../api/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Contact", path: "/contact" },
    // { name: "Admin Portal", path: "/admin" },
  ];

  const handleProfileClick = () => {
    if (isAdminLoggedIn()) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }

    setIsMenuOpen(false);
  };

  // Navbar link click hone par page ko top par le jana
  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    setIsMenuOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:gap-6 lg:px-16">

        {/* ================= LOGO ================= */}
        <NavLink
          to="/"
          onClick={handleNavClick}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-black text-sm font-bold text-white">
            A
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="whitespace-nowrap font-serif text-lg font-semibold tracking-tight text-[#0b1c30] sm:text-xl">
              Apex Homes
            </span>

            <span className="hidden border-l border-gray-300 pl-4 text-xs uppercase tracking-[0.2em] text-gray-500 xl:block">
              Builders & Developers
            </span>
          </div>
        </NavLink>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Phone - Desktop/Tablet */}
          <a
            href="tel:+919876543210"
            className="hidden items-center gap-2 px-2 py-2 text-sm font-medium text-[#0b1c30] transition hover:text-gray-500 md:flex lg:px-3"
          >
            <span>☎</span>
            <span>+91 98765 43210</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:px-4"
          >
            WhatsApp
          </a>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#0b1c30] transition hover:bg-gray-50 lg:hidden"
          >
            {isMenuOpen ? (
              // Close Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-3 sm:px-6">

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;