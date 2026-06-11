const recoverForm = document.getElementById('recover-form');
const successBox = document.getElementById('recover-success');
const submitButton = document.getElementById('recover-submit');

if (recoverForm) {
  recoverForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = recoverForm.email.value.trim();
    if (!email) {
      recoverForm.email.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    window.setTimeout(() => {
      recoverForm.style.display = 'none';
      successBox.classList.remove('is-hidden');
      successBox.style.display = 'block';
      submitButton.disabled = false;
      submitButton.textContent = 'Recuperar contraseña';
    }, 700);
  });
}
