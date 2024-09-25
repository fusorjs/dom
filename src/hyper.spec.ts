import {mathMlNamespace, svgNamespace} from './help/constants';
import {h, s, m} from './hyper';
import {getElement} from './public';

test('h', () => {
  expect(h('a')).toStrictEqual(document.createElement('a'));
});

test('s', () => {
  expect(s('a')).toStrictEqual(document.createElementNS(svgNamespace, 'a'));
});

test('m', () => {
  expect(m('math')).toStrictEqual(
    document.createElementNS(mathMlNamespace, 'math'),
  );
});

declare global {
  interface HTMLElementTagNameMap {
    unknown123: HTMLFormElement;
  }
}

test('typescript mount type', () => {
  // test type mount return unmount
  h('p', {mount: () => () => {}});

  // test type mount return void
  h('p', {mount: () => {}});

  // test type mount return undefined
  h('p', {mount: () => undefined});

  // test type mount self argument
  h('form', {
    mount: (self) => {
      getElement(self).method;
    },
  });

  () => {
    h('unknown123', {
      mount: (self) => {
        getElement(self).method;
      },
    });
  };
});

test('typescript event handler type', () => {
  h('p', {any: 123, any_p: 123, any_a: 123});

  h('p', {any: '123', any_p: '123', any_a: '123'});

  // test type event return void
  h('form', {click_e: () => 123});

  h('form', {
    click_e: (event, self) => {
      event.target.enctype;
      event.stopPropagation();
      getElement(self).enctype;
      return false;
    },
  });

  h('form', {
    click_e_update: (event, self) => {
      event.stopPropagation();
      getElement(self).enctype;
    },
  });

  () => {
    // not event
    h('form', {
      click_ee: (notEvent: number) => {
        notEvent.toFixed();
        return true;
      },
    });

    // not event
    h('form', {
      click_ee_my: (notEvent: string) => {
        notEvent.toUpperCase();
      },
    });
  };

  h('input', {
    keydown_e: (event) => {
      if ((event as any as KeyboardEvent).code !== 'Enter') return;
      event.preventDefault();
      event.target.value.toUpperCase();
    },
  });

  h('form', {
    any_e: {
      handle: (event, self) => {
        event.stopPropagation;
        event.target.enctype.toUpperCase();
        getElement(self).enctype.toUpperCase();
      },
      once: true,
      // bbb: 111,
    },
  });

  h('form', {
    any_e: {
      handleEvent: (event, self) => {
        event.stopPropagation;
        event.target.enctype.toUpperCase();
        getElement(self).enctype.toUpperCase();
      },
      // once: 123,
    },
  });

  h('form', {
    any_e: {
      handle: {
        handleEvent: (event, self) => {
          event.stopPropagation;
          event.target.enctype.toUpperCase();
          getElement(self).enctype.toUpperCase();
        },
      },
      once: true,
      // bbb: 111,
    },
  });
});
