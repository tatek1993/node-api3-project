const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  
    Users.insert(req.body)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "There was an error while saving the user to the database" 
        });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

  Posts.insert(req.body)
  .then(post => {
      res.status(201).json(post)
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ 
          error: "There was an error while saving the post to the database" 
      });
  });

});

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The posts information could not be retrieved." 
        });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  
  res.status(200).json(req.user);
  
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Posts.get()
    .then(posts => {
      const userPosts = posts.filter(post => post.user_id == req.user.id);
        
      res.status(200).json(userPosts)
    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The posts information could not be retrieved." 
        });
    });
});

router.delete('/:id', (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
        if (user === undefined) {
            res.status(404).json({message: "The user with the specified ID does not exist."})
        } else {
            res.status(200).json(user)
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The user could not be removed" 
        });
    });
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  const userInfo = req.body;

  // if (userInfo.name == false) {
  //     res.status(400).json({errorMessage: "Please provide a name for the user"});
  // return;
  // }

  Users.update(req.params.id, userInfo)
  .then(count => {
    console.log('count', count);
      if (count === 1) {
        res.status(200).json(count)
      } else {
        res.status(500).json({message: "The user information could not be retrieved"})
      }
      //     Users.getById(req.params.id)
      //     .then(users => {
      //         if(users === undefined) 
      //         {
      //             res.status(404).json({ message: "The user with the specified ID does not exist." })
      //         } else {
      //             res.status(200).json(users)
      //         }
      //     })
      //     .catch(err => {
      //         console.log(err)
      //         res.status(500).json({message: "The user information could not be retrieved"})
      //     })
        
      // } else {
      //     res.status(200).json(users)
      // }
      
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ 
          error: "The user information could not be retrieved." 
      });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(user => {
    if (user === undefined) {
        res.status(404).json({message: "The user with the specified ID does not exist."})
    } else {
        req.user = user;
        next();
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ 
        error: "The user information could not be retrieved." 
    });
  });
}

function validateUser(req, res, next) {
  const userInfo = req.body;


  if (userInfo == null) {
    res.status(400).json({errorMessage: "missing user data"});
    return;
  } 

  if (userInfo.name == false) {
      res.status(400).json({errorMessage: "missing required name field"});
      return;
  } 
  next();
}

function validatePost(req, res, next) {
  const postInfo = req.body;

  postInfo.user_id = req.user.id;

  if (postInfo == null) {
    res.status(400).json({errorMessage: "missing post data"});
    return;
  } 

  if (postInfo.text == false) {
      res.status(400).json({errorMessage: "missing required text field"});
      return;
  } 
  next();
}

module.exports = router;
