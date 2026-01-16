//1
let name = "Имя";
  let surname = "Фамилия";
  let age = 20;

  console.log(`Привет, ${name} ${surname}! Тебе ${age} лет.`)
//2
let input = prompt("Введи строку:");

  if (!isNaN(input) && input !== "") {
    let number = Number(input);

    if (number % 2 === 0) {
      console.log("Чётное число");
    } else {
      console.log("Нечётное число");
    }
  } else {
    console.log("Это не число");
  }
  //3
  let userName = prompt("Введи имя:");
  let userAge = Number(prompt("Введи возраст:"));

  if (userAge < 18) {
    console.log(`Привет, ${userName}! Ты ещё школьник.`);
  } else if (userAge >= 18 && userAge <= 65) {
    console.log(`Привет, ${userName}! Ты взрослый человек, заходи.`);
  } else if (userAge > 65) {
    console.log(`Привет, ${userName}! Для возрастных лиц у нас скидки.`);
  }