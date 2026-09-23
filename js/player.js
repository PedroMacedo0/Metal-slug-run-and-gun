/**
 * Player - Nera (Soldier Heroine - Metal Slug Style)
 * Integrado com a folha de sprites oficial de Nera (poohcom1).
 * Suporta animação modular independente de pernas e tronco:
 * - Idle, Corrida sincrona (8 quadros), Pulo dinâmico (subida, pico, queda)
 * - Agachamento completo (repouso, rastejo com 6 quadros, disparo frontal)
 * - Mira omnidirecional (frontal, vertical 90°, diagonal, disparo para baixo no ar)
 * - Ataque de faca corpo a corpo (11 quadros) ao aproximar de soldados inimigos
 * - Animação cinematográfica de morte no solo (12 quadros) com arma girando ao cair
 */

const neraAtlasImage = new Image();
neraAtlasImage.src = 'assets/nera_atlas.png';

const NERA_SCALE = 1.45;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.prevY = y;
        this.width = 38;
        this.heightStand = 66;
        this.heightCrouch = 38;
        this.currentHeight = this.heightStand;

        this.vx = 0;
        this.vy = 0;
        this.moveSpeed = 350;
        this.crouchMoveSpeed = 160;
        this.jumpImpulse = -680;
        this.isGrounded = false;
        this.isCrouching = false;
        this.facingDirection = 'RIGHT';
        this.aimDirection = 'RIGHT';

        this.hp = 10;
        this.maxHp = 10;
        this.score = 0;
        this.isDead = false;

        this.currentWeaponKey = 'PISTOL';
        this.weapon = WEAPONS.PISTOL;
        this.fireTimer = 0;

        // Temporizadores e quadros de animação do Sprite Pack Nera
        this.animTimer = 0;
        this.idleTimer = 0;
        this.runFrame = 0;
        this.idleFrame = 0;
        this.crouchFrame = 0;
        this.shootFrame = 0;
        this.shootAnimTimer = 0;
        this.knifeAnimTimer = 0;
        this.knifeFrame = 0;
        this.deathTimer = 0;
        this.dustTimer = 0;
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.currentHeight
        };
    }

    takeDamage(amount = 1) {
        if (this.isDead) return;
        this.hp -= amount;
        vfx.addExplosion(this.x + 18, this.y + 30, 8);
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        if (!this.isDead) {
            this.hp = 0;
            this.isDead = true;
            this.deathTimer = 0;
            if (typeof sound !== 'undefined' && sound.playDeath) {
                sound.playDeath();
            }
        }
    }

    crouch() {
        if (!this.isCrouching) {
            this.isCrouching = true;
            this.y += (this.heightStand - this.heightCrouch); // 66 - 38 = 28px
            this.currentHeight = this.heightCrouch;
            this.prevY = this.y;
        }
    }

    uncrouch() {
        if (this.isCrouching) {
            this.isCrouching = false;
            this.y -= (this.heightStand - this.heightCrouch); // Restaura Y 28px para cima
            this.currentHeight = this.heightStand;
            this.prevY = this.y;
        }
    }

    equipWeapon(weaponKey) {
        if (WEAPONS[weaponKey]) {
            this.currentWeaponKey = weaponKey;
            this.weapon = { ...WEAPONS[weaponKey] };
            vfx.addFloatingText(this.weapon.name + '!', this.x, this.y - 20, '#ffb703');
            vfx.addMuzzleFlash(this.x + 15, this.y + 20, 0);
            sound.playItem();
        }
    }

    update(dt, bullets, enemies = []) {
        if (this.isDead) {
            this.deathTimer += dt;
            return;
        }

        this.prevY = this.y;
        this.fireTimer += dt;
        this.animTimer += dt;
        this.idleTimer += dt;

        // Atualiza animação de corrida (8 quadros a 12 FPS)
        if (this.animTimer >= 0.08) {
            this.animTimer = 0;
            this.runFrame = (this.runFrame + 1) % 8;
            this.crouchFrame = (this.crouchFrame + 1) % 6;
        }

        // Atualiza animação de respiração/idle sutil (4 quadros)
        if (this.idleTimer >= 0.18) {
            this.idleTimer = 0;
            this.idleFrame = (this.idleFrame + 1) % 4;
        }

        // Atualiza temporizador de disparo do tronco
        if (this.shootAnimTimer > 0) {
            this.shootAnimTimer -= dt;
            this.shootFrame = (this.shootFrame + 1) % 4;
        }

        // Atualiza facada corpo a corpo
        if (this.knifeAnimTimer > 0) {
            this.knifeAnimTimer -= dt;
            this.knifeFrame = Math.min(10, Math.floor((0.44 - this.knifeAnimTimer) / 0.04));
        }

        // Poeira ao correr no solo
        if (this.vx !== 0 && this.isGrounded) {
            this.dustTimer += dt;
            if (this.dustTimer >= 0.15) {
                this.dustTimer = 0;
                vfx.addDust(this.x + (this.facingDirection === 'RIGHT' ? 5 : 30), this.y + this.currentHeight);
            }
        }

        // 1. Controle de Agachamento Perfeito sem Dessincronia
        const wantsToCrouch = input.isDownKey();

        if (this.isGrounded && wantsToCrouch) {
            this.crouch();
        } else {
            this.uncrouch();
        }

        // 2. Movimentação Horizontal (Suporta rastejar agachado)
        this.vx = 0;
        const currentSpeed = this.isCrouching ? this.crouchMoveSpeed : this.moveSpeed;

        if (input.isLeft()) {
            this.vx = -currentSpeed;
            this.facingDirection = 'LEFT';
        } else if (input.isRight()) {
            this.vx = currentSpeed;
            this.facingDirection = 'RIGHT';
        }

        // 3. Pulo com Desagachamento Seguro
        if (input.isJumpPressed() && this.isGrounded) {
            this.uncrouch();
            this.vy = this.jumpImpulse;
            this.isGrounded = false;
            sound.playJump();
            vfx.addDust(this.x + 18, this.y + this.currentHeight);
        }

        // 4. Direção da Mira (No ar apontando para baixo, no chão mira frontal agachado)
        this.updateAimDirection();

        // 5. Atualização de Posição
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x < 0) this.x = 0;
        if (this.x > 3560) this.x = 3560;

        // 6. Tiro ou Golpe de Faca Corpo a Corpo
        const canShoot = this.weapon.automatic ? input.isDown('KeyJ') || input.isDown('j') || input.isDown('KeyZ') || input.isDown('z') : input.isShootPressed();

        if (canShoot && this.fireTimer >= this.weapon.fireRate) {
            // Checa se há inimigo no raio de combate corpo a corpo (faca estilo Metal Slug)
            const meleeTarget = this.findMeleeTarget(enemies);
            if (meleeTarget && !this.isCrouching && this.isGrounded) {
                this.executeKnifeAttack(meleeTarget);
                this.fireTimer = 0;
            } else if (this.weapon.ammo > 0) {
                this.fireTimer = 0;
                this.fireWeapon(bullets);
                if (this.weapon.ammo !== Infinity) {
                    this.weapon.ammo--;
                    if (this.weapon.ammo <= 0) {
                        this.equipWeapon('PISTOL');
                    }
                }
            }
        }
    }

    findMeleeTarget(enemies) {
        if (!enemies || enemies.length === 0) return null;
        for (const e of enemies) {
            if (e.isDead) continue;
            const dist = e.x - this.x;
            const inFront = (this.facingDirection === 'RIGHT' && dist > -10 && dist < 52) ||
                           (this.facingDirection === 'LEFT' && dist < 10 && dist > -52);
            const inLevel = Math.abs(e.y - this.y) < 45;
            if (inFront && inLevel) {
                return e;
            }
        }
        return null;
    }

    executeKnifeAttack(target) {
        this.knifeAnimTimer = 0.44;
        this.knifeFrame = 0;
        sound.playShotgun(); // Som de corte/impacto firme
        vfx.addScreenShake(3);
        const slashX = this.x + (this.facingDirection === 'RIGHT' ? 35 : -10);
        vfx.addExplosion(slashX, this.y + 25, 12);
        vfx.addFloatingText('SLASH!', slashX, this.y - 10, '#ff0055');
        target.takeDamage(10, this.facingDirection, false);
    }

    updateAimDirection() {
        const isUp = input.isUp();
        const isDown = input.isDownKey();
        const isMoving = this.vx !== 0;

        if (!this.isGrounded && isDown) {
            this.aimDirection = 'DOWN';
        } else if (isUp) {
            if (isMoving) {
                this.aimDirection = this.facingDirection === 'RIGHT' ? 'UP_RIGHT' : 'UP_LEFT';
            } else {
                this.aimDirection = 'UP';
            }
        } else {
            this.aimDirection = this.facingDirection;
        }
    }

    fireWeapon(bullets) {
        const speed = this.weapon.bulletSpeed;
        const isRight = this.facingDirection === 'RIGHT';

        // Posição de origem precisa da boca do cano de Nera
        let originX = this.x + (isRight ? 38 : 0);
        let originY = this.y + (this.isCrouching ? 20 : 25);

        if (this.aimDirection === 'UP' || this.aimDirection === 'UP_RIGHT' || this.aimDirection === 'UP_LEFT') {
            originX = this.x + (isRight ? 24 : 14);
            originY = this.y - 14;
        } else if (this.aimDirection === 'DOWN' && !this.isGrounded) {
            originX = this.x + 19;
            originY = this.y + this.currentHeight + 8;
        }

        // Ativa animação de disparo do tronco
        this.shootAnimTimer = 0.22;
        this.shootFrame = 0;

        // Toca o som da arma disparada
        switch (this.currentWeaponKey) {
            case 'PISTOL': sound.playPistol(); break;
            case 'HMG': sound.playHMG(); break;
            case 'SHOTGUN': sound.playShotgun(); vfx.addScreenShake(6); break;
            case 'BAZOOKA': sound.playBazooka(); vfx.addScreenShake(8); break;
        }

        if (this.currentWeaponKey === 'SHOTGUN') {
            const count = this.weapon.pellets || 6;
            for (let i = 0; i < count; i++) {
                const spreadAngle = (Math.random() - 0.5) * this.weapon.spread;
                const baseAngle = this.getAimAngle() + spreadAngle;
                const vx = Math.cos(baseAngle) * speed;
                const vy = Math.sin(baseAngle) * speed;
                bullets.push(new Bullet(originX, originY, vx, vy, 'SHOTGUN'));
            }
            vfx.addMuzzleFlash(originX, originY, this.getAimAngle());
            return;
        }

        const spreadAngle = (Math.random() - 0.5) * (this.weapon.spread || 0);
        const angle = this.getAimAngle() + spreadAngle;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        bullets.push(new Bullet(originX, originY, vx, vy, this.currentWeaponKey));
        vfx.addMuzzleFlash(originX, originY, angle);
    }

    getAimAngle() {
        switch (this.aimDirection) {
            case 'RIGHT': return 0;
            case 'LEFT': return Math.PI;
            case 'UP': return -Math.PI / 2;
            case 'UP_RIGHT': return -Math.PI / 4;
            case 'UP_LEFT': return -Math.PI * 0.75;
            case 'DOWN': return Math.PI / 2;
            default: return 0;
        }
    }

    draw(ctx, cameraX) {
        const renderX = this.x - cameraX;
        const isRight = this.facingDirection === 'RIGHT';

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Se o atlas de Nera estiver carregado, desenha a protagonista
        if (neraAtlasImage.complete && neraAtlasImage.naturalWidth > 0 && typeof NERA_FRAMES !== 'undefined') {
            this.drawNeraSprite(ctx, renderX, isRight);
        } else {
            // Fallback enquanto a imagem carrega
            this.drawFallbackPlayer(ctx, renderX, isRight);
        }

        ctx.restore();
    }

    drawNeraSprite(ctx, renderX, isRight) {
        const groundY = this.y + this.currentHeight;
        const anchorX = renderX + this.width / 2;
        const anchorY = groundY - 24 * NERA_SCALE;

        const drawFrame = (category, frameIdx, offX = 0, offY = 0, scale = NERA_SCALE, flipX = !isRight, rot = 0) => {
            const frames = NERA_FRAMES[category];
            if (!frames || frames.length === 0) return;
            const f = frames[Math.abs(frameIdx) % frames.length];

            ctx.save();
            ctx.translate(anchorX + offX, anchorY + offY);
            if (flipX) ctx.scale(-1, 1);
            if (rot !== 0) ctx.rotate(rot);

            const dx = -f.cx * scale;
            const dy = -f.cy * scale;
            const dw = f.w * scale;
            const dh = f.h * scale;

            ctx.drawImage(
                neraAtlasImage,
                f.x, f.y, f.w, f.h,
                dx, dy, dw, dh
            );
            ctx.restore();
        };

        // ==================== 1. ANIMAÇÃO DE MORTE (12 QUADROS) ====================
        if (this.isDead) {
            const deathIndex = Math.min(11, Math.floor(this.deathTimer / 0.08));
            drawFrame('legs_death', deathIndex);

            // A partir do quadro 3, a arma cai e gira no chão ao lado
            if (deathIndex >= 3) {
                const gunFrames = NERA_FRAMES['fx_gun'];
                if (gunFrames && gunFrames.length > 0) {
                    const gunFrameIdx = Math.min(gunFrames.length - 1, Math.floor(this.deathTimer / 0.07));
                    const gunOffX = isRight ? 24 * NERA_SCALE : -24 * NERA_SCALE;
                    drawFrame('fx_gun', gunFrameIdx, gunOffX, 10 * NERA_SCALE, NERA_SCALE, !isRight);
                }
            }
            return;
        }

        // ==================== 2. GOLPE DE FACA CORPO A CORPO (11 QUADROS) ====================
        if (this.knifeAnimTimer > 0) {
            drawFrame('legs_melee', this.knifeFrame);
            return;
        }

        // ==================== 3. ESTADO AGACHADO (CORPO INTEIRO) ====================
        if (this.isCrouching) {
            if (this.shootAnimTimer > 0) {
                drawFrame('legs_crouch_shoot', this.shootFrame);
            } else if (this.vx !== 0) {
                drawFrame('legs_crouch_move', this.crouchFrame);
            } else {
                drawFrame('legs_crouch_idle', this.idleFrame);
            }
            return;
        }

        // ==================== 4. PERNAS (PULO, CORRIDA OU IDLE) ====================
        if (!this.isGrounded) {
            let jumpIdx = 0;
            if (this.vy < -200) jumpIdx = 0;      // Subindo rápido
            else if (this.vy <= 100) jumpIdx = 1; // Ponto ápice do pulo
            else jumpIdx = 2;                     // Queda livre
            drawFrame('legs_jump', jumpIdx);
        } else if (this.vx !== 0) {
            drawFrame('legs_run', this.runFrame);
        } else {
            drawFrame('legs_idle', 0);
        }

        // ==================== 5. TRONCO MODULAR INDEPENDENTE ====================
        const isShooting = this.shootAnimTimer > 0;
        const isRunning = this.vx !== 0 && this.isGrounded;
        const isAimUp = this.aimDirection === 'UP' || this.aimDirection === 'UP_RIGHT' || this.aimDirection === 'UP_LEFT';
        const isAimDown = this.aimDirection === 'DOWN' && !this.isGrounded;

        // Conforme manual de Nera: ao correr e atirar, elevar tronco em 1 pixel
        const runTorsoOffsetY = (isRunning && isShooting) ? -1 * NERA_SCALE : 0;

        if (isAimDown) {
            // No ar atirando para baixo: rotaciona tronco de tiro em 90 graus
            const rotAngle = isRight ? Math.PI / 2 : -Math.PI / 2;
            drawFrame('torso_shoot', this.shootFrame, 0, 4 * NERA_SCALE, NERA_SCALE, !isRight, rotAngle);
        } else if (isAimUp) {
            if (isShooting) {
                drawFrame('torso_shoot_up', this.shootFrame, 0, runTorsoOffsetY);
            } else {
                drawFrame('torso_look_up', this.idleFrame, 0, runTorsoOffsetY);
            }
        } else if (isShooting) {
            drawFrame('torso_shoot', this.shootFrame, 0, runTorsoOffsetY);
        } else if (isRunning) {
            drawFrame('torso_run', this.runFrame);
        } else {
            drawFrame('torso_idle', this.idleFrame);
        }

        // ==================== 6. BRILHO DE ENERGIA DA ARMA ATIVA ====================
        if (isShooting) {
            const colorMap = { PISTOL: '#00f0ff', HMG: '#ffb703', SHOTGUN: '#ff0055', BAZOOKA: '#ff4800' };
            const glowColor = colorMap[this.currentWeaponKey] || '#00f0ff';

            let muzzleLocalX = isRight ? 26 * NERA_SCALE : -26 * NERA_SCALE;
            let muzzleLocalY = -2 * NERA_SCALE;

            if (isAimUp) {
                muzzleLocalX = isRight ? 4 * NERA_SCALE : -4 * NERA_SCALE;
                muzzleLocalY = -28 * NERA_SCALE;
            } else if (isAimDown) {
                muzzleLocalX = 0;
                muzzleLocalY = 28 * NERA_SCALE;
            }

            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(anchorX + muzzleLocalX, anchorY + muzzleLocalY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawFallbackPlayer(ctx, renderX, isRight) {
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(renderX + 10, this.y + 10, 18, 18);
        ctx.fillStyle = '#2a9d8f';
        ctx.fillRect(renderX + 6, this.y + 28, 26, 20);
        ctx.fillStyle = '#e76f51';
        ctx.fillRect(renderX + 8, this.y + 48, 22, 18);
    }
}