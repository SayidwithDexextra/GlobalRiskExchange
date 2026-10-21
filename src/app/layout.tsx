import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { HashlessScroll } from "@/components/HashlessScroll";
import { SiteAnalytics } from "@/components/SiteAnalytics";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://dexetera.org");

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

// PostHog analytics (page views, clicks, scroll depth, session replay, heatmaps).
// Events go through /ingest (rewrite in next.config.ts) so ad blockers drop fewer visits.
const posthogScript = `
(function(){try{var q=new URLSearchParams(location.search).get('dx_me');if(q===null)return;
if(q==='1'){localStorage.setItem('dx-internal','1');}else{localStorage.removeItem('dx-internal');}
var u=new URL(location.href);u.searchParams.delete('dx_me');history.replaceState(null,'',u.pathname+u.search+u.hash);
var msg=q==='1'?'This browser is now marked as you. Your visits will not count in the traffic reports.':'This browser is no longer marked as you.';
var show=function(){var d=document.createElement('div');d.textContent=msg;d.setAttribute('role','status');
d.style.cssText='position:fixed;left:50%;top:88px;transform:translateX(-50%);z-index:200;max-width:92vw;padding:12px 18px;border-radius:12px;background:#0f0f11;color:#ededee;border:1px solid rgba(61,220,132,.45);font:500 14px/1.4 system-ui,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,.45)';
document.body.appendChild(d);setTimeout(function(){d.remove();},6000);};
if(document.body){show();}else{document.addEventListener('DOMContentLoaded',show);}}catch(e){}})();
!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="vu pu gu mu init Gu Qu Hu Wu Xu il Vu Yu ju oc ac lc uc cc hc capture getExtension Zu hu gc calculateEventProperties vc register register_once register_for_session unregister unregister_for_session zu mc getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys onActiveMatchingSurveysChanged renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync wc identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset kc shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty yc nc createPersonProfile setInternalOrTestUser bc xu ku opt_in_capturing opt_out_capturing Su has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing tc debug nl Os getPageViewId captureTraceFeedback captureTraceMetric Du".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_mvyRtX6trxVyVXZqV6kwzQvddPu6PpoLDFbBBdCLFbHj', {
  api_host: '/ingest',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-05-30',
  person_profiles: 'always',
  before_send: function(ev){try{if(ev&&localStorage.getItem('dx-internal')==='1'){ev.properties=ev.properties||{};ev.properties.dx_internal=true;}}catch(e){}return ev;},
});
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
        <script dangerouslySetInnerHTML={{ __html: posthogScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: hashlessScript }} />
        <HashlessScroll />
        <SiteAnalytics />
      </body>
    </html>
  );
}
