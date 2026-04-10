// ЗАДАНИЕ 1
console.log("Задание 1");

// Function Declaration
function getName1(name) {
    return `Имя равно ${name}`;
}

// Function Expression
const getName2 = function(name) {
    return `Имя равно ${name}`;
};

// Стрелочная функция
const getName3 = (name) => {
    return `Имя равно ${name}`;
};



// Вызов функций и вывод в консоль
console.log(getName1("Анна"));
console.log(getName2("Иван"));
console.log(getName3("Мария"));

// ЗАДАНИЕ 2
console.log("Задание 2");

const getSumOfNumbers = (number, type = "odd") => {
    let sum = 0;
    
    for (let i = 0; i <= number; i++) {
        if (type === "odd" && i % 2 !== 0) {
            sum += i;
        } else if (type === "even" && i % 2 === 0) {
            sum += i;
        } else if (type === "") {
            sum += i;
        }
    }
    
    return sum;
};

// Проверка работы функции
console.log(getSumOfNumbers(10, "odd"));   // 25
console.log(getSumOfNumbers(10, "even"));  // 30
console.log(getSumOfNumbers(10, ""));      // 55
console.log(getSumOfNumbers(10));          // 25 (по умолчанию "odd")

// ЗАДАНИЕ 3
console.log("Задание 3");

const getDivisorsCount = (number = 1) => {
    // Проверка на целое число и больше нуля
    if (!Number.isInteger(number) || number <= 0) {
        alert("number должен быть целым числом и больше нуля");
        return;
    }
    
    let count = 0;
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            count++;
        }
    }
    
    return count;
};

// Проверка работы функции
console.log(getDivisorsCount(4));   // 3 (делители: 1, 2, 4)
console.log(getDivisorsCount(5));   // 2 (делители: 1, 5)
console.log(getDivisorsCount(12));  // 6 (делители: 1, 2, 3, 4, 6, 12)
console.log(getDivisorsCount(3.5)); // alert + undefined
console.log(getDivisorsCount(-5));  // alert + undefined

// ЗАДАНИЕ 4
console.log("Задание 4");

const checkQuestionAnswer = (question, correctAnswer) => {
    // Получаем ответ пользователя и убираем лишние пробелы
    let userAnswer = prompt(question);
    userAnswer = userAnswer.trim();
    
    // Приводим к нижнему регистру для сравнения без учета регистра
    const normalizedUserAnswer = userAnswer.toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase();
    
    // Сравниваем
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        alert("Ответ верный");
    } else {
        alert("Ответ неверный");
    }
};

// Проверка работы функции
checkQuestionAnswer("Арбуз это фрукт или ягода?", "Ягода");
checkQuestionAnswer("Сколько в среднем зубов у взрослого человека?", "32");
checkQuestionAnswer("Как называется самая маленькая птица в мире?", "Колибри");

// ЗАДАНИЕ 5 
console.log("Задание 5");

// Колбэк для успешного сообщения
const showSuccessMessage = (message) => {
    console.log(message);
};

// Колбэк для сообщения об ошибке
const showErrorMessage = (message) => {
    console.error(message);
};

// Основная функция для проверки текста на запрещенный символ
const checkTextOnErrorSymbol = (text, errorSymbol, successCallback, errorCallback) => {
    let hasError = false;
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === errorSymbol) {
            hasError = true;
            errorCallback(`Найден запрещенный символ "${errorSymbol}" под индексом ${i}.`);
        }
    }
    
    if (!hasError) {
        successCallback("В данном тексте нет запрещенных символов");
    }
};

// Проверка работы функции
const text = "Привет! Как дела! Давно мы с тобой не виделись.";
checkTextOnErrorSymbol(text, "а", showSuccessMessage, showErrorMessage);
checkTextOnErrorSymbol(text, "!", showSuccessMessage, showErrorMessage);
checkTextOnErrorSymbol(text, "x", showSuccessMessage, showErrorMessage);