"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Trash2, Upload, ChevronUp, ChevronDown, Loader2, RefreshCw, Download, Copy, Pencil, ExternalLink } from "lucide-react";
import { RESOURCES, type Field } from "@/lib/admin-resources";

type Row = Record<string, any>;

const rs = (c?: number | null) => (c == null ? "—" : `Rs. ${(c / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`);
const human = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

async function api(path: string, init?: RequestInit) {
  const r = await fetch(`/api/admin/${path}`, { ...init, headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" } });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401) window.location.href = "/admin/login";
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  return (await api("upload", { method: "POST", body: fd })).url;
}

function Cell({ f, v }: { f: Field; v: any }) {
  if (v == null || v === "") return <span className="text-gray-400">—</span>;
  if (f.type === "image") return <img src={v} alt="" className="w-10 h-12 object-cover rounded border" />;
  if (f.type === "bool") return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${v ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{v ? "Yes" : "No"}</span>;
  if (f.type === "money" || /Cents$/.test(f.name)) return <>{rs(v)}</>;
  if (f.type === "date" || f.name === "createdAt") return <>{new Date(v).toLocaleDateString("en-GB")}</>;
  if (f.type === "select") return <span className="px-2 py-0.5 rounded-full bg-brandNavy/10 text-brandNavy text-[11px] font-bold">{human(String(v))}</span>;
  return <span className="line-clamp-2">{String(v)}</span>;
}

function Input({ f, value, onChange, options }: { f: Field; value: any; onChange: (v: any) => void; options?: { value: string; label: string }[] }) {
  const cls = "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brandNavy";
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const doUpload = async (files: FileList | null, multi: boolean) => {
    if (!files?.length) return;
    setBusy(true); setErr(null);
    try {
      const urls = await Promise.all(Array.from(files).map(upload));
      onChange(multi ? [...(value || []), ...urls] : urls[0]);
    } catch (e: any) { setErr(e.message); }
    setBusy(false);
  };

  switch (f.type) {
    case "readonly":
      if (f.name === "bankSlipUrl" && value) return <a href={value} target="_blank" rel="noreferrer"><img src={value} alt="Bank slip" className="max-h-64 rounded border" /></a>;
      return <div className="px-3 py-2 rounded-lg bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">{/Cents$/.test(f.name) ? rs(value) : f.name === "createdAt" && value ? new Date(value).toLocaleString("en-GB") : value ?? "—"}</div>;
    case "textarea": return <textarea rows={4} className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number": return <input type="number" className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "money": return <input type="number" step="0.01" min="0" className={cls} value={value == null || value === "" ? "" : value / 100} onChange={(e) => onChange(e.target.value === "" ? "" : Math.round(Number(e.target.value) * 100))} />;
    case "date": return <input type="date" className={cls} value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} />;
    case "password": return <input type="password" autoComplete="new-password" className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "bool":
      return (
        <button type="button" role="switch" aria-checked={!!value} onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-green-600" : "bg-gray-300"}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
        </button>
      );
    case "select":
      return (
        <select className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {(options || f.options?.map((o) => ({ value: o, label: human(o) })) || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "image":
      return (
        <div className="flex items-center gap-3">
          {value && <img src={value} alt="" className="w-16 h-20 object-cover rounded border" />}
          <div className="flex-1 space-y-1.5">
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload image
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => doUpload(e.target.files, false)} />
            </label>
            <input className={cls} placeholder="…or paste image URL" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
        </div>
      );
    case "images": {
      const list: string[] = value || [];
      const move = (i: number, d: number) => { const n = [...list]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {list.map((u, i) => (
              <div key={u + i} className="relative border rounded-lg p-1 bg-gray-50">
                <img src={u} alt={`Page ${i + 1}`} className="w-full aspect-[3/4] object-cover rounded" />
                <span className="absolute top-1 left-1 bg-brandNavy text-white text-[10px] font-bold px-1.5 rounded">{i + 1}</span>
                <div className="flex justify-between mt-1">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" aria-label="Remove page" onClick={() => onChange(list.filter((_, j) => j !== i))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  <button type="button" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)} className="disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Add pages
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => doUpload(e.target.files, true)} />
          </label>
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      );
    }
    default:
      if (f.suggestions) return (
        <>
          <input list={`dl-${f.name}`} className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          <datalist id={`dl-${f.name}`}>{f.suggestions.map((s) => <option key={s} value={s} />)}</datalist>
        </>
      );
      return <input className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

const slugify = (s: string) => s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const csvCell = (v: any) => { const s = v == null ? "" : Array.isArray(v) ? v.join(" | ") : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const blank = (fields: Field[]) => Object.fromEntries(fields.map((f) => [f.name, f.type === "bool" ? true : f.type === "images" ? [] : ""]));

export function ResourceManager({ resource, initialFilters = {}, title, defaults = {} }: { resource: string; initialFilters?: Record<string, string>; title?: string; defaults?: Record<string, unknown> }) {
  const def = RESOURCES[resource];
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [original, setOriginal] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [optionSets, setOptionSets] = useState<Record<string, { value: string; label: string }[]>>({});

  const cols = useMemo(() => def.fields.filter((f) => f.list), [def]);
  // Fields worth changing for many rows at once (status, visible, active, type…)
  const bulkFields = useMemo(() => def.fields.filter((f) => f.type === "bool" || (f.type === "select" && !!f.options)), [def]);
  const writable = (r: Row) => Object.fromEntries(def.fields.filter((f) => f.type !== "readonly").map((f) => [f.name, r[f.name]]));

  const query = useCallback((extra: Record<string, string>) => {
    const sp = new URLSearchParams(extra);
    if (q) sp.set("q", q);
    Object.entries(filters).forEach(([k, v]) => v && sp.set(`f.${k}`, v));
    return `${resource}?${sp}`;
  }, [resource, q, filters]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const d = await api(query({ page: String(page) }));
      setRows(d.rows); setTotal(d.total); setPageSize(d.pageSize);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }, [query, page]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => setSelected(new Set()), [resource, page, q, filters]);

  useEffect(() => {
    def.fields.filter((f) => f.optionsFrom).forEach(async (f) => {
      try {
        const d = await api(`${f.optionsFrom}?all=1`);
        setOptionSets((s) => ({ ...s, [f.name]: d.rows.map((r: Row) => ({ value: r.slug, label: `${r.nameEn} — ${r.nameSi}` })) }));
      } catch { /* optional */ }
    });
  }, [def]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const open = (r: Row, opts: { fresh?: boolean } = {}) => { setEditing(r); setOriginal(opts.fresh ? "" : JSON.stringify(r)); setSlugTouched(!!r.id || !!opts.fresh); setFormError(null); };
  const openNew = () => open({ ...blank(def.fields), ...defaults });
  const dirty = !!editing && JSON.stringify(editing) !== original;
  const close = useCallback(() => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setEditing(null);
  }, [dirty]);

  // Esc closes the editor (asks first if there are unsaved changes)
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, close]);

  const setField = (name: string, v: any) => {
    if (name === "slug") setSlugTouched(true);
    setEditing((s) => {
      const next = { ...s!, [name]: v };
      // New items: build the URL slug from the English name until the slug is edited by hand
      if (!s?.id && !slugTouched && (name === "titleEn" || name === "nameEn") && def.fields.some((f) => f.name === "slug")) next.slug = slugify(String(v || ""));
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setFormError(null);
    try {
      const body = writable(editing);
      if (editing.id) await api(`${resource}/${encodeURIComponent(editing.id)}`, { method: "PATCH", body: JSON.stringify(body) });
      else await api(resource, { method: "POST", body: JSON.stringify(body) });
      setEditing(null); flash(`${def.singular} saved`); load();
    } catch (e: any) { setFormError(e.message); }
    setSaving(false);
  };

  const duplicate = () => {
    if (!editing) return;
    const copy: Row = writable(editing);
    if (copy.slug) copy.slug = `${copy.slug}-copy`;
    if (copy.code) copy.code = `${copy.code}2`;
    if (copy.titleEn) copy.titleEn = `${copy.titleEn} (copy)`;
    if (copy.key) copy.key = `${copy.key}.copy`;
    open(copy, { fresh: true });
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete this ${def.singular.toLowerCase()}? This cannot be undone from the panel.`)) return false;
    try { await api(`${resource}/${encodeURIComponent(row.id)}`, { method: "DELETE" }); flash("Deleted"); load(); return true; }
    catch (e: any) { setError(e.message); return false; }
  };

  // Bulk actions reuse the normal per-row API calls, so every rule and the audit log still apply.
  const runBulk = async (label: string, fn: (r: Row) => Promise<unknown>) => {
    const targets = rows.filter((r) => selected.has(r.id));
    let ok = 0; const fails: string[] = [];
    for (const [i, r] of targets.entries()) {
      setBusy(`${label} ${i + 1}/${targets.length}…`);
      try { await fn(r); ok++; } catch (e: any) { fails.push(e.message); }
    }
    setBusy(null); setSelected(new Set()); load();
    if (fails.length) setError(`${ok} done, ${fails.length} failed: ${[...new Set(fails)].join("; ")}`); else flash(`${label}: ${ok} done`);
  };
  const bulkDelete = () => {
    if (confirm(`Delete ${selected.size} ${def.label.toLowerCase()}? This cannot be undone from the panel.`))
      runBulk("Deleting", (r) => api(`${resource}/${encodeURIComponent(r.id)}`, { method: "DELETE" }));
  };
  const bulkSet = () => {
    const f = bulkFields.find((x) => x.name === bulkField);
    if (!f || bulkValue === "") return;
    const v = f.type === "bool" ? bulkValue === "true" : bulkValue;
    runBulk(`Setting ${f.label}`, (r) => api(`${resource}/${encodeURIComponent(r.id)}`, { method: "PATCH", body: JSON.stringify({ ...writable(r), [f.name]: v }) }));
  };

  const exportCsv = async () => {
    setBusy("Preparing export…");
    try {
      const d = await api(query({ all: "1" }));
      const fields = def.fields.filter((f) => f.type !== "password");
      const csv = [
        fields.map((f) => csvCell(f.label)).join(","),
        ...d.rows.map((r: Row) => fields.map((f) => csvCell(/Cents$/.test(f.name) && r[f.name] != null ? r[f.name] / 100 : r[f.name])).join(",")),
      ].join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
      a.download = `${(title || def.label).toLowerCase().replace(/\W+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click(); URL.revokeObjectURL(a.href);
      flash(d.rows.length < d.total ? `Exported first ${d.rows.length} of ${d.total}` : `Exported ${d.rows.length}`);
    } catch (e: any) { setError(e.message); }
    setBusy(null);
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const canBulk = !!def.canDelete || bulkFields.length > 0;
  const bulkDef = bulkFields.find((f) => f.name === bulkField);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brandNavy">{title || def.label}</h1>
          <p className="text-xs text-gray-500">{total} record{total === 1 ? "" : "s"}{busy && <span className="ml-2 text-brandNavy font-bold">{busy}</span>}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2.5 rounded-xl border bg-white hover:bg-gray-50" aria-label="Refresh" title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
          <button onClick={exportCsv} disabled={!!busy} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border bg-white hover:bg-gray-50 text-sm font-bold disabled:opacity-50" title="Download this list as a spreadsheet (CSV)"><Download className="w-4 h-4" /> Export</button>
          {def.canCreate && (
            <button onClick={openNew} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brandNavy text-white text-sm font-extrabold hover:bg-brandNavy/90">
              <Plus className="w-4 h-4" /> Add {def.singular.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={`Search ${(title || def.label).toLowerCase()}…`} className="w-full pl-9 pr-9 py-2.5 rounded-xl border bg-white text-sm" />
          {q && <button type="button" onClick={() => { setQ(""); setPage(1); }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>}
        </label>
        {def.filters?.map((fl) => (
          <select key={fl.name} aria-label={`Filter by ${fl.name}`} value={filters[fl.name] || ""} onChange={(e) => { setFilters({ ...filters, [fl.name]: e.target.value }); setPage(1); }} className="px-3 py-2.5 rounded-xl border bg-white text-sm">
            <option value="">All {human(fl.name.replace(/([A-Z])/g, " $1"))}</option>
            {fl.options.map((o) => <option key={o} value={o}>{human(o)}</option>)}
          </select>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-brandNavy text-white text-sm">
          <span className="font-extrabold">{selected.size} selected</span>
          {bulkFields.length > 0 && (
            <>
              <span className="opacity-70">Set</span>
              <select aria-label="Field to change" value={bulkField} onChange={(e) => { setBulkField(e.target.value); setBulkValue(""); }} className="px-2 py-1.5 rounded-lg text-brandNavy text-sm">
                <option value="">— field —</option>
                {bulkFields.map((f) => <option key={f.name} value={f.name}>{f.label}</option>)}
              </select>
              {bulkDef && (
                <select aria-label="New value" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="px-2 py-1.5 rounded-lg text-brandNavy text-sm">
                  <option value="">— value —</option>
                  {bulkDef.type === "bool"
                    ? <><option value="true">Yes</option><option value="false">No</option></>
                    : bulkDef.options?.map((o) => <option key={o} value={o}>{human(o)}</option>)}
                </select>
              )}
              <button onClick={bulkSet} disabled={!bulkDef || bulkValue === "" || !!busy} className="px-3 py-1.5 rounded-lg bg-brandYellow text-brandNavy font-extrabold disabled:opacity-50">Apply</button>
            </>
          )}
          <span className="ml-auto" />
          {def.canDelete && <button onClick={bulkDelete} disabled={!!busy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 font-extrabold disabled:opacity-50"><Trash2 className="w-4 h-4" /> Delete selected</button>}
          <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg border border-white/40">Clear</button>
        </div>
      )}

      {error && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex justify-between gap-2"><span>{error}</span><button onClick={() => setError(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button></div>}

      <div className="bg-white rounded-2xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              {canBulk && <th className="pl-4 py-3 w-8"><input type="checkbox" aria-label="Select all on this page" checked={allOnPage} onChange={() => setSelected(allOnPage ? new Set() : new Set(rows.map((r) => r.id)))} /></th>}
              {cols.map((c) => <th key={c.name} className="px-4 py-3 font-bold">{c.label}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && <tr><td colSpan={cols.length + 2} className="px-4 py-10 text-center text-gray-500"><Loader2 className="w-5 h-5 animate-spin inline" /> Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={cols.length + 2} className="px-4 py-10 text-center text-gray-500">
                {q || Object.values(filters).some(Boolean) ? "No matches. Try a different search or filter." : "Nothing here yet."}
                {def.canCreate && !q && <> <button onClick={openNew} className="text-brandNavy font-bold underline">Add {def.singular.toLowerCase()}</button></>}
              </td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className={`border-t hover:bg-brandYellow/5 cursor-pointer ${selected.has(r.id) ? "bg-brandYellow/10" : ""}`} onClick={() => open({ ...r })}>
                {canBulk && <td className="pl-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label="Select row" checked={selected.has(r.id)} onChange={() => setSelected((s) => { const n = new Set(s); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); return n; })} /></td>}
                {cols.map((c) => <td key={c.name} className="px-4 py-3 align-middle"><Cell f={c} v={r[c.name]} /></td>)}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={(e) => { e.stopPropagation(); open({ ...r }); }} aria-label="Edit" title="Edit" className="p-1.5 rounded-lg text-brandNavy hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                  {def.canDelete && <button onClick={(e) => { e.stopPropagation(); remove(r); }} aria-label="Delete" title="Delete" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(1)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">First</button>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Previous</button>
          <label className="flex items-center gap-1">Page
            <input type="number" min={1} max={pages} value={page} onChange={(e) => setPage(Math.min(pages, Math.max(1, Number(e.target.value) || 1)))} className="w-16 px-2 py-1 rounded-lg border text-center" aria-label="Page number" />
            of {pages}</label>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Next</button>
          <button disabled={page >= pages} onClick={() => setPage(pages)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Last</button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={close}>
          <form role="dialog" aria-modal="true" aria-label={`Edit ${def.singular}`} onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between gap-2 px-6 py-4 border-b">
              <h2 className="font-black text-lg text-brandNavy">{editing.id ? `Edit ${def.singular.toLowerCase()}` : `New ${def.singular.toLowerCase()}`}{dirty && <span className="ml-2 text-xs font-bold text-amber-600">• unsaved</span>}</h2>
              <div className="flex items-center gap-1">
                {resource === "books" && editing.id && editing.slug && <a href={`/si/books/${editing.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-50" title="Open the shop page in a new tab"><ExternalLink className="w-3.5 h-3.5" /> View on site</a>}
                {def.canCreate && editing.id && <button type="button" onClick={duplicate} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-50" title="Start a new record with these details"><Copy className="w-3.5 h-3.5" /> Duplicate</button>}
                <button type="button" onClick={close} aria-label="Close" className="p-1.5"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {formError && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{formError}</div>}
              {def.fields.filter((f) => !(f.type === "readonly" && !editing.id)).map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-bold text-brandNavy mb-1">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
                  <Input f={f.lockOnEdit && editing.id ? { ...f, type: "readonly" } : f} value={editing[f.name]} options={optionSets[f.name]} onChange={(v) => setField(f.name, v)} />
                  {f.help && <p className="text-[11px] text-gray-500 mt-1">{f.help}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t flex items-center gap-2">
              {def.canDelete && editing.id && <button type="button" onClick={async () => { if (await remove(editing)) setEditing(null); }} className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-red-600 text-sm font-bold hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>}
              <span className="ml-auto" />
              <button type="button" onClick={close} className="px-4 py-2.5 rounded-xl border text-sm font-bold">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-brandNavy text-white text-sm font-extrabold disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div role="status" className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-green-700 text-white text-sm font-bold shadow-lg">{toast}</div>}
    </div>
  );
}
