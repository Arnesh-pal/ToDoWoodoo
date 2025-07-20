"use client";
import { useState, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ content: "", color: "#ffeb3b" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to fetch notes");
        setNotes(await res.json());
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchNotes();
  }, []);

  // Handle clicks outside the emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addNote = async () => {
    if (!newNote.content.trim()) return;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (!res.ok) throw new Error("Failed to add note");

      const savedNote = await res.json();
      setNotes([savedNote, ...notes]);
      setNewNote({ content: "", color: "#ffeb3b" }); // Reset form
    } catch (err) {
      console.error("Add note error:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-bold text-foreground mb-4">📝 Sticky Notes</h2>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow overflow-y-auto pr-2 min-h-[200px]">
        {notes.map((note) => (
          <div
            key={note.id}
            className="relative p-4 rounded-md shadow-md text-black transition-transform transform hover:scale-105 border border-black/10"
            style={{ backgroundColor: note.color }}
          >
            <button
              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
              onClick={() => deleteNote(note.id)}
              aria-label="Delete note"
            >
              &times;
            </button>
            <div className="whitespace-pre-wrap break-words mt-2">{note.content}</div>
          </div>
        ))}
      </div>

      {/* Add New Note Form */}
      <div className="mt-4 pt-4 border-t border-border">
        <textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="w-full p-2 rounded-md bg-muted text-foreground border-border focus:border-primary focus:ring-0 placeholder:text-muted-foreground min-h-[80px]"
          placeholder="Write your note..."
        />
        <div className="flex items-center gap-4 mt-2">
          <input
            type="color"
            value={newNote.color}
            onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
            title="Pick background color"
          />
          <div className="relative">
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute z-20 bottom-full mb-2">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => {
                    setNewNote({ ...newNote, content: newNote.content + emoji.native });
                    setShowEmojiPicker(false);
                  }}
                  theme="dark"
                />
              </div>
            )}
          </div>
          <button
            className="ml-auto px-4 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={addNote}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}