const exampleLoginFunction = require('../../controllers/login_controller.js');

test('checks if 9 is equal to 9', () => {
  expect(exampleLoginFunction(9,9)).toBe(true);
});