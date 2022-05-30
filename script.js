//VARIABLES
let calculatorHeader = document.querySelector('.calculator-header'),
	one = document.querySelector('.one.item'),
	two = document.querySelector('.two.item'),
	three = document.querySelector('.three.item'),
	four = document.querySelector('.four.item'),
	five = document.querySelector('.five.item'),
	six = document.querySelector('.six.item'),
	seven = document.querySelector('.seven.item'),
	eight = document.querySelector('.eight.item'),
	nine = document.querySelector('.nine.item'),
	zero = document.querySelector('.zero.item'),
	plus = document.querySelector('.add.item'),
	minus = document.querySelector('.subtract.item'),
	multiply = document.querySelector('.multiply.item'),
	divide = document.querySelector('.divide.item'),
	equals = document.querySelector('.equals.item'),
	clear = document.querySelector('.clear.item'),
	backspace = document.querySelector('.backspace.item');

let operands = [ '0' ],
	operators = [ '+', '-', 'x', '÷', '=' ],
	buffer = [];

//FUNCTIONS
function clearHeader() {
	calculatorHeader.innerText = 0;
	operands = [ '0' ];
	buffer = [];
}

function handleBackspace() {
	if (calculatorHeader.innerText == 'Invalid' || calculatorHeader.innerText == '0') return;

	//if last entered is an operator
	if (operators.includes(calculatorHeader.innerText.slice(-1))) {
		buffer.pop();
		// operands.push(buffer[buffer.length - 1].toString().split(''));
		buffer[buffer.length - 1].toString().split('').forEach((operand) => operands.push(operand));
		buffer.pop();
	} else operands.pop();

	calculatorHeader.innerText = calculatorHeader.innerText.slice(0, -1);

	console.log(operands);
	console.log(buffer);
}

function showInput(input) {
	if (calculatorHeader.innerText == 'Invalid' || (calculatorHeader.innerText == '0' && input == '0')) return;

	//display operator
	if (operators.includes(input)) {
		calculatorHeader.innerText += input;
		return;
	}

	//if 0 AND non-zero input AND not a .
	if (calculatorHeader.innerText.slice(-1) == '.' && input == '.') return;

	if (calculatorHeader.innerText == 0 && input != 0) {
		//pop 0 from operands
		operands.pop();
		calculatorHeader.innerText = input;
		//push input as string in operands
		operands.push(input.toString());
		return;
	}

	operands.push(input.toString());
	calculatorHeader.innerText += input;
}

function calculateBuffer(operator) {
	if (calculatorHeader.innerText == 'Invalid') return;

	//if result AND 2nd operand present AND prev is not operator
	if (operator == '=' && operands.length && !operators.includes(calculatorHeader.innerText.slice(-1))) {
		buffer.push(parseFloat(operands.join('')));
		calculate(convertToPostfix(buffer));
		operands = [];
		if (calculatorHeader.innerText != 'Invalid') operands = calculatorHeader.innerText.split('');
		return;
	}

	//don't calculate if
	//no input after decimal OR same operator entered again
	if (calculatorHeader.innerText.slice(-1) == '.' || calculatorHeader.innerText.slice(-1) == operator) return;

	//change operator
	if (operators.includes(calculatorHeader.innerText.slice(-1))) {
		buffer[buffer.length - 1] = operator;
		calculatorHeader.innerText = calculatorHeader.innerText.slice(0, -1) + operator;
		return;
	}

	//convert input to num, store in buffer & empty operands
	buffer.push(parseFloat(operands.join('')));
	operands = [];
	//store operator after buffered num
	buffer.push(operator);

	showInput(operator);
}

function convertToPostfix(buf) {
	let stack = [],
		postfix = [],
		priority;
	buf.forEach((item) => {
		//if operand, push to postfix
		if (!isNaN(item)) postfix.push(item);
		else {
			//if operator, push to top of stack IFF priority is higher than stackTop
			//if stack is empty, push to top of stack
			if (stack.length == 0) stack.push(item);
			else {
				//keep looping till you can place it in stack
				while (true) {
					priority = checkPriority(item, stack[stack.length - 1]);

					//item is higher priority OR stack is empty => place in stack
					if (priority) {
						stack.push(item);
						break;
					} else {
						if (stack.length) postfix.push(stack.pop()); //item is same or lower priority, pop stackTop
					}
				}
			}
		}
	});

	//pop all from stack and push to postfix
	if (stack.length) postfix = [ ...postfix, ...stack.reverse() ];

	return postfix;
}

function checkPriority(curr, stackTop) {
	//true is higher priority, false is lower or equal priority
	if (getPriority(curr) < getPriority(stackTop)) return false;
	if (getPriority(curr) == getPriority(stackTop)) return false;
	if (getPriority(curr) > getPriority(stackTop)) return true;
	//if stack is empty, add to stack
	if (stackTop == undefined) return true;
}

function getPriority(operator) {
	switch (operator) {
		case '÷':
		case 'x':
			return 3;
		case '+':
		case '-':
			return 2;
	}
}

function calculate(postfix) {
	let stack = [],
		num2,
		num1,
		result,
		flag = false;

	postfix.forEach((item) => {
		if (!isNaN(item)) stack.push(item);
		else {
			num2 = stack.pop();
			num1 = stack.pop();
			stack.push(getResult(item, num1, num2));

			if (stack[stack.length - 1] == Infinity) {
				calculatorHeader.innerText = 'Invalid';
				flag = true;
			}
		}
	});
	if (flag) return;

	clearHeader();
	calculatorHeader.innerText = stack.pop().toFixed(2);
}

function getResult(operator, num1, num2) {
	switch (operator) {
		case '+':
			return num1 + num2;
		case '-':
			return num1 - num2;
		case 'x':
			return num1 * num2;
		case '÷':
			return num1 / num2;
	}
}

function handleKeyUp(e) {
	let key = e.key;

	switch (key) {
		case '1':
			one.click();
			break;
		case '2':
			two.click();
			break;
		case '3':
			three.click();
			break;
		case '4':
			four.click();
			break;
		case '5':
			five.click();
			break;
		case '6':
			six.click();
			break;
		case '7':
			seven.click();
			break;
		case '8':
			eight.click();
			break;
		case '9':
			nine.click();
			break;
		case '0':
			zero.click();
			break;

		case '+':
			plus.click();
			break;
		case '-':
			minus.click();
			break;
		case '*':
		case 'x':
			multiply.click();
			break;
		case '/':
		case '÷':
			divide.click();
			break;
		case '=':
		case 'Enter':
			equals.click();
			break;

		case 'Escape':
			clear.click();
			break;

		case 'Backspace':
			backspace.click();
			break;
	}
}

// KEYUP EVENTS
document.body.addEventListener('keyup', handleKeyUp);
