const numGridColumns = 59;

//main wall
const mainWallHeightAboveDoor = 10;

//punter door
const punterDoorHeightAbovePanel = 12;
const punterDoorHeightBelowPanel = 21;

//punter panel
const punterPanelHeightAboveDispensers = 3;
const punterPanelHeightBelowDispensers = 26;
const containerCompartmentHeight = 7;

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

class Symbol {
	static getHTMLcode(symbol) {
		const LookUp = {"0":"0",
					    "1":"1",
						"2":"2",
						"3":"3",
						"4":"4",
						"5":"5",
						"6":"6",
						"7":"7",
						"8":"8",
						"9":"9",
						"+":"&plus;",
						"-":"&minus;",
						"*":"&times;",
						"/":"&divide;",
						"h":"&half;"
					   };
		return LookUp[symbol]
	}
	
	static isValidSequence(symbol1, symbol2) {
		console.log(symbol1, symbol2)
		const invalidAfterLookUp = {"":"*/",
									"0":"",
									"1":"",
									"2":"",
									"3":"",
									"4":"",
									"5":"",
									"6":"",
									"7":"",
									"8":"",
									"9":"",
									"+":"+-*/",
									"-":"+-*/",
									"*":"+-*/",
									"/":"+-*/",
									"h":"0123456789"
								   };
		return !(invalidAfterLookUp[symbol1].includes(symbol2));
	}
}

class Puzzle {
	constructor(puzzleSpec) {
		this.dispenserFullSpec = puzzleSpec.dispenserSpec;
		this.solutionExpression = puzzleSpec.solutionExpression;
		this.solutionDispenseSequence = puzzleSpec.solutionDispenseSequence;
		this.numDispensers = this.dispenserFullSpec.length - 1;
		this.dispenserHeightSpec = [undefined];
		for (let i = 1; i <= this.numDispensers; i++) this.dispenserHeightSpec[i] = this.dispenserFullSpec[i].length;
		this.maxDispenserHeight = 1;
		for (let d = 1; d <= this.numDispensers; d++) {
			if (this.dispenserHeightSpec[d] > this.maxDispenserHeight) this.maxDispenserHeight = this.dispenserHeightSpec[d];
		};
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

class Item {
	constructor(dispenser, symbol) {
		this.dispenser = dispenser;
		this.symbol = symbol;
	}
}

class Dispenser {
	constructor(symbolSequence, itemIdRoot) {		
		this.itemQueue = [];
		for (let i = 0; i < symbolSequence.length; i++) {
			const item = new Item(this, symbolSequence[i]);
			this.itemQueue.unshift(item);
		}

		this.itemRefs = [];
		for (let i = 1; i <= symbolSequence.length; i++) {
			const itemId = itemIdRoot + String(i);
			const itemRef = document.querySelector(itemId);
			this.itemRefs.push(itemRef);
		}
		
		this.container = [];
		for (let t = 0; t < this.itemQueue.length; t++) this.container[t] = this.itemQueue[t];
				
		this.numItemsInContainer = this.itemQueue.length;
	}

	refresh() {
		for (let t = 0; t < this.container.length; t++) {
			if (this.container[t] == null) {
				this.itemRefs[t].style.display = `none`;
			}
			else {
				this.itemRefs[t].style.display = `block`;
				this.itemRefs[t].innerHTML = "<code><strong>" + Symbol.getHTMLcode(this.container[t].symbol) + "</strong></code>";
			}
		}
	}
	
	reset() {	
		this.container = [];
		for (let i = 0; i < this.itemQueue.length; i++) this.container[i] = this.itemQueue[i];
		this.numItemsInContainer = this.itemQueue.length;
	}
	
	takeItem() {
		const item = this.container.shift();
		this.container.push(null);
		this.numItemsInContainer--;
		return item;
	}
	
	replaceItem() {
		this.container.pop();
		const item = this.itemQueue[this.itemQueue.length - this.numItemsInContainer - 1];
		this.container.unshift(item);
		this.numItemsInContainer++;		
	}
}

class Expression {
	constructor(expressionId) {
		this.expressionRef = document.querySelector(expressionId);
		this.items = [];
	}
	
	reset() {
		this.items = [];
	}

	getLength() {
		return this.items.length;
	}
	
	getExpression() {
		let expression = "";
		for (let item of this.items) {
			expression = expression + item.symbol;
		}
		return expression;
	}

	addItem(item) {
		this.items.push(item);
	}
	
	removeItem() {
		return this.items.pop();
	}
	
	refresh() {
		let html = "<code><strong>";
		for (let item of this.items) {
			html = html + Symbol.getHTMLcode(item.symbol);
		}
		html = html + "</strong></code>";
		this.expressionRef.innerHTML = html;
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

function dispenseControlFlashed(solveBiz) {solveBiz.unfreeze()}

async function flashDispenseControl(ref, flasherRef, solveBiz) {
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
	dispenseControlFlashed(solveBiz)
}

class DispenseControl extends Control {
	constructor(id, onClick) {
		super(id, onClick);
		this.flasherRef = document.querySelector(id + "Flasher");
		this.flasherRef.style.display = `none`;
	}
	
	flash(solveBiz) {
		flashDispenseControl(this.ref, this.flasherRef, solveBiz);		
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

	flashDispenseControl(name, solveBiz) {
		this.controls[name].flash(solveBiz);
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
	constructor(puzzle, dispensers, expression, io) {
		this.puzzle = puzzle;
		this.dispensers = dispensers;
		this.expression = expression;
		this.io = io;
		
		for (let i = 1; i <= puzzle.numDispensers; i++) this.dispensers[i].refresh();
		this.expression.refresh();

		this.hintNumShows = 3;
		this.hintNumShowsRemaining = undefined;
		this.hintIsShowing = undefined;

		//this.solutionNextIndex = undefined;
		this.callbackResolve = undefined;

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
		this.expression.reset();
		this.expression.refresh();
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
			if (this.dispensers[i].numItemsInContainer == 0) {
				this.io.disableControls(["Dispense" + String(i)]);
			}
			else {
				this.io.enableControls(["Dispense" + String(i)]);
			}
		}
	}

	review() {
		this.updateDispenseControls();
		let numEmptyDispensers = 0;
		for (let i = 1; i <= this.puzzle.numDispensers; i++) {
			if (this.dispensers[i].numItemsInContainer == 0) numEmptyDispensers++;
		}
		if (this.expression.getLength() == 0) {
			this.io.disableControls(["Reset", "Undispense"]);
		}
		else {
			this.io.enableControls(["Reset", "Undispense"]);
		}
		if (numEmptyDispensers == this.puzzle.numDispensers) {
			const thisSolution = this.expression.getExpression();
			const correctSolution = this.puzzle.solutionExpression;
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
		const itemRemoved = this.expression.removeItem();
		const dispenser = itemRemoved.dispenser;
		dispenser.replaceItem();
		this.expression.refresh();
		dispenser.refresh();
		this.review();
	}
	
	dispenseClicked(dispenserNum) {
		const dispenser = this.dispensers[dispenserNum];
		const itemTaken = dispenser.takeItem();
		const expressionSoFar = this.expression.getExpression();
		console.log(expressionSoFar)
		const lastSymbol = expressionSoFar.length == 0 ? "" : expressionSoFar.charAt(expressionSoFar.length - 1);
		if (Symbol.isValidSequence(lastSymbol, itemTaken.symbol)) {
			this.expression.addItem(itemTaken);
			dispenser.refresh();
			this.expression.refresh();
			this.review();
		}
		else {
			dispenser.replaceItem();
			this.io.flashDispenseControl("Dispense" + String(dispenserNum), this);
		}
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
	} */

	solutionShowItem(dispenser) {
		const itemTaken = dispenser.takeItem();
		this.expression.addItem(itemTaken);
		dispenser.refresh();
		this.expression.refresh();
	}

	solutionTimerExpired() {
		const dispenserNum = this.puzzle.solutionDispenseSequence[this.solutionNextIndex];
		const dispenser = this.dispensers[dispenserNum];
		this.solutionShowItem(dispenser);
		this.solutionNextIndex++;
		if (this.solutionNextIndex == this.puzzle.solutionDispenseSequence.length) {
			//add "Information" here
			this.io.enableControls(["Reset"]);
			return;
		}
		setTimeout(punterSolutionTimerExpired, 1000);
	}

	solutionClicked() {
		this.io.disableAllControls();
		this.io.hideCrossTick();
		if (this.expression.getLength() == 0) {
			const dispenserNum = this.puzzle.solutionDispenseSequence[0];
			const dispenser = this.dispensers[dispenserNum];
			this.solutionShowItem(dispenser);
			this.solutionNextIndex = 1;
		}
		else {
			this.reset();
			this.solutionNextIndex = 0;
		}
		setTimeout(punterSolutionTimerExpired, 1000);
	}
		
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
	}
}

/* ========================================================================================================================================================= */
/* PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER PUNTER */
/* ========================================================================================================================================================= */

/*
let punterPuzzleSpec = {
	dispenserSpec: [undefined, "/9", "6-", "38", "0", "1"],
	//hintSpec: ["green", 6],
	solutionExpression: "90-186/3",
	solutionDispenseSequence: [1, 4, 2, 5, 3, 2, 1, 3]
}; */

let punterPuzzleSpec = {
	dispenserSpec: [undefined, "-1", "4*1", "71"],
	//hintSpec: ["green", 6],
	solutionExpression: "11*14-7",
	solutionDispenseSequence: [1, 2, 2, 3, 2, 1, 3]
};

const punterPuzzle = new Puzzle(punterPuzzleSpec);

const dispensersId = "#mwdpDispensers-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers);
const dispensersRef = document.querySelector(dispensersId);
dispensersRef.style.display = `grid`;
//const dispensersHeight = containerCompartmentHeight * punterPuzzle.maxDispenserHeight;
const dispensersHeight = containerCompartmentHeight * punterPuzzle.maxDispenserHeight + 2;
dispensersRef.style.height = `${dispensersHeight}em`;

for (let d = 1; d <= punterPuzzle.numDispensers; d++) {
	const numItems = punterPuzzle.dispenserHeightSpec[d];
	const containerId = "#mwdpdContainer-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(numItems);
	const containerRef = document.querySelector(containerId);
	containerRef.style.display = `block`;
	const borderId = "#mwdpdBorder-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(numItems);
	const borderRef = document.querySelector(borderId);
	borderRef.style.display = `block`;
	for (let i = 1; i <= numItems; i++) {
		const itemId = "#mwdpdItem-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-" + String(d) + String(i);
		const itemRef = document.querySelector(itemId);
		itemRef.style.display = `block`;
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
	punterControls["Dispense" + String(i)] = new DispenseControl(dispenseId, punterDispenseOnClicks[i]);
}

const punterCrossTick = new CrossTick("#mwCrossTick");

const punterSolveIO = new SolveIO(punterControls, punterCrossTick);	

let punterDispensers = [undefined];
const punterItemIdRoot = "#mwdpdItem-" + String(punterPuzzle.maxDispenserHeight) + String(punterPuzzle.numDispensers) + "-";
for (let i = 1; i <= punterPuzzle.numDispensers; i++) {
	const itemIdRootPlus = punterItemIdRoot + String(i);
	punterDispensers[i] = new Dispenser(punterPuzzle.dispenserFullSpec[i], itemIdRootPlus);
}

const punterExpression = new Expression("#mwdpExpressionForeground");

const punterSolveBiz = new SolveBiz(punterPuzzle, punterDispensers, punterExpression, punterSolveIO);
punterSolveBiz.wake();
//disable all the controls while the preamble runs
punterSolveBiz.freeze();

/* ========================================================================================================================================================== */
/* DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO DEMO */
/* ========================================================================================================================================================== */

let demoPuzzleSpec = {
	dispenserSpec: [undefined, "61", "56", "-", "4*"],
	//hintSpec: ["green", 6],
	solutionExpression: "6*14-56",
	solutionDispenseSequence: [2, 4, 1, 4, 3, 2, 1]
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

const demoExpression = new Expression("#iwdpExpressionForeground");

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
/*				"Pause",
				"Hint", */
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

/* ======================================================================================================================================================== */
/* PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE PREAMBLE */
/* ======================================================================================================================================================== */

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

	demoControlBack.freeze();
	//demoControlDemonstration.freeze();
	
	wallRef.style.display = `grid`;
	wallRef.style.zIndex = `3`;

	await wait(1000);

	surround1TopRef.style.display = `block`;
	surround1BottomRef.style.display = `block`;
	surround1LeftRef.style.display = `block`;
	surround1RightRef.style.display = `block`;

	await wait(1000);

	surround1TopRef.style.display = `none`;
	surround1BottomRef.style.display = `none`;
	surround1LeftRef.style.display = `none`;
	surround1RightRef.style.display = `none`;

	await wait(500);
	
	surround2TopRef.style.display = `block`;
	surround2BottomRef.style.display = `block`;
	surround2LeftRef.style.display = `block`;
	surround2RightRef.style.display = `block`;

	await wait(1000);

	surround2TopRef.style.display = `none`;
	surround2BottomRef.style.display = `none`;
	surround2LeftRef.style.display = `none`;
	surround2RightRef.style.display = `none`;

	await wait(500);

	wallRef.style.display = `none`;
	wallRef.style.zIndex = `1`;

	await wait(500);

	surround3TopRef.style.display = `block`;
	surround3BottomRef.style.display = `block`;
	surround3LeftRef.style.display = `block`;
	surround3RightRef.style.display = `block`;

	await wait(1000);

	surround3TopRef.style.display = `none`;
	surround3BottomRef.style.display = `none`;
	surround3LeftRef.style.display = `none`;
	surround3RightRef.style.display = `none`;
	
	demoControlBack.unfreeze();
	//demoControlDemonstration.unfreeze();

	punterSolveBiz.unfreeze();
}
performPreamble();

