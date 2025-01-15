const toggleInstructions = document.getElementById('toggleInstructions');
const text = document.getElementById('text');

toggleInstructions.addEventListener('click', function() {
    text.classList.toggle("hidden");
}); 

/**
 * -Three.js loaded in index.html file to add 3d objects in a website -1/15/25
 * -Three.js accepts .gtlf, .glb, .fbx, or .onj file types
 * -Making lightsaber parts in blender as of 1/15/25
 * -.gltF is the preferred and best file type for Three.js, so it is recommended to get models in that file type
 */
