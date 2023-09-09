'use client';

import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

type DocumentSizeProviderProps = {
  children: ReactNode;
};

export const DocumentSizeContext = createContext({} as any);

export function DocumentSizeContextProvider({ children }: DocumentSizeProviderProps) {
  const [documentSize, setDocumentSize] = useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setDocumentSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleIsMobile = useCallback(() => {
    const b = /iPhone/i;
    const c = /iPod/i;
    const d = /iPad/i;
    const e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i;
    const f = /Android/i;
    const g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i;
    const h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i;
    const i = /IEMobile/i;
    const j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i;
    const k = /BlackBerry/i;
    const l = /BB10/i;
    const m = /Opera Mini/i;
    const n = /(CriOS|Chrome)(?=.*\bMobile\b)/i;
    const o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i;
    const p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i");

    const ua = navigator.userAgent;
    let result = null;

    const q = (regex: any, str: any) => regex.test(str);

    const isMobileDevice: any = {
      apple: {
        phone: q(b, ua),
        ipod: q(c, ua),
        tablet: !q(b, ua) && q(d, ua),
        device: q(b, ua) || q(c, ua) || q(d, ua),
      },
      amazon: {
        phone: q(g, ua),
        tablet: !q(g, ua) && q(h, ua),
        device: q(g, ua) || q(h, ua),
      },
      android: {
        phone: q(g, ua) || q(e, ua),
        tablet: !q(g, ua) && !q(e, ua) && (q(h, ua) || q(f, ua)),
        device: q(g, ua) || q(h, ua) || q(e, ua) || q(f, ua),
      },
      windows: {
        phone: q(i, ua),
        tablet: q(j, ua),
        device: q(i, ua) || q(j, ua),
      },
      other: {
        blackberry: q(k, ua),
        blackberry10: q(l, ua),
        opera: q(m, ua),
        firefox: q(o, ua),
        chrome: q(n, ua),
        device: q(k, ua) || q(l, ua) || q(m, ua) || q(o, ua) || q(n, ua),
      },
      seven_inch: q(p, ua),
    };

    if (isMobileDevice.any) {
      result = true;
    } else {
      result = false;
    }

    setIsMobile(result);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', () => {
      handleResize();
      handleIsMobile();
    });
    window.addEventListener('DOMContentLoaded', () => {
      handleResize();
      handleIsMobile();
    });

    handleResize();

    return () => {
      window.removeEventListener('resize', () => {
        handleResize();
        handleIsMobile();
      });
      window.removeEventListener('DOMContentLoaded', () => {
        handleResize();
        handleIsMobile();
      });
    };
  }, [handleResize]);

  return (
    <DocumentSizeContext.Provider
      value={{
        documentSize,
        isMobile,
      }}
    >
      {children}
    </DocumentSizeContext.Provider>
  );
}
