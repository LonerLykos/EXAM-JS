let pairs = JSON.parse(localStorage.getItem('pairs')) || [];
let selectedItems = [];
let addPair = document.getElementById('addPair');
let pairsList = document.getElementById('pairs-list');

if (pairs.length > 0) {
    pairs.forEach((element) => {
        const p = document.createElement('p');
        p.classList.add('pair');
        p.textContent = `${element[0]}=${element[1]}`;
        pairsList.appendChild(p);
    });
}

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
            localStorage.setItem('pairs', JSON.stringify(pairs));
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
});

const sortByName = document.getElementById('sortByName');
sortByName.addEventListener('click', (e) => {
    e.preventDefault();
    pairsList.textContent = '';
    sortButton(0);
});

const sortByValue = document.getElementById('sortByValue');
sortByValue.addEventListener('click', (e) => {
    e.preventDefault();
    pairsList.textContent = '';
    sortButton(1);
});

document.getElementById('pairs-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('pair')) {
        let targetItem = event.target;
        let index = Array.from(pairsList.children).indexOf(targetItem);
        targetItem.classList.toggle('selected');
        if (targetItem.classList.contains('selected')) {
            selectedItems.push({id: index, name: targetItem});
        } else {
            selectedItems = selectedItems.filter(item => item !== targetItem);
        }
    }
});

const deleteSelected = document.getElementById('deleteSelected');
deleteSelected.addEventListener('click', (e) => {
    e.preventDefault();
    selectedItems.sort((a, b) => b.id - a.id).forEach(element => {
        pairs.splice(element.id, 1);
        element.name.remove()
        localStorage.setItem('pairs', JSON.stringify(pairs));
    });
    selectedItems = [];
});

function sortButton(index){
    let sortItems = pairs.sort((a, b) => a[index].localeCompare(b[index]));
    sortItems.forEach((item) => {
        const p = document.createElement('p');
        p.classList.add('pair');
        p.textContent = `${item[0]}=${item[1]}`;
        pairsList.appendChild(p);
        localStorage.setItem('pairs', JSON.stringify(pairs));
        selectedItems = [];
    });
}





