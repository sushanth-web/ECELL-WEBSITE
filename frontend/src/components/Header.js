import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../utils/images/Logo.png";

const linkBase =
  "relative px-4 py-2 font-medium text-[16px] text-blue-100/90 transition " +
  "after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:h-[2px] after:w-0 after:bg-orange-400 after:transition-all after:duration-300 " +
  "hover:text-white hover:after:w-full";

const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-blue-900/90 backdrop-blur-md shadow-lg">

      <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">

        {/* LEFT: Burger + Logo */}
        <div className="flex items-center gap-3">

          {/* Burger */}
          <button
            className="md:hidden relative w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="absolute w-7 h-[3px] bg-white rounded"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="absolute w-7 h-[3px] bg-white rounded top-2.5"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="absolute w-7 h-[3px] bg-white rounded top-5"
            />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-14 w-14 rounded-full" />
            <span className="text-xl font-semibold text-white">
              E<span className="text-orange-400">•</span>Cell
            </span>
          </Link>
        </div>

        {/* ===== DESKTOP NAV ===== */}
        <nav className="hidden md:flex items-center">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${linkBase} ${
                isActive(link.path)
                  ? "text-white font-semibold after:w-full"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* IITB STYLE JOIN DROPDOWN */}
          <div className="relative ml-4 group">

            <div className="cursor-pointer rounded-full bg-orange-500 px-6 py-2.5 text-white font-semibold text-sm shadow-md hover:bg-orange-600 transition">
              Join Us
            </div>

            <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">

              <Link to="/join/register" className="relative block px-5 py-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition group/item">
                Register
                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 group-hover/item:opacity-100 transition"/>
              </Link>

              <div className="h-px bg-slate-200" />

              <Link to="/join/login" className="relative block px-5 py-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition group/item">
                Login
                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 group-hover/item:opacity-100 transition"/>
              </Link>

              <div className="h-px bg-slate-200" />

              <Link to="/join/idea" className="relative block px-5 py-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition group/item">
                Share an Idea
                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 group-hover/item:opacity-100 transition"/>
              </Link>

            </div>
          </div>
        </nav>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer (FIXED POSITION) */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25 }}
              className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)]
              bg-blue-900 z-50 shadow-xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="h-14 flex items-center px-6 border-b border-blue-800">
                <h2 className="text-lg font-semibold text-white">
                  Explore
                </h2>
              </div>

              {/* Links */}
              <div className="flex flex-col py-4 overflow-y-auto">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-6 py-4 text-white hover:bg-blue-800 transition ${
                      isActive(link.path) ? "bg-blue-800 font-medium" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-blue-800 my-4" />

                <Link
                  to="/join/register"
                  onClick={() => setMenuOpen(false)}
                  className="mx-6 mb-3 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-center font-semibold"
                >
                  Register
                </Link>

                <Link
                  to="/join/login"
                  onClick={() => setMenuOpen(false)}
                  className="mx-6 mb-3 border border-white/30 text-white py-3 rounded-lg text-center hover:bg-blue-800"
                >
                  Login
                </Link>

                <Link
                  to="/join/idea"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-orange-400 text-center font-medium"
                >
                  Share an Idea
                </Link>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;
