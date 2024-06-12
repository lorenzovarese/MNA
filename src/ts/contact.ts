/// <reference path="emailjs-global.d.ts"/>

window.addEventListener('load', () => {
    const form = document.getElementById('contactForm') as HTMLFormElement;
    const firstnameInput = document.getElementById('firstname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const subjectInput = document.getElementById('subject') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLInputElement;

    function validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for basic validation
        return regex.test(email);
    }

    // Function to update the state of the submit button
    function updateSubmitButtonState() {
        const isEmailValid = validateEmail(emailInput.value);
        const isSubjectFilled = subjectInput.value.trim() !== '';
        const isMessageFilled = messageInput.value.trim() !== '';

        // Only enable the submit button if all conditions are met
        submitBtn.disabled = !(isEmailValid && isSubjectFilled && isMessageFilled);
    }

    // Initialize the button state based on the initial input values
    updateSubmitButtonState();

    // Event listeners for input fields to validate form
    emailInput.addEventListener('input', updateSubmitButtonState);
    subjectInput.addEventListener('input', updateSubmitButtonState);
    messageInput.addEventListener('input', updateSubmitButtonState);

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        emailjs.send("service_n278ymh","template_dr3ehge", {
            firstname: firstnameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        }).then((response: any) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Email successfully sent!');
            form.reset();
            updateSubmitButtonState();
        }, (error: any) => {
            console.log('FAILED...', error);
            alert('Failed to send email: ' + error.text + '. If the error persists directlty contact the studio via e-mail.');
        });
    });
});
