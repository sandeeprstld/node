const router = require('express').Router()
const userController = require('../controllers/userController')
const multer = require('multer');
var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, './public/uploads');    
  }, 
  filename: function (req, file, cb) { 
// It is the filename that is given to the saved file.
     cb(null , file.originalname);   
  }
});
const upload = multer({ storage: storage })

const requireAuth = (req, res, next) => {
    if (req.session.userId) {

        next();
    } else {

        req.flash('error', "Please Login")
        return res.redirect('/')
    }



}
router.get('/', userController.login)
router.get('/signup', userController.registerForm)
router.post('/register', userController.register)
router.post('/userlogin', userController.auth)
router.get('/profile', requireAuth, userController.profile)
router.post('/update',upload.single('image'), userController.updateUser)
router.get('/logout', userController.logout)
//router.put('/user/:id', userController.getUserDetails)



module.exports = router