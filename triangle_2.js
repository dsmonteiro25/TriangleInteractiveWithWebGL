var gl;
var translation = [0, 0];
var angle = 0;
var scale = 1.0;
var dragging = false;
var dragStart = [0, 0];
var center = [0, 0];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Definição dos vértices do triângulo
    var vertices = [
        vec2(-0.5, -0.5),
        vec2(0, 0.5),
        vec2(0.5, -0.5),
    ];

    // Calcular o baricentro do triângulo
    center[0] = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
    center[1] = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;

    // Configuração do WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Carregar shaders e inicializar buffers de atributos
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Enviar os dados para a GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associar variáveis do shader aos dados do buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Obter localização das variáveis uniformes
    var uTranslation = gl.getUniformLocation(program, "uTranslation");
    var uAngle = gl.getUniformLocation(program, "uAngle");
    var uCenter = gl.getUniformLocation(program, "uCenter");

    // Atualizar tradução, rotação e escala, e renderizar o triângulo
    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2fv(uTranslation, translation);
        gl.uniform1f(uAngle, angle);
        gl.uniform2fv(uCenter, center);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Manipuladores de eventos de mouse
    canvas.addEventListener("mousedown", function (event) {
        dragging = true;
        dragStart = [event.clientX, event.clientY];
    });

    canvas.addEventListener("mousemove", function (event) {
        if (dragging) {
            var dx = (event.clientX - dragStart[0]) / canvas.width * 2;
            var dy = -(event.clientY - dragStart[1]) / canvas.height * 2;

            // Calcular o deslocamento considerando a rotação atual
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);
            var deltaX = dx * cosAngle + dy * sinAngle;
            var deltaY = -dx * sinAngle + dy * cosAngle;

            translation[0] += deltaX;
            translation[1] += deltaY;
            dragStart = [event.clientX, event.clientY];
            update();
        }
    });

    canvas.addEventListener("mouseup", function () {
        dragging = false;
    });

    // Manipuladores de eventos de teclado para rotação
    window.addEventListener("keydown", function (event) {
        var rotationSpeed = 0.1; // Ajuste a velocidade da rotação conforme necessário
        if (event.key === "ArrowRight") {
            angle -= rotationSpeed;
        } else if (event.key === "ArrowLeft") {
            angle += rotationSpeed;
        }
        update();
    });

    update();
};
