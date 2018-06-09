// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by yield-method.js.
import { name as packageName } from "meteor/dmihal:yield-method";

// Write your tests here!
// Here is an example.
Tinytest.add('yield-method - example', function (test) {
  test.equal(packageName, "yield-method");
});
