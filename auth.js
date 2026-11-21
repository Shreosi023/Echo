
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("echoUsers")) || [];
    } catch {
        return [];
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("echoCurrentUser"));
    } catch {
        return null;
    }
}

function showMessage(message, success = false) {
    const element = document.getElementById("message");

    if (!element) return;

    element.textContent = message;
    element.style.color = success ? "#4B9B78" : "#D45B75";
}

// ========================================
// PASSWORD VISIBILITY
// ========================================

document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "Hide" : "Show";
    });
});

// ========================================
// REGISTRATION
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (name.length < 2) {
            showMessage("Please enter a valid name.");
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Your passwords do not match.");
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            showMessage("An account with this email already exists.");
            return;
        }

        users.push({
            name,
            email,
            password
        });

        localStorage.setItem("echoUsers", JSON.stringify(users));

        showMessage("Account created successfully! Redirecting...", true);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const savedEmail = localStorage.getItem("echoRememberedEmail");

    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("remember").checked = true;
    }

    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember").checked;

        const users = getUsers();

        const user = users.find(
            account => account.email === email &&
                       account.password === password
        );

        if (!user) {
            showMessage("Incorrect email or password. Please try again.");
            return;
        }

        // Store only basic user information in the session
        localStorage.setItem("echoCurrentUser", JSON.stringify({
            name: user.name,
            email: user.email
        }));

        if (remember) {
            localStorage.setItem("echoRememberedEmail", email);
        } else {
            localStorage.removeItem("echoRememberedEmail");
        }

        window.location.href = "index.html";
    });
}

// ========================================
// DASHBOARD ACCESS
// ========================================

const isDashboard = document.querySelector(".dashboard-page");

if (isDashboard) {
    const params = new URLSearchParams(window.location.search);
    const guestMode = params.get("guest") === "true";

    let currentUser = getCurrentUser();

    // Prevent unauthenticated users from opening the dashboard directly
    if (!currentUser && !guestMode) {
        window.location.replace("login.html");
    } else {
        if (guestMode) {
            sessionStorage.setItem("echoGuest", "true");
        }

        const isGuest = !currentUser;

        const displayName = isGuest
            ? "Guest"
            : currentUser.name;

        const firstName = displayName.split(" ")[0];
        const initial = displayName.charAt(0).toUpperCase();

        document.getElementById("userName").textContent = displayName;
        document.getElementById("welcomeName").textContent = firstName;
        document.getElementById("userRole").textContent =
            isGuest ? "Guest access" : "Registered member";

        document.getElementById("userAvatar").textContent = initial;
        document.getElementById("topAvatar").textContent = initial;

        // Date display
        document.getElementById("currentDate").textContent =
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            });

        // Guest users cannot save projects in this demo
        if (isGuest) {
            document.getElementById("createProjectBtn").textContent =
                "Create Temporary Project";

            document.getElementById("projectCount").textContent = "00";
            document.getElementById("projectList").innerHTML =
                '<p class="empty-project">Guest projects are temporary in this demo. Sign in to manage saved projects.</p>';
        } else {
            renderProjects();
        }
    }
}

// ========================================
// PROJECT MANAGEMENT DEMO
// ========================================

function getProjects() {
    try {
        return JSON.parse(localStorage.getItem("echoProjects")) || [];
    } catch {
        return [];
    }
}

function renderProjects() {
    const projectList = document.getElementById("projectList");

    if (!projectList) return;

    const projects = getProjects();

    document.getElementById("projectCount").textContent =
        String(projects.length).padStart(2, "0");

    if (projects.length === 0) {
        projectList.innerHTML =
            '<p class="empty-project">No projects yet. Create your first network project.</p>';
        return;
    }

    projectList.innerHTML = projects.map((project, index) => `
        <article class="project-item">
            <div class="project-symbol ${index % 2 === 0 ? "purple" : "blue"}">⌘</div>
            <div class="project-details">
                <strong>${escapeHTML(project.name)}</strong>
                <small>Created ${escapeHTML(project.date)}</small>
            </div>
            <span class="project-status completed">Saved</span>
            <button class="project-open" type="button"
                data-project-id="${escapeHTML(project.id)}">→</button>
        </article>
    `).join("");

    projectList.querySelectorAll(".project-open").forEach(button => {
        button.addEventListener("click", () => {
            const project = getProjects().find(
                item => item.id === button.dataset.projectId
            );

            if (project) {
                alert(
                    "Project: " + project.name +
                    "\n\nThe topology editor will be connected here in a later development stage."
                );
            }
        });
    });
}

// Create a project entry
const createProjectBtn = document.getElementById("createProjectBtn");

if (createProjectBtn) {
    createProjectBtn.addEventListener("click", () => {
        const params = new URLSearchParams(window.location.search);
        const isGuest = params.get("guest") === "true";

        const name = prompt("Enter a name for your network project:");

        if (!name || !name.trim()) return;

        if (isGuest) {
            alert("Temporary project created for this demonstration. Project saving requires an account.");
            return;
        }

        const projects = getProjects();

        projects.push({
            id: Date.now().toString(),
            name: name.trim(),
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("echoProjects", JSON.stringify(projects));

        renderProjects();
        alert("Your project has been added successfully!");
    });
}

// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("echoCurrentUser");
        sessionStorage.removeItem("echoGuest");

        window.location.href = "login.html";
    });
}

// ========================================
// MOBILE SIDEBAR
// ========================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", event => {
        if (
            window.innerWidth <= 760 &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }
    });
}

// ========================================
// SAFE HTML DISPLAY
// ========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}
