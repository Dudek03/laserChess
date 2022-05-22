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
                glb.scene.scale.set(5, 5, 5)
                // console.log(glb.scene);
                resolve(glb.scene)
            })
        })
    }

}

export default Pawn
