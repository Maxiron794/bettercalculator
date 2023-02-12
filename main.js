const priority = [
    ["sin", "cos", "root"],
    ["**"],
    ["*", "/"],
    ["+", "-"]
]

const code = {
    "root": (input) => {
        let param = input.slice(input.indexOf("[") + 1, input.indexOf("]"));
        let number = input.slice(input.indexOf("]") + 1);
        if (param.length == 0 || number.length == 0) { shake() }
        else { return number ** (1 / param) }
    },
    "sin": (input) => {
        let number = input.slice(3)
        if (number.length == 0) { shake() }
        else { return Math.sin(number * Math.PI / 180); }
    },
    "cos": (input) => {
        let number = input.slice(3)
        if (number.length == 0) { shake() }
        else { return Math.cos(number * Math.PI / 180); }
    },
    "**": (input) => {
        let index = input.indexOf("**")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 2)
        if (firstNumber.length == 0 || secondNumber.length == 0) { shake() }
        else { return firstNumber ** secondNumber }
    },
    "*": (input) => {
        let index = input.indexOf("*")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (firstNumber.length == 0 || secondNumber.length == 0) { shake() }
        else { return firstNumber * secondNumber }
    },
    "/": (input) => {
        let index = input.indexOf("/")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if ((firstNumber.length == 0 || secondNumber.length == 0) || secondNumber == "0") { shake() }
        else { return firstNumber / secondNumber }
    },
    "+": (input) => {
        let index = input.indexOf("+")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (firstNumber.length == 0 || secondNumber.length == 0) { shake() }
        else { return (firstNumber - 0) + (secondNumber - 0) }
    },
    "-": (input) => {
        let index = input.indexOf("-")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (secondNumber.length == 0) { shake() }
        else if (firstNumber == "0" || firstNumber.length == 0) { return "-" + secondNumber }
        else { return firstNumber - secondNumber }
    }
}

function calculate(input) {
    return mainCalculator(tokenizeString(input))
}

function mainCalculator(list) {
    
    let expression = ""
    for (let i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) {
            expression += "" + mainCalculator(list[i])
        } else {
            expression += list[i]
        }
    }
    
    priority.forEach(operands => {
        while (true) {
            debugger;
            let indexes = []
            operands.forEach(operand => {
                let index = expression.indexOf(operand)
                if (index != -1) {
                    indexes.push(index)
                }
            });

            let index = Math.min(...indexes)

            if (index != Infinity) {
                let paste = betweenTwoOperands(expression, index)

                let start = expression.indexOf(paste)

                let firstPart = start == 0 ? "" : expression.slice(0, start)
                let endPart = expression.slice(start + paste.length)

                let answer;

                if (paste.length == 0) {
                    shake(); return;
                } else {
                    for (let key in code) {
                        if (paste.includes(key)) {
                            answer = code[key](paste)
                            break;
                        }
                    }
                }

                if (answer == undefined) { answer = paste }

                expression = firstPart + answer + endPart
            }

            break;
        }
    })

    return expression
}

function deleteMinusOne(...list) {
    let new_list = []
    list.forEach(element => {
        if (element != -1) {
            new_list.push(element)
        }
    });
    return new_list;
}


function getInside(rightPart, openedIndex, find) {
    let closedIndex = getClosedBracket(rightPart, find)

    if (closedIndex == -1) {
        console.error(Error("Bracket " + openedIndex + " is not closed!"));
        return;
    }

    return rightPart.substr(1, closedIndex - 1)

}

function getClosedBracket(string, find) {
    let round = 0
    switch (find) {
        case "(": round++; break;
    }

    for (let i = 1; i < string.length; i++) {
        let char = string[i]
        switch (char) {
            case "(": round++; break;
            case ")": round -= 1; break;
        }
        if (round == 0) {
            return i;
        }
    }

    return -1
}

function tokenizeString(input) {
    let list = [];

    let look = true;

    let openedIndex = input.indexOf("(")

    if (openedIndex == -1) {
        return [input];
    }

    let leftPart = input.substr(0, openedIndex)

    if (leftPart != "") {
        list.push(leftPart);
    }

    let rightPart = input.substr(openedIndex, input.length - openedIndex);

    while (look) {

        let closedIndex = getClosedBracket(rightPart, "(")

        let inside = getInside(rightPart.slice(rightPart.indexOf("(")), rightPart.indexOf("("), "(")

        list.push(tokenizeString(inside))

        if (closedIndex == rightPart.length - 1) {
            look = 0;
        } else {
            let openRightIndex = rightPart.indexOf("(", closedIndex + 1);
            if (openRightIndex == -1) {
                list.push(rightPart.slice(closedIndex + 1))
                look = 0
            } else {
                list.push(rightPart.slice(inside.length + 2, openRightIndex))
                rightPart = rightPart.slice(openRightIndex)
            }

        }
    }

    return list;

}

function newTokenizeString(input) {
    
}

function betweenTwoOperands(input, index) {
    let secondIndex = Math.min(...(deleteMinusOne(
        input.indexOf("+", index + 2),
        input.indexOf("-", index + 2),
        input.indexOf("*", index + 2),
        input.indexOf("/", index + 2)
    )))

    let firstIndex = Math.max(...(deleteMinusOne(
        input.reverseIndexOf("+", index - 1),
        input.reverseIndexOf("-", index - 1),
        input.reverseIndexOf("*", index - 1),
        input.reverseIndexOf("/", index - 1)
    )))

    if (firstIndex == -Infinity && secondIndex == Infinity) { return input }
    if (firstIndex == -Infinity) { return input.slice(0, secondIndex) }
    if (secondIndex == Infinity) { return input.slice(firstIndex + 1) }

    return input.slice(firstIndex + 1, secondIndex)
}

String.prototype.reverseIndexOf = function (searchElement, index = -1) {
    if (index == -1) { index == this.length - 1 }
    if (index >= index.length) { console.error(Error("index is greater than length of String")); return; }
    for (let i = index; i >= 0; i--) {
        if (this[i] === searchElement) {
            return i;
        }
    }
    return -1;
};

function addNewOperand(name, prior, func, insert = false) {
    if (insert) {
        priority.splice(prior, 0, [name])
    } else {
        priority[prior].push(name)
    }

    code[name] = func

}