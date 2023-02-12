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