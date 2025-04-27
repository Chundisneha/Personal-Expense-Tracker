async function loadTransactions() {
    const res = await fetch('/transactions');
    const data = await res.json();
    return data;
}

async function addTransaction(transaction) {
    await fetch('/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    });
    displayTransactions();
}

async function displayTransactions() {
    const transactions = await loadTransactions();
    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${t.date} - ${t.type.toUpperCase()} - ₹${t.amount.toFixed(2)} - ${t.description} (${t.category})
        `;
        list.appendChild(li);

        if (t.type === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
    document.getElementById('balance').textContent = (totalIncome - totalExpense).toFixed(2);
}

document.getElementById('transactionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];

    const transaction = { description, amount, type, category, date };
    await addTransaction(transaction);
    this.reset();
});

window.onload = displayTransactions;
