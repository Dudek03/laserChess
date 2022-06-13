import Game from './Game.js'
import Ui from './Ui.js'
class LaserBeam {
  constructor(ifconfig) {
    this.config = {
      length: 220,
      reflectMax: 1
    };
    this.ifconfig = ifconfig
    this.config = this.extend(this.config, ifconfig);
    this.object3d = new THREE.Object3D();
    this.reflectObject = null;
    this.pointLight = new THREE.PointLight(0xffffff, 1, 4);
    this.raycaster = new THREE.Raycaster();
    this.canvas = this.generateLaserBodyCanvas();
    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      blending: THREE.AdditiveBlending,
      color: 0x4444aa,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true
    });
    this.geometry = new THREE.PlaneGeometry(1, 0.1 * 5);
    this.geometry.rotateY(0.5 * Math.PI);
    let i, nPlanes = 10;
    for (i = 0; i < nPlanes; i++) {
      let mesh = new THREE.Mesh(this.geometry, this.material);
      mesh.rotation.z = i / nPlanes * Math.PI;
      mesh.position.z = 1 / 2;
      this.object3d.add(mesh);
    }
    if (this.config.reflectMax > 0)
      this.reflectObject = new LaserBeam(this.extend(this.config, {
        reflectMax: this.config.reflectMax - 1
      }));

  }
  intersect(direction, objectArray = []) {

    this.raycaster.set(
      this.object3d.position.clone(),
      direction.clone().normalize()
    );

    let intersectArray = [];
    intersectArray = this.raycaster.intersectObjects(objectArray, true);
    console.log(intersectArray)
    if (intersectArray.length > 0) {
      this.object3d.scale.z = intersectArray[0].distance;
      this.object3d.lookAt(intersectArray[0].point.clone());
      this.pointLight.visible = true;

      let normalMatrix = new THREE.Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
      let normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();
      normalVector.y = 0;
      normalVector = normalVector.normalize();
      if(intersectArray[0].object.name.includes("block")){
        console.log("block")
        return;
      }
      console.log(intersectArray[0].object.name)
      if(intersectArray[0].object.name.includes("king")){
        console.log("destroy king")
        Game.win(intersectArray[0].object)
        Game.instance.destroy()
        return;
      }
      if(intersectArray[0].object.name.includes("vuln")){
        Game.instance.destroy(intersectArray[0].object)
        return;
      }
      this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
      this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
      this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

      let reflectVector = new THREE.Vector3(
        intersectArray[0].point.x - this.object3d.position.x,
        intersectArray[0].point.y - this.object3d.position.y,
        intersectArray[0].point.z - this.object3d.position.z
      ).normalize().reflect(normalVector);

      if (this.reflectObject != null) {
        this.reflectObject.object3d.visible = true;
        this.reflectObject.object3d.position.set(
          intersectArray[0].point.x,
          intersectArray[0].point.y,
          intersectArray[0].point.z
        );

        this.reflectObject.intersect(reflectVector.clone(), objectArray);
      }
    }
    else {
      this.object3d.scale.z = this.config.length;
      this.pointLight.visible = false;
      this.object3d.lookAt(
        this.object3d.position.x + direction.x,
        this.object3d.position.y + direction.y,
        this.object3d.position.z + direction.z
      );

      this.hiddenReflectObject();
    }
  }
  hiddenReflectObject() {
    if (this.reflectObject != null) {
      this.reflectObject.object3d.visible = false;
      this.reflectObject.pointLight.visible = false;
      this.reflectObject.hiddenReflectObject();
    }
  }
  generateLaserBodyCanvas() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = 1;
    canvas.height = 64;
    // set gradient
    let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
    gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
    gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }
  extend(a,b) {
    for(let key in b)
         if(b.hasOwnProperty(key))
             a[key] = b[key];
     return a;
  }
}
export default LaserBeam
