var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var NoteSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    collaborators: [{
        name: String,
        email: String
    }],
    labels:[{
        name: String
    }],
    isPinned: {
        type: Boolean
    },
    isArchive: {
        type: Boolean
    },
    isTrash: {
        type: Boolean
    },
    reminder: {
        type: String
    },
    color: {
        type: String
    },
    image: {
        type: String
    },
    owner: {
        name: String,
        email: String
    }
    }, {collection: 'userNotes'}
)

var Note = module.exports = mongoose.model('userNotes', NoteSchema);

/**
 * @description Saving of notes
 * @param {*} note 
 * @param {*} callback 
 */
module.exports.createNote = (note, callback) => {
    var id = mongoose.Types.ObjectId(note.noteId);
    note.noteId = id;
    note.save(callback);
}