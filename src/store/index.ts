import {createStore} from 'vuex'
import {mapStoreModule} from "./map";
import {MarkerModel} from "../models/marker.model";

interface State {
    selectedItem: MarkerModel | null,
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
        },
        getSearchTerm(state) {
            return state.searchTerm;
        }
    },
    mutations: {
        updateSearchTerm(state, searchTerm: string) {
            state.searchTerm = searchTerm;
        },
        selectItem(state, item: MarkerModel) {
            state.selectedItem = item;
        },
        deselectItem(state) {
            state.selectedItem = null;
        }
    }
})