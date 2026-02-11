// Browser polyfill for Node's `assert` module.
// Used by @babel/helper-module-imports which calls assert(condition) directly.
function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message || 'Assertion failed');
  }
}

assert.ok = assert;

assert.fail = (message?: string) => {
  throw new Error(message || 'Assertion failed');
};

export default assert;
export { assert };
