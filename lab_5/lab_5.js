// ЗАДАНИЕ 1
console.log("Задание 1: Онлайн пользователи");

const users = [
    {
        username: 'David',
        status: 'online',
        lastActivity: 10
    },
    {
        username: 'Lucy',
        status: 'offline',
        lastActivity: 22
    },
    {
        username: 'Bob',
        status: 'online',
        lastActivity: 104
    }
];

// Создаём массив только с онлайн пользователями
const onlineUsers = users.filter(user => user.status === 'online');

// Формируем строку с именами через запятую
const usersOnlineNames = onlineUsers.map(user => user.username).join(', ');

alert(`Сейчас в онлайн следующие пользователи: ${usersOnlineNames}`);
console.log("Онлайн пользователи:", onlineUsers);

// ЗАДАНИЕ 2
console.log("\nЗадание 2: Очередь пациентов");

const giveTalonsInOrder = (patients, orders) => {
    // Создаём объект для быстрого доступа к пациенту по id
    const patientsMap = {};
    for (const patient of patients) {
        patientsMap[patient.id] = patient;
    }
    
    // Формируем новый массив в порядке из orders
    const result = [];
    for (const id of orders) {
        if (patientsMap[id]) {
            result.push(patientsMap[id]);
        }
    }
    return result;
};

// Проверка работы
const ordersArr = [4, 2, 1, 3];
const people = [
    { id: 1, name: "Максим" },
    { id: 2, name: "Николай" },
    { id: 3, name: "Ангелина" },
    { id: 4, name: "Виталий" },
];

const sortedQueue = giveTalonsInOrder(people, ordersArr);
console.log("Отсортированная очередь:", sortedQueue);
/* Результат:
[
    { id: 4, name: 'Виталий' },
    { id: 2, name: 'Николай' },
    { id: 1, name: 'Максим' },
    { id: 3, name: 'Ангелина' }
]
*/

// ЗАДАНИЕ 3
console.log("\nЗадание 3: Работа с объектом");

const handleObject = (obj, key, action) => {
    if (action === 'get') {
        return obj[key];
    } else if (action === 'add') {
        obj[key] = "";
        return obj;
    } else if (action === 'delete') {
        delete obj[key];
        return obj;
    } else {
        return obj;
    }
};

// Проверка работы
const student = {
    name: 'Maxim',
    programmingLanguage: 'JavaScript',
};

const result1 = handleObject(student, 'programmingLanguage', 'delete');
console.log('После удаления programmingLanguage:', result1);

const result2 = handleObject(student, 'newProperty', 'add');
console.log('После добавления newProperty:', result2);

const result3 = handleObject(student, 'name', 'get');
console.log('Получение значения name:', result3);

// ЗАДАНИЕ 4
console.log("\n=== Задание 4: Новая работа студента ===");

const giveJobToStudent = (student, jobName) => {
    // Создаём новый объект, копируя все свойства старого, и добавляем job
    const updatedStudent = {
        ...student,
        job: jobName
    };
    
    alert(`Поздравляем! У студента ${updatedStudent.fullName} появилась новая работа! Теперь он ${jobName}`);
    
    return updatedStudent;
};

// Проверка работы
const studentObj = {
    fullName: 'Максим',
    experienceInMonths: 12,
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
};

const updatedStudent = giveJobToStudent(studentObj, 'веб-разработчик');
console.log('Обновлённый студент:', updatedStudent);

// ЗАДАНИЕ 5
console.log("\nЗадание 5: Корзина интернет-магазина");

const groceries = {
    "Orange Juice": {
        price: 1.5,
        discount: 10, // в процентах
    },
    "Chocolate": {
        price: 2,
        discount: 0,
    },
    "Apple": {
        price: 0.8,
        discount: 5,
    },
};

const getTotalPriceOfShoppingBag = (shoppingBag) => {
    let total = 0;
    
    for (const item of shoppingBag) {
        const product = groceries[item.product];
        if (product) {
            // Цена со скидкой
            const discountedPrice = product.price * (1 - product.discount / 100);
            total += discountedPrice * item.quantity;
        }
    }
    
    // Округляем до сотых и преобразуем обратно в число
    return Number(total.toFixed(2));
};

// Проверка работы
const shoppingBag = [
    { product: 'Chocolate', quantity: 3 },
    { product: 'Orange Juice', quantity: 23 },
    { product: 'Apple', quantity: 10 },
];

const totalPrice = getTotalPriceOfShoppingBag(shoppingBag);
console.log('Общая стоимость корзины:', totalPrice); // 1.5*0.9*23 + 2*3 + 0.8*0.95*10 = 31.05 + 6 + 7.6 = 44.65

// ЗАДАНИЕ 6
console.log("\nЗадание 6: Игра герой против врага");

const getRandomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const startGame = (heroPlayer, enemyPlayer) => {
    // Пока оба живы
    while (heroPlayer.health > 0 && enemyPlayer.health > 0) {
        const randomHit = getRandomNumberInRange(0, 1);
        
        if (randomHit === 0) {
            // Герой бьёт врага
            heroPlayer.heatEnemy(enemyPlayer);
            console.log(`${heroPlayer.name} атакует! У ${enemyPlayer.name} осталось ${enemyPlayer.health} здоровья`);
        } else {
            // Враг бьёт героя
            enemyPlayer.heatHero(heroPlayer);
            console.log(`${enemyPlayer.name} атакует! У ${heroPlayer.name} осталось ${heroPlayer.health} здоровья`);
        }
    }
    
    // Определяем победителя
    if (heroPlayer.health <= 0) {
        alert(`${enemyPlayer.name} победил! У него осталось ${enemyPlayer.health} здоровья`);
        console.log(`Победитель: ${enemyPlayer.name}`);
    } else {
        alert(`${heroPlayer.name} победил! У него осталось ${heroPlayer.health} здоровья`);
        console.log(`Победитель: ${heroPlayer.name}`);
    }
};

// Создаём игроков с методами
const hero = {
    name: 'Batman',
    health: 100,
    heatEnemy: function(enemy) {
        enemy.health -= 10;
    }
};

const enemy = {
    name: 'Joker',
    health: 100,
    heatHero: function(hero) {
        hero.health -= 10;
    }
};

// Запускаем игру (раскомментируйте, чтобы поиграть)
// startGame(hero, enemy);

// ЗАДАНИЕ 7
console.log("\nЗадание 7: Поиск убийцы");

const getKiller = (suspectInfo, deadPeople) => {
    for (const [suspect, seenPeople] of Object.entries(suspectInfo)) {
        // Проверяем, видел ли подозреваемый всех убитых
        const hasSeenAllDead = deadPeople.every(dead => seenPeople.includes(dead));
        if (hasSeenAllDead) {
            return suspect;
        }
    }
    return null;
};

// Проверка работы
const killer1 = getKiller(
    {
        'James': ['Jacob', 'Bill', 'Lucas'],
        'Johnny': ['David', 'Kyle', 'Lucas'],
        'Peter': ['Lucy', 'Kyle'],
    },
    ['Lucas', 'Bill']
);
console.log('Убийца 1:', killer1); // James

const killer2 = getKiller(
    {
        'Brad': [],
        'Megan': ['Ben', 'Kevin'],
        'Finn': ['Ben'],
    },
    ['Ben']
);
console.log('Убийца 2:', killer2); // Megan

// ЗАДАНИЕ 8
console.log("\nЗадание 8: Лотерея");

const getRandomNumberInRangeForLottery = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const getWinner = (applicants, winnerObject) => {
    // Получаем все ключи (номерки)
    const tickets = Object.keys(applicants);
    
    // Выбираем случайный номерок
    const randomIndex = getRandomNumberInRangeForLottery(0, tickets.length);
    const winningTicket = tickets[randomIndex];
    
    // Получаем победителя
    const winner = applicants[winningTicket];
    
    // Возвращаем объединённый объект
    return {
        ...winnerObject,
        ...winner
    };
};

// Проверка работы
const todaysWinner = {
    prize: '10 000$',
};

const winnerApplicants = {
    '001': { name: 'Максим', age: 25 },
    '201': { name: 'Светлана', age: 20 },
    '304': { name: 'Екатерина', age: 35 },
};

const resultWinner = getWinner(winnerApplicants, todaysWinner);
console.log('Победитель лотереи:', resultWinner);
// Пример: { prize: '10 000$', name: 'Максим', age: 25 }