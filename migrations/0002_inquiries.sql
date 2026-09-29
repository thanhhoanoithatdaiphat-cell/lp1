-- Customer quotation requests submitted from the landing page form.
create table if not exists inquiries (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  contact     text not null,          -- email or WhatsApp / Zalo / phone, as typed
  country     text,
  product     text,                   -- product card the customer clicked, if any
  message     text,
  page_url    text,                   -- landing URL incl. utm_* campaign tags
  referrer    text,
  status      text not null default 'new'  -- new | contacted | quoted | won | lost
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_status_idx on inquiries (status);
