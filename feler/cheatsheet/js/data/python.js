(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "python",
  icon: "Py",
  title: { uk: "Python", en: "Python" },
  intro: {
    uk: "Короткі приклади основ Python: змінні, колекції, функції, помилки та робота з файлами.",
    en: "Quick Python essentials: variables, collections, functions, errors and files.",
  },
  items: [
    {
      id: "variables",
      title: { uk: "Змінні та типи", en: "Variables and types" },
      text: {
        uk: "Python визначає тип під час виконання. Для читабельного коду називайте змінні `snake_case`; f-рядки зручні для вставляння значень у текст.",
        en: "Python determines types at runtime. Use `snake_case` for readable names; f-strings are a convenient way to insert values into text.",
      },
      code: {
        lang: "py",
        src: `name = "Оля"
age = 21
is_learning = True
scores = [10, 9, 8]
user = {"name": name, "age": age}

print(f"{name} має {len(scores)} оцінки")
print(type(age).__name__)  # int`,
      },
      tip: {
        uk: "Для порівняння з `None` використовуйте `is None`, а не `== None`.",
        en: "Use `is None` rather than `== None` when checking for `None`.",
      },
    },
    {
      id: "conditions",
      title: { uk: "Умови", en: "Conditions" },
      text: {
        uk: "Блоки коду визначаються відступами (зазвичай чотири пробіли). `elif` додає альтернативну умову.",
        en: "Code blocks are defined by indentation (usually four spaces). `elif` adds another condition.",
      },
      code: {
        lang: "py",
        src: `temperature = 18

if temperature >= 25:
    message = "Тепло"
elif temperature >= 15:
    message = "Комфортно"
else:
    message = "Прохолодно"

print(message)`,
      },
    },
    {
      id: "loops",
      title: { uk: "Цикли та перебір", en: "Loops and iteration" },
      text: {
        uk: "`for` перебирає елементи колекції. `enumerate` додає індекс, а `range` генерує послідовність чисел.",
        en: "`for` iterates over a collection. `enumerate` adds an index, while `range` generates a sequence of numbers.",
      },
      code: {
        lang: "py",
        src: `languages = ["Python", "SQL", "JavaScript"]

for index, language in enumerate(languages, start=1):
    print(f"{index}. {language}")

for number in range(3):
    print(number)  # 0, 1, 2`,
      },
    },
    {
      id: "functions",
      title: { uk: "Функції", en: "Functions" },
      text: {
        uk: "Функція починається з `def`. Значення за замовчуванням робіть незмінними (`None`, числа, рядки), а змінні колекції створюйте всередині.",
        en: "Functions start with `def`. Prefer immutable default values (`None`, numbers, strings), and create mutable collections inside the function.",
      },
      code: {
        lang: "py",
        src: `def greet(name: str, prefix: str = "Привіт") -> str:
    return f"{prefix}, {name}!"


print(greet("Оля"))
print(greet("Максим", prefix="Вітаю"))`,
      },
    },
    {
      id: "collections",
      title: { uk: "Списки, словники та генератори", en: "Lists, dictionaries and comprehensions" },
      text: {
        uk: "Список зберігає впорядковані значення, словник — пари ключ-значення. Генератори колекцій створюють нову колекцію з короткого виразу.",
        en: "A list stores ordered values; a dictionary stores key-value pairs. Comprehensions build a collection from a concise expression.",
      },
      code: {
        lang: "py",
        src: `numbers = [1, 2, 3, 4]
squares = [number**2 for number in numbers]
even_squares = [number**2 for number in numbers if number % 2 == 0]

user = {"name": "Оля", "active": True}
name = user.get("name", "Гість")

print(squares)       # [1, 4, 9, 16]
print(even_squares)  # [4, 16]`,
      },
    },
    {
      id: "exceptions",
      title: { uk: "Обробка помилок", en: "Handling errors" },
      text: {
        uk: "Обробляйте очікувані помилки конкретними типами. `else` виконується, якщо помилки не було; `finally` — завжди.",
        en: "Catch expected errors by their specific type. `else` runs when there was no error; `finally` always runs.",
      },
      code: {
        lang: "py",
        src: `value = "42"

try:
    number = int(value)
except ValueError:
    print("Потрібно ввести ціле число")
else:
    print(number)
finally:
    print("Перевірку завершено")`,
      },
    },
    {
      id: "files",
      title: { uk: "Файли та контекстний менеджер", en: "Files and context managers" },
      text: {
        uk: "`with` автоматично закриває файл навіть у разі помилки. Явно вказуйте кодування для текстових файлів.",
        en: "`with` closes the file automatically, even if an error occurs. Set the encoding explicitly for text files.",
      },
      code: {
        lang: "py",
        src: `from pathlib import Path

path = Path("notes.txt")
path.write_text("План на день", encoding="utf-8")

with path.open(encoding="utf-8") as file:
    contents = file.read()

print(contents)`,
      },
    },
    {
      id: "virtual-environment",
      title: { uk: "Віртуальне середовище", en: "Virtual environments" },
      text: {
        uk: "Віртуальне середовище ізолює залежності конкретного проєкту. Створюйте його в корені проєкту й не додавайте папку `.venv` до Git.",
        en: "A virtual environment isolates a project's dependencies. Create it in the project root and keep `.venv` out of Git.",
      },
      code: {
        lang: "sh",
        src: `python -m venv .venv
source .venv/bin/activate          # macOS / Linux
# .venv\\Scripts\\activate          # Windows
python -m pip install requests
python -m pip freeze > requirements.txt`,
      },
    },
  ],
});
