"use client";

import { useState } from "react";
import { useModal } from "@/hooks/useModal";

const MIGRATION_SQL = `
create table if not exists public.hero_banners (
    id uuid not null default gen_random_uuid(),
    image_url text not null,
    title text,
    description text,
    link text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint hero_banners_pkey primary key (id)
);

-- Enable RLS
alter table public.hero_banners enable row level security;

-- Policies
create policy "Allow public read access"
    on public.hero_banners for select
    using (true);

create policy "Allow admin full access"
    on public.hero_banners for all
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Trigger to set updated_at (no extension required)
create or replace function public.hero_banners_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;
drop trigger if exists handle_updated_at on public.hero_banners;
create trigger handle_updated_at before update on public.hero_banners
    for each row execute procedure public.hero_banners_updated_at();
`;

export default function SetupHeroPage() {
  const [copied, setCopied] = useState(false);
  const modal = useModal();

  const handleCopy = () => {
    navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    modal.showSuccess("Copied", "SQL copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Setup Hero Banners Table</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Database Setup Required</h3>
        <p className="text-yellow-700">
          The <code>hero_banners</code> table is missing from your database. 
          Please copy the SQL below and run it in your Supabase Dashboard SQL Editor.
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCopy}
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {copied ? "Copied!" : "Copy SQL"}
          </button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
          {MIGRATION_SQL}
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
          <li>Select your project</li>
          <li>Click on <strong>SQL Editor</strong> in the left sidebar</li>
          <li>Click <strong>New Query</strong></li>
          <li>Paste the SQL code from above</li>
          <li>Click <strong>Run</strong></li>
          <li>Return here and refresh the page</li>
        </ol>
      </div>
    </div>
  );
}
