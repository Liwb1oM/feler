/* Головний файл застосунку: маршрутизація (#section/item), рендер, пошук і тема. */
(function () {
  "use strict";

  var sections = (window.CHEATSHEET && window.CHEATSHEET.sections) || [];
  var t = function (k) {
    return window.I18N.t(k);
  };
  var pick = function (v) {
    return window.I18N.pick(v);
  };

  var els = {
    topbar: document.querySelector(".topbar"),
    nav: document.getElementById("nav"),
    content: document.getElementById("content"),
    search: document.getElementById("search"),
    theme: document.getElementById("theme"),
  };

  var state = { section: sections.length ? sections[0].id : "", item: "", query: "" };

  // ---------- утиліти ----------
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /** Екранує текст і перетворює `код` на <code>. */
  function inline(text) {
    return esc(text).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function highlightTerms(html, terms) {
    // Підсвічуємо лише у вже екранованому тексті, без чіпання тегів <code>
    if (!terms.length) return html;
    var parts = html.split(/(<[^>]+>)/);
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].charAt(0) === "<") continue;
      terms.forEach(function (term) {
        var safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        parts[i] = parts[i].replace(new RegExp("(" + safe + ")", "gi"), "<mark>$1</mark>");
      });
    }
    return parts.join("");
  }

  function findSection(id) {
    for (var i = 0; i < sections.length; i++) if (sections[i].id === id) return sections[i];
    return null;
  }

  // ---------- індекс для пошуку ----------
  var index = sections.reduce(function (acc, sec) {
    sec.items.forEach(function (item) {
      var hay = [
        item.title && item.title.uk,
        item.title && item.title.en,
        item.text && item.text.uk,
        item.text && item.text.en,
        item.code && item.code.src,
        item.tip && item.tip.uk,
        item.tip && item.tip.en,
        item.kw,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      acc.push({ section: sec, item: item, hay: hay });
    });
    return acc;
  }, []);

  function search(query) {
    var terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!terms.length) return [];
    return index.filter(function (entry) {
      return terms.every(function (term) {
        return entry.hay.indexOf(term) !== -1;
      });
    });
  }

  // ---------- рендер ----------
  var sectionIcons = {
    html: "html",
    css: "css",
    tailwind: "tailwind",
    js: "js",
    ts: "ts",
    react: "react",
    python: "python",
    fastapi: "fastapi",
    django: "django",
    go: "go",
    csharp: "cs",
    sql: "postgres",
    tools: "git",
  };

  function renderNav() {
    els.nav.innerHTML = sections
      .map(function (sec) {
        var current = !state.query && sec.id === state.section ? ' aria-current="page"' : "";
        var icon = sectionIcons[sec.id]
          ? '<img class="nav__icon" src="https://skillicons.dev/icons?i=' +
            esc(sectionIcons[sec.id]) +
            '&amp;theme=dark" alt="" width="26" height="26" loading="eager" decoding="async">'
          : '<span class="nav__icon" aria-hidden="true">' + esc(sec.icon || "") + "</span>";
        return (
          '<a class="nav__link" href="#' +
          esc(sec.id) +
          '"' +
          current +
          ">" +
          icon +
          esc(pick(sec.title)) +
          "</a>"
        );
      })
      .join("");
  }

  function renderCode(code) {
    if (!code) return "";
    var label = code.file || code.lang || "";
    return (
      '<div class="code"><div class="code__bar"><span>' +
      esc(label) +
      '</span><button type="button" class="code__copy" data-copy>' +
      esc(t("copy")) +
      '</button></div><pre><code class="lang-' +
      esc(code.lang || "text") +
      '">' +
      window.highlightCode(code.src, code.lang) +
      "</code></pre></div>"
    );
  }

  function renderCallout(tip, kind) {
    if (!tip) return "";
    var label = kind === "warn" ? t("warn") : t("tip");
    return (
      '<div class="callout' +
      (kind === "warn" ? " callout--warn" : "") +
      '"><strong>' +
      esc(label) +
      ":</strong>" +
      inline(pick(tip)) +
      "</div>"
    );
  }

  function renderCard(sec, item, terms) {
    var id = sec.id + "--" + item.id;
    var title = highlightTerms(esc(pick(item.title)), terms || []);
    return (
      '<article class="card" id="' +
      esc(id) +
      '">' +
      (terms ? '<span class="badge">' + esc(pick(sec.title)) + "</span>" : "") +
      "<h2>" +
      title +
      "</h2>" +
      (item.text ? '<p class="card__text">' + inline(pick(item.text)) + "</p>" : "") +
      renderCode(item.code) +
      renderCallout(item.tip, "tip") +
      renderCallout(item.warn, "warn") +
      "</article>"
    );
  }

  function renderSection() {
    var sec = findSection(state.section);
    if (!sec) {
      els.content.innerHTML = '<p class="empty">' + esc(t("notFound")) + "</p>";
      return;
    }
    var toc = sec.items
      .map(function (item) {
        return '<li><a href="#' + esc(sec.id + "/" + item.id) + '">' + esc(pick(item.title)) + "</a></li>";
      })
      .join("");
    els.content.innerHTML =
      '<div class="section-head"><h1>' +
      esc((sec.icon ? sec.icon + " " : "") + pick(sec.title)) +
      "</h1>" +
      (sec.intro ? "<p>" + inline(pick(sec.intro)) + "</p>" : "") +
      '<ul class="toc" aria-label="' +
      esc(t("onPage")) +
      '">' +
      toc +
      "</ul></div>" +
      sec.items
        .map(function (item) {
          return renderCard(sec, item);
        })
        .join("") +
      (sec.id === "fastapi"
        ? '<p class="section-next"><a class="btn" href="#django">' +
          esc(state.lang === "en" ? "Continue learning: Django →" : "Продовжити навчання: Django →") +
          "</a></p>"
        : "");
    document.title = pick(sec.title) + " · " + t("titleSuffix");
  }

  function renderSearch() {
    var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    var found = search(state.query);
    if (!found.length) {
      els.content.innerHTML = '<p class="empty">' + esc(t("noResults")) + " «" + esc(state.query) + "»</p>";
      return;
    }
    els.content.innerHTML =
      '<p class="result-section">' +
      esc(t("resultsFor")) +
      ": " +
      found.length +
      "</p>" +
      found
        .map(function (entry) {
          return renderCard(entry.section, entry.item, terms);
        })
        .join("");
    document.title = state.query + " · " + t("titleSuffix");
  }

  function render() {
    renderNav();
    if (state.query) renderSearch();
    else renderSection();
  }

  // ---------- маршрутизація ----------
  function parseHash() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("/");
    var sec = findSection(parts[0]) ? parts[0] : sections.length ? sections[0].id : "";
    return { section: sec, item: parts[1] || "" };
  }

  // Шапка ховається при прокрутці вниз і з'являється при прокрутці вгору
  var lastY = window.scrollY;
  var headerLockUntil = 0;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      var dy = y - lastY;
      lastY = y;
      if (Date.now() < headerLockUntil) return;
      if (y < 80 || dy < -8) els.topbar.classList.remove("topbar--hidden");
      else if (dy > 8 && document.activeElement !== els.search) els.topbar.classList.add("topbar--hidden");
    },
    { passive: true }
  );

  function scrollToItem() {
    if (!state.item) return;
    var el = document.getElementById(state.section + "--" + state.item);
    if (!el) return;
    // Під час програмного скролу шапка не має перекривати початок картки
    headerLockUntil = Date.now() + 1000;
    els.topbar.classList.add("topbar--hidden");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onRoute() {
    var next = parseHash();
    var changedSection = next.section !== state.section;
    var hadQuery = !!state.query;
    state.section = next.section;
    state.item = next.item;
    if (hadQuery) {
      state.query = "";
      els.search.value = "";
    }
    if (changedSection || hadQuery || !els.content.firstChild) {
      render();
      if (!state.item) window.scrollTo(0, 0);
    }
    scrollToItem();
  }

  // ---------- копіювання коду ----------
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  els.content.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var code = btn.closest(".code").querySelector("code");
    copyText(code.textContent).then(
      function () {
        btn.textContent = t("copied");
        btn.setAttribute("data-done", "true");
        setTimeout(function () {
          btn.textContent = t("copy");
          btn.removeAttribute("data-done");
        }, 1500);
      },
      function () {
        btn.textContent = t("copyFail");
        setTimeout(function () {
          btn.textContent = t("copy");
        }, 1500);
      }
    );
  });

  // ---------- пошук ----------
  var searchTimer = null;
  els.search.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = els.search.value.trim();
      render();
    }, 120);
  });
  els.search.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && els.search.value) {
      els.search.value = "";
      state.query = "";
      render();
    }
  });

  // ---------- мова ----------
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.I18N.setLang(btn.getAttribute("data-lang"));
      render();
    });
  });

  // ---------- тема ----------
  var THEME_KEY = "cs:theme";
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function effectiveTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return mq && mq.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", effectiveTheme() === "dark" ? "#0b1120" : "#f8fafc");
  }

  try {
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) applyTheme(savedTheme);
    else applyTheme(null);
  } catch (e) {
    applyTheme(null);
  }

  els.theme.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* ignore */
    }
  });

  // Прибираємо попередню офлайн-реєстрацію цієї шпаргалки.
  if ("serviceWorker" in navigator) {
    var cheatsheetScope = new URL("./", location.href).pathname;
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      return Promise.all(
        registrations
          .filter(function (registration) {
            return new URL(registration.scope).pathname === cheatsheetScope;
          })
          .map(function (registration) {
            return registration.unregister();
          })
      );
    }).then(function () {
      if (!("caches" in window)) return;
      return caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) { return key.indexOf("cheatsheet-") === 0; }).map(function (key) { return caches.delete(key); }));
      });
    }).catch(function (err) {
      console.warn("Не вдалося прибрати попередній офлайн-кеш:", err);
    });
  }

  // ---------- старт ----------
  window.I18N.apply();
  window.addEventListener("hashchange", onRoute);
  onRoute();
})();
