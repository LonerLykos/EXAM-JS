let pairs = JSON.parse(localStorage.getItem('pairs')) || [];
let selectedItems = [];
const addPair = document.getElementById('addPair');
const pairsList = document.getElementById('pairs-list');
const deleteAll = document.getElementById('deleteAll');
const errorWindow = document.getElementById('errorWindow');
const errorMsg = document.getElementById('errorMsg');

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
        let index = trim.indexOf('=');
        let indexlast = trim.lastIndexOf('=');
        if (index === indexlast) {
            let arrPair = trim.split('=');
            let name = arrPair[0].trim();
            let value = arrPair[1].trim();
            if (!name || !value) {
                let text = `Ім'я і значення не можуть бути пустими`;
                forError(text);
                input.value = '';
            } else {
                const match1 = name.match(/^(([a-zA-Z0-9а-яА-ЯїЇєЄіІґҐ]+)*\s?)+$/);
                const match2 = value.match(/^(([a-zA-Z0-9а-яА-ЯїЇєЄіІґҐ]+)*\s?)+$/);
                if (match1 && match2) {
                    pairs.push([name, value]);
                    localStorage.setItem('pairs', JSON.stringify(pairs));
                    input.value = '';
                    const p = document.createElement('p');
                    p.classList.add('pair');
                    p.textContent = `${name}=${value}`;
                    pairsList.appendChild(p);
                } else {
                    let text = `Не використовуйте символи крім '=' та пробілу`;
                    forError(text);
                    input.value = '';
                }
            }

        } else {
            let text = `Не використовуйте '=' більше ніж одне на пару`;
            forError(text);
            input.value = '';
        }

    } else {
        let text = `Використовуйте '=' для визначення пари`;
        forError(text);
        input.value = '';
    }
});

const sortByName = document.getElementById('sortByName');
sortByName.addEventListener('click', (e) => {
    e.preventDefault();
    sortButton(0);
});

const sortByValue = document.getElementById('sortByValue');
sortByValue.addEventListener('click', (e) => {
    e.preventDefault();
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

function sortButton(index) {
    pairsList.textContent = '';
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

deleteAll.addEventListener('click', (e) => {
    e.preventDefault();
    pairs = [];
    localStorage.setItem('pairs', JSON.stringify(pairs));
    pairsList.textContent = '';
    selectedItems = [];
})

function forError(text) {
    errorMsg.textContent = '';
    errorMsg.textContent = text;
    errorWindow.classList.add('view');
    setTimeout(() => {
        errorWindow.classList.remove('view');
    }, 5000);

}



