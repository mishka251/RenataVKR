import { Component, Watch, Prop } from 'vue-property-decorator';
import { Patient, Illness } from './dbTypes';

import { Bar } from 'vue-chartjs';
import { parseNbsp } from './utils';

@Component({
    extends: Bar, // this is important to add the functionality to your component
})
export default class StatisticBar extends Bar {
    @Prop({ type: Array }) patients: Patient[];
    @Prop({ type: Array }) illnesses: Illness[];

    options = { responsive: true, maintainAspectRatio: false };

    getChartLabels(): string[] {
        return this.illnesses
            .filter((illness) => illness != null)
            .map<string>((illness: Illness) => parseNbsp(illness.name));
    }

    createCharData(): number[] {
        return this.illnesses
            .filter((illness) => illness != null)
            .map<number>((illness: Illness) => this.getPatientsCountForIllness(illness));
    }

    @Watch('patients')
    @Watch('illnesses')
    createBar() {
        const labels = this.getChartLabels();
        const data = this.createCharData();
        console.log(data);
        console.log(labels);
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                }],
            },
        };
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: '',
                    backgroundColor: [
                        'rgba(255,  255, 0, 1)',
                        'rgba(0, 0, 255, 1)',
                    ],
                    data: data,
                },
            ],
        };
        this.renderChart(chartData, options);
    }

    getPatientsCountForIllness(illness: Illness): number {
        return this.patients.reduce<number>(
            (count: number, patient: Patient) => {
                return patient.illness == illness.id ? count + 1 : count;
            },
            0);
    }

    parseNbsp(text: string): string {
        return text.replace(new RegExp('&nbsp;', 'g'), '\u00A0');
    }

    mounted(): void {
        this.createBar();
    }
}
