(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "react",
  icon: "R",
  title: { uk: "React + TypeScript", en: "React + TypeScript" },
  intro: {
    uk: "React будує інтерфейс із компонентів — функцій, які повертають розмітку (JSX). Коли змінюється стан, React сам оновлює потрібну частину сторінки.",
    en: "React builds the UI from components: functions that return markup (JSX). When state changes, React updates the right part of the page for you.",
  },
  items: [
    {
      id: "create",
      title: { uk: "Створення проєкту", en: "Creating a project" },
      text: {
        uk: "Найпростіший старт — Vite з шаблоном `react-ts`. Потім `npm install` і `npm run dev`.",
        en: "The easiest start is Vite with the `react-ts` template. Then `npm install` and `npm run dev`.",
      },
      code: {
        lang: "sh",
        src: `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev      # локальний сервер
npm run build    # збірка у dist/`,
      },
    },
    {
      id: "project-structure",
      title: { uk: "Рекомендована структура", en: "Recommended structure" },
      text: {
        uk: "Групуйте за змістом: компоненти, хуки, сторінки, типи. Один компонент — один файл, назва з великої літери.",
        en: "Group by purpose: components, hooks, pages, types. One component per file, named with a capital letter.",
      },
      code: {
        lang: "text",
        src: `my-app/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx            # точка входу
    ├── App.tsx
    ├── index.css
    ├── components/         # перевикористовувані шматки UI
    │   ├── Button.tsx
    │   └── Card.tsx
    ├── pages/              # сторінки / екрани
    ├── hooks/              # власні хуки: useLocalStorage.ts
    ├── api/                # запити до сервера
    ├── types/              # спільні типи
    └── utils/              # допоміжні функції`,
      },
    },
    {
      id: "component",
      title: { uk: "Компонент і JSX", en: "Component and JSX" },
      text: {
        uk: "Компонент повертає один кореневий елемент (або фрагмент `<>…</>`). У JSX замість `class` пишемо `className`, а JavaScript-вирази — у фігурних дужках.",
        en: "A component returns one root element (or a fragment `<>…</>`). In JSX use `className` instead of `class`, and put JavaScript expressions in curly braces.",
      },
      code: {
        lang: "tsx",
        file: "App.tsx",
        src: `export default function App() {
  const name = "Олександр";
  const year = new Date().getFullYear();

  return (
    <>
      <h1 className="title">Привіт, {name}!</h1>
      <p>Зараз {year} рік</p>
      <img src="/logo.svg" alt="Логотип" />
    </>
  );
}`,
      },
    },
    {
      id: "props",
      title: { uk: "Props із типами", en: "Typed props" },
      text: {
        uk: "Props — це параметри компонента. Описуйте їх типом, а `children` — як `ReactNode`. Props лише читаємо, змінювати їх не можна.",
        en: "Props are the component's parameters. Describe them with a type and type `children` as `ReactNode`. Props are read-only: never mutate them.",
      },
      code: {
        lang: "tsx",
        file: "Button.tsx",
        src: `import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={"btn btn--" + variant}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Використання
// <Button variant="secondary" onClick={() => alert("Hi")}>Натисни</Button>`,
      },
    },
    {
      id: "usestate",
      title: { uk: "useState: стан", en: "useState: state" },
      text: {
        uk: "Стан — це дані, зміна яких перемальовує компонент. Ніколи не змінюйте стан напряму: викликайте сеттер. Якщо новий стан залежить від попереднього, передавайте функцію.",
        en: "State is data whose change re-renders the component. Never mutate state directly: call the setter. If the new state depends on the previous one, pass a function.",
      },
      code: {
        lang: "tsx",
        src: `import { useState } from "react";

type Todo = { id: number; title: string };

export function Counter() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Кліків: {count}
      </button>

      <button
        type="button"
        onClick={() =>
          setTodos((prev) => [...prev, { id: Date.now(), title: "Нова" }])
        }
      >
        Додати задачу
      </button>
    </div>
  );
}`,
      },
      warn: {
        uk: "Не робіть `todos.push(...)` або `user.name = ...` у стані: створюйте нову копію (`[...todos, x]`, `{ ...user, name }`).",
        en: "Don't do `todos.push(...)` or `user.name = ...` on state: create a new copy (`[...todos, x]`, `{ ...user, name }`).",
      },
    },
    {
      id: "useeffect",
      title: { uk: "useEffect: побічні ефекти", en: "useEffect: side effects" },
      text: {
        uk: "Ефект запускається після рендера: запити, підписки, таймери. Масив залежностей визначає, коли він повторюється: `[]` — лише раз, `[id]` — при зміні `id`. Прибирання повертайте з функції.",
        en: "An effect runs after render: requests, subscriptions, timers. The dependency array decides when it re-runs: `[]` means once, `[id]` means whenever `id` changes. Return a cleanup function.",
      },
      code: {
        lang: "tsx",
        src: `import { useEffect, useState } from "react";

type User = { id: number; name: string };

export function UserCard({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users/" + id, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json() as Promise<User>;
      })
      .then(setUser)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });

    return () => controller.abort();   // прибирання
  }, [id]);

  if (error) return <p>Помилка: {error}</p>;
  if (!user) return <p>Завантаження…</p>;
  return <h2>{user.name}</h2>;
}`,
      },
      tip: {
        uk: "Якщо дані можна обчислити з props чи стану під час рендера, `useEffect` не потрібен.",
        en: "If a value can be computed from props or state during render, you don't need `useEffect`.",
      },
    },
    {
      id: "lists",
      title: { uk: "Списки, key та умовний рендер", en: "Lists, key and conditional rendering" },
      text: {
        uk: "Для списку використовуйте `map` і стабільний унікальний `key` (id з даних, а не індекс, якщо порядок може змінюватись). Умови — через `if`, `&&` або тернарний оператор.",
        en: "For lists use `map` with a stable unique `key` (an id from data, not the index if order can change). For conditions use `if`, `&&` or a ternary.",
      },
      code: {
        lang: "tsx",
        src: `type Item = { id: number; title: string; done: boolean };

export function List({ items }: { items: Item[] }) {
  if (items.length === 0) return <p>Порожньо</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.done ? "✅" : "⬜"} {item.title}
        </li>
      ))}
    </ul>
  );
}

// Обережно з числами: {count && <X />} покаже 0, коли count === 0
// Краще: {count > 0 && <X />}`,
      },
    },
    {
      id: "forms",
      title: { uk: "Форми: контрольовані поля", en: "Forms: controlled inputs" },
      text: {
        uk: "У контрольованого поля значення живе в стані, а `onChange` його оновлює. Для `submit` викликайте `preventDefault`.",
        en: "A controlled input keeps its value in state and `onChange` updates it. Call `preventDefault` on `submit`.",
      },
      code: {
        lang: "tsx",
        src: `import { useState, type FormEvent, type ChangeEvent } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Підписка:", email);
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={handleChange} required />
      <button type="submit">Підписатись</button>
    </form>
  );
}`,
      },
    },
    {
      id: "custom-hook",
      title: { uk: "Власний хук", en: "Custom hook" },
      text: {
        uk: "Якщо логіка з хуками повторюється, винесіть її у функцію, що починається з `use`. Це не складніше за звичайну функцію.",
        en: "If hook logic repeats, extract it into a function whose name starts with `use`. It's no harder than a normal function.",
      },
      code: {
        lang: "ts",
        file: "hooks/useLocalStorage.ts",
        src: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// const [theme, setTheme] = useLocalStorage("theme", "light");`,
      },
    },
    {
      id: "refs-memo",
      title: { uk: "useRef, useMemo, useCallback", en: "useRef, useMemo, useCallback" },
      text: {
        uk: "`useRef` — посилання на DOM-елемент або значення, що не викликає перерендер. `useMemo` і `useCallback` — оптимізація: застосовуйте, лише коли справді є проблема з продуктивністю.",
        en: "`useRef` holds a DOM element or a value that doesn't trigger re-render. `useMemo` and `useCallback` are optimisations: use them only when you actually have a performance problem.",
      },
      code: {
        lang: "tsx",
        src: `import { useMemo, useRef } from "react";

export function Search({ items }: { items: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(() => [...items].sort(), [items]);

  return (
    <>
      <input ref={inputRef} />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Фокус
      </button>
      <p>{sorted.length} елементів</p>
    </>
  );
}`,
      },
    },
    {
      id: "context",
      title: { uk: "Context: спільні дані", en: "Context: shared data" },
      text: {
        uk: "Context передає значення вглиб дерева без «прокидання» props через кожен рівень. Підходить для теми, мови, поточного користувача.",
        en: "Context passes a value deep into the tree without drilling props through every level. Good for theme, language, the current user.",
      },
      code: {
        lang: "tsx",
        file: "ThemeContext.tsx",
        src: `import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeValue = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme потрібно викликати всередині ThemeProvider");
  return ctx;
}`,
      },
    },
    {
      id: "rules",
      title: { uk: "Правила хуків і типові помилки", en: "Rules of hooks and common mistakes" },
      text: {
        uk: "Хуки викликають лише на верхньому рівні компонента чи іншого хука: не в умовах, циклах і вкладених функціях. Типові помилки новачків: зміна стану напряму, відсутній `key` у списку, забуті залежності в `useEffect`, нескінченний цикл через `setState` в ефекті без залежностей.",
        en: "Call hooks only at the top level of a component or another hook: not in conditions, loops or nested functions. Common beginner mistakes: mutating state directly, missing `key` in lists, forgotten dependencies in `useEffect`, an infinite loop from `setState` in an effect with no dependency array.",
      },
      code: {
        lang: "tsx",
        src: `function Bad({ show }: { show: boolean }) {
  if (show) {
    const [x, setX] = useState(0);   // ❌ хук в умові
  }
  return null;
}

function Good({ show }: { show: boolean }) {
  const [x, setX] = useState(0);     // ✅ завжди на верхньому рівні
  return show ? <p>{x}</p> : null;
}`,
      },
    },
  ],
});
