import { useState } from "react";
import './App.css';

type Note = {
  id: number;
  storedDate: string;
  noteTitle: string;
  noteContent: string;
}

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const formatContent = (content: string) => {
  const isList = content.split('\n').every((line) => line.trim().match(/^(\d+\.|[*-])/));
  if (isList) {
    return content
      .split('\n')
      .map((line, index) => `${index + 1}. ${line}`)
      .join('\n');
  } else {
    return content;
  }
};

const App = () => {
  const [prevNotes, savedNotes] = useState<Note[]>([

  ]);

  const [noteTitle, setTitle]= useState("");
  const [noteContent, setContent] = useState("");
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const selectPreviousNote = (prevNote:Note) => {
    setSelectedNote(prevNote);
    setTitle(prevNote.noteTitle);
    setContent(prevNote.noteContent);
  };

  const saveNote = (event: React.FormEvent ) => {
    event.preventDefault();

    const savedDate = formatDate(new Date());
    const formattedContent = formatContent(noteContent);  

    console.log("date: ", savedDate);
    console.log("title: ", noteTitle);
    console.log("content: ", formattedContent);

    const savedNote: Note = {
      id: prevNotes.length + 1,
      storedDate: savedDate,
      noteTitle: noteTitle,
      noteContent: formattedContent,
    };

    savedNotes([savedNote, ...prevNotes]);
    setTitle("");
    setContent("");
  };

  const editNote  = (event: React.FormEvent) => {
    event.preventDefault();
    const savedDate = formatDate(new Date());

    if (!selectedNote) {
      return;
    }

    const editedNote: Note = {
      id: selectedNote.id,
      storedDate: savedDate,
      noteTitle: noteTitle,
      noteContent: noteContent,
    }

    const editedNotes = prevNotes.map((prevNote) => 
      prevNote.id === selectedNote.id ? editedNote : prevNote
    )

    savedNotes(editedNotes)
    setTitle("")
    setContent("")
    setSelectedNote(null);
  };

  const cancelEdit = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null);
  };

  const deleteNote = (event:React.FormEvent, prevNoteId: number) => {
    event.stopPropagation();

    const notesList = prevNotes.filter((prevNote) => prevNote.id !== prevNoteId
    )

    savedNotes(notesList);
  };

  return (
    <div className="full-app-display">
      <div className="note-display">
        <form className="new-note" onSubmit={(event) => selectedNote ? editNote(event) : saveNote(event)}>
          <input value={noteTitle} onChange={(event) => setTitle(event.target.value)} placeholder="Enter note title here..." required
          />
          <textarea value={noteContent} onChange={(event) => setContent(event.target.value)} placeholder="Enter note content here..." rows={10} required></textarea>
          {selectedNote ? (
            <div className="edit-cancel-buttons">
              <button type="submit">Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Save note</button>
          )}          
        </form>
      </div>
      <div className="prev-notes-display">
        {prevNotes.map((prevNote) => (
          <div key={prevNote.id} className="prev-note">
              <h2 className="title">{prevNote.noteTitle}</h2>
              <button className="edit-button" onClick={() => selectPreviousNote(prevNote)}>Edit</button>
              <button className="delete-button" onClick={(event) => deleteNote(event, prevNote.id)}>Delete</button>
              <p className ="pr-nt-date"> {prevNote.storedDate} </p>
              <pre className="pr-nt-content">{prevNote.noteContent}</pre>
        </div>
        ))}
      </div>
    </div>
  );
};

export default App;