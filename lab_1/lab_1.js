// ЗАДАНИЕ 1
const myName = 'Алексей';
const programmingLanguage = 'JavaScript';
const courseCreatorName = 'Чтотиб';
const reasonText = 'мне нравиться писать сайтики';
const numberOfMonth = 4;

const myInfoText = `Всем привет! Меня зовут ${myName}. Сейчас я изучаю язык программирования ${programmingLanguage} на курсе по ${programmingLanguage} у ${courseCreatorName}.

Я хочу стать веб-разработчиком, потому что ${reasonText}. До этого я изучал(а) ${programmingLanguage} ${numberOfMonth} месяцев. Я уверен(а), что пройду данный курс до конца!`;

console.log("Задание 1");
console.log(myInfoText);

// ЗАДАНИЕ 2
let myInfoText2 = myInfoText;

myInfoText2 = myInfoText2.replaceAll('JavaScript', 'JAVASCRIPT');

console.log("\nЗадание 2");
console.log(myInfoText2);

console.log("Длина строки:", myInfoText2.length);

console.log("Первый символ:", myInfoText2[0]);
console.log("Последний символ:", myInfoText2[myInfoText2.length - 1]);

// ЗАДАНИЕ 3
console.log("\nЗадание 3");
let userName = prompt('Как вас зовут?');

if (userName) {
  userName = userName.trim().toLowerCase();
  alert(`Вас зовут ${userName}`);
} else {
  alert("Вы не ввели имя");
}

// ЗАДАНИЕ 4
console.log("\nЗадание 4");
let userName2 = prompt('Как вас зовут?');
let userAge = prompt('Сколько вам лет?');

if (userName2 && userAge) {
  userName2 = userName2.trim();
  userAge = userAge.trim();
  
  const userAgeNumber = Number(userAge);
  
  if (!isNaN(userAgeNumber)) {
    alert(`Вас зовут ${userName2} и вам ${userAgeNumber} лет`);
  } else {
    alert("Возраст должен быть числом");
  }
} else {
  alert("Вы не ввели все данные");
}

// ЗАДАНИЕ 5
console.log("\nЗадание 5");
let userString = prompt('Введите текст для обрезки');
let startSliceIndex = prompt('Введите индекс, с которого нужно начать обрезку строки');
let endSliceIndex = prompt('Введите индекс, которым нужно закончить обрезку строки');

if (userString && startSliceIndex && endSliceIndex) {
  userString = userString.trim();
  
  const startIndex = Number(startSliceIndex);
  const endIndex = Number(endSliceIndex);
  
  if (!isNaN(startIndex) && !isNaN(endIndex)) {
    if (startIndex >= 0 && endIndex <= userString.length && startIndex <= endIndex) {
      const result = userString.slice(startIndex, endIndex);
      alert(`Результат: ${result}`);
    } else {
      alert("Некорректные индексы для обрезки");
    }
  } else {
    alert("Индексы должны быть числами");
  }
} else {
  alert("Вы не ввели все данные");
}

// ЗАДАНИЕ 6
console.log("\nЗадание 6");
let userText = prompt('Введите текст');
let wordFromText = prompt('Введите слово из текста');

if (userText && wordFromText) {
  userText = userText.trim();
  wordFromText = wordFromText.trim();
  
  const indexOfWord = userText.indexOf(wordFromText);
  
  if (indexOfWord !== -1) {
    const result = userText.slice(0, indexOfWord);
    alert(`Результат: ${result}`);
  } else {
    alert("Слово не найдено в тексте");
  }
} else {
  alert("Вы не ввели все данные");
}

// ЗАДАНИЕ 7
console.log("\nЗадание 7");
const javaScriptDescription = "JavaScript — мультипарадигменный язык программирования. Поддерживает объектно-ориентированный, императивный и функциональный стили. Является реализацией спецификации ECMAScript. JavaScript обычно используется как встраиваемый язык для программного доступа к объектам приложений.";

const middleIndex = Math.floor(javaScriptDescription.length / 2);
let halfString = javaScriptDescription.slice(0, middleIndex);

halfString = halfString.replaceAll('а', 'А');

halfString = halfString.replaceAll(' ', '');

const tripledString = halfString.repeat(3);

const middleOfTripled = Math.floor(tripledString.length / 2);
console.log("Средний символ итоговой строки:", tripledString[middleOfTripled]);

console.log("Итоговая строка:", tripledString);