-- Update site name to E-Commerce
update public.site_settings
set value = 'E-Commerce'
where key = 'site_name';

-- If site_name doesn't exist, insert it
insert into public.site_settings (key, value)
values ('site_name', 'E-Commerce')
on conflict (key) do update set value = 'E-Commerce';
