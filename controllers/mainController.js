// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home', navText: '' });
};

module.exports.signin_get = (req, res) => {
    // check if user is logged in
    if (!res.locals.loggedIn) {
        res.render('signin', { title: 'Sign in', navText: '' });
    } else {
        // user is logged in, redirect to front page
        res.redirect('/');
    };
};

module.exports.signup_get = (req, res) => {
    // check if user is logged in
    if (!res.locals.loggedIn) {
        res.render('signup', { title: 'Sign up', navText: '' });
    } else {
        // user is logged in, redirect to front page
        res.redirect('/');
    };
};

module.exports.userpage_get = (req, res) => {
    const username = req.params.username;
    res.render('userpage', { title: username, navText: username });
};

module.exports.userhome_get = (req, res) => {
    // check if user is logged in
    if (res.locals.loggedIn) {
        const username = req.params.username;
        if (username === undefined) {
            // if username is undefined, it means the user went to /home, redirect them to /home/theirUsername
            res.redirect(`/home/${res.locals.loggedInUser}`);
        } else {
            res.render('userhome', { title: username, navText: username });
        };
    } else {
        // user isn't logged in, redirect to login page
        res.redirect('/sign-in');
    };
};