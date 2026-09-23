<div align="center">
  <h1>Metal Slug 2D - Run and Gun</h1>
  <p><b>HTML5 Canvas & Pure JavaScript</b></p>
</div>

Uma experiência de ação arcade frenética 2D no estilo *Run and Gun*, fortemente inspirada no clássico **Metal Slug**[cite: 5]. O projeto é construído em **HTML5 Canvas estritamente otimizado** e **JavaScript moderno (ES6+)**, sem dependências externas, focando em performance de 60 FPS, física responsiva e tiros multidirecionais[cite: 5].

Projeto desenvolvido como requisito de avaliação (NI1) para o curso de Análise e Desenvolvimento de Sistemas da FECAP, pela organização acadêmica `2026-1-NADS4`.

---

## 📑 Sumário
1. [Visão Geral e Conceito](#-visão-geral-e-conceito)[cite: 5]
2. [Controles do Jogador](#-controles-do-jogador)[cite: 5]
3. [Sistema de Arsenal e Power-ups](#-sistema-de-arsenal-e-power-ups)[cite: 5]
4. [Escopo Fechado das Fases](#-escopo-fechado-das-fases)[cite: 5]
5. [Arquitetura de Código e POO](#-arquitetura-de-código-e-poo)[cite: 5]
6. [Uso de Inteligência Artificial](#-uso-de-inteligência-artificial)
7. [Créditos e Assets](#-créditos-e-assets)

---

## 🎮 Visão Geral e Conceito
O jogo coloca o jogador no papel de um soldado de elite enfrentando hordas de inimigos em cenários 2D de rolagem lateral (side-scrolling)[cite: 5]. O núcleo do gameplay baseia-se na movimentação agilizada, no desvio de projéteis (*bullet hell light*), no aproveitamento de cobertura/plataformas e no gerenciamento estratégico de munições e armas especiais[cite: 5].

---

## 🕹️ Controles do Jogador

| Ação | Teclas Primárias | Teclas Alternativas | Descrição |
| :--- | :--- | :--- | :--- |
| **Mover para Esquerda** | `A` | `Seta Esquerda` | Move o soldado para a esquerda[cite: 5] |
| **Mover para Direita** | `D` | `Seta Direita` | Move o soldado para a direita[cite: 5] |
| **Agachar** | `S` | `Seta Para Baixo` | Reduz o hitbox pela metade e permite atirar agachado[cite: 5] |
| **Mirar para Cima** | `W` | `Seta Para Cima` | Direciona os disparos para cima ou diagonais[cite: 5] |
| **Pular** | `K` | `Espaço` | Salto com vetor de impulso vertical[cite: 5] |
| **Atirar** | `J` | `Z` | Dispara a arma atual na direção apontada[cite: 5] |
| **Trocar / Largar Arma** | `L` | `X` | Alterna para a pistola padrão se a munição especial acabar[cite: 5] |

### 🎯 Mira Multidirecional
* **Horizontal**: Atira para frente ou para trás baseando-se no lado em que o personagem está virado[cite: 5].
* **Vertical Superior**: Pressione `W` ou `Seta Cima` para disparar diretamente a 90°[cite: 5].
* **Diagonais**: Combine movimento horizontal (`A`/`D`) + mira para cima (`W`) para disparar a 45°[cite: 5].
* **Disparo para Baixo (No Ar)**: Durante o pulo, pressione `S` + Atirar para disparar a 90° em direção ao solo (útil para eliminar inimigos abaixo)[cite: 5].

---

## 🔫 Sistema de Arsenal e Power-ups

| Arma | Ícone / Tipo | Cadência & Tipo de Tiro | Comportamento & Efeitos |
| :--- | :--- | :--- | :--- |
| **Pistola Padrão** | 🔫 *Standard* | Manual (1 tiro por clique)[cite: 5] | Munição infinita. Dano baixo/médio, projétil único direto[cite: 5]. |
| **Heavy Machine Gun (HMG)** | 🔄 *Automatic* | Alta Cadência (Automático ao segurar)[cite: 5] | Coletável. Disparo rápido com leve espalhamento angular (spread aleatório de 2°). Excelente contra hordas[cite: 5]. |
| **Shotgun (Escopeta)** | 💥 *Spread* | Média Cadência (Manual)[cite: 5] | Coletável. Dispara um cone de 5 a 7 projéteis simultâneos com alto dano de impacto à curta distância e alto *knockback*[cite: 5]. |
| **Bazuca (Heavy Launcher)** | 🚀 *Heavy / Splash* | Baixa Cadência (Manual)[cite: 5] | **Exclusiva da Fase 3**. Lança projétil balístico pesado que estoura em um raio de explosão (Dano em Área / *Splash Damage*), destruindo estruturas e múltiplos alvos[cite: 5]. |

---

## 🗺️ Escopo Fechado das Fases

O jogo é estruturado rigidamente em **3 Fases progressivas**, garantindo fechamento de escopo e curva de desafio ascendente[cite: 5]:

### 🏜️ Fase 1: O Deserto de Operações (Avanço Inicial)
* **Tema Visual**: Dunas, ruínas de pedra e acampamentos inimigos[cite: 5].
* **Inimigos**: Soldados de infantaria leve (marchem e atiram), granadeiros e barricadas simples[cite: 5].
* **Chefe de Fase**: *Tanque Médio Rebelde* com torre de canhão móvel e metralhadora lateral[cite: 5].

### 🏙️ Fase 2: A Cidade em Ruínas (Verticalidade & Armadilhas)
* **Tema Visual**: Cenário urbano destruído, pontes suspensas, prédios com múltiplos andares[cite: 5].
* **Inimigos**: Snipers nas janelas, helicópteros de ataque e soldados com escudos antidistúrbio[cite: 5].
* **Chefe de Fase**: *Helicóptero de Combat Gunship* operando ataques em varredura horizontal e mísseis guiados[cite: 5].

### 🏭 Fase 3: A Base Militar Subterrânea (Confronto Final)
* **Tema Visual**: Instalação tecnológica com lasers, plataformas móveis e esteiras[cite: 5].
* **Inimigos**: Elites armados com Bazucas, torres automáticas de teto e mechs leves[cite: 5].
* **Arsenal Liberado**: Bazuca pesada disponibilizada através de caixas de suprimentos[cite: 5].
* **Chefe Final**: *Super Mech de Combate (Metal Fortress)* com 3 fases de destruição (canhões duplos, lasers e tempestade de mísseis)[cite: 5].

---

## 🏗️ Arquitetura de Código e POO

O desenvolvimento seguiu rigorosamente os pilares da **Programação Orientada a Objetos (POO)**:
* **Classes e Objetos**: Estruturação modular dividida em `main.js`, `player.js` e `enemy.js`.
* **Herança (`extends`)**: Implementação de uma superclasse `Entidade` que fornece os atributos base (posição X/Y, vida, dimensões) herdados pelas subclasses `Player` e `Enemy`.
* **Polimorfismo**: Sobrescrita de métodos essenciais, como `takeDamage()` e `die()`, permitindo que o jogador sofra dano fixo, enquanto inimigos com escudos e chefes possuem lógicas complexas de fases e dano em área.

**Tecnologias Adicionais:**
* **Core Engine**: Game Loop com `requestAnimationFrame`, baseado em *Delta Time* para taxa de atualização consistente[cite: 5].
* **Renderizador**: Canvas 2D Context (`ctx`) com suporte a parallaax background, câmeras de acompanhamento e camadas de renderização (Background -> Entidades -> FX -> UI)[cite: 5].
* **Física**: Caixa de colisão AABB (Axis-Aligned Bounding Box), vetores de gravidade, fricção de solo e verificação de plataformas passáveis[cite: 5].
* **State Manager**: Gerenciamento de telas (Menu Inicial, Gameplay, Transição de Fase, Game Over, Vitória)[cite: 5].

---

## 🤖 Uso de Inteligência Artificial
Conforme os requisitos da avaliação, o grupo utilizou ferramentas de IA generativa no processo de desenvolvimento:
* **Google Gemini**: Utilizado extensivamente como parceiro de programação no Antigravity, estruturando o Game Loop, aplicando texturas de *sprite sheets* complexas (como o chefe final mecânico) e organizando a documentação.
* **[INSERIR SEGUNDA IA AQUI - Ex: ChatGPT/Claude]**: Utilizado para [Descrever brevemente o que foi gerado, ex: revisar a lógica de colisão e comparar com o código inicial]. 
* *Nota: Os prompts, comparações de código e resultados obtidos estão detalhados no relatório da apresentação e nos arquivos `correcao_de_bugs.md` e `melhorias_no_jogo.md`.*

---

## 🎨 Créditos e Assets
Para manter o rigor visual profissional exigido, foram utilizados *assets* de terceiros com os devidos créditos:
* **The Spriters Resource (SNK Corporation):** Arte gráfica 2D (Sprite sheets, Backgrounds e UI) baseada na franquia Metal Slug (incluindo o robô final, aeronaves de combate e infantaria rebelde).
* **Google Fonts:** Tipografia da interface ("Press Start 2P").
* *Todo o código lógico, mecânicas físicas e motores de renderização foram programados de raiz pelo grupo, utilizando os recursos visuais unicamente para fins estéticos e acadêmicos.*

---
**Autores:**
* Pedro Augusto da Silva Macedo
* [Nome do Integrante 2]
* [Nome do Integrante 3]
* [Nome do Integrante 4 (Opcional)]
* [Nome do Integrante 5 (Opcional)]
