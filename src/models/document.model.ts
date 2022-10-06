import {PersonModel} from "./person.model";
import {SourceModel} from "./source.model";

export type DocumentModel = {
    id: string;
    source: SourceModel;
    imageUrl?: string | null;
    label: string;
    people: PersonModel[];
}