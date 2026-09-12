/* =========================================================
   MASTERS HUB ETHIOPIA
   Telegram Mini App
   Frontend JavaScript
   Backend: Google Apps Script
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_URL =
  "https://script.google.com/macros/s/AKfycbyZ7OacV-r4FJFESbg9bLT11nGoRpjlG5oJZFIURBObG_ZoQllRckcUXJd9Ldh7oqVb/exec";


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let tg = null;
let telegramUser = null;

let services = [];

let currentService = "";
let currentRequestNo = "";

let isLoadingServices = false;


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    console.log(
      "Masters Hub Ethiopia starting..."
    );

    initializeTelegram();

    loadTelegramUser();

    updateWelcome();

    applyTelegramTheme();

    setupTelegramBackButton();

    await registerTelegramUser();

    await loadServices();

    console.log(
      "Masters Hub Ethiopia initialized."
    );

  }
);


/* =========================================================
   TELEGRAM INITIALIZATION
   ========================================================= */

function initializeTelegram() {

  if (
    window.Telegram &&
    window.Telegram.WebApp
  ) {

    tg =
      window.Telegram.WebApp;

    try {

      tg.ready();

      tg.expand();

      console.log(
        "Telegram WebApp initialized."
      );

    } catch (error) {

      console.warn(
        "Telegram initialization warning:",
        error
      );

    }

  } else {

    console.warn(
      "Telegram WebApp API not available."
    );

  }

}


/* =========================================================
   TELEGRAM BACK BUTTON
   ========================================================= */

function setupTelegramBackButton() {

  if (
    !tg ||
    !tg.BackButton
  ) {

    return;

  }

  try {

    tg.BackButton.onClick(
      function () {

        closeModal();

        tg.BackButton.hide();

      }
    );

  } catch (error) {

    console.warn(
      "Telegram BackButton error:",
      error
    );

  }

}


/* =========================================================
   TELEGRAM USER
   ========================================================= */

function loadTelegramUser() {

  if (
    tg &&
    tg.initDataUnsafe &&
    tg.initDataUnsafe.user
  ) {

    telegramUser =
      tg.initDataUnsafe.user;

    console.log(
      "Telegram user:",
      telegramUser
    );

  } else {

    console.warn(
      "Telegram user not available."
    );

    /*
     * Browser testing fallback.
     *
     * Real Telegram users will receive
     * their actual Telegram account data.
     */

    telegramUser = {

      id:
        "web-test-user",

      first_name:
        "Test",

      last_name:
        "User",

      username:
        "testuser"

    };

  }

}


/* =========================================================
   WELCOME MESSAGE
   ========================================================= */

function updateWelcome() {

  const welcomeTitle =
    document.getElementById(
      "welcomeTitle"
    );

  if (!welcomeTitle) {

    return;

  }

  const firstName =
    telegramUser &&
    telegramUser.first_name
      ? telegramUser.first_name
      : "";

  if (firstName) {

    welcomeTitle.textContent =
      `Welcome, ${firstName}`;

  } else {

    welcomeTitle.textContent =
      "Welcome to Masters Hub";

  }

}


/* =========================================================
   TELEGRAM THEME
   ========================================================= */

function applyTelegramTheme() {

  if (!tg) {

    return;

  }

  try {

    const params =
      tg.themeParams || {};

    if (params.bg_color) {

      document.documentElement.style.setProperty(
        "--tg-bg-color",
        params.bg_color
      );

    }

    if (params.text_color) {

      document.documentElement.style.setProperty(
        "--tg-text-color",
        params.text_color
      );

    }

    if (params.hint_color) {

      document.documentElement.style.setProperty(
        "--tg-hint-color",
        params.hint_color
      );

    }

    if (params.button_color) {

      document.documentElement.style.setProperty(
        "--tg-button-color",
        params.button_color
      );

    }

  } catch (error) {

    console.warn(
      "Theme error:",
      error
    );

  }

}


/* =========================================================
   API REQUEST
   ========================================================= */

async function apiRequest(data) {

  console.log(
    "API REQUEST:",
    data
  );

  try {

    const response =
      await fetch(
        API_URL,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(data)
        }
      );


    console.log(
      "API STATUS:",
      response.status
    );


    const text =
      await response.text();


    console.log(
      "API RESPONSE:",
      text
    );


    if (!text) {

      throw new Error(
        "Backend returned an empty response."
      );

    }


    let result;

    try {

      result =
        JSON.parse(text);

    } catch (error) {

      console.error(
        "JSON parsing failed:",
        error
      );

      throw new Error(
        "Backend returned invalid JSON."
      );

    }


    if (
      result.success === false
    ) {

      throw new Error(
        result.error ||
        "Backend request failed."
      );

    }


    return result;

  } catch (error) {

    console.error(
      "API ERROR:",
      error
    );

    showError(
      error.message ||
      "Unable to connect to the backend."
    );

    throw error;

  }

}


/* =========================================================
   REGISTER USER
   ========================================================= */

async function registerTelegramUser(
  phone = "",
  email = ""
) {

  if (!telegramUser) {

    return null;

  }

  try {

    const result =
      await apiRequest({

        action:
          "register_user",

        telegramId:
          String(
            telegramUser.id || ""
          ),

        firstName:
          telegramUser.first_name || "",

        lastName:
          telegramUser.last_name || "",

        username:
          telegramUser.username || "",

        phone:
          phone,

        email:
          email

      });


    console.log(
      "USER REGISTERED:",
      result
    );


    return result;

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    /*
     * Registration failure should not
     * prevent the application from opening.
     */

    return null;

  }

}


/* =========================================================
   LOAD SERVICES
   ========================================================= */

async function loadServices() {

  if (isLoadingServices) {

    return;

  }

  isLoadingServices = true;

  try {

    const result =
      await apiRequest({

        action:
          "get_services"

      });


    if (
      result &&
      Array.isArray(
        result.services
      )
    ) {

      services =
        result.services;

      console.log(
        "SERVICES LOADED:",
        services
      );

    } else {

      services = [];

    }


    renderServices();

  } catch (error) {

    console.error(
      "Could not load services:",
      error
    );


    services =
      getFallbackServices();


    renderServices();

  } finally {

    isLoadingServices = false;

  }

}


/* =========================================================
   FALLBACK SERVICES
   ========================================================= */

function getFallbackServices() {

  return [

    {
      id:
        "SRV001",

      name:
        "SPSS & Data Analysis",

      description:
        "Descriptive statistics, reliability, correlation, regression, ANOVA and interpretation.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV002",

      name:
        "Thesis Support",

      description:
        "Academic support throughout thesis development.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV003",

      name:
        "Proposal Support",

      description:
        "Research proposal development and improvement.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV004",

      name:
        "Questionnaire Design",

      description:
        "Research questionnaire development and SPSS-ready design.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV005",

      name:
        "Research Consultation",

      description:
        "Research methodology and academic consultation.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV006",

      name:
        "Academic Editing",

      description:
        "Academic language, structure and formatting improvement.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV007",

      name:
        "Data Interpretation",

      description:
        "Interpretation of statistical results and findings.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    },


    {
      id:
        "SRV008",

      name:
        "Academic Formatting",

      description:
        "Thesis, proposal and academic document formatting.",

      price:
        0,

      currency:
        "ETB",

      status:
        "Active"
    }

  ];

}


/* =========================================================
   RENDER SERVICES
   ========================================================= */

function renderServices() {

  /*
   * The main HTML already contains
   * the featured service cards.
   *
   * Dynamic services are displayed
   * through showServices().
   */

}


/* =========================================================
   QUICK SERVICE BUTTONS
   ========================================================= */

function openSection(section) {

  let serviceName = "";


  switch (
    String(section)
      .toLowerCase()
  ) {

    case "spss":

      serviceName =
        "SPSS Data Analysis";

      break;


    case "thesis":

      serviceName =
        "Thesis Support";

      break;


    case "research":

      serviceName =
        "Research Consultation";

      break;


    case "questionnaires":

      serviceName =
        "Questionnaire Design";

      break;


    default:

      serviceName =
        section;

  }


  currentService =
    serviceName;


  const service =
    findService(
      serviceName
    );


  const description =
    service
      ? service.description
      : getServiceDescription(
          serviceName
        );


  showModal(

    serviceName,

    `

      <div class="service-detail">

        <div class="service-icon">
          ${getServiceIcon(serviceName)}
        </div>

        <h2>
          ${escapeHtml(serviceName)}
        </h2>

        <p>
          ${escapeHtml(description)}
        </p>

        <button
          class="primary-button"
          type="button"
          onclick="requestService('${escapeJsString(serviceName)}')"
        >
          Request Service
        </button>

      </div>

    `

  );

}


/* =========================================================
   FIND SERVICE
   ========================================================= */

function findService(name) {

  return services.find(
    service =>
      String(service.name)
        .toLowerCase() ===
      String(name)
        .toLowerCase()
  );

}


/* =========================================================
   SERVICE DESCRIPTION
   ========================================================= */

function getServiceDescription(
  serviceName
) {

  const descriptions = {

    "SPSS Data Analysis":
      "Professional support with descriptive statistics, reliability analysis, correlation, regression, ANOVA and interpretation.",

    "Thesis Support":
      "Support throughout thesis development including methodology, analysis, discussion and formatting.",

    "Research Consultation":
      "Research methodology, design, academic guidance and consultation.",

    "Questionnaire Design":
      "Professional research questionnaire development and SPSS-ready design."

  };


  return (
    descriptions[serviceName] ||
    "Professional academic support from Masters Hub Ethiopia."
  );

}


/* =========================================================
   SHOW ALL SERVICES
   ========================================================= */

function showAllServices() {

  showServices();

}


/* =========================================================
   SHOW SERVICES
   ========================================================= */

function showServices() {

  if (!services.length) {

    services =
      getFallbackServices();

  }


  const serviceHtml =
    services
      .map(
        service => {

          return `

            <div class="service-list-item">

              <div class="service-icon">
                ${getServiceIcon(service.name)}
              </div>

              <div class="service-list-content">

                <h3>
                  ${escapeHtml(
                    service.name
                  )}
                </h3>

                <p>
                  ${escapeHtml(
                    service.description || ""
                  )}
                </p>

                ${
                  service.price !== undefined &&
                  service.price !== null &&
                  Number(service.price) > 0
                    ? `
                      <small>
                        Starting from
                        ${formatCurrency(
                          service.price,
                          service.currency || "ETB"
                        )}
                      </small>
                    `
                    : ""
                }

                <button
                  type="button"
                  onclick="requestService('${escapeJsString(service.name)}')"
                >
                  Request Service
                </button>

              </div>

            </div>

          `;

        }
      )
      .join("");


  showModal(

    "Academic Services",

    `

      <div class="services-list">

        ${serviceHtml}

      </div>

    `

  );

}


/* =========================================================
   REQUEST SERVICE
   ========================================================= */

function requestService(
  serviceName
) {

  currentService =
    serviceName;


  showModal(

    "Request Service",

    `

      <form
        id="serviceRequestForm"
        onsubmit="submitServiceRequest(event)"
      >

        <div class="form-group">

          <label>
            Service
          </label>

          <input
            type="text"
            value="${escapeAttribute(serviceName)}"
            readonly
          >

        </div>


        <div class="form-group">

          <label>
            Phone Number
          </label>

          <input
            id="requestPhone"
            type="tel"
            placeholder="09XXXXXXXX"
            required
          >

        </div>


        <div class="form-group">

          <label>
            Describe what you need
          </label>

          <textarea
            id="requestDescription"
            rows="5"
            placeholder="Describe your thesis, research, SPSS or academic support requirement..."
            required
          ></textarea>

        </div>


        <button
          id="submitRequestButton"
          type="submit"
          class="primary-button"
        >
          Submit Request
        </button>

      </form>

    `

  );

}


/* =========================================================
   SUBMIT SERVICE REQUEST
   ========================================================= */

async function submitServiceRequest(
  event
) {

  event.preventDefault();


  const phoneInput =
    document.getElementById(
      "requestPhone"
    );


  const descriptionInput =
    document.getElementById(
      "requestDescription"
    );


  const submitButton =
    document.getElementById(
      "submitRequestButton"
    );


  if (
    !phoneInput ||
    !descriptionInput
  ) {

    showError(
      "Request form could not be loaded."
    );

    return;

  }


  const phone =
    phoneInput.value.trim();


  const description =
    descriptionInput.value.trim();


  if (!phone) {

    showError(
      "Please enter your phone number."
    );

    return;

  }


  if (!description) {

    showError(
      "Please describe what you need."
    );

    return;

  }


  if (
    !telegramUser ||
    !telegramUser.id
  ) {

    showError(
      "Telegram user information is not available."
    );

    return;

  }


  try {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";


    await registerTelegramUser(
      phone,
      ""
    );


    const result =
      await apiRequest({

        action:
          "create_request",

        telegramId:
          String(
            telegramUser.id
          ),

        customerName:
          getCustomerName(),

        username:
          telegramUser.username || "",

        phone:
          phone,

        service:
          currentService,

        description:
          description,

        fileUrl:
          ""

      });


    console.log(
      "CREATE REQUEST RESULT:",
      result
    );


    if (
      !result ||
      !result.success ||
      !result.requestNo
    ) {

      throw new Error(
        result?.error ||
        "The request was not created."
      );

    }


    currentRequestNo =
      result.requestNo;


    showRequestCreated(
      result.requestNo,
      currentService
    );


  } catch (error) {

    console.error(
      "REQUEST ERROR:",
      error
    );

  } finally {

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Request";

    }

  }

}


/* =========================================================
   REQUEST CREATED
   ========================================================= */

function showRequestCreated(
  requestNo,
  serviceName
) {

  currentRequestNo =
    requestNo;


  showModal(

    "Request Created",

    `

      <div class="success-state">

        <div class="success-icon">
          ✓
        </div>

        <h2>
          Request Submitted
        </h2>

        <p>
          Your service request has been successfully received.
        </p>


        <div class="request-number">

          <strong>
            Request No:
          </strong>

          <span>
            ${escapeHtml(requestNo)}
          </span>

        </div>


        <p>
          <strong>
            Service:
          </strong>

          ${escapeHtml(serviceName)}
        </p>


        <button
          type="button"
          class="primary-button"
          onclick="showPaymentForm('${escapeJsString(requestNo)}')"
        >
          Submit Payment
        </button>


        <button
          type="button"
          class="secondary-button"
          onclick="showMyRequests()"
        >
          View My Requests
        </button>

      </div>

    `

  );

}


/* =========================================================
   PAYMENT FORM
   ========================================================= */

function showPaymentForm(
  requestNo
) {

  currentRequestNo =
    requestNo;


  showModal(

    "Submit Payment",

    `

      <form
        id="paymentForm"
        onsubmit="submitPayment(event)"
      >

        <div class="form-group">

          <label>
            Request Number
          </label>

          <input
            type="text"
            value="${escapeAttribute(requestNo)}"
            readonly
          >

        </div>


        <div class="form-group">

          <label>
            Payment Method
          </label>

          <select
            id="paymentMethod"
            required
          >

            <option value="">
              Select payment method
            </option>

            <option value="Telebirr">
              Telebirr
            </option>

            <option value="CBE">
              CBE
            </option>

            <option value="Awash Bank">
              Awash Bank
            </option>

            <option value="Bank of Abyssinia">
              Bank of Abyssinia
            </option>

            <option value="Hibret Bank">
              Hibret Bank
            </option>

            <option value="Other Bank">
              Other Bank
            </option>

          </select>

        </div>


        <div class="form-group">

          <label>
            Amount (ETB)
          </label>

          <input
            id="paymentAmount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            required
          >

        </div>


        <div class="form-group">

          <label>
            Transaction / Reference Number
          </label>

          <input
            id="transactionReference"
            type="text"
            placeholder="Enter transaction reference"
            required
          >

        </div>


        <button
          id="submitPaymentButton"
          type="submit"
          class="primary-button"
        >
          Submit Payment
        </button>

      </form>

    `

  );

}


/* =========================================================
   SUBMIT PAYMENT
   ========================================================= */

async function submitPayment(
  event
) {

  event.preventDefault();


  const paymentMethod =
    document.getElementById(
      "paymentMethod"
    );


  const paymentAmount =
    document.getElementById(
      "paymentAmount"
    );


  const transactionReference =
    document.getElementById(
      "transactionReference"
    );


  const submitButton =
    document.getElementById(
      "submitPaymentButton"
    );


  if (
    !paymentMethod ||
    !paymentAmount ||
    !transactionReference
  ) {

    showError(
      "Payment form could not be loaded."
    );

    return;

  }


  const method =
    paymentMethod.value.trim();


  const amount =
    paymentAmount.value.trim();


  const reference =
    transactionReference.value.trim();


  if (!method) {

    showError(
      "Please select a payment method."
    );

    return;

  }


  if (!amount) {

    showError(
      "Please enter the payment amount."
    );

    return;

  }


  if (
    Number(amount) <= 0
  ) {

    showError(
      "Payment amount must be greater than zero."
    );

    return;

  }


  if (!reference) {

    showError(
      "Please enter the transaction reference."
    );

    return;

  }


  if (
    !telegramUser ||
    !telegramUser.id
  ) {

    showError(
      "Telegram user information is not available."
    );

    return;

  }


  try {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";


    const result =
      await apiRequest({

        action:
          "submit_payment",

        requestNo:
          currentRequestNo,

        telegramId:
          String(
            telegramUser.id
          ),

        customerName:
          getCustomerName(),

        paymentMethod:
          method,

        amount:
          amount,

        currency:
          "ETB",

        transactionReference:
          reference,

        receiptUrl:
          ""

      });


    console.log(
      "PAYMENT RESULT:",
      result
    );


    if (
      !result ||
      !result.success
    ) {

      throw new Error(
        result?.error ||
        "Payment submission failed."
      );

    }


    showPaymentSubmitted(
      result.paymentId,
      currentRequestNo
    );


  } catch (error) {

    console.error(
      "PAYMENT ERROR:",
      error
    );

  } finally {

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Payment";

    }

  }

}


/* =========================================================
   PAYMENT SUCCESS
   ========================================================= */

function showPaymentSubmitted(
  paymentId,
  requestNo
) {

  showModal(

    "Payment Submitted",

    `

      <div class="success-state">

        <div class="success-icon">
          ✓
        </div>

        <h2>
          Payment Submitted
        </h2>

        <p>
          Your payment has been submitted
          and is waiting for verification.
        </p>


        <div class="request-number">

          <strong>
            Payment ID:
          </strong>

          <span>
            ${escapeHtml(paymentId)}
          </span>

        </div>


        <div class="request-number">

          <strong>
            Request No:
          </strong>

          <span>
            ${escapeHtml(requestNo)}
          </span>

        </div>


        <button
          type="button"
          class="primary-button"
          onclick="showMyRequests()"
        >
          View My Requests
        </button>

      </div>

    `

  );

}


/* =========================================================
   MY REQUESTS
   ========================================================= */

async function showMyRequests() {

  if (
    !telegramUser ||
    !telegramUser.id
  ) {

    showError(
      "Telegram user information is not available."
    );

    return;

  }


  showModal(

    "My Requests",

    `

      <div class="loading-state">
        Loading your requests...
      </div>

    `

  );


  try {

    const result =
      await apiRequest({

        action:
          "get_requests",

        telegramId:
          String(
            telegramUser.id
          )

      });


    const requests =
      Array.isArray(
        result.requests
      )
        ? result.requests
        : [];


    if (
      requests.length === 0
    ) {

      showModal(

        "My Requests",

        `

          <div class="empty-state">

            <h3>
              No Requests Yet
            </h3>

            <p>
              You have not submitted any service requests.
            </p>

            <button
              type="button"
              class="primary-button"
              onclick="showServices()"
            >
              Browse Services
            </button>

          </div>

        `

      );

      return;

    }


    showModal(

      "My Requests",

      `

        <div class="requests-list">

          ${requests
            .map(
              request =>
                renderRequestCard(
                  request
                )
            )
            .join("")}

        </div>

      `

    );


  } catch (error) {

    console.error(
      "MY REQUESTS ERROR:",
      error
    );

  }

}


/* =========================================================
   REQUEST CARD
   ========================================================= */

function renderRequestCard(
  request
) {

  const requestNo =
    request.requestNo || "";


  const service =
    request.service || "";


  const description =
    request.description || "";


  const paymentStatus =
    request.paymentStatus ||
    "Pending";


  const requestStatus =
    request.requestStatus ||
    "New";


  const date =
    request.date || "";


  return `

    <div class="request-card">

      <div class="request-card-header">

        <strong>
          ${escapeHtml(requestNo)}
        </strong>

        <span class="status-badge">
          ${escapeHtml(requestStatus)}
        </span>

      </div>


      <div class="request-card-body">

        <h3>
          ${escapeHtml(service)}
        </h3>

        <p>
          ${escapeHtml(description)}
        </p>


        ${
          date
            ? `
              <small>
                ${escapeHtml(date)}
              </small>
            `
            : ""
        }


        <div class="request-status-row">

          <span>
            Payment:
          </span>

          <strong>
            ${escapeHtml(paymentStatus)}
          </strong>

        </div>


        <div class="request-status-row">

          <span>
            Request:
          </span>

          <strong>
            ${escapeHtml(requestStatus)}
          </strong>

        </div>


        ${
          request.adminNote
            ? `
              <div class="admin-note">

                <strong>
                  Admin:
                </strong>

                ${escapeHtml(
                  request.adminNote
                )}

              </div>
            `
            : ""
        }


        ${
          String(
            paymentStatus
          ).toLowerCase() ===
          "pending"

            ? `

              <button
                type="button"
                class="primary-button"
                onclick="showPaymentForm('${escapeJsString(requestNo)}')"
              >
                Submit Payment
              </button>

            `

            : ""
        }

      </div>

    </div>

  `;

}


/* =========================================================
   RESOURCES
   ========================================================= */

function showResources() {

  showModal(

    "Resources",

    `

      <div class="resources-modal-list">

        <button
          type="button"
          class="resource-card"
          onclick="openResource('templates')"
        >

          <div class="resource-icon">
            📁
          </div>

          <div>

            <strong>
              Research Templates
            </strong>

            <p>
              Proposal and thesis templates
            </p>

          </div>

        </button>


        <button
          type="button"
          class="resource-card"
          onclick="openResource('spss')"
        >

          <div class="resource-icon">
            📊
          </div>

          <div>

            <strong>
              SPSS Resources
            </strong>

            <p>
              Guides, syntax and datasets
            </p>

          </div>

        </button>


        <button
          type="button"
          class="resource-card"
          onclick="openResource('research')"
        >

          <div class="resource-icon">
            📘
          </div>

          <div>

            <strong>
              Research Guides
            </strong>

            <p>
              Methodology and academic writing
            </p>

          </div>

        </button>

      </div>

    `

  );

}


/* =========================================================
   OPEN RESOURCE
   ========================================================= */

function openResource(
  resource
) {

  let title = "";
  let content = "";


  switch (
    String(resource)
      .toLowerCase()
  ) {

    case "templates":

      title =
        "Research Templates";

      content = `

        <div class="resource-detail">

          <div class="resource-icon">
            📁
          </div>

          <h2>
            Research Templates
          </h2>

          <p>
            Proposal and thesis templates
            will be available here.
          </p>

        </div>

      `;

      break;


    case "spss":

      title =
        "SPSS Resources";

      content = `

        <div class="resource-detail">

          <div class="resource-icon">
            📊
          </div>

          <h2>
            SPSS Resources
          </h2>

          <p>
            SPSS guides, syntax examples
            and research datasets.
          </p>

        </div>

      `;

      break;


    case "research":

      title =
        "Research Guides";

      content = `

        <div class="resource-detail">

          <div class="resource-icon">
            📘
          </div>

          <h2>
            Research Guides
          </h2>

          <p>
            Research methodology,
            academic writing and
            research guidance.
          </p>

        </div>

      `;

      break;


    default:

      title =
        "Resource";

      content = `

        <p>
          This resource will be available soon.
        </p>

      `;

  }


  showModal(
    title,
    content
  );

}


/* =========================================================
   PROFILE
   ========================================================= */

function showProfile() {

  const firstName =
    telegramUser?.first_name ||
    "Telegram";


  const lastName =
    telegramUser?.last_name ||
    "";


  const username =
    telegramUser?.username
      ? "@" +
        telegramUser.username
      : "No username";


  showModal(

    "My Profile",

    `

      <div class="profile-section">

        <div class="profile-avatar">

          ${escapeHtml(
            firstName
              .charAt(0)
              .toUpperCase()
          )}

        </div>


        <h2>

          ${escapeHtml(
            `${firstName} ${lastName}`
              .trim()
          )}

        </h2>


        <p>

          ${escapeHtml(username)}

        </p>


        <button
          type="button"
          class="primary-button"
          onclick="showMyRequests()"
        >
          My Requests
        </button>

      </div>

    `

  );

}


/* =========================================================
   SEARCH
   ========================================================= */

function searchContent() {

  const input =
    document.getElementById(
      "searchInput"
    );


  if (!input) {

    return;

  }


  const query =
    input.value
      .trim()
      .toLowerCase();


  const serviceCards =
    document.querySelectorAll(
      ".large-card"
    );


  serviceCards.forEach(
    card => {

      const text =
        card.textContent
          .toLowerCase();


      if (
        !query ||
        text.includes(query)
      ) {

        card.style.display =
          "";

      } else {

        card.style.display =
          "none";

      }

    }
  );

}


/* =========================================================
   HOME NAVIGATION
   ========================================================= */

function goHome() {

  closeModal();


  const mainContent =
    document.getElementById(
      "mainContent"
    );


  if (mainContent) {

    window.scrollTo({

      top:
        0,

      behavior:
        "smooth"

    });

  }

}


/* =========================================================
   SERVICE ICON
   ========================================================= */

function getServiceIcon(
  name
) {

  const value =
    String(name || "")
      .toLowerCase();


  if (
    value.includes("spss") ||
    value.includes("data analysis")
  ) {

    return "📊";

  }


  if (
    value.includes("thesis")
  ) {

    return "📕";

  }


  if (
    value.includes("proposal")
  ) {

    return "📝";

  }


  if (
    value.includes("questionnaire")
  ) {

    return "📋";

  }


  if (
    value.includes("research")
  ) {

    return "📘";

  }


  if (
    value.includes("editing")
  ) {

    return "✏️";

  }


  if (
    value.includes("interpretation")
  ) {

    return "📈";

  }


  if (
    value.includes("format")
  ) {

    return "📝";

  }


  return "🎓";

}


/* =========================================================
   MODAL
   ========================================================= */

function showModal(
  title,
  content
) {

  const modal =
    document.getElementById(
      "modal"
    );


  const modalBody =
    document.getElementById(
      "modalBody"
    );


  if (
    !modal ||
    !modalBody
  ) {

    console.error(
      "Modal elements not found."
    );

    return;

  }


  modalBody.innerHTML = `

    <div class="modal-title">

      <h2>
        ${escapeHtml(title)}
      </h2>

    </div>

    ${content}

  `;


  modal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );


  if (
    tg &&
    tg.BackButton
  ) {

    try {

      tg.BackButton.show();

    } catch (error) {

      console.warn(
        "BackButton show error:",
        error
      );

    }

  }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

  const modal =
    document.getElementById(
      "modal"
    );


  if (!modal) {

    return;

  }


  modal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );


  if (
    tg &&
    tg.BackButton
  ) {

    try {

      tg.BackButton.hide();

    } catch (error) {

      console.warn(
        "BackButton hide error:",
        error
      );

    }

  }

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(
  message
) {

  console.error(
    "ERROR:",
    message
  );


  if (
    tg &&
    typeof tg.showAlert ===
      "function"
  ) {

    try {

      tg.showAlert(
        String(message)
      );

      return;

    } catch (error) {

      console.error(
        error
      );

    }

  }


  alert(
    String(message)
  );

}


/* =========================================================
   CUSTOMER NAME
   ========================================================= */

function getCustomerName() {

  if (!telegramUser) {

    return "Telegram User";

  }


  const name =
    `${telegramUser.first_name || ""} ${
      telegramUser.last_name || ""
    }`.trim();


  return (
    name ||
    "Telegram User"
  );

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHtml(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


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


/* =========================================================
   ATTRIBUTE ESCAPING
   ========================================================= */

function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}


/* =========================================================
   JAVASCRIPT STRING ESCAPING
   ========================================================= */

function escapeJsString(
  value
) {

  return String(value || "")

    .replace(
      /\\/g,
      "\\\\"
    )

    .replace(
      /'/g,
      "\\'"
    )

    .replace(
      /"/g,
      '\\"'
    )

    .replace(
      /\r/g,
      "\\r"
    )

    .replace(
      /\n/g,
      "\\n"
    );

}


/* =========================================================
   CURRENCY
   ========================================================= */

function formatCurrency(
  amount,
  currency = "ETB"
) {

  const value =
    Number(amount);


  if (
    Number.isNaN(value)
  ) {

    return `${amount} ${currency}`;

  }


  return (
    `${value.toLocaleString()} ${currency}`
  );

}


/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

window.addEventListener(
  "error",
  function (event) {

    console.error(
      "GLOBAL ERROR:",
      event.error ||
      event.message
    );

  }
);


/* =========================================================
   UNHANDLED PROMISE ERRORS
   ========================================================= */

window.addEventListener(
  "unhandledrejection",
  function (event) {

    console.error(
      "UNHANDLED PROMISE:",
      event.reason
    );

  }
);