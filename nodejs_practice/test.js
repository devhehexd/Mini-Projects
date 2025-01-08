const { expect } = require('chai');

function add(a, b) {
  return a + b;
}

describe('add function', () => {
  it('should return the sum of two numbers', () => {
    expect(add(3, 3)).to.equal(5);
  })
})