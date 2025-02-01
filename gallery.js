document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const uploadInput = document.getElementById('upload-input');
    const uploadButton = document.getElementById('upload-button');

    // Load lightsabers from local storage
    const lightsabers = JSON.parse(localStorage.getItem('lightsabers')) || [];

    function displayLightsabers() {
        gallery.innerHTML = '';
        lightsabers.forEach((lightsaber, index) => {
            const div = document.createElement('div');
            div.classList.add('lightsaber');

            const img = document.createElement('img');
            img.src = lightsaber.image;
            img.alt = lightsaber.name;

            const name = document.createElement('p');
            name.textContent = lightsaber.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                lightsabers.splice(index, 1);
                localStorage.setItem('lightsabers', JSON.stringify(lightsabers));
                displayLightsabers();
            });

            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(deleteButton);
            gallery.appendChild(div);
        });
    }

    displayLightsabers();

    uploadButton.addEventListener('click', () => {
        const file = uploadInput.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lightsaber = {
                    name: file.name,
                    image: e.target.result
                };
                lightsabers.push(lightsaber);
                localStorage.setItem('lightsabers', JSON.stringify(lightsabers));
                displayLightsabers();
            };
            reader.readAsDataURL(file);
        }
    });
});
