/**
 * Created by tiantan on 2016/10/15.
 */
import _ from 'lodash';
import lodash from 'lodash';
function initWatchVal(){};
/*function deepClone(result,source){
    let self=this;
    for(let key of source){
      if(source === copy) continue;
      let copy=source[key];
      if(Object.prototype.toString.call(copy)==="[object Object]"){
        result[key]=self.deepClone(result[key]||{},copy);
      } else if(Object.prototype.toString.call(copy)==="[object Array]"){
        result[key]=self.deepClone(result[key]||{},copy);
      }else{
        return result[key]=copy;
      }
    }
    return result;
}*/
class Scope{
  constructor(){
    this.$$watchers=[];
    this.$$lastDirtyWatch=null;
  }
  $watch(watcherFn,ListenerFunc,valueEq){
    "use strict";
    const watcher={
      watchFn:watcherFn,
      ListenerFunc:ListenerFunc||function(){},
      last:initWatchVal,
      valueEq:!!valueEq
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch=null;
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
      if(!self.$$areEqual(newValue,oldValue,watcher.valueEq)){
        self.$$lastDirtyWatch=watcher;
        watcher.last=(watcher.valueEq ? _.cloneDeep(newValue) : newValue );
        watcher.ListenerFunc(newValue,(oldValue===initWatchVal?newValue:oldValue),self);
        dirty=true;
      }else if(self.$$lastDirtyWatch===watcher){
        return false
      }
    }
    return dirty;
  };
  $$areEqual(newValue,oldValue,valueEq){
    "use strict";
    let lo=new lodash();
    if(valueEq){
      return lo.isEqual(newValue,oldValue)
    }else{
      return newValue===oldValue;
    }
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
