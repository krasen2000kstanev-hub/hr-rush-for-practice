import Script from "next/script";
import { analyticsEnv } from "@/lib/env";

/**
 * Injects GA4 and/or Meta Pixel only when the corresponding env var is
 * configured. Safe to render unconditionally from the root layout.
 */
export function Analytics() {
  return (
    <>
      {analyticsEnv.gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsEnv.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsEnv.gaId}');
            `}
          </Script>
        </>
      )}

      {analyticsEnv.metaPixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analyticsEnv.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
