import {ScanModel} from "../../models/marker.model";

interface PreviewModalState {
    shownScans: ScanModel[]
    isShown: boolean;
}

export const previewModalModule = {
    namespaced: true,
    state() {
        return {
            shownScans: [],
            isShown: false,
        };
    },
    getters: {
        getIsShown(state: PreviewModalState) {
            return state.isShown;
        },
        getShownScans(state: PreviewModalState) {
            return state.shownScans;
        }
    },
    mutations: {
        setShownScans: (state: PreviewModalState, shownScans: ScanModel[]) => {
            state.shownScans = shownScans;
        },
        setIsShown: (state: PreviewModalState, isShown: boolean) => {
            state.isShown = isShown;
        }
    }
};