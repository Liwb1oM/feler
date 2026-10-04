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
		state.textContent = completed ? "Урок завершено" : "Ще не розпочато";
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

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("uk-UA", {
	weekday: "long",
	day: "numeric",
	month: "long"
}).format(new Date());

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
				{ id: "project", title: "Проєкт: FizzBuzz", task: "Виведи числа від 1 до 15. Для кратних 3 виводь Fizz, для 5 — Buzz, для обох — FizzBuzz.", filename: "fizzbuzz.js", starter: "for (let number = 1; number <= 15; number++) {\n  console.log(number);\n}", expected: fizzBuzzOutput, hint: "Спочатку перевір кратність і 3, і 5; потім окремо 3 та 5.", solution: "for (let number = 1; number <= 15; number++) {\n  if (number % 15 === 0) console.log('FizzBuzz');\n  else if (number % 3 === 0) console.log('Fizz');\n  else if (number % 5 === 0) console.log('Buzz');\n  else console.log(number);\n}" , project: true }
			]
		},
		python: {
			name: "Python", mode: "python", topic: "Логіка й автоматизація", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Запусти першу програму та побач відповідь у консолі.", filename: "hello.py", starter: "print('Hello, World!')", expected: "Hello, World!", hint: "Функція print() виводить текст у консоль.", solution: "print('Hello, World!')" },
				{ id: "variables", title: "Змінні та повідомлення", task: "Збережи ім'я у змінній name й привітай Ada.", filename: "greeting.py", starter: "name = 'Ada'\nprint(f'Hello, {name}!')", expected: "Hello, Ada!", hint: "Префікс f перед рядком дає змогу вставити значення як {name}.", solution: "name = 'Ada'\nprint(f'Hello, {name}!')" },
				{ id: "functions", title: "Функції й перевірки", task: "Виправ double: поверни подвоєне число для обох тестових значень.", filename: "double.py", starter: "def double(number):\n    return number\n\nprint(double(6))\nprint(double(-3))", expected: "12\n-6", hint: "Помнож number на 2 у виразі після return.", solution: "def double(number):\n    return number * 2\n\nprint(double(6))\nprint(double(-3))" },
				{ id: "project", title: "Проєкт: парні числа", task: "Пройдися циклом по списку й виведи лише парні числа.", filename: "even_numbers.py", starter: "numbers = [1, 2, 3, 4, 5, 6]\n\nfor number in numbers:\n    print(number)", expected: "2\n4\n6", hint: "Остача від ділення парного числа на 2 дорівнює нулю.", solution: "numbers = [1, 2, 3, 4, 5, 6]\n\nfor number in numbers:\n    if number % 2 == 0:\n        print(number)", project: true }
			]
		},
		typescript: {
			name: "TypeScript", mode: "text/typescript", topic: "Веб і типи", lessons: [
				{ id: "hello", title: "Hello, World!", task: "Запусти TypeScript-програму та перевір її вивід.", filename: "hello.ts", starter: "console.log('Hello, World!');", expected: "Hello, World!", hint: "TypeScript-код компілюється в JavaScript, а потім запускається.", solution: "console.log('Hello, World!');" },
				{ id: "variables", title: "Типізовані змінні", task: "Оголоси name як рядок і привітай Ada.", filename: "greeting.ts", starter: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);", expected: "Hello, Ada!", hint: "Для тексту використовуй тип string.", solution: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);" },
				{ id: "functions", title: "Типізовані функції", task: "Виправ double, щоб обидва результати відповідали тестам.", filename: "double.ts", starter: "function double(number: number): number {\n  return number;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));", expected: "12\n-6", hint: "Тип number задає тип аргументу й результату; помнож аргумент на 2.", solution: "function double(number: number): number {\n  return number * 2;\n}\n\nconsole.log(double(6));\nconsole.log(double(-3));" },
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
		}
	};

	const teaching = {
		javascript: {
			hello: { explanation: "JavaScript виконує команди по черзі. console.log() показує значення в консолі, тож так зручно перевіряти результат програми.", example: "console.log('Hello, World!');", result: "У консолі з'явиться: Hello, World!" },
			variables: { explanation: "Змінна зберігає значення, щоб ним можна було скористатися пізніше. const підходить для значення, яке не плануємо переприсвоювати; шаблонний рядок вставляє змінні через ${...}.", example: "const name = 'Ada';\nconst age = 30;\nconsole.log(`Hello, ${name}! You are ${age}.`);", result: "У консолі: Hello, Ada! You are 30." },
			functions: { explanation: "Функція об'єднує команди й може приймати параметри. return повертає обчислений результат туди, де функцію викликали.", example: "function double(number) {\n  return number * 2;\n}\n\nconsole.log(double(4));", result: "Виклик double(4) виведе 8." },
			project: { explanation: "Цикл проходить числа по одному, а умови вибирають, що вивести. Спершу перевіряємо кратність 3 і 5 разом, і лише потім кожну окремо.", example: "for (let n = 1; n <= 3; n++) {\n  if (n % 3 === 0) console.log('Fizz');\n  else console.log(n);\n}", result: "Результат: 1, 2, Fizz." }
		},
		python: {
			hello: { explanation: "Python виконує команди послідовно. print() виводить текст у консоль; рядок у лапках сприймається як текст, а не як назва змінної.", example: "print('Hello, World!')", result: "У консолі з'явиться: Hello, World!" },
			variables: { explanation: "Знак = присвоює значення змінній. f-рядок дає змогу підставляти змінні всередину тексту, записуючи їхні назви у фігурних дужках.", example: "name = 'Ada'\nage = 30\nprint(f'Hello, {name}! You are {age}.')", result: "У консолі: Hello, Ada! You are 30." },
			functions: { explanation: "def створює функцію, а відступи показують, які команди до неї належать. return повертає результат і завершує роботу функції.", example: "def double(number):\n    return number * 2\n\nprint(double(4))", result: "Виклик double(4) виведе 8." },
			project: { explanation: "for бере кожен елемент списку по черзі. Оператор % повертає остачу від ділення; у парного числа вона дорівнює нулю.", example: "for number in [1, 2, 3, 4]:\n    if number % 2 == 0:\n        print(number)", result: "У консолі з'являться 2 і 4." }
		},
		typescript: {
			hello: { explanation: "TypeScript-код компілюється у JavaScript перед запуском. Команда console.log() працює так само й показує результат у консолі.", example: "console.log('Hello, World!');", result: "Після компіляції в консолі з'явиться Hello, World!." },
			variables: { explanation: "Анотація : string явно вказує, що змінна містить текст. Типи допомагають помітити несумісні значення під час написання коду.", example: "const name: string = 'Ada';\nconsole.log(`Hello, ${name}!`);", result: "У консолі: Hello, Ada!" },
			functions: { explanation: "Типи параметрів стоять біля їхніх назв, а тип після дужок задає тип результату. Тут функція приймає число й повертає число.", example: "function double(number: number): number {\n  return number * 2;\n}\n\nconsole.log(double(4));", result: "Виклик double(4) виведе 8." },
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
		}
	};

	const stateKey = "feler-curriculum-v1";
	const draftKey = "feler-route-drafts-v1";
	const languageGate = document.querySelector("#languageGate");
	const trackCards = [...document.querySelectorAll("[data-track-choice]")];
	const sandboxLanguage = document.querySelector("#sandboxLanguage");
	const sandboxEditor = document.querySelector("#sandboxEditor");
	const sandboxPreview = document.querySelector("#sandboxPreview");
	const sandboxConsole = document.querySelector("#sandboxConsole");
	const runButton = document.querySelector("#runSandbox");
	const feedback = document.querySelector("#feedback");
	const solutionButton = document.querySelector("#showSolution");
	const hintButton = document.querySelector("#showHint");
	const solutionPanel = document.querySelector("#lessonSolution");
	const hintPanel = document.querySelector("#lessonHint");
	const challengeCopy = document.querySelector(".challenge-copy");
	const pendingRuns = new Map();
	let state = readState();
	let activeTrack = "";
	let activeIndex = 0;
	let codeMirror;
	let typescriptPromise;
	let sqlPromise;
	let attempted = false;

	function readState() {
		try {
			const saved = JSON.parse(localStorage.getItem(stateKey) || "{}");
			return { selected: tracks[saved.selected] ? saved.selected : "", completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {}, lastIndex: saved.lastIndex && typeof saved.lastIndex === "object" ? saved.lastIndex : {} };
		} catch {
			return { selected: "", completed: {}, lastIndex: {} };
		}
	}

	function saveState() {
		try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch { }
	}

	function readDrafts() {
		try {
			const saved = JSON.parse(localStorage.getItem(draftKey) || "{}");
			return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
		} catch {
			return {};
		}
	}

	const routeDrafts = readDrafts();

	function saveDraft(code) {
		if (!activeTrack) return;
		const lesson = tracks[activeTrack].lessons[activeIndex];
		routeDrafts[`${activeTrack}:${lesson.id}`] = code;
		try { localStorage.setItem(draftKey, JSON.stringify(routeDrafts)); } catch { }
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

	function refreshProgress() {
		const track = tracks[activeTrack];
		const completed = completedLessons();
		const percent = Math.round(completed.length / track.lessons.length * 100);
		document.querySelector("#routeName").textContent = track.name;
		document.querySelector("#routeProgressLabel").textContent = `${completed.length} / ${track.lessons.length} уроки`;
		document.querySelector("#routeProgressBar").style.width = `${percent}%`;
		document.querySelector("#sidebarProgress").textContent = `${percent}%`;
		document.querySelector("#sidebarProgressBar").style.width = `${percent}%`;
		document.querySelector(".goal-row span:first-child").textContent = track.name;
		const rail = document.querySelector("#lessonRail");
		rail.replaceChildren(...track.lessons.map((lesson, index) => {
			const button = document.createElement("button");
			const unlocked = index === 0 || completed.includes(track.lessons[index - 1].id);
			button.type = "button";
			button.className = `rail-step${index === activeIndex ? " is-active" : ""}${completed.includes(lesson.id) ? " is-done" : ""}`;
			button.disabled = !unlocked;
			button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${lesson.project ? "Проєкт" : lesson.title}</strong>`;
			button.addEventListener("click", () => showLesson(index));
			return button;
		}));
		document.querySelector("#routeProgress").hidden = false;
		document.querySelector("#nextLesson").hidden = !completed.includes(track.lessons[activeIndex].id);
		document.querySelector("#nextLesson").textContent = activeIndex === track.lessons.length - 1 ? "Маршрут завершено ✓" : "Наступний урок →";
		document.querySelector("#nextLesson").disabled = activeIndex === track.lessons.length - 1;
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
		document.querySelector("#outputTitle").textContent = track.name === "HTML" || track.name === "CSS" ? "Попередній перегляд" : "Результат виконання";
		document.querySelector("#sandboxHint").textContent = "Запусти код, щоб виконати перевірку. Редактор зберігає чернетку автоматично.";
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
		hintButton.setAttribute("aria-expanded", "false");
		feedback.textContent = completed ? "Цей урок уже зарахований. Можеш пройти його ще раз." : "Запусти код, щоб перевірити завдання.";
		feedback.className = "feedback";
		runButton.disabled = false;
		refreshProgress();
	}

	function enterTrack(trackId, scroll = true) {
		if (!tracks[trackId]) return;
		activeTrack = trackId;
		state.selected = trackId;
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
		document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("is-active", link.id === "navLanguages"));
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
		let error = "";
		try {
			if (track.name === "HTML") {
				sandboxPreview.srcdoc = code;
				checks = checkMarkup(code, lesson.checks);
			} else if (track.name === "CSS") {
				const safeStyles = code.replace(/<\/style/gi, "<\\/style");
				sandboxPreview.srcdoc = `<!doctype html><html><head><style>${safeStyles}</style></head><body><main class="cards"><article class="card profile"><h1>Hello, World!</h1><p>Твоя перша стилізована сторінка.</p></article></main></body></html>`;
				checks = checkStyles(code, lesson.checks);
			} else if (track.name === "Python") {
				sandboxConsole.textContent = "Завантажую Python-середовище…";
				const pyodide = await loadPythonRuntime();
				const lines = [];
				pyodide.setStdout({ batched: text => lines.push(text) });
				pyodide.setStderr({ batched: text => lines.push(text) });
				await pyodide.runPythonAsync(code);
				output = lines.join("\n");
				checks = [normalizedOutput(output) === normalizedOutput(lesson.expected)];
			} else if (track.name === "SQL") {
				sandboxConsole.textContent = "Завантажую SQLite-середовище…";
				const SQL = await loadSql();
				const database = new SQL.Database();
				output = formatSql(database.exec(code));
				database.close();
				checks = [normalizedOutput(output) === normalizedOutput(lesson.expected)];
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
				checks = [normalizedOutput(output) === normalizedOutput(lesson.expected)];
			}
			sandboxConsole.textContent = output || "Код виконався без виводу.";
			sandboxConsole.classList.remove("is-error");
			if (checks.length && checks.every(Boolean)) {
				const completed = completedLessons();
				if (!completed.includes(lesson.id)) completed.push(lesson.id);
				saveState();
				setFeedback(`Правильно! Успішно пройдено перевірок: ${checks.filter(Boolean).length}/${checks.length}.`, true);
				solutionButton.disabled = false;
				refreshProgress();
			} else {
				attempted = true;
				solutionButton.disabled = false;
				setFeedback(`Ще не готово: пройдено ${checks.filter(Boolean).length}/${checks.length} перевірок. Переглянь підказку й спробуй ще раз.`);
			}
		} catch (runError) {
			sandboxConsole.textContent = runError.message;
			sandboxConsole.classList.add("is-error");
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
			sql: { filename: "query.sql", label: "SQL", output: "console", hint: "Зміни запит і запусти маршрут.", code: "SELECT 'Hello, World!' AS greeting;" }
		};
		Object.assign(sandboxExamples, legacyExamples);
		document.querySelector("#runSandbox").removeEventListener("click", runSandbox);
		const practiceSection = document.querySelector("#practice");
		document.querySelector("#sandbox .sandbox-panel").before(challengeCopy);
		challengeCopy.classList.add("lesson-card");
		connectEditor();
		window.addEventListener("message", onRouteMessage);
		document.querySelector("#changeLanguage").addEventListener("click", showLanguageGate);
		document.querySelector("#navLanguages").addEventListener("click", event => { event.preventDefault(); showLanguageGate(); });
		document.querySelector("#showHint").addEventListener("click", () => {
			hintPanel.hidden = !hintPanel.hidden;
			hintButton.setAttribute("aria-expanded", String(!hintPanel.hidden));
		});
		solutionButton.addEventListener("click", () => { solutionPanel.hidden = !solutionPanel.hidden; });
		document.querySelector("#nextLesson").addEventListener("click", () => {
			if (activeIndex < tracks[activeTrack].lessons.length - 1) showLesson(activeIndex + 1);
			else setFeedback("Маршрут завершено! Можеш обрати іншу мову або повторити проєкт.", true);
		});
		runButton.addEventListener("click", runCurrentLesson);
		document.querySelector("#resetSandbox").addEventListener("click", () => {
			const lesson = tracks[activeTrack]?.lessons[activeIndex];
			if (!lesson) return;
			delete routeDrafts[`${activeTrack}:${lesson.id}`];
			try { localStorage.setItem(draftKey, JSON.stringify(routeDrafts)); } catch { }
			setCode(lesson.starter);
			feedback.textContent = "Початковий код відновлено.";
			feedback.className = "feedback";
		});
		sandboxLanguage.addEventListener("change", () => enterTrack(sandboxLanguage.value));
		for (const card of trackCards) card.addEventListener("click", () => enterTrack(card.dataset.trackChoice));
		for (const id of ["trackSearch", "trackTopic", "trackLevel", "trackDuration"]) document.querySelector(`#${id}`).addEventListener("input", filterTrackCards);
		document.querySelector("#navRoute").addEventListener("click", event => {
			if (!activeTrack) { event.preventDefault(); showLanguageGate(); }
		});
		const savedTrack = tracks[state.selected] ? state.selected : "";
		if (savedTrack) enterTrack(savedTrack, false);
		else { document.body.classList.add("needs-track"); document.querySelector("#routeProgress").hidden = true; }
	}

	initialize();
})();
