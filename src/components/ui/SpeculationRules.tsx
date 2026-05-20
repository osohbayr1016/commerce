"use client";

import { useEffect, useState } from "react";

export default function SpeculationRules() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speculation rules
    if (
      typeof HTMLScriptElement !== "undefined" &&
      HTMLScriptElement.supports &&
      HTMLScriptElement.supports("speculationrules")
    ) {
      setSupported(true);
    }
  }, []);

  if (!supported) return null;

  // Define rules compliant with performance best practices
  const rules = {
    prefetch: [
      {
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: "/admin/*" } },
            { not: { href_matches: "/api/*" } },
            { not: { href_matches: "/checkout/*" } },
            { not: { href_matches: "/auth/*" } },
            { not: { href_matches: "/debug-auth*" } },
            { not: { selector_matches: ".do-not-prerender" } },
            { not: { selector_matches: "[rel~=nofollow]" } },
          ],
        },
        eagerness: "moderate",
      },
    ],
    prerender: [
      {
        where: {
          and: [
            { href_matches: "/products/*" },
            { href_matches: "/categories/*" },
            { not: { selector_matches: ".do-not-prerender" } },
          ],
        },
        eagerness: "moderate",
      },
    ],
  };

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  );
}
