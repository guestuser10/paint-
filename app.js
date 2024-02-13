document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const basecolorInput = document.getElementById("color");
    var color = basecolorInput.value;
    
    const basewidthInput = document.getElementById("grosor");
    var grosor = basewidthInput.value;

    const sidefilter = document.getElementById("sidefilter");
    var sidenum = document.getElementById("sides").value;

    let isDrawing = false;
    let x1, y1;
    let selectedMode = null;

    document.getElementById("lineaBtn").addEventListener("click", function() {
        sidefilter.style.visibility = "hidden";
        selectedMode = "linea";
    });

    document.getElementById("sqrBtn").addEventListener("click", function() {
        sidefilter.style.visibility = "hidden";
        selectedMode = "sqr";
    });

    document.getElementById("rectBtn").addEventListener("click", function() {
        sidefilter.style.visibility = "hidden";
        selectedMode = "rect";
    });
    
    document.getElementById("circleBtn").addEventListener("click", function() {
        sidefilter.style.visibility = "hidden";
        selectedMode = "circle";
    });
    this.getElementById("polybtn").addEventListener("click", function() {
        sidefilter.style.visibility = "visible";
        selectedMode = "poly";

    });
    this.getElementById("ovalBtn").addEventListener("click", function() {
        selectedMode = "ova";

    });
    this.getElementById("sides").addEventListener("change", function() {
        sidenum = document.getElementById("sides").value;
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
                        circleBres(x1, y1, r, ctx, color, grosor);
                        break;
                    case "poly":   
                        drawPolygon(x1, y1, sidenum, ctx, color, grosor, x2, y2);
                        break;
                    case "ova":   
                        oval(x1, y1, x2, y2, ctx, color, grosor);
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
function Circle(xc, yc, x, y, ctx, color, grosor) {
    ctx.fillStyle = color;
    ctx.fillRect(xc + x, yc + y, grosor, grosor);
    ctx.fillRect(xc - x, yc + y, grosor, grosor);
    ctx.fillRect(xc + x, yc - y, grosor, grosor);
    ctx.fillRect(xc - x, yc - y, grosor, grosor);
    ctx.fillRect(xc + y, yc + x, grosor, grosor);
    ctx.fillRect(xc - y, yc + x, grosor, grosor);
    ctx.fillRect(xc + y, yc - x, grosor, grosor);
    ctx.fillRect(xc - y, yc - x, grosor, grosor);
}

function circleBres(xc, yc, r, ctx, color, grosor) {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    
    Circle(xc, yc, x, y, ctx, color, grosor);
    
    while (y >= x) {
        x++;
        
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        
        Circle(xc, yc, x, y, ctx, color, grosor);
    }
}
function drawPolygon(x1, y1, sides, ctx, color, grosor, x2, y2) {
    const centerX = x1;
    const centerY = y1;
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const angle = (2 * Math.PI) / sides;
    
    for (let i = 0; i < sides; i++) {
        const startX = centerX + radius * Math.cos(i * angle);
        const startY = centerY + radius * Math.sin(i * angle);

        const endX = centerX + radius * Math.cos((i + 1) * angle);
        const endY = centerY + radius * Math.sin((i + 1) * angle);

        dda(startX, startY, endX, endY, ctx, color, grosor);
    }
}
function oval(x1, y1, x2, y2,ctx, color, grosor) {
    ctx.fillStyle = color;
    let a = Math.abs(x2 - x1);
    let b = Math.abs(y2 - y1);
    let b1 = b & 1;
    let dx = 4 * (1 - a) * b * b;
    let dy = 4 * (b1 + 1) * a * a;
    let err = dx + dy + b1 * a * a;
    let e2;

    let aTimes8 = 8 * a;
    let b1Times8 = 8 * b * b;

    [x1, x2] = x1 > x2 ? [x2, x2 + a] : [x1, x2];
    y1 = Math.min(y1, y2);

    y1 += (b + 1) / 2;
    y2 = y1 - b1;
    aTimes8 = 8 * a;
    b1Times8 = 8 * b * b;

    do {
        ctx.fillRect(x2, y1, grosor,grosor);
        ctx.fillRect(x1, y1, grosor,grosor);
        ctx.fillRect(x1, y2, grosor,grosor);
        ctx.fillRect(x2, y2, grosor,grosor);
        e2 = 2 * err;

        if (e2 <= dy) {
            y1++;
            y2--;
            err += dy += aTimes8;
        }

        if (e2 >= dx || 2 * err > dy) {
            x1++;
            x2--;
            err += dx += b1Times8;
        }
    } while (x1 <= x2);

    while (y1 - y2 < b) {
        ctx.fillRect(x1 - 1, y1, grosor,grosor);
        ctx.fillRect(x2 + 1, y1++, grosor,grosor);
        ctx.fillRect(x1 - 1, y2, grosor,grosor);
        ctx.fillRect(x2 + 1, y2--, grosor,grosor);
    }
}
