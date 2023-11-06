const numGridColumns = 59;

//main wall
const mainWallHeightAboveDoor = 10;

//punter door
const punterDoorHeightAbovePanel = 12;
const punterDoorHeightBelowPanel = 21;

//punter panel
const punterPanelHeightAboveDispensers = 3;
const punterPanelHeightBelowDispensers = 31;
const containerCompartmentHeight = 8;

console.log(`${window.innerHeight}px`);
console.log(`${window.innerWidth}px`);
console.log(`${window.devicePixelRatio}`);

const puzzleDataRef = document.querySelector("#iwPuzzleData");
puzzleDataRef.innerHTML = "<strong>Puzzle #" + String(punterPuzzleSpec.number) + "&emsp;&boxh;&emsp;Solve by " + punterPuzzleSpec.solveBy + "</strong>";

function wait(duration) {
	return new Promise((resolve, reject) => {setTimeout(resolve, duration)});
}

function updateFontSize(numGridRows, numGridColumns) {
	console.log('updateFontSize called');
	console.log(numGridRows);
	console.log(numGridColumns);
	  
	let innerDimension = 0
	let gridDimension = 0
	if ((window.innerHeight / numGridRows) <= (window.innerWidth / numGridColumns)) {
		innerDimension = window.innerHeight;
		gridDimension = numGridRows;
	}
	else {
		innerDimension = window.innerWidth;
		gridDimension = numGridColumns;
	}
	
	const percent = innerDimension / 100;
	console.log('percent');
	console.log(percent);
	let fontSize = 0;
	let reducingInnerDimension = innerDimension + 1;
	do {
		reducingInnerDimension = reducingInnerDimension - 1
		fontSize = Math.floor((reducingInnerDimension / gridDimension) * window.devicePixelRatio) / window.devicePixelRatio
		console.log('fontSize');
		console.log(fontSize);
	} while ((innerDimension - (fontSize * gridDimension)) < (2 * percent));
	console.log('final fontSize');
	console.log(fontSize);
	document.body.style.fontSize = `${fontSize}px`;
  
	let spareHeight = window.innerHeight - (fontSize * numGridRows);
	console.log('spareHeight');
	console.log(spareHeight);
	let deviceSpareHeight = spareHeight * window.devicePixelRatio;
	console.log('deviceSpareHeight');
	console.log(deviceSpareHeight);
	let roundedDeviceSpareHeight = Math.trunc(deviceSpareHeight / 2) * 2;
	console.log('roundedDeviceSpareHeight');
	console.log(roundedDeviceSpareHeight);
	let roundedSpareHeight = roundedDeviceSpareHeight / window.devicePixelRatio;
	console.log('roundedSpareHeight');
	console.log(roundedSpareHeight);
	let mainRef = document.querySelector("#mainWall");
	let infoRef = document.querySelector("#infoWall");
	mainRef.style.top = `${roundedSpareHeight / 2}px`;
	infoRef.style.top = `${roundedSpareHeight / 2}px`;
  
	let spareWidth = window.innerWidth - (fontSize * numGridColumns);
	console.log('spareWidth');
	console.log(spareWidth);
	let deviceSpareWidth = spareWidth * window.devicePixelRatio;
	console.log('deviceSpareWidth');
	console.log(deviceSpareWidth);
	let roundedDeviceSpareWidth = Math.trunc(deviceSpareWidth / 2) * 2
	console.log('roundedDeviceSpareWidth');
	console.log(roundedDeviceSpareWidth);
	let roundedSpareWidth = roundedDeviceSpareWidth / window.devicePixelRatio;
	console.log('roundedSpareWidth');
	console.log(roundedSpareWidth);
	mainRef.style.left = `${roundedSpareWidth / 2}px`;
	infoRef.style.left = `${roundedSpareWidth / 2}px`;
  
	return fontSize;
}

class Puzzle {
	constructor(puzzleSpec) {
		this.dispenserFullSpec = puzzleSpec.dispenserSpec;
		this.numDispensers = this.dispenserFullSpec.length - 1;
		this.dispenserHeightSpec = [undefined];
		for (let i = 1; i <= this.numDispensers; i++) this.dispenserHeightSpec[i] = this.dispenserFullSpec[i].length;
		this.maxDispenserHeight = 1;
		for (let d = 1; d <= this.numDispensers; d++) {
			if (this.dispenserHeightSpec[d] > this.maxDispenserHeight) this.maxDispenserHeight = this.dispenserHeightSpec[d];
		};
		
		this.matrixSpec = puzzleSpec.matrixSpec;
/*
		let colourCodeLookUp = [];
		colourCodeLookUp["black"] = `black`;
		colourCodeLookUp["blue"] = `#0072B2`;
		colourCodeLookUp["green"] = `#009E73`;
		colourCodeLookUp["orange"] = `#E69F00`;
		colourCodeLookUp["pink"] = `#CC79A7`; */
		
		this.tileColours = [];
		const tileCodes = ["p", "q", "r", "s", "t"];
		for (let i = 0; i < tileCodes.length; i++) this.tileColours[tileCodes[i]] = puzzleSpec.colourSpec[i];
		
		this.hintColour = puzzleSpec.hintSpec[0];
		this.hintIndex = puzzleSpec.hintSpec[1];
		
		this.solutionDispenseSequence = puzzleSpec.solutionDispenseSequence;
		this.solutionColourSequence = [];
		//why copy?
		for (let i = 0; i < puzzleSpec.solutionColourSequence.length; i++) this.solutionColourSequence[i] = puzzleSpec.solutionColourSequence[i];
	}
};

function crossTickFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashCrossTick(crossTickRef, solveBiz) {
	await wait(300);
	crossTickRef.style.display = `none`;
	await wait(300);
	crossTickRef.style.display = `block`;
	await wait(300);
	crossTickRef.style.display = `none`;
	await wait(300);
	crossTickRef.style.display = `block`;
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
		flashCrossTick(this.ref, solveBiz);
	}
	
	hide() {
		this.ref.style.display = `none`;
	}
}

class Tile {
	constructor(dispenser, humanColour) {
		this.dispenser = dispenser;
		this.humanColour = humanColour;
		
		let colourCodeLookUp = [];
		colourCodeLookUp["black"] = `black`;
		colourCodeLookUp["blue"] = `#0072B2`;
		colourCodeLookUp["green"] = `#009E73`;
		colourCodeLookUp["orange"] = `#E69F00`;
		colourCodeLookUp["pink"] = `#CC79A7`;
		this.machineColour = colourCodeLookUp[humanColour];
	}
}

class Dispenser {
	constructor(puzzle, tileSequence, tileIdRoot) {
		this.tileQueue = [];
		for (let t = 0; t < tileSequence.length; t++) {
			const tile = new Tile(this, puzzle.tileColours[tileSequence[t]]);
			this.tileQueue.unshift(tile);
		}
		
		this.tileRefs = [];
		for (let i = 1; i <= tileSequence.length; i++) {
			const tileId = tileIdRoot + String(i);
			const tileRef = document.querySelector(tileId);
			this.tileRefs.push(tileRef);
		}
		
		this.container = [];
		for (let t = 0; t < this.tileQueue.length; t++) this.container[t] = this.tileQueue[t];
				
		this.numTilesInContainer = this.tileQueue.length;
	}
	
	refresh() {
		for (let t = 0; t < this.container.length; t++) {
			if (this.container[t] == null) {
				this.tileRefs[t].style.display = `none`;
			}
			else {
				this.tileRefs[t].style.display = `block`;
				this.tileRefs[t].style.backgroundColor = this.container[t].machineColour;
			}
		}
	}
	
	reset() {	
		this.container = [];
		for (let t = 0; t < this.tileQueue.length; t++) this.container[t] = this.tileQueue[t];
		this.numTilesInContainer = this.tileQueue.length;
	}
	
	takeTile() {
		const tile = this.container.shift();
		this.container.push(null);
		this.numTilesInContainer--;
		return tile;
	}
	
	replaceTile() {
		this.container.pop();
		const tile = this.tileQueue[this.tileQueue.length - this.numTilesInContainer - 1];
		this.container.unshift(tile);
		this.numTilesInContainer++;		
	}
}
/*
class Grid {
	constructor(puzzle, squareIdRoot) {
		this.squarePositions = puzzle.gridSpec;
		for (let i = 0;  i < this.squarePositions.length; i++) {
			const position = i + 1;
			const squareId = squareIdRoot + String(this.squarePositions[i]);
			const squareElement = document.querySelector(squareId);
			squareElement.textContent = String(position);
		}

		this.squareStyles = [undefined];
		this.squareTiles = [undefined];
		const styleSheet = document.styleSheets[0];
		for (let s = 1; s <= 9; s++) {
			const squareId = squareIdRoot + String(s);
			const squareRule = [...styleSheet.cssRules].find((r) => r.selectorText === squareId);
			this.squareStyles.push(squareRule);
			this.squareTiles.push(null);
			}
			
		this.numTilesInPlace = 0;
		this.temporaryIndex = undefined;
	}
	
	getColourSequence() {
		let colourSequence = [];
		for (let s = 1; s <= 9; s++) {
			if (this.squareTiles[s] == null) colourSequence.push(``); else colourSequence.push(this.squareTiles[s].colour);
		}
		return colourSequence;
	}
	
	reset() {
		for (let s = 1; s <= 9; s++) this.squareTiles[s] = null;
		this.numTilesInPlace = 0;	
	}

	addTile(tile) {
		const nextPosition = this.squarePositions[this.numTilesInPlace];
		this.squareTiles[nextPosition] = tile;
		this.numTilesInPlace++;
	}
	
	removeTile() {
		const tileNum = this.squarePositions[this.numTilesInPlace - 1];
		const tile = this.squareTiles[tileNum];
		this.squareTiles[tileNum] = null;
		this.numTilesInPlace--;
		return tile;
	}
	
	addTemporaryTile(tile, index) {
		this.squareTiles[index] = tile;
		this.temporaryIndex = index;
	}
	
	removeTemporaryTile() {
		this.squareTiles[this.temporaryIndex] = null;
	}
	
	refresh() {
		for (let s = 1; s <= 9; s++) {
			let backgroundColour = matrixBackgroundColour;
			let foregroundColour = matrixForegroundColour;
			if (this.squareTiles[s] != null) {
				backgroundColour = this.squareTiles[s].colour;
				foregroundColour = backgroundColour;
			}
			this.squareStyles[s].style.setProperty("background-color", backgroundColour);
			this.squareStyles[s].style.setProperty("color", foregroundColour);
		}
	}
}
*/
class Matrix {
	constructor(puzzle, squareIdRoot) {
		this.puzzle = puzzle;
/*		
		this.colourCodeLookUp = [];
		this.colourCodeLookUp["black"] = `black`;
		this.colourCodeLookUp["blue"] = `#0072B2`;
		this.colourCodeLookUp["green"] = `#009E73`;
		this.colourCodeLookUp["orange"] = `#E69F00`;
		this.colourCodeLookUp["pink"] = `#CC79A7`; */
					
		this.squareRefs = [undefined];
		this.squareDigits = [undefined];
		this.squareTiles = [undefined];
		for (let s = 1; s <= 9; s++) {
			const squareId = squareIdRoot + String(s);
			const squareRef = document.querySelector(squareId);
			this.squareRefs.push(squareRef);
			squareRef.textContent = String(puzzle.matrixSpec[s - 1]);
			this.squareTiles.push(null);
		}

		this.fillOrder = [];
		for (let i = 0; i < puzzle.matrixSpec.length; i++) {
			this.fillOrder[puzzle.matrixSpec[i] - 1] = i + 1;
		}

		this.numTilesInPlace = 0;
		this.temporaryIndex = undefined;
		
		this.foregroundColour = `#B2B2B2`;

	}
	
	getNumTilesInPlace() {
		return this.numTilesInPlace;
	}
	
	getColourSequence() {
		let colourSequence = [];
		for (let s = 1; s <= 9; s++) {
			if (this.squareTiles[s] == null) colourSequence.push("none"); else colourSequence.push(this.squareTiles[s].humanColour);
		}
		return colourSequence;
	}
	
	reset() {
		for (let s = 1; s <= 9; s++) this.squareTiles[s] = null;
		this.numTilesInPlace = 0;	
	}

	addTile(tile) {
		const nextPosition = this.fillOrder[this.numTilesInPlace];
		this.squareTiles[nextPosition] = tile;
		this.numTilesInPlace++;
	}
	
	removeTile() {
		const squareNum = this.fillOrder[this.numTilesInPlace - 1];
		const tile = this.squareTiles[squareNum];
		this.squareTiles[squareNum] = null;
		this.numTilesInPlace--;
		return tile;
	}
	
	addTemporaryTile(tile, index) {
		this.squareTiles[index] = tile;
		this.temporaryIndex = index;
	}
	
	removeTemporaryTile() {
		this.squareTiles[this.temporaryIndex] = null;
	}
/*	
	refresh() {
		for (let s = 1; s <= 9; s++) {
			const squareRef = this.squareRefs[s];
			if (this.squareTiles[s] == null) {
				squareRef.style.backgroundColor = `transparent`;
				squareRef.style.visibility = `visible`;
			}
			else {
				squareRef.style.backgroundColor = this.squareTiles[s].machineColour;
				squareRef.style.visibility = `hidden`;
			}
		}
	} */
	
	refresh() {
		for (let s = 1; s <= 9; s++) {
			const squareRef = this.squareRefs[s];
			if (this.squareTiles[s] == null) {
				squareRef.style.backgroundColor = `transparent`;
				squareRef.style.color = this.foregroundColour;
			}
			else {
				const tileColour = this.squareTiles[s].machineColour;
				squareRef.style.backgroundColor = tileColour;
				squareRef.style.color = tileColour;
			}
		}
	}

/*	
	hideLastTileAdded() {
		console.log(this.numTilesInPlace)
		const segmentNum = this.segmentPositions[this.numTilesInPlace - 1];
		this.segmentRefs[segmentNum].style.display = `none`;
		this.digitRefs[segmentNum].style.visibility = `visible`;
	}
	
	showLastTileAdded() {
		const segmentNum = this.segmentPositions[this.numTilesInPlace - 1];
		this.segmentRefs[segmentNum].style.display = `block`;
		this.digitRefs[segmentNum].style.visibility = `hidden`;
	} */
}

function hintFlashed(solveBiz) {solveBiz.completeHintClicked()}

async function flashHint(solveBiz, script) {
	await wait(500);
	const waitTimes = [1500, 500];
	for (let i = 0; i <= 1; i++) {
		for (let command of script) {
			if (command.ref != null) command.ref.innerHTML = command.html;
			if (command.pause != 0) await wait(command.pause);		
		}
		await wait(waitTimes[i]);
	}
	hintFlashed(solveBiz)
}

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
		//console.log("Control.enable");
		if (this.isFrozen) return;
		if (!this.isEnabled) {
			if (this.OnClick !== null) this.ref.addEventListener("click", this.onClick);
			this.isEnabled = true;
		}
	}
	
	disable() {
		//console.log("Control.disable");
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
		this.ref.style.opacity = `0.5`;
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
}
	
class SolveIO {
	constructor(controls, crossTick) {
	//controls
	//an array of Control objects indexed by these names: "DispenseN", "Information", "Hint", "Reset", "Solution", "Undispense"
	this.controls = controls;
	this.crossTick = crossTick;
	}

	disableAllControls() {
		for (let name in this.controls) {
			this.controls[name].disable();
			this.controls[name].fade();
		}
	}

	disableControls(controls) {
		//console.log("disableControls");
		//console.log(controls);
		//for (let i in controls) {
		for (let name of controls) {
			this.controls[name].disable();
			this.controls[name].fade();
		}
	}
	
	enableAllControls() {
		for (let name in this.controls) {
			this.controls[name].enable();
			this.controls[name].unfade();
		}
	}

	enableControls(controls) {
		//console.log("enableControls");
		//console.log(controls);
		for (let name of controls) {
			this.controls[name].enable();
			this.controls[name].unfade();
		}
	}
	
	enableAllControlsExcept(exceptions) {
		//CHECK THIS USE OF in
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
		
	hideCrossTick() {
		this.crossTick.hide();
	}
	
	showTick(solveBiz) {
		this.crossTick.showTick(solveBiz);
	}
	
	showCross(solveBiz) {
		this.crossTick.showCross(solveBiz);
	}
}

class SolveBiz {	
	constructor(puzzle, dispensers, matrix, io) {
		this.puzzle = puzzle;
		this.dispensers = dispensers;
		this.matrix = matrix;
		this.io = io;
		
		for (let i = 1; i <= puzzle.numDispensers; i++) this.dispensers[i].refresh();
		this.matrix.refresh();

		//this.hintNumShows = 3;
		//this.hintNumShowsRemaining = undefined;
		//this.hintIsShowing = undefined;

		//??this.solutionNextIndex = undefined;
		//this.callbackResolve = undefined;

		this.sleep();
	}
	
	sleep() {
		this.io.disableAllControls();
	}
	
	wake() {
		this.io.enableAllControlsExcept(["Reset", "Undispense"]);
	}
	
	freeze() {
		this.io.freezeAllControls();
	}
	
	unfreeze() {
		this.io.unfreezeAllControls();
	}

	reset() {
		this.matrix.reset();
		this.matrix.refresh();
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			const dispenser = this.dispensers[i];
			dispenser.reset();
			dispenser.refresh();
		}
		this.dispenseSequence = [];
		this.io.hideCrossTick();
	}
	
	updateDispenseControls() {
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			if (this.dispensers[i].numTilesInContainer == 0) {
				this.io.disableControls(["Dispense" + String(i)]);
			}
			else {
				this.io.enableControls(["Dispense" + String(i)]);
			}
		}
	}

	review() {
		this.updateDispenseControls();
		if (this.matrix.getNumTilesInPlace() == 0) {
			this.io.disableControls(["Reset", "Undispense"]);
		}
		else {
			this.io.enableControls(["Reset", "Undispense"]);
		}
		let numEmptyDispensers = 0;
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			if (this.dispensers[i].numTilesInContainer == 0) numEmptyDispensers++;
		}
		if (numEmptyDispensers == this.puzzle.numDispensers) {
			const thisSolution = this.matrix.getColourSequence().join("");
			const correctSolution = this.puzzle.solutionColourSequence.join("");
			if (thisSolution === correctSolution) {
				this.io.disableControls(["Undispense"]);
				this.freeze();
				this.io.showTick(this);
			}
			else {
				this.freeze();
				this.io.showCross(this);
			}
		}
		else {
			this.io.hideCrossTick();
		}
	}
	
	resetClicked() {
		this.reset();
		this.io.enableAllControlsExcept(["Reset", "Undispense"]);
	}

	undispenseClicked() {
		const tileRemoved = this.matrix.removeTile();
		const dispenser = tileRemoved.dispenser;
		dispenser.replaceTile();
		this.matrix.refresh();
		dispenser.refresh();
		this.review();
	}

	dispenseClicked(dispenserNum) {
		const dispenser = this.dispensers[dispenserNum];
		const tileTaken = dispenser.takeTile();
		this.matrix.addTile(tileTaken);
		dispenser.refresh();
		this.matrix.refresh();
		this.review();
	}
/*
	hintTimerExpired() {
		this.expression.flashHint(this);
	}

	hintClicked() {
		this.callbackResolve = null;
		this.io.disableAllControls();
		this.io.hideCrossTick();
		if (this.expression.getLength() == 0) {
			this.expression.flashHint(this);
		}
		else {
			this.reset();
			setTimeout(punterHintTimerExpired, 250);			
		}
	}
	
	completeHintClicked() {
		this.io.enableAllControlsExcept(["Reset", "Undispense"]);
		if (this.callbackResolve != null) this.callbackResolve();
	}

	hintWithCallback() {
		return new 	Promise((resolve, reject) => {
								this.io.disableAllControls();
								this.callbackResolve = resolve;
								this.expression.flashHint(this);
							}
					);
	} */

	solutionShowTile(dispenser) {
		const tileTaken = dispenser.takeTile();
		this.matrix.addTile(tileTaken);
		dispenser.refresh();
		this.matrix.refresh();
	}

	solutionTimerExpired() {
		const dispenserNum = this.puzzle.solutionDispenseSequence[this.solutionNextIndex];
		const dispenser = this.dispensers[dispenserNum];
		this.solutionShowTile(dispenser);
		this.solutionNextIndex++;
		if (this.solutionNextIndex == this.puzzle.solutionDispenseSequence.length) {
			this.io.enableControls(["Information", "Reset"]);
			return;
		}
		setTimeout(punterSolutionTimerExpired, 1000);
	}

	solutionClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		this.solutionNextIndex = 0;
		if (this.matrix.getNumTilesInPlace() == 0) {
			setTimeout(punterSolutionTimerExpired, 500);
		}
		else {
			this.reset();
			setTimeout(punterSolutionTimerExpired, 750);
		}
	}
/*		
	solutionWithCallbackTimerExpired() {
		const dispenserNum = this.puzzle.solutionDispenseSequence[this.solutionNextIndex];
		const dispenser = this.dispensers[dispenserNum];
		this.solutionShowItem(dispenser);
		this.solutionNextIndex++;
		if (this.solutionNextIndex == this.puzzle.solutionDispenseSequence.length) {
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
								const dispenserNum = this.puzzle.solutionDispenseSequence[0];
								const dispenser = this.dispensers[dispenserNum];
								this.solutionShowItem(dispenser);
								this.solutionNextIndex = 1;
								setTimeout(demoSolutionTimerExpired, 1000);
							}
					);
	} */
}

/* ========================================================================================================================================================= */
/* PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER */
/* ========================================================================================================================================================= */

const punterPuzzle = new Puzzle(punterPuzzleSpec);

const dispensersId = "#mwdpDispensers-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers);
const dispensersRef = document.querySelector(dispensersId);
dispensersRef.style.display = `grid`;
const dispensersHeight = containerCompartmentHeight * punterPuzzle.maxDispenserHeight;
dispensersRef.style.height = `${dispensersHeight}em`;

for (let d = 1; d <= punterPuzzle.numDispensers; d++) {
	const numTiles = punterPuzzle.dispenserHeightSpec[d];
	const containerId = "#mwdpdContainer-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(numTiles);
	const containerRef = document.querySelector(containerId);
	containerRef.style.display = `block`;
	for (let i = 1; i <= numTiles; i++) {
		const tileId = "#mwdpdTile-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(i);
		const tileRef = document.querySelector(tileId);
		tileRef.style.display = `block`;
	}
}

const dispenseIdRoot = "#mwdCtrlDispense-" + String(punterPuzzle.numDispensers);
for (let d = 1; d <= punterPuzzle.numDispensers; d++) {
	const dispenseId = dispenseIdRoot + String(d);
	const dispenseRef = document.querySelector(dispenseId);
	dispenseRef.style.display = `block`;
}

const punterPanelRef = document.querySelector("#mwdPanel");
const punterPanelStyle = punterPanelRef.style.cssText;
const newPunterPanelStyle = punterPanelStyle.replace(/999/, String(dispensersHeight));
console.log(newPunterPanelStyle);
punterPanelRef.style.cssText = newPunterPanelStyle;
const punterPanelHeight = punterPanelHeightAboveDispensers + dispensersHeight + punterPanelHeightBelowDispensers;
punterPanelRef.style.height = `${punterPanelHeight}em`;

const punterDoorRef = document.querySelector("#mwDoor");
const punterDoorStyle = punterDoorRef.style.cssText;
const newPunterDoorStyle = punterDoorStyle.replace(/999/, String(punterPanelHeight));
console.log(newPunterDoorStyle);
punterDoorRef.style.cssText = newPunterDoorStyle;
const punterDoorHeight = punterDoorHeightAbovePanel + punterPanelHeight + punterDoorHeightBelowPanel;
punterDoorRef.style.height = `${punterDoorHeight}em`;

const mainWallRef = document.querySelector("#mainWall");
const mainWallStyle = mainWallRef.style.cssText;
const newMainWallStyle = mainWallStyle.replace(/999/, String(punterDoorHeight));
console.log(newMainWallStyle);
mainWallRef.style.cssText = newMainWallStyle;
const mainWallHeight = mainWallHeightAboveDoor + punterDoorHeight;
mainWallRef.style.height = `${mainWallHeight}em`;

updateFontSize(mainWallHeight, numGridColumns);

function informationOnClick() {
	console.log("informationOnClick called");
	const infoWallRef = document.querySelector("#infoWall");
	infoWallRef.style.display = `grid`;
	infoWallRef.style.zIndex = `3`;
	const bodyRef = document.querySelector("body");
	bodyRef.style.overflow = `auto`;
}

function punterUndispenseOnClick() {punterSolveBiz.undispenseClicked();};
function punterResetOnClick() {punterSolveBiz.resetClicked();};
function punterHintOnClick() {punterSolveBiz.hintClicked();};
function punterHintTimerExpired() {punterSolveBiz.hintTimerExpired();};
function punterSolutionOnClick() {punterSolveBiz.solutionClicked();};
function punterSolutionTimerExpired() {punterSolveBiz.solutionTimerExpired();};

let punterDispenseOnClicks = [undefined,
							  function() {punterSolveBiz.dispenseClicked(1)},
							  function() {punterSolveBiz.dispenseClicked(2)},
							  function() {punterSolveBiz.dispenseClicked(3)},
							  function() {punterSolveBiz.dispenseClicked(4)},
							  function() {punterSolveBiz.dispenseClicked(5)}
							 ];

let punterControls = [];
punterControls["Information"] = new Control("#mwdCtrlInformation", informationOnClick);
punterControls["Hint"] = new Control("#mwdCtrlHint", punterHintOnClick);
punterControls["Solution"] = new Control("#mwdCtrlSolution", punterSolutionOnClick);
punterControls["Reset"] = new Control("#mwdCtrlReset", punterResetOnClick);
punterControls["Undispense"] = new Control("#mwdCtrlUndispense", punterUndispenseOnClick);

const punterDispenseIdRoot = "#mwdCtrlDispense-" + String(punterPuzzle.numDispensers);
for (let i = 1; i <= punterPuzzle.numDispensers; i++) {
	const dispenseId = punterDispenseIdRoot + String(i);
	punterControls["Dispense" + String(i)] = new Control(dispenseId, punterDispenseOnClicks[i]);
}

const punterCrossTick = new CrossTick("#mwCrossTick");

const punterSolveIO = new SolveIO(punterControls, punterCrossTick);	

let punterDispensers = [undefined];
const punterTileIdRoot = "#mwdpdTile-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-";
for (let i = 1; i <= punterPuzzle.numDispensers; i++) {
	const tileIdRootPlus = punterTileIdRoot + String(i);
	punterDispensers[i] = new Dispenser(punterPuzzle, punterPuzzle.dispenserFullSpec[i], tileIdRootPlus);
}

const punterMatrix = new Matrix(punterPuzzle, "#mwdpmSquare-");

const punterSolveBiz = new SolveBiz(punterPuzzle, punterDispensers, punterMatrix, punterSolveIO);
punterSolveBiz.wake();
////disable all the controls while the preamble runs
//punterSolveBiz.freeze();

/* ========================================================================================================================================================== */
/* DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO */
/* ========================================================================================================================================================== */
/*
let demoPuzzleSpec = {
	dispenserSpec: [undefined, "61", "56", "-", "4*"],
	targetSpec: "28",
	hintSpec: {numDots: 2, symbol:"5", isHere: false},
	solutionExpression: "6*14-56",
	solutionDispenseSequence: [2, 4, 1, 4, 3, 2, 1]
};

const demoPuzzle = new Puzzle(demoPuzzleSpec);

//function demoHintTimerExpired() {demoSolveBiz.hintWithCallbackTimerExpired();};
function demoSolutionTimerExpired() {demoSolveBiz.solutionWithCallbackTimerExpired();};

function backClicked() {
	console.log("backClicked called");
	const infoWallRef = document.querySelector("#infoWall");
	infoWallRef.style.display = `none`;
	infoWallRef.style.zIndex = `1`;
	const bodyRef = document.querySelector("body");
	bodyRef.style.overflow = `hidden`;
	}
const demoControlBack = new Control("#iwCtrlBack", backClicked);
demoControlBack.enable();
demoControlBack.unfade();

function demonstrationClicked () {
	console.log("demonstrationClicked called");
	executeScript();
	}
const demoControlDemonstration = new Control("#iwdCtrlDemonstration", demonstrationClicked);
demoControlDemonstration.enable();
demoControlDemonstration.unfade();

let demoControls = [];
demoControls["Information"] = new Control("#iwdCtrlInformation", null);
demoControls["Hint"] = new Control("#iwdCtrlHint", null);
demoControls["Solution"] = new Control("#iwdCtrlSolution", null);
demoControls["Reset"] = new Control("#iwdCtrlReset", null);
demoControls["Undispense"] = new Control("#iwdCtrlUndispense", null);
demoControls["Dispense1"] = new Control("#iwdCtrlDispense-1", null);
demoControls["Dispense2"] = new Control("#iwdCtrlDispense-2", null);
demoControls["Dispense3"] = new Control("#iwdCtrlDispense-3", null);
demoControls["Dispense4"] = new Control("#iwdCtrlDispense-4", null);

const demoCrossTick = new CrossTick("#iwdCrossTick");

const demoSolveIO = new SolveIO(demoControls, demoCrossTick);	

let demoDispensers = [undefined];
const demoItemIdRoot = "#iwdpdItem-";
for (let i = 1; i <= demoPuzzle.numDispensers; i++) {
	const itemIdRootPlus = demoItemIdRoot + String(i);
	demoDispensers[i] = new Dispenser(demoPuzzle.dispenserFullSpec[i], itemIdRootPlus);
}

const demoSolveBiz = new SolveBiz(demoPuzzle, demoDispensers, demoExpression, demoSolveIO);


function showSpot(spotRef, opacity) {
		spotRef.style.display = `block`;
		spotRef.style.opacity = `${opacity}`;
	}
	
function hideSpot(spotRef) {
		spotRef.style.display = `none`;
	}

const spotHintRef = document.querySelector("#iwdSpotHint");
const spotSolutionRef = document.querySelector("#iwdSpotSolution");
const spotDispense1Ref = document.querySelector("#iwdSpotDispense-1");
const spotDispense2Ref = document.querySelector("#iwdSpotDispense-2");
const spotDispense3Ref = document.querySelector("#iwdSpotDispense-3");
const spotDispense4Ref = document.querySelector("#iwdSpotDispense-4");
const spotResetRef = document.querySelector("#iwdSpotReset");
const spotUndispenseRef = document.querySelector("#iwdSpotUndispense");

let spotRefLookUp = [];
spotRefLookUp["Hint"] = spotHintRef;
spotRefLookUp["Solution"] = spotSolutionRef;
spotRefLookUp["Dispense1"] = spotDispense1Ref;
spotRefLookUp["Dispense2"] = spotDispense2Ref;
spotRefLookUp["Dispense3"] = spotDispense3Ref;
spotRefLookUp["Dispense4"] = spotDispense4Ref;
spotRefLookUp["Reset"] = spotResetRef;
spotRefLookUp["Undispense"] = spotUndispenseRef;

const script = ["Dispense1",
				"Pause",
				"Dispense2",
				"Pause",
				"Dispense3",
				"Pause",		
				"Undispense",
				"Pause",		
				"Undispense",
				"Pause",		
				"Undispense",
				"Pause",		
				"Dispense2",
				"Pause",		
				"Dispense4",
				"Pause",		
				"Dispense1",
				"Pause",		
				"Dispense4",
				"Pause",		
				"Dispense3",
				"Pause",		
				"Dispense1",
				"Pause",		
				"Dispense2",
				"Pause",		
				"Pause",		
				"Pause",		
				"Pause",		
				"Undispense",
				"Pause",		
				"Undispense",
				"Pause",		
				"Dispense2",
				"Pause",		
				"Dispense1",
				"Pause",
				"Pause",
				"Pause",
				"Pause",
				"Reset",
				"Pause",
				"Hint",
				"Pause",
				"Solution"
			   ];
			   
async function executeScript() {
	const spotFadeSequence = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
	
	demoControlBack.disable();
	demoControlBack.fade();
	demoControlDemonstration.disable();
	demoControlDemonstration.fade();
	
	demoSolveBiz.wake();
	await wait(1000);
	for (let command of script) {
		if (command === "Pause") {
			await wait(500);
			continue;
		}
		const control = command;
		const spotRef = spotRefLookUp[control];
		for (let opacity of spotFadeSequence) {
			showSpot(spotRef, opacity);
			await wait(100);
		}
		
		switch(command) {
		case "Hint":
			await demoSolveBiz.hintWithCallback();
			break;
		case "Solution":
			await demoSolveBiz.solutionWithCallback();
			break;
		case "Reset":
			demoSolveBiz.resetClicked();
			break;
		case "Dispense1":
			demoSolveBiz.dispenseClicked(1);
			break;
		case "Dispense2":
			demoSolveBiz.dispenseClicked(2);
			break;
		case "Dispense3":
			demoSolveBiz.dispenseClicked(3);
			break;
		case "Dispense4":
			demoSolveBiz.dispenseClicked(4);
			break;
		case "Undispense":
			demoSolveBiz.undispenseClicked();
			break;
		}
		
		hideSpot(spotRef);
		await wait(1000);
	}
	await wait(2000);
	demoSolveBiz.reset();
	demoSolveBiz.sleep();
	demoControlBack.enable();
	demoControlBack.unfade();
	demoControlDemonstration.enable();
	demoControlDemonstration.unfade();
}
*/
/* ======================================================================================================================================================== */
/* PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE */
/* ======================================================================================================================================================== */
/*
async function performPreamble() {

	const wallRef = document.querySelector("#infoWall");
	
	const surround1TopRef = document.querySelector("#iwSurroundInstructions-top");
	const surround1BottomRef = document.querySelector("#iwSurroundInstructions-bottom");
	const surround1LeftRef = document.querySelector("#iwSurroundInstructions-left");
	const surround1RightRef = document.querySelector("#iwSurroundInstructions-right");

	const surround2TopRef = document.querySelector("#iwdSurroundDemonstration-top");
	const surround2BottomRef = document.querySelector("#iwdSurroundDemonstration-bottom");
	const surround2LeftRef = document.querySelector("#iwdSurroundDemonstration-left");
	const surround2RightRef = document.querySelector("#iwdSurroundDemonstration-right");

	const surround3TopRef = document.querySelector("#mwdSurroundInformation-top");
	const surround3BottomRef = document.querySelector("#mwdSurroundInformation-bottom");
	const surround3LeftRef = document.querySelector("#mwdSurroundInformation-left");
	const surround3RightRef = document.querySelector("#mwdSurroundInformation-right");

	const separator2Ref = document.querySelector("#iwSeparator-2");

	demoControlBack.freeze();
	demoControlDemonstration.freeze();
	
	wallRef.style.display = `grid`;
	wallRef.style.zIndex = `3`;

	await wait(1000);

	surround1TopRef.style.display = `block`;
	surround1BottomRef.style.display = `block`;
	surround1LeftRef.style.display = `block`;
	surround1RightRef.style.display = `block`;

	//await wait(1000);
	await wait(750);

	surround1TopRef.style.display = `none`;
	surround1BottomRef.style.display = `none`;
	surround1LeftRef.style.display = `none`;
	surround1RightRef.style.display = `none`;

	await wait(500);

	separator2Ref.scrollIntoView({behavior: "smooth"});

	await wait(1000);
	
	surround2TopRef.style.display = `block`;
	surround2BottomRef.style.display = `block`;
	surround2LeftRef.style.display = `block`;
	surround2RightRef.style.display = `block`;

	//await wait(1000);
	await wait(750);

	surround2TopRef.style.display = `none`;
	surround2BottomRef.style.display = `none`;
	surround2LeftRef.style.display = `none`;
	surround2RightRef.style.display = `none`;

	//await wait(1000);
	await wait(750);

	wallRef.style.display = `none`;
	wallRef.style.zIndex = `1`;

	await wait(500);

	surround3TopRef.style.display = `block`;
	surround3BottomRef.style.display = `block`;
	surround3LeftRef.style.display = `block`;
	surround3RightRef.style.display = `block`;

	//await wait(1000);
	await wait(750);

	surround3TopRef.style.display = `none`;
	surround3BottomRef.style.display = `none`;
	surround3LeftRef.style.display = `none`;
	surround3RightRef.style.display = `none`;
	
	demoControlBack.unfreeze();
	demoControlDemonstration.unfreeze();

	punterSolveBiz.unfreeze();
}
performPreamble();
*/
