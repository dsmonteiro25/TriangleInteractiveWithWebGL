var gl;
var translation = [0, 0];
var angle = 0;
var scale = 1.0;
var dragging = false;
var dragStart = [0, 0];
var center = [0, 0];
var vertices = [
    vec2(-0.5, -0.5),
    vec2(0, 0.5),
    vec2(0.5, -0.5),
];


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Calcular o baricentro do triângulo
    center[0] = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
    center[1] = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;

    // Configuração do WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var uTranslation = gl.getUniformLocation(program, "uTranslation");
    var uAngle = gl.getUniformLocation(program, "uAngle");
    var uScale = gl.getUniformLocation(program, "uScale");
    var uCenter = gl.getUniformLocation(program, "uCenter");

    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2fv(uTranslation, translation);
        gl.uniform1f(uAngle, angle);
        gl.uniform1f(uScale, scale);
        gl.uniform2fv(uCenter, center);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Botões para escalar
    document.getElementById("scaleUp").onclick = function () {
        scale += 0.1;
        update();
    };
    document.getElementById("scaleDown").onclick = function () {
        if (scale > 0.1) {
            scale -= 0.1;
            update();
        }
    };

    // Eventos de mouse para arrastar
    canvas.addEventListener("mousedown", function (event) {
        dragStart = [event.clientX, event.clientY];
        dragging = true;
    });

    canvas.addEventListener("mousemove", function (event) {
        if (dragging) {
            var dx = (event.clientX - dragStart[0]) / canvas.width * 2;
            var dy = -(event.clientY - dragStart[1]) / canvas.height * 2;
            translation[0] += dx;
            translation[1] += dy;
            dragStart = [event.clientX, event.clientY];
            update();
        }
    });

    canvas.addEventListener("mouseup", function () {
        dragging = false;
    });

    // Teclado para rotação
    window.addEventListener("keydown", function (event) {
        var rotationSpeed = 0.1;
        if (event.key === "ArrowRight") {
            angle -= rotationSpeed;
        } else if (event.key === "ArrowLeft") {
            angle += rotationSpeed;
        }
        update();
    });

    update();
};
