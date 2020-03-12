const express = require('express');

const Users = require('./userDb');

const router = express.Router();

router.post('/', (req, res) => {
  const userInfo = req.body;

    if (userInfo.name == false) {
        res.status(400).json({errorMessage: "Please provide name for the user"});
    return;
} 
    Users.insert(userInfo)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "There was an error while saving the post to the database" 
        });
    });
});

router.post('/:id/posts', (req, res) => {

  const postInfo = req.body;

  postInfo.user_id = req.params.id;

  if (postInfo.text == false) {
      res.status(400).json({errorMessage: "Please provide text for the comment."});
      return;
  } 
  Users.insert(postInfo)
  .then(post => {
      res.status(201).json(post)
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ 
          error: "There was an error while saving the comment to the database" 
      });
  });

});

router.get('/', (req, res) => {
  Users.find(req.query)
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

router.get('/:id', (req, res) => {
  
  Users.getById(req.params.id)
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
            error: "The user information could not be retrieved." 
        });
    });
});

router.get('/:id/posts', (req, res) => {
  Users.getById(req.params.id)
    .then(posts => {
        if (posts === undefined) {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(posts)
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The comments information could not be retrieved." 
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

router.put('/:id', (req, res) => {
  const userInfo = req.body;

  if (userInfo.name == false) {
      res.status(400).json({errorMessage: "Please provide a name for the user"});
  return;
  }

  Users.update(req.params.id, postInfo)
  .then(count => {
      if (count === 1) {
          Users.getById(req.params.id)
          .then(users => {
              if(users === undefined) 
              {
                  res.status(404).json({ message: "The user with the specified ID does not exist." })
              } else {
                  res.status(200).json(users)
              }
          })
          .catch(err => {
              console.log(err)
              res.status()
          })
          res.status(404).json({message: "The user with the specified ID does not exist."})
      } else {
          res.status(200).json(users)
      }
      
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
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
