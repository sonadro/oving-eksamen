// DOM
const wishlistContainer = document.querySelector('.wishlistContainer');

const getUserWishlists = async () => {
    const res = await fetch('/wishlist-getall', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parcel: 'give me all wishlists'
        })
    });
    
    const wishlists = await(res.json());
    
    wishlists.forEach(wishlist => {
        const template = `
            <div class="wishlist"
                <p><a href="/user/${wishlist.owner}" class="username">${wishlist.owner}</a> - ${wishlist.items[0]}</p>
            </div>
        `;

        wishlistContainer.innerHTML += template;
    });
};

getUserWishlists();