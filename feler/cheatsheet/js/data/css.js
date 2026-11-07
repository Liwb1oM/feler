(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "css",
  icon: "CSS",
  title: { uk: "CSS", en: "CSS" },
  intro: {
    uk: "CSS відповідає за вигляд: кольори, відступи, розташування, адаптивність і анімації.",
    en: "CSS controls the look: colours, spacing, layout, responsiveness and animations.",
  },
  items: [
    {
      id: "selectors",
      title: { uk: "Підключення та селектори", en: "Linking and selectors" },
      text: {
        uk: "Стилі підключаємо через `<link>` у `<head>`. Селектор каже, до яких елементів застосувати правила. Пріоритет: `id` > `.клас` > `тег`, а коли рівні — перемагає пізніше правило.",
        en: "Link styles with `<link>` in `<head>`. A selector says which elements the rules apply to. Specificity: `id` > `.class` > `tag`; when equal, the later rule wins.",
      },
      code: {
        lang: "css",
        src: `/* тег */
p { color: #334155; }

/* клас (використовуйте найчастіше) */
.card { padding: 1rem; }

/* id (унікальний, краще не для стилів) */
#header { height: 64px; }

/* нащадок і прямий дочірній */
.menu a { text-decoration: none; }
.menu > li { list-style: none; }

/* стани */
a:hover, a:focus-visible { color: royalblue; }
li:nth-child(2n) { background: #f1f5f9; }

/* кілька класів на одному елементі */
.btn.btn--primary { background: royalblue; }`,
      },
      tip: {
        uk: "Не використовуйте `!important`, якщо можна просто зробити селектор конкретнішим або змінити порядок.",
        en: "Avoid `!important` when you can make the selector more specific or reorder rules.",
      },
    },
    {
      id: "box-model",
      title: { uk: "Box model і reset", en: "Box model and reset" },
      text: {
        uk: "Розмір елемента = content + padding + border + margin. Із `box-sizing: border-box` ширина включає padding і border, тому рахувати набагато простіше. Цей reset вставляють на початок майже кожного проєкту.",
        en: "Element size = content + padding + border + margin. With `box-sizing: border-box` the width includes padding and border, which is much easier to reason about. This reset goes at the top of almost every project.",
      },
      code: {
        lang: "css",
        file: "reset.css",
        src: `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  line-height: 1.5;
}

img,
svg,
video {
  display: block;
  max-width: 100%;
  height: auto;
}

button,
input,
textarea {
  font: inherit;
}`,
      },
    },
    {
      id: "variables",
      title: { uk: "CSS-змінні (custom properties)", en: "CSS variables (custom properties)" },
      text: {
        uk: "Змінні оголошують у `:root` і використовують через `var()`. Так зручно робити теми й тримати кольори та відступи в одному місці.",
        en: "Declare variables in `:root` and use them with `var()`. This makes themes easy and keeps colours and spacing in one place.",
      },
      code: {
        lang: "css",
        src: `:root {
  --color-bg: #ffffff;
  --color-text: #0f172a;
  --color-accent: #2563eb;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius: 12px;
}

[data-theme="dark"] {
  --color-bg: #0b1120;
  --color-text: #e2e8f0;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

.btn {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  background: var(--color-accent);
}`,
      },
    },
    {
      id: "flexbox",
      title: { uk: "Flexbox: один напрям", en: "Flexbox: one direction" },
      text: {
        uk: "Flex ідеальний для рядка чи колонки елементів: меню, картки в ряд, центрування. `justify-content` працює вздовж головної осі, `align-items` — впоперек.",
        en: "Flex is ideal for a row or column of items: menus, rows of cards, centring. `justify-content` works along the main axis, `align-items` across it.",
      },
      code: {
        lang: "css",
        src: `.row {
  display: flex;
  gap: 1rem;                 /* відступ між елементами */
  align-items: center;       /* по вертикалі */
  justify-content: space-between; /* по горизонталі */
  flex-wrap: wrap;           /* переносити на новий рядок */
}

.row__item {
  flex: 1 1 200px;           /* grow shrink basis */
}

/* Центрування чого завгодно */
.center {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
      },
    },
    {
      id: "grid",
      title: { uk: "Grid: сітка", en: "Grid: layouts" },
      text: {
        uk: "Grid керує і рядками, і колонками. Комбінація `repeat(auto-fit, minmax(...))` дає адаптивну сітку карток без жодних media queries.",
        en: "Grid controls both rows and columns. `repeat(auto-fit, minmax(...))` gives a responsive card grid without any media queries.",
      },
      code: {
        lang: "css",
        src: `.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

/* Класичний макет: сайдбар + контент */
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.layout > header { grid-area: header; }
.layout > aside  { grid-area: sidebar; }
.layout > main   { grid-area: main; }
.layout > footer { grid-area: footer; }`,
      },
      tip: {
        uk: "Простіше правило: один напрям — flex, двовимірний макет — grid.",
        en: "Rule of thumb: one direction means flex, a two-dimensional layout means grid.",
      },
    },
    {
      id: "responsive",
      title: { uk: "Адаптивність", en: "Responsive design" },
      text: {
        uk: "Підхід mobile-first: спочатку стилі для телефона, потім розширюємо через `min-width`. Для плавних розмірів шрифту й відступів є `clamp(мін, бажане, макс)`.",
        en: "Mobile-first: write styles for phones first, then enhance with `min-width`. For fluid font sizes and spacing use `clamp(min, preferred, max)`.",
      },
      code: {
        lang: "css",
        src: `.container {
  width: min(100% - 2rem, 1100px);
  margin-inline: auto;
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

.sidebar { display: none; }

@media (min-width: 768px) {
  .sidebar { display: block; }
}

/* Користувач просить менше анімацій */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}`,
      },
    },
    {
      id: "position",
      title: { uk: "Позиціонування", en: "Positioning" },
      text: {
        uk: "`relative` створює «систему координат» для дітей, `absolute` розміщує елемент відносно найближчого позиціонованого предка, `sticky` «прилипає» при прокрутці, `fixed` — відносно вікна.",
        en: "`relative` creates a coordinate system for children, `absolute` places an element relative to the nearest positioned ancestor, `sticky` sticks while scrolling, `fixed` is relative to the viewport.",
      },
      code: {
        lang: "css",
        src: `.card { position: relative; }

.card__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Розтягнути на весь батьківський блок */
.overlay {
  position: absolute;
  inset: 0;
}`,
      },
    },
    {
      id: "transitions",
      title: { uk: "Переходи та анімації", en: "Transitions and animations" },
      text: {
        uk: "`transition` плавно змінює властивість при зміні стану. Для складніших рухів — `@keyframes`. Анімуйте `transform` та `opacity`, вони найдешевші для браузера.",
        en: "`transition` smoothly changes a property when state changes. For more complex motion use `@keyframes`. Animate `transform` and `opacity`, they are cheapest for the browser.",
      },
      code: {
        lang: "css",
        src: `.btn {
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.toast {
  animation: fade-in 0.3s ease-out;
}`,
      },
    },
    {
      id: "structure",
      title: { uk: "Правильна структура CSS-файлу", en: "How to organise a CSS file" },
      text: {
        uk: "Йдіть від загального до конкретного: reset, змінні, базові стилі, макет, компоненти, утиліти. Класи називайте за BEM: `блок__елемент--модифікатор`.",
        en: "Go from general to specific: reset, variables, base styles, layout, components, utilities. Name classes with BEM: `block__element--modifier`.",
      },
      code: {
        lang: "css",
        src: `/* 1. Reset */
/* 2. Змінні :root */
/* 3. Базові стилі: body, h1–h6, a */
/* 4. Макет: .container, .grid */
/* 5. Компоненти */

.card { }
.card__title { }
.card__title--large { }   /* модифікатор */
.card--featured { }       /* варіант блоку */

/* 6. Утиліти */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}`,
      },
    },
  ],
});
