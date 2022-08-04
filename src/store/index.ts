import {createStore} from 'vuex'
import {PreviewItemModel} from "../models/preview-item.model";
import {mapStoreModule} from "./map";
interface State {
    selectedItem: PreviewItemModel | null,
    searchTerm: string
}

export const store = createStore<State>({
    modules: {
        map: mapStoreModule
    },
    state() {
        return {
            selectedItem: null,
            searchTerm: ''
        }
    },
    getters: {
        getSelectedItem(state) {
            return state.selectedItem;
        }
    },
    mutations: {
        updateSearchTerm(state, searchTerm: string) {
          state.searchTerm = searchTerm;
        },
        selectItem(state, item: PreviewItemModel) {
            state.selectedItem = item;
        },
        deselectItem(state) {
            state.selectedItem = null;
        }
    }
})