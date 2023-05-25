// controller
module.exports.home_get = (req, res) => {
    res.render('index', { title: 'Home'});
};