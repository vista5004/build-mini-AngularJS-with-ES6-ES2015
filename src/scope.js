/**
 * Created by tiantan on 2016/10/15.
 */

function initWatchVal(){};

class Scope{
  constructor(){
    this.$$watchers=[];
    this.$$lastDirtyWatch=null;
  }
  $watch(watcherFn,ListenerFunc){
    "use strict";
    const watcher={
      watchFn:watcherFn,
      ListenerFunc:ListenerFunc||function(){},
      last:initWatchVal
    };
    this.$$watchers.push(watcher);
  }
  $$digestOnce(){
    "use strict";
    let self=this;
    let dirty;
    let newValue;
    let oldValue;
    for(let watcher of this.$$watchers){
     newValue=watcher.watchFn(self);
     oldValue=watcher.last;
      if(newValue!==oldValue){
        self.$$lastDirtyWatch=watcher;
        watcher.last=newValue;
        watcher.ListenerFunc(newValue,(oldValue===initWatchVal?newValue:oldValue),self);
        dirty=true;
      }else if(self.$$lastDirtyWatch===watcher){
        return false
      }
    }
    return dirty;
  };
  $digest(){
    let dirty;
    let TTL=10;
    this.$$lastDirtyWatch=null;
    do{
      dirty=this.$$digestOnce();
      if(dirty && !(TTL--)){
        throw "10 times limited"
      }
    } while(dirty)
  }
}

export default Scope;
