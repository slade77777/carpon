export default function sizeMenuReducer(state = false, action) {
    switch (action.type) {
        case 'TOGGLE_SIZE_MENU':
            return !state;

        case 'SIDE_MENU_STATE':
            return action.state;

        default:
            return state
    }
}
