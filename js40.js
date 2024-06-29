/* -------- Main Window -------- */

class MainWindow {
	constructor() {
		console.log(`${window.innerHeight}px`);
		console.log(`${window.innerWidth}px`);
		console.log(`${window.devicePixelRatio}`);
		
		this.innerHeight = window.innerHeight;
		this.innerWidth = window.innerWidth;
		this.devicePixelRatio = window.devicePixelRatio;
	}
}

let mainWindow = new MainWindow();


/* -------- Utility Functions -------- */

function wait(duration) {
	return new Promise((resolve, reject) => {setTimeout(resolve, duration)});
}

function disableScrolling() {
	document.body.classList.add("DisableScrolling");
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

	window.onscroll = function() {window.scrollTo(scrollLeft, scrollTop);};
}

function enableScrolling() {
	document.body.classList.remove("DisableScrolling");
	window.onscroll = function() {};
}


/* -------- Published -------- */

function publishedOnClick(eventObject) {
	console.log("publishedOnClick called", eventObject);
	const target = eventObject.target;
	target.style.color = "#551A8B";
	const id = target.id;
	indexAsString = id.split("-")[1];
	index = Number(indexAsString);
	console.log(id, indexAsString, index);

	disableScrolling();
	const newPunterPuzzle = new Puzzle(puzzleSpecs[index]);
	reconfigure(newPunterPuzzle);
	mainWall.show();	
	punter.solveBiz.wake();
}

class Published {
	constructor() {
		const publishedRef = document.querySelector("#iwTCPublishedPuzzles-2");
		for (let i = 0; i < puzzleSpecs.length; i++) {
			const puzzleSpec = puzzleSpecs[i];
			const puzzleRef = document.createElement("button");
			puzzleRef.id = "iwTCPublishedPuzzle-" + String(i);
			puzzleRef.type = "button";
			puzzleRef.style =
				"margin:0; padding:0.3em 0 0.3em 0; border:none; background-color:transparent; " +
				"box-sizing:border-box; width:12.5%; " +
				"font-size:2.5em; text-decoration-line:underline;";
			if (i == 0) {
				puzzleRef.style.color = "#551A8B";
			}
			else {
				puzzleRef.style.color = "#0000EE";
			}
			puzzleRef.append(String(puzzleSpec.number));
			puzzleRef.addEventListener("click", publishedOnClick);
			publishedRef.append(puzzleRef);
		}
	}
}


/* -------- Puzzle -------- */

class Puzzle {
	constructor(puzzleSpec) {
		this.number = puzzleSpec.number;
		this.publishedOn = puzzleSpec.publishedOn;
		this.mapSpec = puzzleSpec.mapSpec;
		this.hintSpec = puzzleSpec.hintSpec;
		this.solutionSpec = puzzleSpec.solutionSpec;
		this.mapWidth = puzzleSpec.mapSpec[0].length;
		this.mapHeight = puzzleSpec.mapSpec.length;
	}
	
	deconstruct() {
	}
};


/* -------- Main Wall -------- */

const mainWallSpec = {
	numGridRows: 112,
	numGridColumns: 60
};

class MainWall {
	constructor(mainWallSpec) {
		this.wallRef = document.querySelector("#mainWall");

		let innerDimension = 0
		let gridDimension = 0
		if ((mainWindow.innerHeight / mainWallSpec.numGridRows) <= (mainWindow.innerWidth / mainWallSpec.numGridColumns)) {
			innerDimension = mainWindow.innerHeight;
			gridDimension = mainWallSpec.numGridRows;
		}
		else {
			innerDimension = mainWindow.innerWidth;
			gridDimension = mainWallSpec.numGridColumns;
		}

		const percent = innerDimension / 100;
		let fontSize = 0;
		let reducingInnerDimension = innerDimension + 1;
		do {
			reducingInnerDimension = reducingInnerDimension - 1;
			fontSize = Math.trunc((reducingInnerDimension / gridDimension) * mainWindow.devicePixelRatio) / mainWindow.devicePixelRatio;
			console.log('mw fontSize', fontSize);
		} while ((innerDimension - (fontSize * gridDimension)) < (2 * percent));
		console.log('mw final fontSize', fontSize);
		this.wallRef.style.fontSize = `${fontSize}px`;
		this.fontSize = fontSize;
		
		const spareHeight = mainWindow.innerHeight - (this.fontSize * mainWallSpec.numGridRows);
		console.log('mw spareHeight', spareHeight);
		const deviceSpareHeight = spareHeight * mainWindow.devicePixelRatio;
		console.log('mw deviceSpareHeight', deviceSpareHeight);
		const roundedDeviceSpareHeight = Math.trunc(deviceSpareHeight / 2) * 2;
		console.log('mw roundedDeviceSpareHeight', roundedDeviceSpareHeight);
		const roundedSpareHeight = roundedDeviceSpareHeight / mainWindow.devicePixelRatio;
		console.log('mw roundedSpareHeight', roundedSpareHeight);
		this.topPosition = roundedSpareHeight / 2;
		this.wallRef.style.top = `${this.topPosition}px`;

		this.width = this.fontSize * mainWallSpec.numGridColumns
		const spareWidth = mainWindow.innerWidth - this.width;
		console.log('mw spareWidth', spareWidth);
		const deviceSpareWidth = spareWidth * mainWindow.devicePixelRatio;
		console.log('mw deviceSpareWidth', deviceSpareWidth);
		const roundedDeviceSpareWidth = Math.trunc(deviceSpareWidth / 2) * 2;
		console.log('mw roundedDeviceSpareWidth', roundedDeviceSpareWidth);
		const roundedSpareWidth = roundedDeviceSpareWidth / mainWindow.devicePixelRatio;
		console.log('mw roundedSpareWidth', roundedSpareWidth);
		this.leftPosition = roundedSpareWidth / 2;
		this.wallRef.style.left = `${this.leftPosition}px`;
	}

	show() {
		this.wallRef.style.display = `grid`;
	}

	hide() {
		this.wallRef.style.display = `none`;
	}
	
	deconstruct() {
	}
}


/* -------- Info Wall -------- */

function backOnClick() {
	//console.log("backOnClick called");
	infoWall.hide();
	//disableScrolling();
	mainWall.show();
	disableScrolling();
	}

function demonstrationOnClick () {
	//console.log("demonstrationOnClick called");
	demo.enter();
	}

class InfoWall {
	constructor(topPosition, leftPosition, fontSize, punterPuzzle) {
		this.wallRef = document.querySelector("#infoWall");

		this.wallRef.style.top = `${topPosition}px`;
		this.wallRef.style.left = `${leftPosition}px`;
		this.wallRef.style.fontSize = `${fontSize}px`;

		const puzzleDataRef = document.querySelector("#iwPuzzleData");
		puzzleDataRef.innerHTML = "<strong>Puzzle " + String(punterPuzzle.number) + "&emsp;&boxh;&emsp;published on " + punterPuzzle.publishedOn + "</strong>";

		const featuredWordRef = document.querySelector("#iwTCFeaturedWord");
		featuredWordRef.innerHTML = punterPuzzle.featuredWordBlurb;

		this.separator2Ref = document.querySelector("#iwSeparator-2");
		this.separator2TopPosition = undefined;

		this.controlBack = new Control("#iwCtrlBack", backOnClick);
		this.controlBack.enable();
		this.controlBack.unfade();		
		this.controlDemo = new Control("#iwdCtrlDemonstration", demonstrationOnClick);
		this.controlDemo.enable();
		this.controlDemo.unfade();
	}
	
	show() {
		this.wallRef.style.display = `grid`;
		const separator2Rect = this.separator2Ref.getBoundingClientRect();
		//console.log(separator2Rect);
		this.separator2TopPosition = separator2Rect.top;
	}

	hide() {
		this.wallRef.style.display = `none`;
	}
	
	deconstruct() {
		this.wallRef.style.display = `none`;
		this.controlDemo.deconstruct();
		this.controlBack.deconstruct();
	}
}


/* -------- Cross/Tick -------- */

function crossTickFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashCrossTick(crossTickRef, solveBiz, leaveOnOff) {
	await wait(300);
	crossTickRef.style.display = `none`;
	await wait(300);
	crossTickRef.style.display = `block`;
	await wait(300);
	crossTickRef.style.display = `none`;
	await wait(300);
	crossTickRef.style.display = `block`;
	if (leaveOnOff === 0) {
		await wait(300);
		crossTickRef.style.display = `none`;
	}
	crossTickFlashed(solveBiz)
}

class CrossTick {
	constructor(crossTickId) {
		this.ref = document.querySelector(crossTickId);
	}
	
	showTick(solveBiz) {
		this.ref.innerHTML = "<strong>&check;</strong>"
		this.ref.style.display = `block`;
		flashCrossTick(this.ref, solveBiz);
	}
	
	showCross(solveBiz) {
		this.ref.innerHTML = "<strong>&cross;</strong>"
		this.ref.style.display = `block`;
		flashCrossTick(this.ref, solveBiz, 1);
	}
	
	flashCross(solveBiz) {
		this.ref.innerHTML = "<strong>&cross;</strong>"
		this.ref.style.display = `block`;
		flashCrossTick(this.ref, solveBiz, 0);
	}
	
	hide() {
		this.ref.style.display = `none`;
	}
	
	deconstruct() {
		this.ref.style.display = `none`;
	}
}


/* -------- A and B -------- */

const A = 0;
const B = 1;
const ABother = [B, A];
const ABstring = ["A", "B"];
const ABcolour = ["olive", "darkviolet"];

//not A or B
const Z = 2;


/* -------- Territory -------- */

class Territory {
	constructor(territoryId, map2D) {
		this.dimension = map2D.length;
		this.dimensionMultiplier = 100;
		//this.pathColours = ["red", "blue"];
		this.gridElements = [];
		this.svg = "http://www.w3.org/2000/svg";
		this.territoryRef = document.querySelector(territoryId);
		this.finishCoord1D = undefined;
		
		const square = document.createElementNS(this.svg, "rect");
		square.setAttribute("x", "0");
		square.setAttribute("y", "0");
		square.setAttribute("width", String(this.dimension * this.dimensionMultiplier));
		square.setAttribute("height", String(this.dimension * this.dimensionMultiplier));
		square.setAttribute("stroke", "black");
		square.setAttribute("stroke-width", String(this.dimension));
		square.setAttribute("fill", "#F5F5F5");
		this.gridElements.push(square);
		this.territoryRef.append(square);
		
		for (let i = 1; i < this.dimension; i++) {
			const horizontalLine = document.createElementNS(this.svg, "line");
			horizontalLine.setAttribute("x1", "0");
			horizontalLine.setAttribute("y1", String(i * this.dimensionMultiplier));
			horizontalLine.setAttribute("x2", String(this.dimension * this.dimensionMultiplier));
			horizontalLine.setAttribute("y2", String(i * this.dimensionMultiplier));
			horizontalLine.setAttribute("stroke", "black");
			horizontalLine.setAttribute("stroke-width", "1");
			horizontalLine.setAttribute("stroke-linecap", "butt");
			this.gridElements.push(horizontalLine);
			this.territoryRef.append(horizontalLine);

			const verticalLine = document.createElementNS(this.svg, "line");
			verticalLine.setAttribute("y1", "0");
			verticalLine.setAttribute("x1", String(i * this.dimensionMultiplier));
			verticalLine.setAttribute("y2", String(this.dimension * this.dimensionMultiplier));
			verticalLine.setAttribute("x2", String(i * this.dimensionMultiplier));
			verticalLine.setAttribute("stroke", "black");
			verticalLine.setAttribute("stroke-width", "1");
			verticalLine.setAttribute("stroke-linecap", "butt");
			this.gridElements.push(verticalLine);
			this.territoryRef.append(verticalLine);
		}
			
		this.numCoords = this.dimension * this.dimension
		this.coordElements = [];
		for (let i = 0; i < this.numCoords - 1; i++) {
			this.coordElements[i] = null;
		}

		for (let row = 0; row < this.dimension; row++) {
			for (let column = 0; column < this.dimension; column++) {
				const coordValue = map2D[row][column]
				if (coordValue == 1) {
					const blocker = document.createElementNS(this.svg, "rect");
					blocker.setAttribute("x", String(column * this.dimensionMultiplier));
					blocker.setAttribute("y", String(row * this.dimensionMultiplier));
					blocker.setAttribute("width", String(this.dimensionMultiplier));
					blocker.setAttribute("height", String(this.dimensionMultiplier));
					blocker.setAttribute("fill", "black");
					const index = (row * this.dimension) * column;
					this.coordElements[index] = [blocker];
					this.territoryRef.append(blocker);
				}
			}
		}
	}
	
	clearCoord(coord1D) {
		const coordElementList = this.coordElements[coord1D];
		for (let i = 0; i < coordElementList.length; i++) {
			coordElementList[i].remove();
		}
		this.coordElements[coord1D] = null;
	}
			
	addStart(AB, coord1D) {
		const start = document.createElementNS(this.svg, "rect");
		const column = coord1D % this.dimension;
		const row = (coord1D - column) / this.dimension;
		start.setAttribute("x", String((column * this.dimensionMultiplier) + 25));
		start.setAttribute("y", String((row * this.dimensionMultiplier) + 25));
		start.setAttribute("width", String(this.dimensionMultiplier) - 50);
		start.setAttribute("height", String(this.dimensionMultiplier - 50));
		//start.setAttribute("fill", this.pathColours[pathId]);
		start.setAttribute("fill", ABcolour[AB]);
		this.coordElements[coord1D] = [start];
		this.territoryRef.append(start);
	}
	
	addFinish(coord1D, AB, direction) {
		this.finishCoord1D = coord1D;
		//const otherPathId = pathId === 0 ? 1 : 0;
		const otherAB = ABother[AB];
		let colourSW = undefined;
		let colourNE = undefined;
		if (direction === "S" || direction === "W") {
			colourSW = ABcolour[AB];
			colourNE = ABcolour[otherAB];
		}
		else {
			colourSW = ABcolour[otherAB];
			colourNE = ABcolour[AB];
		}
			
		const column = coord1D % this.dimension;
		const row = (coord1D - column) / this.dimension;
		const xTopLeft = column * this.dimensionMultiplier;
		const xTopRight = xTopLeft + this.dimensionMultiplier;
		const xBottomLeft = xTopLeft;
		const xBottomRight = xTopRight;
		const yTopLeft = row * this.dimensionMultiplier;
		const yBottomLeft = yTopLeft + this.dimensionMultiplier;
		const yTopRight = yTopLeft;
		const yBottomRight = yBottomLeft;
		const topLeft = String(xTopLeft) + " " + String(yTopLeft);
		const bottomLeft = String(xBottomLeft) + " " + String(yBottomLeft);
		const topRight = String(xTopRight) + " " + String(yTopRight);
		const bottomRight = String(xBottomRight) + " " + String(yBottomRight);
		const finishA = document.createElementNS(this.svg, "polygon");
		finishA.setAttribute("points", topLeft + " " + bottomLeft + " " + bottomRight);
		finishA.setAttribute("fill", colourSW);
		this.territoryRef.append(finishA);
		const finishB = document.createElementNS(this.svg, "polygon");
		finishB.setAttribute("points", topLeft + " " + topRight + " " + bottomRight);
		finishB.setAttribute("fill", colourNE);
		this.territoryRef.append(finishB);
		this.coordElements[coord1D] = [finishA, finishB];
	}
	
	removeFinish() {
		if (this.finishCoord1D !== undefined) {
			this.clearCoord(this.finishCoord1D);
			this.finishCoord1D = undefined;
		}
	}

	addStep(AB, coord1D) {
		const step = document.createElementNS(this.svg, "circle");
		const column = coord1D % this.dimension;
		const row = (coord1D - column) / this.dimension;
		step.setAttribute("cx", String((column * this.dimensionMultiplier) + 50));
		step.setAttribute("cy", String((row * this.dimensionMultiplier) + 50));
		step.setAttribute("r", "20");
		//step.setAttribute("fill", this.pathColours[pathId]);
		step.setAttribute("fill", ABcolour[AB]);
		this.coordElements[coord1D] = [step];
		this.territoryRef.append(step);
	}

	removeStep(coord1D) {
		this.clearCoord(coord1D);
	}
	
	deconstruct() {
	}
}


/* -------- AbstractMap -------- */

function hintFlashed(abstractMap, solveBiz) {
	const AB = abstractMap.hintSpec.AB;
	const stepsToSkip = abstractMap.hintSpec.stepsToSkip;
	for (let i = 0; i < stepsToSkip; i++) {
		abstractMap.removeStep(AB, false);
	}
	solveBiz.completeHintClicked();
}

async function flashHint(abstractMap, solveBiz, script) {
	await wait(500);
	const waitTimes = [1500, 500];
	for (let i = 0; i <= 1; i++) {
		for (let command of script) {
			if (command.action === "add") {
				abstractMap.addStep(command.AB, command.direction, true);
			}
			else {
				abstractMap.removeStep(command.AB, true);
			}
			if (command.pause != 0) await wait(command.pause);		
		}
		await wait(waitTimes[i]);
	}
	hintFlashed(abstractMap, solveBiz)
}

class AbstractMap {
	constructor(puzzle, territoryId) {
		this.map = puzzle.mapSpec;
		this.mapDimension = this.map.length;
		this.territory = new Territory(territoryId, this.map);
		this.punterPaths = [];
		this.solutionPaths = [];
		this.solutionDirections = [];
		this.hintSpec = puzzle.hintSpec;

		this.coord2DAdjustmentsLookUp = [];
		//this.coord2DAdjustmentsLookUp["North"] = [-1, 0];
		//this.coord2DAdjustmentsLookUp["East"] = [0, +1];
		//this.coord2DAdjustmentsLookUp["South"] = [+1, 0];
		//this.coord2DAdjustmentsLookUp["West"] = [0, -1];
		this.coord2DAdjustmentsLookUp["N"] = [-1, 0];
		this.coord2DAdjustmentsLookUp["E"] = [0, +1];
		this.coord2DAdjustmentsLookUp["S"] = [+1, 0];
		this.coord2DAdjustmentsLookUp["W"] = [0, -1];
		
		this.analysisNothing = 0;
		this.analysisOutOfBounds = 1;
		this.analysisBlocked = 2;
		this.analysisRevisit = 3;
		this.analysisClash = 4;
		this.analysisMeetCorrect = 5;
		this.analysisMeetIncorrect = 6;
		
		for (let r = 0; r < this.mapDimension; r++) {
			for (let c = 0; c < this.mapDimension; c++) {
				const coordValue = this.map[r][c];
				if (coordValue === 2) {
					const solutionPath = this.extractSolutionPath({row: r, column: c}, 3, 9);
					this.solutionPaths[A] = solutionPath
					this.solutionMeetCoord1D = solutionPath[solutionPath.length - 1];
					this.solutionDirections[A] = this.extractDirections(solutionPath);
					this.solutionTurns = this.extractTurns(solutionPath);
					//console.log(solutionPath, this.solutionMeetCoord1D, this.solutionTurns);
					const coord1D = this.coord2DConvertTo1D({row: r, column: c});
					this.punterPaths[A] = [coord1D];
					this.territory.addStart(A, coord1D);
				}
				else if (coordValue === 4) {
					const solutionPath = this.extractSolutionPath({row: r, column: c}, 5, 9);
					this.solutionPaths[B] = solutionPath;
					this.solutionDirections[B] = this.extractDirections(solutionPath);
					const coord1D = this.coord2DConvertTo1D({row: r, column: c});
					this.punterPaths[B] = [coord1D];
					this.territory.addStart(B, coord1D);
				}
			}
		}
	}

	coord2DConvertTo1D(coord2D) {
		return (coord2D.row * this.mapDimension) + coord2D.column;
	}
	
	coord1DConvertTo2D(coord1D) {
		const c = coord1D % this.mapDimension;
		const r = (coord1D - c) / this.mapDimension;
		return {row: r, column: c};
	}
	
	//coord2DEqualsCoord2D(xCoord2D, yCoord2D) {
	//	return (xCoord2D.row === yCoord2D.row) && (xCoord2D.column === yCoord2D.column)
	//}

	getAdjacentCoord2D(coord2D, direction) {
		const coord2DAdjustments = this.coord2DAdjustmentsLookUp[direction];
		const r = coord2D.row + coord2DAdjustments[0];
		const c = coord2D.column + coord2DAdjustments[1];
		if (r < 0 || r === this.mapDimension) return null;
		if (c < 0 || c === this.mapDimension) return null;
		return {row: r, column: c};
	}
	
	extractSolutionPath(startCoord2D, stepValue, finishValue) {
		let path = [this.coord2DConvertTo1D(startCoord2D)];
		let coord2D = {row: startCoord2D.row, column: startCoord2D.column};
		let finishFound = false;
		while (!finishFound) {
			//const coord2DNorth = this.getAdjacentCoord2D(coord2D, "North");
			//const coord2DEast = this.getAdjacentCoord2D(coord2D, "East");
			//const coord2DSouth = this.getAdjacentCoord2D(coord2D, "South");
			//const coord2DWest = this.getAdjacentCoord2D(coord2D, "West");
			const coord2DNorth = this.getAdjacentCoord2D(coord2D, "N");
			const coord2DEast = this.getAdjacentCoord2D(coord2D, "E");
			const coord2DSouth = this.getAdjacentCoord2D(coord2D, "S");
			const coord2DWest = this.getAdjacentCoord2D(coord2D, "W");
			let value = undefined;
			if (coord2DNorth !== null) {
				value = this.map[coord2DNorth.row][coord2DNorth.column]
				if (value === stepValue || value === finishValue) {
					coord2D = coord2DNorth;
					path.push(this.coord2DConvertTo1D(coord2D));
					finishFound = (value === finishValue);
					this.map[coord2DNorth.row][coord2DNorth.column] = -value;
					continue
				}
			}
			if (coord2DEast !== null) {
				value = this.map[coord2DEast.row][coord2DEast.column]
				if (value === stepValue || value === finishValue) {
					coord2D = coord2DEast;
					path.push(this.coord2DConvertTo1D(coord2D));
					finishFound = (value === finishValue);
					this.map[coord2DEast.row][coord2DEast.column] = -value;
					continue
				}
			}
			if (coord2DSouth !== null) {
				value = this.map[coord2DSouth.row][coord2DSouth.column]
				if (value === stepValue || value === finishValue) {
					coord2D = coord2DSouth;
					path.push(this.coord2DConvertTo1D(coord2D));
					finishFound = (value === finishValue);
					this.map[coord2DSouth.row][coord2DSouth.column] = -value;
					continue
				}
			}
			if (coord2DWest !== null) {
				value = this.map[coord2DWest.row][coord2DWest.column]
				if (value === stepValue || value === finishValue) {
					coord2D = coord2DWest;
					path.push(this.coord2DConvertTo1D(coord2D));
					finishFound = (value === finishValue);
					this.map[coord2DWest.row][coord2DWest.column] = -value;
					continue
				}
			}
			//ERROR
			return [];
		}

		//restore map
		//values on the path (apart from the start value) have been negated
		for (let r = 0; r < this.mapDimension; r++) {
			for (let c = 0; c < this.mapDimension; c++) {
				const value = this.map[r][c];
				if (value < 0) this.map[r][c] = -value;
			}
		}

		//console.log('extracted solution path', path);
		return path;
	}
	
	extractTurns(path) {
		const d = this.mapDimension;
		const turnLookUp = [[-1, -1, ""],  [-1, -d, "R"], [-1, +d, "L"],
							[+1, +1, ""],  [+1, -d, "L"], [+1, +d, "R"],
							[-d, -1, "L"], [-d, +1, "R"], [-d, -d, ""],
							[+d, -1, "R"], [+d, +1, "L"], [+d, +d, ""]
						   ];
		if (path.length < 3) return "";
		let turns = "";
		for (let i = 0; i <= path.length - 3; i++) {
			const diff0 = path[i] - path[i + 1];
			const diff1 = path[i + 1] - path[i + 2];
			for (let j = 0; j < turnLookUp.length; j++) {
				if (turnLookUp[j][0] === diff0 && turnLookUp[j][1] === diff1) {
					turns = turns + turnLookUp[j][2];
					break;
				}
			}
		}
		//console.log('turns', path, turns);
		return turns;
	}

	getTurns(AB) {
		return this.extractTurns(this.punterPaths[AB]);
	}
	
	getSolutionTurns() {
		return this.solutionTurns;
	}

	extractDirections(path) {
		const d = this.mapDimension;
		const directionLookUp = [[-1, "W"], [+1, "E"], [-d, "N"], [+d, "S"]];
		let directions = "";
		for (let i = 0; i <= path.length - 2; i++) {
			const diff = path[i + 1] - path[i];
			for (let j = 0; j < directionLookUp.length; j++) {
				if (directionLookUp[j][0] === diff) {
					directions = directions + directionLookUp[j][1];
					break;
				}
			}
		}
		//console.log('directions', path, directions);
		return directions;		
	}

	getSolutionDirections() {
		return this.solutionDirections;
	}
	
	resetPath(AB) {
		const path = this.punterPaths[AB];
		const pathLength = path.length;
		for (let i = 1; i < pathLength; i++) {
			const coord1D = path.pop();
			this.territory.removeStep(coord1D);
		}
	}
	
	reset() {
		this.resetPath(A);
		this.resetPath(B);
		this.territory.removeFinish();
	}
	
	getPathLength(AB) {
		return this.punterPaths[AB].length;
	}

	analyseStep(AB, direction) {
		const path = this.punterPaths[AB];
		const pathEndCoord1D = path[path.length - 1];
		const pathEndCoord2D = this.coord1DConvertTo2D(pathEndCoord1D);
		const nextCoord2D = this.getAdjacentCoord2D(pathEndCoord2D, direction);
		if (nextCoord2D === null) return this.analysisOutOfBounds;
		if (this.map[nextCoord2D.row][nextCoord2D.column] == 1) return this.analysisBlocked;
		const nextCoord1D = this.coord2DConvertTo1D(nextCoord2D);
		if (path.findIndex(x => x === nextCoord1D) !== -1) return this.analysisRevisit;
		//const otherPunterPath = this.punterPaths[(pathId === 0 ? 1 : 0)];
		const otherPath = this.punterPaths[ABother[AB]];
		if (nextCoord1D === otherPath[otherPath.length - 1]) {
			if (nextCoord1D === this.solutionMeetCoord1D) {
				return this.analysisMeetCorrect;
			}
			else {
				return this.analysisMeetIncorrect;
			}
		}
		if (otherPath.findIndex(x => x === nextCoord1D) !== -1) return this.analysisClash;
		return this.analysisNothing;
	}
	
	addStep(AB, direction, addToTerritory) {
		const path = this.punterPaths[AB];
		const pathEndCoord1D = path[path.length - 1];
		const pathEndCoord2D = this.coord1DConvertTo2D(pathEndCoord1D);
		const nextCoord2D = this.getAdjacentCoord2D(pathEndCoord2D, direction);
		const nextCoord1D = this.coord2DConvertTo1D(nextCoord2D);
		if (addToTerritory) this.territory.addStep(AB, nextCoord1D);
		this.punterPaths[AB].push(nextCoord1D);
	}
	
	removeStep(AB, removeFromTerritory) {
		const coord1D = this.punterPaths[AB].pop();
		if (removeFromTerritory) this.territory.removeStep(coord1D);
	}
	
	addFinish(AB, direction) {
		const path = this.punterPaths[AB];
		const pathEndCoord1D = path[path.length - 1];
		const pathEndCoord2D = this.coord1DConvertTo2D(pathEndCoord1D);
		const nextCoord2D = this.getAdjacentCoord2D(pathEndCoord2D, direction);
		const nextCoord1D = this.coord2DConvertTo1D(nextCoord2D);
		let oppositeDirectionLookUp = []
		oppositeDirectionLookUp["N"] = "S";
		oppositeDirectionLookUp["E"] = "W";
		oppositeDirectionLookUp["S"] = "N";
		oppositeDirectionLookUp["W"] = "E";
		this.territory.addFinish(nextCoord1D, AB, oppositeDirectionLookUp[direction]);
	}
	
	flashHint(solveBiz) {
		const AB = this.hintSpec.AB;
		const stepsToSkip = this.hintSpec.stepsToSkip;
		const stepsToShow = this.hintSpec.stepsToShow;
		const solutionDirections = this.solutionDirections[AB];
		for (let i = 0; i < stepsToSkip; i++) {
			this.addStep(AB, solutionDirections[i], false);
		}
		
		let script = [];
		for (let i = 0; i < stepsToShow; i++) {
			script.push({AB: AB, action: "add", direction: solutionDirections[stepsToSkip + i], pause: 750});
		}
		for (let i = 0; i < stepsToShow; i++) {
			script.push({AB: AB, action: "remove", direction: undefined, pause: 0});
		}
		//console.log(script);
		flashHint(this, solveBiz, script);
	}

/*		
	deconstruct() {
		this.pathFinishCoord.deconstruct();
		this.pathStartCoord.deconstruct();
		this.territory.deconstruct();
	}
*/
}


/* -------- Turns -------- */

const Turns_left = "L";
const Turns_right = "R";

const Turns_modeOff = 0;
const Turns_modeOnHide = 1;
const Turns_modeOnShow = 2;

const Turns_maxSequenceLength = 12;

class Turns {
	constructor(AB, elementRootId) {
		const ABAsString = ABstring[AB];
		this.elementRef = document.querySelector(elementRootId + ABAsString);
				
		this.mode = Turns_modeOff;
		this.sequence = "";
		this.refresh();
	}

	reset() {
		this.mode = Turns_modeOff;		
		this.sequence = "";
		this.refresh();
	}
/*
	constructHTML(leftSymbol, rightSymbol) {
		let html = "";
		for (let t = 0; t < this.sequence.length; t++) {
			if (t !== 0) html = html + " ";
			const symbol = this.sequence[t] === Turns_left ? leftSymbol : rightSymbol;
			html = html + "<code><strong>" + symbol + "</strong></code>";
		}
		return html;
	}
*/
	constructHTML(leftSymbol, rightSymbol) {
		let symbols = "";
		for (let t = 0; t < this.sequence.length; t++) {
			symbols = symbols + (this.sequence[t] === Turns_left ? leftSymbol : rightSymbol);
		}
		
		if (symbols.length > Turns_maxSequenceLength) symbols = symbols.substring(0, Turns_maxSequenceLength - 1) + "+";
		
		let html = "";
		for (let s = 0; s < symbols.length; s++) {
			if (s !== 0) html = html + " ";
			html = html + "<code><strong>" + symbols[s] + "</strong></code>";
		}
		return html;
	}
	
	refresh() {
		let html = undefined;
		if (this.mode === Turns_modeOff) {
			html = "";
		}
		else if (this.mode === Turns_modeOnHide) {
			html = this.constructHTML("T", "T");
		}
		else {
			html = this.constructHTML("L", "R");
		}
		this.elementRef.innerHTML = html;
	}
	
	setSequence(sequence) {
		this.sequence = sequence;
		this.refresh();
	}
	
	setMode(mode) {
		this.mode = mode;
		this.refresh();
	}
	
	getMode() {
		return this.mode;
	}
	
	deconstruct() {
		
	}
}


/* -------- Biz Back Control Flag -------- */

class BizBackControlFlag {
	constructor(backControlFlagId) {
		this.ref = document.querySelector(backControlFlagId);
	}
	
	show(AB) {
		const svgAB = ["backFlagA.svg", "backFlagB.svg"];
		//const svg = AB === A ? "backFlagA.svg" : "backFlagB.svg";
		this.ref.src = svgAB[AB];
		this.ref.style.display = `block`;
	}
	
	hide() {
		this.ref.style.display = `none`;
	}
	
	deconstruct() {
		this.ref.style.display = `none`;
	}
}


/* -------- Controls -------- */

class Control {
	constructor(id, onClick) {
	this.id = id;
	this.onClick = onClick;
	this.ref = document.querySelector(id);
	this.isEnabled = false;
	this.isFrozen = false;
	this.wasEnabledBeforeFreeze = undefined;
	}

	enable() {
		if (this.isFrozen) return;
		if (!this.isEnabled) {
			if (this.OnClick !== null) this.ref.addEventListener("click", this.onClick);
			this.isEnabled = true;
		}
	}
	
	disable() {
		if (this.isFrozen) return;
		if (this.isEnabled) {
			if (this.OnClick !== null) {
				this.ref.removeEventListener("click", this.onClick);
			}
			this.isEnabled = false;
		}
	}

	fade() {
		if (this.isFrozen) return;
		//this.ref.style.opacity = `0.5`;
		this.ref.style.opacity = `0.6`;
	}
	
	unfade() {
		if (this.isFrozen) return;
		this.ref.style.opacity = `1.0`;
	}
	
	freeze() {
		if (this.isFrozen) return;
		this.wasEnabledBeforeFreeze = this.isEnabled;
		if (this.isEnabled) {
			this.ref.removeEventListener("click", this.onClick);
			this.isEnabled = false;
		}
		this.isFrozen = true;
	}
	
	unfreeze() {
		this.isEnabled = this.wasEnabledBeforeFreeze;
		if (this.isEnabled) {
			if (this.OnClick !== null) this.ref.addEventListener("click", this.onClick);
		}
		this.isFrozen = false;
	}
	
	deconstruct() {
		this.ref.removeEventListener("click", this.onClick);
	}
}

function neswControlFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashNESWControl(ref, flasherRef, solveBiz) {
	ref.style.display = `none`;
	await wait(300);
	flasherRef.style.display = `block`;
	await wait(300);
	flasherRef.style.display = `none`;
	await wait(300);
	flasherRef.style.display = `block`;
	await wait(300);
	flasherRef.style.display = `none`;
	ref.style.display = `block`;
	neswControlFlashed(solveBiz)
}

class NESWControl extends Control {
	constructor(id, onClick) {
		super(id, onClick);
		
		this.imageLookUp = [];
		this.imageLookUp["N"] = ["buttonNorthA.svg", "buttonNorthB.svg", "buttonNorthZ.svg"];
		this.imageLookUp["E"] = ["buttonEastA.svg", "buttonEastB.svg", "buttonEastZ.svg"];
		this.imageLookUp["S"] = ["buttonSouthA.svg", "buttonSouthB.svg", "buttonSouthZ.svg"];
		this.imageLookUp["W"] = ["buttonWestA.svg", "buttonWestB.svg", "buttonWestZ.svg"];
		this.direction = id.substring(8, 9);
		
		this.flasherRef = document.querySelector(id + "Flasher");
		this.flasherRef.style.display = `none`;
	}
	
	setABZ(ABZ) {
		this.ref.src = this.imageLookUp[this.direction][ABZ];
	}
	
	flash(solveBiz) {
		flashNESWControl(this.ref, this.flasherRef, solveBiz);		
	}

	//override fade() because an opacity of 0.5 is not enough
/*	fade() {
		if (this.isFrozen) return;
		this.ref.style.opacity = `0.3`;
	}
*/	
	deconstruct() {
		super.deconstruct()
		this.flasherRef.style.display = `none`;
	}
}

class TurnsControl extends Control {
	constructor(id, onClick) {
		super(id, onClick);
		this.AB = id[id.length - 1] === "A" ? A : B;
		
		this.imageLookUp = [];
		this.imageLookUp[A] = ["buttonTurnsA1.svg", "buttonTurnsA2.svg", "buttonTurnsA3.svg"];
		this.imageLookUp[B] = ["buttonTurnsB1.svg", "buttonTurnsB2.svg", "buttonTurnsB3.svg"];
		
		this.lookUpIndex = 0;
		this.ref.src = this.imageLookUp[this.AB][this.lookUpIndex];
		
		this.nextLookUpIndexLookUp = [1, 2, 0];
	}
	
	reset() {
		this.lookUpIndex = 0;
		this.ref.src = this.imageLookUp[this.AB][this.lookUpIndex];
	}
	
	setToMax() {
		this.lookUpIndex = this.imageLookUp[0].length - 1;
		this.ref.src = this.imageLookUp[this.AB][this.lookUpIndex];
	}
	
	toggle() {
		this.lookUpIndex = this.nextLookUpIndexLookUp[this.lookUpIndex];
		this.ref.src = this.imageLookUp[this.AB][this.lookUpIndex];
	}
/*	
	deconstruct() {
		super.deconstruct()
	} */
}


/* -------- Solve -------- */

class SolveIO {
	constructor(controls, crossTick, backControlFlag) {
	this.controls = controls;
	this.crossTick = crossTick;
	this.backControlFlag = backControlFlag;
	}

	disableAllControls() {
		for (let name in this.controls) {
			this.controls[name].disable();
			this.controls[name].fade();
		}
	}

	disableControls(controls) {
		for (let i in controls) {
			this.controls[controls[i]].disable();
			this.controls[controls[i]].fade();
		}
	}
	
	enableAllControls() {
		for (let name in this.controls) {
			this.controls[name].enable();
			this.controls[name].unfade();
		}
	}

	enableControls(controls) {
		for (let i in controls) {
			this.controls[controls[i]].enable();
			this.controls[controls[i]].unfade();
		}
	}
	
	enableAllControlsExcept(exceptions) {
		for (let name in this.controls) {
			if (!exceptions.includes(name)) {
				this.controls[name].enable();
				this.controls[name].unfade();
			}
			else {
				this.controls[name].disable();
				this.controls[name].fade();
			}
		}
	}
	
	freezeAllControls() {
		for (let name in this.controls) {
			this.controls[name].freeze();
		}
	}
	
	unfreezeAllControls() {
		for (let name in this.controls) {
			this.controls[name].unfreeze();
		}
	}
	
	setNESWControls(ABZ) {
		this.controls["North"].setABZ(ABZ);
		this.controls["East"].setABZ(ABZ);
		this.controls["South"].setABZ(ABZ);
		this.controls["West"].setABZ(ABZ);
	}

	disableNESWControls() {
		this.disableControls(["North", "East", "South", "West"]);
	}

	flashNESWControl(name, solveBiz) {
		this.controls[name].flash(solveBiz);
	}

	showBackControlFlag(pathId) {
		this.backControlFlag.show(pathId);
	}

	hideBackControlFlag() {
		this.backControlFlag.hide();
	}
	
	resetTurnsControls() {
		this.controls["TurnsA"].reset();
		this.controls["TurnsB"].reset();
	}
	
	setTurnsControlsToMax() {
		this.controls["TurnsA"].setToMax();
		this.controls["TurnsB"].setToMax();
	}

	toggleTurnsControl(AB) {
		this.controls["Turns" + ABstring[AB]].toggle();
	}
	
	hideCrossTick() {
		this.crossTick.hide();
	}
	
	showTick(solveBiz) {
		this.crossTick.showTick(solveBiz);
	}
	
	flashCross(solveBiz) {
		this.crossTick.flashCross(solveBiz);
	}
	
	deconstruct() {
	}
}

class SolveBiz {	
	constructor(puzzle, abstractMap, turns, io) {
		this.puzzle = puzzle;
		this.abstractMap = abstractMap;
		//this.turnsA = turnsAB.A;
		//this.turnsB = turnsAB.B;
		this.turns = turns;
		this.io = io;

		//this.pathA = 0;
		//this.pathB = 1;
		//this.pathUndefined = 2;
		//this.pathId = undefined
		this.AB = A;
		
		//this.modeTurnsA = Turns_modeOff;
		//this.modeTurnsB = Turns_modeOff;
		
		this.solutionTurnSequence = this.abstractMap.getSolutionTurns();
		this.solutionFound = false;

		this.solutionAB = undefined;
		this.solutionDirections = undefined;
		this.solutionNextIndex = undefined;
		this.solutionEndIndex = undefined;

		this.callbackResolve = undefined;

		this.hintNumShows = 3;
		this.hintNumShowsRemaining = undefined;
		this.hintIsShowing = undefined;

		this.io.hideBackControlFlag();
		this.sleep();
	}
	
	sleep() {
		this.io.disableAllControls();
	}
	
	//wake() is only ever called once per instantiation - at the beginning
	wake() {
		//this.pathId = this.pathA;
		//this.AB = A;
		//this.io.setNESWControls(this.pathId);
		this.io.setNESWControls(this.AB);
		this.io.enableAllControlsExcept(["Reset", "Back"]);
	}
	
	freeze() {
		this.io.freezeAllControls();
	}
	
	unfreeze() {
		this.io.unfreezeAllControls();
	}
	
	adjustControls() {
		if (this.solutionFound) {
			this.io.setNESWControls(Z);
			this.io.disableNESWControls();
			this.io.disableControls(["Back", "Toggle", "TurnsA", "TurnsB"]);
			this.io.enableControls(["Reset"]);			
			this.io.hideBackControlFlag();
			return
		}
		
		const pathLengthA = this.abstractMap.getPathLength(A);
		const pathLengthB = this.abstractMap.getPathLength(B);
		if (pathLengthA === 1 && pathLengthB === 1) {
			this.io.disableControls(["Reset"]);
		}
		else {
			this.io.enableControls(["Reset"]);			
		}

		const pathLength = this.abstractMap.getPathLength(this.AB);
		if (pathLength === 1) {
			this.io.disableControls(["Back"]);
			this.io.hideBackControlFlag();
		}
		else {
			this.io.enableControls(["Back"]);			
			this.io.showBackControlFlag(this.AB);
		}
	}
	
	resetClicked() {
		this.io.hideCrossTick();
		this.io.hideBackControlFlag();
		this.io.resetTurnsControls();
		this.turns[A].reset();
		this.turns[B].reset();
		this.AB = A;
		this.io.setNESWControls(A);
		this.io.enableAllControlsExcept(["Reset", "Back"]);
		this.abstractMap.reset();
		this.solutionFound = false;
	}
	
	toggleClicked() {
		//const newPathId = this.pathId == this.pathA ? this.pathB : this.pathA;
		//this.pathId = newPathId;
		this.AB = ABother[this.AB];
		this.io.setNESWControls(this.AB);
		this.adjustControls();
	}
	
	backClicked() {
		this.abstractMap.removeStep(this.AB, true);
		this.turns[this.AB].setSequence(this.abstractMap.getTurns(this.AB));
		this.adjustControls();
	}

	directionClicked(longDirection) {
		const shortDirection = longDirection[0];
		const analysis = this.abstractMap.analyseStep(this.AB, shortDirection);
		//console.log('analysis', analysis);
		if (analysis === this.abstractMap.analysisNothing) {
			this.abstractMap.addStep(this.AB, shortDirection, true);
			this.turns[this.AB].setSequence(this.abstractMap.getTurns(this.AB));
			this.adjustControls();
		}
		else if (analysis === this.abstractMap.analysisMeetCorrect) {
			//need to check turn sequences match
			const otherAB = ABother[this.AB];
			//temporarily add the step to get the complete turn sequence
			this.abstractMap.addStep(this.AB, shortDirection, false);
			const turnSequenceThisAB = this.abstractMap.getTurns(this.AB);
			this.abstractMap.removeStep(this.AB, false);
			const turnSequenceOtherAB = this.abstractMap.getTurns(otherAB);
			if (turnSequenceThisAB === this.solutionTurnSequence && turnSequenceOtherAB === this.solutionTurnSequence) {
				//solution found: right square, turns match
				this.solutionFound = true;
				//update turn sequence for this path - to include the final step
				this.turns[this.AB].setSequence(turnSequenceThisAB);
				//on the other path, take a step back to make way for the finish
				this.abstractMap.removeStep(otherAB, true);
				//add finish
				this.abstractMap.addFinish(this.AB, shortDirection);
				//must adjust controls before freezing - because freezing is asynchronous
				this.adjustControls();
				this.freeze();
				this.io.showTick(this);			
			}
			else {
				//solution not found: right square, turns don't match
				//this.adjustControls();
				this.freeze();
				this.io.flashCross(this);
			}
		}
		else if (analysis === this.abstractMap.analysisMeetIncorrect) {
			//this.adjustControls();
			this.freeze();
			this.io.flashCross(this);
		}
		else {
			//this.adjustControls();
			this.io.flashNESWControl(longDirection, this);
		}
	}
	
	northClicked() {
		this.directionClicked("North");
	}
	
	eastClicked() {
		this.directionClicked("East");
	}
	
	southClicked() {
		this.directionClicked("South");
	}
	
	westClicked() {
		this.directionClicked("West");
	}
	
	turnsClicked(AB) {
		const turns = this.turns[AB];
		const mode = turns.getMode();
		let newMode = undefined;
		if (mode === Turns_modeOff) {
			newMode = Turns_modeOnHide;
		}
		else if (mode === Turns_modeOnHide){
			newMode = Turns_modeOnShow;
		}
		else {
			newMode = Turns_modeOff;
		}
		turns.setMode(newMode);
		
		this.io.toggleTurnsControl(AB);
	}
	
	turnsAClicked() {
		//this.turnsClicked(this.turnsA, this.modeTurnsA);
		this.turnsClicked(A);
	}
	
	turnsBClicked() {
		//this.turnsClicked(this.turnsB, this.modeTurnsB);
		this.turnsClicked(B);
	}

	hintTimerExpired() {
		this.abstractMap.flashHint(this);
	}

	hintClicked() {
		this.callbackResolve = null;
		this.io.disableAllControls();
		this.io.hideCrossTick();
		if (this.abstractMap.getPathLength(A) === 1 && this.abstractMap.getPathLength(B) === 1) {
			this.abstractMap.flashHint(this);
		}
		else {
			this.abstractMap.reset();
			this.turns[A].setSequence("");
			this.turns[B].setSequence("");
			setTimeout(punterHintTimerExpired, 250);			
		}
	}

	completeHintClicked() {
		this.io.enableAllControlsExcept(["Reset", "Back"]);
		if (this.callbackResolve != null) this.callbackResolve();
	}
/*
	solutionTimerExpired() {
		if (this.solutionAB === A) {
			if (this.solutionNextIndex !== this.solutionEndIndex) {
				this.abstractMap.addStep(A, this.solutionDirections[this.solutionNextIndex], true);
				this.solutionNextIndex++;
			}
			else {
				this.abstractMap.addFinish(A, this.solutionDirections[this.solutionEndIndex]);
				this.solutionAB = B;
				this.solutionDirections = this.abstractMap.getSolutionDirections()[B];
				this.solutionEndIndex = this.solutionDirections.length - 2;
				this.solutionNextIndex = 0;
			}
		}
		else {
			this.abstractMap.addStep(B, this.solutionDirections[this.solutionNextIndex], true);
			if (this.solutionNextIndex !== this.solutionEndIndex) {
				this.solutionNextIndex++;
			}
			else {
				this.turns[A].setSequence(this.solutionTurnSequence);
				this.turns[B].setSequence(this.solutionTurnSequence);
				this.turns[A].setMode(Turns_modeOnShow);
				this.turns[B].setMode(Turns_modeOnShow);
				this.io.setTurnsControlsToMax();
				this.io.enableControls(["Reset", "Information"]);
				return;
			}
		}
		setTimeout(punterSolutionTimerExpired, 500);
	}
*/
	solutionTimerExpired() {
		if (this.solutionNextIndex === -1) {
			this.turns[A].setSequence(this.solutionTurnSequence);
			this.turns[B].setSequence(this.solutionTurnSequence);
			this.turns[A].setMode(Turns_modeOnShow);
			this.turns[B].setMode(Turns_modeOnShow);
			this.io.setTurnsControlsToMax();
			this.io.enableControls(["Reset", "Information"]);
			return;
		}
		if (this.solutionAB === A) {
			if (this.solutionNextIndex !== this.solutionEndIndex) {
				this.abstractMap.addStep(A, this.solutionDirections[this.solutionNextIndex], true);
				this.solutionNextIndex++;
			}
			else {
				this.abstractMap.addFinish(A, this.solutionDirections[this.solutionEndIndex]);
				this.solutionAB = B;
				this.solutionDirections = this.abstractMap.getSolutionDirections()[B];
				this.solutionEndIndex = this.solutionDirections.length - 2;
				this.solutionNextIndex = 0;
			}
		}
		else {
			this.abstractMap.addStep(B, this.solutionDirections[this.solutionNextIndex], true);
			if (this.solutionNextIndex !== this.solutionEndIndex) {
				this.solutionNextIndex++;
			}
			else {
				this.solutionNextIndex = -1;
			}
		}
		setTimeout(punterSolutionTimerExpired, 500);
	}

	solutionClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		this.solutionAB = A;
		this.solutionDirections = this.abstractMap.getSolutionDirections()[A];
		this.solutionEndIndex = this.solutionDirections.length - 1;
		if (this.abstractMap.getPathLength(A) === 1 && this.abstractMap.getPathLength(B) === 1) {
			this.abstractMap.addStep(A, this.solutionDirections[0], true);
			this.solutionNextIndex = 1;
		}
		else {
			this.abstractMap.reset();
			this.turns[A].setSequence("");
			this.turns[B].setSequence("");
			this.solutionNextIndex = 0;
		}
		setTimeout(punterSolutionTimerExpired, 500);
	}

/*
	hintTimerExpired() {
		if (this.hintIsShowing) {
			this.grid.undisplayLetter(this.puzzle.hintPlace);
			this.hintIsShowing = false;
			this.hintNumShowsRemaining--;
			if (this.hintNumShowsRemaining == 0) {
				this.io.enableAllControlsExcept(["Reset", "Forward", "Backward"]);
				return;
			}
		}
		else {
			this.grid.displayLetter(this.puzzle.hintLetter, this.puzzle.hintPlace);
			this.hintIsShowing = true;
		}
		setTimeout(punterHintTimerExpired, 1000);
	}

	hintClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		let isEmpty = true;
		for (let i = 1; i <= 5; i++) {
			if (this.words[i].inGrid) {
				isEmpty = false;
				break;
			}
		}
		if (isEmpty) {
			this.grid.displayLetter(this.puzzle.hintLetter, this.puzzle.hintPlace);
			this.hintIsShowing = true;
			this.hintNumShowsRemaining = this.hintNumShows;
		}
		else {
			this.reset();			
			this.hintIsShowing = false;
			this.hintNumShowsRemaining = this.hintNumShows;
		}
		setTimeout(punterHintTimerExpired, 1000);
	}

	hintWithCallbackTimerExpired() {
		if (this.hintShowing) {
			this.grid.undisplayLetter(this.puzzle.hintPlace);
			this.hintShowing = false;
			this.hintNumShowsRemaining--;
			if (this.hintNumShowsRemaining == 0) {
				this.io.enableAllControlsExcept(["Reset"]);
				this.callbackResolve();
				return;
			}
		}
		else {
			this.grid.displayLetter(this.puzzle.hintLetter, this.puzzle.hintPlace);
			this.hintShowing = true;			
		}
		setTimeout(demoHintTimerExpired, 1000);
	}

	hintWithCallback() {
		return new 	Promise((resolve, reject) => {
								this.io.disableAllControls();
								this.callbackResolve = resolve;
								this.grid.displayLetter(this.puzzle.hintLetter, this.puzzle.hintPlace);
								this.hintShowing = true;
								this.hintNumShowsRemaining = this.hintNumShows;
								setTimeout(demoHintTimerExpired, 1000);
							}
					);
	}

	solutionTimerExpired() {
		this.grid.addWord(this.puzzle.words[this.solutionNextIndex], this.puzzle.solution[this.solutionNextIndex]);
		this.grid.refresh();
		this.solutionNextIndex++;
		if (this.solutionNextIndex == 6) {
			this.io.enableControls(["Reset", "Information"]);
			return;
		}
		setTimeout(punterSolutionTimerExpired, 1000);
	}

	solutionClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		if (this.getNumWordsInGrid() == 0) {
			this.grid.addWord(this.puzzle.words[1], this.puzzle.solution[1]);
			this.grid.refresh();
			this.solutionNextIndex = 2;
		}
		else {
			this.reset();
			this.solutionNextIndex = 1;
		}
		setTimeout(punterSolutionTimerExpired, 1000);
	}
		
	solutionWithCallbackTimerExpired() {
		this.grid.addWord(this.puzzle.words[this.solutionNextIndex], this.puzzle.solution[this.solutionNextIndex]);
		this.grid.refresh();
		this.solutionNextIndex++;
		if (this.solutionNextIndex == 6) {
			this.io.enableControls(["Reset"]);
			this.callbackResolve();
			return;
		}
		setTimeout(demoSolutionTimerExpired, 1000);
	}

	solutionWithCallback() {
		return new 	Promise((resolve, reject) => {
								this.io.disableAllControls();
								this.callbackResolve = resolve;
								this.grid.addWord(this.puzzle.words[1], this.puzzle.solution[1]);
								this.grid.refresh();
								this.solutionNextIndex = 2;
								setTimeout(demoSolutionTimerExpired, 1000);
							}
					);
	}
	
	deconstruct() {
		for (let i = 1; i <= 5; i++) {
			this.words[i].deconstruct();
		}
	}
*/
}


/* -------- Punter -------- */

function punterInformationOnClick() {
	//console.log("informationOnClick called");
	mainWall.hide();
	infoWall.show();
	enableScrolling();
}

function punterTurnsAOnClick() {punter.solveBiz.turnsAClicked();};
function punterTurnsBOnClick() {punter.solveBiz.turnsBClicked();};
function punterNorthOnClick() {punter.solveBiz.northClicked();};
function punterEastOnClick() {punter.solveBiz.eastClicked();};
function punterSouthOnClick() {punter.solveBiz.southClicked();};
function punterWestOnClick() {punter.solveBiz.westClicked();};
function punterResetOnClick() {punter.solveBiz.resetClicked();};
function punterToggleOnClick() {punter.solveBiz.toggleClicked();};
function punterBackOnClick() {punter.solveBiz.backClicked();};
function punterHintOnClick() {punter.solveBiz.hintClicked();};
function punterHintTimerExpired() {punter.solveBiz.hintTimerExpired();};
function punterSolutionOnClick() {punter.solveBiz.solutionClicked();};
function punterSolutionTimerExpired() {punter.solveBiz.solutionTimerExpired();};

class Punter {
	constructor(puzzle) {
		this.puzzle = puzzle;

		this.abstractMap = new AbstractMap(puzzle, "#mwdpTerritory");

		//const turnsA = new Turns("A", "#mwdpTurns");
		//const turnsB = new Turns("B", "#mwdpTurns");
		this.turns = [];
		this.turns[A] = new Turns(A, "#mwdpTurns");
		this.turns[B] = new Turns(B, "#mwdpTurns");
		
		this.controls = [];
		this.controls["Information"] = new Control("#mwdCtrlInformation", punterInformationOnClick);
		this.controls["Hint"] = new Control("#mwdCtrlHint", punterHintOnClick);
		this.controls["Solution"] = new Control("#mwdCtrlSolution", punterSolutionOnClick);
		this.controls["Reset"] = new Control("#mwdCtrlReset", punterResetOnClick);
		this.controls["Toggle"] = new Control("#mwdCtrlToggle", punterToggleOnClick);
		this.controls["Back"] = new Control("#mwdCtrlBack", punterBackOnClick);
		this.controls["North"] = new NESWControl("#mwdCtrlNorth", punterNorthOnClick);
		this.controls["East"] = new NESWControl("#mwdCtrlEast", punterEastOnClick);
		this.controls["South"] = new NESWControl("#mwdCtrlSouth", punterSouthOnClick);
		this.controls["West"] = new NESWControl("#mwdCtrlWest", punterWestOnClick);
		this.controls["TurnsA"] = new TurnsControl("#mwdpCtrlTurnsA", punterTurnsAOnClick);
		this.controls["TurnsB"] = new TurnsControl("#mwdpCtrlTurnsB", punterTurnsBOnClick);

		this.crossTick = new CrossTick("#mwCrossTick");
		this.backControlFlag = new BizBackControlFlag("#mwdCtrlBackFlag");
		this.solveIO = new SolveIO(this.controls, this.crossTick, this.backControlFlag);	
		
		//this.solveBiz = new SolveBiz(puzzle, this.abstractMap, {A: turnsA, B: turnsB}, this.solveIO);
		this.solveBiz = new SolveBiz(puzzle, this.abstractMap, this.turns, this.solveIO);
	}
	
	deconstruct() {
		//console.log("Punter.deconstruct called");
		this.solveBiz.deconstruct();
		this.grid.deconstruct();
		this.solveIO.deconstruct();
		this.crossTick.deconstruct();
		
		//console.log(this.controls);		
		for (let control in this.controls) {
			this.controls[control].deconstruct();
		}
	}
}


/* -------- Demo -------- */

function demoHintTimerExpired() {demo.solveBiz.hintWithCallbackTimerExpired();};
function demoSolutionTimerExpired() {demo.solveBiz.solutionWithCallbackTimerExpired();}

class Demo {
	constructor() {
		const puzzleSpec = {
			number: undefined,
			solveBy: undefined,
			wordSpec: [undefined, "ARCANE", "CAREER", "EARNER", "ARENA", "BANANAS"],
			solutionSpec: [undefined, [2, 2], [3, 1], [5, 1], [1, 2], [4, 1]],
			hintSpec: ["R", [1, 3]]
		};
		this.puzzle = new Puzzle(puzzleSpec);
		
		this.controls = [];
		this.controls["Information"] = new Control("#iwdCtrlInformation", null);
		this.controls["Hint"] = new Control("#iwdCtrlHint", null);
		this.controls["Solution"] = new Control("#iwdCtrlSolution", null);
		this.controls["Reset"] = new Control("#iwdCtrlReset", null);
		this.controls["Forward"] = new XwardControl("#iwdCtrlForward", null);
		this.controls["Backward"] = new XwardControl("#iwdCtrlBackward", null);
		this.controls["Word1"] = new WordControl(this.puzzle.words[1], "iwdpWord-1", null);
		this.controls["Word2"] = new WordControl(this.puzzle.words[2], "iwdpWord-2", null);
		this.controls["Word3"] = new WordControl(this.puzzle.words[3], "iwdpWord-3", null);
		this.controls["Word4"] = new WordControl(this.puzzle.words[4], "iwdpWord-4", null);
		this.controls["Word5"] = new WordControl(this.puzzle.words[5], "iwdpWord-5", null);

		this.crossTick = new CrossTick("#iwdCrossTick");
		this.solveIO = new SolveIO(this.controls, this.crossTick);	

		this.grid = new Grid("iwdp");
		this.grid.completeInitialisation();

		this.solveBiz = new SolveBiz(this.puzzle, this.grid, this.solveIO);
	}
	
	enter() {
		infoWall.controlBack.disable();
		infoWall.controlBack.fade();
		infoWall.controlDemo.disable();
		infoWall.controlDemo.fade();
		
		infoWall.separator2Ref.scrollIntoView({behavior:"smooth"});
		
		demoExecuteScript();
	}
	
	exit() {
		infoWall.controlBack.enable();
		infoWall.controlBack.unfade();
		infoWall.controlDemo.enable();
		infoWall.controlDemo.unfade();
		
		window.scrollTo({top:0, left:0, behavior:"smooth"});
	}
	
	deconstruct() {
		this.solveBiz.deconstruct();
		this.grid.deconstruct();
		this.solveIO.deconstruct();
		this.crossTick.deconstruct();
		for (let control in this.controls) {
			this.controls[control].deconstruct();
		}
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			this.dispensers[i].deconstruct();
		}
		this.puzzle.deconstruct();
	}
}

const demoScript = [
	"Word1,3,1",
	"Pause",
	"Forward",
	"Pause",
	"Forward",
	"Pause",			
	"Forward",
	"Pause",
	"Forward",
	"Pause",
	"Forward",
	"Pause",
	"Forward",
	"Pause",							
	"Backward",
	"Pause",
	"Word1",
	"Pause",
	"Pause",
	"Word3,2,2",		
	"Pause",							
	"Word5,1,1",
	"Pause",
	"Forward",
	"Pause",
	"Pause",
	"Word3",
	"Pause",				
	"Word3",
	"Pause",
	"Pause",
	"Word5",
	"Pause",
	"Forward",
	"Pause",
	"Word2,5,1",
	"Pause",			
	"Backward",
	"Pause",			
	"Word1,1,2",
	"Pause",	
	"Forward",	
	"Pause",
	"Word4,1,2",
	"Pause",
	"Word3,5,1",
	"Pause",
	"Pause",
	"Pause",
	"Pause",
	"Reset",
	"Pause",
	"Pause",
	"Hint",
	"Pause",
	"Pause",
	"Solution"
];

function demoShowSpot(spotRef, opacity) {
	spotRef.style.display = `block`;
	spotRef.style.opacity = `${opacity}`;
	}
	
function demoHideSpot(spotRef) {
	spotRef.style.display = `none`;
	}

async function demoExecuteScript() {
	let spotRefLookUp = [];
	const iwdControls = ["Hint", "Solution", "Reset", "Forward", "Backward"]
	for (let control of iwdControls) spotRefLookUp[control] = document.querySelector("#iwdSpot" + control);
	for (let w = 1; w <= 5; w++) spotRefLookUp["Word" + String(w)] = document.querySelector("#iwdpSpotWord-" + String(w));
	
	const spotFadeSequence = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

	//waiting for smooth scroll to complete
	await wait(1000);
	disableScrolling();
	
	demo.solveBiz.wake();
	await wait(1000);
	for (let command of demoScript) {
		if (command === "Pause") {
			await wait(500);
			continue;
		}
		
		const control = command.split(",")[0];
		const spotRef = spotRefLookUp[control];
		for (let opacity of spotFadeSequence) {
			demoShowSpot(spotRef, opacity);
			await wait(100);
		}
		
		switch(command) {
		case "Hint":
			await demo.solveBiz.hintWithCallback();
			break;
		case "Solution":
			await demo.solveBiz.solutionWithCallback();
			break;
		case "Reset":
			demo.solveBiz.resetClicked();
			break;
		case "Forward":
			demo.solveBiz.forwardClicked();
			break;
		case "Backward":
			demo.solveBiz.backwardClicked();
			break;
		case "Word1":
			demo.solveBiz.wordClicked(1);
			break;
		case "Word2":
			demo.solveBiz.wordClicked(2);
			break;
		case "Word3":
			demo.solveBiz.wordClicked(3);
			break;
		case "Word4":
			demo.solveBiz.wordClicked(4);
			break;
		case "Word5":
			demo.solveBiz.wordClicked(5);
			break;
		default:
			const splitWordCommand = command.split(",");
			demo.solveBiz.demoWordClicked(Number(splitWordCommand[0][4]), Number(splitWordCommand[1]), Number(splitWordCommand[2]));
			break;
		}
		
		demoHideSpot(spotRef);
		await wait(1000);
	}
	
	await wait(1500);
	demo.solveBiz.reset();
	demo.solveBiz.sleep();	
	
	await wait(1000);
	enableScrolling();
	demo.exit();
}


/* -------- Configuration -------- */

let mainWall = undefined;
let punter = undefined;
let infoWall = undefined;
let demo = undefined;

function configure() {
	const punterPuzzle = new Puzzle(puzzleSpecs[0]);
	mainWall = new MainWall(mainWallSpec);
	punter = new Punter(punterPuzzle);
	infoWall = new InfoWall(mainWall.topPosition, mainWall.leftPosition, mainWall.fontSize, punterPuzzle);
	//demo = new Demo();	
}


function reconfigure(punterPuzzle) {
	//demo.deconstruct();
	infoWall.deconstruct();
	punter.deconstruct();
	//mainWall.deconstruct();
	//mainWall = new MainWall(mainWallSpec);
	punter = new Punter(punterPuzzle);
	infoWall = new InfoWall(mainWall.topPosition, mainWall.leftPosition, mainWall.fontSize, punterPuzzle);
	//demo = new Demo();		
}


/* -------- Begin -------- */

//const published = new Published();
configure();


/* -------- Preamble -------- */
/*
async function performPreamble() {	
	infoWall.show();

	await wait(1500);

	const surroundInstructionsRef = document.querySelector("#iwSurroundInstructions");
	surroundInstructionsRef.style.display = `block`;
	await wait(750);
	surroundInstructionsRef.style.display = `none`;

	await wait(750);

	const separator2Ref = document.querySelector("#iwSeparator-2");
	separator2Ref.scrollIntoView({behavior: "smooth"});

	await wait(1000);
	
	const surroundDemonstrationRef = document.querySelector("#iwdSurroundDemonstration");
	surroundDemonstrationRef.style.display = `block`;
	await wait(750);
	surroundDemonstrationRef.style.display = `none`;

	await wait(1000);

	infoWall.hide();
	mainWall.show();
	
	await wait(1000);

	const surroundInformationRef = document.querySelector("#mwdSurroundInformation");
	surroundInformationRef.style.display = `block`;
	await wait(500);
	surroundInformationRef.style.display = `none`;
	
	infoWall.controlBack.unfreeze();
	infoWall.controlDemo.unfreeze();
	punter.solveBiz.unfreeze();
	disableScrolling();
}
*/
async function performPreamble() {
	mainWall.show();
	
	await wait(1000);

	const surroundInformationRef = document.querySelector("#mwdSurroundInformation");
	surroundInformationRef.style.display = `block`;
	await wait(500);
	surroundInformationRef.style.display = `none`;

	await wait(750);

	mainWall.hide();
	infoWall.show();

	await wait(1500);

	const surroundInstructionsRef = document.querySelector("#iwSurroundInstructions");
	surroundInstructionsRef.style.display = `block`;
	await wait(750);
	surroundInstructionsRef.style.display = `none`;

	await wait(750);

	const separator2Ref = document.querySelector("#iwSeparator-2");
	separator2Ref.scrollIntoView({behavior: "smooth"});

	await wait(1000);
	
	const surroundDemonstrationRef = document.querySelector("#iwdSurroundDemonstration");
	surroundDemonstrationRef.style.display = `block`;
	await wait(750);
	surroundDemonstrationRef.style.display = `none`;

	await wait(1000);

	infoWall.hide();
	mainWall.show();
	
	infoWall.controlBack.unfreeze();
	infoWall.controlDemo.unfreeze();
	//punter.solveBiz.unfreeze();
	punter.solveBiz.wake();
	disableScrolling();
}

//infoWall.controlBack.freeze();
//infoWall.controlDemo.freeze();
//performPreamble();

/*
let svg = "http://www.w3.org/2000/svg";

let dot = document.createElementNS(svg, "circle");
dot.setAttribute("cx", "250");
dot.setAttribute("cy", "250");
dot.setAttribute("r", "20");
dot.setAttribute("fill", "blue");

let warren = document.querySelector("#mwdpWarren");
warren.append(dot);
*/

mainWall.show()
punter.solveBiz.wake();


