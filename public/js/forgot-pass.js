function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const showPasswordCheckbox = document.getElementById('show-password');

    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';
        confirmPasswordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
        confirmPasswordInput.type = 'password';
    }
}
document.querySelector('form').addEventListener('submit', (event) => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordMatchError = document.getElementById('password-match-error');

    if (passwordInput.value !== confirmPasswordInput.value) {
        event.preventDefault();
        passwordMatchError.classList.remove('d-none');
    } else {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.delete('confirm-password');
        formData.append('link', forgotLink)
        const jsonData = JSON.stringify(Object.fromEntries(formData));
        
        event.target.FormData = null;

        fetch(event.target.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response => {
                alert("Вы успешно сменили пароль, можете закрыть это окно!");
            })
            .catch(error => {
                // Обрабатываем ошибку
                console.error(error);
            });
    }
});
