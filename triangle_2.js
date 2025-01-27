// Developed by Daniel Monteiro
var gl;
var translation = [0, 0];
var angle = 0;
var scale = 1.0;
var dragging = false;
var dragStart = [0, 0];
var center = [0, 0];
var vertices = [
    vec2(-0.3, -0.3),
    vec2(0, 0.3),
    vec2(0.3, -0.3),
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

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var Translation = gl.getUniformLocation(program, "Translation");
    var Angle = gl.getUniformLocation(program, "Angle");
    var Scale = gl.getUniformLocation(program, "Scale");
    var Center = gl.getUniformLocation(program, "Center");

    document.getElementById("scaleUp").onclick = function () {  // Escala
        scale = scale + 0.1;
        render();
    };
    document.getElementById("scaleDown").onclick = function () {
        if (scale > 0.1) {
            scale = scale - 0.1;
            render();
        }
    };

     window.addEventListener("keydown", function (event) {  // Rotação
        var rotationSpeed = 0.1;
        if (event.key === "ArrowRight") {
            angle = angle - rotationSpeed;
        } else if (event.key === "ArrowLeft") {
            angle = angle + rotationSpeed;
        }
        render();
    });

    canvas.addEventListener("mousedown", function (event) {  // Translação com o clicar e arrastar(OBS: Negocio dificil demais rsrsrs)
        var bbox = canvas.getBoundingClientRect();
        var x = 2 * (event.clientX - bbox.left) / canvas.width - 1;
        var y = 2 * (canvas.height - (event.clientY - bbox.top)) / canvas.height - 1;

        var transformedVertices = vertices.map(function(vertex) {
            return vec2(
                vertex[0] + translation[0],
                vertex[1] + translation[1]
            );
        });

        if (clickTriangle(x, y, transformedVertices)) {
            dragStart = [event.clientX, event.clientY];
            dragging = true;
        }
    });

    canvas.addEventListener("mousemove", function (event) {
        if (dragging) {
            var dx = (event.clientX - dragStart[0]) / canvas.width * 2;
            var dy = -(event.clientY - dragStart[1]) / canvas.height * 2;
            translation[0] += dx;
            translation[1] += dy;
            dragStart = [event.clientX, event.clientY];
            render();
        }
    });

    canvas.addEventListener("mouseup", function () {
        dragging = false;
    });

    function clickTriangle(px, py, vertices) {
        function sign(p1, p2, p3) {
            return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
        }
    
        var b1, b2, b3;
        b1 = sign([px, py], vertices[0], vertices[1]) < 0.0;
        b2 = sign([px, py], vertices[1], vertices[2]) < 0.0;
        b3 = sign([px, py], vertices[2], vertices[0]) < 0.0;
    
        return ((b1 == b2) && (b2 == b3));
    }

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2fv(Translation, translation);
        gl.uniform1f(Angle, angle);
        gl.uniform1f(Scale, scale);
        gl.uniform2fv(Center, center);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    render();
};
