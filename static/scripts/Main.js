import Game from './Game.js'
import Ui from './Ui.js'
let game;
let ui;
window.onload = () => {

   const URL = "/";
   const socket = io(URL);
   socket.on("xdd", (reson) => {
      console.log(reson)
   })
   game = new Game(socket);
   ui = new Ui();
}
