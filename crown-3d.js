import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
const host=document.getElementById("crown-viewport");
if(host) init().catch(err=>console.warn("3D crown fallback:",err));
async function init(){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,.6,6.5);
  scene.add(new THREE.AmbientLight(0xffffff,2));
  const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,5,6);scene.add(light);
  const rim=new THREE.DirectionalLight(0xffa52c,2);rim.position.set(3,2,-4);scene.add(rim);
  const crown=new THREE.Group();scene.add(crown);
  const gold=new THREE.MeshStandardMaterial({color:0xffc82e,metalness:.78,roughness:.2,side:THREE.DoubleSide});
  const dark=new THREE.MeshStandardMaterial({color:0xa76a0d,metalness:.75,roughness:.27});
  const red=new THREE.MeshStandardMaterial({color:0xe42b46,metalness:.4,roughness:.18});
  const blue=new THREE.MeshStandardMaterial({color:0x3d9cf0,metalness:.4,roughness:.14});
  const band=new THREE.Mesh(new THREE.CylinderGeometry(1.22,1.12,.6,64,1,true),gold);
  band.position.y=-.34;crown.add(band);
  for(const y of [-.66,-.04]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(y===-.66?1.12:1.22,.09,12,64),dark);
    ring.rotation.x=Math.PI/2;ring.position.y=y;crown.add(ring);
  }
  for(let i=0;i<7;i++){
    const a=i*2*Math.PI/7;
    const x=Math.sin(a),z=Math.cos(a);
    const peak=new THREE.Mesh(new THREE.ConeGeometry(.29,1.2,5),gold);
    peak.position.set(x*1.12,.61,z*1.12);crown.add(peak);
    const orb=new THREE.Mesh(new THREE.SphereGeometry(.14,18,12),gold);
    orb.position.set(x*1.12,1.26,z*1.12);crown.add(orb);
    const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.18),i%2?blue:red);
    gem.position.set(x*1.245,-.34,z*1.245);crown.add(gem);
  }
  const floor=new THREE.Mesh(new THREE.CylinderGeometry(1.12,1.12,.09,64),dark);
  floor.position.y=-.66;crown.add(floor);
  crown.rotation.set(.15,-.3,0);
  let drag=false,moved=false,px=0,py=0,spin=0,tx=.15,ty=-.3;
  host.addEventListener("pointerdown",e=>{drag=true;moved=false;px=e.clientX;py=e.clientY;host.setPointerCapture(e.pointerId)});
  host.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-px,dy=e.clientY-py;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;ty+=dx*.009;tx=Math.max(-1.1,Math.min(1.1,tx+dy*.008));px=e.clientX;py=e.clientY});
  host.addEventListener("pointerup",()=>{if(!moved)spin=.28;drag=false});
  host.addEventListener("pointercancel",()=>drag=false);
  host.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")ty-=.2;else if(e.key==="ArrowRight")ty+=.2;else if(e.key==="ArrowUp")tx-=.2;else if(e.key==="ArrowDown")tx+=.2;else if(e.key==="Enter"||e.key===" "){spin=.28;e.preventDefault()}else return;e.preventDefault()});
  document.querySelector(".crown-reset")?.addEventListener("click",()=>{tx=.15;ty=-.3;spin=0});
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};
  const observer=new ResizeObserver(resize);observer.observe(host);
  host.querySelector(".crown-loading")?.remove();host.appendChild(renderer.domElement);resize();
  let last=performance.now();
  function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/16.67,3);last=now;if(!drag)ty+=.002*dt;ty+=spin*dt;spin*=Math.pow(.94,dt);crown.rotation.x+=(tx-crown.rotation.x)*.13;crown.rotation.y+=(ty-crown.rotation.y)*.13;renderer.render(scene,camera)}
  requestAnimationFrame(animate);
}
