/**
 * POW & Item Drop System (Metal Slug Prisioneiros de Guerra & Caixas de Suprimento)
 * Folha de sprites autêntica com ciclo ocioso amarrado, libertação, quebra de cordas e agradecimento.
 */

const POW_FRAMES = {
    // 1. Ciclo Ocioso Amarrado (Frames 0 a 4) - sentado no chão sob vigilância
    TIED: [
        { x: 5, y: 13, w: 30, h: 27 },
        { x: 38, y: 13, w: 31, h: 27 },
        { x: 72, y: 13, w: 36, h: 27 },
        { x: 111, y: 13, w: 37, h: 27 },
        { x: 151, y: 13, w: 37, h: 27 }
    ],
    // 2. Libertação e Comemoração (Frames 5 a 8) - cordas rompendo, de pé comemorando
    FREEING: [
        { x: 197, y: 11, w: 38, h: 29 }, // Frame 5: Cordas se soltam
        { x: 238, y: 9, w: 40, h: 31 },  // Frame 6: Rompimento total
        { x: 281, y: 7, w: 42, h: 33 },  // Frame 7: Levantando com fragmentos voando
        { x: 324, y: 5, w: 45, h: 35 }   // Frame 8: De pé comemorando / agradecendo
    ]
};

const POW_RUN_FRAMES = [
    { x: 7,   y: 5, w: 60, h: 60, b: 64 },
    { x: 67,  y: 2, w: 57, h: 63, b: 64 },
    { x: 129, y: 2, w: 48, h: 63, b: 64 },
    { x: 181, y: 2, w: 57, h: 60, b: 61 },
    { x: 243, y: 3, w: 63, h: 62, b: 64 },
    { x: 310, y: 2, w: 54, h: 63, b: 64 },
    { x: 369, y: 2, w: 54, h: 63, b: 64 },
    { x: 427, y: 2, w: 61, h: 58, b: 59 }
];

/**
 * Caixa Militar de Suprimentos / Armamento Dropada pelo POW
 */
class SupplyBox {
    constructor(x, y, weaponType = 'HMG') {
        this.x = x;
        this.y = y;
        this.vx = 45;
        this.vy = -140;
        this.width = 34;
        this.height = 28;
        this.weaponType = weaponType;
        this.isGrounded = false;
        this.lifeTime = 0;
    }

    getHitbox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    update(dt, groundY = 472) {
        this.lifeTime += dt;
        if (!this.isGrounded) {
            this.vy += 500 * dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            if (this.y >= groundY) {
                this.y = groundY;
                this.isGrounded = true;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }

    draw(ctx, cameraX) {
        const bob = this.isGrounded ? Math.sin(this.lifeTime * 5) * 3 : 0;
        const drawX = Math.round(this.x - cameraX);
        const drawY = Math.round(this.y + bob);

        ctx.save();

        // 1. Sombra projetada no solo
        if (this.isGrounded) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(drawX + this.width / 2, this.y + this.height + 2, this.width * 0.6, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Halo de Brilho Tático Dourado ou Verde Médico
        if (this.weaponType === 'MEDKIT') {
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 14;

            // Caixa Branca Médica com Cruz Vermelha
            const medGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
            medGrad.addColorStop(0, '#ffffff');
            medGrad.addColorStop(0.5, '#f1f5f9');
            medGrad.addColorStop(1, '#cbd5e1');
            ctx.fillStyle = medGrad;
            ctx.fillRect(drawX, drawY, this.width, this.height);

            // Borda Metálica Reforçada
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(drawX, drawY, this.width, this.height);

            // Rebites nos cantos
            ctx.fillStyle = '#64748b';
            ctx.fillRect(drawX + 2, drawY + 2, 3, 3);
            ctx.fillRect(drawX + this.width - 5, drawY + 2, 3, 3);
            ctx.fillRect(drawX + 2, drawY + this.height - 5, 3, 3);
            ctx.fillRect(drawX + this.width - 5, drawY + this.height - 5, 3, 3);

            // Cruz Vermelha Médica
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ff0033';
            const cx = drawX + this.width / 2;
            const cy = drawY + this.height / 2;
            ctx.fillRect(cx - 3, cy - 8, 6, 16);
            ctx.fillRect(cx - 8, cy - 3, 16, 6);

            // Indicador de Vida
            ctx.font = '900 7px "Press Start 2P", monospace';
            ctx.fillStyle = '#00ff88';
            ctx.textAlign = 'center';
            ctx.fillText('+30% HP', drawX + this.width / 2, drawY - 6);

            ctx.restore();
            return;
        }

        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 10;

        // 3. Corpo da Caixa Militar (Degradê de aço e reforço)
        const boxGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
        boxGrad.addColorStop(0, '#f9c74f');
        boxGrad.addColorStop(0.35, '#d48b00');
        boxGrad.addColorStop(1, '#854d0e');
        ctx.fillStyle = boxGrad;
        ctx.fillRect(drawX, drawY, this.width, this.height);

        // Borda de Aço
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(drawX, drawY, this.width, this.height);

        // Rebites nos cantos
        ctx.fillStyle = '#222';
        ctx.fillRect(drawX + 2, drawY + 2, 3, 3);
        ctx.fillRect(drawX + this.width - 5, drawY + 2, 3, 3);
        ctx.fillRect(drawX + 2, drawY + this.height - 5, 3, 3);
        ctx.fillRect(drawX + this.width - 5, drawY + this.height - 5, 3, 3);

        // Emblema Central da Arma
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#101626';
        ctx.fillRect(drawX + 6, drawY + 5, this.width - 12, this.height - 10);
        ctx.strokeStyle = '#f9c74f';
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX + 6, drawY + 5, this.width - 12, this.height - 10);

        // Letra do Tipo de Arma (H, S, R)
        ctx.textAlign = 'center';
        ctx.font = '900 11px "Press Start 2P", monospace';
        let code = 'H';
        let color = '#00f0ff';
        if (this.weaponType === 'SHOTGUN') {
            code = 'S';
            color = '#ff9e00';
        } else if (this.weaponType === 'BAZOOKA') {
            code = 'R';
            color = '#ff0055';
        }
        ctx.fillStyle = color;
        ctx.fillText(code, drawX + this.width / 2, drawY + 18);

        // Indicador flutuante acima da caixa
        ctx.font = '900 7px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffea00';
        ctx.fillText('ITEM', drawX + this.width / 2, drawY - 6);

        ctx.restore();
    }
}

class POW {
    constructor(x, y, weaponType = 'HMG') {
        this.x = x;
        this.y = y;
        this.width = 46;
        this.height = 45;
        this.scale = 1.6;
        this.weaponType = weaponType;
        
        this.state = 'TIED'; // 'TIED', 'FREEING', 'THANKING', 'ESCAPING'
        this.rescued = false;
        
        this.animTimer = 0;
        this.frameIndex = 0;
        this.freeingIndex = 0;
        this.thankTimer = 0;
        this.escapeSpeed = 160;
        this.escapeRunTimer = 0;
        this.escapeFrame = 0;
        this.isFlipped = false;
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

    rescue() {
        if (this.state === 'TIED') {
            this.state = 'FREEING';
            this.rescued = true;
            this.freeingIndex = 0;
            this.animTimer = 0;

            if (typeof sound !== 'undefined') {
                if (sound.playThankYou) sound.playThankYou();
                else if (sound.playRescue) sound.playRescue();
            }

            if (typeof vfx !== 'undefined') {
                vfx.addFloatingText('★ THANK YOU! ★', this.x, this.y - 20, '#00ff88');
                vfx.addExplosion(this.x, this.y + 20, 10);
            }
        }
    }

    update(dt, platforms = []) {
        this.animTimer += dt;

        // Atualiza a caixa de item se ainda não foi coletada
        if (this.droppedItem) {
            this.droppedItem.update(dt, this.y + this.height - 24);
        }

        if (this.state === 'TIED') {
            // Ciclo de respiração/vigilância do prisioneiro amarrado
            if (this.animTimer >= 0.22) {
                this.animTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % POW_FRAMES.TIED.length;
            }
        } else if (this.state === 'FREEING') {
            // Animação de rompimento das cordas e levantar
            if (this.animTimer >= 0.12) {
                this.animTimer = 0;
                this.freeingIndex++;

                if (this.freeingIndex >= POW_FRAMES.FREEING.length) {
                    this.freeingIndex = POW_FRAMES.FREEING.length - 1;
                    this.state = 'THANKING';
                    this.thankTimer = 1.6;

                    // Dropa o suprimento militar com arco físico
                    this.droppedItem = new SupplyBox(this.x + 12, this.y + 10, this.weaponType);
                }
            }
        } else if (this.state === 'THANKING') {
            // Segura pose de comemoração / agradecimento
            this.thankTimer -= dt;
            if (this.thankTimer <= 0) {
                this.state = 'ESCAPING';
            }
        } else if (this.state === 'ESCAPING') {
            // POW corre a todo vapor com os braços erguidos para escapar do campo de batalha
            this.escapeRunTimer += dt * 14;
            this.escapeFrame = Math.floor(this.escapeRunTimer) % 8;
            this.x -= this.escapeSpeed * dt;
            this.isFlipped = false;

            // Gravidade e queda suave ao passar da borda de plataformas elevadas
            let groundY = 500;
            const feetX = this.x;
            const currentFeetY = this.y + this.height;

            for (const p of platforms) {
                if (feetX >= p.x && feetX <= p.x + p.width && currentFeetY <= p.y + 6) {
                    if (p.y < groundY) {
                        groundY = p.y;
                    }
                }
            }

            if (currentFeetY < groundY) {
                this.escapeVy = (this.escapeVy || 0) + 750 * dt;
                this.y += this.escapeVy * dt;
                if (this.y + this.height >= groundY) {
                    this.y = groundY - this.height;
                    this.escapeVy = 0;
                }
            } else {
                this.y = groundY - this.height;
                this.escapeVy = 0;
            }
        }
    }

    draw(ctx, cameraX) {
        // Se estiver em modo ESCAPING, utiliza a folha dedicada de corrida com braços erguidos (8 quadros)
        if (this.state === 'ESCAPING') {
            if (POW.runImage && POW.runImage.complete && POW.runImage.naturalWidth > 0) {
                const frame = POW_RUN_FRAMES[this.escapeFrame % POW_RUN_FRAMES.length] || POW_RUN_FRAMES[0];
                const runScale = 0.95;
                const drawW = frame.w * runScale;
                const drawH = frame.h * runScale;
                const groundY = this.y + this.height;
                const baselineOffset = (64 - frame.b) * runScale;
                const drawX = Math.round(this.x - cameraX - drawW / 2);
                const drawY = Math.round(groundY - drawH - baselineOffset);

                ctx.save();
                ctx.imageSmoothingEnabled = false;

                // Sombra de solo dinâmica
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.beginPath();
                ctx.ellipse(drawX + drawW / 2, groundY + 1, drawW * 0.35, 4.5, 0, 0, Math.PI * 2);
                ctx.fill();

                if (this.isFlipped) {
                    ctx.translate(drawX + drawW, drawY);
                    ctx.scale(-1, 1);
                    ctx.drawImage(POW.runImage, frame.x, frame.y, frame.w, frame.h, 0, 0, drawW, drawH);
                } else {
                    ctx.drawImage(POW.runImage, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
                }

                ctx.restore();

                // Desenha a caixa de item se ainda existir
                if (this.droppedItem) {
                    this.droppedItem.draw(ctx, cameraX);
                }
                return;
            }
        }

        let frame = POW_FRAMES.TIED[0];

        if (this.state === 'TIED') {
            frame = POW_FRAMES.TIED[this.frameIndex] || POW_FRAMES.TIED[0];
        } else if (this.state === 'FREEING') {
            frame = POW_FRAMES.FREEING[this.freeingIndex] || POW_FRAMES.FREEING[0];
        } else {
            // 'THANKING' (Frame de pé comemorando/agradecendo)
            frame = POW_FRAMES.FREEING[3];
        }

        const drawW = frame.w * this.scale;
        const drawH = frame.h * this.scale;
        const groundY = this.y + this.height;
        const drawX = Math.round(this.x - cameraX - drawW / 2);
        const drawY = Math.round(groundY - drawH);

        ctx.save();

        // Sombra de solo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(drawX + drawW / 2, groundY + 1, drawW * 0.38, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (POW.image && POW.image.complete && POW.image.naturalWidth > 0) {
            if (this.isFlipped) {
                ctx.translate(drawX + drawW, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(POW.image, frame.x, frame.y, frame.w, frame.h, 0, 0, drawW, drawH);
            } else {
                ctx.drawImage(POW.image, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
            }
        } else {
            // Fallback procedimental caso a imagem ainda esteja carregando
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(drawX, drawY, drawW, drawH);
        }

        // Balão de agradecimento em modo THANKING
        if (this.state === 'THANKING') {
            ctx.fillStyle = '#060a12';
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 1.5;
            const bubbleX = drawX - 10;
            const bubbleY = drawY - 26;
            ctx.fillRect(bubbleX, bubbleY, drawW + 20, 18);
            ctx.strokeRect(bubbleX, bubbleY, drawW + 20, 18);

            ctx.textAlign = 'center';
            ctx.font = '900 8px "Press Start 2P", monospace';
            ctx.fillStyle = '#00ff88';
            ctx.fillText('THANK YOU!', bubbleX + (drawW + 20) / 2, bubbleY + 13);
        }

        ctx.restore();

        // Desenha a caixa de item se existir
        if (this.droppedItem) {
            this.droppedItem.draw(ctx, cameraX);
        }
    }
}

// Carregamento estático dos Sprite Sheets oficiais do POW
POW.image = new Image();
POW.image.src = 'assets/pow_sheet.png';

POW.runImage = new Image();
POW.runImage.src = 'assets/pow_run_sheet.png';
