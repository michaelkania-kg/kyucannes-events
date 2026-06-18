import { useState, useMemo } from "react";
import { MapPin, Clock, Users, PartyPopper, Utensils, Sparkles, Coffee, Award, Sun, ExternalLink, Palmtree, Star, Presentation, Mail, Mic, Wine } from "lucide-react";

const SERIF = "ui-serif, Georgia, 'Times New Roman', serif";
const FESTIVAL = { location: "Cannes, France" };
const companiesOf = (e) => (Array.isArray(e.companies) ? e.companies : [e.company]).filter(Boolean);

const DAYS = [
  { key: "mon", label: "Mon", date: "22 Jun" },
  { key: "tue", label: "Tue", date: "23 Jun" },
  { key: "wed", label: "Wed", date: "24 Jun" },
  { key: "thu", label: "Thu", date: "25 Jun" },
  { key: "fri", label: "Fri", date: "26 Jun" },
];

const COMPANIES = [
  { name: "Kepler", color: "#7B3FE4" },
  { name: "Sid Lee", color: "#111111" },
  { name: "kyu", color: "#C99A2B" },
  { name: "HDY", color: "#C8102E" },
  { name: "GhostNote", color: "#1F3A93" },
  { name: "IDEO", color: "#E4002B" },
  { name: "SYPartners", color: "#E8842B" },
  { name: "Public Digital", color: "#0E7C9B" },
  { name: "Gehl", color: "#2E8B57" },
  { name: "BEworks", color: "#00A6A6" },
  { name: "C2", color: "#FF5A5F" },
  { name: "Godfrey Dadich", color: "#1A1A40" },
];
const FALLBACK_PALETTE = ["#E76F51", "#2A9D8F", "#E9C46A", "#264653", "#9B5DE5", "#1CA9C9", "#F15BB5", "#8338EC"];
function colorFor(name) {
  const known = COMPANIES.find((c) => c.name.toLowerCase() === (name || "").toLowerCase());
  if (known) return known.color;
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) % FALLBACK_PALETTE.length;
  return FALLBACK_PALETTE[h];
}

const TYPES = {
  panel: { label: "Panel", icon: Users },
  reception: { label: "Reception", icon: Wine },
  showcase: { label: "Work Showcase", icon: Presentation },
  party: { label: "Party", icon: PartyPopper },
  dinner: { label: "Dinner", icon: Utensils },
  breakfast: { label: "Networking", icon: Coffee },
  activation: { label: "Activation", icon: Sparkles },
  award: { label: "Award", icon: Award },
};

const SEED = [
  { id: "e1", day: "mon", sort: 660, time: "11:00–11:30 AM", company: "Kepler", host: "Equativ Yacht Panel", title: "Creative at the Speed of Performance", who: "Camm Rowland", venue: "Equativ Yacht", notes: "", type: "panel", link: "https://equativatcannes.com/" },
  { id: "e14", day: "mon", sort: 660, time: "11:00–11:45 AM", company: "Kepler", host: "TikTok Terrace x Inkwell", title: "Both Sides of the Table", who: "Remy Stiles", venue: "TikTok Terrace", notes: "", type: "panel", link: "" },
  { id: "e13", day: "mon", sort: 720, time: "12:00–12:30 PM", company: "GhostNote", host: "The Ownership Revolution: Building Cultural Equity with the NBPA", title: "", who: "Jaylen Brown, David Kelly, Trey Murphy III & Cari Champion", venue: "Sport Beach — Main Stage", notes: "GhostNote work showcase", type: "showcase", link: "" },
  { id: "e2", day: "mon", sort: 721, time: "12:00–12:30 PM", company: "Kepler", host: "Brands & Culture Villa", title: "", who: "TBD", venue: "13 Avenue de Benefiat", notes: "TBD", type: "panel", link: "https://www.brandsnculture.com/bc-cannes/partner-event-mon-22/" },
  { id: "e4", day: "mon", sort: 810, time: "1:30–2:00 PM", company: "Kepler", host: "Brands & Culture Villa", title: "Marketing at Cruising Altitude", who: "Jess Haley, Gabriella Neudecker & Isabella Benayoun", venue: "13 Avenue de Benefiat", notes: "kyu moderator", type: "panel", link: "https://www.brandsnculture.com/bc-cannes/partner-event-mon-22/" },
  { id: "e5", day: "tue", sort: 975, time: "4:15–5:00 PM", companies: ["Kepler", "Sid Lee"], host: "World Woman Foundation", title: "Culture as Currency: Building Brands That Shape Society", who: "Remy Stiles & Marie-Lise Campeau", venue: "Hôtel Splendid Cannes, 4–6 Rue Félix Faure", notes: "", type: "panel", link: "https://www.worldwomanfoundation.com/festivaldecannes2026/register/" },
  { id: "e6", day: "tue", sort: 1290, time: "9:30 PM", company: "HDY", host: "HDY Reception", title: "", who: "", venue: "TBD", notes: "", type: "reception", link: "" },
  { id: "e7", day: "wed", sort: 600, time: "10:00–11:00 AM", company: "Kepler", host: "LinkedIn Beach Panel", title: "What the Best B2B Marketers Will Do Differently in the Next Three Years", who: "Remy Stiles", venue: "LinkedIn Beach", notes: "More information to come", type: "panel", link: "" },
  { id: "e8", day: "wed", sort: 630, time: "10:30–11:00 AM", company: "Kepler", host: "Amazon Content Studio", title: "Case Study", who: "Toby Hack · easyJet", venue: "Amazon Port", notes: "Closed fireside chat", type: "panel", link: "" },
  { id: "e9", day: "wed", sort: 660, time: "11:00–11:30 AM", company: "Kepler", host: "RTL Beach", title: "The future of brand growth in a fragmented, AI-driven media landscape", who: "Gabriella Neudecker (easyJet) speaking", venue: "CBeach, Boulevard de la Croisette", notes: "", type: "panel", link: "https://rtl-adalliance.com/rtlbeach/programme" },
  { id: "e10", day: "wed", sort: 810, time: "1:30–3:30 PM", company: "kyu", host: "kyu House: Cannes", title: "Lunch / Networking", who: "", venue: "Mondrian Cannes", notes: "", type: "breakfast", link: "https://luma.com/h6s2wzmp" },
  { id: "e11", day: "wed", sort: 1200, time: "8:00 PM", company: "Sid Lee", host: "Private Dinner", title: "Dinner / Networking", who: "", venue: "Glance & InMobi space", notes: "", type: "dinner", link: "" },
  { id: "e12", day: "thu", sort: 900, time: "3:00–3:30 PM", company: "Sid Lee", host: "AdForum MyLions", title: "Private Discussion", who: "", venue: "The Impact Hub — back of the Debussy Theatre hall, inside the Palais des Festivals", notes: "", type: "panel", link: "" },
];

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function App() {
  const [activeCompany, setActiveCompany] = useState("all");

  const allEvents = SEED;
  const companiesPresent = useMemo(() => Array.from(new Set(allEvents.flatMap(companiesOf))).sort(), [allEvents]);
  const visible = useMemo(() => allEvents.filter((e) => activeCompany === "all" || companiesOf(e).includes(activeCompany)), [allEvents, activeCompany]);

  const byDay = useMemo(() => {
    const g = Object.fromEntries(DAYS.map((d) => [d.key, []]));
    visible.forEach((e) => { if (g[e.day]) g[e.day].push(e); });
    Object.values(g).forEach((arr) => arr.sort((a, b) => (a.sort ?? 9999) - (b.sort ?? 9999)));
    return g;
  }, [visible]);

  return (
    <div className="min-h-screen w-full" style={{ background: "radial-gradient(1100px 460px at 78% -120px, rgba(244,183,64,0.22), transparent), linear-gradient(180deg,#FBF6EC, #F7EFE0)", fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif", color: "#2A2118" }}>
      <style>{`
        @keyframes heroShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .hero-anim{background-size:200% 200%;animation:heroShift 20s ease-in-out infinite}
        .grain{position:absolute;inset:0;background-image:${GRAIN};background-size:160px 160px;opacity:.09;mix-blend-mode:overlay;pointer-events:none}
        .evt-card{transition:transform .18s ease, box-shadow .18s ease}
        .evt-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px -12px rgba(20,40,60,.35)}
        .glass{background:rgba(255,255,255,.16);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.28)}
        .fade-up{animation:fadeUp .5s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      `}</style>

      <header className="relative overflow-hidden text-white hero-anim" style={{ background: "linear-gradient(155deg,#08415C 0%,#0E7C9B 24%,#1CA9C9 40%,#E8825A 72%,#F4B740 100%)" }}>
        <div className="grain" />
        <div className="absolute -right-10 -top-10 opacity-30"><Sun size={170} strokeWidth={0.7} /></div>
        <Palmtree className="absolute left-1 -bottom-3 opacity-15" size={96} strokeWidth={1} style={{ transform: "rotate(-8deg)" }} />
        <Palmtree className="absolute right-6 -bottom-4 opacity-12" size={80} strokeWidth={1} style={{ transform: "scaleX(-1) rotate(-6deg)" }} />
        <div className="relative max-w-6xl mx-auto px-5 pt-5 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase" style={{ opacity: 0.95 }}>
            <Star size={11} fill="#FCE9B8" stroke="#FCE9B8" />
            <span style={{ fontWeight: 800 }}>kyu</span><span style={{ opacity: 0.55 }}>collective</span>
            <span style={{ opacity: 0.45 }}>×</span><span>Cannes Lions</span>
          </div>
          <h1 className="mt-1.5 flex flex-wrap items-baseline gap-x-3" style={{ fontFamily: SERIF }}>
            <span className="text-3xl sm:text-5xl font-medium tracking-tight" style={{ textShadow: "0 2px 18px rgba(0,0,0,.18)" }}>Cannes Lions</span>
            <span className="text-2xl sm:text-4xl font-light italic" style={{ color: "#FCE9B8" }}>2026</span>
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"><Sun size={12} /> 22–26 June</span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"><MapPin size={12} /> {FESTIVAL.location}</span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"><Sparkles size={12} /> {allEvents.length} moments · {companiesPresent.length} companies</span>
          </div>
        </div>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#F4B740,#E8825A 45%,#1CA9C9)" }} />
      </header>

      <section className="px-5 mt-4 max-w-6xl mx-auto">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#A9874A" }}>Filter by company</div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {[{ v: "all", l: "All companies" }, ...companiesPresent.map((c) => ({ v: c, l: c, color: colorFor(c) }))].map((o) => {
            const active = activeCompany === o.v;
            return (
              <button key={o.v} onClick={() => setActiveCompany(o.v)}
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium border transition active:scale-95"
                style={{ background: active ? (o.color || "#08415C") : "rgba(255,255,255,.7)", color: active ? "#fff" : "#5A4A33", borderColor: active ? (o.color || "#08415C") : "#E7DcC6", boxShadow: active ? "0 6px 16px -8px rgba(0,0,0,.4)" : "none" }}>
                {o.color && !active && <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: o.color }} />}
                {o.l}
              </button>
            );
          })}
        </div>
      </section>

      <main className="mt-4">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
            {DAYS.map((d, di) => (
              <div key={d.key} className="snap-start shrink-0 sm:flex-1 fade-up" style={{ width: 240, minWidth: 200, animationDelay: `${di * 60}ms` }}>
                <div className="rounded-t-2xl px-3 py-2 text-white flex items-center justify-between" style={{ background: "linear-gradient(135deg,#08415C,#0E7C9B)" }}>
                  <div className="leading-tight">
                    <div className="font-semibold text-base" style={{ fontFamily: SERIF }}>{d.label}</div>
                    <div className="text-xs" style={{ opacity: 0.8 }}>{d.date}</div>
                  </div>
                  <span className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center" style={{ background: "rgba(255,255,255,.18)" }}>{byDay[d.key].length}</span>
                </div>
                <div className="rounded-b-2xl border border-t-0 p-2 min-h-[150px]" style={{ borderColor: "#EEE2CC", background: "rgba(255,255,255,.65)" }}>
                  <div className="space-y-2.5">
                    {byDay[d.key].length === 0 ? <div className="text-center text-xs py-8" style={{ color: "#CDBFA6" }}>— no moments —</div> : byDay[d.key].map((e) => <MiniCard key={e.id} e={e} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 sm:hidden" style={{ color: "#B7A789" }}>Swipe sideways to see the full week →</p>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-5 mt-8 pb-16">
        <div className="rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ borderColor: "#EADFC8", background: "rgba(255,255,255,.72)" }}>
          <div className="rounded-full p-3 text-white shrink-0" style={{ background: "linear-gradient(135deg,#E8825A,#F4B740)" }}><Mail size={20} /></div>
          <div className="flex-1">
            <div className="font-semibold" style={{ fontFamily: SERIF, fontSize: "17px", color: "#231C12" }}>Have a moment to add?</div>
            <div className="text-sm mt-0.5" style={{ color: "#6B5B3E" }}>To get an event on the schedule, reach out to <span className="font-semibold" style={{ color: "#3A2E1A" }}>Michael Kania</span>, VP Marketing — kyu.</div>
          </div>
        </div>
        <div className="text-center text-xs mt-6" style={{ color: "#BCAE91" }}>kyu collective · Cannes Lions 2026</div>
      </footer>
    </div>
  );
}

function MiniCard({ e }) {
  const T = TYPES[e.type] || TYPES.panel;
  const Icon = T.icon;
  const comps = companiesOf(e);
  const c = colorFor(comps[0]);
  return (
    <div className="evt-card rounded-xl border bg-white" style={{ borderColor: "#F0E6D2", borderLeft: `3px solid ${c}`, boxShadow: "0 2px 8px -6px rgba(20,40,60,.25)", padding: "12px" }}>
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold flex items-center gap-1" style={{ color: "#5A4A33", fontSize: "12px" }}><Clock size={11} /> {e.time}</span>
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold" style={{ fontSize: "10px", background: "#F6EDDA", color: "#9A7330" }}>
          <Icon size={10} /> <span>{T.label}</span>
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
        {comps.map((co) => (
          <span key={co} className="font-bold flex items-center gap-1" style={{ color: colorFor(co), fontSize: "11px" }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colorFor(co) }} /> {co}
          </span>
        ))}
      </div>
      {e.host && <div className="mt-0.5 font-semibold leading-snug" style={{ fontFamily: SERIF, color: "#231C12", fontSize: "15px" }}>{e.host}</div>}
      {e.title && <div className="mt-0.5 text-xs font-medium" style={{ color: "#5C513F" }}>{e.title}</div>}
      {e.who && (
        <div className="mt-1.5 rounded-md px-2 py-1 text-xs flex items-start gap-1.5" style={{ background: "#F4F0E6", color: "#5C4E36" }}>
          <Mic size={12} className="mt-0.5 shrink-0" style={{ color: "#A28B5E" }} />
          <span><span style={{ fontWeight: 700 }}>Speakers: </span>{e.who}</span>
        </div>
      )}
      {e.venue && <div className="mt-1.5 text-xs flex items-start gap-1" style={{ color: "#A89A80" }}><MapPin size={10} className="mt-0.5 shrink-0" /> {e.venue}</div>}
      {e.notes && <div className="mt-1 text-xs italic" style={{ color: "#B0A285" }}>{e.notes}</div>}
      {e.link && (
        <a href={e.link} target="_blank" rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-1" style={{ color: "#B5622E", background: "#FBEEDD" }}>
          <ExternalLink size={11} /> Event page
        </a>
      )}
    </div>
  );
}
