let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote
async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
        showRandomQuote();
        await syncQuotes(); // Sync quotes with the server after adding a new quote
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    // Update displayed quotes
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filteredQuotes.length > 0 ? `"${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text}" - ${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].category}` : "No quotes available.";
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL
    try {
        const response = await fetch(apiUrl);
        const serverQuotes = await response.json();
        
        // Assume the server returns an array of quote objects.
        return serverQuotes.map(quote => ({
            text: quote.body, // Assuming body contains the quote text
            category: quote.title // Assuming title contains the category
        }));
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        alert("Failed to fetch quotes from server.");
        return []; // Return an empty array on error
    }
}

// Function to sync quotes with a mock server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    
    // Update local storage with server data
    if (serverQuotes.length > 0) {
        // Simple conflict resolution: Server data takes precedence
        quotes = serverQuotes;
        saveQuotes();
        showRandomQuote(); // Display a new random quote from the updated list
        alert("Quotes updated from server!");
    } else {
        alert("No new quotes from server.");
    }
}

// Periodically check for new quotes every 10 seconds (10000 milliseconds)
setInterval(syncQuotes, 10000);

// Initialize the application
function init() {
    populateCategories();
    showRandomQuote();
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById("categoryFilter").value = lastSelectedCategory;
        filterQuotes(); // Apply the filter based on the last selected category
    }
}

// Event listener for the category filter
document.getElementById("categoryFilter").addEventListener("change", function() {
    const selectedCategory = this.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    filterQuotes();
});

// Call the init function on page load
window.onload = init;
