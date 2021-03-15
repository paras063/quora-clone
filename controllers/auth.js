// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// ---------------   Global Functions  ---------------
const fileHelper = require('../util/file');

// ---------------   Notify User  ---------------
exports.getNotify = (req, res, next) => {
  res.render('auth/notify', {
    path: '/notify',
    pageTitle: 'Notification',
  });
};

// ---------------   User Signup Operations  ---------------
exports.getSignup = async (req, res, next) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        name: '',
        email: '',        
        password: '',
        confirmPassword: '',
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  try {    
    const name = req.body.name.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();
    const errors = validationResult(req);
    let token;
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: true,
        dataEntered: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword,
        },
      });
    }

    // Token Generation
    crypto.randomBytes(32, (err, buffer) => {
      token = buffer.toString('hex');
    });
    const hashedPassword = await bcrypt.hash(password, 12);
    let user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      activationToken: token,
    });
    user = await user.save();
    res.status(200).json({
      success: true,
      dataEntered: true,
      activationToken: user.activationToken,
    });
    const from = 'xyz.com<info@xyz.com>',
      to = user.email,
      subject = 'Verify Email !',
      content = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style type="text/css">
          body {
              text-align: center;
              background-color: #f8f7ff;
              padding: 1rem;
              height: 100vh;
          }
  
          h3 {
              background-color: #f86d72;
              padding: 1rem;
              text-align: center;
              color: #fff;
          }
  
          a {
              display: inline-block;
              padding: 1rem;
              text-decoration: none;
              text-align: center;
              background-color: #f7f8fc;
              color: #f86d72;
              outline: none;
              font-weight: bolder;
              
          }
  
          a:hover,
          a:active {
              background-color: #f7f8fc;
              color: #f86d72;
              outline: none;
          }
  
          .divider {
              height: 3px;
              color: #fff;
              width: 80%;
              margin: 1rem auto;
          }
      </style>
  </head>
  
  <body>
      <h3>Hello ${user.name} Welcome To xyz.com</h3>
      <div class="divider"></div>    
      <a href="https://xyz.com/verify/${user.activationToken}"> Verify Account</a>
  </body>
  
  </html>`;

    // Mailing ActivationToken to User
    fileHelper.sendMail(from, to, subject, content);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------   User Login Operations  ---------------

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    activationToken: '',
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        activationToken: '',
      });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'User Not Found',
        oldInput: {
          email: email,
          password: password,
        },
        activationToken: '',
      });
    } else {
      if (user.emailVerify !== true) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Email Not Verifed Check Ur Inbox ',
          oldInput: {
            email: email,
            password: password,
          },
          activationToken: user.activationToken,
        });
      } else {
        const doMatch = await bcrypt.compare(password, user.password);

        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            // console.log(err);
            if (user.typeOfUser === 'admin') return res.redirect('/admin');
            return res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          activationToken: '',
          errorMessage: 'Invalid Password.',
          oldInput: {
            email: email,
            password: password,
          },
        });
      }
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.EmailResend = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ activationToken: token }).then((user) => {
    if (!user) return res.redirect('/');
    const from = 'xyz<info@xyz.com>',
      to = user.email,
      subject = 'Verify Email !',
      content = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
        body {
            text-align: center;
            background-color: #f8f7ff;
            padding: 1rem;
            height: 100vh;
        }

        h3 {
            background-color: #f86d72;
            padding: 1rem;
            text-align: center;
            color: #fff;
        }

        a {
            display: inline-block;
            padding: 1rem;
            text-decoration: none;
            text-align: center;
            background-color: #f7f8fc;
            color: #f86d72;
            outline: none;
            font-weight: bolder;
            
        }

        a:hover,
        a:active {
            background-color: #f7f8fc;
            color: #f86d72;
            outline: none;
        }

        .divider {
            height: 3px;
            color: #fff;
            width: 80%;
            margin: 1rem auto;
        }
    </style>
</head>

<body>
    <h3>Hello ${user.name} Welcome To xyz.com</h3>
    <div class="divider"></div>    
    <a href="https://xyz.com/verify/${user.activationToken}"> Verify Account</a>
</body>

</html>`;

    // Mailing ActivationToken to User
    fileHelper.sendMail(from, to, subject, content);
    res.redirect('/notify');
  });
};

// ---------------   Logout User Function  ---------------
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

// ---------------   Verify User Email  ---------------
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ activationToken: token });
    if (!user) res.redirect('/');
    user.activationToken = undefined;
    user.emailVerify = true;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------   User Password Resetting  ---------------

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    let token;
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        return res.redirect('/reset');
      }
      token = buffer.toString('hex');
    });
    const user = await User.findOne({
      email: email,
      activationToken: { $exists: false },
    });
    if (!user) {
      req.flash('error', 'No account with that email found.');
      return res.redirect('/reset');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    res.redirect('/');
    const content = `
        <html>
        <head>
        <title>Forgot password</title>
        <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">
        <style type="text/css">
          .card {
            /* Add shadows to create the "card" effect */
            transition: 0.3s;
            padding: 1rem;
            border-radius: 0.3rem;
            background-color: #f7f8fc;
          }
          h1 {
            color: #2b4450;
          }
          .btn {
            text-decoration: none;
            color: #f7f8fc;
            background-color: #2b4450;
            border: black;
            padding: 10px 24px;
            text-align: center;
            font-family: 'Varela Round', sans-serif;
            font-size: 16px;
            border-radius: 12px;
          }
          .btn:hover {
              box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
          }
          /* Add some padding inside the card container */
          .container {
              width: 80vw;
              margin: auto;
          }
          #cta {
              /* display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center; */
              text-align: center;
          }
      </style>
      </head>

<body>
<div class="container">
    <div class="card">
        <h1>Reset your password?</b></h1>
        <hr>
        <p style="font-size:30px font-family: 'Varela Round', sans-serif;">If you requested a password reset, click
            the
            button below. If you didn't make this request, ignore this email. Someone probably typed in your email
            address by mistake.
        </p>
        <div id="cta">
            <p>Thanks! Team Grade Prime</p>
            <a href="https://xyz.com/reset/${token}" class="btn">Reset Password </a>
        </div>
    </div>
</div>
</body>

</html>`,
      from = 'xyz.com<info@xyz.com>',
      to = req.body.email,
      subject = 'Password reset';

    fileHelper.sendMail(from, to, subject, content);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password.toLowerCase();
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    resetUser = user;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    await resetUser.save();
    res.redirect('/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
