import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "images", "ux-research");
const chapter2Dir = path.join(root, "assets", "images", "chapter2");
const chapter3Dir = path.join(root, "assets", "images", "chapter3");
const chapter1Dir = path.join(root, "assets", "images", "chapter1");
const sharedDir = path.join(root, "assets", "images", "shared");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(chapter2Dir, { recursive: true });
fs.mkdirSync(chapter3Dir, { recursive: true });
fs.mkdirSync(chapter1Dir, { recursive: true });
fs.mkdirSync(sharedDir, { recursive: true });

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function wrap(text, max = 34) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line || `${line} ${word}`.length <= max) line = line ? `${line} ${word}` : word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock(x, y, lines, { size = 22, color = "#263238", weight = 400, gap = 31 } = {}) {
  return lines.map((line, index) =>
    `<text x="${x}" y="${y + index * gap}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(line)}</text>`
  ).join("\n");
}

function bulletBlock(x, y, items, width = 34, size = 20) {
  let cursor = y;
  const parts = [];
  for (const item of items) {
    const lines = wrap(item, width);
    parts.push(`<circle cx="${x}" cy="${cursor - 7}" r="4" fill="#0B7A75"/>`);
    parts.push(textBlock(x + 16, cursor, lines, { size, gap: 27 }));
    cursor += lines.length * 27 + 13;
  }
  return parts.join("\n");
}

const brand = {
  navy: "#172554",
  blue: "#2563EB",
  sky: "#DBEAFE",
  orange: "#F97316",
  ink: "#1E293B",
  muted: "#64748B",
  line: "#CBD5E1",
  paper: "#F8FAFC",
  white: "#FFFFFF",
};

function brandBulletBlock(x, y, items, width = 34, size = 20, color = brand.blue) {
  let cursor = y;
  const parts = [];
  for (const item of items) {
    const lines = wrap(item, width);
    parts.push(`<circle cx="${x}" cy="${cursor - 7}" r="4" fill="${color}"/>`);
    parts.push(textBlock(x + 16, cursor, lines, { size, color: brand.ink, gap: 27 }));
    cursor += lines.length * 27 + 13;
  }
  return parts.join("\n");
}

function artifactHeader(kicker, title, subtitle) {
  return `<rect width="1800" height="154" fill="${brand.navy}"/>
    <rect x="60" y="42" width="12" height="72" rx="6" fill="${brand.orange}"/>
    ${textBlock(96, 62, [kicker.toUpperCase()], { size: 18, color: "#93C5FD", weight: 800 })}
    ${textBlock(96, 106, [title], { size: 36, color: brand.white, weight: 800 })}
    ${textBlock(1740, 92, [subtitle], { size: 20, color: "#BFDBFE", weight: 600 }).replace('x="1740"', 'x="1740" text-anchor="end"')}`;
}

const personas = [
  {
    file: "user-persona1.svg",
    name: "Carlos Mendoza",
    role: "Fleet Supervisor",
    segment: "Freight transportation companies",
    quote: "I need to know what is happening now.",
    context: ["Coordinates vehicles, drivers and active trips", "Works across desktop tools, phone calls and messaging", "Needs evidence before, during and after each trip"],
    goals: ["Maintain real-time fleet visibility", "Detect route deviations and incidents early", "Close trips with reliable traceability"],
    pains: ["Information fragmented across tools", "Repeated calls delay decisions", "Incomplete operation history"],
    behaviours: ["Checks vehicle and route status", "Contacts drivers when data is unclear", "Reconstructs events manually after incidents"],
  },
  {
    file: "user-persona2.svg",
    name: "Andrea Salazar",
    role: "Logistics Operations Coordinator",
    segment: "Logistics operators and companies",
    quote: "I need one reliable status view.",
    context: ["Coordinates several operations at the same time", "Connects drivers, supervisors and clients", "Compares planned progress with current execution"],
    goals: ["Centralize concurrent operation status", "Communicate accurate progress", "Evaluate outcomes with current data"],
    pains: ["Multiple routes change simultaneously", "Updates arrive through separate channels", "Client communication becomes reactive"],
    behaviours: ["Consolidates updates from stakeholders", "Prioritizes the most urgent exception", "Reviews completion and service performance"],
  },
];

function personaSvg(person) {
  const sections = [
    ["OPERATING CONTEXT", person.context, 650, 260, brand.blue],
    ["GOALS", person.goals, 1220, 260, brand.orange],
    ["PAINS", person.pains, 650, 650, brand.orange],
    ["BEHAVIOURS", person.behaviours, 1220, 650, brand.blue],
  ];
  const cards = sections.map(([title, items, x, y, accent]) => `<g>
    <rect x="${x}" y="${y}" width="520" height="320" rx="24" fill="${brand.white}" stroke="${brand.line}" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="520" height="64" rx="24" fill="${accent}"/>
    <rect x="${x}" y="${y + 42}" width="520" height="22" fill="${accent}"/>
    ${textBlock(x + 28, y + 42, [title], { size: 20, color: brand.white, weight: 800 })}
    ${brandBulletBlock(x + 32, y + 112, items, 38, 20, accent)}
  </g>`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1100" viewBox="0 0 1800 1100">
    <rect width="1800" height="1100" fill="${brand.paper}"/>
    ${artifactHeader("Research archetype", "User Persona", "TrackTruck · LogiGo")}
    <g><rect x="60" y="220" width="520" height="750" rx="32" fill="${brand.navy}"/>
      <circle cx="320" cy="400" r="116" fill="${brand.sky}"/>
      <circle cx="320" cy="365" r="38" fill="${brand.blue}"/>
      <path d="M245 470c12-72 50-104 75-104s63 32 75 104" fill="${brand.blue}"/>
      ${textBlock(320, 580, [person.name], { size: 36, color: brand.white, weight: 800 }).replace('x="320"', 'x="320" text-anchor="middle"')}
      ${textBlock(320, 624, [person.role], { size: 21, color: "#BFDBFE", weight: 600 }).replace('x="320"', 'x="320" text-anchor="middle"')}
      <rect x="115" y="682" width="410" height="1" fill="#475569"/>
      ${textBlock(115, 732, ["SEGMENT"], { size: 16, color: "#93C5FD", weight: 800 })}
      ${textBlock(115, 772, wrap(person.segment, 29), { size: 21, color: brand.white, weight: 600, gap: 30 })}
      <rect x="115" y="855" width="410" height="1" fill="#475569"/>
      ${textBlock(115, 906, wrap(`“${person.quote}”`, 31), { size: 21, color: "#FED7AA", weight: 700, gap: 31 })}
    </g>
    ${cards}
    ${textBlock(650, 1020, ["Research status: hypothesis-based archetype · Validate and refine after interviews"], { size: 18, color: brand.muted, weight: 600 })}
  </svg>`;
}

const toBeScenarios = [
  {
    file: "to-be-scenario-map1.svg", name: "Carlos Mendoza", role: "Fleet Supervisor",
    phases: [
      ["1. Prepare trip", "Creates the operation and assigns route, vehicle and driver.", "Everything is connected before departure.", "Confident"],
      ["2. Start route", "Receives a verified start event and sees the active trip.", "The plan and execution match.", "In control"],
      ["3. Monitor live", "Tracks location, progress, stops and route compliance.", "I can focus on exceptions instead of calling.", "Focused"],
      ["4. Manage incident", "Reviews the alert, context and contacts the driver.", "I have enough evidence to decide quickly.", "Responsive"],
      ["5. Close trip", "Reviews timeline, incidents and final operation record.", "The history is complete and reusable.", "Reassured"],
    ],
  },
  {
    file: "to-be-scenario-map2.svg", name: "Andrea Salazar", role: "Logistics Operations Coordinator",
    phases: [
      ["1. Plan operations", "Organizes routes and assignments from one workspace.", "Priorities and dependencies are visible.", "Prepared"],
      ["2. Coordinate", "Shares a consistent operation state with stakeholders.", "Everyone works from the same information.", "Aligned"],
      ["3. Monitor portfolio", "Uses the dashboard to compare active operations.", "I know which route needs attention first.", "Clear-headed"],
      ["4. Resolve exception", "Opens the affected trip, reviews context and acts.", "I can communicate an accurate response.", "Decisive"],
      ["5. Evaluate results", "Reviews completed trips, history and performance.", "I can explain outcomes and improve planning.", "Confident"],
    ],
  },
];

function toBeSvg(person) {
  const labels = ["PHASES", "DOING", "THINKING", "FEELING"];
  const keys = [0, 1, 2, 3];
  const left = 210, top = 225, cellW = 306, cellH = 190;
  const content = [];
  for (let row = 0; row < 4; row++) {
    content.push(`<rect x="30" y="${top + row * cellH}" width="158" height="${cellH - 10}" rx="18" fill="${brand.navy}"/>`);
    content.push(textBlock(109, top + row * cellH + 96, [labels[row]], { size: 18, color: brand.white, weight: 800 }).replace('x="109"', 'x="109" text-anchor="middle"'));
    for (let col = 0; col < 5; col++) {
      const x = left + col * cellW, y = top + row * cellH;
      const accent = col === 3 ? brand.orange : brand.blue;
      content.push(`<rect x="${x}" y="${y}" width="${cellW - 12}" height="${cellH - 10}" rx="18" fill="${row === 0 ? brand.sky : brand.white}" stroke="${row === 0 ? accent : brand.line}" stroke-width="2"/>`);
      content.push(textBlock(x + 20, y + 46, wrap(person.phases[col][keys[row]], row === 0 ? 19 : 24), { size: row === 0 ? 19 : 17, color: brand.ink, weight: row === 0 ? 800 : 500, gap: 24 }));
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1060" viewBox="0 0 1800 1060"><rect width="1800" height="1060" fill="${brand.paper}"/>
    ${artifactHeader("Future experience", "TO-BE Scenario Map", `${person.name} · ${person.role}`)}
    ${content.join("\n")}
    <rect x="210" y="1000" width="1530" height="4" rx="2" fill="${brand.blue}"/>
    ${textBlock(210, 972, ["Outcome: fewer manual handoffs, faster decisions and a traceable operation history"], { size: 18, color: brand.muted, weight: 600 })}
  </svg>`;
}

function impactMapSvg() {
  const goal = (x, id, metric, period) => `<g>
    <rect x="${x}" y="190" width="550" height="170" rx="24" fill="${brand.navy}"/>
    ${textBlock(x + 28, 230, [id], { size: 17, color: "#93C5FD", weight: 800 })}
    ${textBlock(x + 28, 276, wrap(metric, 38), { size: 23, color: brand.white, weight: 800, gap: 30 })}
    ${textBlock(x + 28, 335, [period], { size: 16, color: "#BFDBFE", weight: 600 })}
  </g>`;
  const actor = (x, title, role, impacts, deliveries, story) => `<g>
    <rect x="${x}" y="455" width="720" height="1020" rx="28" fill="${brand.white}" stroke="${brand.line}" stroke-width="3"/>
    <rect x="${x}" y="455" width="720" height="105" rx="28" fill="${brand.blue}"/><rect x="${x}" y="530" width="720" height="30" fill="${brand.blue}"/>
    ${textBlock(x + 30, 505, [title], { size: 28, color: brand.white, weight: 800 })}
    ${textBlock(x + 30, 540, [role], { size: 17, color: "#DBEAFE", weight: 600 })}
    ${textBlock(x + 30, 615, ["IMPACTS"], { size: 18, color: brand.orange, weight: 800 })}
    ${brandBulletBlock(x + 34, 665, impacts, 34, 21, brand.orange)}
    ${textBlock(x + 30, 885, ["DELIVERABLES"], { size: 18, color: brand.blue, weight: 800 })}
    ${brandBulletBlock(x + 34, 935, deliveries, 34, 21, brand.blue)}
    <rect x="${x + 28}" y="1180" width="664" height="245" rx="22" fill="${brand.sky}"/>
    ${textBlock(x + 56, 1225, ["USER STORY"], { size: 17, color: brand.blue, weight: 800 })}
    ${textBlock(x + 56, 1270, wrap(story, 48), { size: 20, color: brand.ink, weight: 650, gap: 30 })}
  </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1560" viewBox="0 0 2400 1560"><rect width="2400" height="1560" fill="${brand.paper}"/>
    <rect width="2400" height="154" fill="${brand.navy}"/>
    <rect x="60" y="42" width="12" height="72" rx="6" fill="${brand.orange}"/>
    ${textBlock(96, 62, ["OUTCOME ALIGNMENT"], { size: 18, color: "#93C5FD", weight: 800 })}
    ${textBlock(96, 106, ["Impact Map"], { size: 36, color: brand.white, weight: 800 })}
    ${textBlock(2340, 92, ["TrackTruck · LogiGo"], { size: 20, color: "#BFDBFE", weight: 600 }).replace('x="2340"', 'x="2340" text-anchor="end"')}
    ${textBlock(60, 166, ["SMART BUSINESS GOALS"], { size: 18, color: brand.orange, weight: 800 })}
    ${goal(60, "BG01 · VISIBILITY", "90% of active trips with current location, status and progress", "Pilot target · 12 weeks")}
    ${goal(625, "BG02 · INCIDENT RESPONSE", "30% reduction in detection and communication time", "Against each pilot baseline · 12 weeks")}
    ${goal(1190, "BG03 · TRACEABILITY", "95% of completed trips with a consultable operation history", "Pilot target · 12 weeks")}
    ${goal(1755, "BG04 · OPERATIONAL CONTROL", "80% of pilot users complete critical monitoring without scattered records", "Pilot target · week 12")}
    <path d="M1200 360V420M1200 420H420M1200 420H1980" stroke="${brand.orange}" stroke-width="5" fill="none"/>
    ${actor(60, "Carlos Mendoza", "Fleet supervisor", ["See vehicle location and progress", "Detect stops, delays and incidents earlier", "Control assigned vehicles and trips", "Review evidence after trip closure"], ["Live fleet map", "Route progress and stop detail", "Incident workflow and contact", "Vehicle and trip history"], "As a fleet supervisor, I want to see all company vehicles on a map so that I can understand their distribution and current status.")}
    ${actor(840, "Driver", "Assigned trip operator", ["Receive a clear trip assignment", "Report incidents with context", "Reduce repeated status calls", "Confirm trip start and completion"], ["Assignment view", "Trip start and end controls", "Incident reporting", "Direct contact channel"], "As a driver, I want to report an incident during the route so that the company knows what is affecting the trip.")}
    ${actor(1620, "Andrea Salazar", "Logistics operations coordinator", ["Supervise concurrent operations", "Centralize current trip information", "Prioritize operations that require action", "Explain results with traceable evidence"], ["Operations dashboard", "Active-trip detail", "Current incidents and statuses", "Searchable operation history"], "As an operations manager, I want to see a summary of operations so that I can quickly understand the overall transportation status.")}
    ${textBlock(60, 1530, ["Metrics are validation targets, not achieved results; baselines will be established with real pilot evidence."], { size: 18, color: brand.muted, weight: 600 })}
  </svg>`;
}

const backlogItems = [
  [1,"US14","Vehicle location",8],[2,"US30","Fleet map",8],[3,"US15","Trip route",8],[4,"US10","Create trip",5],
  [5,"US13","Active trips",5],[6,"US26","Active-trip detail",5],[7,"US17","Delay detection",5],[8,"US16","Stop detection",5],
  [9,"US18","Report incident",5],[10,"US19","Trip incidents",3],[11,"US35","Incidents on route",5],[12,"US20","Contact driver",5],
  [13,"US43","Operations summary",5],[14,"US44","Dashboard active trips",3],[15,"US45","Current incidents",3],[16,"US33","Route progress",5],
];

function backlogSvg() {
  const columns = [
    ["CORE VISIBILITY", backlogItems.slice(0,4), brand.blue],
    ["ACTIVE OPERATIONS", backlogItems.slice(4,8), "#0284C7"],
    ["INCIDENT RESPONSE", backlogItems.slice(8,12), brand.orange],
    ["OPERATIONS CONTROL", backlogItems.slice(12,16), "#475569"],
  ];
  const cards = columns.map(([label, items, accent], col) => {
    const x = 55 + col * 435;
    return `<g><rect x="${x}" y="220" width="405" height="760" rx="24" fill="#E2E8F0"/>
      <rect x="${x}" y="220" width="405" height="76" rx="24" fill="${accent}"/><rect x="${x}" y="272" width="405" height="24" fill="${accent}"/>
      ${textBlock(x + 24, 268, [label], { size: 19, color: brand.white, weight: 800 })}
      ${items.map((item, i) => { const y = 324 + i * 156; return `<g><rect x="${x + 20}" y="${y}" width="365" height="132" rx="18" fill="${brand.white}"/>
        <rect x="${x + 20}" y="${y}" width="8" height="132" rx="4" fill="${accent}"/>
        ${textBlock(x + 48, y + 36, [`#${item[0]} · ${item[1]}`], { size: 17, color: accent, weight: 800 })}
        ${textBlock(x + 48, y + 75, wrap(item[2], 24), { size: 21, color: brand.ink, weight: 700, gap: 26 })}
        <rect x="${x + 305}" y="${y + 84}" width="56" height="30" rx="15" fill="${brand.sky}"/>
        ${textBlock(x + 333, y + 106, [`${item[3]} SP`], { size: 13, color: brand.navy, weight: 800 }).replace(`x="${x + 333}"`, `x="${x + 333}" text-anchor="middle"`)}</g>`; }).join("\n")}
    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1060" viewBox="0 0 1800 1060"><rect width="1800" height="1060" fill="${brand.paper}"/>
    ${artifactHeader("Prioritized baseline", "Product Backlog", "49 stories · AV1")}
    ${textBlock(60, 193, ["Top 16 stories shown · complete ordered backlog remains in the report"], { size: 18, color: brand.muted, weight: 600 })}
    ${cards}
    ${textBlock(60, 1030, ["Priority follows operational value: live visibility → active control → incidents → coordination"], { size: 18, color: brand.muted, weight: 600 })}
  </svg>`;
}

function leanUxCanvasSvg() {
  const blocks = [
    ["1 · BUSINESS PROBLEM", ["Fragmented fleet information", "Slow incident response", "Limited trip traceability"]],
    ["2 · BUSINESS OUTCOMES", ["More operational visibility", "Faster exception handling", "Reliable trip history"]],
    ["3 · USERS", ["Fleet supervisors", "Logistics coordinators", "Drivers and operations teams"]],
    ["4 · USER OUTCOMES", ["Know current trip status", "Act with timely context", "Review complete evidence"]],
    ["5 · SOLUTIONS", ["Live fleet map", "Routes, stops and incidents", "Communication and history"]],
    ["6 · HYPOTHESES", ["Centralized status reduces uncertainty", "Alerts improve response time", "History improves traceability"]],
    ["7 · LEARNING PRIORITIES", ["Current monitoring workflow", "Most costly information gaps", "Adoption and trust barriers"]],
    ["8 · VALIDATION", ["Six segment interviews", "Prototype task walkthroughs", "Evidence-based backlog revision"]],
  ];
  const cards = blocks.map(([title, items], i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 55 + col * 435, y = 230 + row * 365;
    const accent = i === 7 ? brand.orange : brand.blue;
    return `<g><rect x="${x}" y="${y}" width="405" height="325" rx="24" fill="${brand.white}" stroke="${brand.line}" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="405" height="70" rx="24" fill="${accent}"/><rect x="${x}" y="${y + 48}" width="405" height="22" fill="${accent}"/>
      ${textBlock(x + 24, y + 44, [title], { size: 18, color: brand.white, weight: 800 })}
      ${brandBulletBlock(x + 28, y + 124, items, 29, 19, accent)}
    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1040" viewBox="0 0 1800 1040"><rect width="1800" height="1040" fill="${brand.paper}"/>
    ${artifactHeader("Lean UX", "TrackTruck Canvas", "Evidence before certainty")}
    ${textBlock(60, 196, ["Problem → outcomes → users → assumptions → validation"], { size: 20, color: brand.muted, weight: 600 })}
    ${cards}
    <rect x="55" y="980" width="1695" height="4" rx="2" fill="${brand.orange}"/>
    ${textBlock(55, 955, ["Current hypotheses remain provisional until the six planned interviews are completed."], { size: 18, color: brand.muted, weight: 600 })}
  </svg>`;
}

function collaborationSvg() {
  const people = [
    ["Jean Franck", "Product identity · UX maps · repository structure"],
    ["Anhelo Rodrigo", "Competitive analysis · interview design"],
    ["Alexander Piero", "Personas · task matrix · empathy research"],
    ["Sebastián", "User Stories · acceptance criteria · prioritization"],
  ];
  const cards = people.map(([name, contribution], i) => {
    const x = 70 + i * 425;
    return `<g><rect x="${x}" y="295" width="390" height="390" rx="28" fill="${brand.white}" stroke="${brand.line}" stroke-width="2"/>
      <circle cx="${x + 195}" cy="405" r="66" fill="${i === 1 ? "#FFEDD5" : brand.sky}"/>
      <circle cx="${x + 195}" cy="385" r="23" fill="${i === 1 ? brand.orange : brand.blue}"/>
      <path d="M${x + 150} 455c8-43 31-62 45-62s37 19 45 62" fill="${i === 1 ? brand.orange : brand.blue}"/>
      ${textBlock(x + 195, 522, [name], { size: 26, color: brand.navy, weight: 800 }).replace(`x="${x + 195}"`, `x="${x + 195}" text-anchor="middle"`)}
      ${textBlock(x + 42, 574, wrap(contribution, 27), { size: 18, color: brand.ink, weight: 600, gap: 27 })}
    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1000" viewBox="0 0 1800 1000"><rect width="1800" height="1000" fill="${brand.paper}"/>
    ${artifactHeader("AV1 collaboration", "Project Report Insights", "LogiGo · TrackTruck")}
    ${textBlock(60, 214, ["Four contributors · one version-controlled report · shared product baseline"], { size: 24, color: brand.ink, weight: 700 })}
    ${cards}
    <rect x="70" y="745" width="1660" height="150" rx="28" fill="${brand.navy}"/>
    ${textBlock(110, 798, ["CURRENT DELIVERY STATUS"], { size: 17, color: "#93C5FD", weight: 800 })}
    ${textBlock(110, 850, ["Chapters I–III and research artifacts prepared"], { size: 28, color: brand.white, weight: 800 })}
    ${textBlock(1690, 830, ["NEXT EVIDENCE"], { size: 16, color: "#FED7AA", weight: 800 }).replace('x="1690"', 'x="1690" text-anchor="end"')}
    ${textBlock(1690, 865, ["6 real interviews"], { size: 24, color: brand.white, weight: 800 }).replace('x="1690"', 'x="1690" text-anchor="end"')}
  </svg>`;
}

const empathyPeople = [
  {
    slug: "carlos-mendoza",
    name: "Carlos Mendoza",
    role: "Fleet Supervisor",
    segment: "Freight transportation companies",
    cards: [
      ["Needs to do", ["Keep vehicles and drivers under control", "Detect delays and incidents quickly", "Verify route compliance"]],
      ["Sees", ["Scattered GPS and messaging tools", "Multiple vehicles moving at once", "Incomplete trip records"]],
      ["Says", ["I need to know what is happening now", "Calling every driver slows me down", "I need evidence after each trip"]],
      ["Does", ["Calls drivers repeatedly", "Checks routes in separate tools", "Records incidents manually"]],
      ["Hears", ["Drivers reporting traffic and stops", "Managers asking for immediate status", "Clients requesting reliable ETAs"]],
      ["Thinks and feels", ["Uncertain when information is delayed", "Responsible for safety and continuity", "Relieved when a trip closes correctly"]],
      ["Pains", ["No centralized operational view", "Late incident detection", "Weak historical traceability"]],
      ["Gains", ["Real-time fleet visibility", "Faster incident response", "Reliable operation history"]],
    ],
  },
  {
    slug: "andrea-salazar",
    name: "Andrea Salazar",
    role: "Logistics Operations Coordinator",
    segment: "Logistics operators and companies",
    cards: [
      ["Needs to do", ["Coordinate concurrent transport operations", "Communicate accurate progress", "Evaluate completed operations"]],
      ["Sees", ["Information split across channels", "Competing priorities and deadlines", "Several routes changing simultaneously"]],
      ["Says", ["I need one reliable status view", "A delay in one route affects others", "I cannot chase every update"]],
      ["Does", ["Consolidates updates manually", "Contacts multiple stakeholders", "Compares planned and actual progress"]],
      ["Hears", ["Clients asking for delivery status", "Drivers reporting exceptions", "Supervisors requesting performance data"]],
      ["Thinks and feels", ["Overloaded by simultaneous operations", "Concerned about outdated information", "Confident when decisions use current data"]],
      ["Pains", ["Difficult simultaneous supervision", "Slow access to current information", "Fragmented operation history"]],
      ["Gains", ["Centralized operation visibility", "Better route traceability", "Faster, informed decisions"]],
    ],
  },
];

function empathySvg(person) {
  const positions = [[60,180],[630,180],[1200,180],[60,500],[1200,500],[60,820],[630,820],[1200,820]];
  const cards = person.cards.map(([title, items], index) => {
    const [x, y] = positions[index];
    return `<g><rect x="${x}" y="${y}" width="540" height="280" rx="24" fill="#FFFFFF" stroke="#DCE8E7" stroke-width="3"/>
      <rect x="${x}" y="${y}" width="540" height="58" rx="24" fill="#E7F5F3"/>
      <rect x="${x}" y="${y + 36}" width="540" height="22" fill="#E7F5F3"/>
      ${textBlock(x + 28, y + 39, [title.toUpperCase()], { size: 20, color: "#075E59", weight: 700 })}
      ${bulletBlock(x + 32, y + 96, items, 36, 20)}</g>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200">
    <rect width="1800" height="1200" fill="#F5F8F7"/>
    <rect width="1800" height="132" fill="#123C3A"/>
    ${textBlock(60, 58, ["EMPATHY MAP"], { size: 34, color: "#FFFFFF", weight: 800 })}
    ${textBlock(60, 101, [`${person.name} · ${person.role}`], { size: 24, color: "#BFE3DF", weight: 500 })}
    ${cards}
    <g><circle cx="900" cy="640" r="150" fill="#0B7A75"/>
      <circle cx="900" cy="594" r="46" fill="#D8F0ED"/>
      <path d="M820 720c10-72 52-105 80-105s70 33 80 105" fill="#D8F0ED"/>
      ${textBlock(900, 744, [person.name], { size: 27, color: "#FFFFFF", weight: 800 }).replace('x="900"', 'x="900" text-anchor="middle"')}
      ${textBlock(900, 808, [person.role], { size: 16, color: "#526866", weight: 600 }).replace('x="900"', 'x="900" text-anchor="middle"')}
    </g>
    ${textBlock(60, 1160, [`Segment: ${person.segment}`], { size: 18, color: "#526866", weight: 500 })}
  </svg>`;
}

const scenarios = [
  {
    slug: "carlos-mendoza",
    name: "Carlos Mendoza",
    role: "Fleet Supervisor",
    phases: [
      { phase: "1. Prepare trip", doing: "Assigns vehicle, driver and route using separate records.", thinking: "Do I have every resource and document ready?", feeling: "Focused, but cautious about missing information.", status: "blank" },
      { phase: "2. Start trip", doing: "Confirms departure by phone or messaging and notes the start time.", thinking: "Did the driver leave on time and follow the plan?", feeling: "Alert while waiting for reliable confirmation.", status: "neutral" },
      { phase: "3. Monitor route", doing: "Checks GPS tools and repeatedly contacts the driver for updates.", thinking: "Is this stop normal, or is the operation at risk?", feeling: "Uncertain and pressured when data is delayed.", status: "negative" },
      { phase: "4. Resolve and close", doing: "Coordinates incidents manually and reconstructs the trip history.", thinking: "Can I explain what happened and prevent it next time?", feeling: "Stressed during incidents; relieved after closure.", status: "negative" },
    ],
  },
  {
    slug: "andrea-salazar",
    name: "Andrea Salazar",
    role: "Logistics Operations Coordinator",
    phases: [
      { phase: "1. Plan operations", doing: "Reviews schedules, vehicles and routes across multiple sources.", thinking: "Are priorities and dependencies correctly aligned?", feeling: "Organized, but aware of incomplete information.", status: "blank" },
      { phase: "2. Coordinate dispatch", doing: "Confirms assignments and communicates plans to stakeholders.", thinking: "Does everyone have the same current information?", feeling: "Busy and responsible for synchronization.", status: "neutral" },
      { phase: "3. Monitor portfolio", doing: "Tracks several operations and consolidates updates manually.", thinking: "Which delay requires action first?", feeling: "Overloaded when multiple routes change together.", status: "negative" },
      { phase: "4. Resolve and evaluate", doing: "Escalates incidents, informs clients and compares final outcomes.", thinking: "Can I trace decisions and explain service performance?", feeling: "Pressured during disruption; satisfied with clear evidence.", status: "negative" },
    ],
  },
];

function scenarioSvg(person) {
  const left = 210, top = 210, cellW = 382, cellH = 205;
  const rowNames = ["PHASES", "DOING", "THINKING", "FEELING"];
  const key = ["phase", "doing", "thinking", "feeling"];
  const cells = [];
  for (let row = 0; row < 4; row++) {
    cells.push(`<rect x="30" y="${top + row * cellH}" width="160" height="${cellH - 10}" rx="18" fill="#123C3A"/>`);
    cells.push(textBlock(110, top + row * cellH + 102, [rowNames[row]], { size: 19, color: "#FFFFFF", weight: 800 }).replace('x="110"', 'x="110" text-anchor="middle"'));
    for (let col = 0; col < 4; col++) {
      const x = left + col * cellW, y = top + row * cellH;
      const fill = row === 0 ? "#E7F5F3" : "#FFFFFF";
      const stroke = person.phases[col].status === "negative" ? "#E07A5F" : person.phases[col].status === "blank" ? "#E0A62F" : "#DCE8E7";
      const dash = person.phases[col].status === "blank" ? ' stroke-dasharray="12 8"' : "";
      const lines = wrap(person.phases[col][key[row]], row === 0 ? 25 : 29);
      cells.push(`<rect x="${x}" y="${y}" width="${cellW - 12}" height="${cellH - 10}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="4"${dash}/>`);
      cells.push(textBlock(x + 24, y + 52, lines, { size: row === 0 ? 23 : 20, color: row === 0 ? "#075E59" : "#263238", weight: row === 0 ? 800 : 500, gap: 29 }));
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1100" viewBox="0 0 1800 1100">
    <rect width="1800" height="1100" fill="#F5F8F7"/>
    <rect width="1800" height="132" fill="#123C3A"/>
    ${textBlock(60, 58, ["AS-IS SCENARIO MAP"], { size: 34, color: "#FFFFFF", weight: 800 })}
    ${textBlock(60, 101, [`${person.name} · ${person.role}`], { size: 24, color: "#BFE3DF", weight: 500 })}
    ${cells.join("\n")}
    <circle cx="62" cy="1047" r="8" fill="#E07A5F"/><text x="80" y="1054" font-size="18" fill="#526866">Negative area</text>
    <rect x="260" y="1039" width="18" height="18" rx="3" fill="none" stroke="#E0A62F" stroke-width="3" stroke-dasharray="5 3"/><text x="290" y="1054" font-size="18" fill="#526866">Blank area to investigate</text>
  </svg>`;
}

for (const person of empathyPeople) {
  fs.writeFileSync(path.join(outDir, `empathy-map-${person.slug}.svg`), empathySvg(person), "utf8");
}
for (const person of scenarios) {
  fs.writeFileSync(path.join(outDir, `as-is-scenario-${person.slug}.svg`), scenarioSvg(person), "utf8");
}

for (const person of personas) {
  fs.writeFileSync(path.join(chapter2Dir, person.file), personaSvg(person), "utf8");
}
for (const person of toBeScenarios) {
  fs.writeFileSync(path.join(chapter3Dir, person.file), toBeSvg(person), "utf8");
}
fs.writeFileSync(path.join(chapter3Dir, "impact-map.svg"), impactMapSvg(), "utf8");
fs.writeFileSync(path.join(chapter3Dir, "product-backlog.svg"), backlogSvg(), "utf8");
fs.writeFileSync(path.join(chapter1Dir, "lean_ux_canvas.svg"), leanUxCanvasSvg(), "utf8");
fs.writeFileSync(path.join(sharedDir, "report_av1.svg"), collaborationSvg(), "utf8");

console.log("Generated 12 report artifacts across ux-research, chapter1, chapter2, chapter3 and shared");
