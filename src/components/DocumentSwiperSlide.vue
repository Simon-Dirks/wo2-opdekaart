<template>
  <div
    :class="[
      isShownFullscreen ? 'grid grid-cols-6 text-white grid-flow-dense' : '',
    ]"
    v-if="document"
  >
    <div
      class="col-span-6 h-full flex-initial bg-black md:col-start-3 md:col-span-4"
      :class="[isShownFullscreen ? 'p-4' : '']"
    >
      <div class="flex-auto">
        <button
          @click="openModal"
          class="w-full"
          :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'"
        >
          <div class="overflow-hidden">
            <img
              v-lazy="{
                src: getImageUrl(document.image),
                lifecycle: {
                  loaded: () => {
                    if (!swiper) {
                      return;
                    }

                    swiper.updateAutoHeight();
                  },
                  error: (el) => {
                    
                    if (!swiper) {
                      return;
                    }
                    el.addEventListener('load', () => {
                      swiper.updateAutoHeight();
                    });
                  },
                },
              }"
              alt=""
              class="w-full h-full max-h-[80vh] !object-contain select-none"
              loading="lazy"
              ref="imageRef"
            />

            <div v-if="!isShownFullscreen">
              <p class="p-0 m-0 text-left font-mono text-xs mt-2">
                {{ document.sourceItem.label }}
              </p>
            </div>
          </div>
        </button>
      </div>
      <div
        class="text-center drop-shadow flex-[0_1_20px]"
        v-if="isShownFullscreen"
      >
        <p>
          <a :href="getDocumentUrl(document.docId)" target="_blank" style="text-decoration: underline;">
            Bekijk dit document op de website van Het Utrechts Archief</a>
        </p>
      </div>
    </div>

    <div
      class="col-span-6 overflow-y-auto max-h-[90vh] px-6 flex-initial md:col-span-2 p-4"
      v-if="isShownFullscreen"
    >
      <!--      <div-->
      <!--        v-if="peopleMatchingSearch && peopleMatchingSearch.length > 0"-->
      <!--        class="mb-4"-->
      <!--      >-->
      <!--        <h2 class="text-2xl">Zoekresultaat</h2>-->
      <!--        <div-->
      <!--          class="grid grid-cols-2"-->
      <!--          v-for="personAtAddress in peopleMatchingSearch"-->
      <!--        >-->
      <!--          <button-->
      <!--            @click="onPersonClicked(personAtAddress.person.label)"-->
      <!--            class="text-left italic"-->
      <!--          >-->
      <!--            {{ personAtAddress.person.label }}-->
      <!--          </button>-->

      <!--          <button-->
      <!--            @click="onPersonClicked(personAtAddress.address.label)"-->
      <!--            class="text-left italic"-->
      <!--          >-->
      <!--            {{ personAtAddress.address.label }}-->
      <!--          </button>-->
      <!--        </div>-->
      <!--      </div>-->
      <div>
        <div>
          <h1 v-if="shownAddress" class="text-2xl font-bold mb-3">
            {{ shownAddress?.label }}
          </h1>
        </div>

        <div class="underline-links mb-3 text-sm mt-0" v-html="getClickableLabel(document.label)"></div>

        <div v-if="documentRefersToPeople" class="grid grid-cols-2">
          <h2 class="font-bold mb-1">Persoon</h2>
          <h2 class="font-bold mb-1">Adres</h2>
        </div>

        <div class="details-section">
          <div
            class="grid grid-cols-2 row"
            v-for="(personAtAddress, index) in props.document.personAtAddressItems" :key="index" :class="getRowClass(index)"
          >
            <div>
              <button
                @click="onPersonClicked(personAtAddress.person?.label)"
                class="text-left search-person" 
                :class="{
                  'highlight': personMatchesSearch(personAtAddress.person?.personId),
                  'no-search': personAtAddress.person?.label==='Geanonimiseerde persoonsvermelding'
                }"
              >
                {{ personAtAddress.person?.label }}
              </button>
            </div>

            <div>
              <button
                @click="onPersonClicked(personAtAddress.address?.label)"
                class="text-left search-address" :class="{'highlight': personMatchesSearch(personAtAddress.person?.personId)}"
              >
                {{ personAtAddress.address.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 mb-6 text-sm">
          <p class="font-bold">{{ document.sourceItem.label }}</p>
          <!--          <p>{{ document.sourceItem.sourceId }}</p>-->
          <p v-if="document.sourceItem.description">
            {{ document.sourceItem.description }}
          </p>
        </div>

        <button
          class="button-with-icon rounded-3xl px-4 py-1 text-black bg-white hover:bg-black hover:text-white transition-colors duration-500"
          @click="closePanel()"
        >
          <Icon size="15" class="icon"><Close /></Icon>
          <span class="text">Venster sluiten</span>
        </button>

        <button
          class="button-with-icon rounded-3xl px-4 py-1 text-black bg-white hover:bg-black hover:text-white transition-colors duration-500"
          @click="onShareScanCommentsClicked()"
        >
          <Icon size="15" class="icon"><Mail /></Icon>
          <span class="text">Reactie versturen</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InformationCircle, Close, Mail } from "@vicons/ionicons5";
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { useSwiper } from "swiper/vue";
import { DocumentModel, PersonAtAddressModel } from "../models/document.model";
import { useStore } from "vuex";
import Panzoom from "@panzoom/panzoom";
import { SearchOptionModel } from "../models/search-option.model";
import { UtilService } from "../services/util.service";
import { AddressModel } from "../models/address.model";

const imageRef: Ref<any> = ref(null);
const store = useStore();

onMounted(() => {
  if (props.isShownFullscreen) {
    const panzoom = Panzoom(imageRef.value, {
      contain: "outside",
      animate: true,
      cursor: "default",
    });
    imageRef.value.addEventListener("wheel", panzoom.zoomWithWheel);
  }
});

const props = defineProps({
  address: { type: Object as PropType<AddressModel | null>, required: false },
  documents: {
    type: Object as PropType<DocumentModel[] | undefined>,
    required: true,
  },
  document: { type: Object as PropType<DocumentModel>, required: true },
  slideIndex: { type: Number, required: false },
  isShownFullscreen: { type: Boolean, required: false },
});

const openModal = () => {
  store.dispatch("previewModal/show", {
    address: props.address,
    documents: props.documents,
    initialSlideIndex: props.slideIndex ?? 0,
  });
};

const getImageUrl = (imgUrl: string | undefined | null): string => {
  if (!imgUrl) {
    return "https://wo2kaart.hualab.nl/assets/afbeelding-niet-zichtbaar.png";
    // "https://via.placeholder.com/350x150";
  }

  const imgId: string = imgUrl.replace(
    "https://proxy.archieven.nl/thumb/39/",
    ""
  );
  const url = `https://proxy.archieven.nl/${
    props.isShownFullscreen ? "download" : "thumb"
  }/39/`;
  return url + imgId;
};

const getClickableLabel = (str:String ): String => {
  return str;
  // const regex = /\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?/g;
  // const match = str.match(regex);
  // if (match) {
  //   return str.replace(regex, `<a href="https://hualab.nl/${match[0]}" target="_blank">${match[0]}</a>`);
  // } else {
  //   return str;
  // }
}

const swiper = useSwiper();

const documentRefersToPeople: boolean =
  props.document?.personAtAddressItems !== undefined &&
  props.document.personAtAddressItems.length > 0;

const getDocumentUrl = (documentId: string): string => {
  if (!documentId) {
    return "https://hetutrechtsarchief.nl/";
  }

  const documentGuid: string = documentId.replace(
    "https://hetutrechtsarchief.nl/id/doc/",
    ""
  );
  return "https://hetutrechtsarchief.nl/collectie/" + documentGuid;
};

const onPersonClicked = (personLabel: string) => {
  store.commit("setSearchTerm", personLabel);
  store.dispatch("previewModal/close");
};

const closePanel = () => {
  store.dispatch("previewModal/close");
}

const getRowClass = (index) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
}


const onShareScanCommentsClicked = () => {
  const link = props.document.docId.replace("/id/doc/","/collectie/");
  const subject = `Reactie op de WO2 kaart applicatie`;
  const message = `Beste medewerker van Het Utrechts Archief,

[type hier uw bericht]

Toegang: ${props.document.label.replace("document in archieftoegang ","")}
Archiefstuk: ${link}

Met vriendelijke groet,

[uw naam]`

  if (window.confirm("Heeft u een tip of wilt u iets anders kwijt? Laat het ons weten door te e-mailen naar reactie@hetutrechtsarchief.nl.")) {
    location.href = "mailto:reactie@hetutrechtsarchief.nl?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(message);
  }

};

const personMatchesSearch = (personId: string): boolean => {
  if (!peopleMatchingSearch.value) {
    return true;
  }

  return (
    peopleMatchingSearch.value.filter(
      (personAtAddress: PersonAtAddressModel) => {
        return personAtAddress.person?.personId === personId;
      }
    ).length > 0
  );
};

const peopleMatchingSearch: ComputedRef<PersonAtAddressModel[] | undefined> =
  computed(() => {
    if (props.document.personAtAddressItems) {
      const search: string = store.getters["getSearchTerm"];
      if (!search) {
        return [];
      }

      const searchOption: SearchOptionModel = store.getters["getSearchOption"];
      const matchingPeople: PersonAtAddressModel[] =
        props.document.personAtAddressItems.filter(
          (personAtAddressItem: PersonAtAddressModel) => {
            if (searchOption === SearchOptionModel.Addresses) {
              return UtilService.labelMatchesSearch(
                personAtAddressItem.address?.label,
                search
              );
            }
            if (searchOption === SearchOptionModel.People) {
              return UtilService.labelMatchesSearch(
                personAtAddressItem.person?.label,
                search
              );
            }
            return (
              UtilService.labelMatchesSearch(
                personAtAddressItem.person?.label,
                search
              ) ||
              UtilService.labelMatchesSearch(
                personAtAddressItem.address?.label,
                search
              )
            );
          }
        );

      return matchingPeople;
    }
  });

const shownAddress: ComputedRef<AddressModel> = computed(
  () => store.getters["previewModal/getShownAddress"]
);
</script>

<style>
.image-slide img {
  object-fit: contain !important;
  width: 100%;
}

.image-slide .n-image {
  justify-content: space-around;
}

.zoom-transition {
  transition: -moz-transform ease 200ms;
  transition: -ms-transform ease 200ms;
  transition: -o-transform ease 200ms;
  transition: -webkit-transform ease 200ms;
  transition: transform ease 200ms;
}

.highlight {
  background-color: yellow;
  opacity: 0.9;
  color: black;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 1px;
}

.search-address:hover, .search-person:hover {
  text-decoration: underline;
}

.no-search:hover {
  text-decoration: none;
  cursor: default;
}

.button-with-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
}

.icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.details-section {
  max-height:40vh; 
  overflow-y: scroll; 
  /* background-color: #70938b; */
  /* padding: .5rem; */
}

.details-section .row {
  margin-bottom: 2px;
  padding-left: 4px;
  background-color: #618e81;  

  /* max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
} 

.details-section .even-row {
  /* background-color: #709a8f;   */
}

.details-section .odd-row {
  /* background-color: #5c8178; */
  /* background-color: #709a8f;   */
}

.underline-links a {
  text-decoration: underline;
}

</style>