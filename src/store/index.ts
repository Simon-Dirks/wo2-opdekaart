import {createStore} from 'vuex'
import {PreviewItemModel} from "../models/preview-item.model";

interface State {
    selectedItem: PreviewItemModel | null
}

export const store = createStore<State>({
    state() {
        return {
            selectedItem: null
        }
    },
    getters: {
        getSelectedItem(state) {
            return state.selectedItem;
        }
    },
    mutations: {
        selectItem(state, item: PreviewItemModel) {
            state.selectedItem = item;
        },
        deselectItem(state) {
            state.selectedItem = null;
        }
    }
})