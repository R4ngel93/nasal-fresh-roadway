const passport    = require('passport');
const bcrypt      = require('bcrypt');

module.exports = (app, db) => {
  
  const ensureAuthenticated = (req, res, next) => {
    return req.isAuthenticated() ? next() : res.redirect('/');;
  }
  
  app.route('/')
  .get((req, res) => {
      res.render(process.cwd() + '/views/pug/index', {title: 'Home Page', message: 'login', showLogin: true, showRegistration: true});
    });
      
  app.route('/profile')
    .get(ensureAuthenticated, (req, res) => {
      res.render(process.cwd() + '/views/pug/profile', {username: req.body.username});
    });
      
    app.route('/register')
      .post((req, res, next) => {
          let hash = bcrypt.hashSync(req.body.password, 12);
          db.collection('users').findOne({ username: req.body.username }, function (err, user) {
              if(err) {
                  next(err);
              } else if (user) {
                  res.redirect('/');
              } else {
                  db.collection('users').insertOne(
                    {username: req.body.username,
                     password: hash},
                    (err, doc) => err ?  res.redirect('/') : next(null, user)
                  );
              }
          })},
        passport.authenticate('local', { failureRedirect: '/' }),
        (req, res, next) => {
            res.redirect('/profile');
        }
    );
      
    app.route('/login')
      .post(passport.authenticate('local', { failureRedirect: '/' }),(req,res) => {
           //res.redirect('/profile');
          res.render(process.cwd() + "/views/pug/profile.pug", {
            username: req.user.username
          });
      });      
      
    app.route('/logout')
      .get((req, res) => {
          req.logout();
          res.redirect('/');
      });

    app.use((req, res, next) => {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
  
}
