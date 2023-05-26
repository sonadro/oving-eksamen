const addItemsForm = document.querySelector('.addItems');
const wishlistContainer = document.querySelector('.wishlist');

let userItems = [];
let itemID = 1;

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

    uploadUserItems(userItems);
});

// get the users items
getUserItems(location.toString().slice(location.toString().indexOf('/home/') + 6));