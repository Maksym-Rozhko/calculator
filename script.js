class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.currentOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    const fixedNumberMillion = 1000000;
    const fixedNumberOneThousand = 1000;

    switch (this.operation) {
      case '+':
        computation = ( prev * fixedNumberMillion + current * fixedNumberMillion ) / fixedNumberMillion;
        break;
      case '-':
        computation = ( prev * fixedNumberMillion - current * fixedNumberMillion ) / fixedNumberMillion;
        break;
      case 'x':
        computation = ( prev * fixedNumberOneThousand * current * fixedNumberOneThousand ) / fixedNumberMillion;
        break;
      case '÷':
        if (prev === 0 || current === 0 ) {
          this.currentOperand = '';
          modalText.innerText = 'You can\'t divide by zero. Change zero to another number!';
          return modal.style.display = 'block';
        }
        computation = ( prev * fixedNumberOneThousand / current * fixedNumberOneThousand ) / fixedNumberMillion;
        break;
      case '^':
        computation = Math.pow(prev, current);
        break;
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }
  
  countSqrt() {
    if (this.currentOperand < 0) {
        this.currentOperand = '';
        modalText.innerText = 'The root of a negative number can\'t be extracted!';
        return modal.style.display = 'block';
    }
    this.currentOperand = Math.sqrt(this.currentOperand).toString().slice(0,20);
  }

  changeSign() {
    this.currentOperand *= -1;
  }

  dataStyleCalc() {
    const bgColor = document.querySelector('#bodyColor');
    const outputColor = document.querySelector('#outputColor');
    const prevOperColor = document.querySelector('#prevOperColor');
    const curOperColor = document.querySelector('#curOperColor');

    bgColor.classList[1] !== 'active' ? bgColor.classList.add('active') : bgColor.classList.remove('active');
    outputColor.classList[1] !== 'output--active' ? outputColor.classList.add('output--active') : outputColor.classList.remove('output--active');
    prevOperColor.classList[1] !== 'prev-oper-active' ? prevOperColor.classList.add('prev-oper-active') : prevOperColor.classList.remove('prev-oper-active');
    curOperColor.classList[1] !== 'cur-oper-active' ? curOperColor.classList.add('cur-oper-active') : curOperColor.classList.remove('cur-oper-active');
    document.querySelectorAll('.calculator-grid .color-operation').forEach(n => n.classList.add('clr-oper-active'));
    document.querySelectorAll('.calculator-grid .color-clear').forEach(n => n.classList.add('clr-clear-active'));
    document.querySelectorAll('.calculator-grid .color-number').forEach(n => n.classList.add('clr-number-active'));

    if (bgColor.classList[1] !== 'active') {
      document.querySelectorAll('.calculator-grid .color-operation').forEach(n => n.classList.remove('clr-oper-active'));
    }

    if (bgColor.classList[1] !== 'active') {
      document.querySelectorAll('.calculator-grid .color-clear').forEach(n => n.classList.remove('clr-clear-active'));
    }

    if (bgColor.classList[1] !== 'active') {
      document.querySelectorAll('.calculator-grid .color-number').forEach(n => n.classList.remove('clr-number-active'));
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '0';
    } else {
      integerDisplay = integerDigits.toLocaleString('it', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}
  
  
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const sqrtButton = document.querySelector('[data-sqrt]');
const changeSignButton = document.querySelector('[data-change-sign]');
const dataStyleCalc = document.querySelector('[data-smile]');
const modal = document.querySelector('.modal');
const calcBody = document.querySelector('.calculator-grid');
const btnClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalText = document.querySelector('.modal__text');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

const modalInnerText = modalTitle.innerText = 'Error: This operation can\'t be performed.';

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  const target = e.target;
  if (target === modal) {
    modal.style.display = 'none';
  }
});

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset) {
        calculator.currentOperand = "";
        calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
  })
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

sqrtButton.addEventListener('click', () => {
  calculator.countSqrt();
  calculator.updateDisplay();
});

changeSignButton.addEventListener('click', () => {
  calculator.changeSign();
  calculator.updateDisplay();
});

dataStyleCalc.addEventListener('click', () => {
  calculator.dataStyleCalc();
});