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


/* -------- Fit -------- */

const mainWallSpec = {
	numGridRows: 120,
	numGridColumns: 60
};

class MainWallFit {
	constructor(mainWallSpec) {
		console.log(`${window.innerHeight}px`);
		console.log(`${window.innerWidth}px`);
		console.log(`${window.devicePixelRatio}`);
		const mainRef = document.querySelector("#mainWall");
		
		let innerDimension = 0
		let gridDimension = 0
		if ((window.innerHeight / mainWallSpec.numGridRows) <= (window.innerWidth / mainWallSpec.numGridColumns)) {
			innerDimension = window.innerHeight;
			gridDimension = mainWallSpec.numGridRows;
		}
		else {
			innerDimension = window.innerWidth;
			gridDimension = mainWallSpec.numGridColumns;
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
		mainRef.style.fontSize = `${fontSize}px`;
		this.fontSize = fontSize;
		
		const spareHeight = window.innerHeight - (this.fontSize * mainWallSpec.numGridRows);
		console.log('mw spareHeight', spareHeight);
		const deviceSpareHeight = spareHeight * window.devicePixelRatio;
		console.log('mw deviceSpareHeight', deviceSpareHeight);
		const roundedDeviceSpareHeight = Math.trunc(deviceSpareHeight / 2) * 2;
		console.log('mw roundedDeviceSpareHeight', roundedDeviceSpareHeight);
		const roundedSpareHeight = roundedDeviceSpareHeight / window.devicePixelRatio;
		console.log('mw roundedSpareHeight', roundedSpareHeight);
		this.topPosition = roundedSpareHeight / 2;
		mainRef.style.top = `${this.topPosition}px`;

		this.width = this.fontSize * mainWallSpec.numGridColumns
		const spareWidth = window.innerWidth - this.width;
		console.log('mw spareWidth', spareWidth);
		const deviceSpareWidth = spareWidth * window.devicePixelRatio;
		console.log('mw deviceSpareWidth', deviceSpareWidth);
		const roundedDeviceSpareWidth = Math.trunc(deviceSpareWidth / 2) * 2;
		console.log('mw roundedDeviceSpareWidth', roundedDeviceSpareWidth);
		const roundedSpareWidth = roundedDeviceSpareWidth / window.devicePixelRatio;
		console.log('mw roundedSpareWidth', roundedSpareWidth);
		this.leftPosition = roundedSpareWidth / 2;
		mainRef.style.left = `${this.leftPosition}px`;
	}
}

class InfoWallFit {
	constructor(topPosition, leftPosition, fontSize) {
		const infoRef = document.querySelector("#infoWall");
		infoRef.style.top = `${topPosition}px`;
		infoRef.style.left = `${leftPosition}px`;
		infoRef.style.fontSize = `${fontSize}px`;
	}
}


/* -------- Puzzle -------- */

class Puzzle {
	constructor(puzzleSpec) {
		this.words = puzzleSpec.wordSpec;
		this.solution = [undefined]
		for (let i = 1; i <= 5; i++) {
			const place = new LinePosition(puzzleSpec.solutionSpec[i][0], puzzleSpec.solutionSpec[i][1]);
			this.solution.push(place);
		}
		this.hintLetter = puzzleSpec.hintSpec[0];
		this.hintPlace = new LinePosition(puzzleSpec.hintSpec[1][0], puzzleSpec.hintSpec[1][1]);
	}
};


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


/* -------- Grid -------- */

class RowColumn {
	constructor(row, column) {
		this.row = row;
		this.column = column;
	}
}

class LinePosition {
	constructor(line, position) {
		this.line = line;
		this.position = position;
	}
}

class Intersection {
	constructor(self, other) {
		this.self = self;
		this.other = other;
	}
}

class Line {
	constructor(num, matrixCoords, intersections) {
		this.colourHighlighted = `rgb(0%,0%,80%)`;
		this.colourUnhighlighted = `black`;
		this.helper = undefined;
		this.num = num;
		this.matrixCoords = matrixCoords;
		this.intersections = intersections;
		this.isOccupied = false;
		this.characters = new Array(8);
		this.elementMatrix = undefined;
	}
	
	setHelper(helper) {
		this.helper = helper;
		this.elementMatrix = helper.getElementMatrix();
	}

	reset() {
		this.isOccupied = false;
	}

	addWord(spelling, startPosition) {
		for (let position = 1; position < 8; position++) {
			this.characters[position] = " ";
		}
		for (let position = startPosition; position < startPosition + spelling.length; position++) {
			const letter = spelling[position - startPosition];
			this.characters[position] = letter;
		}
		this.isOccupied = true;
	}

	hasWord() {
		return this.isOccupied;
	}

	renderLetter(letter, position, colour) {
		const matrixCoord = this.matrixCoords[position];
		this.elementMatrix[matrixCoord.row][matrixCoord.column].textContent = letter;
		this.elementMatrix[matrixCoord.row][matrixCoord.column].style.color = colour;
		
	}

	unrenderLetter(position) {
		const matrixCoord = this.matrixCoords[position];
		this.elementMatrix[matrixCoord.row][matrixCoord.column].textContent = " ";		
	}
	
	refresh(colour) {
		if (!this.isOccupied) {
			for (let position = 1; position < 8; position++) {
				const matrixCoord = this.matrixCoords[position];
				this.elementMatrix[matrixCoord.row][matrixCoord.column].textContent = " ";
			}
		}
		else {
			for (let position = 1; position < 8; position++) {
				this.renderLetter(this.characters[position], position, colour);
			}
		}
	}
	
	refreshUnhighlighted() {
		this.refresh(this.colourUnhighlighted);
	}
	
	refreshHighlighted() {
		this.refresh(this.colourHighlighted);
	}
			
	doesWordFit(spelling, startPosition) {
		if (this.isOccupied) return false;
		for (let intersection of this.intersections) {
			const otherLine = this.helper.getLine(intersection.other.line);
			if (!otherLine.isOccupied) continue;
			const otherLetter = otherLine.characters[intersection.other.position];
			if (spelling[intersection.self.position - startPosition] != otherLetter) return false;
		}
		return true;
	}
	
	whereDoesWordFit(spelling) {
		if (this.isOccupied) return [];
		if (spelling.length == 5) {
			if (this.doesWordFit(spelling, 2)) return [new LinePosition(this.num, 2)]; else return [];
		}
		if (spelling.length == 7) {
			if (this.doesWordFit(spelling, 1)) return [new LinePosition(this.num, 1)]; else return [];
		}
		let possibleFits = [];
		if (this.doesWordFit(spelling, 1)) possibleFits.push(new LinePosition(this.num, 1));
		if (this.doesWordFit(spelling, 2)) possibleFits.push(new LinePosition(this.num, 2));
		return possibleFits;
	}
	
	displayLetter(letter, position) {
		this.renderLetter(letter, position, this.colourUnhighlighted);
	}

	undisplayLetter(position) {
		this.unrenderLetter(position);
	}

}

class Grid {
	constructor(name) {
		this.elementMatrix = [undefined];
		for (let i = 1; i <= 7; i++) {
			this.elementMatrix[i] = new Array(8)
		};

		const cellCoords = ["12", "16",
							"21", "22", "23", "24", "25", "26", "27",
							"32", "36",
							"41", "42", "43", "44", "45", "46", "47",
							"52", "56",
							"61", "62", "63", "64", "65", "66", "67",
							"72", "76"
						   ];

		for (let coord of cellCoords) {
			const cellId = "#" + name + "Cell-" + coord;
			const cellElement = document.querySelector(cellId);
			const letters = [...coord];
			const row = Number(letters[0]);
			const column = Number(letters[1]);
			this.elementMatrix[row][column] = cellElement;
		};

		this.lines = [undefined];
		this.lines[1] = new Line (
							1,
							[undefined,
							 new RowColumn(2, 1),
							 new RowColumn(2, 2),
							 new RowColumn(2, 3),
							 new RowColumn(2, 4),
							 new RowColumn(2, 5),
							 new RowColumn(2, 6),
							 new RowColumn(2, 7)
							],
							[new Intersection(new LinePosition(0, 2), new LinePosition(4, 2)), 
							 new Intersection(new LinePosition(0, 6), new LinePosition(5, 2))
							]
					);
				
		this.lines[2] = new Line(
							2,
							[undefined,
							 new RowColumn(4, 1),
							 new RowColumn(4, 2),
							 new RowColumn(4, 3),
							 new RowColumn(4, 4),
							 new RowColumn(4, 5),
							 new RowColumn(4, 6),
							 new RowColumn(4, 7)
							],
							[new Intersection(new LinePosition(0, 2), new LinePosition(4, 4)), 
							 new Intersection(new LinePosition(0, 6), new LinePosition(5, 4))
							]
						);
					
		this.lines[3] = new Line(
							3,
							[undefined,
							 new RowColumn(6, 1),
							 new RowColumn(6, 2),
							 new RowColumn(6, 3),
							 new RowColumn(6, 4),
							 new RowColumn(6, 5),
							 new RowColumn(6, 6),
							 new RowColumn(6, 7)
							],
							[new Intersection(new LinePosition(0, 2), new LinePosition(4, 6)), 
							 new Intersection(new LinePosition(0, 6), new LinePosition(5, 6))
							]
						);
				
		this.lines[4] = new Line(
							4,
							[undefined,
							 new RowColumn(1, 2),
							 new RowColumn(2, 2),
							 new RowColumn(3, 2),
							 new RowColumn(4, 2),
							 new RowColumn(5, 2),
							 new RowColumn(6, 2),
							 new RowColumn(7, 2)
							],
							[new Intersection(new LinePosition(0, 2), new LinePosition(1, 2)), 
							 new Intersection(new LinePosition(0, 4), new LinePosition(2, 2)), 
							 new Intersection(new LinePosition(0, 6), new LinePosition(3, 2))
							]
						);
				
		this.lines[5] = new Line(
							5,
							[undefined,
							 new RowColumn(1, 6),
							 new RowColumn(2, 6),
							 new RowColumn(3, 6),
							 new RowColumn(4, 6),
							 new RowColumn(5, 6),
							 new RowColumn(6, 6),
							 new RowColumn(7, 6)
							],
							[new Intersection(new LinePosition(0, 2), new LinePosition(1, 6)), 
							 new Intersection(new LinePosition(0, 4), new LinePosition(2, 6)), 
							 new Intersection(new LinePosition(0, 6), new LinePosition(3, 6))
							]
						);

		this.forwardTryCycles = [undefined,
								 undefined,
								 undefined,
								 undefined,
								 undefined,
								 [new LinePosition(1, 2),
								  new LinePosition(2, 2),
								  new LinePosition(3, 2),
								  new LinePosition(4, 2),
								  new LinePosition(5, 2)
								 ],
								 [new LinePosition(1, 1),
								  new LinePosition(1, 2),
								  new LinePosition(2, 1),
								  new LinePosition(2, 2),
								  new LinePosition(3, 1),
								  new LinePosition(3, 2),
								  new LinePosition(4, 1),
								  new LinePosition(4, 2),
							      new LinePosition(5, 1),
								  new LinePosition(5, 2)
								 ],
								 [new LinePosition(1, 1),
								  new LinePosition(2, 1),
								  new LinePosition(3, 1),
								  new LinePosition(4, 1),
								  new LinePosition(5, 1),
								 ]
								];

		this.backwardTryCycles = [undefined,
								  undefined,
								  undefined,
								  undefined,
								  undefined,
								  [new LinePosition(5, 2),
								   new LinePosition(4, 2),
								   new LinePosition(3, 2),
		   						   new LinePosition(2, 2),
								   new LinePosition(1, 2)
								   ],
								  [new LinePosition(5, 2),
								   new LinePosition(5, 1),
								   new LinePosition(4, 2),
								   new LinePosition(4, 1),
								   new LinePosition(3, 2),
								   new LinePosition(3, 1),
								   new LinePosition(2, 2),
								   new LinePosition(2, 1),
								   new LinePosition(1, 2),
								   new LinePosition(1, 1)
								  ],
								  [new LinePosition(5, 1),
								   new LinePosition(4, 1),
								   new LinePosition(3, 1),
								   new LinePosition(2, 1),
								   new LinePosition(1, 1),
								  ]
								 ];
	
		this.isComplete = false;
		this.isHighlightOn = false;
		this.highlightPlace = undefined;
	}

	completeInitialisation() {
		for (let i = 1; i < this.lines.length; i++) {
			this.lines[i].setHelper(this);
		}
	}

	reset() {
		for (let i = 1; i < this.lines.length; i++) {
			this.lines[i].reset();
		}
		this.isComplete = false;
		this.isHighlightOn = false;		
	}
		
	getElementMatrix() {
		return this.elementMatrix;
	}

	getLine(lineNum) {
		return this.lines[lineNum];
	}

	setHighlightOn(place) {
		this.isHighlightOn = true;
		this.highlightPlace = place;
	}
	
	setHighlightOff() {
		this.isHighlightOn = false;
	}
	
	getPossibleFits(spelling) {
		let allPossibleFits = [];
		for (let i = 1; i < this.lines.length; i++) {
			const possibleFits = this.lines[i].whereDoesWordFit(spelling);
			for (let fit of possibleFits) {	allPossibleFits.push(fit); }
		}
		//console.log("Grid.getPossibleFits");
		//console.log(allPossibleFits.length);
		return allPossibleFits;
	}
	
	addWord(spelling, place) {
		this.lines[place.line].addWord(spelling, place.position);
	}
	
	removeWord(place) {
		this.lines[place.line].reset();
	}
	
	refresh() {
		const highlightedLine = this.isHighlightOn ? this.highlightPlace.line : undefined;		
		for (let i = 1; i < this.lines.length; i++) {
			if (this.lines[i].hasWord()) continue;
			this.lines[i].refreshUnhighlighted();
		}
		for (let i = 1; i < this.lines.length; i++) {
			if (!this.lines[i].hasWord()) continue;
			if (i == highlightedLine) continue;
			this.lines[i].refreshUnhighlighted();
		}
		if (highlightedLine != undefined) this.lines[highlightedLine].refreshHighlighted();
	}

	isSamePlace(place1, place2) {
		return place1.line == place2.line && place1.position == place2.position;
	}
				 
	findTryCycleIndex(tryCycle, place) {
		for (let i = 0; i < tryCycle.length; i++) {
			if (this.isSamePlace(tryCycle[i], place)) return i;
		}
	}

	getNextPlaceInTryCycle(tryCycle, currentPlace) {
		const currentIndex = this.findTryCycleIndex(tryCycle, currentPlace);
		if (currentIndex == tryCycle.length - 1)
			return tryCycle[0]
		else
			return tryCycle[currentIndex + 1]	
	}
	
	getNextAvailablePlace(tryCycles, spelling, currentPlace) {
		const tryCycle = tryCycles[spelling.length]
		let nextPlace = this.getNextPlaceInTryCycle(tryCycle, currentPlace);
		while (true) {
			//console.log(nextPlace);
			if (this.lines[nextPlace.line].doesWordFit(spelling, nextPlace.position)) {
				return nextPlace;
			}
			else {
				nextPlace = this.getNextPlaceInTryCycle(tryCycle, nextPlace);
			}
		}
	}
	
	getNextAvailablePlaceForward(spelling, currentPlace) {
		return this.getNextAvailablePlace(this.forwardTryCycles, spelling, currentPlace)
	}
	
	getNextAvailablePlaceBackward(spelling, currentPlace) {
		return this.getNextAvailablePlace(this.backwardTryCycles, spelling, currentPlace)
	}
	
	displayLetter(letter, place) {
		this.lines[place.line].displayLetter(letter, place.position);
	}

	undisplayLetter(place) {
		this.lines[place.line].undisplayLetter(place.position);
	}
};


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

function wordControlFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashWordControl(spellingRef, solveBiz) {
	await wait(300);
	spellingRef.style.backgroundColor = `rgb(80%,0%,0%)`;
	await wait(300);
	spellingRef.style.backgroundColor = `white`;
	await wait(300);
	spellingRef.style.backgroundColor = `rgb(80%,0%,0%)`;
	await wait(300);
	spellingRef.style.backgroundColor = `white`;
	wordControlFlashed(solveBiz)
}

class WordControl extends Control {
	constructor(spelling, idWithoutHash, onClick) {
		const idWithHash = "#" + idWithoutHash;
		super(idWithHash, onClick);
		const spellingIdWithoutHash = idWithoutHash + "-spelling";
		const spellingIdWithHash = "#" + spellingIdWithoutHash;
		const ref = document.querySelector(idWithHash);
		ref.innerHTML = "<span id=" + '"' + spellingIdWithoutHash + '"' + ">&thinsp;" + spelling + "&thinsp;</span>";
		this.spellingRef = document.querySelector(spellingIdWithHash);
	}
/*
	setHighlightOn() {
		this.spellingRef.style.color = `white`;
		this.spellingRef.style.backgroundColor = `black`;
	}
*/
	setHighlightOnLow() {
		this.spellingRef.style.color = `white`;
		this.spellingRef.style.backgroundColor = `black`;
	}

	setHighlightOnHigh() {
		this.spellingRef.style.color = `white`;
		this.spellingRef.style.backgroundColor = `rgb(0%,0%,80%)`;
	}
	
	setHighlightOff() {
		this.spellingRef.style.color = `black`;
		this.spellingRef.style.backgroundColor = `white`;
	}
	
	flash(solveBiz) {
		flashWordControl(this.spellingRef, solveBiz);		
	}
}

function xwardControlFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashXwardControl(ref, flasherRef, solveBiz) {
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
	xwardControlFlashed(solveBiz)
}

class XwardControl extends Control {
	constructor(id, onClick) {
		super(id, onClick);
		this.flasherRef = document.querySelector(id + "Flasher");
		this.flasherRef.style.display = `none`;
	}
	
	flash(solveBiz) {
		flashXwardControl(this.ref, this.flasherRef, solveBiz);		
	}
}


/* -------- Solve -------- */

class SolveIO {
	constructor(controls, crossTick) {
	//controls
	//an array of Control objects indexed by these names: "Backward", "Forward", "Information", "Hint", "Reset", "Solution", "Word1", "Word2", "Word3", "Word4", "Word5"
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
/*
	highlightWordControl(wordNum) {
		this.controls["Word" + String(wordNum)].setHighlightOn();
	}
*/
	highlightLowWordControl(wordNum) {
		this.controls["Word" + String(wordNum)].setHighlightOnLow();
	}

	highlightHighWordControl(wordNum) {
		this.controls["Word" + String(wordNum)].setHighlightOnHigh();
	}

	unhighlightWordControl(wordNum) {
		this.controls["Word" + String(wordNum)].setHighlightOff();
	}

	unhighlightAllWordControls() {
		for (let i = 1; i <= 5; i++) {
			this.unhighlightWordControl(i)
		}
	}

	enableWordControl(wordNum) {
		const name = "Word" + String(wordNum);
		this.controls[name].enable();
		this.controls[name].unfade();				
	}

	disableWordControl(wordNum) {
		const name = "Word" + String(wordNum);
		this.controls[name].disable();
		this.controls[name].fade();		
	}

	flashXwardControl(name, solveBiz) {
		this.controls[name].flash(solveBiz);
	}
	
	flashWordControl(wordNum, solveBiz) {
		this.controls["Word" + String(wordNum)].flash(solveBiz);
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

class Word {
	constructor(spelling) {
		this.spelling = spelling;
		this.inGrid = false;
		//place needed?
		this.placeInGrid = null;
	}
}

class SolveBiz {	
	constructor(puzzle, grid, io) {
		this.puzzle = puzzle;
		this.grid = grid;
		this.io = io;
		
		this.words = [undefined];
		for (let i = 1; i <= 5; i++) {
			this.words[i] = new Word(puzzle.words[i]);
		}

		this.selectedWordNum = undefined;		
		this.callbackResolve = undefined;

		this.hintNumShows = 3;
		this.hintNumShowsRemaining = undefined;
		this.hintIsShowing = undefined;

		this.solutionNextIndex = undefined;

		this.sleep();
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
	
	sleep() {
		this.io.disableAllControls();
	}
	
	wake() {
		this.io.enableAllControlsExcept(["Reset", "Forward", "Backward"]);
	}
	
	freeze() {
		this.io.freezeAllControls();
	}
	
	unfreeze() {
		this.io.unfreezeAllControls();
	}

	reset() {
		this.grid.reset();
		this.grid.refresh();
		this.io.unhighlightAllWordControls();
		this.io.hideCrossTick();
		for (let i = 1; i <= 5; i++) {
			this.words[i].inGrid = false;
		}
		this.selectedWordNum = undefined;
	}

	getNumWordsInGrid() {
		let count = 0;
		for (let i = 1; i <= 5; i++) {
			if (this.words[i].inGrid) count++;
		}
		return count;
	}
/*	
	review() {
		if (this.selectedWordNum != undefined) {
			this.grid.setHighlightOn(this.words[this.selectedWordNum].placeInGrid);
			this.io.enableControls(["Forward", "Backward"]);
		}
		else {
			this.grid.setHighlightOff();
			this.io.disableControls(["Forward", "Backward"]);
		}

		const numWordsInGrid = this.getNumWordsInGrid();
		if (numWordsInGrid == 0) {
			this.io.disableControls(["Reset"]);			
		}
		else {
			this.io.enableControls(["Reset"]);			
		}
		
		if (numWordsInGrid == 5) {
			this.grid.refresh();
			this.io.unhighlightAllWordControls();
			//+Reset etc??
			this.io.disableControls(["Word1", "Word2", "Word3", "Word4", "Word5", "Forward", "Backward"]);
			this.freeze();
			this.io.showTick(this);
			return;
		}
		
		for (let i = 1; i <= 5; i++) {
			const word = this.words[i];
			if (!word.inGrid) {
				this.io.unhighlightWordControl(i);
			}
			else {
				this.io.highlightWordControl(i);
				this.io.enableWordControl(i);
			}
		}
		this.grid.refresh();
	}
*/
	review() {
		const numWordsInGrid = this.getNumWordsInGrid();

		if (numWordsInGrid == 5) {
			this.grid.setHighlightOff();
			this.grid.refresh();
			this.io.unhighlightAllWordControls();
			//+Reset etc??
			this.io.disableControls(["Word1", "Word2", "Word3", "Word4", "Word5", "Forward", "Backward"]);
			this.freeze();
			this.io.showTick(this);
			return;
		}

		if (this.selectedWordNum != undefined) {
			this.grid.setHighlightOn(this.words[this.selectedWordNum].placeInGrid);
			this.io.enableControls(["Forward", "Backward"]);
		}
		else {
			this.grid.setHighlightOff();
			this.io.disableControls(["Forward", "Backward"]);
		}

		//const numWordsInGrid = this.getNumWordsInGrid();
		if (numWordsInGrid == 0) {
			this.io.disableControls(["Reset"]);			
		}
		else {
			this.io.enableControls(["Reset"]);			
		}
/*		
		if (numWordsInGrid == 5) {
			this.grid.refresh();
			this.io.unhighlightAllWordControls();
			//+Reset etc??
			this.io.disableControls(["Word1", "Word2", "Word3", "Word4", "Word5", "Forward", "Backward"]);
			this.freeze();
			this.io.showTick(this);
			return;
		}
*/		
		for (let i = 1; i <= 5; i++) {
			const word = this.words[i];
			if (!word.inGrid) {
				this.io.unhighlightWordControl(i);
			}
			else if (i == this.selectedWordNum) {
				this.io.highlightHighWordControl(i);
				this.io.enableWordControl(i);
			}
			else {
				this.io.highlightLowWordControl(i);
				this.io.enableWordControl(i);
			}
/*			else {
				this.io.highlightWordControl(i);
				this.io.enableWordControl(i);
			} */
		}
		this.grid.refresh();
	}
	
	wordClicked(wordNum) {
		//console.log("Word button clicked");
		//console.log(wordNum);
		//console.log(this.words[wordNum]);
		const word = this.words[wordNum];
		if (!word.inGrid) {
			//console.log("Word not in grid");
			const spelling = word.spelling;
			const possibleFits = this.grid.getPossibleFits(spelling);
			if (possibleFits.length == 0) {
				this.freeze();
				this.io.flashWordControl(wordNum, this);
				return;
			}
			const randomFit = possibleFits[this.getRandomInt(possibleFits.length)];
			this.grid.addWord(spelling, randomFit);
			word.inGrid = true;
			word.placeInGrid = randomFit;
			this.selectedWordNum = wordNum;
		}
		else if (this.selectedWordNum == wordNum) {
			//console.log("Word in grid. Selected");
			this.grid.removeWord(word.placeInGrid);
			word.inGrid = false;
			this.selectedWordNum = undefined;
		}
		else {
			//console.log("Word in grid. Not selected");
			this.selectedWordNum = wordNum;
		}
		this.review();
	}

	demoWordClicked(wordNum, lineNum, position) {
		//word is not in the grid
		const definedPlace = new LinePosition(lineNum, position);
		const word = this.words[wordNum];
		this.grid.addWord(word.spelling, definedPlace);
		word.inGrid = true;
		word.placeInGrid = definedPlace;
		this.selectedWordNum = wordNum;
		this.review();
	}

	forwardClicked() {
		//console.log("Forward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceForward(word.spelling, currentPlace);
		if (newPlace.line == currentPlace.line && newPlace.position == currentPlace.position) {
			this.grid.addWord(word.spelling, currentPlace);
			this.freeze();
			this.io.flashXwardControl("Forward", this);
		}
		else {
			word.placeInGrid = newPlace;
			this.grid.addWord(word.spelling, newPlace);
			this.review();
		}
	}

	backwardClicked() {
		//console.log("Backward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceBackward(word.spelling, currentPlace);
		if (newPlace.line == currentPlace.line && newPlace.position == currentPlace.position) {
			this.grid.addWord(word.spelling, currentPlace);
			this.freeze();
			this.io.flashXwardControl("Backward", this);
		}
		else {
			word.placeInGrid = newPlace;
			this.grid.addWord(word.spelling, newPlace);
			this.review();
		}
	}

	resetClicked() {
		this.reset();
		this.io.enableAllControlsExcept(["Reset", "Forward", "Backward"]);
	}

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
			//add "Information" here
			this.io.enableControls(["Reset"]);
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
}


/* -------- Punter -------- */

function punterInformationOnClick() {
	//console.log("informationOnClick called");
	info.show();
	enableScrolling();
}

function punterForwardOnClick() {punter.solveBiz.forwardClicked();};
function punterBackwardOnClick() {punter.solveBiz.backwardClicked();};
function punterResetOnClick() {punter.solveBiz.resetClicked();};
function punterHintOnClick() {punter.solveBiz.hintClicked();};
function punterHintTimerExpired() {punter.solveBiz.hintTimerExpired();};
function punterSolutionOnClick() {punter.solveBiz.solutionClicked();};
function punterSolutionTimerExpired() {punter.solveBiz.solutionTimerExpired();};

let punterWordOnClicks = [undefined,
						  function() {punter.solveBiz.wordClicked(1)},
						  function() {punter.solveBiz.wordClicked(2)},
						  function() {punter.solveBiz.wordClicked(3)},
						  function() {punter.solveBiz.wordClicked(4)},
						  function() {punter.solveBiz.wordClicked(5)},
						 ];

class Punter {
	constructor(puzzleSpec) {
		this.puzzle = new Puzzle(puzzleSpec);
		
		let controls = [];
		controls["Information"] = new Control("#mwdCtrlInformation", punterInformationOnClick, null);
		controls["Hint"] = new Control("#mwdCtrlHint", punterHintOnClick, null);
		controls["Solution"] = new Control("#mwdCtrlSolution", punterSolutionOnClick, null);
		controls["Reset"] = new Control("#mwdCtrlReset", punterResetOnClick, null);
		controls["Forward"] = new XwardControl("#mwdCtrlForward", punterForwardOnClick);
		controls["Backward"] = new XwardControl("#mwdCtrlBackward", punterBackwardOnClick);

		const wordIdRoot = "mwdpWord-";
		for (let i = 1; i <= 5; i++) {
			const wordId = wordIdRoot + String(i);
			controls["Word" + String(i)] = new WordControl(this.puzzle.words[i], wordId, punterWordOnClicks[i]);
		}

		const crossTick = new CrossTick("#mwCrossTick");
		const solveIO = new SolveIO(controls, crossTick);	

		const grid = new Grid("mwdp");
		grid.completeInitialisation();

		this.solveBiz = new SolveBiz(this.puzzle, grid, solveIO);
	}
}


/* -------- Info Wall -------- */

function backOnClick() {
	console.log("backOnClick called");
	info.hide();
	disableScrolling();
	}

function demonstrationOnClick () {
	console.log("demonstrationOnClick called");
	demo.enter();
	}

class Info {
	constructor() {
		this.wallRef = document.querySelector("#infoWall");

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
		this.wallRef.style.zIndex = `3`;
		const separator2Rect = this.separator2Ref.getBoundingClientRect();
		console.log(separator2Rect);
		this.separator2TopPosition = separator2Rect.top;
	}

	hide() {
		this.wallRef.style.display = `none`;
		this.wallRef.style.zIndex = `1`;
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
		
		let controls = [];
		controls["Information"] = new Control("#iwdCtrlInformation", null);
		controls["Hint"] = new Control("#iwdCtrlHint", null);
		controls["Solution"] = new Control("#iwdCtrlSolution", null);
		controls["Reset"] = new Control("#iwdCtrlReset", null);
		controls["Forward"] = new Control("#iwdCtrlForward", null);
		controls["Backward"] = new Control("#iwdCtrlBackward", null);
		controls["Word1"] = new WordControl(this.puzzle.words[1], "iwdpWord-1", null);
		controls["Word2"] = new WordControl(this.puzzle.words[2], "iwdpWord-2", null);
		controls["Word3"] = new WordControl(this.puzzle.words[3], "iwdpWord-3", null);
		controls["Word4"] = new WordControl(this.puzzle.words[4], "iwdpWord-4", null);
		controls["Word5"] = new WordControl(this.puzzle.words[5], "iwdpWord-5", null);

		const crossTick = new CrossTick("#iwdCrossTick");
		const solveIO = new SolveIO(controls, crossTick);	

		const grid = new Grid("iwdp");
		grid.completeInitialisation();

		this.solveBiz = new SolveBiz(this.puzzle, grid, solveIO);
	}
	
	enter() {
		info.controlBack.disable();
		info.controlBack.fade();
		info.controlDemo.disable();
		info.controlDemo.fade();
		
		info.separator2Ref.scrollIntoView({behavior:"smooth"});
		
		demoExecuteScript();
	}
	
	exit() {
		info.controlBack.enable();
		info.controlBack.unfade();
		info.controlDemo.enable();
		info.controlDemo.unfade();
		
		window.scrollTo({top:0, left:0, behavior:"smooth"});
	}
}

/*
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
	"Word3,2,2",		
	"Pause",							
	"Word5,1,1",
	"Pause",
	"Word3",
	"Pause",			
	"Word5",
	"Word3",
	"Word5",
	"Forward",
	"Pause",
	"Word3",
	"Pause",				
	"Word3",
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
	"Hint",
	"Pause",
	"Solution"
];
*/
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
	"Hint",
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
	//const iwdpControls = ["Word-1", "Word-2", "Word-3", "Word-4", "Word-5"];
	//for (let control of iwdpControls) spotRefLookUp[control] = document.querySelector("#iwdpSpot" + control);
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



/* ========================================================================================================================================================== */
/* DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO */
/* ========================================================================================================================================================== */
/*
let demoPuzzleSpec = {
	wordSpec: [undefined, "ARCANE", "CAREER", "EARNER", "ARENA", "BANANAS"],
	solutionSpec: [undefined, [2, 2], [3, 1], [5, 1], [1, 2], [4, 1]],
	hintSpec: ["R", [1, 3]]
};

const demoPuzzle = new Puzzle(demoPuzzleSpec);

function demoHintTimerExpired() {demoSolveBiz.hintWithCallbackTimerExpired();};
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
const demoControlDemonstration = new Control("#demoCtrlDemonstration", demonstrationClicked);
demoControlDemonstration.enable();
demoControlDemonstration.unfade();

let demoControls = [];
demoControls["Information"] = new Control("#demoCtrlInformation", null);
demoControls["Hint"] = new Control("#demoCtrlHint", null);
demoControls["Solution"] = new Control("#demoCtrlSolution", null);
demoControls["Reset"] = new Control("#demoCtrlReset", null);
demoControls["Forward"] = new Control("#demoCtrlForward", null);
demoControls["Backward"] = new Control("#demoCtrlBackward", null);
demoControls["Word1"] = new WordControl(demoPuzzle.words[1], "demoWord-1", null);
demoControls["Word2"] = new WordControl(demoPuzzle.words[2], "demoWord-2", null);
demoControls["Word3"] = new WordControl(demoPuzzle.words[3], "demoWord-3", null);
demoControls["Word4"] = new WordControl(demoPuzzle.words[4], "demoWord-4", null);
demoControls["Word5"] = new WordControl(demoPuzzle.words[5], "demoWord-5", null);

const demoCrossTick = new CrossTick("#demoCrossTick");

const demoSolveIO = new SolveIO(demoControls, demoCrossTick);	

const demoGrid = new Grid("demo");
demoGrid.completeInitialisation();

const demoSolveBiz = new SolveBiz(demoPuzzle, demoGrid, demoSolveIO);
*/

/*
function showSpot(spotRef, opacity) {
		spotRef.style.display = `block`;
		spotRef.style.opacity = `${opacity}`;
	}
	
function hideSpot(spotRef) {
		spotRef.style.display = `none`;
	}

const spotWord1Ref = document.querySelector("#demoSpotWord-1");
const spotWord2Ref = document.querySelector("#demoSpotWord-2");
const spotWord3Ref = document.querySelector("#demoSpotWord-3");
const spotWord4Ref = document.querySelector("#demoSpotWord-4");
const spotWord5Ref = document.querySelector("#demoSpotWord-5");

const spotHintRef = document.querySelector("#demoSpotHint");
const spotSolutionRef = document.querySelector("#demoSpotSolution");
const spotForwardRef = document.querySelector("#demoSpotForward");
const spotBackwardRef = document.querySelector("#demoSpotBackward");
const spotResetRef = document.querySelector("#demoSpotReset");


let spotRefLookUp = [];
spotRefLookUp["Word1"] = spotWord1Ref;
spotRefLookUp["Word2"] = spotWord2Ref;
spotRefLookUp["Word3"] = spotWord3Ref;
spotRefLookUp["Word4"] = spotWord4Ref;
spotRefLookUp["Word5"] = spotWord5Ref;

spotRefLookUp["Hint"] = spotHintRef;
spotRefLookUp["Solution"] = spotSolutionRef;
spotRefLookUp["Forward"] = spotForwardRef;
spotRefLookUp["Backward"] = spotBackwardRef;
spotRefLookUp["Reset"] = spotResetRef;
*/

/*
function word1Action() {demoSolveBiz.wordClicked(1)};
function hintAction() {return demoSolveBiz.hintWithCallback()};
function solutionAction() {return demoSolveBiz.solutionWithCallback()};
function ForwardAction() {demoSolveBiz.forwardClicked()};
function BackwardAction() {demoSolveBiz.backwardClicked()};
function resetAction() {demoSolveBiz.resetClicked()};
*/
/*
let actionLookUp = [];
actionLookUp["Word1"] = word1Action;
actionLookUp["Hint"] = hintAction;
actionLookUp["Solution"] = solutionAction;
actionLookUp["Forward"] = forwardAction;
actionLookUp["Backward"] = backwardAction;
actionLookUp["Reset"] = resetAction;
*/
/*
const script = ["Word1,3,1",
				"Pause",
				"Forward",
				"Pause",
				"Forward",
				"Pause",
				"Backward",
				"Pause",
				"Word1",
				"Pause",
				"Word3,2,2",
				"Backward",
				"Word5,1,1",
				"Forward",
				"Forward",
				"Pause",
				"Word3",
				"Pause",
				"Word3",
				"Pause",
				"Word2,5,1",
				"Backward",
				"Word1,1,2",
				"Forward",
				"Word4,1,2",
				"Word3,5,1",
				"Pause",
				"Pause",
				"Pause",
				"Reset",
				"Pause",
				"Hint",
				"Pause",
				"Solution"
			   ];
*/
/*
const script = [
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
				"Word3,2,2",		
				"Pause",							
				"Word5,1,1",
				"Pause",
				"Word3",
				"Pause",			
				"Word5",
				"Word3",
				"Word5",
				"Forward",
				"Pause",
				"Word3",
				"Pause",				
				"Word3",
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
				"Hint",
				"Pause",
				"Solution"
			   ];
*/
/*			   
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
		const control = command.split(",")[0];
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
		case "Forward":
			demoSolveBiz.forwardClicked();
			break;
		case "Backward":
			demoSolveBiz.backwardClicked();
			break;
		case "Word1":
			demoSolveBiz.wordClicked(1);
			break;
		case "Word2":
			demoSolveBiz.wordClicked(2);
			break;
		case "Word3":
			demoSolveBiz.wordClicked(3);
			break;
		case "Word4":
			demoSolveBiz.wordClicked(4);
			break;
		case "Word5":
			demoSolveBiz.wordClicked(5);
			break;
		default:
			const splitWordCommand = command.split(",");
			demoSolveBiz.demoWordClicked(Number(splitWordCommand[0][4]), Number(splitWordCommand[1]), Number(splitWordCommand[2]));
			break;
		}
		
		hideSpot(spotRef);
		await wait(1000);
*/		
/*		if (control === "Word?") {
			//wait longer if the grid is complete - to allow for tick flashing
			await wait(2000);
		}
		else {
			await wait(1000);
		}
*/
/*	}
	await wait(2000);
	demoSolveBiz.reset();
	demoSolveBiz.sleep();
	demoControlBack.enable();
	demoControlBack.unfade();
	demoControlDemonstration.enable();
	demoControlDemonstration.unfade();
}
*/

/* -------- Begin -------- */

const mainWallFit = new MainWallFit(mainWallSpec);
const infoWallFit = new InfoWallFit(mainWallFit.topPosition, mainWallFit.leftPosition, mainWallFit.fontSize);
const punter = new Punter(punterPuzzleSpec);
const info = new Info();
const demo = new Demo();


/* -------- Preamble -------- */

async function performPreamble() {
	const wallRef = document.querySelector("#infoWall");	
	const surroundInstructionsRef = document.querySelector("#iwSurroundInstructions");
	const surroundDemonstrationRef = document.querySelector("#iwdSurroundDemonstration");
	const surroundInformationRef = document.querySelector("#mwdSurroundInformation");
	const separator2Ref = document.querySelector("#iwSeparator-2");
	
	wallRef.style.display = `grid`;
	wallRef.style.zIndex = `3`;

	await wait(1500);

	surroundInstructionsRef.style.display = `block`;
	await wait(750);
	surroundInstructionsRef.style.display = `none`;

	await wait(750);

	separator2Ref.scrollIntoView({behavior: "smooth"});

	await wait(1000);
	
	surroundDemonstrationRef.style.display = `block`;
	await wait(750);
	surroundDemonstrationRef.style.display = `none`;

	await wait(1000);

	wallRef.style.display = `none`;
	wallRef.style.zIndex = `1`;

	await wait(1000);

	surroundInformationRef.style.display = `block`;
	await wait(500);
	surroundInformationRef.style.display = `none`;
	
	info.controlBack.unfreeze();
	info.controlDemo.unfreeze();
	punter.solveBiz.unfreeze();
	disableScrolling();
}

info.controlBack.freeze();
info.controlDemo.freeze();
punter.solveBiz.wake();
punter.solveBiz.freeze();
performPreamble();


/* ======================================================================================================================================================== */
/* PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE */
/* ======================================================================================================================================================== */
/*
async function performPreamble() {

	const wallRef = document.querySelector("#infoWall");
	
	const surround1TopRef = document.querySelector("#infoSurroundInstructions-top");
	const surround1BottomRef = document.querySelector("#infoSurroundInstructions-bottom");
	const surround1LeftRef = document.querySelector("#infoSurroundInstructions-left");
	const surround1RightRef = document.querySelector("#infoSurroundInstructions-right");

	const surround2TopRef = document.querySelector("#demoSurroundDemonstration-top");
	const surround2BottomRef = document.querySelector("#demoSurroundDemonstration-bottom");
	const surround2LeftRef = document.querySelector("#demoSurroundDemonstration-left");
	const surround2RightRef = document.querySelector("#demoSurroundDemonstration-right");

	const surround3TopRef = document.querySelector("#punterSurroundInformation-top");
	const surround3BottomRef = document.querySelector("#punterSurroundInformation-bottom");
	const surround3LeftRef = document.querySelector("#punterSurroundInformation-left");
	const surround3RightRef = document.querySelector("#punterSurroundInformation-right");

	demoControlBack.freeze();
	demoControlDemonstration.freeze();
	
	wallRef.style.display = `grid`;
	wallRef.style.zIndex = `3`;

//	await wait(2000);
	await wait(1000);

	surround1TopRef.style.display = `block`;
	surround1BottomRef.style.display = `block`;
	surround1LeftRef.style.display = `block`;
	surround1RightRef.style.display = `block`;

//	await wait(1500);
	await wait(1000);

	surround1TopRef.style.display = `none`;
	surround1BottomRef.style.display = `none`;
	surround1LeftRef.style.display = `none`;
	surround1RightRef.style.display = `none`;

//	await wait(1000);
	await wait(500);
	
	surround2TopRef.style.display = `block`;
	surround2BottomRef.style.display = `block`;
	surround2LeftRef.style.display = `block`;
	surround2RightRef.style.display = `block`;

//	await wait(1500);
	await wait(1000);

	surround2TopRef.style.display = `none`;
	surround2BottomRef.style.display = `none`;
	surround2LeftRef.style.display = `none`;
	surround2RightRef.style.display = `none`;

//	await wait(1000);
	await wait(500);

	wallRef.style.display = `none`;
	wallRef.style.zIndex = `1`;

//	await wait(1000);
	await wait(500);

	surround3TopRef.style.display = `block`;
	surround3BottomRef.style.display = `block`;
	surround3LeftRef.style.display = `block`;
	surround3RightRef.style.display = `block`;

//	await wait(1500);
	await wait(1000);

	surround3TopRef.style.display = `none`;
	surround3BottomRef.style.display = `none`;
	surround3LeftRef.style.display = `none`;
	surround3RightRef.style.display = `none`;
	
	demoControlBack.unfreeze();
	demoControlDemonstration.unfreeze();

	punterSolveBiz.unfreeze();
}
//performPreamble();
*/
//info.controlBack.freeze();
//info.controlDemo.freeze();
//punter.solveBiz.wake();
//punter.solveBiz.freeze();
//performPreamble();
