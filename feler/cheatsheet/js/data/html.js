/* Розділ: HTML. Формат кожної теми:
   { id, title:{uk,en}, text:{uk,en}, code:{lang,file?,src}, tip?:{uk,en}, warn?:{uk,en}, kw? } */
(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "html",
  icon: "HTML",
  title: { uk: "HTML", en: "HTML" },
  intro: {
    uk: "HTML описує структуру сторінки: що є заголовком, списком, кнопкою чи формою. Вигляд задає CSS, поведінку — JavaScript.",
    en: "HTML describes the structure of a page: what is a heading, a list, a button or a form. CSS controls the look, JavaScript controls the behaviour.",
  },
  items: [
    {
      id: "skeleton",
      title: { uk: "Базовий скелет сторінки", en: "Basic page skeleton" },
      text: {
        uk: "Кожна сторінка починається з `<!doctype html>`. Атрибут `lang` допомагає скрінрідерам і перекладачам, а `viewport` потрібен, щоб сайт нормально виглядав на телефоні.",
        en: "Every page starts with `<!doctype html>`. The `lang` attribute helps screen readers and translators, and `viewport` makes the site render properly on phones.",
      },
      code: {
        lang: "html",
        file: "index.html",
        src: `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Назва сторінки</title>
    <link rel="stylesheet" href="./css/styles.css" />
  </head>
  <body>
    <h1>Привіт, світ!</h1>

    <!-- defer: скрипт виконається після розбору HTML -->
    <script src="./js/app.js" defer></script>
  </body>
</html>`,
      },
      tip: {
        uk: "Шляхи пишіть відносними (`./css/...`), тоді сайт працюватиме і на GitHub Pages у підпапці.",
        en: "Use relative paths (`./css/...`) so the site also works on GitHub Pages under a subpath.",
      },
    },
    {
      id: "semantic",
      title: { uk: "Семантична структура", en: "Semantic structure" },
      text: {
        uk: "Замість десятка `<div>` використовуйте теги, що пояснюють роль блоку. Це краще для доступності, SEO та читабельності коду.",
        en: "Instead of a dozen `<div>`s use tags that explain the role of a block. It is better for accessibility, SEO and readability.",
      },
      code: {
        lang: "html",
        src: `<body>
  <header>
    <nav aria-label="Головна навігація">
      <a href="/">Головна</a>
      <a href="/about">Про нас</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Заголовок статті</h1>
      <section>
        <h2>Розділ</h2>
        <p>Текст…</p>
      </section>
    </article>
    <aside>Побічний контент</aside>
  </main>

  <footer>© 2026</footer>
</body>`,
      },
      tip: {
        uk: "На сторінці має бути один `<main>` і зазвичай один `<h1>`. Рівні заголовків не пропускайте: h1, h2, h3…",
        en: "A page should have one `<main>` and usually one `<h1>`. Don't skip heading levels: h1, h2, h3…",
      },
    },
    {
      id: "text-lists",
      title: { uk: "Текст і списки", en: "Text and lists" },
      text: {
        uk: "`<p>` для абзаців, `<strong>` для важливого, `<em>` для наголосу. Списки: `<ul>` — маркований, `<ol>` — нумерований, кожен пункт у `<li>`.",
        en: "`<p>` for paragraphs, `<strong>` for important text, `<em>` for emphasis. Lists: `<ul>` is bulleted, `<ol>` is numbered, each item goes in `<li>`.",
      },
      code: {
        lang: "html",
        src: `<p>Це <strong>важливо</strong>, а це <em>з наголосом</em>.</p>

<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

<ol>
  <li>Крок перший</li>
  <li>Крок другий</li>
</ol>`,
      },
    },
    {
      id: "links-images",
      title: { uk: "Посилання та зображення", en: "Links and images" },
      text: {
        uk: "Для зовнішніх посилань у новій вкладці додавайте `rel=\"noopener noreferrer\"`. Зображенню завжди потрібен `alt`, а `width` і `height` запобігають «стрибкам» сторінки під час завантаження.",
        en: "For external links that open in a new tab add `rel=\"noopener noreferrer\"`. An image always needs `alt`, and `width`/`height` prevent layout jumps while loading.",
      },
      code: {
        lang: "html",
        src: `<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  MDN
</a>

<img
  src="./img/cat.jpg"
  alt="Рудий кіт спить на підвіконні"
  width="640"
  height="400"
  loading="lazy"
/>

<!-- Декоративна картинка: порожній alt -->
<img src="./img/line.svg" alt="" />`,
      },
    },
    {
      id: "forms",
      title: { uk: "Форми", en: "Forms" },
      text: {
        uk: "Кожне поле має `<label>`, пов'язаний через `for` та `id`. Тип `type` дає правильну клавіатуру на телефоні й безкоштовну валідацію. Кнопці завжди вказуйте `type`.",
        en: "Every field needs a `<label>` linked with `for` and `id`. The `type` attribute gives the right mobile keyboard and free validation. Always set a button's `type`.",
      },
      code: {
        lang: "html",
        src: `<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email" />

  <label for="age">Вік</label>
  <input id="age" name="age" type="number" min="18" max="99" />

  <label for="topic">Тема</label>
  <select id="topic" name="topic">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
  </select>

  <label>
    <input type="checkbox" name="agree" required />
    Погоджуюсь з умовами
  </label>

  <button type="submit">Надіслати</button>
</form>`,
      },
      warn: {
        uk: "Не покладайтесь лише на валідацію в браузері: перевіряйте дані ще й на сервері.",
        en: "Don't rely only on browser validation: validate data on the server too.",
      },
    },
    {
      id: "tables",
      title: { uk: "Таблиці", en: "Tables" },
      text: {
        uk: "Таблиці — для табличних даних, а не для верстки макета. Використовуйте `<thead>`, `<tbody>` та `scope` у заголовках.",
        en: "Tables are for tabular data, not page layout. Use `<thead>`, `<tbody>` and `scope` on header cells.",
      },
      code: {
        lang: "html",
        src: `<table>
  <caption>Ціни</caption>
  <thead>
    <tr>
      <th scope="col">Товар</th>
      <th scope="col">Ціна</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Книга</td>
      <td>250 ₴</td>
    </tr>
  </tbody>
</table>`,
      },
    },
    {
      id: "a11y",
      title: { uk: "Доступність: мінімум", en: "Accessibility: the basics" },
      text: {
        uk: "Для дій використовуйте `<button>`, для переходів — `<a>`. Кнопка-іконка без тексту потребує `aria-label`. Не прибирайте `outline` у фокусу, не замінивши його чимось видимим.",
        en: "Use `<button>` for actions and `<a>` for navigation. An icon-only button needs `aria-label`. Don't remove the focus `outline` without replacing it with something visible.",
      },
      code: {
        lang: "html",
        src: `<!-- Погано: div не фокусується і не працює з клавіатури -->
<div class="btn" onclick="save()">Зберегти</div>

<!-- Добре -->
<button type="button" onclick="save()">Зберегти</button>

<!-- Кнопка-іконка -->
<button type="button" aria-label="Закрити діалог">
  <svg aria-hidden="true" width="16" height="16"></svg>
</button>`,
      },
    },
    {
      id: "project-structure",
      title: { uk: "Структура проєкту (чистий HTML/CSS/JS)", en: "Project structure (plain HTML/CSS/JS)" },
      text: {
        uk: "Простий проєкт без збірки. Кожен тип файлів лежить у своїй папці, а `index.html` — у корені.",
        en: "A simple project with no build step. Each file type lives in its own folder and `index.html` sits in the root.",
      },
      code: {
        lang: "text",
        src: `my-site/
├── index.html
├── about.html
├── css/
│   ├── reset.css
│   └── styles.css
├── js/
│   └── app.js
├── img/
│   └── logo.svg
└── README.md`,
      },
    },
  ],
});
