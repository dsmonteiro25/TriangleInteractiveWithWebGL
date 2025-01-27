# Transformação de Triângulo em WebGL

Este projeto demonstra como manipular um triângulo em WebGL utilizando transformações de translação, rotação e escala. O triângulo é renderizado em um canvas HTML5 e pode ser interagido através de eventos de mouse e teclado.

## Funcionalidades
- **Escala**: Aumentar ou diminuir o tamanho do triângulo usando os botões fornecidos.
- **Rotação**: Rotacionar o triângulo para a esquerda ou para a direita utilizando as teclas de seta.
- **Translação**: Clicar e arrastar para mover o triângulo pelo canvas.

## Tecnologias Utilizadas
- **WebGL**: Para renderizar o triângulo e aplicar as transformações.
- **JavaScript**: Para manipulação dos eventos de interação e lógica das transformações.
- **Canvas HTML5**: Para desenhar o triângulo.

## Como Usar

Para executar o projeto, basta abrir o arquivo `index.html` em um navegador moderno que suporte WebGL.

### Arquivos:
- `index.html`: Contém a estrutura da página e as referências aos shaders e arquivos JavaScript.
- `triangle_2.js`: Contém a lógica JavaScript para configurar o WebGL e manipular as transformações.

## Shaders
1. **Vertex Shader** (`vertex-shader`):
   - Realiza as transformações do triângulo (translação, rotação e escala).
   - Calcula a posição final com base nos valores de uniformes fornecidos.

2. **Fragment Shader** (`fragment-shader`):
   - Define a cor do triângulo como azul.

## JavaScript
O script é responsável por:
- Inicializar o contexto WebGL.
- Enviar os dados dos vértices para a GPU.
- Manipular os eventos de mouse e teclado para interação com o usuário.
- Desenhar o triângulo e aplicar as transformações de acordo com a entrada do usuário.

### Controles:
- **Aumentar Escala**: Aumenta o tamanho do triângulo em 0.1.
- **Reduzir Escala**: Diminui o tamanho do triângulo em 0.1 (não é possível reduzir abaixo de 0.1).
- **Teclas de Seta**: Rotaciona o triângulo para a esquerda ou direita.
- **Clique e Arraste**: Move o triângulo pelo canvas.

## Requisitos
- Um navegador moderno que suporte WebGL (por exemplo, Chrome, Firefox ou Safari).

## Licença
Este projeto foi desenvolvido por **Daniel Monteiro** e está disponível para fins educacionais.
