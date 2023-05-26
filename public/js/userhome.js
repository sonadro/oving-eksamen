// DOM
const addItemsForm = document.querySelector('.addItems');
const wishlistForm = document.querySelector('.wishlistForm');
const wishlistContainer = document.querySelector('.wishlistContainer');
const feedback = document.querySelector('.feedback');

let userItems = [];
let itemID = 1;

const addWishlistStyles = elements => {
    elements.forEach(element => {
        if (element.id === 'item1') {
            element.classList.add('firstItem');
        } else if (element.id === 'item2') {
            element.classList.add('secondItem');
        };
    });
};

const setAllFieldValues = values => {
    // get all input fields
    const wishlistInputFields = Array.from(document.querySelectorAll('.itemInput'));

    for (let i = 0; i < values.length; i++) {
        // get 'current' input field and item
        const currentValue = values[i].item;
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

    result.items.forEach(item => {
        userItems.push({
            item,
            id: itemID
        });

        const template = `
            <li class="item" id="item${itemID}">
                    <div class="reorderButtons">
                        <button class="itemUp" id="item1up">Move up</button>
                        <button class="itemDown" id="item1down">Move down</button>
                    </div>
                    <input class="itemInput" type="text">
                    <div class="updateButtons">
                        <button class="submit" type="submit">Update</button>
                        <button class="delete">Delete</button>
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
        item,
        id: itemID
    });

    const template = `
        <li class="item" id="item${itemID}">
                <div class="reorderButtons">
                    <button class="itemUp" id="item1up">Move up</button>
                    <button class="itemDown" id="item1down">Move down</button>
                </div>
                <input class="itemInput" type="text">
                <div class="updateButtons">
                    <button class="submit" type="submit">Update</button>
                    <button class="delete">Delete</button>
                </div>
            </li>
    `;
    itemID++;

    wishlistContainer.innerHTML += template;

    // all field values are reset when adding another field, this function re-applies those values
    setAllFieldValues(userItems);

    // set styles of the first and second element
    addWishlistStyles(Array.from(wishlistContainer.children));

    // uploadUserItems(userItems);
});

// get the users items
getUserItems(location.toString().slice(location.toString().indexOf('/home/') + 6));