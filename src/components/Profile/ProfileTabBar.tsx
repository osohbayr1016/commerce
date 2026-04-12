"use client";

interface ProfileTabBarProps<T extends string> {
  activeTab: T;
  tabs: Array<{ id: T; label: string; hint: string }>;
  onChange: (tab: T) => void;
}

export default function ProfileTabBar<T extends string>({
  activeTab,
  tabs,
  onChange,
}: ProfileTabBarProps<T>) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-left transition ${
                active
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-white"
              }`}
            >
              <p className="text-sm font-medium">{tab.label}</p>
              <p className={`text-xs ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                {tab.hint}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
