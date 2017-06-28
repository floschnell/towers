import navigationReducer from '../../src/reducers/navigation';
import {ACTION_TYPES} from '../../src/actions/index';

const stateWihtOnePage = {
  pageStack: [
    {
      name: 'login',
    },
  ],
};

describe('navigation reducer', () => {
  test('init page', () => {
    // GIVEN
    const testAction = {
      type: ACTION_TYPES.INIT_PAGE,
      page: {
        name: 'dashboard',
      },
    };

    // WHEN
    const resultState = navigationReducer(stateWihtOnePage, testAction);

    // THEN
    expect(resultState.pageStack.length).toEqual(1);
  });

  test('push page', () => {
    // GIVEN
    const testAction = {
      type: ACTION_TYPES.PUSH_PAGE,
      page: {
        name: 'dashboard',
      },
    };

    // WHEN
    const resultState = navigationReducer(stateWihtOnePage, testAction);

    // THEN
    expect(resultState.pageStack.length).toEqual(2);
  });
});
