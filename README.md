
# This is a bug.

* Jest: 27.0.6
* @babel/preset-env: 7.14.8,

Run `jest test.js` and you will get:

```
 FAIL  ./test.js
  ● Test suite failed to run

    TypeError: Cannot read property 'indexOf' of undefined



      at _objectWithoutPropertiesLoose (test.js:28:234)
      at _objectWithoutProperties (test.js:26:99)
      at test.js:5:3
      at Object.<anonymous> (test.js:1:1)
 ```

The problem is that jest hoists the whole `jest.mock('fs', () => ...)` block up to the top above all other code, and this happens _after_ babel adds all it's helpers. `@babel/preset-env` transforms this object spread away: `const {writeFileSync, ...rest} = jest.requireActual('fs');`

The result looks like this:

```

_getJestObj().mock('fs', function () {
  var _jest$requireActual = jest.requireActual('fs'),
      _writeFileSync = _jest$requireActual.writeFileSync,
      rest = _objectWithoutProperties(_jest$requireActual, _excluded);

  return _objectSpread(_objectSpread({}, rest), {}, {
    writeFileSync: function writeFileSync() {
      debugger;
      mockWriteFileSync.apply(void 0, arguments);
      return _writeFileSync.apply(void 0, arguments);
    }
  });
});

var _fs = require("fs");

var _excluded = ["writeFileSync"];

// ...
```

Note how `_excluded` is _after_ the mock code. That doesn't work for some reason (although I thought _var_ would work like this...). `_excluded` is `undefined` when passed into `_objectWithoutProperties` and causing this exception.