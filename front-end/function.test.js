// This naming convention is necessary for Jest to run our tests automatically.
// [module to test].test.[extension]

const sayHello = require("./function.js");

// You can use test or it's alias in jest it(). They work interchangeably.

//  it('What the function under test should do', () => {
//    expected output depending on the input
//  });

// So, we can pass the result of the sayHello() function to the expect() function
// and compare it with the expected output like so:

test("Creates a greeting", () => {
  expect(sayHello("Lera", "Jackson")).toBe("Hello, Lera Jackson!");
});

// Then run: npm run test
