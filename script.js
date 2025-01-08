const toggleInstructions = document.getElementById('toggleInstructions');
const text = document.getElementById('text');

toggleInstructions.addEventListener('click', function() {
    text.classList.toggle("hidden");
});
