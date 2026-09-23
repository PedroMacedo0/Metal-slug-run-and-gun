/**
 * Medic NPC - Rumi Aikawa (Metal Slug Supply Girl / Combat Medic)
 * Aparece 1 por fase carregando a mochila médica militar de suprimentos.
 * Ao ser atingida/morrer, tropeça, derruba sua mochila e solta um Kit Médico
 * de Primeiros Socorros que recupera 30% da vida máxima do jogador (+30% HP).
 */

const rumiImage = new Image();
rumiImage.src = 'assets/rumi_sheet.png';

const RUMI_FRAMES = {
    // 1. Caminhada com Mochila Gigante (16 quadros)
    WALK: [
        { x: 5, y: 7, w: 37, h: 35 },
        { x: 45, y: 6, w: 36, h: 37 },
        { x: 84, y: 5, w: 35, h: 38 },
        { x: 122, y: 4, w: 38, h: 39 },
        { x: 163, y: 4, w: 43, h: 38 },
        { x: 209, y: 3, w: 43, h: 39 },
        { x: 255, y: 4, w: 46, h: 38 },
        { x: 304, y: 6, w: 38, h: 36 },
        { x: 345, y: 7, w: 36, h: 35 },
        { x: 384, y: 7, w: 36, h: 35 },
        { x: 423, y: 6, w: 38, h: 36 },
        { x: 464, y: 5, w: 40, h: 37 },
        { x: 507, y: 5, w: 44, h: 37 },
        { x: 5, y: 46, w: 45, h: 38 },
        { x: 53, y: 47, w: 43, h: 36 },
        { x: 99, y: 47, w: 38, h: 37 }
    ],
    // 2. Queda e Derrubada da Mochila (11 quadros)
    FALL: [
        { x: 5, y: 172, w: 45, h: 36 },
        { x: 53, y: 172, w: 48, h: 33 },
        { x: 104, y: 181, w: 51, h: 28 },
        { x: 158, y: 181, w: 50, h: 27 },
        { x: 211, y: 178, w: 46, h: 31 },
        { x: 260, y: 178, w: 46, h: 31 },
        { x: 309, y: 179, w: 47, h: 30 },
        { x: 359, y: 181, w: 48, h: 28 },
        { x: 410, y: 181, w: 44, h: 27 },
        { x: 457, y: 179, w: 41, h: 29 },
        { x: 501, y: 176, w: 36, h: 32 }
    ],
    // 3. Fuga Desesperada sem Mochila (9 quadros)
    FLEE: [
        { x: 5, y: 260, w: 36, h: 36 },
        { x: 44, y: 258, w: 46, h: 36 },
        { x: 93, y: 259, w: 46, h: 37 },
        { x: 142, y: 257, w: 48, h: 38 },
        { x: 193, y: 257, w: 47, h: 37 },
        { x: 243, y: 258, w: 46, h: 33 },
        { x: 292, y: 259, w: 46, h: 36 },
        { x: 341, y: 257, w: 48, h: 38 },
        { x: 392, y: 257, w: 47, h: 39 }
    ]
};

class MedicNPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.minX = x - 80;
        this.maxX = x + 160;

        this.width = 44;
        this.height = 58;
        this.scale = 1.6;

        this.hp = 1;
        this.maxHp = 1;
        this.isDead = false;
        this.state = 'WALKING'; // 'WALKING', 'FALLING', 'FLEEING'

        this.vx = 45;
        this.facingDirection = 'RIGHT';

        this.animTimer = 0;
        this.walkFrame = 0;
        this.fallFrame = 0;
        this.fleeFrame = 0;

        this.droppedItem = null;
    }

    getHitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    takeDamage(amount = 1, attackerX = null) {
        if (this.isDead) return;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.die(attackerX);
        }
    }

    die(attackerX = null) {
        if (this.isDead) return;
        this.isDead = true;
        this.hp = 0;
        this.state = 'FALLING';
        this.animTimer = 0;
        this.fallFrame = 0;
        this.vx = 0;

        // Se atacada pela esquerda, corre para a direita; se atacada pela direita ou padrão, corre para a esquerda
        if (attackerX !== null) {
            this.escapeDir = (attackerX < this.x) ? 'RIGHT' : 'LEFT';
        } else {
            this.escapeDir = 'LEFT';
        }

        // Solta o Kit Médico de Primeiros Socorros (+30% HP)
        this.droppedItem = new SupplyBox(this.x + 10, this.y + 10, 'MEDKIT');

        if (typeof vfx !== 'undefined') {
            vfx.addFloatingText('FIRST AID KIT! +30% HP', this.x - 40, this.y - 25, '#00ff88');
            vfx.addExplosion(this.x, this.y + 25, 12);
        }
        if (typeof sound !== 'undefined' && sound.playItem) {
            sound.playItem();
        }
    }

    update(dt, platforms = []) {
        this.animTimer += dt;

        // Atualiza o Kit Médico se ainda não foi coletado
        if (this.droppedItem) {
            this.droppedItem.update(dt, this.y + this.height - 24);
        }

        if (this.state === 'WALKING') {
            // Ciclo de caminhada carregando a pesada mochila
            if (this.animTimer >= 0.08) {
                this.animTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % RUMI_FRAMES.WALK.length;
            }

            this.x += this.vx * dt;
            if (this.x > this.maxX) {
                this.x = this.maxX;
                this.vx = -45;
                this.facingDirection = 'LEFT';
            } else if (this.x < this.minX) {
                this.x = this.minX;
                this.vx = 45;
                this.facingDirection = 'RIGHT';
            }
        } else if (this.state === 'FALLING') {
            // Animação de tropeço, mochila escorregando e queda
            if (this.animTimer >= 0.09) {
                this.animTimer = 0;
                this.fallFrame++;
                if (this.fallFrame >= RUMI_FRAMES.FALL.length) {
                    this.state = 'FLEEING';
                    this.facingDirection = this.escapeDir || 'LEFT';
                    this.vx = (this.facingDirection === 'RIGHT') ? 160 : -160;
                }
            }
        } else if (this.state === 'FLEEING') {
            // Fuga em desespero sem mochila
            if (this.animTimer >= 0.08) {
                this.animTimer = 0;
                this.fleeFrame = (this.fleeFrame + 1) % RUMI_FRAMES.FLEE.length;
            }
            this.x += this.vx * dt;
        }
    }

    draw(ctx, cameraX) {
        let frame = RUMI_FRAMES.WALK[0];

        if (this.state === 'WALKING') {
            frame = RUMI_FRAMES.WALK[this.walkFrame] || RUMI_FRAMES.WALK[0];
        } else if (this.state === 'FALLING') {
            const idx = Math.min(RUMI_FRAMES.FALL.length - 1, this.fallFrame);
            frame = RUMI_FRAMES.FALL[idx];
        } else if (this.state === 'FLEEING') {
            frame = RUMI_FRAMES.FLEE[this.fleeFrame] || RUMI_FRAMES.FLEE[0];
        }

        const drawW = frame.w * this.scale;
        const drawH = frame.h * this.scale;
        const groundY = this.y + this.height;
        const drawX = Math.round(this.x - cameraX - drawW / 2);
        const drawY = Math.round(groundY - drawH);

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Sombra suave de solo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(drawX + drawW / 2, groundY + 1, drawW * 0.35, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (rumiImage.complete && rumiImage.naturalWidth > 0) {
            // No sprite sheet rumi_sheet.png:
            // - Os frames de WALK (linhas 1 e 2) e FALL (linha 3) olham nativamente para a DIREITA (RIGHT).
            // - Os frames de FLEE (linha 5) olham nativamente para a ESQUERDA (LEFT).
            let shouldFlip = false;
            if (this.state === 'FLEEING') {
                // FLEE já olha nativamente para a ESQUERDA: se for para a DIREITA, flipa horizontalmente.
                shouldFlip = (this.facingDirection === 'RIGHT');
            } else {
                // WALK e FALL olham para a DIREITA: se for para a ESQUERDA, flipa horizontalmente.
                shouldFlip = (this.facingDirection === 'LEFT');
            }

            if (shouldFlip) {
                ctx.translate(drawX + drawW, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(rumiImage, frame.x, frame.y, frame.w, frame.h, 0, 0, drawW, drawH);
            } else {
                ctx.drawImage(rumiImage, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
            }
        } else {
            // Fallback procedimental
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(drawX, drawY, drawW, drawH);
        }

        // Tag indicativa da Médica enquanto estiver ativa
        if (!this.isDead && this.state === 'WALKING') {
            ctx.fillStyle = 'rgba(10, 20, 30, 0.75)';
            ctx.fillRect(drawX + drawW / 2 - 28, drawY - 18, 56, 12);
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 1;
            ctx.strokeRect(drawX + drawW / 2 - 28, drawY - 18, 56, 12);

            ctx.textAlign = 'center';
            ctx.font = '900 6.5px "Press Start 2P", monospace';
            ctx.fillStyle = '#00ff88';
            ctx.fillText('+ MEDIC', drawX + drawW / 2, drawY - 9);
        }

        ctx.restore();

        // Desenha o Kit Médico se existir no solo
        if (this.droppedItem) {
            this.droppedItem.draw(ctx, cameraX);
        }
    }
}
