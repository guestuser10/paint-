document.addEventListener("DOMContentLoaded", function () {
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
    let tempX2, tempY2;
    let selectedMode = null;

    let history = [];
    
    let currentDraw = [];
    let historyIndex = -1;


    document.getElementById("lineaBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "linea";
    });

    document.getElementById("sqrBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "sqr";
    });

    document.getElementById("rectBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "rect";
    });

    document.getElementById("circleBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "circle";
    });

    this.getElementById("polybtn").addEventListener("click", function () {
        sidefilter.style.visibility = "visible";
        selectedMode = "poly";
    });

    this.getElementById("ovalBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "ova";
    });

    document.getElementById("un_Btn").addEventListener("click", function () {
        if (historyIndex > 0) {
            historyIndex--;
            printHistory();
        }
    });

    document.getElementById("clr_Btn").addEventListener("click", function () {
        clearCanvas(ctx, canvas);
        history = [];
        currentDraw = [];
        historyIndex = -1;
    });
    
    
    document.getElementById("re_Btn").addEventListener("click", function () {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            printHistory();
        }
    });

    this.getElementById("sides").addEventListener("change", function () {
        sidenum = document.getElementById("sides").value;
    });

    basecolorInput.addEventListener("change", function () {
        const colorInput = document.getElementById("color");
        color = colorInput.value;
    });

    basewidthInput.addEventListener("change", function () {
        const widthInput = document.getElementById("grosor");
        grosor = widthInput.value;
    });

    function getCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);
        return { x, y };
    }

    function startDrawing(event) {
        isDrawing = true;
        const { x, y } = getCoordinates(event);
        x1 = x;
        y1 = y;
        tempX2 = x1;
        tempY2 = y1;
    }

    function draw(event) {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(event);
        tempX2 = x;
        tempY2 = y;

        // Limpiar el lienzo y dibujar la previsualización
        printHistory();
        drawPreview();
    }

    function stopDrawing(event) {
        if (!isDrawing) return;
        isDrawing = false;
        const { x: x2, y: y2 } = getCoordinates(event);

        const shape = { x1, y1, x2, y2, color, grosor, sides};
        switch (selectedMode) {
            case "linea":
                currentDraw.push({ ...shape, sides: 2, type: "linea" });
                break;
            case "sqr":
                currentDraw.push({ ...shape, sides: 4, type: "sqr" });
                break;
            case "rect":
                currentDraw.push({ ...shape, sides: 4, type: "rect" });
                break;
            case "circle":
                const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                currentDraw.push({ ...shape, sides: 1, type: "circle", r });
                break;
            case "poly":
                currentDraw.push({ ...shape, type: "poly", sides: sidenum });
                break;
            case "ova":
                currentDraw.push({ ...shape, sides: 1, type: "ova" });
                break;
            default:
                break;
        }
        if (currentDraw.length > 0) {
            history.splice(historyIndex + 1); // Elimina los elementos después de la posición actual en el historial
            history.push(...currentDraw);
            historyIndex = history.length - 1;

            printHistory();
            currentDraw = [];
        }
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    canvas.addEventListener("touchstart", (event) => startDrawing(event.touches[0]));
    canvas.addEventListener("touchmove", (event) => draw(event.touches[0]));
    canvas.addEventListener("touchend", (event) => stopDrawing(event.changedTouches[0]));

    function drawShape(shape, ctx, color, grosor, x1, y1, x2, y2, sides) {
        switch (shape) {
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
                drawPolygon(x1, y1, sides, ctx, color, grosor, x2, y2);
                break;
            case "ova":
                oval(x1, y1, x2, y2, ctx, color, grosor);
                break;
            default:
                break;
        }
    }

    function drawPreview() {
        if (selectedMode === "poly") {
            drawPolygon(x1, y1, sidenum, ctx, color, grosor, tempX2, tempY2);
        } else {
            drawShape(selectedMode, ctx, color, grosor, x1, y1, tempX2, tempY2);
        }
    }

    function printHistory() {
        clearCanvas(ctx, canvas);
        for (let i = 0; i <= historyIndex; i++) {
            const draw = history[i];
            drawShape(draw.type, ctx, draw.color, draw.grosor, draw.x1, draw.y1, draw.x2, draw.y2, draw.sides);
        }
    }
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

    dda(x, y, x1, y, ctx, color, grosor);
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
function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}