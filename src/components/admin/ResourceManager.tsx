"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Trash2, Upload, ChevronUp, ChevronDown, Loader2, RefreshCw } from "lucide-react";
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
    default: return <input className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

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
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [optionSets, setOptionSets] = useState<Record<string, { value: string; label: string }[]>>({});

  const cols = useMemo(() => def.fields.filter((f) => f.list), [def]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const sp = new URLSearchParams({ page: String(page) });
    if (q) sp.set("q", q);
    Object.entries(filters).forEach(([k, v]) => v && sp.set(`f.${k}`, v));
    try {
      const d = await api(`${resource}?${sp}`);
      setRows(d.rows); setTotal(d.total); setPageSize(d.pageSize);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }, [resource, page, q, filters]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  useEffect(() => {
    def.fields.filter((f) => f.optionsFrom).forEach(async (f) => {
      try {
        const d = await api(`${f.optionsFrom}?all=1`);
        setOptionSets((s) => ({ ...s, [f.name]: d.rows.map((r: Row) => ({ value: r.slug, label: `${r.nameEn} — ${r.nameSi}` })) }));
      } catch { /* optional */ }
    });
  }, [def]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const body = Object.fromEntries(def.fields.filter((f) => f.type !== "readonly").map((f) => [f.name, editing[f.name]]));
      if (editing.id) await api(`${resource}/${encodeURIComponent(editing.id)}`, { method: "PATCH", body: JSON.stringify(body) });
      else await api(resource, { method: "POST", body: JSON.stringify(body) });
      setEditing(null); flash(`${def.singular} saved`); load();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete this ${def.singular.toLowerCase()}? This cannot be undone from the panel.`)) return;
    try { await api(`${resource}/${encodeURIComponent(row.id)}`, { method: "DELETE" }); flash("Deleted"); load(); }
    catch (e: any) { setError(e.message); }
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brandNavy">{title || def.label}</h1>
          <p className="text-xs text-gray-500">{total} record{total === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2.5 rounded-xl border bg-white hover:bg-gray-50" aria-label="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
          {def.canCreate && (
            <button onClick={() => setEditing({ ...Object.fromEntries(def.fields.map((f) => [f.name, f.type === "bool" ? true : f.type === "images" ? [] : ""])), ...defaults })} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brandNavy text-white text-sm font-extrabold hover:bg-brandNavy/90">
              <Plus className="w-4 h-4" /> Add {def.singular.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={`Search ${(title || def.label).toLowerCase()}…`} className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm" />
        </label>
        {def.filters?.map((fl) => (
          <select key={fl.name} aria-label={`Filter by ${fl.name}`} value={filters[fl.name] || ""} onChange={(e) => { setFilters({ ...filters, [fl.name]: e.target.value }); setPage(1); }} className="px-3 py-2.5 rounded-xl border bg-white text-sm">
            <option value="">All {human(fl.name.replace(/([A-Z])/g, " $1"))}</option>
            {fl.options.map((o) => <option key={o} value={o}>{human(o)}</option>)}
          </select>
        ))}
      </div>

      {error && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500">
            <tr>{cols.map((c) => <th key={c.name} className="px-4 py-3 font-bold">{c.label}</th>)}<th className="px-4 py-3" /></tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && <tr><td colSpan={cols.length + 1} className="px-4 py-10 text-center text-gray-500">Nothing here yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-brandYellow/5 cursor-pointer" onClick={() => setEditing({ ...r })}>
                {cols.map((c) => <td key={c.name} className="px-4 py-3 align-middle"><Cell f={c} v={r[c.name]} /></td>)}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {def.canDelete && <button onClick={(e) => { e.stopPropagation(); remove(r); }} aria-label="Delete" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Previous</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-40">Next</button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setEditing(null)}>
          <form role="dialog" aria-modal="true" aria-label={`Edit ${def.singular}`} onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-black text-lg text-brandNavy">{editing.id ? `Edit ${def.singular.toLowerCase()}` : `New ${def.singular.toLowerCase()}`}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {def.fields.filter((f) => !(f.type === "readonly" && !editing.id)).map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-bold text-brandNavy mb-1">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
                  <Input f={f} value={editing[f.name]} options={optionSets[f.name]} onChange={(v) => setEditing((s) => ({ ...s!, [f.name]: v }))} />
                  {f.help && <p className="text-[11px] text-gray-500 mt-1">{f.help}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl border text-sm font-bold">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-brandNavy text-white text-sm font-extrabold disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div role="status" className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-green-700 text-white text-sm font-bold shadow-lg">{toast}</div>}
    </div>
  );
}
