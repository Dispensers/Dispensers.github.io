//const numGridRows = 122;
const numGridRows = 120;
const numGridColumns = 60;
const cellDimensionEM = 6;

console.log(`${window.innerHeight}px`);
console.log(`${window.innerWidth}px`);
console.log(`${window.devicePixelRatio}`);

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
const fontSize = updateFontSize(numGridRows, numGridColumns);


function setBorderWidths(cellDimensionEM, fontSize, internalFraction, externalFraction) {
	const cellDimensionPX = cellDimensionEM * fontSize;
	const cellDimensionDevicePX = cellDimensionPX * window.devicePixelRatio;
	const internalWidthPX = Math.ceil(cellDimensionDevicePX * internalFraction / window.devicePixelRatio);
	const externalWidthPX = Math.ceil(cellDimensionDevicePX * externalFraction / window.devicePixelRatio);
	
	console.log('internalWidthPX');
	console.log(internalWidthPX);
	console.log('externalWidthPX');
	console.log(externalWidthPX);
	
	const styleSheet = document.styleSheets[0];
	//console.log(styleSheet.cssRules);
	const thinTopRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".ThinTop");
	thinTopRule.style.setProperty("border-top-width", `${internalWidthPX}px`);
	const thinBottomRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".ThinBottom");
	thinBottomRule.style.setProperty("border-bottom-width", `${internalWidthPX}px`);
	const thinLeftRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".ThinLeft");
	thinLeftRule.style.setProperty("border-left-width", `${internalWidthPX}px`);
	const thinRightRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".ThinRight");
	thinRightRule.style.setProperty("border-right-width", `${internalWidthPX}px`);

	const edgeTopRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".EdgeTop");
	edgeTopRule.style.setProperty("border-top-width", `${externalWidthPX}px`);
	const edgeBottomRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".EdgeBottom");
	edgeBottomRule.style.setProperty("border-bottom-width", `${externalWidthPX}px`);
	const edgeLeftRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".EdgeLeft");
	edgeLeftRule.style.setProperty("border-left-width", `${externalWidthPX}px`);
	const edgeRightRule = [...styleSheet.cssRules].find((r) => r.selectorText === ".EdgeRight");
	edgeRightRule.style.setProperty("border-right-width", `${externalWidthPX}px`);
}
setBorderWidths(cellDimensionEM, fontSize, 0.02, 0.05);


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
		//this.hintLetters = [undefined, null, null, null, null, null, null, null]
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
				//const matrixCoord = this.matrixCoords[position];
				//this.elementMatrix[matrixCoord.row][matrixCoord.column].textContent = this.characters[position];
				//this.elementMatrix[matrixCoord.row][matrixCoord.column].style.color = colour;
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
			//console.log(intersection);
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
			//console.log(cellId);
			const cellElement = document.querySelector(cellId);
			const letters = [...coord];
			const row = Number(letters[0]);
			const column = Number(letters[1]);
			//console.log(row);
			//console.log(column);
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
		console.log("Grid.getPossibleFits");
		console.log(allPossibleFits.length);
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

	setHighlightOn() {
		this.spellingRef.style.color = `white`;
		this.spellingRef.style.backgroundColor = `black`;
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
		//this.ref = document.querySelector(id);
		this.flasherRef = document.querySelector(id + "Flasher");
		this.flasherRef.style.display = `none`;
	}
	
	flash(solveBiz) {
		flashXwardControl(this.ref, this.flasherRef, solveBiz);		
	}
}

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
		//console.log("disableControls");
		//console.log(controls);
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
		//console.log("enableControls");
		//console.log(controls);
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

	highlightWordControl(wordNum) {
		this.controls["Word" + String(wordNum)].setHighlightOn();
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
/*		let isEmpty = true;
		for (let i = 1; i <= 5; i++) {
			if (this.words[i].inGrid) {
				isEmpty = false;
				break;
			}
		}
		if (isEmpty) { */
		if (numWordsInGrid == 0) {
			this.io.disableControls(["Reset"]);			
		}
		else {
			this.io.enableControls(["Reset"]);			
		}
		
/*		let isComplete = true;
		for (let i = 1; i <= 5; i++) {
			if (!this.words[i].inGrid) {
				isComplete = false;
				break;
			}
		}
		if (isComplete) { */
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
/*				const possibleFits = this.grid.getPossibleFits(word.spelling);
				if (possibleFits.length == 0) {
					this.io.disableWordControl(i);
				}
				else {
					this.io.enableWordControl(i);						
				} */
			}
			else {
				this.io.highlightWordControl(i);
				this.io.enableWordControl(i);
			}
		}
		this.grid.refresh();
	}
	
	wordClicked(wordNum) {
		console.log("Word button clicked");
		console.log(wordNum);
		console.log(this.words[wordNum]);
		//if (grid.isComplete) return;
		const word = this.words[wordNum];
		//if (!this.words[wordNum].inGrid) {
		if (!word.inGrid) {
			console.log("Word not in grid");
			//const spelling = this.words[wordNum].spelling;
			const spelling = word.spelling;
			const possibleFits = this.grid.getPossibleFits(spelling);
			//console.log(possibleFits);
			//if nowhere for word to go, control should probably be disabled?
			if (possibleFits.length == 0) {
				this.freeze();
				this.io.flashWordControl(wordNum, this);
				return;
			}
			const randomFit = possibleFits[this.getRandomInt(possibleFits.length)];
			//console.log(randomFit);
			this.grid.addWord(spelling, randomFit);
			//const word = this.words[wordNum];
			word.inGrid = true;
			word.placeInGrid = randomFit;
			this.selectedWordNum = wordNum;
		}
		else if (this.selectedWordNum == wordNum) {
			console.log("Word in grid. Selected");
			//const word = this.words[wordNum];
			this.grid.removeWord(word.placeInGrid);
			word.inGrid = false;
			this.selectedWordNum = undefined;
		}
		else {
			console.log("Word in grid. Not selected");
			this.selectedWordNum = wordNum;
		}
		this.review();
	}

	demoWordClicked(wordNum, lineNum, position) {
		//word is not in the grid
		console.log("demoWordClicked called");
		console.log(wordNum);
		console.log(lineNum);
		console.log(position);
		const definedPlace = new LinePosition(lineNum, position);
		const word = this.words[wordNum];
		this.grid.addWord(word.spelling, definedPlace);
		word.inGrid = true;
		word.placeInGrid = definedPlace;
		this.selectedWordNum = wordNum;
		this.review();
	}
/*	
	forwardClicked() {
		console.log("Forward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceForward(word.spelling, currentPlace);
		word.placeInGrid = newPlace;
		this.grid.addWord(word.spelling, newPlace);
		this.review();
	}
*/		
	forwardClicked() {
		console.log("Forward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceForward(word.spelling, currentPlace);
		console.log(newPlace);
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
/*
	backwardClicked() {
		console.log("Backward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceBackward(word.spelling, currentPlace);
		word.placeInGrid = newPlace;
		this.grid.addWord(word.spelling, newPlace);
		this.review();
	}
*/	
	backwardClicked() {
		console.log("Backward button clicked");
		const word = this.words[this.selectedWordNum];
		const currentPlace = word.placeInGrid;
		this.grid.removeWord(currentPlace);
		const newPlace = this.grid.getNextAvailablePlaceBackward(word.spelling, currentPlace);
		console.log(newPlace);
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
			//clearInterval(this.solutionTimer);
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


/* ========================================================================================================================================================= */
/* PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER */
/* ========================================================================================================================================================= */

let punterPuzzleSpec = {
	//wordSpec: [undefined, "ROWENA", "LEANNA", "RENATA", "ROSALEE", "RAMONA"],
	wordSpec: [undefined, "RUSHES", "USHERS", "SUISSE", "RUFUS", "USURER"],
	solutionSpec: [undefined, [2, 2], [5, 1], [1, 2], [3, 2], [4, 1]],
	hintSpec: ["S", [3, 6]]
};

const punterPuzzle = new Puzzle(punterPuzzleSpec);

function informationOnClick() {
	console.log("informationOnClick called");
	const infoWallRef = document.querySelector("#infoWall");
	infoWallRef.style.display = `grid`;
	infoWallRef.style.zIndex = `3`;
	const bodyRef = document.querySelector("body");
	bodyRef.style.overflow = `auto`;
}

function punterForwardOnClick() {punterSolveBiz.forwardClicked();};
function punterBackwardOnClick() {punterSolveBiz.backwardClicked();};
function punterResetOnClick() {punterSolveBiz.resetClicked();};
function punterHintOnClick() {punterSolveBiz.hintClicked();};
function punterHintTimerExpired() {punterSolveBiz.hintTimerExpired();};
function punterSolutionOnClick() {punterSolveBiz.solutionClicked();};
function punterSolutionTimerExpired() {punterSolveBiz.solutionTimerExpired();};

let punterWordOnClicks = [undefined,
						  function() {punterSolveBiz.wordClicked(1)},
						  function() {punterSolveBiz.wordClicked(2)},
						  function() {punterSolveBiz.wordClicked(3)},
						  function() {punterSolveBiz.wordClicked(4)},
						  function() {punterSolveBiz.wordClicked(5)},
						 ];

let punterControls = [];
punterControls["Information"] = new Control("#punterCtrlInformation", informationOnClick);
punterControls["Hint"] = new Control("#punterCtrlHint", punterHintOnClick);
punterControls["Solution"] = new Control("#punterCtrlSolution", punterSolutionOnClick);
punterControls["Reset"] = new Control("#punterCtrlReset", punterResetOnClick);
punterControls["Forward"] = new XwardControl("#punterCtrlForward", punterForwardOnClick);
punterControls["Backward"] = new XwardControl("#punterCtrlBackward", punterBackwardOnClick);

const punterWordIdRoot = "punterWord-";
for (let i = 1; i <= 5; i++) {
	const wordId = punterWordIdRoot + String(i);
	punterControls["Word" + String(i)] = new WordControl(punterPuzzle.words[i], wordId, punterWordOnClicks[i]);
}

const punterCrossTick = new CrossTick("#mainCrossTick");

const punterSolveIO = new SolveIO(punterControls, punterCrossTick);	

const punterGrid = new Grid("punter");
punterGrid.completeInitialisation();

const punterSolveBiz = new SolveBiz(punterPuzzle, punterGrid, punterSolveIO);
punterSolveBiz.wake();
//disable all the controls while the preamble runs
punterSolveBiz.freeze();


/* ========================================================================================================================================================== */
/* DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO */
/* ========================================================================================================================================================== */

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
const demoControlBack = new Control("#infoCtrlBackArrow", backClicked);
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
		
/*		if (control === "Word?") {
			//wait longer if the grid is complete - to allow for tick flashing
			await wait(2000);
		}
		else {
			await wait(1000);
		}
*/
	}
	await wait(2000);
	demoSolveBiz.reset();
	demoSolveBiz.sleep();
	demoControlBack.enable();
	demoControlBack.unfade();
	demoControlDemonstration.enable();
	demoControlDemonstration.unfade();
}


/* ======================================================================================================================================================== */
/* PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE */
/* ======================================================================================================================================================== */

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

	await wait(2000);

	surround1TopRef.style.display = `block`;
	surround1BottomRef.style.display = `block`;
	surround1LeftRef.style.display = `block`;
	surround1RightRef.style.display = `block`;

	await wait(1500);

	surround1TopRef.style.display = `none`;
	surround1BottomRef.style.display = `none`;
	surround1LeftRef.style.display = `none`;
	surround1RightRef.style.display = `none`;

	await wait(1000);
	
	surround2TopRef.style.display = `block`;
	surround2BottomRef.style.display = `block`;
	surround2LeftRef.style.display = `block`;
	surround2RightRef.style.display = `block`;

	await wait(1500);

	surround2TopRef.style.display = `none`;
	surround2BottomRef.style.display = `none`;
	surround2LeftRef.style.display = `none`;
	surround2RightRef.style.display = `none`;

	await wait(1000);

	wallRef.style.display = `none`;
	wallRef.style.zIndex = `1`;

	await wait(1000);

	surround3TopRef.style.display = `block`;
	surround3BottomRef.style.display = `block`;
	surround3LeftRef.style.display = `block`;
	surround3RightRef.style.display = `block`;

	await wait(1500);

	surround3TopRef.style.display = `none`;
	surround3BottomRef.style.display = `none`;
	surround3LeftRef.style.display = `none`;
	surround3RightRef.style.display = `none`;
	
	demoControlBack.unfreeze();
	demoControlDemonstration.unfreeze();

	punterSolveBiz.unfreeze();
}
performPreamble();

