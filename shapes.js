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
function scuer(x, y, x2, y2, ctx, color, grosor, angulo) {
    let length = Math.min(Math.abs(x2 - x), Math.abs(y2 - y));
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + length * xSign;
    let y1 = y + length * ySign;

    let centerX = (x + x1) / 2;
    let centerY = (y + y1) / 2;

    let points = [[x, y], [x1, y], [x1, y1], [x, y1]];
    let rotatedPoints = points.map(([px, py]) => {
        let dx = px - centerX;
        let dy = py - centerY;
        return [
            dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
            dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
        ];
    });

    for (let i = 0; i < rotatedPoints.length; i++) {
        let [xStart, yStart] = rotatedPoints[i];
        let [xEnd, yEnd] = rotatedPoints[(i + 1) % rotatedPoints.length];
        dda(xStart, yStart, xEnd, yEnd, ctx, color, grosor);
    }
}
function drawDiamond(x, y, x2, y2, ctx, color, grosor, angulo) {
    let centerX = (x + x2) / 2;
    let centerY = (y + y2) / 2;

    let points = [[centerX, y], [x2, centerY], [centerX, y2], [x, centerY]];
    let rotatedPoints = points.map(([px, py]) => {
        let dx = px - centerX;
        let dy = py - centerY;
        return [
            dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
            dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
        ];
    });
    
    for (let i = 0; i < rotatedPoints.length; i++) {
        let [xStart, yStart] = rotatedPoints[i];
        let [xEnd, yEnd] = rotatedPoints[(i + 1) % rotatedPoints.length];
        dda(xStart, yStart, xEnd, yEnd, ctx, color, grosor);
    }
}
//rectangle
function rectangle(x, y, x2, y2, ctx, color, grosor, angulo) {
    let width = Math.abs(x2 - x);
    let height = Math.abs(y2 - y);
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + width * xSign;
    let y1 = y + height * ySign;

    let centerX = (x + x1) / 2;
    let centerY = (y + y1) / 2;

    let points = [[x, y], [x1, y], [x1, y1], [x, y1]];
    let rotatedPoints = points.map(([px, py]) => {
        let dx = px - centerX;
        let dy = py - centerY;
        return [
            dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
            dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
        ];
    });

    for (let i = 0; i < rotatedPoints.length; i++) {
        let [xStart, yStart] = rotatedPoints[i];
        let [xEnd, yEnd] = rotatedPoints[(i + 1) % rotatedPoints.length];
        dda(xStart, yStart, xEnd, yEnd, ctx, color, grosor);
    }
}

function trapecio(x, y, x2, y2, ctx, color, grosor, angulo) {
    let width = Math.abs(x2 - x);
    let height = Math.abs(y2 - y);
    let xSign = Math.sign(x2 - x);
    let ySign = Math.sign(y2 - y);

    let x1 = x + width * xSign;
    let y1 = y + height * ySign;

    let centerX = (x + x1) / 2;
    let centerY = (y + y1) / 2;

    let points = [[x, y], [x1, y], [x1 - width / 4, y1], [x + width / 4, y1]];
    let rotatedPoints = points.map(([px, py]) => {
        let dx = px - centerX;
        let dy = py - centerY;
        return [
            dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
            dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
        ];
    });

    for (let i = 0; i < rotatedPoints.length; i++) {
        let [xStart, yStart] = rotatedPoints[i];
        let [xEnd, yEnd] = rotatedPoints[(i + 1) % rotatedPoints.length];
        dda(xStart, yStart, xEnd, yEnd, ctx, color, grosor);
    }
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
function drawPolygon(x1, y1, sides, ctx, color, grosor, x2, y2, rotationAngle) {
    const centerX = x1;
    const centerY = y1;
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const angle = (2 * Math.PI) / sides;
    
    for (let i = 0; i < sides; i++) {
        const startX = centerX + radius * Math.cos(i * angle + rotationAngle);
        const startY = centerY + radius * Math.sin(i * angle + rotationAngle);

        const endX = centerX + radius * Math.cos((i + 1) * angle + rotationAngle);
        const endY = centerY + radius * Math.sin((i + 1) * angle + rotationAngle);

        dda(startX, startY, endX, endY, ctx, color, grosor);
    }
}
function oval(x1, y1, x2, y2, ctx, color, grosor, angulo) {
    ctx.fillStyle = color;
    let a = Math.abs(x2 - x1);
    let b = Math.abs(y2 - y1);
    let b1 = b & 1;
    let dx = 4 * (1 - a) * b * b;
    let dy = 4 * (b1 + 1) * a * a;
    let err = dx + dy + b1 * a * a;
    let e2;

    let centerX = (x1 + x2) / 2;
    let centerY = (y1 + y2) / 2;

    [x1, x2] = x1 > x2 ? [x2, x2 + a] : [x1, x2];
    y1 = Math.min(y1, y2);

    y1 += (b + 1) / 2;
    y2 = y1 - b1;

    do {
        let rotatedPoints = [[x2, y1], [x1, y1], [x1, y2], [x2, y2]].map(([px, py]) => {
            let dx = px - centerX;
            let dy = py - centerY;
            return [
                dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
                dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
            ];
        });

        rotatedPoints.forEach(([px, py]) => ctx.fillRect(px, py, grosor, grosor));

        e2 = 2 * err;
        if (e2 <= dy) {
            y1++;
            y2--;
            err += dy += 8 * a;
        }
        if (e2 >= dx || 2 * err > dy) {
            x1++;
            x2--;
            err += dx += 8 * b * b;
        }
    } while (x1 <= x2);

    while (y1 - y2 <= b) {
        let rotatedPoints = [[x1 - 1, y1], [x2 + 1, y1], [x1 - 1, y2], [x2 + 1, y2]].map(([px, py]) => {
            let dx = px - centerX;
            let dy = py - centerY;
            return [
                dx * Math.cos(angulo) - dy * Math.sin(angulo) + centerX,
                dx * Math.sin(angulo) + dy * Math.cos(angulo) + centerY
            ];
        });

        rotatedPoints.forEach(([px, py]) => ctx.fillRect(px, py, grosor, grosor));

        y1++;
        y2--;
    }
}
function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export { bresenham, dda, scuer, rectangle, Circle, circleBres, drawPolygon, oval,drawDiamond, clearCanvas, trapecio };