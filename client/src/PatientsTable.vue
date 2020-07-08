<template>
    <div>
        <BTable
                :busy="!dataLoaded"
                :fields="symptomsForTable"
                :items="patientsForTable"
                striped
                hover
                bordered
                small
                responsive
        >
        </BTable>
    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Vue, Component } from 'vue-property-decorator';
    import { Medicine, Patient, Symptom, AllData, Illness } from './dbTypes';

    require('bootstrap/scss/bootstrap.scss');

    import { BTable, BvTableField } from 'bootstrap-vue';

    @Component({
        components: {
            BTable,
        }
    })
    export default class PatientsTable extends Vue {
        allSymptoms: Symptom[] = [];
        allPatients: Patient[] = [];
        dataLoaded: boolean = false;

        get symptomsForTable(): BvTableField[] {
            return this.allSymptoms.map<BvTableField>((symptom) => {
                return {
                    key: '' + symptom.id,
                    label: this.parseNbsp(symptom.name),
                    sortable: true,
                }
            });
        }

        get patientsForTable() {
            return this.allPatients.map((patient: Patient) => {
                const priemDates: string[] = Object.keys(patient.symptomsAtPriem);
                if (priemDates.length == 0) {
                    return null;
                }
                let firstPriem: string = priemDates[0];
                for (let i = 1; i < priemDates.length; i++) {
                    if (priemDates[i] < firstPriem) {
                        firstPriem = priemDates[i];
                    }
                }
                return patient.symptomsAtPriem[firstPriem];
            }).filter((item) => item != null);
        }

        loadData(): void {
            axios.get<AllData>('/getDbData/')
                .then((result) => {
                    // this.allMedicines = result.data.medicines;
                    this.allSymptoms = result.data.symptoms;
                    this.allPatients = result.data.patients;
                    // this.allIllness = result.data.illness;
                    this.dataLoaded = true;
                })
                .catch((error) => {
                    console.error(error);
                    alert('Ошикба загрузки');
                });
        }

        mounted(): void {
            this.loadData();
        }

        parseNbsp(text: string): string {
            return text.replace(new RegExp('&nbsp;', 'g'), '\u00A0');
        }

    };
</script>

<style scoped>

</style>