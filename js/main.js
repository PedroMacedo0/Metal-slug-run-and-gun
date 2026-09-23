/**
 * Main Engine & Game Loops - Metal Slug 2D Run and Gun
 * Integração completa de Screen Shake dinâmico, VFX volumétrico e renderização rica de arcade.
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.currentStageNum = 1;
        this.state = 'LOBBY';
        this.gameOverTimer = 10;
        this.stageClearTimer = 0;
        this.fireworkTimer = 0;
        this.pauseCooldown = 0;

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / (rect.width || 1);
            const scaleY = this.canvas.height / (rect.height || 1);
            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            if (this.state === 'LOBBY') {
                if (clickX >= 180 && clickX <= 620 && clickY >= 460 && clickY <= 525) {
                    this.setGameState('PLAYING');
                }
            } else if (this.state === 'PAUSED') {
                // Botão 1: Continuar
                if (clickX >= 230 && clickX <= 570 && clickY >= 190 && clickY <= 238) {
                    this.setGameState('PLAYING');
                }
                // Botão 2: Reiniciar Fase
                else if (clickX >= 230 && clickX <= 570 && clickY >= 255 && clickY <= 303) {
                    this.restartCurrentStage();
                }
                // Botão 3: Sair para o Lobby
                else if (clickX >= 230 && clickX <= 570 && clickY >= 320 && clickY <= 368) {
                    this.loadStage(1);
                    this.setGameState('LOBBY');
                }
            } else if (this.state === 'VICTORY') {
                if (clickX >= 160 && clickX <= 640 && clickY >= 450 && clickY <= 540) {
                    this.resetGameFromStart();
                }
            } else if (this.state === 'GAMEOVER') {
                if (clickX >= 250 && clickX <= 550 && clickY >= 370 && clickY <= 420) {
                    this.restartCurrentStage();
                } else if (clickX >= 250 && clickX <= 550 && clickY >= 440 && clickY <= 490) {
                    this.loadStage(1);
                    this.setGameState('LOBBY');
                }
            }
        });

        this.setupFullscreenToggle();
        this.setupSoundToggle();
        this.loadStage(1);
        this.setGameState('LOBBY');

        this.hudFps = document.getElementById('debugFps');
        this.hudPos = document.getElementById('debugPos');
        this.hudVel = document.getElementById('debugVel');
        this.hudGrounded = document.getElementById('debugGrounded');
        this.hudState = document.getElementById('debugState');
        this.hudAim = document.getElementById('debugAim');

        this.lastTime = 0;
        this.fpsCounter = 0;
        this.fpsTimer = 0;
        this.currentFps = 60;

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    /**
     * Gerenciador do Botão de Tela Cheia (Fullscreen API + atalho F)
     */
    setupFullscreenToggle() {
        const btn = document.getElementById('btnFullscreen');
        const container = document.getElementById('canvasContainer') || this.canvas.parentElement;
        if (!btn || !container) return;

        const iconExpand = btn.querySelector('.icon-expand');
        const iconCompress = btn.querySelector('.icon-compress');
        const btnText = btn.querySelector('.btn-text');

        const updateButtonUI = (isFullscreen) => {
            if (isFullscreen) {
                if (iconExpand) iconExpand.style.display = 'none';
                if (iconCompress) iconCompress.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'SAIR TELA CHEIA';
                btn.classList.add('active');
                container.classList.add('is-fullscreen');
            } else {
                if (iconExpand) iconExpand.style.display = 'inline-block';
                if (iconCompress) iconCompress.style.display = 'none';
                if (btnText) btnText.textContent = 'TELA CHEIA';
                btn.classList.remove('active');
                container.classList.remove('is-fullscreen');
            }
        };

        const toggleFullscreen = () => {
            const isFs = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );

            if (!isFs) {
                if (container.requestFullscreen) {
                    container.requestFullscreen().catch(() => {});
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        };

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });

        const onFullscreenChange = () => {
            const isFs = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            updateButtonUI(isFs);
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('MSFullscreenChange', onFullscreenChange);

        window.addEventListener('keydown', (e) => {
            if ((e.code === 'KeyF' || e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
                e.preventDefault();
                toggleFullscreen();
            }
        });
    }

    /**
     * Gerenciador do Botão de Áudio / Mute (Tecla M)
     */
    setupSoundToggle() {
        const btn = document.getElementById('btnSoundToggle');
        if (!btn) return;

        const soundIcon = btn.querySelector('.sound-icon-box');
        const soundText = btn.querySelector('.sound-text');

        const updateSoundUI = (isMuted) => {
            if (isMuted) {
                if (soundIcon) soundIcon.textContent = '🔇';
                if (soundText) soundText.textContent = 'SOM OFF';
                btn.classList.add('muted');
            } else {
                if (soundIcon) soundIcon.textContent = '🔊';
                if (soundText) soundText.textContent = 'SOM ON';
                btn.classList.remove('muted');
            }
        };

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMuted = sound.toggleMute();
            updateSoundUI(isMuted);
        });

        window.addEventListener('keydown', (e) => {
            if ((e.code === 'KeyM' || e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
                e.preventDefault();
                const isMuted = sound.toggleMute();
                updateSoundUI(isMuted);
            }
        });
    }

    /**
     * Gerenciador Central de Estados e Soundtracks Oficiais
     */
    setGameState(newState) {
        this.state = newState;

        if (typeof sound !== 'undefined') {
            if (newState === 'LOBBY') {
                sound.setDucking(false);
                sound.playBgm('lobby');
            } else if (newState === 'PLAYING') {
                sound.setDucking(false);
                if (this.currentStageNum === 1) sound.playBgm('stage1');
                else if (this.currentStageNum === 2) sound.playBgm('stage2');
                else if (this.currentStageNum === 3) sound.playBgm('stage3');
            } else if (newState === 'PAUSED') {
                sound.setDucking(true);
            } else if (newState === 'VICTORY') {
                sound.setDucking(true);
            } else if (newState === 'GAMEOVER') {
                sound.setDucking(true);
            }
        }
    }

    loadStage(stageNum) {
        this.currentStageNum = stageNum;
        this.camera = new Camera2D(this.width, this.height);
        this.stage = new StageManager();
        this.stage.setStage(stageNum);
        this.camera.stageWidth = this.stage.stageWidth;

        if (this.state === 'PLAYING' && typeof sound !== 'undefined') {
            sound.playBgm(`stage${stageNum}`);
        }

        this.player = new Player(100, 300);
        this.bullets = [];
        this.medics = [];

        if (stageNum === 1) {
            this.enemies = [
                new Enemy(600, 440, 'INFANTRY'),
                new Enemy(950, 440, 'INFANTRY'),
                new Enemy(1400, 440, 'INFANTRY'),
                new Enemy(1850, 440, 'INFANTRY'),
                new Enemy(2200, 440, 'INFANTRY'),
                new Enemy(2800, 395, 'BOSS_TANK')
            ];
            this.pows = [
                new POW(450, 455, 'HMG'),
                new POW(1200, 455, 'SHOTGUN'),
                new POW(2000, 455, 'BAZOOKA')
            ];
            this.medics = [
                new MedicNPC(1600, 442)
            ];
            this.platforms = [
                { x: 0, y: 500, width: 3200, height: 100, color: '#383227', borderTop: '#6b5f48', type: 'RUINS_GROUND' },
                { x: 500, y: 380, width: 220, height: 20, color: '#443c30', borderTop: '#7d7056', type: 'RUINS_LEDGE' },
                { x: 1300, y: 340, width: 240, height: 20, color: '#443c30', borderTop: '#7d7056', type: 'RUINS_LEDGE' }
            ];
        } else if (stageNum === 2) {
            this.enemies = [
                new Enemy(450, 440, 'SHIELD_INFANTRY'),
                new Enemy(750, 190, 'SNIPER'),
                new Enemy(1100, 440, 'INFANTRY'),
                new Enemy(1450, 265, 'SNIPER'),
                new Enemy(1800, 440, 'SHIELD_INFANTRY'),
                new Enemy(2300, 245, 'SNIPER'),
                new Enemy(2700, 440, 'SHIELD_INFANTRY'),
                new Enemy(3100, 120, 'BOSS_GUNSHIP')
            ];
            this.pows = [
                new POW(600, 315, 'HMG'),
                new POW(1500, 275, 'SHOTGUN'),
                new POW(2400, 255, 'BAZOOKA')
            ];
            this.medics = [
                new MedicNPC(2000, 442)
            ];
            this.platforms = [
                { x: 0, y: 500, width: 3600, height: 100, color: '#161210', borderTop: '#ff3344', type: 'SUBWAY_TRACKS' },
                { x: 400, y: 360, width: 250, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' },
                { x: 720, y: 245, width: 200, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' },
                { x: 1050, y: 380, width: 280, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' },
                { x: 1400, y: 320, width: 220, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' },
                { x: 1750, y: 220, width: 260, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' },
                { x: 2250, y: 300, width: 250, height: 20, color: '#1a202c', borderTop: '#ffb703', type: 'CATWALK' }
            ];
        } else if (stageNum === 3) {
            this.enemies = [
                new Enemy(400, 2, 'CEILING_TURRET'),
                new Enemy(650, 444, 'ELITE_BAZOOKA'),
                new Enemy(1050, 2, 'CEILING_TURRET'),
                new Enemy(1400, 440, 'SHIELD_INFANTRY'),
                new Enemy(1800, 2, 'CEILING_TURRET'),
                new Enemy(2200, 444, 'ELITE_BAZOOKA'),
                new Enemy(2700, 440, 'SHIELD_INFANTRY'),
                new Enemy(3300, 220, 'BOSS_FINAL_MECH')
            ];
            this.pows = [
                new POW(350, 455, 'BAZOOKA'),
                new POW(1300, 255, 'HMG'),
                new POW(2500, 455, 'SHOTGUN')
            ];
            this.medics = [
                new MedicNPC(1900, 442)
            ];
            this.platforms = [
                { x: 0, y: 500, width: 3800, height: 100, color: '#0d1219', borderTop: '#00f0ff', type: 'FACTORY_GROUND' },
                { x: 550, y: 360, width: 220, height: 20, color: '#141c2b', borderTop: '#ff0055', type: 'SCAFFOLD' },
                { x: 1200, y: 300, width: 260, height: 20, color: '#141c2b', borderTop: '#ff0055', type: 'SCAFFOLD' },
                { x: 1900, y: 360, width: 240, height: 20, color: '#141c2b', borderTop: '#ff0055', type: 'SCAFFOLD' },
                { x: 2600, y: 280, width: 280, height: 20, color: '#141c2b', borderTop: '#ff0055', type: 'SCAFFOLD' }
            ];
        }

        vfx.addFloatingText(`MISSION ${stageNum} START`, this.player.x + 100, 250, '#00ff66');
    }

    restartCurrentStage() {
        this.loadStage(this.currentStageNum);
        this.setGameState('PLAYING');
        this.gameOverTimer = 10;
        this.stageClearTimer = 0;
        vfx.particles = [];
        vfx.floatingTexts = [];
    }

    resetGameFromStart() {
        this.loadStage(1);
        this.setGameState('PLAYING');
        this.gameOverTimer = 10;
        this.stageClearTimer = 0;
        vfx.particles = [];
        vfx.floatingTexts = [];
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        let dt = (timestamp - this.lastTime) / 1000;
        if (dt > 0.1) dt = 0.1;
        this.lastTime = timestamp;

        this.fpsCounter++;
        this.fpsTimer += dt;
        if (this.fpsTimer >= 0.5) {
            this.currentFps = Math.round(this.fpsCounter / this.fpsTimer);
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (this.pauseCooldown > 0) {
            this.pauseCooldown -= dt;
        }

        if (this.state === 'LOBBY') {
            vfx.update(dt);
            if (input.isRestartPressed() || input.isShootPressed() || input.isJustPressed('Space') || input.isJustPressed('space')) {
                this.setGameState('PLAYING');
            }
            return;
        }

        if (this.state === 'PAUSED') {
            if (this.pauseCooldown <= 0 && (input.isPausePressed() || input.isJustPressed('Enter') || input.isJustPressed('enter'))) {
                this.setGameState('PLAYING');
                this.pauseCooldown = 0.25;
            } else if (input.isJustPressed('KeyR') || input.isJustPressed('r')) {
                this.restartCurrentStage();
                this.pauseCooldown = 0.25;
            } else if (input.isLobbyPressed()) {
                this.loadStage(1);
                this.setGameState('LOBBY');
                this.pauseCooldown = 0.25;
            }
            return;
        }

        // Pressionar ESC ou P durante o jogo pausa a partida (protegido por pauseCooldown)
        if (this.pauseCooldown <= 0 && input.isPausePressed()) {
            this.setGameState('PAUSED');
            this.pauseCooldown = 0.25;
            return;
        }

        if (this.state === 'GAMEOVER') {
            this.gameOverTimer -= dt;
            if (this.gameOverTimer <= 0) {
                this.loadStage(1);
                this.setGameState('LOBBY');
                return;
            }
            if (input.isRestartPressed()) {
                this.restartCurrentStage();
            } else if (input.isQuitPressed()) {
                this.loadStage(1);
                this.setGameState('LOBBY');
            }
            return;
        }

        if (this.state === 'VICTORY') {
            this.fireworkTimer += dt;
            if (this.fireworkTimer >= 0.25) {
                this.fireworkTimer = 0;
                const fx = this.camera.x + 80 + Math.random() * 640;
                const fy = 60 + Math.random() * 240;
                vfx.addFirework(fx, fy);
            }
            vfx.update(dt);

            if (input.isRestartPressed() || input.isQuitPressed()) {
                this.resetGameFromStart();
            }
            return;
        }

        physics.applyGravity(this.player, dt);
        this.player.update(dt, this.bullets, this.enemies);
        physics.resolvePlatformCollisions(this.player, this.platforms);

        if (this.player.isDead && this.state !== 'GAMEOVER') {
            this.setGameState('GAMEOVER');
            this.gameOverTimer = 10;
            vfx.addFloatingText('GAME OVER', this.player.x, this.player.y - 40, '#ff0055');
        }

        this.camera.update(this.player.x);

        let bossAlive = false;
        let finalMechDefeated = false;

        for (const enemy of this.enemies) {
            enemy.update(dt, this.player.x, this.player.y, this.bullets);
            if ((enemy.type === 'BOSS_TANK' || enemy.type === 'BOSS_GUNSHIP' || enemy.type === 'BOSS_FINAL_MECH') && !enemy.isDead) {
                bossAlive = true;
            }
            if (enemy.type === 'BOSS_FINAL_MECH' && enemy.isDead) {
                finalMechDefeated = true;
            }
        }

        if (!bossAlive && this.state === 'PLAYING') {
            this.stageClearTimer += dt;
            if (this.stageClearTimer >= 3.8) {
                this.stageClearTimer = 0;
                if (this.currentStageNum === 1) {
                    this.loadStage(2);
                } else if (this.currentStageNum === 2) {
                    this.loadStage(3);
                } else if (this.currentStageNum === 3 && finalMechDefeated) {
                    this.setGameState('VICTORY');
                    sound.playVictoryFanfare();
                    for (let f = 0; f < 6; f++) {
                        vfx.addFirework(this.camera.x + 100 + f * 120, 80 + (f % 2) * 50);
                    }
                }
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.update(dt);

            if (!b.isEnemy) {
                for (const enemy of this.enemies) {
                    if (!enemy.isDead && physics.checkAABB({ x: b.x - b.radius, y: b.y - b.radius, width: b.radius * 2, height: b.radius * 2 }, enemy.getHitbox())) {
                        const isSplash = (b.type === 'BAZOOKA');
                        enemy.takeDamage(b.type === 'SHOTGUN' ? 3 : (isSplash ? 8 : 1.5), this.player.facingDirection, isSplash);
                        
                        if (isSplash) {
                            vfx.addExplosion(b.x, b.y, 35);
                            this.applySplashDamage(b.x, b.y, 70, 8);
                        } else {
                            vfx.addExplosion(b.x, b.y, 5);
                        }
                        
                        b.life = 0;
                        break;
                    }
                }

                for (const pow of this.pows) {
                    if (!pow.rescued && physics.checkAABB({ x: b.x - b.radius, y: b.y - b.radius, width: b.radius * 2, height: b.radius * 2 }, pow.getHitbox())) {
                        pow.rescue();
                        b.life = 0;
                    }
                }

                for (const medic of (this.medics || [])) {
                    if (!medic.isDead && physics.checkAABB({ x: b.x - b.radius, y: b.y - b.radius, width: b.radius * 2, height: b.radius * 2 }, medic.getHitbox())) {
                        medic.takeDamage(1, b.x);
                        b.life = 0;
                    }
                }
            } else {
                if (!this.player.isDead && physics.checkAABB({ x: b.x - b.radius, y: b.y - b.radius, width: b.radius * 2, height: b.radius * 2 }, this.player.getHitbox())) {
                    b.life = 0;
                    this.player.takeDamage(1);
                }

                for (const medic of (this.medics || [])) {
                    if (!medic.isDead && physics.checkAABB({ x: b.x - b.radius, y: b.y - b.radius, width: b.radius * 2, height: b.radius * 2 }, medic.getHitbox())) {
                        medic.takeDamage(1, b.x);
                        b.life = 0;
                    }
                }
            }

            if (b.life <= 0) {
                this.bullets.splice(i, 1);
            }
        }

        for (const pow of this.pows) {
            pow.update(dt, this.platforms);

            // Resgate do POW por contato direto do jogador ou faca
            if (!pow.rescued && physics.checkAABB(this.player.getHitbox(), pow.getHitbox())) {
                pow.rescue();
            }

            if (pow.droppedItem) {
                const item = pow.droppedItem;
                const itemBox = item.getHitbox ? item.getHitbox() : item;

                if (physics.checkAABB(this.player.getHitbox(), itemBox)) {
                    this.player.equipWeapon(item.weaponType);
                    this.player.score += 1000;
                    if (typeof sound !== 'undefined' && sound.playItem) {
                        sound.playItem();
                    }
                    vfx.addFloatingText('+1000 PTS', item.x, item.y - 15, '#ffb703');
                    vfx.addFloatingText(`${item.weaponType} ACQUIRED!`, item.x - 30, item.y - 35, '#00ff88');
                    vfx.addExplosion(item.x + item.width / 2, item.y + item.height / 2, 8);
                    pow.droppedItem = null;
                }
            }
        }

        // Atualização da Médica Rumi e Coleta de Kit Médico (+30% HP)
        for (const medic of (this.medics || [])) {
            medic.update(dt, this.platforms);

            // Contato físico ou proximidade com a médica
            if (!medic.isDead && physics.checkAABB(this.player.getHitbox(), medic.getHitbox())) {
                medic.takeDamage(1, this.player.x);
            }

            if (medic.droppedItem) {
                const item = medic.droppedItem;
                const itemBox = item.getHitbox ? item.getHitbox() : item;

                if (physics.checkAABB(this.player.getHitbox(), itemBox)) {
                    // Recupera exatamente 30% da vida máxima do jogador
                    const healAmount = Math.max(1, Math.round(this.player.maxHp * 0.3));
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
                    this.player.score += 500;
                    if (typeof sound !== 'undefined' && sound.playItem) {
                        sound.playItem();
                    }
                    vfx.addFloatingText(`+${healAmount} HP (30%)!`, item.x, item.y - 15, '#00ff88');
                    vfx.addFloatingText('FIRST AID ACQUIRED!', item.x - 30, item.y - 35, '#00ff88');
                    vfx.addExplosion(item.x + item.width / 2, item.y + item.height / 2, 10);
                    medic.droppedItem = null;
                }
            }
        }

        vfx.update(dt);
        this.updateDebugHUD();
    }

    applySplashDamage(centerX, centerY, radius, damage) {
        for (const enemy of this.enemies) {
            if (!enemy.isDead) {
                const box = enemy.getHitbox();
                const enemyCenterX = box.x + box.width / 2;
                const enemyCenterY = box.y + box.height / 2;
                const dist = Math.sqrt((enemyCenterX - centerX) ** 2 + (enemyCenterY - centerY) ** 2);
                if (dist <= radius) {
                    enemy.takeDamage(damage, 'RIGHT', true);
                }
            }
        }
    }

    draw() {
        this.ctx.save();

        if (this.state === 'LOBBY') {
            this.stage.drawParallaxBackground(this.ctx, 0);
            vfx.draw(this.ctx, 0);
            this.drawLobbyMenu();
            this.ctx.restore();
            return;
        }

        // Aplica efeito dinâmico de Screen Shake (vibração da câmera em explosões)
        if (vfx.screenShakeIntensity > 0) {
            const shakeX = (Math.random() - 0.5) * vfx.screenShakeIntensity;
            const shakeY = (Math.random() - 0.5) * vfx.screenShakeIntensity;
            this.ctx.translate(shakeX, shakeY);
        }

        const cameraX = this.camera.x;

        this.stage.drawParallaxBackground(this.ctx, cameraX);
        this.stage.drawForegroundDecorations(this.ctx, cameraX);

        this.drawPlatforms(cameraX);

        for (const pow of this.pows) {
            pow.draw(this.ctx, cameraX);
        }

        for (const medic of (this.medics || [])) {
            medic.draw(this.ctx, cameraX);
        }

        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, cameraX);
        }

        this.player.draw(this.ctx, cameraX);

        for (const b of this.bullets) {
            b.draw(this.ctx, cameraX);
        }

        vfx.draw(this.ctx, cameraX);
        this.drawArcadeHUD();

        if (this.state === 'PAUSED') {
            this.drawPauseMenu();
        } else if (this.state === 'GAMEOVER') {
            this.drawGameOverMenu();
        } else if (this.state === 'VICTORY') {
            this.drawVictoryMenu();
        }

        this.ctx.restore();
    }

    drawPlatforms(cameraX) {
        for (const p of this.platforms) {
            const renderX = p.x - cameraX;
            if (renderX + p.width < 0 || renderX > this.width) continue;

            // Fundo base da plataforma
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(renderX, p.y, p.width, p.height);

            // Renderização Estilizada por Tipo de Cenário Oficial
            if (p.type === 'RUINS_GROUND') {
                // Solo de Pedra Antiga de Angkor Wat com divisórias e musgo
                this.ctx.fillStyle = '#28231b';
                for (let bx = (p.x % 60); bx < p.width; bx += 60) {
                    const rx = p.x + bx - cameraX;
                    if (rx >= -10 && rx <= this.width + 10) {
                        this.ctx.fillRect(rx, p.y + 4, 2, p.height - 4);
                    }
                }
                this.ctx.fillStyle = '#201c15';
                this.ctx.fillRect(renderX, p.y + 45, p.width, 2);

                // Borda de pedra talhada com musgo verde suave
                this.ctx.fillStyle = p.borderTop || '#6b5f48';
                this.ctx.fillRect(renderX, p.y, p.width, 5);
                this.ctx.fillStyle = '#4a5d3c';
                for (let mx = 0; mx < p.width; mx += 140) {
                    const rmx = p.x + mx - cameraX;
                    if (rmx >= -50 && rmx <= this.width + 50) {
                        this.ctx.fillRect(rmx + 10, p.y, 25, 4);
                    }
                }
            } else if (p.type === 'RUINS_LEDGE') {
                // Plataformas elevadas de pedra antiga
                this.ctx.fillStyle = p.borderTop || '#7d7056';
                this.ctx.fillRect(renderX, p.y, p.width, 4);
                this.ctx.fillStyle = '#4a5d3c';
                this.ctx.fillRect(renderX + 8, p.y, 30, 3);
            } else if (p.type === 'SUBWAY_TRACKS') {
                // Trilhos e dormentes do metrô subterrâneo
                this.ctx.fillStyle = '#0e0b09';
                this.ctx.fillRect(renderX, p.y + 12, p.width, p.height - 12);

                // Dormentes de madeira espaçados
                this.ctx.fillStyle = '#281d16';
                const tieSpacing = 36;
                const startOffset = Math.floor(p.x / tieSpacing) * tieSpacing;
                for (let tx = startOffset; tx < p.x + p.width; tx += tieSpacing) {
                    const rtx = tx - cameraX;
                    if (rtx >= -20 && rtx <= this.width + 20) {
                        this.ctx.fillRect(rtx, p.y + 4, 12, 18);
                    }
                }

                // Trilho de aço duplo reluzente com reflexo
                this.ctx.fillStyle = '#7a828e';
                this.ctx.fillRect(renderX, p.y, p.width, 4);
                this.ctx.fillStyle = '#b0b8c4';
                this.ctx.fillRect(renderX, p.y + 1, p.width, 1.5);

                this.ctx.fillStyle = '#545d68';
                this.ctx.fillRect(renderX, p.y + 10, p.width, 3);
            } else if (p.type === 'CATWALK') {
                // Passarela de manutenção do metrô com listras de perigo amarelo/preto
                this.ctx.fillStyle = '#ffb703';
                this.ctx.fillRect(renderX, p.y, p.width, 4);
                this.ctx.fillStyle = '#1a1a1a';
                for (let cx = (p.x % 24); cx < p.width; cx += 24) {
                    const rcx = p.x + cx - cameraX;
                    if (rcx >= -10 && rcx <= this.width + 10) {
                        this.ctx.fillRect(rcx, p.y + 1, 12, 3);
                    }
                }
            } else if (p.type === 'FACTORY_GROUND') {
                // Piso de placas de aço industrial da fábrica
                this.ctx.fillStyle = '#070a0f';
                for (let px = (p.x % 80); px < p.width; px += 80) {
                    const rpx = p.x + px - cameraX;
                    if (rpx >= -10 && rpx <= this.width + 10) {
                        this.ctx.fillRect(rpx, p.y + 4, 2, p.height - 4);
                    }
                }
                // Linha de neon ciano futurista no solo
                this.ctx.fillStyle = '#00f0ff';
                this.ctx.fillRect(renderX, p.y, p.width, 3);
                this.ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
                this.ctx.fillRect(renderX, p.y, p.width, 7);
            } else if (p.type === 'SCAFFOLD') {
                // Andaimes industriais da fábrica com neon magenta
                this.ctx.fillStyle = '#ff0055';
                this.ctx.fillRect(renderX, p.y, p.width, 3);
                this.ctx.fillStyle = 'rgba(255, 0, 85, 0.25)';
                this.ctx.fillRect(renderX, p.y, p.width, 6);
            } else {
                this.ctx.fillStyle = p.borderTop || '#ffffff';
                this.ctx.fillRect(renderX, p.y, p.width, 4);
            }
        }
    }

    drawArcadeHUD() {
        const ctx = this.ctx;
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // 0. Sombra / Gradiente superior de legibilidade arcade
        const topGrad = ctx.createLinearGradient(0, 0, 0, 105);
        topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
        topGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
        topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, this.width, 105);

        // Helper para desenhar painéis militares táticos com bisel e rebites
        const drawTacticalPanel = (x, y, w, h, borderColor = '#2d3a4f') => {
            ctx.fillStyle = 'rgba(12, 17, 28, 0.88)';
            ctx.fillRect(x, y, w, h);

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, w, h);

            // Friso superior de reflexo metálico
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(x + 1, y + 1, w - 2, 1.5);

            // Rebites nos 4 cantos
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(x + 2, y + 2, 2, 2);
            ctx.fillRect(x + w - 4, y + 2, 2, 2);
            ctx.fillRect(x + 2, y + h - 4, 2, 2);
            ctx.fillRect(x + w - 4, y + h - 4, 2, 2);
        };

        // ==========================================
        // 1. PAINEL DO JOGADOR & BARRA DE VIDA (TOP LEFT)
        // ==========================================
        const pX = 16, pY = 10, pW = 236, pH = 48;
        const hpRatio = Math.max(0, this.player.hp / this.player.maxHp);
        const isCritical = hpRatio <= 0.25;
        const panelBorder = isCritical && (Math.floor(Date.now() / 150) % 2 === 0) ? '#ff0055' : '#334860';
        drawTacticalPanel(pX, pY, pW, pH, panelBorder);

        // Cabeçalho: Nome NERA / 1UP e valor numérico
        ctx.font = '900 10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText('1UP', pX + 8, pY + 16);

        ctx.fillStyle = '#ffffff';
        ctx.fillText('NERA', pX + 46, pY + 16);

        // Indicador numérico de vida
        ctx.textAlign = 'right';
        ctx.font = '900 9px "Press Start 2P", monospace';
        ctx.fillStyle = isCritical ? '#ff0055' : (hpRatio <= 0.5 ? '#ffb703' : '#00ff88');
        ctx.fillText(`HP ${Math.max(0, Math.ceil(this.player.hp))}/${this.player.maxHp}`, pX + pW - 8, pY + 16);
        ctx.textAlign = 'left';

        // Chassis e Gauge Segmentado de Vida (10 Pips de Vida)
        const barX = pX + 8;
        const barY = pY + 23;
        const barW = pW - 16;
        const barH = 16;

        ctx.fillStyle = '#060a12';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        const totalPips = this.player.maxHp;
        const pipSpacing = 2;
        const availableW = barW - (totalPips + 1) * pipSpacing;
        const pipW = availableW / totalPips;
        const currentPips = Math.max(0, Math.ceil(this.player.hp));

        for (let i = 0; i < totalPips; i++) {
            const pipX = barX + pipSpacing + i * (pipW + pipSpacing);
            const pipY = barY + 2;
            const pipH = barH - 4;

            if (i < currentPips) {
                const pipGrad = ctx.createLinearGradient(pipX, pipY, pipX, pipY + pipH);
                if (isCritical) {
                    pipGrad.addColorStop(0, '#ff4d6d');
                    pipGrad.addColorStop(1, '#c9184a');
                } else if (hpRatio <= 0.5) {
                    pipGrad.addColorStop(0, '#ffe066');
                    pipGrad.addColorStop(1, '#f77f00');
                } else {
                    pipGrad.addColorStop(0, '#52b788');
                    pipGrad.addColorStop(0.35, '#2dc653');
                    pipGrad.addColorStop(1, '#1b4332');
                }
                ctx.fillStyle = pipGrad;
                ctx.fillRect(pipX, pipY, pipW, pipH);

                // Brilho especular no topo do pip
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.fillRect(pipX, pipY, pipW, Math.max(1, pipH * 0.35));
            } else {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
                ctx.fillRect(pipX, pipY, pipW, pipH);
            }
        }

        // ==========================================
        // 2. PAINEL DE ARMA / PISTOLA & MUNIÇÃO (ABAIXO DA VIDA)
        // ==========================================
        const wX = 16, wY = 64, wW = 236, wH = 34;
        const currentW = this.player.weapon;
        const isSpecialWeapon = currentW.ammo !== Infinity;
        const weaponBorder = isSpecialWeapon ? '#ffb703' : '#2b3a4e';
        drawTacticalPanel(wX, wY, wW, wH, weaponBorder);

        // Caixa de ícone da arma
        ctx.fillStyle = isSpecialWeapon ? 'rgba(255, 183, 3, 0.15)' : 'rgba(0, 240, 255, 0.08)';
        ctx.fillRect(wX + 4, wY + 4, 26, 26);
        ctx.strokeStyle = isSpecialWeapon ? '#ffb703' : '#334860';
        ctx.lineWidth = 1;
        ctx.strokeRect(wX + 4, wY + 4, 26, 26);

        ctx.font = '14px sans-serif';
        ctx.fillText(currentW.icon || '🔫', wX + 9, wY + 22);

        // Nome da Arma
        ctx.font = '900 8.5px "Press Start 2P", monospace';
        ctx.fillStyle = isSpecialWeapon ? '#ffea00' : '#d1d5db';
        ctx.fillText(currentW.name, wX + 36, wY + 21);

        // Display digital LCD de munição à direita
        const lcdX = wX + wW - 68;
        const lcdY = wY + 5;
        const lcdW = 62;
        const lcdH = 24;
        ctx.fillStyle = '#050912';
        ctx.fillRect(lcdX, lcdY, lcdW, lcdH);
        ctx.strokeStyle = '#223247';
        ctx.strokeRect(lcdX, lcdY, lcdW, lcdH);

        ctx.textAlign = 'center';
        ctx.font = '900 9px "Press Start 2P", monospace';
        if (currentW.ammo === Infinity) {
            ctx.fillStyle = '#00ff88';
            ctx.fillText('∞ INF', lcdX + lcdW / 2, lcdY + 16);
        } else {
            const isLowAmmo = currentW.ammo <= 15;
            ctx.fillStyle = isLowAmmo && (Math.floor(Date.now() / 150) % 2 === 0) ? '#ff0055' : '#00f0ff';
            const ammoPadded = String(Math.max(0, currentW.ammo)).padStart(3, '0');
            ctx.fillText(`[${ammoPadded}]`, lcdX + lcdW / 2, lcdY + 16);
        }
        ctx.textAlign = 'left';

        // ==========================================
        // 3. BANNER CENTRAL DO ESTÁGIO / MISSÃO (TOP CENTER)
        // ==========================================
        const sW = 220, sH = 42;
        const sX = (this.width - sW) / 2;
        const sY = 10;
        drawTacticalPanel(sX, sY, sW, sH, '#ffb703');

        // Faixa de destaque dourada superior
        ctx.fillStyle = '#ffb703';
        ctx.fillRect(sX + 1, sY + 1, sW - 2, 2.5);

        ctx.textAlign = 'center';
        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 6;
        const isFinalStage = this.currentStageNum >= 3;
        const stageTitle = isFinalStage ? '★ FINAL MISSION ★' : `★ MISSION ${this.currentStageNum} ★`;
        ctx.fillText(stageTitle, sX + sW / 2, sY + 20);

        ctx.shadowBlur = 0;
        ctx.font = '900 7px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        const subtitle = (this.currentStageNum === 1) ? 'ANGKOR JUNGLE RUINS' :
                         (this.currentStageNum === 2) ? 'SUBWAY LINE TUNNEL' : 'ROBOTIC WAR FACTORY';
        ctx.fillText(subtitle, sX + sW / 2, sY + 34);
        ctx.textAlign = 'left';

        // ==========================================
        // 4. PAINEL DE PONTUAÇÃO & RECORD (TOP RIGHT)
        // ==========================================
        const scX = this.width - 236 - 16;
        const scY = 10;
        const scW = 236;
        const scH = 48;
        drawTacticalPanel(scX, scY, scW, scH, '#334860');

        ctx.font = '900 8.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('SCORE', scX + 8, scY + 16);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ff0055';
        ctx.fillText('HI 0099990', scX + scW - 8, scY + 16);

        // Pontuação do Jogador (7 Dígitos com Glow Neon)
        const scoreFormatted = String(this.player.score || 0).padStart(7, '0');
        ctx.font = '900 14px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillText(scoreFormatted, scX + scW - 8, scY + 38);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';

        ctx.restore();
    }

    drawGameOverMenu() {
        this.ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.textAlign = 'center';
        const remainingSec = Math.max(0, Math.ceil(this.gameOverTimer));

        if (remainingSec > 0) {
            this.ctx.font = '900 36px "Press Start 2P", monospace';
            this.ctx.fillStyle = (Math.floor(Date.now() / 400) % 2 === 0) ? '#ff0055' : '#ffb703';
            this.ctx.fillText('GAME OVER', 400, 180);

            this.ctx.font = '900 18px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(`CONTINUE? ${remainingSec}`, 400, 240);

            this.ctx.font = '900 12px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#00f0ff';
            this.ctx.fillText(`PONTUAÇÃO FINAL: ${this.player.score} PTS`, 400, 290);

            this.ctx.fillStyle = '#141b2d';
            this.ctx.fillRect(250, 370, 300, 50);
            this.ctx.strokeStyle = '#00ff66';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(250, 370, 300, 50);

            this.ctx.fillStyle = '#00ff66';
            this.ctx.font = '900 11px "Press Start 2P", monospace';
            this.ctx.fillText(`🔄 [ENTER / R] REINICIAR FASE ${this.currentStageNum}`, 400, 400);

            this.ctx.fillStyle = '#141b2d';
            this.ctx.fillRect(250, 440, 300, 50);
            this.ctx.strokeStyle = '#ff0055';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(250, 440, 300, 50);

            this.ctx.fillStyle = '#ff0055';
            this.ctx.fillText('🚪 [ESC / Q] VOLTAR AO INÍCIO', 400, 470);
        } else {
            this.ctx.font = '900 36px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#ff0055';
            this.ctx.fillText('VOCÊ PERDEU!', 400, 250);

            this.ctx.font = '900 14px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('TEMPO DE CONTINUE EXPIRADO!', 400, 310);
            this.ctx.fillStyle = '#ffb703';
            this.ctx.fillText('REINICIANDO DO INÍCIO (FASE 1)...', 400, 360);
        }

        this.ctx.textAlign = 'left';
    }

    drawVictoryMenu() {
        const ctx = this.ctx;
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // 1. Fundo Gradiente Escuro Cinematográfico com Vinheta
        const bgGrad = ctx.createRadialGradient(400, 290, 80, 400, 300, 520);
        bgGrad.addColorStop(0, 'rgba(12, 18, 30, 0.93)');
        bgGrad.addColorStop(1, 'rgba(4, 7, 14, 0.97)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. Desenha os fogos de artifício festivos no fundo
        vfx.draw(ctx, this.camera.x);

        // 3. Faixa Superior Militar "ALL MISSIONS ACCOMPLISHED"
        const ribbonW = 340, ribbonH = 24;
        const ribbonX = (this.width - ribbonW) / 2;
        const ribbonY = 14;
        ctx.fillStyle = 'rgba(255, 183, 3, 0.16)';
        ctx.fillRect(ribbonX, ribbonY, ribbonW, ribbonH);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ribbonX, ribbonY, ribbonW, ribbonH);

        // Rebites nos cantos da faixa
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(ribbonX + 2, ribbonY + 2, 2, 2);
        ctx.fillRect(ribbonX + ribbonW - 4, ribbonY + 2, 2, 2);
        ctx.fillRect(ribbonX + 2, ribbonY + ribbonH - 4, 2, 2);
        ctx.fillRect(ribbonX + ribbonW - 4, ribbonY + ribbonH - 4, 2, 2);

        ctx.textAlign = 'center';
        ctx.font = '900 9.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('★ ALL MISSIONS ACCOMPLISHED ★', 400, ribbonY + 16);

        // 4. Título Gigante 3D "CONGRATULATIONS!" Estilo Neo Geo
        const titleY = 66;
        ctx.font = '900 27px "Press Start 2P", monospace';

        // Camadas 3D Extrudadas de Sombra e Profundidade
        ctx.fillStyle = '#4a0404';
        ctx.fillText('CONGRATULATIONS!', 400, titleY + 6);
        ctx.fillStyle = '#9d0208';
        ctx.fillText('CONGRATULATIONS!', 400, titleY + 4);
        ctx.fillStyle = '#e85d04';
        ctx.fillText('CONGRATULATIONS!', 400, titleY + 2);

        // Face Principal em Degradê Dourado Cromo
        const titleGrad = ctx.createLinearGradient(400, titleY - 26, 400, titleY + 2);
        titleGrad.addColorStop(0, '#ffffff');
        titleGrad.addColorStop(0.3, '#ffea00');
        titleGrad.addColorStop(0.7, '#ffb703');
        titleGrad.addColorStop(1, '#d48b00');

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('CONGRATULATIONS!', 400, titleY);
        ctx.fillStyle = titleGrad;
        ctx.fillText('CONGRATULATIONS!', 400, titleY);

        // Subtítulo de Vitória Gloriosa
        ctx.font = '900 9.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fillText('A PAZ FOI RESTAURADA • EXÉRCITO REBELDE ANIQUILADO!', 400, 94);
        ctx.shadowBlur = 0;

        // 5. Painel Tático Central de Condecoração Militar (x: 45, y: 110, w: 710, h: 340)
        const dX = 45, dY = 110, dW = 710, dH = 340;
        ctx.fillStyle = 'rgba(10, 15, 26, 0.94)';
        ctx.fillRect(dX, dY, dW, dH);
        ctx.strokeStyle = '#2d3a4f';
        ctx.lineWidth = 2;
        ctx.strokeRect(dX, dY, dW, dH);

        // Moldura interna dourada
        ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(dX + 4, dY + 4, dW - 8, dH - 8);

        // Cantoneiras militares de reforço
        ctx.fillStyle = '#ffcc00';
        const bracketSize = 10;
        ctx.fillRect(dX + 2, dY + 2, bracketSize, 3);
        ctx.fillRect(dX + 2, dY + 2, 3, bracketSize);
        ctx.fillRect(dX + dW - bracketSize - 2, dY + 2, bracketSize, 3);
        ctx.fillRect(dX + dW - 5, dY + 2, 3, bracketSize);
        ctx.fillRect(dX + 2, dY + dH - 5, bracketSize, 3);
        ctx.fillRect(dX + 2, dY + dH - bracketSize - 2, 3, bracketSize);
        ctx.fillRect(dX + dW - bracketSize - 2, dY + dH - 5, bracketSize, 3);
        ctx.fillRect(dX + dW - 5, dY + dH - bracketSize - 2, 3, bracketSize);

        // ============================================================
        // 5.A. COLUNA ESQUERDA: RETRATO E BADGE DA HEROÍNA NERA
        // ============================================================
        const portX = dX + 16, portY = dY + 16, portW = 196, portH = dH - 32;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(portX, portY, portW, portH);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(portX, portY, portW, portH);

        // Header do Retrato
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.fillRect(portX + 1, portY + 1, portW - 2, 22);
        ctx.font = '900 9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.fillText('★ HEROINE ★', portX + portW / 2, portY + 16);

        // Desenha Nera em pé em pose de vitória com escala 2.2x
        if (neraAtlasImage.complete && neraAtlasImage.naturalWidth > 0 && typeof NERA_FRAMES !== 'undefined') {
            const idleFrame = Math.floor(Date.now() / 160) % 4;
            const vScale = 2.2;
            const charAnchorX = portX + portW / 2;
            const charAnchorY = portY + 195;

            const drawNeraPort = (cat, idx) => {
                const frames = NERA_FRAMES[cat];
                if (!frames || frames.length === 0) return;
                const f = frames[idx % frames.length];
                ctx.drawImage(
                    neraAtlasImage,
                    f.x, f.y, f.w, f.h,
                    charAnchorX - f.cx * vScale,
                    charAnchorY - f.cy * vScale,
                    f.w * vScale,
                    f.h * vScale
                );
            };

            // Pernas e tronco alinhados na pose de prontidão
            drawNeraPort('legs_idle', idleFrame);
            drawNeraPort('torso_idle', idleFrame);
        }

        // Placa de Identificação Militar de Nera
        const tagY = portY + portH - 64;
        ctx.fillStyle = '#060a12';
        ctx.fillRect(portX + 6, tagY, portW - 12, 56);
        ctx.strokeStyle = '#223247';
        ctx.lineWidth = 1;
        ctx.strokeRect(portX + 6, tagY, portW - 12, 56);

        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.fillText('NERA', portX + portW / 2, tagY + 18);

        ctx.font = '900 7px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('PEREGRINE FALCON', portX + portW / 2, tagY + 33);

        ctx.fillStyle = '#00ff88';
        ctx.fillText('STATUS: SURVIVOR', portX + portW / 2, tagY + 47);

        // ============================================================
        // 5.B. COLUNA DIREITA: RELATÓRIO TÁTICO & MÉTRICAS DE COMBATE
        // ============================================================
        const repX = dX + 228, repY = dY + 16, repW = dW - 244, repH = dH - 32;

        // Placa de Rank de Operação
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(repX, repY, repW, 64);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(repX, repY, repW, 64);

        ctx.textAlign = 'left';
        ctx.font = '900 10px "Press Start 2P", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('COMBAT OPERATION RANK:', repX + 16, repY + 26);

        ctx.font = '900 7.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('★ SUPREME COMMANDO OF VALOR ★', repX + 16, repY + 46);

        // Badge Gigante S+ com Glow Dourado
        ctx.textAlign = 'right';
        ctx.font = '900 32px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 14;
        ctx.fillText('S+', repX + repW - 18, repY + 46);
        ctx.shadowBlur = 0;

        // Lista de Conquistas da Campanha
        const listY = repY + 84;
        const drawMetricRow = (icon, label, value, valColor, rowIdx) => {
            const y = listY + rowIdx * 35;
            if (rowIdx % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(repX, y - 16, repW, 26);
            }

            ctx.textAlign = 'left';
            ctx.font = '12px sans-serif';
            ctx.fillText(icon, repX + 8, y + 2);

            ctx.font = '900 8.5px "Press Start 2P", monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(label, repX + 32, y);

            ctx.textAlign = 'right';
            ctx.fillStyle = valColor;
            ctx.fillText(value, repX + repW - 12, y);
        };

        const scoreStr = String(this.player.score || 0).padStart(7, '0') + ' PTS';
        drawMetricRow('⭐', 'PONTUAÇÃO FINAL', scoreStr, '#00f0ff', 0);
        drawMetricRow('🎯', 'FASES CONCLUÍDAS', '3 / 3 (100% CLEAR)', '#00ff88', 1);
        drawMetricRow('🤖', 'CHEFE FINAL', 'DRAGON NOSUKE DESTROYED', '#ff0055', 2);
        drawMetricRow('🛡️', 'FORÇAS REBELDES', 'GENERAL MORDEN NEUTRALIZADO', '#ffb703', 3);
        drawMetricRow('🏆', 'AVALIAÇÃO', 'HERÓI LENDÁRIO DA TERRA', '#ffffff', 4);

        // ============================================================
        // 6. BOTÃO DE AÇÃO "JOGAR NOVAMENTE" (CALL TO ACTION)
        // ============================================================
        const btnW = 440, btnH = 50;
        const btnX = (this.width - btnW) / 2;
        const btnY = 466;

        const pulse = Math.sin(Date.now() / 180) * 0.5 + 0.5;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.14)';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = pulse > 0.4 ? '#00ff88' : '#ffea00';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10 * pulse;
        ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.shadowBlur = 0;

        ctx.textAlign = 'center';
        ctx.font = '900 12px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('🔄 [ENTER / R] JOGAR NOVAMENTE', 400, btnY + 31);

        // Subtítulo de atalho secundário
        ctx.font = '900 8px "Press Start 2P", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('[ESC / Q] RETORNAR AO MENU INICIAL', 400, btnY + 65);

        ctx.textAlign = 'left';
        ctx.restore();
    }

    drawLobbyMenu() {
        const ctx = this.ctx;
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // 1. Overlay Escuro Cinematográfico com Vinheta
        const bgGrad = ctx.createRadialGradient(400, 270, 80, 400, 300, 520);
        bgGrad.addColorStop(0, 'rgba(8, 14, 24, 0.88)');
        bgGrad.addColorStop(1, 'rgba(3, 6, 12, 0.96)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Scanlines retro sutis
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let y = 0; y < this.height; y += 4) {
            ctx.fillRect(0, y, this.width, 1.5);
        }

        // 2. Faixa Superior Militar "SNK NEO-GEO ARCADE TRIBUTE"
        const ribbonW = 380, ribbonH = 24;
        const ribbonX = (this.width - ribbonW) / 2;
        const ribbonY = 16;
        ctx.fillStyle = 'rgba(255, 183, 3, 0.16)';
        ctx.fillRect(ribbonX, ribbonY, ribbonW, ribbonH);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ribbonX, ribbonY, ribbonW, ribbonH);

        // Rebites nos 4 cantos
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(ribbonX + 2, ribbonY + 2, 2, 2);
        ctx.fillRect(ribbonX + ribbonW - 4, ribbonY + 2, 2, 2);
        ctx.fillRect(ribbonX + 2, ribbonY + ribbonH - 4, 2, 2);
        ctx.fillRect(ribbonX + ribbonW - 4, ribbonY + ribbonH - 4, 2, 2);

        ctx.textAlign = 'center';
        ctx.font = '900 9.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('★ SNK NEO-GEO ARCADE TRIBUTE ★', 400, ribbonY + 16);

        // 3. Logotipo 3D Retrô "METAL SLUG 2D"
        const logoY = 70;
        ctx.font = '900 32px "Press Start 2P", monospace';

        // Camadas de extrusão 3D
        ctx.fillStyle = '#4a0404';
        ctx.fillText('METAL SLUG', 400, logoY + 6);
        ctx.fillStyle = '#9d0208';
        ctx.fillText('METAL SLUG', 400, logoY + 4);
        ctx.fillStyle = '#e85d04';
        ctx.fillText('METAL SLUG', 400, logoY + 2);

        // Face principal cromada dourada
        const titleGrad = ctx.createLinearGradient(400, logoY - 30, 400, logoY + 2);
        titleGrad.addColorStop(0, '#ffffff');
        titleGrad.addColorStop(0.25, '#ffea00');
        titleGrad.addColorStop(0.7, '#ffb703');
        titleGrad.addColorStop(1, '#d48b00');

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('METAL SLUG', 400, logoY);
        ctx.fillStyle = titleGrad;
        ctx.fillText('METAL SLUG', 400, logoY);

        ctx.font = '900 12px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillText('RUN AND GUN • MISSION COMMAND', 400, logoY + 26);
        ctx.shadowBlur = 0;

        // 4. Painel Central Dividido (Heroína à Esquerda, Briefing à Direita)
        const dX = 45, dY = 120, dW = 710, dH = 320;
        ctx.fillStyle = 'rgba(10, 15, 26, 0.94)';
        ctx.fillRect(dX, dY, dW, dH);
        ctx.strokeStyle = '#2d3a4f';
        ctx.lineWidth = 2;
        ctx.strokeRect(dX, dY, dW, dH);

        // Moldura interna dourada
        ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(dX + 4, dY + 4, dW - 8, dH - 8);

        // Cantoneiras militares
        ctx.fillStyle = '#ffcc00';
        const bracketSize = 10;
        ctx.fillRect(dX + 2, dY + 2, bracketSize, 3);
        ctx.fillRect(dX + 2, dY + 2, 3, bracketSize);
        ctx.fillRect(dX + dW - bracketSize - 2, dY + 2, bracketSize, 3);
        ctx.fillRect(dX + dW - 5, dY + 2, 3, bracketSize);
        ctx.fillRect(dX + 2, dY + dH - 5, bracketSize, 3);
        ctx.fillRect(dX + 2, dY + dH - bracketSize - 2, 3, bracketSize);
        ctx.fillRect(dX + dW - bracketSize - 2, dY + dH - 5, bracketSize, 3);
        ctx.fillRect(dX + dW - 5, dY + dH - bracketSize - 2, 3, bracketSize);

        // 4.A. Coluna Esquerda: Heroína Nera (x: 65, y: 136, w: 200, h: 288)
        const portX = dX + 16, portY = dY + 16, portW = 196, portH = dH - 32;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(portX, portY, portW, portH);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(portX, portY, portW, portH);

        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.fillRect(portX + 1, portY + 1, portW - 2, 22);
        ctx.font = '900 9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.fillText('★ HEROINE ★', portX + portW / 2, portY + 16);

        // Sprite animado de Nera
        if (neraAtlasImage.complete && neraAtlasImage.naturalWidth > 0 && typeof NERA_FRAMES !== 'undefined') {
            const idleFrame = Math.floor(Date.now() / 160) % 4;
            const vScale = 2.2;
            const charAnchorX = portX + portW / 2;
            const charAnchorY = portY + 185;

            const drawNeraPort = (cat, idx) => {
                const frames = NERA_FRAMES[cat];
                if (!frames || frames.length === 0) return;
                const f = frames[idx % frames.length];
                ctx.drawImage(
                    neraAtlasImage,
                    f.x, f.y, f.w, f.h,
                    charAnchorX - f.cx * vScale,
                    charAnchorY - f.cy * vScale,
                    f.w * vScale,
                    f.h * vScale
                );
            };

            drawNeraPort('legs_idle', idleFrame);
            drawNeraPort('torso_idle', idleFrame);
        }

        // Tag de Nera
        const tagY = portY + portH - 60;
        ctx.fillStyle = '#060a12';
        ctx.fillRect(portX + 6, tagY, portW - 12, 52);
        ctx.strokeStyle = '#223247';
        ctx.lineWidth = 1;
        ctx.strokeRect(portX + 6, tagY, portW - 12, 52);

        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.fillText('NERA', portX + portW / 2, tagY + 18);

        ctx.font = '900 7px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('PEREGRINE FALCON', portX + portW / 2, tagY + 32);

        ctx.fillStyle = '#00ff88';
        ctx.fillText('READY FOR BATTLE', portX + portW / 2, tagY + 45);

        // 4.B. Coluna Direita: Briefing das 3 Fases e Controles
        const repX = dX + 228, repY = dY + 16, repW = dW - 244, repH = dH - 32;

        ctx.textAlign = 'left';
        ctx.font = '900 10.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffb703';
        ctx.fillText('📜 CAMPANHA: 3 FASES OFICIAIS', repX + 8, repY + 18);

        const drawStageInfo = (icon, stageNum, name, boss, y) => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(repX + 4, y - 14, repW - 8, 30);
            ctx.strokeStyle = '#233347';
            ctx.strokeRect(repX + 4, y - 14, repW - 8, 30);

            ctx.font = '12px sans-serif';
            ctx.fillText(icon, repX + 12, y + 4);

            ctx.font = '900 8px "Press Start 2P", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`FASE ${stageNum}: ${name}`, repX + 34, y - 1);

            ctx.font = '900 7px "Press Start 2P", monospace';
            ctx.fillStyle = '#ff0055';
            ctx.fillText(`BOSS: ${boss}`, repX + 34, y + 10);
        };

        drawStageInfo('🌴', 1, 'ANGKOR JUNGLE RUINS', 'TANQUE PESADO MORDEN', repY + 44);
        drawStageInfo('🚇', 2, 'NEW GODOKIN SUBWAY', 'HELICÓPTERO MILITAR + SNIPERS', repY + 80);
        drawStageInfo('🏭', 3, 'ROBOTIC WAR FACTORY', 'DRAGON NOSUKE FINAL MECH', repY + 116);

        // Guia Rápido de Controles
        ctx.font = '900 9.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('🎮 CONTROLES DO JOGADOR:', repX + 8, repY + 166);

        const ctrlList = [
            'A/D ou ←/→ : Mover Esquerda / Direita',
            'K ou Espaço : Pular',
            'J ou Z      : Atirar / Golpe de Faca',
            'S ou ↓      : Agachar',
            'ESC ou P    : Pausar Jogo'
        ];

        ctx.font = '900 7.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctrlList.forEach((c, idx) => {
            ctx.fillText(`• ${c}`, repX + 14, repY + 188 + idx * 17);
        });

        // 5. Botão de Ação "INICIAR MISSÃO"
        const btnW = 440, btnH = 50;
        const btnX = (this.width - btnW) / 2;
        const btnY = 465;

        const pulse = Math.sin(Date.now() / 180) * 0.5 + 0.5;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.16)';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = pulse > 0.4 ? '#00ff88' : '#ffea00';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10 * pulse;
        ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.shadowBlur = 0;

        ctx.textAlign = 'center';
        ctx.font = '900 12px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('🎮 [ENTER / ESPAÇO] INICIAR MISSÃO', 400, btnY + 31);

        ctx.font = '900 8px "Press Start 2P", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('CLIQUE NO BOTÃO OU PRESSIONE ENTER PARA JOGAR', 400, btnY + 65);

        ctx.textAlign = 'left';
        ctx.restore();
    }

    drawPauseMenu() {
        const ctx = this.ctx;
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // 1. Overlay Escuro Translúcido sobre o jogo congelado
        ctx.fillStyle = 'rgba(6, 10, 18, 0.82)';
        ctx.fillRect(0, 0, this.width, this.height);

        // Scanlines de pausa
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let y = 0; y < this.height; y += 4) {
            ctx.fillRect(0, y, this.width, 1.5);
        }

        // 2. Caixa Modal de Pausa Central
        const mX = 180, mY = 90, mW = 440, mH = 410;
        ctx.fillStyle = 'rgba(12, 17, 28, 0.96)';
        ctx.fillRect(mX, mY, mW, mH);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2;
        ctx.strokeRect(mX, mY, mW, mH);

        // Rebites nos cantos do modal
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(mX + 3, mY + 3, 3, 3);
        ctx.fillRect(mX + mW - 6, mY + 3, 3, 3);
        ctx.fillRect(mX + 3, mY + mH - 6, 3, 3);
        ctx.fillRect(mX + mW - 6, mY + mH - 6, 3, 3);

        // Header Modal
        ctx.textAlign = 'center';
        ctx.font = '900 20px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 8;
        ctx.fillText('⏸️ JOGO PAUSADO', 400, mY + 45);
        ctx.shadowBlur = 0;

        ctx.font = '900 8.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('MISSÃO INTERROMPIDA TEMPORARIAMENTE', 400, mY + 70);

        // Linha divisória
        ctx.strokeStyle = '#2b3a4e';
        ctx.beginPath();
        ctx.moveTo(mX + 20, mY + 88);
        ctx.lineTo(mX + mW - 20, mY + 88);
        ctx.stroke();

        // 3. Botões do Menu de Pausa
        const btnW = 340, btnH = 48;
        const btnX = (this.width - btnW) / 2;

        // Botão 1: Continuar Jogo (Resume)
        const b1Y = mY + 110;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.12)';
        ctx.fillRect(btnX, b1Y, btnW, btnH);
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, b1Y, btnW, btnH);

        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('▶️ [ESC / ENTER] CONTINUAR', 400, b1Y + 30);

        // Botão 2: Reiniciar Fase Atual
        const b2Y = mY + 175;
        ctx.fillStyle = 'rgba(255, 183, 3, 0.12)';
        ctx.fillRect(btnX, b2Y, btnW, btnH);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, b2Y, btnW, btnH);

        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffb703';
        ctx.fillText(`🔄 [R] REINICIAR FASE ${this.currentStageNum}`, 400, b2Y + 30);

        // Botão 3: Sair para o Lobby (Menu Inicial)
        const b3Y = mY + 240;
        ctx.fillStyle = 'rgba(255, 0, 85, 0.12)';
        ctx.fillRect(btnX, b3Y, btnW, btnH);
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, b3Y, btnW, btnH);

        ctx.font = '900 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#ff0055';
        ctx.fillText('🏠 [L / Q] SAIR PARA O LOBBY', 400, b3Y + 30);

        // Resumo de status da partida atual
        ctx.font = '900 8px "Press Start 2P", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`FASE ATUAL: ${this.currentStageNum} • SCORE: ${this.player.score} PTS • HP: ${this.player.hp}/${this.player.maxHp}`, 400, mY + 325);

        ctx.fillStyle = '#00f0ff';
        ctx.fillText('💡 DICA: CLIQUE NOS BOTÕES OU USE OS ATALHOS', 400, mY + 355);

        ctx.textAlign = 'left';
        ctx.restore();
    }

    updateDebugHUD() {
        if (!this.hudFps) return;
        this.hudFps.textContent = this.currentFps;
        this.hudPos.textContent = `X: ${Math.round(this.player.x)}, Y: ${Math.round(this.player.y)}`;
        this.hudVel.textContent = `Vx: ${Math.round(this.player.vx)}, Vy: ${Math.round(this.player.vy)}`;

        if (this.player.isGrounded) {
            this.hudGrounded.textContent = 'SIM';
            this.hudGrounded.className = 'badge true';
        } else {
            this.hudGrounded.textContent = 'NO AR';
            this.hudGrounded.className = 'badge false';
        }

        let state = 'PARADO';
        if (this.state === 'GAMEOVER') state = 'GAME OVER';
        else if (this.state === 'VICTORY') state = 'VITÓRIA FINAL';
        else if (this.player.isDead) state = 'MORTO';
        else if (!this.player.isGrounded) state = 'PULANDO / CAINDO';
        else if (this.player.isCrouching) state = 'AGACHADO';
        else if (this.player.vx !== 0) state = 'CORRENDO';

        this.hudState.textContent = state;
        this.hudAim.textContent = this.player.aimDirection;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});