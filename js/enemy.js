/**
 * Enemy & Boss System - Inimigos Rebeldes & Chefes Detalhados (Visual Overhaul)
 */

const heliSpriteSheet = new Image();
heliSpriteSheet.src = 'assets/heli_sheet.png';

const tankSpriteSheet = new Image();
tankSpriteSheet.src = 'assets/boss_tank.png';

const BOSS_TANK_MOVE_FRAMES = [
    { x: 28, y: 0, w: 41, h: 35 }, { x: 69, y: 0, w: 41, h: 35 },
    { x: 111, y: 0, w: 41, h: 35 }, { x: 152, y: 0, w: 41, h: 35 },
    { x: 193, y: 0, w: 41, h: 35 }, { x: 234, y: 0, w: 40, h: 35 },
    { x: 275, y: 0, w: 41, h: 35 }, { x: 316, y: 0, w: 41, h: 35 }
];

const BOSS_TANK_FIRE_FRAMES = [
    { x: 28, y: 105, w: 41, h: 35 }, { x: 69, y: 105, w: 41, h: 35 },
    { x: 111, y: 105, w: 41, h: 35 }, { x: 152, y: 105, w: 41, h: 35 },
    { x: 193, y: 105, w: 41, h: 35 }, { x: 234, y: 105, w: 40, h: 35 },
    { x: 275, y: 105, w: 41, h: 35 }, { x: 316, y: 105, w: 41, h: 35 }
];

const BOSS_TANK_DEAD_FRAME = { x: 28, y: 350, w: 41, h: 38 };

const soldierSpriteSheet = new Image();
soldierSpriteSheet.src = 'assets/enemy_soldier.png';

const sniperSpriteSheet = new Image();
sniperSpriteSheet.src = 'assets/enemy_sniper.png';

const SNIPER_SPRITES = {
    IDLE: [{ x: 12, y: 8, w: 40, h: 38 }, { x: 55, y: 8, w: 40, h: 38 }, { x: 98, y: 9, w: 39, h: 37 }, { x: 140, y: 8, w: 40, h: 38 }],
    RUN: [{ x: 12, y: 49, w: 34, h: 37 }, { x: 49, y: 49, w: 37, h: 37 }, { x: 89, y: 50, w: 42, h: 31 }, { x: 134, y: 51, w: 42, h: 33 }, { x: 179, y: 50, w: 37, h: 35 }, { x: 219, y: 49, w: 35, h: 37 }, { x: 257, y: 49, w: 34, h: 37 }, { x: 294, y: 49, w: 38, h: 36 }, { x: 335, y: 50, w: 40, h: 30 }, { x: 378, y: 51, w: 38, h: 32 }, { x: 419, y: 50, w: 37, h: 35 }, { x: 459, y: 49, w: 35, h: 37 }],
    AIM: [{ x: 12, y: 180, w: 47, h: 34 }, { x: 62, y: 186, w: 47, h: 28 }, { x: 112, y: 188, w: 48, h: 26 }, { x: 163, y: 188, w: 43, h: 26 }],
    SHOOT: [{ x: 12, y: 446, w: 39, h: 38 }, { x: 54, y: 446, w: 38, h: 38 }, { x: 95, y: 447, w: 43, h: 37 }, { x: 141, y: 449, w: 46, h: 35 }, { x: 190, y: 449, w: 46, h: 35 }],
    DEAD: { x: 261, y: 850, w: 39, h: 11 }
};

const SOLDIER_SPRITES = {
    IDLE: { x: 38, y: 6, w: 23, h: 26 },
    RUN: [{ x: 5, y: 37, w: 25, h: 27 }, { x: 39, y: 37, w: 24, h: 27 }, { x: 72, y: 37, w: 24, h: 27 }, { x: 102, y: 37, w: 26, h: 27 }, { x: 136, y: 37, w: 23, h: 27 }, { x: 169, y: 37, w: 23, h: 27 }],
    SHOOT: { x: 38, y: 70, w: 26, h: 26 },
    DEAD: { x: 0, y: 246, w: 32, h: 10 }
};

const R_SHOBU_FLYING_FRAMES = [
    { x: 7, y: 18, w: 89, h: 58 }, { x: 101, y: 18, w: 89, h: 58 }, { x: 194, y: 18, w: 89, h: 58 },
    { x: 288, y: 18, w: 89, h: 58 }, { x: 382, y: 18, w: 89, h: 58 }, { x: 477, y: 18, w: 89, h: 58 }, { x: 568, y: 18, w: 89, h: 58 }
];

const R_SHOBU_ROTOR_FRAMES = [
    { x: 10, y: 229, w: 86, h: 17 }, { x: 11, y: 257, w: 80, h: 12 }, { x: 10, y: 287, w: 80, h: 11 }, { x: 7, y: 312, w: 89, h: 7 }, { x: 10, y: 336, w: 86, h: 11 }
];
const HELI_FRAMES = R_SHOBU_FLYING_FRAMES;

const bossMechSpriteSheet = new Image();
bossMechSpriteSheet.src = 'assets/boss_mech.png';

const BOSS_MECH_FRAMES = [
    { x: 0, y: 0, w: 195, h: 189 }, { x: 195, y: 0, w: 195, h: 189 }, { x: 390, y: 0, w: 195, h: 189 }
];

const turretSpriteSheet = new Image();
turretSpriteSheet.src = 'assets/ceiling_turret.png';

const TURRET_SPRITES = {
    SCAN: [{ x: 0, y: 16, w: 65, h: 60 }, { x: 65, y: 16, w: 65, h: 60 }, { x: 130, y: 16, w: 65, h: 60 }, { x: 195, y: 16, w: 65, h: 60 }, { x: 260, y: 16, w: 65, h: 60 }],
    FIRE: { x: 0, y: 92, w: 65, h: 60 },
    DEAD: { x: 65, y: 168, w: 65, h: 60 }
};

const bazookaSpriteSheet = new Image();
bazookaSpriteSheet.src = 'assets/enemy_bazooka.png';

const BAZOOKA_SPRITES = {
    IDLE: [{ x: 3, y: 2, w: 27, h: 34 }, { x: 32, y: 2, w: 28, h: 34 }, { x: 62, y: 2, w: 29, h: 34 }, { x: 92, y: 2, w: 28, h: 34 }, { x: 121, y: 2, w: 29, h: 34 }, { x: 153, y: 2, w: 28, h: 34 }],
    RUN: [{ x: 2, y: 38, w: 31, h: 32 }, { x: 35, y: 38, w: 31, h: 32 }, { x: 68, y: 38, w: 30, h: 32 }, { x: 100, y: 38, w: 31, h: 32 }, { x: 133, y: 38, w: 30, h: 32 }, { x: 165, y: 38, w: 31, h: 32 }, { x: 198, y: 38, w: 31, h: 32 }, { x: 230, y: 38, w: 29, h: 32 }, { x: 261, y: 38, w: 28, h: 32 }, { x: 291, y: 38, w: 27, h: 32 }, { x: 320, y: 38, w: 28, h: 32 }],
    SHOOT: [{ x: 2, y: 215, w: 32, h: 43 }, { x: 37, y: 215, w: 30, h: 43 }, { x: 68, y: 215, w: 30, h: 43 }, { x: 102, y: 215, w: 25, h: 43 }, { x: 131, y: 215, w: 25, h: 43 }, { x: 157, y: 215, w: 25, h: 43 }, { x: 185, y: 215, w: 25, h: 43 }, { x: 210, y: 215, w: 26, h: 43 }, { x: 238, y: 215, w: 26, h: 43 }, { x: 267, y: 215, w: 26, h: 43 }, { x: 297, y: 215, w: 24, h: 43 }],
    DEAD: { x: 48, y: 405, w: 45, h: 17 }
};

class Enemy extends Entidade {
    constructor(x, y, type = 'INFANTRY') {
        // Herança: Inicializa com valores genéricos, que ajustamos no switch
        super(x, y, 36, 60, 3);
        this.type = type;
        this.facingDirection = 'LEFT';

        switch (type) {
            case 'BOSS_FINAL_MECH':
                this.width = 180; this.height = 190; this.hp = 250; break;
            case 'BOSS_GUNSHIP':
                this.width = 130; this.height = 85; this.hp = 140; break;
            case 'BOSS_TANK':
                this.width = 135; this.height = 105; this.hp = 80; break;
            case 'CEILING_TURRET':
                this.width = 65; this.height = 60; this.hp = 12; break;
            case 'ELITE_BAZOOKA':
                this.width = 44; this.height = 56; this.hp = 6; break;
            case 'SNIPER':
                this.width = 36; this.height = 55; this.hp = 4; break;
            case 'SHIELD_INFANTRY':
                this.width = 44; this.height = 60; this.hp = 8; break;
            default:
                this.width = 36; this.height = 60; this.hp = 3; break;
        }
        this.maxHp = this.hp;

        this.shootTimer = 0;
        this.shootInterval = (type === 'BOSS_FINAL_MECH') ? 0.8 :
            (type === 'BOSS_GUNSHIP' ? 1.0 :
                (type === 'BOSS_TANK' ? 1.5 :
                    (type === 'CEILING_TURRET' ? 1.8 : 2.0)));
        this.hitFlashTimer = 0;
        this.hoverAngle = 0;
        this.hasShield = (type === 'SHIELD_INFANTRY');
        this.shieldHp = 6;
        this.maxShieldHp = 6;

        this.animTimer = 0;
        this.animFrame = Math.floor(Math.random() * 6);
        this.shootAnimTimer = 0;
        this.mechPhase = 1;
        this.laserActive = false;
        this.laserTimer = 0;
        this.rotorAngle = 0;
        this.treadFrame = 0;
        this.tankFireTimer = 0;
        this.tankTreadFrame = 0;
        this.tankFireFrame = 0;
    }

    // Polimorfismo: Inimigos lidam com dano em área, quebra de escudos de aço e fases de chefes
    takeDamage(amount, bulletDirection = 'RIGHT', isSplash = false) {
        if (this.hasShield && !isSplash) {
            const isBulletFromFront = (this.facingDirection === 'LEFT' && bulletDirection === 'RIGHT') ||
                (this.facingDirection === 'RIGHT' && bulletDirection === 'LEFT');
            if (isBulletFromFront) {
                this.shieldHp -= amount;
                const shieldX = this.x + (this.facingDirection === 'LEFT' ? 0 : this.width);
                vfx.addMuzzleFlash(shieldX, this.y + 30, 0);

                if (this.shieldHp <= 0) {
                    this.hasShield = false;
                    vfx.addExplosion(this.x + 22, this.y + 30, 16);
                    vfx.addFloatingText('SHIELD BROKEN!', this.x - 10, this.y - 15, '#ff0055');
                    if (typeof sound !== 'undefined' && sound.playExplosion) sound.playExplosion();
                } else {
                    vfx.addFloatingText('SHIELD HIT!', this.x, this.y - 15, '#ffb703');
                }
                return;
            }
        }

        super.takeDamage(amount, bulletDirection, isSplash);

        if (this.type === 'BOSS_FINAL_MECH') {
            const hpRatio = this.hp / this.maxHp;
            if (hpRatio <= 0.35) this.mechPhase = 3;
            else if (hpRatio <= 0.70) this.mechPhase = 2;
        }

        if (!this.isDead) this.hitFlashTimer = 0.08;
    }

    // Polimorfismo: Chefes geram explosões massivas e letreiros de fim de fase
    die() {
        if (this.isDead) return;
        super.die();
        this.hitFlashTimer = 0;

        if (this.type === 'BOSS_FINAL_MECH') {
            vfx.addExplosion(this.x + 100, this.y + 70, 160);
            vfx.addFloatingText('VICTORY! ALL MISSIONS CLEAR!', this.x - 50, this.y - 40, '#00ff66');
            if (typeof sound !== 'undefined' && sound.playMissionComplete) sound.playMissionComplete();
        } else if (this.type === 'BOSS_GUNSHIP') {
            vfx.addExplosion(this.x + 80, this.y + 40, 95);
            vfx.addFloatingText('STAGE 2 CLEAR!', this.x + 20, this.y - 30, '#00ff66');
            if (typeof sound !== 'undefined' && sound.playMissionComplete) sound.playMissionComplete();
        } else if (this.type === 'BOSS_TANK') {
            vfx.addExplosion(this.x + 70, this.y + 45, 65);
            vfx.addFloatingText('STAGE 1 CLEAR!', this.x + 20, this.y - 30, '#00ff66');
            if (typeof sound !== 'undefined' && sound.playMissionComplete) sound.playMissionComplete();
        } else {
            vfx.addExplosion(this.x + 18, this.y + 30, 12);
            vfx.addFloatingText('+100 PTS', this.x, this.y - 10, '#ffb703');
        }
    }

    update(dt, playerX, playerY, bullets) {
        if (this.isDead) {
            this.deathTimer = (this.deathTimer || 0) + dt;
            this.hitFlashTimer = 0;
            if (this.type === 'BOSS_TANK' && this.deathTimer < 2.2 && Math.random() < 0.25) {
                vfx.addExplosion(this.x + Math.random() * this.width, this.y + Math.random() * this.height, 20 + Math.random() * 25);
            }
            return;
        }

        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= dt;
        }

        this.facingDirection = playerX > this.x ? 'RIGHT' : 'LEFT';
        this.rotorAngle += dt * 35;
        this.treadFrame = (this.treadFrame + dt * 10) % 4;
        const isRight = this.facingDirection === 'RIGHT';

        this.animTimer += dt;
        if (this.animTimer >= 0.1) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 6;
        }
        if (this.shootAnimTimer > 0) {
            this.shootAnimTimer -= dt;
        }

        if (this.type === 'BOSS_FINAL_MECH') {
            const targetX = playerX + 300;
            if (this.x > targetX + 40) this.x -= 40 * dt;
            else if (this.x < targetX - 40) this.x += 40 * dt;

            this.mechHoverTimer = (this.mechHoverTimer || 0) + dt * 9;
            this.mechFrame = Math.floor(this.mechHoverTimer) % BOSS_MECH_FRAMES.length;
            this.hoverAngle += dt * 2.2;
            this.y = 250 + Math.sin(this.hoverAngle) * 16;

            if (this.mechPhase === 2) {
                this.laserTimer += dt;
                this.laserActive = (Math.floor(this.laserTimer) % 3 === 0);
            }
        } else if (this.type === 'CEILING_TURRET') {
            this.turretScanTimer = (this.turretScanTimer || 0) + dt * 3.5;
            this.turretFrame = Math.floor(this.turretScanTimer) % TURRET_SPRITES.SCAN.length;
        } else if (this.type === 'BOSS_GUNSHIP') {
            this.heliFlyTimer = (this.heliFlyTimer || 0) + dt * 10;
            this.heliFlyFrame = Math.floor(this.heliFlyTimer) % R_SHOBU_FLYING_FRAMES.length;

            this.heliRotorTimer = (this.heliRotorTimer || 0) + dt * 32;
            this.rotorFrame = Math.floor(this.heliRotorTimer) % R_SHOBU_ROTOR_FRAMES.length;

            this.hoverAngle += dt * 1.8;
            this.y = 110 + Math.sin(this.hoverAngle) * 35;
            const targetX = playerX > this.x ? playerX - 140 : playerX + 140;
            this.vx = (targetX - this.x) * 1.2;
            this.x += this.vx * dt;
        } else if (this.type === 'BOSS_TANK') {
            const distToPlayer = Math.abs(playerX - this.x);
            if (distToPlayer > 220 && distToPlayer < 800) {
                this.vx = isRight ? 40 : -40;
                this.x += this.vx * dt;
                this.tankTreadFrame = (this.tankTreadFrame + dt * 10) % BOSS_TANK_MOVE_FRAMES.length;
            } else {
                this.vx = 0;
            }
            if (this.tankFireTimer > 0) {
                this.tankFireTimer -= dt;
                const totalFireTime = 0.5;
                const fireProgress = Math.min(BOSS_TANK_FIRE_FRAMES.length - 1, Math.floor(((totalFireTime - this.tankFireTimer) / totalFireTime) * BOSS_TANK_FIRE_FRAMES.length));
                this.tankFireFrame = fireProgress;
            }
            if (Math.random() < 0.25) {
                vfx.particles.push({
                    x: this.x + (isRight ? 10 : 130),
                    y: this.y + 20,
                    vx: isRight ? -30 : 30,
                    vy: -40 - Math.random() * 20,
                    color: 'rgba(90, 90, 90, 0.5)',
                    radius: 4 + Math.random() * 5,
                    life: 0.6,
                    maxLife: 0.6,
                    type: 'SMOKE'
                });
            }
        } else if (this.type === 'SHIELD_INFANTRY') {
            const distToPlayer = Math.abs(playerX - this.x);
            if (distToPlayer > 100 && distToPlayer < 650) {
                this.vx = isRight ? 55 : -55;
                this.x += this.vx * dt;
            } else {
                this.vx = 0;
            }
        } else if (this.type === 'ELITE_BAZOOKA' || this.type === 'INFANTRY') {
            const distToPlayer = Math.abs(playerX - this.x);
            if (distToPlayer > 180 && distToPlayer < 600) {
                this.vx = isRight ? 65 : -65;
                this.x += this.vx * dt;
            } else {
                this.vx = 0;
            }
        }

        this.shootTimer += dt;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.fireAtPlayer(playerX, playerY, bullets);
        }
    }

    fireAtPlayer(playerX, playerY, bullets) {
        const originX = this.x + (this.facingDirection === 'RIGHT' ? this.width : 0);
        const originY = this.y + (this.type === 'BOSS_FINAL_MECH' ? 70 : (this.type === 'BOSS_GUNSHIP' ? 45 : (this.type === 'BOSS_TANK' ? 30 : (this.type === 'CEILING_TURRET' ? 46 : 24))));

        const dx = playerX - originX;
        const dy = playerY - originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0 || dist > 850) return;

        if (this.type === 'BOSS_TANK') {
            this.tankFireTimer = 0.5;
            this.tankFireFrame = 0;
            const cannonTipX = this.facingDirection === 'RIGHT' ? this.x + this.width - 5 : this.x + 5;
            const cannonTipY = this.y + 40;
            const cdx = playerX - cannonTipX;
            const cdy = playerY - cannonTipY;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
            bullets.push(new Bullet(cannonTipX, cannonTipY, (cdx / cdist) * 520, (cdy / cdist) * 520, 'BAZOOKA', true));
            vfx.addMuzzleFlash(cannonTipX, cannonTipY, Math.atan2(cdy, cdx));
            vfx.addScreenShake(6);
            if (typeof sound !== 'undefined' && sound.playBazooka) sound.playBazooka();
            return;
        }

        if (this.type === 'BOSS_GUNSHIP') {
            const podX = originX + (Math.random() > 0.5 ? 25 : -25);
            const podY = originY + 20;
            if (Math.random() < 0.35) {
                bullets.push(new Bullet(podX, podY, (dx / dist) * 420, (dy / dist) * 420, 'BAZOOKA', true));
                if (typeof sound !== 'undefined' && sound.playBazooka) sound.playBazooka();
                vfx.addScreenShake(5);
            } else {
                bullets.push(new Bullet(podX, podY, (dx / dist) * 480, (dy / dist) * 480, 'ENEMY_PISTOL', true));
                if (typeof sound !== 'undefined' && sound.playHMG) sound.playHMG();
            }
            vfx.addMuzzleFlash(podX, podY, Math.atan2(dy, dx));
            return;
        }

        if (this.type === 'BOSS_FINAL_MECH') {
            if (this.mechPhase === 1) {
                bullets.push(new Bullet(originX, originY - 15, (dx / dist) * 550, (dy / dist) * 550, 'ENEMY_PISTOL', true));
                bullets.push(new Bullet(originX, originY + 25, (dx / dist) * 550, (dy / dist) * 550, 'ENEMY_PISTOL', true));
            } else if (this.mechPhase === 3) {
                for (let i = 0; i < 3; i++) {
                    const spawnX = playerX + (Math.random() - 0.5) * 400;
                    bullets.push(new Bullet(spawnX, 40, 0, 450, 'BAZOOKA', true));
                }
            }
            vfx.addMuzzleFlash(originX, originY, Math.atan2(dy, dx));
            return;
        }

        let speed = 350;
        let bulletType = 'ENEMY_PISTOL';

        if (this.type === 'ELITE_BAZOOKA') { speed = 500; bulletType = 'BAZOOKA'; if (typeof sound !== 'undefined' && sound.playBazooka) sound.playBazooka(); vfx.addScreenShake(4); this.shootAnimTimer = 0.28; }
        else if (this.type === 'SNIPER') { speed = 750; bulletType = 'SNIPER_ROUND'; if (typeof sound !== 'undefined' && sound.playPistol) sound.playPistol(); this.shootAnimTimer = 0.16; }
        else { if (typeof sound !== 'undefined' && sound.playPistol) sound.playPistol(); this.shootAnimTimer = 0.16; }

        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;

        bullets.push(new Bullet(originX, originY, vx, vy, bulletType, true));
        vfx.addMuzzleFlash(originX, originY, Math.atan2(dy, dx));
    }

    draw(ctx, cameraX) {
        if (this.isDead && (this.deathTimer || 0) > 2.5) return;
        if (this.isDead && (this.type === 'BOSS_GUNSHIP' || this.type === 'BOSS_FINAL_MECH')) {
            return;
        }

        const renderX = this.x - cameraX;

        ctx.save();

        if (this.hitFlashTimer > 0 && !this.isDead) {
            ctx.filter = 'brightness(1.8)';
        }

        if (this.isDead && (this.deathTimer || 0) > 2.0) {
            ctx.globalAlpha = Math.max(0, (2.5 - this.deathTimer) / 0.5);
        }

        if (this.type === 'BOSS_FINAL_MECH') {
            this.drawBossFinalMech(ctx, renderX);
        } else if (this.type === 'BOSS_GUNSHIP') {
            this.drawBossGunship(ctx, renderX);
        } else if (this.type === 'BOSS_TANK') {
            this.drawBossTank(ctx, renderX);
        } else if (this.type === 'SHIELD_INFANTRY') {
            this.drawShieldInfantry(ctx, renderX);
        } else if (this.type === 'ELITE_BAZOOKA') {
            this.drawEliteBazooka(ctx, renderX);
        } else if (this.type === 'SNIPER') {
            this.drawSniper(ctx, renderX);
        } else if (this.type === 'CEILING_TURRET') {
            this.drawCeilingTurret(ctx, renderX);
        } else {
            this.drawInfantry(ctx, renderX);
        }

        ctx.restore();
    }

    drawBossTank(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (tankSpriteSheet.complete && tankSpriteSheet.naturalWidth > 0) {
            let frame = BOSS_TANK_MOVE_FRAMES[Math.floor(this.tankTreadFrame) % BOSS_TANK_MOVE_FRAMES.length];

            if (this.isDead) {
                frame = BOSS_TANK_DEAD_FRAME;
            } else if (this.tankFireTimer > 0) {
                frame = BOSS_TANK_FIRE_FRAMES[this.tankFireFrame % BOSS_TANK_FIRE_FRAMES.length] || BOSS_TANK_FIRE_FRAMES[0];
            }

            const scale = 3.2;
            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const drawX = renderX + (this.width - drawW) / 2;
            const drawY = this.y + (this.height - drawH);

            const centerX = drawX + drawW / 2;
            const centerY = drawY + drawH / 2;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(centerX, this.y + this.height - 4, drawW * 0.46, 9, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.translate(centerX, centerY);

            if (isRight) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                tankSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            ctx.restore();
        } else {
            ctx.fillStyle = '#2d6a4f';
            ctx.fillRect(renderX, this.y, this.width, this.height);
            ctx.restore();
        }

        if (this.isDead) return;

        const hpPercent = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(renderX - 10, this.y - 28, 155, 12);
        ctx.fillStyle = (hpPercent <= 0.3) ? '#ff0055' : (hpPercent <= 0.6 ? '#ffb703' : '#00ff66');
        ctx.fillRect(renderX - 8, this.y - 26, 151 * hpPercent, 8);
        ctx.fillStyle = '#ffcc00';
        ctx.font = '900 8px "Press Start 2P", monospace';
        ctx.fillText('STAGE 1 BOSS: REBEL TANK GIRIDA-O', renderX - 10, this.y - 32);
    }

    drawShieldInfantry(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';

        this.drawInfantryBody(ctx, renderX);

        if (this.hasShield) {
            ctx.fillStyle = '#343a40';
            const shieldX = isRight ? renderX + 22 : renderX - 4;
            ctx.fillRect(shieldX, this.y + 10, 24, 48);
            ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 3;
            ctx.strokeRect(shieldX, this.y + 10, 24, 48);

            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(shieldX + 4, this.y + 18, 16, 5);

            ctx.fillStyle = '#ffb703';
            ctx.fillRect(shieldX + 2, this.y + 35, 20, 4);
            ctx.fillRect(shieldX + 2, this.y + 45, 20, 4);

            if (this.shieldHp < this.maxShieldHp) {
                const shieldRatio = Math.max(0, this.shieldHp / this.maxShieldHp);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(shieldX - 2, this.y + 2, 28, 5);
                ctx.fillStyle = '#00f0ff';
                ctx.fillRect(shieldX - 1, this.y + 3, 26 * shieldRatio, 3);
            }
        }
    }

    drawEliteBazooka(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';

        if (bazookaSpriteSheet.complete && bazookaSpriteSheet.naturalWidth > 0) {
            let frame = BAZOOKA_SPRITES.IDLE[this.animFrame % BAZOOKA_SPRITES.IDLE.length];
            if (this.isDead) {
                frame = BAZOOKA_SPRITES.DEAD;
            } else if (this.shootAnimTimer > 0) {
                const totalShootDuration = 0.28;
                const shootIdx = Math.min(BAZOOKA_SPRITES.SHOOT.length - 1, Math.floor((totalShootDuration - this.shootAnimTimer) / (totalShootDuration / BAZOOKA_SPRITES.SHOOT.length)));
                frame = BAZOOKA_SPRITES.SHOOT[shootIdx];
            } else if (this.vx !== 0) {
                frame = BAZOOKA_SPRITES.RUN[this.animFrame % BAZOOKA_SPRITES.RUN.length];
            }

            const scale = 1.65;
            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const drawX = renderX + (this.width - drawW) / 2;
            const drawY = this.y + (this.height - drawH);

            ctx.save();
            ctx.imageSmoothingEnabled = false;

            const centerX = drawX + drawW / 2;
            const centerY = drawY + drawH / 2;

            ctx.translate(centerX, centerY);
            if (isRight) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                bazookaSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            ctx.restore();
            return;
        }

        ctx.fillStyle = '#7209b7'; ctx.fillRect(renderX + 8, this.y, 22, 10);
        ctx.fillStyle = '#ffcc99'; ctx.fillRect(renderX + 8, this.y + 10, 20, 10);
        ctx.fillStyle = '#3a0ca3'; ctx.fillRect(renderX + 4, this.y + 20, 28, 24);
        ctx.fillStyle = '#10002b'; ctx.fillRect(renderX + 6, this.y + 44, 24, 16);
    }

    drawSniper(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';

        if (sniperSpriteSheet.complete && sniperSpriteSheet.naturalWidth > 0) {
            let frame = SNIPER_SPRITES.IDLE[this.animFrame % SNIPER_SPRITES.IDLE.length];
            const isAiming = (this.shootTimer > this.shootInterval - 0.7);

            if (this.isDead) {
                frame = SNIPER_SPRITES.DEAD;
            } else if (this.shootAnimTimer > 0) {
                const shootIdx = Math.min(SNIPER_SPRITES.SHOOT.length - 1, Math.floor((0.16 - this.shootAnimTimer) / 0.035));
                frame = SNIPER_SPRITES.SHOOT[shootIdx];
            } else if (isAiming) {
                const aimIdx = Math.floor((this.shootTimer - (this.shootInterval - 0.7)) * 5) % SNIPER_SPRITES.AIM.length;
                frame = SNIPER_SPRITES.AIM[aimIdx];
            } else if (this.vx !== 0) {
                frame = SNIPER_SPRITES.RUN[this.animFrame % SNIPER_SPRITES.RUN.length];
            }

            const scale = 1.45;
            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const drawX = renderX + (this.width - drawW) / 2;
            const drawY = this.y + (this.height - drawH);

            ctx.save();
            ctx.imageSmoothingEnabled = false;

            const centerX = drawX + drawW / 2;
            const centerY = drawY + drawH / 2;

            ctx.translate(centerX, centerY);
            if (isRight) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                sniperSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            ctx.restore();

            if (!this.isDead && (isAiming || this.shootAnimTimer > 0)) {
                const laserOriginX = isRight ? renderX + this.width + 16 : renderX - 16;
                const laserOriginY = this.y + (isAiming ? 32 : 24);

                ctx.save();
                ctx.strokeStyle = this.shootAnimTimer > 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 0, 85, 0.85)';
                ctx.lineWidth = this.shootAnimTimer > 0 ? 3 : 1.5;
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(laserOriginX, laserOriginY);
                ctx.lineTo(isRight ? laserOriginX + 680 : laserOriginX - 680, laserOriginY);
                ctx.stroke();

                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.arc(laserOriginX, laserOriginY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            return;
        }

        ctx.fillStyle = '#1b4332';
        ctx.fillRect(renderX + 4, this.y + 4, 28, 50);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(renderX + 8, this.y + 8, 20, 20);
    }

    drawCeilingTurret(ctx, renderX) {
        if (turretSpriteSheet.complete && turretSpriteSheet.naturalWidth > 0) {
            let frame = TURRET_SPRITES.SCAN[this.turretFrame % TURRET_SPRITES.SCAN.length] || TURRET_SPRITES.SCAN[0];
            if (this.isDead) {
                frame = TURRET_SPRITES.DEAD;
            } else if (this.shootAnimTimer > 0) {
                frame = TURRET_SPRITES.FIRE;
            }

            const scale = 1.0;
            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const drawX = renderX + (this.width - drawW) / 2;
            const drawY = this.y;

            ctx.save();
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(
                turretSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                drawX, drawY, drawW, drawH
            );

            ctx.restore();
            return;
        }

        ctx.fillStyle = '#1e293b'; ctx.fillRect(renderX, this.y, 48, 12);
        ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(renderX + 24, this.y + 18, 16, 0, Math.PI * 2); ctx.fill();
    }

    drawInfantry(ctx, renderX) {
        this.drawInfantryBody(ctx, renderX);
    }

    drawInfantryBody(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';

        if (soldierSpriteSheet.complete && soldierSpriteSheet.naturalWidth > 0) {
            let frame = SOLDIER_SPRITES.IDLE;
            if (this.isDead) {
                frame = SOLDIER_SPRITES.DEAD;
            } else if (this.shootAnimTimer > 0) {
                frame = SOLDIER_SPRITES.SHOOT;
            } else if (this.vx !== 0) {
                frame = SOLDIER_SPRITES.RUN[this.animFrame % SOLDIER_SPRITES.RUN.length];
            }

            const scale = 2.3;
            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const drawX = renderX + (this.width - drawW) / 2;
            const drawY = this.y + (this.height - drawH);

            ctx.save();
            ctx.imageSmoothingEnabled = false;

            const centerX = drawX + drawW / 2;
            const centerY = drawY + drawH / 2;

            ctx.translate(centerX, centerY);
            if (!isRight) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                soldierSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            ctx.restore();
            return;
        }

        ctx.fillStyle = '#556b2f';
        ctx.fillRect(renderX + 6, this.y, 24, 14);
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(renderX + 8, this.y + 14, 20, 10);
        ctx.fillStyle = '#4b5320';
        ctx.fillRect(renderX + 4, this.y + 24, 28, 22);
        ctx.fillStyle = '#3b3c36';
        ctx.fillRect(renderX + 6, this.y + 46, 24, 14);
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(renderX + 18, this.y + 32);
        const gunTipX = isRight ? renderX + 38 : renderX - 2;
        ctx.lineTo(gunTipX, this.y + 32); ctx.stroke();
    }

    drawBossFinalMech(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (bossMechSpriteSheet.complete && bossMechSpriteSheet.naturalWidth > 0) {
            const frame = BOSS_MECH_FRAMES[this.mechFrame % BOSS_MECH_FRAMES.length] || BOSS_MECH_FRAMES[0];
            const scale = 1.0;

            const drawW = frame.w * scale;
            const drawH = frame.h * scale;

            const centerX = renderX + this.width / 2;
            const centerY = this.y + this.height / 2;

            ctx.translate(centerX, centerY);
            if (isRight) {
                ctx.scale(-1, 1);
            }

            if (this.mechPhase === 3 && Math.floor(Date.now() / 120) % 2 === 0) {
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 18;
            }

            ctx.drawImage(
                bossMechSpriteSheet,
                frame.x, frame.y, frame.w, frame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            if (this.mechPhase === 2 && this.laserActive) {
                const laserStartX = -40;
                const laserStartY = -10;
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 16;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.moveTo(laserStartX, laserStartY);
                ctx.lineTo(-600, 200);
                ctx.stroke();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(laserStartX, laserStartY);
                ctx.lineTo(-600, 200);
                ctx.stroke();
            }

            ctx.restore();
        } else {
            ctx.fillStyle = '#1e293b'; ctx.fillRect(renderX + 20, this.y, 160, 110);
            ctx.restore();
        }

        const hpPercent = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(renderX - 10, this.y - 32, 220, 14);
        ctx.fillStyle = (this.mechPhase === 3) ? '#ff0055' : (this.mechPhase === 2 ? '#ffb703' : '#00ff66');
        ctx.fillRect(renderX - 8, this.y - 30, 216 * hpPercent, 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 9px "Press Start 2P", monospace';
        ctx.fillText(`STAGE 3 BOSS: DRAGON NOSUKE MECH (PHASE ${this.mechPhase})`, renderX - 10, this.y - 38);
    }

    drawBossGunship(ctx, renderX) {
        const isRight = this.facingDirection === 'RIGHT';
        const centerX = renderX + this.width / 2;
        const centerY = this.y + this.height / 2;

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (heliSpriteSheet.complete && heliSpriteSheet.naturalWidth > 0) {
            const bodyFrame = R_SHOBU_FLYING_FRAMES[this.heliFlyFrame || 0] || R_SHOBU_FLYING_FRAMES[0];
            const rotorFrame = R_SHOBU_ROTOR_FRAMES[this.rotorFrame || 0] || R_SHOBU_ROTOR_FRAMES[0];

            const scale = 1.45;
            const drawW = bodyFrame.w * scale;
            const drawH = bodyFrame.h * scale;

            ctx.translate(centerX, centerY);

            if (isRight) {
                ctx.scale(-1, 1);
            }

            const targetTilt = this.vx > 10 ? -0.12 : (this.vx < -10 ? 0.12 : 0);
            ctx.rotate(targetTilt);

            ctx.drawImage(
                heliSpriteSheet,
                bodyFrame.x, bodyFrame.y, bodyFrame.w, bodyFrame.h,
                -drawW / 2, -drawH / 2, drawW, drawH
            );

            const rotorW = rotorFrame.w * scale * 1.15;
            const rotorH = rotorFrame.h * scale;
            const rotorMastOffX = 0;
            const rotorMastOffY = -drawH / 2 - 4;

            ctx.drawImage(
                heliSpriteSheet,
                rotorFrame.x, rotorFrame.y, rotorFrame.w, rotorFrame.h,
                rotorMastOffX - rotorW / 2, rotorMastOffY, rotorW, rotorH
            );
        } else {
            ctx.fillStyle = '#1c2321'; ctx.fillRect(renderX + 20, this.y, 120, 50);
            ctx.fillStyle = '#ff0055'; ctx.fillRect(renderX + 20, this.y + 10, 30, 25);
        }

        ctx.restore();

        const hpPercent = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(renderX - 5, this.y - 28, 140, 12);
        ctx.fillStyle = (hpPercent <= 0.3) ? '#ff0055' : (hpPercent <= 0.6 ? '#ffb703' : '#00ff66');
        ctx.fillRect(renderX - 3, this.y - 26, 136 * hpPercent, 8);
        ctx.fillStyle = '#ffcc00';
        ctx.font = '900 8px "Press Start 2P", monospace';
        ctx.fillText('STAGE 2 BOSS: R-SHOBU', renderX - 5, this.y - 32);
    }
}