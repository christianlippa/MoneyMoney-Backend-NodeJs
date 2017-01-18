var mongoClient = require('mongodb').MongoClient;
var exports = module.exports = {};

function insertData(data,callback) {

// Example of a simple insertOne operation

mongoClient.connect('mongodb://test1:test1@localhost:27017/sampleData', function(err, db) {

if(!err){
console.log("Connected to database");
db.collection('sampleFinances1').insert({"user_id":data.user_id,
      "type":data.type,
      "amount":data.amount,
      "desc":data.desc,
      "category":data.category,
      "date":data.date}, function(err, r) {
        if(err){
          callback(err);
        }
        else{
          callback();
        }
      
  });
  }
  else{
    callback(err)
  }
});

}

exports.insertData = insertData;