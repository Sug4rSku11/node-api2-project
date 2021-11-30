// implement your posts router here
const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

//GET ALL
router.get('/', (req, res) => {
    Posts.find(req)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            message: "The posts information could not be retrieved"})
    })
})
//GET BY ID
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post){ res.status(200).json(post)
        }else{
            res.status(404).json({ 
                message: "The post with the specified ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json ({ message: 
            "The post information could not be retrieved"})
    })
})
//POST
router.post('/', (req, res) => {
	const newPost = req.body;
	if (!newPost.title || !newPost.contents) {
		res.status(400).json({
			message: "Please provide title and contents for the post"
		})
	} else {
		Posts.insert(newPost)
			.then(({ id }) => {
				return Posts.findById(id)
			})
			.then(post => {
				res.status(201).json(post)
			})
			.catch(error => {
				console.log(error)
				res.status(500).json({ message: "There was an error while saving the post to the database" })
			})
	}
})
//PUT BY ID
router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { title, contents } = req.body;
	if (!title || !contents) {
		res.status(400).json({ message: 
            "Please provide title and contents for the post" })
	} else {
		Posts.findById(id)
			.then(post => {
				if (!post) {
					res.status(404).json({ message: 
                        "The post with the specified ID does not exist" })
				} else {
					return Posts.update(id, req.body)
				}
			})
			.then(data => {
				if (data) {
					return Posts.findById(id)
				}
			})
			.then(returnPost => {
				if (returnPost) {
					res.status(200).json(returnPost)
				}
			})
			.catch(error => {
				console.log(error)
				res.status(500).json({ message: 
                    "The post information could not be modified" })
			})
	}
})
//DELETE BY ID

//GET COMMENTS


module.exports = router