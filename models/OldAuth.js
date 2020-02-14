var express = require("express");
var router = express.Router();
var db = require('../models');
const bcrypt = require('bcryptjs');


//get route to retrieve all users info, only for dev, remove from production
router.get('/allUsers', function (req, res) {
    db.User.findAll().then(function (users) {
        res.json(users);
    })
})

//loads signup form url to load this page is http://localhost:8080/signup/createaccount
router.get('/createAccount', function (req, res) {
    res.render('createAccount');
})

//creates new instance of user. Url is http://localhost:8080/signup/createaccount
router.post('/createNewUser', function (req, res) {
    console.log(req.body)
    db.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio

    }).then(function (newUser) {
        // console.log(newUser)
        res.redirect("/");
    }).catch(function (error) {
        console.log(error);
    })
})

function alert() {
    alert("wrong password!")
}


//route for user login
router.post('/entrypage', function (req, res) {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (dbUser) {
        //compares password send in req.body to one in database, will return true if matched.
        if (bcrypt.compareSync(req.body.password, dbUser.password)) {
            //create new session property "user", set equal to logged in user
            req.session.user = {
                name: dbUser.username,
                id: dbUser.id
            };
            res.redirect("/entrypage");
        } else {
            alert()
            //delete existing user, add error
            req.session.user = false;
            req.session.error = 'auth failed'
        }
        console.log(req.session);


        // req.session.user.id has the user ID if we want to grab the information for that particular user. 
    })
})

router.get('/logout', function (req, res) {
    //delete session user, logging you out
    req.session.destroy(function () {
        res.render("login")
    })
})

//developer route to see all the session variables.
router.get('/readsessions', function (req, res) {
    res.json(req.session);
})

module.exports = router;