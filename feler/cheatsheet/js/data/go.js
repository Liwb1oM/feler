(window.CHEATSHEET = window.CHEATSHEET || { sections: [] }).sections.push({
  id: "go",
  icon: "Go",
  title: { uk: "Go", en: "Go" },
  intro: {
    uk: "Короткий довідник з Go: оголошення змінних, функції, структури, помилки, горутини й HTTP-сервер.",
    en: "A concise Go guide: variables, functions, structs, errors, goroutines and an HTTP server.",
  },
  items: [
    {
      id: "program-variables",
      title: { uk: "Програма й змінні", en: "Program and variables" },
      text: {
        uk: "Виконувана програма має package main і функцію main. Коротке оголошення := виводить тип змінної; імпортовані, але невикористані пакети спричиняють помилку компіляції.",
        en: "An executable program has package main and a main function. The := short declaration infers a variable's type; unused imports cause a compile error.",
      },
      code: {
        lang: "go",
        file: "main.go",
        src: `package main

import "fmt"

func main() {
    name := "Ada"
    fmt.Printf("Hello, %s!\\n", name)
}`,
      },
    },
    {
      id: "functions",
      title: { uk: "Функції й кілька результатів", en: "Functions and multiple results" },
      text: {
        uk: "Типи параметрів указують після назв, а тип результату — після дужок. Функція Go може повертати кілька значень, що часто використовують для результату й помилки.",
        en: "Parameter types follow their names, and the result type follows the parentheses. Go functions can return multiple values, often a result and an error.",
      },
      code: {
        lang: "go",
        src: `func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

result, err := divide(12, 3)
if err != nil {
    log.Fatal(err)
}
fmt.Println(result)`,
      },
      tip: {
        uk: "Обробляй помилку одразу після виклику; не відкидай її мовчки.",
        en: "Handle an error right after the call; do not silently discard it.",
      },
    },
    {
      id: "struct-methods",
      title: { uk: "Структури й методи", en: "Structs and methods" },
      text: {
        uk: "struct об'єднує поля даних. Методи прив'язуються до типу через receiver; покажчик-receiver дає змогу змінювати отримувач без копіювання структури.",
        en: "A struct groups data fields. Methods attach to a type through a receiver; a pointer receiver can modify the value without copying the struct.",
      },
      code: {
        lang: "go",
        src: `type Counter struct {
    Value int
}

func (c *Counter) Increment() {
    c.Value++
}

counter := Counter{}
counter.Increment()
fmt.Println(counter.Value)`,
      },
    },
    {
      id: "slices-maps",
      title: { uk: "Слайси й мапи", en: "Slices and maps" },
      text: {
        uk: "Слайс — гнучке подання послідовності, а map зберігає пари ключ-значення. append може створити новий слайс, тому збережи його результат.",
        en: "A slice is a flexible view of a sequence, while a map stores key-value pairs. append may create a new slice, so keep its result.",
      },
      code: {
        lang: "go",
        src: `names := []string{"Ada", "Linus"}
names = append(names, "Grace")

scores := map[string]int{
    "Ada": 10,
}
scores["Grace"] = 9

fmt.Println(names, scores["Ada"])`,
      },
    },
    {
      id: "http-server",
      title: { uk: "HTTP-сервер", en: "HTTP server" },
      text: {
        uk: "Пакет net/http містить сервер і маршрутизацію стандартної бібліотеки. HandleFunc реєструє обробник, а ListenAndServe запускає сервер.",
        en: "The net/http package provides a server and routing in the standard library. HandleFunc registers a handler, and ListenAndServe starts the server.",
      },
      code: {
        lang: "go",
        file: "main.go",
        src: `package main

import (
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
            return
        }
        w.Header().Set("Content-Type", "text/plain; charset=utf-8")
        _, err := w.Write([]byte("ok"))
        if err != nil {
            log.Printf("write response: %v", err)
        }
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}`,
      },
      warn: {
        uk: "Для реального сервісу налаштуй таймаути сервера й коректне завершення; ListenAndServe без таймаутів не підходить для production.",
        en: "For a real service, configure server timeouts and graceful shutdown; ListenAndServe without timeouts is not production-ready.",
      },
    },
    {
      id: "goroutines",
      title: { uk: "Горутини й канали", en: "Goroutines and channels" },
      text: {
        uk: "Горутина запускає функцію конкурентно. Канал передає значення між горутинами та допомагає координувати їхню роботу.",
        en: "A goroutine runs a function concurrently. A channel passes values between goroutines and helps coordinate their work.",
      },
      code: {
        lang: "go",
        src: `done := make(chan string)

go func() {
    done <- "готово"
}()

message := <-done
fmt.Println(message)`,
      },
      tip: {
        uk: "Спільний стан потребує синхронізації. Використовуй канали або sync-примітиви й перевіряй програму з go test -race.",
        en: "Shared state needs synchronization. Use channels or sync primitives and check the program with go test -race.",
      },
    },
  ],
});
