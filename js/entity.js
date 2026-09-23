/**
 * Classe Base (Herança): Define os atributos e métodos fundamentais para qualquer entidade viva no jogo.
 * Servindo de base para Player (Nera) e Inimigos (Infantaria, Snipers, Chefes).
 */
class Entidade {
    constructor(x, y, width, height, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;
        this.maxHp = hp;
        this.isDead = false;
        this.facingDirection = 'RIGHT';
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
    }

    getHitbox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    // Método genérico que será sobrescrito (Polimorfismo)
    takeDamage(amount, direction = 'RIGHT', isSplash = false) {
        if (this.isDead) return;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.die();
        }
    }

    // Método genérico que será sobrescrito (Polimorfismo)
    die() {
        this.hp = 0;
        this.isDead = true;
    }
}
