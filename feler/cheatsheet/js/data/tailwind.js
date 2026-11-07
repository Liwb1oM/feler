(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "tailwind",
  icon: "TW",
  title: { uk: "Tailwind CSS", en: "Tailwind CSS" },
  intro: {
    uk: "Tailwind — це набір готових утилітарних класів (`p-4`, `flex`, `text-lg`). Ви стилізуєте елемент прямо в розмітці, без окремого CSS-файлу для кожного компонента.",
    en: "Tailwind is a set of ready-made utility classes (`p-4`, `flex`, `text-lg`). You style an element right in the markup, without a separate CSS file for every component.",
  },
  items: [
    {
      id: "idea",
      title: { uk: "Ідея utility-first", en: "The utility-first idea" },
      text: {
        uk: "Один клас = одна дія. Замість вигадування імен на кшталт `.card__title` ви комбінуєте утиліти. Нижче — той самий блок звичайним CSS і на Tailwind.",
        en: "One class = one job. Instead of inventing names like `.card__title` you combine utilities. Below is the same block in plain CSS and in Tailwind.",
      },
      code: {
        lang: "html",
        src: `<!-- Звичайний CSS -->
<button class="btn">Зберегти</button>
<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: #2563eb;
    color: white;
    font-weight: 600;
  }
</style>

<!-- Tailwind -->
<button class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
  Зберегти
</button>`,
      },
    },
    {
      id: "setup",
      title: { uk: "Підключення (Vite, Tailwind v4)", en: "Setup (Vite, Tailwind v4)" },
      text: {
        uk: "У версії 4 достатньо плагіна для Vite та одного рядка в CSS. Якщо в старому проєкті Tailwind v3, там інакше: `tailwind.config.js` і директиви `@tailwind base/components/utilities`. Завжди звіряйтесь з офіційною документацією для вашої версії.",
        en: "In version 4 you only need the Vite plugin and one line in CSS. An older project on Tailwind v3 differs: `tailwind.config.js` and the `@tailwind base/components/utilities` directives. Always check the official docs for your version.",
      },
      code: {
        lang: "sh",
        src: `npm install tailwindcss @tailwindcss/vite`,
      },
      warn: {
        uk: "Не змішуйте інструкції з різних версій Tailwind: це найчастіша причина «не працює».",
        en: "Don't mix instructions from different Tailwind versions: it is the most common reason for \"it doesn't work\".",
      },
    },
    {
      id: "setup-files",
      title: { uk: "Підключення: файли", en: "Setup: files" },
      text: {
        uk: "Додайте плагін у `vite.config.ts` і підключіть Tailwind у головному CSS-файлі, який імпортується в `main.tsx`.",
        en: "Add the plugin to `vite.config.ts` and import Tailwind in the main CSS file that `main.tsx` imports.",
      },
      code: {
        lang: "ts",
        file: "vite.config.ts",
        src: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});

// src/index.css
// @import "tailwindcss";`,
      },
    },
    {
      id: "spacing-type-colors",
      title: { uk: "Відступи, текст, кольори", en: "Spacing, text, colours" },
      text: {
        uk: "Шкала відступів: `1` = 0.25rem, тож `p-4` = 1rem. Літери: `p` padding, `m` margin; `x`/`y` — вісь; `t/r/b/l` — сторона. Кольори мають відтінки 50–950.",
        en: "Spacing scale: `1` = 0.25rem, so `p-4` = 1rem. Letters: `p` padding, `m` margin; `x`/`y` are axes; `t/r/b/l` are sides. Colours have shades 50–950.",
      },
      code: {
        lang: "html",
        src: `<div class="p-4 px-6 mt-8 mb-2">         <!-- padding / margin -->
<h1 class="text-3xl font-bold tracking-tight">  <!-- розмір, жирність -->
<p class="text-slate-600 leading-relaxed">      <!-- колір, інтервал -->
<div class="bg-white/80 border border-slate-200 rounded-xl shadow-sm">
<p class="truncate">Довгий текст обріжеться з…</p>
<span class="sr-only">Лише для скрінрідерів</span>`,
      },
    },
    {
      id: "layout",
      title: { uk: "Flex і Grid", en: "Flex and Grid" },
      text: {
        uk: "Ті самі ідеї, що й у CSS, але класами. `gap-*` задає проміжки, `justify-*` та `items-*` вирівнюють.",
        en: "The same ideas as in CSS, expressed as classes. `gap-*` sets gaps, `justify-*` and `items-*` align.",
      },
      code: {
        lang: "html",
        src: `<!-- Ряд із вирівнюванням -->
<div class="flex items-center justify-between gap-4">
  <span>Логотип</span>
  <nav class="flex gap-3">…</nav>
</div>

<!-- Колонка -->
<div class="flex flex-col gap-2">…</div>

<!-- Адаптивна сітка: 1 колонка, на md — 2, на lg — 3 -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">…</div>

<!-- Центрування на весь екран -->
<div class="grid min-h-screen place-items-center">…</div>`,
      },
    },
    {
      id: "responsive-states",
      title: { uk: "Адаптивність і стани", en: "Responsive and state variants" },
      text: {
        uk: "Префікс перед класом означає умову. Без префікса — для всіх екранів (mobile-first), `md:` — від 768px і ширше. Так само працюють `hover:`, `focus-visible:`, `dark:`, `disabled:`.",
        en: "A prefix before a class is a condition. No prefix means all screens (mobile-first), `md:` means 768px and wider. `hover:`, `focus-visible:`, `dark:`, `disabled:` work the same way.",
      },
      code: {
        lang: "html",
        src: `<button
  class="rounded-lg bg-blue-600 px-4 py-2 text-white
         hover:bg-blue-700
         focus-visible:outline-2 focus-visible:outline-offset-2
         disabled:opacity-50
         md:px-6"
>
  Надіслати
</button>

<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  Темна тема
</div>

<!-- group: стан батька впливає на дітей -->
<a class="group block">
  <span class="group-hover:underline">Заголовок</span>
</a>`,
      },
    },
    {
      id: "arbitrary",
      title: { uk: "Довільні значення та власна тема", en: "Arbitrary values and custom theme" },
      text: {
        uk: "Коли готового класу немає, використовуйте квадратні дужки. Повторювані значення краще винести у власну тему.",
        en: "When there is no ready class use square brackets. Repeated values are better moved into your own theme.",
      },
      code: {
        lang: "css",
        file: "index.css (Tailwind v4)",
        src: `@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
  --font-display: "Inter", sans-serif;
}

/* Тепер доступні класи bg-brand, text-brand, font-display */

/* Довільні значення прямо в розмітці:
   w-[320px]   bg-[#1da1f2]   grid-cols-[200px_1fr]   top-[calc(100%-2rem)] */`,
      },
    },
    {
      id: "component",
      title: { uk: "Приклад компонента: картка", en: "Component example: card" },
      text: {
        uk: "У React повторювані набори класів виносять у компонент, а не в `@apply`. Так стилі лишаються поряд із розміткою.",
        en: "In React, repeated sets of classes are extracted into a component rather than `@apply`. Styles stay next to the markup.",
      },
      code: {
        lang: "tsx",
        file: "Card.tsx",
        src: `import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 text-slate-600">{children}</div>
    </article>
  );
}`,
      },
      tip: {
        uk: "Довгі рядки класів нормально. Для умовних класів використовуйте бібліотеку `clsx`.",
        en: "Long class strings are fine. For conditional classes use the `clsx` library.",
      },
    },
  ],
});
