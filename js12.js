/* -------- Window -------- */

console.log(`${window.innerHeight}px`);
console.log(`${window.innerWidth}px`);
console.log(`${window.devicePixelRatio}`);


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


/* -------- Puzzle -------- */

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
		
		this.ringSpec = puzzleSpec.ringSpec;
		
		this.tileColours = [];
		const tileCodes = ["p", "q", "r", "s", "t"];
		for (let i = 0; i < tileCodes.length; i++) this.tileColours[tileCodes[i]] = puzzleSpec.colourSpec[i];
		
		this.hintColour = puzzleSpec.hintSpec[0];
		this.hintIndex = puzzleSpec.hintSpec[1];
		
		this.solutionDispenseSequence = puzzleSpec.solutionDispenseSequence;
		this.solutionColourSequence = puzzleSpec.solutionColourSequence;
		//this.solutionColourSequence = [];
		//why copy?
		//for (let i = 0; i < puzzleSpec.solutionColourSequence.length; i++) this.solutionColourSequence[i] = puzzleSpec.solutionColourSequence[i];
	}
};

const punterPuzzle = new Puzzle(punterPuzzleSpec);


/* -------- Main Wall -------- */


const mainWallSpec = {
	mwNumGridColumns: 59,
	mwHeightAboveDoor: 10,

	mwdHeightAbovePanel: 12,
	mwdHeightBelowPanel: 21,

	mwdpHeightAboveDispensers: 3,
	mwdpHeightBelowDispensers: 27,
	mwdpContainerCompartmentHeight: 6
};

class MainWall {
	constructor(mainWallSpec) {
		this.wallRef = document.querySelector("#mainWall");
		
		const dispensersId = "#mwdpDispensers-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers);
		const dispensersRef = document.querySelector(dispensersId);
		dispensersRef.style.display = `grid`;
		//+2 for cosmetic
		const dispensersHeight = (mainWallSpec.mwdpContainerCompartmentHeight * punterPuzzle.maxDispenserHeight) + 2;
		dispensersRef.style.height = `${dispensersHeight}em`;
		
		for (let d = 1; d <= punterPuzzle.numDispensers; d++) {
			const numTiles = punterPuzzle.dispenserHeightSpec[d];
			const containerId = "#mwdpdContainer-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(numTiles);
			const containerRef = document.querySelector(containerId);
			containerRef.style.display = `block`;
			const cosmeticId = "#mwdpdCosmetic-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers);
			const cosmeticRef = document.querySelector(cosmeticId);
			cosmeticRef.style.display = `block`;
			for (let i = 1; i <= numTiles; i++) {
				const tileId = "#mwdpdTile-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(i);
				const tileRef = document.querySelector(tileId);
				tileRef.style.display = `block`;
			}
		}

		const panelRef = document.querySelector("#mwdPanel");
		const panelStyle = panelRef.style.cssText;
		const newPanelStyle = panelStyle.replace(/999/, String(dispensersHeight));
		//console.log(newPanelStyle);
		panelRef.style.cssText = newPanelStyle;
		const panelHeight = mainWallSpec.mwdpHeightAboveDispensers + dispensersHeight + mainWallSpec.mwdpHeightBelowDispensers;
		panelRef.style.height = `${panelHeight}em`;

		const doorRef = document.querySelector("#mwDoor");
		const doorStyle = doorRef.style.cssText;
		const newDoorStyle = doorStyle.replace(/999/, String(panelHeight));
		//console.log(newDoorStyle);
		doorRef.style.cssText = newDoorStyle;
		const doorHeight = mainWallSpec.mwdHeightAbovePanel + panelHeight + mainWallSpec.mwdHeightBelowPanel;
		doorRef.style.height = `${doorHeight}em`;

		const wallStyle = this.wallRef.style.cssText;
		const newWallStyle = wallStyle.replace(/999/, String(doorHeight));
		//console.log(newWallStyle);
		this.wallRef.style.cssText = newWallStyle;
		const wallHeight = mainWallSpec.mwHeightAboveDoor + doorHeight;
		console.log('mw height', wallHeight);
		this.wallRef.style.height = `${wallHeight}em`;


		//console.log(`${window.innerHeight}px`);
		//console.log(`${window.innerWidth}px`);
		//console.log(`${window.devicePixelRatio}`);

		let innerDimension = 0
		let gridDimension = 0
		if ((window.innerHeight / wallHeight) <= (window.innerWidth / mainWallSpec.mwNumGridColumns)) {
			innerDimension = window.innerHeight;
			gridDimension = wallHeight;
		}
		else {
			innerDimension = window.innerWidth;
			gridDimension = mainWallSpec.mwNumGridColumns;
		}

		const percent = innerDimension / 100;
		let fontSize = 0;
		let reducingInnerDimension = innerDimension + 1;
		do {
			reducingInnerDimension = reducingInnerDimension - 1;
			fontSize = Math.trunc((reducingInnerDimension / gridDimension) * window.devicePixelRatio) / window.devicePixelRatio;
			console.log('mw fontSize', fontSize);
		} while ((innerDimension - (fontSize * gridDimension)) < (2 * percent));
		console.log('mw final fontSize', fontSize);
		this.wallRef.style.fontSize = `${fontSize}px`;
		this.fontSize = fontSize;

		const spareHeight = window.innerHeight - (this.fontSize * wallHeight);
		console.log('mw spareHeight', spareHeight);
		const deviceSpareHeight = spareHeight * window.devicePixelRatio;
		console.log('mw deviceSpareHeight', deviceSpareHeight);
		const roundedDeviceSpareHeight = Math.trunc(deviceSpareHeight / 2) * 2;
		console.log('mw roundedDeviceSpareHeight', roundedDeviceSpareHeight);
		const roundedSpareHeight = roundedDeviceSpareHeight / window.devicePixelRatio;
		console.log('mw roundedSpareHeight', roundedSpareHeight);
		this.topPosition = roundedSpareHeight / 2;
		this.wallRef.style.top = `${this.topPosition}px`;

		this.width = this.fontSize * mainWallSpec.mwNumGridColumns
		const spareWidth = window.innerWidth - this.width;
		console.log('mw spareWidth', spareWidth);
		const deviceSpareWidth = spareWidth * window.devicePixelRatio;
		console.log('mw deviceSpareWidth', deviceSpareWidth);
		const roundedDeviceSpareWidth = Math.trunc(deviceSpareWidth / 2) * 2;
		console.log('mw roundedDeviceSpareWidth', roundedDeviceSpareWidth);
		const roundedSpareWidth = roundedDeviceSpareWidth / window.devicePixelRatio;
		console.log('mw roundedSpareWidth', roundedSpareWidth);
		this.leftPosition = roundedSpareWidth / 2;
		this.wallRef.style.left = `${this.leftPosition}px`;


		const dispenseIdRoot = "#mwdCtrlDispense-" + String(punterPuzzle.numDispensers);
		for (let d = 1; d <= punterPuzzle.numDispensers; d++) {
			const dispenseId = dispenseIdRoot + String(d);
			const dispenseRef = document.querySelector(dispenseId);
			dispenseRef.style.display = `block`;
		}		
	}

	show() {
		this.wallRef.style.display = `grid`;
	}

	hide() {
		this.wallRef.style.display = `none`;
	}
}


/* -------- Info Wall -------- */

function backOnClick() {
	//console.log("backOnClick called");
	infoWall.hide();
	disableScrolling();
	mainWall.show();
	}

function demonstrationOnClick () {
	//console.log("demonstrationOnClick called");
	demo.enter();
	}

class InfoWall {
	constructor(topPosition, leftPosition, fontSize) {
		this.wallRef = document.querySelector("#infoWall");

		this.wallRef.style.top = `${topPosition}px`;
		this.wallRef.style.left = `${leftPosition}px`;
		this.wallRef.style.fontSize = `${fontSize}px`;

		const puzzleDataRef = document.querySelector("#iwPuzzleData");
		puzzleDataRef.innerHTML = "<strong>Puzzle #" + String(punterPuzzleSpec.number) + "&emsp;&boxh;&emsp;Solve by " + punterPuzzleSpec.solveBy + "</strong>";

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
		//this.wallRef.style.zIndex = `1`;
	}
}
/*
class InfoWallFit {
	constructor(topPosition, leftPosition, fontSize) {
		const infoRef = document.querySelector("#infoWall");
		infoRef.style.top = `${topPosition}px`;
		infoRef.style.left = `${leftPosition}px`;
		infoRef.style.fontSize = `${fontSize}px`;
	}
}
*/

/* -------- Cross/Tick -------- */

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


/* -------- Dispensers -------- */

class Tile {
	constructor(dispenser, colour) {
		this.dispenser = dispenser;
		this.colour = colour;
	}
}

class Dispenser {
	constructor(puzzle, tileSequence, tileIdRoot) {
		this.tileImageLookUp = [];
		this.tileImageLookUp["black"] = "tileBlack.svg";
		this.tileImageLookUp["blue"] = "tileBlue.svg";
		this.tileImageLookUp["green"] = "tileGreen.svg";
		this.tileImageLookUp["orange"] = "tileOrange.svg";
		this.tileImageLookUp["pink"] = "tilePink.svg";
		
		this.tileQueue = [];
		for (let t = 0; t < tileSequence.length; t++) {
			const tile = new Tile(this, puzzle.tileColours[tileSequence[t]]);
			this.tileQueue.unshift(tile);
		}

		this.tileRefs = [];
		for (let t = 1; t <= tileSequence.length; t++) {
			const tileId = tileIdRoot + String(t);
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
				this.tileRefs[t].src = this.tileImageLookUp[this.container[t].colour];
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


/* -------- Ring -------- */

class Ring {
/*
	constructor(puzzle, segmentIdRoot, digitIdRoot) {
		this.puzzle = puzzle;
		
		this.colourCodeLookUp = [];
		this.colourCodeLookUp["black"] = `black`;
		this.colourCodeLookUp["blue"] = `#0072B2`;
		this.colourCodeLookUp["green"] = `#009E73`;
		this.colourCodeLookUp["orange"] = `#E69F00`;
		this.colourCodeLookUp["pink"] = `#CC79A7`;
		
		//this.segmentPositions = this.puzzle.ringSpec;
		this.segmentPositions = [];
		for (let i = 0; i < puzzle.ringSpec.length; i++) {
			const segmentSpec = this.puzzle.ringSpec[i];
			const segmentPosition = (segmentSpec < 0) ? -segmentSpec : segmentSpec;
			this.segmentPositions.push(segmentPosition);
		}
			
		this.segmentRefs = [undefined];
		this.segmentTiles = [undefined];
		for (let s = 1; s <= 9; s++) {
			const segmentId = segmentIdRoot + String(s);
			const segmentRef = document.querySelector(segmentId);
			this.segmentRefs.push(segmentRef);
			this.segmentTiles.push(null);
		}
*/
	//constructor(puzzle, segmentIdRoot, digitIdRoot) {
	constructor(puzzle, digitIdRoot, cardinalIdRoot) {
		const grey = `#B2B2B2`;

		this.puzzle = puzzle;
		
		this.colourCodeLookUp = [];
		this.colourCodeLookUp["black"] = `black`;
		this.colourCodeLookUp["blue"] = `#0072B2`;
		this.colourCodeLookUp["green"] = `#009E73`;
		this.colourCodeLookUp["orange"] = `#E69F00`;
		this.colourCodeLookUp["pink"] = `#CC79A7`;
		
		this.ordinalSequence = [undefined];
		for (let i = 1; i <= puzzle.ringSpec.length; i++) {
			const ordinalSpec = this.puzzle.ringSpec[i - 1];
			const ordinal = (ordinalSpec < 0) ? -ordinalSpec : ordinalSpec;
			this.ordinalSequence[ordinal] = i;
		}
		//this.segmentPositions = [];
		//for (let i = 0; i < puzzle.ringSpec.length; i++) {
		//	const segmentSpec = this.puzzle.ringSpec[i];
		//	const segmentPosition = (segmentSpec < 0) ? -segmentSpec : segmentSpec;
		//	this.segmentPositions.push(segmentPosition);
		//}
			
		this.cardinalRefs = [undefined];
		this.cardinalTiles = [undefined];
		for (let i = 1; i <= 9; i++) {
			const cardinalId = cardinalIdRoot + String(i);
			const cardinalRef = document.querySelector(cardinalId);
			this.cardinalRefs[i] = cardinalRef;
			this.cardinalTiles[i] = null;
		}
		//this.segmentRefs = [undefined];
		//this.segmentTiles = [undefined];
		//for (let s = 1; s <= 9; s++) {
		//	const segmentId = segmentIdRoot + String(s);
		//	const segmentRef = document.querySelector(segmentId);
		//	this.segmentRefs.push(segmentRef);
		//	this.segmentTiles.push(null);
		//}
/*
		this.digitRefs = [undefined];
		for (let i = 0; i < this.segmentPositions.length; i++) {
			const digitId = digitIdRoot + String(this.segmentPositions[i]);
			const digitRef = document.querySelector(digitId);
			this.digitRefs.push(digitRef);
		}
*/
		this.digitRefs = [undefined];
		for (let i = 0; i < puzzle.ringSpec.length; i++) {
			const segmentSpec = puzzle.ringSpec[i];
			const digitText = (segmentSpec < 0) ? String(-segmentSpec) : String(segmentSpec);
			//const digitColour = (segmentSpec < 0) ? "black" : "gray";
			const digitColour = (segmentSpec < 0) ? "black" : grey;
			const digitId = digitIdRoot + digitText;
			const digitRef = document.querySelector(digitId);
			digitRef.textContent = digitText;
			digitRef.style.fill = digitColour;
			this.digitRefs.push(digitRef);
		}

		this.numTilesInPlace = 0;
		this.temporaryIndex = undefined;
	}
	
	getColourSequence() {
		let colourSequence = [];
		for (let s = 1; s <= 9; s++) {
			if (this.cardinalTiles[s] == null) colourSequence.push("none"); else colourSequence.push(this.cardinalTiles[s].colour);
		}
		return colourSequence;
	}
	
	reset() {
		for (let s = 1; s <= 9; s++) this.cardinalTiles[s] = null;
		this.numTilesInPlace = 0;	
	}

	addTile(tile) {
		const nextCardinal = this.ordinalSequence[this.numTilesInPlace + 1];
		this.cardinalTiles[nextCardinal] = tile;
		this.numTilesInPlace++;
	}
	//addTile(tile) {
	//	const nextPosition = this.segmentPositions[this.numTilesInPlace];
	//	this.segmentTiles[nextPosition] = tile;
	//	this.numTilesInPlace++;
	//}
	
	removeTile() {
		const cardinal = this.ordinalSequence[this.numTilesInPlace];
		const tile = this.cardinalTiles[cardinal];
		this.cardinalTiles[cardinal] = null;
		this.numTilesInPlace--;
		return tile;
	}
	//removeTile() {
	//	const tileNum = this.segmentPositions[this.numTilesInPlace - 1];
	//	const tile = this.segmentTiles[tileNum];
	//	this.segmentTiles[tileNum] = null;
	//	this.numTilesInPlace--;
	//	return tile;
	//}
	
	addTemporaryTile(tile, index) {
		this.cardinalTiles[index] = tile;
		this.temporaryIndex = index;
	}
	//addTemporaryTile(tile, index) {
	//	this.segmentTiles[index] = tile;
	//	this.temporaryIndex = index;
	//}
	
	removeTemporaryTile() {
		this.cardinalTiles[this.temporaryIndex] = null;
	}
	//removeTemporaryTile() {
	//	this.segmentTiles[this.temporaryIndex] = null;
	//}
	
	refresh() {
		for (let s = 1; s <= 9; s++) {
			if (this.cardinalTiles[s] == null) {
				this.cardinalRefs[s].style.display = `none`;
				this.digitRefs[s].style.visibility = `visible`;
			}
			else {
				this.cardinalRefs[s].style.display = `block`;
				this.cardinalRefs[s].style.fill = this.colourCodeLookUp[this.cardinalTiles[s].colour];
				this.digitRefs[s].style.visibility = `hidden`;
			}
		}
	}
	//refresh() {
	//	for (let s = 1; s <= 9; s++) {
	//		if (this.segmentTiles[s] == null) {
	//			this.segmentRefs[s].style.display = `none`;
	//			this.digitRefs[s].style.visibility = `visible`;
	//		}
	//		else {
	//			this.segmentRefs[s].style.display = `block`;
	//			this.segmentRefs[s].style.fill = this.colourCodeLookUp[this.segmentTiles[s].colour];
	//			this.digitRefs[s].style.visibility = `hidden`;
	//		}
	//	}
	//}
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
	}
*/
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


/* -------- Solve -------- */

class SolveIO {
	constructor(controls, crossTick) {
	//controls
	//an array of Control objects indexed by these names:
	//"Information", "Hint", "Solution", "Reset", "Undispense", "Dispense1", "Dispense2", "Dispense3", "Dispense4"
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
	constructor(puzzle, dispensers, ring, io) {
		this.puzzle = puzzle;
		this.dispensers = dispensers;
		this.ring = ring;
		this.io = io;
				
		this.solutionNextIndex = undefined;

		for (let i = 1; i <= puzzle.numDispensers; i++) this.dispensers[i].refresh();
		
		this.hintTemporaryTile = new Tile(null, puzzle.hintColour);
		this.hintNumShows = 3;
		this.hintNumShowsRemaining = undefined;
		this.hintShowing = undefined;
		
		this.callbackResolve = undefined;

		//this.io.enableAllControlsExcept(["Reset", "Undispense"]);
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
		this.ring.reset();
		this.ring.refresh();
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			const dispenser = this.dispensers[i];
			dispenser.reset();
			dispenser.refresh();
		}
		//this.dispenseSequence = [];
		this.io.hideCrossTick();
	}

	updateDispenseControls() {
		if (this.ring.numTilesInPlace == 9) {
			for (let i = 1; i <= this.puzzle.numDispensers; i++) this.io.disableControls(["Dispense" + String(i)]);
		}
		else {
			for (let i = 1; i <= this.puzzle.numDispensers; i++) {
				if (this.dispensers[i].numTilesInContainer == 0) {
					this.io.disableControls(["Dispense" + String(i)]);
				}
				else {
					this.io.enableControls(["Dispense" + String(i)]);
				}
			}
		}
	}

	review() {
		this.updateDispenseControls();
		if (this.ring.numTilesInPlace == 0) {
			this.io.disableControls(["Reset", "Undispense"]);
		}
		else {
			this.io.enableControls(["Reset", "Undispense"]);
		}
		if (this.ring.numTilesInPlace == 9) {
			const thisSolution = this.ring.getColourSequence().join("");
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
	
	dispenseClicked(dispenserNum) {
		const dispenser = this.dispensers[dispenserNum];
		const tileTaken = dispenser.takeTile();
		this.ring.addTile(tileTaken);
		dispenser.refresh();
		this.ring.refresh();
		this.review();
	}

	undispenseClicked() {
		const tileRemoved = this.ring.removeTile();
		const dispenser = tileRemoved.dispenser;
		dispenser.replaceTile();
		this.ring.refresh();
		dispenser.refresh();
		this.review();
	}

	hintTimerExpired() {
		if (this.hintShowing) {
			this.ring.removeTemporaryTile();
			this.ring.refresh();
			this.hintShowing = false;
			this.hintNumShowsRemaining--;
			if (this.hintNumShowsRemaining == 0) {
				this.io.enableAllControlsExcept(["Reset", "Undispense"]);
				return;
			}
		}
		else {
			this.ring.addTemporaryTile(this.hintTemporaryTile, this.puzzle.hintIndex);
			this.ring.refresh();
			this.hintShowing = true;
		}
		setTimeout(punterHintTimerExpired, 1000);
	}
	
	hintClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		if (this.ring.numTilesInPlace == 0) {
			this.ring.addTemporaryTile(this.hintTemporaryTile, this.puzzle.hintIndex);
			this.ring.refresh();
			this.hintShowing = true;
			this.hintNumShowsRemaining = this.hintNumShows;
		}
		else {
			this.reset();
			this.hintShowing = false;
			this.hintNumShowsRemaining = this.hintNumShows;
		}
		setTimeout(punterHintTimerExpired, 1000);
	}


	hintWithCallbackTimerExpired() {
		if (this.hintShowing) {
			this.ring.removeTemporaryTile();
			this.ring.refresh();
			this.hintShowing = false;
			this.hintNumShowsRemaining--;
			if (this.hintNumShowsRemaining == 0) {
				this.io.enableAllControlsExcept(["Reset", "Undispense"]);
				this.callbackResolve();
				return;
			}
		}
		else {
			this.ring.addTemporaryTile(this.hintTemporaryTile, this.puzzle.hintIndex);
			this.ring.refresh();
			this.hintShowing = true;			
		}
		setTimeout(demoHintTimerExpired, 1000);
	}

	hintWithCallback() {
		return new 	Promise((resolve, reject) => {
								this.io.disableAllControls();
								this.callbackResolve = resolve;
								this.ring.addTemporaryTile(this.hintTemporaryTile, this.puzzle.hintIndex);
								this.ring.refresh();
								this.hintShowing = true;
								this.hintNumShowsRemaining = this.hintNumShows;
								setTimeout(demoHintTimerExpired, 1000);
							}
					);
	}
	
	solutionShowTile(dispenser) {
		const tileTaken = dispenser.takeTile();
		this.ring.addTile(tileTaken);
		dispenser.refresh();
		this.ring.refresh();
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
		if (this.ring.numTilesInPlace == 0) {
			setTimeout(punterSolutionTimerExpired, 500);
		}
		else {
			this.reset();
			setTimeout(punterSolutionTimerExpired, 750);
		}
	}

	solutionWithCallbackTimerExpired() {
		const dispenser = this.dispensers[this.puzzle.solutionDispenseSequence[this.solutionNextIndex]];
		this.solutionShowTile(dispenser);
		this.solutionNextIndex++;
		if (this.solutionNextIndex == 9) {
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
								this.solutionShowTile(this.dispensers[this.puzzle.solutionDispenseSequence[0]]);
								this.solutionNextIndex = 1;
								setTimeout(demoSolutionTimerExpired, 1000);
							}
					);
	}	
}


/* -------- Punter -------- */

function punterInformationOnClick() {
	//console.log("informationOnClick called");
	mainWall.hide();
	infoWall.show();
	enableScrolling();
}

function punterUndispenseOnClick() {punter.solveBiz.undispenseClicked();};
function punterResetOnClick() {punter.solveBiz.resetClicked();};
function punterHintOnClick() {punter.solveBiz.hintClicked();};
function punterHintTimerExpired() {punter.solveBiz.hintTimerExpired();};
function punterSolutionOnClick() {punter.solveBiz.solutionClicked();};
function punterSolutionTimerExpired() {punter.solveBiz.solutionTimerExpired();};

let punterDispenseOnClicks = [undefined,
							  function() {punter.solveBiz.dispenseClicked(1)},
							  function() {punter.solveBiz.dispenseClicked(2)},
							  function() {punter.solveBiz.dispenseClicked(3)},
							  function() {punter.solveBiz.dispenseClicked(4)},
							 ];

class Punter {
	constructor(puzzle) {
		this.puzzle = puzzle;
		
		let dispensers = [undefined];
		const tileIdRoot = "#mwdpdTile-" + String(puzzle.maxDispenserHeight) + String(puzzle.numDispensers) + "-";
		for (let i = 1; i <= puzzle.numDispensers; i++) {
			const tileIdRootPlus = tileIdRoot + String(i);
			dispensers[i] = new Dispenser(puzzle, puzzle.dispenserFullSpec[i], tileIdRootPlus);
		}

		const ring = new Ring(puzzle, "#mwdprDigit-", "#mwdprSegment-");

		let controls = [];
		controls["Information"] = new Control("#mwdCtrlInformation", punterInformationOnClick, null);
		controls["Hint"] = new Control("#mwdCtrlHint", punterHintOnClick, null);
		controls["Solution"] = new Control("#mwdCtrlSolution", punterSolutionOnClick, null);
		controls["Reset"] = new Control("#mwdCtrlReset", punterResetOnClick, null);
		controls["Undispense"] = new Control("#mwdCtrlUndispense", punterUndispenseOnClick);

		const dispenseIdRoot = "#mwdCtrlDispense-" + String(puzzle.numDispensers);
		for (let i = 1; i <= puzzle.numDispensers; i++) {
			const dispenseId = dispenseIdRoot + String(i);
			controls["Dispense" + String(i)] = new Control(dispenseId, punterDispenseOnClicks[i]);
		}

		const crossTick = new CrossTick("#mwCrossTick");
		const solveIO = new SolveIO(controls, crossTick);	

		this.solveBiz = new SolveBiz(puzzle, dispensers, ring, solveIO);
	}
}


/* -------- Demo -------- */

function demoHintTimerExpired() {demo.solveBiz.hintWithCallbackTimerExpired();};
function demoSolutionTimerExpired() {demo.solveBiz.solutionWithCallbackTimerExpired();}

class Demo {
	constructor() {
		const puzzleSpec = {
			dispenserSpec: [undefined, "qqpr", "qpppr", "p"],
			//ringSpec: [1, 4, 7, 2, 5, 8, 3, 6, 9],
			ringSpec: [-1, -4, 7, -2, 5, 8, -3, 6, 9],
			colourSpec: ["blue", "black", "orange", "green", "pink"],
			hintSpec: ["blue", 6],
			solutionDispenseSequence: [1, 1, 2, 2, 1, 2, 1, 2, 2],
			solutionColourSequence: ["orange", "blue", "black", "blue", "black", "blue", "orange", "blue", "black"]
		};
		this.puzzle = new Puzzle(puzzleSpec);

		let dispensers = [undefined];
		const tileIdRoot = "#iwdpdTile-";
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			const tileIdRootPlus = tileIdRoot + String(i);
			dispensers[i] = new Dispenser(this.puzzle, this.puzzle.dispenserFullSpec[i], tileIdRootPlus);
		}

		//const ring = new Ring(this.puzzle, "#iwdprSegment-", "#iwdprDigit-");
		const ring = new Ring(this.puzzle, "#iwdprDigit-", "#iwdprSegment-");
		
		let controls = [];
		controls["Information"] = new Control("#iwdCtrlInformation", null);
		controls["Hint"] = new Control("#iwdCtrlHint", null);
		controls["Solution"] = new Control("#iwdCtrlSolution", null);
		controls["Reset"] = new Control("#iwdCtrlReset", null);
		controls["Undispense"] = new Control("#iwdCtrlUndispense", null);
		controls["Dispense1"] = new Control("#iwdCtrlDispense-1", null);
		controls["Dispense2"] = new Control("#iwdCtrlDispense-2", null);
		controls["Dispense3"] = new Control("#iwdCtrlDispense-3", null);

		const crossTick = new CrossTick("#iwdCrossTick");
		const solveIO = new SolveIO(controls, crossTick);	

		this.solveBiz = new SolveBiz(this.puzzle, dispensers, ring, solveIO);
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
}
/*
const demoScript = [
	"Dispense1",
	"Pause",
	"Dispense2",
	"Dispense3",
	"Pause",
	"Reset",
	"Pause",
	"Dispense2",
	"Dispense2",
	"Dispense1",
	"Dispense1",
	"Dispense1",
	"Dispense2",
	"Dispense1",
	"Dispense3",
	"Dispense2",
	"Pause",
	"Undispense",
	"Undispense",
	"Dispense2",
	"Dispense2",
	"Pause",
	"Reset",
	"Pause",
	"Hint",
	"Pause",
	"Solution"
];
*/
const demoScript = [
	"Dispense1",
	"Pause",
	"Dispense2",
	"Pause",
	"Dispense3",
	"Pause",
	"Pause",
	"Undispense",
	"Pause",		
	"Undispense",
	"Pause",		
	"Undispense",
	"Pause",		
	"Pause",		
	"Dispense2",
	"Pause",		
	"Dispense2",
	"Pause",		
	"Dispense1",
	"Pause",		
	"Dispense1",
	"Pause",		
	"Dispense1",
	"Pause",		
	"Dispense2",
	"Pause",		
	"Dispense1",
	"Pause",		
	"Dispense3",
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
	"Dispense2",
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
	const iwdControls = ["Hint", "Solution", "Reset", "Undispense", "Dispense1", "Dispense2", "Dispense3"]
	for (let control of iwdControls) spotRefLookUp[control] = document.querySelector("#iwdSpot" + control);
	for (let c = 1; c <= 3; c++) spotRefLookUp["Dispense" + String(c)] = document.querySelector("#iwdSpotDispense-" + String(c));
	
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
		
		const control = command;
		const spotRef = spotRefLookUp[control];
		for (let opacity of spotFadeSequence) {
			demoShowSpot(spotRef, opacity);
			await wait(100);
		}
		
		switch(control) {
		case "Hint":
			await demo.solveBiz.hintWithCallback();
			break;
		case "Solution":
			await demo.solveBiz.solutionWithCallback();
			break;
		case "Reset":
			demo.solveBiz.resetClicked();
			break;
		case "Undispense":
			demo.solveBiz.undispenseClicked();
			break;
		case "Dispense1":
			demo.solveBiz.dispenseClicked(1);
			break;
		case "Dispense2":
			demo.solveBiz.dispenseClicked(2);
			break;
		case "Dispense3":
			demo.solveBiz.dispenseClicked(3);
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


/* -------- Begin -------- */
const mainWall = new MainWall(mainWallSpec);
const punter = new Punter(punterPuzzle);
const infoWall = new InfoWall(mainWall.topPosition, mainWall.leftPosition, mainWall.fontSize);
const demo = new Demo();


/* -------- Preamble -------- */

async function performPreamble() {
	//const surroundInstructionsRef = document.querySelector("#iwSurroundInstructions");
	//const surroundDemonstrationRef = document.querySelector("#iwdSurroundDemonstration");
	//const surroundInformationRef = document.querySelector("#mwdSurroundInformation");
	//const separator2Ref = document.querySelector("#iwSeparator-2");
	
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

infoWall.controlBack.freeze();
infoWall.controlDemo.freeze();
punter.solveBiz.wake();
punter.solveBiz.freeze();
performPreamble();


