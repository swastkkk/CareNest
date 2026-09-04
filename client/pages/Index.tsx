import { useEffect, useState, type ReactNode } from "react";
import type { DashboardResponse, RoutineItem } from "@shared/api";
import {
  Activity,
  Bell,
  Brain,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  HeartHandshake,
  Languages,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  MapPin,
  Menu,
  PhoneCall,
  Play,
  ScanLine,
  ShieldAlert,
  ShoppingBasket,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

const games = [
  { icon: Lightbulb, title: "What Is This?", text: "Identify familiar objects", color: "bg-[#fff4d9] text-[#b57900]" },
  { icon: Brain, title: "Remember Objects", text: "Train your short-term memory", color: "bg-[#e9e5ff] text-[#6554c0]" },
  { icon: ListChecks, title: "Right Order", text: "Arrange everyday steps", color: "bg-[#dff5ed] text-[#21886a]" },
  { icon: ShoppingBasket, title: "Shopping Game", text: "Remember your grocery list", color: "bg-[#ffe4df] text-[#c66555]" },
];

export default function Index() {
  const [language, setLanguage] = useState<"EN" | "हि">("EN");
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [streak, setStreak] = useState(5);
  const [showCaregiver, setShowCaregiver] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [code, setCode] = useState("");
  const [caregiverError, setCaregiverError] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const isHindi = language === "हि";

  useEffect(() => {
    fetch("/api/carenest/dashboard")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the dashboard");
        return response.json() as Promise<DashboardResponse>;
      })
      .then((data) => {
        setRoutines(Array.isArray(data.routines) ? data.routines : []);
        setStreak(typeof data.streak === "number" ? data.streak : 5);
      })
      .catch(() => undefined);
  }, []);

  const completeRoutine = async (id: string) => {
    const response = await fetch(`/api/carenest/routines/${id}/complete`, { method: "POST" });
    if (response.ok) {
      const updated = (await response.json()) as RoutineItem;
      setRoutines((items) => items.map((item) => item.id === updated.id ? updated : item));
    }
  };

  const startGame = async (id: string, title: string) => {
    const response = await fetch(`/api/carenest/games/${id}/start`, { method: "POST" });
    if (response.ok) {
      const data = await response.json() as { streak: number };
      setStreak(data.streak);
      setGameMessage(`${title} is ready to play. Your streak is now ${data.streak} days.`);
      setSelectedGame(id);
      document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const verifyCaregiver = async () => {
    const response = await fetch("/api/carenest/caregiver/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (response.ok) {
      setCaregiverError("");
      setShowCaregiver(false);
    } else {
      setCaregiverError("That code is not correct. Try the demo code 2468.");
    }
  };

  const sendAlert = async () => {
    const response = await fetch("/api/carenest/alerts", { method: "POST" });
    if (response.ok) setAlertSent(true);
  };

  const scanObject = async () => {
    const response = await fetch("/api/carenest/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ object: "chair" }),
    });
    if (response.ok) {
      const data = await response.json() as { message: string };
      setScanResult(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf9] text-[#26333a]">
      <header className="sticky top-0 z-20 border-b border-[#e5ece9] bg-[#f8faf9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-[#496e68] text-white shadow-[0_5px_14px_rgba(73,110,104,0.22)]">
              <HeartHandshake size={27} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display text-[21px] font-bold leading-none tracking-[-0.03em] text-[#284945]">CareNest</p>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.11em] text-[#8b9e9a]">YOUR DAILY COMPANION</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLanguage(language === "EN" ? "हि" : "EN")} className="flex h-11 items-center gap-2 rounded-full border border-[#dce7e2] bg-white px-3 text-sm font-bold text-[#496e68] shadow-sm transition hover:border-[#9abbb2]" aria-label="Change language">
              <Languages size={18} /> <span>{language}</span>
            </button>
            <button onClick={() => setShowNotifications(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#dce7e2] bg-white text-[#496e68] shadow-sm transition hover:bg-[#edf5f1]" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e27662] ring-2 ring-white" />
            </button>
            <button onClick={() => { setCaregiverError(""); setShowCaregiver(true); }} className="hidden h-11 items-center gap-2 rounded-full bg-[#496e68] px-5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(73,110,104,0.18)] transition hover:bg-[#395d57] sm:flex">
              <LockKeyhole size={16} /> {isHindi ? "देखभालकर्ता" : "Caregiver"}
            </button>
            <button onClick={() => { setCaregiverError(""); setShowCaregiver(true); }} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4efeb] text-[#496e68] sm:hidden" aria-label="Menu"><Menu size={21} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-11">
        <section className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#8c9f9a]"><SunIcon /> {isHindi ? "शुभ प्रभात, सीमा" : "Good morning, Seema"}</p>
            <h1 className="font-display text-[38px] font-bold leading-[1.08] tracking-[-0.045em] text-[#294641] sm:text-[50px]">{isHindi ? "आज का दिन अच्छा हो" : "A gentle day starts here"}</h1>
            <p className="mt-3 max-w-[530px] text-[17px] leading-7 text-[#72827e]">{isHindi ? "आइए आज साथ में कुछ आसान और अच्छा करें।" : "Let’s make today feel a little easier, one small step at a time."}</p>
          </div>
          <div className="flex items-center gap-3 rounded-[20px] border border-[#e7dfc9] bg-[#fffaf0] px-4 py-3 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8d978] text-[#805e00]"><Sparkles size={23} /></div>
            <div><p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#a2843b]">Your streak</p><p className="font-display text-[24px] font-bold text-[#755b1e]">{streak} days <span className="text-lg">🔥</span></p></div>
          </div>
        </section>

        <section className="mt-9 grid gap-4 md:grid-cols-3">
          <ActionCard icon={<ScanLine size={29} />} title={isHindi ? "यह क्या है?" : "What is this?"} text={isHindi ? "किसी वस्तु को पहचानें" : "Point your camera at an object"} className="bg-[#e0f1ed] text-[#346962]" onClick={() => setShowScanner(true)} buttonText={isHindi ? "स्कैन करें" : "Scan an object"} />
          <ActionCard icon={<Brain size={29} />} title={isHindi ? "दिमाग का खेल" : "Mind games"} text={isHindi ? "याददाश्त को मज़बूत करें" : "Keep your memory active"} className="bg-[#eeeaff] text-[#6655af]" onClick={() => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })} buttonText={isHindi ? "खेलें" : "Play now"} />
          <ActionCard icon={<ShieldAlert size={29} />} title={isHindi ? "मुझे मदद चाहिए" : "I need help"} text={isHindi ? "आपके संपर्कों को सूचना मिलेगी" : "Your trusted contacts will be notified"} className="bg-[#fff0e9] text-[#b55e4f]" onClick={() => { setAlertSent(false); setShowAlert(true); }} buttonText={isHindi ? "अलर्ट भेजें" : "Send alert"} />
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.42fr_1fr]">
          <div>
            <div className="mb-4 flex items-center justify-between"><div><p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#9aa9a5]">{isHindi ? "आपका दिन" : "Your day"}</p><h2 className="mt-1 font-display text-[28px] font-bold tracking-[-0.03em] text-[#294641]">{isHindi ? "आज का रूटीन" : "Today’s routine"}</h2></div><button onClick={() => document.getElementById("routine-list")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-bold text-[#578179] hover:text-[#294641]">{isHindi ? "सभी देखें" : "View all"} <ChevronRight className="inline" size={16} /></button></div>
            <div id="routine-list" className="space-y-3">{routines.map((routine) => <RoutineCard key={routine.id} {...routine} onComplete={completeRoutine} />)}</div>
            <button onClick={() => document.getElementById("routine-list")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[17px] border-2 border-dashed border-[#cbded8] py-3.5 text-sm font-bold text-[#62847d] transition hover:border-[#82aaa0] hover:bg-[#f1f8f5]"><CalendarDays size={18} /> {isHindi ? "बाकी रूटीन देखें" : "See the rest of your routine"}</button>
          </div>
          <div id="games" className="rounded-[25px] bg-[#f0f5f2] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#9aa9a5]">{isHindi ? "दिमाग के लिए" : "For your mind"}</p><h2 className="mt-1 font-display text-[28px] font-bold tracking-[-0.03em] text-[#294641]">Memory games</h2></div><div className="rounded-2xl bg-white p-3 text-[#e0a928] shadow-sm"><Brain size={23} /></div></div><p className="mt-2 text-[14px] leading-6 text-[#788984]">A few minutes of play every day keeps your streak growing.</p>{gameMessage && <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#e3f2ec] px-3 py-2 text-sm font-semibold text-[#4b806f]"><CheckCircle2 size={16} /> {gameMessage}</div>}<div className="mt-5 grid grid-cols-2 gap-3">{games.map((game, index) => <button key={game.title} onClick={() => startGame(["identify", "remember", "order", "shopping"][index], game.title)} className="group rounded-[18px] bg-white p-3 text-left shadow-[0_3px_12px_rgba(73,110,104,0.05)] transition hover:-translate-y-0.5 hover:shadow-md"><div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${game.color}`}><game.icon size={21} /></div><p className="text-[15px] font-bold leading-tight text-[#3c514d]">{game.title}</p><p className="mt-1 text-[12px] leading-4 text-[#8c9b97]">{game.text}</p><span className="mt-3 flex items-center gap-1 text-[12px] font-bold text-[#6d9187]">Play <Play size={11} fill="currentColor" /></span></button>)}</div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#496e68] py-3 text-sm font-bold text-white transition hover:bg-[#395d57]">See all games <ChevronRight size={16} /></button></div>
        </section>

        <section className="mt-9 flex flex-col gap-4 rounded-[24px] border border-[#e4ebe7] bg-white p-5 shadow-[0_6px_25px_rgba(71,95,87,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e9f3ef] text-[#57877d]"><Users size={27} /></div><div><h3 className="font-display text-[21px] font-bold text-[#36534d]">{isHindi ? "आप अकेले नहीं हैं" : "You are not alone"}</h3><p className="mt-1 text-sm text-[#82918e]">{isHindi ? "आपके परिवार के लोग आपकी मदद के लिए यहाँ हैं।" : "Your family is here to support you whenever you need them."}</p></div></div><button onClick={() => setShowCaregiver(true)} className="flex items-center justify-center gap-2 rounded-xl border border-[#d7e6e0] px-4 py-3 text-sm font-bold text-[#527c73] transition hover:bg-[#f2f8f5]"><PhoneCall size={17} /> Call family</button></section>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#e5ece9] pt-5 text-[12px] font-semibold text-[#a0aeaa] sm:flex-row"><p>CareNest · Made with care for every family</p><p className="flex items-center gap-2"><MapPin size={13} /> North Eastern Region, India <span className="mx-1">·</span> <CircleHelp size={13} /> Need help?</p></footer>
      </div>

      {showNotifications && <Modal title="Notifications" onClose={() => setShowNotifications(false)}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4d9] text-[#b57900]"><Bell size={26} /></div><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">You are all caught up</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">Your next routine is brushing your teeth at 09:00 AM. We’ll remind you when it is time.</p><div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#f0f7f3] p-3 text-sm font-semibold text-[#527d73]"><Clock3 size={18} /> Next reminder · 09:00 AM</div></Modal>}
      {showCaregiver && <Modal title="Caregiver access" onClose={() => setShowCaregiver(false)}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f1ed] text-[#4c7b72]"><LockKeyhole size={26} /></div><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">Enter your access code</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">This private space is only for your trusted caregiver. Ask them for your 4-digit code.</p><input autoFocus value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, "").slice(0, 4)); setCaregiverError(""); }} inputMode="numeric" maxLength={4} placeholder="••••" className={`mt-6 w-full rounded-2xl border-2 bg-[#f8fbf9] px-5 py-4 text-center text-2xl font-bold tracking-[0.5em] text-[#496e68] outline-none focus:border-[#75a49a] ${caregiverError ? "border-[#d98270]" : "border-[#d9e7e2]"}`} />{caregiverError && <p className="mt-2 text-center text-sm font-semibold text-[#c56655]">{caregiverError}</p>}<button onClick={verifyCaregiver} disabled={code.length !== 4} className="mt-4 w-full rounded-xl bg-[#496e68] py-3.5 font-bold text-white transition hover:bg-[#395d57] disabled:cursor-not-allowed disabled:opacity-40">Continue to caregiver space</button></Modal>}
      {showScanner && <Modal title="Object scanner" onClose={() => { setScanResult(""); setShowScanner(false); }}><div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-[#e5f1ed]"><div className="absolute inset-6 rounded-xl border-2 border-dashed border-[#6e9e93]" /><Camera size={54} className="text-[#54867c]" /><span className="absolute bottom-3 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#54867c]">Point at an object</span></div><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">{scanResult || "Let’s find out together"}</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">{scanResult ? "The CareNest scanner recognized this everyday object." : "Your camera will help identify everyday objects and say their name aloud."}</p><button onClick={scanObject} className="mt-6 w-full rounded-xl bg-[#496e68] py-3.5 font-bold text-white">{scanResult ? "Scan again" : "Open camera"}</button></Modal>}
      {selectedGame && <GameModal gameId={selectedGame} onClose={() => setSelectedGame(null)} />}
      {showAlert && <Modal title="Send an alert" onClose={() => setShowAlert(false)}><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e9] text-[#c86656]"><ShieldAlert size={32} /></div>{alertSent ? <div className="text-center"><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">Your family has been notified</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">Help is on the way. Stay where you are and take a slow breath.</p><div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-[#e5f4ed] px-4 py-2 text-sm font-bold text-[#3e876e]"><CheckCircle2 size={17} /> Alert sent just now</div></div> : <div className="text-center"><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">Are you sure you need help?</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">We’ll send a message to your caregiver and emergency contacts.</p><button onClick={sendAlert} className="mt-6 w-full rounded-xl bg-[#ce725f] py-3.5 font-bold text-white transition hover:bg-[#b85f4e]">Yes, send an alert</button><button onClick={() => setShowAlert(false)} className="mt-2 w-full rounded-xl py-3 text-sm font-bold text-[#84928f]">Not now</button></div>}</Modal>}
    </main>
  );
}

function ActionCard({ icon, title, text, className, onClick, buttonText }: { icon: ReactNode; title: string; text: string; className: string; onClick: () => void; buttonText: string }) {
  return <div className={`flex min-h-[178px] flex-col justify-between rounded-[23px] p-5 shadow-[0_6px_18px_rgba(71,95,87,0.04)] ${className}`}><div className="flex items-start justify-between"><div><h2 className="font-display text-[24px] font-bold tracking-[-0.03em]">{title}</h2><p className="mt-1 max-w-[210px] text-[14px] leading-5 opacity-80">{text}</p></div><div className="rounded-2xl bg-white/70 p-3">{icon}</div></div><button onClick={onClick} className="mt-4 flex w-fit items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-bold shadow-sm transition hover:bg-white">{buttonText} <ChevronRight size={16} /></button></div>;
}

function RoutineCard({ id, time, title, detail, tone, done, onComplete }: RoutineItem & { onComplete: (id: string) => void }) {
  const colors: Record<string, string> = { violet: "bg-[#eeeaff] text-[#7868c4]", amber: "bg-[#fff3d6] text-[#bc8b21]", mint: "bg-[#e1f4ec] text-[#4a927b]" };
  return <div className={`flex items-center gap-3 rounded-[19px] border bg-white p-3.5 shadow-[0_3px_13px_rgba(71,95,87,0.04)] ${done ? "border-[#dbeee6]" : "border-[#e7eeeb]"}`}><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors[tone]}`}>{done ? <Check size={22} /> : <Clock3 size={21} />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-2"><p className="text-[12px] font-bold text-[#9baaa6]">{time}</p>{done && <span className="rounded-full bg-[#e5f4ed] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4a927b]">Done</span>}</div><p className="mt-0.5 text-[16px] font-bold text-[#3c514d]">{title}</p><p className="truncate text-[13px] text-[#8b9995]">{detail}</p></div><button onClick={() => onComplete(id)} disabled={done} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9cafaa] hover:bg-[#eef6f3] hover:text-[#527d73] disabled:opacity-40"><ChevronRight size={19} /></button></div>;
}

function GameModal({ gameId, onClose }: { gameId: string; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showObjects, setShowObjects] = useState(gameId === "remember");
  const titles: Record<string, string> = { identify: "What Is This?", remember: "Remember the Objects", order: "Put It in the Right Order", shopping: "Shopping Game" };
  const finish = () => setFinished(true);
  const chooseShopping = (item: string) => {
    if (selected.includes(item)) return;
    const next = [...selected, item];
    setSelected(next);
    if (next.length === 3) {
      if (["🥛 Milk", "🍚 Rice", "🍌 Bananas"].every((item) => next.includes(item))) finish();
      else setSelected([]);
    }
  };
  const chooseOrder = (step: string) => {
    const next = [...selected, step];
    setSelected(next);
    const answer = ["Wake up", "Brush teeth", "Have breakfast"];
    if (next.length === answer.length) {
      if (next.every((item, index) => item === answer[index])) finish();
      else setSelected([]);
    }
  };

  useEffect(() => {
    if (gameId !== "remember") return;
    const timer = window.setTimeout(() => setShowObjects(false), 3500);
    return () => window.clearTimeout(timer);
  }, [gameId]);

  return <Modal title={titles[gameId] ?? "Memory game"} onClose={onClose}>
    {finished ? <div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f3eb] text-[#4a927b]"><CheckCircle2 size={34} /></div><h3 className="mt-5 font-display text-2xl font-bold text-[#294641]">Wonderful work!</h3><p className="mt-2 text-sm leading-6 text-[#7d8e89]">You completed today’s memory exercise. Come back tomorrow to keep your streak growing.</p><button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#496e68] py-3.5 font-bold text-white">Back to home</button></div> : <>
      {gameId === "identify" && <><p className="text-sm leading-6 text-[#7d8e89]">Look at the picture. Which word matches it?</p><div className="mt-5 flex h-36 items-center justify-center rounded-2xl bg-[#e5f1ed] text-7xl">🪑</div><div className="mt-4 grid grid-cols-2 gap-3">{["A chair", "A cup", "A flower", "A shoe"].map((answer) => <GameChoice key={answer} label={answer} onClick={() => answer === "A chair" ? finish() : undefined} />)}</div></>}
      {gameId === "remember" && <><p className="text-sm leading-6 text-[#7d8e89]">{showObjects ? "Remember these three objects…" : "Which objects did you see? Choose all three."}</p>{showObjects ? <div className="mt-7 flex justify-center gap-3 text-5xl"><span className="rounded-2xl bg-[#fff4d9] p-4">🔑</span><span className="rounded-2xl bg-[#e9e5ff] p-4">🍎</span><span className="rounded-2xl bg-[#dff5ed] p-4">☂️</span></div> : <div className="mt-5 grid grid-cols-2 gap-3">{["🔑 Key", "🍎 Apple", "☂️ Umbrella", "📖 Book"].map((item) => <GameChoice key={item} label={item} onClick={() => { const next = [...selected, item]; setSelected(next); if (next.length === 3) {
        if (next.every((choice) => ["🔑 Key", "🍎 Apple", "☂️ Umbrella"].includes(choice))) finish();
        else setSelected([]);
      } }} selected={selected.includes(item)} />)}</div>}</>}
      {gameId === "order" && <><p className="text-sm leading-6 text-[#7d8e89]">Tap the steps in the order you do them in the morning.</p><div className="mt-5 space-y-3">{["Have breakfast", "Wake up", "Brush teeth"].map((step) => <GameChoice key={step} label={`${selected.indexOf(step) + 1 > 0 ? `${selected.indexOf(step) + 1}. ` : ""}${step}`} onClick={() => chooseOrder(step)} selected={selected.includes(step)} />)}</div></>}
      {gameId === "shopping" && <><p className="text-sm leading-6 text-[#7d8e89]">Grandma needs milk, rice, and bananas. Choose those three items.</p><div className="mt-5 grid grid-cols-2 gap-3">{["🥛 Milk", "🍚 Rice", "🍌 Bananas", "🧼 Soap", "🍪 Biscuits", "🧃 Juice"].map((item) => <GameChoice key={item} label={item} onClick={() => chooseShopping(item)} selected={selected.includes(item)} />)}</div><p className="mt-4 text-center text-xs font-bold text-[#8b9c97]">{selected.length} of 3 selected</p></>}
    </>}
  </Modal>;
}

function GameChoice({ label, onClick, selected = false }: { label: string; onClick: () => void; selected?: boolean }) {
  return <button onClick={onClick} disabled={selected} className={`rounded-xl border-2 px-3 py-3 text-left text-sm font-bold transition ${selected ? "border-[#6e9e93] bg-[#e5f3ed] text-[#4c8175]" : "border-[#e1ebe7] bg-[#fbfdfc] text-[#536660] hover:border-[#8bb3a9] hover:bg-[#f2f8f5]"}`}>{label}</button>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#294641]/35 p-5 backdrop-blur-sm"><div className="relative w-full max-w-[390px] rounded-[26px] bg-white p-6 shadow-2xl"><button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-[#9aa9a5] hover:bg-[#f0f5f2] hover:text-[#496e68]" aria-label={`Close ${title}`}><X size={19} /></button>{children}</div></div>;
}

function SunIcon() { return <span className="text-[#d9a526]">☀</span>; }
