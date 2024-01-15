const fs = require('fs');
const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');
const filepath = 'db.json';

// set the home page route
router.get('/', function(req, res) {
    res.render('index.html');
});

// navigate to the notes page
router.get('/notes', function(req, res) {
    res.render('notes.html');
});


function getNotes() {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}

// get notes from db
router.get('/api/notes', function(req, res) {
    getNotes().then(notes => res.json(notes)).catch(err => res.status(500).send(err));
});

// save notes to db
router.post('/api/notes', function(req, res) {
    // receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
    let newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);
    
    getNotes().then(notes => {
        notes.push(newNote);
        fs.writeFile(filepath, JSON.stringify(notes), function(err) {
            if (err) throw err;
            console.log('Saved!');
        });
        res.json(newNote);
    }).catch(err => res.status(500).send(err));
});

// delete a note from db
router.delete('/api/notes/:id', function(req, res) {
    // In order to delete a note, you'll need to read all notes from the `db.json` file, 
    // remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
    let id = req.params.id;
    console.log(id);
    
    getNotes().then(notes => {
        let filteredNotes = notes.filter(note => note.id !== id);
        fs.writeFile(filepath, JSON.stringify(filteredNotes), function(err) {
            if (err) throw err;
            console.log('Deleted!');
        });
        res.json(filteredNotes);
    }).catch(err => res.status(500).send(err));
});

module.exports = router;