import { SpiritBoard } from "./js/SpiritBoard";
import { JoinBox } from "./js/JoinBox";
import { Networking } from "./js/Networking";

(async function () {

  const networking = new Networking();
  const joinBox = new JoinBox("join");
  const board = new SpiritBoard("activeBoard", networking);

  const boardName = new URLSearchParams(location.search).get('boardName');

  if (!boardName) {
    joinBox.setBoardName("spoopy-kids");
    joinBox.show();
    return;
  }

  networking.on("join", () => {
    board.planchette.centre();
  });

  networking.on("nudge", (message) => {
    board.movePlanchette({ deltaX: message.data.deltaX, deltaY: message.data.deltaY });
  });

  await networking.connect(boardName);

  board.onReveal((item) => {
    board.spookyAnimate(item.text);
  });

  board.show();

  const audio = new Audio("/audio/dangerousound.ogg");
  audio.volume = 0.03;
  // audio.play();


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

})();