// DOM
const addItemsForm = document.querySelector('.addItems');
const wishlistForm = document.querySelector('.wishlistForm');
const wishlistContainer = document.querySelector('.wishlistContainer');
const feedback = document.querySelector('.feedback');

let userItems = [];
let itemID = 1;

const addWishlistStyles = elements => {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (i === 0) {
            element.classList.add('firstItem');
            element.classList.remove('secondItem');
        } else if (i === 1) {
            element.classList.add('secondItem');
        };
    };
};

const setAllFieldValues = values => {
    // get all input fields
    const wishlistInputFields = Array.from(document.querySelectorAll('.itemInput'));

    for (let i = 0; i < values.length; i++) {
        // get 'current' input field and item
        const currentValue = values[i].value;
        const currentField = wishlistInputFields[i];

        // set the current fields value to the current item
        currentField.value = currentValue;
    };
};

// get users wishlist items, to display on the page
const getUserItems = async username => {
    const res = await fetch('/wishlist-get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username
        })
    });
    
    const result = await(res.json());

    result.items.forEach(obj => {
        const listItem = {
            value: obj.value,
            id: itemID
        };
        
        userItems.push(listItem);

        const template = `
            <li class="item" id="item${itemID}">
                    <div class="reorderButtons">
                        <button class="itemUp" id="${itemID}up">Move up</button>
                        <button class="itemDown" id="${itemID}down">Move down</button>
                    </div>
                    <input class="itemInput" id="input${itemID}" type="text">
                    <div class="updateButtons">
                        <button class="update" id="${itemID}update">Update</button>
                        <button class="delete" id="${itemID}delete">Delete</button>
                    </div>
                </li>
        `;
        itemID++;
    
        wishlistContainer.innerHTML += template;
    });

    setAllFieldValues(userItems);
    addWishlistStyles(Array.from(wishlistContainer.children));
};

// upload user items 
const uploadUserItems = async wishlist => {
    const res = await fetch('/wishlist-create-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wishlist
        })
    });
    
    const result = await(res.json());

    console.log(result);

    showFeedback(result.status, result.code, feedback, false);
};

addItemsForm.addEventListener('submit', e => {
    e.preventDefault();

    const item = addItemsForm.item.value;

    userItems.push({
        value: item,
        id: itemID
    });

    const template = `
        <li class="item" id="item${itemID}">
                <div class="reorderButtons">
                    <button class="itemUp" id="${itemID}up">Move up</button>
                    <button class="itemDown" id="${itemID}down">Move down</button>
                </div>
                <input class="itemInput" id="input${itemID}" type="text">
                <div class="updateButtons">
                    <button class="update" id="${itemID}update">Update</button>
                    <button class="delete" id="${itemID}delete">Delete</button>
                </div>
            </li>
    `;
    itemID++;

    wishlistContainer.innerHTML += template;

    // all field values are reset when adding another field, this function re-applies those values
    setAllFieldValues(userItems);

    // set styles of the first and second element
    addWishlistStyles(Array.from(wishlistContainer.children));

    uploadUserItems(userItems);
});

wishlistForm.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.classList[0] === 'update') {
        // update the item
        const id = Number(e.target.id.slice(0, 1));

        // get corresponding inputfield
        const inputField = document.querySelector(`#input${id}`);

        // loop through every item, and change the corresponding item's value
        for (let i = 0; i < userItems.length; i++) {
            const currentItem = userItems[i];

            // if the id of the item matches the id of the button, update the item's value
            if (currentItem.id === id) {
                currentItem.value = inputField.value;
            };
        };

        // save changes to the database
        uploadUserItems(userItems);

    } else if (e.target.classList[0] === 'delete') {
        // delete the item - get id from the button's id
        const id = Number(e.target.id.slice(0, 1));

        // loop through every item
        for (let i = 0; i < userItems.length; i++) {
            const currentItem = userItems[i];

            // if the item's id matches with the button's id, remove it from the array
            if (currentItem.id === id) {
                userItems.splice(i, 1);
            };
        };

        // get the element with matching id, and remove it
        const itemElement = document.querySelector(`#item${id}`);
        itemElement.outerHTML = '';

        // reapply styles for first & second element
        addWishlistStyles(Array.from(wishlistContainer.children));

        // and finally, send the new data to the database
        uploadUserItems(userItems);
    } else if (e.target.classList[0] === 'itemUp') {
        // move item up - get id of button clicked
        const id = Number(e.target.id.slice(0, 1));

        // if id is 1, it's the first element, thus it can't be moved up
        if (id === 1) return;

        const allInputFields = Array.from(document.querySelectorAll('.itemInput'));

        let previousInputField;
        let currentInputField;

        // find the previous and current field (current field corresponds with the button the user clicked)
        for (let i = 0; i < id; i++) {
            if (id - 2 === i) {
                previousInputField = allInputFields[i];
            } else if (id === i + 1) {
                currentInputField = allInputFields[i];
            };
        };

        // swap the inputfield values
        [previousInputField.value, currentInputField.value] = [currentInputField.value, previousInputField.value];

        // swap the values in the userItems array
        [userItems[id - 2], userItems[id - 1]] = [userItems[id - 1], userItems[id - 2]];

        // save changes to database
        uploadUserItems(userItems);
    } else if (e.target.classList[0] === 'itemDown') {
        // move item down - find id of the clicked button
        const id = Number(e.target.id.slice(0, 1));

        // if id + 1 is greater than the amount of items, the item is the last item, thus it can't be moved further down
        if (id + 1 > userItems.length) return;

        const allInputFields = Array.from(document.querySelectorAll('.itemInput'));

        let currentInputField;
        let nextInputField;

        // find the current and next input field (current field corresponds with the button the user clicked)
        for (let i = 0; i < id + 1; i++) {
            if (id - 1 === i) {
                currentInputField = allInputFields[i];
            } else if (id === i) {
                nextInputField = allInputFields[i];
            };
        };

        // swap the values of the inputfields
        [currentInputField.value, nextInputField.value] = [nextInputField.value, currentInputField.value];

        // swap the values in the userItems array
        [userItems[id -1], userItems[id]] = [userItems[id], userItems[id -1]];

        // save changes to database
        uploadUserItems(userItems);
    };
});

// get the users items
getUserItems(location.toString().slice(location.toString().indexOf('/home/') + 6));