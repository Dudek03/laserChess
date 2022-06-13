
class Cube extends THREE.Object3D {

  constructor() {
    super()
    this.name = "hehe"
    this.cube = null
  }

  loadModel = async (loader) => {
    return new Promise((resolve, reject) => {
      //let example = new THREE.Object3D()
      loader.load("./models/pieceMap.glb", async (glb) => {
        //example = glb.scene
        glb.scene.scale.set(10, 10, 10)
        glb.scene.children[0].name = "cube"
        resolve(glb.scene)
      })
    })
  }
}

export default Cube
