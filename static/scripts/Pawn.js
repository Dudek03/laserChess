import {
  GLTFLoader
} from '../libs/GLTFLoader.js'

class Pawn extends THREE.Object3D {

  constructor() {
    super()
    this.name = "pawn"
  }

  init = async (name) => {
    this.pawn = await this.loadModel(name)
  }

  loadModel = async (name) => {
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      loader.load(`./models/${name}.glb`, async (glb) => {
        glb.scene.scale.set(5, 5, 5)
        resolve(glb.scene)
      })
    })
  }

  setName = (name) =>{
    this.name = name
  }
}

export default Pawn
