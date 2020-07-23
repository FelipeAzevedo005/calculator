class Display {
    constructor(value) {
        this.element = document.createElement("div");
        this.element.className = "display";

        this.setValue(value);
    }
 
    getValue = () => this.element.innerHTML;
    
    setValue = value => {
        if (this.isBig(value)) {
            this.element.innerHTML = this.formatedValue(value);
        } else this.element.innerHTML = value;
    }
    
    clear = () => this.setValue("");
    
    blinkText = () => {
        this.element.style.color = "#0001";
        setTimeout(() => this.element.style.color = "#fff", 35);
    }

    isBig = value => {
        if (value.toString().length > 13) {
            return true;
        } else return false;
    }

    formatedValue = value => {
        const oldValue = value.toString();
        let newValue = "";
    
        for (let digit = 0; digit <= 12; digit++) {
            newValue += oldValue[digit];
        }
    
        return newValue;
    }
}

class Button {
    constructor(label, className, action, display, state) {
        this.element = document.createElement("button");
        this.element.className = className;
        this.element.innerHTML = label;
 
        this.addListener(this.element, label, action, display, state);
    }
    
    addListener = (element, label, action, display, state) => {
        element.addEventListener("click", event => {
            switch(action) {
                case "clear":
                    display.blinkText();
                    this.clearMemory(display, state, initialState());
                    break;
                    case "addDigit":
                        this.addDigit(label, display, state);
                        break;
                    case "setOperation":
                        display.blinkText();
                        this.setOperation(label, display, state);
                        break;
                    case "calculate":
                        display.blinkText();
                        this.endOperation(display, state);
                        break;
                    default: 
            }
        })
    }

    addDigit = (digit, display, state) => {
        if (digit === "0" && display.getValue() === "0") {
            return display.blinkText();
        }

        if (digit === "." && display.getValue().includes(".")) {
            return;
        }
        
        if (digit === ".") state.set({ clearDisplay: false }, state);

        if (state.clearDisplay) {
            display.clear();
            state.set({ clearDisplay: false }, state);
        }

        display.setValue(display.getValue() + digit);
        state.values[state.currentValue] = parseFloat(display.getValue());
    }
    
    setOperation = (operator, display, state) => {
        if (state.currentValue === 0) {
            state.set({ currentValue: 1, operator }, state);
        } else {
            this.endOperation(display, state);
            state.set({ operator }, state);
        }
        
        state.set({ clearDisplay: true }, state);
    }

    calculate = (value1, value2, operator) => {
        if (operator === "/" && value2 === 0) {
            return "Math Error";
        }
        
        if (operator === null) return 0;
        
        return eval(`${value1} ${operator} ${value2}`);
    }
    
    endOperation = (display, state) => {
        if (state.values[0] === undefined || state.values[1] === undefined) return;
        const result = this.calculate(state.values[0], state.values[1], state.operator);
        display.setValue(result);
        state.set({ clearDisplay: true, values: [result, undefined] }, state);
    }    

    clearMemory = (display, state, initialState) => {
        display.setValue("0");
        state.set(initialState, state);
    }    
}

class Buttons {
    constructor(display, state) {
        this.element = document.createElement("div");
        this.element.className = "buttons";
        this.buttons = [
            new Button("AC", "button ac", "clear", display, state),
            new Button("/", "button operator", "setOperation", display, state),
            new Button("7", "button", "addDigit", display, state),
            new Button("8", "button", "addDigit", display, state),
            new Button("9", "button", "addDigit", display, state),
            new Button("*", "button operator", "setOperation", display, state),
            new Button("4", "button", "addDigit", display, state),
            new Button("5", "button", "addDigit", display, state),
            new Button("6", "button", "addDigit", display, state),
            new Button("-", "button operator", "setOperation", display, state),
            new Button("1", "button", "addDigit", display, state),
            new Button("2", "button", "addDigit", display, state),
            new Button("3", "button", "addDigit", display, state),
            new Button("+", "button operator", "setOperation", display, state),
            new Button("0", "button zero", "addDigit", display, state),
            new Button(".", "button", "addDigit", display, state),
            new Button("=", "button equals", "calculate", display, state),
        ];
        this.buttons.forEach(button => this.element.appendChild(button.element));
    }
}

class Calculator { 
    constructor(initialState) {
        const calculator = document.querySelector(".calculator");
        const state = initialState();
        const display = new Display("0");
        const buttons = new Buttons(display, state);
        
        calculator.appendChild(display.element);
        calculator.appendChild(buttons.element);
    }
}

const initialState = () => {
    return({
        values: [undefined, undefined],
        currentValue: 0,
        operator: null,
        clearDisplay: true,
        set: (newState, state) => {
            Object.assign(state, newState)
        }
    });
}

new Calculator(initialState);