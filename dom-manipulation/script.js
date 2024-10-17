let quotes = JSON.parse(localStorage.getItem('quotes')) || [];


async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); 
        const serverQuotes = await response.json();
        syncQuotes(serverQuotes);
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}


function syncQuotes(serverQuotes) {
    const localQuotesMap = new Map(quotes.map(q => [q.text, q])); 

    serverQuotes.forEach(serverQuote => {
        if (!localQuotesMap.has(serverQuote.title)) {
            quotes.push({ text: serverQuote.title, category: 'Imported' }); 
        }
    });

    
    saveQuotes();

    
    alert('Quotes updated from server!');
}


function startDataSync() {
    fetchQuotesFromServer(); 
    setInterval(fetchQuotesFromServer, 60000); 
}


window.onload = function () {
    startDataSync();
    loadQuotes();
    populateCategories();
};


function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const existingQuote = quotes.find(q => q.text === newQuoteText);
        if (existingQuote) {
            
            alert('Quote already exists. Please update the existing quote.');
        } else {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            alert('Quote added successfully!');
            populateCategories();
            filterQuotes(); 
        }
    }
}
