// DOM
const addItemsForm = document.querySelector('.addItems');
const wishlistContainer = document.querySelector('.wishlist');
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

    userItems = result.items;

    userItems.forEach(item => {
        const template = `
            <li id="item${itemID}">${itemID}. ${item}</span></li>
        `;
        itemID++;

        wishlistContainer.innerHTML += template;
    });

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

    showFeedback(result.status, result.code, feedback);
};

addItemsForm.addEventListener('submit', e => {
    e.preventDefault();

    const item = addItemsForm.item.value;
    userItems.push(item);

    const template = `
        <li id="item${itemID}">${itemID}. ${item}</span></li>
    `;
    itemID++;

    wishlistContainer.innerHTML += template;

    addWishlistStyles(Array.from(wishlistContainer.children));

    uploadUserItems(userItems);
});

// get the users items
getUserItems(location.toString().slice(location.toString().indexOf('/home/') + 6));