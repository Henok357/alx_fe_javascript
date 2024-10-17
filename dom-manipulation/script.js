
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];


function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}


function showRandomQuote() {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        document.getElementById("quoteDisplay").innerHTML = randomQuote.text;
        sessionStorage.setItem("lastViewedQuote", randomQuote.text); 
    } else {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    }
}


function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); 
        showRandomQuote(); 
        alert("Quote added successfully!");
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please enter both a quote and a category.");
    }
}


function exportToJson() {
    const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(quotesBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(downloadUrl);
}


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); 
        alert('Quotes imported successfully!');
        showRandomQuote(); 
    };
    fileReader.readAsText(event.target.files[0]);
}


document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportJson").addEventListener("click", exportToJson);


showRandomQuote();
