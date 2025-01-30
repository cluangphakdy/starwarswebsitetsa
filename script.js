const hiltParts = ['images/hilt 1.png', 'images/hilt 2.png', 'images/hilt 3.png'];
const bladeParts = ['images/blade 1.png', 'images/blade 2.png', 'images/blade 3.png'];
const addonParts = ['images/addon 1.png', 'images/addon 2.png', 'images/addon 3.png'];

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
bladeColorInput.addEventListener('input', (e) => {
    drawBlade(bladeCtx, currentBladeImage, e.target.value);
});

// Event listener for overall color change
overallColorInput.addEventListener('input', (e) => {
    drawImageWithColor(addonsCtx, currentAddonImage, e.target.value);
    drawImageWithColor(hiltCtx, currentHiltImage, e.target.value);
    drawBlade(bladeCtx, currentBladeImage, bladeColorInput.value);
});

// Function to update preview
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
    const bladeY = (previewCanvas.height - bladeHeight) / 4;  // Adjust position for better fit

    // Draw addons in preview
    previewCtx.drawImage(addonsCanvas, 0, 0, previewCanvas.width, previewCanvas.height / 9);

    // Draw blade in preview with scaling and increased width if shoto blade
    previewCtx.drawImage(bladeCanvas, bladeX, bladeY, bladeWidth, bladeHeight);

    // Draw hilt in preview
    const hiltX = (previewCanvas.width - hiltCanvas.width) / 2;
    const hiltY = bladeY + bladeHeight - 50;  // Adjust position to fit nicely
    previewCtx.drawImage(hiltCanvas, hiltX, hiltY, hiltCanvas.width, hiltCanvas.height);
}

// Event listener for saving the image
saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'custom-lightsaber.png';
    link.href = previewCanvas.toDataURL();
    link.click();
});
