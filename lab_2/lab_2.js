// ЗАДАНИЕ 1 ========================
console.log("Задание 1");

const existedUserLogin = "the_best_user";
const existedUserPassword = "12345678";

let userLogin = prompt("Введите логин");
let userPassword = prompt("Введите пароль");

userLogin = userLogin.trim();
userPassword = userPassword.trim();

if (userLogin === existedUserLogin && userPassword === existedUserPassword) {
    alert(`Добро пожаловать, ${userLogin}!`);
} else {
    alert("Логин и (или) Пароль введены неверно");
}

// ЗАДАНИЕ 2
console.log("Задание 2");

const q1 = "Сколько будет 2 + 2?";
const a1 = 4;
const q2 = "Сколько будет 2 * 2?";
const a2 = 4;
const q3 = "У Пети было 5 яблок. 3 из них он съел, 1 отдал другу. Сколько яблок у Пети осталось?";
const a3 = 1;
const q4 = "У Маши было 10 конфет. 2 она съела, 1 отдала другу. После мама дала Маше еще 5 конфет. Сколько в итоге конфет осталось у Маши?";
const a4 = 12;
const q5 = "Сколько будет 2 + 2 * 2?";
const a5 = 6;

let correctAnswers = 0;
let incorrectAnswers = 0;

let u1 = Number(prompt(q1));
if (u1 === a1) { alert("Ответ Верный"); correctAnswers++; } 
else { alert("Ответ Неверный"); incorrectAnswers++; }

let u2 = Number(prompt(q2));
if (u2 === a2) { alert("Ответ Верный"); correctAnswers++; } 
else { alert("Ответ Неверный"); incorrectAnswers++; }

let u3 = Number(prompt(q3));
if (u3 === a3) { alert("Ответ Верный"); correctAnswers++; } 
else { alert("Ответ Неверный"); incorrectAnswers++; }

let u4 = Number(prompt(q4));
if (u4 === a4) { alert("Ответ Верный"); correctAnswers++; } 
else { alert("Ответ Неверный"); incorrectAnswers++; }

let u5 = Number(prompt(q5));
if (u5 === a5) { alert("Ответ Верный"); correctAnswers++; } 
else { alert("Ответ Неверный"); incorrectAnswers++; }

alert(`Конец теста! Правильные ответы - ${correctAnswers}; Неправильные ответы - ${incorrectAnswers}.`);

// ЗАДАНИЕ 3
console.log("Задание 3");

let ans1 = confirm("JavaScript создан в 1995 году?");
if (ans1 === true) alert("Верно");
else alert("Неверно");

let ans2 = confirm("Согласно спецификации JavaScript называется ECMAScript?");
if (ans2 === true) alert("Верно");
else alert("Неверно");

let ans3 = confirm("JavaScript был создан за 1 месяц?");
if (ans3 === true) alert("Верно");
else alert("Неверно");

// ЗАДАНИЕ 4
console.log("Задание 4");

// Цикл for (оригинал)
for (let i = 0; i < 3; i++) {
    let newStudent = prompt('Введите имя нового студента!');
    if (newStudent) {
        alert(`Добро пожаловать, ${newStudent.trim()}!`);
    }
}

// Цикл while
let j = 0;
while (j < 3) {
    let newStudent = prompt('Введите имя нового студента!');
    if (newStudent) {
        alert(`Добро пожаловать, ${newStudent.trim()}!`);
    }
    j++;
}

// Цикл do while
let k = 0;
do {
    let newStudent = prompt('Введите имя нового студента!');
    if (newStudent) {
        alert(`Добро пожаловать, ${newStudent.trim()}!`);
    }
    k++;
} while (k < 3);

// ЗАДАНИЕ 5
console.log("Задание 5");

let sum = 0;
for (let i = 0; i <= 100; i++) {
    sum += i;
}
alert(`Сумма от 0 до 100 = ${sum}`); // 5050

// ЗАДАНИЕ 6
console.log("Задание 6");

const clientName = "Игорь";
let clientSpentForAllTime = 110;
const clientSpentToday = 25;
let discount = 0;

if (clientSpentForAllTime >= 100 && clientSpentForAllTime < 300) discount = 10;
else if (clientSpentForAllTime >= 300 && clientSpentForAllTime < 500) discount = 20;
else if (clientSpentForAllTime >= 500) discount = 30;

alert(`Вам предоставляется скидка в ${discount}%!`);

const discountedPrice = clientSpentToday * (1 - discount / 100);
clientSpentForAllTime += discountedPrice;

alert(`Спасибо, ${clientName}! К оплате ${discountedPrice}$. За все время в нашем ресторане вы потратили ${clientSpentForAllTime}$.`);

// ЗАДАНИЕ 7
console.log("Задание 7");

let clientName2 = prompt("Введите имя клиента");
let spentToday = prompt("Сколько клиент потратил сегодня?");
let spentAllTime = prompt("Сколько клиент потратил за все время?");

spentToday = Number(spentToday);
spentAllTime = Number(spentAllTime);

if (isNaN(spentToday) || isNaN(spentAllTime)) {
    alert("Сумма, которую клиент потратил за все время и которую потратил сегодня, должна быть числом! Перезагрузите страницу, чтобы повторить попытку");
} else {
    let discount2 = 0;
    if (spentAllTime >= 100 && spentAllTime < 300) discount2 = 10;
    else if (spentAllTime >= 300 && spentAllTime < 500) discount2 = 20;
    else if (spentAllTime >= 500) discount2 = 30;

    alert(`Вам предоставляется скидка в ${discount2}%!`);

    const discountedPrice2 = spentToday * (1 - discount2 / 100);
    spentAllTime += discountedPrice2;

    alert(`Спасибо, ${clientName2}! К оплате ${discountedPrice2}$. За все время в нашем ресторане вы потратили ${spentAllTime}$.`);
}

// ЗАДАНИЕ 8
console.log("Задание 8");

let password = prompt("Введите пароль");

let hasValidLength = password.length >= 3 && password.length <= 20;
let hasUppercase = /[A-Z]/.test(password);
let hasDigit = /[0-9]/.test(password);

if (hasValidLength && hasUppercase && hasDigit) {
    alert("Пароль валидный. Добро пожаловать в аккаунт!");
} else {
    alert("Пароль не удовлетворяет условиям! Перезагрузите страницу и попробуйте ввести его еще раз.");
}