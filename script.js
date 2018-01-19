(
    function() {
        var notes = document.getElementsByClassName("notes")[0];

        var doNote = function(parent)
        {
            parent.active = false;
            console.log('Toggle to : ', parent.active);
            for (var i = 0; i < parent.subNotes.length; i++)
                doNote(parent.subNotes[i]);
            if(parent.active)
            {
                parent.notDoneButton.style.display='none';
                parent.doneButton.style.display='inline';
            }
            else
            {
                parent.notDoneButton.style.display='inline';
                parent.doneButton.style.display='none';
            }
            render();
        }
        var undoNote = function(parent)
        {
            parent.active = true;
            console.log('Toggle to : ', parent.active);
            for (var i = 0; i < parent.subNotes.length; i++)
                undoNote(parent.subNotes[i]);
            parent.notDoneButton.style.display='none';
            parent.doneButton.style.display='inline';
            render();
        }
        var addSubNote = function(parent, msg)
        {
            console.log('Adding '+msg+' to '+ parent.msg);
            var childNote = new Note(msg, parent.subNotes.length);
            parent.subNotes.push(childNote);
            console.log(parent.subNotes);
            render();
        }

        var deleteNote = function (parent)
        {
            console.log('Deleting ' + parent);
            parent.isdeleted = true;
            updateList();
            render();
        }

        var editNote = function(parent)
        {
            parent.textBox.disabled = false;
            console.log('Editing ' + parent);
            parent.editButton.disabled = true;
            parent.saveButton.disabled = false;
            parent.saveButton.style.display = 'inline';
            parent.editButton.style.display = 'none';
        }

        var saveText =function(parent)
        {
            parent.msg = parent.textBox.value;
            parent.editButton.disabled = false;
            parent.editButton.style.visibility = '';
            parent.saveButton.disabled = true;
            parent.textBox.disabled = true;
            parent.editButton.style.display = 'inline';
            parent.saveButton.style.display = 'none';
            render();
        }

        var initializeNote = function(parent, message, idx)
        {
            parent.idx = idx;
            parent.msg = message;
            parent.active = true;
            parent.subNotes = new Array();
            parent.isdeleted = false;
            parent.deleteButton = document.createElement('button');
            parent.editButton = document.createElement('button');
            parent.addButton = document.createElement('button');
            parent.saveButton = document.createElement('button');
            parent.doneButton = document.createElement('button');
            parent.notDoneButton = document.createElement('button');
            parent.notDoneButton.innerHTML = 'Undo';
            parent.doneButton.innerHTML = 'Done';
            parent.saveButton.innerHTML = 'Save';
            parent.textBox = document.createElement('input');
            parent.textBox.setAttribute('type', 'text');
            parent.textBox.disabled = true;
            parent.addButton.innerHTML = '+';
            parent.deleteButton.innerHTML = 'X';
            parent.editButton.innerHTML = 'Edit';
            parent.saveButton.disabled = true;
            parent.addButton.style.display = 'inline';
            parent.saveButton.style.display = 'none';
            parent.notDoneButton.style.display = 'none';

            parent.deleteButton.addEventListener('click', function() {return deleteNote(parent)});
            parent.editButton.addEventListener('click', function() {editNote(parent)});
            parent.addButton.addEventListener('click', function() {return addSubNote(parent, 'subnote')});
            parent.saveButton.addEventListener('click', function() {return saveText(parent)});
            parent.doneButton.addEventListener('click', function () {return doNote(parent)});
            parent.notDoneButton.addEventListener('click', function () {return undoNote(parent)});

        }
        var Note = function (message, idx) {

            var parent = this;
            initializeNote(parent, message, idx);
        }

        var List = new Array();
        //List.push(new Note('123', 1));
        //getFromLocal();
        function renderNote(note)
        {
            var curNote = document.createElement('li');
            var noteTextBox = note.textBox;
            noteTextBox.setAttribute('class', 'noteTextBox');
            noteTextBox.setAttribute('type', 'text');
            noteTextBox.setAttribute.disabled = true;
            noteTextBox.value = note.msg;
            console.log('Note is active: ', note.active);
            if(!note.active)
                noteTextBox.style.textDecoration = 'line-through';
            else
                noteTextBox.style.textDecoration = 'none';
            curNote.appendChild(noteTextBox);
            curNote.appendChild(note.deleteButton);
            curNote.appendChild(note.editButton);
            curNote.appendChild(note.saveButton);
            curNote.appendChild(note.doneButton);
            curNote.appendChild(note.notDoneButton);
            curNote.appendChild(note.addButton);
            if(note.subNotes.length > 0)
            {
                var newNote = document.createElement('ol');
                for(var i = 0; i < note.subNotes.length; i++)
                    newNote.appendChild(renderNote(note.subNotes[i]));
                curNote.appendChild(newNote);
            }
            return curNote;
        }

        function render()
        {
            notes.innerHTML = "";
            for(var i = 0; i < List.length; i++)
            {
                var renderList = renderNote(List[i]);
                notes.appendChild(renderList);
            }
            console.log(List);
            setToLocal();
        }

        function addNote(msg)
        {
            var newNote = new Note(msg, List.length);
            List.push(newNote);
            render();
        }

        function recheckNotes(Note)
        {
            console.log(Note);
            for(var i = 0; i < Note.subNotes.length; i++)
            {
                if(Note.subNotes[i].isdeleted)
                {
                    Note.subNotes.splice(i, 1);
                    i--;
                    continue;
                }
                if(Note.subNotes[i].subNotes.length > 0)
                    recheckNotes(Note.subNotes[i]);
            }
        }

        function updateList()
        {
            for(var i = 0; i < List.length; i++)
            {
                recheckNotes(List[i]);
                if(List[i].isdeleted)
                {
                    List.splice(i, 1);
                    i--;
                    continue;
                }
            }
        }


        function setTraverseNote(note)
        {
            var curNote = {};
            curNote.idx = note.idx;
            curNote.msg = note.msg;
            curNote.active = note.active;
            curNote.isdeleted = note.isdeleted;
            curNote.subNotes = new Array();
            for(var i = 0; i < note.subNotes.length; i++)
            {
                curNote.subNotes.push(setTraverseNote(note.subNotes[i]));
            }
            return curNote;
        }

        function getTraverseNote(notestate)
        {
            var note = new Note(notestate.msg, notestate.idx);
            if(notestate.isdeleted)
            {
                deleteNote(note.parent);
            }

            if(notestate.active)
            {
                note.doneButton.style.display = 'inline';
                note.notDoneButton.style.display = 'none';
            }
            else
            {
                note.doneButton.style.display = 'none';
                note.notDoneButton.style.display = 'inline';
            }

            for(var i = 0; i < notestate.subNotes.length; i++)
            {
                var newNote = getTraverseNote(notestate.subNotes[i]);
                note.subNotes.push(newNote);
            }
            return note;
        }
        function setToLocal()
        {
            var textList = new Array();
            for(var i = 0; i < List.length; i++)
            {
                textList.push(setTraverseNote(List[i]));
            }
            console.log(textList);
            localStorage.setItem('textList', JSON.stringify(List));
        }

        function getFromLocal() {
            var List2 = JSON.parse(localStorage.getItem('textList'));
            console.log(List2);
            List = new Array();
            for (var i = 0; i < List2.length; i++) {
                var curNote = getTraverseNote(List2[i]);
                List.push(curNote);
            }
            console.log(List);
        }
        var addNoteButton = document.getElementsByClassName('addnote')[0];
        var newnote = document.getElementsByClassName('newnote')[0];
        addNoteButton.addEventListener('click', function() {return addNote(newnote.value)});
        //localStorage.removeItem('List');
        getFromLocal();
        render();
    }
)();

/*
    To DO:
    Style The page
    Make the text box interesting
        - Highlight differently when editing
    Make a scroll-like structure?
    Give alternate colors to alternate sublists?
 */