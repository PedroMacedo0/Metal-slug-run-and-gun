/**
 * InputHandler - Gerenciador de Controles Robusto via Teclado
 * Suporta múltiplos layouts de teclado, e.code, e.key (minúsculas/maiúsculas) e CapsLock.
 * Elimina ghosting e duplicação de aliases em ações instantâneas (ex: Pausa, Tiro, Pulo).
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressedKeys = {};

        window.addEventListener('keydown', (e) => {
            const keyLower = e.key ? e.key.toLowerCase() : '';
            const code = e.code || '';

            if (['space', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 's', 'w', 'a', 'd', 'k', 'j', 'z', 'p', 'escape'].includes(keyLower) ||
                ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyS', 'KeyW', 'KeyA', 'KeyD', 'KeyK', 'KeyJ', 'KeyZ', 'KeyP', 'Escape'].includes(code)) {
                e.preventDefault();
            }

            // Ignora repetição contínua do SO para não disparar toggles repetidos (como Pausa)
            if (e.repeat) return;

            if (code) this.setKey(code, true);
            if (keyLower) this.setKey(keyLower, true);
        });

        window.addEventListener('keyup', (e) => {
            const keyLower = e.key ? e.key.toLowerCase() : '';
            const code = e.code || '';

            if (code) this.setKey(code, false);
            if (keyLower) this.setKey(keyLower, false);
        });
    }

    setKey(keyName, isPressed) {
        if (isPressed && !this.keys[keyName]) {
            this.justPressedKeys[keyName] = true;
        }
        this.keys[keyName] = isPressed;
    }

    isDown(name) {
        return !!this.keys[name];
    }

    isJustPressed(name) {
        if (this.justPressedKeys[name]) {
            this.justPressedKeys[name] = false;
            return true;
        }
        return false;
    }

    /**
     * Consome atomicamente todos os aliases associados a uma mesma ação
     * Evita que 'KeyP' seja consumido no frame 1 e 'p' seja consumido no frame 2!
     */
    isAnyJustPressed(names) {
        let matched = false;
        for (const name of names) {
            if (this.justPressedKeys[name]) {
                matched = true;
                break;
            }
        }
        if (matched) {
            for (const name of names) {
                delete this.justPressedKeys[name];
            }
            return true;
        }
        return false;
    }

    isLeft() {
        return this.isDown('KeyA') || this.isDown('a') || this.isDown('ArrowLeft') || this.isDown('arrowleft');
    }

    isRight() {
        return this.isDown('KeyD') || this.isDown('d') || this.isDown('ArrowRight') || this.isDown('arrowright');
    }

    isUp() {
        return this.isDown('KeyW') || this.isDown('w') || this.isDown('ArrowUp') || this.isDown('arrowup');
    }

    isDownKey() {
        return this.isDown('KeyS') || this.isDown('s') || this.isDown('ArrowDown') || this.isDown('arrowdown');
    }

    isJumpPressed() {
        return this.isAnyJustPressed(['KeyK', 'k', 'Space', 'space', ' ', 'ArrowUp', 'arrowup']);
    }

    isShootPressed() {
        return this.isAnyJustPressed(['KeyJ', 'j', 'KeyZ', 'z']);
    }

    isRestartPressed() {
        return this.isAnyJustPressed(['Enter', 'enter', 'KeyR', 'r', 'Space', 'space']);
    }

    isQuitPressed() {
        return this.isAnyJustPressed(['Escape', 'escape', 'KeyQ', 'q']);
    }

    isPausePressed() {
        return this.isAnyJustPressed(['Escape', 'escape', 'KeyP', 'p']);
    }

    isLobbyPressed() {
        return this.isAnyJustPressed(['KeyL', 'l', 'KeyQ', 'q']);
    }
}

const input = new InputHandler();
