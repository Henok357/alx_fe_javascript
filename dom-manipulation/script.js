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
                "Content-Type": "application/json" // Setting the content type
            },
            body: JSON.stringify({
                body: quote.text, // Assuming 'body' is used for quote text
                title: quote.category // Assuming 'title' is used for the category
            })
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

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map((quote) => quote.category))];

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
    const lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
    document.getElementById("categoryFilter").value = lastSelectedCategory;
    filterQuotes(); // Initial filtering based on last selected category
};
