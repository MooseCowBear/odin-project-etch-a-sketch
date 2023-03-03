let numSquares = 16; 
const canvas = document.getElementById("canvas");
let chuckClose = true;

const notAFanLink = document.querySelector("a");

notAFanLink.addEventListener("click", () => {
    chuckClose = !chuckClose;

    if (!chuckClose) { 
        switchFromChuck();
    }
    else {
        switchToChuck();
    }

    canvas.replaceChildren(); 
    drawSquares(numSquares, chuckClose);
});

window.addEventListener("load", (event) => { //does this need to be in a load event?
    console.log("page is fully loaded"); //where we will draw the divs inside right div

    drawSquares(numSquares, chuckClose);
    setTemplateColumns(numSquares);
});

window.addEventListener("resize", (event) => {  
    resizeSquares();
});

canvas.addEventListener("mouseover", (event) => {
    const square = event.target;
    const color = window.getComputedStyle(square).backgroundColor;
   
    if (color === "rgb(255, 255, 255)") {
        assignRandomColor(square);
    }
    else {
        adjustColorByPercent(square, color, 0.1);
    }
});

//for mobile -- 

const reset = document.querySelector("button"); 
reset.addEventListener("click", (event) => {

    canvas.replaceChildren();
    drawSquares(numSquares, chuckClose);
    setTemplateColumns(numSquares); 
});

const slider = document.querySelector(".range");
slider.addEventListener("input", () => {
    const display = document.querySelector(".range-value");
    display.innerText = slider.value;
    numSquares = slider.value;

    canvas.replaceChildren();
    drawSquares(numSquares, chuckClose);
    setTemplateColumns(numSquares);
});


function drawSquares(numSquares, chuckClose) {
    const newDivSize = getDivSize();
    console.log("DIV SIZE", newDivSize);
    for (let i = 0; i < numSquares ** 2; i ++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("square"); 
        newDiv.style.backgroundColor = "white"; //on first pass of mouse, we will pick the random color

        newDiv.style.width = `${newDivSize}px`;
        newDiv.style.height = `${newDivSize}px`;

        //for chuck close, we will add fingerprint icon 
        if (chuckClose) {
            if (newDivSize > 20) {
                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-fingerprint");
                icon.style.fontSize = `${newDivSize}`;
                newDiv.appendChild(icon);
            }

            newDiv.style.borderRadius = "50%"; //and make the divs circles
            newDiv.classList.add("center");
        }
        canvas.appendChild(newDiv);
    }

}

function getDivSize() {
    const canvasDimension = canvas.clientWidth;
    return Math.floor(canvasDimension/numSquares);
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

    adjustColorByPercent(div, color, 0.9, false);

    function getRandomInt(min, max) {
        let rand = Math.floor(Math.random() * (max - min + 1) + min);
        return rand; 
    }
}

function adjustColorByPercent(div, rgb, percent, dark=true) {
    //adapted from CSS Tricks
	let sep = rgb.indexOf(",") > -1 ? "," : " ";
  	rgb = rgb.substr(4).split(")")[0].split(sep); 

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

function switchToChuck() {
    canvas.style.backgroundColor = "transparent";
    const heading = document.querySelector("h1");
    heading.innerText = "The Unofficial Chuck Close Etch-A-Sketch";
    notAFanLink.innerText = "Not a fan?";
}

function switchFromChuck() {
    canvas.style.backgroundColor = "white";
    const heading = document.querySelector("h1");
    heading.innerText = "Etch-A-Sketch";
    notAFanLink.innerText = "Take me to Chuck";
}

function resizeSquares() {
    const children = canvas.children;
    const newDivSize = getDivSize();
    for (const child of children) {
        child.style.width = `${newDivSize}px`;
        child.style.height = `${newDivSize}px`;
    }
}