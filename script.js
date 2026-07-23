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


// Animated typing effect
const typingTarget = document.getElementById("typing-text");
const typingPhrases = [
    "Diploma IT Student",
    "Web Developer",
    "Entrepreneur"
];

if (typingTarget) {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeNextCharacter() {
        const phrase = typingPhrases[phraseIndex];

        if (!deleting) {
            characterIndex += 1;
            typingTarget.textContent = phrase.slice(0, characterIndex);

            if (characterIndex === phrase.length) {
                deleting = true;
                setTimeout(typeNextCharacter, 1300);
                return;
            }
        } else {
            characterIndex -= 1;
            typingTarget.textContent = phrase.slice(0, characterIndex);

            if (characterIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            }
        }

        setTimeout(typeNextCharacter, deleting ? 55 : 90);
    }

    typeNextCharacter();
}


// Final portfolio interactions
const loader = document.getElementById("page-loader");
const progressBar = document.getElementById("scroll-progress");
const backToTop = document.getElementById("back-to-top");

window.addEventListener("load", () => {
    window.setTimeout(() => {
        loader?.classList.add("is-hidden");
    }, 280);
});

function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTop) {
        backToTop.classList.toggle("is-visible", scrollTop > 520);
    }
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Load public GitHub profile statistics from GitHub's official API.
async function loadGitHubStats() {
    const repoCount = document.getElementById("github-repos");
    const followers = document.getElementById("github-followers");
    const following = document.getElementById("github-following");
    const since = document.getElementById("github-since");

    try {
        const response = await fetch("https://api.github.com/users/azaziro01-glitch", {
            headers: { "Accept": "application/vnd.github+json" }
        });

        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const profile = await response.json();
        if (repoCount) repoCount.textContent = profile.public_repos ?? "0";
        if (followers) followers.textContent = profile.followers ?? "0";
        if (following) following.textContent = profile.following ?? "0";
        if (since && profile.created_at) {
            since.textContent = new Date(profile.created_at).getFullYear();
        }
    } catch (error) {
        console.warn("GitHub statistics could not be loaded:", error);
        if (repoCount) repoCount.textContent = "View";
        if (followers) followers.textContent = "GitHub";
        if (following) following.textContent = "Profile";
        if (since) since.textContent = "↗";
    }
}

loadGitHubStats();


// Visitor counter with a graceful fallback.
// The count is requested from CounterAPI; the text remains readable if the service is unavailable.
async function updateVisitorCounter() {
    const countElement = document.getElementById("visitor-count");
    if (!countElement) return;

    try {
        const response = await fetch("https://api.counterapi.dev/v1/vincent-agana/portfolio/up");
        if (!response.ok) throw new Error(`Counter service returned ${response.status}`);
        const data = await response.json();
        countElement.textContent = data.count ?? data.value ?? "1";
    } catch (error) {
        console.warn("Visitor counter could not be loaded:", error);
        countElement.textContent = "Welcome";
    }
}

updateVisitorCounter();


// Highlight the navigation link for the section currently in view.
const navLinks = Array.from(document.querySelectorAll('#main-nav a[href^="#"]'));
const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeHref = `#${entry.target.id}`;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    observedSections.forEach((section) => navObserver.observe(section));
}

// Display a success note after FormSubmit redirects back.
const query = new URLSearchParams(window.location.search);
if (query.get("message") === "sent") {
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        const success = document.createElement("p");
        success.className = "form-success";
        success.textContent = "Thank you. Your message has been submitted successfully.";
        contactForm.prepend(success);
    }
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.hash || "#contact"}`);
}

// Mark external links visually while preserving accessible text.
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (link.querySelector(".external-indicator")) return;
    const indicator = document.createElement("span");
    indicator.className = "external-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = " ↗";
    link.append(indicator);
});
