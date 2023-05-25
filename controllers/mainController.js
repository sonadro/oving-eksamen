// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home' });
};

module.exports.signin_get = (req, res) => {
    res.render('signin', { title: 'Sign in' });
};

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'Sign up' });
};