import {
  GLTFLoader
} from '../libs/GLTFLoader.js'
class Cube extends THREE.Object3D{

  constructor() {
    super()
  }

  init = async () => {
    this.cube = await this.loadModel()
  }

  loadModel = async () => {
    return new Promise((resolve, reject) => {
      //let example = new THREE.Object3D()
      let loader = new GLTFLoader();
      loader.load("./models/pieceMap.glb", async (glb) => {
        //example = glb.scene
        glb.scene.scale.set(10, 10, 10)
        resolve(glb.scene)
      })
    })
  }
}

export default Cube
