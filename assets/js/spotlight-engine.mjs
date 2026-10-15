// Pure search helpers shared by the command center and its regression tests.
export function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// Keep intent handling deliberately small and local. Unknown words still have
// to match; this is not a fuzzy interpretation of arbitrary questions.
const searchText = (value) =>
  normalize(value).replace(/\bartificial intelligence\b/g, "ai");

function queryIntent(query) {
  const original = searchText(String(query).slice(0, 200));
  const phrase = original.replace(
    /^(?:(?:please )?(?:show me|find|search for|look for))\s+/,
    "",
  );
  let words = phrase.split(" ").filter(Boolean);
  const writing = words.some((word) =>
    /^(articles?|posts?|writing)$/.test(word),
  );
  const projects = words.some((word) => /^projects?$/.test(word));
  const recent =
    words.some((word) => /^(latest|recent|newest)$/.test(word)) &&
    (writing || projects);
  const projectTopic = projects && words.length > 1;
  if (writing || projectTopic) {
    words = words.filter(
      (word) =>
        !/^(articles?|posts?|writing|about|on|the)$/.test(word) &&
        !(projectTopic && /^projects?$/.test(word)) &&
        !(recent && /^(latest|recent|newest)$/.test(word)),
    );
  }
  return {
    phrase: words.join(" "),
    tokens: [...new Set(words)],
    writing: writing || recent,
    projects: projectTopic,
    recent,
  };
}

function containsTerm(text, token) {
  // Acronyms such as AI must not match incidental letters in “said” or “trail”.
  return token.length <= 2
    ? text.split(" ").includes(token)
    : text.includes(token);
}

export function prepareEntry(entry) {
  const title = searchText(entry.title);
  const aliases = (entry.aliases || [])
    .flat(Infinity)
    .map(searchText)
    .filter(Boolean);
  return {
    ...entry,
    search: {
      title,
      aliases,
      words: [...new Set(`${title} ${aliases.join(" ")}`.split(" "))],
      description: searchText(entry.description),
      metadata: searchText([entry.category, ...(entry.tags || [])].join(" ")),
      content: searchText(entry.content),
    },
  };
}

// One insertion, deletion, replacement, or adjacent transposition. Short tokens
// deliberately require an exact match to avoid noisy matches for acronyms.
export function isCloseWord(a, b) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > 1)
    return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    return (
      a.slice(i + 1) === b.slice(i + 1) ||
      (a[i] === b[i + 1] &&
        a[i + 1] === b[i] &&
        a.slice(i + 2) === b.slice(i + 2))
    );
  }
  return a.length > b.length
    ? a.slice(i + 1) === b.slice(i)
    : a.slice(i) === b.slice(i + 1);
}

export function rankEntries(entries, query, filter = "all") {
  if (!normalize(String(query).slice(0, 200))) return [];
  const { phrase, tokens, writing, projects, recent } = queryIntent(query);
  return entries
    .filter((entry) => filter === "all" || entry.kind === filter)
    .filter((entry) => !writing || entry.kind === "writing")
    .filter((entry) => !projects || entry.topics?.includes("projects"))
    .map((entry) => {
      const s = entry.search;
      let score = 0;
      if (!phrase) score = 0;
      else if (s.title === phrase) score += 1200;
      else if (s.aliases.includes(phrase)) score += 1100;
      else if (s.title.startsWith(phrase)) score += 700;
      else if (s.title.includes(phrase)) score += 500;
      for (const token of tokens) {
        if (s.words.includes(token)) score += 150;
        else if (
          token.length > 2 &&
          s.words.some((word) => word.startsWith(token))
        )
          score += 100;
        else if (
          containsTerm(s.title, token) ||
          s.aliases.some((alias) => containsTerm(alias, token))
        )
          score += 70;
        else if (containsTerm(s.metadata, token)) score += 45;
        else if (containsTerm(s.description, token)) score += 30;
        else if (containsTerm(s.content, token)) score += 10;
        else if (s.words.some((word) => isCloseWord(token, word))) score += 20;
        else return null;
      }
      // For a topic + projects query, individual build stories are more useful
      // than the broad portfolio/category pages that mention the same topic.
      if (projects && entry.kind === "writing") score += 200;
      return { entry, score };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        (recent ? (b.entry.timestamp || 0) - (a.entry.timestamp || 0) : 0) ||
        b.score - a.score ||
        (b.entry.timestamp || 0) - (a.entry.timestamp || 0) ||
        a.entry.title.localeCompare(b.entry.title),
    )
    .map((result) => result.entry);
}

export function excerpt(entry, query, length = 190) {
  const description = entry.description || "";
  const content = entry.content || description;
  const tokens = normalize(query)
    .split(" ")
    .filter((token) => token.length > 2);
  const titleMatch = normalize(entry.title) === normalize(query);
  const matchingToken =
    !titleMatch &&
    tokens.find(
      (token) =>
        normalize(content).includes(token) &&
        !normalize(description).includes(token),
    );
  const source = matchingToken ? content : description || content;
  const matchIndex = matchingToken
    ? normalize(source).indexOf(matchingToken)
    : 0;
  let start = Math.max(0, matchIndex - 45);
  if (start) {
    const nextSpace = source.indexOf(" ", start);
    if (nextSpace !== -1 && nextSpace < matchIndex) start = nextSpace + 1;
  }
  let text = source.slice(start, start + length).trim();
  if (start + length < source.length) {
    const lastSpace = text.lastIndexOf(" ");
    if (lastSpace > length / 2) text = text.slice(0, lastSpace);
    text += "…";
  }
  return `${start ? "…" : ""}${text}`;
}

export function readRecents(raw, now = Date.now()) {
  try {
    const values = JSON.parse(raw);
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    return values
      .filter((value) => {
        if (
          !value ||
          typeof value.id !== "string" ||
          value.id.length > 500 ||
          !Number.isFinite(value.time) ||
          value.time > now ||
          now - value.time > 30 * 86400000 ||
          seen.has(value.id)
        )
          return false;
        seen.add(value.id);
        return true;
      })
      .slice(0, 6)
      .map(({ id, time }) => ({ id, time }));
  } catch {
    return [];
  }
}
