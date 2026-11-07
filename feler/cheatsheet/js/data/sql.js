(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "sql",
  icon: "SQL",
  title: { uk: "SQL", en: "SQL" },
  intro: {
    uk: "Основи читання та зміни даних у реляційних базах: запити, групування, JOIN і безпечні оновлення.",
    en: "Relational database essentials: queries, grouping, joins and safe updates.",
  },
  items: [
    {
      id: "select",
      title: { uk: "SELECT та фільтрація", en: "SELECT and filtering" },
      text: {
        uk: "`SELECT` обирає стовпці, `FROM` — таблицю, а `WHERE` залишає лише рядки, що відповідають умові.",
        en: "`SELECT` chooses columns, `FROM` names the table, and `WHERE` keeps only matching rows.",
      },
      code: {
        lang: "sql",
        src: `SELECT name, email
FROM users
WHERE active = TRUE
  AND created_at >= '2025-01-01';`,
      },
      tip: {
        uk: "Вказуйте потрібні стовпці замість `SELECT *`, особливо в запитах для застосунку.",
        en: "Select only the columns you need instead of using `SELECT *`, especially in application queries.",
      },
    },
    {
      id: "sort-limit",
      title: { uk: "Сортування, обмеження та NULL", en: "Sorting, limits and NULL" },
      text: {
        uk: "`ORDER BY` задає порядок, `LIMIT` обмежує кількість рядків (підтримується PostgreSQL, MySQL і SQLite). Для відсутнього значення перевіряйте `IS NULL`, а не `= NULL`.",
        en: "`ORDER BY` sets the order, and `LIMIT` caps the number of rows (supported by PostgreSQL, MySQL and SQLite). Check missing values with `IS NULL`, not `= NULL`.",
      },
      code: {
        lang: "sql",
        src: `SELECT id, name, created_at
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC, id ASC
LIMIT 20;`,
      },
    },
    {
      id: "aggregates",
      title: { uk: "Агрегати та GROUP BY", en: "Aggregates and GROUP BY" },
      text: {
        uk: "Агрегатні функції рахують рядки або підсумовують значення. `WHERE` фільтрує рядки до групування, `HAVING` — готові групи.",
        en: "Aggregate functions count rows or summarize values. `WHERE` filters rows before grouping; `HAVING` filters the resulting groups.",
      },
      code: {
        lang: "sql",
        src: `SELECT department_id, COUNT(*) AS employee_count, AVG(salary) AS average_salary
FROM employees
WHERE active = TRUE
GROUP BY department_id
HAVING COUNT(*) >= 3
ORDER BY average_salary DESC;`,
      },
    },
    {
      id: "joins",
      title: { uk: "JOIN таблиць", en: "Joining tables" },
      text: {
        uk: "`INNER JOIN` повертає збіги з обох таблиць. `LEFT JOIN` залишає всі рядки лівої таблиці, навіть якщо збігу праворуч немає.",
        en: "`INNER JOIN` returns matching rows from both tables. `LEFT JOIN` keeps every row from the left table even when there is no right-side match.",
      },
      code: {
        lang: "sql",
        src: `SELECT orders.id, customers.name, orders.total
FROM orders
INNER JOIN customers ON customers.id = orders.customer_id
WHERE orders.status = 'paid'
ORDER BY orders.id DESC;`,
      },
    },
    {
      id: "insert-update-delete",
      title: { uk: "INSERT, UPDATE та DELETE", en: "INSERT, UPDATE and DELETE" },
      text: {
        uk: "Зміни в таблицях роблять відповідними командами. Перед `UPDATE` або `DELETE` перевірте умову окремим `SELECT`, щоб переконатися, що вона вибирає потрібні рядки.",
        en: "Use the matching command to change table data. Before `UPDATE` or `DELETE`, test the condition with a `SELECT` to verify it targets the intended rows.",
      },
      code: {
        lang: "sql",
        src: `INSERT INTO users (name, email)
VALUES ('Оля', 'olia@example.com');

UPDATE users
SET active = FALSE
WHERE id = 42;

DELETE FROM sessions
WHERE expires_at < CURRENT_TIMESTAMP;`,
      },
      warn: {
        uk: "Без `WHERE` команда `UPDATE` змінить усі рядки, а `DELETE` видалить їх усі.",
        en: "Without `WHERE`, `UPDATE` changes every row and `DELETE` removes every row.",
      },
    },
    {
      id: "parameters",
      title: { uk: "Параметризовані запити", en: "Parameterized queries" },
      text: {
        uk: "Передавайте введення користувача окремими параметрами драйвера бази даних, а не вставляйте його в текст SQL. Синтаксис плейсхолдерів залежить від драйвера.",
        en: "Pass user input as separate database-driver parameters instead of inserting it into SQL text. Placeholder syntax depends on the driver.",
      },
      code: {
        lang: "py",
        src: `# Python sqlite3: значення передається окремо від SQL
cursor.execute(
    "SELECT id, name FROM users WHERE email = ?",
    (email,),
)
user = cursor.fetchone()`,
      },
      tip: {
        uk: "Параметри захищають значення, але не назви таблиць чи стовпців. Для динамічних назв використовуйте явний список дозволених варіантів.",
        en: "Parameters protect values, not table or column names. Use an explicit allowlist for dynamic identifiers.",
      },
    },
    {
      id: "transactions",
      title: { uk: "Транзакції", en: "Transactions" },
      text: {
        uk: "Транзакція об'єднує пов'язані зміни: або фіксуються всі, або жодна. Після успіху виконайте `COMMIT`, у разі проблеми — `ROLLBACK`.",
        en: "A transaction groups related changes: either all are saved or none are. Run `COMMIT` on success and `ROLLBACK` if something goes wrong.",
      },
      code: {
        lang: "sql",
        src: `BEGIN;

UPDATE accounts
SET balance = balance - 50
WHERE id = 1;

UPDATE accounts
SET balance = balance + 50
WHERE id = 2;

COMMIT;`,
      },
    },
  ],
});
