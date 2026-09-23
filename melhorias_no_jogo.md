# Backlog de Melhorias, Polimento e Efeitos Especiais

Este documento é o nosso repositório de ideias, refinamentos visuais, balanceamento de chefes, efeitos de partículas, elementos de *Juice* e registro de tarefas concluídas no desenvolvimento do jogo **Metal Slug 2D Run and Gun**.

---

## ✅ Funcionalidades Concluídas na Fundação & Fases 1, 2 e 3 (Sprints 1, 2, 3, 4, Overhaul Visual & Áudio)

- [x] **Sintetizador Sonoro Procedural WebAudio API (`sound.js`)**:
  - Implementado em [`sound.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/sound.js): Efeitos sonoros sem latência para tiros de Pistola, HMG (rajada rápida), Shotgun (eco expansivo), Bazuca (estouro grave + fumaça), pulos, resgate de POWs e explosões de inimigos.
- [x] **Solução Definitiva para a Física de Agachamento sem Flickering**:
  - Refatorado [`physics.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/physics.js): a verificação de intersecção com o solo agora utiliza checagem contínua do vetor dos pés (`feetY >= platform.y - 4 && feetY <= platform.y + 20`), eliminando a oscilação entre estado `isGrounded` verdadeiro e falso ao agachar.
- [x] **Overhaul Visual Completo estilo Metal Slug Arcade (VFX & Juiciness)**:
  - **Screen Shake Dinâmico**: Vibração da câmera ativada durante explosões e tiros pesados da Shotgun/Bazuca em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js).
  - **Cápsulas de Munição Expulsas**: Ejeção de cartuchos metálicos de bronze que caem e quicam no solo a cada tiro em [`particle.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/particle.js).
  - **Poeira de Passos**: Nuvens de poeira levantadas sob as botas do herói ao correr, pular ou aterrissar.
  - **Sprite Detalhado de Marco Rossi**: Bandana vermelha com pontas flutuando ao vento, colete verde militar com botões dourados, camisa com gola branca, calça caqui com dobra e botas de combate em [`player.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/player.js).
  - **Cenários Orgânicos e Vivos**: Sol desértico com nuvens em movimento na Fase 1, lua vermelha neon e chamas animadas em tambores na Fase 2, e teto industrial com listras de alerta e LEDs na Fase 3 em [`stage.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/stage.js).

---

## 🎨 1. Polimento Visual & UI (Visual Polish & Juiciness)

- [x] **Screen Shake (Treme-Tela Dynamic)**:
  - Vibração de câmera proporcional à intensidade dos eventos em [`main.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/main.js).
- [x] **Flash de Dano em Inimigos Orgânico (Hit Flash sem Quadrados Brancos)**:
  - Inimigos e Chefes sofrem realce momentâneo com `brightness(1.8)` exclusivamente nos pixels do sprite ao serem atingidos em `enemy.js`, sem cobrir a tela com caixas opacas e zerando imediatamente ao morrer para exibir a animação oficial de queda.
- [x] **Cenários Oficiais Metal Slug com Parallax e Efeitos Vivos**:
  - **Fase 1 (Angkor Wat / Selva)**: Rosto de pedra monumental, ruínas antigas e vegetação densa em [`assets/bg_ruins.jpg`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_ruins.jpg) com raios de sol volumétricos filtrados, parallax a $0.38\times$ e solo em alvenaria antiga com musgo.
  - **Fase 2 (New Godokin Street Subway)**: Túnel subterrâneo oficial com 4893px em [`assets/bg_subway.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_subway.png), pilares numerados de 8 a 0, portas blindadas finais, trilhos metálicos com dormentes de madeira, luzes de emergência vermelhas pulsantes e semáforos ferroviários.
  - **Fase 3 (Fábrica Militar Morden)**: Estrutura industrial completa em [`assets/bg_factory.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/bg_factory.png), vigas superiores onde se acoplam as torretas de teto, braços hidráulicos robóticos, caminhão de suprimentos Morden, piso de aço com friso neon ciano e fagulhas dinâmicas de solda.
- [x] **Interface Head-Up Display (HUD) Retro Arcade Definitiva**:
  - Barra de vida do jogador, ícone da arma ativa com munição, pontuação `SCORE` e identificador dinâmico de fase (`STAGE 1` / `STAGE 2` / `STAGE 3`).

---

## 💥 2. Sistema de Partículas & Efeitos Especiais (VFX System)

- [x] **Fogo de Bocal (Muzzle Flash)**:
  - Partículas de iluminação momentânea geradas na ponta do cano de cada arma ao disparar.
- [x] **Cápsulas de Projéteis Defletidas (Ejected Shell Casings)**:
  - Cartuchos amarelos expelidos para trás ao atirar quicando no chão em `particle.js`.
- [x] **Explosões Particuladas da Bazuca & Granadas**:
  - Animação de expansão em anéis com fagulhas amarelas/laranjas, fumaça cinza subindo e dejetos (*debris*) voando.

---

## ⚖️ 3. Balanceamento de Chefes & Desafio (Boss Balancing)

### 🤖 Chefe 1: Tanque Médio Rebelde (Fase 1) - *[IMPLEMENTADO]*
- **Fase de Vida**: 80 HP no final da Fase 1 ($X = 2800$).

### 🚁 Chefe 2: Helicóptero Gunship de Combate (Fase 2) - *[IMPLEMENTADO]*
- **Fase de Vida**: 120 HP com oscilação no ar e rajadas duplas de metralhadora ($X = 3100$).

### 🏰 Chefe Final: Super Mech Dragon Nosuke (Fase 3) - *[IMPLEMENTADO & CORRIGIDO]*
- **Fase de Vida**: 250 HP com 3 fases de combate destrutível (Flutuação com propulsão azul a jato de 3 quadros limpos, Canhões Duplos com postura de combate na Fase 2, e Super-Canhão com Feixe Laser de alta energia e Tempestade de Mísseis Guiados na Fase 3).
- **Inimigos de Apoio da Fase 3**: Torretas de Teto acopladas perfeitamente às vigas com rotação em 5 ângulos e disparo com labaredas duplas; Soldados de Elite Bazuca com disparo completo de foguetes teleguiados e animação autêntica de queda no solo.

---

## 🔊 4. Áudio & Sonoplastia WebAudio API (SFX / BGM)

- [x] **Sintetizador procedural com WebAudio API para sons de tiro sem latência**:
  - Efeitos sonoros sem arquivos externos implementados em [`sound.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/sound.js).

---

## 🎖️ 5. Integração da Protagonista Nera (`assets/nera/`)

- [x] **Importação e Compilação do Sprite Pack de Nera v2.1 (poohcom1)**:
  - Importados todos os frames originais em alta fidelidade a partir de `C:\Users\pedro\Downloads\Nera` para [`assets/nera/`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/nera/).
  - Compilados 116 quadros individuais em um atlas unificado de alta performance em [`assets/nera_atlas.png`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/assets/nera_atlas.png) e mapeados em [`js/nera_data.js`](file:///c:/Users/pedro/.gemini/antigravity-ide/scratch/metal-slug-run-and-gun/js/nera_data.js) com pivôs e dimensões nativas.
- [x] **Sistema de Animação Modular Tronco & Pernas Independentes (`player.js`)**:
  - **Repouso (Idle)**: Pernas de prontidão com respiração sutil do tronco e movimento de cabelos em 4 quadros.
  - **Passadas de Corrida (Run)**: Ciclo sincronizado de 8 quadros a 12 FPS com compatibilidade simultânea para tiros em movimento (com compensação de offset Y de 1px conforme guia do autor).
  - **Pulo Dinâmico Multi-Fase (Jump)**: 3 fases com pernas de propulsão na subida ($v_y < -200$), ápice central e queda livre ($v_y > 100$).
  - **Agachamento Completo (Crouch)**: Repouso baixo, rastejo com 6 quadros e tiro agachado com recuo frontal.
  - **Mira Omnidirecional**: Disparo frontal horizontal, vertical $90^\circ$ para cima, diagonal e inclinação de $90^\circ$ para baixo ao atirar no ar contra alvos terrestres.
  - **Ataque de Faca Corpo a Corpo (Melee Knife)**: Ao pressionar atirar próximo de soldados inimigos ($< 48\,\text{px}$), Nera desfere um corte rápido de faca em 11 quadros causando dano concentrado de 10 HP.
  - **Animação Cinematográfica de Morte no Solo (Death Sequence)**: Ao zerar o HP, Nera cai no solo em 12 quadros dramáticos e a arma voa girando no ar até descansar no chão (`fx_gun`).

---

## 🎯 6. Integração dos Atiradores de Elite Rebeldes (Snipers da Fase 2)

- [x] **Sprite Sheet Oficial do Sniper Rebelde em Azul (`assets/enemy_sniper.png`)**:
  - Importada a folha original enviada pelo usuário, convertida com canal alfa para transparência total contra os cenários noturnos da Fase 2.
- [x] **Comportamentos & Animações Especializadas (`enemy.js`)**:
  - **Prontidão de Sentinela (Idle)**: Soldado de capuz e uniforme azul segurando rifle longo (4 quadros).
  - **Preparação de Disparo (Aim)**: Ajoelha na plataforma com o rifle apoiado, projetando um feixe laser vermelho pulsante em direção ao jogador como sinalização tática.
  - **Disparo com Recuo e Muzzle Flash (Shoot)**: Sequência de 5 quadros com chama amarela na boca do cano, ejeção de cartucho e recuo de ombro.
  - **Traçante Balístico (`weapon.js`)**: Projéteis de sniper viajam a alta velocidade ($750\,\text{px/s}$) exibindo rastro luminoso carmesim.
  - **Queda de Derrota**: Ao ser atingido fatalmente, o soldado desaba na plataforma e seu corpo permanece estendido por 2.5 segundos.

---

## 🤖 7. Overhaul Visual Completo da Fase 3 (Chefão Mech, Torretas de Teto e Soldados Bazuca)

- [x] **Chefe Final Mech Dragon Nosuke Hover Variant (`assets/boss_mech.png`)**:
  - Folha de sprites exclusiva com os 3 quadros limpos de animação de flutuação e propulsão azul a jato sob os 4 pés mecânicos ($585\times 189\,\text{px}$, $195\,\text{px}$ por quadro com canal alfa transparente).
  - Oscilação dinâmica de flutuação no ar ($Y = 250 \pm 16\,\text{px}$) com registro estável em todos os quadros e sem trepidações.
  - Transição de 3 fases de combate mantendo estritamente a animação dos 3 quadros de flutuação:
    - **Fase 1**: Disparos alternados de canhão duplo lateral.
    - **Fase 2**: Feixe laser de alta energia ciano emitido da escotilha frontal com brilho volumétrico e recarga periódica.
    - **Fase 3**: Alerta vermelho de emergência pulsante e bombardeio de foguetes aéreos teleguiados.
- [x] **Torretas de Teto Industriais (`assets/ceiling_turret.png`)**:
  - Montadas rente ao teto da fábrica tecnológica com rotação de escaneamento em 5 ângulos.
  - Ao disparar contra o herói, a torreta projeta o quadro de disparo com chamas duplas descendentes.
- [x] **Soldados de Artilharia Rebelde Bazuca (`assets/enemy_bazooka.png`)**:
  - Traje militar de artilharia com animação de caminhada, postura em pé e recuo ao lançar foguetes.
  - Projéteis explosivos com detonação em área contra o jogador.

---

## 🖥️ 8. Limpeza de Interface e Imersão Arcade

- [x] **Remoção da Barra Superior de Telemetria / FPS (`index.html`, `style.css`, `js/main.js`)**:
  - Removido o painel flutuante `#debugOverlay` que continha contadores técnicos de FPS, Posição X/Y, Velocidade, Estado e Mira.
  - O Canvas do jogo agora fica com o topo totalmente desobstruído para uma experiência arcade 100% limpa e cinematográfica.
  - Execução otimizada em `js/main.js` sem atualizações desnecessárias de nós DOM a cada quadro.
- [x] **Novo HUD Arcade Metal Slug de Alta Qualidade Visual (`js/main.js`)**:
  - Painéis militares táticos escuros com bisel metálico e rebites dourados.
  - **Barra de Vida**: 10 pips segmentados com brilho especular e transição verde/âmbar/carmesim.
  - **Pistola & Armas**: Moldura para ícone da arma com fundo brilhante, nome em relevo e display digital LCD de munição (`∞ INF` ou contagem zero-padded).
  - **Banner de Fase**: Insígnia militar central com título (`★ MISSION X ★` ou `★ FINAL MISSION ★`) e subtítulo temático do cenário.
  - **Placar de Pontuação**: Tipografia arcade neon ciano com efeito de brilho e marcação de recorde `HI`.
- [x] **Tela de Vitória e Fim de Jogo Cinematográfica "CONGRATULATIONS!" (`js/main.js`)**:
  - Título 3D com extrusão cromada e degradê dourado reluzente.
  - Retrato militar da heroína Nera em pose de vitória com insígnia oficial e animação contínua.
  - Placa de Rank de Operação `[ S+ ]` brilhante, avaliação tática e métricas completas de pontuação.
  - Botão de reinício pulsante em verde esmeralda com suporte a clique e atalhos de teclado.

---

## 🎮 9. Menu Inicial / Lobby e Sistema de Pausa

- [x] **Lobby Inicial Estilo Arcade Neo-Geo (`js/main.js`, `input.js`)**:
  - Inicialização direta na tela de apresentação da campanha com logotipo 3D "METAL SLUG 2D".
  - Apresentação da heroína Nera (Peregrine Falcon Squad) com animação completa em repouso.
  - Briefing tático das 3 fases oficiais (Ruínas, Metrô e Fábrica) e guia rápido de controles.
  - Botão de início pulsante em verde esmeralda `[ENTER / ESPAÇO : INICIAR MISSÃO]` com suporte a clique do mouse.
- [x] **Sistema de Pausa Instantânea via ESC / P (`js/main.js`, `input.js`)**:
  - Ao pressionar `ESC` ou `P` durante a partida, o jogo congela imediatamente a física, inimigos e projéteis.
  - Exibe overlay translúcido escuro de estilo militar com o menu de pausa:
    - `▶️ [ESC / ENTER] CONTINUAR (RESUME)`
    - `🔄 [R] REINICIAR FASE`
    - `🏠 [L / Q] SAIR PARA O LOBBY`
  - Suporte completo a atalhos de teclado e cliques com o mouse.

---

## 🚁 10. Chefe Helicóptero de Combate R-Shobu (Fase 2)

- [x] **Sprite Sheet Oficial do R-Shobu (`assets/r_shobu.png`, `assets/heli_sheet.png`)**:
  - Folha autêntica dos arcades SNK Metal Slug 1-4 contendo a fuselagem de combate e rotores em canal alfa nativo.
  - Substitui por completo a arte provisória anterior por uma representação visual 100% fiel à franquia.
- [x] **Animação Composta de Fuselagem & Rotores (`js/enemy.js`)**:
  - Fuselagem em ciclo contínuo de 7 quadros de voo (`R_SHOBU_FLYING_FRAMES`, $89\times 58\,\text{px}$).
  - Rotor montado sobre o mastro superior girando em ciclo de 5 quadros de alta velocidade (`R_SHOBU_ROTOR_FRAMES`).
  - Arfagem dinâmica conforme a movimentação horizontal e espelhamento automático voltado para o herói.
  - Lançamento de bombas e projéteis a partir dos pods de armamento laterais inferiores.

---

## 🖥️ 11. Botão de Tela Cheia Arcade & Responsividade 4:3

- [x] **Barra Superior Arcade Integrada (`.arcade-top-bar`)**:
  - Posicionada logo acima do display do jogo, decorada com a chancela `NEO-GEO MVS // ARCADE 4:3` e LED pulsante verde de alimentação.
  - Botão de destaque com brilho dourado e ícone vetorial nítido: `[ ⛶ TELA CHEIA ]`.
- [x] **Integração Completa da Fullscreen API (`js/main.js`, `style.css`)**:
  - Suporte completo a múltiplos navegadores com fallbacks para prefixes WebKit, Moz e MS.
  - Alternância de estado suave com atualização dinâmica de ícone e legenda para `[ ⛶ SAIR TELA CHEIA ]`.
  - Tecla de atalho `F` para rápida alternância sem necessidade de mover as mãos do teclado.
- [x] **Preservação Visual de Aspecto 4:3 & Vetorização de Clique**:
  - O canvas escala com fidelidade máxima através da fórmula matemática CSS `min(100vw, calc(100vh * 4 / 3))` e `min(100vh, calc(100vw * 3 / 4))`.
  - Tratamento de coordenadas de clique no canvas com `scaleX` e `scaleY`, permitindo que todos os menus (Lobby, Pausa, Game Over e Vitória) continuem respondendo perfeitamente nos cliques tanto em tela cheia quanto em janela padrão.

---

## 🎖️ 12. Prisioneiros de Guerra (POW) & Caixas de Suprimento Oficiais

- [x] **Folha de Sprites Autêntica Metal Slug (`assets/pow_sheet.png`)**:
  - Prisioneiro clássico barbudo de calças rasgadas com canal alfa nativo e transparência perfeita.
  - Substitui os blocos coloridos provisórios por animação fluida em pixel art 100% autêntica.
- [x] **Ciclos de Animação Completos (`js/pow.js`)**:
  - **Ocioso Amarrado**: Respiração contínua com amarras de corda em 5 quadros (`POW_FRAMES.TIED`).
  - **Libertação**: Sequência dinâmica de soltura das cordas, quebra com fragmentos e pose de comemoração (`POW_FRAMES.FREEING`).
  - **Agradecimento & Fuga**: Balão arcade `★ THANK YOU! ★`, áudio de resgate festivo (`sound.playRescue()`) e retirada do campo de batalha correndo.
- [x] **Caixa Militar de Suprimentos Física (`SupplyBox`)**:
  - Crate blindada estilizada com rebites, insígnia da arma (`H` para HMG, `S` para Shotgun, `R` para Bazooka) e halo dourado pulsante.
  - Ejeção com física parabólica, repouso no solo e coleta intuitiva por proximidade com ganho de +1000 pontos e notificação na tela.

---

## 🎵 13. Soundtracks Oficiais por Fase e Lobby

- [x] **Importação dos 4 Áudios Oficiais (`assets/audio/`)**:
  - `bgm_lobby.mp3`: Trilha tema do menu de operações / Lobby arcade.
  - `bgm_stage1.mp3`: Tema clássico de avanço na selva e ruínas de Angkor.
  - `bgm_stage2.mp3`: Tema noturno de combate tático na linha de metrô.
  - `bgm_stage3.mp3`: Trilha frenética e industrial da fábrica de robôs de guerra.
- [x] **Transição Dinâmica & Ducking Tático (`SoundEngine`)**:
  - Troca de faixas com fade-out gradual e loop ininterrupto de alta qualidade.
  - Durante o estado de pausa (`PAUSED`), o áudio da música sofre atenuação (ducking para 18%) e é restaurado suavemente ao despausar.
- [x] **Botão de Controle na Barra Superior & Atalho `M`**:
  - Botão interativo `[ 🔊 SOM ON ]` / `[ 🔇 SOM OFF ]` com sincronização visual.
  - Tecla de atalho `M` para silenciar ou reativar tanto a trilha de fundo quanto os efeitos sonoros.
  - Desbloqueio imediato da reprodução no primeiro clique ou tecla do usuário, em conformidade com as políticas de autoplay dos navegadores.

---

## 🛡️ 14. Chefe Tanque Rebelde Girida-O (Fase 1)

- [x] **Folha de Sprites Oficial SNK (`assets/boss_tank.png`)**:
  - Tanque de combate autêntico do Exército Rebelde (*Girida-O*) em pixel art original com canal alfa transparente.
  - Substitui os polígonos geométricos procedurais provisórios pelo blindado militar clássico da franquia.
- [x] **Animações Completas de Movimento, Disparo e Destruição (`js/enemy.js`)**:
  - **Rolagem de Esteiras**: 8 quadros em ciclo contínuo (`BOSS_TANK_MOVE_FRAMES`) ao patrulhar para frente e para trás.
  - **Recuo de Canhão**: 8 quadros dedicados de tiro pesado com recuo mecânico da torreta (`BOSS_TANK_FIRE_FRAMES`).
  - **Carcaça em Chamas**: Ao ser derrotado, o tanque transita para o sprite de blindagem destruída e calcinada (`BOSS_TANK_DEAD_FRAME`), acompanhado de explosões secundárias sucessivas antes do desaparecimento.
- [x] **Física de Combate & Geometria de Disparo**:
  - Ponto de spawn Y ajustado para `y = 395` com dimensões $135\times 105\,\text{px}$, alinhando com perfeição as esteiras sobre o solo da Fase 1 ($y = 500$).
  - O canhão dispara conchas de bazuca diretamente da extremidade do cano com flash de boca (*muzzle flash*), tremor de tela e áudio pesado de artilharia.

---

## 🔊 15. Efeitos Sonoros Oficiais de Combate

- [x] **Importação dos Arquivos de Áudio (`assets/audio/`)**:
  - `sfx_death.mp3`: Áudio dramático de morte do jogador ("Uaargh!").
  - `sfx_thank_you.mp3`: Voz clássica e alegre de agradecimento ao libertar um prisioneiro de guerra ("Thank you!").
  - `sfx_mission_complete.mp3`: Fanfarra e voz oficial de missão cumprida ("Mission Complete!").
- [x] **Gatilhos de Disparo Conectados (`js/sound.js`, `js/player.js`, `js/pow.js`, `js/enemy.js`)**:
  - **Morte do Jogador**: Disparado no instante em que o HP da heroína é zerado via `player.die()`.
  - **Resgate de POW**: Disparado imediatamente ao cortar as cordas ou tocar no prisioneiro via `pow.rescue()`.
  - **Vitória sobre os Chefes**: Disparado instantaneamente ao destruir o Tanque Girida-O (Fase 1), o Helicóptero R-Shobu (Fase 2) e o Mech Final Dragon Nosuke (Fase 3), com atenuação automática da trilha sonora para destaque nítido da voz.

---

## 🏃 16. Animação de Fuga do POW com Braços Erguidos

- [x] **Nova Folha de Sprites Ajustada (`assets/pow_run_sheet.png`)**:
  - 8 quadros autênticos de corrida cômica e desesperada com os braços balançando no ar e barba ao vento.
  - Reparo cirúrgico do canal alfa preservando $A = 255$ em todos os 13.292 pixels do prisioneiro com fundo totalmente transparente (42.695 bytes).
  - Tabela `POW_RUN_FRAMES` com as dimensões exatas de cada frame no sheet de $499\times 66\,\text{px}$ e offsets de pés para contato perfeito com o solo.
- [x] **Preservação dos Ciclos Anteriores & Transição Suave (`js/pow.js`)**:
  - **Amarrado (`TIED`)**: Mantido o ciclo ocioso de respiração e alerta sentado no chão.
  - **Libertação (`FREEING`)**: Mantida a sequência de rompimento das cordas e levantar com fragmentos voando.
  - **Agradecimento (`THANKING`)**: Mantida a pose de comemoração com o balão `THANK YOU!` e o drop parabólico da caixa militar de armas.
  - **Fuga Desenfreada (`ESCAPING`)**: Ativa a animação de 8 quadros a 14 FPS, acelerando em retirada a 160 px/s com escala 0.95, sombra de solo proporcional e alinhamento de base de pés.

---

## 💊 17. Médica de Suprimentos Rumi Aikawa & Kit de Cura (+30% HP)

- [x] **Sprite Sheet Oficial de Rumi Aikawa (`assets/rumi_sheet.png`)**:
  - Folha clássica completa da garota da mochila militar com canal alfa transparente.
  - 16 quadros de caminhada com mochila pesada (`WALK`), 11 quadros de tropeço/queda e desprendimento da mochila (`FALL`) e 9 quadros de fuga sem mochila (`FLEE`).
- [x] **Inclusão Estratégica em Todas as Fases (`MedicNPC`)**:
  - **Fase 1**: `x = 1600` (meio do caminho antes do Tanque Girida-O).
  - **Fase 2**: `x = 2000` (entre os ninhos de snipers e antes do Helicóptero R-Shobu).
  - **Fase 3**: `x = 1900` (área de confronto intermediário na fábrica).
- [x] **Mecânica de Drop e Recuperação de Vida**:
  - Ao ser atingida ou eliminada, Rumi tropeça, solta a mochila e ejeta o **Kit Médico de Primeiros Socorros** (`SupplyBox` estilo `MEDKIT` branco com cruz vermelha `+`).
  - Ao coletar o kit, o jogador regenera **30% de seu HP máximo** (+3 HP), com explosão verde de cura, áudio comemorativo e texto flutuante de confirmação.
- [x] **Orientação Correta de Corrida de Fuga (Eliminação de Moonwalk)**:
  - Compensada a orientação nativa para a esquerda dos quadros de `FLEE` em `js/medic.js`.
  - A médica agora corre de frente na direção de sua velocidade (`vx`), com detecção do lado do impacto para fugir longe do perigo.





