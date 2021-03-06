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
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { Patient, Symptom, AllData } from './dbTypes';

    import { BTable, BvTableField } from 'bootstrap-vue';

    require('bootstrap/scss/bootstrap.scss');

    @Component({
        components: {
            BTable,
        },
    })
    export default class PatientsTable extends Vue {
        allSymptoms: Symptom[] = [];
        allPatients: Patient[] = [];
        dataLoaded: boolean = false;

        @Prop({
            type: Boolean,
            default: false,
        }) useLastPriem!: boolean;

        get symptomsForTable(): BvTableField[] {
            return this.allSymptoms.map<BvTableField>((symptom) => {
                return {
                    key: '' + symptom.id,
                    label: this.parseNbsp(symptom.name),
                    sortable: true,
                };
            });
        }

        get patientsForTable(): { [symptomId: number]: string }[] {
            return this.allPatients.map((patient: Patient) => {
                const priemDates: string[] = Object.keys(patient.symptomsAtPriem);
                if (priemDates.length == 0) {
                    return null;
                }
                let firstPriem: string = this.useLastPriem ? priemDates[priemDates.length - 1] : priemDates[0];
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
            // eslint-disable-next-line promise/always-return
                .then((result) => {
                    this.allSymptoms = result.data.symptoms;
                    this.allPatients = result.data.patients;
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
    }
</script>
