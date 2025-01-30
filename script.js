const hiltParts = ['images/hilt 1.png', 'images/hilt 2.png', 'images/hilt 3.png'];
const bladeParts = ['images/blade1.png', 'images/blade2.png', 'images/blade3.png'];
const addonParts = ['images/addon1.png', 'images/addon2.png', 'images/addon3.png'];

let currentHiltIndex = 0;
let currentBladeIndex = 0;
let currentAddonIndex = 0;

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
const addonsCanvas = document.getElementById('addons-canvas');
const addonsCtx = addonsCanvas.getContext('2d');

const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');

// Canvas settings
hiltCanvas.width = 300;
hiltCanvas.height = 100;

bladeCanvas.width = 300;
bladeCanvas.height = 100;

addonsCanvas.width = 300;
addonsCanvas.height = 100;

previewCanvas.width = 300;
previewCanvas.height = 300;

// Load initial parts
let currentHiltImage = new Image();
currentHiltImage.src = hiltParts[currentHiltIndex];
currentHiltImage.onload = () => drawImageFitting(hiltCtx, currentHiltImage);

let currentBladeImage = new Image();
currentBladeImage.src = bladeParts[currentBladeIndex];
currentBladeImage.onload = () => drawImageWithColor(bladeCtx, currentBladeImage, bladeColorInput.value);

let currentAddonImage = new Image();
currentAddonImage.src = addonParts[currentAddonIndex];
currentAddonImage.onload = () => drawImageWithColor(addonsCtx, currentAddonImage, overallColorInput.value);

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

// Function to draw image with color overlay fitting within canvas
function drawImageWithColor(ctx, image, color) {
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

currentBladeImage.onload = () => drawImageWithColor(bladeCtx, currentBladeImage, bladeColorInput.value);

// Event listeners for color change
bladeColorInput.addEventListener('input', (e) => {
    drawImageWithColor(bladeCtx, currentBladeImage, e.target.value);
});

overallColorInput.addEventListener('input', (e) => {
    drawImageWithColor(addonsCtx, currentAddonImage, e.target.value);
    drawImageWithColor(hiltCtx, currentHiltImage, e.target.value);
    drawImageWithColor(bladeCtx, currentBladeImage, e.target.value);
});

// Function to update preview
function updatePreview() {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.drawImage(addonsCanvas, 0, 0);   // Position addons at the top
    previewCtx.drawImage(bladeCanvas, 0, 100);  // Position blade in the middle
    previewCtx.drawImage(hiltCanvas, 0, 200);  // Position hilt at the bottom
}

// Event listener for saving the image
saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'custom-lightsaber.png';
    link.href = previewCanvas.toDataURL();
    link.click();
});
