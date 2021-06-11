const mongoose = require('mongoose')
const timestampPlugin = require('./plugins/timestamp')

// Schema
const IssueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  open: Boolean,
  status_text: String
})

// Add timestamp from pre-save plugin
IssueSchema.plugin(timestampPlugin)

// Export Model Constructor
module.exports = mongoose.model('Issue', IssueSchema)