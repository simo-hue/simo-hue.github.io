import {
  prepareEntry,
  rankEntries,
  excerpt,
  readRecents,
} from "./spotlight-engine.mjs";

(() => {
  const configNode = document.getElementById("site-search-config");
  if (!configNode) return;
  const config = JSON.parse(configNode.textContent);
  const dialog = document.getElementById("spotlight");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const storageKey = "simo:spotlight:recent:v1";
  const filters = ["all", "pages", "writing", "actions"];
  const labels = { pages: "Pages", writing: "Writing", actions: "Actions" };
  let recents = [];
  try {
    recents = readRecents(localStorage.getItem(storageKey));
  } catch {
    /* Private browsing can deny storage. */
  }
  let pages = [];
  let loaded = false;
  let loading = null;
  let loadError = false;
  let returnFocus = null;
  const panels = [];
  const paths = {
    page: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    home: '<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',
    projects:
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    person:
      '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    writing:
      '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1zm0 0v15"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
    link: '<path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    theme: '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
    network:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-11v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/>',
    history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2"/>',
  };
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function icon(name) {
    const el = element("span", "spotlight-result-icon");
    el.setAttribute("aria-hidden", "true");
    // Only local, fixed SVG paths are inserted as markup. Search content is text.
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.page}</svg>`;
    return el;
  }
  function highlight(el, text, query) {
    const tokens = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!tokens.length) {
      el.textContent = text;
      return;
    }
    const pattern = new RegExp(tokens.join("|"), "gi");
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      el.append(
        document.createTextNode(text.slice(cursor, match.index)),
        element("mark", "", match[0]),
      );
      cursor = match.index + match[0].length;
    }
    el.append(document.createTextNode(text.slice(cursor)));
  }
  function action(id, title, description, key, iconName, extra = {}) {
    return prepareEntry({
      id: `action:${id}`,
      kind: "actions",
      category: "Action",
      title,
      description,
      key,
      icon: iconName,
      aliases: [key, ...(extra.aliases || [])],
      ...extra,
    });
  }
  function actions() {
    const dark = document.documentElement.classList.contains("dark");
    return [
      action(
        "resume",
        "Download résumé",
        "Save Simone’s résumé as a PDF.",
        "cv",
        "download",
        {
          href: config.resume,
          download: true,
          aliases: ["cv", "resume", "curriculum vitae"],
        },
      ),
      action(
        "failure-cv",
        "Download Failure CV",
        "Save Simone’s failure CV as a PDF.",
        "fcv",
        "download",
        {
          href: config.failure_cv,
          download: true,
          aliases: [
            "failure cv",
            "failures",
            "rejections",
            "failure resume",
            "cv of failures",
          ],
        },
      ),
      action(
        "theme",
        `Switch to ${dark ? "light" : "dark"} mode`,
        "Change the site’s appearance. Your preference stays in this browser.",
        "th",
        "theme",
        { aliases: ["th", "theme", "toggle theme", "appearance"] },
      ),
      action(
        "copy-link",
        "Copy page link",
        "Copy a link to the page you’re currently viewing.",
        "cl",
        "link",
        { aliases: ["cl", "share", "copy url"] },
      ),
      action("copy-email", "Copy email address", config.email, "ce", "copy", {
        aliases: ["ce", "contact email"],
      }),
      action(
        "email",
        "Write an email",
        "Open a draft in your email app. Nothing is sent automatically.",
        "em",
        "mail",
        {
          href: `mailto:${config.email}`,
          aliases: ["em", "contact", "send email"],
        },
      ),
      action(
        "github",
        "Open GitHub",
        "Explore Simone’s code and open-source projects in a new tab.",
        "gh",
        "code",
        {
          href: config.profiles.github,
          external: true,
          aliases: ["gh", "github", "code", "repositories"],
        },
      ),
      action(
        "linkedin",
        "Open LinkedIn",
        "Connect with Simone on LinkedIn in a new tab.",
        "li",
        "network",
        {
          href: config.profiles.linkedin,
          external: true,
          aliases: ["li", "linkedin", "connect", "professional"],
        },
      ),
      action(
        "clear-history",
        "Clear recent selections",
        "Remove command-center history saved in this browser.",
        "ch",
        "history",
        { aliases: ["ch", "clear history", "forget history", "privacy"] },
      ),
    ].filter(
      (entry) =>
        ![
          "action:resume",
          "action:failure-cv",
          "action:github",
          "action:linkedin",
        ].includes(entry.id) || entry.href,
    );
  }
  function allEntries() {
    return [...pages, ...actions()];
  }
  function saveRecent(entry) {
    if (entry.id === "action:clear-history") return;
    recents = [
      { id: entry.id, time: Date.now() },
      ...recents.filter((item) => item.id !== entry.id),
    ].slice(0, 6);
    try {
      localStorage.setItem(storageKey, JSON.stringify(recents));
    } catch {
      /* Keep session-only history. */
    }
  }
  async function loadIndex() {
    if (loaded || loading) return loading;
    loadError = false;
    loading = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(config.indexURL, {
          signal: controller.signal,
          cache: "no-cache",
        });
        if (!response.ok) throw new Error("Search index unavailable");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid search index");
        pages = data
          .filter(
            (entry) =>
              entry &&
              typeof entry.title === "string" &&
              typeof entry.href === "string" &&
              entry.href.startsWith("/") &&
              !entry.href.startsWith("//") &&
              ["pages", "writing"].includes(entry.kind),
          )
          .map(prepareEntry);
        loaded = true;
      } catch {
        loadError = true;
      } finally {
        clearTimeout(timeout);
        loading = null;
        panels
          .filter((panel) => panel.isActive())
          .forEach((panel) => panel.render());
      }
    })();
    panels
      .filter((panel) => panel.isActive())
      .forEach((panel) => panel.render());
    return loading;
  }

  class CommandPanel {
    constructor(root) {
      this.root = root;
      this.id = root.dataset.commandPanel;
      this.modal = !!root.closest("dialog");
      this.input = root.querySelector(".spotlight-input");
      this.results = root.querySelector(".spotlight-results");
      this.scroll = root.querySelector(".spotlight-scroll");
      this.empty = root.querySelector("[data-command-empty]");
      this.more = root.querySelector("[data-command-more]");
      this.feedback = root.querySelector("[data-command-feedback]");
      this.filter = "all";
      this.limit = 12;
      this.selected = 0;
      this.previewEnabled = false;
      this.rows = [];
      this.entries = [];
      this.bind();
    }
    isActive() {
      return this.modal ? dialog.open : !dialog?.open;
    }
    bind() {
      const updateQuery = (event) => {
        if (event.isComposing) return;
        this.previewEnabled = !!this.input.value.trim();
        this.limit = 12;
        this.feedback.hidden = true;
        this.render();
        this.updateURL();
      };
      this.input.addEventListener("input", updateQuery);
      this.input.addEventListener("compositionend", updateQuery);
      this.root
        .querySelector("[data-command-clear]")
        .addEventListener("click", () => {
          this.input.value = "";
          this.previewEnabled = false;
          this.limit = 12;
          this.feedback.hidden = true;
          this.render();
          this.updateURL();
          this.input.focus();
        });
      this.root
        .querySelectorAll("[data-command-filter]")
        .forEach((button, index) => {
          button.addEventListener("click", () =>
            this.setFilter(button.dataset.commandFilter),
          );
          button.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 3
                  : (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
            this.setFilter(filters[next], false);
            this.root
              .querySelector(`[data-command-filter="${filters[next]}"]`)
              .focus();
          });
        });
      this.root
        .querySelector("[data-command-retry]")
        .addEventListener("click", () => {
          loadIndex();
          this.input.focus();
        });
      this.more.addEventListener("click", () => {
        const shown = new Set(this.entries.map((entry) => entry.id));
        this.limit += 12;
        this.render();
        this.previewEnabled = true;
        this.select(
          this.entries.findIndex((entry) => !shown.has(entry.id)),
          true,
        );
        this.input.focus({ preventScroll: true });
      });
      this.root.addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.altKey && /^Digit[1-4]$/.test(event.code)) {
          event.preventDefault();
          this.setFilter(filters[Number(event.code.slice(-1)) - 1]);
        }
        if (event.target !== this.input) return;
        if (
          ["ArrowDown", "ArrowUp"].includes(event.key) &&
          !event.altKey &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          event.preventDefault();
          this.previewEnabled = true;
          this.select(
            (this.selected +
              (event.key === "ArrowDown" ? 1 : this.entries.length - 1)) %
              this.entries.length,
            true,
          );
        } else if (event.key === "Enter" && this.entries[this.selected]) {
          event.preventDefault();
          this.execute(this.entries[this.selected]);
        } else if (event.key === "Escape" && !this.modal) {
          this.input.value = "";
          this.setFilter("all");
        }
      });
    }
    setFilter(filter, focus = true) {
      this.filter = filters.includes(filter) ? filter : "all";
      this.limit = 12;
      this.feedback.hidden = true;
      this.previewEnabled = !!this.input.value.trim();
      this.render();
      this.updateURL();
      if (focus) this.input.focus({ preventScroll: true });
    }
    updateURL() {
      if (this.modal) return;
      const url = new URL(location.href);
      const query = this.input.value.trim();
      if (query) url.searchParams.set("s", query);
      else url.searchParams.delete("s");
      if (this.filter !== "all") url.searchParams.set("view", this.filter);
      else url.searchParams.delete("view");
      history.replaceState(history.state, "", url);
    }
    render() {
      const query = this.input.value.trim();
      const entries = allEntries();
      const groups = [];
      let total = 0;
      this.entries = [];
      this.rows = [];
      this.selected = 0;
      this.results.replaceChildren();
      this.results.setAttribute("aria-busy", String(!!loading));
      this.input.setAttribute("aria-expanded", "true");
      this.root.querySelector("[data-command-clear]").hidden = !query;
      this.root.querySelectorAll("[data-command-filter]").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.commandFilter === this.filter),
        );
      });
      const notice = this.root.querySelector("[data-command-notice]");
      notice.hidden = !loadError;
      this.root.querySelector("[data-command-notice-text]").textContent =
        "Page search couldn’t load. Actions still work.";
      if (!query && this.filter === "all") {
        const recent = recents
          .map((item) => entries.find((entry) => entry.id === item.id))
          .filter(Boolean)
          .slice(0, 3);
        if (recent.length) groups.push({ label: "Recent", entries: recent });
        const suggested = config.suggestions
          .map((id) => entries.find((entry) => entry.id === id))
          .filter(
            (entry) => entry && !recent.some((item) => item.id === entry.id),
          )
          .slice(0, 6 - recent.length);
        if (suggested.length)
          groups.push({ label: "Suggested", entries: suggested });
        total = recent.length + suggested.length;
      } else {
        let matches;
        if (query) matches = rankEntries(entries, query, this.filter);
        else
          matches = entries
            .filter((entry) => entry.kind === this.filter)
            .sort((a, b) => {
              if (this.filter === "writing") return b.timestamp - a.timestamp;
              if (this.filter === "actions") return 0;
              return a.title.localeCompare(b.title);
            });
        total = matches.length;
        const visible = matches.slice(0, this.limit);
        if (query && this.filter === "all" && visible.length)
          groups.push({ label: "Top hit", entries: [visible.shift()] });
        for (const entry of visible) {
          let group = groups.find((group) => group.kind === entry.kind);
          if (!group) {
            group = {
              label: labels[entry.kind],
              kind: entry.kind,
              entries: [],
            };
            groups.push(group);
          }
          group.entries.push(entry);
        }
      }
      for (const [groupIndex, group] of groups.entries()) {
        const container = element("div", "spotlight-group");
        container.setAttribute("role", "group");
        const heading = element("div", "spotlight-group-label", group.label);
        heading.id = `${this.id}-group-${groupIndex}`;
        container.setAttribute("aria-labelledby", heading.id);
        container.append(heading);
        for (const entry of group.entries) {
          const index = this.entries.length;
          this.entries.push(entry);
          const row = element("div", "spotlight-result");
          row.id = `${this.id}-option-${index}`;
          row.setAttribute("role", "option");
          row.setAttribute("aria-selected", "false");
          const body = element("div", "spotlight-result-body");
          const title = element("div", "spotlight-result-title");
          title.id = `${row.id}-title`;
          highlight(title, entry.title, query);
          const metadata =
            entry.kind === "writing"
              ? [
                  entry.category,
                  entry.date,
                  `${Math.max(1, entry.readingTime)} min read`,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "";
          const meta = element("div", "spotlight-result-meta", metadata);
          const accessibleMeta = element(
            "span",
            "sr-only",
            `${metadata || entry.category}${entry.external ? ", opens in a new tab" : ""}`,
          );
          accessibleMeta.id = `${row.id}-meta`;
          meta.setAttribute("aria-hidden", "true");
          row.setAttribute(
            "aria-labelledby",
            `${title.id} ${accessibleMeta.id}`,
          );
          const preview = element("div", "spotlight-preview");
          if (
            typeof entry.thumbnail === "string" &&
            entry.thumbnail.startsWith("/") &&
            !entry.thumbnail.startsWith("//")
          ) {
            const thumbnail = element("img", "spotlight-thumbnail");
            thumbnail.alt = "";
            thumbnail.width = 96;
            thumbnail.height = 64;
            thumbnail.decoding = "async";
            thumbnail.dataset.src = entry.thumbnail;
            thumbnail.addEventListener(
              "error",
              () => {
                thumbnail.hidden = true;
              },
              { once: true },
            );
            preview.append(thumbnail);
          }
          const previewText = element("span", "spotlight-preview-text");
          highlight(previewText, excerpt(entry, query), query);
          preview.append(previewText);
          preview.id = `${row.id}-preview`;
          body.append(title, meta, accessibleMeta, preview);
          const suffix = element("span", "spotlight-result-suffix");
          suffix.setAttribute("aria-hidden", "true");
          if (entry.key)
            suffix.append(element("kbd", "spotlight-alias", entry.key));
          suffix.append(
            element(
              "span",
              "spotlight-result-enter",
              entry.external ? "↗" : "↵",
            ),
          );
          row.append(icon(entry.icon), body, suffix);
          row.addEventListener("click", () => this.execute(entry));
          // Hover is purely visual: it must not move or expand rows beneath the pointer.
          container.append(row);
          this.rows.push(row);
        }
        this.results.append(container);
      }
      this.more.hidden = this.entries.length >= total;
      this.more.textContent = `Show more results (${total - this.entries.length} remaining)`;
      this.empty.hidden = !!this.entries.length;
      this.empty.replaceChildren();
      if (!this.entries.length) {
        this.empty.append(
          element(
            "strong",
            "",
            loading
              ? "Finding your way…"
              : loadError
                ? "Page search is unavailable"
                : "No matches yet",
          ),
        );
        this.empty.append(
          element(
            "p",
            "",
            loading
              ? "Loading pages and writing."
              : loadError
                ? "Retry above, or switch to Actions."
                : this.filter === "all"
                  ? "Try a page title, a topic, or a command like “cv”."
                  : `Try a different term or search in All.`,
          ),
        );
        if (this.filter !== "all" && !loading && !loadError) {
          const reset = element(
            "button",
            "spotlight-empty-reset",
            "Search everything",
          );
          reset.type = "button";
          reset.addEventListener("click", () => this.setFilter("all"));
          this.empty.append(reset);
        }
      }
      this.root.querySelector("[data-command-count]").textContent = loading
        ? "Loading…"
        : !query && this.filter === "all"
          ? `${total} suggestions`
          : `${total} result${total === 1 ? "" : "s"}`;
      clearTimeout(this.announcementTimer);
      this.announcementTimer = setTimeout(() => {
        if (!this.isActive()) return;
        this.root.querySelector("[data-command-announcement]").textContent =
          loading
            ? "Loading search."
            : `${total} result${total === 1 ? "" : "s"}${query ? ` for “${query}”` : ""}${this.filter !== "all" ? ` in ${labels[this.filter]}` : ""}.${total > this.entries.length ? ` Showing ${this.entries.length}.` : ""}`;
      }, 250);
      this.select(0, false);
      this.scroll.scrollTop = 0;
    }
    select(index, scroll) {
      this.root.classList.toggle("spotlight-show-preview", this.previewEnabled);
      if (!this.rows.length || !Number.isFinite(index)) {
        this.input.removeAttribute("aria-activedescendant");
        return;
      }
      this.selected = Math.max(0, Math.min(index, this.rows.length - 1));
      this.rows.forEach((row, i) => {
        const selected = i === this.selected;
        row.setAttribute("aria-selected", String(selected));
        if (selected && this.previewEnabled) {
          row.setAttribute("aria-describedby", `${row.id}-preview`);
          const thumbnail = row.querySelector("img[data-src]");
          if (thumbnail) {
            thumbnail.src = thumbnail.dataset.src;
            delete thumbnail.dataset.src;
          }
        } else row.removeAttribute("aria-describedby");
      });
      this.input.setAttribute(
        "aria-activedescendant",
        this.rows[this.selected].id,
      );
      if (scroll)
        this.rows[this.selected].scrollIntoView({
          block: "nearest",
          behavior: "instant",
        });
    }
    message(text, copyValue) {
      this.feedback.replaceChildren(element("span", "", text));
      this.feedback.hidden = false;
      if (copyValue) {
        const manual = element("input", "spotlight-manual-copy");
        manual.value = copyValue;
        manual.readOnly = true;
        manual.setAttribute("aria-label", "Select and copy this value");
        this.feedback.append(manual);
        manual.focus();
        manual.select();
      }
    }
    async execute(entry) {
      if (entry.id === "action:clear-history") {
        recents = [];
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* Session state still clears. */
        }
        this.render();
        this.message("Recent selections cleared.");
        this.input.focus({ preventScroll: true });
        return;
      }
      if (entry.id === "action:theme") {
        const toggle = document.querySelector("[data-theme-switcher]");
        if (toggle) toggle.click();
        else {
          const dark = document.documentElement.classList.toggle("dark");
          try {
            localStorage.setItem("theme", dark ? "dark" : "light");
          } catch {
            /* Session theme works without storage. */
          }
        }
        saveRecent(entry);
        this.render();
        this.message(
          `${document.documentElement.classList.contains("dark") ? "Dark" : "Light"} mode enabled.`,
        );
        this.input.focus({ preventScroll: true });
        return;
      }
      if (["action:copy-link", "action:copy-email"].includes(entry.id)) {
        const value =
          entry.id === "action:copy-link" ? location.href : config.email;
        try {
          await navigator.clipboard.writeText(value);
          saveRecent(entry);
          this.message(
            entry.id === "action:copy-link"
              ? "Page link copied."
              : "Email address copied.",
          );
        } catch {
          this.message(
            "Automatic copy is unavailable. Select and copy below.",
            value,
          );
        }
        return;
      }
      if (!entry.href) return;
      saveRecent(entry);
      const link = element("a");
      link.href = entry.href;
      if (entry.external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      if (entry.download) link.download = "";
      this.root.append(link);
      link.click();
      link.remove();
      if (this.modal) close();
    }
  }

  document
    .querySelectorAll("[data-command-panel]")
    .forEach((root) => panels.push(new CommandPanel(root)));
  function open(event) {
    if (!dialog || dialog.open) return;
    // WebKit does not necessarily focus buttons on pointer activation.
    returnFocus = event?.currentTarget || document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add("spotlight-open");
    updateViewport();
    const panel = panels.find((panel) => panel.modal);
    panel.input.value = "";
    panel.previewEnabled = false;
    panel.root.classList.remove("spotlight-show-shortcuts");
    panel.filter = "all";
    panel.limit = 12;
    panel.feedback.hidden = true;
    panel.render();
    panel.input.focus({ preventScroll: true });
    loadIndex();
  }
  function close() {
    if (dialog?.open) dialog.close();
  }
  function updateViewport() {
    if (!dialog?.open) return;
    const viewport = window.visualViewport;
    dialog.style.setProperty(
      "--spotlight-viewport-height",
      `${viewport?.height || innerHeight}px`,
    );
    dialog.style.setProperty(
      "--spotlight-viewport-top",
      `${viewport?.offsetTop || 0}px`,
    );
  }
  dialog?.addEventListener("close", () => {
    hideShortcuts();
    document.documentElement.classList.remove("spotlight-open");
    dialog.querySelector("input").setAttribute("aria-expanded", "false");
    panels.filter((panel) => !panel.modal).forEach((panel) => panel.render());
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  // Require both ends of the pointer gesture on the backdrop, not a drag out of the panel.
  let backdropDown = false;
  dialog?.addEventListener("pointerdown", (event) => {
    backdropDown = event.target === dialog;
  });
  dialog?.addEventListener("click", (event) => {
    if (backdropDown && event.target === dialog) close();
  });
  dialog
    ?.querySelector("[data-command-close]")
    .addEventListener("click", close);
  dialog?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [
      ...dialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex="0"]',
      ),
    ].filter((el) => el.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  window.visualViewport?.addEventListener("resize", updateViewport);
  window.visualViewport?.addEventListener("scroll", updateViewport);
  function hideShortcuts() {
    panels.forEach((panel) =>
      panel.root.classList.remove("spotlight-show-shortcuts"),
    );
  }
  document.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    panels.forEach((panel) =>
      panel.root.classList.toggle(
        "spotlight-show-shortcuts",
        panel.isActive() && event.altKey,
      ),
    );
  });
  document.addEventListener("keyup", (event) => {
    if (!event.altKey) hideShortcuts();
  });
  window.addEventListener("blur", hideShortcuts);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideShortcuts();
  });
  document.addEventListener("keydown", (event) => {
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      event.key.toLowerCase() === "k" &&
      !event.isComposing
    ) {
      if (!dialog) return;
      event.preventDefault();
      if (event.repeat) return;
      if (dialog.open) close();
      else open();
    }
  });
  document
    .querySelectorAll('[data-target="search-modal"]')
    .forEach((trigger) => {
      trigger.addEventListener("click", open);
      trigger.addEventListener(
        "pointerenter",
        () => {
          if (!loadError) loadIndex();
        },
        { once: true },
      );
      trigger.setAttribute("aria-keyshortcuts", isMac ? "Meta+K" : "Control+K");
      trigger.title = `Search and commands (${isMac ? "⌘K" : "Ctrl+K"})`;
    });
  document.querySelectorAll("[data-command-shortcut]").forEach((label) => {
    label.textContent = isMac ? "⌘K" : "Ctrl K";
  });
  document.querySelectorAll("[data-command-modifier]").forEach((label) => {
    label.textContent = isMac ? "⌥" : "Alt";
  });
  document.querySelectorAll("[data-filter-key]").forEach((label) => {
    const number = label.dataset.filterKey;
    label.textContent = `${isMac ? "⌥" : "Alt "}${number}`;
    label.parentElement.setAttribute("aria-keyshortcuts", `Alt+${number}`);
    label.parentElement.title = `${label.parentElement.dataset.commandFilter} (Alt+${number})`;
  });
  const inline = panels.find((panel) => !panel.modal);
  if (inline) {
    const params = new URLSearchParams(location.search);
    inline.input.value = (params.get("s") || "").slice(0, 200);
    inline.previewEnabled = !!inline.input.value.trim();
    inline.filter = filters.includes(params.get("view"))
      ? params.get("view")
      : "all";
    inline.render();
    loadIndex();
  }
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    recents = readRecents(event.newValue);
    panels
      .filter((panel) => panel.isActive())
      .forEach((panel) => panel.render());
  });
})();
