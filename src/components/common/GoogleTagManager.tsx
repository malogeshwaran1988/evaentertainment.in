import { GTM_ID } from "@@/constants/constants";
import { CONSENT_STORAGE_KEY } from "@@/lib/consent";

/** Production only, so local dev sessions don't reach GTM. */
const ENABLED = process.env.NODE_ENV === "production";

/** Consent Mode v2 defaults; must run before the GTM snippet. Visitors who already accepted start granted. */
const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var s='denied';try{if(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})==='accepted')s='granted';}catch(e){}
gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`;

/**
 * Standard GTM loader, deferred until the page has loaded and the main thread is idle so gtm.js (and the
 * GA tag it pulls in) never competes with first paint / LCP. GTM still loads on every page.
 */
const GTM_SNIPPET = `(function(w,d,s,l,i){function g(){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}
function q(){(w.requestIdleCallback||function(c){setTimeout(c,1)})(g,{timeout:3000});}
if(d.readyState==='complete')q();else w.addEventListener('load',q,{once:true});
})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`;

/** First thing in `<head>`. */
export function GtmHead() {
  if (!ENABLED) return null;
  return (
    <>
      <script id="gtm-consent-default" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />
      <script id="gtm-head" dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
    </>
  );
}

/** First thing in `<body>`. */
export function GtmNoscript() {
  if (!ENABLED) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
