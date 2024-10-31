class SoundPlayer {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.sounds = {
      workStart: new Audio("/sounds/work-start.mp3"),
      breakStart: new Audio("/sounds/break-start.mp3"),
      breakOver: new Audio("/sounds/break-over.mp3"),
    };

    // Preload sounds
    Object.values(this.sounds).forEach(audio => {
      audio.load();
    });
  }

  play(soundName: keyof typeof this.sounds) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.log("Error playing sound:", err));
    }
  }
}

export const soundPlayer = new SoundPlayer(); 