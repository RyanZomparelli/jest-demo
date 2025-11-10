# Automated Testing: Testing Frameworks and Methods

This guide introduces automated testing with [Jest](https://jestjs.io/), including how to set up a simple project, write your first tests, read test output, and use core matcher functions.

---

## What Is a Testing Framework?

A **testing framework** is a set of libraries and tools that help you verify that your code behaves as expected.

Think of it like this:

> If we do **X**, we expect **Y**.

Examples:

- If we redesign a form button, requests should **still** reach the server.
- If we switch an image server, the image slider should **still** scroll correctly.

Automated tests let us formally encode these expectations so that changes to the codebase don’t silently break existing behavior.

---

## Example Project Setup (Jest Demo)

Create and initialize a new project:

```bash
mkdir jest-demo && cd jest-demo && npm init --yes
```

This:

- Creates a jest-demo directory.

- Enters it.

- Initializes package.json with default settings.

## Installing Jest

Install Jest as a development dependency:

npm install --save-dev jest

Update the scripts section of your package.json:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Now your tests can be run with:

```bash
npm run test
```

(We’ll add actual tests next.)

## Where to Write Tests

Use a naming convention so Jest can detect tests automatically.

- Main file: function.js

- Test file: function.test.js (same name + .test before extension)

Example project structure:

```text
jest-demo/
  function.js
  function.test.js
  package.json
```

## Example: Implementation File

```js
// function.js

const sayHello = (firstName, lastName) => {
  return `Hello, ${firstName} ${lastName}!`;
};

module.exports = sayHello;
```

## Writing Your First Test

Jest provides test() and it() (aliases):

```js
test("description of behavior", () => {
  // expectation
});

it("description of behavior", () => {
  // expectation
});
```

Use expect() plus matcher methods to compare actual vs expected values.

Example test for sayHello:

```js
// function.test.js

const sayHello = require("./function.js");

test("creates a greeting", () => {
  expect(sayHello("Lera", "Jackson")).toBe("Hello, Lera Jackson!");
});
```

```bash
Run:

npm run test

Example passing output:

PASS ./function.test.js
✓ creates a greeting (3 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
Snapshots: 0 total
Time: 1.747 s
Ran all test suites.
```

## Reading Failed Test Output

If implementation and expectation don’t match, Jest shows exactly what failed.

Example broken implementation:

```js
// function.js

const sayHello = (firstName, lastName) => {
  return `Hello, Mr. ${firstName} ${lastName}!`;
};

module.exports = sayHello;
```

Example test expecting different output:

```js
test("creates a greeting", () => {
  expect(sayHello("Lera", "Jackson")).toBe("Hello, Ms. Lera Jackson");
});
```

Example failing output:

```bash
FAIL ./function.test.js
✕ creates a greeting (12 ms)

● creates a greeting

expect(received).toBe(expected) // Object.is equality

Expected: "Hello, Ms. Lera Jackson"
Received: "Hello, Mr. Lera Jackson"

> 5 | expect(sayHello('Lera', 'Jackson')).toBe('Hello, Ms. Lera Jackson');

        |                                     ^
```

Jest reports:

- Which file failed

- Which test failed

- Expected vs received values

- The exact line where it failed

This makes locating and fixing issues much easier.

## Core Jest Matchers

Below are commonly used Jest matcher methods. All are used with expect().

**toBe()**

Strict equality (primitives and references).

```js
expect("Expectation").toBe("Expectation"); // passes

const a = {};
const b = a;
expect(a).toBe(b); // passes

expect("Expectation").toBe("Reality"); // fails

const x = {};
const y = {};
expect(x).toBe(y); // fails (different references)
```

**toEqual()**

Deep equality for objects and arrays (ignores extra properties in received object).

```js
// passes
expect({ a: undefined, b: 10, c: "text" }).toEqual({ b: 10, c: "text" });
expect([1, 2, 3]).toEqual([1, 2, 3]);
expect([[undefined, 1]]).toEqual([[, 1]]); // missing element vs undefined treated as equal

// fails
expect({ a: undefined, b: 10 }).toEqual({ a: 12, b: 10 });
expect([1, 2, 3, undefined]).toEqual([1, 2, 3]); // length differs
```

**toStrictEqual()**

Stricter deep equality — no extra props, and distinguishes missing vs undefined.

```js
// passes
expect({ b: 10, c: "text" }).toStrictEqual({ b: 10, c: "text" });
expect([3, 4, undefined]).toStrictEqual([3, 4, undefined]);

// fails
expect({ a: undefined, b: 10 }).toStrictEqual({ b: 10 }); // extra prop `a`
expect([[undefined, 1]]).toStrictEqual([[, 1]]); // missing vs undefined
```

**toBeTruthy() / toBeFalsy()**

Check JS truthiness / falsiness.

```js
// passes
expect(1).toBeTruthy();
expect(true).toBeTruthy();
expect(undefined).toBeFalsy();
expect(1 / "string").toBeFalsy(); // NaN is falsy

// fails
expect(null).toBeTruthy();
expect(0).toBeTruthy();
expect(true).toBeFalsy();
```

**toBeUndefined() / toBeDefined()**

Compare against undefined.

```js
// passes
expect(1).toBeDefined();
expect(null).toBeDefined();
expect("string").toBeDefined();

// fails
let x;
expect(x).toBeDefined(); // x is undefined
expect(undefined).toBeDefined();
```

**toBeNull()**

Specifically checks for null.

```js
const x = null;

// passes
expect(null).toBeNull();
expect(x).toBeNull();

// fails
expect(0).toBeNull();
expect(undefined).toBeNull();
expect("string").toBeNull();
```

**toMatch()**

Checks if a string matches a regular expression.

```js
// passes
expect("1").toMatch(/^\d+$/);
expect("1337").toMatch(/^\d+$/);
expect("4242").toMatch(/^\d+$/);

// fails
expect("21as1").toMatch(/^\d+$/);
expect("string").toMatch(/^\d+$/);
```

**toContain()**

Checks if an array (or string) contains a given item/substr.

```js
// passes
expect("Oh, hi Mark!").toContain("Mark");
expect(["Mary", "Louisa", "Stuart"]).toContain("Stuart");

// fails
expect("Oh, hi Mark!").toContain("Lisa");
expect(["Mary", "Louisa", "Stuart"]).toContain("Louise");
```

**Numeric Comparison Matchers**

- toBeGreaterThan()

- toBeGreaterThanOrEqual()

- toBeLessThan()

- toBeLessThanOrEqual()

```js
// passes
expect(2).toBeGreaterThan(1);
expect(2).toBeLessThan(3);
expect(2).toBeGreaterThanOrEqual(2);
expect(2).toBeLessThanOrEqual(2);

// fails
expect(2).toBeGreaterThan(2);
expect(2).toBeLessThan(2);
expect(2).toBeGreaterThanOrEqual(3);
expect(2).toBeLessThanOrEqual(1);
```

## Why Automated Tests Matter

- Catch regressions early: Quickly see when a change breaks existing behavior.

- Enable safe refactoring: Confidently clean up and improve code.

- Improve scalability: Larger codebases remain maintainable.

- Serve as documentation: Test names and expectations describe how the system should behave.

For a full list of Jest matchers, see the official docs: [expect](https://jestjs.io/docs/expect) API on the Jest website.

## Test Suites

In the previous lesson, we talked about unit testing. However, writing tests on its own isn't enough; we also need to organize these tests.

For example, let's say we need to test a registration request handler. This handler validates the data, calculates the password hash, and writes data to the database. Each of these operations is performed by a separate function, and the request handler calls them in turn. Since each of these functions constitutes a unit, we need to test them all.

Tests for units related to one big task should be grouped together in one "test suite". For example, all the methods in our handler perform part of the same task, so these might constitute a test suite. This will make it easier for us to change, modify, and read our tests. In this lesson, we'll talk about test suites.

Creating a Test Suite
The describe() function is used to define a test suite. It takes two parameters: the suite name (the description of what is being tested), and a callback function with tests.

```js
describe("Request handler tests", () => {
  test("should validate the data", () => {
    /* test code */
  });
  test("should calculate the password hash", () => {
    /* test code */
  });
  test("should write the data to the database", () => {
    /* test code */
  });
});
```

The describe() function adds some new information to the test result message:

```bash
  PASS  ./api.test.js
  User registration endpoint # the new line
  ✓ should validate the data (3ms)
  ✓ should calculate the password hash (5ms)
  ✓ should write the data to the database (7ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.747s
Ran all test suites.
```

So, let's sum everything up. Using the describe() method helps us organize tests properly. This saves us a lot of time when writing tests.
