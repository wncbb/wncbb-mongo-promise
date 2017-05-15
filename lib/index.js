var MongoClient=require('mongodb').MongoClient;

class tdCollection{
    constructor(collection){
        this.collection=collection;
    }

    //既可以插入(saveInfo里没有_id),也可以更新(saveInfo里有_id)
    save(saveInfo){
        var that=this;
        return new Promise(function(resolve, reject){
            resolve(that.collection.save(saveInfo));
        });
    }

    //insertInfo里有_id，则执行失败
    //insert

    insertOne(insertInfo){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.insertOne(insertInfo, function(err, rst){
                if(null!=err){
                    reject(err);
                }else{
                    resolve(rst);
                }
            });
        });
    }

    insertMany(insertList){
        var that=this;
        return new Promise();
    }

    find(qryInfo={}){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.find(qryInfo).toArray(function(err, rst){
                if(null!=err){
                    reject(err);
                }else{
                    resolve(rst);
                }
            });

        });
    }
    findOne(qryInfo={}){
        var that=this;
        return new Promise(function(resolve, reject){
            that.collection.findOne(qryInfo, function(err, rst){
                if(null!=err){
                    reject(err);
                }else{
                    resolve(rst);
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


module.exports=tdMongoPromise;
