/**
 * Created by tiantan on 2016/10/23.
 */
class lodash{
  constructor(){
  }
  range(start,stop,step){
    if(arguments.length<=1){
      stop=start||0;
      start=0;
    }
    step=arguments[2]||1;
    let length=Math.max(Math.ceil((stop-start)/step),0);
    let array=new Array(length);
    let index=0;
    while(index<length){
      array[index]=index+step;
      index++;
    }
    return array;
  }
  times(n,callback,context){
    "use strict";
    for(let i=0;i<n;i++){
      callback.call(context,i);
    }
  }
  deepClone(result,source){
    "use strict";
    let self=this;
    let copy=source[key];
    for(let key of source){
      if(source === copy) continue;
      if(self.isObject(copy)){
        result[key]=self.deepClone(result[key]||{},copy);
      } else if(self.isArray(copy)){
        result[key]=self.deepClone(result[key]||{},copy);
      }else{
        return result[key]=copy;
      }
    }
    return result;
  };
  isObject(obj){
    "use strict";
    return Object.prototype.toString.call(obj)==="[object Object]";
  };
  isArray(array){
    "use strict";
    return Object.prototype.toString.call(array)==="[object Array]";
  };
  isEqual(a,b){
    "use strict";
    function eq(a, b, stack) {

      if(a === b)
        return a !== 0 || 1 / a == 1 / b;
      if(a == null || b == null)
        return a === b;
      if(a.isEqual && _.isFunction(a.isEqual))
        return a.isEqual(b);
      if(b.isEqual && _.isFunction(b.isEqual))
        return b.isEqual(a);

      var className = toString.call(a);
      if(className != toString.call(b))
        return false;
      switch (className) {
        case '[object String]':
          return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':

        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
      }
      if( typeof a != 'object' || typeof b != 'object')
        return false;
      var length = stack.length;
      while(length--) {

        if(stack[length] == a)
          return true;
      }
      stack.push(a);
      var size = 0, result = true;
      if(className == '[object Array]') {
        size = a.length;
        result = size == b.length;
        if(result) {
          while(size--) {
            if(!( result = size in a == size in b && eq(a[size], b[size], stack)))
              break;
          }
        }
      } else {

        if('constructor' in a != 'constructor' in b || a.constructor != b.constructor)
          return false;

        for(var key in a) {
          if(_.has(a, key)) {
            size++;
            if(!( result = _.has(b, key) && eq(a[key], b[key], stack)))
              break;
          }
        }
        if(result) {
          for(key in b) {
            if(_.has(b, key) && !(size--))
              break;
          }
          result = !size;
        }
      }
      stack.pop();
      return result;
    }
  return eq(a,b,[]);
  }
}
export default lodash;
