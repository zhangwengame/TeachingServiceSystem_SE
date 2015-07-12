var debug = require('debug')('resource');
var File = require("./basicfileop");
var filetree = require("../../db/resource/pan");
var Tree = {};
Array.prototype.remove=function(index){  
  var len = this.length;
  for (var i = index; i < len  ; i++)
  {
    this[i] = this[i+1];
  }
  this.pop();
};
Tree.refreshAndSend = function(res, newtree, uid){
  var newdata = {
      uid : uid,
      tree : newtree
    };
    filetree.updatetree(uid, newdata, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.json({code:200,newTree: newtree});
      }
    });
};
Tree.newnode = function(path, ws, treeP, callback) {
      console.log(ws);
      console.log("new node");
      var nowtreeP = treeP;
      path.split('\.').forEach(function(foldername) {
        var nexttreeP = nowtreeP;
        nowtreeP.forEach(function(node) {
          if (node.text == foldername) {
            nexttreeP = node.children;
          }
        });
        nowtreeP = nexttreeP;
      });
      var newnode;
      console.log("find path ok");
      if (ws.isFolder == 1)
      {
        console.log("isFloder");
        newnode = {
          text: ws.filename,
          children : [],
          isFolder : 1
        }
        nowtreeP.push(newnode);
        callback(null);
      }
      else{
        console.log(ws);
        newnode = {
          fid: ws.id,
          isFolder : 0
        }
        console.log(newnode);
        File.infobyid(ws.id, function(err,info) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else{
                console.log(info);
                newnode.text = info.filename;
                newnode.size = info.length;
                nowtreeP.push(newnode);
                callback(null);
            }
        });
        /*find by id */
      }
     
      
    };
Tree.delnode = function(path, name, treeP, flag, callback) {
      console.log("new node");
      var nowtreeP = treeP;
      path.split('\.').forEach(function(foldername) {
        var nexttreeP = nowtreeP;
        console.log("in splite")
        nowtreeP.forEach(function(node) {
          if (node.text == foldername) {
            nexttreeP = node.children;
          }
        });
        nowtreeP = nexttreeP;
      });
      var indexx=0,index;
      console.log(name);
      nowtreeP.forEach(function(node) {
        indexx++;
        if (node.text == name) {
            console.log('find');
            index=indexx-1;
            return true;
        } 
      });
      console.log(index);
      if (nowtreeP[index].isFolder == 1 || flag == 0){
        //TODO: recursive delete all node;
        nowtreeP.remove(index);
        console.log(nowtreeP);
        callback(null);
      }
      else
      {
        File.removebyid(nowtreeP[index].fid, function(error) {
          if (error){
            console.log(error);
          } else {
            nowtreeP.remove(index);
            callback(null);
          }
        });
      }     
    };
Tree.move = function(oldpath, name, newpath, treeP, fromtreeP, moveFlag, callback) {
      console.log("new node");
      var nowtreeP = fromtreeP;
      oldpath.split('\.').forEach(function(foldername) {
        var nexttreeP = nowtreeP;
        console.log("in splite");
        console.log(foldername);
        console.log(nowtreeP);
        nowtreeP.forEach(function(node) {
          if (node.text == foldername) {
            nexttreeP = node.children;
          }
        });
        nowtreeP = nexttreeP;
      });
      var indexx=0,index;
      console.log(name);
      nowtreeP.forEach(function(node) {
        indexx++;
        if (node.text == name) {
            console.log('find');
            index=indexx-1;
            return true;
        } 
      });
      console.log(index);
      var nowtreeP2 = treeP;
      newpath.split('\.').forEach(function(foldername) {
        var nexttreeP = nowtreeP2;
        console.log("in splite")
        console.log(foldername)
        console.log(nowtreeP2);
        nowtreeP2.forEach(function(node) {
          if (node.text == foldername) {
            nexttreeP = node.children;
          }
        });
        nowtreeP2 = nexttreeP;
      });
      nowtreeP2.push(nowtreeP[index]);
      debug("nowtreeP2:"+nowtreeP);
      debug("treeP:"+treeP);
      if (moveFlag == 1)
      	 nowtreeP.remove(index);
      callback(null);
    };
Tree.renamenode = function(path, oname, nname, treeP, callback) {
      console.log("new node");
      var nowtreeP = treeP;
      path.split('\.').forEach(function(foldername) {
        var nexttreeP = nowtreeP;
        console.log("in splite")
        console.log(foldername)
        console.log(nowtreeP);
        nowtreeP.forEach(function(node) {
          if (node.text == foldername) {
            nexttreeP = node.children;
          }
        });
        nowtreeP = nexttreeP;
      });
      var indexx=0,index;
      nowtreeP.forEach(function(node) {
        indexx++;
        if (node.text == oname) {
            console.log('find');
            index=indexx-1;
            return true;
        } 
      });
      console.log(index);
      nowtreeP[index].text = nname;
      callback(null);
    };
module.exports = Tree;