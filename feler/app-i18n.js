(() => {
    const messages = {
        uk: {
            goalLabel: "ТВОЯ ЦІЛЬ",
            personalPlanEyebrow: "ПЛАН ПІД ТЕБЕ",
            personalPlanTitle: "Навчайся у власному темпі",
            planChooseGoal: "Обери мету в профілі — Feler запропонує маршрут і коротку щоденну ціль.",
            planWeb: "Твій план: HTML → CSS → JavaScript. Приділяй навчанню {minutes} хв на день.",
            planBackend: "Твій план: Python → FastAPI → C#. Приділяй навчанню {minutes} хв на день.",
            planData: "Твій план: Python → SQL → JavaScript. Приділяй навчанню {minutes} хв на день.",
            startPlan: "Почати маршрут",
            projectEyebrow: "НАВЧАННЯ ЧЕРЕЗ ПРАКТИКУ",
            projectsTitle: "Збери свій перший проєкт",
            projectProfileTitle: "Картка портфоліо",
            projectProfileDescription: "Зроби власну сторінку профілю з описом і посиланнями.",
            projectFizzTitle: "Гра FizzBuzz",
            projectFizzDescription: "Потренуй цикли й умови на маленькому завданні.",
            projectPythonTitle: "Фільтр чисел на Python",
            projectPythonDescription: "Напиши програму, яка знаходить парні числа.",
            projectStart: "Почати мініпроєкт →",
            projectContinue: "Продовжити мініпроєкт →",
            projectCompleted: "Мініпроєкт завершено ✓",
            finalProject: "Фінальний мініпроєкт",
            profileEyebrow: "ТВІЙ ПРОФІЛЬ",
            profileTitle: "Мій профіль",
            profileDescription: "Переглядай свій навчальний прогрес і налаштуй щоденну ціль. Після входу профіль і прогрес зберігаються в акаунті.",
            profileLessonsStat: "Уроків завершено",
            profileTracksStat: "Маршрутів завершено",
            profileStreakStat: "Днів поспіль",
            profileNameLabel: "Як до тебе звертатися",
            profileCharacterTitle: "Створи свого персонажа",
            profileCharacterHint: "Налаштуй зовнішність — зміни одразу з'являться на аватарі.",
            characterSkinLabel: "Тон шкіри",
            characterSkinLight: "Світлий",
            characterSkinMedium: "Середній",
            characterSkinDeep: "Темний",
            characterHairLabel: "Зачіска",
            characterHairShort: "Коротка",
            characterHairCurly: "Кучерява",
            characterHairLong: "Довга",
            characterHairColorLabel: "Колір волосся",
            characterHairBrown: "Каштановий",
            characterHairBlack: "Чорний",
            characterHairBlonde: "Блонд",
            characterHairBlue: "Синій",
            characterOutfitLabel: "Колір худі",
            characterOutfitGreen: "Зелений",
            characterOutfitBlue: "Синій",
            characterOutfitViolet: "Фіолетовий",
            characterOutfitCoral: "Кораловий",
            characterAccessoryLabel: "Аксесуар",
            characterAccessoryNone: "Без аксесуара",
            characterAccessoryGlasses: "Окуляри",
            characterAccessoryHeadphones: "Навушники",
            profileGoalLabel: "Що хочеш навчитися створювати?",
            profileMinutesLabel: "Щоденна ціль",
            profileDarkMode: "Темний режим",
            saveProfile: "Зберегти налаштування",
            openAccount: "Увійти / створити акаунт",
            manageAccount: "Керування акаунтом",
            profileSavedGuest: "Профіль збережено в цьому браузері.",
            profileSavedAccount: "Профіль збережено в акаунті Supabase.",
            profileSaveError: "Не вдалося зберегти профіль в акаунті: {message}",
            profileStorageError: "Не вдалося зберегти профіль у цьому браузері.",
            profileGoalWeb: "Сайти та інтерфейси",
            profileGoalBackend: "API та сервери",
            profileGoalData: "Програми й робота з даними",
            minutes10: "10 хвилин",
            minutes20: "20 хвилин",
            minutes30: "30 хвилин",
            studyGoalWeb: "Створювати сайти",
            studyGoalBackend: "Створювати API та сервери",
            studyGoalData: "Працювати з даними",
            profileDefaultName: "Користувач",
            profileGuestAccount: "Гостьовий режим · лише цей браузер",
            guestProgress: "Гостьовий прогрес",
            syncedProgress: "Прогрес синхронізується",
            journey: "Мій маршрут",
            languages: "Мови",
            sandbox: "Пісочниця",
            cheatsheet: "Шпаргалка",
            interfaceLanguage: "Мова інтерфейсу",
            close: "Закрити",
            welcomeTitle: "Привіт, творцю",
            welcomeCopy: "Сьогодні — чудовий день, щоб написати перший рядок коду.",
            gateTitle: "Що будемо створювати?",
            gateIntro: "Обери мову або технологію. Почнемо з Hello, World! і одразу перейдемо до коду.",
            gateEyebrow: "ТВОЯ НАВЧАЛЬНА МАЙСТЕРНЯ",
            routeSearch: "Знайти мову або тему",
            topicFilter: "Тема",
            allTopics: "Усі теми",
            webTopic: "Веб",
            backendTopic: "Бекенд",
            dataTopic: "Дані",
            logicTopic: "Логіка",
            levelFilter: "Рівень",
            anyLevel: "Будь-який",
            beginnerLevel: "Початковий",
            intermediateLevel: "Середній",
            durationFilter: "Тривалість",
            anyDuration: "Будь-яка",
            under30: "До 30 хв",
            over30: "Понад 30 хв",
            directionsEyebrow: "ЗНАЙДИ СВІЙ ШЛЯХ",
            directionsTitle: "Куди веде код?",
            directionsIntro: "Обери напрям — почати можна з нуля.",
            coursesEyebrow: "МАРШРУТ НАВЧАННЯ",
            coursesTitle: "Обери наступний крок",
            searchLesson: "Знайти урок",
            sandboxTitle: "Пісочниця коду",
            streakLabel: "днів поспіль",
            changeTrack: "Змінити мову",
            featureTag: "ПРОДОВЖУЙ НАВЧАННЯ",
            featureStart: "Веб починається",
            featureJoin: "з",
            featureOneLine: "одного рядка.",
            featureDescription: "Збери свій перший інтерактивний сайт — крок за кроком, без зайвої теорії.",
            featureButton: "До уроків",
            imageCaption: "Твій наступний проєкт чекає",
            frontend: "Фронтенд",
            frontendKicker: "01 · ІНТЕРФЕЙСИ",
            frontendDescription: "Створюй сторінки, якими зручно користуватися.",
            backend: "Бекенд",
            backendKicker: "02 · СЕРВЕРИ Й ДАНІ",
            backendDescription: "Розбирайся, як працюють API, сервери та бази даних.",
            pythonDirection: "Python і дані",
            pythonKicker: "03 · АВТОМАТИЗАЦІЯ",
            pythonDescription: "Почни з простих програм і досліджуй дані.",
            starterGreeting: "Привіт!",
            resetExample: "Відновити приклад",
            runCheck: "Запустити й перевірити",
            preview: "Попередній перегляд",
            console: "Консоль",
            allLessons: "Усі теми",
            filterFrontend: "Фронтенд",
            filterBackend: "Бекенд",
            emptyCourses: "За цим запитом уроків не знайдено.",
            emptyTracks: "За цими фільтрами маршрутів не знайдено.",
            badgeFirst: "Перший крок",
            badgeFirstDescription: "Зарахуй перший урок.",
            badgeCurious: "Допитливий",
            badgeCuriousDescription: "Пройди 5 вікторин.",
            badgeFinisher: "Фінішер",
            badgeFinisherDescription: "Заверши будь-який маршрут.",
            badgeMaster: "Майстер маршрутів",
            badgeMasterDescription: "Заверши 3 маршрути.",
            lessonDone: "Урок завершено",
            lessonNotStarted: "Ще не розпочато"
        },
        en: {
            goalLabel: "YOUR GOAL",
            personalPlanEyebrow: "YOUR PERSONAL PLAN",
            personalPlanTitle: "Learn at your own pace",
            planChooseGoal: "Choose a goal in your profile and Feler will suggest a route and a small daily target.",
            planWeb: "Your plan: HTML → CSS → JavaScript. Learn for {minutes} minutes a day.",
            planBackend: "Your plan: Python → FastAPI → C#. Learn for {minutes} minutes a day.",
            planData: "Your plan: Python → SQL → JavaScript. Learn for {minutes} minutes a day.",
            startPlan: "Start learning",
            projectEyebrow: "LEARN BY BUILDING",
            projectsTitle: "Build your first project",
            projectProfileTitle: "Portfolio card",
            projectProfileDescription: "Create a profile page with a short bio and links.",
            projectFizzTitle: "FizzBuzz game",
            projectFizzDescription: "Practice loops and conditions with a small challenge.",
            projectPythonTitle: "Python number filter",
            projectPythonDescription: "Write a program that finds even numbers.",
            projectStart: "Start mini project →",
            projectContinue: "Continue mini project →",
            projectCompleted: "Mini project completed ✓",
            finalProject: "Final mini project",
            profileEyebrow: "YOUR PROFILE",
            profileTitle: "My profile",
            profileDescription: "Review your learning progress and set a daily goal. When signed in, your profile and progress are saved to your account.",
            profileLessonsStat: "Lessons completed",
            profileTracksStat: "Paths completed",
            profileStreakStat: "Day streak",
            profileNameLabel: "What should we call you?",
            profileCharacterTitle: "Create your character",
            profileCharacterHint: "Customize the look — changes appear on your avatar right away.",
            characterSkinLabel: "Skin tone",
            characterSkinLight: "Light",
            characterSkinMedium: "Medium",
            characterSkinDeep: "Deep",
            characterHairLabel: "Hairstyle",
            characterHairShort: "Short",
            characterHairCurly: "Curly",
            characterHairLong: "Long",
            characterHairColorLabel: "Hair color",
            characterHairBrown: "Brown",
            characterHairBlack: "Black",
            characterHairBlonde: "Blonde",
            characterHairBlue: "Blue",
            characterOutfitLabel: "Hoodie color",
            characterOutfitGreen: "Green",
            characterOutfitBlue: "Blue",
            characterOutfitViolet: "Violet",
            characterOutfitCoral: "Coral",
            characterAccessoryLabel: "Accessory",
            characterAccessoryNone: "None",
            characterAccessoryGlasses: "Glasses",
            characterAccessoryHeadphones: "Headphones",
            profileGoalLabel: "What would you like to build?",
            profileMinutesLabel: "Daily goal",
            profileDarkMode: "Dark mode",
            saveProfile: "Save settings",
            openAccount: "Sign in / create account",
            manageAccount: "Manage account",
            profileSavedGuest: "Profile saved in this browser.",
            profileSavedAccount: "Profile saved to your Supabase account.",
            profileSaveError: "Could not save your account profile: {message}",
            profileStorageError: "Could not save the profile in this browser.",
            profileGoalWeb: "Websites and interfaces",
            profileGoalBackend: "APIs and servers",
            profileGoalData: "Apps and working with data",
            minutes10: "10 minutes",
            minutes20: "20 minutes",
            minutes30: "30 minutes",
            studyGoalWeb: "Build websites",
            studyGoalBackend: "Build APIs and servers",
            studyGoalData: "Work with data",
            profileDefaultName: "User",
            profileGuestAccount: "Guest mode · this browser only",
            guestProgress: "Guest progress",
            syncedProgress: "Progress syncing",
            journey: "My learning path",
            languages: "Languages",
            sandbox: "Sandbox",
            cheatsheet: "Cheatsheet",
            interfaceLanguage: "Interface language",
            close: "Close",
            welcomeTitle: "Hello, creator",
            welcomeCopy: "Today is a great day to write your first line of code.",
            gateTitle: "What will we build?",
            gateIntro: "Choose a language or technology. Start with Hello, World! and move straight to code.",
            gateEyebrow: "YOUR LEARNING WORKSHOP",
            routeSearch: "Find a language or topic",
            topicFilter: "Topic",
            allTopics: "All topics",
            webTopic: "Web",
            backendTopic: "Backend",
            dataTopic: "Data",
            logicTopic: "Logic",
            levelFilter: "Level",
            anyLevel: "Any level",
            beginnerLevel: "Beginner",
            intermediateLevel: "Intermediate",
            durationFilter: "Duration",
            anyDuration: "Any duration",
            under30: "Under 30 min",
            over30: "Over 30 min",
            directionsEyebrow: "FIND YOUR PATH",
            directionsTitle: "Where can code take you?",
            directionsIntro: "Choose a path — you can start from scratch.",
            coursesEyebrow: "LEARNING PATH",
            coursesTitle: "Choose your next step",
            searchLesson: "Find a lesson",
            sandboxTitle: "Code sandbox",
            streakLabel: "day streak",
            changeTrack: "Change language",
            featureTag: "KEEP LEARNING",
            featureStart: "The web begins",
            featureJoin: "with",
            featureOneLine: "one line.",
            featureDescription: "Build your first interactive website step by step, without unnecessary theory.",
            featureButton: "Go to lessons",
            imageCaption: "Your next project is waiting",
            frontend: "Frontend",
            frontendKicker: "01 · INTERFACES",
            frontendDescription: "Create pages that are easy to use.",
            backend: "Backend",
            backendKicker: "02 · SERVERS & DATA",
            backendDescription: "Learn how APIs, servers and databases work.",
            pythonDirection: "Python and data",
            pythonKicker: "03 · AUTOMATION",
            pythonDescription: "Start with small programs and explore data.",
            starterGreeting: "Hello!",
            resetExample: "Reset example",
            runCheck: "Run and check",
            preview: "Preview",
            console: "Console",
            allLessons: "All topics",
            filterFrontend: "Frontend",
            filterBackend: "Backend",
            emptyCourses: "No lessons found for this search.",
            emptyTracks: "No learning paths match these filters.",
            badgeFirst: "First step",
            badgeFirstDescription: "Complete your first lesson.",
            badgeCurious: "Curious mind",
            badgeCuriousDescription: "Complete 5 quizzes.",
            badgeFinisher: "Finisher",
            badgeFinisherDescription: "Complete any learning path.",
            badgeMaster: "Path master",
            badgeMasterDescription: "Complete 3 learning paths.",
            lessonDone: "Lesson completed",
            lessonNotStarted: "Not started yet"
        },
    };

    const key = "feler-interface-language-v1";
    let language = "uk";
    try {
        const stored = localStorage.getItem(key);
        if (Object.hasOwn(messages, stored)) language = stored;
        else if (navigator.language?.toLowerCase().startsWith("en")) language = "en";
    } catch {
        language = "uk";
    }

    function t(id, values = {}) {
        let value = messages[language][id] || messages.uk[id] || id;
        for (const [name, replacement] of Object.entries(values)) {
            value = value.replaceAll(`{${name}}`, replacement);
        }
        return value;
    }

    function apply() {
        document.documentElement.lang = language;
        document.querySelectorAll("[data-i18n]").forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
            element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
        });
        document.querySelectorAll("[data-i18n-aria]").forEach(element => {
            element.setAttribute("aria-label", t(element.dataset.i18nAria));
        });
        document.querySelectorAll("[data-i18n-label]").forEach(element => {
            const text = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            if (text) text.textContent = `${t(element.dataset.i18nLabel)} `;
        });
        document.querySelectorAll("[data-i18n-tail]").forEach(element => {
            const text = [...element.childNodes].reverse().find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            if (text) text.textContent = t(element.dataset.i18nTail);
        });
        const picker = document.querySelector("#siteLanguage");
        if (picker) {
            picker.value = language;
            picker.setAttribute("aria-label", t("interfaceLanguage"));
        }
        const search = document.querySelector("#trackSearch");
        if (search) search.setAttribute("aria-label", t("routeSearch"));
        const courseSearch = document.querySelector("#courseSearch");
        if (courseSearch) courseSearch.setAttribute("aria-label", t("searchLesson"));
        document.querySelector("#profileButton")?.setAttribute("aria-label", t("profileTitle"));
        document.querySelector("#profileQuickButton")?.setAttribute("aria-label", t("profileTitle"));
        document.querySelector("#profileClose")?.setAttribute("aria-label", t("close"));
    }

    function setLanguage(next) {
        if (!Object.hasOwn(messages, next)) return;
        language = next;
        try {
            localStorage.setItem(key, next);
        } catch {
            // Language switching still works when storage is unavailable.
        }
        apply();
        window.dispatchEvent(new CustomEvent("feler-language-change", { detail: { language } }));
    }

    window.FelerI18n = { t, apply, setLanguage, get language() { return language; } };
    document.addEventListener("DOMContentLoaded", apply, { once: true });
})();
