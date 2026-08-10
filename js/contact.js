const contactToast = document.getElementById("contactToast");

function showContactToast(message) {

    contactToast.textContent = message;

    contactToast.classList.add("show");

    clearTimeout(window.contactToastTimer);

    window.contactToastTimer = setTimeout(() => {

        contactToast.classList.remove("show");

    }, 2500);
}


document.addEventListener("click", async (event) => {

    const emailButton =
        event.target.closest(".contact-email");

    if (emailButton) {

        event.preventDefault();

        const email =
            emailButton.dataset.email;

        try {

            await navigator.clipboard.writeText(email);

            showContactToast(
                "E-mail zkopírován! 📧"
            );

        } catch (error) {

            showContactToast(
                "E-mail se nepodařilo zkopírovat."
            );

        }

        return;
    }


    const socialButton =
        event.target.closest(
            ".contact-option:not(.contact-email)"
        );

    if (socialButton) {

        const name =
            socialButton.querySelector("strong")?.textContent;

        showContactToast(
            `${name} otevřen!`
        );

    }

});