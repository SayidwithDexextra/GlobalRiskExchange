import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { HashlessScroll } from "@/components/HashlessScroll";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dexetera.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dexetera | The marketplace for risk",
  description: "Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.",
  openGraph: {
    title: "Dexetera | The marketplace for risk",
    description: "Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.",
    siteName: "Dexetera",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dexetera | The marketplace for risk",
    description: "Create a futures market on any number you can measure, trade it long or short in USDC, and let public data settle it.",
  },
};

// Runs as the document finishes parsing, before first paint, so a visited
// /#markets URL scrolls to the section and then drops the hash.
const hashlessScript = `
(function(){
  var KEY = 'dx-scroll-target';
  var id = '';
  try {
    var h = location.hash;
    if (h && h.length > 1) {
      id = decodeURIComponent(h.slice(1));
      sessionStorage.setItem(KEY, id);
      history.replaceState(history.state, '', location.pathname + location.search);
    } else {
      id = sessionStorage.getItem(KEY) || '';
    }
  } catch (e) {}
  if (!id) return;
  if (id === 'top') { window.scrollTo(0, 0); return; }
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ block: 'start' });
})();
`;

// Registered while the document is parsing, before Next.js can follow a
// section link. preventDefault keeps /#markets out of the address bar.
const hashlessClickScript = `
(function(){
  var KEY = 'dx-scroll-target';
  function parse(href) {
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin) return null;
      if (!url.hash || url.hash === '#') return null;
      var id = decodeURIComponent(url.hash.slice(1));
      if (!id) return null;
      return { pathname: url.pathname, id: id };
    } catch (e) { return null; }
  }
  function scrollTo(id) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = reduce ? 'auto' : 'smooth';
    if (!id || id === 'top') {
      window.scrollTo({ top: 0, left: 0, behavior: behavior });
      return;
    }
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start', behavior: behavior });
  }
  function withoutHash(url) {
    try {
      var u = new URL(url, location.href);
      if (u.origin !== location.origin || !u.hash) return url;
      return u.pathname + u.search;
    } catch (e) { return url; }
  }
  ['pushState', 'replaceState'].forEach(function(name) {
    var orig = history[name];
    history[name] = function(state, title, url) {
      if (typeof url === 'string') url = withoutHash(url);
      return orig.call(history, state, title, url);
    };
  });
  window.addEventListener('hashchange', function() {
    if (!location.hash) return;
    var id = decodeURIComponent(location.hash.slice(1));
    try { sessionStorage.setItem(KEY, id); } catch (e) {}
    history.replaceState(history.state, '', location.pathname + location.search);
    scrollTo(id);
  });
  document.addEventListener('click', function(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var node = event.target;
    var origin = node && node.nodeType === 1 ? node : (node && node.parentElement);
    if (!origin || !origin.closest) return;
    var anchor = origin.closest('a');
    if (!anchor) return;
    var targetAttr = anchor.getAttribute('target');
    if (targetAttr && targetAttr !== '_self') return;
    var href = anchor.getAttribute('href');
    if (!href) return;
    var target = parse(href);
    if (!target) return;
    event.preventDefault();
    if (target.pathname === location.pathname) {
      scrollTo(target.id);
      return;
    }
    try { sessionStorage.setItem(KEY, target.id); } catch (e) {}
    location.assign(target.pathname);
  }, true);
})();
`;

// Theme script to prevent flash - runs before React hydrates
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('dx-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  window.dxToggleTheme = function() {
    var h = document.documentElement;
    var n = h.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    h.classList.add('theme-anim');
    h.setAttribute('data-theme', n);
    try { localStorage.setItem('dx-theme', n); } catch(e) {}
    setTimeout(function() { h.classList.remove('theme-anim'); }, 350);
    document.querySelectorAll('.theme-toggle').forEach(function(b) {
      b.setAttribute('aria-label', n === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  };
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: hashlessClickScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: hashlessScript }} />
        <HashlessScroll />
      </body>
    </html>
  );
}
