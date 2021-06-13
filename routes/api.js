'use strict';
const IssueModel = require('../models/issue.model.js')

module.exports = function (app) {

  app.route('/api/issues/:project')

    // GET an array of all issues for a :project parameter
    // Optionally, filter the request by also passing along any field and value as a URL query
    .get(function (req, res) {
      const project = req.params.project;
      const filter = { project }

      if (req.query._id) {
        filter._id = req.query._id
      }
      if (req.query.open) {
        filter.open = req.query.open
      }
      if (req.query.assigned_to) {
        filter.assigned_to = req.query.assigned_to
      }
      if (req.query.requested_by) {
        filter.requested_by = req.query.requested_by
      }
      if (req.query.issue_title) {
        filter.issue_title = req.query.issue_title
      }
      if (req.query.issue_text) {
        filter.issue_text = req.query.issue_text
      }
      if (req.query.status_text) {
        filter.status_text = req.query.status_text
      }
      if (req.query.created_on) {
        filter.created_on = req.query.created_on
      }
      if (req.query.updated_on) {
        filter.updated_on = req.query.updated_on
      }

      IssueModel.find(filter, { project: 0, __v: 0 }, (err, docs) => {
        if (err) return console.log(err)

        res.status(200).send(docs)
      })

        .catch(err => {
          res.status(500).json(err)
        })
    })

    // POST => Create new issue
    .post(function (req, res) {
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.status(200).send({ error: 'required field(s) missing' }) // Changed from 400; FCC expects a 200 status.
      }

      const project = req.params.project
      const { issue_title, issue_text, created_by, assigned_to, open, status_text } = req.body

      const newIssue = new IssueModel({ project, issue_title, issue_text, created_by, assigned_to, open, status_text })

      newIssue.save().then(doc => {
        if (!doc || doc.length === 0) {
          return res.status(500).send(doc)
        }

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
    .put(function (req, res) {
      if (!req.body._id) {
        return res.status(200).send({ error: 'missing _id' })
      }
      const project = req.params.project;

      const _id = req.body._id
      const update = {}

      if (req.body.open) {
        update.open = req.body.open
      }
      if (req.body.assigned_to) {
        update.assigned_to = req.body.assigned_to
      }
      if (req.body.requested_by) {
        update.requested_by = req.body.requested_by
      }
      if (req.body.issue_title) {
        update.issue_title = req.body.issue_title
      }
      if (req.body.issue_text) {
        update.issue_text = req.body.issue_text
      }
      if (req.body.status_text) {
        update.status_text = req.body.status_text
      }

      if (Object.keys(update).length === 0) {
        return res.status(200).send({
          error: 'no update field(s) sent',
          _id: _id
        })
      }

      IssueModel.findOneAndUpdate({ project, _id }, update, { new: true }, (err, doc) => {
        if (!doc) {
          res.status(200).send({
            error: "could not update",
            _id: _id
          })
        } else {
          res.status(200).send({ result: 'successfully updated', _id: doc._id })
        }
      })

        .catch(err => {
          res.status(500).json(err)
        })
    })

    // DELETE issue
    .delete(function (req, res) {
      if (!req.body._id) {
        return res.status(200).send({ error: 'missing _id' })
      }
      const project = req.params.project;
      const _id = req.body._id

      IssueModel.findOneAndDelete({ project, _id }, (err, doc) => {
        if (!doc) {
          res.status(200).send({
            error: "could not delete",
            _id: _id
          })
        } else {
          res.status(200).send({ result: 'successfully deleted', _id: doc._id })
        }
      })

        .catch(err => {
          res.status(500).json(err)
        })
    });

};