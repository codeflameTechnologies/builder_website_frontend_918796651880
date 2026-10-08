import { NavLink, useNavigate } from "react-router-dom";
import { isAdminLoggedIn } from "../api/auth";

const Navbar = () => {
  const navigate = useNavigate();

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
  };

  // Navbar link click hone par page ko top par le jana
  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-16">

        <NavLink
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded bg-black text-sm font-bold text-white">
            A
          </div>

          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-semibold tracking-tight text-[#0b1c30]">
              Apex Homes
            </span>

            <span className="hidden border-l border-gray-300 pl-4 text-xs uppercase tracking-[0.2em] text-gray-500 xl:block">
              Builders & Developers
            </span>
          </div>
        </NavLink>

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

        <div className="flex items-center gap-2">

          <a
            href="tel:+919876543210"
            className="hidden items-center gap-2 px-3 py-2 text-sm font-medium text-[#0b1c30] transition hover:text-gray-500 md:flex"
          >
            <span>☎</span>
            <span>+91 98765 43210</span>
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            WhatsApp
          </a>

          {/* <button
            onClick={handleProfileClick}
            title="Admin Panel"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:opacity-80"
          >
            👤
          </button> */}

        </div>
      </div>
    </header>
  );
};

export default Navbar;