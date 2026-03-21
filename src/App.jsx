import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── ROSTER DATA ─────────────────────────────────────────────────────────────
// espnId = player ID, teamId = ESPN team ID for auto-elimination tracking
const ROSTERS = {
  Trent: [
    { name: "Brayden Burries",      school: "Arizona",    espnId: "5082206",  teamId: "12",   projected: 88,  seed: 1,  region: "West"    },
    { name: "Dominique Daniels Jr", school: "Cal Baptist",espnId: "5178207",  teamId: "2072", projected: 23,  seed: 13, region: "East"    },
    { name: "Darius Acuff Jr",      school: "Arkansas",   espnId: "5142620",  teamId: "8",    projected: 68,  seed: 4,  region: "West"    },
    { name: "Larry Johnson",        school: "McNeese",    espnId: "5144375",  teamId: "2377", projected: 26,  seed: 12, region: "South"   },
    { name: "Joshua Jefferson",     school: "Iowa State", espnId: "4870564",  teamId: "66",   projected: 76,  seed: 2,  region: "Midwest" },
    { name: "Ja'Kobi Gillespie",    school: "Tennessee",  espnId: "5107968",  teamId: "2633", projected: 45,  seed: 6,  region: "Midwest" },
    { name: "Emmanuel Sharp",       school: "Houston",    espnId: "5106058",  teamId: "248",  projected: 69,  seed: 2,  region: "South"   },
    { name: "Tyler Tanner",         school: "Vanderbilt", espnId: "5187600",  teamId: "238",  projected: 48,  seed: 5,  region: "South"   },
  ],
  JB: [
    { name: "Cam Boozer",           school: "Duke",       espnId: "5041935",  teamId: "150",  projected: 125, seed: 1,  region: "East"    },
    { name: "Damari Wheeler",       school: "NDSU",       espnId: "5107273",  teamId: "2449", projected: 14,  seed: 14, region: "East"    },
    { name: "Keaton Wagler",        school: "Illinois",   espnId: "5254165",  teamId: "356",  projected: 63,  seed: 3,  region: "South"   },
    { name: "John Mobley Jr",       school: "Ohio State", espnId: "5060708",  teamId: "194",  projected: 20,  seed: 8,  region: "East"    },
    { name: "Jaden Bradley",        school: "Arizona",    espnId: "4432737",  teamId: "12",   projected: 74,  seed: 1,  region: "West"    },
    { name: "Ryan Conwell",         school: "Louisville", espnId: "5107157",  teamId: "97",   projected: 47,  seed: 6,  region: "East"    },
    { name: "Elliot Cadeau",        school: "Michigan",   espnId: "4869764",  teamId: "130",  projected: 69,  seed: 1,  region: "Midwest" },
    { name: "Mirkovic",             school: "Illinois",   espnId: "5311832",  teamId: "356",  projected: 39,  seed: 3,  region: "South"   },
  ],
  Kelly: [
    { name: "Thomas Haugh",         school: "Florida",    espnId: "5080489",  teamId: "57",   projected: 94,  seed: 1,  region: "South"   },
    { name: "Cruz Davis",           school: "Hofstra",    espnId: "5107198",  teamId: "2293", projected: 20,  seed: 13, region: "Midwest" },
    { name: "AJ Dybantsa",          school: "BYU",        espnId: "5142718",  teamId: "252",  projected: 63,  seed: 6,  region: "West"    },
    { name: "Jeremiah Wilkinson",   school: "Georgia",    espnId: "5165276",  teamId: "61",   projected: 26,  seed: 8,  region: "Midwest" },
    { name: "Graham Ike",           school: "Gonzaga",    espnId: "4703396",  teamId: "2250", projected: 69,  seed: 3,  region: "West"    },
    { name: "Tyler Bilodeau",       school: "UCLA",       espnId: "5105626",  teamId: "26",   projected: 28,  seed: 7,  region: "East"    },
    { name: "Meleek Thomas",        school: "Arkansas",   espnId: "5041951",  teamId: "8",    projected: 43,  seed: 4,  region: "West"    },
    { name: "Pryce Sandfort",       school: "Nebraska",   espnId: "4858604",  teamId: "158",  projected: 25,  seed: 4,  region: "West"    },
  ],
  Pat: [
    { name: "Yaxel Lendeborg",      school: "Michigan",   espnId: "5175737",  teamId: "130",  projected: 79,  seed: 1,  region: "Midwest" },
    { name: "Preston Edmead",       school: "Hofstra",    espnId: "5236222",  teamId: "2293", projected: 10,  seed: 13, region: "Midwest" },
    { name: "Koa Peat",             school: "Arizona",    espnId: "5041953",  teamId: "12",   projected: 75,  seed: 1,  region: "West"    },
    { name: "Bruce Thornton",       school: "Ohio State", espnId: "5105837",  teamId: "194",  projected: 30,  seed: 8,  region: "East"    },
    { name: "Andrej Stojakovic",    school: "Illinois",   espnId: "5175007",  teamId: "356",  projected: 47,  seed: 3,  region: "South"   },
    { name: "Nate Ament",           school: "Tennessee",  espnId: "5164559",  teamId: "2633", projected: 44,  seed: 6,  region: "Midwest" },
    { name: "Alex Karaban",         school: "UConn",      espnId: "4917149",  teamId: "41",   projected: 54,  seed: 2,  region: "East"    },
    { name: "Labaron Philon Jr",    school: "Alabama",    espnId: "4873090",  teamId: "333",  projected: 65,  seed: 4,  region: "Midwest" },
  ],
  Ben: [
    { name: "Kingston Flemings",    school: "Houston",    espnId: "5149077",  teamId: "248",  projected: 74,  seed: 2,  region: "South"   },
    { name: "TJ Power",             school: "Penn",       espnId: "4684843",  teamId: "219",  projected: 17,  seed: 14, region: "South"   },
    { name: "Isaiah Evans",         school: "Duke",       espnId: "5061585",  teamId: "150",  projected: 51,  seed: 1,  region: "East"    },
    { name: "Bennett Stirtz",       school: "Iowa",       espnId: "5241364",  teamId: "2294", projected: 30,  seed: 9,  region: "South"   },
    { name: "Jeremy Fears",         school: "MSU",        espnId: "4711255",  teamId: "127",  projected: 55,  seed: 3,  region: "East"    },
    { name: "Malik Reneau",         school: "Miami",      espnId: "5105798",  teamId: "2390", projected: 37,  seed: 7,  region: "West"    },
    { name: "Fletcher Loyer",       school: "Purdue",     espnId: "5105853",  teamId: "2509", projected: 61,  seed: 2,  region: "West"    },
    { name: "Nick Boyd",            school: "Wisconsin",  espnId: "4702654",  teamId: "275",  projected: 18,  seed: 5,  region: "West"    },
  ],
  Berit: [
    { name: "Alex Condon",          school: "Florida",    espnId: "5174657",  teamId: "57",   projected: 66,  seed: 1,  region: "South"   },
    { name: "Thomas Dowd",          school: "Troy",       espnId: "5176732",  teamId: "2653", projected: 15,  seed: 16, region: "Midwest" },
    { name: "Milan Momcilovic",     school: "Iowa State", espnId: "4848637",  teamId: "66",   projected: 77,  seed: 2,  region: "Midwest" },
    { name: "Mark Mitchell",        school: "Missouri",   espnId: "4433285",  teamId: "142",  projected: 27,  seed: 10, region: "West"    },
    { name: "Morez Johnson Jr",     school: "Michigan",   espnId: "4873153",  teamId: "130",  projected: 62,  seed: 1,  region: "Midwest" },
    { name: "Dailyn Swain",         school: "Texas",      espnId: "4848625",  teamId: "251",  projected: 46,  seed: 11, region: "West"    },
    { name: "Tarris Reed",          school: "UConn",      espnId: "5105809",  teamId: "41",   projected: 50,  seed: 2,  region: "East"    },
    { name: "Daryn Peterson",       school: "Kansas",     espnId: "5041955",  teamId: "2305", projected: 59,  seed: 4,  region: "East"    },
  ],
};

const MANAGER_COLORS = {
  Trent: "#38bdf8", JB: "#f97316", Kelly: "#a78bfa",
  Pat: "#34d399",   Ben: "#f43f5e", Berit: "#fbbf24",
};

const SCOUTING = {
  Trent: "Two seed-2 studs (Jefferson + Sharp) anchor the South/Midwest. No seed-1s but high floor with Burries and Acuff.",
  JB:    "Two seed-1s (Boozer + Cadeau) give the highest upside. Wagler + Mirkovic double-stack Illinois as a bonus.",
  Kelly: "Heavy West Region presence (Ike, Thomas, Sandfort, Dybantsa). Sole seed-1 is Haugh; Dybantsa eliminated R1.",
  Pat:   "Best defensive wall in the draft — Lendeborg + Karaban + Philon Jr cover three regions. Ament is a sleeper.",
  Ben:   "Seed-1 Evans + seed-2 pair (Fears + Loyer/Purdue) gives East/West power. Needs Duke and Purdue to run deep.",
  Berit: "Two seed-1s (Condon + Morez Johnson) plus Momcilovic and Peterson — strongest late-round ceiling in the field.",
};


const SEED_TIERS = [
  { label: "Seed 1",    seeds: [1],            color: "#f59e0b" },
  { label: "Seed 2",    seeds: [2],            color: "#38bdf8" },
  { label: "Seed 3–4",  seeds: [3,4],          color: "#a78bfa" },
  { label: "Seed 5–7",  seeds: [5,6,7],        color: "#34d399" },
  { label: "Seed 8–12", seeds: [8,9,10,11,12], color: "#64748b" },
  { label: "Seed 13+",  seeds: [13,14,15,16],  color: "#334155" },
];

const REGIONS = ["West","East","South","Midwest"];
const REGION_COLORS = { West:"#3b82f6", East:"#ef4444", South:"#22c55e", Midwest:"#a855f7" };
const MANAGERS = Object.keys(ROSTERS);

// Round label map — used to label per-game scores
const ROUND_LABELS = ["R1","R2","R3","R4","R5","R6"];

// Build a flat lookup: espnId -> player info, for fast scoring
const ESPN_ID_MAP = {};
for (const [manager, players] of Object.entries(ROSTERS)) {
  for (const player of players) {
    if (player.espnId) ESPN_ID_MAP[player.espnId] = { manager, name: player.name };
  }
}

// ─── LOCALSTORAGE ─────────────────────────────────────────────────────────────
const LS_KEY     = "mm2026_scores_v7";
const STALE_KEYS = [
  "mm2026_scores","mm2026_scores_v2","mm2026_scores_v3","mm2026_scores_v4","mm2026_scores_v5","mm2026_scores_v6",
  "mm2026_eliminated","mm2026_eliminated_v2","mm2026_eliminated_v3","mm2026_eliminated_v4"
];

// Confirmed R1 scores manually seeded so points survive ESPN scoreboard expiry.
// R1_THU = Thursday March 19, R1_FRI = Friday March 20.
// Zero = player didn't score / didn't play that day.
const R1_THU = {
  Trent: { "Brayden Burries": 0, "Dominique Daniels Jr": 0, "Darius Acuff Jr": 24, "Larry Johnson": 15, "Joshua Jefferson": 0, "Ja'Kobi Gillespie": 0, "Emmanuel Sharp": 16, "Tyler Tanner": 26 },
  JB:    { "Cam Boozer": 22, "Damari Wheeler": 16, "Keaton Wagler": 18, "John Mobley Jr": 15, "Jaden Bradley": 0, "Ryan Conwell": 18, "Elliot Cadeau": 5, "Mirkovic": 29 },
  Kelly: { "Thomas Haugh": 0, "Cruz Davis": 0, "AJ Dybantsa": 35, "Jeremiah Wilkinson": 30, "Graham Ike": 19, "Tyler Bilodeau": 0, "Meleek Thomas": 21, "Pryce Sandfort": 23 },
  Pat:   { "Yaxel Lendeborg": 9, "Preston Edmead": 0, "Koa Peat": 0, "Bruce Thornton": 10, "Andrej Stojakovic": 9, "Nate Ament": 0, "Alex Karaban": 0, "Labaron Philon Jr": 0 },
  Ben:   { "Kingston Flemings": 18, "TJ Power": 6, "Isaiah Evans": 16, "Bennett Stirtz": 0, "Jeremy Fears": 7, "Malik Reneau": 0, "Fletcher Loyer": 0, "Nick Boyd": 27 },
  Berit: { "Alex Condon": 0, "Thomas Dowd": 4, "Milan Momcilovic": 0, "Mark Mitchell": 0, "Morez Johnson Jr": 21, "Dailyn Swain": 14, "Tarris Reed": 0, "Daryn Peterson": 0 },
};

const R1_FRI = {
  Trent: { "Brayden Burries": 18, "Dominique Daniels Jr": 25, "Darius Acuff Jr": 0, "Larry Johnson": 0, "Joshua Jefferson": 2, "Ja'Kobi Gillespie": 29, "Emmanuel Sharp": 0, "Tyler Tanner": 0 },
  JB:    { "Cam Boozer": 0, "Damari Wheeler": 0, "Keaton Wagler": 0, "John Mobley Jr": 0, "Jaden Bradley": 7, "Ryan Conwell": 0, "Elliot Cadeau": 0, "Mirkovic": 0 },
  Kelly: { "Thomas Haugh": 14, "Cruz Davis": 14, "AJ Dybantsa": 0, "Jeremiah Wilkinson": 0, "Graham Ike": 0, "Tyler Bilodeau": 0, "Meleek Thomas": 0, "Pryce Sandfort": 0 },
  Pat:   { "Yaxel Lendeborg": 0, "Preston Edmead": 24, "Koa Peat": 15, "Bruce Thornton": 0, "Andrej Stojakovic": 0, "Nate Ament": 0, "Alex Karaban": 22, "Labaron Philon Jr": 29 },
  Ben:   { "Kingston Flemings": 0, "TJ Power": 0, "Isaiah Evans": 0, "Bennett Stirtz": 16, "Jeremy Fears": 0, "Malik Reneau": 24, "Fletcher Loyer": 14, "Nick Boyd": 0 },
  Berit: { "Alex Condon": 13, "Thomas Dowd": 0, "Milan Momcilovic": 17, "Mark Mitchell": 19, "Morez Johnson Jr": 0, "Dailyn Swain": 0, "Tarris Reed": 31, "Daryn Peterson": 28 },
};

function buildSeedScores() {
  const s = {};
  for (const [m, ps] of Object.entries(ROSTERS)) {
    s[m] = {};
    for (const p of ps) {
      const r1 = R1_THU[m]?.[p.name] ?? 0;
      const r2 = R1_FRI[m]?.[p.name] ?? 0;
      const total = r1 + r2;
      // rounds[0] = Thu game, rounds[1] = Fri game (both still Round 1)
      const rounds = [];
      if (r1 > 0) rounds[0] = r1;
      if (r2 > 0) rounds[1] = r2;
      const lastGame = r2 > 0 ? r2 : r1;
      s[m][p.name] = { pts: total, lastGame, live: false, rounds };
    }
  }
  return s;
}

function loadFromLS() {
  try {
    STALE_KEYS.forEach(k => localStorage.removeItem(k));
    const r = localStorage.getItem(LS_KEY);
    if (r) return JSON.parse(r);
    // No v6 cache yet — seed with confirmed R1 scores
    const seed = buildSeedScores();
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  } catch { return buildSeedScores(); }
}
function saveToLS(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch{} }

// ─── ESPN FETCH ───────────────────────────────────────────────────────────────
const PROXY = "https://sharpshooter-proxy.tzottoli.workers.dev";

// Build a set of all team IDs we care about (for filtering scoreboard games)
const ALL_TEAM_IDS = new Set(
  Object.values(ROSTERS).flatMap(players => players.map(p => p.teamId))
);

async function fetchESPNScores() {
  try {
    // ── Step 1: Get scoreboard for today + yesterday to cover round transitions ──
    // NCAA tournament games may span two calendar days and the default endpoint
    // (no date param) only shows today. We fetch both days and merge.
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fmt = d => d.toISOString().slice(0,10).replace(/-/g,"");

    const fetchDay = async (dateStr) => {
      const res = await fetch(
        `${PROXY}/scoreboard?groups=50&limit=100&dates=${dateStr}`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data?.events || [];
    };

    // Fetch both days in parallel; also try no-date for "right now" awareness
    const [todayEvents, yestEvents, nowEvents] = await Promise.all([
      fetchDay(fmt(today)),
      fetchDay(fmt(yesterday)),
      fetch(`${PROXY}/scoreboard?groups=50&limit=100`, { signal: AbortSignal.timeout(10000) })
        .then(r => r.ok ? r.json() : {}).then(d => d?.events || [])
        .catch(() => []),
    ]);

    // Deduplicate by event id
    const eventMap = new Map();
    for (const e of [...yestEvents, ...todayEvents, ...nowEvents]) {
      if (e.id) eventMap.set(e.id, e);
    }
    const allEvents = Array.from(eventMap.values());

    // Find events that involve at least one of our teams
    const relevantEvents = allEvents.filter(e => {
      const competitors = e.competitions?.[0]?.competitors || [];
      return competitors.some(c => ALL_TEAM_IDS.has(c.team?.id));
    });

    const finishedOrLive = relevantEvents.filter(e => {
      const s = e.status?.type?.name;
      return s === "STATUS_IN_PROGRESS" || s === "STATUS_FINAL";
    });

    if (!finishedOrLive.length) {
      return { playerStats: {}, livePlayerIds: new Set(), eliminatedTeamIds: new Set(), noGamesYet: true };
    }

    // ── Step 2: Build elimination map from scoreboard ─────────────────────────
    const eliminatedTeamIds = new Set();
    for (const event of finishedOrLive) {
      if (event.status?.type?.name !== "STATUS_FINAL") continue;
      for (const team of event.competitions?.[0]?.competitors || []) {
        if (team.winner === false) eliminatedTeamIds.add(team.team?.id);
      }
    }

    // ── Step 3: Fetch full box scores for each relevant finished/live game ────
    // Sort by date so round indices are assigned in chronological order
    const sortedEvents = [...finishedOrLive].sort((a, b) =>
      new Date(a.date || 0) - new Date(b.date || 0)
    );

    const playerStats = {};
    const livePlayerIds = new Set();
    const teamGamesPlayed = {};

    await Promise.all(sortedEvents.map(async (event) => {
      const gameId = event.id;
      const isFinal = event.status?.type?.name === "STATUS_FINAL";
      const isLive  = event.status?.type?.name === "STATUS_IN_PROGRESS";

      // Determine round index for each team in this game (before async)
      const competitors = event.competitions?.[0]?.competitors || [];
      const roundIndices = {};
      for (const team of competitors) {
        const tid = team.team?.id;
        roundIndices[tid] = teamGamesPlayed[tid] || 0;
      }
      if (isFinal) {
        for (const team of competitors) {
          const tid = team.team?.id;
          teamGamesPlayed[tid] = (teamGamesPlayed[tid] || 0) + 1;
        }
      }

      try {
        const sumRes = await fetch(
          `${PROXY}/summary?event=${gameId}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (!sumRes.ok) return;
        const sumData = await sumRes.json();

        // boxscore.players is an array of team groups, each with a statistics array
        const teamGroups = sumData?.boxscore?.players || [];
        for (const group of teamGroups) {
          const teamId = group.team?.id;
          const roundIdx = roundIndices[teamId] ?? 0;

          // Each group has multiple stat categories; find "points" column
          for (const statGroup of group.statistics || []) {
            // Find the index of the "PTS" column in the keys array
            const keys = statGroup.keys || [];
            const ptsIdx = keys.indexOf("PTS");
            if (ptsIdx === -1) continue;

            for (const athlete of statGroup.athletes || []) {
              const id = athlete.athlete?.id;
              if (!id || !ESPN_ID_MAP[id]) continue;
              const statsArr = athlete.stats || [];
              const ptsRaw = statsArr[ptsIdx];
              const pts = parseFloat(ptsRaw);
              if (isNaN(pts) || pts === 0) continue;

              if (!playerStats[id]) playerStats[id] = { pts: 0, lastGame: 0, live: false, rounds: [] };
              // Only add once per game (guard against duplicate stat groups)
              if (!playerStats[id]._gamesSeen) playerStats[id]._gamesSeen = new Set();
              if (playerStats[id]._gamesSeen.has(gameId)) continue;
              playerStats[id]._gamesSeen.add(gameId);

              if (isFinal) {
                playerStats[id].rounds[roundIdx] = pts;
              }
              playerStats[id].pts += pts;
              playerStats[id].lastGame = pts;
              if (isLive) { playerStats[id].live = true; livePlayerIds.add(id); }
            }
          }
        }
      } catch { /* box score fetch failed for this game — skip */ }
    }));

    // Clean up internal tracking field
    for (const stat of Object.values(playerStats)) delete stat._gamesSeen;

    return { playerStats, livePlayerIds, eliminatedTeamIds, noGamesYet: false };
  } catch {
    return null;
  }
}

// Returns true if a player's team has been eliminated
function isAutoEliminated(player, eliminatedTeamIds) {
  return eliminatedTeamIds.has(player.teamId);
}

function buildZeroScores() {
  const s = {};
  for (const [m, ps] of Object.entries(ROSTERS)) {
    s[m] = {};
    for (const p of ps) s[m][p.name] = { pts: 0, lastGame: 0, live: false, rounds: [] };
  }
  return s;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getTierForSeed(seed) {
  for (const t of SEED_TIERS) if (t.seeds.includes(seed)) return t;
  return SEED_TIERS[SEED_TIERS.length - 1];
}
function getManagerActualPts(manager, scores) {
  return ROSTERS[manager].reduce((s, p) => s + (scores[manager]?.[p.name]?.pts || 0), 0);
}
function getManagerProjPts(manager) {
  return ROSTERS[manager].reduce((s, p) => s + p.projected, 0);
}
function getManagerLiveTotal(manager, scores, eliminatedTeamIds) {
  const actual = getManagerActualPts(manager, scores);
  const estRem = ROSTERS[manager].reduce((s, p) => {
    if (isAutoEliminated(p, eliminatedTeamIds)) return s;
    return s + Math.max(0, p.projected - (scores[manager]?.[p.name]?.pts || 0));
  }, 0);
  return actual + estRem;
}
function getManagerCeilingFloor(manager, scores, eliminatedTeamIds) {
  const actual = getManagerActualPts(manager, scores);
  const activeRem = ROSTERS[manager].reduce((s, p) => {
    if (isAutoEliminated(p, eliminatedTeamIds)) return s;
    return s + Math.max(0, p.projected - (scores[manager]?.[p.name]?.pts || 0));
  }, 0);
  return { floor: actual, ceiling: actual + activeRem };
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [scores, setScores]               = useState(loadFromLS);
  const [eliminatedTeamIds, setEliminatedTeamIds] = useState(new Set());
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [isLive, setIsLive]               = useState(false);
  const [livePlayerIds, setLivePlayerIds] = useState(new Set());
  const [expanded, setExpanded]       = useState({});
  const [showReset, setShowReset]     = useState(false);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [dataSource, setDataSource]   = useState("pending");
  const [activeTab, setActiveTab]     = useState("scoreboard");
  const [insightsMode, setInsightsMode] = useState("pre");
  const [h2hOpen, setH2hOpen]         = useState(null);
  const [confetti, setConfetti]       = useState([]);
  const [momentOfDay, setMomentOfDay] = useState(null);
  const intervalRef = useRef(null);
  const prevScoresRef = useRef({});

  // Fire confetti when a player scores 30+
  const fireConfetti = useCallback((color) => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color,
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 6,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3500);
  }, []);

  // Live tab unlocks as soon as any player has points — works from cache/seed too
  const scoringHasStarted = dataSource !== "none" && dataSource !== "pending" &&
    Object.values(scores).some(m => Object.values(m).some(p => p.pts > 0));

  const fetchScores = useCallback(async () => {
    setFetchStatus("fetching");
    const espnData = await fetchESPNScores();
    const newLiveIds = new Set();
    let newScores;

    // Always load cache first — it holds the running total across all rounds.
    // ESPN scoreboard only shows recent/active games, so prior-round scores
    // fall off the API. We merge: take the HIGHER of cached vs ESPN for pts,
    // so we never lose points from rounds that have scrolled off the scoreboard.
    const cached = loadFromLS();

    if (espnData && !espnData.noGamesYet) {
      newScores = {};
      for (const [manager, players] of Object.entries(ROSTERS)) {
        newScores[manager] = {};
        for (const player of players) {
          const stat   = player.espnId ? espnData.playerStats[player.espnId] : null;
          const cached_player = cached[manager]?.[player.name];

          // Key rule: never let a refresh zero out points we've already banked.
          // ESPN pts = cumulative for games currently on the scoreboard.
          // cached pts = best running total we've seen so far.
          // Take the max so earlier rounds are never lost.
          const espnPts   = stat?.pts   ?? 0;
          const cachedPts = cached_player?.pts ?? 0;
          const finalPts  = Math.max(espnPts, cachedPts);

          // Rounds: merge arrays, keeping the highest value per slot
          const espnRounds   = stat?.rounds   ?? [];
          const cachedRounds = cached_player?.rounds ?? [];
          const maxLen = Math.max(espnRounds.length, cachedRounds.length);
          const mergedRounds = Array.from({ length: maxLen }, (_, i) =>
            Math.max(espnRounds[i] || 0, cachedRounds[i] || 0)
          );

          // lastGame: use ESPN's value if live/recent, otherwise keep cached
          const lastGame = stat?.lastGame
            ? Math.max(stat.lastGame, cached_player?.lastGame ?? 0)
            : (cached_player?.lastGame ?? 0);

          newScores[manager][player.name] = {
            pts:      finalPts,
            lastGame: lastGame,
            live:     stat?.live ?? false,
            rounds:   mergedRounds,
          };
          if (stat?.live && player.espnId) newLiveIds.add(player.espnId);
        }
      }
      saveToLS(newScores);
      setDataSource("espn");
      setEliminatedTeamIds(espnData.eliminatedTeamIds || new Set());
    } else if (espnData?.noGamesYet) {
      // No games started yet — show zeros but don't wipe existing cache
      if (Object.keys(cached).length > 0) {
        newScores = {};
        for (const [manager, players] of Object.entries(ROSTERS)) {
          newScores[manager] = {};
          for (const player of players) {
            const c = cached[manager]?.[player.name];
            newScores[manager][player.name] = { pts: c?.pts ?? 0, lastGame: c?.lastGame ?? 0, live: false, rounds: c?.rounds ?? [] };
          }
        }
        setDataSource("cache");
      } else {
        newScores = buildZeroScores();
        setDataSource("none");
      }
    } else {
      // ESPN fetch failed — fall back to cache
      if (Object.keys(cached).length > 0) {
        newScores = {};
        for (const [manager, players] of Object.entries(ROSTERS)) {
          newScores[manager] = {};
          for (const player of players) {
            const c = cached[manager]?.[player.name];
            newScores[manager][player.name] = { pts: c?.pts ?? 0, lastGame: c?.lastGame ?? 0, live: false, rounds: c?.rounds ?? [] };
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

    // Detect 30-pt games and best moment
    let bestGame = null;
    for (const [manager, players] of Object.entries(ROSTERS)) {
      for (const player of players) {
        const d = newScores[manager]?.[player.name] || {};
        const prev = prevScoresRef.current[manager]?.[player.name] || {};
        // New 30-pt game just scored?
        if (d.lastGame >= 30 && d.lastGame !== prev.lastGame) {
          fireConfetti(MANAGER_COLORS[manager]);
        }
        // Track best single-game score across all players
        if (d.lastGame > 0 && (!bestGame || d.lastGame > bestGame.pts)) {
          bestGame = { pts: d.lastGame, name: player.name, manager, school: player.school, live: d.live };
        }
      }
    }
    setMomentOfDay(bestGame);
    prevScoresRef.current = newScores;
  }, [fireConfetti]);

  useEffect(() => {
    fetchScores();
    intervalRef.current = setInterval(fetchScores, 60000);
    return () => clearInterval(intervalRef.current);
  }, [fetchScores]);



  const handleReset = () => {
    const seed = buildSeedScores();
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    setScores(seed); setEliminatedTeamIds(new Set()); setShowReset(false);
  };

  const formatTime = d => d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";

  const sourceInfo = {
    pending: { label: "loading...",         color: "#475569" },
    espn:    { label: "● ESPN live",        color: "#34d399" },
    cache:   { label: "⚠ cached data",      color: "#fbbf24" },
    none:    { label: "○ awaiting tip-off", color: "#475569" },
  }[dataSource] || { label: "—", color: "#475569" };

  const insightsIsLive = insightsMode === "live" && scoringHasStarted;

  const sortedByScore = [...MANAGERS].sort((a, b) => {
    const aT = Object.values(scores[a] || {}).reduce((s, p) => s + (p.pts || 0), 0);
    const bT = Object.values(scores[b] || {}).reduce((s, p) => s + (p.pts || 0), 0);
    return bT - aT;
  });

  // Inject confetti CSS once
  useEffect(() => {
    if (document.getElementById("confetti-style")) return;
    const s = document.createElement("style");
    s.id = "confetti-style";
    s.textContent = `@keyframes fall { 0%{transform:translateY(0) rotate(0deg);opacity:.9} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }`;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={S.root}>
      <div style={S.bgGrid} />

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.eyebrow}>MARCH MADNESS 2026</div>
            <h1 style={S.title}>SHARPSHOOTER</h1>
            <div style={S.subtitle}>Fantasy League · Live Scoreboard</div>
          </div>
          <div style={S.headerRight}>
            {isLive && <div style={S.liveChip}><span style={S.liveDotEl} />GAMES LIVE</div>}
            <div style={S.metaBlock}>
              <div style={S.metaRow}>
                <span style={S.metaLabel}>UPDATED</span>
                <span style={S.metaValue}>{formatTime(lastUpdated)}</span>
              </div>
              <div style={{ ...S.sourceLabel, color: sourceInfo.color }}>{sourceInfo.label}</div>
            </div>
            <button onClick={fetchScores} disabled={fetchStatus === "fetching"} style={S.refreshBtn}>
              {fetchStatus === "fetching" ? "↻ Fetching..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* TABS — only 2 */}
        <div style={S.tabBar}>
          {["scoreboard", "insights"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ ...S.tab, ...(activeTab === tab ? S.tabActive : {}) }}>
              {tab === "scoreboard" ? "Scoreboard" : "Insights"}
            </button>
          ))}
        </div>
      </header>

      {/* CONFETTI OVERLAY */}
      {confetti.length > 0 && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
          {confetti.map(p => (
            <div key={p.id} style={{
              position: "absolute", left: `${p.x}%`, top: "-20px",
              width: p.size, height: p.size * 0.6, borderRadius: 2,
              background: p.color, opacity: 0.9,
              animation: `fall 3s ease-in ${p.delay}s forwards`,
            }} />
          ))}
        </div>
      )}

      {/* ── SCOREBOARD TAB ── */}
      {activeTab === "scoreboard" && (
        <main style={S.main}>

          {/* MOMENT OF THE DAY */}
          {momentOfDay && momentOfDay.pts > 0 && (
            <div style={S.momentBanner}>
              <span style={S.momentFire}>🔥</span>
              <div style={S.momentBody}>
                <span style={S.momentLabel}>MOMENT OF THE TOURNAMENT</span>
                <span style={S.momentText}>
                  <span style={{ color: MANAGER_COLORS[momentOfDay.manager], fontWeight: 800 }}>{momentOfDay.name}</span>
                  {" dropped "}
                  <span style={{ color: "#fbbf24", fontWeight: 900 }}>{momentOfDay.pts} pts</span>
                  {" for "}
                  <span style={{ color: MANAGER_COLORS[momentOfDay.manager] }}>{momentOfDay.manager}</span>
                  {momentOfDay.live ? " 🔴 live" : ""}
                </span>
              </div>
            </div>
          )}

          {sortedByScore.map((manager, rank) => {
            const total = Object.values(scores[manager] || {}).reduce((s, p) => s + (p.pts || 0), 0);
            const proj  = getManagerProjPts(manager);
            const pct   = proj > 0 ? Math.round((total / proj) * 100) : 0;
            const color = MANAGER_COLORS[manager];
            const isExp = expanded[manager];
            const players = ROSTERS[manager];
            const pScores = scores[manager] || {};
            const hasLive = players.some(p => p.espnId && livePlayerIds.has(p.espnId));

            return (
              <div key={manager} style={{ ...S.card, borderLeftColor: color }}>
                <div style={{ ...S.rank, background: rank===0?"#fbbf24":rank===1?"#94a3b8":rank===2?"#c97c3a":"#1e293b", color: rank<3?"#0f172a":"#94a3b8" }}>
                  #{rank + 1}
                </div>
                <button onClick={() => setExpanded(p => ({ ...p, [manager]: !p[manager] }))} style={S.cardBtn}>
                  <div style={S.cardLeft}>
                    <div style={{ ...S.dot, background: color }} />
                    <div>
                      <div style={{ ...S.managerName, color }}>
                        {manager}{hasLive && <span style={S.liveTag}>● LIVE</span>}
                      </div>
                      <div style={S.managerSub}>
                        {(() => {
                          const alive = players.filter(p => !isAutoEliminated(p, eliminatedTeamIds)).length;
                          const total8 = players.length;
                          return (
                            <span>
                              <span style={{ color: alive > 0 ? "#34d399" : "#ef4444", fontWeight: 700 }}>{alive}</span>
                              <span style={{ color: "#334155" }}>/{total8} alive</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div style={S.cardRight}>
                    <div style={S.ptsBlock}>
                      <div style={S.smallLabel}>PTS</div>
                      <div style={{ ...S.bigNum, color }}>{total}</div>
                    </div>
                    <div style={S.projBlock}>
                      <div style={S.smallLabel}>PROJ</div>
                      <div style={S.projNum}>{proj}</div>
                      <div style={{ ...S.pct, color: pct >= 50 ? "#34d399" : "#64748b" }}>{pct}%</div>
                    </div>
                    <div style={{ ...S.chevron, transform: isExp ? "rotate(180deg)" : "none" }}>▼</div>
                  </div>
                </button>
                <div style={S.bar}><div style={{ ...S.barFill, width: `${Math.min(pct, 100)}%`, background: color }} /></div>

                {isExp && (
                  <div style={S.playerList}>
                    <div style={S.listHeader}>
                      <span style={S.cName}>PLAYER</span>
                      <span style={S.cSchool}>SCHOOL</span>
                      <span style={S.cLast}>LAST</span>
                      <span style={S.cTotal}>TOTAL</span>
                      <span style={S.cProj}>PROJ</span>
                      <span style={S.cElim}>OUT</span>
                    </div>
                    {players.map(player => {
                      const d = pScores[player.name] || {};
                      const pts = d.pts || 0, last = d.lastGame || 0, live = d.live === true;
                      const isElim = isAutoEliminated(player, eliminatedTeamIds);
                      return (
                        <div key={player.name} style={{ ...S.playerRow, opacity: isElim ? 0.38 : 1, background: live ? "rgba(56,189,248,0.04)" : "transparent" }}>
                          <span style={S.cName}>
                            {live && <span style={S.liveDot2}>●</span>}
                            <span style={{ textDecoration: isElim ? "line-through" : "none", color: isElim ? "#475569" : "#e2e8f0" }}>
                              {player.name}
                            </span>
                          </span>
                          <span style={{ ...S.cSchool, color: color + "88" }}>{player.school}</span>
                          <span style={{ ...S.cLast, color: live ? "#38bdf8" : "#64748b" }}>
                            {last > 0 ? (live ? `${last}🔴` : last) : "—"}
                          </span>
                          <span style={{ ...S.cTotal, fontWeight: 700, color: "#e2e8f0" }}>{pts}</span>
                          <span style={{ ...S.cProj, color: "#475569" }}>{player.projected}</span>
                          <span style={S.cElim}>
                            <span style={{ ...S.elimBtn, background: isElim ? "#334155" : "transparent", borderColor: isElim ? "#475569" : "#1e293b", color: isElim ? "#475569" : "#1e293b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>
                              {isElim ? "OUT" : ""}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                    {/* Round-by-round breakdown */}
                    {(() => {
                      const maxRounds = Math.max(...players.map(p => (pScores[p.name]?.rounds || []).length), 0);
                      if (maxRounds === 0) return null;
                      return (
                        <div style={S.roundBreakdown}>
                          <span style={{ color: "#334155", fontSize: 9, letterSpacing:"0.1em", fontWeight:700 }}>ROUND SCORING</span>
                          {Array.from({ length: maxRounds }, (_, ri) => {
                            const roundTotal = players.reduce((s, p) => s + (pScores[p.name]?.rounds?.[ri] || 0), 0);
                            return roundTotal > 0 ? (
                              <div key={ri} style={S.roundChip}>
                                <span style={{ color: "#475569", fontSize: 9 }}>{ROUND_LABELS[ri]}</span>
                                <span style={{ color, fontWeight: 800, fontSize: 12 }}>{roundTotal}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      );
                    })()}
                    <div style={S.rowTotal}>
                      <span style={{ color: "#475569", fontSize: 10 }}>TOTALS</span>
                      <span style={{ color, fontWeight: 800, fontSize: 15, marginLeft: "auto" }}>{total} pts</span>
                      <span style={{ color: "#334155", fontSize: 11, marginLeft: 10 }}>/ {proj} proj</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div style={S.resetRow}>
            {!showReset
              ? <button onClick={() => setShowReset(true)} style={S.resetBtn}>Reset All Scores</button>
              : <div style={S.resetConfirm}>
                  <span style={{ color: "#f43f5e", fontSize: 13 }}>⚠ Clear all saved data?</span>
                  <button onClick={handleReset} style={{ ...S.resetBtn, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>Yes, Reset</button>
                  <button onClick={() => setShowReset(false)} style={S.cancelBtn}>Cancel</button>
                </div>
            }
          </div>
          <div style={S.footer}>
            Polls ESPN via proxy every 60s · groups=50 (NCAA Tournament) · STATUS_FINAL + STATUS_IN_PROGRESS only
          </div>
        </main>
      )}

      {/* ── INSIGHTS TAB ── */}
      {activeTab === "insights" && (
        <InsightsTab
          scores={scores}
          eliminatedTeamIds={eliminatedTeamIds}
          isLive={insightsIsLive}
          insightsMode={insightsMode}
          setInsightsMode={setInsightsMode}
          scoringHasStarted={scoringHasStarted}
          h2hOpen={h2hOpen}
          setH2hOpen={setH2hOpen}
        />
      )}
    </div>
  );
}

// ─── INSIGHTS TAB ─────────────────────────────────────────────────────────────
function InsightsTab({ scores, eliminatedTeamIds, isLive, insightsMode, setInsightsMode, scoringHasStarted, h2hOpen, setH2hOpen }) {
  // Live: actual pts + projected remaining for alive players
  // Standings: sort by actual pts scored
  const getActual    = m => getManagerActualPts(m, scores);
  const getCeiling   = m => getManagerCeilingFloor(m, scores, eliminatedTeamIds).ceiling;
  const getH2HPts    = m => isLive ? getManagerLiveTotal(m, scores, eliminatedTeamIds) : getManagerProjPts(m);
  const maxCeiling   = Math.max(...MANAGERS.map(getCeiling), 1);
  const standingSort = [...MANAGERS].sort((a,b) => getActual(b) - getActual(a));
  const getH2HDetail = m => {
    const actual = getActual(m);
    const estRem = ROSTERS[m].reduce((s, p) => {
      if (isAutoEliminated(p, eliminatedTeamIds)) return s;
      return s + Math.max(0, p.projected - (scores[m]?.[p.name]?.pts || 0));
    }, 0);
    return { actual, estRem };
  };

  return (
    <main style={S.main}>
      {/* Mode toggle */}
      <div style={I.modeBar}>
        <button onClick={() => setInsightsMode("pre")}
          style={{ ...I.modeBtn, ...(insightsMode === "pre" ? I.modeBtnActive : {}) }}>
          Roster
        </button>
        <div style={I.modeDivider} />
        <button
          onClick={() => { if (scoringHasStarted) setInsightsMode("live"); }}
          style={{ ...I.modeBtn, ...(insightsMode === "live" ? I.modeBtnActiveLive : {}), opacity: scoringHasStarted ? 1 : 0.4, cursor: scoringHasStarted ? "pointer" : "not-allowed" }}>
          {insightsMode === "live" && scoringHasStarted && <span style={I.livePulse}>●</span>}
          Standings
        </button>
        {!scoringHasStarted && <span style={I.modeHint}>Activates when scoring begins</span>}
      </div>

      {/* ── STANDINGS MODE ── */}
      {isLive && <>

        {/* LIVE STANDINGS — actual pts + ceiling bar */}
        <Section title="Standings" icon="🏆">
          {standingSort.map((manager, rank) => {
            const actual  = getActual(manager);
            const ceiling = getCeiling(manager);
            const color   = MANAGER_COLORS[manager];
            const activeCt = ROSTERS[manager].filter(p => !isAutoEliminated(p, eliminatedTeamIds)).length;
            const actualPct  = (actual  / maxCeiling) * 100;
            const ceilPct    = (ceiling / maxCeiling) * 100;
            return (
              <div key={manager} style={I.prCard}>
                <div style={{ ...I.prRank, background: rank===0?"#fbbf24":rank===1?"#94a3b8":rank===2?"#c97c3a":"#1e293b", color: rank<3?"#0f172a":"#94a3b8" }}>
                  {rank + 1}
                </div>
                <div style={I.prBody}>
                  <div style={I.prTop}>
                    <div style={I.prLeft}>
                      <span style={{ ...I.prName, color }}>{manager}</span>
                      <span style={{ fontSize: 10, color: activeCt > 0 ? "#64748b" : "#ef4444", marginLeft: 6 }}>{activeCt} alive</span>
                    </div>
                    <div style={I.prPtsGroup}>
                      <span style={{ ...I.prPts, color }}>{actual}</span>
                      <span style={{ ...I.prPtsLabel, marginLeft: 4 }}>pts</span>
                      <span style={{ fontSize: 10, color: "#475569", marginLeft: 8 }}>ceil {ceiling}</span>
                    </div>
                  </div>
                  {/* Stacked bar: solid = scored, faded = potential */}
                  <div style={I.prBarTrack}>
                    <div style={{ ...I.prBarFill, width: `${ceilPct}%`, background: color + "28" }} />
                    <div style={{ ...I.prBarFill, width: `${actualPct}%`, background: color, position: "absolute", top: 0, left: 0 }} />
                  </div>
                  <div style={I.prScout}>{SCOUTING[manager]}</div>
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 4 }}>
            Solid bar = pts scored · Faded = projected remaining for alive players
          </div>
        </Section>

        {/* HEAD TO HEAD */}
        <Section title="Head to Head" icon="⚔️">
          <div style={{ overflowX: "auto" }}>
            <table style={I.h2hTable}>
              <thead>
                <tr>
                  <th style={I.h2hTh}></th>
                  {MANAGERS.map(m => <th key={m} style={{ ...I.h2hTh, color: MANAGER_COLORS[m] }}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {standingSort.map(rowM => (
                  <tr key={rowM}>
                    <td style={{ ...I.h2hTd, color: MANAGER_COLORS[rowM], fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }}>{rowM}</td>
                    {MANAGERS.map(colM => {
                      if (rowM === colM) return <td key={colM} style={{ ...I.h2hTd, ...I.h2hDiag }}>—</td>;
                      const diff = getActual(rowM) - getActual(colM);
                      const isOpen = h2hOpen && h2hOpen.row === rowM && h2hOpen.col === colM;
                      return (
                        <td key={colM} style={{ ...I.h2hTd, cursor: "pointer" }}
                          onClick={() => setH2hOpen(isOpen ? null : { row: rowM, col: colM })}>
                          <div style={{ ...I.h2hCell, background: diff > 0 ? "rgba(52,211,153,0.12)" : "rgba(244,63,94,0.12)", color: diff > 0 ? "#34d399" : "#f43f5e", border: `1px solid ${diff > 0 ? "rgba(52,211,153,0.25)" : "rgba(244,63,94,0.25)"}` }}>
                            {diff > 0 ? "+" : ""}{diff}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {h2hOpen && (() => {
            const { row, col } = h2hOpen;
            const rdR = getH2HDetail(row), rdC = getH2HDetail(col);
            const totalR = getActual(row), totalC = getActual(col);
            const diff = totalR - totalC;
            return (
              <div style={I.h2hDetail}>
                <div style={I.h2hDetailHeader}>
                  <span style={{ color: MANAGER_COLORS[row], fontWeight: 800 }}>{row}</span>
                  <span style={{ color: diff > 0 ? "#34d399" : "#f43f5e", fontSize: 18, fontWeight: 900 }}>{diff > 0 ? "+" : ""}{diff}</span>
                  <span style={{ color: MANAGER_COLORS[col], fontWeight: 800 }}>{col}</span>
                </div>
                <div style={I.h2hDetailRow}>
                  <DetailCol manager={row} data={rdR} total={totalR} isLive={true} />
                  <div style={{ width: 1, background: "#1e293b", margin: "0 8px" }} />
                  <DetailCol manager={col} data={rdC} total={totalC} isLive={true} />
                </div>
                <button onClick={() => setH2hOpen(null)} style={I.h2hClose}>Close ✕</button>
              </div>
            );
          })()}
          <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 8 }}>
            Values = actual pts scored · Click any cell for breakdown
          </div>
        </Section>

        {/* WHO NEEDS A MIRACLE */}
        {(() => {
          const leader = standingSort[0];
          const leaderPts = getActual(leader);
          const others = standingSort.slice(1).map(m => ({
            manager: m, actual: getActual(m), ceiling: getCeiling(m),
            gap: leaderPts - getActual(m),
            canCatch: getCeiling(m) > leaderPts,
          })).filter(x => x.gap > 0);
          if (!others.length) return null;
          return (
            <Section title="Who Needs a Miracle?" icon="🙏">
              {others.map(({ manager, actual, ceiling, gap, canCatch }) => {
                const color = MANAGER_COLORS[manager];
                return (
                  <div key={manager} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ ...I.sdName, color, width: 48 }}>{manager}</div>
                    <div style={{ flex: 1, fontSize: 11, color: "#64748b" }}>
                      <span style={{ color }}>{actual}</span> pts · ceil <span style={{ color: canCatch ? "#34d399" : "#ef4444" }}>{ceiling}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: canCatch ? "#fbbf24" : "#ef4444", textAlign: "right", minWidth: 80 }}>
                      {canCatch ? `need +${gap}` : "eliminated"}
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 10, color: "#334155", marginTop: 6, textAlign: "center" }}>
                Leader: <span style={{ color: MANAGER_COLORS[standingSort[0]] }}>{standingSort[0]}</span> with {getActual(standingSort[0])} pts
              </div>
            </Section>
          );
        })()}
      </>}

      {/* ── ROSTER MODE ── */}
      {!isLive && <>

        {/* SEED DISTRIBUTION — numbered chips, not anonymous dots */}
        <Section title="Seed Distribution" icon="🌱">
          {MANAGERS.map(manager => {
            const color = MANAGER_COLORS[manager];
            const players = [...ROSTERS[manager]].sort((a,b) => a.seed - b.seed);
            const activeCt = players.filter(p => !isAutoEliminated(p, eliminatedTeamIds)).length;
            return (
              <div key={manager} style={I.sdRow}>
                <div style={{ ...I.sdName, color }}>{manager}</div>
                <div style={{ ...I.sdDots, flexWrap: "wrap" }}>
                  {players.map((p, i) => {
                    const tier = getTierForSeed(p.seed);
                    const isElim = isAutoEliminated(p, eliminatedTeamIds);
                    return (
                      <div key={i}
                        title={`${p.name} (${p.school}) — Seed ${p.seed} · ${p.region}${isElim ? " · ELIM" : ""}`}
                        style={{
                          width: 22, height: 22, borderRadius: 4,
                          background: isElim ? "#1e293b" : tier.color + "33",
                          border: `1px solid ${tier.color}${isElim ? "44" : "99"}`,
                          color: isElim ? "#334155" : tier.color,
                          fontSize: 10, fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: isElim ? 0.45 : 1,
                          textDecoration: isElim ? "line-through" : "none",
                          flexShrink: 0,
                        }}>
                        {p.seed}
                      </div>
                    );
                  })}
                </div>
                <div style={I.sdActive}>
                  <span style={{ color: activeCt > 0 ? "#34d399" : "#ef4444", fontWeight: 700 }}>{activeCt}</span>
                  <span style={{ color: "#475569", fontSize: 9 }}>/8</span>
                </div>
              </div>
            );
          })}
          <div style={I.seedLegend}>
            {SEED_TIERS.map(t => (
              <div key={t.label} style={I.seedLegendItem}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: "#64748b" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* REGIONAL COVERAGE */}
        <Section title="Regional Coverage" icon="🗺️">
          <div style={I.regionGrid}>
            {REGIONS.map(region => {
              const rc = REGION_COLORS[region];
              return (
                <div key={region} style={{ ...I.regionCard, borderColor: rc + "44" }}>
                  <div style={{ ...I.regionTitle, color: rc }}>{region}</div>
                  {MANAGERS.map(manager => {
                    const rp = ROSTERS[manager].filter(p => p.region === region);
                    if (rp.length === 0) return (
                      <div key={manager} style={I.regionRow}>
                        <span style={{ ...I.regionMgrName, color: MANAGER_COLORS[manager] + "55", fontSize: 10 }}>{manager}</span>
                        <span style={{ fontSize: 9, color: "#334155" }}>—</span>
                      </div>
                    );
                    const activeCt = rp.filter(p => !isAutoEliminated(p, eliminatedTeamIds)).length;
                    return (
                      <div key={manager} style={I.regionRow}>
                        <span style={{ ...I.regionMgrName, color: MANAGER_COLORS[manager] }}>{manager}</span>
                        <div style={{ ...I.regionPlayerDots, flex: 1 }}>
                          {rp.map((p, i) => {
                            const isElim = isAutoEliminated(p, eliminatedTeamIds);
                            const tier = getTierForSeed(p.seed);
                            return (
                              <div key={i} title={`${p.name} (${p.school}) S${p.seed}${isElim ? " ELIM" : ""}`}
                                style={{
                                  width: 18, height: 18, borderRadius: 3,
                                  background: isElim ? "#1e293b" : MANAGER_COLORS[manager] + "33",
                                  border: `1px solid ${MANAGER_COLORS[manager]}${isElim ? "22" : "88"}`,
                                  color: isElim ? "#334155" : MANAGER_COLORS[manager],
                                  fontSize: 9, fontWeight: 800,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  opacity: isElim ? 0.4 : 1,
                                }}>
                                {p.seed}
                              </div>
                            );
                          })}
                        </div>
                        <span style={{ fontSize: 9, color: activeCt > 0 ? "#64748b" : "#ef4444", minWidth: 18, textAlign: "right" }}>{activeCt}✓</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Section>

        {/* CEILING RACE — uses live data even in roster mode */}
        <Section title="Ceiling Race" icon="📊">
          {[...MANAGERS].sort((a,b) => getCeiling(b) - getCeiling(a)).map(manager => {
            const color   = MANAGER_COLORS[manager];
            const actual  = getActual(manager);
            const ceiling = getCeiling(manager);
            const actualPct  = (actual  / maxCeiling) * 100;
            const ceilPct    = (ceiling / maxCeiling) * 100;
            return (
              <div key={manager} style={I.cfRow}>
                <div style={{ ...I.cfName, color }}>{manager}</div>
                <div style={I.cfBarWrap}>
                  <div style={I.cfTrack}>
                    <div style={{ ...I.cfFill, left: 0, width: `${ceilPct}%`, background: color + "28" }} />
                    <div style={{ ...I.cfFill, left: 0, width: `${actualPct}%`, background: color }} />
                  </div>
                </div>
                <div style={I.cfNums}>
                  <span style={{ color: color + "cc", fontSize: 11 }}><b>{actual}</b></span>
                  <span style={{ color: "#334155", fontSize: 11, margin: "0 3px" }}>→</span>
                  <span style={{ color, fontSize: 11 }}><b>{ceiling}</b><span style={{ color: "#475569", fontSize: 9 }}> max</span></span>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 8, fontSize: 10, color: "#334155", textAlign: "center" }}>
            Solid = pts scored · Faded = pts remaining if all alive players hit projected
          </div>
        </Section>

        {/* H2H in roster mode — projected */}
        <Section title="Head to Head (projected)" icon="⚔️">
          <div style={{ overflowX: "auto" }}>
            <table style={I.h2hTable}>
              <thead>
                <tr>
                  <th style={I.h2hTh}></th>
                  {MANAGERS.map(m => <th key={m} style={{ ...I.h2hTh, color: MANAGER_COLORS[m] }}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...MANAGERS].sort((a,b) => getCeiling(b) - getCeiling(a)).map(rowM => (
                  <tr key={rowM}>
                    <td style={{ ...I.h2hTd, color: MANAGER_COLORS[rowM], fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }}>{rowM}</td>
                    {MANAGERS.map(colM => {
                      if (rowM === colM) return <td key={colM} style={{ ...I.h2hTd, ...I.h2hDiag }}>—</td>;
                      const diff = getCeiling(rowM) - getCeiling(colM);
                      const isOpen = h2hOpen && h2hOpen.row === rowM && h2hOpen.col === colM;
                      return (
                        <td key={colM} style={{ ...I.h2hTd, cursor: "pointer" }}
                          onClick={() => setH2hOpen(isOpen ? null : { row: rowM, col: colM })}>
                          <div style={{ ...I.h2hCell, background: diff > 0 ? "rgba(52,211,153,0.12)" : "rgba(244,63,94,0.12)", color: diff > 0 ? "#34d399" : "#f43f5e", border: `1px solid ${diff > 0 ? "rgba(52,211,153,0.25)" : "rgba(244,63,94,0.25)"}` }}>
                            {diff > 0 ? "+" : ""}{diff}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {h2hOpen && (() => {
            const { row, col } = h2hOpen;
            const rdR = getH2HDetail(row), rdC = getH2HDetail(col);
            const totalR = getCeiling(row), totalC = getCeiling(col);
            const diff = totalR - totalC;
            return (
              <div style={I.h2hDetail}>
                <div style={I.h2hDetailHeader}>
                  <span style={{ color: MANAGER_COLORS[row], fontWeight: 800 }}>{row}</span>
                  <span style={{ color: diff > 0 ? "#34d399" : "#f43f5e", fontSize: 18, fontWeight: 900 }}>{diff > 0 ? "+" : ""}{diff}</span>
                  <span style={{ color: MANAGER_COLORS[col], fontWeight: 800 }}>{col}</span>
                </div>
                <div style={I.h2hDetailRow}>
                  <DetailCol manager={row} data={rdR} total={totalR} isLive={false} />
                  <div style={{ width: 1, background: "#1e293b", margin: "0 8px" }} />
                  <DetailCol manager={col} data={rdC} total={totalC} isLive={false} />
                </div>
                <button onClick={() => setH2hOpen(null)} style={I.h2hClose}>Close ✕</button>
              </div>
            );
          })()}
          <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 8 }}>
            Values = actual + projected remaining for alive players · Click any cell for breakdown
          </div>
        </Section>
      </>}

    </main>
  );
}

function DetailCol({ manager, data, total, isLive }) {
  const color = MANAGER_COLORS[manager];
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{manager}</div>
      {isLive && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
          <span style={{ color: "#34d399" }}>● {data.actual}</span>
          <span style={{ color: "#475569", fontSize: 10 }}> live</span>
        </div>
      )}
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
        <span style={{ color: "#64748b" }}>+ {data.estRem}</span>
        <span style={{ color: "#334155", fontSize: 10 }}> est</span>
      </div>
      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 4, fontSize: 13, fontWeight: 800, color }}>
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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  root:        { minHeight: "100vh", background: "#080f1e", fontFamily: "'Barlow Condensed','Impact',sans-serif", color: "#e2e8f0", position: "relative", overflowX: "hidden" },
  bgGrid:      { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  header:      { position: "sticky", top: 0, zIndex: 100, background: "rgba(8,15,30,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(56,189,248,0.10)", padding: "12px 16px 0" },
  headerTop:   { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 10 },
  eyebrow:     { fontSize: 10, letterSpacing: "0.2em", color: "#38bdf8", fontWeight: 600 },
  title:       { margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: "0.05em", color: "#f1f5f9", lineHeight: 1, textTransform: "uppercase" },
  subtitle:    { fontSize: 11, color: "#64748b", letterSpacing: "0.1em", marginTop: 2 },
  headerRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 },
  liveChip:    { display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#ef4444", letterSpacing: "0.12em" },
  liveDotEl:   { width: 7, height: 7, borderRadius: "50%", background: "#ef4444" },
  metaBlock:   { textAlign: "right" },
  metaRow:     { display: "flex", gap: 5, alignItems: "baseline", justifyContent: "flex-end" },
  metaLabel:   { fontSize: 9, color: "#475569", letterSpacing: "0.12em" },
  metaValue:   { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sourceLabel: { fontSize: 9, letterSpacing: "0.08em", fontWeight: 700 },
  refreshBtn:  { background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.22)", color: "#38bdf8", borderRadius: 4, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700, letterSpacing: "0.05em" },
  tabBar:      { display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)" },
  tab:         { flex: 1, background: "none", border: "none", borderBottom: "2px solid transparent", color: "#475569", fontSize: 13, fontWeight: 700, padding: "10px 4px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" },
  tabActive:   { color: "#38bdf8", borderBottomColor: "#38bdf8" },
  main:        { position: "relative", zIndex: 1, padding: "12px 12px 40px", maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 },
  card:        { background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid transparent", borderRadius: 8, overflow: "hidden", position: "relative" },
  rank:        { position: "absolute", top: 10, right: 12, borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 900, letterSpacing: "0.05em" },
  cardBtn:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px", width: "100%", background: "none", border: "none", cursor: "pointer", color: "inherit", textAlign: "left", gap: 8 },
  cardLeft:    { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  dot:         { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  managerName: { fontSize: 20, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 },
  liveTag:     { fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.1em" },
  managerSub:  { fontSize: 10, color: "#475569", letterSpacing: "0.08em", marginTop: 2 },
  cardRight:   { display: "flex", alignItems: "center", gap: 14, flexShrink: 0 },
  ptsBlock:    { textAlign: "right" },
  smallLabel:  { fontSize: 8, color: "#475569", letterSpacing: "0.12em" },
  bigNum:      { fontSize: 26, fontWeight: 900, lineHeight: 1 },
  projBlock:   { textAlign: "right" },
  projNum:     { fontSize: 14, color: "#64748b", fontWeight: 700, lineHeight: 1 },
  pct:         { fontSize: 10, fontWeight: 700 },
  chevron:     { fontSize: 10, color: "#475569", transition: "transform 0.2s", flexShrink: 0 },
  bar:         { height: 2, background: "rgba(255,255,255,0.05)" },
  barFill:     { height: "100%", borderRadius: 1, transition: "width 0.6s ease" },
  playerList:  { padding: "0 14px 12px", borderTop: "1px solid rgba(255,255,255,0.04)" },
  listHeader:  { display: "grid", gridTemplateColumns: "1fr 70px 44px 44px 40px 32px", padding: "8px 0 4px", fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 2 },
  cName:       { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 },
  cSchool:     { textAlign: "center", fontSize: 11 },
  cLast:       { textAlign: "center", fontSize: 12, fontWeight: 700 },
  cTotal:      { textAlign: "center", fontSize: 14 },
  cProj:       { textAlign: "center", fontSize: 11 },
  cElim:       { textAlign: "center" },
  playerRow:   { display: "grid", gridTemplateColumns: "1fr 70px 44px 44px 40px 32px", padding: "6px 0", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center" },
  liveDot2:    { color: "#ef4444", fontSize: 8, flexShrink: 0 },
  rowTotal:    { display: "flex", alignItems: "center", padding: "8px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4, gap: 4, fontSize: 12 },
  elimBtn:     { width: 22, height: 22, borderRadius: 4, border: "1px solid", cursor: "pointer", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", padding: 0 },
  resetRow:    { padding: "8px 0", display: "flex", justifyContent: "center" },
  resetBtn:    { background: "transparent", border: "1px solid #334155", color: "#64748b", borderRadius: 4, padding: "8px 20px", fontSize: 12, cursor: "pointer", letterSpacing: "0.08em", fontWeight: 600 },
  resetConfirm:{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "12px 20px" },
  cancelBtn:   { background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 4, padding: "6px 16px", fontSize: 12, cursor: "pointer" },
  footer:        { textAlign: "center", fontSize: 9, color: "#1e293b", letterSpacing: "0.05em", padding: "8px 0", lineHeight: 1.6 },
  momentBanner:  { display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.04))", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px" },
  momentFire:    { fontSize: 22, flexShrink: 0 },
  momentBody:    { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  momentLabel:   { fontSize: 8, color: "#fbbf24", letterSpacing: "0.15em", fontWeight: 700 },
  momentText:    { fontSize: 13, color: "#e2e8f0", lineHeight: 1.4 },
  roundBreakdown:{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0 2px", flexWrap: "wrap" },
  roundChip:     { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "3px 6px", gap: 1 },
};

const I = {
  banner:           { display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: 8, padding: "10px 14px" },
  bannerIcon:       { fontSize: 14, color: "#38bdf8", flexShrink: 0, marginTop: 1 },
  bannerText:       { fontSize: 11, color: "#64748b", lineHeight: 1.5 },
  modeBar:          { display: "flex", alignItems: "center", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 4, flexWrap: "wrap" },
  modeBtn:          { flex: 1, background: "transparent", border: "none", color: "#475569", fontSize: 13, fontWeight: 700, padding: "8px 16px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  modeBtnActive:    { background: "rgba(255,255,255,0.06)", color: "#e2e8f0" },
  modeBtnActiveLive:{ background: "rgba(239,68,68,0.12)", color: "#ef4444" },
  modeDivider:      { width: 1, height: 28, background: "rgba(255,255,255,0.07)", flexShrink: 0 },
  modeHint:         { fontSize: 10, color: "#334155", letterSpacing: "0.06em", padding: "0 8px", flexBasis: "100%", textAlign: "center", paddingBottom: 4 },
  livePulse:        { fontSize: 8, color: "#ef4444" },
  section:          { background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" },
  sectionHeader:    { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  sectionIcon:      { fontSize: 16 },
  sectionTitle:     { fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" },
  sectionBody:      { padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10 },
  prCard:           { display: "flex", alignItems: "flex-start", gap: 10 },
  prRank:           { width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0, marginTop: 2 },
  prBody:           { flex: 1, minWidth: 0 },
  prTop:            { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  prLeft:           { display: "flex", alignItems: "center", gap: 8 },
  prName:           { fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" },
  delta:            { fontSize: 13, fontWeight: 700 },
  prPtsGroup:       { display: "flex", alignItems: "baseline", gap: 4 },
  prPts:            { fontSize: 20, fontWeight: 900, lineHeight: 1 },
  prPtsLabel:       { fontSize: 9, color: "#475569", letterSpacing: "0.1em" },
  prBarTrack:       { height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: 6, position: "relative" },
  prBarFill:        { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
  prScout:          { fontSize: 11, color: "#64748b", lineHeight: 1.4 },
  seedLegend:       { display: "flex", flexWrap: "wrap", gap: "6px 12px", paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.04)", marginBottom: 6 },
  seedLegendItem:   { display: "flex", alignItems: "center", gap: 5 },
  sdRow:            { display: "flex", alignItems: "center", gap: 10 },
  sdName:           { width: 44, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 },
  sdDots:           { display: "flex", gap: 5, flex: 1, flexWrap: "wrap" },
  seedDot:          { width: 14, height: 14, borderRadius: "50%", flexShrink: 0, cursor: "default" },
  sdActive:         { fontSize: 11, flexShrink: 0, minWidth: 52, textAlign: "right" },
  regionGrid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  regionCard:       { background: "rgba(8,15,30,0.6)", border: "1px solid", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 },
  regionTitle:      { fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 },
  regionRow:        { display: "flex", alignItems: "center", gap: 6 },
  regionMgrName:    { fontSize: 12, fontWeight: 700, textTransform: "uppercase", width: 40, flexShrink: 0 },
  regionNone:       { fontSize: 10, color: "#ef4444" },
  regionPlayerDots: { display: "flex", gap: 3, flexWrap: "wrap" },
  regionDot:        { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  cfRow:            { display: "flex", alignItems: "center", gap: 10 },
  cfName:           { width: 44, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 },
  cfBarWrap:        { flex: 1 },
  cfTrack:          { height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, position: "relative" },
  cfFill:           { position: "absolute", top: 0, height: "100%", borderRadius: 4, transition: "all 0.5s ease" },
  cfMarker:         { position: "absolute", top: -2, width: 4, height: 12, borderRadius: 2, transform: "translateX(-50%)" },
  cfNums:           { display: "flex", alignItems: "center", minWidth: 110, justifyContent: "flex-end" },
  h2hTable:         { borderCollapse: "collapse", width: "100%", fontSize: 11 },
  h2hTh:            { padding: "6px 4px", textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" },
  h2hTd:            { padding: "3px 2px", textAlign: "center", verticalAlign: "middle" },
  h2hDiag:          { background: "rgba(255,255,255,0.02)", color: "#334155" },
  h2hCell:          { borderRadius: 4, padding: "4px 3px", fontSize: 11, fontWeight: 700, minWidth: 36, display: "inline-block" },
  h2hDetail:        { marginTop: 12, background: "rgba(8,15,30,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "14px" },
  h2hDetailHeader:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, fontSize: 15, fontWeight: 800 },
  h2hDetailRow:     { display: "flex", gap: 0 },
  h2hClose:         { marginTop: 12, width: "100%", background: "transparent", border: "1px solid #1e293b", color: "#475569", borderRadius: 4, padding: "6px", fontSize: 11, cursor: "pointer", letterSpacing: "0.06em" },
  miracleRow:       { display: "flex", alignItems: "flex-start", gap: 10 },
  miracleName:      { width: 44, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0, paddingTop: 2 },
  miracleBody:      { flex: 1, minWidth: 0 },
  miracleBar:       { height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, position: "relative", overflow: "hidden", marginBottom: 4 },
  miracleBarFill:   { position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, transition: "width 0.5s ease" },
  miracleBarCeil:   { position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, transition: "width 0.5s ease" },
  miracleMeta:      { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 },
};
