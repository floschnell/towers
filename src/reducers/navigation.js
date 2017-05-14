import {Page, PAGES} from '../models/Page';
import {ACTION_TYPES} from '../actions/index';
import Logger from '../logger';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return {
      pageStack: [PAGES.LOGIN],
    };
  }

  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case ACTION_TYPES.PUSH_PAGE:
      Logger.debug('setting page stack to: ', state.pageStack.concat(action.page));
      return Object.assign(newState, {
        pageStack: state.pageStack.concat(action.page),
      });

    case ACTION_TYPES.POP_PAGE:
      Logger.debug(
        'setting page stack to: ',
        state.pageStack.slice(0, state.pageStack.length - 1)
      );
      return Object.assign(newState, {
        pageStack: state.pageStack.slice(0, state.pageStack.length - 1),
      });

    case ACTION_TYPES.POP_UNTIL_PAGE:
      const newStack = [];
      for (const pageJson of state.pageStack) {
        const page = Page.fromJson(pageJson);

        newStack.push(pageJson);
        if (action.page.equals(page)) {
          break;
        }
      }
      return Object.assign(newState, {
        pageStack: newStack,
      });

    case ACTION_TYPES.REPLACE_PAGE:
      Logger.debug(
        'setting page stack to: ',
        state.pageStack.slice(0, state.pageStack.length - 1).concat(action.page)
      );
      return Object.assign(newState, {
        pageStack: state.pageStack
          .slice(0, state.pageStack.length - 1)
          .concat(action.page),
      });

    case ACTION_TYPES.INIT_PAGE:
      return Object.assign(newState, {
        pageStack: [action.page],
      });

    default:
      return newState;
  }
};
