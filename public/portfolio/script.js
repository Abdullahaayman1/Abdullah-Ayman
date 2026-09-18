/* ============================================================
   Abdullah Ayman — Portfolio
   script.js | Vanilla JS, modular IIFE modules
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var $ = function (s, c) {
    return (c || document).querySelector(s);
  };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };

  /* ---------- Loader ---------- */
  var Loader = {
    init: function () {
      var el = $("#loader");
      if (!el) return;
      var bar = $(".loader-bar i", el);
      var txt = $(".loader-text", el);
      var pct = 0;
      var timer = setInterval(function () {
        pct = Math.min(100, pct + Math.random() * 16 + 6);
        if (bar) bar.style.width = pct + "%";
        if (txt) txt.textContent = "Loading " + Math.round(pct) + "%";
        if (pct >= 100) {
          clearInterval(timer);
          setTimeout(function () {
            el.classList.add("done");
            document.body.classList.add("loaded");
          }, 320);
        }
      }, 130);
    },
  };

  /* ---------- Custom cursor ---------- */
  var Cursor = {
    init: function () {
      if (isTouch || reduceMotion) return;
      var dot = $(".cursor-dot"),
        ring = $(".cursor-ring");
      if (!dot || !ring) return;
      document.body.classList.add("cursor-enabled");
      var mx = window.innerWidth / 2,
        my = window.innerHeight / 2;
      var rx = mx,
        ry = my;

      window.addEventListener(
        "mousemove",
        function (e) {
          mx = e.clientX;
          my = e.clientY;
          dot.style.transform = "translate(" + (mx - 3.5) + "px," + (my - 3.5) + "px)";
        },
        { passive: true },
      );

      (function loop() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring.style.transform = "translate(" + (rx - 19) + "px," + (ry - 19) + "px)";
        requestAnimationFrame(loop);
      })();

      $$("a, button, .filter, .tag, input, textarea, .project").forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          ring.classList.add("is-active");
        });
        el.addEventListener("mouseleave", function () {
          ring.classList.remove("is-active");
        });
      });
    },
  };

  /* ---------- Particles ---------- */
  var Particles = {
    init: function () {
      var cv = $("#particles");
      if (!cv || reduceMotion) return;
      var ctx = cv.getContext("2d");
      var parts = [],
        w = 0,
        h = 0,
        dpr = Math.min(window.devicePixelRatio || 1, 2);
      var mouse = { x: -999, y: -999 };
      var colors = ["94,234,212", "109,139,255", "192,132,252"];

      function resize() {
        w = cv.clientWidth;
        h = cv.clientHeight;
        cv.width = w * dpr;
        cv.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var count = Math.min(110, Math.round((w * h) / 16000));
        parts = [];
        for (var i = 0; i < count; i++) {
          parts.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: Math.random() * 1.8 + 0.6,
            c: colors[(Math.random() * colors.length) | 0],
            a: Math.random() * 0.5 + 0.25,
          });
        }
      }

      function frame() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
          ctx.fill();

          for (var j = i + 1; j < parts.length; j++) {
            var q = parts[j];
            var dx = p.x - q.x,
              dy = p.y - q.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < 15000) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = "rgba(120,150,255," + 0.13 * (1 - d2 / 15000) + ")";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          var mdx = p.x - mouse.x,
            mdy = p.y - mouse.y;
          var md2 = mdx * mdx + mdy * mdy;
          if (md2 < 22000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = "rgba(94,234,212," + 0.22 * (1 - md2 / 22000) + ")";
            ctx.stroke();
          }
        }
        requestAnimationFrame(frame);
      }

      window.addEventListener("resize", resize);
      window.addEventListener(
        "mousemove",
        function (e) {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        },
        { passive: true },
      );
      window.addEventListener("mouseout", function () {
        mouse.x = -999;
        mouse.y = -999;
      });
      resize();
      frame();
    },
  };

  /* ---------- Navigation ---------- */
  var Nav = {
    init: function () {
      var nav = $(".nav");
      var burger = $(".burger");
      var menu = $(".mobile-menu");

      function onScroll() {
        if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      if (burger && menu) {
        burger.addEventListener("click", function () {
          var open = menu.classList.toggle("open");
          burger.classList.toggle("open", open);
          burger.setAttribute("aria-expanded", String(open));
          document.body.style.overflow = open ? "hidden" : "";
          $$("a", menu).forEach(function (a, i) {
            a.style.transitionDelay = open ? i * 60 + "ms" : "0ms";
          });
        });
        $$("a", menu).forEach(function (a) {
          a.addEventListener("click", function () {
            menu.classList.remove("open");
            burger.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          });
        });
      }

      // Active section highlighting
      var sections = $$("section[id]");
      var links = $$('a[href^="#"]', document);
      if (!sections.length) return;
      var spy = function () {
        var pos = window.scrollY + window.innerHeight * 0.28;
        var current = sections[0].id;
        sections.forEach(function (s) {
          if (s.offsetTop <= pos) current = s.id;
        });
        links.forEach(function (l) {
          l.classList.toggle("active", l.getAttribute("href") === "#" + current);
        });
      };
      window.addEventListener("scroll", spy, { passive: true });
      spy();
    },
  };

  /* ---------- Smooth anchor scroll ---------- */
  var Anchors = {
    init: function () {
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var top = t.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
        history.replaceState(null, "", id);
      });
    },
  };

  /* ---------- Page transitions ---------- */
  var Transitions = {
    init: function () {
      var veil = $("#veil");
      if (!veil) return;
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("a[href]");
        if (!a) return;
        var href = a.getAttribute("href");
        if (
          !href ||
          href.charAt(0) === "#" ||
          a.target === "_blank" ||
          href.indexOf("mailto:") === 0 ||
          href.indexOf("tel:") === 0 ||
          a.hasAttribute("download") ||
          /^https?:\/\//.test(href)
        )
          return;
        e.preventDefault();
        veil.classList.add("show");
        setTimeout(function () {
          window.location.href = href;
        }, 420);
      });
      window.addEventListener("pageshow", function () {
        veil.classList.remove("show");
      });
    },
  };

  /* ---------- Scroll progress + back to top ---------- */
  var ScrollUI = {
    init: function () {
      var bar = $("#progress");
      var top = $("#top");
      function update() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (bar) bar.style.width = p + "%";
        if (top) top.classList.toggle("show", window.scrollY > 500);
      }
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
      if (top) {
        top.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
      }
    },
  };

  /* ---------- Reveal on scroll ---------- */
  var Reveal = {
    init: function () {
      var items = $$(".reveal");
      if (!items.length) return;
      if (!("IntersectionObserver" in window) || reduceMotion) {
        items.forEach(function (el) {
          el.classList.add("in");
        });
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target;
            var d = parseInt(el.dataset.delay || "0", 10);
            setTimeout(function () {
              el.classList.add("in");
            }, d);
            io.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
      );
      items.forEach(function (el) {
        io.observe(el);
      });
    },
  };

  /* ---------- Counters ---------- */
  var Counters = {
    init: function () {
      var els = $$("[data-count]");
      if (!els.length) return;
      var run = function (el) {
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || "";
        var dur = 1600,
          start = performance.now();
        function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          var val = target * eased;
          el.textContent = (target % 1 ? val.toFixed(1) : Math.round(val)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      };
      if (!("IntersectionObserver" in window)) {
        els.forEach(function (e) {
          e.textContent = e.dataset.count + (e.dataset.suffix || "");
        });
        return;
      }
      var io = new IntersectionObserver(
        function (en) {
          en.forEach(function (x) {
            if (x.isIntersecting) {
              run(x.target);
              io.unobserve(x.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      els.forEach(function (e) {
        io.observe(e);
      });
    },
  };

  /* ---------- Skill bars + rings ---------- */
  var Skills = {
    init: function () {
      var bars = $$(".bar-fill");
      var rings = $$(".ring-fg");
      var obsTargets = bars.concat(rings);
      if (!obsTargets.length) return;

      var animate = function (el) {
        var val = parseFloat(el.dataset.value || "0");
        if (el.classList.contains("bar-fill")) {
          el.style.width = val + "%";
        } else {
          var C = 2 * Math.PI * 54;
          el.style.strokeDasharray = C;
          el.style.strokeDashoffset = C - (C * val) / 100;
          var out = el.closest(".ring-wrap") && el.closest(".ring-wrap").querySelector(".ring-val");
          if (out) {
            var start = performance.now();
            (function tick(now) {
              var t = Math.min(1, (now - start) / 1600);
              out.textContent = Math.round(val * (1 - Math.pow(1 - t, 3))) + "%";
              if (t < 1) requestAnimationFrame(tick);
            })(performance.now());
          }
        }
      };

      if (!("IntersectionObserver" in window)) {
        obsTargets.forEach(animate);
        return;
      }
      var io = new IntersectionObserver(
        function (en) {
          en.forEach(function (x) {
            if (x.isIntersecting) {
              animate(x.target);
              io.unobserve(x.target);
            }
          });
        },
        { threshold: 0.35 },
      );
      obsTargets.forEach(function (el) {
        io.observe(el);
      });
    },
  };

  /* ---------- Typing role ---------- */
  var Typer = {
    init: function () {
      var el = $("[data-typer]");
      if (!el) return;
      var words;
      try {
        words = JSON.parse(el.dataset.typer);
      } catch (e) {
        words = [el.textContent];
      }
      if (reduceMotion) {
        el.textContent = words[0];
        return;
      }
      var out = document.createElement("span");
      var caret = document.createElement("span");
      caret.className = "caret";
      caret.textContent = "|";
      el.textContent = "";
      el.appendChild(out);
      el.appendChild(caret);

      var w = 0,
        i = 0,
        del = false;
      (function step() {
        var word = words[w % words.length];
        out.textContent = word.slice(0, i);
        if (!del && i < word.length) {
          i++;
          setTimeout(step, 70);
        } else if (!del && i === word.length) {
          del = true;
          setTimeout(step, 1500);
        } else if (del && i > 0) {
          i--;
          setTimeout(step, 34);
        } else {
          del = false;
          w++;
          setTimeout(step, 260);
        }
      })();
    },
  };

  /* ---------- Magnetic buttons + tilt ---------- */
  var Magnetic = {
    init: function () {
      if (isTouch || reduceMotion) return;
      $$("[data-magnetic]").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          el.style.transform = "translate(" + x * 0.28 + "px," + y * 0.35 + "px)";
        });
        el.addEventListener("mouseleave", function () {
          el.style.transform = "";
        });
      });

      $$("[data-tilt]").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform =
            "perspective(900px) rotateX(" +
            -py * 9 +
            "deg) rotateY(" +
            px * 12 +
            "deg) translateY(-6px)";
        });
        el.addEventListener("mouseleave", function () {
          el.style.transform = "";
        });
      });
    },
  };

  /* ---------- Parallax ---------- */
  var Parallax = {
    init: function () {
      var els = $$("[data-parallax]");
      if (!els.length || reduceMotion) return;
      var ticking = false;
      function apply() {
        var y = window.scrollY;
        els.forEach(function (el) {
          var speed = parseFloat(el.dataset.parallax) || 0.15;
          el.style.transform = "translate3d(0," + -y * speed + "px,0)";
        });
        ticking = false;
      }
      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            requestAnimationFrame(apply);
            ticking = true;
          }
        },
        { passive: true },
      );
      apply();
    },
  };

  /* ---------- Hero 3D pointer ---------- */
  var Orb = {
    init: function () {
      var stage = $(".orb-stage");
      if (!stage || isTouch || reduceMotion) return;
      var host = stage.closest(".hero") || document.body;
      host.addEventListener("mousemove", function (e) {
        var r = host.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        stage.style.transform = "rotateY(" + px * 22 + "deg) rotateX(" + -py * 18 + "deg)";
      });
      host.addEventListener("mouseleave", function () {
        stage.style.transform = "";
      });
    },
  };

  /* ---------- Project filters ---------- */
  var Filters = {
    init: function () {
      var btns = $$(".filter");
      var cards = $$(".project");
      if (!btns.length) return;
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          btns.forEach(function (x) {
            x.classList.remove("active");
            x.setAttribute("aria-pressed", "false");
          });
          b.classList.add("active");
          b.setAttribute("aria-pressed", "true");
          var f = b.dataset.filter;
          cards.forEach(function (c, i) {
            var match = f === "all" || (c.dataset.category || "").indexOf(f) > -1;
            c.classList.remove("enter");
            c.classList.toggle("hide", !match);
            if (match) {
              void c.offsetWidth;
              c.style.animationDelay = i * 45 + "ms";
              c.classList.add("enter");
            }
          });
        });
      });
    },
  };

  /* ---------- Testimonials carousel ---------- */
  var Carousel = {
    init: function () {
      var root = $("[data-carousel]");
      if (!root) return;
      var track = $(".track", root);
      var slides = $$(".slide", track);
      var dotsWrap = $(".dots", root);
      var prev = $(".arrow.prev", root);
      var next = $(".arrow.next", root);
      var idx = 0,
        timer = null;

      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "dot" + (i === 0 ? " active" : "");
        d.type = "button";
        d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        d.addEventListener("click", function () {
          go(i);
        });
        if (dotsWrap) dotsWrap.appendChild(d);
      });

      function go(i) {
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(" + -idx * 100 + "%)";
        $$(".dot", root).forEach(function (d, k) {
          d.classList.toggle("active", k === idx);
        });
      }
      function auto() {
        clearInterval(timer);
        if (reduceMotion) return;
        timer = setInterval(function () {
          go(idx + 1);
        }, 6000);
      }
      if (prev)
        prev.addEventListener("click", function () {
          go(idx - 1);
          auto();
        });
      if (next)
        next.addEventListener("click", function () {
          go(idx + 1);
          auto();
        });
      root.addEventListener("mouseenter", function () {
        clearInterval(timer);
      });
      root.addEventListener("mouseleave", auto);

      var sx = 0;
      root.addEventListener(
        "touchstart",
        function (e) {
          sx = e.touches[0].clientX;
        },
        { passive: true },
      );
      root.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 45) go(idx + (dx < 0 ? 1 : -1));
        auto();
      });
      auto();
    },
  };

  /* ---------- FAQ accordion ---------- */
  var Faq = {
    init: function () {
      $$(".faq-item").forEach(function (item) {
        var q = $(".faq-q", item);
        var a = $(".faq-a", item);
        if (!q || !a) return;
        q.addEventListener("click", function () {
          var open = item.classList.contains("open");
          $$(".faq-item.open").forEach(function (o) {
            o.classList.remove("open");
            var oa = $(".faq-a", o),
              oq = $(".faq-q", o);
            if (oa) oa.style.maxHeight = null;
            if (oq) oq.setAttribute("aria-expanded", "false");
          });
          if (!open) {
            item.classList.add("open");
            a.style.maxHeight = a.scrollHeight + 40 + "px";
            q.setAttribute("aria-expanded", "true");
          }
        });
      });
    },
  };

  /* ---------- Contact form validation ---------- */
  var Form = {
    init: function () {
      var form = $("#contact-form");
      if (!form) return;
      var note = $(".form-note", form);

      var rules = {
        name: function (v) {
          if (!v.trim()) return "Please enter your name.";
          if (v.trim().length < 2) return "Name must be at least 2 characters.";
          if (v.trim().length > 80) return "Name must be under 80 characters.";
          return "";
        },
        email: function (v) {
          if (!v.trim()) return "Please enter your email address.";
          if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()))
            return "Enter a valid email address.";
          if (v.trim().length > 120) return "Email is too long.";
          return "";
        },
        phone: function (v) {
          if (!v.trim()) return "";
          if (!/^[+()\d\s-]{7,20}$/.test(v.trim())) return "Enter a valid phone number.";
          return "";
        },
        subject: function (v) {
          if (!v.trim()) return "Please add a subject.";
          if (v.trim().length < 3) return "Subject is too short.";
          if (v.trim().length > 120) return "Subject must be under 120 characters.";
          return "";
        },
        message: function (v) {
          if (!v.trim()) return "Please write a message.";
          if (v.trim().length < 15) return "Message must be at least 15 characters.";
          if (v.trim().length > 1500) return "Message must be under 1500 characters.";
          return "";
        },
      };

      function validateField(input) {
        var rule = rules[input.name];
        if (!rule) return true;
        var msg = rule(input.value);
        var field = input.closest(".field");
        var err = field && $(".err", field);
        if (field) field.classList.toggle("invalid", !!msg);
        if (err) err.textContent = msg;
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        return !msg;
      }

      $$("input, textarea", form).forEach(function (input) {
        input.addEventListener("blur", function () {
          validateField(input);
        });
        input.addEventListener("input", function () {
          var field = input.closest(".field");
          if (field && field.classList.contains("invalid")) validateField(input);
        });
      });

      var counter = $("[data-counter-for]");
      var msgEl = $('textarea[name="message"]', form);
      if (counter && msgEl) {
        var sync = function () {
          counter.textContent = msgEl.value.length + " / 1500";
        };
        msgEl.addEventListener("input", sync);
        sync();
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$("input, textarea", form).forEach(function (i) {
          if (!validateField(i)) ok = false;
        });

        if (!ok) {
          if (note) {
            note.className = "form-note bad";
            note.textContent = "Please fix the highlighted fields and try again.";
          }
          var firstBad = $(".field.invalid input, .field.invalid textarea", form);
          if (firstBad) firstBad.focus();
          return;
        }

        var btn = $('button[type="submit"]', form);
        var label = btn ? btn.textContent : "Send message";
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Sending message…";
        }
        if (note) {
          note.className = "form-note";
          note.style.display = "none";
          note.textContent = "";
        }

        var serviceID = "service_5v6d1sk";
        var templateID = "template_tkzc4re";
        var publicKey = "dZL7TYY-ex59SWVdW";

        var nameInput = $('input[name="name"]', form);
        var emailInput = $('input[name="email"]', form);
        var phoneInput = $('input[name="phone"]', form);
        var budgetInput = $('select[name="budget"]', form);
        var subjectInput = $('input[name="subject"]', form);
        var messageInput = $('textarea[name="message"]', form);

        var nameVal = nameInput ? nameInput.value.trim() : "";
        var emailVal = emailInput ? emailInput.value.trim() : "";
        var phoneVal = phoneInput ? phoneInput.value.trim() : "";
        var budgetVal =
          budgetInput && budgetInput.selectedIndex > 0
            ? budgetInput.options[budgetInput.selectedIndex].text
            : "Not specified";
        var subjectVal = subjectInput ? subjectInput.value.trim() : "";
        var msgVal = messageInput ? messageInput.value.trim() : "";

        var templateParams = {
          name: nameVal,
          from_name: nameVal,
          user_name: nameVal,
          email: emailVal,
          from_email: emailVal,
          reply_to: emailVal,
          user_email: emailVal,
          phone: phoneVal || "Not provided",
          budget: budgetVal,
          subject: subjectVal,
          message: msgVal,
          to_name: "Abdullah Ayman",
        };

        function onSuccess() {
          if (btn) {
            btn.disabled = false;
            btn.textContent = label;
          }
          if (note) {
            note.style.display = "";
            note.className = "form-note ok";
            note.textContent =
              "Thanks! Your message has been sent successfully. Abdullah will reply within 24 hours.";
          }
          form.reset();
          $$(".field.invalid", form).forEach(function (f) {
            f.classList.remove("invalid");
          });
          if (counter) counter.textContent = "0 / 1500";
        }

        function onError(err) {
          console.error("EmailJS sending error:", err);
          if (btn) {
            btn.disabled = false;
            btn.textContent = label;
          }
          var detail = err && (err.text || err.message);
          if (note) {
            note.style.display = "";
            note.className = "form-note bad";
            note.textContent = detail
              ? "Unable to send message (" + detail + "). Please try again or message directly via WhatsApp."
              : "Something went wrong while sending your message. Please try again or message directly via WhatsApp.";
          }
        }

        if (typeof emailjs !== "undefined" && typeof emailjs.send === "function") {
          emailjs
            .send(serviceID, templateID, templateParams, publicKey)
            .then(function () {
              onSuccess();
            })
            .catch(function (err) {
              onError(err);
            });
        } else {
          fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: serviceID,
              template_id: templateID,
              user_id: publicKey,
              template_params: templateParams,
            }),
          })
            .then(function (res) {
              if (res.ok) {
                onSuccess();
              } else {
                return res.text().then(function (txt) {
                  throw new Error(txt || "Server error " + res.status);
                });
              }
            })
            .catch(function (err) {
              onError(err);
            });
        }
      });

      var waBtn = $("#btn-whatsapp-send", form);
      if (waBtn) {
        waBtn.addEventListener("click", function () {
          var nameInput = $('input[name="name"]', form);
          var emailInput = $('input[name="email"]', form);
          var phoneInput = $('input[name="phone"]', form);
          var budgetInput = $('select[name="budget"]', form);
          var subjectInput = $('input[name="subject"]', form);
          var messageInput = $('textarea[name="message"]', form);

          var nameVal = nameInput ? nameInput.value.trim() : "";
          var emailVal = emailInput ? emailInput.value.trim() : "";
          var phoneVal = phoneInput ? phoneInput.value.trim() : "";
          var budgetVal =
            budgetInput && budgetInput.selectedIndex > 0
              ? budgetInput.options[budgetInput.selectedIndex].text
              : "";
          var subjectVal = subjectInput ? subjectInput.value.trim() : "";
          var msgVal = messageInput ? messageInput.value.trim() : "";

          var lines = ["*Portfolio Inquiry for Abdullah Ayman*"];
          if (nameVal) lines.push("👤 *Name:* " + nameVal);
          if (emailVal) lines.push("✉️ *Email:* " + emailVal);
          if (phoneVal) lines.push("📱 *Phone:* " + phoneVal);
          if (budgetVal) lines.push("💰 *Budget:* " + budgetVal);
          if (subjectVal) lines.push("📌 *Subject:* " + subjectVal);
          if (msgVal) {
            lines.push("\n📝 *Message:*\n" + msgVal);
          } else {
            lines.push(
              "\nHi Abdullah, I visited your portfolio and would like to discuss a project with you."
            );
          }

          var text = encodeURIComponent(lines.join("\n"));
          var url = "https://wa.me/923074335544?text=" + text;
          window.open(url, "_blank", "noopener,noreferrer");
        });
      }
    },
  };

  /* ---------- Year ---------- */
  var Misc = {
    init: function () {
      $$("[data-year]").forEach(function (e) {
        e.textContent = String(new Date().getFullYear());
      });
    },
  };

  /* ---------- Boot ---------- */
  function boot() {
    [
      Loader,
      Cursor,
      Particles,
      Nav,
      Anchors,
      Transitions,
      ScrollUI,
      Reveal,
      Counters,
      Skills,
      Typer,
      Magnetic,
      Parallax,
      Orb,
      Filters,
      Carousel,
      Faq,
      Form,
      Misc,
    ].forEach(function (m) {
      try {
        m.init();
      } catch (err) {
        /* keep the page alive */ console.warn(err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
