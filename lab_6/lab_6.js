// ЗАДАНИЕ 1
console.log("Задание 1: Форматирование даты");

const addZero = (numberStr) => String(numberStr).length === 1 ? `0${numberStr}` : String(numberStr);

const getDateFormat = (date, separator = '.') => {
    const dateItem = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const dateArray = [dateItem, month + 1, year].map(item => addZero(item));
    return dateArray.join(separator);
};

console.log("Сегодня:", getDateFormat(new Date()));
console.log("25 декабря 2025 (через '-'):", getDateFormat(new Date(2025, 11, 25), '-'));

// ЗАДАНИЕ 2
console.log("\nЗадание 2: Дни до дня рождения");

const convertMsToDays = (ms) => Math.round(ms / 1000 / 60 / 60 / 24);

const getDaysBeforeBirthday = (nextBirthdayDate) => {
    const today = new Date();
    const diffMs = nextBirthdayDate - today;
    return convertMsToDays(diffMs);
};

// Пример: ближайший день рождения 15 июня 2026 года
const nextBirthday = new Date(2026, 5, 15);
const daysLeft = getDaysBeforeBirthday(nextBirthday);
console.log(`До дня рождения осталось ${daysLeft} дней`);

// ЗАДАНИЕ 3
console.log("\nЗадание 3: Визы");

const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
};

const allowVisa = (people) => {
    const today = new Date();
    
    return people.filter(person => {
        const passportExpirationDate = parseDate(person.passportExpiration);
        return person.criminalRecord === false && passportExpirationDate > today;
    });
};

const peopleWithVisa = [
    { firstName: 'Stasia', lastName: 'Ward', criminalRecord: true, passportExpiration: '19.06.2023' },
    { firstName: 'Elliot', lastName: 'Baker', criminalRecord: false, passportExpiration: '04.06.2021' },
    { firstName: 'Leighann', lastName: 'Scott', criminalRecord: true, passportExpiration: '31.07.2022' },
    { firstName: 'Nick', lastName: 'Pop', criminalRecord: false, passportExpiration: '31.12.2021' },
];

const visaResult = allowVisa(peopleWithVisa);
console.log('Люди, которым можно выдать визу:', visaResult);