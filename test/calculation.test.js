import assert from 'assert';
import test from '../src/calculation.js';

describe("Mocha test", () => {
  it("test is 3", () => {
      assert.equal(test(), 3);
  });
});
