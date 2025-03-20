const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

// css classes
const buttonClasses = ['remove-item', 'btn-link', 'text-red'];
const iconClasses = ['fa-solid', 'fa-xmark'];


function addItem(e){

    const newItem = itemInput.value;
    e.preventDefault();
    if (newItem === ''){
        alert('Please add an item');
        return;
    }
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem))
    const button = createButton();
    li.appendChild(button);
    itemList.appendChild(li);
    itemInput.value = '';
}

function createButton(){
    const button = document.createElement('button');
    buttonClasses.forEach(item => button.classList.add(item));
    button.appendChild(createIcon());
    return button;
}

function createIcon(){
    const icon = document.createElement('i');
    iconClasses.forEach(item => icon.classList.add(item))
    return icon;
}


// Event Listeners
itemForm.addEventListener('submit', addItem)