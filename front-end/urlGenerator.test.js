const urlGenerator = require("./urlGenerator");

// Using the toMatch() method from Jest to check if a string matches a regular expression.

const urlRegEx =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

test("Takes an input and returns a valid URL string", () => {
  expect(urlGenerator("-hello world")).toMatch(urlRegEx);
  expect(urlGenerator("hello world-")).toMatch(urlRegEx);
  expect(urlGenerator("hello--world")).toMatch(urlRegEx);
  expect(urlGenerator("")).toMatch(urlRegEx);
  expect(urlGenerator(" ")).toMatch(urlRegEx);
  expect(urlGenerator("&&&")).toMatch(urlRegEx);
  expect(typeof urlGenerator("řâñđöḿ text")).toBe("string");
  expect(urlGenerator("řâñđöḿ text")).toMatch(urlRegEx);
});
