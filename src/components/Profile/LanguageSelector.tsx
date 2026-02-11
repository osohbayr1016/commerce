"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; nativeName: string; nameKey: string }[] = [
    { code: "en", nativeName: "English", nameKey: "profile.english" },
    { code: "mn", nativeName: "Монгол", nameKey: "profile.mongolian" },
    { code: "ru", nativeName: "Русский", nameKey: "profile.russian" },
    { code: "zh", nativeName: "中文", nameKey: "profile.chinese" },
    { code: "it", nativeName: "Italiano", nameKey: "profile.italian" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("profile.language")}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {t("profile.selectLanguage")}
      </p>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              language === lang.code
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  language === lang.code
                    ? "border-gray-900"
                    : "border-gray-300"
                }`}
              >
                {language === lang.code && (
                  <div className="w-3 h-3 rounded-full bg-gray-900" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{lang.nativeName}</p>
                <p className="text-sm text-gray-500">{t(lang.nameKey)}</p>
              </div>
            </div>
            {language === lang.code && (
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
