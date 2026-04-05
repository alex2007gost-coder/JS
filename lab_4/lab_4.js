// ЗАДАНИЕ 1
console.log("Задание 1: Очередь на почте");

const peopleWaiting = ['Кристина', 'Олег', 'Кирилл', 'Мария', 'Светлана', 'Артем', 'Глеб'];

// Функция выдачи посылки (удаление первого элемента)
const giveParcel = () => {
    const person = peopleWaiting.shift(); // удаляем первого из очереди
    alert(`${person} получил(а) посылку. В очереди осталось ${peopleWaiting.length} человек.`);
};

// Функция удаления из очереди без посылки (удаление последнего элемента)
const leaveQueueWithoutParcel = () => {
    const person = peopleWaiting.pop(); // удаляем последнего из очереди
    alert(`${person} не получил(а) посылку и ушел(ла) из очереди.`);
};

// Шаг 1: Кристина и Олег получили посылки
giveParcel(); // Кристина
giveParcel(); // Олег

// Шаг 2: Кирилл получает посылку
giveParcel(); // Кирилл

// Удаляем всех оставшихся без посылки (с конца очереди)
while (peopleWaiting.length > 0) {
    leaveQueueWithoutParcel();
}

console.log("Финальный массив очереди:", peopleWaiting);

// ЗАДАНИЕ 2
console.log("\nЗадание 2: Сумма первого и последнего");

const getSumOfSequence = (number) => {
    const arr = [];
    for (let i = 1; i <= number; i++) {
        arr.push(i);
    }
    return arr[0] + arr[arr.length - 1];
};

console.log(getSumOfSequence(5)); // 6 (1 + 5)
console.log(getSumOfSequence(10)); // 11 (1 + 10)
console.log(getSumOfSequence(1)); // 2 (1 + 1)

// ЗАДАНИЕ 3
console.log("\nЗадание 3: Поиск кофе");

const coffees = ['Latte', 'Cappuccino', 'Americano'];

const findCoffee = (searchQuery) => {
    // Приводим поисковый запрос к нижнему регистру
    const lowerQuery = searchQuery.toLowerCase();
    
    // Ищем индекс кофе, название которого совпадает с запросом (без учёта регистра)
    const index = coffees.findIndex(coffee => coffee.toLowerCase() === lowerQuery);
    
    if (index !== -1) {
        alert(`Да, у нас есть такой кофе. Он в списке под номером ${index + 1}`);
    } else {
        alert("К сожалению, такого кофе нет в нашем ассортименте.");
    }
};

// Проверка работы
findCoffee("latte");     // Да, у нас есть такой кофе. Он в списке под номером 1
findCoffee("CAPPUCCINO"); // Да, у нас есть такой кофе. Он в списке под номером 2
findCoffee("Espresso");   // К сожалению, такого кофе нет в нашем ассортименте.

// ЗАДАНИЕ 4
console.log("\nЗадание 4: Поднятие цен");

const coffeeNames = ['Latte', 'Cappuccino', 'Americano'];
const oldPrices = [1.5, 1, 2];

// Создаём новый массив с ценами, увеличенными на 0.5
const updatedPrices = oldPrices.map(price => price + 0.5);

// Выводим сообщения для клиентов
coffeeNames.forEach((coffee, index) => {
    alert(`Кофе ${coffee} сейчас стоит ${updatedPrices[index]} евро`);
});

console.log("Старые цены:", oldPrices);
console.log("Новые цены:", updatedPrices);

// ЗАДАНИЕ 5
console.log("\nЗадание 5: Оценки кофейни");

const clientsEstimations = [];

const askClientToGiveEstimation = () => {
    const userInput = prompt("Как вы оцениваете нашу кофейню от 1 до 10?");
    const estimation = Number(userInput);
    
    if (estimation >= 1 && estimation <= 10) {
        clientsEstimations.push(estimation);
    }
};

// Вызываем функцию 5 раз через цикл
for (let i = 0; i < 5; i++) {
    askClientToGiveEstimation();
}

// Подсчитываем положительные (>5) и отрицательные (≤5) оценки
const goodEstimations = clientsEstimations.filter(est => est > 5).length;
const notGoodEstimations = clientsEstimations.filter(est => est <= 5).length;

alert(`Всего положительных оценок: ${goodEstimations}; Всего отрицательных оценок: ${notGoodEstimations}`);

console.log("Все оценки:", clientsEstimations);
console.log(`Положительных: ${goodEstimations}, Отрицательных: ${notGoodEstimations}`);