const priority = [
    ["**"],
    ["*", "/"],
    ["+", "-"]
]

const splited = ["+", "-", "/", "**", "*"]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]

class CustomFunction {
    constructor(name, priority, func, description, ending = name[name.length - 1]) {
        this.name = name
        this.priority = priority
        this.func = func
        this.description = description
        this.ending = ending
    }
}

const funcs = [
    new CustomFunction("sin", 0, (number, string = "") => {
        if (number.length == 0) { shake() }
        else { return Math.sin(number * Math.PI / 180); }
    }, "just sin function"),
    new CustomFunction("cos", 0, (number, string = "") => {
        if (number.length == 0) { shake() }
        else { return Math.cos(number * Math.PI / 180); }
    }, "just cos function"),
    new CustomFunction("root", 0, (number, string = "") => {
        let param = string.slice(string.indexOf("[") + 1, string.indexOf("]"));
        if (param.length == 0 || number.length == 0) { shake() }
        else { return number ** (1 / param) }
    }, "", "]")
]

const code = {
    "**": (number1, number2) => { return number1 ** number2; },
    "*": (number1, number2) => { return number1 * number2 },
    "/": (number1, number2) => {
        if (number2 == "0") { shake() }
        else { return number1 / number2 }
    },
    "+": (number1, number2) => { return (number1 - 0) + (number2 - 0) },
    "-": (number1, number2) => { return number1 - number2 }
}

function calculate(input) {
    return mainCalculator(tokenizeBrackets(input))
}

function mainCalculator(list) {
    let expression = []

    for (let i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) {
            expression[i] = mainCalculator(list[i])
        } else {
            expression[i] = list[i]
        }
    }

    funcs.forEach(func => {
        for (let i = 0; i < expression.length; i++) {
            if (("" + expression[i]).includes(func.name)) {
                expression = [...expression.slice(0, i), func.func(expression[i + 1], expression[i]), ...expression.slice(i + 2)]
                
            }
        }
    })

    priority.forEach(operands => {
        while (true) {

            i = getTheSmallestIndex(expression, operands)

            if (i == Infinity) {
                break;
            }

            answer = code[expression[i]](expression[i - 1], expression[i + 1])

            expression = [...expression.slice(0, i - 1), answer, ...expression.slice(i + 2)]
        }
    })

    return expression[0]
}

function getTheSmallestIndex(text, operands) {
    let indexes = []
    operands.forEach(operand => {
        let index = text.indexOf(operand)
        if (index != -1) {
            indexes.push(index)
        }
    });

    return Math.min(...indexes)
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

function getClosedBracket(string) {
    let round = 1

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

function tokenizeBrackets(input) {
    if (input == "") { return; }

    let tokens = []

    let openedIndex = input.indexOf("(")

    if (openedIndex == -1) {
        tokens.push(...tokenizeString(input))
        return tokens
    }

    let beforeOpened = input.slice(0, openedIndex)

    if (beforeOpened.length != 0) {
        tokens.push(...tokenizeString(
            beforeOpened
        ))
    }

    let afterOpened = input.slice(openedIndex)
    let afterClosed

    let look = true;
    while (look) {

        let closedIndex = getClosedBracket(afterOpened, "(")

        if (closedIndex == -1) { console.error(Error("bracket " + openedIndex + "is not closed")) }

        let inside = afterOpened.slice(1, closedIndex)

        tokens.push(tokenizeBrackets(inside))

        afterClosed = afterOpened.slice(closedIndex + 1)

        openedIndex = afterClosed.indexOf("(")

        if (openedIndex != -1) {
            let betweenClosedAndOpened = afterClosed.slice(0, openedIndex)

            if (betweenClosedAndOpened != "") {
                tokens.push(...tokenizeString(
                    betweenClosedAndOpened, false
                ))
            }
        }

        afterOpened = afterClosed.slice(openedIndex)

        if (!(afterOpened.includes("("))) {
            look = false
        }
    }

    if (afterClosed != "") {
        tokens.push(...tokenizeString(
            afterClosed, false
        ))
    }



    return tokens
}

function tokenizeString(string, isFirst = true) {
    let new_string = ""
    for (let i = 0; i < string.length; i++) {
        if (string[i] != " ") { new_string += string[i] }
    }
    string = new_string

    let tokens = [string[0]]

    funcs.forEach(customFunction => {
        if (customFunction.name.includes(string[0])) {
            if (string.indexOf(customFunction.name) == 0) {
                let end = string.indexOf(customFunction.ending)
                if (end != -1) {
                    let paste = string.slice(0, end + 1)
                    tokens = [paste]
                    string = string.slice(end)
                }
            }
        }
    })

    for (let i = 1; i < string.length; i++) {
        funcs.forEach(customFunction => {
            if (customFunction.name.includes(string[i])) {
                if (string.indexOf(customFunction.name) == i) {
                    let end = string.indexOf(customFunction.ending)
                    if (end != -1) {
                        let paste = string.slice(i, end + 1)
                        tokens.push(paste)
                        i += paste.length;
                    }
                }
            }
        })
        if (i == 1) {
            if (
                ((string[0] == "-"
                    || numbers.includes(string[0]))
                    && numbers.includes(string[1])
                    && isFirst
                )
                ||
                (string[0] == "*" && string[1] == "*")
            ) {
                tokens[0] += string[i]
            } else {
                tokens.push(string[i])
            }
        } else if (i > 1) {
            penaltChar = string[i - 2]
            lastChar = string[i - 1]
            if (
                (splited.includes(penaltChar)
                    && lastChar == "-"
                    && numbers.includes(string[i]))
                || (numbers.includes(lastChar) && numbers.includes(string[i]))
            ) {
                tokens[tokens.length - 1] += string[i]
            } else if (
                penaltChar != "*" &&
                lastChar == "*" &&
                string[i] == "*"
            ) {
                tokens[tokens.length - 1] += string[i]
            } else {
                if (string[i] != undefined) {
                    tokens.push(string[i])
                }
            }
        }
    }

    return tokens
}

String.prototype.reverseIndexOf = function (searchElement, index = -1) {
    if (index == -1) { index = this.length - 1 }
    if (index >= this.length) { console.error(Error("index is greater than length of String")); return; }
    for (let i = index; i >= 0; i--) {
        if (this[i] === searchElement) {
            return i;
        }
    }
    return -1;
};

// console.log(calculate("9.780318*(1 + 0.005302*sin(51+24/60+12/3600)**2 - 0.000006*sin(2*(51+24/60+12/3600))**2) - 0.000003086*50"))
// console.log(calculate("2+2"))