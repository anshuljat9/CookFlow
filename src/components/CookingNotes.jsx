import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { formatDuration } from '../utils/recipeUtils';
import Button from './Button';

export default function CookingNotes({
  notes,
  currentStep,
  onAddNote,
  onDeleteNote,
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const stepNotes = notes.filter(n => n.stepIndex === currentStep);
  const otherNotes = notes.filter(n => n.stepIndex !== currentStep);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(currentStep, newNoteText.trim());
      setNewNoteText('');
      setShowNoteInput(false);
    }
  };

  const handleEditSave = (noteId) => {
    if (editText.trim()) {
      onDeleteNote(noteId);
      onAddNote(currentStep, editText.trim());
      setEditingNoteId(null);
      setEditText('');
    }
  };

  const handleEditCancel = () => {
    setEditingNoteId(null);
    setEditText('');
  };

  const handleEditStart = (note) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
  };

  return (
    <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="notes-heading">
      <div className="p-4 lg:p-6">
        <h2 id="notes-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-500" />
          Cooking Notes
        </h2>

        {!showNoteInput && !editingNoteId && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowNoteInput(true)}
            className="w-full mb-4"
          >
            Add Note for This Step
          </Button>
        )}

        {showNoteInput && (
          <form onSubmit={handleAddNote} className="space-y-2 mb-4">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g., Used less chili, added extra garlic..."
              className="input bg-charcoal-800 text-white min-h-[80px] resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => { setNewNoteText(''); setShowNoteInput(false); }}>
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={!newNoteText.trim()}>
                Save Note
              </Button>
            </div>
          </form>
        )}

        {editingNoteId && (
          <form onSubmit={(e) => { e.preventDefault(); handleEditSave(editingNoteId); }} className="space-y-2 mb-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input bg-charcoal-800 text-white min-h-[80px] resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={!editText.trim()}>
                Save
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {stepNotes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-charcoal-400 mb-2">This Step</h3>
              <div className="space-y-2">
                {stepNotes.map(note => (
                  <div key={note.id} className="p-3 rounded-xl bg-charcoal-800">
                    {editingNoteId === note.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-charcoal-400">Editing...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-white mb-2">{note.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-charcoal-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(Math.floor((Date.now() - note.createdAt) / 1000))} ago
                          </span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditStart(note)} aria-label="Edit note">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} aria-label="Delete note">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherNotes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-charcoal-400 mb-2 mt-4">Other Steps</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {otherNotes.slice().reverse().map(note => (
                  <div key={note.id} className="p-3 rounded-xl bg-charcoal-800">
                    <p className="text-xs text-charcoal-400 mb-1">Step {note.stepIndex + 1}</p>
                    <p className="text-sm text-white mb-2">{note.text}</p>
                    <span className="text-xs text-charcoal-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(Math.floor((Date.now() - note.createdAt) / 1000))} ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notes.length === 0 && (
            <p className="text-charcoal-400 text-center py-8">No notes yet. Add your first note!</p>
          )}
        </div>
      </div>
    </section>
  );
}