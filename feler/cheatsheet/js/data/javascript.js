(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "js",
  icon: "JS",
  title: { uk: "JavaScript", en: "JavaScript" },
  intro: {
    uk: "JavaScript робить сторінку живою: реагує на кліки, працює з даними, запитує сервер і змінює DOM.",
    en: "JavaScript makes the page alive: it reacts to clicks, works with data, calls servers and changes the DOM.",
  },
  items: [
    {
      id: "variables",
      title: { uk: "Змінні та типи", en: "Variables and types" },
      text: {
        uk: "За замовчуванням пишіть `const`, а `let` — лише коли значення справді змінюється. `var` не використовуйте. Основні типи: string, number, boolean, null, undefined, object (масиви теж), bigint, symbol.",
        en: "Default to `const`, use `let` only when the value really changes. Don't use `var`. Main types: string, number, boolean, null, undefined, object (arrays too), bigint, symbol.",
      },
      code: {
        lang: "js",
        src: `const name = "Олександр";      // string
let count = 0;                 // number
const isOpen = true;           // boolean
const nothing = null;          // "навмисно порожньо"
let notSet;                    // undefined
const list = [1, 2, 3];        // масив
const user = { id: 1, name };  // об'єкт

console.log(typeof name);        // "string"
console.log(Array.isArray(list)); // true

// Шаблонні рядки
const greeting = \`Привіт, \${name}! Вам \${count + 18}\`;`,
      },
      tip: {
        uk: "`const` не робить об'єкт незмінним: заборонено лише перепризначення самої змінної.",
        en: "`const` does not make an object immutable: only reassigning the variable itself is forbidden.",
      },
    },
    {
      id: "functions",
      title: { uk: "Функції", en: "Functions" },
      text: {
        uk: "Стрілкові функції зручні для коротких колбеків. Параметри можуть мати значення за замовчуванням, а rest-параметр збирає решту аргументів у масив.",
        en: "Arrow functions are handy for short callbacks. Parameters can have default values and a rest parameter collects the remaining arguments into an array.",
      },
      code: {
        lang: "js",
        src: `function add(a, b = 0) {
  return a + b;
}

const double = (n) => n * 2;          // неявний return
const makeUser = (name) => ({ name }); // повертаємо об'єкт — у дужках

const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);
console.log(sum(1, 2, 3)); // 6`,
      },
    },
    {
      id: "arrays",
      title: { uk: "Масиви: map, filter, find, reduce", en: "Arrays: map, filter, find, reduce" },
      text: {
        uk: "Ці методи не змінюють оригінальний масив, а повертають новий результат. Саме їх ви постійно використовуватимете у React.",
        en: "These methods don't mutate the original array, they return a new result. You will use them all the time in React.",
      },
      code: {
        lang: "js",
        src: `const users = [
  { id: 1, name: "Аня", age: 25 },
  { id: 2, name: "Богдан", age: 17 },
];

users.map((u) => u.name);              // ["Аня", "Богдан"]
users.filter((u) => u.age >= 18);      // лише дорослі
users.find((u) => u.id === 2);         // перший збіг або undefined
users.some((u) => u.age < 18);         // true
users.every((u) => u.age > 10);        // true
users.reduce((sum, u) => sum + u.age, 0); // 42

[3, 1, 2].toSorted((a, b) => a - b);   // [1, 2, 3], оригінал не змінюється
users.forEach((u) => console.log(u.name));`,
      },
      tip: {
        uk: "`toSorted` є у сучасних браузерах. Якщо потрібна сумісність зі старими, робіть копію: `[...arr].sort()`.",
        en: "`toSorted` exists in modern browsers. For older ones copy first: `[...arr].sort()`.",
      },
    },
    {
      id: "objects",
      title: { uk: "Об'єкти: деструктуризація, spread, ?.", en: "Objects: destructuring, spread, ?." },
      text: {
        uk: "Деструктуризація витягує поля, spread копіює й об'єднує, `?.` безпечно читає вкладені поля, `??` підставляє значення лише для null/undefined (на відміну від `||`, який реагує і на 0, \"\" та false).",
        en: "Destructuring extracts fields, spread copies and merges, `?.` safely reads nested fields, `??` falls back only for null/undefined (unlike `||`, which also reacts to 0, \"\" and false).",
      },
      code: {
        lang: "js",
        src: `const user = { name: "Аня", address: { city: "Київ" }, tags: ["a", "b"] };

const { name, address: { city } } = user;
const [first, ...others] = user.tags;

const updated = { ...user, name: "Оля" };  // нова копія зі зміною
const merged = [...user.tags, "c"];

console.log(user.profile?.avatar);         // undefined, без помилки
const limit = settings.limit ?? 10;        // 0 залишиться 0

Object.keys(user);     // ["name", "address", "tags"]
Object.entries(user);  // [["name", "Аня"], …]`,
      },
    },
    {
      id: "equality",
      title: { uk: "=== та truthy / falsy", en: "=== and truthy / falsy" },
      text: {
        uk: "Завжди порівнюйте через `===`: він не перетворює типи. До falsy належать: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN`. Усе інше — truthy, зокрема `[]` і `{}`.",
        en: "Always compare with `===`: it doesn't coerce types. Falsy values: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN`. Everything else is truthy, including `[]` and `{}`.",
      },
      code: {
        lang: "js",
        src: `0 == "0";     // true  (дивно)
0 === "0";    // false (передбачувано)

if (!list.length) {
  console.log("Масив порожній");
}

const label = isAdmin ? "Адмін" : "Користувач";
const name = user && user.name;   // short-circuit`,
      },
    },
    {
      id: "dom",
      title: { uk: "DOM: події та елементи", en: "DOM: events and elements" },
      text: {
        uk: "Знайдіть елемент, додайте слухача, змініть клас чи текст. Делегування подій: один слухач на батьківському елементі замість десятків на дітях.",
        en: "Find an element, add a listener, change a class or text. Event delegation: one listener on the parent instead of dozens on children.",
      },
      code: {
        lang: "js",
        src: `const btn = document.querySelector("#save");
const items = document.querySelectorAll(".item");

btn.addEventListener("click", (event) => {
  event.preventDefault();
  btn.classList.toggle("is-active");
  btn.textContent = "Збережено";
  btn.setAttribute("aria-pressed", "true");
});

// Делегування
document.querySelector(".list").addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (!item) return;
  console.log("Клік по", item.dataset.id);
});

// Створення елемента (textContent безпечніший за innerHTML)
const li = document.createElement("li");
li.textContent = userInput;
document.querySelector("ul").append(li);`,
      },
      warn: {
        uk: "Не вставляйте дані користувача через `innerHTML`: це відкриває шлях до XSS-атак. Використовуйте `textContent`.",
        en: "Don't insert user data with `innerHTML`: it opens the door to XSS attacks. Use `textContent`.",
      },
    },
    {
      id: "async",
      title: { uk: "Async/await та fetch", en: "Async/await and fetch" },
      text: {
        uk: "`fetch` повертає Promise. Він не кидає помилку на 404/500, тому перевіряйте `response.ok`. Обгортайте виклик у `try/catch`.",
        en: "`fetch` returns a Promise. It doesn't throw on 404/500, so check `response.ok`. Wrap the call in `try/catch`.",
      },
      code: {
        lang: "js",
        src: `async function loadUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const users = await res.json();
    return users;
  } catch (err) {
    console.error("Не вдалось завантажити:", err);
    return [];
  }
}

// Паралельні запити
const [a, b] = await Promise.all([fetch("/a"), fetch("/b")]);

// POST із JSON
await fetch("/api/items", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Нова задача" }),
});`,
      },
    },
    {
      id: "modules",
      title: { uk: "ES-модулі: import / export", en: "ES modules: import / export" },
      text: {
        uk: "Поділяйте код на файли за відповідальністю. Іменований експорт — багато з файлу, `default` — один головний. У браузері підключайте `<script type=\"module\">`.",
        en: "Split code into files by responsibility. Named exports give many things per file, `default` gives one main thing. In the browser load `<script type=\"module\">`.",
      },
      code: {
        lang: "js",
        src: `// utils/format.js
export const formatPrice = (n) => \`\${n.toFixed(2)} ₴\`;
export default function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// main.js
import capitalize, { formatPrice } from "./utils/format.js";`,
      },
      warn: {
        uk: "Модулі не працюють при відкритті `index.html` через `file://`. Запускайте локальний сервер (наприклад, `npx serve`).",
        en: "Modules don't work when you open `index.html` via `file://`. Run a local server (for example `npx serve`).",
      },
    },
    {
      id: "storage",
      title: { uk: "localStorage і JSON", en: "localStorage and JSON" },
      text: {
        uk: "`localStorage` зберігає лише рядки, тому об'єкти перетворюємо через `JSON.stringify` і назад через `JSON.parse`. Обгортайте в `try/catch`: сховище може бути недоступне.",
        en: "`localStorage` stores strings only, so convert objects with `JSON.stringify` and back with `JSON.parse`. Wrap in `try/catch`: storage may be unavailable.",
      },
      code: {
        lang: "js",
        src: `function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

save("settings", { theme: "dark" });
const settings = load("settings", { theme: "light" });`,
      },
    },
    {
      id: "structure",
      title: { uk: "Як організувати JS-код", en: "How to organise JS code" },
      text: {
        uk: "Дрібні функції з одним обов'язком, зрозумілі назви, без глобальних змінних. Розділяйте роботу з даними, DOM і запуск програми.",
        en: "Small single-purpose functions, clear names, no globals. Separate data handling, DOM work and app start-up.",
      },
      code: {
        lang: "text",
        src: `js/
├── main.js          # точка входу, запуск
├── api.js           # fetch-запити
├── state.js         # дані застосунку
├── dom.js           # рендер та події
└── utils/
    ├── format.js
    └── storage.js`,
      },
    },
  ],
});
