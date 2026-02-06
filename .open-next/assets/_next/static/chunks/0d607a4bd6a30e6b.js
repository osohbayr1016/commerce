(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,54245,e=>{"use strict";var t=e.i(43476),r=e.i(71645),l=e.i(43066);let a=`
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
`;function s(){let[e,s]=(0,r.useState)(!1),i=(0,l.useModal)();return(0,t.jsxs)("div",{className:"max-w-4xl mx-auto p-6",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"Setup Hero Banners Table"}),(0,t.jsxs)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8",children:[(0,t.jsx)("h3",{className:"text-lg font-medium text-yellow-800 mb-2",children:"Database Setup Required"}),(0,t.jsxs)("p",{className:"text-yellow-700",children:["The ",(0,t.jsx)("code",{children:"hero_banners"})," table is missing from your database. Please copy the SQL below and run it in your Supabase Dashboard SQL Editor."]})]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4",children:(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(a),s(!0),setTimeout(()=>s(!1),2e3),i.showSuccess("Copied","SQL copied to clipboard")},className:"bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors",children:e?"Copied!":"Copy SQL"})}),(0,t.jsx)("pre",{className:"bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed",children:a})]}),(0,t.jsxs)("div",{className:"mt-8",children:[(0,t.jsx)("h3",{className:"text-lg font-medium mb-4",children:"Instructions:"}),(0,t.jsxs)("ol",{className:"list-decimal list-inside space-y-2 text-gray-700",children:[(0,t.jsxs)("li",{children:["Go to your ",(0,t.jsx)("a",{href:"https://supabase.com/dashboard",target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:underline",children:"Supabase Dashboard"})]}),(0,t.jsx)("li",{children:"Select your project"}),(0,t.jsxs)("li",{children:["Click on ",(0,t.jsx)("strong",{children:"SQL Editor"})," in the left sidebar"]}),(0,t.jsxs)("li",{children:["Click ",(0,t.jsx)("strong",{children:"New Query"})]}),(0,t.jsx)("li",{children:"Paste the SQL code from above"}),(0,t.jsxs)("li",{children:["Click ",(0,t.jsx)("strong",{children:"Run"})]}),(0,t.jsx)("li",{children:"Return here and refresh the page"})]})]})]})}e.s(["default",()=>s])}]);