const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "the posts could not be retreived"})
  })
});

router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    if (post === undefined) {
        res.status(404).json({message: "The post with the specified ID does not exist."})
    } else {
        res.status(200).json(post)
    }
    
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ 
        error: "The post information could not be retrieved." 
    });
  });
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
        if (post === undefined) {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(post)
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The post could not be removed" 
        });
    });
});

router.put('/:id', (req, res) => {
  const postInfo = req.body;

    if (postInfo.text == false) {
        res.status(400).json({errorMessage: "Please provide title and contents for the post"});
        return;
    }

    Posts.update(req.params.id, postInfo)
    .then(count => {
        if (count === 1) {
          
            Posts.getById(req.params.id)
            .then(post => {
                if(post === undefined) 
                {console.log("AHH", req.params.id, post);
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    res.status(200).json(post)
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: "Could not update"})
            })
            
        } else {
            res.status(200).json(post)
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error: "The post information could not be retrieved." 
        });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
