// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home' });
};

module.exports.login_get = (req, res) => {
    res.render('login', { title: 'Sign in' });
};