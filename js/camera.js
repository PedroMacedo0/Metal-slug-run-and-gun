/**
 * Camera2D - Câmera de Rolagem Lateral (Side-Scrolling)
 * Acompanha o jogador ao longo da fase com suavização (lerp) e limites de cenário.
 */
class Camera2D {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.targetX = 0;
        this.stageWidth = 3200; // Largura total da Fase 1
    }

    update(playerX) {
        // Centraliza a câmera no jogador (com offset à esquerda para ver à frente)
        this.targetX = playerX - this.viewportWidth * 0.35;

        // Suavização (lerp)
        this.x += (this.targetX - this.x) * 0.1;

        // Limites rígidos do cenário
        if (this.x < 0) this.x = 0;
        if (this.x > this.stageWidth - this.viewportWidth) {
            this.x = this.stageWidth - this.viewportWidth;
        }
    }
}
