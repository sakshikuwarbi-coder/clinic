/* =========================================================
   CENTRE FOR LIFE — SHARED INTERACTIONS
   Every block checks for its own elements before running,
   so a page missing a section can never break the rest.
========================================================= */

(function () {
    "use strict";

    /* ---------- MOBILE MENU ---------- */

    var menuToggle = document.getElementById("menuToggle");
    var mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {

        var setMenu = function (open) {
            mobileMenu.classList.toggle("open", open);
            menuToggle.classList.toggle("open", open);
            menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        };

        menuToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            setMenu(!mobileMenu.classList.contains("open"));
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        document.addEventListener("click", function (event) {
            if (
                mobileMenu.classList.contains("open") &&
                !mobileMenu.contains(event.target)
            ) {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") setMenu(false);
        });
    }

    /* ---------- NAVBAR SHADOW ON SCROLL ---------- */

    var navbar = document.querySelector(".navbar");

    if (navbar) {
        var updateNavbar = function () {
            navbar.classList.toggle("scrolled", window.scrollY > 8);
        };

        window.addEventListener("scroll", updateNavbar, { passive: true });
        updateNavbar();
    }

    /* ---------- FAQ ACCORDION ---------- */

    var faqItems = Array.prototype.slice.call(
        document.querySelectorAll(".faq-item")
    );
    var faqList = document.querySelector(".faq-list");

    if (faqList && faqItems.length) {

        /* Collapse only when JS is running. Without JS every answer
           stays visible, so the content can never disappear. */

        faqList.classList.add("faq-ready");

        var setAnswerHeight = function (item) {
            var answer = item.querySelector(".faq-answer");
            if (!answer) return;

            answer.style.maxHeight = item.classList.contains("active")
                ? answer.scrollHeight + "px"
                : "0px";
        };

        var refreshFaqHeights = function () {
            faqItems.forEach(setAnswerHeight);
        };

        faqItems.forEach(function (item) {

            var button = item.querySelector(".faq-question");
            if (!button) return;

            button.addEventListener("click", function () {

                var willOpen = !item.classList.contains("active");

                faqItems.forEach(function (other) {
                    other.classList.remove("active");
                    var otherButton = other.querySelector(".faq-question");
                    if (otherButton) {
                        otherButton.setAttribute("aria-expanded", "false");
                    }
                });

                if (willOpen) {
                    item.classList.add("active");
                    button.setAttribute("aria-expanded", "true");
                }

                refreshFaqHeights();
            });
        });

        refreshFaqHeights();
        window.addEventListener("resize", refreshFaqHeights);
        window.addEventListener("load", refreshFaqHeights);

        if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
            document.fonts.ready.then(refreshFaqHeights);
        }
    }

    /* ---------- STAT COUNTERS ---------- */

    var counters = Array.prototype.slice.call(
        document.querySelectorAll(".counter")
    );
    var statsSection = document.querySelector(".stats-section");

    if (counters.length && statsSection) {

        var countersStarted = false;

        var startCounters = function () {
            if (countersStarted) return;

            if (
                statsSection.getBoundingClientRect().top >
                window.innerHeight - 100
            ) {
                return;
            }

            countersStarted = true;

            counters.forEach(function (counter) {

                var target = Number(counter.dataset.target) || 0;
                var duration = 1500;
                var startedAt = null;

                var step = function (now) {
                    if (startedAt === null) startedAt = now;

                    var progress = Math.min(
                        (now - startedAt) / duration,
                        1
                    );
                    var eased = 1 - Math.pow(1 - progress, 3);

                    counter.textContent = Math.round(
                        target * eased
                    ).toLocaleString("en-IN");

                    if (progress < 1) requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            });
        };

        window.addEventListener("scroll", startCounters, { passive: true });
        startCounters();
    }

    /* ---------- APPOINTMENT FORM ---------- */

    var appointmentForm = document.getElementById("appointmentForm");

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", function (event) {

            event.preventDefault();

            var button = appointmentForm.querySelector(".form-btn");
            if (!button) return;

            var originalMarkup = button.innerHTML;

            button.classList.add("sent");
            button.disabled = true;
            button.innerHTML = "Request Received ✓";

            window.setTimeout(function () {
                button.classList.remove("sent");
                button.disabled = false;
                button.innerHTML = originalMarkup;
                appointmentForm.reset();
            }, 2600);
        });
    }

    /* ---------- BACK TO TOP ---------- */

    var backTop = document.getElementById("backTop");

    if (backTop) {

        var updateBackTop = function () {
            backTop.classList.toggle("show", window.scrollY > 500);
        };

        window.addEventListener("scroll", updateBackTop, { passive: true });
        updateBackTop();

        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ---------- REVEAL ON SCROLL ---------- */

    var revealElements = Array.prototype.slice.call(
        document.querySelectorAll(
            ".service-card, .about-content, .about-visual, .why-item, " +
            ".why-visual, .contact-box, .faq-item, .doctor-content, " +
            ".tariff-table-wrap, .timings-card, .map-wrapper"
        )
    );

    if (revealElements.length && "IntersectionObserver" in window) {

        revealElements.forEach(function (element) {
            element.classList.add("reveal-init");
        });

        var revealObserver = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                var element = entry.target;

                element.classList.add("reveal-in");
                revealObserver.unobserve(element);

                window.setTimeout(function () {
                    element.classList.remove("reveal-init", "reveal-in");
                }, 800);
            });

        }, { threshold: 0.12 });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    }

})();
