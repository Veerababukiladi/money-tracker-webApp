document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('expenseForm');
    const transactionList = document.getElementById('transactionList');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `description=${description}&amount=${amount}&type=${type}`,
        });

        refreshTransactionList();
    });

    refreshTransactionList();

    async function refreshTransactionList() {
        const response = await fetch('/transactions');
        const transactions = await response.json();

        transactionList.innerHTML = '';
        transactions.forEach((transaction) => {
            const li = document.createElement('li');
            li.textContent = `${transaction.description}: ${transaction.amount} (${transaction.type})`;
            transactionList.appendChild(li);
        });
    }
});
