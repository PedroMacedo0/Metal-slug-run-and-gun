/**
 * Player - Nera (Soldier Heroine - Metal Slug Style)
 * Estende a classe base Entidade (Herança & Polimorfismo)
 */
const neraAtlasImage = new Image();
neraAtlasImage.src = 'assets/nera_atlas.png';
const NERA_SCALE = 1.45;

class Player extends Entidade {
    constructor(x, y) {
        // Herança: Inicializa a classe base com a posição, dimensões e HP da protagonista
        super(x, y, 38, 66, 10);

        this.prevY = y;
        this.heightStand = 66;
        this.heightCrouch = 38;
        this.currentHeight = this.heightStand;

        this.moveSpeed = 350;
        this.crouchMoveSpeed = 160;
        this.jumpImpulse = -680;
        this.aimDirection = 'RIGHT';
        this.score = 0;

        this.currentWeaponKey = 'PISTOL';
        this.weapon = WEAPONS.PISTOL;
        this.fireTimer = 0;

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

    // Polimorfismo: A protagonista sempre sofre dano fixo de 1 ponto e tem explosão específica
    takeDamage(amount = 1, direction = 'RIGHT', isSplash = false) {
        if (this.isDead) return;
        super.takeDamage(1, direction, isSplash);
        vfx.addExplosion(this.x + 18, this.y + 30, 8);
    }

    // Polimorfismo: Morte cinematográfica com timers de animação da Nera
    die() {
        if (!this.isDead) {
            super.die();
            this.deathTimer = 0;
            if (typeof sound !== 'undefined' && sound.playDeath) {
                sound.playDeath();
            }
        }
    }

    // Sobrescrita necessária porque a hitbox do jogador muda quando ele se agacha
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.currentHeight
        };
    }

    crouch() {
        if (!this.isCrouching) {
            this.isCrouching = true;
            this.y += (this.heightStand - this.heightCrouch);
            this.currentHeight = this.heightCrouch;
            this.prevY = this.y;
        }
    }

    uncrouch() {
        if (this.isCrouching) {
            this.isCrouching = false;
            this.y -= (this.heightStand - this.heightCrouch);
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
            if (typeof sound !== 'undefined' && sound.playItem) sound.playItem();
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

        if (this.animTimer >= 0.08) {
            this.animTimer = 0;
            this.runFrame = (this.runFrame + 1) % 8;
            this.crouchFrame = (this.crouchFrame + 1) % 6;
        }

        if (this.idleTimer >= 0.18) {
            this.idleTimer = 0;
            this.idleFrame = (this.idleFrame + 1) % 4;
        }

        if (this.shootAnimTimer > 0) {
            this.shootAnimTimer -= dt;
            this.shootFrame = (this.shootFrame + 1) % 4;
        }

        if (this.knifeAnimTimer > 0) {
            this.knifeAnimTimer -= dt;
            this.knifeFrame = Math.min(10, Math.floor((0.44 - this.knifeAnimTimer) / 0.04));
        }

        if (this.vx !== 0 && this.isGrounded) {
            this.dustTimer += dt;
            if (this.dustTimer >= 0.15) {
                this.dustTimer = 0;
                vfx.addDust(this.x + (this.facingDirection === 'RIGHT' ? 5 : 30), this.y + this.currentHeight);
            }
        }

        const wantsToCrouch = input.isDownKey();

        if (this.isGrounded && wantsToCrouch) {
            this.crouch();
        } else {
            this.uncrouch();
        }

        this.vx = 0;
        const currentSpeed = this.isCrouching ? this.crouchMoveSpeed : this.moveSpeed;

        if (input.isLeft()) {
            this.vx = -currentSpeed;
            this.facingDirection = 'LEFT';
        } else if (input.isRight()) {
            this.vx = currentSpeed;
            this.facingDirection = 'RIGHT';
        }

        if (input.isJumpPressed() && this.isGrounded) {
            this.uncrouch();
            this.vy = this.jumpImpulse;
            this.isGrounded = false;
            if (typeof sound !== 'undefined' && sound.playJump) sound.playJump();
            vfx.addDust(this.x + 18, this.y + this.currentHeight);
        }

        this.updateAimDirection();

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x < 0) this.x = 0;
        if (this.x > 3560) this.x = 3560;

        const canShoot = this.weapon.automatic ? input.isDown('KeyJ') || input.isDown('j') || input.isDown('KeyZ') || input.isDown('z') : input.isShootPressed();

        if (canShoot && this.fireTimer >= this.weapon.fireRate) {
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
        if (typeof sound !== 'undefined' && sound.playShotgun) sound.playShotgun();
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

        let originX = this.x + (isRight ? 38 : 0);
        let originY = this.y + (this.isCrouching ? 20 : 25);

        if (this.aimDirection === 'UP' || this.aimDirection === 'UP_RIGHT' || this.aimDirection === 'UP_LEFT') {
            originX = this.x + (isRight ? 24 : 14);
            originY = this.y - 14;
        } else if (this.aimDirection === 'DOWN' && !this.isGrounded) {
            originX = this.x + 19;
            originY = this.y + this.currentHeight + 8;
        }

        this.shootAnimTimer = 0.22;
        this.shootFrame = 0;

        if (typeof sound !== 'undefined') {
            switch (this.currentWeaponKey) {
                case 'PISTOL': if (sound.playPistol) sound.playPistol(); break;
                case 'HMG': if (sound.playHMG) sound.playHMG(); break;
                case 'SHOTGUN': if (sound.playShotgun) sound.playShotgun(); vfx.addScreenShake(6); break;
                case 'BAZOOKA': if (sound.playBazooka) sound.playBazooka(); vfx.addScreenShake(8); break;
            }
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

        if (neraAtlasImage.complete && neraAtlasImage.naturalWidth > 0 && typeof NERA_FRAMES !== 'undefined') {
            this.drawNeraSprite(ctx, renderX, isRight);
        } else {
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

        if (this.isDead) {
            const deathIndex = Math.min(11, Math.floor(this.deathTimer / 0.08));
            drawFrame('legs_death', deathIndex);

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

        if (this.knifeAnimTimer > 0) {
            drawFrame('legs_melee', this.knifeFrame);
            return;
        }

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

        if (!this.isGrounded) {
            let jumpIdx = 0;
            if (this.vy < -200) jumpIdx = 0;
            else if (this.vy <= 100) jumpIdx = 1;
            else jumpIdx = 2;
            drawFrame('legs_jump', jumpIdx);
        } else if (this.vx !== 0) {
            drawFrame('legs_run', this.runFrame);
        } else {
            drawFrame('legs_idle', 0);
        }

        const isShooting = this.shootAnimTimer > 0;
        const isRunning = this.vx !== 0 && this.isGrounded;
        const isAimUp = this.aimDirection === 'UP' || this.aimDirection === 'UP_RIGHT' || this.aimDirection === 'UP_LEFT';
        const isAimDown = this.aimDirection === 'DOWN' && !this.isGrounded;

        const runTorsoOffsetY = (isRunning && isShooting) ? -1 * NERA_SCALE : 0;

        if (isAimDown) {
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