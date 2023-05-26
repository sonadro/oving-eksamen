// DOM
const wishlistContainer = document.querySelector('.wishlist');

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
            <li class="item">${item.id}. ${item.value}</span></li>
        `;

        wishlistContainer.innerHTML += template;
    });
};

getUserItems(location.toString().slice(location.toString().indexOf('/user/') + 6));