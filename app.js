// =====================================================
// MASTERS HUB ETHIOPIA
// TELEGRAM MINI APP
// =====================================================


// =====================================================
// TELEGRAM INITIALIZATION
// =====================================================

let tg = null;

if (window.Telegram && window.Telegram.WebApp) {

    tg = window.Telegram.WebApp;

    tg.ready();

    tg.expand();

}


// =====================================================
// USER
// =====================================================

let telegramUser = null;

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {

    telegramUser = tg.initDataUnsafe.user;

}


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeTelegramTheme();

    initializeUser();

});


// =====================================================
// TELEGRAM THEME
// =====================================================

function initializeTelegramTheme() {

    if (!tg) {
        return;
    }

    if (
        tg.colorScheme === "dark"
    ) {

        document.body.classList.add(
            "telegram-dark"
        );

    }

}


// =====================================================
// USER
// =====================================================

function initializeUser() {

    const welcomeTitle =
        document.getElementById(
            "welcomeTitle"
        );

    if (
        telegramUser &&
        telegramUser.first_name
    ) {

        welcomeTitle.textContent =
            `Welcome, ${telegramUser.first_name}`;

    }

}


// =====================================================
// HOME
// =====================================================

function goHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    setActiveNav(0);

}


// =====================================================
// NAVIGATION
// =====================================================

function setActiveNav(index) {

    const items =
        document.querySelectorAll(
            ".nav-item"
        );

    items.forEach(
        (item, i) => {

            if (i === index) {

                item.classList.add(
                    "active"
                );

            } else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =====================================================
// OPEN SECTION
// =====================================================

function openSection(section) {

    let title = "";
    let description = "";

    switch (section) {

        case "spss":

            title =
                "📊 SPSS & Data Analysis";

            description =
                "Professional SPSS support, statistical analysis, interpretation, datasets, tutorials and SPSS syntax.";

            break;


        case "thesis":

            title =
                "📝 Thesis Support";

            description =
                "Support with proposal development, methodology, analysis, interpretation, discussion and academic formatting.";

            break;


        case "research":

            title =
                "📚 Research Support";

            description =
                "Research methodology, topic development, literature review, research frameworks and academic guidance.";

            break;


        case "questionnaires":

            title =
                "📋 Questionnaires";

            description =
                "Questionnaire design, Likert scales, research instruments and SPSS-ready data collection tools.";

            break;


        default:

            title =
                "Masters Hub";

            description =
                "Academic resources and professional services.";

    }


    showModal(
        title,
        description,
        "Request support",
        () => {

            requestService(
                title.replace(
                    /[^a-zA-Z0-9 &]/g,
                    ""
                )
            );

        }
    );

}


// =====================================================
// SERVICES
// =====================================================

function showServices() {

    setActiveNav(2);

    showModal(
        "💼 Academic Services",
        `
        <p class="modal-text">
            Masters Hub Ethiopia provides practical
            academic and research support.
        </p>

        <button
            class="modal-button"
            onclick="requestService('SPSS Data Analysis')"
        >
            📊 SPSS Data Analysis
        </button>

        <button
            class="modal-button"
            onclick="requestService('Thesis Support')"
        >
            📝 Thesis Support
        </button>

        <button
            class="modal-button"
            onclick="requestService('Research Consultation')"
        >
            📚 Research Consultation
        </button>

        <button
            class="modal-button"
            onclick="requestService('Questionnaire Design')"
        >
            📋 Questionnaire Design
        </button>

        <button
            class="modal-button"
            onclick="requestService('Academic Editing')"
        >
            ✍️ Academic Editing
        </button>

        <button
            class="modal-button"
            onclick="requestService('Data Interpretation')"
        >
            📈 Data Interpretation
        </button>
        `
    );

}


// =====================================================
// ALL SERVICES
// =====================================================

function showAllServices() {

    showServices();

}


// =====================================================
// RESOURCES
// =====================================================

function showResources() {

    setActiveNav(1);

    showModal(
        "📚 Resources",
        `
        <p class="modal-text">
            Masters Hub resources will include
            practical academic materials for
            postgraduate students and researchers.
        </p>

        <button
            class="modal-button"
            onclick="openResource('Research Templates')"
        >
            📁 Research Templates
        </button>

        <button
            class="modal-button"
            onclick="openResource('SPSS Resources')"
        >
            📊 SPSS Resources
        </button>

        <button
            class="modal-button"
            onclick="openResource('Research Guides')"
        >
            📚 Research Guides
        </button>

        <button
            class="modal-button"
            onclick="openResource('Academic Writing')"
        >
            ✍️ Academic Writing
        </button>

        <button
            class="modal-button"
            onclick="openResource('Sample Datasets')"
        >
            📈 Sample Datasets
        </button>
        `
    );

}


// =====================================================
// RESOURCE
// =====================================================

function openResource(name) {

    showModal(
        name,
        `
        <p class="modal-text">
            This resource section is being prepared.
            It will be connected to the Masters Hub
            resource library.
        </p>
        `
    );

}


// =====================================================
// PROFILE
// =====================================================

function showProfile() {

    let name = "Telegram Student";

    let username = "";

    if (telegramUser) {

        name =
            telegramUser.first_name ||
            "Telegram Student";

        if (
            telegramUser.last_name
        ) {

            name +=
                " " +
                telegramUser.last_name;

        }

        if (
            telegramUser.username
        ) {

            username =
                "@" +
                telegramUser.username;

        }

    }


    showModal(
        "👤 My Profile",
        `
        <div style="
            text-align:center;
            padding:15px 0;
        ">

            <div style="
                width:70px;
                height:70px;
                border-radius:50%;
                background:#2563eb;
                color:white;
                display:flex;
                align-items:center;
                justify-content:center;
                margin:0 auto 15px;
                font-size:30px;
            ">
                👤
            </div>

            <h3 style="
                margin-bottom:5px;
            ">
                ${escapeHtml(name)}
            </h3>

            <p class="modal-text">
                ${escapeHtml(username)}
            </p>

            <p class="modal-text">
                Your Masters Hub account will be
                connected to your Telegram account.
            </p>

        </div>
        `
    );

}


// =====================================================
// REQUEST SERVICE
// =====================================================

function requestService(serviceName) {

    closeModal();

    showModal(
        "📩 Request Service",
        `
        <p class="modal-text">
            You selected:
            <strong>
                ${escapeHtml(serviceName)}
            </strong>
        </p>

        <p class="modal-text">
            The service-request system will allow
            you to provide your academic requirements,
            upload files and receive a quotation.
        </p>

        <button
            class="modal-button"
            onclick="sendServiceRequest('${escapeHtml(serviceName)}')"
        >
            Continue
        </button>
        `
    );

}


// =====================================================
// SEND SERVICE REQUEST
// =====================================================

function sendServiceRequest(serviceName) {

    closeModal();

    if (
        tg &&
        tg.showPopup
    ) {

        tg.showPopup(
            {
                title: "Service Request",
                message:
                    `Your request for ${serviceName} will be connected to the Masters Hub service system.`,
                buttons: [
                    {
                        id: "ok",
                        type: "ok",
                        text: "OK"
                    }
                ]
            }
        );

    } else {

        alert(
            `Service selected: ${serviceName}`
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function searchContent() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const query =
        input.value
            .toLowerCase()
            .trim();

    const cards =
        document.querySelectorAll(
            ".service-card, .large-card, .resource-card"
        );

    if (!query) {

        cards.forEach(
            card => {
                card.style.display = "";
            }
        );

        return;

    }


    cards.forEach(
        card => {

            const text =
                card.textContent
                    .toLowerCase();

            if (
                text.includes(query)
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        }
    );

}


// =====================================================
// MODAL
// =====================================================

function showModal(
    title,
    content,
    buttonText = null,
    buttonAction = null
) {

    const modal =
        document.getElementById(
            "modal"
        );

    const body =
        document.getElementById(
            "modalBody"
        );


    let html = `
        <h2 class="modal-title">
            ${title}
        </h2>
    `;


    if (
        typeof content === "string"
    ) {

        html += content;

    }


    if (
        buttonText &&
        buttonAction
    ) {

        html += `
            <button
                id="modalActionButton"
                class="modal-button"
            >
                ${buttonText}
            </button>
        `;

    }


    body.innerHTML = html;

    modal.classList.remove(
        "hidden"
    );


    if (
        buttonText &&
        buttonAction
    ) {

        document
            .getElementById(
                "modalActionButton"
            )
            .addEventListener(
                "click",
                buttonAction
            );

    }

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );

    modal.classList.add(
        "hidden"
    );

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}