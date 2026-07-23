const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const currentYear = document.getElementById("current-year");

function setTheme(theme) {
    if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        root.removeAttribute("data-theme");
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
    localStorage.setItem("portfolio-theme", theme);
}

themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
});

if (root.getAttribute("data-theme") === "dark") {
    themeToggle.setAttribute("aria-label", "Switch to light mode");
}

currentYear.textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
        revealObserver.observe(element);
    });

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                skillFills.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = `${bar.dataset.level}%`;
                    }, index * 100);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.getElementById("skills");
    if (skillsSection) skillsObserver.observe(skillsSection);
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    skillFills.forEach((bar) => {
        bar.style.width = `${bar.dataset.level}%`;
    });
}
