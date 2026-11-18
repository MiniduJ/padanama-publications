// Shared (client + server) description of every admin-managed resource.
// The API whitelists writes to these fields; the UI renders tables/forms from them.

export type FieldType =
  | "text" | "textarea" | "number" | "money" | "bool" | "select"
  | "date" | "image" | "images" | "password" | "readonly";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  optionsFrom?: string; // resource key whose rows provide {slug,nameEn} options
  required?: boolean;
  list?: boolean; // show as table column
  help?: string;
}

export interface ResourceDef {
  key: string;
  label: string;
  singular: string;
  fields: Field[];
  canCreate?: boolean;
  canDelete?: boolean;
  filters?: { name: string; options: string[] }[];
}

export const ORDER_STATUSES = [
  "PENDING_PAYMENT", "PENDING_SLIP_VERIFICATION", "PAID", "COD_CONFIRMED", "PROCESSING",
  "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED",
  "RETURNED", "REFUNDED", "FAILED",
];
export const COURIERS = ["KOOMBIYO", "DOMEX"];
export const STAFF_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "LIBRARIAN", "ORDER_MANAGER", "SUPPORT", "ACCOUNTANT", "MARKETING"];
export const EXPENSE_CATEGORIES = ["PRINTING", "PAPER", "ROYALTY", "COURIER", "SALARY", "MARKETING", "RENT", "UTILITIES", "BOOK_FAIR", "OTHER"];

export const RESOURCES: Record<string, ResourceDef> = {
  books: {
    key: "books", label: "Catalogue", singular: "Book", canCreate: true, canDelete: true,
    fields: [
      { name: "coverUrl", label: "Cover", type: "image", list: true },
      { name: "titleSi", label: "Title (Sinhala)", type: "text", required: true, list: true },
      { name: "titleEn", label: "Title (English)", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Lowercase, no spaces, e.g. grade-5-model-papers" },
      { name: "categorySlug", label: "Category", type: "select", optionsFrom: "categories", list: true },
      { name: "priceCents", label: "Price (Rs.)", type: "money", required: true, list: true },
      { name: "salePriceCents", label: "Sale price (Rs.)", type: "money" },
      { name: "stockQuantity", label: "Stock", type: "number", list: true },
      { name: "pageCount", label: "Total pages", type: "number" },
      { name: "isbn", label: "ISBN", type: "text" },
      { name: "grade", label: "Grade", type: "text" },
      { name: "subject", label: "Subject / term", type: "text" },
      { name: "bookType", label: "Book type", type: "text", help: "e.g. Term Papers, Model Papers, Short Notes" },
      { name: "synopsisSi", label: "Description (Sinhala)", type: "textarea" },
      { name: "synopsisEn", label: "Description (English)", type: "textarea" },
      { name: "isFeatured", label: "Featured on home", type: "bool" },
      { name: "isBestSeller", label: "Bestseller badge", type: "bool", list: true },
      { name: "galleryUrls", label: "Gallery images", type: "images", help: "Back cover, inside pages shown on the book page" },
      { name: "previewUrl", label: "Flip-book preview URL", type: "text", help: "e.g. https://online.fliphtml5.com/..." },
      { name: "materialsUrl", label: "Video lessons URL", type: "text", help: "YouTube video or playlist" },
      { name: "samplePageUrls", label: "Sample read pages (in order)", type: "images", help: "Upload page images; the reader shows the cover first, then these pages." },
      { name: "maxPages", label: "Max sample pages", type: "number" },
      { name: "readCount", label: "Sample reads", type: "readonly", list: true },
    ],
  },
  categories: {
    key: "categories", label: "Categories", singular: "Category", canCreate: true, canDelete: true,
    fields: [
      { name: "nameSi", label: "Name (Sinhala)", type: "text", required: true, list: true },
      { name: "nameEn", label: "Name (English)", type: "text", required: true, list: true },
      { name: "slug", label: "Slug", type: "text", required: true, list: true },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "sortOrder", label: "Sort order", type: "number", list: true },
      { name: "isFeatured", label: "Featured", type: "bool" },
    ],
  },
  orders: {
    key: "orders", label: "Orders & Deliveries", singular: "Order", canDelete: false,
    filters: [{ name: "status", options: ORDER_STATUSES }, { name: "deliveryCourier", options: COURIERS }],
    fields: [
      { name: "orderNumber", label: "Order #", type: "readonly", list: true },
      { name: "createdAt", label: "Placed", type: "readonly", list: true },
      { name: "customerName", label: "Customer", type: "readonly", list: true },
      { name: "guestPhone", label: "Phone", type: "readonly", list: true },
      { name: "shippingLine", label: "Address", type: "readonly" },
      { name: "shippingCity", label: "City", type: "readonly" },
      { name: "shippingDistrict", label: "District", type: "readonly", list: true },
      { name: "itemsSummary", label: "Items", type: "readonly" },
      { name: "totalCents", label: "Total", type: "readonly", list: true },
      { name: "paymentMethod", label: "Payment", type: "readonly", list: true },
      { name: "bankSlipUrl", label: "Bank slip", type: "readonly" },
      { name: "status", label: "Status", type: "select", options: ORDER_STATUSES, list: true },
      { name: "deliveryMethod", label: "Delivery", type: "readonly" },
      { name: "deliveryCourier", label: "Courier", type: "select", options: COURIERS, list: true },
      { name: "trackingNumber", label: "Tracking / waybill #", type: "text" },
      { name: "internalNotes", label: "Internal notes", type: "textarea" },
    ],
  },
  banners: {
    key: "banners", label: "Hero Slides", singular: "Slide", canCreate: true, canDelete: true,
    fields: [
      { name: "imageUrl", label: "Image", type: "image", required: true, list: true, help: "Wide image, 1920×800 recommended" },
      { name: "titleSi", label: "Title (Sinhala)", type: "text", required: true, list: true },
      { name: "titleEn", label: "Title (English)", type: "text", required: true },
      { name: "subtitleSi", label: "Subtitle (Sinhala)", type: "textarea" },
      { name: "subtitleEn", label: "Subtitle (English)", type: "textarea" },
      { name: "linkUrl", label: "Button link", type: "text", help: "e.g. /books?category=gce-ol" },
      { name: "sortOrder", label: "Order", type: "number", list: true },
      { name: "isActive", label: "Visible", type: "bool", list: true },
    ],
  },
  testimonials: {
    key: "testimonials", label: "Reviews", singular: "Review", canCreate: true, canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, list: true },
      { name: "location", label: "Town", type: "text", list: true },
      { name: "rating", label: "Rating (1-5)", type: "number", list: true },
      { name: "comment", label: "Comment", type: "textarea", required: true },
      { name: "avatarUrl", label: "Photo", type: "image" },
      { name: "likes", label: "Likes", type: "number", list: true },
      { name: "sortOrder", label: "Order", type: "number" },
      { name: "isApproved", label: "Published", type: "bool", list: true },
    ],
  },
  social: {
    key: "social", label: "Social Feed", singular: "Post", canCreate: true, canDelete: true,
    fields: [
      { name: "kind", label: "Type", type: "select", options: ["POST", "VIDEO"], required: true, list: true },
      { name: "url", label: "Facebook / YouTube URL", type: "text", required: true, list: true },
      { name: "thumbnailUrl", label: "Thumbnail", type: "image", list: true, help: "Optional for YouTube (auto)" },
      { name: "caption", label: "Caption", type: "text" },
      { name: "sortOrder", label: "Order", type: "number" },
      { name: "isActive", label: "Visible", type: "bool", list: true },
    ],
  },
  expenses: {
    key: "expenses", label: "Finance", singular: "Expense", canCreate: true, canDelete: true,
    fields: [
      { name: "date", label: "Date", type: "date", required: true, list: true },
      { name: "category", label: "Category", type: "select", options: EXPENSE_CATEGORIES, required: true, list: true },
      { name: "description", label: "Description", type: "text", required: true, list: true },
      { name: "amountCents", label: "Amount (Rs.)", type: "money", required: true, list: true },
    ],
  },
  staff: {
    key: "staff", label: "Staff", singular: "Staff member", canCreate: true, canDelete: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, list: true },
      { name: "email", label: "Email (login)", type: "text", required: true, list: true },
      { name: "phoneNumber", label: "Phone", type: "text" },
      { name: "role", label: "Role", type: "select", options: STAFF_ROLES, required: true, list: true },
      { name: "password", label: "New password", type: "password", help: "Leave blank to keep current. Min 10 characters." },
      { name: "isActive", label: "Active", type: "bool", list: true },
    ],
  },
  customers: {
    key: "customers", label: "Customers", singular: "Customer",
    fields: [
      { name: "name", label: "Name", type: "readonly", list: true },
      { name: "phoneNumber", label: "Mobile", type: "readonly", list: true },
      { name: "email", label: "Email", type: "readonly", list: true },
      { name: "orderCount", label: "Orders", type: "readonly", list: true },
      { name: "createdAt", label: "Registered", type: "readonly", list: true },
      { name: "isActive", label: "Active", type: "bool", list: true },
    ],
  },
  content: {
    key: "content", label: "Page Content", singular: "Content block", canCreate: true, canDelete: true,
    fields: [
      { name: "key", label: "Key", type: "text", required: true, list: true, help: "Storefront keys: contact.phone, contact.phone2, contact.whatsapp, contact.email, contact.address, bank.accounts (one account per line, e.g. Bank of Ceylon – 1234567 – Padanama Publications – Kollupitiya)" },
      { name: "value", label: "Value", type: "textarea", required: true, list: true },
      { name: "description", label: "Note", type: "text" },
    ],
  },
  messages: {
    key: "messages", label: "Inbox", singular: "Message", canDelete: true,
    fields: [
      { name: "createdAt", label: "Received", type: "readonly", list: true },
      { name: "name", label: "Name", type: "readonly", list: true },
      { name: "phone", label: "Phone", type: "readonly", list: true },
      { name: "email", label: "Email", type: "readonly" },
      { name: "subject", label: "Subject", type: "readonly", list: true },
      { name: "message", label: "Message", type: "readonly" },
      { name: "isHandled", label: "Handled", type: "bool", list: true },
    ],
  },
};
