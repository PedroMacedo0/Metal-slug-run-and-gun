/**
 * ParticleSystem - Gerenciador de VFX Avançado (VFX System)
 * Explosões volumétricas, fogo de bocal, poeira de passos, cápsulas defletidas e Screen Shake.
 */
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
        this.shells = [];
        this.screenShakeIntensity = 0;
    }

    addScreenShake(intensity = 10) {
        this.screenShakeIntensity = Math.max(this.screenShakeIntensity, intensity);
    }

    addExplosion(x, y, count = 25) {
        this.addScreenShake(count > 40 ? 15 : 8);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 280;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 60,
                color: ['#ff0055', '#ffb703', '#ffffff', '#ff6b00', '#e07a5f'][Math.floor(Math.random() * 5)],
                radius: 4 + Math.random() * 8,
                life: 0.5 + Math.random() * 0.4,
                maxLife: 0.9,
                type: 'EXPLOSION'
            });
        }

        // Adiciona partículas de fumaça cinza subindo
        for (let i = 0; i < Math.floor(count / 2); i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 40,
                vy: -50 - Math.random() * 60,
                color: 'rgba(100, 110, 125, 0.6)',
                radius: 8 + Math.random() * 12,
                life: 0.8 + Math.random() * 0.5,
                maxLife: 1.3,
                type: 'SMOKE'
            });
        }
    }

    addMuzzleFlash(x, y, angle) {
        this.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 80,
            vy: Math.sin(angle) * 80,
            color: '#00f0ff',
            radius: 10,
            life: 0.08,
            maxLife: 0.08,
            type: 'FLASH'
        });

        // Expulsa cápsula metálica para trás
        this.shells.push({
            x: x,
            y: y,
            vx: -Math.cos(angle) * (100 + Math.random() * 50) + (Math.random() - 0.5) * 30,
            vy: -120 - Math.random() * 60,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 15,
            life: 1.2
        });
    }

    addDust(x, y) {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y + (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 30,
                vy: -20 - Math.random() * 20,
                color: 'rgba(231, 111, 81, 0.5)',
                radius: 3 + Math.random() * 4,
                life: 0.4,
                maxLife: 0.4,
                type: 'DUST'
            });
        }
    }

    addFloatingText(text, x, y, color = '#ffb703') {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -45,
            color: color,
            life: 1.3
        });
    }

    addFirework(x, y) {
        const colors = ['#ff0055', '#00ff66', '#00f0ff', '#ffb703', '#9d4edd', '#ffffff', '#ff9e00', '#70e000'];
        const burstColor = colors[Math.floor(Math.random() * colors.length)];
        const count = 35 + Math.floor(Math.random() * 25);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 320;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: Math.random() > 0.3 ? burstColor : '#ffffff',
                radius: 3 + Math.random() * 5,
                life: 0.8 + Math.random() * 0.6,
                maxLife: 1.4,
                type: 'FIREWORK'
            });
        }
        sound.playFireworkSound();
    }

    update(dt) {
        // Reduz Screen Shake gradualmente
        if (this.screenShakeIntensity > 0) {
            this.screenShakeIntensity -= dt * 30;
            if (this.screenShakeIntensity < 0) this.screenShakeIntensity = 0;
        }

        // Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.type === 'SMOKE') {
                p.radius += dt * 10; // Fumaça expande
            }
            if (p.type === 'FIREWORK') {
                p.vy += 150 * dt; // Gravidade suave nos fogos
                p.vx *= 0.97;
            }
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Cápsulas de Munição Expulsas
        for (let i = this.shells.length - 1; i >= 0; i--) {
            const s = this.shells[i];
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.vy += 600 * dt; // Gravidade na cápsula
            s.rotation += s.vRot * dt;
            s.life -= dt;

            // Quique simples no chão (Y=500)
            if (s.y >= 496) {
                s.y = 496;
                s.vy = -s.vy * 0.4;
                s.vx *= 0.6;
            }

            if (s.life <= 0) this.shells.splice(i, 1);
        }

        // Textos Flutuantes
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy * dt;
            t.life -= dt;
            if (t.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    draw(ctx, cameraX) {
        // Desenha Cápsulas de Munição
        ctx.fillStyle = '#ffb703';
        for (const s of this.shells) {
            ctx.save();
            ctx.translate(s.x - cameraX, s.y);
            ctx.rotate(s.rotation);
            ctx.fillRect(-2, -1, 5, 2);
            ctx.restore();
        }

        // Desenha Partículas Visuais
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            const radius = Math.max(1, p.radius * (p.life / p.maxLife));
            ctx.arc(p.x - cameraX, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Desenha Textos Flutuantes com Glow e Sombra Retro
        ctx.font = '900 13px "Press Start 2P", monospace';
        for (const t of this.floatingTexts) {
            ctx.fillStyle = t.color;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.strokeText(t.text, t.x - cameraX, t.y);
            ctx.fillText(t.text, t.x - cameraX, t.y);
        }
    }
}

const vfx = new ParticleSystem();
