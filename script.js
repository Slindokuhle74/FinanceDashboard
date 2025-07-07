
let transactions = [
  {
    id: 1,
    date: "2023-05-01",
    description: "Grocery Shopping",
    category: "Food",
    amount: 125.75,
    type: "expense",
  },
  {
    id: 2,
    date: "2023-05-02",
    description: "Electric Bill",
    category: "Utilities",
    amount: 85.2,
    type: "expense",
  },
  {
    id: 3,
    date: "2023-05-03",
    description: "Salary",
    category: "Income",
    amount: 4500.0,
    type: "income",
  },
  {
    id: 4,
    date: "2023-05-05",
    description: "Dinner with Friends",
    category: "Food",
    amount: 68.5,
    type: "expense",
  },
  {
    id: 5,
    date: "2023-05-07",
    description: "Gas",
    category: "Transportation",
    amount: 45.3,
    type: "expense",
  },
  {
    id: 6,
    date: "2023-05-10",
    description: "Freelance Work",
    category: "Income",
    amount: 750.0,
    type: "income",
  },
  {
    id: 7,
    date: "2023-05-12",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    type: "expense",
  },
  {
    id: 8,
    date: "2023-05-15",
    description: "Rent",
    category: "Housing",
    amount: 1200.0,
    type: "expense",
  },
  {
    id: 9,
    date: "2023-05-18",
    description: "Doctor Visit",
    category: "Healthcare",
    amount: 120.0,
    type: "expense",
  },
  {
    id: 10,
    date: "2023-05-20",
    description: "New Shoes",
    category: "Shopping",
    amount: 89.99,
    type: "expense",
  },
];


const currentDateEl = document.getElementById("current-date");
const totalBalanceEl = document.getElementById("total-balance");
const monthlyIncomeEl = document.getElementById("monthly-income");
const monthlyExpensesEl = document.getElementById("monthly-expenses");
const savingsRateEl = document.getElementById("savings-rate");
const transactionsTable = document.querySelector("#transactions-table tbody");
const addTransactionBtn = document.getElementById("add-transaction");
const transactionModal = document.getElementById("transaction-modal");
const closeModal = document.querySelector(".close");
const transactionForm = document.getElementById("transaction-form");
const aiChat = document.getElementById("ai-chat");
const aiQuestion = document.getElementById("ai-question");
const askAiBtn = document.getElementById("ask-ai");


let spendingChart, categoryChart;


function initDashboard() {

  const now = new Date();
  currentDateEl.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  renderTransactions();
  updateSummary();
  renderCharts();


  addTransactionBtn.addEventListener("click", () => {
    transactionModal.style.display = "block";
    document.getElementById("transaction-date").valueAsDate = new Date();
  });

  closeModal.addEventListener("click", () => {
    transactionModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === transactionModal) {
      transactionModal.style.display = "none";
    }
  });

  transactionForm.addEventListener("submit", handleAddTransaction);

  askAiBtn.addEventListener("click", handleAiQuestion);
  aiQuestion.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleAiQuestion();
    }
  });
}

function renderTransactions() {
  transactionsTable.innerHTML = "";


  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedTransactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const amountClass =
      transaction.type === "income" ? "income-amount" : "expense-amount";
    const amountPrefix = transaction.type === "income" ? "+" : "-";
    const formattedAmount = `${amountPrefix}$${Math.abs(
      transaction.amount
    ).toFixed(2)}`;

    row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td class="${amountClass}">${formattedAmount}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${transaction.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;

    transactionsTable.appendChild(row);
  });

  
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("button").getAttribute("data-id"));
      editTransaction(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("button").getAttribute("data-id"));
      deleteTransaction(id);
    });
  });
}


function updateSummary() {

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;


  totalBalanceEl.textContent = `$${balance.toFixed(2)}`;
  monthlyIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  monthlyExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
  savingsRateEl.textContent = `${savingsRate.toFixed(1)}%`;
}


function renderCharts() {

  if (spendingChart) spendingChart.destroy();
  if (categoryChart) categoryChart.destroy();


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyExpenses = [1200, 1500, 1800, 1600, 1400, 3200];
  const monthlyIncome = [4000, 4200, 4100, 4300, 4400, 4500];


  const spendingCtx = document
    .getElementById("spending-chart")
    .getContext("2d");
  spendingChart = new Chart(spendingCtx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: monthlyIncome,
          borderColor: "#4cc9f0",
          backgroundColor: "rgba(76, 201, 240, 0.1)",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Expenses",
          data: monthlyExpenses,
          borderColor: "#f94144",
          backgroundColor: "rgba(249, 65, 68, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `$${value}`;
            },
          },
        },
      },
    },
  });

  
  const categories = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  const categoryLabels = Object.keys(categories);
  const categoryData = Object.values(categories);


  const backgroundColors = categoryLabels.map((_, i) => {
    const hue = ((i * 360) / categoryLabels.length) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  });


  const categoryCtx = document
    .getElementById("category-chart")
    .getContext("2d");
  categoryChart = new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryData,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percentage = Math.round((value / total) * 100);
              return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

function handleAddTransaction(e) {
  e.preventDefault();

  const date = document.getElementById("transaction-date").value;
  const description = document.getElementById("transaction-description").value;
  const category = document.getElementById("transaction-category").value;
  const amount = parseFloat(
    document.getElementById("transaction-amount").value
  );
  const type = document.getElementById("transaction-type").value;


  const newTransaction = {
    id:
      transactions.length > 0
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1,
    date,
    description,
    category,
    amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
    type,
  };

  transactions.push(newTransaction);


  renderTransactions();
  updateSummary();
  renderCharts();


  transactionForm.reset();
  transactionModal.style.display = "none";
}

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  document.getElementById("transaction-date").value = transaction.date;
  document.getElementById("transaction-description").value =
    transaction.description;
  document.getElementById("transaction-category").value = transaction.category;
  document.getElementById("transaction-amount").value = Math.abs(
    transaction.amount
  );
  document.getElementById("transaction-type").value = transaction.type;


  transactionModal.style.display = "block";


  transactionForm.removeEventListener("submit", handleAddTransaction);
  transactionForm.addEventListener("submit", function handleUpdate(e) {
    e.preventDefault();


    transaction.date = document.getElementById("transaction-date").value;
    transaction.description = document.getElementById(
      "transaction-description"
    ).value;
    transaction.category = document.getElementById(
      "transaction-category"
    ).value;
    transaction.amount =
      document.getElementById("transaction-type").value === "expense"
        ? -Math.abs(
            parseFloat(document.getElementById("transaction-amount").value)
          )
        : Math.abs(
            parseFloat(document.getElementById("transaction-amount").value)
          );
    transaction.type = document.getElementById("transaction-type").value;

  
    renderTransactions();
    updateSummary();
    renderCharts();


    transactionForm.reset();
    transactionModal.style.display = "none";

    transactionForm.removeEventListener("submit", handleUpdate);
    transactionForm.addEventListener("submit", handleAddTransaction);
  });
}


function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((t) => t.id !== id);
    renderTransactions();
    updateSummary();
    renderCharts();
  }
}


async function handleAiQuestion() {
  const question = aiQuestion.value.trim();
  if (!question) return;


  addAiMessage(question, "user");
  aiQuestion.value = "";


  const loadingId = addAiMessage("Thinking...", "assistant", true);

  try {
   
    const response = await simulateOpenAIResponse(question);


    updateAiMessage(loadingId, response, "assistant");
  } catch (error) {
    updateAiMessage(
      loadingId,
      "Sorry, I couldn't process your request. Please try again later.",
      "assistant"
    );
    console.error("AI Error:", error);
  }
}

function simulateOpenAIResponse(question) {
  return new Promise((resolve) => {
    setTimeout(() => {

      const responses = {
        "how can i save more money":
          "Here are some tips to save more money:\n1. Track your expenses to identify spending patterns\n2. Create a realistic budget and stick to it\n3. Cut unnecessary subscriptions\n4. Cook at home more often\n5. Set up automatic transfers to savings\n6. Look for ways to reduce fixed costs like rent or utilities",
        "what's my spending pattern":
          "Based on your transactions, your biggest expenses are Housing ($1200) and Food ($194.25). You might want to review these categories for potential savings opportunities.",
        "investment advice":
          "As an AI, I can't provide personalized investment advice, but generally:\n1. Consider low-cost index funds\n2. Diversify your portfolio\n3. Think long-term\n4. Take advantage of tax-advantaged accounts like 401(k)s or IRAs\n\nAlways consult with a financial advisor for advice specific to your situation.",
        default:
          "I'm your AI financial assistant. I can help you analyze your spending, suggest ways to save money, and provide general financial advice. Ask me anything about your finances!",
      };

      const lowerQuestion = question.toLowerCase();
      let response = responses.default;

      if (lowerQuestion.includes("save") || lowerQuestion.includes("saving")) {
        response = responses["how can i save more money"];
      } else if (
        lowerQuestion.includes("spend") ||
        lowerQuestion.includes("pattern")
      ) {
        response = responses["what's my spending pattern"];
      } else if (
        lowerQuestion.includes("invest") ||
        lowerQuestion.includes("stock")
      ) {
        response = responses["investment advice"];
      }

      resolve(response);
    }, 1500); 
  });
}


function addAiMessage(text, sender, isLoading = false) {
  const messageId = "msg-" + Date.now();
  const messageEl = document.createElement("div");
  messageEl.className = `ai-message ${sender}`;
  messageEl.id = messageId;
  messageEl.innerHTML = isLoading
    ? '<i class="fas fa-spinner fa-spin"></i> ' + text
    : text;
  aiChat.appendChild(messageEl);
  aiChat.scrollTop = aiChat.scrollHeight;
  return messageId;
}


function updateAiMessage(id, newText, sender) {
  const messageEl = document.getElementById(id);
  if (messageEl) {
    messageEl.className = `ai-message ${sender}`;
    messageEl.innerHTML = newText;
    aiChat.scrollTop = aiChat.scrollHeight;
  }
}


document.addEventListener("DOMContentLoaded", initDashboard);
