"use client";
import { useState } from "react";
import { Save, Plus, Trash2, LogOut, Coffee, MapPin, Clock, Menu as MenuIcon, Eye, EyeOff } from "lucide-react";

interface MenuItem { id: string; name: string; description: string; price: string; tags: string[]; }
interface Category { id: string; name: string; items: MenuItem[]; }
interface Location { id: string; name: string; address: string; eircode: string; handle: string; slug: string; images: string[]; }
interface Hours { [key: string]: { open: string; close: string } }
interface ContentData { site: { name: string; tagline: string; instagram: string; email: string }; hours: Hours; locations: Location[]; menu: { categories: Category[] }; }

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const DAY_LABELS: Record<string,string> = { monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday" };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<ContentData | null>(null);
  const [tab, setTab] = useState<"menu"|"hours"|"locations"|"site">("menu");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cat, setCat] = useState(0);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/content", { headers: { "x-admin-password": password } });
    if (res.status === 401) { setAuthError("Incorrect password."); return; }
    setData(await res.json()); setAuthed(true);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const updateItem = (ci: number, ii: number, f: keyof MenuItem, v: string) => {
    if (!data) return;
    const n = JSON.parse(JSON.stringify(data)) as ContentData;
    (n.menu.categories[ci].items[ii] as unknown as Record<string,unknown>)[f] = v;
    setData(n);
  };

  const addItem = (ci: number) => {
    if (!data) return;
    const n = JSON.parse(JSON.stringify(data)) as ContentData;
    n.menu.categories[ci].items.push({ id: Date.now().toString(), name: "New item", description: "", price: "0.00", tags: [] });
    setData(n);
  };

  const removeItem = (ci: number, ii: number) => {
    if (!data) return;
    const n = JSON.parse(JSON.stringify(data)) as ContentData;
    n.menu.categories[ci].items.splice(ii, 1); setData(n);
  };

  const updateHours = (day: string, f: "open"|"close", v: string) => {
    if (!data) return;
    const n = JSON.parse(JSON.stringify(data)) as ContentData;
    n.hours[day][f] = v; setData(n);
  };

  const updateLoc = (i: number, f: string, v: string) => {
    if (!data) return;
    const n = JSON.parse(JSON.stringify(data)) as ContentData;
    (n.locations[i] as unknown as Record<string,unknown>)[f] = v; setData(n);
  };

  if (!authed) return (
    <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <svg width="48" height="48" viewBox="0 0 120 120" fill="none" className="mx-auto mb-4">
            <circle cx="72" cy="36" r="28" fill="#F2B8C6" stroke="#1B2A5E" strokeWidth="6"/>
            <circle cx="50" cy="64" r="34" fill="none" stroke="#1B2A5E" strokeWidth="6"/>
            <path d="M28 72 Q44 50 60 68 Q76 86 92 64" stroke="#5ABFC0" strokeWidth="8" strokeLinecap="round" fill="none"/>
          </svg>
          <h1 className="text-[#1B2A5E] font-bold text-xl">Some Dose</h1>
          <p className="text-[#1B2A5E]/40 text-sm mt-1">Staff Portal</p>
        </div>
        <form onSubmit={login} className="bg-white rounded-2xl border border-[#1B2A5E]/08 p-8 shadow-xl">
          <label className="block text-[#1B2A5E] text-sm font-semibold mb-2">Password</label>
          <div className="relative mb-5">
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#1B2A5E]/15 rounded-xl px-4 py-3 text-[#1B2A5E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/40" placeholder="Enter staff password" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B2A5E]/30">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          {authError && <p className="text-red-500 text-xs mb-4">{authError}</p>}
          <button type="submit" className="w-full bg-[#1B2A5E] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#5ABFC0] transition-colors">Sign in</button>
        </form>
      </div>
    </div>
  );

  if (!data) return <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-[#5ABFC0] border-t-transparent animate-spin" /></div>;

  const tabs = [{id:"menu" as const,label:"Menu",icon:MenuIcon},{id:"hours" as const,label:"Hours",icon:Clock},{id:"locations" as const,label:"Locations",icon:MapPin},{id:"site" as const,label:"Site",icon:Coffee}];

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      <header className="bg-white border-b border-[#1B2A5E]/08 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[#1B2A5E] font-bold text-sm">Some Dose CMS</span>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-[#1B2A5E]/40 text-xs hover:text-[#5ABFC0]">View site</a>
            <button onClick={save} disabled={saving} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#1B2A5E] text-white hover:bg-[#5ABFC0]"}`}><Save className="w-4 h-4" />{saving ? "Saving..." : saved ? "Saved!" : "Save"}</button>
            <button onClick={() => { setAuthed(false); setPassword(""); }} className="text-[#1B2A5E]/30 hover:text-[#1B2A5E]"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-[#1B2A5E]/08 w-fit">
          {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.id ? "bg-[#1B2A5E] text-white" : "text-[#1B2A5E]/50 hover:text-[#1B2A5E]"}`}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        {tab==="menu" && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">{data.menu.categories.map((c,i) => <button key={c.id} onClick={() => setCat(i)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${cat===i ? "bg-[#1B2A5E] text-white" : "bg-white text-[#1B2A5E]/60 border border-[#1B2A5E]/10"}`}>{c.name}</button>)}</div>
            <div className="flex flex-col gap-3">
              {data.menu.categories[cat]?.items.map((item,ii) => (
                <div key={item.id} className="bg-white rounded-2xl border border-[#1B2A5E]/08 p-5 grid md:grid-cols-4 gap-4">
                  <div><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/40 block mb-1">Name</label><input value={item.name} onChange={e => updateItem(cat,ii,"name",e.target.value)} className="w-full border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>
                  <div className="md:col-span-2"><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/40 block mb-1">Description</label><input value={item.description} onChange={e => updateItem(cat,ii,"description",e.target.value)} className="w-full border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>
                  <div className="flex gap-2 items-end"><div className="flex-1"><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/40 block mb-1">Price</label><input value={item.price} onChange={e => updateItem(cat,ii,"price",e.target.value)} className="w-full border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div><button onClick={() => removeItem(cat,ii)} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                </div>
              ))}
              <button onClick={() => addItem(cat)} className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#1B2A5E]/15 text-[#1B2A5E]/40 hover:border-[#5ABFC0]/50 hover:text-[#5ABFC0] transition-all text-sm"><Plus className="w-4 h-4" /> Add item</button>
            </div>
          </div>
        )}
        {tab==="hours" && (
          <div className="bg-white rounded-2xl border border-[#1B2A5E]/08 overflow-hidden">
            {DAYS.map((day,i) => (
              <div key={day} className={`flex items-center gap-6 px-6 py-4 ${i<DAYS.length-1?"border-b border-[#1B2A5E]/05":""}`}>
                <span className="text-[#1B2A5E] font-medium text-sm w-28">{DAY_LABELS[day]}</span>
                <div className="flex items-center gap-3">
                  <div><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/30 block mb-1">Opens</label><input value={data.hours[day]?.open??""} onChange={e => updateHours(day,"open",e.target.value)} className="border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] w-32 focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>
                  <span className="text-[#1B2A5E]/30 mt-5">-</span>
                  <div><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/30 block mb-1">Closes</label><input value={data.hours[day]?.close??""} onChange={e => updateHours(day,"close",e.target.value)} className="border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] w-32 focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="locations" && (
          <div className="flex flex-col gap-4">
            {data.locations.map((loc,i) => (
              <div key={loc.id} className="bg-white rounded-2xl border border-[#1B2A5E]/08 p-6">
                <h3 className="text-[#1B2A5E] font-bold text-sm mb-4">{loc.name}</h3>
                <div className="grid md:grid-cols-3 gap-4">{(["name","address","eircode","handle"] as const).map(f => <div key={f}><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/40 block mb-1 capitalize">{f}</label><input value={(loc as unknown as Record<string,unknown>)[f] as string} onChange={e => updateLoc(i,f,e.target.value)} className="w-full border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>)}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="site" && (
          <div className="bg-white rounded-2xl border border-[#1B2A5E]/08 p-6">
            <div className="grid md:grid-cols-2 gap-4">{(["name","tagline","instagram","email"] as const).map(f => <div key={f}><label className="text-[9px] uppercase tracking-widest text-[#1B2A5E]/40 block mb-1 capitalize">{f}</label><input value={data.site[f]} onChange={e => { const n=JSON.parse(JSON.stringify(data)) as ContentData; n.site[f]=e.target.value; setData(n); }} className="w-full border border-[#1B2A5E]/12 rounded-lg px-3 py-2 text-sm text-[#1B2A5E] focus:outline-none focus:ring-2 focus:ring-[#5ABFC0]/30" /></div>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
