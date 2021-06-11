'use strict';
const IssueModel = require('../models/issue.model.js')

module.exports = function (app) {

  app.route('/api/issues/:project')

    // GET
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    // POST => Create new issue
    .post(function (req, res){
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.status(400).send('Required field(s) missing')
      }

      const project = req.params.project
      const { issue_title, issue_text, created_by, assigned_to, open, status_text } = req.body

      const issue = new IssueModel({ project, issue_title, issue_text, created_by, assigned_to, open, status_text })
      
        issue.save().then(doc => {
        if (!doc || doc.length === 0) {
          return res.status(500).send(doc)
        }
        
        // res.status(200).json(doc)
        
        res.status(200).json({
          _id: doc._id,
          issue_title: doc.issue_title,
          issue_text: doc.issue_text,
          created_by: doc.created_by,
          assigned_to: doc.assigned_to,
          open: doc.open,
          status_text: doc.status_text,
          created_on: doc.created_on,    //.toDateString()
          updated_on: doc.updated_on     //.toDateString()
        })
      })
        .catch(err => {
          res.status(500).json(err)
        })     
    })
    
    // PUT => Update issue
    .put(function (req, res){
      let project = req.params.project;
      
    })

    // DELETE issue
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
