-- Demo seed data. Safe to delete before piloting a real salon.
insert into salons (name, slug) values ('Demo Salon', 'demo-salon')
  on conflict (slug) do nothing;

insert into stylists (salon_id, name)
select id, 'Any Stylist' from salons where slug = 'demo-salon'
on conflict do nothing;
