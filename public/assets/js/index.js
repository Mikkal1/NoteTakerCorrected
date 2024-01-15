const saveNoteBtn = document.getElementsByClassName('save-note')[0];
const newNoteBtn = document.getElementsByClassName('new-note')[0];
const clearBtn = document.getElementsByClassName('clear-btn')[0];
const noteTitle = document.getElementsByClassName('note-title')[0];
const noteText = document.getElementsByClassName('note-textarea')[0];

function handleClearNote() {
    noteTitle.value = '';
    noteText.value = '';
    hideSaveAndClear();
}
clearBtn.addEventListener('click', handleClearNote);

function handleNewNote() {
    handleClearNote();
    newNoteBtn.style.display = 'none';
}
newNoteBtn.addEventListener('click', handleNewNote);

function hideSaveAndClear() {
    saveNoteBtn.style.display = 'none';
    clearBtn.style.display = 'none';
}

function showSaveAndClear() {
    newNoteBtn.style.display = 'none';
    clearBtn.style.display = 'block';
    if (noteTitle.value.trim().length > 0 && noteText.value.trim().length > 0)
        saveNoteBtn.style.display = 'block';
}
// on change of note title or note text, show save and clear buttons
noteTitle.addEventListener('keyup', showSaveAndClear);
noteText.addEventListener('keyup', showSaveAndClear);

function saveNote() {
    let note = {
        title: noteTitle.value,
        text: noteText.value
    };
    console.log(note)
    fetch('/api/notes', { 
        method: 'POST', 
        body: JSON.stringify(note), 
        headers: { 'Content-Type': 'application/json' } 
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        showNotes();
        hideSaveAndClear();
        handleClearNote();
    })
    .catch(function(err) {
        console.log(err);
    });
}
saveNoteBtn.addEventListener('click', saveNote);

function showNotes() {
    fetch('/api/notes', { method: 'GET' })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            let notes = document.getElementById('list-group');
            notes.innerHTML = '';
            data.forEach(function(note) {
                // create a div element with the title on the left and a delete button on the right
                let div = document.createElement('div');
                div.className = 'd-flex justify-content-between align-items-center';
                div.id = note.id;
                let span = document.createElement('span');
                span.innerHTML = note.title;
                let button = document.createElement('button');
                button.className = 'btn btn-danger btn-sm';
                button.innerHTML = '<i class="fas fa-trash-alt"></i>';
                button.onclick = function() {
                    fetch('/api/notes/' + note.id, { method: 'DELETE' })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            console.log(data);
                            showNotes();
                            handleNewNote();
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                };
                div.appendChild(span);
                div.appendChild(button);

                let li = document.createElement('li');
                li.className = 'list-group-item list-item-title';
                li.appendChild(div);
                // li.innerHTML = note.title;
                // li.id = note.id;
                li.onclick = function() {
                    handleNewNote();
                    noteTitle.value = note.title;
                    noteText.value = note.text;
                    newNoteBtn.style.display = 'block';
                };
                notes.appendChild(li);
            });
        });
}

showNotes();