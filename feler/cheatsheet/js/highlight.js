/* Маленький підсвічувач коду без залежностей.
   Не ідеальний парсер, а "достатньо добре" для прикладів у шпаргалці. */
(function () {
  "use strict";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Збирає один RegExp із кількох частин. У кожній частині рівно одна група, що захоплює.
  function combine(list) {
    return new RegExp(
      list
        .map(function (r) {
          return r.source;
        })
        .join("|"),
      "g"
    );
  }

  // Проходить код, обгортає збіги в <span class="tok-...">, решту екранує.
  function run(code, rx, classes) {
    var out = "";
    var last = 0;
    var m;
    rx.lastIndex = 0;
    while ((m = rx.exec(code))) {
      if (m[0] === "") {
        rx.lastIndex++;
        continue;
      }
      out += esc(code.slice(last, m.index));
      var cls = null;
      for (var i = 0; i < classes.length; i++) {
        if (m[i + 1] !== undefined) {
          cls = classes[i];
          break;
        }
      }
      out += cls ? '<span class="tok-' + cls + '">' + esc(m[0]) + "</span>" : esc(m[0]);
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  var KEYWORDS =
    "const|let|var|function|return|if|else|for|while|do|of|in|import|from|export|default|class|new|" +
    "async|await|try|catch|finally|throw|typeof|instanceof|interface|type|extends|implements|enum|as|" +
    "switch|case|break|continue|void|readonly|public|private|protected|static|keyof|satisfies|this|super|yield|delete";
  var LITERALS = "null|undefined|true|false|NaN|Infinity";

  var JS_PARTS = [
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/, // 1 comment
    /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/, // 2 string
    new RegExp("\\b(" + KEYWORDS + ")\\b"), // 3 keyword
    new RegExp("\\b(" + LITERALS + ")\\b"), // 4 literal -> number colour
    /\b(\d+(?:\.\d+)?)\b/, // 5 number
    /\b([A-Za-z_$][\w$]*)(?=\s*\()/, // 6 function call / declaration
  ];
  var JS_CLASSES = ["comment", "string", "keyword", "number", "number", "fn"];
  var JS_RX = combine(JS_PARTS);

  // JSX/TSX: додатково підсвічуємо <Tag / </Tag. Lookbehind відсікає generics типу useState<string>.
  var JSX_RX = combine([JS_PARTS[0], JS_PARTS[1], /(?<![\w$)\]])(<\/?[A-Za-z][\w.]*)/].concat(JS_PARTS.slice(2)));
  var JSX_CLASSES = ["comment", "string", "tag", "keyword", "number", "number", "fn"];

  var CSS_RX = combine([
    /(\/\*[\s\S]*?\*\/)/, // 1 comment
    /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/, // 2 string
    /(@[\w-]+)/, // 3 at-rule
    /(--[\w-]+)/, // 4 custom property
    /([a-zA-Z-]+)(?=\s*:\s)/, // 5 property (двокрапка + пробіл, щоб не чіпати a:hover)
    /(#[0-9a-fA-F]{3,8}\b)/, // 6 hex colour
    /((?<![\w#-])-?\d*\.?\d+(?:px|r?em|%|dvh|vh|vw|fr|ms|s|deg|ch)?(?![\w]))/, // 7 number
    /([\w-]+)(?=\()/, // 8 function
  ]);
  var CSS_CLASSES = ["comment", "string", "keyword", "prop", "prop", "number", "number", "fn"];

  var SH_RX = combine([
    /((?<![\w$])#[^\n]*)/, // 1 comment
    /("(?:\\.|[^"\\])*"|'[^']*')/, // 2 string
    /((?<=\s)--?[A-Za-z][\w-]*)/, // 3 flag
    /\b(npm|npx|pnpm|yarn|git|cd|mkdir|ls|node|echo|cat|touch|rm|cp|mv|code|curl|gh)\b/, // 4 command
  ]);
  var SH_CLASSES = ["comment", "string", "attr", "keyword"];

  var JSON_RX = combine([
    /("(?:\\.|[^"\\\n])*"(?=\s*:))/, // 1 key
    /("(?:\\.|[^"\\\n])*")/, // 2 string
    /\b(true|false|null)\b/, // 3 literal
    /(-?\d+(?:\.\d+)?)/, // 4 number
  ]);
  var JSON_CLASSES = ["attr", "string", "keyword", "number"];

  var PYTHON_RX = combine([
    /(#.*)/,
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/,
    /\b(def|class|return|if|elif|else|for|while|in|not|and|or|is|import|from|as|try|except|finally|raise|with|pass|break|continue|lambda|yield|async|await|assert|global|nonlocal|del)\b/,
    /\b(None|True|False)\b/,
    /\b\d+(?:\.\d+)?\b/,
    /\b([A-Za-z_]\w*)(?=\s*\()/,
  ]);
  var PYTHON_CLASSES = ["comment", "string", "keyword", "number", "number", "fn"];

  var CSHARP_RX = combine([
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/,
    /("(?:\\.|[^"\\\n])*")/,
    /\b(using|namespace|class|static|void|return|if|else|for|foreach|while|new|public|private|protected|internal|async|await|var|int|string|decimal|double|float|bool|long|object|is|not|null|true|false)\b/,
    /\b\d+(?:\.\d+)?m?\b/,
    /\b([A-Za-z_]\w*)(?=\s*\()/,
  ]);
  var CSHARP_CLASSES = ["comment", "string", "keyword", "number", "fn"];

  var GO_RX = combine([
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/,
    /("(?:\\.|[^"\\\n])*"|`[^`]*`)/,
    /\b(package|import|func|return|if|else|for|range|switch|case|break|continue|go|defer|select|chan|var|const|type|struct|interface|map|fallthrough)\b/,
    /\b(nil|true|false|iota)\b/,
    /\b\d+(?:\.\d+)?\b/,
    /\b([A-Za-z_]\w*)(?=\s*\()/,
  ]);
  var GO_CLASSES = ["comment", "string", "keyword", "number", "number", "fn"];

  var SQL_RX = combine([
    /(--[^\n]*|\/\*[\s\S]*?\*\/)/,
    /('(?:''|[^'])*'|"(?:[^"]|"")*")/,
    /\b(SELECT|FROM|WHERE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|DISTINCT|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|CASE|WHEN|THEN|ELSE|END|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|INDEX|COUNT|SUM|AVG|MIN|MAX|COALESCE|BEGIN|COMMIT|ROLLBACK|TRANSACTION)\b/,
    /\b(TRUE|FALSE|NULL)\b/,
    /\b\d+(?:\.\d+)?\b/,
    /\b([A-Za-z_]\w*)(?=\s*\()/,
  ]);
  var SQL_CLASSES = ["comment", "string", "keyword", "number", "number", "fn"];

  // --- HTML: окремо розбираємо теги, текст між ними лишаємо як є ---
  var TAG_RX = /<!--[\s\S]*?-->|<\/?[A-Za-z!](?:"[^"]*"|'[^']*'|[^>"'])*>/g;
  var TAG_PARTS_RX = /^(<\/?!?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?>)$/;
  var ATTR_RX = /("[^"]*"|'[^']*')|([^\s=\/"']+)(?==)/g;

  function highlightTag(tag) {
    var m = TAG_PARTS_RX.exec(tag);
    if (!m) return esc(tag);
    var rest = m[3];
    var out = "";
    var last = 0;
    var a;
    ATTR_RX.lastIndex = 0;
    while ((a = ATTR_RX.exec(rest))) {
      out += esc(rest.slice(last, a.index));
      out += '<span class="tok-' + (a[1] ? "string" : "attr") + '">' + esc(a[0]) + "</span>";
      last = a.index + a[0].length;
    }
    out += esc(rest.slice(last));
    return (
      '<span class="tok-tag">' + esc(m[1] + m[2]) + "</span>" + out + '<span class="tok-tag">' + esc(m[4]) + "</span>"
    );
  }

  function highlightHtml(code) {
    var out = "";
    var last = 0;
    var m;
    TAG_RX.lastIndex = 0;
    while ((m = TAG_RX.exec(code))) {
      out += esc(code.slice(last, m.index));
      out += m[0].indexOf("<!--") === 0 ? '<span class="tok-comment">' + esc(m[0]) + "</span>" : highlightTag(m[0]);
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  function highlight(code, lang) {
    switch (lang) {
      case "js":
      case "ts":
        return run(code, JS_RX, JS_CLASSES);
      case "jsx":
      case "tsx":
        return run(code, JSX_RX, JSX_CLASSES);
      case "css":
        return run(code, CSS_RX, CSS_CLASSES);
      case "html":
        return highlightHtml(code);
      case "sh":
        return run(code, SH_RX, SH_CLASSES);
      case "json":
        return run(code, JSON_RX, JSON_CLASSES);
      case "py":
      case "python":
        return run(code, PYTHON_RX, PYTHON_CLASSES);
      case "cs":
      case "csharp":
        return run(code, CSHARP_RX, CSHARP_CLASSES);
      case "go":
        return run(code, GO_RX, GO_CLASSES);
      case "sql":
        return run(code, SQL_RX, SQL_CLASSES);
      default:
        return esc(code);
    }
  }

  window.highlightCode = highlight;
})();
