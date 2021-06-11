module.exports = function timestamp(schema) {

  // Add the two fields to the schema
  schema.add({ 
    created_on: Date,
    updated_on: Date
  })

  // Create a pre-save hook
  schema.pre('save', function (next) {
    let now = new Date()
    
    this.updated_on = now
    // Set a value for created_on only if it is null
    if (!this.created_on) {
      this.created_on = now
    }


   // Call the next function (if any) in the pre-save chain
   next()    
  })
}