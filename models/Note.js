const mongoose = require('mongoose')
const { Schema } = mongoose; //for use mongoose schemas
const NoteSchema= new Schema({
            user :{
                type: mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            title :{
               type : String,
               require : true,
            },
            description :{
                type: String,
                require:true
            },
            tag :{
                 type: String,
                 default:'general'
            },
            date :{
                type: Date,
                default:Date.now
            }
  });
  const Note =mongoose.model('note',NoteSchema);
  module.exports = Note;