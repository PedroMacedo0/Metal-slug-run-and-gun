/**
 * WeaponSystem - Arsenal e Comportamento de Projéteis
 * Gerencia os tipos de armas (Pistola, HMG, Shotgun, Bazuca) e seus efeitos.
 */
const WEAPONS = {
    PISTOL: {
        name: 'PISTOLA',
        ammo: Infinity,
        fireRate: 0.18, // Tempo entre tiros
        automatic: false,
        bulletSpeed: 900,
        damage: 1,
        spread: 0,
        icon: '🔫'
    },
    HMG: {
        name: 'HEAVY MACHINE GUN',
        ammo: 150,
        fireRate: 0.08,
        automatic: true,
        bulletSpeed: 1000,
        damage: 1.5,
        spread: 0.08, // Leve variação angular
        icon: '🔄'
    },
    SHOTGUN: {
        name: 'SHOTGUN',
        ammo: 20,
        fireRate: 0.5,
        automatic: false,
        bulletSpeed: 850,
        damage: 3,
        pellets: 6, // Cone de 6 projéteis simultâneos
        spread: 0.25,
        icon: '💥'
    },
    BAZOOKA: {
        name: 'BAZOOOKA',
        ammo: 15,
        fireRate: 0.7,
        automatic: false,
        bulletSpeed: 650,
        damage: 8,
        splashRadius: 70, // Raio de dano explosivo em área
        icon: '🚀'
    }
};

class Bullet {
    constructor(x, y, vx, vy, weaponType, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = weaponType;
        this.isEnemy = isEnemy;
        this.radius = isEnemy ? 4 : (weaponType === 'BAZOOKA' ? 7 : 4);
        this.color = isEnemy ? '#ff0055' : (weaponType === 'BAZOOKA' ? '#ffb703' : '#00f0ff');
        this.life = 1.5;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - cameraX, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Rastro luminoso para Bazuca
        if (this.type === 'BAZOOKA') {
            ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.x - cameraX - this.vx * 0.05, this.y - this.vy * 0.05);
            ctx.stroke();
        } else if (this.type === 'SNIPER_ROUND') {
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.x - cameraX - this.vx * 0.04, this.y - this.vy * 0.04);
            ctx.stroke();
        }
    }
}
