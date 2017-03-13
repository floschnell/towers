import { Page, PAGES } from '../../models/Page';
import { ACTION_TYPES } from '../index';

/**
 * 
 * @param {Page} page 
 */
export function goToPage(page) {
    return {
        type: ACTION_TYPES.GO_TO_PAGE,
        page
    };
}
