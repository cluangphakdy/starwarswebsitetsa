const hiltParts = ['images/hilt 1.png', 'images/hilt 2.png', 'images/hilt 3.png', 'images/hilt 4.png'];
const bladeParts = ['images/blade 1.png', 'images/blade 2.png', 'images/blade 3.png'];
const addonParts = ['images/addon 1.png', 'images/addon 2.png', 'images/addon 3.png'];

let currentHiltIndex = 0;
let currentBladeIndex = 0;
let currentAddonIndex = 0;

let editingStorageItem = null; // Track the item being edited

// Get HTML elements
const prevHiltBtn = document.getElementById('prev-hilt');
const nextHiltBtn = document.getElementById('next-hilt');
const hiltCanvas = document.getElementById('hilt-canvas');
const hiltCtx = hiltCanvas.getContext('2d');

const prevBladeBtn = document.getElementById('prev-blade');
const nextBladeBtn = document.getElementById('next-blade');
const bladeColorInput = document.getElementById('blade-color-input');
const bladeCanvas = document.getElementById('blade-canvas');
const bladeCtx = bladeCanvas.getContext('2d');

const overallColorInput = document.getElementById('overall-color-input');
const saveImageBtn = document.getElementById('save-image');
const saveToStorageBtn = document.getElementById('save-to-storage');
const addonsCanvas = document.getElementById('addons-canvas');
const addonsCtx = addonsCanvas.getContext('2d');

const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');

const uploadImageInput = document.getElementById('upload-image');
const galleryContainer = document.getElementById('gallery-container');
const storageContainer = document.getElementById('storage-container');

// Get HTML elements for navigation
const builderSection = document.getElementById('builder-section');
const gallerySection = document.getElementById('gallery-section');
const homeSection = document.getElementById('home-section');
const storageSection = document.getElementById('storage-section');

const builderNavBtn = document.getElementById('nav-builder');
const galleryNavBtn = document.getElementById('nav-gallery');
const homeNavBtn = document.getElementById('nav-home');
const storageNavBtn = document.getElementById('nav-storage');

// Function to show a specific section and hide others
function showSection(section) {
    builderSection.style.display = 'none';
    gallerySection.style.display = 'none';
    homeSection.style.display = 'none';
    storageSection.style.display = 'none';
    section.style.display = 'block';
}

// Event listeners for navigation buttons
builderNavBtn.addEventListener('click', () => showSection(builderSection));
galleryNavBtn.addEventListener('click', () => showSection(gallerySection));
homeNavBtn.addEventListener('click', () => showSection(homeSection));
storageNavBtn.addEventListener('click', () => showSection(storageSection));

// Initialize by showing the home section
showSection(homeSection);

// Canvas settings
hiltCanvas.width = 300;
hiltCanvas.height = 150;

bladeCanvas.width = 300;
bladeCanvas.height = 150;

addonsCanvas.width = 300;
addonsCanvas.height = 150;

previewCanvas.width = 300;
previewCanvas.height = 450;  // Keep the original preview size

// Load initial parts
let currentHiltImage = new Image();
currentHiltImage.src = hiltParts[currentHiltIndex];
currentHiltImage.onload = () => drawImageFitting(hiltCtx, currentHiltImage);

let currentBladeImage = new Image();
currentBladeImage.src = bladeParts[currentBladeIndex];
currentBladeImage.onload = () => drawBlade(bladeCtx, currentBladeImage, bladeColorInput.value);

let currentAddonImage = new Image();
currentAddonImage.src = addonParts[currentAddonIndex];
currentAddonImage.onload = () => drawImageWithColor(addonsCtx, currentAddonImage, overallColorInput.value);

function updatePreview() { 
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height); 
    const aspectRatio = currentBladeImage.width / currentBladeImage.height; 
    let bladeWidth, bladeHeight; 
    if (previewCanvas.width / aspectRatio <= previewCanvas.height) { 
        bladeWidth = previewCanvas.width; 
        bladeHeight = previewCanvas.width / aspectRatio; 
    } else { 
        bladeWidth = previewCanvas.height * aspectRatio; 
        bladeHeight = previewCanvas.height; 
    } 
    const bladeX = (previewCanvas.width - bladeWidth) / 2; 
    const bladeY = (previewCanvas.height - bladeHeight) / 4; 
    // Adjust position for better fit 
    // Draw addons in preview 
    previewCtx.drawImage(addonsCanvas, 0, 0, previewCanvas.width, previewCanvas.height / 9); 
    // Draw blade in preview with scaling and increased width if shoto blade
    previewCtx.drawImage(bladeCanvas, bladeX, bladeY, bladeWidth, bladeHeight); 
    // Draw hilt in preview 
    const hiltX = (previewCanvas.width - hiltCanvas.width) / 2;
    const hiltY = bladeY + bladeHeight - 50; 
    // Adjust position to fit nicely 
    previewCtx.drawImage(hiltCanvas, hiltX, hiltY, hiltCanvas.width, hiltCanvas.height);
}

// Function to draw image fitting within canvas
function drawImageFitting(ctx, image) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const aspectRatio = image.width / image.height;
    let newWidth, newHeight;

    if (ctx.canvas.width / aspectRatio <= ctx.canvas.height) {
        newWidth = ctx.canvas.width;
        newHeight = ctx.canvas.width / aspectRatio;
    } else {
        newWidth = ctx.canvas.height * aspectRatio;
        newHeight = ctx.canvas.height;
    }

    const x = (ctx.canvas.width - newWidth) / 2;
    const y = (ctx.canvas.height - newHeight) / 2;

    ctx.drawImage(image, x, y, newWidth, newHeight);
    updatePreview();
}

// Function to draw blade with color overlay fitting within canvas
function drawBlade(ctx, image, color) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const aspectRatio = image.width / image.height;
    let newWidth, newHeight;

    if (ctx.canvas.width / aspectRatio <= ctx.canvas.height) {
        newWidth = ctx.canvas.width;
        newHeight = ctx.canvas.width / aspectRatio;
    } else {
        newWidth = ctx.canvas.height * aspectRatio;
        newHeight = ctx.canvas.height;
    }

    const x = (ctx.canvas.width - newWidth) / 2;
    const y = (ctx.canvas.height - newHeight) / 2;

    ctx.drawImage(image, x, y, newWidth, newHeight);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, newWidth, newHeight);
    ctx.globalCompositeOperation = 'source-over';
    updatePreview();
}

// Function to save the preview canvas as PNG
function saveCanvasAsPNG(canvas, filename) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}

// Function to save gallery images to localStorage
function saveGalleryToLocalStorage() {
    const images = [];
    galleryContainer.querySelectorAll('.gallery-item img').forEach(img => {
        images.push(img.src);
    });
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

// Function to load gallery images from localStorage
function loadGalleryFromLocalStorage() {
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    images.forEach(src => addImageToGallery(src));
}

// Function to add image to gallery
function addImageToGallery(src) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => openModal(src));

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️'; // Trash can icon
    deleteBtn.addEventListener('click', () => {
        galleryItem.remove();
        saveGalleryToLocalStorage();
    });

    galleryItem.appendChild(img);
    galleryItem.appendChild(deleteBtn);
    galleryContainer.appendChild(galleryItem);
    saveGalleryToLocalStorage();
}

// Event listener for image upload
uploadImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (e) => addImageToGallery(e.target.result);
        reader.readAsDataURL(file);
    }
});

// Load gallery images from localStorage on page load
window.addEventListener('load', loadGalleryFromLocalStorage);

// Event listener for save image button
saveImageBtn.addEventListener('click', () => saveCanvasAsPNG(previewCanvas, 'lightsaber.png'));

// Event listeners for switching parts
prevHiltBtn.addEventListener('click', () => {
    currentHiltIndex = (currentHiltIndex - 1 + hiltParts.length) % hiltParts.length;
    currentHiltImage.src = hiltParts[currentHiltIndex];
});

nextHiltBtn.addEventListener('click', () => {
    currentHiltIndex = (currentHiltIndex + 1) % hiltParts.length;
    currentHiltImage.src = hiltParts[currentHiltIndex];
});

prevBladeBtn.addEventListener('click', () => {
    currentBladeIndex = (currentBladeIndex - 1 + bladeParts.length) % bladeParts.length;
    currentBladeImage.src = bladeParts[currentBladeIndex];
});

nextBladeBtn.addEventListener('click', () => {
    currentBladeIndex = (currentBladeIndex + 1) % bladeParts.length;
    currentBladeImage.src = bladeParts[currentBladeIndex];
});

currentBladeImage.onload = () => drawBlade(bladeCtx, currentBladeImage, bladeColorInput.value);

// Event listener for blade color change to update instantly
bladeColorInput.addEventListener('input', () => drawBlade(bladeCtx, currentBladeImage, bladeColorInput.value));

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementsByClassName('close')[0];
const downloadImageBtn = document.getElementById('download-image');
const editImageBtn = document.getElementById('edit-image');

// Function to open modal with zoomed image
function openModal(src) {
    modal.style.display = 'block';
    modalImage.src = src;
}

// Function to close modal
closeModal.onclick = function() {
    modal.style.display = 'none';
}

// Event listener to close modal when clicking outside of the image
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Event listener for download button
downloadImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = modalImage.src;
    link.download = 'downloaded_lightsaber.png';
    link.click();
});

// Function to save storage images to localStorage
function saveStorageToLocalStorage() {
    const images = [];
    storageContainer.querySelectorAll('.gallery-item img').forEach(img => {
        images.push(img.src);
    });
    localStorage.setItem('storageImages', JSON.stringify(images));
}

// Function to load storage images from localStorage
function loadStorageFromLocalStorage() {
    const images = JSON.parse(localStorage.getItem('storageImages')) || [];
    images.forEach(src => addImageToStorage(src));
}

// Function to add image to storage
function addImageToStorage(src) {
    const storageItem = document.createElement('div');
    storageItem.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => openModal(img.src)); // Ensure the edited version is shown

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️'; // Trash can icon
    deleteBtn.addEventListener('click', () => {
        storageItem.remove();
        saveStorageToLocalStorage();
    });

    storageItem.appendChild(img);
    storageItem.appendChild(deleteBtn);
    storageContainer.appendChild(storageItem);
    saveStorageToLocalStorage();
}

// Event listener for save to storage button
saveToStorageBtn.addEventListener('click', () => {
    const dataUrl = previewCanvas.toDataURL('image/png');
    if (editingStorageItem) {
        editingStorageItem.querySelector('img').src = dataUrl;
        saveStorageToLocalStorage();
        editingStorageItem = null;
        saveToStorageBtn.textContent = 'Save to Storage';
    } else {
        addImageToStorage(dataUrl);
    }
});

// Event listener for edit button
editImageBtn.addEventListener('click', () => {
    const src = modalImage.src;
    // Logic to load the image back into the builder for editing
    // This will depend on how the builder is set up to load images
    modal.style.display = 'none';
    showSection(builderSection);
    // Example: load the image into the preview canvas
    const img = new Image();
    img.src = src;
    img.onload = () => {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    };
    // Track the item being edited
    editingStorageItem = Array.from(storageContainer.querySelectorAll('.gallery-item img')).find(item => item.src === src).parentElement;
    saveToStorageBtn.textContent = 'Save Edit';
});

// Load storage images from localStorage on page load
window.addEventListener('load', loadStorageFromLocalStorage);

const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const messageImageInput = document.getElementById('message-image');
const sendMessageBtn = document.getElementById('send-message');
const attachedImageContainer = document.getElementById('attached-image-container');
const attachedImage = document.getElementById('attached-image');

// Function to generate a random username
function generateUsername() {
    return 'User' + Math.floor(Math.random() * 10000);
}

// Function to save messages to localStorage
function saveMessagesToLocalStorage() {
    const messages = [];
    messageContainer.querySelectorAll('.message').forEach(message => {
        const username = message.querySelector('.username').innerText;
        const text = message.querySelector('.text').innerText;
        const imgSrc = message.querySelector('img') ? message.querySelector('img').src : null;
        messages.push({ username, text, imgSrc });
    });
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Function to load messages from localStorage
function loadMessagesFromLocalStorage() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(({ username, text, imgSrc }) => addMessageToContainer(username, text, imgSrc));
}

// Function to add message to container
function addMessageToContainer(username, text, imgSrc) {
    const message = document.createElement('div');
    message.classList.add('message');

    const usernameDiv = document.createElement('div');
    usernameDiv.classList.add('username');
    usernameDiv.innerText = username;

    const messageText = document.createElement('div');
    messageText.classList.add('text');
    messageText.innerText = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = '🗑️';
    deleteBtn.addEventListener('click', () => {
        message.remove();
        saveMessagesToLocalStorage();
    });

    message.appendChild(usernameDiv);
    message.appendChild(messageText);
    if (imgSrc) {
        const messageImg = document.createElement('img');
        messageImg.src = imgSrc;
        message.appendChild(messageImg);
    }
    message.appendChild(deleteBtn);
    messageContainer.appendChild(message);
    saveMessagesToLocalStorage();
}

// Event listener for send message button
sendMessageBtn.addEventListener('click', () => {
    const text = messageInput.value;
    const file = messageImageInput.files[0];
    const username = prompt("Enter your username:", generateUsername());
    if (text || file) {
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = (e) => {
                addMessageToContainer(username, text, e.target.result);
                attachedImageContainer.style.display = 'none';
                attachedImage.src = '';
            };
            reader.readAsDataURL(file);
        } else {
            addMessageToContainer(username, text, null);
        }
        messageInput.value = '';
        messageImageInput.value = '';
    }
});

// Event listener to show the attached image in the message box
messageImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (e) => {
            attachedImage.src = e.target.result;
            attachedImageContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Load messages from localStorage on page load
window.addEventListener('load', loadMessagesFromLocalStorage);

const helpButton = document.getElementById('help-button');
const helpButtonStorage = document.getElementById('help-button-storage');

// Event listener for help button
helpButton.addEventListener('click', () => {
    alert('For help, please contact: 941-334-1569');
});

// Event listener for help button on storage page
helpButtonStorage.addEventListener('click', () => {
    alert('For help, please contact: 941-334-1569');
});
