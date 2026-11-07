(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "django",
  icon: "DJ",
  title: { uk: "Django", en: "Django" },
  intro: {
    uk: "Практичний довідник з Django: URL-маршрути, views, шаблони, ORM, форми та JSON API.",
    en: "A practical Django guide: URL routes, views, templates, the ORM, forms and JSON APIs.",
  },
  items: [
    {
      id: "project-setup",
      title: { uk: "Створення проєкту", en: "Create a project" },
      text: {
        uk: "Віртуальне середовище ізолює залежності проєкту. Команда startproject створює конфігурацію, а startapp — окремий застосунок для функцій сайту.",
        en: "A virtual environment isolates project dependencies. startproject creates configuration, while startapp creates an app for site features.",
      },
      code: {
        lang: "sh",
        src: `python -m venv .venv
python -m pip install django
django-admin startproject config .
python manage.py startapp notes
python manage.py runserver`,
      },
      tip: {
        uk: "Додай назву застосунку до INSTALLED_APPS у settings.py.",
        en: "Add the app name to INSTALLED_APPS in settings.py.",
      },
    },
    {
      id: "urls-views",
      title: { uk: "URL-маршрути й views", en: "URL routes and views" },
      text: {
        uk: "URLconf зіставляє адресу з view-функцією. View приймає об'єкт запиту й повертає відповідь; include допомагає розділити маршрути за застосунками.",
        en: "A URLconf maps a path to a view. A view accepts a request and returns a response; include helps split routes by app.",
      },
      code: {
        lang: "py",
        file: "notes/urls.py",
        src: `from django.http import JsonResponse
from django.urls import path

def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("health/", health, name="health"),
]`,
      },
      tip: {
        uk: "Під'єднай app-маршрути в головному urls.py через path(\"\", include(\"notes.urls\")).",
        en: "Connect app routes in the root urls.py with path(\"\", include(\"notes.urls\")).",
      },
    },
    {
      id: "templates",
      title: { uk: "Шаблони й контекст", en: "Templates and context" },
      text: {
        uk: "render() знаходить шаблон, передає йому контекст і створює HTTP-відповідь. У шаблоні змінні виводяться подвійними фігурними дужками.",
        en: "render() finds a template, passes it context and creates an HTTP response. Template variables use double curly braces.",
      },
      code: {
        lang: "py",
        file: "views.py",
        src: `from django.shortcuts import render

def home(request):
    return render(request, "notes/home.html", {
        "title": "Мої нотатки",
    })`,
      },
    },
    {
      id: "models-orm",
      title: { uk: "Моделі й ORM", en: "Models and the ORM" },
      text: {
        uk: "Модель описує дані, які Django зберігатиме в таблиці. Після зміни моделей створи й застосуй міграції; ORM формує запити без ручного SQL.",
        en: "A model describes data Django stores in a table. Create and apply migrations after model changes; the ORM builds queries without handwritten SQL.",
      },
      code: {
        lang: "py",
        file: "models.py",
        src: `from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# python manage.py makemigrations
# python manage.py migrate
# Note.objects.filter(title__icontains="django")`,
      },
      warn: {
        uk: "Не вставляй користувацькі значення в SQL-рядок вручну. Використовуй ORM або параметризовані запити.",
        en: "Do not interpolate user values into SQL strings. Use the ORM or parameterized queries.",
      },
    },
    {
      id: "forms-validation",
      title: { uk: "Форми й валідація", en: "Forms and validation" },
      text: {
        uk: "Django Form централізує перевірку введених даних. Після is_valid() очищені значення доступні в cleaned_data.",
        en: "A Django Form centralizes input validation. After is_valid(), cleaned values are available in cleaned_data.",
      },
      code: {
        lang: "py",
        src: `from django import forms

class NoteForm(forms.Form):
    title = forms.CharField(max_length=200)

def create_note(request):
    form = NoteForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        title = form.cleaned_data["title"]
        # Збережи перевірене значення
    return render(request, "notes/form.html", {"form": form})`,
      },
    },
    {
      id: "json-api",
      title: { uk: "JSON API", en: "JSON API" },
      text: {
        uk: "JsonResponse перетворює словник на JSON. Для масиву задай safe=False; метод запиту варто перевіряти до обробки даних.",
        en: "JsonResponse serializes a dictionary as JSON. Set safe=False for a list, and check the request method before processing data.",
      },
      code: {
        lang: "py",
        file: "views.py",
        src: `from django.http import JsonResponse
from django.views.decorators.http import require_GET

@require_GET
def notes_api(request):
    items = [{"id": 1, "title": "Перша нотатка"}]
    return JsonResponse(items, safe=False)`,
      },
      tip: {
        uk: "Для повноцінного REST API з автентифікацією та серіалізаторами розглянь Django REST Framework.",
        en: "For a full REST API with authentication and serializers, consider Django REST Framework.",
      },
    },
  ],
});
