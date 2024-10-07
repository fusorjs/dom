import {jsx, getElement, Fusion} from '.';
import {Params} from './types';
import {htmlTagNames} from './help/constants';
import {mathMlTagNamesSet, svgTagNamesSet} from './jsx';

test.each<[description: string, one: readonly any[], two: readonly any[]]>([
  ['svg and html tags', [...svgTagNamesSet], htmlTagNames],
  ['mathml and html tags', [...mathMlTagNamesSet], htmlTagNames],
  ['svg and mathml tags', [...svgTagNamesSet], [...mathMlTagNamesSet]],
])('no intersection between %p', (description, one, two) => {
  expect(one.filter((i) => two.includes(i))).toEqual([]);
});

test('jsx creation', () => {
  expect(<a />).toStrictEqual(document.createElement('a'));
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'custom-form': Params<HTMLFormElement>;
      'unknown-elm': any;
    }
  }
}

test('typescript mount type', () => {
  () => {
    <custom-form
      mount={(self: Fusion<HTMLFormElement>) => {
        getElement(self).enctype;
      }}
    >
      AAA
    </custom-form>;
    <unknown-elm></unknown-elm>;
  };

  // test type mount return unmount
  <p mount={() => () => {}} />;

  // test type mount return void
  <p mount={() => {}} />;

  // test type mount self argument
  <form
    mount={(self: Fusion) => {
      getElement(self).addEventListener;
    }}
  />;

  // test type mount self argument
  <form
    mount={(self: Fusion<HTMLFormElement>) => {
      getElement(self).enctype;
    }}
  />;
  <form
    mount={(self) => {
      getElement(self).enctype;
    }}
  />;
});

test('typescript event handler type', () => {
  // test type event return void
  <form click_e={() => 123} />;

  // test type event self argument
  <form
    click_e={(event, self) => {
      event.target.enctype;
      getElement(self).enctype;
    }}
  />;

  <form
    click_e={(event, self) => {
      event.stopPropagation;
      event.target.enctype.toUpperCase();
      getElement(self).enctype.toUpperCase();
    }}
  />;

  <input
    keydown_e={(event) => {
      if ((event as any as KeyboardEvent).code !== 'Enter') return;
      event.preventDefault();
      event.target.value.toUpperCase();
    }}
  />;
});
