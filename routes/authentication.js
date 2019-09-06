const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/authentication');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
        body('email')
            .isEmail().withMessage('Please enter a valid email.')
            .normalizeEmail(), //sanitization method
        body('password')
            .isLength({min: 5})
            .isAlphanumeric().withMessage('Please enter a passsword with only numbers and text and at least 5 characters.')
            .trim()
    ],
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userData => {
                    if(userData) {
                        return Promise.reject(
                            'E-mail address already used, pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            // second argument allows to set custom error message as default for all validators in chain
            'Please enter a passsword with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            // custom equality validator
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
            // CUSTOM VALIDATOR
            // .custom((value, { req }) => {
            //     if(value === 'test@test.com') {
            //         throw new Error('This email adress is forbidden.');
            //         // return false; // for default error message
            //     }
            //     return true;
            // })
    ],
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;