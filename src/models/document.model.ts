import {PersonModel} from "./person.model";
import {SourceModel} from "./source.model";

export type DocumentModel = {
    id: string;
    source: SourceModel;
    imageUrl: string;
    label: string;
    people: PersonModel[];
}