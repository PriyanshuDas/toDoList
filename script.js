(
    function() {
        var notes = document.getElementsByClassName("notes")[0];
        var Note = function (message, idx) {
            this.index = idx;
            this.msg = message;
            this.active = true;
            this.subNotes = new Array();
            this.isdeleted = false;
            this.deleteButton = document.createElement('button');
            this.editButton = document.createElement('button');
            this.addButton = document.createElement('button');
            this.saveButton = document.createElement('button');
            this.doneButton = document.createElement('button');
            this.notDoneButton = document.createElement('button');
            this.notDoneButton.innerHTML = 'Undo';
            this.doneButton.innerHTML = 'Done';
            this.saveButton.innerHTML = 'Save';
            this.textBox = document.createElement('input');
            this.textBox.setAttribute('type', 'text');
            this.textBox.disabled = true;
            this.addButton.innerHTML = '+';
            this.deleteButton.innerHTML = 'X';
            this.editButton.innerHTML = 'Edit';
            this.saveButton.disabled = true;
            var parent = this;
            this.setNote = function (msg) {
                this.msg = msg;
                render();
            }

            this.toggleActive = function()
            {
                parent.active = !(parent.active);
                console.log('Toggle to : ', parent.active);
                for (var i = 0; i < parent.subNotes.length; i++)
                    parent.subNotes[i].toggleActive();
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

            this.addSubNote = function(msg)
            {
                console.log('Adding '+msg+' to '+ parent.msg);
               var childNote = new Note(msg, parent.subNotes.length);
               parent.subNotes.push(childNote);
               console.log(parent.subNotes);
               render();
            }

            this.deleteNote = function ()
            {
                console.log('Deleting ' + parent);
                parent.isdeleted = true;
                updateList();
                render();
            }

            this.editNote = function()
            {
                parent.textBox.disabled = false;
                console.log('Editing ' + parent);
                parent.editButton.disabled = true;
                parent.saveButton.disabled = false;
                parent.saveButton.style.display = 'inline';
                parent.editButton.style.display = 'none';
            }

            this.saveText =function()
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

            this.deleteButton.addEventListener('click', this.deleteNote);
            this.editButton.addEventListener('click', this.editNote);
            this.addButton.addEventListener('click', function() {return parent.addSubNote('subnote')});
            this.saveButton.addEventListener('click', parent.saveText);
            this.doneButton.addEventListener('click', parent.toggleActive);
            this.notDoneButton.addEventListener('click', parent.toggleActive);
            parent.saveButton.style.display = 'none';
            parent.notDoneButton.style.display = 'none';
            //render();
        }

        var List = new Array();
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
            curNote.appendChild(note.addButton);
            curNote.appendChild(note.doneButton);
            curNote.appendChild(note.notDoneButton);
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
        var addNoteButton = document.getElementsByClassName('addnote')[0];
        var newnote = document.getElementsByClassName('newnote')[0];
        addNoteButton.addEventListener('click', function() {return addNote(newnote.value)});
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