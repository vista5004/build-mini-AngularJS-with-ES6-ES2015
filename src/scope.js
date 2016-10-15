/**
 * Created by tiantan on 2016/10/15.
 */
class Scope{
  constructor(){
    this.$$watchers=[]
  }
  $watch(watcherFn,ListenerFunc){
    "use strict";
    const watcher={
      watchFn:watcherFn,
      ListenerFunc:ListenerFunc
    };
    this.$$watchers.push(watcher);
  }
  $digest(){
    "use strict";
    for(let watcher of this.$$watchers){
      watcher.ListenerFunc();
    }
  }
}

export default Scope;
