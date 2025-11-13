# Automated Testing: Testing Frameworks and Methods

This guide introduces automated testing with [Jest](https://jestjs.io/), including how to set up a simple project, write your first tests, read test output, and use core matcher functions.

## Table of Contents

- [Automated Testing: Testing Frameworks and Methods](#automated-testing-testing-frameworks-and-methods)
  - [What Is a Testing Framework?](#what-is-a-testing-framework)
  - [Example Project Setup (Jest Demo)](#example-project-setup-jest-demo)
  - [Installing Jest](#installing-jest)
  - [Where to Write Tests](#where-to-write-tests)
  - [Example: Implementation File](#example-implementation-file)
  - [Writing Your First Test](#writing-your-first-test)
  - [Reading Failed Test Output](#reading-failed-test-output)
  - [Core Jest Matchers](#core-jest-matchers)
    - [toBe](#tobe)
    - [toEqual](#toequal)
    - [toStrictEqual](#tostrictequal)
    - [toBeTruthy / toBeFalsy](#tobetruthy--tobefalsy)
    - [toBeUndefined / toBeDefined](#tobeundefined--tobedefined)
    - [toBeNull](#tobenull)
    - [toMatch](#tomatch)
    - [toContain](#tocontain)
    - [Numeric Comparison Matchers](#numeric-comparison-matchers)
  - [Why Automated Tests Matter](#why-automated-tests-matter)
  - [Test Suites](#test-suites)
  - [Testing HTTP Requests](#testing-http-requests)
    - [Preparing the Project for Testing](#preparing-the-project-for-testing)
    - [Installing SuperTest](#installing-supertest)
    - [Checking Request Sending](#checking-request-sending)
    - [Configuring Requests](#configuring-requests)

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

#### toBe()

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

#### toEqual()

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

#### toStrictEqual()

Stricter deep equality — no extra props, and distinguishes missing vs undefined.

```js
// passes
expect({ b: 10, c: "text" }).toStrictEqual({ b: 10, c: "text" });
expect([3, 4, undefined]).toStrictEqual([3, 4, undefined]);

// fails
expect({ a: undefined, b: 10 }).toStrictEqual({ b: 10 }); // extra prop `a`
expect([[undefined, 1]]).toStrictEqual([[, 1]]); // missing vs undefined
```

#### toBeTruthy() / toBeFalsy()

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

#### toBeUndefined() / toBeDefined()

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

#### toBeNull()

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

#### toMatch()

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

#### toContain()

Checks if an array (or string) contains a given item/substr.

```js
// passes
expect("Oh, hi Mark!").toContain("Mark");
expect(["Mary", "Louisa", "Stuart"]).toContain("Stuart");

// fails
expect("Oh, hi Mark!").toContain("Lisa");
expect(["Mary", "Louisa", "Stuart"]).toContain("Louise");
```

#### Numeric Comparison Matchers

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

## Testing HTTP Requests

In the chapter about asynchronous code, we used an external API: https://se-quotes-api.onrender.com. One day, the se-quotes-api engineers may change the rules for accessing their API, and our project will stop working.

To account for this, we'll need to write some tests for our request handlers. In this lesson, we'll talk about the [SuperTest library](https://github.com/forwardemail/supertest#readme), which provides convenient tools for creating such tests.

### Preparing the Project for Testing

In order to test the server, we'll need to slightly modify the project structure. We need to prevent SuperTest from calling app.listen() when it runs its tests.

SuperTest works as follows:
**start testing → connect to the server → run tests → disconnect from the server → finish tests.**
The main takeaway here is that SuperTest takes charge of connecting to and from the server.

But SuperTest does this on its own, it doesn’t need to make use of the app.listen() method that we use to start our application. In fact, if we let this code execute when SuperTest runs its tests, then SuperTest won't be able to shut down the server once the tests are complete and, therefore, won’t be able to exit properly. When this happens, you’ll get the following error:

```bash
Jest did not exit one second after the test run has completed.

This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

There is an easy way to correct this. When running tests, process.env.NODE_ENV is automatically set to "test" by the Jest runner. So, we can just check for that and only start listening to port 3001 when not running in test mode:

```js
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
```

### Installing SuperTest

Run the command

```bash
npm install --save-dev supertest.
```

Add test script

```json
// package.json
"scripts": {
"start": "node app.js",
"test": "jest"
}
```

Create an endpoint.test.js file for our tests. Connect the library to this file:

```js
// endpoint.test.js
const supertest = require("supertest");
const app = require("./app.js");
```

The supertest variable contains a function. Pass your app to it as follows:

```js
const request = supertest(app);
```

All done! Now we can access the library's methods through the request object. All methods of this object will return promises that need to be processed asynchronously.

### Checking Request Sending

For each type of request, there is a method with the same name:

- get(),
- post(),
- delete(),
- put(), and
- patch().

For each of these methods, we pass the URL of the request we want to check as an argument:

```js
describe("Endpoints respond to requests", () => {
  it('Returns data and status 200 on request to "/"', () => {
    return request.get("/").then((response) => {
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello, world!");
    });
  });
});
```

When testing promises, return them by writing return before request.get(). This will automatically make Jest wait for the promise to resolve or report an error if it's rejected.

### Configuring Requests

In addition to URLs, requests have attributes. Some of these attributes can contain files. Let's have a look at the corresponding methods.

- set() sets the attributes. It has two parameters: the name of the attribute and its value:

```js
.set('Cookie', ['token=u1a90aw7812689adukqyw61;'])
```

- send() sets the request body. The method name may be confusing, but we can easily remember the difference: the get(), post(), delete(), put(), and patch() methods are used to send requests, while send() allows us to add data to the request body:

```js
.send({ name: 'Mr Pink' })
```

- query() allows us to configure a GET request, which doesn't have a body, only a URL. To add data to this URL, pass the data to the query() method inside an object, like this:

```js
.query({ per_page: '50', offset: '20' })
```

- attach() is used to attach a file to the request. The first parameter is the file name, the second is the relative path to it:

```js
.attach('avatar', 'test/fixtures/avatar.jpg')
```

Notice the fixtures directory. This is a common way to name a directory containing all the necessary data for testing, such as picture, audio, and video files.

That's all for now. You can find the complete list of methods in the SuperTest documentation.
