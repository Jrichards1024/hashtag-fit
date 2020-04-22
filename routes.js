let Router = require("express-promise-router");
let Message = require('./models/messages');
let User = require('./models/User');
let upload = require('./services/file-upload')
let singleUpload = upload.single('image')


let router = new Router

router.get('/', async (request,response)=>{
  if (request.user) {
    console.log("-----lookey here-----")
    // console.log(request.user)
    // console.log("this is it ---" + await Message.query().select('body'))
    console.log("lets test out the user table then")
    console.log(await User.query().select("first_name"))
    let messages = await Message.query().select('*').orderBy('created_at')
    console.log(`THIS IS MESSAGES below`)
    console.log(messages)
    console.log(`THIS IS MESSAGES above`)

    // let message = await Message.query().select('*')
    // console.log("this is message" + message)
    response.render('index', { user: request.user, messages });
    // response.render('index', { messages});
  }
  else {
    response.render('index')
  }
})

router.get('/hashtags/:id',async(req,res) =>{
  let hashtag = req.params.id
  console.log("this is hashtag")
  console.log(hashtag)
  let messages = await Message.query().select('*').where('hashtag','#'+hashtag).orderBy('created_at')
  console.log('hello')
  console.log(messages)
  res.render('hashtags',{messages, tag:hashtag})


})
router.post('/image-upload',upload.single('fileToUpload'), (req,res) => {
  let caption = req.body.caption
  console.log("below is req.file.location")
  console.log(req.file.location)
  let url = req.file.location
  console.log(url)
  let hashtag = req.body.hashtag


//  console.log("this is hashtag")
//  console.log(hashtag)
//  console.log(typeof hashtag)

  // console.log(`----this is the caption ${caption}`)
   singleUpload (req,res, async (err)=> {
    if (err) {
      console.log(err.message)
      console.log(err.field)
      return res.status(422).send[{errors: [{title: "file upload error", details: err.message}]}]
    }
    let messages = await Message.query().insert({
      user_id: req.session.userId,
      imageLink: url,
      caption: caption,
      hashtag: hashtag,
    });
    console.log("this is messages")
    console.log(messages)
    res.redirect('/')
    // res.redirect('/')
    // return res.json({'imageUrl':req.file.location})
    // console.log(req.body)
    // console.log({'imageUrl':req.file.location})
    // return res.json({'imageUrl':req.file.location})


  })

})
router.get('/register', (request, response) => {
  if (request.user) {
    // console.log("LOOK BELOW")
    // console.log(request.user.firstName)
    response.redirect('/sign-in');
  } else {
    response.render('register');
  }
});
// router.post('/messages', async(request, response) => {
//   let messageBody = request.body.body;
//   console.log("this is message body" + messageBody)
//   let messageTime = new Date();

//   let message = await Message.query().insert({
//       body: messageBody,
//       createdAt: messageTime,
//     });

//   console.log("this is message in post" + message.body)
//   response.redirect('/');


// });

router.post('/register', async (request,response) =>{
  let userName = request.body.userName;
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let password = request.body.password;

  let user = await User.query().insert({
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });

  if (user) {
    request.session.userId = user.id;

    response.redirect('/');
  } else {
    response.render('register');
  }
})
router.get('/sign-in', (request,response) =>{
  response.render('sign-in')
})

router.get('/my-profile/:id', async (req, res) =>{
  let userId = req.params.id
  console.log("THIS IS USERID")
  console.log(userId)
  let messages = await Message.query().select('*').where('user_id',userId).orderBy('created_at')
  let userInfo = await User.query().select('*').where('id',userId)
  res.render('profile', {messages, user: req.user})

})

router.post('/sign-in', async (request, response) => {
  let userName = request.body.userName
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let password = request.body.password;

  let user = await User.query().findOne({ email: email });
  let passwordValid = user && (await user.verifyPassword(password));

  if (passwordValid) {
    request.session.userId = user.id;

    response.redirect('/');
  } else {
    response.render('sign-in', { invalidLogin: true });
  }
});

module.exports = router;
