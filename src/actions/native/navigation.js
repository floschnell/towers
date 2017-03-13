import { Page, PAGES } from '../../models/Page';
import { Actions } from 'react-native-router-flux';
import { ACTION_TYPES } from '../index';

/**
 * 
 * @param {Page} page 
 */
export function goToPage(page) {
    Actions[page.getName()]({title: page.getTitle()});
    return {
        type: ACTION_TYPES.GO_TO_PAGE,
        page
    };
}
