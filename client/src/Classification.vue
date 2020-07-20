<template>
    <div>
        <div class="d-flex flex-row">
            <div class="patients-table flex-column">
                <PatientsTable></PatientsTable>
            </div>
            <div class="statistic flex-column">
                <div class="d-flex flex-row">
                    <div class="d-flex flex-column">
                        <div
                                class="flex-row"
                                v-for="(selectedIllness, index) of selectedIllnesses"
                                :key="selectedIllness.id"
                        >
                            <BFormSelect
                                    v-model="selectedIllnesses[index]"
                                    :options="illnessForSelect"
                            ></BFormSelect>
                        </div>
                    </div>

                    <div class="flex-column">
                        <button class="button-border" @click="addSelected">+</button>
                    </div>
                </div>

                <div class="d-flex flex-row">
                    <StatisticBar
                            :patients="allPatients"
                            :illnesses="selectedIllnesses"
                            v-if="selectedIllnesses.length>0"
                    ></StatisticBar>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Vue, Component } from 'vue-property-decorator';
    import { Medicine, Patient, Symptom, AllData, Illness } from './dbTypes';
    import { BFormSelect } from 'bootstrap-vue';
    import StatisticBar from './StatisticBar';

    import PatientsTable from './PatientsTable.vue';
    import { parseNbsp } from './utils';

    @Component({
        components: {
            PatientsTable,
            BFormSelect,
            StatisticBar,
        },
    })
    export default class Classification extends Vue {
        allMedicines: Medicine[] = [];
        allSymptoms: Symptom[] = [];
        allPatients: Patient[] = [];
        allIllness: Illness[] = [];

        dataLoaded: boolean = false;

        selectedIllnesses: Illness[] = [];

        get illnessForSelect(): { value: Illness, text: string }[] {
            return this.allIllness.map((illness: Illness) => {
                return {
                    value: illness,
                    text: parseNbsp(illness.name),
                };
            });
        }

        addSelected(): void {
            this.selectedIllnesses.push(null);
        }

        loadData(): void {
            axios.get<AllData>('/getDbData/')
            // eslint-disable-next-line promise/always-return
                .then((result) => {
                    this.allMedicines = result.data.medicines;
                    this.allSymptoms = result.data.symptoms;
                    this.allPatients = result.data.patients;
                    this.allIllness = result.data.illness;
                    this.dataLoaded = true;
                    this.selectedIllnesses.push(this.allIllness[0]);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Ошикба загрузки');
                });
        }

        mounted(): void {
            this.loadData();
        }
    }
</script>

<style scoped lang="scss">
    .statistic {
        width: 40%;
    }

    .patients-table {
        width: 60%;
    }

    .button-border {
        border: black solid 1px;
    }
</style>
