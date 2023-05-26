// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home', navText: '' });
};

module.exports.signin_get = (req, res) => {
    res.render('signin', { title: 'Sign in', navText: '' });
};

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'Sign up', navText: '' });
};

module.exports.userpage_get = (req, res) => {
    const username = req.params.username;
    res.render('userpage', { title: username, navText: username });
};

module.exports.userhome_get = (req, res) => {
    const username = req.params.username;
    res.render('userhome', { title: username, navText: username });
};