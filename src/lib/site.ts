/**
 * Company facts used by SEO metadata (JSON-LD) and the page itself.
 * Set SITE_URL to the live domain (no trailing slash), e.g. "https://school.noithatdaiphat.vn".
 * While empty, canonical / absolute URLs are simply left out.
 */
export const SITE_URL = "https://school.noithatdaiphat.vn";

export const COMPANY = {
  name: "Dai Phat School Furniture",
  legalName: "Công ty TNHH SX và TM Nội Thất Đại Phát",
  phone: "+84967156678",
  phoneDisplay: "+84 967 156 678",
  phone2: "+84901741879",
  phone2Display: "+84 901 741 879",
  email: "noithatdaiphat8793@gmail.com",
  zaloUrl: "https://zalo.me/0967156678",
  whatsappUrl: "https://wa.me/84901741879",
  taxId: "2802794939",
  foundingYear: "2019",
  street: "Da Sy, Dong Quang",
  city: "Thanh Hoa",
  region: "Thanh Hoa",
  country: "VN",
  lat: 19.768947954322798,
  lng: 105.76198034821354,
  mapUrl: "https://share.google/msLzWKBLeX6YGsKX1", // Google Business Profile
} as const;

export const SEO_TITLE = "School Furniture Manufacturer in Vietnam | Dai Phat";
export const SEO_DESCRIPTION =
  "Dai Phat is a school furniture manufacturer in Thanh Hoa, Vietnam. Factory-direct classroom desks, libraries, STEM labs and dorms, exported across Asia. 24h quote.";

/** Custom event: a product card asks the quote form to pre-fill "Project type". */
export const PREFILL_EVENT = "daiphat:prefill";

/** Main company website (Vietnamese). */
export const MAIN_SITE = {
  home: "https://www.noithatdaiphat.vn/",
  schoolCatalog: "https://www.noithatdaiphat.vn/danh-muc-san-pham?danhmuc=noi-that-truong-hoc",
  facebook: "https://www.facebook.com/noithatdaiphatthanhhoa",
  youtube: "https://www.youtube.com/@noithatdaiphatthanhhoa",
} as const;
