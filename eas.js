let numSquares = 16; 
const canvas = document.getElementById("canvas");
let chuckClose = false;


window.addEventListener("load", (event) => {
    console.log("page is fully loaded"); //where we will draw the divs inside right div
    const canvasDimension = canvas.clientWidth;
    const newDivSize = Math.floor(canvasDimension/numSquares);

    drawSquares(numSquares, chuckClose, newDivSize);
    setTemplateColumns(numSquares);
});

window.addEventListener("resize", (event) => {
    console.log("window has been resized...");
    canvas.replaceChildren(); //remove children
    const canvasDimension = canvas.clientWidth;
    const newDivSize = Math.floor(canvasDimension/numSquares);
    
    drawSquares(numSquares, chuckClose, newDivSize); //and then redraw them
});

function drawSquares(numSquares, chuckClose, newDivSize) {
    for (let i = 0; i < numSquares ** 2; i ++) {
        const newDiv = document.createElement("div");
        newDiv.style.backgroundColor = "white"; //on first pass of mouse, we will pick the random color
        newDiv.style.width = `${newDivSize}px`;
        newDiv.style.height = `${newDivSize}px`;

        //for chuck close, we will add fingerprint icon ... but this requires knowing how big our divs will be....
        if (chuckClose) {
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-fingerprint");
            icon.style.fontSize(`${getFontSize}px`);
            newDiv.appendChild(icon);
        }
        canvas.appendChild(newDiv);
    }

    function getFontSize(size) {
        return size - 10; //just test this for now
    }
}

function setTemplateColumns(numSquares) {
    canvas.style.gridTemplateColumns = `repeat(${numSquares}, 1fr)`;
}


