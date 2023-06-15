<script setup lang="ts">
import { store } from "../store";
import { computed, ComputedRef, onMounted, onUnmounted } from "vue";
import { CloseCircle } from "@vicons/ionicons5";

const isVisible: ComputedRef<boolean> = computed(
  () => store.getters["getColofonDialogVisible"]
);

const closeColofon = () => {
  store.commit("setColofonDialogVisible", false);
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeColofon();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900 p-10 z-50"
        v-if="isVisible"
      >
        <div class="w-90% h-full bg-white px-14 py-10 text-sm sm:text-lg">
          <n-button
            secondary
            type="default"
            class="absolute right-14 top-14"
            @click="closeColofon()"
          >
            <Icon size="20" class="">
              <CloseCircle />
            </Icon>
          </n-button>

          <h1 class="text-xl sm:text-2xl mb-4">
            Utrechtse WO2 bronnen op de kaart
          </h1>

          <div class="h-full pb-12 overflow-y-auto">
            <p>
              Deze interactieve kaart is ontwikkeld als onderdeel van een
              project waarbij historische documenten uit de Tweede Wereldoorlog
              zijn ontsloten en op een hedendaagse kaart worden weergegeven
              waarop naar persoonsnamen en locaties kan worden gezocht. De kaart
              is gebaseerd op historische bronnen (zie onder) en toont
              huisnummers en straatnamen zoals vermeld in die bronnen.
            </p>
            <p>
              In de loop der tijd zijn er echter wijzigingen geweest in
              huisnummers en enkele straatnamen in Utrecht. Als u de juiste
              hedendaagse geo-locatie van het adres in een bepaalde periode met
              zekerheid wilt vaststellen, raden we aan om historische kaarten
              uit die tijd te raadplegen en deze te vergelijken met de huidige
              huisnummers zoals vermeld in de Basisregistratie Adressen en
              Gebouwen (BAG) Viewer op kadaster.nl.
            </p>
            <p>
              Historische kaarten kunt u vinden in de Beeldbank van Het Utrechts
              Archief door te zoeken op 'plattegrond' en 'huisnummers':
              <a
                href="https://hetutrechtsarchief.nl/beeldmateriaal/?q=plattegrond%20huisnummers"
                target="_blank"
                >https://hetutrechtsarchief.nl/beeldmateriaal/?q=plattegrond%20huisnummers</a
              >
            </p>
            <p>
              Er zijn binnen het project ongeveer 24.000 adressen ingevoerd door
              vrijwilligers, waarvan 8.200 unieke adressen zijn gevonden. Deze
              adressen zijn gekoppeld aan de Basisregistratie Adressen en
              Gebouwen (BAG) om de geocoördinaten van elk adres op te vragen.
            </p>
            <p>
              Ziet u een fout, heeft u een tip of wilt u iets anders kwijt? Laat
              het ons weten door te e-mailen naar reactie@hetutrechtsarchief.nl
              met als onderwerp 'WO2-kaart'.
            </p>
            <p>
              Dit project is uitgevoerd met de steun van het Mondriaan Fonds en
              met hulp van vele vrijwilligers en collega's van Het Utrechts
              Archief.
            </p>
            <p>
              De technische ontwikkeling van de kaartapplicatie is verzorgd door
              Simon Dirks van Boas Media. De broncode van de kaartapplicatie is
              open source en beschikbaar op Github onder de GPL-3 licentie.
              https://github.com/hetutrechtsarchief/wo2-opdekaart
            </p>
            <p>
              De data van de kaart is beschikbaar via de open-data toegang van
              Het Utrechts Archief en via een SPARQL-endpoint als Linked Data.
              Deze data valt onder de CC0-licentie (publiek domein verklaring).
              Bij het hergebruik van deze data is het raadzaam te vermelden dat
              de geo-coordinaten interpretaties zijn en niet als absoluut
              accuraat moeten worden beschouwd. Voor meer informatie over het
              zoeken naar Utrechtse bronnen over de Tweede Wereldoorlog en tips
              over de verschillende locatiebronnen, kunt u terecht op de website
              van Het Utrechts Archief: https://hetutrechtsarchief.nl/locaties.
              Het Utrechts Archief meer dan 50 meter aan archiefstukken,
              afbeeldingen en films over Utrecht en omgeving tijdens en vlak na
              de oorlogsjaren. Meer informatie over het zoeken naar Utrechtse
              bronnen over de Tweede Wereldoorlog is te vinden op:
              https://hetutrechtsarchief.nl/tweede-wereldoorlog. De volgende
              bronnen zijn opgenomen op de WO2 kaart: - Beeldbank: Afbeeldingen
              uit de collectie Tweede Wereldoorlog van Het Utrechts Archief met
              een specifiek adres in Utrecht zijn op deze kaart geplaatst. -
              Binnenlandse Strijdkrachten: Lijsten en registratiekaarten van de
              Binnenlandse Strijdkrachten (BS). De BS kwam voort uit de drie
              belangrijkste landelijke verzetsgroepen: de Ordedienst de
              Landelijke Knokploegen en de Raad van Verzet en werd op 5
              september 1944 een officieel opgezette organisatie. Kort na de
              bevrijding zijn registratiekaarten opgesteld waar onder andere
              naam, adres, functie en beroep op staat vermeld van de personen
              die zich aansloten bij de BS. Ook zijn er lijsten opgesteld waar
              onder andere naam en adres van de personen die zich aansloten bij
              de BS staat vermeld. - Gevorderde percelen: Gevorderde percelen of
              woningen die (deels) in gebruik werden genomen door de bezetter
              werden vastgelegd door het Inkwartieringsbureau. Je kunt zoeken op
              naam van de eigenaar en huurder en op adres. - Inboedellijsten:
              Inboedellijsten zijn lijsten van roerende goederen en huisraad van
              de bewoner van een pand of woning. Wanneer de bezetter een pand
              vorderde werd er dikwijls een inboedellijst opgesteld. -
              Inkwartiering : Inkwartieringsbiljetten vermelden per adres in de
              stad Utrecht de namen van de Duitse militair, Utrechtse bewoner en
              periode van inkwartiering. - Lijsten met Joodse inwoners: In de
              jaren 1940-1942 werden burgemeesters opgeroepen een lijst op te
              stellen van alle joodse inwoners van zijn gemeente. De lijsten
              werden uiteindelijk gebruikt om joden op te roepen voor transport
              naar de vernietigingskampen. Vanwege de privacy van mogelijk nog
              levende personen zijn de lijsten niet te zien. Wel kunt u per
              persoon een scan opvragen. Zie daarvoor > Scan aanvragen voor bron
              Tweede Wereldoorlog - Het Utrechts Archief . - Joodse Coördinatie
              Commissie: Dossiermappen van de Joodse Coördinatie Commissie
              (JCC). De naoorlogse JCC hielp mensen van joodse afkomst die terug
              waren gekeerd uit de vernietigingskampen of uit de onderduik met
              financiële en materiële steun. Vanwege de privacy van mogelijk nog
              levende personen niet alle dossiers te zien. Wel kunt u per
              persoon een scan opvragen. Zie daarvoor > Scan aanvragen voor bron
              Tweede Wereldoorlog - Het Utrechts Archief. - Volksherstel: In
              1945-1946 voorzag de landelijke Stichting Volksherstel burgers die
              als gevolg van de Tweede Wereldoorlog in nood verkeerden van
              noodzakelijke levensbehoeften. Dit project is uitgevoerd met
              ondersteuning van het Mondriaan Fonds en met de hulp van vele
              vrijwilligers en collega's van Het Utrechts Archief. We willen
              graag onze dank uitspreken aan iedereen die heeft bijgedragen aan
              het project.
            </p>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
p {
  margin-bottom: 0.5rem;
  margin-right: 1rem;
}

a {
  color: #d72f19;
  text-decoration: underline;
}

a:hover {
  color: #cc4230;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>