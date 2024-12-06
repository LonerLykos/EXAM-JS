//виводимо усі глобальні змінні та константи
let pairs = JSON.parse(localStorage.getItem('pairs')) || [];
let selectedItems = [];
const addPair = document.getElementById('addPair');
const pairsList = document.getElementById('pairsList');
const deleteAll = document.getElementById('deleteAll');
const errorWindow = document.getElementById('errorWindow');
const errorMsg = document.getElementById('errorMsg');
const sortByName = document.getElementById('sortByName');
const sortByValue = document.getElementById('sortByValue');
const deleteSelected = document.getElementById('deleteSelected');

//СТВОРЕНІ ДОПОМІЖНІ ФУНКЦІЇ ПЕРЕМІЩУЄМО ДЛЯ ЗРУЧНОСТІ

//функція для виведення і приховування помилок які виникають під час створення пари
//приймаючи заготовлений текст додаємо його до параграфу на сторінці і виводимо на екран користувача
function forError(text) {
    errorMsg.textContent = '';
    errorMsg.textContent = text;

    //за допомоги класу робимо так щоб помилка з'являлась
    errorWindow.classList.toggle('view');

    //асинхроно відключаємо клас щоб приховати нашу помилку через певний час
    setTimeout(() => {
        errorWindow.classList.toggle('view');
    }, 5000);

}

//функція для сортування пар залежно від виклику кнопки
// приймає параметром індекс що відповідає за ім'я чи значення для пар масиву
function sortButton(index) {

    //порівняємо значення з урахуванням української локалі враховуючи числа як числа
    pairs.sort((a, b) => a[index].localeCompare(b[index], 'uk-UA', {numeric: true}));

    //перезапишимо в локальному сховищі масив на сортований для уникнення проблем з репрезинтацією
    localStorage.setItem('pairs', JSON.stringify(pairs));

    //очистимо масив обраних для запобігання накопичення дубльованої інформації
    selectedItems = [];

    //побудуємо нову стрктуру пар на підставі сортованого масиву
    updateDOM()
}

//функція для оновлення/побудови DOM-структури пар з використанням методу масивів forEach
function updateDOM (){
    pairsList.textContent = '';
    pairs.forEach((pair) => {
        const p = document.createElement('p');
        p.classList.add('pair');
        p.textContent = `${pair[0]}=${pair[1]}`;
        pairsList.appendChild(p);
    })
}

//якщо в локальному сховищі вже були збережені пари, то відновлюємо їх на екрані користувача
if (pairs.length > 0) {
    updateDOM();
}

//створюємо механізм додавання пар через подію на кнопці "Додати"
addPair.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('nameValuePair');

    //починаємо перевірки
    // перевірка на наявність '=' в полі інпут
    if (input.value.includes('=')) {

        // вводимо дві змінні для перевірки на наявність більше ніж одного '='
        let index = input.value.indexOf('=');
        let indexlast = input.value.lastIndexOf('=');
        if (index === indexlast) {

            //якщо '=' одне то розподіляємо введене в інпуті на Name і Value прибравши зайві пробіли для кожного
            let arrPair = input.value.split('=');
            let name = arrPair[0].trim();
            let value = arrPair[1].trim();

            //проведемо перевірку на незаповнення Name або Value
            if (!name || !value) {

                //якщо Name або Value пусті - формуємо помилку
                let text = `Ім'я і значення не можуть бути пустими`;
                forError(text);
                input.value = '';
            } else {

                //коли всі перевірки пройшли і Name і Value не є пустими
                //починаємо перевірку на відповідність дозволених символів
                //використовуємо метод match і регулярний вираз для перевірки Name і Value
                const regex = /^(([a-zA-Z0-9а-яА-ЯїЇєЄіІґҐ]+)*\s?)+$/;
                const match1 = name.match(regex);
                const match2 = value.match(regex);
                if (match1 && match2) {

                    //якщо перевірка задовільна додаємо до нашого масиву pairs підмасив
                    //записуємо дані до локального сховища
                    //будуємо DOM-структуру з новими парами
                    pairs.push([name, value]);
                    localStorage.setItem('pairs', JSON.stringify(pairs));
                    input.value = '';
                    updateDOM()
                } else {
                    //якщо в Name та Value містять недопустимі символи - формуємо помилку
                    let text = `Не використовуйте символи крім '=' та пробілу`;
                    forError(text);
                    input.value = '';
                }
            }

        } else {

            //якщо в інпут було введено більше ніж одне '=' - формуємо помилку
            let text = `Не використовуйте '=' більше ніж одне на пару`;
            forError(text);
            input.value = '';
        }

    } else {

        //якщо користувач не ввів '=' - формуємо помилку
        let text = `Використовуйте '=' для визначення пари`;
        forError(text);
        input.value = '';
    }
});

//формуємо подію сортування при натисканні на кнопку sortByName
sortByName.addEventListener('click', (e) => {
    e.preventDefault();
    sortButton(0);
});

//формуємо подію сортування при натисканні на кнопку sortByValue
sortByValue.addEventListener('click', (e) => {
    e.preventDefault();
    sortButton(1);
});

//створюємо подію для div з id='pairsList' для опрацювання виділинех елементів для подальшого видалення
pairsList.addEventListener('click', (event) => {
    //для запобігання видалення обгортки додаємо умову, що обраними можуть бути лише елементи з класом pair
    if (event.target.classList.contains('pair')) {
        let targetItem = event.target;

        //для видалення інформації з масиву яка відповідає виділеному елементу виводимо index
        //index це фактичний індекс виділеного елемента в масиві елементів сторінки
        //використавши метод Array.from конвертуємо HTMLColection з pairsList.children у масив
        //з подальшим використанням методу indexOf для отримання індексу виділеного елементу
        let index = Array.from(pairsList.children).indexOf(targetItem);

        //за допомоги додавання класу позначаємо на нашій сторінці обраний елемент
        //використовуємо toggle для встановлення/видалення класу у відповідності до кількості кліків
        targetItem.classList.toggle('selected');

        //створюємо додаткову умову для можливості знімати мітку з раніше виділеного елементу
        //цей функціонал забезпечує кращу роботу для користувача надаючи можливість відмінити виділення у разі помилкового обиранння
        if (targetItem.classList.contains('selected')) {

            //якщо елемент містить клас selected додаємо його як об'єкт в масив selectedItems
            //для кожного виділеного об'єкту формуємо id, що відповідає фактичному індексу
            //та name, який відповідає самому елементу
            selectedItems.push({id: index, name: targetItem});
        } else {

            //якщо раніше виділений елемент було виключено з виділення
            //і відповідно клас selected було видалено для цього елементу
            //фільтруємо наш масив виключивши відповідний елемент з нього
            //встановлюємо поточне значення масиву на значення фільтрованого
            selectedItems = selectedItems.filter(item => item.name !== targetItem);
        }
    }
});

//створимо подію для видалення виділених елементів для кнопки deleteSelected
deleteSelected.addEventListener('click', (e) => {
    e.preventDefault();

    //сортуємо масив виділених елементів для запобігання неправильного видалення елементів
    //для видалення елементів з масиву pairs використовуємо метод forEach для сортованого масиву
    selectedItems.sort((a, b) => b.id - a.id).forEach(element => {

        //за допомогою методу splice видаляємо почергово кожен підмасив id якого відповідає
        //id поточного елементу в процесі ітерації
        pairs.splice(element.id, 1);

        //видаляємо поточний елемент з div який виконує роль списку пар
        element.name.remove();

        //оновлюємо дані в локальному сховищі
        localStorage.setItem('pairs', JSON.stringify(pairs));
    });

    //після видалення всіх елементів встановлюємо поточне значення масиву обраних як пустий масив
    selectedItems = [];
});

//ДОДАТКОВИЙ ФУНКЦІОНАЛ
//у випадку, якщо користувач додав забагато пар, і в поточний момент часу хоче використати програму повторно
//для полегшення очищення вже існуючих пар додано кнопку deleteAll
//при виконанні онулює всі значення в масивах pairs та selectedItems, оновлює інформацію в локальному сховищі на пустий масив
// і очищує div в якому були виведені всі збережені пари
deleteAll.addEventListener('click', (e) => {
    e.preventDefault();
    pairs = [];
    localStorage.setItem('pairs', JSON.stringify(pairs));
    pairsList.textContent = '';
    selectedItems = [];
})
