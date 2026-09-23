# Log de Rastreamento e Correção de Bugs (Physics & Collisions)

Este documento registra o histórico de relatórios, diagnósticos, resoluções de falhas de física, colisão de projéteis, detecção de plataformas e validações de testes no jogo **Metal Slug 2D Run and Gun**.

---

## 📊 Tabela de Rastreamento de Bugs & Validações de Física

| ID | Problema / Validação | Módulo / Área | Status | Solução / Implementação |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | **Atravessar plataformas ao pular rapidamente (*Tunneling*)** | Física / Colisão AABB | 🟢 Resolvido | Implementado *Swept AABB* e limite de velocidade terminal ($v_{\text{max}} = 800\,\text{px/s}$). A checagem de colisão interpola a posição anterior `prevY` com a atual. |
| **BUG-002** | **Hitbox do jogador não reduz ao agachar** | Player Controller | 🟢 Resolvido | Atualizado o ajuste do vetor de `height` da AABB de 64px para 36px ao pressionar `S`/`Down`, reposicionando o pivô Y (`y += 28px`) para manter os pés no solo sem afundar. |
| **BUG-003** | **Projéteis disparados na diagonal nascendo fora da arma** | Armas / Bullets | 🟢 Resolvido | Criada matriz de offsets locais no cano da arma baseada no ângulo de mira ($\theta = 0^\circ, 45^\circ, 90^\circ, 135^\circ, 180^\circ, 270^\circ$). |
| **BUG-004** | **Explosão da Bazuca (Fase 3) não causa dano a inimigos adjacentes** | Bazooka / Splash FX | 🟢 Resolvido | Substituída checagem ponto-a-ponto por checagem de intersecção círculo-AABB (`distance(bullet.x, bullet.y, enemy.box) <= splashRadius`) ativada na Fase 3. |
| **BUG-005** | **Inimigos empilhados travam a movimentação uns dos outros (Overlap)** | AI Inimiga / Separation | 🟢 Resolvido | Adicionada força de repulsão (*Steering Separation Force*) entre entidades inimigas quando o raio de proximidade for menor que 24px. |
| **BUG-006** | **Disparo para baixo no ar empurra o jogador para cima** | Player Physics | 🟢 Resolvido | Isolada a força de recuo (*recoil velocity*) do tiro no ar para afetar apenas a velocidade horizontal $v_x$, mantendo o impulso vertical $v_y$ sob controle da gravidade. |
| **BUG-007** | **Disparos da Shotgun contornam escudos de inimigos na Fase 2** | Projectile Raycast | 🟢 Resolvido | Adicionado filtro de camada de colisão em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js). Projéteis frontais são bloqueados pelo escudo (`SHIELD_INFANTRY`). |
| **BUG-008** | **Câmera ultrapassa os limites horizontais da Fase durante avanço rápido** | Camera / Viewport | 🟢 Resolvido | Aplicado *Clamping* estrito da posição $X$ da câmera entre `0` e `Stage.width - Canvas.width`. |
| **BUG-009** | **Inimigos continuam atirando fora da tela** | Enemy AI / Performance | 🟢 Resolvido | Adicionada verificação de frustum (*In-Viewport Check*). Inimigos só iniciam rotina de disparo se estiverem dentro dos limites visíveis da câmera + margem de 100px. |
| **BUG-011** | **Jogador incapaz de pular e andar horizontalmente ao mesmo tempo** | Player Movement / Input | 🟢 Resolvido | Desacoplada a lógica de vetor horizontal `vx` do acionamento de pulo `vy`. O vetor $v_x = \pm 350\,\text{px/s}$ é mantido e atualizado no ar com *air control* em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js). |
| **BUG-013** | **Ausência de tela de Game Over e menu de reinício ao morrer** | Game State Manager | 🟢 Resolvido | Implementado o gerenciador de estados em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js) com transição para `'GAMEOVER'`, overlay de contagem de Continue e menu interativo. |
| **BUG-014** | **Comportamento anômalo/jitter ao pressionar o botão para baixo (Agachar/Levantar)** | Player Physics / AABB | 🟢 Resolvido | Identificada falha estrita na checagem $500 > 500$ em `checkAABB` de [`physics.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/physics.js) quando o vetor de altura mudava de $66\,\text{px}$ para $38\,\text{px}$, fazendo o solo oscilar entre `isGrounded` verdadeiro e falso. Corrigido com tolerância contínua do vetor de pés (`feetY >= platform.y - 4 && feetY <= platform.y + 20`). |
| **BUG-016** | **Tiro apontando para o chão ao agachar em superfície rígida** | Player Aim Controller | 🟢 Resolvido | Ajustada a regra de mira em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js): agachar no chão mantém mira horizontal. Tiro para baixo restrito exclusivamente ao ar. |
| **BUG-017** | **"Tentar Novamente" no Game Over da Fase 2 resetava o jogo para a Fase 1** | Stage Load / Reset | 🟢 Resolvido | Corrigida a rotina `resetGame()` em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js). Criado o método `restartCurrentStage()`, que recarrega a fase atual. |
| **BUG-018** | **Expirar tempo do Continue não encerrava a partida retro** | Arcade Timer / Game Over | 🟢 Resolvido | Adicionada verificação `gameOverTimer <= 0` em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js). Ao zerar os 10 segundos, recarrega automaticamente a Fase 1. |
| **BUG-020** | **Teclas de agachamento (`S`/`ArrowDown`) não registravam em determinados teclados/browsers** | Input Handler | 🟢 Resolvido | Refatorado [`input.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/input.js) com suporte duplo a `e.code` e `e.key` em minúsculas. |
| **VAL-021** | **Overhaul de Estética Visual Metal Slug e Animação Dinâmica** | Graphics & VFX | 🟢 Validado | Reformulada a renderização com Screen Shake, cápsulas de tiros defletidas, poeira de corrida, bandana flutuante, sol desértico, lua vermelha neon e chamas animadas. |
| **BUG-022** | **Dessincronização da posição Y e altura ao pular agachado** | Player Controller | 🟢 Resolvido | Encapsulados os métodos `crouch()` e `uncrouch()` em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js). Ao pular, `uncrouch()` ajusta $Y \leftarrow Y - 28\,\text{px}$ antes de alterar a altura para $66\,\text{px}$, eliminando qualquer afundamento ou colisão incorreta no chão. |
| **BUG-023** | **Tanque Chefe da Fase 1 e Escudos da Fase 2 desenhados como soldados genéricos** | Enemy Renderer | 🟢 Resolvido | Adicionados métodos dedicados `drawBossTank()`, `drawShieldInfantry()`, `drawEliteBazooka()`, `drawSniper()`, `drawCeilingTurret()` em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js). O Tanque agora renderiza esteiras de lagarta, torreta e barra de vida; os Soldados de Escudo exibem o escudo reforçado com visor e listras de alerta. |
| **VAL-024** | **Escudos Destrutíveis por Qualquer Arma (Durabilidade de Escudo)** | Enemy Mechanics | 🟢 Validado | Implementado sistema de durabilidade `shieldHp = 6` em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js). Qualquer arma (Pistola, HMG, Shotgun, Bazuca) agora reduz a vida do escudo. Ao chegar a 0, o escudo explode (`SHIELD BROKEN!`) e o soldado fica desprotegido. |
| **VAL-025** | **Tela de Vitória com Show de Fogos de Artifício & Fanfarra Arcádia** | Victory Screen / VFX | 🟢 Validado | Adicionada rotina `addFirework()` em [`particle.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/particle.js) e `playVictoryFanfare()` em [`sound.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/sound.js). Ao derrotar o Mech Final da Fase 3, dispara show pirotécnico contínuo, moldura dourada e resumo de pontuação com Rank S+. |
| **VAL-026** | **Integração Completa da Folha de Sprites do Protagonista (`player_sheet.png`)** | Player Animation & Asset | 🟢 Validado | Importada a folha de sprites oficial enviada pelo usuário em [`assets/player_sheet.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/player_sheet.png). Integradas em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js) as animações de Idle, Corrida (ciclo de 6 quadros), Pulo, Disparo em Pé com Muzzle Flare, Agachamento com Tiro e Morte. |
| **VAL-027** | **Integração da Folha de Sprites do Helicóptero Chefe da Fase 2 (`heli_sheet.png`)** | Boss Animation & Asset | 🟢 Validado | Importada a folha de sprites do Gunship em [`assets/heli_sheet.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/heli_sheet.png). Implementado ciclo contínuo de rotação de hélice em 11 quadros a 26 FPS com inclinação dinâmica de voo (*banking tilt*) e disparos de metralhadora dupla com mísseis pesados dos pods laterais. |
| **VAL-028** | **Remanejamento do Sprite Sheet para Inimigos Rebeldes & Restauração de Marco Rossi** | Asset Reassignment | 🟢 Validado | A folha de sprites do soldado militar foi direcionada para a infantaria inimiga em [`assets/enemy_soldier.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/enemy_soldier.png) e implementada em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js) com ciclo de corrida, disparo com chama e animação de queda. O herói em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js) foi restaurado com Marco Rossi completo, pronto para receber a nova folha do jogador. |
| **VAL-029** | **Integração do Pacote Completo de Sprites Nera v2.1 para o Jogador** | Player Sprites & Animations | 🟢 Validado | Importados os assets de `C:\Users\pedro\Downloads\Nera`, compilado o atlas unificado de 116 quadros em [`assets/nera_atlas.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/nera_atlas.png) e dados em [`js/nera_data.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/nera_data.js). Implementada em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js) a protagonista Nera com tronco e pernas modulares independentes: Idle (4q), Corrida (8q), Pulo multi-estágio (3q), Agachamento (repouso, rastejo com 6q e tiro), mira omnidirecional (frontal, vertical 90°, diagonal, disparo para baixo no ar), golpe de faca melee (11q) e animação de morte com arma caindo no solo (12q). |
| **VAL-030** | **Integração da Folha Oficial de Sprites dos Snipers da Fase 2 (`enemy_sniper.png`)** | Enemy Sniper Visual & AI | 🟢 Validado | Importada a folha oficial de sprites do atirador de elite rebelde em azul (`assets/enemy_sniper.png`), com fundo branco convertido para transparência total. Implementada em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js) a renderização dinâmica de `SNIPER`: postura de prontidão (4 quadros), posição agachada de mira com rifle telescópico longo, mira laser carmesim pulsante de advertência, disparo com recuo e muzzle flash de cano (5 quadros), e estado de derrota no solo. As posições Y nas plataformas elevadas da Fase 2 foram precisamente ajustadas em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js) e adicionado rastro luminoso balístico em [`weapon.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/weapon.js). |
| **VAL-031** | **Overhaul Visual Completo da Fase 3: Chefe Dragon Nosuke Mech, Torreta de Teto e Soldados Bazuca** | Stage 3 Sprite Overhaul | 🟢 Validado | Importadas e convertidas com canal alfa transparente as 3 folhas de sprites oficiais da Fase 3: Chefe Mech Dragon Nosuke com feixes de propulsão azul (`assets/boss_mech.png`), Torretas de Teto com escaneamento rotativo e disparo duplo flamejante (`assets/ceiling_turret.png`) e Soldados de Artilharia Bazuca (`assets/enemy_bazooka.png`). Implementadas em [`enemy.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/enemy.js) e ajustadas as posições de spawn no teto e solo em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js). |
| **VAL-032** | **Integração dos Cenários Oficiais Metal Slug (Angkor Wat, Túnel de Metrô e Fábrica Robótica)** | Stage Backgrounds & Art | 🟢 Validado | Importados os 3 cenários oficiais enviados pelo usuário: Ruínas de Angkor Wat em [`assets/bg_ruins.jpg`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_ruins.jpg), Túnel de Metrô Vermelho M5 em [`assets/bg_subway.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_subway.png) e Fábrica Militar Morden em [`assets/bg_factory.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_factory.png). Implementada a rolagem contínua com parallax em [`stage.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/stage.js), com espelhamento suave, luzes pulsantes de emergência no metrô, fagulhas dinâmicas de solda na fábrica e estilização temática completa de plataformas e trilhos em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js). |
| **BUG-033** | **Inimigo derrotado virava um quadrado branco gigante na tela** | Enemy Renderer / Damage FX | 🟢 Resolvido | Identificado que `hitFlashTimer` era definido como 0.1 ao receber o tiro final, mas `update()` retornava precocemente quando `isDead === true`, congelando o timer em 0.1s. Como `draw()` executava `ctx.fillStyle = '#ffffff'; ctx.fillRect(...)` enquanto `hitFlashTimer > 0`, o inimigo morto desenhava uma caixa branca opaca sobre o sprite. Removido o `fillRect` branco por completo, zerado o `hitFlashTimer` na morte e aplicado filtro `ctx.filter = 'brightness(1.8)'` para flash orgânico nos pixels do sprite apenas enquanto vivo. |
| **BUG-034** | **Deformação de sprites e alinhamento incorreto dos inimigos da Fase 3 (Boss Mech, Torreta e Bazuca)** | Stage 3 Sprite Sheets | 🟢 Resolvido | **Boss Mech**: A altura anterior ($h=221\,\text{px}$) invadia a segunda fileira do sheet, fundindo a parte inferior de outro sprite nas pernas do chefe; corrigido para $172\times 179\,\text{px}$ na flutuação e quadros dedicados para as Fases 2 e 3. **Torreta de Teto**: O recorte anterior cortava o suporte superior; corrigido para $65\times 60\,\text{px}$ abrangendo a chapa de fixação, com rotação em 5 ângulos, disparo com chamas e posicionamento rente ao teto ($Y=2\,\text{px}$). **Bazuca**: O estado `DEAD` apontava para um quadro de corrida; mapeada a animação real de soldado caído de costas ($45\times 17\,\text{px}$), com 11 quadros de disparo de foguete e ancoragem perfeita dos pés no solo. |
| **BUG-035** | **Soldados de Bazuca e Snipers andando de ré (Moonwalking)** | Enemy Animation / Orientation | 🟢 Resolvido | Identificado que a folha oficial de sprites da Bazuca (`enemy_bazooka.png`) e do Sniper (`enemy_sniper.png`) possui orientação nativa voltada para a esquerda (ao contrário da infantaria comum, que olha para a direita). A lógica anterior `if (!isRight) ctx.scale(-1, 1)` invertia o sprite quando o inimigo olhava para a esquerda e o deixava normal quando olhava para a direita, fazendo-o caminhar de costas. Ajustado para `if (isRight) ctx.scale(-1, 1)` em `drawEliteBazooka()` e `drawSniper()`, normalizando a caminhada frontal em ambas as direções. |

---

## 🧪 Registro de Testes Efetuados (Sprint 1, 2, 3, 4, Overhaul Visual & Fix Físico de Agachamento)

1. **Validação da Eliminação Definitiva do Bug de Agachamento (Bug-014 & Bug-022)**:
   - Mantida a tecla `S`/`Down` pressionada continuamente durante caminhada, corridas, trocas de arma e pulos.
   - Os métodos `crouch()` e `uncrouch()` mantêm a relação $Y_{\text{feet}} = Y + \text{height}$ estritamente sincronizada no solo ($Y_{\text{feet}} = 500\,\text{px}$), sem sobressaltos ou travamentos ao pular ou movimentar.

2. **Validação da Renderização dos Inimigos & Chefes (Bug-023 & VAL-024)**:
   - Chefe Tanque da Fase 1 renderiza com esteiras metálicas, torreta móvel, fumaça de escapamento e barra de HP.
   - Soldados de Escudo da Fase 2 possuem durabilidade destrutível por qualquer arma (`SHIELD HIT!` e `SHIELD BROKEN!`).

3. **Validação da Tela de Final de Campanha com Fogos (VAL-025)**:
   - Derrotar o Mech Final da Fase 3 ativa o estado `'VICTORY'`, dispara rajadas contínuas de fogos pirotécnicos coloridos, toca a fanfarra arpejada e exibe o resumo com botão de reinício.

4. **Validação da Folha de Sprites do Helicóptero Chefe (VAL-027)**:
   - O Chefe Gunship da Fase 2 renderiza com o sprite sheet oficial de 11 quadros de rotação de pás de hélice a 26 FPS.
   - O helicóptero inclina suavemente na direção de deslocamento e dispara rajadas duplas de metralhadora e mísseis balísticos.

5. **Validação do Remanejamento de Sprites (VAL-028)**:
   - Os soldados inimigos agora utilizam o sprite sheet militar (`assets/enemy_soldier.png`) com animações de caminhada, disparo e morte.
   - O jogador utiliza o herói Marco Rossi enquanto aguarda a nova folha de sprites enviada pelo usuário.

6. **Validação da Integração do Sprite Pack Nera v2.1 (VAL-029)**:
   - Carregamento instantâneo do atlas unificado de 116 frames (`assets/nera_atlas.png`) e dicionário de metadados (`js/nera_data.js`).
   - Movimentação horizontal exibe o ciclo de 8 quadros sincronizado com as pernas e tronco de Nera.
   - Pulo no ar exibe quadros de ascensão rápida, ápice e queda.
   - Agachamento exibe a pose baixa em repouso, rastejo fluído de 6 quadros e tiro com recuo.
   - Ao aproximar de soldados inimigos (< 48px), pressionar atirar desfere o corte de faca corpo a corpo em 11 quadros com dano concentrado.
   - Morte do herói executa a sequência dramática de 12 quadros caindo no solo com ejeção de arma girando (`fx_gun`).

7. **Validação da Folha de Sprites dos Snipers da Fase 2 (VAL-030)**:
   - Carregamento instantâneo do sprite sheet oficial (`assets/enemy_sniper.png`) com canal alfa transparente.
   - Snipers posicionados perfeitamente nas plataformas elevadas da Fase 2 ($X=750, 1450, 2300$) sem afundamento ou flutuação.
   - Transição suave entre prontidão, ajoelhar com mira laser vermelha e disparo com recuo.
   - Projéteis com rastro balístico veloz (`SNIPER_ROUND`) e permanência do corpo caído por 2.5s após a derrota.

8. **Validação do Overhaul Visual da Fase 3 (VAL-031)**:
   - Chefe Mech Dragon Nosuke renderiza com animação de propulsão por chamas azuis a jato nos 4 pés, oscilação de flutuação dinâmica, canhões frontais e feixe laser de alta energia na Fase 2.
   - Torretas de Teto (`CEILING_TURRET`) montadas rente ao teto da fábrica, com ciclo de escaneamento em 5 ângulos e disparo simultâneo de chamas vermelhas/amarelas.
   - Soldados Bazuca (`ELITE_BAZOOKA`) operam com uniforme militar de artilharia, animação de disparo com recuo de ombro e lançamento de foguetes teleguiados.

9. **Validação dos Cenários Oficiais Metal Slug (VAL-032)**:
   - **Fase 1 (Angkor Wat / Jungle Ruins)**: Carregamento do cenário com a face monumental de pedra e folhagem da selva; rolagem suave com parallax de $0.38\times$, espelhamento horizontal para continuidade infinita e raios de sol volumétricos filtrados pela copa das árvores. Solo com textura de blocos de pedra entalhada e musgo antigo.
   - **Fase 2 (New Godokin Street Subway)**: O túnel subterrâneo oficial com 4893px de extensão cobre os 3600px da Fase 2 em rolagem 1:1, exibindo a sequência numerada de pilares de 8 a 0 até os portões blindados finais. Trilhos metálicos e dormentes de madeira desenhados no solo, com luzes de emergência vermelhas piscando em pulso contínuo e semáforos ferroviários.
   - **Fase 3 (Fábrica Militar de Robótica Morden)**: Estrutura industrial completa com vigas de aço superiores onde as torretas de teto se fixam com perfeição, braços mecânicos hidráulicos de montagem no plano intermediário, caminhão de suprimentos Morden e piso de chapas de aço diamantadas com friso de neon ciano e fagulhas elétricas de solda em tempo real.

10. **Validação da Eliminação do Quadrado Branco ao Matar Inimigos (BUG-033)**:
    - Ao eliminar qualquer inimigo (Infantaria, Soldados com Escudo, Snipers, Bazucas, Torretas de Teto ou Chefes), o sprite do inimigo executa sua animação de morte oficial (`DEAD`) no chão ou explode em partículas sem exibir nenhum retângulo ou quadrado branco.
    - O feedback de acerto enquanto vivo agora clareia os pixels do próprio sprite com `brightness(1.8)` e restaura instantaneamente, garantindo a estética arcade limpa sem cobrir a arte do jogo.

11. **Validação do Alinhamento e Sprites da Fase 3 (BUG-034)**:
    - **Chefe Mech Dragon Nosuke**: O ciclo de flutuação opera com os 3 quadros limpos de $172\times 179\,\text{px}$, eliminando qualquer corte ou intrusão da fileira inferior. Na Fase 2 o mech adota a postura de combate ($210\times 229\,\text{px}$) e na Fase 3 aciona o super-canhão ($348\times 229\,\text{px}$) com propulsão pulsante e sem trepidação.
    - **Torretas de Teto**: Todos os 5 ângulos de escaneamento, o disparo duplo com labaredas e a carcaça destruída possuem dimensões padronizadas de $65\times 60\,\text{px}$, preservando a chapa metálica de fixação superior perfeitamente acoplada à viga de teto da fábrica em $Y=2\,\text{px}$.
    - **Soldados de Bazuca**: Ciclos de Idle (6q), corrida (11q) e disparo com fumaça (11q) executam com pés ancorados no solo ($Y=500\,\text{px}$), e ao serem derrotados executam o sprite oficial de queda de costas no chão ($45\times 17\,\text{px}$) com fade-out gradual.

12. **Validação da Orientação de Marcha dos Soldados de Bazuca e Sniper (BUG-035)**:
    - Validado que tanto a Bazuca quanto o Sniper possuem artes com mira natural voltada para a esquerda.
    - Ao se movimentarem para a esquerda (aproximação normal de avanço rebelde), os sprites mantêm a postura frontal nativa sem espelhamento.
    - Ao se movimentarem ou mirarem para a direita, `ctx.scale(-1, 1)` inverte o sprite para o lado direito, eliminando o comportamento de andar de ré em ambas as direções.

13. **Validação do Sprite Sheet Exclusivo do Chefe Mech Final da Fase 3 (VAL-036)**:
    - O chefe final Dragon Nosuke utiliza exclusivamente a folha limpa de 3 quadros de propulsão a jato flutuante (`assets/boss_mech.png`, $585\times 189\,\text{px}$, 3 slots de $195\times 189\,\text{px}$ com transparência alfa).
    - Em todas as fases (Fase 1 com canhões, Fase 2 com disparo de laser central e Fase 3 com alerta luminoso carmesim), o robô mantém o ciclo contínuo dos 3 quadros oficiais de flutuação a jato sem cortes, variações de corte ou distorções.
    - Orientação calibrada para a postura nativa voltada à esquerda na direção da aproximação do jogador, com espelhamento dinâmico apenas se o herói flanquear o chefe para o lado direito.

14. **Validação da Remoção da Barra Superior de Debug / FPS (VAL-037)**:
    - Removida a barra translúcida superior sobreposta ao Canvas (`#debugOverlay`) que exibia dados de telemetria técnica (FPS, Posição X/Y, Velocidade Vx/Vy, No Solo, Estado do Player e Direção de Mira).
    - Código otimizado em `js/main.js` com guarda de segurança em `updateDebugHUD()` para prevenir escritas desnecessárias no DOM a cada frame.
    - A tela de jogo agora opera 100% limpa no topo, mantendo a imersão visual autêntica do arcade Metal Slug.

15. **Validação do Redesign Visual do HUD Arcade Metal Slug (VAL-038)**:
    - **Barra de Vida de Nera (1UP)**: Substituído o bloco plano vermelho por uma gauge militar segmentada em 10 pips individuais com degradê dinâmico (Verde Esmeralda $\to$ Amarelo Atenção $\to$ Carmesim Crítico com alerta piscante e brilho especular de vidro).
    - **Painel de Armas / Pistola**: Módulo tático com display LCD digital de munição (`∞ INF` para a pistola padrão e contador numérico zero-padded `[150]` com alerta vermelho se a munição estiver no fim para armas especiais). Ícone com fundo com iluminação ambiente.
    - **Banner de Missão Central**: Chevron dourado com relevo retro arcade e subtítulo tático da localização (`ANGKOR JUNGLE RUINS`, `SUBWAY LINE TUNNEL`, `ROBOTIC WAR FACTORY`).
    - **Painel de Score & Record**: Contador de 7 dígitos zero-padded com brilho de neon ciano (`SCORE  0000000`) e marcador de recorde `HI 0099990`.
    - **Sombra Superior de Legibilidade**: Gradiente suave de contraste no topo para garantir nitidez impecável do HUD sobre qualquer fundo do jogo.

16. **Validação do Overhaul da Tela de Vitória "CONGRATULATIONS!" (VAL-039)**:
    - **Tipografia 3D Chrome Retro**: Título "CONGRATULATIONS!" em camadas 3D extrudadas com cores carmesim/bronze sob degradê dourado cromado, contorno preto e faixa superior "ALL MISSIONS ACCOMPLISHED".
    - **Retrato Animado de Nera**: Quadro militar com a heroína em pé na pose oficial de prontidão ($2.2\times$ em pixel art nativa), acompanhada por placa de identificação tática (`PEREGRINE FALCON - STATUS: SURVIVOR`).
    - **Relatório de Operação & Rank S+**: Placa com insígnia gigante `[ S+ ]` brilhante, ranking `SUPREME COMMANDO OF VALOR`, e detalhamento completo de pontuação, 3/3 missões limpas e aniquilação do Mech Dragon Nosuke.
    - **Botão Pulsante & Interatividade**: Botão verde neon pulsante `[ENTER / R : JOGAR NOVAMENTE]` com suporte total a clique do mouse e atalhos de teclado.

17. **Validação do Menu Inicial / Lobby e Sistema de Pausa via ESC (VAL-040)**:
    - **Inicialização em Modo Lobby**: O jogo inicia diretamente na tela de título/lobby arcade com logotipo 3D retrô "METAL SLUG 2D", apresentação da heroína Nera, briefing completo das 3 fases e botão pulsante de início `[ENTER / ESPAÇO : INICIAR MISSÃO]`.
    - **Pausa Instantânea via ESC**: Pressionar `ESC` ou `P` durante a partida interrompe imediatamente a física, projéteis, inimigos e cronômetros, aplicando um filtro escuro fosco de estilo militar sobre a ação congelada.
    - **Menu Modal de Pausa**: Permite continuar a partida (`ESC` ou `ENTER`), reiniciar a fase atual (`R`) ou retornar ao menu inicial/lobby (`L` ou `Q`), com suporte total a cliques de mouse ou atalhos de teclado.

18. **Validação do Chefe Helicóptero R-Shobu Oficial na Fase 2 (VAL-041)**:
    - **Substituição Completa pelo R-Shobu Oficial Metal Slug**: Substituído o sprite sheet anterior pelo clássico helicóptero militar de combate R-Shobu dos arcades da SNK (`assets/r_shobu.png`, $776\times 765\,\text{px}$ com fundo transparente nativo).
    - **Animação de Voo & Hélice Rotativa em Alta Velocidade**: Fuselagem animada em 7 quadros de voo ($89\times 58\,\text{px}$) combinada com a hélice rotativa de 5 quadros sobre o mastro do rotor girando em alta rotação com transparência dinâmica.
    - **Física & Orientação Realista**: O helicóptero olha nativamente para a esquerda em direção ao avanço do jogador, com espelhamento horizontal ao flanquear, inclinação dinâmica de arfagem conforme a aceleração horizontal e disparo de mísseis/bombas a partir dos pods laterais inferiores.

19. **Validação do Botão de Tela Cheia e Escalonamento Proporcional 4:3 (VAL-042)**:
    - **Barra Superior Arcade com Botão Fullscreen**: Adicionado elemento de cabeçalho arcade estilizado (`.arcade-top-bar`) diretamente acima da tela do jogo com o botão dourado reluzente `[ ⛶ TELA CHEIA ]` e LED pulsante verde de status do sistema MVS.
    - **Alternância Dinâmica Fullscreen API**: Ao clicar no botão (ou pressionar a tecla de atalho `F`), o gabinete ativa o modo tela cheia do navegador (`requestFullscreen()`), adaptando dinamicamente o texto e o ícone para `[ ⛶ SAIR TELA CHEIA ]`.
    - **Preservação de Proporção 4:3 & Normalização de Coordenadas de Clique**: O canvas é escalonado perfeitamente via CSS `min(100vw, calc(100vh * 4 / 3))` e `min(100vh, calc(100vw * 3 / 4))` com renderização pixelada nítida. O listener de clique foi aprimorado com cálculo vetorial de proporção (`scaleX`/`scaleY`), garantindo que todos os botões do canvas (Lobby, Pausa, Game Over e Vitória) respondam perfeitamente na posição exata tanto em modo janela quanto em tela cheia.

20. **Validação dos Prisioneiros de Guerra Oficiais (POW) e Suprimentos Táticos (VAL-043)**:
    - **Sprite Sheet Autêntico Metal Slug**: Substituído o desenho por retângulos pelo sprite sheet oficial do POW clássico (`assets/pow_sheet.png`), contendo o ciclo ocioso amarrado, soltura das cordas e levantamento comemoração.
    - **Animação Multifásica**:
      - *Ocioso Amarrado*: Ciclo contínuo de respiração e vigilância (frames 0 a 4) sentado e atado com cordas.
      - *Libertação*: Rompimento dinâmico das cordas com explosão de fragmentos brancos e poeira tática (frames 5 a 7).
      - *Comemoração & Agradecimento*: De pé erguendo os braços com balão retrô `★ THANK YOU! ★` e efeito sonoro de resgate arpeggiado alegre (frame 8).
      - *Fuga*: Corre em retirada para fora da linha de fogo com efeito de passos e oscilação.
    - **Caixa Militar de Armas Física & Interativa**: Ao ser resgatado, ejeta uma caixa de suprimentos (`SupplyBox`) com arco gravitacional realista, rebites de aço, insígnia militar da arma (`H`, `S`, `R`) e halo pulsante. Coleta imediata por contato com feedback visual `+1000 PTS` e notificação da arma equipada.

21. **Correção do Bug de Abertura/Fechamento Instantâneo da Pausa ao Pressionar P ou ESC (BUG-044 / VAL-044)**:
    - **Causa Raiz Identificada**:
      1. *Duplicação de Aliases no Teclado*: No evento `keydown`, o handler registrava tanto `e.code` (`KeyP`) quanto `e.key` (`p`). Ao verificar `isPausePressed()`, o primeiro frame consumia `'KeyP'` e ativava a pausa. No frame seguinte (16ms depois), a verificação de retomada encontrava `'p'` ainda pendente em `justPressedKeys`, despausando o jogo instantaneamente num piscar de olhos.
      2. *Falta de Debounce & Disparo por Repetição do SO*: Sem um cronômetro de resfriamento e sem filtragem de `e.repeat`, manter a tecla pressionada por mais de 50ms disparava toggles ultrarrápidos consecutivos.
    - **Solução Implementada**:
      - *Consumo Atômico de Aliases (`isAnyJustPressed`)*: Implementado método em `InputHandler` que verifica a lista de aliases e, se qualquer um deles foi acionado, remove atomicamente todos os aliases associados (`KeyP`, `p`, `Escape`, `escape`), eliminando vazamentos para frames futuros.
      - *Filtro de Repetição*: `if (e.repeat) return;` impede disparos involuntários de toggles enquanto a tecla permanece afundada.
      - *Debounce Cooldown (`pauseCooldown = 0.25s`)*: Adicionado cronômetro de resfriamento no motor principal `Game.update()`, garantindo uma transição limpa e deliberada de 250ms entre os estados `PLAYING` e `PAUSED`.

22. **Validação e Integração das Trilhas Sonoras Oficiais por Fase e Lobby (VAL-045)**:
    - **Importação e Alocação das 4 Faixas Originais**:
      - *Lobby / Menu Principal*: `assets/audio/bgm_lobby.mp3` (7.4 MB)
      - *Fase 1 (Angkor Jungle Ruins)*: `assets/audio/bgm_stage1.mp3` (1.0 MB)
      - *Fase 2 (Subway Line Tunnel)*: `assets/audio/bgm_stage2.mp3` (2.0 MB)
      - *Fase 3 (Robotic War Factory)*: `assets/audio/bgm_stage3.mp3` (2.2 MB)
    - **Transições Suaves & Ducking**: Transição entre faixas com fade-out gradual. Durante a pausa (`PAUSED`), o volume da música é atenuado (ducking para 18%) e restaurado suavemente ao retornar.
    - **Controle de Mute & Desbloqueio de Autoplay**: Adicionado botão de áudio na barra arcade (`[ 🔊 SOM ON ]` / `[ 🔇 SOM OFF ]`) com atalho de teclado `M`, além de desbloqueio automático de áudio no primeiro clique ou tecla do jogador.

23. **Substituição do Vilão da Fase 1 pelo Tanque Rebelde Oficial Metal Slug Girida-O (VAL-046)**:
    - **Problema / Necessidade**: O chefe da Fase 1 era renderizado com formas geométricas procedurais simples (retângulos verdes e círculos), destoando do acabamento pixel art autêntico dos novos chefes das outras fases.
    - **Módulo / Área**: Inimigos & Chefes (`js/enemy.js`), Spawns de Fase (`js/main.js`), Assets Gráficos (`assets/boss_tank.png`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Extração de Spritesheet Oficial*: Integrada a folha de sprites oficial do tanque de combate do Exército Rebelde (*Girida-O*), contendo 8 quadros de rotação de esteiras (*Move*), 8 quadros de recuo de disparo de canhão pesado (*Fire*), e quadro de carcaça destruída (*Dead*).
      - *Animação Dinâmica de Recuo e Disparo*: Canhão pesado agora dispara conchas de bazuca balísticas a partir da boca exata do canhão (`x + 5` ou `x + width - 5`), ativando ciclo de recuo de torreta com 8 quadros ao atirar contra o jogador.
      - *Alinhamento Físico de Solo*: Dimensões do chefe ajustadas para 135x105px com escala 3.2x, e ponto de spawn Y na Fase 1 recalculado para `y = 395` (para repousar exatamente sobre o solo da plataforma em `y = 500`).
      - *Destruição Dramática*: Ao ter seu HP zerado, o tanque transita para a carcaça de blindagem queimada com explosões secundárias consecutivas antes de sumir.

24. **Integração dos Efeitos Sonoros Oficiais de Combate (VAL-047)**:
    - **Problema / Necessidade**: O jogo utilizava tons senoidais/quadrados sintéticos para a morte do jogador, resgate de reféns e vitória sobre os chefes. Era necessário integrar os arquivos de áudio autênticos fornecidos (`death.mp3`, `thank you.mp3`, `missao cumprida.mp3`).
    - **Módulo / Área**: Sistema de Áudio (`js/sound.js`), Mecânicas de Jogador (`js/player.js`), Inimigos & Chefes (`js/enemy.js`), Prisioneiros (`js/pow.js`), Fluxo Principal (`js/main.js`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Cópia e Alocação dos Arquivos*: Transferidos de `C:\Users\pedro\Downloads\efeitos\` para `assets/audio/` como `sfx_death.mp3`, `sfx_thank_you.mp3` e `sfx_mission_complete.mp3`.
      - *Morte do Jogador (`sfx_death.mp3`)*: Criados métodos `takeDamage()` e `die()` na classe `Player`, disparando imediatamente o grito clássico de derrota ao zerar os pontos de vida.
      - *Resgate do Prisioneiro (`sfx_thank_you.mp3`)*: Configurado em `POW.prototype.rescue()` e `SoundEngine.prototype.playThankYou()` para tocar a voz característica ao libertar qualquer refém.
      - *Derrota de Boss / Missão Cumprida (`sfx_mission_complete.mp3`)*: Disparado instantaneamente ao destruir o Tanque Girida-O (Fase 1), o Helicóptero R-Shobu (Fase 2) e o Mech Final Dragon Nosuke (Fase 3), com ducking automático da música de fundo para clareza máxima da voz e fanfarra.

25. **Animação Oficial de Fuga do Prisioneiro (POW) com Braços Erguidos (VAL-048)**:
    - **Problema / Necessidade**: Ao ser resgatado, o prisioneiro mantinha a mesma pose estática enquanto deslizava para a borda da tela. Era necessário manter os ciclos antigos de repouso amarrado e agradecimento, mas ao iniciar a fuga para escapar, exibir a animação cômica clássica de corrida desenfreada com os braços para cima.
    - **Módulo / Área**: Prisioneiros de Guerra & Suprimentos (`js/pow.js`), Spritesheets (`assets/pow_run_sheet.png`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Processamento e Geração do Sprite Sheet*: Extraídos os 8 quadros da tira enviada pelo usuário, normalizando as sobreposições de pixels e gerando `assets/pow_run_sheet.png` ($720\times 90\,\text{px}$) com canal alfa transparente e alinhamento de solo uniforme.
      - *Transição de Estados Preservada*: Mantidos integralmente os ciclos de respiração amarrado (`TIED`), quebra de cordas (`FREEING`) e agradecimento com balão (*THANK YOU!*).
      - *Ciclo Dinâmico de Fuga (`ESCAPING`)*: Durante a retirada do campo de batalha, o prisioneiro corre a 160 px/s reproduzindo a sequência fluida de 8 quadros com os braços balançando para cima a 14 FPS, acompanhado de sombra dinâmica de solo.

26. **Adição da Médica de Suprimentos Rumi Aikawa & Kit Médico de +30% HP (VAL-049)**:
    - **Problema / Necessidade**: Solicitação do usuário para adicionar 1 médica em cada fase que, ao morrer/ser atingida, solta um kit médico capaz de restaurar 30% da vida máxima do jogador.
    - **Módulo / Área**: Médica NPC (`js/medic.js`), Caixa de Suprimentos (`js/pow.js`), Spawns & Colisão de Fases (`js/main.js`), Assets Gráficos (`assets/rumi_sheet.png`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Módulo MedicNPC*: Criada a classe `MedicNPC` em `js/medic.js` carregando a folha de sprites de Rumi com ciclos completos de caminhada com mochila pesada (16 quadros), tropeço e queda com desprendimento da mochila (11 quadros) e fuga em disparada sem mochila (9 quadros).
      - *Alocação por Fase*: Inserida 1 unidade em cada fase (`x = 1600` na Fase 1, `x = 2000` na Fase 2 e `x = 1900` na Fase 3).
      - *Drop do Kit Médico (`MEDKIT`)*: Ao sofrer dano (balas aliadas, inimigas ou contato), Rumi cai, sua mochila se solta e ejeta uma caixa médica estilizada (branca com cruz vermelha `+` e halo verde).
      - *Recuperação de 30% de Vida*: Ao coletar o kit, o jogador recupera exatamente 30% de sua vida máxima (+3 HP se `maxHp = 10`), com texto flutuante `+3 HP (30%)!`, explosão de cura verde e áudio de coleta.

27. **Ajuste e Sincronização da Nova Folha de Corrida do POW (`pow_run_sheet.png`) (VAL-050)**:
    - **Problema / Necessidade**: O usuário atualizou/arrumou diretamente o arquivo `assets/pow_run_sheet.png` com uma nova imagem de $499\times 66\,\text{px}$. Era necessário adaptar o código para ler com exatidão a nova folha e corrigir o canal alfa.
    - **Módulo / Área**: Prisioneiros de Guerra & Suprimentos (`js/pow.js`), Asset Gráfico (`assets/pow_run_sheet.png`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Reparo do Canal Alfa do PNG*: Identificado que o software gráfico havia salvo os pixels do prisioneiro com $A = 0$; executado script cirúrgico mantendo $A = 255$ em todos os 13.292 pixels coloridos dos 8 sprites e $A = 0$ no fundo transparente (arquivo final de 42.695 bytes).
      - *Matriz de Coordenadas `POW_RUN_FRAMES`*: Criada tabela de recorte exato para cada um dos 8 quadros da folha de $499\times 66\,\text{px}$ com posições $X, Y$, larguras, alturas e linhas de base de contato com o chão.
28. **Correção de Orientação da Médica Rumi Correndo de Costas / Moonwalking (BUG-051)**:
    - **Problema / Necessidade**: Ao soltar a mochila e entrar em fuga (`FLEEING`), a médica Rumi Aikawa corria de costas (moonwalk) em vez de correr de frente.
    - **Módulo / Área**: Médica NPC (`js/medic.js`), Interação e Dano (`js/main.js`).
    - **Status**: 🟢 **Resolvido / Validado**
    - **Solução Implementada**:
      - *Diagnóstico da Orientação Nativa no Sprite Sheet*: Na folha oficial `assets/rumi_sheet.png`, as fileiras 1 a 3 (`WALK` e `FALL`) olham nativamente para a direita, mas a fileira 5 (`FLEE`, 9 quadros de fuga sem mochila) foi desenhada pela SNK olhando nativamente para a esquerda. Como o código anterior aplicava `scale(-1, 1)` para `facingDirection === 'LEFT'`, o sprite de fuga era invertido e apontava para a direita enquanto ela se deslocava para a esquerda.
      - *Ajuste da Lógica de Flip por Estado*: No método `draw()` de `js/medic.js`, implementada a condicional onde para `FLEEING`, `shouldFlip = (this.facingDirection === 'RIGHT')`. Se ela correr para a esquerda, o sprite nativo é preservado sem inversão; se correr para a direita, é invertido horizontalmente para olhar para a direita.
      - *Fuga Reativa Baseada no Impacto*: Atualizado `main.js` para passar a posição do atacante `attackerX` para `medic.takeDamage(1, attackerX)`. A médica tropeça e foge na direção oposta ao perigo, mantendo sempre o rosto, braços e pernas voltados para a frente em que está correndo.

---

## 🛠️ Procedimento Padrão de Reporte de Bugs
Para adicionar um novo bug a este documento, utilize a seguinte convenção:
1. **ID**: `BUG-XXX` (ou `VAL-XXX` para validações) em ordem cronológica.
2. **Problema / Validação**: Descrição sucinta do comportamento anômalo ou teste realizado.
3. **Módulo / Área**: Qual sistema foi afetado (Física, Player, Inimigos, Câmera, Partículas).
4. **Status**:
   - 🔴 **Pendente**: Identificado, mas sem solução implementada.
   - 🟡 **Em Análise**: Em fase de teste ou diagnóstico.
   - 🟢 **Resolvido / Validado**: Bug corrigido ou teste validado em código.
5. **Solução / Implementação**: Detalhamento técnico do ajuste efetuado no código JavaScript/Canvas.
