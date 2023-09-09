'use client'

import { UserAgentContext } from "app/contexts/UserAgentContext";
import { useContext } from "react";

export const useUserAgent = () => {
  const {
    userAgent
  } = useContext(UserAgentContext);

  const browser = {
    name: userAgent.browser.name,
    version: userAgent.browser.version,
  };

  const operatingSystem = {
    name: userAgent.operatingSystem.name,
    version: userAgent.operatingSystem.version,
  };

  return {
    userAgent,
    browser,
    operatingSystem,
  };
}
