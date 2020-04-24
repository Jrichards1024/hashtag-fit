let Router = require("express-promise-router");
let Message = require('./models/messages');
let User = require('./models/User');
let messageInfo = require('./models/messageInfo');
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
    //newMessages is what allows for the posters username to come up on each post
    let newMessages = await Message.query().withGraphFetched('userInfo').orderBy('created_at', 'DESC');
    console.log("-----------the variable new messages---------")
    console.log(newMessages)
    //userMessage connects the Message info table to the Users table
    // let userMessage = await messageInfo.query().withGraphFetched('userCombineMessageInfo')
    // console.log("------userMessage-----")
    // console.log(userMessage)
    //MessageCombineInfo is the messages table to the comments(messageinfo) table
    let messageCombineInfo = await messageInfo.query().withGraphFetched('messageCombineMessageInfo')
    console.log("-------messageCombineInfo------")
    console.log(messageCombineInfo)


    // let message = await Message.query().select('*')
    // console.log("this is message" + message)
    // userMessage,messageCombineInfo
    response.render('index', { user: request.user, messages, style: "style.css",newMessages,messageCombineInfo});
    // response.render('index', { messages});
  }
  else {
    response.render('index', {style:"style.css"})
  }
})

router.get('/hashtags/:id',async(req,res) =>{
  let hashtag = req.params.id
  // console.log("this is hashtag")
  // console.log(hashtag)
  // let hashtagList = [];
  // hashtagList.push(hashtag)
  // let hashtagQuery = await Message.query().select('hashtag')
  // console.log("these are all hashtags")
  // console.log(hashtagQuery)
  // upHashtag = '#' + hashtag
  // console.log(typeof upHashtag)

  let messages = await Message.query().select('*').where('hashtag',hashtag).orderBy('created_at')
  console.log('messages with hashtag please')
  console.log(messages)
  res.render('hashtags',{messages,tag:hashtag, style: "style.css"})

})

router.post('/message/:id/comments', async (req,res)=> {
  let userId = req.session.userId
  console.log("this is userid")
  console.log(req.session.userId)
  let messageId = req.params.id
  let comment = req.body.comment
  console.log("this is the type for message id")
  messageId = parseInt(messageId)
  console.log(typeof messageId)
  let test = await messageInfo.query().select('*')
  console.log("this is a test")
  console.log(test)

  // let message = await Message.query().findById(messageId)

  let newComment = await messageInfo.query().insert({
    comments:comment,
    userId: req.session.userId,
    messageId: messageId,
  });

  console.log("this is new comment")
  console.log(newComment)

  // let messageCombineInfo = await messageInfo.query().withGraphFetched('messageCombineMessageInfo')
  // console.log("-------messageCombineInfo------")
  // console.log(messageCombineInfo)
  // res.render('index',{messageCombineInfo})
  res.redirect('/')
})
router.post('/image-upload',upload.single('fileToUpload'), (req,res) => {
  let caption = req.body.caption
  let url = req.file.location
  let hashtag = req.body.hashtag
  console.log("hashtag before split")
  hashtag = hashtag.slice(1,hashtag.length)
  console.log(hashtag)
  // hashtag = hashtag.split(" ")
  // newHashtag =[];
  // for (let element of hashtag) {
  //   element = element.slice(1,element.length)
  //   console.log(element)
  //   newHashtag.push(element)
  // }
  // console.log("im not sure why this is happening")
  // console.log("this is hashtag after split")
  // console.log(newHashtag)

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
      userId: req.session.userId,
      // userName: await User.query().select('userName').where('user_id',userId),
      imageLink: url,
      caption: caption,
      hashtag: hashtag,
    });
    console.log("this is messages with userName quality")
    console.log(messages)
    // let newMessages = await Message.query().orderBy('created_at', 'DESC').withGraphFetched('users.userName');
    // console.log("-----------the variable new messages---------")
    // console.log(newMessages)
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
    response.render('register',{style: 'style.css'});
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
    response.render('register',{ style: 'style.css'});
  }
})
router.get('/sign-in', (request,response) =>{
  response.render('sign-in',{style: "style.css"})
})

router.get('/my-profile/:id', async (req, res) =>{
  let userId = req.params.id
  console.log("THIS IS USERID")
  console.log(userId)
  let messages = await Message.query().select('*').where('user_id',userId).orderBy('created_at')
  let userInfo = await User.query().select('*').where('id',userId)
  res.render('profile', {messages, user: req.user,style:"style.css"})

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
    response.render('sign-in', { invalidLogin: true, style: "style.css" });
  }
});

module.exports = router;
