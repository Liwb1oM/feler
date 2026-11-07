(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "tools",
  icon: "DEV",
  title: { uk: "Git та інструменти", en: "Git and tools" },
  intro: {
    uk: "Дрібниці, без яких не обійтись у щоденній роботі: Git, npm, DevTools, деплой на GitHub Pages.",
    en: "The small things you need every day: Git, npm, DevTools, deploying to GitHub Pages.",
  },
  items: [
    {
      id: "git-daily",
      title: { uk: "Git: щоденні команди", en: "Git: daily commands" },
      text: {
        uk: "Цикл роботи: змінили файли, подивились статус, додали в індекс, зробили коміт, відправили на GitHub.",
        en: "The work loop: change files, check status, stage, commit, push to GitHub.",
      },
      code: {
        lang: "sh",
        src: `git clone https://github.com/user/repo.git   # скопіювати репозиторій
git status                                    # що змінилось
git add .                                     # додати все в індекс
git commit -m "feat: add search"              # зафіксувати
git push                                      # відправити на GitHub
git pull                                      # забрати чужі зміни
git log --oneline -10                         # останні коміти
git diff                                      # детальні зміни`,
      },
    },
    {
      id: "git-branches",
      title: { uk: "Гілки та Pull Request", en: "Branches and Pull Requests" },
      text: {
        uk: "Не працюйте напряму в `main`. Робіть окрему гілку на кожну задачу, відправляйте її на GitHub і відкривайте Pull Request.",
        en: "Don't work directly on `main`. Make a separate branch per task, push it to GitHub and open a Pull Request.",
      },
      code: {
        lang: "sh",
        src: `git switch -c feature/search      # створити гілку й перейти на неї
git switch main                   # повернутись на main
git push -u origin feature/search # перший push гілки
git merge main                    # підтягнути main у свою гілку
git stash                         # сховати незакомічені зміни
git stash pop                     # повернути їх`,
      },
    },
    {
      id: "git-undo",
      title: { uk: "Git: скасування змін", en: "Git: undoing things" },
      text: {
        uk: "Перед небезпечними командами перевіряйте `git status`. Команди з `--hard` видаляють незбережену роботу безповоротно.",
        en: "Check `git status` before dangerous commands. Commands with `--hard` delete unsaved work irreversibly.",
      },
      code: {
        lang: "sh",
        src: `git restore file.txt              # скасувати зміни у файлі
git restore --staged file.txt     # прибрати файл з індексу
git commit --amend                # виправити останній коміт
git revert <hash>                 # створити коміт, що скасовує інший
git reset --hard HEAD             # ⚠ відкинути ВСІ локальні зміни`,
      },
      warn: {
        uk: "Не робіть `git push --force` у спільні гілки.",
        en: "Never `git push --force` to shared branches.",
      },
    },
    {
      id: "gitignore",
      title: { uk: ".gitignore", en: ".gitignore" },
      text: {
        uk: "Не комітьте залежності, збірку та секрети. Файл `.env` із ключами ніколи не повинен потрапляти в репозиторій.",
        en: "Don't commit dependencies, build output or secrets. A `.env` file with keys must never end up in the repository.",
      },
      code: {
        lang: "text",
        file: ".gitignore",
        src: `node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vscode/*
!.vscode/extensions.json`,
      },
    },
    {
      id: "commits",
      title: { uk: "Повідомлення комітів", en: "Commit messages" },
      text: {
        uk: "Договір Conventional Commits робить історію читабельною: `тип: короткий опис`.",
        en: "Conventional Commits keep history readable: `type: short description`.",
      },
      code: {
        lang: "text",
        src: `feat: add language switcher
fix: copy button on Safari
docs: update README
style: format code
refactor: split highlight into module
test: add search tests
chore: update dependencies`,
      },
    },
    {
      id: "npm",
      title: { uk: "npm: основні команди", en: "npm: essential commands" },
      text: {
        uk: "`package.json` описує проєкт і скрипти, `package-lock.json` фіксує точні версії (його комітять). `-D` ставить залежність лише для розробки.",
        en: "`package.json` describes the project and scripts, `package-lock.json` pins exact versions (commit it). `-D` installs a dev-only dependency.",
      },
      code: {
        lang: "sh",
        src: `npm install               # поставити все з package.json
npm install clsx          # додати залежність
npm install -D typescript # залежність для розробки
npm uninstall clsx        # видалити
npm run dev               # запустити скрипт з package.json
npm ci                    # чиста установка за lock-файлом (для CI)
npx serve .               # одноразово запустити пакет (локальний сервер)`,
      },
    },
    {
      id: "devtools",
      title: { uk: "DevTools: гарячі клавіші та поради", en: "DevTools: shortcuts and tips" },
      text: {
        uk: "Відкриття: `F12` або `Ctrl/Cmd + Shift + I`. Вкладка Elements показує DOM і стилі, Console — помилки, Network — запити, Application — localStorage і service worker. Режим пристроїв: `Ctrl/Cmd + Shift + M`.",
        en: "Open with `F12` or `Ctrl/Cmd + Shift + I`. Elements shows the DOM and styles, Console shows errors, Network shows requests, Application shows localStorage and service workers. Device mode: `Ctrl/Cmd + Shift + M`.",
      },
      code: {
        lang: "js",
        src: `console.log(value);
console.table(users);          // масив об'єктів як таблиця
console.error("Щось не так");
console.time("load"); /* … */ console.timeEnd("load");
debugger;                      // зупинка виконання в DevTools`,
      },
    },
    {
      id: "gh-pages",
      title: { uk: "Деплой на GitHub Pages", en: "Deploy to GitHub Pages" },
      text: {
        uk: "У репозиторії відкрийте Settings → Pages → Source: GitHub Actions. Далі кожен push у `main` автоматично публікує сайт. Для чистого HTML/CSS/JS збірка не потрібна, а для Vite додайте крок `npm ci && npm run build` і публікуйте папку `dist`.",
        en: "In the repository open Settings → Pages → Source: GitHub Actions. Then every push to `main` publishes the site automatically. Plain HTML/CSS/JS needs no build; for Vite add a `npm ci && npm run build` step and publish the `dist` folder.",
      },
      code: {
        lang: "text",
        file: ".github/workflows/pages.yml",
        src: `name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4`,
      },
    },
  ],
});
