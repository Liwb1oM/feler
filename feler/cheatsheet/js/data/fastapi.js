(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "fastapi",
  icon: "API",
  title: { uk: "FastAPI", en: "FastAPI" },
  intro: {
    uk: "Швидкий довідник з побудови Python API: маршрути, параметри, Pydantic-моделі, помилки та запуск.",
    en: "A quick guide to Python APIs: routes, parameters, Pydantic models, errors and running the app.",
  },
  items: [
    {
      id: "app-routes",
      title: { uk: "Застосунок і маршрути", en: "Application and routes" },
      text: {
        uk: "Створи екземпляр `FastAPI` і прив'яжи функції до HTTP-методів декораторами. Словники та моделі відповіді серіалізуються у JSON.",
        en: "Create a `FastAPI` instance and bind functions to HTTP methods with decorators. Dictionaries and response models are serialized as JSON.",
      },
      code: {
        lang: "py",
        file: "main.py",
        src: `from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}`,
      },
      tip: {
        uk: "Для нових async-бібліотек оголошуй маршрут як `async def`; для звичайного блокувального коду підійде `def`.",
        en: "Use `async def` for async libraries; ordinary blocking code can use `def`.",
      },
    },
    {
      id: "parameters",
      title: { uk: "Параметри шляху й запиту", en: "Path and query parameters" },
      text: {
        uk: "Значення в `{}` у шляху стають параметрами функції. Інші прості параметри читаються з query-рядка; типи й значення за замовчуванням описують очікування API.",
        en: "Values in `{}` in the path become function parameters. Other simple parameters come from the query string; types and defaults describe the API contract.",
      },
      code: {
        lang: "py",
        src: `@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# GET /items/7?q=book`,
      },
    },
    {
      id: "models",
      title: { uk: "Pydantic-моделі й тіло запиту", en: "Pydantic models and request bodies" },
      text: {
        uk: "Pydantic-модель задає форму JSON-даних. FastAPI перевіряє типи перед викликом функції та формує зрозумілу помилку валідації для неправильного запиту.",
        en: "A Pydantic model defines the JSON shape. FastAPI validates types before calling the function and returns a structured validation error for invalid input.",
      },
      code: {
        lang: "py",
        src: `from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str
    price: float

@app.post("/items")
def create_item(item: ItemCreate):
    return {"name": item.name, "price": item.price}`,
      },
      tip: {
        uk: "Визначай поля й типи явно; не довіряй автоматично даним, що прийшли від клієнта.",
        en: "Declare fields and types explicitly; do not blindly trust data received from clients.",
      },
    },
    {
      id: "responses-errors",
      title: { uk: "Відповіді та HTTP-помилки", en: "Responses and HTTP errors" },
      text: {
        uk: "Використовуй правильні коди стану. `HTTPException` перериває обробку запиту й повертає клієнту безпечне повідомлення.",
        en: "Use appropriate status codes. `HTTPException` stops request handling and returns a safe message to the client.",
      },
      code: {
        lang: "py",
        src: `from fastapi import HTTPException, status

@app.get("/items/{item_id}")
def read_item(item_id: int):
    item = find_item(item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    return item`,
      },
      warn: {
        uk: "Не повертай клієнту stack trace, секрети чи внутрішні деталі винятку.",
        en: "Do not return stack traces, secrets or internal exception details to clients.",
      },
    },
    {
      id: "run-tests",
      title: { uk: "Запуск і тестування", en: "Run and test" },
      text: {
        uk: "Під час розробки сервер перезапускається при змінах. Тести через `TestClient` перевіряють API без ручного відкриття браузера.",
        en: "During development the server reloads when files change. `TestClient` tests the API without manually opening a browser.",
      },
      code: {
        lang: "sh",
        src: `python -m pip install fastapi uvicorn
uvicorn main:app --reload

# test_app.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}`,
      },
      tip: {
        uk: "Не вмикай `--reload` у production-середовищі.",
        en: "Do not enable `--reload` in production.",
      },
    },
  ],
});
