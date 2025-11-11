// Basic Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e1e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5;
scene.add(player);

// Platforms
const platforms = [];
function createPlatform(x, y, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, 0.5, depth);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const platform = new THREE.Mesh(geometry, material);
  platform.position.set(x, y, z);
  scene.add(platform);
  platforms.push(platform);
}
createPlatform(0, 0, 0, 5, 5);
createPlatform(5, 0, -5, 5, 5);
createPlatform(10, 1, -10, 5, 5); // Slightly higher platform

// Controls
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

let velocityY = 0;
const gravity = -0.02;

function animate() {
  requestAnimationFrame(animate);

  // Player movement
  if(keys['KeyW']) player.position.z -= 0.2;
  if(keys['KeyS']) player.position.z += 0.2;
  if(keys['KeyA']) player.position.x -= 0.2;
  if(keys['KeyD']) player.position.x += 0.2;

  // Jumping
  if(keys['Space'] && Math.abs(player.position.y - 0.5) < 0.01) velocityY = 0.3;
  velocityY += gravity;
  player.position.y += velocityY;

  // Simple platform collision
  let onPlatform = false;
  platforms.forEach(p => {
    if(player.position.x > p.position.x - 2.5 && player.position.x < p.position.x + 2.5 &&
       player.position.z > p.position.z - 2.5 && player.position.z < p.position.z + 2.5 &&
       player.position.y > p.position.y && player.position.y < p.position.y + 0.5) {
      onPlatform = true;
      player.position.y = p.position.y + 0.5;
      velocityY = 0;
    }
  });
  if(!onPlatform && player.position.y < 0) {
    player.position.y = 0.5;
    velocityY = 0;
  }

  // Camera follows player
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

animate();
