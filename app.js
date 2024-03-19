import {dda, scuer, rectangle, circleBres, drawPolygon, oval, clearCanvas, drawDiamond, trapecio } from './shapes.js';
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
    let angle = 0;
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
    document.getElementById("textBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "free";
    });

    document.getElementById("sqrBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "sqr";
    });

    document.getElementById("rectBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "rect";
    });
    document.getElementById("romboBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "rombo";
    });
    document.getElementById("trapbtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "trap";
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
        sidefilter.style.visibility = "hidden";
        selectedMode = "move";
    });
    document.getElementById("resizeBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "resize";
    });
    document.getElementById("deletebtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "delete";
    });
    document.getElementById("roteBtn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "rotate";
    });
    document.getElementById("sendbottom_btn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "bottom";
    });
    document.getElementById("sendfront_btn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "front";
    });
    document.getElementById("sendfront_btn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "back";
    });
    document.getElementById("sendfront_btn").addEventListener("click", function () {
        sidefilter.style.visibility = "hidden";
        selectedMode = "up";
    });
    document.getElementById("un_Btn").addEventListener("click", function () {
        if (historyIndex > 0) {
            historyIndex--;
            printHistory();
        }
    });
    let changes = [];
    document.getElementById("clr_Btn").addEventListener("click", function () {
        clearCanvas(ctx, canvas);history = [];currentDraw = [];historyIndex = -1; changes = [];
    });
    
    
    document.getElementById("re_Btn").addEventListener("click", function () {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            printHistory();
        }
    });

    document.getElementById("exportBtn").addEventListener("click", function () {
        const data = JSON.stringify(history);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "drawing.json";
        a.click();
    });

    document.getElementById("importBtn").addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                history = JSON.parse(event.target.result);
                historyIndex = history.length - 1;
                printHistory();
            };
            reader.readAsText(file);
        };
        input.click();
    });
    
    
    document.getElementById("saveBtn").addEventListener("click", function () {
        const data = canvas.toDataURL("image/png");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white"; // Set the background color to white
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with white
        const a = document.createElement("a");
        a.href = data;
        a.download = "drawing.png";
        a.click();
    });

    document.getElementById("convert_to_pdf").addEventListener("click", function () {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("download.pdf");
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
    
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    canvas.addEventListener("touchstart", (event) => {event.preventDefault();event.stopPropagation();startDrawing(event.touches[0])});
    canvas.addEventListener("touchmove", (event) => {event.preventDefault();event.stopPropagation();draw(event.touches[0])});
    canvas.addEventListener("touchend", (event) => {event.preventDefault();event.stopPropagation();stopDrawing(event.changedTouches[0])});


    function getCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);
        return { x, y };
    }
    function startDrawing(event) {
        const { x, y } = getCoordinates(event);
        if (["move", "resize", "rotate"].includes(selectedMode)) {
            selectedShape = selectShape(x, y);
            isMoving = true;
        } else if (selectedMode === "delete") {
            const shape = selectShape(x, y);
            if (shape) {
                history.splice(history.indexOf(selectedShape), 1);
                printHistory();
            }
            if (shape === "free") {
                changes.push(selectShape);
                history.splice(history.indexOf(selectedShape), 1);
                printHistory();
            }
        }else if (selectedMode === "bottom") {
            let shaped = selectShape(x, y, true);
            invert_position(shaped.index,0,history);
            printHistory();
            console.log(history);
        }else if (selectedMode === "front") {
            let shaped = selectShape(x, y, true);
            invert_position(shaped.index,historyIndex,history);
            printHistory();
            console.log(history);
        }else if (selectedMode === "back") {
            let shaped = selectShape(x, y, true);
            invert_position(shaped.index,shaped.index-1,history);
            printHistory();
            console.log(history);
        }else if (selectedMode === "up") {
            let shaped = selectShape(x, y, true);
            invert_position(shaped.index,shaped.index+1,history);
            printHistory();
            console.log(history);
        }else {
            isDrawing = true;
            [x1, y1, tempX2, tempY2] = [x, y, x, y];
        }
    }
    let currentfree = [];
    function draw(event) {
        const { x, y } = getCoordinates(event);
        if (isMoving && selectedShape) {
            if (selectedMode === "move") {
                moveShape(selectedShape, x, y);
            } else if (selectedMode === "resize") {
                resizeShape(selectedShape, x, y);
            } else if (selectedMode === "rotate") {
                rotateShape(selectedShape, x, y);
            }
            printHistory();
            drawPreview();
        } else if (isDrawing) {
            if (selectedMode === "free") {
                currentfree.push({ type: "line", x1: tempX2, y1: tempY2, x2: x, y2: y, color: color, grosor: grosor });
                [tempX2, tempY2] = [x, y];
            } else {
                [tempX2, tempY2] = [x, y];
            }
            printHistory();
            drawPreview();
        }
    }

    function stopDrawing(event) {
        if (isMoving) {
            isMoving = false;
        } else if (isDrawing) {
            isDrawing = false;
            const { x: x2, y: y2 } = getCoordinates(event);
            const shape = { x1, y1, x2, y2, color, grosor, sides };
            const shapeTypes = {
                "linea": { ...shape, sides: 2, type: "linea"},
                "sqr": { ...shape, sides: 4, type: "sqr", angulo: 0},
                "rombo": { ...shape, sides: 4, type: "rombo", angulo: 0},
                "rect": { ...shape, sides: 4, type: "rect", angulo: 0},
                "trap": { ...shape, sides: 4, type: "trap", angulo: 0},
                "circle": { ...shape, sides: 1, type: "circle", r: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) },
                "poly": { ...shape, type: "poly", sides: sidenum, points: calculatePolygonPoints(x1, y1, x2, y2, sidenum), angulo: 0},
                "ova": { ...shape, sides: 1, type: "ova", angulo: 0},
                "free": {type: "free", points: [...currentfree], angulo: 0}
            };
            
            console.log(history);
            currentfree = [];
            currentDraw.push(shapeTypes[selectedMode] || {});
            if (currentDraw.length > 0) {
                history.splice(historyIndex + 1);
                history.push(...currentDraw);
                historyIndex = history.length - 1;
                printHistory();
                currentDraw = [];
            }
        }
    }
    function drawShape(shape, ctx, color, grosor, x1, y1, x2, y2, sides, angulo, points) {
        switch (shape) {
            case "free":
                points.forEach(draw => {
                    dda(draw.x1, draw.y1, draw.x2, draw.y2, ctx, draw.color, draw.grosor);
                });
                break;
            case "linea":
                dda(x1, y1, x2, y2, ctx, color, grosor);
                break;
            case "sqr":
                scuer(x1, y1, x2, y2, ctx, color, grosor, angulo);
                break;
            case "rombo":
                drawDiamond(x1, y1, x2, y2, ctx, color, grosor, angulo);
            break;
            case "trap":
                trapecio(x1, y1, x2, y2, ctx, color, grosor, angulo);
            break;
            case "rect":
                rectangle(x1, y1, x2, y2, ctx, color, grosor, angulo);
                break;
            case "circle":
                const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                circleBres(x1, y1, r, ctx, color, grosor);
                break;
            case "poly":
                drawPolygon(x1, y1, sides, ctx, color, grosor, x2, y2, angulo);
                break;
            case "ova":
                oval(x1, y1, x2, y2, ctx, color, grosor, angulo);
                break;
            default:
                break;
        }
    }

    function drawPreview() {
        if (selectedMode === "poly") {
            drawPolygon(x1, y1, sidenum, ctx, color, grosor, tempX2, tempY2, angle);
        } else {
            drawShape(selectedMode, ctx, color, grosor, x1, y1, tempX2, tempY2, undefined, angle, currentfree);
        }
    }

    function printHistory() {
        clearCanvas(ctx, canvas);
        for (let i = 0; i <= historyIndex; i++) {
            const draw = history[i];
            drawShape(draw.type, ctx, draw.color, draw.grosor, draw.x1, draw.y1, draw.x2, draw.y2, draw.sides, draw.angulo, draw.points);
        }
    }
    function invert_position(historyIndex, position, history){ 
        var temp = history[historyIndex];
        history[historyIndex] = history[position];
        history[position] = temp;
    }

    function selectShape(x, y, inv) {
        // Recorre el array de formas
        
        for (let i = 0; i < history.length; i++) {
            const shape = history[i];
            // Comprueba si las coordenadas dadas están dentro de la forma
            if (isInsideShape(x, y, shape)) {
                if (inv===true){
                    return {shape: shape, index: i};
                }
                return shape;
            }
            if (shape.type ==="free" ){
                for (let j = 0; j < shape.points.length; j++) {
                    const draw = shape.points[j];
                    if (isInsideShape(x, y, draw)) {
                        return shape;
                    }
                }
            }
        }
        return null;
    }

    function updatePolygonPoints(shape, dx, dy) {
        for (let i = 0; i < shape.points.length; i++) {
            shape.points[i].x += dx;
            shape.points[i].y += dy;
        }
    }

    function moveShape(shape, x, y) {
        const dx = x - shape.x1;
        const dy = y - shape.y1;
        shape.x1 += dx;
        shape.y1 += dy;
        shape.x2 += dx;
        shape.y2 += dy;

        if (shape.type === "poly") {
            updatePolygonPoints(shape, dx, dy);
        }
    }

    function resizeShape(shape, x, y) {
        const scaleFactor = 0.1;
        const dx = (x - shape.x2) * scaleFactor;
        const dy = (y - shape.y2) * scaleFactor;

        shape.x2 += dx;
        shape.y2 += dy;

        if (shape.type === "poly") {
            updatePolygonPoints(shape, dx, dy);
        }
    }
    function rotateShape(shape, x, y) {
        const scaleFactor = 0.1;
        const dx = (x - shape.x2)* scaleFactor;
        const dy = (y - shape.y2)* scaleFactor;

        shape.angulo = Math.atan2(dy, dx);

        if (shape.type === "linea") {
            const dx = x - shape.x1;
            const dy = y - shape.y1;
            shape.x1 += dx;
            shape.y1 += dy;
        }
    }

    function isInsideShape(x, y, shape) {
        switch (shape.type) {
            case "free":
                for (let i = 0; i < shape.points.length; i++) {
                    const point = shape.points[i];
                    if (point.x1 === x && point.y1 === y ) {
                        console.log("punto");
                        return true;
                    }
                }
                break;
            case "linea":
                // Para una línea, comprobamos si el punto está cerca de la línea dentro de un cierto margen de error
                const dist = Math.abs((shape.y2 - shape.y1) * x - (shape.x2 - shape.x1) * y + shape.x2 * shape.y1 - shape.y2 * shape.x1) / Math.sqrt(Math.pow(shape.y2 - shape.y1, 2) + Math.pow(shape.x2 - shape.x1, 2));
                return dist <= 5; // Aquí, 5 es el margen de error
            case "sqr":
            case "rect":
            case "rombo":
            case "trap":
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