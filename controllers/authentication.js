exports.getLogin = (req, res, next) => {
    // const isAuthenticated = req
    //     .get('Cookie')
    //     .trim()
    //     .split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isAuthenticated=true');
    req.session.isAuthenticated = true;
    res.redirect('/');
};