/* globals messenger, document, console */

const controlIds = {
    button: "#list-books-button",
    select: "#account-select",
    list: "#book-list",
};

let controls = {};

async function onLoaded() {
    try {
        for (const [name, id] of Object.entries(controlIds)) {
            controls[name] = document.querySelector(id);
        }
        let accounts = await messenger.accounts.list();
        let imapAccounts = accounts.filter((account) => account.type == "imap");
        controls.select.innerHTML = "";
        for (const imapAccount of imapAccounts) {
            let accountOption = document.createElement("option");
            accountOption.textContent = imapAccount.name;
            accountOption.setAttribute("data-account-id", imapAccount.id);
            controls.select.appendChild(accountOption);
        }
        controls.list.innerHTML = "";
        controls.button.addEventListener("click", listButtonClicked);
        controls.select.addEventListener("change", accountSelectChanged);
        let response = await messenger.runtime.sendMessage({ id: "ping", from: "options" });
        console.log("options got response:", response);
    } catch (e) {
        console.error(e);
    }
}

async function getSelectedAccount() {
    try {
        let selected = controls.select.options[controls.select.options.selectedIndex];
        let selectedId = selected.getAttribute("data-account-id");
        let accounts = await messenger.accounts.list();
        for (const account of accounts) {
            if (account.id === selectedId) {
                return account;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function accountSelectChanged(source) {
    try {
        console.log("select changed:", source.target);
        controls.list.innerHTML = "";
    } catch (e) {
        console.error(e);
    }
}

async function listButtonClicked() {
    try {
        console.log("list clicked");
        const account = await getSelectedAccount();
        let email = account.identities[0].email;
        messenger.cardDAV.list(email).then((books) => {
            console.log("books:", books);
        });
    } catch (e) {
        console.error(e);
    }
}

async function updateBooks(books) {
    try {
        console.log("updating books:", books);
        controls.list.innerHTML = "";
        for (const book of books) {
            let item = document.createElement("li");
            let label = document.createElement("label");
            label.textContent = book.name;
            item.appendChild(label);
            controls.list.appendChild(item);
        }
    } catch (e) {
        console.error(e);
    }
}

async function onMessage(message) {
    try {
        console.log("options received message:", message);
        switch (message.id) {
            case "booksResponse":
                if (message.state === "complete") {
                    await updateBooks(message.books);
                }
                break;
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", onLoaded);
messenger.runtime.onMessage.addListener(onMessage);
