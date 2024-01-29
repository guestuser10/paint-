document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    
    let isDrawing = false;
    let x1, y1;
    let selectedMode = null;

    // Manejar el clic en el enlace "linea"
    document.getElementById("lineaBtn").addEventListener("click", function() {
        selectedMode = "linea";
    });

    // Manejar el clic en el enlace "sqr"
    document.getElementById("sqrBtn").addEventListener("click", function() {
        selectedMode = "sqr";
    });

    // Manejar el clic en el enlace "rect"
    document.getElementById("rectBtn").addEventListener("click", function() {
        selectedMode = "rect";
    });

    // Manejar el clic en el canvas
    canvas.addEventListener("click", function(event) {
        if (selectedMode) {
            if (!isDrawing) {
                isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                x1 = Math.round(event.clientX - rect.left);
                y1 = Math.round(event.clientY - rect.top);
            } else {
                isDrawing = false;
                const rect = canvas.getBoundingClientRect();
                const x2 = Math.round(event.clientX - rect.left);
                const y2 = Math.round(event.clientY - rect.top);

                // Llamar a la función correspondiente según el modo seleccionado
                switch (selectedMode) {
                    case "linea":
                        bresenham(x1, y1, x2, y2, ctx);
                        break;
                    case "sqr":
                        scuer(x1, y1, x2, y2, ctx);
                        break;
                    case "rect":
                        rectangle(x1, y1, x2, y2, ctx);
                        break;
                    default:
                        break;
                }
            }
        }
    });
});

//liena
function bresenham(x1, y1, x2, y2, ctx) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;

    let err = dx - dy;

    while (true) {
        ctx.fillRect(x1, y1, 1, 1);

        if (x1 === x2 && y1 === y2) {
            break;
        }

        const e2 = 2 * err;

        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
}

function dda(x, y, x2, y2, ctx) {
    const dx = x2 - x;
    const dy = y2 - y;

    const pasos = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    if (pasos === 0) {
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
        return;
    }
    const xInc = dx / pasos;
    const yInc = dy / pasos;
    
    for (let i = 0; i <= pasos; i++) {
        const yPos = y >= 0 ? y : Math.abs(y);
        ctx.fillRect(Math.round(x), Math.round(yPos), 1, 1);
        x += xInc;
        y += yInc;
    }
}
//cuadrado
function scuer(x, y, x2, y2, ctx) {
    let length = Math.min(Math.abs(x2 - x), Math.abs(y2 - y));
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + length * xSign;
    let y1 = y + length * ySign;

    bresenham(x, y, x1, y, ctx);
    bresenham(x1, y, x1, y1, ctx);
    bresenham(x1, y1, x, y1, ctx);
    bresenham(x, y1, x, y, ctx);
}

//rectangle
function rectangle(x, y, x2, y2, ctx) {
    let width = Math.abs(x2 - x);
    let height = Math.abs(y2 - y);
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + width * xSign;
    let y1 = y + height * ySign;

    bresenham(x, y, x1, y, ctx); 
    bresenham(x1, y, x1, y1, ctx); 
    bresenham(x1, y1, x, y1, ctx); 
    bresenham(x, y1, x, y, ctx); 
}