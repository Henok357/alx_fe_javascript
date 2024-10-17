let quotes = JSON.parse(localStorage.getItem('quotes')) || [];


function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
}


function addQuote() {
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
        syncQuotes(); 
    }
}


function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}


function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; 
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filteredQuotes.length > 0 ? `"${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text}" - ${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].category}` : "No quotes available.";
}


async function syncQuotes() {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts"; 
    try {
        
        const response = await fetch(apiUrl);
        const serverQuotes = await response.json();
        
        
        if (serverQuotes.length > 0) {
            quotes = serverQuotes.map(quote => ({
                text: quote.body, 
                category: quote.title 
            }));
            saveQuotes();
            showRandomQuote(); 
            alert("Quotes updated from server!");
        }
    } catch (error) {
        console.error("Error syncing quotes with server:", error);
        alert("Failed to sync with server.");
    }
}


setInterval(syncQuotes, 10000);


function init() {
    populateCategories();
    showRandomQuote();
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById("categoryFilter").value = lastSelectedCategory;
        filterQuotes(); 
    }
}


document.getElementById("categoryFilter").addEventListener("change", function() {
    const selectedCategory = this.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    filterQuotes();
});


window.onload = init;
