let pairs = [];
let selectedItems = [];
let addPair = document.getElementById('addPair');
let pairsList = document.getElementById('pairs-list');
addPair.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('nameValuePair');
    let trim = input.value.trim();
    if (trim.includes('=')) {
        let arrPair = trim.split('=');
        let name = arrPair[0].trim();
        let value = arrPair[1].trim();
        const match1 = name.match(/([a-zA-Z0-9а-яА-ЯїЇєЄіІґҐ]+)*\s?/g);
        const match2 = value.match(/([a-zA-Z0-9а-яА-ЯїЇєЄіІґҐ]+)*\s?/g);
        if (match1 && match2) {
            pairs.push([name, value]);
            input.value = '';
            const p = document.createElement('p');
            p.classList.add('pair');
            p.textContent = `${name}=${value}`;
            pairsList.appendChild(p);
        } else {
            alert(`Невірний формат. Будь ласка, використовуйте формат Ім'я=Значення.`);
        }
    } else {
        alert(`Використовуйте '=' для визначення пари Ім'я=Значення`);
        input.value = '';
    }
    console.log(pairs);

});

const sortByName = document.getElementById('sortByName');
sortByName.addEventListener('click', (e) => {
    e.preventDefault();
    pairsList.textContent = '';
    let sortName = pairs.sort((a, b) => a[0].localeCompare(b[0]));
    sortName.forEach((element) => {
        const p = document.createElement('p');
        p.classList.add('pair');
        p.textContent = `${element[0]}=${element[1]}`;
        pairsList.appendChild(p);
        selectedItems=[];
    });
});

const sortByValue = document.getElementById('sortByValue');
sortByValue.addEventListener('click', (e) => {
    e.preventDefault();
    pairsList.textContent = '';
    let sortValue = pairs.sort((a, b) => a[1].localeCompare(b[1]));
    sortValue.forEach((element) => {
        const p = document.createElement('p');
        p.classList.add('pair');
        p.textContent = `${element[0]}=${element[1]}`;
        pairsList.appendChild(p);
        selectedItems=[];
    });
});



document.getElementById('pairs-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('pair')) {
        let targetItem = event.target;
        let index = Array.from(pairsList.children).indexOf(targetItem);
        console.log(index);
        targetItem.classList.toggle('selected');
        if (targetItem.classList.contains('selected')) {
            selectedItems.push(index);
        } else {
            selectedItems = selectedItems.filter(item => item !== targetItem);
        }
        console.log(selectedItems);
        console.log(pairs);
    }
});



const deleteSelected = document.getElementById('deleteSelected');
deleteSelected.addEventListener('click', (e) => {
    e.preventDefault();
    selectedItems.sort((a, b) => b - a).forEach(index => {
        pairs.splice(index, 1);
        item.remove()
    });

    selectedItems = [];
    console.log(pairs);
});







