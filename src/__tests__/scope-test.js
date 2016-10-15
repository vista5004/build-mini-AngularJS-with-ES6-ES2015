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
  })

});









