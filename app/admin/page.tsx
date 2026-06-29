"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react";

type MenuItem = { name: string; desc: string; price: string; tag?: string };
type SiteData = {
  hero: { heading1: string; heading2: string; subtext: string };
  story: { p1: string; p2: string; p3: string };
  hours: { day: string; time: string }[];
  menu: { breakfast: MenuItem[]; lunch: MenuItem[]; drinks: MenuItem[] };
  contact: { address: string; phone: string };
};

const DEFAULT_DATA: SiteData = {
  hero: {
    heading1: "Where north",
    heading2: "meets south.",
    subtext: "Breakfast & brunch crafted with care, served in the heart of Tralee.",
  },
  story: {
    p1: "NorthSouth began as a simple idea — that the best meals are the ones shared slowly, over good coffee, in a room that feels like someone's home.",
    p2: "Nestled in the heart of Tralee on Russell Street, we opened our doors to serve the kind of food that reminds you where you are. Locally sourced, carefully prepared, served without ceremony.",
    p3: "From Kerry lamb to Kerrygold butter, we cook with what's around us. Every plate is an honest one.",
  },
  hours: [
    { day: "Monday", time: "8am – 4pm" },
    { day: "Tuesday", time: "8am – 4pm" },
    { day: "Wednesday", time: "8am – 4pm" },
    { day: "Thursday", time: "8am – 4pm" },
    { day: "Friday", time: "8am – 4pm" },
    { day: "Saturday", time: "9am – 4pm" },
    { day: "Sunday", time: "Closed" },
  ],
  menu: {
    breakfast: [
      { name: "The Full NorthSouth", desc: "Two eggs your way, back rashers, sausage, black & white pudding, grilled tomato, mushrooms, sourdough toast", price: "€14.50", tag: "House favourite" },
      { name: "Eggs Benedict", desc: "Poached eggs, smoked Irish salmon, hollandaise, toasted brioche muffin", price: "€13.00" },
      { name: "Avocado & Poached Eggs", desc: "Smashed avocado, two poached eggs, dukkah, chilli flakes, sourdough", price: "€12.50", tag: "Vegetarian" },
      { name: "French Toast", desc: "Brioche, maple syrup, fresh strawberries, whipped cream, powdered sugar", price: "€11.50" },
      { name: "Smoked Salmon Bagel", desc: "Cream cheese, capers, red onion, lemon, toasted sesame bagel", price: "€12.00" },
      { name: "Kerry Porridge", desc: "Oat porridge with Kerrygold butter, honey, mixed seeds, seasonal fruit", price: "€7.50", tag: "Vegan option" },
    ],
    lunch: [
      { name: "Kerry Lamb Sandwich", desc: "Slow-roast Kerry lamb, wholegrain mustard, rocket, red onion jam, toasted focaccia", price: "€13.50", tag: "Local produce" },
      { name: "BLT Club", desc: "Smoked back bacon, gem lettuce, vine tomato, mayo, toasted white sourdough", price: "€12.00" },
      { name: "Soup of the Day", desc: "Homemade seasonal soup, crusty brown bread, Kerrygold butter", price: "€8.00" },
      { name: "Caesar Salad", desc: "Baby cos, crispy pancetta, parmesan shavings, anchovies, house dressing, croutons", price: "€12.50" },
      { name: "Grilled Chicken Wrap", desc: "Marinated chicken, roasted peppers, guacamole, sour cream, flour tortilla", price: "€12.00" },
      { name: "Quiche of the Day", desc: "Homemade quiche, side salad, house pickles", price: "€11.00" },
    ],
    drinks: [
      { name: "Flat White", desc: "Double ristretto, micro-foam steamed milk", price: "€3.80" },
      { name: "Specialty Latte", desc: "Ask about today's seasonal flavour", price: "€4.20", tag: "Ask us" },
      { name: "Cold Brew", desc: "12-hour slow-steeped, served over ice", price: "€4.50" },
      { name: "Kerry Gold Tea", desc: "Loose-leaf blend, served with brown bread scone", price: "€3.50" },
      { name: "Fresh Juice", desc: "Orange, apple, or the daily blend", price: "€4.00" },
      { name: "House Smoothie", desc: "Banana, oat milk, almond butter, honey, maca", price: "€6.00", tag: "Energising" },
    ],
  },
  contact: {
    address: "12 Russell St, Tralee, Co. Kerry, V92 W265",
    phone: "(066) 717 1277",
  },
};

type Section = "hero" | "story" | "hours" | "menu" | "contact";

function SectionHeader({ title, open, toggle }: { title: string; open: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between py-4 px-6 bg-[#1a1510] text-white rounded-xl hover:bg-[#2a2018] transition-colors group"
    >
      <span className="font-display text-xl">{title}</span>
      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronDown size={18} className="text-[#c8864a]" />
      </motion.div>
    </button>
  );
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9890] mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#f8f5f0] border border-[#1a1510]/15 rounded-lg px-4 py-3 text-[#1a1510] text-sm leading-relaxed resize-none focus:outline-none focus:border-[#c8864a] transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#f8f5f0] border border-[#1a1510]/15 rounded-lg px-4 py-3 text-[#1a1510] text-sm focus:outline-none focus:border-[#c8864a] transition-colors"
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [openSection, setOpenSection] = useState<Section | null>("hero");
  const [saved, setSaved] = useState(false);
  const [activeMenuCat, setActiveMenuCat] = useState<"breakfast" | "lunch" | "drinks">("breakfast");

  useEffect(() => {
    const stored = localStorage.getItem("ns_cms_data");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch {}
    }
    const a = sessionStorage.getItem("ns_cms_auth");
    if (a === "ok") setAuthed(true);
  }, []);

  const handleAuth = () => {
    if (password === "northsouth2024") {
      setAuthed(true);
      sessionStorage.setItem("ns_cms_auth", "ok");
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const save = () => {
    localStorage.setItem("ns_cms_data", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggle = (s: Section) => setOpenSection(openSection === s ? null : s);

  const updateHero = (key: keyof SiteData["hero"], val: string) =>
    setData((d) => ({ ...d, hero: { ...d.hero, [key]: val } }));

  const updateStory = (key: keyof SiteData["story"], val: string) =>
    setData((d) => ({ ...d, story: { ...d.story, [key]: val } }));

  const updateHour = (i: number, val: string) => {
    const hours = [...data.hours];
    hours[i] = { ...hours[i], time: val };
    setData((d) => ({ ...d, hours }));
  };

  const updateMenuItem = (cat: "breakfast" | "lunch" | "drinks", i: number, key: keyof MenuItem, val: string) => {
    const items = [...data.menu[cat]];
    items[i] = { ...items[i], [key]: val };
    setData((d) => ({ ...d, menu: { ...d.menu, [cat]: items } }));
  };

  const addMenuItem = (cat: "breakfast" | "lunch" | "drinks") => {
    setData((d) => ({
      ...d,
      menu: {
        ...d.menu,
        [cat]: [...d.menu[cat], { name: "", desc: "", price: "" }],
      },
    }));
  };

  const removeMenuItem = (cat: "breakfast" | "lunch" | "drinks", i: number) => {
    setData((d) => ({
      ...d,
      menu: { ...d.menu, [cat]: d.menu[cat].filter((_, idx) => idx !== i) },
    }));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1a1510] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#f8f5f0] rounded-2xl p-8 md:p-12 w-full max-w-sm shadow-2xl"
        >
          <div className="font-display text-3xl text-[#1a1510] mb-1">NorthSouth</div>
          <div className="text-xs tracking-[0.2em] uppercase text-[#9e9890] mb-8">CMS · Admin</div>

          <div className="mb-5">
            <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9890] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className={`w-full bg-white border rounded-lg px-4 py-3 text-[#1a1510] text-sm focus:outline-none transition-all ${
                authError ? "border-red-400 shake" : "border-[#1a1510]/15 focus:border-[#c8864a]"
              }`}
              placeholder="Enter admin password"
            />
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-xs"
                >
                  <AlertCircle size={12} /> Incorrect password
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleAuth}
            className="w-full bg-[#c8864a] text-white py-3 rounded-lg text-sm tracking-[0.15em] uppercase hover:bg-[#b87840] transition-colors"
          >
            Enter CMS
          </button>

          <p className="text-center text-[#9e9890] text-xs mt-6">
            Demo password: <code className="text-[#c8864a]">northsouth2024</code>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede8e0]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#1a1510] text-white px-6 md:px-10 py-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="font-display text-xl">NorthSouth CMS</span>
          <span className="ml-3 text-[#9e9890] text-xs tracking-widest hidden sm:inline">Content Manager</span>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors border border-white/15 px-4 py-2 rounded-full"
          >
            <Eye size={13} /> Preview
          </a>
          <button
            onClick={save}
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase bg-[#c8864a] text-white px-5 py-2 rounded-full hover:bg-[#b87840] transition-all"
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Check size={13} /> Saved!
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Save size={13} /> Save
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 space-y-4">
        {/* Hero section */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <SectionHeader title="Hero Section" open={openSection === "hero"} toggle={() => toggle("hero")} />
          <AnimatePresence initial={false}>
            {openSection === "hero" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6 space-y-4">
                  <Field label="Heading Line 1" value={data.hero.heading1} onChange={(v) => updateHero("heading1", v)} />
                  <Field label="Heading Line 2" value={data.hero.heading2} onChange={(v) => updateHero("heading2", v)} />
                  <Field label="Subtext" value={data.hero.subtext} onChange={(v) => updateHero("subtext", v)} textarea />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Story section */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <SectionHeader title="Our Story" open={openSection === "story"} toggle={() => toggle("story")} />
          <AnimatePresence initial={false}>
            {openSection === "story" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6 space-y-4">
                  <Field label="Paragraph 1" value={data.story.p1} onChange={(v) => updateStory("p1", v)} textarea />
                  <Field label="Paragraph 2" value={data.story.p2} onChange={(v) => updateStory("p2", v)} textarea />
                  <Field label="Paragraph 3" value={data.story.p3} onChange={(v) => updateStory("p3", v)} textarea />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hours */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <SectionHeader title="Opening Hours" open={openSection === "hours"} toggle={() => toggle("hours")} />
          <AnimatePresence initial={false}>
            {openSection === "hours" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6 space-y-3">
                  {data.hours.map((h, i) => (
                    <div key={h.day} className="flex items-center gap-4">
                      <span className="text-sm text-[#1a1510] w-24 shrink-0">{h.day}</span>
                      <input
                        type="text"
                        value={h.time}
                        onChange={(e) => updateHour(i, e.target.value)}
                        className="flex-1 bg-[#f8f5f0] border border-[#1a1510]/15 rounded-lg px-4 py-2.5 text-sm text-[#1a1510] focus:outline-none focus:border-[#c8864a] transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <SectionHeader title="Menu Items" open={openSection === "menu"} toggle={() => toggle("menu")} />
          <AnimatePresence initial={false}>
            {openSection === "menu" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6">
                  {/* Category tabs */}
                  <div className="flex gap-1 mb-6 border-b border-[#1a1510]/10">
                    {(["breakfast", "lunch", "drinks"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveMenuCat(cat)}
                        className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors relative ${
                          activeMenuCat === cat ? "text-[#1a1510]" : "text-[#9e9890] hover:text-[#1a1510]"
                        }`}
                      >
                        {cat}
                        {activeMenuCat === cat && (
                          <motion.div layoutId="cms-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8864a]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {data.menu[activeMenuCat].map((item, i) => (
                      <div key={i} className="relative border border-[#1a1510]/10 rounded-xl p-5">
                        <button
                          onClick={() => removeMenuItem(activeMenuCat, i)}
                          className="absolute top-3 right-3 text-[#9e9890] hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 sm:col-span-1">
                            <Field label="Name" value={item.name} onChange={(v) => updateMenuItem(activeMenuCat, i, "name", v)} />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <Field label="Price" value={item.price} onChange={(v) => updateMenuItem(activeMenuCat, i, "price", v)} />
                          </div>
                          <div className="col-span-2">
                            <Field label="Description" value={item.desc} onChange={(v) => updateMenuItem(activeMenuCat, i, "desc", v)} textarea />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <Field label="Tag (optional)" value={item.tag || ""} onChange={(v) => updateMenuItem(activeMenuCat, i, "tag", v)} />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addMenuItem(activeMenuCat)}
                      className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c8864a] border border-[#c8864a]/40 px-5 py-3 rounded-lg hover:bg-[#c8864a]/5 transition-colors w-full justify-center"
                    >
                      <Plus size={14} /> Add item
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <SectionHeader title="Contact Info" open={openSection === "contact"} toggle={() => toggle("contact")} />
          <AnimatePresence initial={false}>
            {openSection === "contact" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6 space-y-4">
                  <Field label="Address" value={data.contact.address} onChange={(v) => setData((d) => ({ ...d, contact: { ...d.contact, address: v } }))} />
                  <Field label="Phone" value={data.contact.phone} onChange={(v) => setData((d) => ({ ...d, contact: { ...d.contact, phone: v } }))} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[#9e9890] text-xs pt-4 pb-8">
          Changes are saved to local storage and reflected on the live site instantly after saving.
        </p>
      </div>
    </div>
  );
}
