/**
 * Created by tiantan on 2016/10/15.
 */

import Scope from '../scope';

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
  })
});









