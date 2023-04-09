import {UpdatableProp} from '../types';
import {getString, ObjectIs} from '../utils';
import {getStringTestData} from '../test-data.spec';

import {convertAttr, emptyAttr} from './share';
import {updateProp} from './update';

const myPropName = 'myPropName'; // not standard

const propTestData = [true, false]
  .map(isAttr =>
    getStringTestData.map(
      ([p, e1]) =>
        [
          isAttr,
          p,
          (e => (isAttr ? convertAttr(e) : e))(
            typeof p === 'function' ? p() : p,
          ),
          e1,
        ] as const,
    ),
  )
  .flat();

const element = {
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(), // used only in updater
  set myPropName(v: any) {},
};

const elementSetMyPropName = jest.spyOn(element, myPropName, 'set');

describe('update prop', () => {
  let dynamic: any;

  const updatable: UpdatableProp = {
    update: () => dynamic,
    value: dynamic,
    isAttr: true,
  };

  test.each(propTestData)(
    'update attribute %p provided %p expected %p <<< %p <<< %p',
    (isAttr, provided, expected) => {
      const isSame = ObjectIs(expected, updatable.value); // before updater

      dynamic = provided;
      updatable.isAttr = isAttr;

      updateProp(element as any as Element, myPropName, updatable);

      if (isSame) {
        expect(element.setAttribute).not.toHaveBeenCalled();
        expect(element.removeAttribute).not.toHaveBeenCalled();
        expect(elementSetMyPropName).not.toHaveBeenCalled();
      } else {
        if (isAttr) {
          if (expected === emptyAttr) {
            expect(element.setAttribute).not.toHaveBeenCalled();
            expect(element.removeAttribute).toHaveBeenCalledTimes(1);
            expect(element.removeAttribute).toHaveBeenCalledWith(myPropName);
          } else {
            expect(element.setAttribute).toHaveBeenCalledTimes(1);
            expect(element.setAttribute).toHaveBeenCalledWith(
              myPropName,
              getString(expected),
            );
            expect(element.removeAttribute).not.toHaveBeenCalled();
          }

          expect(elementSetMyPropName).not.toHaveBeenCalled();
        } else {
          expect(element.setAttribute).not.toHaveBeenCalled();
          expect(element.removeAttribute).not.toHaveBeenCalled();
          expect(elementSetMyPropName).toHaveBeenCalledTimes(1);
          expect(elementSetMyPropName).toHaveBeenCalledWith(expected);
        }
      }
    },
  );
});
