// Quotes array to store quotes
let quotes = [];

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes = storedQuotes;
    displayQuotes();
    populateCategories();
}

// Function to display quotes
function displayQuotes() {
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = "";

    quotes.forEach((quote) => {
        const quoteElement = document.createElement("div");
        quoteElement.className = "quote";
        quoteElement.innerText = `${quote.text} - ${quote.category}`;
        quotesContainer.appendChild(quoteElement);
    });
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("quoteText").value;
    const quoteCategory = document.getElementById("quoteCategory").value;

    if (!quoteText || !quoteCategory) {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote); // Posting to server
    displayQuotes();
    document.getElementById("quoteText").value = "";
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to post a quote to the server
async function postQuoteToServer(quote) {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL

    try {
        const response = await fetch(apiUrl, {
            method: "POST", // Method to post data
            headers: {
                "Content-Type": "application/json", // Setting the content type
            },
            body: JSON.stringify({
                body: quote.text, // Assuming 'body' is used for quote text
                title: quote.category, // Assuming 'title' is used for the category
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to post quote to server");
        }

        const data = await response.json();
        console.log("Quote posted successfully:", data);
    } catch (error) {
        console.error("Error posting quote to server:", error);
        alert("Failed to post quote to server.");
    }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch quotes from server");
        }

        const serverQuotes = await response.json();
        syncQuotes(serverQuotes);
        notifyUser("Quotes synced with server!"); // Notify user of successful sync
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Function to sync quotes with server data
function syncQuotes(serverQuotes) {
    const serverQuoteIds = serverQuotes.map(quote => quote.id); // Assuming each quote has a unique ID
    const localQuoteIds = quotes.map((quote, index) => index + 1); // Simple local IDs based on index for this simulation

    serverQuotes.forEach(serverQuote => {
        const localIndex = localQuoteIds.indexOf(serverQuote.id);
        if (localIndex === -1) {
            // If the quote does not exist locally, add it
            quotes.push({ text: serverQuote.body, category: serverQuote.title, id: serverQuote.id });
        } else {
            // If a conflict is detected, update the local quote with the server data
            quotes[localIndex].text = serverQuote.body;
            quotes[localIndex].category = serverQuote.title;
            notifyUser(`Quote "${serverQuote.body}" updated from the server.`); // Notify user about update
        }
    });

    // Save updated quotes to local storage
    saveQuotes();
    displayQuotes();
}

// Function to notify users about updates
function notifyUser(message) {
    const notificationElement = document.createElement("div");
    notificationElement.className = "notification";
    notificationElement.innerText = message;
    document.body.appendChild(notificationElement);

    setTimeout(() => {
        document.body.removeChild(notificationElement);
    }, 3000); // Remove notification after 3 seconds
}

// Function to periodically check for new quotes from the server
function startPeriodicFetch() {
    fetchQuotesFromServer(); // Fetch immediately
    setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 seconds
}

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map((quote) => quote.category))];

    categoryFilter.innerHTML = ""; // Clear existing options
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = "";

    filteredQuotes.forEach((quote) => {
        const quoteElement = document.createElement("div");
        quoteElement.className = "quote";
        quoteElement.innerText = `${quote.text} - ${quote.category}`;
        quotesContainer.appendChild(quoteElement);
    });

    // Remember last selected filter
    localStorage.setItem("lastSelectedCategory", selectedCategory);
}

// Load quotes on page load
window.onload = function() {
    loadQuotes();
    startPeriodicFetch(); // Start periodic fetching of quotes
    const lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
    document.getElementById("categoryFilter").value = lastSelectedCategory;
    filterQuotes(); // Initial filtering based on last selected category
};
