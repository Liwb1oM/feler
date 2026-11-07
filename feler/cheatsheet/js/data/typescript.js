(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "ts",
  icon: "TS",
  title: { uk: "TypeScript", en: "TypeScript" },
  intro: {
    uk: "TypeScript — це JavaScript з типами. Типи перевіряються під час розробки й ловлять помилки ще до запуску. У браузері виконується звичайний JS.",
    en: "TypeScript is JavaScript with types. Types are checked at development time and catch bugs before you run the code. The browser still runs plain JS.",
  },
  items: [
    {
      id: "basics",
      title: { uk: "Базові типи", en: "Basic types" },
      text: {
        uk: "Часто тип можна не вказувати: TypeScript виводить його сам (`let n = 5` вже number). Явно типізуйте параметри функцій та публічні структури даних.",
        en: "Often you don't need to write a type: TypeScript infers it (`let n = 5` is already a number). Explicitly type function parameters and public data shapes.",
      },
      code: {
        lang: "ts",
        src: `const title: string = "Hello";
let count: number = 0;
const isDone: boolean = false;
const ids: number[] = [1, 2, 3];
const tags: Array<string> = ["a", "b"];
const pair: [string, number] = ["age", 30];   // кортеж

let maybe: string | null = null;              // union
const id = 42;                                // виведено: 42 (літерал)`,
      },
    },
    {
      id: "interface-type",
      title: { uk: "interface та type", en: "interface and type" },
      text: {
        uk: "Для форми об'єкта підходять обидва. Прийнято: `interface` для об'єктів та їх розширення, `type` для union, кортежів і складних комбінацій. Головне — єдиний стиль у команді.",
        en: "Both describe object shapes. A common convention: `interface` for objects and extending them, `type` for unions, tuples and complex combinations. What matters is consistency in the team.",
      },
      code: {
        lang: "ts",
        src: `interface User {
  id: number;
  name: string;
  email?: string;        // необов'язкове поле
  readonly createdAt: Date;
}

interface Admin extends User {
  permissions: string[];
}

type Status = "idle" | "loading" | "error";   // union літералів
type ID = string | number;`,
      },
    },
    {
      id: "functions",
      title: { uk: "Типізація функцій", en: "Typing functions" },
      text: {
        uk: "Вказуйте типи параметрів. Тип результату зазвичай виводиться, але для публічних функцій корисно прописати його явно.",
        en: "Annotate parameter types. The return type is usually inferred, but spelling it out helps for public functions.",
      },
      code: {
        lang: "ts",
        src: `function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string, greeting = "Привіт"): string =>
  \`\${greeting}, \${name}!\`;

// Тип функції-колбека
type OnChange = (value: string) => void;

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}`,
      },
    },
    {
      id: "narrowing",
      title: { uk: "Звуження типів (narrowing)", en: "Narrowing" },
      text: {
        uk: "Після перевірки TypeScript розуміє точніший тип усередині гілки. Це основа безпечної роботи з union.",
        en: "After a check TypeScript knows a more precise type inside the branch. This is the basis of working safely with unions.",
      },
      code: {
        lang: "ts",
        src: `function print(value: string | number | null) {
  if (value === null) return;            // далі value: string | number
  if (typeof value === "string") {
    console.log(value.toUpperCase());    // тут string
  } else {
    console.log(value.toFixed(2));       // тут number
  }
}

// Дискримінований union
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };

function handle(r: Result) {
  if (r.ok) console.log(r.data);
  else console.error(r.error);
}`,
      },
    },
    {
      id: "generics",
      title: { uk: "Generics", en: "Generics" },
      text: {
        uk: "Generic — це «параметр типу». Дозволяє писати універсальний код, який зберігає точний тип: функція повертає той самий тип, який отримала.",
        en: "A generic is a \"type parameter\". It lets you write reusable code that preserves the exact type: the function returns the same type it received.",
      },
      code: {
        lang: "ts",
        src: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);       // number | undefined
const s = first(["a", "b"]);      // string | undefined

interface ApiResponse<T> {
  data: T;
  status: number;
}

const res: ApiResponse<User[]> = { data: [], status: 200 };`,
      },
    },
    {
      id: "utility",
      title: { uk: "Utility types", en: "Utility types" },
      text: {
        uk: "Вбудовані «перетворювачі» типів економлять багато коду: робити поля необов'язковими, вибирати чи викидати частину полів, описувати словники.",
        en: "Built-in type \"transformers\" save a lot of code: make fields optional, pick or omit some, describe dictionaries.",
      },
      code: {
        lang: "ts",
        src: `interface User { id: number; name: string; email: string }

type UserDraft   = Partial<User>;           // усі поля необов'язкові
type UserPreview = Pick<User, "id" | "name">;
type UserNoEmail = Omit<User, "email">;
type ReadonlyUser = Readonly<User>;
type Roles = Record<string, "admin" | "user">;

const routes = ["home", "about"] as const;  // ["home","about"] як літерали
type Route = (typeof routes)[number];       // "home" | "about"`,
      },
    },
    {
      id: "unknown-any",
      title: { uk: "any проти unknown", en: "any vs unknown" },
      text: {
        uk: "`any` вимикає перевірки типів, тому його варто уникати. `unknown` — безпечна альтернатива: перед використанням значення треба його перевірити.",
        en: "`any` turns type checking off, so avoid it. `unknown` is the safe alternative: you must check the value before using it.",
      },
      code: {
        lang: "ts",
        src: `function parse(json: string): unknown {
  return JSON.parse(json);
}

const data = parse('{"name":"Аня"}');

if (typeof data === "object" && data !== null && "name" in data) {
  console.log((data as { name: string }).name);
}

// Уникайте
const bad: any = 5;
bad.foo.bar();   // помилка лише під час виконання`,
      },
      warn: {
        uk: "`as` не перевіряє дані, а лише змушує TypeScript вам повірити. Для даних із сервера краще використовувати валідацію (наприклад, бібліотеку zod).",
        en: "`as` doesn't validate data, it only makes TypeScript trust you. For server data prefer real validation (for example the zod library).",
      },
    },
    {
      id: "api-typing",
      title: { uk: "Типізація відповіді API", en: "Typing an API response" },
      text: {
        uk: "Опишіть форму даних інтерфейсом і вкажіть її як тип результату функції. Тоді редактор підказує поля, а помилки в назвах ловляться одразу.",
        en: "Describe the data shape with an interface and use it as the function's return type. The editor then suggests fields and typos get caught immediately.",
      },
      code: {
        lang: "ts",
        src: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function getTodos(): Promise<Todo[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return (await res.json()) as Todo[];
}`,
      },
    },
    {
      id: "tsconfig",
      title: { uk: "tsconfig.json: основа", en: "tsconfig.json: the essentials" },
      text: {
        uk: "Режим `strict` вмикає всі суворі перевірки й дуже допомагає. Шаблон Vite створює файл автоматично, але корисно розуміти ключові опції.",
        en: "`strict` mode enables all the strict checks and helps a lot. The Vite template creates the file for you, but it's good to know the key options.",
      },
      code: {
        lang: "json",
        file: "tsconfig.json",
        src: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}`,
      },
    },
  ],
});
