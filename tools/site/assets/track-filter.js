/* 「すべて / 専門基礎 / 専門」の表示切替。トップと年度ページで共用する。 */

(() => {
  const switchers = [...document.querySelectorAll("[data-exam-track-switch]")];
  if (switchers.length === 0) return;

  const STORAGE_KEY = "kumadai-exam-track";
  const VALID_TRACKS = new Set(["all", "basic", "specialized"]);
  const LABELS = { all: "すべて", basic: "専門基礎", specialized: "専門" };

  function storedTrack() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return VALID_TRACKS.has(value) ? value : null;
    } catch {
      return null;
    }
  }

  function queryTrack() {
    const value = new URLSearchParams(window.location.search).get("track");
    return VALID_TRACKS.has(value) ? value : null;
  }

  function saveTrack(track) {
    try {
      localStorage.setItem(STORAGE_KEY, track);
    } catch {
      // file: 直開きなど、保存領域を使えない環境では URL だけで状態を保つ。
    }
  }

  function countsOnPage() {
    const problems = [...document.querySelectorAll(".block--problem[data-exam-track]")];
    if (problems.length > 0) {
      return {
        basic: problems.filter((el) => el.dataset.examTrack === "basic").length,
        specialized: problems.filter((el) => el.dataset.examTrack === "specialized").length,
      };
    }

    return [...document.querySelectorAll(".toc-card[data-basic-count]")].reduce(
      (sum, card) => ({
        basic: sum.basic + Number(card.dataset.basicCount || 0),
        specialized: sum.specialized + Number(card.dataset.specializedCount || 0),
      }),
      { basic: 0, specialized: 0 },
    );
  }

  function updateUrl(track) {
    try {
      const url = new URL(window.location.href);
      if (track === "all") url.searchParams.delete("track");
      else url.searchParams.set("track", track);
      history.replaceState(null, "", url);
    } catch {
      // URL を更新できなくても表示切替自体は続行する。
    }
  }

  function carryTrackToLinks(track) {
    const selector = [
      ".toc-card[href]",
      ".site-header__home[href]",
      ".site-header__link[href]:not(.site-header__graph-link)",
      ".chapter-pager__link[href]",
    ].join(",");

    document.querySelectorAll(selector).forEach((link) => {
      try {
        const url = new URL(link.getAttribute("href"), window.location.href);
        if (track === "all") url.searchParams.delete("track");
        else url.searchParams.set("track", track);
        link.href = url.href;
      } catch {
        // 不正なリンクは変更しない。
      }
    });
  }

  function updateCardStats(track) {
    document.querySelectorAll(".toc-card[data-basic-count]").forEach((card) => {
      const stats = card.querySelector("[data-exam-track-card-stats]");
      if (!stats) return;
      const basic = Number(card.dataset.basicCount || 0);
      const specialized = Number(card.dataset.specializedCount || 0);
      if (track === "basic") stats.textContent = `専門基礎 ${basic}題`;
      else if (track === "specialized") stats.textContent = `専門 ${specialized}題`;
      else stats.textContent = `専門基礎 ${basic}題・専門 ${specialized}題`;
    });
  }

  function applyTrack(track, { updateHistory = true } = {}) {
    const selected = VALID_TRACKS.has(track) ? track : "all";
    const counts = countsOnPage();
    const total = counts.basic + counts.specialized;

    document.documentElement.dataset.examTrack = selected;
    document.querySelectorAll("[data-exam-track]").forEach((element) => {
      element.hidden = selected !== "all" && element.dataset.examTrack !== selected;
    });

    switchers.forEach((switcher) => {
      switcher.querySelectorAll("[data-exam-track-value]").forEach((button) => {
        const active = button.dataset.examTrackValue === selected;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const status = switcher.querySelector("[data-exam-track-status]");
      if (status) {
        status.textContent = selected === "all"
          ? `全${total}題`
          : `${LABELS[selected]} ${counts[selected]}題`;
      }
    });

    updateCardStats(selected);
    carryTrackToLinks(selected);
    saveTrack(selected);
    if (updateHistory) updateUrl(selected);
    document.dispatchEvent(new CustomEvent("examtrackchange", { detail: { track: selected } }));
  }

  switchers.forEach((switcher) => {
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-exam-track-value]");
      if (!button) return;
      applyTrack(button.dataset.examTrackValue);
    });
  });

  applyTrack(queryTrack() || storedTrack() || "all");
})();
