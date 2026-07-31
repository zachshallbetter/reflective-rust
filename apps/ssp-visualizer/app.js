import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// CSG Nodes Dataset
const csgNodes = [
  { id: 'core_meta_info', name: 'core::meta::Info', scope: 'Scope I: Near-Term', subsystem: 'Static Reflection', handle: '0x8000000000000008', privacy: 'pub', cost: '0 bytes (Consteval)', color: 0x38bdf8, pos: [-4, 2, 0], desc: 'Compiler-owned opaque reflection handle representing type and declaration entities at consteval time.' },
  { id: 'meta_of', name: 'meta::of<T>()', scope: 'Scope I: Near-Term', subsystem: 'Consteval Engine', handle: '0x8000000000000010', privacy: 'pub const fn', cost: '0 bytes (Compiler Intrinsic)', color: 0x38bdf8, pos: [-4, -1, 2], desc: 'Intrinsic query resolving an opaque Info handle for any sized type T during compilation.' },
  { id: 'meta_kind', name: 'meta::Kind', scope: 'Scope I: Near-Term', subsystem: 'Ontology', handle: '0x8000000000000018', privacy: 'pub enum', cost: '0 bytes (Consteval)', color: 0x38bdf8, pos: [-2, 3, -2], desc: 'Enum categorizing semantic entities (Struct, Enum, Field, Variant, Trait, Impl, Function).' },
  
  { id: 'csg_graph', name: 'CompilerSemanticGraph', scope: 'Scope II: Mid-Term', subsystem: 'Compiler Substrate', handle: '0x9000000000000001', privacy: 'compiler_private', cost: 'CSG Query Cache', color: 0x818cf8, pos: [0, 0, 0], desc: 'Canonical compiler graph storing typed nodes, trait bounds, lifetime constraints, and hygiene maps.' },
  { id: 'type_descriptor', name: 'TypeDescriptor', scope: 'Scope II: Mid-Term', subsystem: 'Runtime Projection', handle: '0x9000000000000002', privacy: 'pub struct', cost: 'Opt-In Static VTable', color: 0x818cf8, pos: [2, 2, 1], desc: 'Opt-in static VTable emitted by #[derive(Reflectable)] for dynamic runtime lookup.' },
  { id: 'derive_reflectable', name: '#[derive(Reflectable)]', scope: 'Scope II: Mid-Term', subsystem: 'MOP Layer', handle: '0x9000000000000003', privacy: 'pub proc_macro', cost: 'Static VTable Emission', color: 0x818cf8, pos: [2, -2, -1], desc: 'Proc-macro expanding types into static descriptor registries for zero-cost runtime reflection.' },
  
  { id: 'ssp_anchor', name: 'SSPSpatialAnchor', scope: 'Scope III: Long-Term', subsystem: 'Spatial Projection', handle: '0xA000000000000001', privacy: 'pub struct', cost: '3D SE(3) Transform Matrix', color: 0x2dd4bf, pos: [5, 3, -2], desc: 'SE(3) transformation matrix mapping CSG graph nodes to physical 3D spatial regions.' },
  { id: 'agent_slicer', name: 'CSGAgentSlicer', scope: 'Scope III: Long-Term', subsystem: 'AI Tooling', handle: '0xA000000000000002', privacy: 'pub(crate)', cost: 'Graph RAG Subgraph', color: 0x2dd4bf, pos: [5, -1, 3], desc: 'Graph RAG slicing engine extracting compiler-certified semantic contexts for AI agents.' }
];

// Graph Edge Relationships
const csgEdges = [
  ['core_meta_info', 'meta_of'],
  ['core_meta_info', 'meta_kind'],
  ['core_meta_info', 'csg_graph'],
  ['csg_graph', 'type_descriptor'],
  ['type_descriptor', 'derive_reflectable'],
  ['csg_graph', 'ssp_anchor'],
  ['csg_graph', 'agent_slicer']
];

// Setup Scene, Camera, Renderer
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090d16, 0.03);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Ambient & Point Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x38bdf8, 3, 50);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

// Create 3D Nodes and Lines
const nodeMeshes = [];
const nodeMap = new Map();

csgNodes.forEach(node => {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: node.color,
    emissive: node.color,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.8
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...node.pos);
  mesh.userData = node;

  scene.add(mesh);
  nodeMeshes.push(mesh);
  nodeMap.set(node.id, mesh);
});

// Render Relational Edge Lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.6 });

csgEdges.forEach(([srcId, tgtId]) => {
  const srcMesh = nodeMap.get(srcId);
  const tgtMesh = nodeMap.get(tgtId);
  if (srcMesh && tgtMesh) {
    const points = [srcMesh.position, tgtMesh.position];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
  }
});

// Grid & Starfield Background
const gridHelper = new THREE.GridHelper(40, 40, 0x1e293b, 0x0f172a);
gridHelper.position.y = -5;
scene.add(gridHelper);

// Raycaster Node Selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeMeshes);

  if (intersects.length > 0) {
    const node = intersects[0].object.userData;
    updateInspector(node);
  }
}

function updateInspector(node) {
  document.getElementById('node-scope').innerText = node.scope;
  document.getElementById('node-title').innerText = node.name;
  document.getElementById('node-subsystem').innerText = node.subsystem;
  document.getElementById('node-handle').innerText = node.handle;
  document.getElementById('node-privacy').innerText = node.privacy;
  document.getElementById('node-cost').innerText = node.cost;
  document.getElementById('node-description').innerText = node.desc;
}

window.addEventListener('pointerdown', onPointerDown);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  nodeMeshes.forEach(mesh => {
    mesh.rotation.y += 0.01;
  });

  controls.update();
  renderer.render(scene, camera);
}

// Select Default Node
updateInspector(csgNodes[0]);
animate();
