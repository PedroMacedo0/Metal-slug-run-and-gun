/**
 * SoundEngine - Gerenciador de Áudio & Soundtracks (WebAudio API + HTML5 Audio)
 * Efeitos sonoros sem latência e suporte completo às Soundtracks Oficiais de Metal Slug:
 * - Lobby / Menu Principal (assets/audio/bgm_lobby.mp3)
 * - Fase 1: Angkor Jungle Ruins (assets/audio/bgm_stage1.mp3)
 * - Fase 2: Subway Tunnel (assets/audio/bgm_stage2.mp3)
 * - Fase 3: Robotic War Factory (assets/audio/bgm_stage3.mp3)
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmVolume = 0.55;
        this.sfxVolume = 0.5;

        // Mapa das faixas oficiais de cada fase e lobby
        this.bgmTracks = {
            lobby: 'assets/audio/bgm_lobby.mp3',
            stage1: 'assets/audio/bgm_stage1.mp3',
            stage2: 'assets/audio/bgm_stage2.mp3',
            stage3: 'assets/audio/bgm_stage3.mp3'
        };

        // Mapa dos efeitos sonoros oficiais importados
        this.sfxTracks = {
            death: 'assets/audio/sfx_death.mp3',
            thankYou: 'assets/audio/sfx_thank_you.mp3',
            missionComplete: 'assets/audio/sfx_mission_complete.mp3'
        };

        this.currentBgmName = null;
        this.currentBgmAudio = null;
        this.userInteracted = false;

        // Desbloqueia automaticamente o áudio no primeiro clique ou toque do teclado
        const unlockAudio = () => {
            this.init();
            if (this.currentBgmAudio && this.currentBgmAudio.paused && !this.muted) {
                this.currentBgmAudio.play().catch(() => {});
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };

        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
        window.addEventListener('touchstart', unlockAudio, { once: true });
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        this.userInteracted = true;
    }

    /**
     * Toca a trilha sonora correspondente em loop
     * @param {'lobby'|'stage1'|'stage2'|'stage3'} trackName
     */
    playBgm(trackName) {
        if (this.currentBgmName === trackName && this.currentBgmAudio && !this.currentBgmAudio.paused) {
            return;
        }

        const url = this.bgmTracks[trackName];
        if (!url) return;

        // Fade-out suave da faixa anterior
        if (this.currentBgmAudio) {
            const oldAudio = this.currentBgmAudio;
            let vol = oldAudio.volume;
            const fadeInterval = setInterval(() => {
                vol -= 0.1;
                if (vol <= 0.05) {
                    clearInterval(fadeInterval);
                    oldAudio.pause();
                    oldAudio.currentTime = 0;
                } else {
                    oldAudio.volume = Math.max(0, vol);
                }
            }, 30);
        }

        this.currentBgmName = trackName;
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = this.muted ? 0 : this.bgmVolume;
        this.currentBgmAudio = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay aguardará o primeiro clique ou tecla do usuário
            });
        }
    }

    stopBgm() {
        if (this.currentBgmAudio) {
            this.currentBgmAudio.pause();
            this.currentBgmAudio.currentTime = 0;
            this.currentBgmAudio = null;
            this.currentBgmName = null;
        }
    }

    pauseBgm() {
        if (this.currentBgmAudio && !this.currentBgmAudio.paused) {
            this.currentBgmAudio.pause();
        }
    }

    resumeBgm() {
        if (this.currentBgmAudio && this.currentBgmAudio.paused && !this.muted) {
            this.currentBgmAudio.play().catch(() => {});
        }
    }

    setDucking(isDucked) {
        if (this.currentBgmAudio && !this.muted) {
            this.currentBgmAudio.volume = isDucked ? 0.18 : this.bgmVolume;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.currentBgmAudio) {
            this.currentBgmAudio.volume = this.muted ? 0 : this.bgmVolume;
            if (this.muted) {
                this.currentBgmAudio.pause();
            } else {
                this.currentBgmAudio.play().catch(() => {});
            }
        }
        return this.muted;
    }

    // ========================================================
    // EFEITOS SONOROS PROCEDURAIS (Web Audio API)
    // ========================================================

    playPistol() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playHMG() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    playShotgun() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    playBazooka() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playExplosion() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playJump() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playItem() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.16); // G5

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    /**
     * Toca um efeito sonoro de arquivo de áudio com suporte a múltiplas instâncias
     */
    playAudioSfx(sfxKey, volumeMult = 1.0) {
        if (this.muted) return;
        this.init();
        const url = this.sfxTracks[sfxKey];
        if (!url) return;

        try {
            const audio = new Audio(url);
            audio.volume = Math.min(1.0, this.sfxVolume * volumeMult);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } catch (err) {
            // Silencioso em caso de restrição do navegador
        }
    }

    playDeath() {
        this.playAudioSfx('death', 1.0);
    }

    playThankYou() {
        this.playAudioSfx('thankYou', 1.0);
    }

    playMissionComplete() {
        this.setDucking(true);
        this.playAudioSfx('missionComplete', 1.0);
    }

    playRescue() {
        this.playThankYou();
    }

    playVictoryFanfare() {
        this.playMissionComplete();
    }

    playFireworkSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + Math.random() * 400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

const sound = new SoundEngine();
