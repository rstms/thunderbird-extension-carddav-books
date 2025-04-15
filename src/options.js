/* globals messenger, document, console */

const optInCheckboxId = "#opt-in-checkbox";

async function saveOptions(sender) {
    try {
        console.log("opt in clicked:", sender);
        const checked = sender.target.checked;
        await messenger.storage.local.set({ approved: checked });
    } catch (e) {
        console.error(e);
    }
}

async function restoreOptions() {
    try {
        var settings = await messenger.storage.local.get(["approved"]);
        document.querySelector(optInCheckboxId).checked = settings.approved ? true : false;
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector(optInCheckboxId).addEventListener("click", saveOptions);
