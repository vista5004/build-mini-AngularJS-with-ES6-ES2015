/**
 * Created by tiantan on 2016/10/15.
 */

import Scope from '../scope';
import lodash from '../lodash';


describe("scope", function () {
  it("scope can be", function () {
    const scope=new Scope();
    scope.aProtptype=1;
    expect(scope.aProtptype).toBe(1);
  })
});

describe ("digest", function () {
  let scope;
  beforeEach(function () {
    scope=new Scope()
  });
  it("should call the listenFunction after $digest called", function () {
    const watchFn= function () {
      return "ret"
    };
    const ListenerFunc=jasmine.createSpy();
    scope.$watch(watchFn,ListenerFunc);
    scope.$digest();
    expect(ListenerFunc).toHaveBeenCalled();
  });
  it("watchFn should be called with scope after digest", function () {
    const watchFn=jasmine.createSpy();
    const ListenerFunc= function () {

    };
    scope.$watch(watchFn,ListenerFunc);
    scope.$digest();
    expect(watchFn).toHaveBeenCalledWith(scope)
  });
  it("call the listener function after the value change", function () {
    scope.someValue='a';
    scope.counter=0;
    scope.$watch(function (scope) {
        return scope.someValue;
    }, function (newValue, oldValue, scope) {
        scope.counter++;
    });
    expect(scope.counter).toBe(0);
    scope.$digest();
    expect(scope.counter).toBe(1);
    scope.$digest();
    expect(scope.counter).toBe(1);
    scope.someValue='b';
    expect(scope.counter).toBe(1);
    scope.$digest();
    expect(scope.counter).toBe(2);
  });
  it("call the listenerFun when watch value is first undefined", function () {
    scope.counter=0;
    scope.$watch(function (scope) {
      return scope.someValue
    }, function (newValue, oldValue, scope) {
      scope.counter++
    });
    scope.$digest();
    expect(scope.counter).toBe(1);
  });
  it("call the listener with new value as old value the first time", function () {
    scope.someValue=123;
    let oldValueGiven;
    scope.$watch(function (scope) {
      return scope.someValue;
    }, function (newValue,oldValue,scope) {
      oldValueGiven=oldValue;
    });
    scope.$digest();
    expect(oldValueGiven).toBe(123);
  });
  it("may have watcher omit the listener function", function () {
    let watchFunc=jasmine.createSpy().and.returnValue("something");
    scope.$watch(watchFunc);
    scope.$digest();
    expect(watchFunc).toHaveBeenCalled();
  });
  it("triggers chained watchers in the same digest", function () {
    scope.name='Jane';
    scope.$watch(function () {
      return scope.nameUpper;
    }, function (newValue,oldValue,scope) {
      if(newValue){
        scope.initial=newValue.substring(0,1)+'.';
      }
    });
    scope.$watch(function () {
      return scope.name;
    }, function (newValue, oldValue, socpe) {
      if(newValue){
        scope.nameUpper=newValue.toUpperCase();
      }
    });

    scope.$digest();
    expect(scope.initial).toBe('J.');
    scope.name='bob';
    scope.$digest();
    expect(scope.initial).toBe('B.');
  });
  it('give up on watcher after 10 times', function () {
    scope.valueA=0;
    scope.valueB=0;
    scope.$watch(function () {
      return scope.valueA;
    }, function (newValue, oldValue, scope) {
      scope.valueB++;
    });
    scope.$watch(function () {
      return scope.valueB;
    }, function (newValue, oldValue, scope) {
      scope.valueA++;
    });

    expect(function () {
      scope.$digest()
    }).toThrow();
  });
  it("end the digest when watch is clean", function () {
    let lo=new lodash();
    var watchExecutions=0;
    scope.array=lo.range(100);
    lo.times(100,function(i){
      "use strict";
      scope.$watch(function (scope) {
        watchExecutions++;
        return scope.array[i];
      }, function (newValue,oldValue,scope) {

      });
    });
    scope.$digest();
    expect(watchExecutions).toBe(200);
    scope.array[0]=120;
    scope.$digest();
    expect(watchExecutions).toBe(301);
  });
  it("do not end digest when the watch is in another watch", function () {
    scope.valueT="asd";
    scope.counter=0;
    scope.$watch(function () {
      return scope.valueT;
    }, function (newValue, oldValue, scope) {
      scope.$watch(function () {
        return scope.valueT;
      }, function (newValue, oldValue, scope) {
        scope.counter++;
      })
    });
    scope.$digest();
    expect(scope.counter).toBe(1);
  });
  it("compared based on value if enabled",function(){
    scope.aValue = [1, 2, 3];
    scope.counter=0;
    scope.$watch(function () {
      return scope.aValue;
    }, function (newValue, oldValue, scope) {
      scope.counter++;
    },true);
    scope.$digest();
    expect(scope.counter).toBe(1);
    scope.aValue.push(4);
    scope.$digest();
    expect(scope.counter).toBe(2);
  });
  it("correct handle the NANS", function () {
    scope.number=0/0;
    scope.counter=0;
    scope.$watch(function (scope) {
      return scope.number;
    }, function (newValue,oldValue,scope) {
      "use strict";
      scope.counter++;
    });
    scope.$digest();
    expect(scope.counter).toBe(1);
    scope.$digest();
    expect(scope.counter).toBe(1);
  });
  it("execute $eval'ed function and return the result", function () {
    scope.valueA=42;
    let result=scope.$eval(function (scope) {
      return scope.valueA;
    });
    expect(result).toBe(42);
  });
  it("pass the second argument to the $eval", function () {
    scope.valueB=42;
    let result=scope.$eval(function (scope, argument) {
      return scope.valueB+argument;
    },2);
    expect(result).toBe(44);
  });
  it("execute $apply'ed function and starts the digest", function () {
    scope.valueA="someValue";
    scope.counter=0;
    scope.$watch(function (scope) {
      return scope.valueA;
    }, function (newValue, oldValue, scope) {
      scope.counter++;
    });
    scope.$digest();
    expect(scope.counter).toBe(1);
    scope.$apply(function (scope) {
      scope.valueA="otherValue";
    });
    expect(scope.counter).toBe(2);
  });
  it("execute $evalAsync'ed function later in the same cycle", function () {
    scope.aValue=[1,2,3,4];
    scope.asyncEvaluated=false;
    scope.asyncEvaluatedImmediately=false;
    scope.$watch(function (scope) {
      return scope.aValue;
    }, function (newValue, oldValue, scope) {
      scope.$evalAsync(function () {
        scope.asyncEvaluated=true;//此处代码需等到digest执行的过程中才会执行，进去到asyncQueue数组中
      });
      scope.asyncEvaluatedImmediately=false;
    });
    scope.$digest();
    expect(scope.asyncEvaluated).toBe(true);
    expect(scope.asyncEvaluatedImmediately).toBe(false);
  });
  it("executes $evalAsync'ed functions added by watch functions", function () {
    scope.aValue=[1,2,3];
    scope.asyncEvaluated=false;
    scope.$watch(function (scope) {
      if(!scope.asyncEvaluated){
        scope.$evalAsync(function (scope) {
          scope.asyncEvaluated=true;
        })
      }
    }, function (newValue,oldValue,scope) {

    });
    scope.$digest();
    expect(scope.asyncEvaluated).toBe(true);
  });
  it("executes $evalAsync'ed functions even when not dirty", function () {
    scope.aValue=[1,2,3];
    scope.asyncEvaluatedTimes = 0;
    scope.$watch(function (scope) {
      if(scope.asyncEvaluatedTimes<2){
        scope.$evalAsync(function (scope) {
          scope.asyncEvaluatedTimes++
        })
      }
    }, function (newValue, oldValue, scope) {

    });
    scope.$digest();
    expect(scope.asyncEvaluatedTimes).toBe(2);
  });
  it("eventually halts $evalAsyncs added by watches", function () {
    scope.aValue=[1,2,3];
    scope.$watch(function (scope) {
      scope.$evalAsync(function () {

      });
      return scope.aValue;
    }, function (newValue, oldValue, scope) {

    });
    expect(function () {
      scope.$digest()
    }).toThrow();
  });
  it("has a $$phase field whose value is the current digest phase", function () {
    scope.aValue=[1,2,3];
    scope.phaseInWatchFunction=undefined;
    scope.phaseInListenerFunction=undefined;
    scope.phaseInApplyFunction=undefined;
    scope.$watch(function (scope) {
      scope.phaseInWatchFunction=scope.$$phase;
    }, function (newValue, oldValue, scope) {
      scope.phaseInListenerFunction=scope.$$phase;
    });
    scope.$apply(function (scope) {
      scope.phaseInApplyFunction=scope.$$phase;
    });
    expect(scope.phaseInWatchFunction).toBe("$digest");
    expect(scope.phaseInListenerFunction).toBe("$digest");
    expect(scope.phaseInApplyFunction).toBe("$apply");
  });
  it("schedules a digest in $evalAsync", function () {
    scope.aValue="abc";
    scope.counter=0;
    scope.$watch(function (scope) {
      return scope.aValue;
    }, function (newValue, oldValue, scope) {
      scope.counter++
    });
    scope.$evalAsync(function () {

    });
    expect(scope.counter).toBe(0);
    setTimeout(function () {
      expect(scope.counter).toBe(1);
      done()
    },50)
  });
  it("never executes $applyAsync'ed function in the same cycle", function () {
    scope.aValue = [1, 2, 3];
    scope.asyncApplied = false;
    scope.$watch(function (scope) {
      return scope.aValue;
    }, function (newValue, oldValue, scope) {
      scope.$applyAsync(function (scope) {
        scope.asyncApplied=true
      })
    });
    scope.$digest();
    expect(scope.asyncApplied).toBe(false);
    setTimeout(function () {
      expect(scope.asyncApplied).toBe(true);
      done();
    },50)


  })


});









