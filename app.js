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

    let isMoving = false
    let selectedShape = null; 

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

    document.getElementById("moveBtn").addEventListener("click", function () {
        selectedMode = "move";
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
        const { x, y } = getCoordinates(event);
        if (selectedMode === "move") {
            // Selecciona la forma en las coordenadas del evento
            selectedShape = selectShape(x, y);
            isMoving = true;
        } else {
            isDrawing = true;
            x1 = x;
            y1 = y;
            tempX2 = x1;
            tempY2 = y1;
        }
    }

    function draw(event) {
        const { x, y } = getCoordinates(event);
        if (selectedMode === "move" && isMoving && selectedShape) {
            // Mueve la forma seleccionada a las coordenadas del evento
            moveShape(selectedShape, x, y);
            printHistory();
            drawPreview();
        } else if (isDrawing) {
            tempX2 = x;
            tempY2 = y;
            printHistory();
            drawPreview();
        }
    }

    function stopDrawing(event) {
        if (selectedMode === "move" && isMoving) {
            // Finaliza el movimiento de la forma
            isMoving = false;
        } else if (isDrawing) {
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
                    const points = calculatePolygonPoints(x1, y1, x2, y2, sidenum);
                    currentDraw.push({ ...shape, type: "poly", sides: sidenum, points});
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

    function selectShape(x, y) {
        // Recorre el array de formas
        for (let i = 0; i < history.length; i++) {
            const shape = history[i];
            // Comprueba si las coordenadas dadas están dentro de la forma
            if (isInsideShape(x, y, shape)) {
                return shape;
            }
        }
        return null;
    }

    function moveShape(shape, x, y) {
        // Actualiza las coordenadas de la forma
        const dx = x - shape.x1;
        const dy = y - shape.y1;
        shape.x1 += dx;
        shape.y1 += dy;
        shape.x2 += dx;
        shape.y2 += dy;

        // Si la forma es un polígono, actualiza las coordenadas de los puntos
        if (shape.type === "poly") {
            for (let i = 0; i < shape.points.length; i++) {
                shape.points[i].x += dx;
                shape.points[i].y += dy;
            }
        }
    }

    function isInsideShape(x, y, shape) {
        switch (shape.type) {
            case "linea":
                // Para una línea, comprobamos si el punto está cerca de la línea dentro de un cierto margen de error
                const dist = Math.abs((shape.y2 - shape.y1) * x - (shape.x2 - shape.x1) * y + shape.x2 * shape.y1 - shape.y2 * shape.x1) / Math.sqrt(Math.pow(shape.y2 - shape.y1, 2) + Math.pow(shape.x2 - shape.x1, 2));
                return dist <= 5; // Aquí, 5 es el margen de error
            case "sqr":
            case "rect":
                // Para un rectángulo o un cuadrado, puedes usar la misma lógica
                return x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2;
            case "circle":
                // Para un círculo, comprueba si la distancia al centro es menor o igual que el radio
                const dx = x - shape.x1;
                const dy = y - shape.y1;
                return Math.sqrt(dx * dx + dy * dy) <= shape.r;
            case "poly":
                // Para un polígono, puedes usar el algoritmo de ray casting
                if (!shape.points) {
                    console.error('El polígono no tiene puntos definidos');
                    return false;
                }
                let inside = false;
                for (let i = 0, j = shape.points.length - 1; i < shape.points.length; j = i++) {
                    const xi = shape.points[i].x, yi = shape.points[i].y;
                    const xj = shape.points[j].x, yj = shape.points[j].y;

                    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
                return inside;
            case "ova":
                // Para un óvalo, puedes usar una versión modificada de la comprobación del círculo
                const dxOval = x - shape.x1;
                const dyOval = y - shape.y1;
                const width = shape.x2 - shape.x1;
                const height = shape.y2 - shape.y1;
                return (dxOval * dxOval) / (width * width) + (dyOval * dyOval) / (height * height) <= 1;
            default:
                return false;
        }
    }
    function calculatePolygonPoints(x1, y1, x2, y2, sides) {
        const points = [];
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
        const angleStep = (2 * Math.PI) / sides;
    
        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep;
            const pointX = centerX + radius * Math.cos(angle);
            const pointY = centerY + radius * Math.sin(angle);
            points.push({ x: pointX, y: pointY });
        }
    
        return points;
    }
});