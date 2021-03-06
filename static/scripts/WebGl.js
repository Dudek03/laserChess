import {
  OrbitControls
} from '../libs/OrbitControls.js'
import LaserBeam from './Laser.js'
class WebGl {
  static instance
  static objectArray
  constructor() {
    WebGl.instance = this
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this.renderer.setClearColor(0x242424)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById("root").append(this.renderer.domElement)
    this.axes = new THREE.AxesHelper(1000)
    //this.scene.add(this.axes)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.camera.position.set(30, 100, 20)
    this.camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.listenToKeyEvents(document.body)

    this.render()
    this.addLight()
  }

  addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 10)
    light.position.set(1, 1, 1)
    light.intensity = 1
    this.scene.add(light)

    const light2 = new THREE.DirectionalLight(0xffffff, 10)
    light2.position.set(-1, -1, -1)
    light2.intensity = 1
    this.scene.add(light2)
  }

  render = () => {
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    //console.log("render leci")
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    TWEEN.update()
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  smoothyMove(clicked, pos) {
    return new Promise((resolve, reject) => {
      new TWEEN.Tween(clicked.position)
        .to({
          x: pos.x,
          y: 20,
          z: pos.z
        }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => resolve())
        .start()
    })
  }
  static ssmoothyMove(clicked, pos) {

    new TWEEN.Tween(clicked.position)
      .to({
        x: pos.x,
        y: pos.y,
        z: pos.z
      }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }
}

export default WebGl