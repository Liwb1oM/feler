(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "csharp",
  icon: "C#",
  title: { uk: "C# і .NET", en: "C# and .NET" },
  intro: {
    uk: "Основи C#: типи, умови, цикли, методи й невеликий HTTP API на ASP.NET Core.",
    en: "C# essentials: types, conditions, loops, methods and a small ASP.NET Core HTTP API.",
  },
  items: [
    {
      id: "variables-types",
      title: { uk: "Змінні та типи", en: "Variables and types" },
      text: {
        uk: "C# — статично типізована мова. `var` просить компілятор вивести тип із початкового значення; явні типи корисні для чіткого контракту.",
        en: "C# is statically typed. `var` asks the compiler to infer a type from the initial value; explicit types make contracts clear.",
      },
      code: {
        lang: "cs",
        file: "Program.cs",
        src: `string name = "Ada";
int age = 30;
decimal price = 19.99m;
bool isActive = true;

Console.WriteLine($"Hello, {name}!");`,
      },
      tip: {
        uk: "Для грошових сум використовуй `decimal`, а не `float` чи `double`.",
        en: "Use `decimal` for monetary values rather than `float` or `double`.",
      },
    },
    {
      id: "conditions-loops",
      title: { uk: "Умови й цикли", en: "Conditions and loops" },
      text: {
        uk: "`if` обирає гілку коду за умовою. `foreach` зручний для перебору кожного елемента колекції.",
        en: "`if` selects a branch based on a condition. `foreach` is convenient for iterating over each collection item.",
      },
      code: {
        lang: "cs",
        src: `int[] scores = [10, 7, 9];

foreach (int score in scores)
{
    if (score >= 8)
    {
        Console.WriteLine($"Pass: {score}");
    }
}`,
      },
    },
    {
      id: "methods",
      title: { uk: "Методи", en: "Methods" },
      text: {
        uk: "Метод має тип результату, назву та параметри. `return` повертає значення; `void` означає, що методу не потрібно повертати результат.",
        en: "A method has a return type, name and parameters. `return` produces a value; `void` means the method has no result to return.",
      },
      code: {
        lang: "cs",
        src: `static int Double(int number)
{
    return number * 2;
}

Console.WriteLine(Double(6)); // 12`,
      },
    },
    {
      id: "collections-null",
      title: { uk: "Колекції й nullable-значення", en: "Collections and nullable values" },
      text: {
        uk: "Колекції зберігають групи значень. Nullable-тип `string?` явно дозволяє відсутнє значення; перевір його до використання.",
        en: "Collections store groups of values. The nullable type `string?` explicitly allows a missing value; check it before use.",
      },
      code: {
        lang: "cs",
        src: `List<string> languages = ["C#", "Python"];
string? nickname = null;

if (nickname is not null)
{
    Console.WriteLine(nickname.ToUpperInvariant());
}

languages.Add("SQL");`,
      },
    },
    {
      id: "aspnet-minimal-api",
      title: { uk: "ASP.NET Core Minimal API", en: "ASP.NET Core Minimal API" },
      text: {
        uk: "Minimal API дозволяє оголосити HTTP-маршрути без окремих класів контролерів. Перевіряй введення й повертай відповідний HTTP-результат.",
        en: "Minimal APIs define HTTP routes without separate controller classes. Validate input and return an appropriate HTTP result.",
      },
      code: {
        lang: "cs",
        file: "Program.cs",
        src: `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/items/{id:int}", (int id) =>
    id > 0
        ? Results.Ok(new { id })
        : Results.BadRequest());

app.Run();`,
      },
      warn: {
        uk: "Не зберігай ключі чи паролі в коді або репозиторії. Production-секрети передавай через захищене сховище конфігурації.",
        en: "Do not store keys or passwords in source code or a repository. Provide production secrets through a secure configuration store.",
      },
    },
  ],
});
