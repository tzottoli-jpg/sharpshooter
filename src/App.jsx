import { useState, useEffect, useCallback, useRef } from "react";

// ─── ROSTER DATA ────────────────────────────────────────────────────────────
const ROSTERS = {
  Trent: [
    { name: "Brayden Burries",      school: "Arizona",    espnId: "4432574", projected: 88,  seed: 4,  region: "West"    },
    { name: "Dominique Daniels Jr", school: "Cal Baptist",espnId: null,      projected: 23,  seed: 14, region: "South"   },
    { name: "Darius Acuff Jr",      school: "Arkansas",   espnId: "4683731", projected: 68,  seed: 5,  region: "South"   },
    { name: "Larry Johnson",        school: "McNeese",    espnId: null,      projected: 26,  seed: 13, region: "Midwest" },
    { name: "Joshua Jefferson",     school: "Iowa State", espnId: "4432843", projected: 76,  seed: 2,  region: "South"   },
    { name: "Ja'Kobi Gillespie",    school: "Tennessee",  espnId: "4433289", projected: 45,  seed: 2,  region: "East"    },
    { name: "Emmanuel Sharp",       school: "Houston",    espnId: "4433048", projected: 69,  seed: 3,  region: "Midwest" },
    { name: "Tyler Tanner",         school: "Vanderbilt", espnId: null,      projected: 48,  seed: 8,  region: "West"    },
  ],
  JB: [
    { name: "Cam Boozer",           school: "Duke",       espnId: "4683705", projected: 125, seed: 1,  region: "East"    },
    { name: "Damari Wheeler",       school: "NDSU",       espnId: null,      projected: 14,  seed: 16, region: "East"    },
    { name: "Keaton Wagner",        school: "Illinois",   espnId: null,      projected: 63,  seed: 6,  region: "West"    },
    { name: "John Mobley Jr",       school: "Ohio State", espnId: "4432717", projected: 20,  seed: 11, region: "South"   },
    { name: "Jaden Bradley",        school: "Arizona",    espnId: "4433110", projected: 74,  seed: 4,  region: "West"    },
    { name: "Ryan Conwell",         school: "Louisville", espnId: null,      projected: 47,  seed: 7,  region: "West"    },
    { name: "Elliot Cadeau",        school: "Michigan",   espnId: "4683783", projected: 69,  seed: 1,  region: "Midwest" },
    { name: "Mirkovic",             school: "Illinois",   espnId: null,      projected: 39,  seed: 6,  region: "West"    },
  ],
  Kelly: [
    { name: "Thomas Haugh",         school: "Florida",    espnId: "4432922", projected: 94,  seed: 1,  region: "South"   },
    { name: "Cruz Davis",           school: "Hofstra",    espnId: null,      projected: 20,  seed: 15, region: "East"    },
    { name: "AJ Dybantsa",          school: "BYU",        espnId: "4683758", projected: 63,  seed: 6,  region: "Midwest" },
    { name: "Jeremiah Wilkinson",   school: "Georgia",    espnId: null,      projected: 26,  seed: 8,  region: "South"   },
    { name: "Graham Ike",           school: "Gonzaga",    espnId: "4278078", projected: 69,  seed: 5,  region: "West"    },
    { name: "Tyler Bilodeau",       school: "UCLA",       espnId: null,      projected: 28,  seed: 9,  region: "Midwest" },
    { name: "Meleek Thomas",        school: "Arkansas",   espnId: "4683786", projected: 43,  seed: 5,  region: "South"   },
    { name: "Pryce Sandfort",       school: "Nebraska",   espnId: "4432720", projected: 25,  seed: 10, region: "West"    },
  ],
  Pat: [
    { name: "Yaxel Lendeborg",      school: "Michigan",   espnId: "4432823", projected: 79,  seed: 1,  region: "Midwest" },
    { name: "Preston Edmead",       school: "Hofstra",    espnId: null,      projected: 10,  seed: 15, region: "East"    },
    { name: "Koa Peat",             school: "Arizona",    espnId: "4683784", projected: 75,  seed: 4,  region: "West"    },
    { name: "Bruce Thornton",       school: "Ohio State", espnId: "4432727", projected: 30,  seed: 11, region: "South"   },
    { name: "Andrej Stojakovic",    school: "Illinois",   espnId: "4432823", projected: 47,  seed: 6,  region: "West"    },
    { name: "Nate Ament",           school: "Tennessee",  espnId: null,      projected: 44,  seed: 2,  region: "East"    },
    { name: "Alex Karaban",         school: "UConn",      espnId: "4432784", projected: 54,  seed: 3,  region: "West"    },
    { name: "Labaron Philon Jr",    school: "Alabama",    espnId: "4683748", projected: 65,  seed: 1,  region: "South"   },
  ],
  Ben: [
    { name: "Kingston Flemings",    school: "Houston",    espnId: "4683780", projected: 74,  seed: 3,  region: "Midwest" },
    { name: "TJ Power",             school: "Penn",       espnId: null,      projected: 17,  seed: 14, region: "Midwest" },
    { name: "Isaiah Evans",         school: "Duke",       espnId: "4683760", projected: 51,  seed: 1,  region: "East"    },
    { name: "Bennett Stirtz",       school: "Iowa",       espnId: "4432712", projected: 30,  seed: 12, region: "Midwest" },
    { name: "Jeremy Fears",         school: "MSU",        espnId: "4683762", projected: 55,  seed: 2,  region: "West"    },
    { name: "Malik Reneau",         school: "Miami",      espnId: "4432851", projected: 37,  seed: 9,  region: "East"    },
    { name: "Fletcher Loyer",       school: "Purdue",     espnId: "4432870", projected: 61,  seed: 4,  region: "South"   },
    { name: "Nick Boyd",            school: "Wisconsin",  espnId: null,      projected: 18,  seed: 10, region: "East"    },
  ],
  Berit: [
    { name: "Alex Condon",          school: "Florida",    espnId: "4683700", projected: 66,  seed: 1,  region: "South"   },
    { name: "Thomas Dowd",          school: "Troy",       espnId: null,      projected: 15,  seed: 16, region: "Midwest" },
    { name: "Milan Momcilovic",     school: "Iowa State", espnId: "4683787", projected: 77,  seed: 2,  region: "South"   },
    { name: "Mark Mitchell",        school: "Missouri",   espnId: "4432787", projected: 27,  seed: 8,  region: "West"    },
    { name: "Morez Johnson Jr",     school: "Michigan",   espnId: "4683782", projected: 62,  seed: 1,  region: "Midwest" },
    { name: "Mikel Brown Jr",       school: "Louisville", espnId: null,      projected: 46,  seed: 7,  region: "West"    },
    { name: "Tarris Reed",          school: "UConn",      espnId: "4432791", projected: 50,  seed: 3,  region: "West"    },
    { name: "Daryn Peterson",       school: "Kansas",     espnId: "4683756", projected: 59,  seed: 1,  region: "East"    },
  ],
};

const MANAGER_COLORS = {
  Trent: "#38bdf8", JB: "#f97316", Kelly: "#a78bfa",
  Pat: "#34d399",   Ben: "#f43f5e", Berit: "#fbbf24",
};

const SCOUTING = {
  Trent: "Most balanced roster — deep South coverage with two seed-2 wildcards and high floor.",
  JB:    "Three seed-1 wildcards is the highest ceiling in the draft — lives and dies with Duke.",
  Kelly: "Dybantsa has the highest PPG in the draft but no seed-2 wildcards limits the floor.",
  Pat:   "Two seed-1s on different teams diversifies risk — Philon Jr is the best value pick in the draft.",
  Ben:   "No seed-1 wildcards is a real ceiling limiter — needs Duke and Purdue to run deep simultaneously.",
  Berit: "Sneaky dangerous — Momcilovic, Peterson and Reed are all on potential Final Four teams.",
};

const STATIC_RANGES = {
  Trent: { floor: 180, ceiling: 564 },
  JB:    { floor: 160, ceiling: 610 },
  Kelly: { floor: 155, ceiling: 520 },
  Pat:   { floor: 170, ceiling: 540 },
  Ben:   { floor: 140, ceiling: 480 },
  Berit: { floor: 165, ceiling: 530 },
};

const SEED_TIERS = [
  { label: "Seed 1",    seeds: [1],           color: "#f59e0b" },
  { label: "Seed 2",    seeds: [2],           color: "#38bdf8" },
  { label: "Seed 3–4",  seeds: [3,4],         color: "#a78bfa" },
  { label: "Seed 5–7",  seeds: [5,6,7],       color: "#34d399" },
  { label: "Seed 8–12", seeds: [8,9,10,11,12],color: "#64748b" },
  { label: "Seed 13+",  seeds: [13,14,15,16], color: "#334155" },
];

const REGIONS = ["West","East","South","Midwest"];
const REGION_COLORS = { West:"#3b82f6", East:"#ef4444", South:"#22c55e", Midwest:"#a855f7" };

const MANAGERS = Object.keys(ROSTERS);

// ─── LOCALSTORAGE ────────────────────────────────────────────────────────────
const LS_KEY      = "mm2026_scores_v3";
const LS_ELIM_KEY = "mm2026_eliminated_v3";
const STALE_KEYS  = ["mm2026_scores","mm2026_scores_v2","mm2026_eliminated","mm2026_eliminated_v2"];

function loadFromLS()    { try { STALE_KEYS.forEach(k=>localStorage.removeItem(k)); const r=localStorage.getItem(LS_KEY);    return r?JSON.parse(r):{}; } catch{return{};} }
function loadElimFromLS(){ try { const r=localStorage.getItem(LS_ELIM_KEY); return r?JSON.parse(r):{}; } catch{return{};} }
function saveToLS(d)     { try { localStorage.setItem(LS_KEY,JSON.stringify(d)); } catch{} }
function saveElimToLS(d) { try { localStorage.setItem(LS_ELIM_KEY,JSON.stringify(d)); } catch{} }

// ─── ESPN FETCH ───────────────────────────────────────────────────────────────
async function fetchESPNScores() {
  try {
    const boardRes = await fetch(
      "https://https://sharpshooter-proxy.tzottoli.workers.dev//scoreboard?groups=50&limit=100",
      { signal: AbortSignal.timeout(8000) }
    );
    if (!boardRes.ok) throw new Error("scoreboard fetch failed");
    const boardData = await boardRes.json();
    const events = (boardData?.events||[]).filter(e=>{
      const s=e.status?.type?.name;
      return s==="STATUS_IN_PROGRESS"||s==="STATUS_FINAL";
    });
    if (!events.length) return { playerStats:{}, livePlayerIds:new Set(), noGamesYet:true };
    const livePlayerIds=new Set(), playerStats={};
    await Promise.all(events.map(async ev=>{
      const isLive=ev.status?.type?.name==="STATUS_IN_PROGRESS";
      try {
        const r=await fetch(`https://https://sharpshooter-proxy.tzottoli.workers.dev//summary?event=${ev.id}`,{signal:AbortSignal.timeout(8000)});
        if(!r.ok) return;
        const s=await r.json();
        for(const td of s?.boxscore?.players||[]){
          for(const sg of td.statistics||[]){
            const pIdx=(sg.keys||[]).indexOf("PTS");
            if(pIdx===-1) continue;
            for(const a of sg.athletes||[]){
              const id=a.athlete?.id; if(!id) continue;
              const raw=a.stats?.[pIdx];
              if(!raw||raw==="--"||raw==="DNP") continue;
              const v=parseFloat(raw); if(isNaN(v)||v===0) continue;
              if(!playerStats[id]) playerStats[id]={pts:0,lastGame:0,live:false};
              playerStats[id].pts+=v; playerStats[id].lastGame=v;
              if(isLive){playerStats[id].live=true;livePlayerIds.add(id);}
            }
          }
        }
      } catch{}
    }));
    return { playerStats, livePlayerIds, noGamesYet:false };
  } catch { return null; }
}

function buildZeroScores(){
  const s={};
  for(const[m,ps]of Object.entries(ROSTERS)){s[m]={};for(const p of ps)s[m][p.name]={pts:0,lastGame:0,live:false};}
  return s;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getTierForSeed(seed){
  for(const t of SEED_TIERS) if(t.seeds.includes(seed)) return t;
  return SEED_TIERS[SEED_TIERS.length-1];
}

function getManagerActualPts(manager, scores){
  return ROSTERS[manager].reduce((s,p)=>s+(scores[manager]?.[p.name]?.pts||0),0);
}

function getManagerProjPts(manager){
  return ROSTERS[manager].reduce((s,p)=>s+p.projected,0);
}

function getManagerLiveTotal(manager, scores, eliminated){
  // actual pts already scored + projected pts for non-eliminated players still in
  const actual=getManagerActualPts(manager,scores);
  const estRemaining=ROSTERS[manager].reduce((s,p)=>{
    const eKey=`${manager}::${p.name}`;
    if(eliminated[eKey]) return s;
    const scored=scores[manager]?.[p.name]?.pts||0;
    const remEst=Math.max(0, p.projected-scored);
    return s+remEst;
  },0);
  return actual+estRemaining;
}

function getManagerCeilingFloor(manager, scores, eliminated){
  const actual=getManagerActualPts(manager,scores);
  const activeRemaining=ROSTERS[manager].reduce((s,p)=>{
    const eKey=`${manager}::${p.name}`;
    if(eliminated[eKey]) return s;
    const scored=scores[manager]?.[p.name]?.pts||0;
    return s+Math.max(0,p.projected-scored);
  },0);
  return { floor: actual, ceiling: actual+activeRemaining };
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scores, setScores]           = useState(loadFromLS);
  const [eliminated, setEliminated]   = useState(loadElimFromLS);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive]           = useState(false);
  const [livePlayerIds, setLivePlayerIds] = useState(new Set());
  const [expanded, setExpanded]       = useState({});
  const [showReset, setShowReset]     = useState(false);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [dataSource, setDataSource]   = useState("pending");
  const [activeTab, setActiveTab]     = useState("scoreboard");
  const [insightsMode, setInsightsMode] = useState("pre"); // "pre" | "live"
  const [h2hOpen, setH2hOpen]         = useState(null); // {row, col}
  const intervalRef = useRef(null);

  const scoringHasStarted = dataSource === "espn" &&
    Object.values(scores).some(m=>Object.values(m).some(p=>p.pts>0));

  const fetchScores = useCallback(async () => {
    setFetchStatus("fetching");
    const espnData = await fetchESPNScores();
    const newLiveIds = new Set();
    let newScores;

    if (espnData && !espnData.noGamesYet) {
      newScores = {};
      for (const [manager, players] of Object.entries(ROSTERS)) {
        newScores[manager] = {};
        for (const player of players) {
          const stat = player.espnId ? espnData.playerStats[player.espnId] : null;
          newScores[manager][player.name] = { pts:stat?.pts??0, lastGame:stat?.lastGame??0, live:stat?.live??false };
          if (stat?.live && player.espnId) newLiveIds.add(player.espnId);
        }
      }
      saveToLS(newScores);
      setDataSource("espn");
    } else if (espnData?.noGamesYet) {
      newScores = buildZeroScores();
      setDataSource("none");
    } else {
      const cached = loadFromLS();
      if (Object.keys(cached).length > 0) {
        newScores = {};
        for (const [manager, players] of Object.entries(ROSTERS)) {
          newScores[manager] = {};
          for (const player of players) {
            const c = cached[manager]?.[player.name];
            newScores[manager][player.name] = { pts:c?.pts??0, lastGame:c?.lastGame??0, live:false };
          }
        }
        setDataSource("cache");
      } else {
        newScores = buildZeroScores();
        setDataSource("none");
      }
    }

    setScores(newScores);
    setLivePlayerIds(newLiveIds);
    setIsLive(newLiveIds.size > 0);
    setLastUpdated(new Date());
    setFetchStatus("done");
  }, []);

  useEffect(() => {
    fetchScores();
    intervalRef.current = setInterval(fetchScores, 60000);
    return () => clearInterval(intervalRef.current);
  }, [fetchScores]);

  const toggleElim = (manager, playerName) => {
    const key = `${manager}::${playerName}`;
    setEliminated(prev => { const next={...prev,[key]:!prev[key]}; saveElimToLS(next); return next; });
  };

  const handleReset = () => {
    localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_ELIM_KEY);
    setScores(buildZeroScores()); setEliminated({}); setShowReset(false);
  };

  const formatTime = d => d ? d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}) : "—";

  const sourceInfo = {
    pending:{ label:"loading...",         color:"#475569" },
    espn:   { label:"● ESPN live",        color:"#34d399" },
    cache:  { label:"⚠ cached data",      color:"#fbbf24" },
    none:   { label:"○ awaiting tip-off", color:"#475569" },
  }[dataSource]||{label:"—",color:"#475569"};

  const TABS = ["scoreboard","bracket","stats","history","insights"];
  const TAB_LABELS = { scoreboard:"Scoreboard", bracket:"Bracket", stats:"Stats", history:"History", insights:"Insights" };

  // ── Pre-tournament projected ranking
  const projRanking = [...MANAGERS].sort((a,b)=>getManagerProjPts(b)-getManagerProjPts(a));

  // ── Live/computed ranking for insights
  const insightsIsLive = insightsMode === "live" && scoringHasStarted;
  const rankingManagers = insightsIsLive
    ? [...MANAGERS].sort((a,b)=>getManagerLiveTotal(b,scores,eliminated)-getManagerLiveTotal(a,scores,eliminated))
    : [...MANAGERS].sort((a,b)=>getManagerProjPts(b)-getManagerProjPts(a));

  return (
    <div style={S.root}>
      <div style={S.bgGrid} />

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.eyebrow}>MARCH MADNESS 2026</div>
            <h1 style={S.title}>SHARPSHOOTER</h1>
            <div style={S.subtitle}>March Madness 2026 · Fantasy League</div>
          </div>
          <div style={S.headerRight}>
            {isLive && <div style={S.liveChip}><span style={S.liveDotEl}/>GAMES LIVE</div>}
            <div style={S.metaBlock}>
              <div style={S.metaRow}>
                <span style={S.metaLabel}>UPDATED</span>
                <span style={S.metaValue}>{formatTime(lastUpdated)}</span>
              </div>
              <div style={{...S.sourceLabel,color:sourceInfo.color}}>{sourceInfo.label}</div>
            </div>
            <button onClick={fetchScores} disabled={fetchStatus==="fetching"} style={S.refreshBtn}>
              {fetchStatus==="fetching"?"↻ Fetching...":"↻ Refresh"}
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={S.tabBar}>
          {TABS.map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{...S.tab, ...(activeTab===tab?S.tabActive:{})}}>
              {TAB_LABELS[tab]}
              {tab==="insights" && <span style={S.tabBadge}>NEW</span>}
            </button>
          ))}
        </div>
      </header>

      {/* ── TAB: SCOREBOARD ── */}
      {activeTab === "scoreboard" && (
        <main style={S.main}>
          {[...MANAGERS].sort((a,b)=>{
            const aT=Object.values(scores[a]||{}).reduce((s,p)=>s+(p.pts||0),0);
            const bT=Object.values(scores[b]||{}).reduce((s,p)=>s+(p.pts||0),0);
            return bT-aT;
          }).map((manager,rank)=>{
            const total = Object.values(scores[manager]||{}).reduce((s,p)=>s+(p.pts||0),0);
            const proj  = getManagerProjPts(manager);
            const pct   = proj>0?Math.round((total/proj)*100):0;
            const color = MANAGER_COLORS[manager];
            const isExp = expanded[manager];
            const players = ROSTERS[manager];
            const pScores = scores[manager]||{};
            const hasLive = players.some(p=>p.espnId&&livePlayerIds.has(p.espnId));
            return (
              <div key={manager} style={{...S.card,borderLeftColor:color}}>
                <div style={{...S.rank,background:rank===0?"#fbbf24":rank===1?"#94a3b8":rank===2?"#c97c3a":"#1e293b",color:rank<3?"#0f172a":"#94a3b8"}}>
                  #{rank+1}
                </div>
                <button onClick={()=>setExpanded(p=>({...p,[manager]:!p[manager]}))} style={S.cardBtn}>
                  <div style={S.cardLeft}>
                    <div style={{...S.dot,background:color}}/>
                    <div>
                      <div style={{...S.managerName,color}}>{manager}{hasLive&&<span style={S.liveTag}>● LIVE</span>}</div>
                      <div style={S.managerSub}>{players.length} players</div>
                    </div>
                  </div>
                  <div style={S.cardRight}>
                    <div style={S.ptsBlock}><div style={S.smallLabel}>PTS</div><div style={{...S.bigNum,color}}>{total}</div></div>
                    <div style={S.projBlock}><div style={S.smallLabel}>PROJ</div><div style={S.projNum}>{proj}</div><div style={{...S.pct,color:pct>=50?"#34d399":"#64748b"}}>{pct}%</div></div>
                    <div style={{...S.chevron,transform:isExp?"rotate(180deg)":"none"}}>▼</div>
                  </div>
                </button>
                <div style={S.bar}><div style={{...S.barFill,width:`${Math.min(pct,100)}%`,background:color}}/></div>
                {isExp&&(
                  <div style={S.playerList}>
                    <div style={S.listHeader}>
                      <span style={S.cName}>PLAYER</span><span style={S.cSchool}>SCHOOL</span>
                      <span style={S.cLast}>LAST</span><span style={S.cTotal}>TOTAL</span>
                      <span style={S.cProj}>PROJ</span><span style={S.cElim}>OUT</span>
                    </div>
                    {players.map(player=>{
                      const d=pScores[player.name]||{};
                      const pts=d.pts||0, last=d.lastGame||0, live=d.live===true;
                      const eKey=`${manager}::${player.name}`, isElim=eliminated[eKey];
                      return (
                        <div key={player.name} style={{...S.playerRow,opacity:isElim?0.38:1,background:live?"rgba(56,189,248,0.04)":"transparent"}}>
                          <span style={S.cName}>
                            {live&&<span style={S.liveDot2}>●</span>}
                            <span style={{textDecoration:isElim?"line-through":"none",color:isElim?"#475569":"#e2e8f0"}}>{player.name}</span>
                          </span>
                          <span style={{...S.cSchool,color:color+"88"}}>{player.school}</span>
                          <span style={{...S.cLast,color:live?"#38bdf8":"#64748b"}}>{last>0?(live?`${last}🔴`:last):"—"}</span>
                          <span style={{...S.cTotal,fontWeight:700,color:"#e2e8f0"}}>{pts}</span>
                          <span style={{...S.cProj,color:"#475569"}}>{player.projected}</span>
                          <span style={S.cElim}>
                            <button onClick={()=>toggleElim(manager,player.name)}
                              style={{...S.elimBtn,background:isElim?"#ef4444":"transparent",borderColor:isElim?"#ef4444":"#334155"}}>
                              {isElim?"✕":"○"}
                            </button>
                          </span>
                        </div>
                      );
                    })}
                    <div style={S.rowTotal}>
                      <span style={{color:"#475569",fontSize:10}}>TOTALS</span>
                      <span style={{color,fontWeight:800,fontSize:15,marginLeft:"auto"}}>{total} pts</span>
                      <span style={{color:"#334155",fontSize:11,marginLeft:10}}>/ {proj} proj</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={S.resetRow}>
            {!showReset
              ?<button onClick={()=>setShowReset(true)} style={S.resetBtn}>Reset All Scores</button>
              :<div style={S.resetConfirm}>
                <span style={{color:"#f43f5e",fontSize:13}}>⚠ Clear all saved data?</span>
                <button onClick={handleReset} style={{...S.resetBtn,background:"#ef4444",color:"#fff",borderColor:"#ef4444"}}>Yes, Reset</button>
                <button onClick={()=>setShowReset(false)} style={S.cancelBtn}>Cancel</button>
              </div>
            }
          </div>
          <div style={S.footer}>Polls ESPN tournament API (groups=50) every 60s · Only STATUS_FINAL + STATUS_IN_PROGRESS games · localStorage fallback on network failure</div>
        </main>
      )}

      {/* ── TABS: BRACKET / STATS / HISTORY (placeholders) ── */}
      {(activeTab==="bracket"||activeTab==="stats"||activeTab==="history") && (
        <main style={S.main}>
          <div style={S.placeholder}>
            <div style={S.placeholderIcon}>🏀</div>
            <div style={S.placeholderTitle}>{TAB_LABELS[activeTab]}</div>
            <div style={S.placeholderSub}>Coming soon</div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ── TAB: INSIGHTS ──
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "insights" && (
        <InsightsTab
          scores={scores}
          eliminated={eliminated}
          isLive={insightsIsLive}
          insightsMode={insightsMode}
          setInsightsMode={setInsightsMode}
          scoringHasStarted={scoringHasStarted}
          projRanking={projRanking}
          rankingManagers={rankingManagers}
          h2hOpen={h2hOpen}
          setH2hOpen={setH2hOpen}
        />
      )}
    </div>
  );
}

// ─── INSIGHTS TAB COMPONENT ────────────────────────────────────────────────
function InsightsTab({ scores, eliminated, isLive, insightsMode, setInsightsMode, scoringHasStarted, projRanking, rankingManagers, h2hOpen, setH2hOpen }) {
  const lv = isLive;

  // Computed pts for the active mode
  const getMgrPts = (m) => lv
    ? getManagerLiveTotal(m, scores, eliminated)
    : getManagerProjPts(m);

  const maxPts = Math.max(...MANAGERS.map(getMgrPts));

  // Live ceiling/floor
  const getCF = (m) => lv
    ? getManagerCeilingFloor(m, scores, eliminated)
    : STATIC_RANGES[m];

  const allCeilings = MANAGERS.map(m=>getCF(m).ceiling);
  const maxCeiling = Math.max(...allCeilings,1);

  // H2H pts (live = actual + est remaining; pre = projected total)
  const getH2HPts = (m) => lv
    ? getManagerLiveTotal(m, scores, eliminated)
    : getManagerProjPts(m);

  // H2H breakdown detail
  const getH2HDetail = (m) => {
    const actual = Object.values(scores[m]||{}).reduce((s,p)=>s+(p.pts||0),0);
    const estRem = ROSTERS[m].reduce((s,p)=>{
      if(eliminated[`${m}::${p.name}`]) return s;
      return s+Math.max(0,p.projected-(scores[m]?.[p.name]?.pts||0));
    },0);
    return { actual, estRem };
  };

  return (
    <main style={S.main}>
      {/* ── INFO BANNER ── */}
      <div style={I.banner}>
        <span style={I.bannerIcon}>ℹ</span>
        <span style={I.bannerText}>
          All projections are pre-tournament estimates based on PPG × seed-adjusted expected games. Actual results will vary. Live rankings update automatically once tournament scoring begins.
        </span>
      </div>

      {/* ── MODE TOGGLE ── */}
      <div style={I.modeBar}>
        <button
          onClick={()=>setInsightsMode("pre")}
          style={{...I.modeBtn,...(insightsMode==="pre"?I.modeBtnActive:{})}}>
          Pre-Tournament
        </button>
        <div style={I.modeDivider}/>
        <button
          onClick={()=>{ if(scoringHasStarted) setInsightsMode("live"); }}
          style={{...I.modeBtn,...(insightsMode==="live"?I.modeBtnActiveLive:{}),opacity:scoringHasStarted?1:0.4,cursor:scoringHasStarted?"pointer":"not-allowed"}}>
          {insightsMode==="live"&&scoringHasStarted&&<span style={I.livePulse}>●</span>}
          Live
        </button>
        {!scoringHasStarted && <span style={I.modeHint}>Activates when scoring begins</span>}
      </div>

      {/* ══ SECTION 1: POWER RANKINGS ══ */}
      <Section title="Power Rankings" icon="🏆">
        {rankingManagers.map((manager, rank) => {
          const pts = getMgrPts(manager);
          const pct = maxPts>0?Math.round((pts/maxPts)*100):0;
          const color = MANAGER_COLORS[manager];
          const projRank = projRanking.indexOf(manager);
          const rankDelta = lv ? (projRank - rank) : null; // positive = moved up

          return (
            <div key={manager} style={I.prCard}>
              <div style={{...I.prRank, background:rank===0?"#fbbf24":rank===1?"#94a3b8":rank===2?"#c97c3a":"#1e293b",color:rank<3?"#0f172a":"#94a3b8"}}>
                {rank+1}
              </div>
              <div style={I.prBody}>
                <div style={I.prTop}>
                  <div style={I.prLeft}>
                    <span style={{...I.prName,color}}>{manager}</span>
                    {lv && rankDelta!==null && rankDelta!==0 && (
                      <span style={{...I.delta,color:rankDelta>0?"#34d399":"#f43f5e"}}>
                        {rankDelta>0?"▲":"▼"}{Math.abs(rankDelta)}
                      </span>
                    )}
                    {lv && rankDelta===0 && <span style={{...I.delta,color:"#64748b"}}>—</span>}
                  </div>
                  <div style={I.prPtsGroup}>
                    <span style={{...I.prPts,color}}>{pts}</span>
                    <span style={I.prPtsLabel}>{lv?"live":"proj"}</span>
                  </div>
                </div>
                <div style={I.prBarTrack}>
                  <div style={{...I.prBarFill,width:`${pct}%`,background:color}}/>
                </div>
                <div style={I.prScout}>{SCOUTING[manager]}</div>
              </div>
            </div>
          );
        })}
      </Section>

      {/* ══ SECTION 2: SEED DISTRIBUTION ══ */}
      <Section title="Seed Distribution" icon="🌱">
        {/* Legend */}
        <div style={I.seedLegend}>
          {SEED_TIERS.map(t=>(
            <div key={t.label} style={I.seedLegendItem}>
              <div style={{width:10,height:10,borderRadius:"50%",background:t.color,flexShrink:0}}/>
              <span style={{fontSize:10,color:"#64748b"}}>{t.label}</span>
            </div>
          ))}
        </div>
        {MANAGERS.map(manager=>{
          const color=MANAGER_COLORS[manager];
          const players=ROSTERS[manager];
          const activeCt=players.filter(p=>!eliminated[`${manager}::${p.name}`]).length;
          return (
            <div key={manager} style={I.sdRow}>
              <div style={{...I.sdName,color}}>{manager}</div>
              <div style={I.sdDots}>
                {players.map((p,i)=>{
                  const tier=getTierForSeed(p.seed);
                  const isElim=eliminated[`${manager}::${p.name}`]||false;
                  return (
                    <div key={i} title={`${p.name} (${p.school}) — Seed ${p.seed}${isElim?" [ELIM]":""}`}
                      style={{...I.dot,background:isElim?"#1e293b":tier.color,border:isElim?`1px solid ${tier.color}44`:`1px solid ${tier.color}`,opacity:isElim?0.35:1}}>
                    </div>
                  );
                })}
              </div>
              <div style={I.sdActive}>
                <span style={{color:activeCt>0?"#34d399":"#ef4444",fontWeight:700}}>{activeCt}</span>
                <span style={{color:"#475569",fontSize:9}}> active</span>
              </div>
            </div>
          );
        })}
      </Section>

      {/* ══ SECTION 3: REGIONAL COVERAGE ══ */}
      <Section title="Regional Coverage" icon="🗺️">
        <div style={I.regionGrid}>
          {REGIONS.map(region=>{
            const rc=REGION_COLORS[region];
            return (
              <div key={region} style={{...I.regionCard,borderColor:rc+"44"}}>
                <div style={{...I.regionTitle,color:rc}}>{region}</div>
                {MANAGERS.map(manager=>{
                  const regionPlayers=ROSTERS[manager].filter(p=>p.region===region);
                  if(regionPlayers.length===0){
                    return (
                      <div key={manager} style={I.regionRow}>
                        <span style={{...I.regionMgrName,color:MANAGER_COLORS[manager]+"88"}}>{manager}</span>
                        <span style={I.regionNone}>none ⚠️</span>
                      </div>
                    );
                  }
                  const activeCt=regionPlayers.filter(p=>!eliminated[`${manager}::${p.name}`]).length;
                  return (
                    <div key={manager} style={I.regionRow}>
                      <span style={{...I.regionMgrName,color:MANAGER_COLORS[manager]}}>{manager}</span>
                      <div style={I.regionPlayerDots}>
                        {regionPlayers.map((p,i)=>{
                          const isElim=eliminated[`${manager}::${p.name}`]||false;
                          return (
                            <div key={i} title={`${p.name}${isElim?" [ELIM]":""}`}
                              style={{...I.regionDot,background:isElim?"#1e293b":MANAGER_COLORS[manager],border:`1px solid ${MANAGER_COLORS[manager]}${isElim?"33":""}`,opacity:isElim?0.3:1}}>
                            </div>
                          );
                        })}
                      </div>
                      {lv&&<span style={{fontSize:10,color:activeCt>0?"#64748b":"#ef4444",marginLeft:4}}>{activeCt} active</span>}
                      {!lv&&<span style={{fontSize:10,color:"#64748b",marginLeft:4}}>{regionPlayers.length}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ══ SECTION 4: CEILING VS FLOOR ══ */}
      <Section title="Ceiling vs Floor" icon="📊">
        {MANAGERS.map(manager=>{
          const color=MANAGER_COLORS[manager];
          const {floor,ceiling}=getCF(manager);
          const floorPct=maxCeiling>0?(floor/maxCeiling)*100:0;
          const ceilPct=maxCeiling>0?(ceiling/maxCeiling)*100:100;
          const rangePct=ceilPct-floorPct;
          return (
            <div key={manager} style={I.cfRow}>
              <div style={{...I.cfName,color}}>{manager}</div>
              <div style={I.cfBarWrap}>
                <div style={I.cfTrack}>
                  <div style={{...I.cfFill,left:`${floorPct}%`,width:`${Math.max(rangePct,1)}%`,background:`linear-gradient(90deg,${color}66,${color})`}}/>
                  {/* floor marker */}
                  <div style={{...I.cfMarker,left:`${floorPct}%`,background:color+"88"}}/>
                  {/* ceiling marker */}
                  <div style={{...I.cfMarker,left:`${Math.min(ceilPct,99.5)}%`,background:color}}/>
                </div>
              </div>
              <div style={I.cfNums}>
                <span style={{color:color+"88",fontSize:11}}>{lv?"live":""}<b style={{color:color+"cc"}}> {floor}</b></span>
                <span style={{color:"#334155",fontSize:11,margin:"0 4px"}}>–</span>
                <span style={{color,fontSize:11}}><b>{ceiling}</b>{lv?<span style={{color:"#475569",fontSize:9}}> est</span>:<span style={{color:"#475569",fontSize:9}}> proj</span>}</span>
              </div>
            </div>
          );
        })}
        <div style={{marginTop:8,fontSize:10,color:"#334155",textAlign:"center"}}>
          {lv?"Floor = actual pts scored · Ceiling = actual + est remaining for active players":"Static pre-tournament estimates based on seed advancement probability"}
        </div>
      </Section>

      {/* ══ SECTION 5: HEAD TO HEAD ══ */}
      <Section title="Head to Head" icon="⚔️">
        <div style={{overflowX:"auto"}}>
          <table style={I.h2hTable}>
            <thead>
              <tr>
                <th style={I.h2hTh}></th>
                {MANAGERS.map(m=>(
                  <th key={m} style={{...I.h2hTh,color:MANAGER_COLORS[m]}}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MANAGERS.map((rowM,ri)=>(
                <tr key={rowM}>
                  <td style={{...I.h2hTd,color:MANAGER_COLORS[rowM],fontWeight:800,fontSize:12,whiteSpace:"nowrap"}}>{rowM}</td>
                  {MANAGERS.map((colM,ci)=>{
                    if(rowM===colM) return <td key={colM} style={{...I.h2hTd,...I.h2hDiag}}>—</td>;
                    const rowPts=getH2HPts(rowM), colPts=getH2HPts(colM);
                    const diff=rowPts-colPts;
                    const isOpen=h2hOpen&&h2hOpen.row===rowM&&h2hOpen.col===colM;
                    return (
                      <td key={colM} style={{...I.h2hTd,cursor:"pointer"}}
                        onClick={()=>setH2hOpen(isOpen?null:{row:rowM,col:colM})}>
                        <div style={{...I.h2hCell,background:diff>0?"rgba(52,211,153,0.12)":"rgba(244,63,94,0.12)",color:diff>0?"#34d399":"#f43f5e",border:`1px solid ${diff>0?"rgba(52,211,153,0.25)":"rgba(244,63,94,0.25)"}`}}>
                          {diff>0?"+":""}{diff}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* H2H Expanded Detail */}
        {h2hOpen && (()=>{
          const{row,col}=h2hOpen;
          const rdR=getH2HDetail(row), rdC=getH2HDetail(col);
          const totalR=getH2HPts(row), totalC=getH2HPts(col);
          const diff=totalR-totalC;
          return (
            <div style={I.h2hDetail}>
              <div style={I.h2hDetailHeader}>
                <span style={{color:MANAGER_COLORS[row],fontWeight:800}}>{row}</span>
                <span style={{color:diff>0?"#34d399":"#f43f5e",fontSize:18,fontWeight:900}}>{diff>0?"+":""}{diff}</span>
                <span style={{color:MANAGER_COLORS[col],fontWeight:800}}>{col}</span>
              </div>
              <div style={I.h2hDetailRow}>
                <DetailCol manager={row} data={rdR} total={totalR} isLive={lv}/>
                <div style={{width:1,background:"#1e293b",margin:"0 8px"}}/>
                <DetailCol manager={col} data={rdC} total={totalC} isLive={lv}/>
              </div>
              <button onClick={()=>setH2hOpen(null)} style={I.h2hClose}>Close ✕</button>
            </div>
          );
        })()}
        <div style={{fontSize:10,color:"#334155",textAlign:"center",marginTop:8}}>
          {lv?"Values = actual pts + est remaining for active players · Click any cell for breakdown":"Values = projected totals · Click any cell for breakdown"}
        </div>
      </Section>
    </main>
  );
}

function DetailCol({ manager, data, total, isLive }) {
  const color = MANAGER_COLORS[manager];
  return (
    <div style={{flex:1,minWidth:0}}>
      <div style={{color,fontWeight:700,fontSize:13,marginBottom:6}}>{manager}</div>
      {isLive && (
        <div style={{fontSize:12,color:"#94a3b8",marginBottom:2}}>
          <span style={{color:"#34d399"}}>● {data.actual}</span> <span style={{color:"#475569",fontSize:10}}>live</span>
        </div>
      )}
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:4}}>
        <span style={{color:"#64748b"}}>+ {data.estRem}</span> <span style={{color:"#334155",fontSize:10}}>est</span>
      </div>
      <div style={{borderTop:"1px solid #1e293b",paddingTop:4,fontSize:13,fontWeight:800,color}}>
        {total} total
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={I.section}>
      <div style={I.sectionHeader}>
        <span style={I.sectionIcon}>{icon}</span>
        <span style={I.sectionTitle}>{title}</span>
      </div>
      <div style={I.sectionBody}>{children}</div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  root:       { minHeight:"100vh", background:"#080f1e", fontFamily:"'Barlow Condensed','Impact',sans-serif", color:"#e2e8f0", position:"relative", overflowX:"hidden" },
  bgGrid:     { position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 },
  header:     { position:"sticky", top:0, zIndex:100, background:"rgba(8,15,30,0.97)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(56,189,248,0.10)", padding:"12px 16px 0" },
  headerTop:  { display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap", paddingBottom:10 },
  eyebrow:    { fontSize:10, letterSpacing:"0.2em", color:"#38bdf8", fontWeight:600 },
  title:      { margin:0, fontSize:28, fontWeight:900, letterSpacing:"0.05em", color:"#f1f5f9", lineHeight:1, textTransform:"uppercase" },
  subtitle:   { fontSize:11, color:"#64748b", letterSpacing:"0.1em", marginTop:2 },
  headerRight:{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 },
  liveChip:   { display:"flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:4, padding:"3px 8px", fontSize:10, fontWeight:700, color:"#ef4444", letterSpacing:"0.12em" },
  liveDotEl:  { width:7, height:7, borderRadius:"50%", background:"#ef4444" },
  metaBlock:  { textAlign:"right" },
  metaRow:    { display:"flex", gap:5, alignItems:"baseline", justifyContent:"flex-end" },
  metaLabel:  { fontSize:9, color:"#475569", letterSpacing:"0.12em" },
  metaValue:  { fontSize:12, color:"#94a3b8", fontWeight:600 },
  sourceLabel:{ fontSize:9, letterSpacing:"0.08em", fontWeight:700 },
  refreshBtn: { background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.22)", color:"#38bdf8", borderRadius:4, padding:"5px 12px", fontSize:12, cursor:"pointer", fontWeight:700, letterSpacing:"0.05em" },
  tabBar:     { display:"flex", gap:0, marginTop:0, borderTop:"1px solid rgba(255,255,255,0.05)" },
  tab:        { flex:1, background:"none", border:"none", borderBottom:"2px solid transparent", color:"#475569", fontSize:12, fontWeight:700, padding:"10px 4px", cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", gap:4 },
  tabActive:  { color:"#38bdf8", borderBottomColor:"#38bdf8" },
  tabBadge:   { fontSize:8, background:"#f97316", color:"#fff", borderRadius:3, padding:"1px 4px", letterSpacing:"0.05em" },
  main:       { position:"relative", zIndex:1, padding:"12px 12px 40px", maxWidth:640, margin:"0 auto", display:"flex", flexDirection:"column", gap:10 },
  card:       { background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.06)", borderLeft:"3px solid transparent", borderRadius:8, overflow:"hidden", position:"relative" },
  rank:       { position:"absolute", top:10, right:12, borderRadius:4, padding:"2px 7px", fontSize:11, fontWeight:900, letterSpacing:"0.05em" },
  cardBtn:    { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px 8px", width:"100%", background:"none", border:"none", cursor:"pointer", color:"inherit", textAlign:"left", gap:8 },
  cardLeft:   { display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 },
  dot:        { width:10, height:10, borderRadius:"50%", flexShrink:0 },
  managerName:{ fontSize:20, fontWeight:800, letterSpacing:"0.04em", lineHeight:1, textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 },
  liveTag:    { fontSize:9, color:"#ef4444", fontWeight:700, letterSpacing:"0.1em" },
  managerSub: { fontSize:10, color:"#475569", letterSpacing:"0.08em", marginTop:2 },
  cardRight:  { display:"flex", alignItems:"center", gap:14, flexShrink:0 },
  ptsBlock:   { textAlign:"right" },
  smallLabel: { fontSize:8, color:"#475569", letterSpacing:"0.12em" },
  bigNum:     { fontSize:26, fontWeight:900, lineHeight:1 },
  projBlock:  { textAlign:"right" },
  projNum:    { fontSize:14, color:"#64748b", fontWeight:700, lineHeight:1 },
  pct:        { fontSize:10, fontWeight:700 },
  chevron:    { fontSize:10, color:"#475569", transition:"transform 0.2s", flexShrink:0 },
  bar:        { height:2, background:"rgba(255,255,255,0.05)" },
  barFill:    { height:"100%", borderRadius:1, transition:"width 0.6s ease" },
  playerList: { padding:"0 14px 12px", borderTop:"1px solid rgba(255,255,255,0.04)" },
  listHeader: { display:"grid", gridTemplateColumns:"1fr 70px 44px 44px 40px 32px", padding:"8px 0 4px", fontSize:9, color:"#475569", letterSpacing:"0.1em", fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.05)", marginBottom:2 },
  cName:      { overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:4 },
  cSchool:    { textAlign:"center", fontSize:11 },
  cLast:      { textAlign:"center", fontSize:12, fontWeight:700 },
  cTotal:     { textAlign:"center", fontSize:14 },
  cProj:      { textAlign:"center", fontSize:11 },
  cElim:      { textAlign:"center" },
  playerRow:  { display:"grid", gridTemplateColumns:"1fr 70px 44px 44px 40px 32px", padding:"6px 0", fontSize:12, borderBottom:"1px solid rgba(255,255,255,0.03)", alignItems:"center" },
  liveDot2:   { color:"#ef4444", fontSize:8, flexShrink:0 },
  rowTotal:   { display:"flex", alignItems:"center", padding:"8px 0 0", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:4, gap:4, fontSize:12 },
  elimBtn:    { width:22, height:22, borderRadius:4, border:"1px solid", cursor:"pointer", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", padding:0 },
  resetRow:   { padding:"8px 0", display:"flex", justifyContent:"center" },
  resetBtn:   { background:"transparent", border:"1px solid #334155", color:"#64748b", borderRadius:4, padding:"8px 20px", fontSize:12, cursor:"pointer", letterSpacing:"0.08em", fontWeight:600 },
  resetConfirm:{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"12px 20px" },
  cancelBtn:  { background:"transparent", border:"1px solid #334155", color:"#94a3b8", borderRadius:4, padding:"6px 16px", fontSize:12, cursor:"pointer" },
  footer:     { textAlign:"center", fontSize:9, color:"#1e293b", letterSpacing:"0.05em", padding:"8px 0", lineHeight:1.6 },
  placeholder:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", gap:12 },
  placeholderIcon:{ fontSize:40 },
  placeholderTitle:{ fontSize:22, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:"0.08em" },
  placeholderSub:{ fontSize:13, color:"#1e293b", letterSpacing:"0.1em" },
};

// Insights styles
const I = {
  banner:       { display:"flex", alignItems:"flex-start", gap:10, background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.18)", borderRadius:8, padding:"10px 14px" },
  bannerIcon:   { fontSize:14, color:"#38bdf8", flexShrink:0, marginTop:1 },
  bannerText:   { fontSize:11, color:"#64748b", lineHeight:1.5, letterSpacing:"0.01em" },
  modeBar:      { display:"flex", alignItems:"center", gap:0, background:"rgba(15,23,42,0.8)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:4, flexWrap:"wrap" },
  modeBtn:      { flex:1, background:"transparent", border:"none", color:"#475569", fontSize:13, fontWeight:700, padding:"8px 16px", borderRadius:6, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  modeBtnActive:{ background:"rgba(255,255,255,0.06)", color:"#e2e8f0" },
  modeBtnActiveLive:{ background:"rgba(239,68,68,0.12)", color:"#ef4444" },
  modeDivider:  { width:1, height:28, background:"rgba(255,255,255,0.07)", flexShrink:0 },
  modeHint:     { fontSize:10, color:"#334155", letterSpacing:"0.06em", padding:"0 8px", flexBasis:"100%", textAlign:"center", paddingBottom:4 },
  livePulse:    { fontSize:8, color:"#ef4444" },
  section:      { background:"rgba(15,23,42,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, overflow:"hidden" },
  sectionHeader:{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.05)" },
  sectionIcon:  { fontSize:16 },
  sectionTitle: { fontSize:14, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94a3b8" },
  sectionBody:  { padding:"12px 14px 14px", display:"flex", flexDirection:"column", gap:10 },
  // Power Rankings
  prCard:       { display:"flex", alignItems:"flex-start", gap:10 },
  prRank:       { width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, flexShrink:0, marginTop:2 },
  prBody:       { flex:1, minWidth:0 },
  prTop:        { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 },
  prLeft:       { display:"flex", alignItems:"center", gap:8 },
  prName:       { fontSize:18, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" },
  delta:        { fontSize:13, fontWeight:700 },
  prPtsGroup:   { display:"flex", alignItems:"baseline", gap:4 },
  prPts:        { fontSize:20, fontWeight:900, lineHeight:1 },
  prPtsLabel:   { fontSize:9, color:"#475569", letterSpacing:"0.1em" },
  prBarTrack:   { height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, marginBottom:6 },
  prBarFill:    { height:"100%", borderRadius:2, transition:"width 0.6s ease" },
  prScout:      { fontSize:11, color:"#64748b", lineHeight:1.4, letterSpacing:"0.01em" },
  // Seed distribution
  seedLegend:   { display:"flex", flexWrap:"wrap", gap:"6px 12px", paddingBottom:8, borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:6 },
  seedLegendItem:{ display:"flex", alignItems:"center", gap:5 },
  sdRow:        { display:"flex", alignItems:"center", gap:10 },
  sdName:       { width:44, fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", flexShrink:0 },
  sdDots:       { display:"flex", gap:5, flex:1, flexWrap:"wrap" },
  dot:          { width:14, height:14, borderRadius:"50%", flexShrink:0, cursor:"default" },
  sdActive:     { fontSize:11, flexShrink:0, minWidth:52, textAlign:"right" },
  // Regional
  regionGrid:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  regionCard:   { background:"rgba(8,15,30,0.6)", border:"1px solid", borderRadius:8, padding:"10px 12px", display:"flex", flexDirection:"column", gap:5 },
  regionTitle:  { fontSize:13, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 },
  regionRow:    { display:"flex", alignItems:"center", gap:6 },
  regionMgrName:{ fontSize:12, fontWeight:700, textTransform:"uppercase", width:40, flexShrink:0 },
  regionNone:   { fontSize:10, color:"#ef4444", letterSpacing:"0.04em" },
  regionPlayerDots:{ display:"flex", gap:3, flexWrap:"wrap" },
  regionDot:    { width:10, height:10, borderRadius:"50%", flexShrink:0 },
  // Ceiling / Floor
  cfRow:        { display:"flex", alignItems:"center", gap:10 },
  cfName:       { width:44, fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", flexShrink:0 },
  cfBarWrap:    { flex:1 },
  cfTrack:      { height:8, background:"rgba(255,255,255,0.04)", borderRadius:4, position:"relative" },
  cfFill:       { position:"absolute", top:0, height:"100%", borderRadius:4, transition:"all 0.5s ease" },
  cfMarker:     { position:"absolute", top:-2, width:4, height:12, borderRadius:2, transform:"translateX(-50%)" },
  cfNums:       { display:"flex", alignItems:"center", minWidth:110, justifyContent:"flex-end" },
  // H2H
  h2hTable:     { borderCollapse:"collapse", width:"100%", fontSize:11 },
  h2hTh:        { padding:"6px 4px", textAlign:"center", fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:"#64748b", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap" },
  h2hTd:        { padding:"3px 2px", textAlign:"center", verticalAlign:"middle" },
  h2hDiag:      { background:"rgba(255,255,255,0.02)", color:"#334155" },
  h2hCell:      { borderRadius:4, padding:"4px 3px", fontSize:11, fontWeight:700, minWidth:36, display:"inline-block" },
  h2hDetail:    { marginTop:12, background:"rgba(8,15,30,0.8)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"14px" },
  h2hDetailHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, fontSize:15, fontWeight:800 },
  h2hDetailRow: { display:"flex", gap:0 },
  h2hClose:     { marginTop:12, width:"100%", background:"transparent", border:"1px solid #1e293b", color:"#475569", borderRadius:4, padding:"6px", fontSize:11, cursor:"pointer", letterSpacing:"0.06em" },
};
