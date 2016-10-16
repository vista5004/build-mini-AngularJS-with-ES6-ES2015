/**
 * Created by tiantan on 2016/10/15.
 */

function initWatchVal(){};

class Scope{
  constructor(){
    this.$$watchers=[]
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
  $digest(){
    "use strict";
    let self=this;

    for(let watcher of this.$$watchers){
      const newValue=watcher.watchFn(self);
      const oldValue=watcher.last;
      if(newValue!==oldValue){
        watcher.last=newValue;
        watcher.ListenerFunc(newValue,(oldValue===initWatchVal?newValue:oldValue),self);
      }
    }
  };




}

export default Scope;
