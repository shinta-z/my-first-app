const button = document.getElementById("actionButton");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.textContent = "こんにちは！クリックされました。";
});
