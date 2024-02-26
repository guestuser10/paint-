import {dda, scuer, rectangle, circleBres, drawPolygon, oval, clearCanvas } from './shapes.js';
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