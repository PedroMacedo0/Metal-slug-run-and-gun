/**
 * PhysicsEngine - Motor de Física 2D & Colisão AABB Ultra Estável
 * Elimina completamente qualquer oscilação de chão ao agachar, pular ou rastejar.
 */
class PhysicsEngine {
    constructor() {
        this.gravity = 1800; // Pixels por segundo ao quadrado
        this.maxTerminalVelocity = 800; // Velocidade terminal de queda
    }

    applyGravity(entity, dt) {
        if (!entity.isGrounded) {
            entity.vy += this.gravity * dt;
            if (entity.vy > this.maxTerminalVelocity) {
                entity.vy = this.maxTerminalVelocity;
            }
        }
    }

    checkAABB(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y <= rect2.y + rect2.height &&
            rect1.y + rect1.height >= rect2.y
        );
    }

    /**
     * Resolve a colisão vertical contra o solo e plataformas elevadas sem flicker
     */
    resolvePlatformCollisions(entity, platforms) {
        const playerBox = entity.getHitbox();
        let groundedThisFrame = false;

        for (const platform of platforms) {
            // 1. Checa intersecção horizontal (X overlap)
            const overlapX = (playerBox.x < platform.x + platform.width) && (playerBox.x + playerBox.width > platform.x);

            if (overlapX) {
                const feetY = entity.y + playerBox.height;

                // 2. Tolerância estrita e contínua do vetor dos pés contra o solo (Y = platform.y)
                if (entity.vy >= 0 && feetY >= platform.y - 4 && feetY <= platform.y + 20) {
                    entity.y = platform.y - playerBox.height;
                    entity.vy = 0;
                    groundedThisFrame = true;
                    break;
                }
            }
        }

        entity.isGrounded = groundedThisFrame;
    }
}

const physics = new PhysicsEngine();
