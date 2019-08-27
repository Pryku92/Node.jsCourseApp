const User = require('../models/user');


exports.getLogin = (req, res, next) => {
    // const isAuthenticated = req
    //     .get('Cookie')
    //     .trim()
    //     .split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isAuthenticated
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isAuthenticated=true');
    User.findById('5d5ff3a5d2eeba0350d64613')
        .then(user => {
            req.session.user = user;
            req.session.isAuthenticated = true;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};