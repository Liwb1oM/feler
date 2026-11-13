# Feler Cheatsheet

Розділ-шпаргалка проєкту Feler для початківців: **HTML, CSS, Tailwind, JavaScript, TypeScript, React, Python, FastAPI, Django, Go, C#, SQL** та Git/інструменти.
Кожна тема має коротке пояснення, приклад коду з кнопкою «Копіювати» і поради.

A beginner-friendly cheatsheet section in Feler: **HTML, CSS, Tailwind, JavaScript, TypeScript, React, Python, FastAPI, Django, Go, C#, SQL** plus Git/tooling.
Every topic has a short explanation, a copyable code example and tips.

## Можливості / Features

- Інтерфейс українською та English з перемикачем (вибір запам'ятовується)
- Пошук по всіх темах і доступних перекладах
- Світла й темна теми
- Без збірки й залежностей: чистий HTML/CSS/JS

## Запуск локально / Run locally

Запустіть будь-який статичний сервер із кореня Feler або відкрийте `cheatsheet/index.html` у браузері:

```bash
python3 -m http.server 8000
# або
npx serve .
```

Відкрийте http://localhost:8000 для Feler або http://localhost:8000/cheatsheet/ для шпаргалки.

## Публікація на GitHub Pages / Deploy

1. Додайте папку `cheatsheet/` до репозиторію Feler і відправте зміни у налаштовану для Pages гілку.
2. Залиште її поруч із `index.html` Feler, щоб пункт «Шпаргалка» в навігації відкривав `cheatsheet/`.
3. Перевірте, що GitHub Pages публікує цю папку разом із сайтом Feler.

Усі шляхи шпаргалки відносні, тому вона працює і як вкладений шлях GitHub Pages.

## Структура / Structure

```
├── index.html
├── css/styles.css
├── icons/
└── js/
    ├── app.js                # рендер, пошук, тема, маршрути
    ├── i18n.js               # переклади інтерфейсу UK/EN
    ├── highlight.js          # підсвітка коду
    └── data/                 # КОНТЕНТ: по файлу на розділ
        ├── html.js
        ├── css.js
        ├── tailwind.js
        ├── javascript.js
        ├── typescript.js
        ├── react.js
        ├── python.js
        ├── fastapi.js
        ├── django.js
        ├── go.js
        ├── csharp.js
        ├── sql.js
        └── tools.js
```

## Як додати нову тему / How to add a topic

Відкрийте потрібний файл у `js/data/` і додайте об'єкт у масив `items`:

```js
{
  id: "my-topic",                       // унікальний у межах розділу, для посилань #css/my-topic
  title: { uk: "Назва", en: "Title" },
  text:  { uk: "Пояснення з `кодом` у зворотних лапках", en: "Explanation with `inline code`" },
  code:  { lang: "css", file: "styles.css", src: `a { color: red; }` },  // lang: html css js ts jsx tsx py cs go sql sh json text
  tip:   { uk: "Порада", en: "Tip" },   // необов'язково
  warn:  { uk: "Увага", en: "Careful" } // необов'язково
}
```

Якщо в прикладі коду є зворотні лапки або `${`, екрануйте їх: `` \` `` та `\${`.

## Як додати новий розділ / How to add a section

1. Створіть `js/data/my-section.js` за зразком інших (поля `id`, `icon`, `title`, `intro`, `items`).
2. Додайте `<script src="./js/data/my-section.js"></script>` в `index.html` (порядок скриптів = порядок вкладок).

## Міграція на React + TypeScript (за бажання)

Контент у `js/data/*.js` — звичайні дані. Їх можна перенести в `src/data/*.ts` без змін у структурі й відрендерити React-компонентами.
