const lessons = {
	html: {
		title: "Перший заголовок",
		prompt: "Додай заголовок першого рівня за допомогою тегу <h1>.",
		filename: "index.html",
		starter: "<!-- Додай заголовок <h1>Привіт, веб!</h1> -->",
		check: code => /<h1(?:\s[^>]*)?>[\s\S]+?<\/h1>/i.test(code)
	},
	css: {
		title: "Колір для картки",
		prompt: "Додай властивість color до правила для класу .card.",
		filename: "style.css",
		starter: ".card {\n  /* Додай властивість color */\n}",
		check: code => /\.card\s*\{[^}]*\bcolor\s*:/s.test(code)
	},
	js: {
		title: "Функція подвоєння",
		prompt: "Допиши функцію double, щоб вона повертала число, помножене на 2.",
		filename: "script.js",
		starter: "function double(number) {\n  return number;\n}",
		check: code => /function\s+double\s*\(\s*number\s*\)\s*\{[\s\S]*?return\s+number\s*\*\s*2\s*;?[\s\S]*?\}/.test(code)
	},
	backend: {
		title: "Перша відповідь сервера",
		prompt: "Додай відповідь сервера за допомогою response.end().",
		filename: "server.js",
		starter: "const server = createServer((request, response) => {\n  // Поверни коротке повідомлення\n});",
		check: code => /response\.end\s*\(/.test(code)
	},
	python: {
		title: "Функція на Python",
		prompt: "Зміни функцію double так, щоб вона повертала число, помножене на 2.",
		filename: "main.py",
		starter: "def double(number):\n    return number",
		check: code => /def\s+double\s*\(\s*number\s*\)\s*:[\s\S]*?return\s+number\s*\*\s*2/.test(code)
	}
};

const storageKey = "feler-progress-v1";
const lessonDraftsKey = "feler-lesson-drafts-v1";
const editor = document.querySelector("#codeEditor");
const feedback = document.querySelector("#feedback");
const lineNumbers = document.querySelector("#lineNumbers");
let activeLesson = "js";

function readDrafts(key, validKeys) {
	try {
		const saved = JSON.parse(localStorage.getItem(key) || "{}");
		if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
		return Object.fromEntries(Object.entries(saved).filter(([id, code]) => validKeys.includes(id) && typeof code === "string"));
	} catch {
		return {};
	}
}

function saveDrafts(key, drafts) {
	try {
		localStorage.setItem(key, JSON.stringify(drafts));
	} catch {
		// Editors remain usable when browser storage is unavailable.
	}
}

let lessonDrafts = readDrafts(lessonDraftsKey, Object.keys(lessons));

function readProgress() {
	try {
		const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
		return {
			completed: Array.isArray(saved.completed) ? saved.completed.filter(id => lessons[id]) : [],
			streak: Number.isFinite(saved.streak) ? saved.streak : 0,
			lastVisit: typeof saved.lastVisit === "string" ? saved.lastVisit : ""
		};
	} catch {
		return { completed: [], streak: 0, lastVisit: "" };
	}
}

let progress = readProgress();

function saveProgress() {
	try {
		localStorage.setItem(storageKey, JSON.stringify(progress));
	} catch {
		// The lesson still works when browser storage is unavailable.
	}
}

function updateProgressView() {
	const percent = Math.round((progress.completed.length / Object.keys(lessons).length) * 100);
	document.querySelector("#sidebarProgress").textContent = `${percent}%`;
	document.querySelector("#sidebarProgressBar").style.width = `${percent}%`;
	document.querySelector("#streakCount").textContent = String(progress.streak);

	document.querySelectorAll("[data-state]").forEach(state => {
		const completed = progress.completed.includes(state.dataset.state);
		state.textContent = completed ? window.FelerI18n.t("lessonDone") : window.FelerI18n.t("lessonNotStarted");
		state.classList.toggle("is-done", completed);
	});
}

function updateLineNumbers() {
	const count = editor.value.split("\n").length;
	lineNumbers.innerHTML = Array.from({ length: count }, (_, index) => index + 1).join("<br>");
}

function selectLesson(id) {
	const lesson = lessons[id];
	if (!lesson) return;

	activeLesson = id;
	document.querySelector("#challengeTitle").textContent = lesson.title;
	document.querySelector("#challengePrompt").textContent = lesson.prompt;
	document.querySelector("#editorFilename").textContent = lesson.filename;
	editor.value = lessonDrafts[id] ?? lesson.starter;
	feedback.textContent = "Коли будеш готовий, запусти перевірку.";
	feedback.className = "feedback";
	updateLineNumbers();
	document.querySelector("#practiceTitle").scrollIntoView({ behavior: "smooth", block: "start" });
	editor.focus({ preventScroll: true });
}

function updateVisitStreak() {
	const currentDate = new Date();
	const today = [currentDate.getFullYear(), String(currentDate.getMonth() + 1).padStart(2, "0"), String(currentDate.getDate()).padStart(2, "0")].join("-");
	if (progress.lastVisit !== today) {
		const previousDate = new Date(currentDate);
		previousDate.setDate(currentDate.getDate() - 1);
		const yesterday = [previousDate.getFullYear(), String(previousDate.getMonth() + 1).padStart(2, "0"), String(previousDate.getDate()).padStart(2, "0")].join("-");
		progress.streak = progress.lastVisit === yesterday ? progress.streak + 1 : 1;
		progress.lastVisit = today;
		saveProgress();
	}
}

function updateTodayLabel() {
	document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat({
		uk: "uk-UA",
		en: "en-US",
	}[window.FelerI18n.language], {
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(new Date());
}

updateTodayLabel();

updateVisitStreak();
updateProgressView();
editor.value = lessonDrafts[activeLesson] ?? lessons[activeLesson].starter;
updateLineNumbers();

document.querySelectorAll("[data-lesson]").forEach(button => {
	button.addEventListener("click", () => selectLesson(button.dataset.lesson));
});

document.querySelectorAll(".filter-chip").forEach(button => {
	button.addEventListener("click", () => {
		document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("is-selected"));
		button.classList.add("is-selected");
		document.querySelector("#courseSearch").value = "";
		filterCourses(button.dataset.filter, "");
	});
});

function filterCourses(category, query) {
	const normalizedQuery = query.trim().toLocaleLowerCase("uk");
	let visibleCount = 0;

	document.querySelectorAll(".course-card").forEach(card => {
		const matchesCategory = category === "all" || (category === "frontend" ? ["html", "css", "js"].includes(card.dataset.course) : card.dataset.course === category);
		const matchesQuery = `${card.dataset.title} ${card.dataset.course} ${card.textContent}`.toLocaleLowerCase("uk").includes(normalizedQuery);
		card.hidden = !(matchesCategory && matchesQuery);
		if (!card.hidden) visibleCount += 1;
	});

	document.querySelector("#emptyState").hidden = visibleCount > 0;
}

document.querySelector("#courseSearch").addEventListener("input", event => {
	document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("is-selected", chip.dataset.filter === "all"));
	filterCourses("all", event.currentTarget.value);
});

editor.addEventListener("input", () => {
	updateLineNumbers();
	lessonDrafts[activeLesson] = editor.value;
	saveDrafts(lessonDraftsKey, lessonDrafts);
});
editor.addEventListener("keydown", event => {
	if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		document.querySelector("#checkCode").click();
		return;
	}
	if (event.key === "Tab") {
		event.preventDefault();
		const start = editor.selectionStart;
		const end = editor.selectionEnd;
		editor.setRangeText("  ", start, end, "end");
		updateLineNumbers();
		lessonDrafts[activeLesson] = editor.value;
		saveDrafts(lessonDraftsKey, lessonDrafts);
	}
});

document.querySelector("#checkCode").addEventListener("click", () => {
	if (lessons[activeLesson].check(editor.value)) {
		progress.completed = [...new Set([...progress.completed, activeLesson])];
		feedback.textContent = "Чудово! Усе правильно, урок зараховано.";
		feedback.className = "feedback is-success";
		saveProgress();
		updateProgressView();
	} else {
		feedback.textContent = "Ще не зовсім. Перевір умову та спробуй ще раз.";
		feedback.className = "feedback is-error";
	}
});

document.querySelector("#resetCode").addEventListener("click", () => {
	editor.value = lessons[activeLesson].starter;
	lessonDrafts[activeLesson] = editor.value;
	saveDrafts(lessonDraftsKey, lessonDrafts);
	feedback.textContent = "Початковий код відновлено.";
	feedback.className = "feedback";
	updateLineNumbers();
	editor.focus();
});

const sandboxExamples = {
	html: {
		filename: "index.html",
		label: "HTML",
		output: "preview",
		hint: "Зміни текст у тегах і натисни «Запустити».",
		code: "<main>\n  <h1>Моя перша сторінка</h1>\n  <p>Я вчуся створювати веб.</p>\n</main>"
	},
	css: {
		filename: "style.css",
		label: "CSS",
		output: "preview",
		hint: "Зміни колір або розмір тексту та подивись на результат.",
		code: "body {\n  font-family: sans-serif;\n  background: #f3f7ed;\n  color: #244b34;\n  padding: 24px;\n}\n\nh1 {\n  color: #56853a;\n}"
	},
	javascript: {
		filename: "script.js",
		label: "JavaScript",
		output: "console",
		hint: "Почни з console.log(), щоб побачити результат у консолі.",
		code: "const name = \"світе\";\nconsole.log(`Привіт, ${name}!`);\n\nfunction add(a, b) {\n  return a + b;\n}\n\nconsole.log(\"2 + 3 =\", add(2, 3));"
	},
	python: {
		filename: "main.py",
		label: "Python",
		output: "console",
		hint: "Python запускається в браузері через Pyodide; для першого запуску потрібен інтернет.",
		code: "name = \"світе\"\nprint(f\"Привіт, {name}!\")\n\nfor number in range(1, 4):\n    print(f\"Крок {number}\")"
	}
};

const sandboxEditor = document.querySelector("#sandboxEditor");
const sandboxDraftsKey = "feler-sandbox-drafts-v1";
let sandboxDrafts = readDrafts(sandboxDraftsKey, Object.keys(sandboxExamples));
const sandboxLanguage = document.querySelector("#sandboxLanguage");
const sandboxPreview = document.querySelector("#sandboxPreview");
const sandboxConsole = document.querySelector("#sandboxConsole");
const sandboxHint = document.querySelector("#sandboxHint");
const sandboxLineNumbers = document.querySelector("#sandboxLineNumbers");
let pythonRuntimePromise;

function updateSandboxLineNumbers() {
	const count = sandboxEditor.value.split("\n").length;
	sandboxLineNumbers.innerHTML = Array.from({ length: count }, (_, index) => index + 1).join("<br>");
}

function selectSandboxLanguage() {
	const example = sandboxExamples[sandboxLanguage.value];
	sandboxEditor.value = sandboxDrafts[sandboxLanguage.value] ?? example.code;
	document.querySelector("#sandboxFilename").textContent = example.filename;
	document.querySelector("#sandboxLanguageLabel").textContent = example.label;
	document.querySelector("#outputTitle").textContent = example.output === "console" ? "Консоль" : "Попередній перегляд";
	sandboxPreview.hidden = example.output === "console";
	sandboxConsole.hidden = example.output !== "console";
	sandboxConsole.textContent = "Запусти приклад, щоб побачити результат.";
	sandboxHint.textContent = example.hint;
	updateSandboxLineNumbers();
}

function appendSandboxOutput(text) {
	sandboxConsole.textContent += `${sandboxConsole.textContent ? "\n" : ""}${text}`;
}

function formatSandboxValue(value) {
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}

function runJavaScriptExample() {
	const safeCode = JSON.stringify(sandboxEditor.value).replace(/</g, "\\u003c");
	sandboxPreview.srcdoc = `<!doctype html><html><body><script>
		const report = (type, values) => parent.postMessage({ source: "feler-sandbox", type, text: values.map(value => {
			if (typeof value === "string") return value;
			try { return JSON.stringify(value) ?? String(value); } catch { return String(value); }
		}).join(" ") }, "*");
		console.log = (...values) => report("log", values);
		console.error = (...values) => report("error", values);
		window.onerror = message => report("error", [message]);
		try { new Function(${safeCode})(); } catch (error) { report("error", [error.message]); }
	<\/script></body></html>`;
}

function loadPythonRuntime() {
	if (!pythonRuntimePromise) {
		pythonRuntimePromise = new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
			script.onload = () => window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" }).then(resolve, reject);
			script.onerror = () => reject(new Error("Не вдалося завантажити Python-середовище."));
			document.head.append(script);
		});
		pythonRuntimePromise.catch(() => { pythonRuntimePromise = undefined; });
	}
	return pythonRuntimePromise;
}

async function runSandbox() {
	const language = sandboxLanguage.value;
	sandboxConsole.textContent = "";
	if (language === "html") {
		sandboxPreview.srcdoc = sandboxEditor.value;
	} else if (language === "css") {
		const safeStyles = sandboxEditor.value.replace(/<\/style/gi, "<\\/style");
		sandboxPreview.srcdoc = `<!doctype html><html><head><style>${safeStyles}</style></head><body><h1>Привіт!</h1><p>Змінюй стилі й дивись, що відбувається.</p><button>Моя кнопка</button></body></html>`;
	} else if (language === "javascript") {
		runJavaScriptExample();
	} else {
		sandboxConsole.textContent = "Завантажую Python-середовище…";
		try {
			const pyodide = await loadPythonRuntime();
			sandboxConsole.textContent = "";
			pyodide.setStdout({ batched: appendSandboxOutput });
			pyodide.setStderr({ batched: appendSandboxOutput });
			await pyodide.runPythonAsync(sandboxEditor.value);
			if (!sandboxConsole.textContent) sandboxConsole.textContent = "Код виконано без виводу.";
		} catch (error) {
			sandboxConsole.textContent = error.message;
		}
	}
}

sandboxLanguage.addEventListener("change", selectSandboxLanguage);
sandboxEditor.addEventListener("input", () => {
	updateSandboxLineNumbers();
	sandboxDrafts[sandboxLanguage.value] = sandboxEditor.value;
	saveDrafts(sandboxDraftsKey, sandboxDrafts);
});
sandboxEditor.addEventListener("keydown", event => {
	if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		document.querySelector("#runSandbox").click();
		return;
	}
	if (event.key === "Tab") {
		event.preventDefault();
		const start = sandboxEditor.selectionStart;
		const end = sandboxEditor.selectionEnd;
		sandboxEditor.setRangeText("  ", start, end, "end");
		updateSandboxLineNumbers();
		sandboxDrafts[sandboxLanguage.value] = sandboxEditor.value;
		saveDrafts(sandboxDraftsKey, sandboxDrafts);
	}
});
document.querySelector("#resetSandbox").addEventListener("click", () => {
	delete sandboxDrafts[sandboxLanguage.value];
	saveDrafts(sandboxDraftsKey, sandboxDrafts);
	selectSandboxLanguage();
});
document.querySelector("#runSandbox").addEventListener("click", runSandbox);
window.addEventListener("message", event => {
	if (event.source !== sandboxPreview.contentWindow || event.data?.source !== "feler-sandbox") return;
	appendSandboxOutput(event.data.text);
	sandboxConsole.classList.toggle("is-error", event.data.type === "error");
});
selectSandboxLanguage();

document.querySelectorAll("[data-direction]").forEach(link => {
	link.addEventListener("click", () => {
		if (link.dataset.direction === "python") {
			sandboxLanguage.value = "python";
			selectSandboxLanguage();
			return;
		}
		const category = link.dataset.direction;
		document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("is-selected", chip.dataset.filter === category));
		filterCourses(category, "");
	});
});

document.querySelectorAll(".nav-link").forEach(link => {
	link.addEventListener("click", () => {
		document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("is-active"));
		link.classList.add("is-active");
	});
});

(() => {
	const fizzBuzzOutput = "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz";
	const tracks = {
		javascript: {
			name: "JavaScript", mode: "javascript", topic: "Веб і логіка", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Запусти першу програму та побач відповідь у консолі.", filename: "hello.js", starter: "console.log('Hello, World!');", expected: "Hello, World!", hint: "console.log() виводить повідомлення в консоль.", solution: "console.log('Hello, World!');" },
				{ id: "variables", title: "Змінні та повідомлення", task: "Збережи ім'я у змінній name й привітай Ada.", filename: "greeting.js", starter: "const name = 'Ada';\nconsole.log(`Hello, ${name}!`);", expected: "Hello, Ada!", hint: "Встав значення name у шаблонний рядок за допомогою ${name}.", solution: "const name = 'Ada';\nconsole.log(`Hello, ${name}!`);" },
				{ id: "functions", title: "Функції й перевірки", task: "Виправ double: поверни подвоєне число для обох тестових значень.", filename: "double.js", starter: "function double(number) {\n  return number;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));", expected: "12\n-6", hint: "Помнож number на 2 перед тим, як повернути результат.", solution: "function double(number) {\n  return number * 2;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));" },
				{ id: "oop", title: "Класи та об'єкти", task: "Створи клас Student з конструктором і методом greet(), щоб вивести Hello, Ada!.", filename: "student.js", starter: "class Student {\n  constructor(name) {\n    this.name = name;\n  }\n\n  // Додай метод greet()\n}\n\nconst student = new Student('Ada');\nconsole.log(student.greet());", expected: "Hello, Ada!", hint: "Конструктор зберігає ім'я в об'єкті, а метод використовує this.name.", solution: "class Student {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello, ${this.name}!`;\n  }\n}\n\nconst student = new Student('Ada');\nconsole.log(student.greet());" },
				{ id: "project", title: "Проєкт: FizzBuzz", task: "Виведи числа від 1 до 15. Для кратних 3 виводь Fizz, для 5 — Buzz, для обох — FizzBuzz.", filename: "fizzbuzz.js", starter: "for (let number = 1; number <= 15; number++) {\n  console.log(number);\n}", expected: fizzBuzzOutput, hint: "Спочатку перевір кратність і 3, і 5; потім окремо 3 та 5.", solution: "for (let number = 1; number <= 15; number++) {\n  if (number % 15 === 0) console.log('FizzBuzz');\n  else if (number % 3 === 0) console.log('Fizz');\n  else if (number % 5 === 0) console.log('Buzz');\n  else console.log(number);\n}" , project: true }
			]
		},
		python: {
			name: "Python", mode: "python", topic: "Логіка й автоматизація", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Запусти першу програму та побач відповідь у консолі.", filename: "hello.py", starter: "print('Hello, World!')", expected: "Hello, World!", hint: "Функція print() виводить текст у консоль.", solution: "print('Hello, World!')" },
				{ id: "variables", title: "Змінні та повідомлення", task: "Збережи ім'я у змінній name й привітай Ada.", filename: "greeting.py", starter: "name = 'Ada'\nprint(f'Hello, {name}!')", expected: "Hello, Ada!", hint: "Префікс f перед рядком дає змогу вставити значення як {name}.", solution: "name = 'Ada'\nprint(f'Hello, {name}!')" },
				{ id: "functions", title: "Функції й перевірки", task: "Виправ double: поверни подвоєне число для обох тестових значень.", filename: "double.py", starter: "def double(number):\n    return number\n\nprint(double(6))\nprint(double(-3))", expected: "12\n-6", hint: "Помнож number на 2 у виразі після return.", solution: "def double(number):\n    return number * 2\n\nprint(double(6))\nprint(double(-3))" },
				{ id: "oop", title: "Класи та об'єкти", task: "Створи клас Student з конструктором та методом greet(), щоб вивести Hello, Ada!.", filename: "student.py", starter: "class Student:\n    def __init__(self, name):\n        self.name = name\n\n    # Додай метод greet\n\nstudent = Student('Ada')\nprint(student.greet())", expected: "Hello, Ada!", hint: "__init__ задає стан нового об'єкта, а self.name зберігає його ім'я.", solution: "class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f'Hello, {self.name}!'\n\nstudent = Student('Ada')\nprint(student.greet())" },
				{ id: "project", title: "Проєкт: парні числа", task: "Пройдися циклом по списку й виведи лише парні числа.", filename: "even_numbers.py", starter: "numbers = [1, 2, 3, 4, 5, 6]\n\nfor number in numbers:\n    print(number)", expected: "2\n4\n6", hint: "Остача від ділення парного числа на 2 дорівнює нулю.", solution: "numbers = [1, 2, 3, 4, 5, 6]\n\nfor number in numbers:\n    if number % 2 == 0:\n        print(number)", project: true }
			]
		},
		typescript: {
			name: "TypeScript", mode: "text/typescript", topic: "Веб і типи", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Запусти TypeScript-програму та перевір її вивід.", filename: "hello.ts", starter: "console.log('Hello, World!');", expected: "Hello, World!", hint: "TypeScript-код компілюється в JavaScript, а потім запускається.", solution: "console.log('Hello, World!');" },
				{ id: "variables", title: "Типізовані змінні", task: "Оголоси name як рядок і привітай Ada.", filename: "greeting.ts", starter: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);", expected: "Hello, Ada!", hint: "Для тексту використовуй тип string.", solution: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);" },
				{ id: "functions", title: "Типізовані функції", task: "Виправ double, щоб обидва результати відповідали тестам.", filename: "double.ts", starter: "function double(number: number): number {\n  return number;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));", expected: "12\n-6", hint: "Тип number задає тип аргументу й результату; помнож аргумент на 2.", solution: "function double(number: number): number {\n  return number * 2;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));" },
				{ id: "oop", title: "Класи та типи", task: "Створи типізований клас Student з конструктором і методом greet(), щоб вивести Hello, Ada!.", filename: "student.ts", starter: "class Student {\n  name: string;\n\n  constructor(name: string) {\n    this.name = name;\n  }\n\n  // Додай типізований метод greet()\n}\n\nconst student = new Student('Ada');\nconsole.log(student.greet());", expected: "Hello, Ada!", hint: "Вкажи тип string для результату методу та використай this.name.", solution: "class Student {\n  name: string;\n\n  constructor(name: string) {\n    this.name = name;\n  }\n\n  greet(): string {\n    return `Hello, ${this.name}!`;\n  }\n}\n\nconst student = new Student('Ada');\nconsole.log(student.greet());" },
				{ id: "project", title: "Проєкт: парні числа", task: "Використай типізований список чисел і виведи лише парні.", filename: "even_numbers.ts", starter: "const numbers: number[] = [1, 2, 3, 4, 5, 6];\n\nfor (const number of numbers) {\n  console.log(number);\n}", expected: "2\n4\n6", hint: "Умова number % 2 === 0 залишає парні значення.", solution: "const numbers: number[] = [1, 2, 3, 4, 5, 6];\n\nfor (const number of numbers) {\n  if (number % 2 === 0) console.log(number);\n}", project: true }
			]
		},
		sql: {
			name: "SQL", mode: "text/x-sql", topic: "Дані й бази даних", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Виконай SELECT-запит і побач текст у результаті таблиці.", filename: "hello.sql", starter: "SELECT 'Hello, World!' AS greeting;", expected: "greeting\nHello, World!", hint: "SELECT повертає значення, а AS задає назву стовпця.", solution: "SELECT 'Hello, World!' AS greeting;" },
				{ id: "variables", title: "Обери потрібні рядки", task: "Знайди тільки початківців і впорядкуй їх за іменем.", filename: "learners.sql", starter: "WITH learners(name, level) AS (\n  VALUES ('Ada', 'beginner'), ('Linus', 'beginner'), ('Grace', 'advanced')\n)\nSELECT name, level FROM learners;", expected: "name | level\nAda | beginner\nLinus | beginner", hint: "Додай умову WHERE для level і сортування ORDER BY name.", solution: "WITH learners(name, level) AS (\n  VALUES ('Ada', 'beginner'), ('Linus', 'beginner'), ('Grace', 'advanced')\n)\nSELECT name, level FROM learners\nWHERE level = 'beginner'\nORDER BY name;" },
				{ id: "functions", title: "Агрегація даних", task: "Знайди день із найбільшою кількістю відвідувань.", filename: "visits.sql", starter: "WITH visits(day, total) AS (\n  VALUES ('Monday', 8), ('Tuesday', 5), ('Wednesday', 11)\n)\nSELECT day, total FROM visits;", expected: "day | total\nWednesday | 11", hint: "Відсортуй total за спаданням і залиш перший рядок через LIMIT 1.", solution: "WITH visits(day, total) AS (\n  VALUES ('Monday', 8), ('Tuesday', 5), ('Wednesday', 11)\n)\nSELECT day, total FROM visits\nORDER BY total DESC\nLIMIT 1;" },
				{ id: "project", title: "Проєкт: звіт мов", task: "Порахуй учнів для кожної мови й упорядкуй результат за назвою.", filename: "report.sql", starter: "WITH enrollments(language, learner) AS (\n  VALUES ('Python', 'Ada'), ('Python', 'Linus'), ('JavaScript', 'Grace')\n)\nSELECT language, learner FROM enrollments;", expected: "language | learners\nJavaScript | 1\nPython | 2", hint: "Згрупуй рядки за language й порахуй learner за допомогою COUNT(*).", solution: "WITH enrollments(language, learner) AS (\n  VALUES ('Python', 'Ada'), ('Python', 'Linus'), ('JavaScript', 'Grace')\n)\nSELECT language, COUNT(*) AS learners FROM enrollments\nGROUP BY language\nORDER BY language;", project: true }
			]
		},
		html: {
			name: "HTML", mode: "htmlmixed", topic: "Розмітка вебсторінок", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Створи заголовок першого рівня з текстом Hello, World!", filename: "index.html", starter: "<main>\n  <h1>Hello, World!</h1>\n</main>", checks: [{ selector: "h1", text: "Hello, World!" }], hint: "Заголовок першого рівня задає тег <h1>.", solution: "<main>\n  <h1>Hello, World!</h1>\n</main>" },
				{ id: "variables", title: "Абзац і посилання", task: "Додай короткий абзац і посилання на MDN.", filename: "index.html", starter: "<main>\n  <h1>Моя сторінка</h1>\n</main>", checks: [{ selector: "main > p", text: "Вчуся створювати веб." }, { selector: "a[href='https://developer.mozilla.org']" }], hint: "Використай <p> для тексту та <a href='...'> для посилання.", solution: "<main>\n  <h1>Моя сторінка</h1>\n  <p>Вчуся створювати веб.</p>\n  <a href=\"https://developer.mozilla.org\">Довідник MDN</a>\n</main>" },
				{ id: "functions", title: "Список навичок", task: "Створи список із трьох пунктів у <ul>.", filename: "index.html", starter: "<section>\n  <h1>Мої навички</h1>\n</section>", checks: [{ selector: "ul li", count: 3 }], hint: "Невпорядкований список використовує <ul>, а кожен пункт — <li>.", solution: "<section>\n  <h1>Мої навички</h1>\n  <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>\n</section>" },
				{ id: "project", title: "Проєкт: картка профілю", task: "Збери семантичну картку профілю з заголовком, описом і посиланням.", filename: "profile.html", starter: "<article class=\"profile\">\n  <h1>Майбутній розробник</h1>\n</article>", checks: [{ selector: "article.profile h1", text: "Майбутній розробник" }, { selector: "article.profile p" }, { selector: "article.profile a[href]" }], hint: "Додай опис у <p> та посилання <a href='https://example.com'>.", solution: "<article class=\"profile\">\n  <h1>Майбутній розробник</h1>\n  <p>Створюю свої перші сторінки.</p>\n  <a href=\"https://example.com\">Мої роботи</a>\n</article>", project: true }
			]
		},
		css: {
			name: "CSS", mode: "css", topic: "Стилі вебсторінок", lessons: [
				{ id: "hello", title: "Hello, World! у кольорі", task: "Задай заголовку кольори #244b34.", filename: "style.css", starter: "h1 {\n  color: #244b34;\n}", checks: [{ selector: "h1", property: "color", value: "#244b34" }], hint: "Властивість color змінює колір тексту.", solution: "h1 {\n  color: #244b34;\n}" },
				{ id: "variables", title: "Відступи картки", task: "Додай внутрішній відступ 24px для картки.", filename: "style.css", starter: ".card {\n  border-radius: 8px;\n}", checks: [{ selector: ".card", property: "padding", value: "24px" }], hint: "Внутрішній відступ задається через padding.", solution: ".card {\n  border-radius: 8px;\n  padding: 24px;\n}" },
				{ id: "functions", title: "Сітка елементів", task: "Перетвори список карток на CSS Grid.", filename: "style.css", starter: ".cards {\n  gap: 16px;\n}", checks: [{ selector: ".cards", property: "display", value: "grid" }], hint: "Додай display: grid; до правила .cards.", solution: ".cards {\n  display: grid;\n  gap: 16px;\n}" },
				{ id: "project", title: "Проєкт: стиль профілю", task: "Оформи профільну картку кольором, відступами й заокругленими кутами.", filename: "profile.css", starter: ".profile {\n  color: #244b34;\n}", checks: [{ selector: ".profile", property: "background-color", value: "#eaf1e4" }, { selector: ".profile", property: "padding", value: "24px" }, { selector: ".profile", property: "border-radius", value: "12px" }], hint: "Використай background-color, padding та border-radius.", solution: ".profile {\n  color: #244b34;\n  background-color: #eaf1e4;\n  padding: 24px;\n  border-radius: 12px;\n}", project: true }
			]
		},
		fastapi: {
			name: "FastAPI", mode: "python", topic: "Бекенд і API", staticChecks: true, lessons: [
				{ id: "hello", title: "Перший API-маршрут", task: "Створи FastAPI-застосунок і GET-маршрут /, який повертає привітання.", filename: "main.py", starter: "from fastapi import FastAPI\n\napp = FastAPI()\n\n# Додай GET-маршрут /", checks: [{ label: "Імпортовано FastAPI", pattern: "from\\s+fastapi\\s+import\\s+FastAPI" }, { label: "Створено застосунок", pattern: "app\\s*=\\s*FastAPI\\s*\\(" }, { label: "Оголошено GET-маршрут /", pattern: "@app\\.get\\s*\\(\\s*[\"']/[\"']\\s*\\)" }, { label: "Маршрут повертає привітання", pattern: "return\\s+\\{[^}]*[\"']message[\"']\\s*:" }], hint: "Декоратор @app.get('/') пов'язує функцію з GET-запитом.", solution: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello, World!\"}" },
				{ id: "variables", title: "Параметр шляху", task: "Додай GET /items/{item_id} з типізованим числовим параметром і поверни його в JSON.", filename: "main.py", starter: "from fastapi import FastAPI\n\napp = FastAPI()\n\n# Додай маршрут з item_id: int", checks: [{ label: "Є GET-маршрут items", pattern: "@app\\.get\\s*\\(\\s*[\"']/items/\\{item_id\\}[\"']\\s*\\)" }, { label: "Параметр має тип int", pattern: "item_id\\s*:\\s*int" }, { label: "Повертається item_id", pattern: "return\\s+\\{[^}]*[\"']item_id[\"']\\s*:\\s*item_id" }], hint: "Назва параметра у URL має збігатися з назвою аргументу функції.", solution: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/items/{item_id}\")\ndef read_item(item_id: int):\n    return {\"item_id\": item_id}" },
				{ id: "functions", title: "Параметри запиту", task: "Створи GET /items із параметрами skip і limit та поверни їх у відповіді.", filename: "main.py", starter: "from fastapi import FastAPI\n\napp = FastAPI()\n\n# Додай маршрут зі skip=0 та limit=10", checks: [{ label: "Є GET-маршрут items", pattern: "@app\\.get\\s*\\(\\s*[\"']/items[\"']\\s*\\)" }, { label: "Є параметр skip", pattern: "skip\\s*:\\s*int\\s*=\\s*0" }, { label: "Є параметр limit", pattern: "limit\\s*:\\s*int\\s*=\\s*10" }, { label: "Параметри повертаються", pattern: "return\\s+\\{[^}]*[\"']skip[\"']\\s*:\\s*skip[^}]*[\"']limit[\"']\\s*:\\s*limit" }], hint: "Аргументи функції, яких немає у шляху, FastAPI читає як query-параметри.", solution: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/items\")\ndef read_items(skip: int = 0, limit: int = 10):\n    return {\"skip\": skip, \"limit\": limit}" },
				{ id: "project", title: "Проєкт: API нотаток", task: "Оголоси модель Note та POST /notes, який приймає модель і повертає її title.", filename: "main.py", starter: "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n# Оголоси Note та POST /notes", checks: [{ label: "Модель наслідує BaseModel", pattern: "class\\s+Note\\s*\\(\\s*BaseModel\\s*\\)" }, { label: "Модель має title: str", pattern: "title\\s*:\\s*str" }, { label: "Є POST-маршрут /notes", pattern: "@app\\.post\\s*\\(\\s*[\"']/notes[\"']\\s*\\)" }, { label: "Відповідь містить title", pattern: "return\\s+\\{[^}]*[\"']title[\"']\\s*:\\s*note\\.title" }], hint: "Pydantic-модель описує форму даних, а FastAPI перевіряє вхідний JSON.", solution: "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Note(BaseModel):\n    title: str\n\n@app.post(\"/notes\")\ndef create_note(note: Note):\n    return {\"title\": note.title}", project: true }
			]
		},
		django: {
			name: "Django", mode: "python", topic: "Бекенд і вебзастосунки", staticChecks: true, lessons: [
				{ id: "hello", title: "Перший Django view", task: "Створи view health, який повертає JSON зі статусом ok, і під'єднай шлях /health/.", filename: "views.py", starter: "from django.http import JsonResponse\nfrom django.urls import path\n\n# Створи view та urlpatterns", checks: [{ label: "Функція health приймає request", pattern: "def\\s+health\\s*\\(\\s*request\\s*\\)" }, { label: "View повертає JsonResponse", pattern: "return\\s+JsonResponse\\s*\\(\\s*\\{[^}]*[\"']status[\"']\\s*:\\s*[\"']ok[\"']" }, { label: "Шлях health під'єднано", pattern: "path\\s*\\(\\s*[\"']health/[\"']\\s*,\\s*health" }], hint: "Django view приймає request, а urls.py зіставляє URL зі view-функцією.", solution: "from django.http import JsonResponse\nfrom django.urls import path\n\ndef health(request):\n    return JsonResponse({\"status\": \"ok\"})\n\nurlpatterns = [path(\"health/\", health)]" },
				{ id: "variables", title: "Параметр у URL", task: "Створи view post_detail і URL-шлях з цілим post_id.", filename: "urls.py", starter: "from django.http import JsonResponse\nfrom django.urls import path\n\n# Додай view post_detail і URL-шлях", checks: [{ label: "View приймає post_id", pattern: "def\\s+post_detail\\s*\\(\\s*request\\s*,\\s*post_id\\s*\\)" }, { label: "Маршрут має цілий параметр", pattern: "path\\s*\\(\\s*[\"']posts/<int:post_id>/[\"']\\s*,\\s*post_detail" }, { label: "View повертає post_id", pattern: "return\\s+JsonResponse\\s*\\(\\s*\\{[^}]*[\"']id[\"']\\s*:\\s*post_id" }], hint: "Конвертер <int:post_id> передає у view ціле число з URL.", solution: "from django.http import JsonResponse\nfrom django.urls import path\n\ndef post_detail(request, post_id):\n    return JsonResponse({\"id\": post_id})\n\nurlpatterns = [path(\"posts/<int:post_id>/\", post_detail)]" },
				{ id: "functions", title: "Модель Django ORM", task: "Оголоси модель Note з текстовим полем title та автоматичною датою створення.", filename: "models.py", starter: "from django.db import models\n\n# Оголоси модель Note", checks: [{ label: "Note є моделлю Django", pattern: "class\\s+Note\\s*\\(\\s*models\\.Model\\s*\\)" }, { label: "title — CharField", pattern: "title\\s*=\\s*models\\.CharField\\s*\\(" }, { label: "Є автоматична дата створення", pattern: "created_at\\s*=\\s*models\\.DateTimeField\\s*\\(\\s*auto_now_add\\s*=\\s*True" }], hint: "Моделі ORM успадковуються від models.Model; міграції перетворюють їх на схему БД.", solution: "from django.db import models\n\nclass Note(models.Model):\n    title = models.CharField(max_length=200)\n    created_at = models.DateTimeField(auto_now_add=True)" },
				{ id: "project", title: "Проєкт: JSON API нотаток", task: "Створи view notes, який повертає список нотаток через JsonResponse з безпечним параметром safe=False, і під'єднай /api/notes/.", filename: "views.py", starter: "from django.http import JsonResponse\nfrom django.urls import path\n\n# Створи view та маршрут", checks: [{ label: "Є view notes", pattern: "def\\s+notes\\s*\\(\\s*request\\s*\\)" }, { label: "Повертається список JSON", pattern: "JsonResponse\\s*\\(\\s*\\[\\s*\\{[^]]*\\}\\s*\\]\\s*,\\s*safe\\s*=\\s*False" }, { label: "Під'єднано /api/notes/", pattern: "path\\s*\\(\\s*[\"']api/notes/[\"']\\s*,\\s*notes" }], hint: "Для JSON-списку передай safe=False; за замовчуванням JsonResponse очікує словник.", solution: "from django.http import JsonResponse\nfrom django.urls import path\n\ndef notes(request):\n    return JsonResponse([{\"title\": \"Перша нотатка\"}], safe=False)\n\nurlpatterns = [path(\"api/notes/\", notes)]", project: true }
			]
		},
		csharp: {
			name: "C#", mode: "text", topic: ".NET і програмування", staticChecks: true, lessons: [
				{ id: "hello", title: "Перший рядок у C#", task: "Виведи Hello, World! у консоль.", filename: "Program.cs", starter: "// Додай Console.WriteLine(...);", checks: [{ label: "Є виклик Console.WriteLine", pattern: "Console\\s*\\.\\s*WriteLine\\s*\\(" }, { label: "Виводиться Hello, World!", pattern: "Console\\s*\\.\\s*WriteLine\\s*\\(\\s*[\"']Hello, World![\"']\\s*\\)" }], hint: "Console.WriteLine друкує рядок і переходить на новий рядок.", solution: "Console.WriteLine(\"Hello, World!\");" },
				{ id: "variables", title: "Змінні та типи", task: "Оголоси рядкову змінну name зі значенням Ada і привітай її.", filename: "Program.cs", starter: "string name = \"Ada\";\n// Виведи привітання", checks: [{ label: "Оголошено рядок name", pattern: "string\\s+name\\s*=\\s*[\"']Ada[\"']" }, { label: "Ім'я використано у виводі", pattern: "Console\\s*\\.\\s*WriteLine\\s*\\([^;]*name" }], hint: "Інтерполяція рядків C# починається з $ перед лапками: $\"Hello, {name}!\".", solution: "string name = \"Ada\";\nConsole.WriteLine($\"Hello, {name}!\");" },
				{ id: "functions", title: "Методи й повернення", task: "Напиши метод Double, який повертає подвоєне число, і виклич його.", filename: "Program.cs", starter: "static int Double(int number)\n{\n    // Поверни number * 2\n}\n\nConsole.WriteLine(Double(6));", checks: [{ label: "Метод приймає int", pattern: "static\\s+int\\s+Double\\s*\\(\\s*int\\s+number\\s*\\)" }, { label: "Метод повертає number * 2", pattern: "return\\s+number\\s*\\*\\s*2\\s*;" }, { label: "Метод викликається", pattern: "Double\\s*\\(\\s*6\\s*\\)" }], hint: "Тип перед назвою методу — це тип значення, яке повертає метод.", solution: "static int Double(int number)\n{\n    return number * 2;\n}\n\nConsole.WriteLine(Double(6));" },
				{ id: "oop", title: "Класи та об'єкти", task: "Створи клас Student з властивістю Name, конструктором і методом Greet().", filename: "Student.cs", checks: [{ label: "Оголошено клас Student", pattern: "class\\s+Student\\b" }, { label: "Є властивість Name", pattern: "string\\s+Name\\s*\\{\\s*get\\s*;\\s*set\\s*;\\s*\\}" }, { label: "Є конструктор Student", pattern: "Student\\s*\\(\\s*string\\s+name\\s*\\)" }, { label: "Є метод Greet", pattern: "string\\s+Greet\\s*\\(" }], starter: "class Student\n{\n    public string Name { get; set; }\n    // Додай конструктор і метод Greet\n}", hint: "Клас описує об'єкти, конструктор ініціалізує Name, а Greet повертає повідомлення.", solution: "class Student\n{\n    public string Name { get; set; }\n\n    public Student(string name)\n    {\n        Name = name;\n    }\n\n    public string Greet()\n    {\n        return $\"Hello, {Name}!\";\n    }\n}\n\nvar student = new Student(\"Ada\");\nConsole.WriteLine(student.Greet());" },
				{ id: "project", title: "Проєкт: парні числа", task: "Перебери числа від 1 до 6 і виведи тільки парні.", filename: "Program.cs", starter: "for (int number = 1; number <= 6; number++)\n{\n    Console.WriteLine(number);\n}", checks: [{ label: "Цикл проходить від 1 до 6", pattern: "for\\s*\\(\\s*int\\s+number\\s*=\\s*1\\s*;\\s*number\\s*<=\\s*6" }, { label: "Перевіряється парність", pattern: "number\\s*%\\s*2\\s*==\\s*0" }, { label: "Вивід у перевірці парності", pattern: "if\\s*\\([^)]*number\\s*%\\s*2\\s*==\\s*0[^)]*\\)\\s*\\{?\\s*Console\\s*\\.\\s*WriteLine\\s*\\(\\s*number\\s*\\)" }], hint: "Залиш Console.WriteLine всередині if з умовою number % 2 == 0.", solution: "for (int number = 1; number <= 6; number++)\n{\n    if (number % 2 == 0)\n    {\n        Console.WriteLine(number);\n    }\n}", project: true }
			]
		},
		go: {
			name: "Go", mode: "text/x-go", topic: "Бекенд і сервери", staticChecks: true, lessons: [
				{ id: "hello", title: "Перша програма на Go", task: "Оголоси package main та виведи Hello, Go! через fmt.Println.", filename: "main.go", starter: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Виведи привітання\n}", checks: [{ label: "Є package main", pattern: "^\\s*package\\s+main\\b" }, { label: "Імпортовано fmt", pattern: "import\\s+(?:\\(\\s*)?[\"']fmt[\"']" }, { label: "Є функція main", pattern: "func\\s+main\\s*\\(" }, { label: "Виводиться Hello, Go!", pattern: "fmt\\.Println\\s*\\(\\s*[\"']Hello, Go![\"']\\s*\\)" }], hint: "Кожна виконувана Go-програма починається з package main та func main().", solution: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}" },
				{ id: "variables", title: "Змінні та виведення типів", task: "Створи змінну name зі значенням Ada через := і виведи привітання fmt.Printf.", filename: "main.go", starter: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    name := \"Ada\"\n    // Виведи Hello, Ada!\n}", checks: [{ label: "name оголошено коротким присвоєнням", pattern: "\\bname\\s*:=\\s*[\"']Ada[\"']" }, { label: "name використано у форматованому виводі", pattern: "fmt\\.Printf\\s*\\(\\s*[\"'][^\"']*%s[^\"']*[\"']\\s*,\\s*name\\s*\\)" }], hint: "Специфікатор %s підставляє рядок у fmt.Printf.", solution: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    name := \"Ada\"\n    fmt.Printf(\"Hello, %s!\\n\", name)\n}" },
				{ id: "functions", title: "Функції та значення", task: "Напиши функцію double, яка приймає int і повертає подвоєне число.", filename: "main.go", starter: "package main\n\nimport \"fmt\"\n\nfunc double(number int) int {\n    return number\n}\n\nfunc main() {\n    fmt.Println(double(6))\n}", checks: [{ label: "Функція приймає int і повертає int", pattern: "func\\s+double\\s*\\(\\s*number\\s+int\\s*\\)\\s+int" }, { label: "Повертається number * 2", pattern: "return\\s+number\\s*\\*\\s*2" }, { label: "Функцію викликано", pattern: "double\\s*\\(\\s*6\\s*\\)" }], hint: "У Go тип повернення пишуть після дужок параметрів.", solution: "package main\n\nimport \"fmt\"\n\nfunc double(number int) int {\n    return number * 2\n}\n\nfunc main() {\n    fmt.Println(double(6))\n}" },
				{ id: "oop", title: "Структури, методи й інтерфейси", task: "Опиши Student через struct, додай метод Greet() і інтерфейс Greeter та виведи Hello, Ada!.", filename: "main.go", starter: "package main\n\nimport \"fmt\"\n\ntype Student struct {\n    name string\n}\n\n// Додай Greeter та метод Greet\n\nfunc main() {\n    var greeter Greeter = Student{name: \"Ada\"}\n    fmt.Println(greeter.Greet())\n}", checks: [{ label: "Student описано структурою", pattern: "type\\s+Student\\s+struct\\s*\\{" }, { label: "Greeter описує метод Greet", pattern: "type\\s+Greeter\\s+interface\\s*\\{[\\s\\S]*?Greet\\s*\\(\\s*\\)\\s+string" }, { label: "Student має метод Greet", pattern: "func\\s*\\(\\s*\\w+\\s+Student\\s*\\)\\s+Greet\\s*\\(\\s*\\)\\s+string" }, { label: "Інтерфейс використовується", pattern: "var\\s+greeter\\s+Greeter\\s*=\\s*Student" }], hint: "У Go об'єктний підхід будують із struct, методів із receiver та інтерфейсів — класів і наслідування немає.", solution: "package main\n\nimport \"fmt\"\n\ntype Student struct {\n    name string\n}\n\ntype Greeter interface {\n    Greet() string\n}\n\nfunc (s Student) Greet() string {\n    return \"Hello, \" + s.name + \"!\"\n}\n\nfunc main() {\n    var greeter Greeter = Student{name: \"Ada\"}\n    fmt.Println(greeter.Greet())\n}" },
				{ id: "project", title: "Проєкт: HTTP health endpoint", task: "Створи HTTP-сервер із маршрутом /health, який відповідає статусом 200 і текстом ok.", filename: "main.go", starter: "package main\n\nimport (\n    \"net/http\"\n)\n\nfunc main() {\n    // Додай обробник і запусти сервер\n}", checks: [{ label: "Імпортовано net/http", pattern: "[\"']net/http[\"']" }, { label: "Додано обробник /health", pattern: "http\\.HandleFunc\\s*\\(\\s*[\"']/health[\"']" }, { label: "Відповідь містить ok", pattern: "Write\\s*\\(\\s*\\[\\]byte\\s*\\(\\s*[\"']ok[\"']\\s*\\)" }, { label: "Сервер слухає порт", pattern: "http\\.ListenAndServe\\s*\\(" }], hint: "http.HandleFunc реєструє обробник, а http.ListenAndServe запускає сервер.", solution: "package main\n\nimport (\n    \"net/http\"\n)\n\nfunc main() {\n    http.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n        w.WriteHeader(http.StatusOK)\n        _, _ = w.Write([]byte(\"ok\"))\n    })\n    http.ListenAndServe(\":8080\", nil)\n}", project: true }
			]
		},
	};

	const teaching = {
		javascript: {
			hello: { explanation: "JavaScript виконує команди по черзі. console.log() показує значення в консолі, тож так зручно перевіряти результат програми.", example: "console.log('Hello, World!');", result: "У консолі з'явиться: Hello, World!" },
			variables: { explanation: "Змінна зберігає значення, щоб ним можна було скористатися пізніше. const підходить для значення, яке не плануємо переприсвоювати; шаблонний рядок вставляє змінні через ${...}.", example: "const name = 'Ada';\nconst age = 30;\nconsole.log(`Hello, ${name}! You are ${age}.`);", result: "У консолі: Hello, Ada! You are 30." },
			functions: { explanation: "Функція об'єднує команди й може приймати параметри. return повертає обчислений результат туди, де функцію викликали.", example: "function double(number) {\n  return number * 2;\n}\n\nconsole.log(double(4));", result: "Виклик double(4) виведе 8." },
			oop: { explanation: "Клас задає спільний опис об'єктів. Конструктор створює їхній початковий стан, а методи працюють із цим станом через this.", example: "class Student {\n  constructor(name) { this.name = name; }\n  greet() { return `Hello, ${this.name}!`; }\n}\n\nconsole.log(new Student('Ada').greet());", result: "Об'єкт Student зберігає ім'я Ada та вітається через метод." },
			project: { explanation: "Цикл проходить числа по одному, а умови вибирають, що вивести. Спершу перевіряємо кратність 3 і 5 разом, і лише потім кожну окремо.", example: "for (let n = 1; n <= 3; n++) {\n  if (n % 3 === 0) console.log('Fizz');\n  else console.log(n);\n}", result: "Результат: 1, 2, Fizz." }
		},
		python: {
			hello: { explanation: "Python виконує команди послідовно. print() виводить текст у консоль; рядок у лапках сприймається як текст, а не як назва змінної.", example: "print('Hello, World!')", result: "У консолі з'явиться: Hello, World!" },
			variables: { explanation: "Знак = присвоює значення змінній. f-рядок дає змогу підставляти змінні всередину тексту, записуючи їхні назви у фігурних дужках.", example: "name = 'Ada'\nage = 30\nprint(f'Hello, {name}! You are {age}.')", result: "У консолі: Hello, Ada! You are 30." },
			functions: { explanation: "def створює функцію, а відступи показують, які команди до неї належать. return повертає результат і завершує роботу функції.", example: "def double(number):\n    return number * 2\n\nprint(double(4))", result: "Виклик double(4) виведе 8." },
			oop: { explanation: "Клас описує дані й поведінку об'єктів. Метод __init__ запускається під час створення, а self посилається на конкретний об'єкт.", example: "class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f'Hello, {self.name}!'\n\nprint(Student('Ada').greet())", result: "Об'єкт Student зберігає ім'я Ada та повертає привітання." },
			project: { explanation: "for бере кожен елемент списку по черзі. Оператор % повертає остачу від ділення; у парного числа вона дорівнює нулю.", example: "for number in [1, 2, 3, 4]:\n    if number % 2 == 0:\n        print(number)", result: "У консолі з'являться 2 і 4." }
		},
		typescript: {
			hello: { explanation: "TypeScript-код компілюється у JavaScript перед запуском. Команда console.log() працює так само й показує результат у консолі.", example: "console.log('Hello, World!');", result: "Після компіляції в консолі з'явиться Hello, World!." },
			variables: { explanation: "Анотація : string явно вказує, що змінна містить текст. Типи допомагають помітити несумісні значення під час написання коду.", example: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);", result: "У консолі: Hello, Ada!" },
			functions: { explanation: "Типи параметрів стоять біля їхніх назв, а тип після дужок задає тип результату. Тут функція приймає число й повертає число.", example: "function double(number: number): number {\n  return number * 2;\n}\n\nconsole.log(double(4));", result: "Виклик double(4) виведе 8." },
			oop: { explanation: "TypeScript додає до класів JavaScript явні типи властивостей і результатів. Конструктор створює екземпляр, метод описує його поведінку.", example: "class Student {\n  constructor(public name: string) {}\n  greet(): string { return `Hello, ${this.name}!`; }\n}\n\nconsole.log(new Student('Ada').greet());", result: "Властивість name має тип string, а greet повертає string." },
			project: { explanation: "Тип number[] означає список чисел. Цикл for...of бере кожен елемент, а умова % 2 === 0 залишає парні числа.", example: "const numbers: number[] = [1, 2, 3, 4];\nfor (const n of numbers) {\n  if (n % 2 === 0) console.log(n);\n}", result: "У консолі з'являться 2 і 4." }
		},
		sql: {
			hello: { explanation: "SQL-запит описує, які дані потрібно отримати. SELECT може повернути навіть буквальне значення, а AS задає назву стовпця у результаті.", example: "SELECT 'Hello, World!' AS greeting;", result: "Таблиця матиме стовпець greeting зі значенням Hello, World!." },
			variables: { explanation: "WHERE відбирає рядки за умовою. ORDER BY сортує вже відібрані результати, тут — за іменем від А до Я.", example: "WITH learners(name, level) AS (\n  VALUES ('Ada', 'beginner'), ('Grace', 'advanced'), ('Linus', 'beginner')\n)\nSELECT name, level\nFROM learners\nWHERE level = 'beginner'\nORDER BY name;", result: "Побачиш лише рядки початківців у відсортованому порядку." },
			functions: { explanation: "ORDER BY ... DESC ставить найбільше значення першим. LIMIT 1 залишає тільки цей рядок.", example: "WITH visits(day, total) AS (\n  VALUES ('Monday', 8), ('Tuesday', 5), ('Wednesday', 11)\n)\nSELECT day, total\nFROM visits\nORDER BY total DESC\nLIMIT 1;", result: "Результат міститиме день із найбільшим total." },
			project: { explanation: "GROUP BY об'єднує рядки з однаковою мовою, а COUNT(*) рахує рядки в кожній групі. ORDER BY задає зручний порядок звіту.", example: "WITH enrollments(language, learner) AS (\n  VALUES ('Python', 'Ada'), ('Python', 'Linus'), ('JavaScript', 'Grace')\n)\nSELECT language, COUNT(*) AS learners\nFROM enrollments\nGROUP BY language\nORDER BY language;", result: "Отримаєш по одному рядку з кількістю учнів для кожної мови." }
		},
		html: {
			hello: { explanation: "HTML описує структуру сторінки за допомогою тегів. Відкривальний і закривальний <h1> позначають головний заголовок.", example: "<main>\n  <h1>Hello, World!</h1>\n</main>", result: "У попередньому перегляді з'явиться великий заголовок." },
			variables: { explanation: "<p> позначає абзац, а <a> створює посилання. Атрибут href задає адресу переходу, текст між тегами стає клікабельним.", example: "<p>Вчуся створювати веб.</p>\n<a href=\"https://developer.mozilla.org\">Довідник MDN</a>", result: "На сторінці буде абзац і посилання на довідник." },
			functions: { explanation: "<ul> створює список без нумерації, а кожен <li> — окремий пункт. Така структура зрозуміла і браузеру, і допоміжним технологіям.", example: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>", result: "У попередньому перегляді буде список із двох пунктів." },
			project: { explanation: "Семантичний <article> описує самостійний матеріал. Заголовок, абзац і посилання всередині складаються у просту картку профілю.", example: "<article class=\"profile\">\n  <h1>Майбутній розробник</h1>\n  <p>Створюю свої перші сторінки.</p>\n</article>", result: "Це основа профільної картки; завдання додасть до неї посилання." }
		},
		css: {
			hello: { explanation: "CSS-правило складається із селектора й оголошень. Селектор h1 знаходить заголовки, а color задає колір їхнього тексту.", example: "h1 {\n  color: #244b34;\n}", result: "Заголовок у прикладі стане темно-зеленим." },
			variables: { explanation: "Класовий селектор починається з крапки. padding створює внутрішній простір між вмістом елемента та його краєм.", example: ".card {\n  padding: 24px;\n  border-radius: 8px;\n}", result: "Вміст картки матиме відступ 24 пікселі від краю." },
			functions: { explanation: "display: grid вмикає CSS Grid для контейнера. gap задає проміжки між його дочірніми елементами.", example: ".cards {\n  display: grid;\n  gap: 16px;\n}", result: "Елементи .cards можна буде розкласти по сітці з проміжком 16 пікселів." },
			project: { explanation: "Кілька CSS-властивостей разом формують вигляд компонента: колір тексту, фон, внутрішній відступ і заокруглення кутів.", example: ".profile {\n  color: #244b34;\n  background-color: #eaf1e4;\n  padding: 24px;\n  border-radius: 12px;\n}", result: "Такі стилі створюють світлу картку з відступами й округленими кутами." }
		},
		fastapi: {
			hello: { explanation: "FastAPI — Python-фреймворк для HTTP API. Декоратор @app.get пов'язує функцію з GET-запитом, а словник повертається як JSON.", example: "@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello\"}", result: "GET / повертає JSON-відповідь." },
			variables: { explanation: "Параметри в дужках маршруту є параметрами шляху. Анотація int допомагає FastAPI перевірити та перетворити значення.", example: "@app.get(\"/items/{item_id}\")\ndef read_item(item_id: int):\n    return {\"item_id\": item_id}", result: "Запит /items/5 дасть item_id зі значенням 5." },
			functions: { explanation: "Аргументи функції, яких немає в URL-шляху, FastAPI читає з query-параметрів. Значення за замовчуванням робить їх необов'язковими.", example: "@app.get(\"/items\")\ndef read_items(skip: int = 0, limit: int = 10):\n    return {\"skip\": skip, \"limit\": limit}", result: "Запит /items?skip=10&limit=5 передає параметри функції." },
			project: { explanation: "Pydantic-модель описує тіло запиту. FastAPI валідує JSON і передає його функції як об'єкт Note.", example: "class Note(BaseModel):\n    title: str\n\n@app.post(\"/notes\")\ndef create_note(note: Note):\n    return {\"title\": note.title}", result: "POST /notes приймає та повертає дані нотатки." }
		},
		django: {
			hello: { explanation: "Django view обробляє HTTP-запит, а URLconf зіставляє адресу з функцією. JsonResponse перетворює словник на JSON.", example: "def health(request):\n    return JsonResponse({\"status\": \"ok\"})\n\nurlpatterns = [path(\"health/\", health)]", result: "GET /health/ повертає JSON зі статусом ok." },
			variables: { explanation: "Конвертер <int:post_id> витягає ціле число з URL та передає його view як аргумент.", example: "def post_detail(request, post_id):\n    return JsonResponse({\"id\": post_id})\n\npath(\"posts/<int:post_id>/\", post_detail)", result: "Запит /posts/7/ передає view число 7." },
			functions: { explanation: "Django ORM описує таблицю класом-моделлю. Поля моделі визначають типи даних, а міграції застосовують схему до бази.", example: "class Note(models.Model):\n    title = models.CharField(max_length=200)\n    created_at = models.DateTimeField(auto_now_add=True)", result: "Модель Note має заголовок і час створення." },
			project: { explanation: "JsonResponse за замовчуванням очікує словник. Для серіалізації списку потрібно явно передати safe=False.", example: "def notes(request):\n    return JsonResponse([{\"title\": \"Нотатка\"}], safe=False)", result: "API повертає JSON-масив нотаток." }
		},
		csharp: {
			hello: { explanation: "Console.WriteLine виводить текст у термінал і завершує рядок. Це поширена перша команда в C#.", example: "Console.WriteLine(\"Hello, World!\");", result: "У консолі з'явиться Hello, World!." },
			variables: { explanation: "Тип string означає текст. Інтерполяція рядків вставляє значення змінної у текст за допомогою префікса $.", example: "string name = \"Ada\";\nConsole.WriteLine($\"Hello, {name}!\");", result: "У консолі: Hello, Ada!" },
			functions: { explanation: "Метод об'єднує дії. Тип int перед назвою задає тип результату, а return повертає значення виклику.", example: "static int Double(int number)\n{\n    return number * 2;\n}", result: "Double(6) повертає 12." },
			oop: { explanation: "Клас описує об'єкти та їхні властивості. Конструктор присвоює початкові значення, а метод може повертати результат для конкретного екземпляра.", example: "class Student\n{\n    public string Name { get; set; }\n    public Student(string name) { Name = name; }\n    public string Greet() => $\"Hello, {Name}!\";\n}", result: "Student(\"Ada\") створює об'єкт, а Greet() повертає привітання." },
			project: { explanation: "Цикл for перебирає числа, а умова остачі від ділення залишає парні значення.", example: "for (int number = 1; number <= 6; number++)\n{\n    if (number % 2 == 0) Console.WriteLine(number);\n}", result: "У консолі з'являться 2, 4 і 6." }
		},
		go: {
			hello: { explanation: "Go-програма виконується з package main та функції main. Пакет fmt містить засоби форматованого введення й виведення.", example: "package main\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}", result: "Програма виведе Hello, Go!." },
			variables: { explanation: "Оператор := оголошує змінну й дозволяє компілятору вивести її тип. fmt.Printf форматує текст за допомогою %s для рядків.", example: "name := \"Ada\"\nfmt.Printf(\"Hello, %s!\\n\", name)", result: "У консолі: Hello, Ada!" },
			functions: { explanation: "Тип результату функції в Go пишуть після списку параметрів. return повертає значення з відповідним типом.", example: "func double(number int) int {\n    return number * 2\n}", result: "Виклик double(6) повертає 12." },
			oop: { explanation: "У Go немає класів і наслідування, але об'єктний підхід можна будувати композицією: struct зберігає стан, метод має receiver, а interface описує поведінку.", example: "type Greeter interface { Greet() string }\ntype Student struct { name string }\nfunc (s Student) Greet() string { return \"Hello, \" + s.name + \"!\" }", result: "Student задовольняє Greeter, бо має метод Greet із потрібною сигнатурою." },
			project: { explanation: "Пакет net/http надає готовий HTTP-сервер. HandleFunc призначає обробник маршруту, ListenAndServe запускає сервер.", example: "http.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(http.StatusOK)\n    _, _ = w.Write([]byte(\"ok\"))\n})\nhttp.ListenAndServe(\":8080\", nil)", result: "GET /health відповідає статусом 200 і текстом ok." }
		},
	};

	const stateKey = "feler-curriculum-v1";
	const draftKey = "feler-route-drafts-v1";
	const profileKey = "feler-profile-v1";
	const profileCharacterTemplate = document.querySelector("#profileCharacterTemplate");
	const routeContinuations = { fastapi: "django" };
	const accountDialog = document.querySelector("#accountDialog");
	const accountButton = document.querySelector("#accountButton");
	const accountStatus = document.querySelector("#accountStatus");
	const accountDisplayName = document.querySelector("#accountDisplayName");
	const accountEmail = document.querySelector("#accountEmail");
	const accountPassword = document.querySelector("#accountPassword");
	const accountSignIn = document.querySelector("#accountSignIn");
	const accountSignUp = document.querySelector("#accountSignUp");
	const accountResend = document.querySelector("#accountResend");
	const accountSignOut = document.querySelector("#accountSignOut");
	const supabaseConfig = window.FELER_SUPABASE_CONFIG;
	let supabaseClient = null;
	let supabaseConfigError = "";
	if (supabaseConfig?.url && supabaseConfig?.anonKey) {
		try {
			if (!window.supabase?.createClient) throw new Error("Бібліотека Supabase не завантажилася.");
			supabaseClient = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
		} catch (error) {
			supabaseConfigError = error.message || "Перевір URL і anon key у supabase-config.js.";
		}
	}
	const languageGate = document.querySelector("#languageGate");
	const trackCards = [...document.querySelectorAll("[data-track-choice]")];
	const sandboxLanguage = document.querySelector("#sandboxLanguage");
	const sandboxEditor = document.querySelector("#sandboxEditor");
	const sandboxPreview = document.querySelector("#sandboxPreview");
	const sandboxConsole = document.querySelector("#sandboxConsole");
	const runButton = document.querySelector("#runSandbox");
	const feedback = document.querySelector("#feedback");
	const checkResults = document.querySelector("#checkResults");
	const solutionButton = document.querySelector("#showSolution");
	const hintButton = document.querySelector("#showHint");
	const solutionPanel = document.querySelector("#lessonSolution");
	const hintPanel = document.querySelector("#lessonHint");
	const challengeCopy = document.querySelector(".challenge-copy");
	const quizQuestion = document.querySelector("#quizQuestion");
	const quizOptions = document.querySelector("#quizOptions");
	const quizFeedback = document.querySelector("#quizFeedback");
	const achievementList = document.querySelector("#achievementList");
	const importProgressFile = document.querySelector("#importProgressFile");
	const pendingRuns = new Map();
	let currentUser = null;
	let cloudSyncTimer;
	let cloudSyncQueue = Promise.resolve();
	let state = readState();
	let profile = readProfile();
	let activeTrack = "";
	let activeIndex = 0;
	let codeMirror;
	let typescriptPromise;
	let sqlPromise;
	let attempted = false;

	function scopedStorageKey(key) {
		return currentUser ? `${key}:${currentUser.id}` : key;
	}

	function normalizeState(saved) {
		const completed = {};
		const quizDone = {};
		for (const [trackId, track] of Object.entries(tracks)) {
			completed[trackId] = Array.isArray(saved?.completed?.[trackId])
				? [...new Set(saved.completed[trackId].filter(id => track.lessons.some(lesson => lesson.id === id)))]
				: [];
			quizDone[trackId] = Array.isArray(saved?.quizDone?.[trackId])
				? [...new Set(saved.quizDone[trackId].filter(id => completed[trackId].includes(id)))]
				: [...completed[trackId]];
		}
		return {
			selected: tracks[saved?.selected] ? saved.selected : "",
			completed,
			quizDone,
			lastIndex: saved?.lastIndex && typeof saved.lastIndex === "object" && !Array.isArray(saved.lastIndex) ? saved.lastIndex : {}
		};
	}

	function readState() {
		try {
			return normalizeState(JSON.parse(localStorage.getItem(scopedStorageKey(stateKey)) || "{}"));
		} catch {
			return normalizeState({});
		}
	}

	const profileCharacterColors = {
		skin: { light: "#f4c8a9", medium: "#c98762", deep: "#83543f" },
		hairColor: { brown: "#49322b", black: "#27242b", blonde: "#d8a43b", blue: "#47699d" },
		outfit: { green: "#78a858", blue: "#4f79b2", violet: "#8768b2", coral: "#d96d62" }
	};

	function normalizeCharacter(saved) {
		const character = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
		return {
			skin: ["light", "medium", "deep"].includes(character.skin) ? character.skin : "light",
			hair: ["short", "curly", "long"].includes(character.hair) ? character.hair : "short",
			hairColor: ["brown", "black", "blonde", "blue"].includes(character.hairColor) ? character.hairColor : "brown",
			outfit: ["green", "blue", "violet", "coral"].includes(character.outfit) ? character.outfit : "green",
			accessory: ["none", "glasses", "headphones"].includes(character.accessory) ? character.accessory : "none"
		};
	}

	function readCharacterForm() {
		return normalizeCharacter({
			skin: document.querySelector("#characterSkin").value,
			hair: document.querySelector("#characterHair").value,
			hairColor: document.querySelector("#characterHairColor").value,
			outfit: document.querySelector("#characterOutfit").value,
			accessory: document.querySelector("#characterAccessory").value
		});
	}

	function renderCharacter(container, character) {
		const svg = profileCharacterTemplate.content.firstElementChild.cloneNode(true);
		svg.dataset.hair = character.hair;
		svg.dataset.accessory = character.accessory;
		svg.style.setProperty("--character-skin", profileCharacterColors.skin[character.skin]);
		svg.style.setProperty("--character-hair", profileCharacterColors.hairColor[character.hairColor]);
		svg.style.setProperty("--character-outfit", profileCharacterColors.outfit[character.outfit]);
		container.replaceChildren(svg);
	}

	function renderCharacterPreview() {
		renderCharacter(document.querySelector("#profileModalAvatar"), readCharacterForm());
	}

	function normalizeProfile(saved = {}) {
		return {
			name: typeof saved.name === "string" ? saved.name.trim().slice(0, 40) : "",
			avatar: typeof saved.avatar === "string" && saved.avatar.length <= 4 ? saved.avatar : "👩‍💻",
			character: normalizeCharacter(saved.character),
			goal: ["web", "backend", "data"].includes(saved.goal) ? saved.goal : "web",
			minutes: [10, 20, 30].includes(Number(saved.minutes)) ? Number(saved.minutes) : 10,
			darkMode: saved.darkMode === true
		};
	}

	function readProfile() {
		try {
			return normalizeProfile(JSON.parse(localStorage.getItem(profileKey) || "{}"));
		} catch {
			return normalizeProfile();
		}
	}

	function saveState() {
		try { localStorage.setItem(scopedStorageKey(stateKey), JSON.stringify(state)); } catch { }
		scheduleCloudSync();
	}

	function readDrafts() {
		try {
			const saved = JSON.parse(localStorage.getItem(scopedStorageKey(draftKey)) || "{}");
			return normalizeRouteDrafts(saved);
		} catch {
			return {};
		}
	}

	const routeDrafts = readDrafts();

	function normalizeRouteDrafts(drafts) {
		if (!drafts || typeof drafts !== "object" || Array.isArray(drafts)) return {};
		return Object.fromEntries(Object.entries(drafts).filter(([key, code]) => {
			const separator = key.indexOf(":");
			const trackId = key.slice(0, separator);
			const lessonId = key.slice(separator + 1);
			return separator > 0 && tracks[trackId]?.lessons.some(lesson => lesson.id === lessonId) &&
				typeof code === "string" && code.length <= 100000;
		}));
	}

	function setAccountStatus(message, isError = false) {
		accountStatus.textContent = message;
		accountStatus.classList.toggle("is-error", isError);
	}

	function renderStudyPlan() {
		const goal = profile.goal;
		const route = goal === "backend" ? "python" : goal === "data" ? "python" : "html";
		const descriptionKey = goal === "backend" ? "planBackend" : goal === "data" ? "planData" : "planWeb";
		document.querySelector("#studyGoal").value = goal;
		document.querySelector("#studyPlanDescription").textContent = window.FelerI18n.t(descriptionKey, { minutes: profile.minutes });
		document.querySelector("#startStudyPlan").dataset.track = route;
	}

	function renderProfileStats() {
		const completedCount = Object.values(state.completed).reduce((total, items) => total + items.length, 0);
		const completedTracks = Object.keys(tracks).filter(trackId => {
			const done = completedLessons(trackId);
			const quizzes = state.quizDone[trackId] || [];
			return done.length === tracks[trackId].lessons.length && tracks[trackId].lessons.every(lesson => quizzes.includes(lesson.id));
		}).length;
		document.querySelector("#profileLessonsCount").textContent = String(completedCount);
		document.querySelector("#profileTracksCount").textContent = String(completedTracks);
		document.querySelector("#profileStreakCount").textContent = document.querySelector("#streakCount").textContent || "0";
	}

	function applyProfileUI() {
		const displayName = profile.name || currentUser?.user_metadata?.display_name || currentUser?.email || window.FelerI18n.t("profileDefaultName");
		document.documentElement.dataset.theme = profile.darkMode ? "dark" : "light";
		document.querySelector("#sidebarDisplayName").textContent = displayName;
		renderCharacter(document.querySelector("#profileAvatar"), profile.character);
		renderCharacter(document.querySelector("#profileModalAvatar"), profile.character);
		document.querySelector("#profileModalName").textContent = displayName;
		document.querySelector("#profileEmail").textContent = currentUser?.email || window.FelerI18n.t("profileGuestAccount");
		document.querySelector("#openAccountFromProfile").textContent = window.FelerI18n.t(currentUser ? "manageAccount" : "openAccount");
		document.querySelector("#sidebarAccountLabel").textContent = window.FelerI18n.t(currentUser ? "syncedProgress" : "guestProgress");
		if (!activeTrack) {
			const goalName = profile.goal === "backend" ? "profileGoalBackend" : profile.goal === "data" ? "profileGoalData" : "profileGoalWeb";
			document.querySelector(".goal-row span:first-child").textContent = window.FelerI18n.t(goalName);
		}
		document.querySelector("#profileName").value = profile.name || currentUser?.user_metadata?.display_name || "";
		document.querySelector("#characterSkin").value = profile.character.skin;
		document.querySelector("#characterHair").value = profile.character.hair;
		document.querySelector("#characterHairColor").value = profile.character.hairColor;
		document.querySelector("#characterOutfit").value = profile.character.outfit;
		document.querySelector("#characterAccessory").value = profile.character.accessory;
		document.querySelector("#profileGoal").value = profile.goal;
		document.querySelector("#profileMinutes").value = String(profile.minutes);
		document.querySelector("#profileDarkMode").checked = profile.darkMode;
		renderProfileStats();
		renderStudyPlan();
	}

	async function saveProfilePreferences() {
		const nextProfile = normalizeProfile({
			name: document.querySelector("#profileName").value.trim().slice(0, 40),
			avatar: profile.avatar,
			character: readCharacterForm(),
			goal: ["web", "backend", "data"].includes(document.querySelector("#profileGoal").value) ? document.querySelector("#profileGoal").value : "web",
			minutes: [10, 20, 30].includes(Number(document.querySelector("#profileMinutes").value)) ? Number(document.querySelector("#profileMinutes").value) : 10,
			darkMode: document.querySelector("#profileDarkMode").checked
		});
		const status = document.querySelector("#profileStatus");
		const saveButton = document.querySelector("#saveProfile");
		saveButton.disabled = true;
		try {
			if (currentUser) {
				const userId = currentUser.id;
				const { data, error } = await supabaseClient.auth.updateUser({
					data: { display_name: nextProfile.name, feler_profile: nextProfile }
				});
				if (error) throw error;
				if (!data.user || currentUser?.id !== userId) throw new Error("Сеанс акаунта змінився. Увійди знову й повтори спробу.");
				currentUser = data.user;
				profile = normalizeProfile(data.user.user_metadata?.feler_profile || nextProfile);
				updateAccountUI(data.user);
			} else {
				localStorage.setItem(profileKey, JSON.stringify(nextProfile));
				profile = nextProfile;
			}
			applyProfileUI();
			status.textContent = window.FelerI18n.t(currentUser ? "profileSavedAccount" : "profileSavedGuest");
			status.classList.remove("is-error");
			return true;
		} catch (error) {
			status.textContent = window.FelerI18n.t(currentUser ? "profileSaveError" : "profileStorageError", { message: error.message });
			status.classList.add("is-error");
			return false;
		} finally {
			saveButton.disabled = false;
		}
	}

	function updateAccountUI(user = currentUser) {
		const name = user?.user_metadata?.display_name || user?.email || "";
		accountButton.textContent = user ? name : window.FelerI18n.t("openAccount");
		accountDisplayName.value = name;
		accountDisplayName.readOnly = Boolean(user);
		accountEmail.value = user?.email || "";
		accountEmail.readOnly = Boolean(user);
		accountPassword.value = "";
		accountPassword.disabled = Boolean(user);
		accountSignIn.hidden = Boolean(user);
		accountSignUp.hidden = Boolean(user);
		accountResend.hidden = !supabaseClient || Boolean(user);
		accountSignOut.hidden = !user;
		accountSignIn.disabled = !supabaseClient || Boolean(user);
		accountSignUp.disabled = !supabaseClient || Boolean(user);
		accountSignOut.disabled = !supabaseClient || !user;
		applyProfileUI();
	}

	function replaceRouteDrafts(drafts) {
		for (const key of Object.keys(routeDrafts)) delete routeDrafts[key];
		Object.assign(routeDrafts, normalizeRouteDrafts(drafts));
	}

	function mergeAccountState(local, remote) {
		const merged = normalizeState(remote);
		for (const [trackId, track] of Object.entries(tracks)) {
			merged.completed[trackId] = [...new Set([...merged.completed[trackId], ...local.completed[trackId]])];
			merged.quizDone[trackId] = [...new Set([...merged.quizDone[trackId], ...local.quizDone[trackId]])]
				.filter(id => merged.completed[trackId].includes(id));
			if (Number.isInteger(local.lastIndex[trackId])) merged.lastIndex[trackId] = local.lastIndex[trackId];
		}
		merged.selected = local.selected || merged.selected;
		return merged;
	}

	function scheduleCloudSync() {
		if (!supabaseClient || !currentUser) return;
		window.clearTimeout(cloudSyncTimer);
		cloudSyncTimer = window.setTimeout(() => {
			cloudSyncQueue = cloudSyncQueue.then(async () => {
				if (!currentUser) return;
				const userId = currentUser.id;
				const payload = { state, drafts: routeDrafts };
				const { error } = await supabaseClient
					.from("user_progress")
					.upsert({ user_id: userId, payload, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
				if (error) throw error;
				if (currentUser?.id === userId) setAccountStatus("Прогрес збережено в акаунті.");
			}).catch(error => {
				setAccountStatus(`Не вдалося синхронізувати прогрес: ${error.message}`, true);
			});
		}, 700);
	}

	async function loadAccountProgress(user) {
		currentUser = user;
		const savedProfile = user.user_metadata?.feler_profile;
		profile = normalizeProfile({
			...(savedProfile && typeof savedProfile === "object" && !Array.isArray(savedProfile) ? savedProfile : {}),
			name: savedProfile?.name || user.user_metadata?.display_name || ""
		});
		state = readState();
		replaceRouteDrafts(readDrafts());
		updateAccountUI(user);
		setAccountStatus("Завантажую прогрес акаунта…");
		const { data, error } = await supabaseClient
			.from("user_progress")
			.select("payload")
			.eq("user_id", user.id)
			.maybeSingle();
		if (error) {
			setAccountStatus(`Не вдалося завантажити прогрес: ${error.message}`, true);
			return;
		}
		if (currentUser?.id !== user.id) return;
		if (data?.payload && typeof data.payload === "object") {
			const localState = state;
			const localDrafts = { ...routeDrafts };
			state = mergeAccountState(localState, data.payload.state || {});
			const remoteDrafts = normalizeRouteDrafts(data.payload.drafts);
			replaceRouteDrafts({ ...remoteDrafts, ...localDrafts });
			saveState();
			try { localStorage.setItem(scopedStorageKey(draftKey), JSON.stringify(routeDrafts)); } catch { }
			renderAchievements();
			setAccountStatus("Прогрес акаунта завантажено.");
			scheduleCloudSync();
			return;
		}
		setAccountStatus("Акаунт готовий. Прогрес цього акаунта зберігатиметься окремо від гостьового.");
		scheduleCloudSync();
	}

	async function handleAuthSession(session) {
		const user = session?.user || null;
		if (user?.id === currentUser?.id) return;
		window.clearTimeout(cloudSyncTimer);
		if (user) {
			await loadAccountProgress(user);
			return;
		}
		if (!currentUser) return;
		currentUser = null;
		profile = readProfile();
		state = readState();
		replaceRouteDrafts(readDrafts());
		activeTrack = "";
		updateAccountUI(null);
		renderAchievements();
		showLanguageGate();
		setAccountStatus("Ви вийшли. Гостьовий прогрес залишився на цьому пристрої.");
	}

	function validateAccountForm(requireDisplayName = false) {
		if (!accountEmail.reportValidity() || !accountPassword.reportValidity()) return false;
		if (requireDisplayName && !accountDisplayName.value.trim()) {
			accountDisplayName.setCustomValidity("Вкажи ім’я для профілю.");
			accountDisplayName.reportValidity();
			accountDisplayName.setCustomValidity("");
			return false;
		}
		return true;
	}

	function getEmailRedirectUrl() {
		const redirectUrl = new URL(window.location.href);
		const hostname = redirectUrl.hostname.toLowerCase();
		const localHost = hostname === "localhost" || hostname.endsWith(".localhost") ||
			hostname === "0.0.0.0" || hostname.startsWith("127.") ||
			hostname === "[::1]" || hostname === "::1";
		if (!["http:", "https:"].includes(redirectUrl.protocol) || localHost) return "";
		redirectUrl.search = "";
		redirectUrl.hash = "";
		return redirectUrl.href;
	}

	function getEmailRedirectOptions() {
		const emailRedirectTo = getEmailRedirectUrl();
		return emailRedirectTo ? { emailRedirectTo } : {};
	}

	async function signIn() {
		if (!supabaseClient || !validateAccountForm()) return;
		accountSignIn.disabled = true;
		setAccountStatus("Виконую вхід…");
		try {
			const { error } = await supabaseClient.auth.signInWithPassword({
				email: accountEmail.value.trim(),
				password: accountPassword.value
			});
			if (error?.message === "Invalid login credentials") {
				setAccountStatus("Email або пароль неправильні. Якщо ти щойно реєструвався, надішли лист підтвердження ще раз і перевір папки «Спам» та «Промоакції».", true);
			} else if (error) setAccountStatus(`Не вдалося увійти: ${error.message}`, true);
			else accountPassword.value = "";
		} catch (error) {
			setAccountStatus(`Не вдалося увійти: ${error.message}`, true);
		} finally {
			accountSignIn.disabled = false;
		}
	}

	async function signUp() {
		if (!supabaseClient || !validateAccountForm(true)) return;
		accountSignUp.disabled = true;
		setAccountStatus("Створюю акаунт…");
		try {
			const initialProfile = normalizeProfile({ ...profile, name: accountDisplayName.value.trim() });
			const { data, error } = await supabaseClient.auth.signUp({
				email: accountEmail.value.trim(),
				password: accountPassword.value,
				options: {
					data: { display_name: initialProfile.name, feler_profile: initialProfile },
					...getEmailRedirectOptions()
				}
			});
			if (error) {
				setAccountStatus(`Не вдалося створити акаунт: ${error.message}`, true);
				return;
			}
			accountPassword.value = "";
			if (data.session) setAccountStatus("Акаунт створено. Тепер прогрес синхронізується.");
			else setAccountStatus("Запит прийнято. Перевір пошту та папки «Спам» і «Промоакції». Якщо листа немає, скористайся кнопкою повторного надсилання нижче.");
		} catch (error) {
			setAccountStatus(`Не вдалося створити акаунт: ${error.message}`, true);
		} finally {
			accountSignUp.disabled = false;
		}
	}

	async function resendConfirmation() {
		if (!supabaseClient || !accountEmail.reportValidity()) return;
		accountResend.disabled = true;
		setAccountStatus("Надсилаю лист підтвердження…");
		try {
			const { error } = await supabaseClient.auth.resend({
				type: "signup",
				email: accountEmail.value.trim(),
				options: getEmailRedirectOptions()
			});
			if (error) setAccountStatus(`Не вдалося надіслати лист: ${error.message}`, true);
			else setAccountStatus("Запит прийнято. Перевір пошту та папки «Спам» і «Промоакції». Якщо листа немає, перевір SMTP у налаштуваннях Supabase.");
		} catch (error) {
			setAccountStatus(`Не вдалося надіслати лист: ${error.message}`, true);
		} finally {
			accountResend.disabled = false;
		}
	}

	function saveDraft(code) {
		if (!activeTrack) return;
		const lesson = tracks[activeTrack].lessons[activeIndex];
		routeDrafts[`${activeTrack}:${lesson.id}`] = code;
		try { localStorage.setItem(scopedStorageKey(draftKey), JSON.stringify(routeDrafts)); } catch { }
		scheduleCloudSync();
	}

	function setCode(code) {
		sandboxEditor.value = code;
		if (codeMirror && codeMirror.getValue() !== code) codeMirror.setValue(code);
		updateSandboxLineNumbers();
	}

	function getCode() {
		return codeMirror ? codeMirror.getValue() : sandboxEditor.value;
	}

	function setMode(mode) {
		if (codeMirror) codeMirror.setOption("mode", mode);
	}

	function completedLessons(trackId = activeTrack) {
		const validIds = tracks[trackId].lessons.map(lesson => lesson.id);
		if (!Array.isArray(state.completed[trackId])) state.completed[trackId] = [];
		state.completed[trackId] = state.completed[trackId].filter(id => validIds.includes(id));
		return state.completed[trackId];
	}

	function quizForLesson(lesson) {
		const routeQuizzes = {
			django: {
				hello: { question: "Що з'єднує URL зі сторінкою в Django?", options: ["URLconf і view", "Міграція і модель", "CSS і шаблон"], answer: 0 },
				variables: { question: "Який тип даних передає конвертер <int:post_id>?", options: ["Рядок", "Ціле число", "JSON-файл"], answer: 1 },
				functions: { question: "Що описує клас models.Model?", options: ["Таблицю та її поля", "Маршрут URL", "HTTP-заголовок"], answer: 0 },
				project: { question: "Що потрібно JsonResponse для серіалізації списку?", options: ["safe=False", "GET=True", "model=None"], answer: 0 }
			},
			go: {
				hello: { question: "Звідки починається виконання Go-програми?", options: ["func main у package main", "Клас MainWindow", "Файл README"], answer: 0 },
				variables: { question: "Що робить оператор := у Go?", options: ["Оголошує змінну з виведенням типу", "Порівнює два числа", "Запускає HTTP-сервер"], answer: 0 },
				functions: { question: "Де в Go вказують тип результату функції?", options: ["Після параметрів", "Перед назвою пакета", "У коментарі"], answer: 0 },
				oop: { question: "Які засоби Go використовує для об'єктного підходу?", options: ["struct, методи та інтерфейси", "Класи й наслідування", "Тільки глобальні змінні"], answer: 0 },
				project: { question: "Який пакет містить базовий HTTP-сервер Go?", options: ["net/http", "fmt/html", "go/server"], answer: 0 }
			}
		};
		if (routeQuizzes[activeTrack]) return routeQuizzes[activeTrack][lesson.id];
		const quizzes = {
			hello: { question: "Яка мета цього першого завдання?", options: ["Побачити простий і зрозумілий результат", "Додати складну залежність", "Зберегти пароль у коді"], answer: 0 },
			variables: { question: "Як найкраще називати змінні та поля?", options: ["Випадковими літерами", "Так, щоб назва пояснювала значення", "Однаково для всіх даних"], answer: 1 },
			functions: { question: "Навіщо функція повертає результат?", options: ["Щоб його можна було використати після виклику", "Щоб зупинити редактор", "Щоб автоматично створити файл"], answer: 0 },
			oop: { question: "Що описує клас у об'єктно-орієнтованому програмуванні?", options: ["Спільні дані та поведінку об'єктів", "Лише порядок виконання рядків", "Тільки зовнішній вигляд сторінки"], answer: 0 },
			project: { question: "Що важливо перед завершенням мініпроєкту?", options: ["Перевірити всі вимоги завдання", "Сховати помилки", "Видалити назви змінних"], answer: 0 }
		};
		return quizzes[lesson.id];
	}

	function renderQuiz(lesson) {
		const quiz = quizForLesson(lesson);
		const passed = state.quizDone[activeTrack]?.includes(lesson.id);
		quizQuestion.textContent = quiz.question;
		quizOptions.replaceChildren(...quiz.options.map((option, index) => {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = option;
			button.disabled = passed;
			button.addEventListener("click", () => {
				if (index === quiz.answer) {
					state.quizDone[activeTrack] = [...new Set([...(state.quizDone[activeTrack] || []), lesson.id])];
					saveState();
					quizFeedback.textContent = "Правильно! Вікторину зараховано.";
					quizFeedback.className = "is-success";
				} else {
					quizFeedback.textContent = "Не зовсім. Спробуй ще раз.";
					quizFeedback.className = "is-error";
					return;
				}
				renderQuiz(lesson);
				refreshProgress();
				renderAchievements();
			});
			return button;
		}));
		quizFeedback.textContent = passed ? "Вікторину вже зараховано." : "Обери одну відповідь, щоб відкрити наступний урок.";
		quizFeedback.className = passed ? "is-success" : "";
	}

	function renderCheckResults(results) {
		checkResults.replaceChildren();
		if (!results.length) {
			const item = document.createElement("li");
			item.textContent = "Запусти код, щоб побачити перевірки.";
			checkResults.append(item);
			return;
		}
		for (const result of results) {
			const item = document.createElement("li");
			item.className = result.passed ? "is-passed" : "is-failed";
			const icon = document.createElement("span");
			icon.setAttribute("aria-hidden", "true");
			icon.textContent = result.passed ? "✓" : "○";
			item.append(icon, document.createTextNode(result.label));
			checkResults.append(item);
		}
	}

	function renderAchievements() {
		renderProfileStats();
		renderProjectCards();
		if (!achievementList) return;
		const allCompletions = Object.values(state.completed).reduce((total, items) => total + items.length, 0);
		const finishedTracks = Object.keys(tracks).filter(trackId => {
			const done = completedLessons(trackId);
			const quizzes = state.quizDone[trackId] || [];
			return done.length === tracks[trackId].lessons.length && tracks[trackId].lessons.every(lesson => quizzes.includes(lesson.id));
		});
		const answeredQuizzes = Object.values(state.quizDone).reduce((total, items) => total + items.length, 0);
		const badges = [
			{ title: window.FelerI18n.t("badgeFirst"), description: window.FelerI18n.t("badgeFirstDescription"), unlocked: allCompletions > 0 },
			{ title: window.FelerI18n.t("badgeCurious"), description: window.FelerI18n.t("badgeCuriousDescription"), unlocked: answeredQuizzes >= 5 },
			{ title: window.FelerI18n.t("badgeFinisher"), description: window.FelerI18n.t("badgeFinisherDescription"), unlocked: finishedTracks.length > 0 },
			{ title: window.FelerI18n.t("badgeMaster"), description: window.FelerI18n.t("badgeMasterDescription"), unlocked: finishedTracks.length >= 3 }
		];
		achievementList.replaceChildren(...badges.map(badge => {
			const card = document.createElement("article");
			card.className = `achievement-card${badge.unlocked ? " is-unlocked" : ""}`;
			const icon = document.createElement("span");
			icon.textContent = badge.unlocked ? "★" : "☆";
			const title = document.createElement("strong");
			title.textContent = badge.title;
			const description = document.createElement("span");
			description.textContent = badge.description;
			card.append(icon, title, description);
			return card;
		}));
	}

	function renderProjectCards() {
		for (const card of document.querySelectorAll("[data-project-track]")) {
			const trackId = card.dataset.projectTrack;
			const project = tracks[trackId]?.lessons.find(lesson => lesson.project);
			if (!project) continue;

			const completed = completedLessons(trackId).includes(project.id) &&
				(state.quizDone[trackId] || []).includes(project.id);
			const started = Object.hasOwn(routeDrafts, `${trackId}:${project.id}`);
			const status = card.querySelector(".project-link");
			status.textContent = window.FelerI18n.t(completed ? "projectCompleted" : started ? "projectContinue" : "projectStart");
			card.classList.toggle("is-complete", completed);
		}
	}

	function refreshProgress() {
		const track = tracks[activeTrack];
		const completed = completedLessons();
		const quizDone = state.quizDone[activeTrack] || [];
		const percent = Math.round(completed.length / track.lessons.length * 100);
		const continuation = routeContinuations[activeTrack];
		document.querySelector("#routeName").textContent = activeTrack === "fastapi" ? "FastAPI → Django" : track.name;
		document.querySelector("#routeProgressLabel").textContent = `${completed.length} / ${track.lessons.length} уроки${activeTrack === "fastapi" ? " · частина 1 з 2" : activeTrack === "django" ? " · продовження" : ""}`;
		document.querySelector("#routeProgressBar").style.width = `${percent}%`;
		document.querySelector("#sidebarProgress").textContent = `${percent}%`;
		document.querySelector("#sidebarProgressBar").style.width = `${percent}%`;
		document.querySelector(".goal-row span:first-child").textContent = track.name;
		const rail = document.querySelector("#lessonRail");
		rail.replaceChildren(...track.lessons.map((lesson, index) => {
			const button = document.createElement("button");
			const unlocked = index === 0 || (completed.includes(track.lessons[index - 1].id) && quizDone.includes(track.lessons[index - 1].id));
			button.type = "button";
			button.className = `rail-step${index === activeIndex ? " is-active" : ""}${completed.includes(lesson.id) ? " is-done" : ""}`;
			button.disabled = !unlocked;
			button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${lesson.project ? window.FelerI18n.t("finalProject") : lesson.title}</strong>`;
			button.addEventListener("click", () => showLesson(index));
			return button;
		}));
		document.querySelector("#routeProgress").hidden = false;
		document.querySelector("#nextLesson").hidden = !completed.includes(track.lessons[activeIndex].id) || !quizDone.includes(track.lessons[activeIndex].id);
		document.querySelector("#nextLesson").textContent = activeIndex === track.lessons.length - 1
			? continuation ? `Продовжити: ${tracks[continuation].name} →` : "Маршрут завершено ✓"
			: "Наступний урок →";
		document.querySelector("#nextLesson").disabled = activeIndex === track.lessons.length - 1 && !continuation;
	}

	function showLesson(index) {
		const track = tracks[activeTrack];
		activeIndex = Math.max(0, Math.min(index, track.lessons.length - 1));
		const lesson = track.lessons[activeIndex];
		const lessonTeaching = teaching[activeTrack][lesson.id];
		const completed = completedLessons().includes(lesson.id);
		state.lastIndex[activeTrack] = activeIndex;
		saveState();
		document.querySelector("#breadcrumbLabel").textContent = `${track.name} / ${lesson.title}`;
		document.querySelector("#trackEyebrow").textContent = `${track.topic.toLocaleUpperCase("uk")} · УРОК ${activeIndex + 1} З ${track.lessons.length}`;
		document.querySelector("#sandboxTitle").textContent = lesson.title;
		document.querySelector("#challengeNumber").textContent = String(activeIndex + 1).padStart(2, "0");
		document.querySelector("#challengeTitle").textContent = lesson.project ? `Проєкт: ${lesson.title.replace(/^Проєкт:\s*/, "")}` : lesson.title;
		document.querySelector("#lessonExplanation").textContent = lessonTeaching.explanation;
		document.querySelector("#lessonExampleLabel").textContent = lesson.filename;
		document.querySelector("#lessonExample").textContent = lessonTeaching.example;
		document.querySelector("#lessonExampleResult").textContent = lessonTeaching.result;
		document.querySelector("#challengePrompt").textContent = lesson.task;
		document.querySelector("#sandboxFilename").textContent = lesson.filename;
		document.querySelector("#sandboxLanguageLabel").textContent = track.name;
		document.querySelector("#outputTitle").textContent = track.name === "HTML" || track.name === "CSS" ? "Попередній перегляд" : track.staticChecks ? "Статична перевірка" : "Результат виконання";
		document.querySelector("#sandboxHint").textContent = track.staticChecks
			? "Код цього маршруту перевіряється за структурою, але не запускається в браузері. Для запуску встанови потрібне середовище локально."
			: "Запусти код, щоб виконати перевірку. Редактор зберігає чернетку автоматично.";
		sandboxPreview.hidden = track.name !== "HTML" && track.name !== "CSS";
		sandboxConsole.hidden = !sandboxPreview.hidden;
		sandboxConsole.textContent = "Тут з'явиться результат виконання.";
		const draft = routeDrafts[`${activeTrack}:${lesson.id}`];
		setCode(typeof draft === "string" ? draft : lesson.starter);
		setMode(track.mode);
		attempted = false;
		hintPanel.textContent = lesson.hint;
		hintPanel.hidden = true;
		solutionPanel.textContent = lesson.solution;
		solutionPanel.hidden = true;
		solutionButton.disabled = !completed;
		renderCheckResults([]);
		renderQuiz(lesson);
		hintButton.setAttribute("aria-expanded", "false");
		feedback.textContent = completed ? "Цей урок уже зарахований. Можеш пройти його ще раз." : "Запусти код, щоб перевірити завдання.";
		feedback.className = "feedback";
		runButton.disabled = false;
		refreshProgress();
		renderAchievements();
	}

	function enterTrack(trackId, scroll = true) {
		if (!tracks[trackId]) return;
		activeTrack = trackId;
		state.selected = trackId;
		document.querySelector("#sandboxTitle").removeAttribute("data-i18n");
		sandboxLanguage.value = trackId;
		saveState();
		document.body.classList.remove("needs-track");
		document.body.classList.add("is-learning");
		document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("is-active", link.id === "navRoute"));
		const savedIndex = Number.isInteger(state.lastIndex[trackId]) ? state.lastIndex[trackId] : 0;
		showLesson(savedIndex);
		if (scroll) document.querySelector("#sandbox").scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function showLanguageGate() {
		document.body.classList.remove("is-learning");
		document.body.classList.add("needs-track");
		document.querySelector("#sandboxTitle").dataset.i18n = "sandboxTitle";
		document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("is-active", link.id === "navLanguages"));
		renderProjectCards();
		languageGate.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function filterTrackCards() {
		const query = document.querySelector("#trackSearch").value.trim().toLocaleLowerCase("uk");
		const topic = document.querySelector("#trackTopic").value;
		const level = document.querySelector("#trackLevel").value;
		const duration = document.querySelector("#trackDuration").value;
		let count = 0;
		for (const card of trackCards) {
			const matches = card.dataset.search.includes(query) && (topic === "all" || card.dataset.topic.split(" ").includes(topic)) && (level === "all" || card.dataset.level === level) && (duration === "all" || (duration === "short" ? Number(card.dataset.time) <= 30 : Number(card.dataset.time) > 30));
			card.hidden = !matches;
			if (matches) count++;
		}
		document.querySelector("#emptyTracks").hidden = count > 0;
	}

	function normalizedOutput(value) {
		return String(value).replace(/\r/g, "").trim();
	}

	function formatValue(value) {
		if (typeof value === "string") return value;
		try { return JSON.stringify(value) ?? String(value); } catch { return String(value); }
	}

	function executeInFrame(code) {
		const runId = `${Date.now()}-${Math.random()}`;
		const safeCode = JSON.stringify(code).replace(/</g, "\\u003c");
		const result = new Promise(resolve => pendingRuns.set(runId, resolve));
		sandboxPreview.srcdoc = `<!doctype html><html><body><div id="app"></div><script>
			const runId = ${JSON.stringify(runId)};
			const lines = [];
			const send = data => parent.postMessage({ source: "feler-route", runId, ...data }, "*");
			const format = value => { if (typeof value === "string") return value; try { return JSON.stringify(value) ?? String(value); } catch { return String(value); } };
			console.log = (...values) => lines.push(values.map(format).join(" "));
			console.error = (...values) => lines.push(values.map(format).join(" "));
			try { new Function(${safeCode})(); send({ output: lines.join("\\n"), error: "" }); }
			catch (error) { send({ output: lines.join("\\n"), error: error.message }); }
		<\/script></body></html>`;
		return result;
	}

	function loadLibrary(src, ready) {
		if (ready()) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => ready() ? resolve() : reject(new Error("Бібліотека не завантажилася."));
			script.onerror = () => reject(new Error("Не вдалося завантажити інструмент виконання. Перевір інтернет-з'єднання."));
			document.head.append(script);
		});
	}

	function loadTypeScript() {
		if (!typescriptPromise) typescriptPromise = loadLibrary("https://cdnjs.cloudflare.com/ajax/libs/typescript/5.8.3/typescript.min.js", () => Boolean(window.ts));
		return typescriptPromise;
	}

	function loadSql() {
		if (!sqlPromise) sqlPromise = loadLibrary("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js", () => Boolean(window.initSqlJs)).then(() => window.initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}` }));
		return sqlPromise;
	}

	function checkMarkup(code, checks) {
		const parsed = new DOMParser().parseFromString(code, "text/html");
		return checks.map(check => {
			const elements = [...parsed.querySelectorAll(check.selector)];
			if (check.count !== undefined) return elements.length === check.count;
			if (!elements.length) return false;
			return !check.text || elements.some(element => element.textContent.trim() === check.text);
		});
	}

	function checkStyles(code, checks) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(code);
		return checks.map(check => {
			const rule = [...sheet.cssRules].find(item => item.selectorText === check.selector);
			if (!rule) return false;
			const value = rule.style.getPropertyValue(check.property).trim().toLowerCase();
			const normalize = candidate => {
				const element = document.createElement("span");
				element.style.setProperty(check.property, candidate);
				return element.style.getPropertyValue(check.property).trim().toLowerCase();
			};
			return normalize(value) === normalize(check.value);
		});
	}

	function formatSql(results) {
		return results.flatMap(result => [result.columns.join(" | "), ...result.values.map(row => row.map(formatValue).join(" | "))]).join("\n");
	}

	function setFeedback(text, success = false) {
		feedback.textContent = text;
		feedback.className = `feedback ${success ? "is-success" : "is-error"}`;
	}

	async function runCurrentLesson() {
		const track = tracks[activeTrack];
		if (!track) return;
		const lesson = track.lessons[activeIndex];
		const code = getCode();
		const runLabel = runButton.innerHTML;
		runButton.disabled = true;
		runButton.textContent = "Виконується…";
		feedback.textContent = "Перевіряю код…";
		feedback.className = "feedback";
		sandboxConsole.textContent = "";
		let checks = [];
		let output = "";
		try {
			if (track.staticChecks) {
				checks = lesson.checks.map(check => ({ label: check.label, passed: new RegExp(check.pattern, "m").test(code) }));
				output = "Цей маршрут перевіряє структуру коду. Для реального запуску потрібне локальне середовище мови та фреймворку.";
			} else if (track.name === "HTML") {
				sandboxPreview.srcdoc = code;
				checks = checkMarkup(code, lesson.checks).map((passed, index) => {
					const check = lesson.checks[index];
					return { label: check.label || `Елемент ${check.selector}${check.text ? ` з текстом «${check.text}»` : ""}`, passed };
				});
			} else if (track.name === "CSS") {
				const safeStyles = code.replace(/<\/style/gi, "<\\/style");
				sandboxPreview.srcdoc = `<!doctype html><html><head><style>${safeStyles}</style></head><body><main class="cards"><article class="card profile"><h1>Hello, World!</h1><p>Твоя перша стилізована сторінка.</p></article></main></body></html>`;
				checks = checkStyles(code, lesson.checks).map((passed, index) => {
					const check = lesson.checks[index];
					return { label: `${check.selector}: ${check.property}: ${check.value}`, passed };
				});
			} else if (track.name === "Python") {
				sandboxConsole.textContent = "Завантажую Python-середовище…";
				const pyodide = await loadPythonRuntime();
				const lines = [];
				pyodide.setStdout({ batched: text => lines.push(text) });
				pyodide.setStderr({ batched: text => lines.push(text) });
				await pyodide.runPythonAsync(code);
				output = lines.join("\n");
			} else if (track.name === "SQL") {
				sandboxConsole.textContent = "Завантажую SQLite-середовище…";
				const SQL = await loadSql();
				const database = new SQL.Database();
				output = formatSql(database.exec(code));
				database.close();
			} else {
				let javascript = code;
				if (track.name === "TypeScript") {
					sandboxConsole.textContent = "Компілюю TypeScript…";
					await loadTypeScript();
					const result = window.ts.transpileModule(code, { reportDiagnostics: true, compilerOptions: { target: window.ts.ScriptTarget.ES2020 } });
					const diagnostic = result.diagnostics?.find(item => item.category === window.ts.DiagnosticCategory.Error);
					if (diagnostic) throw new Error(window.ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
					javascript = result.outputText;
				}
				const result = await executeInFrame(javascript);
				output = result.output;
				if (result.error) throw new Error(result.error);
			}
			if (!track.staticChecks && track.name !== "HTML" && track.name !== "CSS") {
				const expectedLines = normalizedOutput(lesson.expected).split("\n");
				const actualLines = normalizedOutput(output) ? normalizedOutput(output).split("\n") : [];
				checks = expectedLines.map((expected, index) => ({ label: `Рядок ${index + 1}: ${expected}`, passed: actualLines[index] === expected }));
				if (actualLines.length > expectedLines.length) checks.push({ label: "Немає зайвого виводу", passed: false });
			}
			sandboxConsole.textContent = output || "Код виконався без виводу.";
			sandboxConsole.classList.remove("is-error");
			renderCheckResults(checks);
			if (checks.length && checks.every(check => check.passed)) {
				const completed = completedLessons();
				if (!completed.includes(lesson.id)) completed.push(lesson.id);
				saveState();
				setFeedback(`Правильно! Успішно пройдено перевірок: ${checks.filter(check => check.passed).length}/${checks.length}.`, true);
				solutionButton.disabled = false;
				refreshProgress();
				renderAchievements();
			} else {
				attempted = true;
				solutionButton.disabled = false;
				setFeedback(`Ще не готово: пройдено ${checks.filter(check => check.passed).length}/${checks.length} перевірок. Переглянь підказку й спробуй ще раз.`);
			}
		} catch (runError) {
			sandboxConsole.textContent = runError.message;
			sandboxConsole.classList.add("is-error");
			renderCheckResults([]);
			attempted = true;
			solutionButton.disabled = false;
			setFeedback("Під час запуску виникла помилка. Перевір код і спробуй ще раз.");
		}
		runButton.disabled = false;
		runButton.innerHTML = runLabel;
	}

	function onRouteMessage(event) {
		if (event.source !== sandboxPreview.contentWindow || event.data?.source !== "feler-route") return;
		const resolve = pendingRuns.get(event.data.runId);
		if (!resolve) return;
		pendingRuns.delete(event.data.runId);
		resolve(event.data);
	}

	function exportProgress() {
		const backup = {
			version: 1,
			exportedAt: new Date().toISOString(),
			state,
			drafts: routeDrafts,
			legacyProgress: progress,
			legacyDrafts: lessonDrafts,
			sandboxDrafts
		};
		const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "feler-progress.json";
		link.hidden = true;
		document.body.append(link);
		link.click();
		link.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function importProgressData(data) {
		if (!data || data.version !== 1 || !data.state || typeof data.state !== "object" || !data.drafts || typeof data.drafts !== "object" || Array.isArray(data.drafts)) {
			throw new Error("Файл не схожий на резервну копію прогресу Feler.");
		}
		const imported = data.state;
		if (imported.selected && !tracks[imported.selected]) throw new Error("У резервній копії вказано невідому навчальну мову.");
		const completed = {};
		const quizDone = {};
		const lastIndex = {};
		for (const [trackId, track] of Object.entries(tracks)) {
			const validIds = track.lessons.map(lesson => lesson.id);
			completed[trackId] = Array.isArray(imported.completed?.[trackId]) ? [...new Set(imported.completed[trackId].filter(id => validIds.includes(id)))] : [];
			quizDone[trackId] = Array.isArray(imported.quizDone?.[trackId]) ? [...new Set(imported.quizDone[trackId].filter(id => completed[trackId].includes(id)))] : [];
			const requestedIndex = imported.lastIndex?.[trackId];
			let index = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < track.lessons.length ? requestedIndex : 0;
			while (index > 0 && (!completed[trackId].includes(track.lessons[index - 1].id) || !quizDone[trackId].includes(track.lessons[index - 1].id))) index--;
			lastIndex[trackId] = index;
		}
		const drafts = {};
		for (const [key, code] of Object.entries(data.drafts)) {
			const separator = key.indexOf(":");
			const trackId = key.slice(0, separator);
			const lessonId = key.slice(separator + 1);
			if (separator > 0 && tracks[trackId]?.lessons.some(lesson => lesson.id === lessonId) && typeof code === "string" && code.length <= 100000) drafts[key] = code;
		}
		const legacyProgress = data.legacyProgress && typeof data.legacyProgress === "object" ? data.legacyProgress : {};
		progress = {
			completed: Array.isArray(legacyProgress.completed) ? [...new Set(legacyProgress.completed.filter(id => lessons[id]))] : [],
			streak: Number.isFinite(legacyProgress.streak) && legacyProgress.streak >= 0 ? legacyProgress.streak : 0,
			lastVisit: typeof legacyProgress.lastVisit === "string" ? legacyProgress.lastVisit : ""
		};
		const legacyDrafts = data.legacyDrafts && typeof data.legacyDrafts === "object" && !Array.isArray(data.legacyDrafts) ? data.legacyDrafts : {};
		for (const key of Object.keys(lessonDrafts)) delete lessonDrafts[key];
		Object.assign(lessonDrafts, Object.fromEntries(Object.entries(legacyDrafts).filter(([id, code]) => lessons[id] && typeof code === "string" && code.length <= 100000)));
		const importedSandboxDrafts = data.sandboxDrafts && typeof data.sandboxDrafts === "object" && !Array.isArray(data.sandboxDrafts) ? data.sandboxDrafts : {};
		for (const key of Object.keys(sandboxDrafts)) delete sandboxDrafts[key];
		Object.assign(sandboxDrafts, Object.fromEntries(Object.entries(importedSandboxDrafts).filter(([id, code]) => sandboxExamples[id] && typeof code === "string" && code.length <= 100000)));
		state = { selected: tracks[imported.selected] ? imported.selected : "", completed, quizDone, lastIndex };
		for (const key of Object.keys(routeDrafts)) delete routeDrafts[key];
		Object.assign(routeDrafts, drafts);
		saveState();
		try { localStorage.setItem(scopedStorageKey(draftKey), JSON.stringify(routeDrafts)); } catch { }
		scheduleCloudSync();
		saveProgress();
		saveDrafts(lessonDraftsKey, lessonDrafts);
		saveDrafts(sandboxDraftsKey, sandboxDrafts);
		updateProgressView();
		renderAchievements();
		if (state.selected) enterTrack(state.selected, false);
		else showLanguageGate();
	}

	function connectEditor() {
		if (window.CodeMirror) {
			codeMirror = window.CodeMirror.fromTextArea(sandboxEditor, { mode: "javascript", theme: "material-darker", lineNumbers: true, indentUnit: 2, tabSize: 2, lineWrapping: false, viewportMargin: 30 });
			codeMirror.setSize("100%", 250);
			codeMirror.on("change", () => { sandboxEditor.value = codeMirror.getValue(); saveDraft(codeMirror.getValue()); });
			codeMirror.addKeyMap({ "Ctrl-Enter": runCurrentLesson, "Cmd-Enter": runCurrentLesson });
		} else {
			sandboxEditor.addEventListener("input", () => saveDraft(sandboxEditor.value));
		}
	}

	function initialize() {
		const legacyExamples = {
			typescript: { filename: "main.ts", label: "TypeScript", output: "console", hint: "Зміни код і запусти маршрут.", code: "console.log('Hello, World!');" },
			sql: { filename: "query.sql", label: "SQL", output: "console", hint: "Зміни запит і запусти маршрут.", code: "SELECT 'Hello, World!' AS greeting;" },
			fastapi: { filename: "main.py", label: "FastAPI", output: "console", hint: "Код FastAPI перевіряється у навчальному маршруті.", code: "from fastapi import FastAPI\n\napp = FastAPI()" },
			django: { filename: "views.py", label: "Django", output: "console", hint: "Код Django перевіряється у навчальному маршруті.", code: "from django.http import JsonResponse\n\n# Створи Django view" },
			csharp: { filename: "Program.cs", label: "C#", output: "console", hint: "Код C# перевіряється у навчальному маршруті.", code: "Console.WriteLine(\"Hello, World!\");" },
			go: { filename: "main.go", label: "Go", output: "console", hint: "Код Go перевіряється у навчальному маршруті.", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go!\")\n}" },
		};
		Object.assign(sandboxExamples, legacyExamples);
		document.querySelector("#runSandbox").removeEventListener("click", runSandbox);
		const practiceSection = document.querySelector("#practice");
		document.querySelector("#sandbox .sandbox-panel").before(challengeCopy);
		challengeCopy.classList.add("lesson-card");
		for (const icon of document.querySelectorAll(".track-brand img")) {
			const brand = icon.closest(".track-brand");
			const showFallback = () => brand.classList.add("is-icon-fallback");
			icon.addEventListener("error", showFallback, { once: true });
			if (icon.complete && icon.naturalWidth === 0) showFallback();
		}
		for (const control of document.querySelectorAll("[data-character-part]")) {
			control.addEventListener("change", renderCharacterPreview);
		}
		connectEditor();
		window.addEventListener("message", onRouteMessage);
		updateAccountUI();
		document.querySelector("#accountButton").addEventListener("click", () => {
			accountDialog.showModal();
			if (!supabaseClient) {
				setAccountStatus(supabaseConfigError
					? `Акаунт недоступний: ${supabaseConfigError}`
					: "Спершу налаштуй URL і anon key у supabase-config.js та створи таблицю user_progress.", true);
			} else if (currentUser) {
				setAccountStatus("Ти ввійшов. Прогрес і чернетки синхронізуються автоматично.");
			} else {
				setAccountStatus("Можеш навчатися без акаунта або увійти, щоб синхронізувати прогрес.");
			}
		});
		const profileDialog = document.querySelector("#profileDialog");
		const openProfile = () => {
			applyProfileUI();
			document.querySelector("#profileStatus").textContent = "";
			document.querySelector("#profileStatus").classList.remove("is-error");
			profileDialog.showModal();
		};
		document.querySelector("#profileButton").addEventListener("click", openProfile);
		document.querySelector("#profileQuickButton").addEventListener("click", openProfile);
		document.querySelector("#profileClose").addEventListener("click", () => profileDialog.close());
		document.querySelector("#profileForm").addEventListener("submit", event => {
			event.preventDefault();
			saveProfilePreferences();
		});
		document.querySelector("#studyGoal").addEventListener("change", event => {
			document.querySelector("#profileGoal").value = event.currentTarget.value;
			saveProfilePreferences();
		});
		document.querySelector("#startStudyPlan").addEventListener("click", () => enterTrack(document.querySelector("#startStudyPlan").dataset.track));
		for (const project of document.querySelectorAll("[data-project-track]")) {
			project.addEventListener("click", () => {
				const trackId = project.dataset.projectTrack;
				enterTrack(trackId);
				const projectIndex = tracks[trackId].lessons.findIndex(lesson => lesson.project);
				if (projectIndex >= 0) showLesson(projectIndex);
			});
		}
		document.querySelector("#openAccountFromProfile").addEventListener("click", () => {
			profileDialog.close();
			accountButton.click();
		});
		document.querySelector("#accountClose").addEventListener("click", () => accountDialog.close());
		document.querySelector("#accountForm").addEventListener("submit", event => event.preventDefault());
		accountSignIn.addEventListener("click", signIn);
		accountSignUp.addEventListener("click", signUp);
		accountResend.addEventListener("click", resendConfirmation);
		accountSignOut.addEventListener("click", async () => {
			accountSignOut.disabled = true;
			try {
				const { error } = await supabaseClient.auth.signOut();
				if (error) setAccountStatus(`Не вдалося вийти: ${error.message}`, true);
				else accountDialog.close();
			} catch (error) {
				setAccountStatus(`Не вдалося вийти: ${error.message}`, true);
			} finally {
				accountSignOut.disabled = false;
			}
		});
		if (supabaseClient) {
			supabaseClient.auth.onAuthStateChange((_event, session) => {
				window.queueMicrotask(() => {
					handleAuthSession(session).catch(error => {
						setAccountStatus(`Помилка завантаження акаунта: ${error.message}`, true);
					});
				});
			});
			setAccountStatus("Можеш навчатися як гість або створити акаунт.");
		} else {
			setAccountStatus(supabaseConfigError
				? `Акаунт недоступний: ${supabaseConfigError}`
				: "Гостьовий режим активний. Для акаунтів налаштуй Supabase.", Boolean(supabaseConfigError));
		}
		document.querySelector("#changeLanguage").addEventListener("click", showLanguageGate);
		document.querySelector("#siteLanguage").addEventListener("change", event => window.FelerI18n.setLanguage(event.currentTarget.value));
		window.addEventListener("feler-language-change", () => {
			applyProfileUI();
			updateTodayLabel();
			updateProgressView();
			renderAchievements();
		});
		document.querySelector("#navLanguages").addEventListener("click", event => { event.preventDefault(); showLanguageGate(); });
		document.querySelector("#showHint").addEventListener("click", () => {
			hintPanel.hidden = !hintPanel.hidden;
			hintButton.setAttribute("aria-expanded", String(!hintPanel.hidden));
		});
		solutionButton.addEventListener("click", () => { solutionPanel.hidden = !solutionPanel.hidden; });
		document.querySelector("#nextLesson").addEventListener("click", () => {
			if (activeIndex < tracks[activeTrack].lessons.length - 1) showLesson(activeIndex + 1);
			else if (routeContinuations[activeTrack]) enterTrack(routeContinuations[activeTrack]);
			else setFeedback("Маршрут завершено! Можеш обрати іншу мову або повторити проєкт.", true);
		});
		document.querySelector("#exportProgress").addEventListener("click", exportProgress);
		document.querySelector("#exportProgressRoute").addEventListener("click", exportProgress);
		document.querySelector("#importProgress").addEventListener("click", () => importProgressFile.click());
		document.querySelector("#importProgressRoute").addEventListener("click", () => importProgressFile.click());
		importProgressFile.addEventListener("change", async () => {
			const file = importProgressFile.files[0];
			importProgressFile.value = "";
			if (!file) return;
			try {
				const data = JSON.parse(await file.text());
				if (!window.confirm("Імпорт замінить поточний прогрес і чернетки. Продовжити?")) return;
				importProgressData(data);
			} catch (error) {
				window.alert(`Не вдалося імпортувати прогрес: ${error.message}`);
			}
		});
		runButton.addEventListener("click", runCurrentLesson);
		document.querySelector("#resetSandbox").addEventListener("click", () => {
			const lesson = tracks[activeTrack]?.lessons[activeIndex];
			if (!lesson) return;
			delete routeDrafts[`${activeTrack}:${lesson.id}`];
			try { localStorage.setItem(scopedStorageKey(draftKey), JSON.stringify(routeDrafts)); } catch { }
			scheduleCloudSync();
			setCode(lesson.starter);
			renderCheckResults([]);
			feedback.textContent = "Початковий код відновлено.";
			feedback.className = "feedback";
		});
		sandboxLanguage.addEventListener("change", () => enterTrack(sandboxLanguage.value));
		for (const card of trackCards) card.addEventListener("click", () => enterTrack(card.dataset.trackChoice));
		for (const id of ["trackSearch", "trackTopic", "trackLevel", "trackDuration"]) document.querySelector(`#${id}`).addEventListener("input", filterTrackCards);
		document.querySelector("#navRoute").addEventListener("click", event => {
			if (!activeTrack) { event.preventDefault(); showLanguageGate(); }
		});
		renderAchievements();
		document.body.classList.remove("is-learning");
		document.body.classList.add("needs-track");
		document.querySelector("#routeProgress").hidden = true;
	}

	initialize();
})();
