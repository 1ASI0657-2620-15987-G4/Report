import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "images", "ux-research");
fs.mkdirSync(outDir, { recursive: true });

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

console.log(`Generated 4 UX artifacts in ${outDir}`);
