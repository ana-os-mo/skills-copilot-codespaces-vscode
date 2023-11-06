// Create web server
var express = require('express');
var router = express.Router();
var comments = require('../data/comments.json');
var fs = require('fs');

// Get all comments
router.get('/', function(req, res, next) {
    res.json(comments);
});

// Get single comment by id
router.get('/:id', function(req, res, next) {
    var comment = comments.filter(function(comment) {
        return comment.id == req.params.id;
    });
    if(comment.length == 1) {
        res.json(comment[0])
    } else {
        res.status(404); // Set status to 404 as comment was not found
        res.json({message: "Not Found"});
    }
});

// Add new comment
router.post('/', function(req, res, next) {
    // Check if all fields are provided and are valid:
    if(!req.body.title ||
        !req.body.url ||
        !req.body.text) {
        res.status(400);
        res.json({message: "Bad Request"});
    } else {
        var newId = comments[comments.length-1].id + 1;
        comments.push({
            id: newId,
            title: req.body.title,
            url: req.body.url,
            text: req.body.text
        });
        fs.writeFile('data/comments.json', JSON.stringify(comments), function(err) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({message: "Internal Server Error"});
            } else {
                res.json({message: "New comment added.", location: "/comments/" + newId});
            }
        });
    }
});
