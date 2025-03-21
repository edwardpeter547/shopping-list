const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;
let existingItem;

// css classes
const buttonClasses = ['remove-item', 'btn-link', 'text-red'];
const iconClasses = ['fa-solid', 'fa-xmark'];
const editIconClasses = ['fa-solid', 'fa-pen'];
const addIconClasses = ['fa-solid', 'fa-plus'];


/**
 * Resets the cart list and displays the items 
 * from the local storage.
 */
function displayItems(){
    const itemsFromStorage = getItemFromStorage();
    // first remove any existing items
    itemList.querySelectorAll('li').forEach(item => item.remove());
    itemsFromStorage.forEach(item => addItemToDom(item));
    checkUI();
}


/**
 * Adds a new shopping item to the shopping
 * cart.
 * @param {*Event} event  the event object
 * @returns {null} the function returns null
 */
function onAddItemSubmit(event){

    const newItem = itemInput.value;
    let allItems = getItemFromStorage();
    event.preventDefault();
    if (!isEditMode){
        // check if the item name has not been filled.
        if (newItem === ''){
            alert('Please add an item');
            return;
        }
        // check if the item already exist.
        if(allItems.map(item => item.toLowerCase()).includes(newItem.toLowerCase())){
            alert('Item already exist on list');
            return;
        }
        // add the item to the DOM
        addItemToDom(newItem);
        // add the item to the local storage.
        addItemToStorage(newItem);

    }else{
        
        // check the modified item name is entered.
        if(newItem === ''){
            alert('The new item cannot be empty');
            return;
        }
        // filter to remove the corresponding existing item from the 
        // existing list and add the new item.
        allItems = allItems.filter(item => item !== existingItem);
        allItems.push(newItem);
        // update the local storage with the updated item list.
        localStorage.setItem('items', JSON.stringify(allItems));
        finishEditing();
    }
    displayItems();
    itemInput.value = '';
}


/**
 * Retrieves the list of items from the storage.
 * @returns {Array} List of items from the storage or an empty array.
 */
function getItemFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}


/**
 * Adds a new item to the local storage.
 * @param {String} item The name of the shopping item to be added
 */
function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.push(item)
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


/**
 * Adds a new list item (<li>) to the DOM.
 * @param {Element} item The html element to add to the DOM.
 */
function addItemToDom(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item))
    const button = createButton();
    li.appendChild(button);
    itemList.appendChild(li);
}



/**
 * Creates a new button element and returns it.
 * @returns {Element} The newly created button element
 */
function createButton(){
    const button = document.createElement('button');
    buttonClasses.forEach(item => button.classList.add(item));
    button.appendChild(createIcon(iconClasses));
    return button;
}


/**
 * Creates a new icon element and returns it.
 * @returns {Element} returns the newly created icon.
 */
function createIcon(classes){
    const icon = document.createElement('i');
    classes.forEach(item => icon.classList.add(item));
    return icon;
}


// DELETING ITEMS FROM THE SHOPPING LIST


/**
 * Handles click event bubbled from child items
 * during delete and update items process.
 * @param {Event} event The event object.
 */
function onClickItem(event){
    const target = event.target;
    if (target.tagName === 'I'){
        const itemToRemove = target.parentElement.parentElement;
        removeItem(itemToRemove);
    }else{
        setItemToEdit(target)
    }
}


/**
 * Sets up the ui elements and when entering the 
 * edit mode for a selected item.
 * @param {String} item The item name to be edited.
 */
function setItemToEdit(item){
    isEditMode = true;
    // reset every other item that is in edit-mode
    itemList.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    // update the input field with the item to be edited
    itemInput.value = item.textContent;
    itemInput.focus();
    // update ui components to indicate edit mode.
    formBtn.innerHTML = `${createIcon(editIconClasses).outerHTML} Update Item`;
    formBtn.style.backgroundColor = '#228B22';
    itemInput.style.border = '1px solid #228B22';
    // set the selected item to be edited in the global scope.
    existingItem = item.textContent;
}


/**
 * Reset the ui compoment after the edit is
 * completed.
 */
function finishEditing(){
    isEditMode = false;
    formBtn.innerHTML = `${createIcon(addIconClasses).outerHTML} Add Item`;
    formBtn.style.backgroundColor = '#333';
    itemInput.style.border = '1px solid #ccc';
}


/**
 * Cancels out of the edit mode when the user
 * presses the ESC key.
 * @param {Event} event The event object.
 */
function cancelEditMode(event){
    if(isEditMode && event.key === 'Escape'){
        if(confirm("Do you want to cancel edit?")){
            itemInput.value = '';
            itemInput.focus();
            finishEditing();
            displayItems();
        }
    }
}


/**
 * This function removes a cart item from
 * the shopping list.
 * @param {Element} item The list item to be removed.
 */
function removeItem(item){
    if(confirm("Are you sure you want remove?")){
        // remove item from DOM
        itemList.removeChild(item);
        // remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}


/**
 * Removes an item from the local storage
 * based on the name.
 * @param {String} text The name of the item
 */
function removeItemFromStorage(text){
    // get the items from the local storage
    let itemsFromStorage = getItemFromStorage();
    // filter and remove any item corresponding to the text
    itemsFromStorage = itemsFromStorage.filter(item => item !== text)
    // re-write the entire data into the local storage.
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


/**
 * Removes all the items from the shopping list
 * @param {Event} event The event object
 */
function clearItems(event){
    if(confirm("Are you sure you want to clear items?")){
        itemList.querySelectorAll('li').forEach(item => item.remove());
        localStorage.clear();
        checkUI();
    }
}


/**
 * Resets the ui components after add, edit, delete and 
 * update operations.
 */
function checkUI(){
    const items = itemList.querySelectorAll('li');
    if(items.length > 0){
        clearButton.style.display = 'block';
        filter.style.display = 'block';
    }
    else{
        clearButton.style.display = 'none';
        filter.style.display = 'none';
    }
}


/**
 * Filters the items in the cart in the 
 * form of search implementation.
 * @param {Event} event The event object.
 */
function filterItems(event){
    const text = event.target.value.toLowerCase();
    itemList.querySelectorAll('li').forEach(item => {
        const elementText = item.textContent.toLowerCase();
        if(elementText.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });
}


/**
 * Initializes the app. setup the events and handlers.
 */
function initApp(){
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    window.addEventListener('keyup', cancelEditMode);

    checkUI();
}


// initialize the application
initApp();
