document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    
    console.log(ctx);

    let isDrawing = false;
    let x1, y1;
    canvas.addEventListener("click", function(event) {
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

        dda(x1, y1, x2, y2, ctx);
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
