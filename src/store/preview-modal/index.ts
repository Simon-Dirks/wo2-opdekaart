import {ScanModel} from "../../models/marker.model";

interface PreviewModalState {
    shownScans: ScanModel[]
}

export const previewModalModule = {
    namespaced: true,
    state() {
        return {
            shownScans: []
        };
    },
    getters: {
        getIsShown(state: PreviewModalState) {
            return state.shownScans.length > 0;
        },
        getShownScans(state: PreviewModalState) {
            return state.shownScans;
        }
    },
    mutations: {
        setShownScans: (state: PreviewModalState, shownScans: ScanModel[]) => {
            state.shownScans = shownScans;
        }
    }
};