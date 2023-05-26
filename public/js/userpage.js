// DOM
const wishlistContainer = document.querySelector('.wishlist');

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

    result.items.forEach(item => {
        const template = `
            <li>${itemID}. ${item}</span></li>
        `;

        itemID++;

        wishlistContainer.innerHTML += template;
    });
};

getUserItems(location.toString().slice(location.toString().indexOf('/user/') + 6));