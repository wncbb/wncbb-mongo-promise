var MongoClient=require('mongodb').MongoClient;
var ObjectID=require('mongodb').ObjectID;

class tdCollection{
    constructor(collection){
        this.collection=collection;
    }

    removeOne(selector, options={}){
        var that=this;
        return new Promise(function(resolve, reject){
            if(selector._id){
                selector._id=ObjectID(selector._id);
            }
            that.collection.removeOne(selector, options, function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });
        });
    }

    //updateOne(qryInfo, updateInfo, config={upsert: true}){
    updateOne(filter, update, options={}){
        var that=this;
        return new Promise(function(resolve, reject){
            if(filter._id){
                filter._id=ObjectID(filter._id);
            }
            console.log('filter');
            console.log(filter);
            that.collection.updateOne(filter, update, options, function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });
        });
    }

    updateMany(filter, update, options={}){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.updateMany(filter, update, options, function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });
        });
    }

    //既可以插入(saveInfo里没有_id),也可以更新(saveInfo里有_id,或者说替换,原有的数据都没了,用update是更新)
    save(doc, options={}){
        var that=this;
        if(doc._id){
            doc._id=ObjectID(doc._id);
        }
        return new Promise(function(resolve, reject){
            resolve(that.collection.save(doc, options));
        });
    }

    //insertInfo里有_id，则执行失败
    //insert

    insertOne(doc, options={}){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.insertOne(doc, options, function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });
        });
    }

    insertMany(doc){
        var that=this;
        return new Promise();
    }

    find(query={}){
        var that=this;
        if(query._id){
            query._id=ObjectID(query._id);
        }
        return new Promise(function(resolve, reject){
            that.collection.find(query).sort({_id:-1}).toArray(function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });

        });
    }
    findOne(query, options={}){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.findOne(query, options, function(err, rst){
                if(null!=err){
                    reject({code:-1, msg:err});
                }else{
                    resolve({code:1, data:rst});
                }
            });

        });
    }
}



class tdMongoPromise{
    constructor(url){
        this.url=url;
    }
    connect(){
        var that=this;
        return new Promise(function(resolve, reject){
            MongoClient.connect(that.url, function(err, db){
                if(null!=err){
                    reject(err);
                }else{
                    that.db=db; 
                    resolve(db);
                }
            })
        });
    }

    close(){
        var that=this;
        return new Promise(function(resolve, reject){
            resolve(that.db.close());
        });
    }

    collection(name){
        return new tdCollection(this.db.collection(name));
    }
    
};

tdMongoPromise.ObjectID=function(id){
    return ObjectID(id);
};

module.exports=tdMongoPromise;
