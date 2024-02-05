document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const basecolorInput = document.getElementById("color");
    var color = basecolorInput.value;

    const basewidthInput = document.getElementById("grosor");
    var grosor = basewidthInput.value;

    let isDrawing = false;
    let x1, y1;
    let selectedMode = null;

    document.getElementById("lineaBtn").addEventListener("click", function() {
        selectedMode = "linea";
    });

    document.getElementById("sqrBtn").addEventListener("click", function() {
        selectedMode = "sqr";
    });

    document.getElementById("rectBtn").addEventListener("click", function() {
        selectedMode = "rect";
    });
    
    document.getElementById("circleBtn").addEventListener("click", function() {
        selectedMode = "circle";
    });

    basecolorInput.addEventListener("change", function() {
        const colorInput = document.getElementById("color");
        color = colorInput.value;
    });
    basewidthInput.addEventListener("change", function() {
        const widthInput = document.getElementById("grosor");
        grosor = widthInput.value;
    });


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

                switch (selectedMode) {
                    case "linea":
                        dda(x1, y1, x2, y2, ctx, color, grosor);
                        break;
                    case "sqr":
                        scuer(x1, y1, x2, y2, ctx, color, grosor);
                        break;
                    case "rect":
                        rectangle(x1, y1, x2, y2, ctx, color, grosor);
                        break;
                    case "circle":
                        const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                        circleBres(x1, y1, r, ctx);
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

function dda(x, y, x2, y2, ctx, color, width) {
    ctx.linewidth = width;
    console.log(width)
    ctx.fillStyle = color;
    const dx = x2 - x;
    const dy = y2 - y;

    const pasos = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
    
    if (pasos === 0) {
        ctx.fillRect(Math.round(x), Math.round(y), width, width);
        return;
    }
    const xInc = dx / pasos;
    const yInc = dy / pasos;
    
    for (let i = 0; i <= pasos; i++) {
        const yPos = y >= 0 ? y : Math.abs(y);
        ctx.fillRect(Math.round(x), Math.round(yPos), width, width);
        x += xInc;
        y += yInc;
    }
}
//cuadrado
function scuer(x, y, x2, y2, ctx, color, grosor) {
    let length = Math.min(Math.abs(x2 - x), Math.abs(y2 - y));
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + length * xSign;
    let y1 = y + length * ySign;

    dda(x, y, x1, y, ctx , color, grosor);
    dda(x1, y, x1, y1, ctx, color, grosor);
    dda(x1, y1, x, y1, ctx, color, grosor);
    dda(x, y1, x, y, ctx, color, grosor);
}

//rectangle
function rectangle(x, y, x2, y2, ctx , color, grosor) {
    let width = Math.abs(x2 - x);
    let height = Math.abs(y2 - y);
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + width * xSign;
    let y1 = y + height * ySign;

    dda(x, y, x1, y, ctx, color, grosor); 
    dda(x1, y, x1, y1, ctx, color, grosor); 
    dda(x1, y1, x, y1, ctx, color, grosor); 
    dda(x, y1, x, y, ctx, color, grosor); 
}
// circle
function Circle(xc, yc, x, y, ctx) {
    ctx.fillRect(xc + x, yc + y, 1, 1);
    ctx.fillRect(xc - x, yc + y, 1, 1);
    ctx.fillRect(xc + x, yc - y, 1, 1);
    ctx.fillRect(xc - x, yc - y, 1, 1);
    ctx.fillRect(xc + y, yc + x, 1, 1);
    ctx.fillRect(xc - y, yc + x, 1, 1);
    ctx.fillRect(xc + y, yc - x, 1, 1);
    ctx.fillRect(xc - y, yc - x, 1, 1);
}

function circleBres(xc, yc, r, ctx) {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    
    Circle(xc, yc, x, y, ctx);
    
    while (y >= x) {
        x++;
        
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        
        Circle(xc, yc, x, y, ctx);
    }
}
