/* Прості переклади інтерфейсу (UK / EN).
   Контент шпаргалки лежить окремо — у js/data/*.js, поля { uk, en }. */
(function () {
  "use strict";

  var UI = {
    uk: {
      skip: "Перейти до змісту",
      search: "Пошук: flex, useEffect, SELECT…",
      footer: "Зроблено для тих, хто тільки починає програмувати.",
      backToFeler: "← До Feler",
      copy: "Копіювати",
      copied: "Скопійовано",
      copyFail: "Не вдалось",
      tip: "Порада",
      warn: "Увага",
      noResults: "Нічого не знайдено за запитом",
      resultsFor: "Знайдено",
      topics: "Теми",
      onPage: "На цій сторінці",
      notFound: "Розділ не знайдено",
      titleSuffix: "Feler Cheatsheet",
      themeToggle: "Змінити тему",
    },
    en: {
      skip: "Skip to content",
      search: "Search: flex, useEffect, SELECT…",
      footer: "Made for people just starting to code.",
      backToFeler: "← Back to Feler",
      copy: "Copy",
      copied: "Copied",
      copyFail: "Failed",
      tip: "Tip",
      warn: "Careful",
      noResults: "Nothing found for",
      resultsFor: "Found",
      topics: "Topics",
      onPage: "On this page",
      notFound: "Section not found",
      titleSuffix: "Feler Cheatsheet",
      themeToggle: "Toggle theme",
    },
  };

  var STORAGE_KEY = "cs:lang";
  var lang = "uk";

  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "uk" || saved === "en") return saved;
    } catch (e) {
      /* localStorage може бути недоступний — це нормально */
    }
    var nav = (navigator.language || "uk").toLowerCase();
    return nav.indexOf("uk") === 0 ? "uk" : "en";
  }

  lang = detect();

  var I18N = {
    get lang() {
      return lang;
    },
    setLang: function (next) {
      if (next !== "uk" && next !== "en") return;
      lang = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
      document.documentElement.lang = next;
      I18N.apply();
    },
    /** Рядок інтерфейсу за ключем */
    t: function (key) {
      return (UI[lang] && UI[lang][key]) || UI.en[key] || key;
    },
    /** Обрати мову з об'єкта { uk, en } */
    pick: function (obj) {
      if (obj == null) return "";
      if (typeof obj === "string") return obj;
      return obj[lang] || obj.en || obj.uk || "";
    },
    /** Застосувати переклад до статичних елементів із data-i18n */
    apply: function () {
      var i, el;
      var nodes = document.querySelectorAll("[data-i18n]");
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        el.textContent = I18N.t(el.getAttribute("data-i18n"));
      }
      var ph = document.querySelectorAll("[data-i18n-placeholder]");
      for (i = 0; i < ph.length; i++) {
        el = ph[i];
        el.setAttribute("placeholder", I18N.t(el.getAttribute("data-i18n-placeholder")));
      }
      var themeBtn = document.getElementById("theme");
      if (themeBtn) {
        themeBtn.setAttribute("aria-label", I18N.t("themeToggle"));
        themeBtn.setAttribute("title", I18N.t("themeToggle"));
      }
      var btns = document.querySelectorAll("[data-lang]");
      for (i = 0; i < btns.length; i++) {
        btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-lang") === lang));
      }
    },
  };

  window.I18N = I18N;
  document.documentElement.lang = lang;
})();
