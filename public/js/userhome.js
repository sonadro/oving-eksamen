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
        const currentValue = values[i].item.item;
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
                        <button class="itemUp" id="1up">Move up</button>
                        <button class="itemDown" id="1down">Move down</button>
                    </div>
                    <input class="itemInput" type="text">
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
        item,
        id: itemID
    });

    const template = `
        <li class="item" id="item${itemID}">
                <div class="reorderButtons">
                    <button class="itemUp" id="1up">Move up</button>
                    <button class="itemDown" id="1down">Move down</button>
                </div>
                <input class="itemInput" type="text">
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

    // uploadUserItems(userItems);
});

wishlistForm.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.classList[0] === 'update') {
        // update the item
        const id = e.target.id.slice(0, 1);
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
    };
});

// get the users items
getUserItems(location.toString().slice(location.toString().indexOf('/home/') + 6));