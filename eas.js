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
    console.log("width", canvasDimension);
    const newDivSize = Math.floor(canvasDimension/numSquares);
    
    drawSquares(numSquares, chuckClose, newDivSize); //and then redraw them
});

canvas.addEventListener("mouseover", (event) => {
    const square = event.target;
    const color = window.getComputedStyle(square).backgroundColor;
    console.log("squares color", color);
    if (color === "rgb(255, 255, 255)") {
        assignRandomColor(square);
        console.log("assigning initial color");
    }
    else {
        adjustColorByPercent(square, color, 0.1);
        console.log("darkening color");
    }
});

function drawSquares(numSquares, chuckClose, newDivSize) {
    for (let i = 0; i < numSquares ** 2; i ++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("square"); //will use for finding which div to color
        newDiv.style.backgroundColor = "white"; //on first pass of mouse, we will pick the random color
        newDiv.style.width = `${newDivSize}px`;
        newDiv.style.height = `${newDivSize}px`;

        //for chuck close, we will add fingerprint icon ... but this requires knowing how big our divs will be....
        if (chuckClose) {
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-fingerprint");
            icon.style.fontSize = `${newDivSize}`;
            newDiv.appendChild(icon);
            newDiv.classList.add("center");
        }
        canvas.appendChild(newDiv);
    }

}

function setTemplateColumns(numSquares) {
    canvas.style.gridTemplateColumns = `repeat(${numSquares}, 1fr)`;
}

//color functions 
function assignRandomColor(div) {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);

    const color = `rgb(${r}, ${g}, ${b})`;


    console.log("color to assign", color);
    adjustColorByPercent(div, color, 0.9, false);

    function getRandomInt(min, max) {
        let rand = Math.floor(Math.random() * (max - min + 1) + min);
        console.log(rand, "rand");
        return rand; 
    }
}

function adjustColorByPercent(div, rgb, percent, dark=true) {

	let sep = rgb.indexOf(",") > -1 ? "," : " ";
  	rgb = rgb.substr(4).split(")")[0].split(sep); //what's wrong with this? 

    console.log(rgb);

  	for (let R in rgb) {
    		let rPrime = rgb[R];
    		if (rPrime.indexOf("%") > -1) {
      			rgb[R] = Math.round(rPrime.substr(0,rPrime.length - 1) / 100 * 255);
		}
  	}
	let r = rgb[0] / 255,
      	g = rgb[1] / 255,
      	b = rgb[2] / 255;


  	// Find greatest and smallest channel values
  	let cmin = Math.min(r,g,b) 
	cmax = Math.max(r,g,b), delta = cmax - cmin,
      	h = 0,
      	s = 0,
      	l = 0;

	// Calculate hue
  	// No difference
  	if (delta == 0) {
    		h = 0;
	}
  	// Red is max
  	else if (cmax == r) {
    		h = ((g - b) / delta) % 6;
	}
  	// Green is max
  	else if (cmax == g) {
    		h = (b - r) / delta + 2;
	}
  	// Blue is max
  	else {
    		h = (r - g) / delta + 4; 
	}

  	h = Math.round(h * 60);
    
  	// Make negative hues positive behind 360°
  	if (h < 0) {
      		h += 360;
	}

	// Calculate lightness
  	l = (cmax + cmin) / 2;
    if (dark) {
        l -= l * percent; //subtract out percentage of lightness
    }
    else {
        l += l * percent;
    }

  	// Calculate saturation
  	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  	// Multiply l and s by 100
  	s = +(s * 100).toFixed(1);
  	l = +(l * 100).toFixed(1);

  	const newColor = "hsl(" + h + "," + s + "%," + l + "%)";
    div.style.backgroundColor = newColor; 
}