    import React from "react";
    import { Link } from "react-router-dom";
    
    const Footer = () => {
      return (
        <footer className="w-full bg-blue-950 text-white">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    
            {/* About */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-sm font-bold text-blue-950">
                  A
                </div>
                <span className="text-xl font-bold">
                  ABC <span className="text-amber-400">Builders</span>
                </span>
              </div>
              <p className="text-sm text-gray-300">
                Crafting architectural excellence and premium residential enclaves
                across Delhi NCR with precision, trust, and lasting value.
              </p>
            </div>
    
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
                <li><Link to="/properties" className="hover:text-amber-400 transition-colors">Properties</Link></li>
                <li><Link to="/properties?type=sale" className="hover:text-amber-400 transition-colors">For Sale</Link></li>
                <li><Link to="/properties?type=rent" className="hover:text-amber-400 transition-colors">For Rent</Link></li>
                <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
    
            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Contact Us
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Sector 12, Dwarka, New Delhi - 110075</span>
                </li>
                <li>
                  <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                    <span>📞</span><span>+91 98765 43210</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@abcbuilders.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                    <span>✉️</span><span>info@abcbuilders.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  >
                    <span>💬</span><span>WhatsApp Us</span>
                  </a>
                </li>
              </ul>
            </div>
    
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Stay Updated
              </h4>
              <p className="text-sm text-gray-300">
                Get notified about new launches and exclusive offers.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center rounded-lg bg-white/10 p-1 border border-white/10"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2 rounded-md bg-amber-500 text-blue-950 text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
    
          {/* Bottom bar */}
          <div className="border-t border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <p>© {new Date().getFullYear()} ABC Builders & Developers Pvt. Ltd. All rights reserved.</p>
              <div className="flex items-center gap-5">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal </Link>
              </div>
            </div>
          </div>
        </footer>
      );
    };
    
    export default Footer;
    