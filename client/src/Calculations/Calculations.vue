<template>
    <div>
        <div v-if="dataLoaded" class="form form-group">
            <div class="d-flex flex-column">
                <label>ИД пациента</label>
                <BFormSelect
                        v-model="selectedPatient"
                        :options="patientsForSelect"
                        size="sm"
                        class="mt-3"
                ></BFormSelect>
            </div>
        </div>

        <div
                v-if="selectedPatient!=null"
                class="selected-patient-info">
            <div>
                <span>Диагноз</span>
                <span>{{illnessNameForId(selectedPatient.illness)}}</span>
            </div>

            <table>
                <caption>Результаты осмотров</caption>
                <tr>
                    <td>дата</td>
                    <th v-for="symptom in allSymptoms"
                        v-html="symptom.name">
                    </th>
                </tr>

                <tr v-for="(priemSymptoms, date) in selectedPatient.symptomsAtPriem"
                >
                    <td v-html="date"></td>
                    <td v-for="symptom in allSymptoms"
                        v-html="priemSymptoms[symptom.id]">
                    </td>
                </tr>
            </table>

            <table>
                <caption>Результаты осмотра</caption>
                <tr>
                    <td>дата</td>
                    <th v-for="symptom in allSymptoms"
                        v-html="symptom.name">
                    </th>
                </tr>

                <tr>
                    <td v-html="today"></td>
                    <td v-for="symptom in allSymptoms">
                        <BFormSelect
                                v-model="patientNewSymptoms[symptom.id]"
                                :options="symptomsForSelect(symptom)"
                        ></BFormSelect>
                    </td>
                </tr>
            </table>

            <table>
                <caption>Предыдущие назначения</caption>
                <tr>
                    <td>date</td>
                    <th v-for="medicine in allMedicines">
                        {{medicine.name}}
                    </th>
                    <th>price</th>
                </tr>

                <tr v-for="(priemMedicine, date) in selectedPatient.medicinesAtPriem"
                >
                    <td v-html="date"></td>
                    <td v-for="medicine in allMedicines">
                        {{priemMedicine[medicine.id]?priemMedicine[medicine.id].dosa:''}}
                    </td>
                    <td>
                        {{medicinePriceForPriceForPriem(priemMedicine)}}
                    </td>
                </tr>
            </table>

            <table>
                <caption>Назначеине лекарства</caption>
                <tr>
                    <td>дата</td>
                    <th v-for="medicine in medicinesForPatientIllness(selectedPatient)">
                        {{medicine.name}}
                    </th>
                    <th>
                        стоимость
                    </th>
                </tr>

                <tr>
                    <td v-html="today"></td>
                    <td v-for="medicine in medicinesForPatientIllness(selectedPatient)">
                        <BFormSelect
                                v-model="patientNewMedicines[medicine.name]"
                                :options="medicinesDosesForSelect(medicine)"
                        ></BFormSelect>
                    </td>
                    <td>
                        {{totalPrice}}
                    </td>
                </tr>
            </table>
        </div>


    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Vue, Component } from 'vue-property-decorator';
    import { Medicine, Patient, Symptom, AllData, Illness } from './dbTypes';
    import { BFormSelect } from 'bootstrap-vue';

    @Component({
        components: {
            BFormSelect,
        }
    })
    export default class Calculations extends Vue {
        allMedicines: Medicine[] = [];
        allSymptoms: Symptom[] = [];
        allPatients: Patient[] = [];
        allIllness: Illness[] = [];

        dataLoaded: boolean = false;

        selectedPatient: Patient = null;

        patientNewSymptoms: { [key: string]: string } = {};

        patientNewMedicines: {
            [medicine: string]: {
                name: string,
                price: number
            }
        } = {};

        illnessNameForId(id: number): string {
            return this.allIllness.find((illness) => illness.id === id).name;
        }

        medicinesForPatientIllness(patient: Patient): Medicine[] {
            const patientIllnes: Illness =
                this.allIllness.find((ilness: Illness) => {
                    return ilness.id === patient.illness
                });
            return this.allMedicines.filter((medicine: Medicine) => {
                return patientIllnes.medicines.includes(medicine.id)
            });
        }

        medicinePriceForPriceForPriem(priemMedicine: Object): number {
            return Object.keys(priemMedicine).reduce<number>((sum: number, medicine: string) => {
                return sum + priemMedicine[medicine].price;
            }, 0);
        }

        get patientsForSelect() {
            return this.allPatients.map((patient: Patient) => ({
                value: patient,
                text: patient.id,
            }));
        }

        symptomsForSelect(symptom: Symptom) {
            return symptom.possibleValues;
        }

        medicinesDosesForSelect(medicine: Medicine) {
            return Object.keys(medicine.dose).map((dose: string) => ({
                value: { name: dose, price: medicine.dose[dose] },
                text: dose,
            }));
        }

        loadData(): void {
            axios.get<AllData>('/getDbData/')
                .then((result) => {
                    this.allMedicines = result.data.medicines;
                    this.allSymptoms = result.data.symptoms;
                    this.allPatients = result.data.patients;
                    this.allIllness = result.data.illness;
                    this.dataLoaded = true;
                })
                .catch((error) => {
                    console.error(error);
                    alert('Ошикба загрузки');
                });
        }

        get today(): string {
            const now: Date = new Date();
            return `${now.getFullYear()}&nbsp;-&nbsp;${now.getMonth() + 1}&nbsp;-&nbsp;${now.getDate()}`;
        }

        get totalPrice(): number {
            return Object.keys(this.patientNewMedicines)
                .reduce<number>((sum: number, key: string) => {
                    const price: number = this.patientNewMedicines[key].price;
                    return sum + price;
                }, 0);
        }

        mounted() {
            this.loadData();
        }
    };
</script>

<style lang="scss" scoped>
    th, tr, td {
        border: solid black 1px;
    }

    select {
        border: solid black 1px !important;
    }

    div {
        max-width: 100%;
    }

    table {
        width: auto !important;
        display: block;
        overflow: auto;
        scrollbar-base-color: black;
        max-width: 100%;
    }

    /* полоса прокрутки (скроллбар) */
    ::-webkit-scrollbar {
        width: 24px; /* ширина для вертикального скролла */
        height: 8px; /* высота для горизонтального скролла */
        background-color: #143861;
    }
</style>