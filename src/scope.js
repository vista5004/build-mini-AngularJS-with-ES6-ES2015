/**
 * Created by tiantan on 2016/10/15.
 */
import _ from 'lodash';
import lodash from 'lodash';
function initWatchVal(){};

class Scope{
  constructor(){
    this.$$watchers=[];
    this.$$lastDirtyWatch=null;
    this.$$asyncQueue=[];
  }
  $watch(watcherFn,ListenerFunc,valueEq){
    "use strict";
    let watcher={
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
        watcher.last=watcher.valueEq ? _.cloneDeep(newValue) : newValue ;
        watcher.ListenerFunc(newValue,(oldValue === initWatchVal? newValue : oldValue),self);
        dirty=true;
      }else if(self.$$lastDirtyWatch === watcher){
        return false;
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
      return newValue===oldValue || (typeof newValue==="number" && typeof oldValue ==="number" && isNaN(newValue) && isNaN(oldValue));
    }
  };
  $digest(){
    let dirty;
    let TTL=10;
    this.$$lastDirtyWatch=null;
    do{
      while(this.$$asyncQueue.length){
        let asyncTask =this.$$asyncQueue.shift();
        asyncTask.scope.$eval(asyncTask.expression);
      }
      dirty=this.$$digestOnce();
      if(dirty && !(TTL--)){
        throw "10 times limited"
      }
    } while(dirty)
  };
  $eval(exp,locals){
    "use strict";
    return exp(this,locals);
  };
  $apply(expr){
    "use strict";
    try{
      return this.$eval(expr)
    }finally{
      this.$digest();
    }
  };
  $evalAsync(expr){
    "use strict";
    this.$$asyncQueue.push({
      scope:this,
      expression:expr
    })
  };
}

export default Scope;
