/**
 * StageManager - Gerenciador de Cenários e Parallax com Artes Oficiais Metal Slug
 * Fase 1: Angkor Wat / Jungle Ruins (Ruínas Antigas e Selva)
 * Fase 2: New Godokin Street Subway (Túnel Subterrâneo Vermelho com Trilhos e Pilares Numerados)
 * Fase 3: Industrial Robotics Assembly Plant (Fábrica Militar com Braços Robóticos e Caminhão Morden)
 */
class StageManager {
    constructor() {
        this.currentStage = 1;
        this.stageWidth = 3200;
        this.stageHeight = 600;

        // --- Imagens Oficiais dos Cenários ---
        this.bgRuins = new Image();
        this.bgRuins.src = 'assets/bg_ruins.jpg';
        this.bgRuinsLoaded = false;
        this.bgRuins.onload = () => { this.bgRuinsLoaded = true; };

        this.bgSubway = new Image();
        this.bgSubway.src = 'assets/bg_subway.png';
        this.bgSubwayLoaded = false;
        this.bgSubway.onload = () => { this.bgSubwayLoaded = true; };

        this.bgFactory = new Image();
        this.bgFactory.src = 'assets/bg_factory.png';
        this.bgFactoryLoaded = false;
        this.bgFactory.onload = () => { this.bgFactoryLoaded = true; };

        // Fagulhas de solda ocasionais na Fase 3
        this.factorySparks = [];

        // Decorações em Primeiro Plano
        this.decorationsStage1 = [
            { x: 300, type: 'RUIN_PILLAR' },
            { x: 800, type: 'BARRICADE' },
            { x: 1350, type: 'RUIN_PILLAR' },
            { x: 1850, type: 'BARRICADE' },
            { x: 2350, type: 'RUIN_PILLAR' },
            { x: 2750, type: 'BARRICADE' }
        ];

        this.decorationsStage2 = [
            { x: 220, type: 'BURNING_BARREL' },
            { x: 680, type: 'SUBWAY_SIGNAL' },
            { x: 1250, type: 'BURNING_BARREL' },
            { x: 1750, type: 'SUBWAY_SIGNAL' },
            { x: 2350, type: 'BURNING_BARREL' },
            { x: 2900, type: 'SUBWAY_SIGNAL' }
        ];

        this.decorationsStage3 = [
            { x: 300, type: 'HAZARD_SIGN' },
            { x: 850, type: 'POWER_GENERATOR' },
            { x: 1450, type: 'HAZARD_SIGN' },
            { x: 2050, type: 'POWER_GENERATOR' },
            { x: 2750, type: 'HAZARD_SIGN' }
        ];
    }

    setStage(stageNum) {
        this.currentStage = stageNum;
        if (stageNum === 3) this.stageWidth = 3800;
        else if (stageNum === 2) this.stageWidth = 3600;
        else this.stageWidth = 3200;
    }

    drawParallaxBackground(ctx, cameraX) {
        if (this.currentStage === 1) {
            this.drawStage1Parallax(ctx, cameraX);
        } else if (this.currentStage === 2) {
            this.drawStage2Parallax(ctx, cameraX);
        } else if (this.currentStage === 3) {
            this.drawStage3Parallax(ctx, cameraX);
        }
    }

    // =========================================================================
    // --- FASE 1: ANGKOR WAT JUNGLE RUINS (RUÍNAS NA SELVA COM ROSTO DE PEDRA) ---
    // =========================================================================
    drawStage1Parallax(ctx, cameraX) {
        // Céu atmosférico da selva ao amanhecer
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
        skyGrad.addColorStop(0, '#596e5b');
        skyGrad.addColorStop(0.5, '#7b927d');
        skyGrad.addColorStop(1, '#98ad90');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 600);

        if (this.bgRuinsLoaded && this.bgRuins.width > 0) {
            const targetH = 505;
            const targetW = Math.round(this.bgRuins.width * (targetH / this.bgRuins.height));
            const parallaxFactor = 0.38;
            const parallaxX = cameraX * parallaxFactor;

            const firstTile = Math.floor(parallaxX / targetW);
            const lastTile = firstTile + Math.ceil(800 / targetW) + 1;

            for (let t = firstTile; t <= lastTile; t++) {
                const drawX = Math.round(t * targetW - parallaxX);

                if (t % 2 === 0) {
                    ctx.drawImage(this.bgRuins, drawX, 0, targetW, targetH);
                } else {
                    // Espelhamento horizontal para continuidade natural do cenário
                    ctx.save();
                    ctx.translate(drawX + targetW, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.bgRuins, 0, 0, targetW, targetH);
                    ctx.restore();
                }
            }

            // Raios de Sol Suaves Cortando a Selva
            ctx.save();
            ctx.fillStyle = 'rgba(255, 250, 220, 0.06)';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                const sx = (i * 220 - cameraX * 0.1) % 900;
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx + 90, 0);
                ctx.lineTo(sx - 50, 500);
                ctx.lineTo(sx - 140, 500);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        } else {
            // Fallback elegante caso a imagem esteja carregando
            ctx.fillStyle = '#6b846e';
            ctx.fillRect(0, 0, 800, 500);
        }
    }

    // =========================================================================
    // --- FASE 2: NEW GODOKIN STREET SUBWAY (TÚNEL DE METRÔ METAL SLUG X M5) ---
    // =========================================================================
    drawStage2Parallax(ctx, cameraX) {
        // Fundo escuro do túnel
        ctx.fillStyle = '#100604';
        ctx.fillRect(0, 0, 800, 600);

        if (this.bgSubwayLoaded && this.bgSubway.width > 0) {
            // A imagem original do túnel tem 998x103. Os trilhos ficam na base inferior.
            // Escalando para cobrir de Y=0 a Y=505, os trilhos se alinham perfeitamente com o solo em Y=500.
            const targetH = 505;
            const targetW = Math.round(this.bgSubway.width * (targetH / this.bgSubway.height));
            
            // O túnel oficial tem 4893px de extensão, cobrindo toda a Fase 2 (3600px)
            // Os pilares contam de 8 a 0, levando até as portas blindadas finais!
            const drawX = Math.round(0 - cameraX * 1.0);

            ctx.drawImage(this.bgSubway, drawX, 0, targetW, targetH);

            // Se a câmera passar da borda direita da folha do metrô, preenche com parede de tijolos do túnel
            if (drawX + targetW < 800) {
                ctx.drawImage(this.bgSubway, drawX + targetW, 0, targetW, targetH);
            }

            // Efeito Dinâmico: Pulso Atmosférico das Luzes de Emergência Vermelhas do Metrô
            const pulse = 0.12 + Math.sin(Date.now() * 0.006) * 0.08;
            ctx.fillStyle = `rgba(255, 30, 0, ${pulse})`;
            ctx.fillRect(0, 0, 800, 500);

            // Halo suave nos pilares de alerta
            ctx.fillStyle = 'rgba(255, 180, 0, 0.05)';
            for (let px = 200; px < 3600; px += 450) {
                const screenPx = px - cameraX;
                if (screenPx > -100 && screenPx < 900) {
                    ctx.beginPath();
                    ctx.arc(screenPx, 220, 90, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else {
            ctx.fillStyle = '#1c0905';
            ctx.fillRect(0, 0, 800, 500);
        }
    }

    // =========================================================================
    // --- FASE 3: INDUSTRIAL ROBOTICS FACTORY (FÁBRICA MILITAR MORDEN) ---
    // =========================================================================
    drawStage3Parallax(ctx, cameraX) {
        ctx.fillStyle = '#070a0e';
        ctx.fillRect(0, 0, 800, 600);

        if (this.bgFactoryLoaded && this.bgFactory.width > 0) {
            // A imagem original da fábrica tem 1024x224.
            // As vigas de teto superiores ficam entre Y=0 e Y=80 (onde as torretas de teto se fixam!)
            // Os braços robóticos e o caminhão ficam no centro, e a plataforma de aço na base.
            const targetH = 505;
            const targetW = Math.round(this.bgFactory.width * (targetH / this.bgFactory.height));
            
            // Rolagem contínua com repetição horizontal suave
            const parallaxFactor = 0.8;
            const parallaxX = cameraX * parallaxFactor;
            const firstTile = Math.floor(parallaxX / targetW);
            const lastTile = firstTile + Math.ceil(800 / targetW) + 1;

            for (let t = firstTile; t <= lastTile; t++) {
                const drawX = Math.round(t * targetW - parallaxX);
                ctx.drawImage(this.bgFactory, drawX, 0, targetW, targetH);
            }

            // Efeito Dinâmico: Fagulhas de Solda Elétrica dos Braços Mecânicos
            if (Math.random() < 0.15) {
                this.factorySparks.push({
                    x: Math.random() * 800,
                    y: 120 + Math.random() * 60,
                    vx: (Math.random() - 0.5) * 60,
                    vy: 40 + Math.random() * 80,
                    life: 0.35,
                    maxLife: 0.35,
                    color: Math.random() < 0.5 ? '#00f0ff' : '#ffb703'
                });
            }

            // Atualiza e renderiza fagulhas da fábrica
            for (let i = this.factorySparks.length - 1; i >= 0; i--) {
                const s = this.factorySparks[i];
                s.life -= 0.016;
                s.x += s.vx * 0.016;
                s.y += s.vy * 0.016;

                if (s.life <= 0) {
                    this.factorySparks.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Luzes de Alerta Industriais Neon
            const alertBlink = (Math.floor(Date.now() / 250) % 2 === 0);
            ctx.fillStyle = alertBlink ? 'rgba(0, 240, 255, 0.06)' : 'rgba(255, 0, 85, 0.06)';
            ctx.fillRect(0, 0, 800, 60);
        } else {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, 800, 500);
        }
    }

    // =========================================================================
    // --- ELEMENTOS DE PRIMEIRO PLANO (DECORAÇÕES) ---
    // =========================================================================
    drawForegroundDecorations(ctx, cameraX) {
        let decorList = this.decorationsStage1;
        if (this.currentStage === 2) decorList = this.decorationsStage2;
        else if (this.currentStage === 3) decorList = this.decorationsStage3;

        for (const d of decorList) {
            const renderX = d.x - cameraX;
            if (renderX < -150 || renderX > 900) continue;

            if (this.currentStage === 1) {
                this.drawStage1Decoration(ctx, d, renderX);
            } else if (this.currentStage === 2) {
                this.drawStage2Decoration(ctx, d, renderX);
            } else if (this.currentStage === 3) {
                this.drawStage3Decoration(ctx, d, renderX);
            }
        }
    }

    drawStage1Decoration(ctx, d, renderX) {
        if (d.type === 'RUIN_PILLAR') {
            // Pilar de Pedra Antigo de Angkor Wat com Musgo
            ctx.fillStyle = '#5c5443';
            ctx.fillRect(renderX, 360, 28, 140);
            ctx.fillStyle = '#3f392d';
            ctx.fillRect(renderX + 2, 362, 6, 136);
            ctx.fillRect(renderX + 8, 410, 16, 6);
            ctx.fillRect(renderX + 4, 460, 18, 6);
            // Musgo antigo
            ctx.fillStyle = '#4a5d3c';
            ctx.fillRect(renderX - 2, 355, 32, 10);
            ctx.fillRect(renderX + 18, 380, 8, 20);
        } else if (d.type === 'BARRICADE') {
            // Sacos de Areia / Barricada Militar
            ctx.fillStyle = '#9c8e70';
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 3 - r; c++) {
                    ctx.beginPath();
                    ctx.roundRect(renderX + c * 26 + r * 13, 470 - r * 15, 24, 14, [4]);
                    ctx.fill();
                    ctx.strokeStyle = '#6f634b';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }
    }

    drawStage2Decoration(ctx, d, renderX) {
        if (d.type === 'BURNING_BARREL') {
            // Tambor de Óleo Queimando nos Trilhos do Metrô
            ctx.fillStyle = '#2b2622';
            ctx.fillRect(renderX, 458, 30, 42);
            ctx.strokeStyle = '#574d45';
            ctx.lineWidth = 2;
            ctx.strokeRect(renderX, 458, 30, 42);

            // Chamas Animadas Realistas
            const flameHeight = 16 + Math.sin(Date.now() * 0.025 + d.x) * 6;
            ctx.fillStyle = '#ff1a40';
            ctx.beginPath();
            ctx.arc(renderX + 15, 454, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.arc(renderX + 15, 452 - flameHeight * 0.25, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(renderX + 15, 454, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (d.type === 'SUBWAY_SIGNAL') {
            // Semáforo Sinalizador Ferroviário do Túnel
            ctx.fillStyle = '#1c1b1a';
            ctx.fillRect(renderX + 10, 370, 8, 130);
            ctx.fillStyle = '#100f0e';
            ctx.fillRect(renderX, 330, 28, 45);
            ctx.strokeStyle = '#3a3835';
            ctx.lineWidth = 2;
            ctx.strokeRect(renderX, 330, 28, 45);

            // Luz Vermelha de Perigo no Trilho
            const blink = (Math.floor(Date.now() / 400 + d.x) % 2 === 0);
            ctx.fillStyle = blink ? '#ff0033' : '#4a000d';
            ctx.beginPath();
            ctx.arc(renderX + 14, 345, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = !blink ? '#ffcc00' : '#4a3b00';
            ctx.beginPath();
            ctx.arc(renderX + 14, 362, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawStage3Decoration(ctx, d, renderX) {
        if (d.type === 'HAZARD_SIGN') {
            // Placa de Aviso de Alta Tensão / Perigo
            ctx.fillStyle = '#ffb703';
            ctx.beginPath();
            ctx.moveTo(renderX + 16, 430);
            ctx.lineTo(renderX + 32, 460);
            ctx.lineTo(renderX, 460);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#000000';
            ctx.fillRect(renderX + 14, 440, 4, 10);
            ctx.fillRect(renderX + 14, 453, 4, 4);

            // Poste de fixação
            ctx.fillStyle = '#475569';
            ctx.fillRect(renderX + 14, 460, 4, 40);
        } else if (d.type === 'POWER_GENERATOR') {
            // Gerador de Força com Núcleo Neon
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(renderX, 410, 50, 90);
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(renderX, 410, 50, 90);

            // Núcleo com LED Pulsante
            ctx.fillStyle = (Math.floor(Date.now() / 180) % 2 === 0) ? '#00f0ff' : '#0077aa';
            ctx.beginPath();
            ctx.arc(renderX + 25, 440, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}