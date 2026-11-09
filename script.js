/* ==========================================================================
   GREEN HAT CREW // CYBER VIBE PORTAL
   Shared vanilla JavaScript — no frameworks, no backend.
   ========================================================================== */

(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var modalEl = null;
  var lastFocused = null;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  function boot() {
    setYear();
    initNav();
    initScrollUI();
    initMatrix();
    initCursor();
    initReveal();
    initModal();

    if (page === "home") {
      initTypewriter();
      initStats();
    } else if (page === "arsenal") {
      initArsenal();
    } else if (page === "crew") {
      initCrew();
    } else if (page === "funzone") {
      initFunzone();
    } else if (page === "manifesto") {
      initManifesto();
    } else if (page === "terminal") {
      initTerminal();
    } else if (page === "contact") {
      initContact();
    } else if (page === "404") {
      init404();
    }
  }

  /* ------------------------------------------------------------------ */
  /* misc                                                               */
  /* ------------------------------------------------------------------ */

  function setYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------ */
  /* navigation                                                         */
  /* ------------------------------------------------------------------ */

  function initNav() {
    var navbar = document.querySelector(".navbar");
    var toggle = document.getElementById("nav-toggle");
    if (!navbar || !toggle) return;

    toggle.addEventListener("click", function () {
      var open = navbar.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navbar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        navbar.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    var current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    navbar.querySelectorAll(".nav__link").forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      if (href === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initScrollUI() {
    var navbar = document.querySelector(".navbar");
    var bar = document.getElementById("scroll-progress-bar");

    function onScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (max > 0 ? (scrollTop / max) * 100 : 0).toFixed(2) + "%";
      if (navbar) navbar.classList.toggle("is-scrolled", scrollTop > 30);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ------------------------------------------------------------------ */
  /* matrix rain                                                        */
  /* ------------------------------------------------------------------ */

  function initMatrix() {
    if (reduceMotion) return;
    var canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var chars = "01ABCDEF#$%&*<>/\\[]{}アイウエオカキクケコサシスセソ";
    var fontSize = 16;
    var w = 0;
    var h = 0;
    var cols = 0;
    var drops = [];
    var running = true;
    var last = 0;
    var raf = null;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / fontSize);
      drops = [];
      for (var i = 0; i < cols; i++) drops.push(Math.random() * -h);
    }

    function draw(timestamp) {
      if (!running) return;
      if (timestamp - last > 58) {
        last = timestamp;
        ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
        ctx.fillRect(0, 0, w, h);
        ctx.font = fontSize + "px 'Space Mono', monospace";
        for (var i = 0; i < cols; i++) {
          var char = chars.charAt(Math.floor(Math.random() * chars.length));
          var x = i * fontSize;
          var y = drops[i];
          ctx.fillStyle = Math.random() > 0.985 ? "#ffffff" : "#ff003c";
          ctx.fillText(char, x, y);
          if (y > h && Math.random() > 0.972) {
            drops[i] = 0;
          } else {
            drops[i] = y + fontSize;
          }
        }
      }
      raf = window.requestAnimationFrame(draw);
    }

    resize();
    raf = window.requestAnimationFrame(draw);

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        if (raf) window.cancelAnimationFrame(raf);
      } else {
        running = true;
        last = 0;
        raf = window.requestAnimationFrame(draw);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* custom cursor                                                      */
  /* ------------------------------------------------------------------ */

  function initCursor() {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring || !finePointer || reduceMotion) return;

    document.body.classList.add("has-custom-cursor");

    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var rx = mx;
    var ry = my;
    var visible = false;

    function show() {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }

    function hide() {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    }

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      show();
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    var interactive = "a, button, input, textarea, .tool-card, .crew-card, .mission-card, .contact-card, .preview-card";
    document.addEventListener("mouseover", function (e) {
      var target = e.target.closest ? e.target.closest(interactive) : null;
      ring.classList.toggle("is-hovering", !!target);
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      window.requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------------ */
  /* scroll reveal                                                      */
  /* ------------------------------------------------------------------ */

  function initReveal() {
    var staggerGroups = document.querySelectorAll(
      ".preview-grid, .arsenal-grid, .crew-grid, .mission-grid, .contact-grid, .vibe-strip"
    );
    staggerGroups.forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, index) {
        if (child.hasAttribute("data-reveal")) {
          child.style.setProperty("--reveal-delay", index * 80 + "ms");
        }
      });
    });

    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* modal                                                              */
  /* ------------------------------------------------------------------ */

  function initModal() {
    var close = function () {
      if (!modalEl) return;
      modalEl.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    window.__ghcCloseModal = close;

    document.addEventListener("click", function (e) {
      if (modalEl && e.target === modalEl) close();
      if (e.target.closest && e.target.closest("[data-modal-close]")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalEl && modalEl.classList.contains("is-open")) close();
    });
  }

  function showModal(title, message) {
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.className = "modal";
      modalEl.setAttribute("role", "dialog");
      modalEl.setAttribute("aria-modal", "true");
      modalEl.setAttribute("aria-labelledby", "ghc-modal-title");
      modalEl.innerHTML =
        '<div class="modal__box">' +
        '<div class="modal__bar">' +
        '<span class="dot dot--red"></span><span class="dot dot--amber"></span><span class="dot dot--green"></span>' +
        "<span>ghc://system</span>" +
        "</div>" +
        '<div class="modal__content">' +
        '<h2 class="modal__title" id="ghc-modal-title"></h2>' +
        '<p class="modal__msg"></p>' +
        '<button class="btn btn--solid" type="button" data-modal-close>[ ACKNOWLEDGE ]</button>' +
        "</div>" +
        "</div>";
      document.body.appendChild(modalEl);
    }

    var titleEl = modalEl.querySelector(".modal__title");
    var msgEl = modalEl.querySelector(".modal__msg");
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    lastFocused = document.activeElement;
    modalEl.classList.add("is-open");
    document.body.style.overflow = "hidden";

    var closeBtn = modalEl.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus();
  }

  /* ------------------------------------------------------------------ */
  /* home                                                               */
  /* ------------------------------------------------------------------ */

  function initTypewriter() {
    var el = document.getElementById("typewriter");
    if (!el) return;

    var text = el.getAttribute("data-text") || el.textContent || "";
    if (reduceMotion) {
      el.textContent = text;
      return;
    }

    el.textContent = "";
    var index = 0;

    function tick() {
      el.textContent = text.slice(0, index);
      var lastChar = text.charAt(index - 1);
      index++;
      if (index > text.length) return;
      var delay = 36 + Math.random() * 42;
      if (lastChar === ".") delay = 320;
      else if (lastChar === " ") delay = 60;
      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, 650);
  }

  function initStats() {
    var numbers = Array.prototype.slice.call(document.querySelectorAll(".stat__num"));
    if (!numbers.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      if (reduceMotion) {
        el.textContent = target;
        return;
      }
      var duration = 1600;
      var start = null;
      function step(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) window.requestAnimationFrame(step);
        else el.textContent = target;
      }
      window.requestAnimationFrame(step);
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      numbers.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    numbers.forEach(function (el) {
      el.textContent = "0";
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* arsenal                                                            */
  /* ------------------------------------------------------------------ */

  function initArsenal() {
    var input = document.getElementById("arsenal-search");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".tool-card"));
    var counter = document.getElementById("search-count");
    var empty = document.getElementById("empty-state");

    function filterCards() {
      var query = (input && input.value ? input.value : "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = ((card.getAttribute("data-name") || "") + " " + card.textContent).toLowerCase();
        var match = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          card.classList.add("is-visible");
        }
      });
      if (counter) {
        counter.textContent =
          String(shown).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
      }
      if (empty) empty.hidden = shown !== 0;
    }

    if (input) input.addEventListener("input", filterCards);
    filterCards();

    var scrambleChars = "!<>-_\\/[]{}—=+*^?#@$%&01";

    cards.forEach(function (card) {
      var title = card.querySelector(".tool-card__title");
      if (!title) return;
      var original = title.textContent;
      var timer = null;

      card.addEventListener("mouseenter", function () {
        if (reduceMotion) return;
        window.clearInterval(timer);
        var frame = 0;
        timer = window.setInterval(function () {
          frame++;
          var output = "";
          for (var i = 0; i < original.length; i++) {
            var ch = original.charAt(i);
            if (ch === " " || i < frame / 2) {
              output += ch;
            } else {
              output += scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
            }
          }
          title.textContent = output;
          if (frame > original.length * 2) {
            window.clearInterval(timer);
            title.textContent = original;
          }
        }, 42);
      });

      card.addEventListener("mouseleave", function () {
        window.clearInterval(timer);
        title.textContent = original;
      });
    });

    if (!finePointer || reduceMotion) return;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.classList.add("is-tilting");
        card.style.transform =
          "perspective(900px) rotateX(" +
          (-py * 7).toFixed(2) +
          "deg) rotateY(" +
          (px * 9).toFixed(2) +
          "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* crew                                                               */
  /* ------------------------------------------------------------------ */

  function initCrew() {
    var form = document.getElementById("join-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showModal(
        "// ACCESS_DENIED",
        "> Access Denied. We don't trust you yet.\n" +
          "> Your application was flagged by the vibe checker.\n" +
          "> Prove yourself in the Fun Zone, then try again."
      );
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* fun zone                                                           */
  /* ------------------------------------------------------------------ */

  function initFunzone() {
    initCountdown();

    document.querySelectorAll("[data-mission]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showModal("// MISSION_BRIEF", btn.getAttribute("data-mission"));
      });
    });
  }

  function initCountdown() {
    var els = {
      d: document.getElementById("cd-d"),
      h: document.getElementById("cd-h"),
      m: document.getElementById("cd-m"),
      s: document.getElementById("cd-s")
    };
    if (!els.d || !els.h || !els.m || !els.s) return;

    var nextDateEl = document.getElementById("cd-date");
    var target = getNextCtf();

    function getNextCtf() {
      var now = new Date();
      var next = new Date(now.getTime());
      var diff = (6 - now.getDay() + 7) % 7;
      next.setDate(now.getDate() + diff);
      next.setHours(18, 0, 0, 0);
      if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 7);
      return next;
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function render() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        target = getNextCtf();
        diff = target.getTime() - Date.now();
      }
      var total = Math.max(0, Math.floor(diff / 1000));
      els.d.textContent = pad(Math.floor(total / 86400));
      els.h.textContent = pad(Math.floor((total % 86400) / 3600));
      els.m.textContent = pad(Math.floor((total % 3600) / 60));
      els.s.textContent = pad(total % 60);

      if (nextDateEl) {
        nextDateEl.textContent =
          "TARGET LOCKED // SAT " +
          target.toLocaleDateString(undefined, { day: "2-digit", month: "short" }) +
          " @ 18:00 LOCAL";
      }
    }

    render();
    window.setInterval(render, 1000);
  }

  /* ------------------------------------------------------------------ */
  /* manifesto                                                          */
  /* ------------------------------------------------------------------ */

  function initManifesto() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll(".reveal-text"));
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var text = block.textContent;
      block.textContent = "";
      var frag = document.createDocumentFragment();

      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        for (var i = 0; i < part.length; i++) {
          var span = document.createElement("span");
          span.className = "char";
          span.textContent = part.charAt(i);
          frag.appendChild(span);
        }
      });

      block.appendChild(frag);
    });

    var allChars = document.querySelectorAll(".reveal-text .char");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      allChars.forEach(function (char) {
        char.classList.add("is-lit");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var chars = entry.target.querySelectorAll(".char");
          chars.forEach(function (char, index) {
            window.setTimeout(function () {
              char.classList.add("is-lit");
            }, Math.min(index * 14, 1000));
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    blocks.forEach(function (block) {
      observer.observe(block);
    });
  }

  /* ------------------------------------------------------------------ */
  /* terminal                                                           */
  /* ------------------------------------------------------------------ */

  function initTerminal() {
    var out = document.getElementById("terminal-output");
    var form = document.getElementById("terminal-form");
    var input = document.getElementById("terminal-input");
    var terminal = document.getElementById("terminal");
    if (!out || !form || !input) return;

    var history = [];
    var historyIndex = 0;

    function scroll() {
      out.scrollTop = out.scrollHeight;
    }

    function print(text, cls) {
      var line = document.createElement("p");
      line.className = "term-line" + (cls ? " " + cls : "");
      line.textContent = text;
      out.appendChild(line);
      scroll();
      return line;
    }

    function printCommand(cmd) {
      var line = document.createElement("p");
      line.className = "term-line";
      var ps = document.createElement("span");
      ps.className = "t-prompt";
      ps.textContent = "guest@greenhat:~$ ";
      var cs = document.createElement("span");
      cs.className = "t-cmd";
      cs.textContent = cmd;
      line.appendChild(ps);
      line.appendChild(cs);
      out.appendChild(line);
      scroll();
    }

    function lines(items) {
      items.forEach(function (item) {
        if (Array.isArray(item)) print(item[0], item[1]);
        else print(item);
      });
    }

    var helpLines = [
      ["AVAILABLE COMMANDS", "term-line--head"],
      ["  help        list this menu", "term-line--dim"],
      ["  about       who is Green Hat Crew?", "term-line--dim"],
      ["  contact     encrypted contact channels", "term-line--dim"],
      ["  banner      print crew banner", "term-line--dim"],
      ["  whoami      identify current user", "term-line--dim"],
      ["  ls          list sandbox files", "term-line--dim"],
      ["  cat <file>  read a file (try manifesto.txt)", "term-line--dim"],
      ["  neofetch    system flex", "term-line--dim"],
      ["  hack        attempt the impossible", "term-line--dim"],
      ["  sudo        do not.", "term-line--dim"],
      ["  date        current system time", "term-line--dim"],
      ["  echo <txt>  repeat after me", "term-line--dim"],
      ["  clear       wipe the screen", "term-line--dim"]
    ];

    function run(raw) {
      var cmd = String(raw || "").trim();
      printCommand(cmd);
      if (!cmd) return;

      history.push(cmd);
      historyIndex = history.length;

      var parts = cmd.split(/\s+/);
      var key = parts[0].toLowerCase();
      var arg = cmd.slice(parts[0].length).trim();

      switch (key) {
        case "help":
        case "?":
          lines(helpLines);
          break;

        case "about":
          lines([
            ["GREEN HAT CREW // EST. 2024", "term-line--head"],
            ["A legal, chaotic, curious crew of learners.", "term-line--dim"],
            ["We break things in labs, document the mess,", "term-line--dim"],
            ["and turn every 'oops' into a lesson.", "term-line--dim"],
            ["No black hats. No illegal targets. Just vibes.", "term-line--accent"]
          ]);
          break;

        case "contact":
          lines([
            ["SECURE CHANNELS", "term-line--head"],
            ["  email      rajgautam@gmail.com", "term-line--dim"],
            ["  phone      +91 7234999557", "term-line--dim"],
            ["  instagram  @linuxuser.raj", "term-line--dim"],
            ["  discord    discord.gg (ask someone in the crew)", "term-line--dim"],
            ["Full board: open contact.html", "term-line--accent"]
          ]);
          break;

        case "banner":
          print(
            "  ____ ____  _   _   _   _    _  _____ \n" +
              " / ___|  _ \\| | | | | | | |  / \\|_   _|\n" +
              "| |  _| |_) | |_| | | |_| | / _ \\ | |  \n" +
              "| |_| |  _ <|  _  | |  _  |/ ___ \\| |  \n" +
              " \\____|_| \\_\\_| |_| |_| |_/_/   \\_\\_|  ",
            "term-line--accent"
          );
          break;

        case "whoami":
          print("guest // clearance: none // curiosity: maxed // vibes: immaculate");
          break;

        case "ls":
          print("manifesto.txt   arsenal/   crew/   missions/   secrets.txt [LOCKED]");
          break;

        case "cat":
          if (!arg) {
            print("cat: missing operand. Try: cat manifesto.txt", "term-line--err");
          } else if (arg === "manifesto.txt") {
            lines([
              ["# GREEN HAT MANIFESTO", "term-line--head"],
              ["1. Learn loudly. Break safely. Document everything.", "term-line--dim"],
              ["2. Labs and CTFs only. Never someone else's door.", "term-line--dim"],
              ["3. Help the next beginner. Gatekeeping is dead.", "term-line--dim"],
              ["4. Ship the write-up, not just the screenshot.", "term-line--dim"]
            ]);
          } else if (arg === "secrets.txt") {
            print("secrets.txt: permission denied. (Nice try though.)", "term-line--err");
          } else {
            print("cat: " + arg + ": No such file in this sandbox.", "term-line--err");
          }
          break;

        case "neofetch":
          lines([
            ["        GHC@SANDBOX", "term-line--head"],
            ["        ------------", "term-line--dim"],
            ["  OS      Green Hat OS 2.0.26", "term-line--dim"],
            ["  Shell   vibeshell 1.0", "term-line--dim"],
            ["  Kernel  curiosity-6.6.6", "term-line--dim"],
            ["  Uptime  350+ lab hours", "term-line--dim"],
            ["  Tools   nmap, burp, gdb, coffee", "term-line--dim"]
          ]);
          break;

        case "hack":
          print("> Initiating multi-vector exploit framework...", "term-line--accent");
          print("> Bypassing 7 firewalls...", "term-line--dim");
          document.body.classList.add("page-glitch");
          window.setTimeout(function () {
            document.body.classList.remove("page-glitch");
            print("Nice try. This is a frontend sandbox ;)", "term-line--ok");
          }, 900);
          break;

        case "sudo":
          print("guest is not in the sudoers file.", "term-line--err");
          print("This incident has been reported to absolutely nobody.", "term-line--dim");
          break;

        case "join":
          print("Applications are... complicated. Open crew.html and find out.");
          break;

        case "date":
          print(new Date().toString());
          break;

        case "echo":
          print(arg || "");
          break;

        case "clear":
          out.textContent = "";
          break;

        case "discord":
          print("Discord invite hidden. Ask the crew IRL. Or check contact.html");
          break;

        case "github":
          print("github.com // soon. We are still cleaning the commit history.");
          break;

        case "exit":
          print("Connection terminated. Just kidding, you live here now.", "term-line--accent");
          break;

        case "matrix":
          print("Wake up, guest... follow the red rabbit.", "term-line--accent");
          break;

        default:
          print('command not found: ' + key + ' — type "help" for options.', "term-line--err");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value;
      input.value = "";
      run(value);
      input.focus();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = history[historyIndex] || "";
      }
    });

    document.querySelectorAll("[data-cmd]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        input.value = "";
        run(btn.getAttribute("data-cmd"));
        input.focus();
      });
    });

    if (terminal) {
      terminal.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("button")) return;
        input.focus();
      });
    }

    var bootLines = [
      ["GREEN HAT CREW // SANDBOX v2.0.26", "term-line--head"],
      ["Secure shell established. No real targets. No real hacking.", "term-line--dim"],
      ['Type "help" to list available commands.', "term-line--dim"]
    ];

    if (reduceMotion) {
      lines(bootLines);
    } else {
      bootLines.forEach(function (line, index) {
        window.setTimeout(function () {
          print(line[0], line[1]);
        }, 260 + index * 220);
      });
    }

    window.setTimeout(function () {
      input.focus();
    }, 400);
  }

  /* ------------------------------------------------------------------ */
  /* contact                                                            */
  /* ------------------------------------------------------------------ */

  function initContact() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-copy") || "";
        var label = btn.getAttribute("data-label") || "[ COPY ]";

        copyText(value)
          .then(function () {
            btn.textContent = "[ COPIED! ]";
            btn.classList.add("is-copied");
            window.clearTimeout(btn.__copyTimer);
            btn.__copyTimer = window.setTimeout(function () {
              btn.textContent = label;
              btn.classList.remove("is-copied");
            }, 1800);
          })
          .catch(function () {
            showModal("// COPY_FAILED", "> Clipboard access was denied by your browser.\n> Here it is anyway:\n" + value);
          });
      });
    });

    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        showModal(
          "// TRANSMISSION_COMPLETE",
          "> Message encrypted and sent to the void.\n" +
            "> (This is a frontend demo — nothing actually left your browser.)"
        );
        form.reset();
      });
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-9999px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) resolve();
      else reject(new Error("copy failed"));
    });
  }

  /* ------------------------------------------------------------------ */
  /* 404                                                                */
  /* ------------------------------------------------------------------ */

  function init404() {
    var wrap = document.getElementById("error-wrap");
    if (!wrap || reduceMotion) return;

    window.setTimeout(function () {
      wrap.classList.add("shake");
      window.setTimeout(function () {
        wrap.classList.remove("shake");
      }, 1300);
    }, 350);
  }
})();
