import { FaInstagram, FaLinkedin, FaTiktok, FaEnvelope } from "react-icons/fa";
 

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white my-10 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Brand / Name */}
        <h2 className="font-edwardian text-4xl tracking-wide">
          Truce L&apos;officiel
        </h2>

        {/* Social Icons */}
        <div className="flex gap-8 text-2xl">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:contact@truce.com"
            className="hover:text-green-400 transition"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} Truce L&apos;officiel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
