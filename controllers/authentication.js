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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isAuthenticated=true');
    User.findById('5d5ff3a5d2eeba0350d64613')
        .then(user => {
            req.session.user = user;
            req.session.isAuthenticated = true;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userData => {
            if(userData) {
                return res.redirect('/signup');
            }
            const user = new User({
                email: email,
                password: password,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};