const isDivisisbleByThree = require("./divisibleByThree");

test("Returns true for numbers divisible by three", () => {
  expect(isDivisisbleByThree(3)).toBe(true);
  expect(isDivisisbleByThree(0)).toBe(true);
  expect(isDivisisbleByThree(-3)).toBe(true);
  expect(isDivisisbleByThree(303)).toBe(true);
  expect(isDivisisbleByThree(999)).toBe(true);
});

test("Returns false for numbers not divisible by three", () => {
  expect(isDivisisbleByThree(1)).toBe(false);
  expect(isDivisisbleByThree(-1)).toBe(false);
  expect(isDivisisbleByThree(2)).toBe(false);
  expect(isDivisisbleByThree(-2)).toBe(false);
  expect(isDivisisbleByThree(4)).toBe(false);
  expect(isDivisisbleByThree(1000)).toBe(false);
});
