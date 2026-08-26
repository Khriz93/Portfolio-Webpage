const menuButton = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

menuButton.addEventListener("click", function()
{
    const isOpen = navMenu.classList.toggle("active");

    menuButton.classList.toggle("active");
    menuButton.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach(function(link) {
    link.addEventListener("click", function() 
    {
        navMenu.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
    });
});

const form = document.querySelector(".contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");
const successMessage = document.querySelector("#success-message");
const sendErrorMessage = document.querySelector("#send-error-message");
const submitButton = document.querySelector("#submit-btn");

form.addEventListener("submit", async function(event)
{
    event.preventDefault();
    let formIsValid = true;

    // NAME
    if (nameInput.value.trim() === "")
    {
        nameInput.classList.add("error");
        nameError.classList.add("active");
        formIsValid = false;
    }
    else 
    {
        nameInput.classList.remove("error");
        nameError.classList.remove("active");
    }

    // EMAIL
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === "" || !emailPattern.test(emailInput.value.trim()))
    {
        emailInput.classList.add("error");
        emailError.classList.add("active");
        formIsValid = false;
    }
    else
    {
        emailInput.classList.remove("error");
        emailError.classList.remove("active");
    }

    // MESSAGE
    if (messageInput.value.trim() === "")
    {
        messageInput.classList.add("error");
        messageError.classList.add("active");
        formIsValid = false;
    }
    else
    {
        messageInput.classList.remove("error");
        messageError.classList.remove("active");
    }

    // STOP IF VALIDATION FAILED
    if (!formIsValid)
    {
        successMessage.classList.remove("active");
        sendErrorMessage.classList.remove("active");
        return;
    }

    // SENDING STATE
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    successMessage.classList.remove("active");
    sendErrorMessage.classList.remove("active");

    // CREATE FORM DATA
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json =  JSON.stringify(object);

    try 
    {
        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            }
        );
        const result = await response.json();

        if (response.ok && result.success)
        {
            successMessage.classList.add("active");
            form.reset();

            // REMOVE ANY OLD VALIDATION STYLING
            nameInput.classList.remove("error");
            emailInput.classList.remove("error");
            messageInput.classList.remove("error");
            nameError.classList.remove("active");
            emailError.classList.remove("active");
            messageError.classList.remove("active");
        }
        else
        {
            console.error(result);
            sendErrorMessage.classList.add("active");
        }

    }
    catch(error)
    {
        console.error(error);
        sendErrorMessage.classList.add("active");
    }
    finally
    {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});

nameInput.addEventListener("input", function()
{
    if (nameInput.value.trim() !== "")
    {
        nameInput.classList.remove("error");
        nameError.classList.remove("active");
    }
});

emailInput.addEventListener("input", function()
{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailInput.value.trim()))
    {
        emailInput.classList.remove("error");
        emailError.classList.remove("active");
    }
});

messageInput.addEventListener("input", function()
{
    if (messageInput.value.trim() !== "")
    {
        messageInput.classList.remove("error");
        messageError.classList.remove("active");
    }
});