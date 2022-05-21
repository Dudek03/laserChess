import {
    GLTFLoader
} from '../libs/GLTFLoader.js'

class Pawn extends THREE.Object3D {

    constructor() {
        super()
    }

    init = async (name) => {
        this.pawn = await this.loadModel(name)
    }

    loadModel = async (name) => {
        return new Promise((resolve, reject) => {
            let loader = new GLTFLoader();
            loader.load(`./models/${name}.glb`, async (glb) => {
                console.log(glb.scene)
                glb.scene.scale.set(10, 10, 10)
                resolve(glb.scene)
            })
        })
    }

}

export default Pawn
