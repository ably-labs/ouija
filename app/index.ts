import { SpiritBoard } from "./js/SpiritBoard";
import { JoinBox } from "./js/JoinBox";
import { Networking } from "./js/Networking";
import { AudioManager } from "./js/audio/AudioManager";
import { ConfigurationRepository } from "./js/ConfigurationRepository";
import { wait } from "./js/util"

(async function () {

  const settings = new ConfigurationRepository();
  const boardName = new URLSearchParams(location.search).get('boardName');

  if (!boardName) {
    const joinBox = new JoinBox("join", settings);
    joinBox.setBoardName("spoopy-kids");
    joinBox.show();
    return;
  }

  const networking = new Networking();
  const audioManager = new AudioManager(settings.load());
  const board = new SpiritBoard("activeBoard", networking);

  networking.on("join", () => {
    board.planchette.centre();
  });

  networking.on("snap", (message) => {
    board.planchette.snapTo(message.data);
  });

  networking.on("nudge", (message) => {
    board.movePlanchette({ deltaX: message.data.deltaX, deltaY: message.data.deltaY });
  });

  await networking.connect(boardName);

  board.onReveal(async (item) => {
    board.spookyAnimate(item.text);
    await wait(1_000);
    audioManager.voiceItem(item);
  });

  board.show();
  audioManager.playAmbientAudio();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

})();