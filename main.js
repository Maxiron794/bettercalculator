entered = "";
last = "";
const num_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
const b_array = ["(", ")", "[", "]"]
const oper_array = ["/", "*", "+", "-"]



const functions = ["KeyR", "KeyP", "KeyS", "KeyC"]

const solv_keys = ["Enter", "Equal", "NumpadEnter"]
const to_enter = [...num_array, ...b_array, ...oper_array]

const last_element = document.getElementById("last")
const shake_element = document.getElementById("output")
const window_element = document.getElementById("window")



//key events
document.addEventListener("keypress", function (event) {
    let key = event.key
    let code = event.code

    console.log(event.code)

    if (to_enter.includes(key)) {
        add_text(key)
    } else if (solv_keys.includes(code)) {
        solv()
    } else if (oper_array.includes(key)) {
        add_op(key)
    } else if (code == "KeyQ") {
        clear_CA()
    } else if (code == "KeyE") {
        clear_C()
    } else if (key == "(") {
        add_loop()
    } else if (key == ")") {
        dec_loop()
    }
});

function add_text(text) {
    entered += text

    draw()
}

function clear() {
    num = ""
    numpr = ['']
    operpr = []
    output = ""
    loop = 0
    draw()
}

function clear_CA() {

    clear()
}



//draws top part
function draw_last() {
    let last_el = document.getElementById("last")
    if (last != last_el.innerHTML) {
        if (last_el.innerHTML != "") {
            last_animation()
        }
        last_el.innerHTML = last

    }
}

//draws black-colored part
function draw() {
    document.getElementById("window").innerHTML = entered
}

function add_b(text) {
    output += text
    draw()
}

function add_op(op) {
    if (
        (lastOf(operpr) == "/" && lastOf(num) == 0) ||
        (lastOf(operpr) == "-" && op == "-") ||
        (num == "-" && op == "-")
    ) {
        shake()
        return
    } else if (lastOf(numpr).toString() == "" && lastOf(operpr) != "-" && op == "-") {
        console.log("add!")
        output += "-"
        num = "-"
    } else if (lastOf(numpr).toString() != "") {
        add_data("", numpr, loop)
        output += " " + op + " "
        console.log(op, operpr, loop)
        add_data(op, operpr, loop)
        num = ""
    } else if (lastOf(numpr).toString == "" && num != "-" && lastOf(operpr) != op && lastOf(operpr) != undefined) {
        output = output.substr(0, output.length - 2)
        output += op + " "
        change_data(op, operpr, loop)
    } else {
        shake()
        return
    }
    draw()
}

function calculate(input) {
    return mainCalculator(createList(input))
}

function mainCalculator(list) {
    let expression = ""
    for (let i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) {
            expression += "" + mainCalculator(list[i])
        }else{
            expression += list[i]
        }
    }
    return calculateInOneBracket(expression)
}

function calculateInOneBracket(input) {
    while (true) {
        index = Math.min(...(deleteMinusOne(
            input.indexOf("root"),
            input.indexOf("sin"),
            input.indexOf("cos")
        )))

        if (index == Infinity) {
            break;
        }

        input = prepareForSolve(input, index)


    }
    while (true) {
        let index = input.indexOf("**");

        if (index == -1) {
            break;
        }

        input = prepareForSolve(input, index)
    }
    while (true) {
        index = Math.min(...(deleteMinusOne(
            input.indexOf("*"),
            input.indexOf("/")
        )))

        if (index == Infinity) {
            break;
        }

        input = prepareForSolve(input, index)
    }
    while (true) {
        index = Math.min(...(deleteMinusOne(
            input.indexOf("+"),
            input.indexOf("-")
        )))

        if (index == Infinity) {
            break;
        }

        input = prepareForSolve(input, index)
    }

    return input
}

function prepareForSolve(answer, index) {
    let paste = betweenTwoOperands(answer, index)

    let start = answer.indexOf(paste)

    let firstPart = start == 0 ? "" : answer.slice(0, start)
    let endPart = answer.slice(start + paste.length)

    paste = solve(paste)



    answer = firstPart + paste + endPart

    return answer
}


function getInside(rightPart, openedIndex, find) {
    let closedIndex = getClosedBracket(rightPart, find)

    if (closedIndex == -1) {
        console.error(Error("Bracket " + openedIndex + " is not closed!"));
        return;
    }

    return rightPart.substr(1, closedIndex - 1)

}

//solves expresions
function solve(input) {
    if (input.includes("root")) {
        let param = input.slice(input.indexOf("[") + 1, input.indexOf("]"));

        let number = input.slice(input.indexOf("]") + 1);

        if (param.length == 0 || number.length == 0) {
            shake()
        } else { return number ** (1 / param) }
    } else if (input.includes("sin")) {
        let number = input.slice(3)

        if (number.length == 0) {
            shake()
        } else {
            return Math.sin(number * Math.PI / 180);
        }
    } else if (input.includes("cos")) {
        let number = input.slice(3)

        if (number.length == 0) {
            shake()
        } else {
            return Math.cos(number * Math.PI / 180);
        }
    }
    else if (input.includes("**")) {
        let index = input.indexOf("**")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 2)
        if (firstNumber.length == 0 || secondNumber.length == 0) {
            shake()
        } else { return firstNumber ** secondNumber }
    } else if (input.includes("*")) {
        let index = input.indexOf("*")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (firstNumber.length == 0 || secondNumber.length == 0) {
            shake()
        } else { return firstNumber * secondNumber }
    }
    else if (input.includes("/")) {
        let index = input.indexOf("/")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if ((firstNumber.length == 0 || secondNumber.length == 0) || secondNumber == "0") {
            shake()
        } else { return firstNumber / secondNumber }
    } else if (input.includes("+")) {
        let index = input.indexOf("+")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (firstNumber.length == 0 || secondNumber.length == 0) {
            shake()
        } else { return (firstNumber - 0) + (secondNumber - 0) }
    } else if (input.includes("-")) {
        let index = input.indexOf("-")
        let firstNumber = input.slice(0, index)
        let secondNumber = input.slice(index + 1)
        if (firstNumber.length == 0 || secondNumber.length == 0) {
            shake()
        } else { return firstNumber - secondNumber }
    }

    if (input.length != 0) {
        return input;
    }

    shake()
}

// animations 
shake_element.addEventListener("animationend", function () {
    shake_element.classList.remove("shake")
})

function shake() {
    shake_element.classList.add("shake")
}

last_element.addEventListener('animationend', () => {
    last_element.classList.remove("slide-up")
    window_element.classList.add("fade-out")
});

function last_animation() {
    last_element.classList.add("slide-up")
    window_element.classList.remove("fade-out")
}
//

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

function createList(input) {
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

        list.push(createList(inside))

        if (closedIndex == rightPart.length - 1) {
            look = 0;
        } else {
            let openRightIndex = rightPart.indexOf("(", closedIndex + 1);
            if(openRightIndex == -1){
                list.push(rightPart.slice(closedIndex + 1))
                look = 0
            }else{
                list.push(rightPart.slice(inside.length + 2, openRightIndex))
                rightPart = rightPart.slice(openRightIndex)
            }
            
        }
    }

    return list;

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
    if (index >= index.length) { return Error("index is greater than length of String") }
    for (let i = index; i >= 0; i--) {
        if (this[i] === searchElement) {
            return i;
        }
    }
    return -1;
};