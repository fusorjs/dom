import {getStringTestData} from './test-data.spec';
import {getString, stringify} from './utils';

test.each(getStringTestData)(
  'get string provided %p expected %p',
  (provided, expected) => {
    expect(getString(provided)).toBe(expected);
  },
);

test.each(
  getStringTestData.map(
    // add "quotes" around expected strings
    ([p, e]) => [p, typeof p === 'string' ? `"${e}"` : e] as const,
  ),
)('stringify provided %p expected %p', (provided, expected) => {
  expect(stringify(provided)).toBe(expected);
});
