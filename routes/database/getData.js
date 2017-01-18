var mongoClient = require('mongodb').MongoClient;
var exports = module.exports = {};

function getData(data,callback) {

        mongoClient.connect("mongodb://localhost:27017/sampleData", function(err, db) {
            if(!err) {

                console.log("Connected to database");

                db.collection('sampleFinances1').find({"user_id":data.user_id}).toArray(function(err, docs){
                    if(err){
                        callback(err); 
                    }
                    else{
                        callback(docs);
                    }
                });
            }
            else{
                callback(err);
            }

        });

}

exports.getData = getData;