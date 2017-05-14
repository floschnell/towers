import {PAGES} from '../models/Page';

export const NAVIGATION_ACTIONS = {
  PUSH_PAGE: 'PUSH_PAGE',
  POP_PAGE: 'POP_PAGE',
  POP_UNTIL_PAGE: 'POP_UNTIL_PAGE',
  REPLACE_PAGE: 'REPLACE_PAGE',
  INIT_PAGE: 'INIT_PAGE',
};

/**
 * Pushes a new page on top of the stack.
 *
 * @param {Page} page New page to put on the stack's top.
 * @return {object}
 */
export function pushPage(page) {
  return {
    type: NAVIGATION_ACTIONS.PUSH_PAGE,
    page: page.toJson(),
  };
}

/**
 * Replaces the page which currently is shown.
 *
 * @param {Page} page New page, which should be placed instead of the old one.
 * @return {object}
 */
export function replacePage(page) {
  return {
    type: NAVIGATION_ACTIONS.REPLACE_PAGE,
    page: page.toJson(),
  };
}

/**
 * Removes the top page from the stack.
 *
 * @return {object}
 */
export function popPage() {
  return {
    type: NAVIGATION_ACTIONS.POP_PAGE,
  };
}

/**
 * Pop all pages from the top, until a
 * certain page has been reached.
 *
 * @param {Page} page The page which will be left on the stack's top.
 * @return {object}
 */
export function popPageUntil(page) {
  return {
    type: NAVIGATION_ACTIONS.POP_UNTIL_PAGE,
    page: page.toJson(),
  };
}

/**
 * Initializes the stack with only the given page.
 *
 * @param {Page} page The page of which the stack will consist of.
 * @return {object}
 */
export function initializeWithPage(page) {
  return {
    type: NAVIGATION_ACTIONS.INIT_PAGE,
    page: page.toJson(),
  };
}

/**
 * Executes the back button action for the given page.
 *
 * @param {Page} currentPage
 * @return {void}
 */
export function executeBackButtonAction(currentPage) {
  return (dispatch, getState) => {
    for (const page in PAGES) {
      if (currentPage.equals(PAGES[page])) {
        const backButtonAction = PAGES[page].getBackButtonAction();

        backButtonAction(dispatch, getState);
      }
    }
  };
}

/**
 * Executes the forward button action for the given page.
 *
 * @param {Page} currentPage
 * @return {void}
 */
export function executeForwardButtonAction(currentPage) {
  return (dispatch, getState) => {
    for (const page in PAGES) {
      if (currentPage.equals(PAGES[page])) {
        const forwardButtonAction = PAGES[page].getForwardButtonAction();

        forwardButtonAction(dispatch, getState);
      }
    }
  };
}
