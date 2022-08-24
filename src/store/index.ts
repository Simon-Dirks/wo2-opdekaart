import {createStore} from 'vuex'
import {mapStoreModule} from "./map";
import {previewModalModule} from "./preview-modal";
import {MarkerModel} from "../models/marker.model";

interface State {
    selectedItem: MarkerModel | null,
    searchTerm: string,
}

export const store = createStore<State>({
    modules: {
        map: mapStoreModule,
        previewModal: previewModalModule
    },
    state() {
        return {
            selectedItem: null,
            searchTerm: '',
        }
    },
    getters: {
        getSelectedItem(state) {
            return state.selectedItem;
        },
        getSearchTerm(state) {
            return state.searchTerm;
        }
    },
    mutations: {
        updateSearchTerm(state: State, searchTerm: string) {
            state.searchTerm = searchTerm;
        },
        selectItem(state: State, item: MarkerModel) {
            state.selectedItem = item;
        },
        deselectItem(state: State) {
            state.selectedItem = null;
        },
    }
})