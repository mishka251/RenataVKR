<template>
    <div>
        <h2>Формализация метода</h2>
        <VueNetwork
                v-if="network!=null"
                :edges="network.edges"
                :nodes="network.nodes"
                :options="networkOptions"
                @click="onClick"
        ></VueNetwork>

        <div></div>
        <div v-if="dataLoaded">
            Эффективность <span>{{selectedIllness.efficiency}}</span>
        </div>
        <PatientsTable
                use-last-priem
        ></PatientsTable>
    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Vue, Component } from 'vue-property-decorator';
    import { Medicine, Patient, Symptom, AllData, Illness } from './dbTypes';
    import { BFormSelect } from 'bootstrap-vue';
    import { Network as VueNetwork } from "vue2vis";

    import { Node, Edge,  Options, Properties } from 'vis';
    import PatientsTable from './PatientsTable.vue';


    @Component({
        components: {
            BFormSelect,
            VueNetwork,
            PatientsTable,
        }
    })
    export default class Calculations extends Vue {
        allMedicines: Medicine[] = [];
        allSymptoms: Symptom[] = [];
        allPatients: Patient[] = [];
        allIllness: Illness[] = [];

        selectedIllness: Illness = null;

        dataLoaded: boolean = false;

        onClick(e: Properties) {
            const nodeIndex: number = e.nodes[0] as any;
            if (nodeIndex == undefined) {
                return;
            }
            const node: Node = this.network.nodes[nodeIndex];
            if (node.value == undefined) {
                return;
            }
            if (node.value > 0) {
                this.selectedIllness.efficiency += node.value * (1 - this.selectedIllness.efficiency);
            } else {
                this.selectedIllness.efficiency += node.value * (this.selectedIllness.efficiency);
            }
        }

        loadData(): void {
            axios.get<AllData>('/getDbData/')
                .then((result) => {
                    this.allMedicines = result.data.medicines;
                    this.allSymptoms = result.data.symptoms;
                    this.allPatients = result.data.patients;
                    this.allIllness = result.data.illness;
                    this.selectedIllness = result.data.illness[1];
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


        networkOptions: Options = {
            layout: {
                hierarchical: {
                    direction: "UD",
                    sortMethod: "directed",
                    nodeSpacing: 90,
                    levelSeparation: 70
                }
            },
            width: '600px',
            height: '400px',
            physics: false,
        };

        get network() {
            if (this.selectedIllness == null) {
                return null;
            }
            const nodes: Node[] = [];
            const edges: Edge[] = [];
            const root: Node = {
                id: 0,
                label: this.selectedIllness.name,
                level: 0,
                shape: 'ellipse',
            };
            nodes.push(root);
            this.selectedIllness.formalization.forEach((child1) => {
                const childNode: Node = {
                    id: nodes.length,
                    label: child1.name,
                    level: 1,
                    shape: 'box',
                };
                nodes.push(childNode);
                const childEdge: Edge = {
                    from: root.id,
                    to: childNode.id,
                    label: '' + child1.weight,
                    physics: false,
                };
                edges.push(childEdge);

                child1.childs.forEach((child2) => {
                    const childNode2: Node = {
                        id: nodes.length,
                        label: child2.name,
                        level: 2,
                        shape: 'box',
                    };
                    nodes.push(childNode2);
                    const childEdge2: Edge = {
                        from: childNode.id,
                        to: childNode2.id,
                        label: '' + child2.weight,
                        physics: false,
                    };
                    edges.push(childEdge2);

                    const plusNode: Node = {
                        id: nodes.length,
                        label: 'Улучшение',
                        level: 3,
                        shape: 'ellipse',
                        value: child1.weight * child2.weight * child2.costPlus,
                    };
                    nodes.push(plusNode);

                    const plusEdge: Edge = {
                        from: childNode2.id,
                        to: plusNode.id,
                        label: '' + child2.costPlus,
                        physics: false,
                    };
                    edges.push(plusEdge);

                    const minusNode: Node = {
                        id: nodes.length,
                        label: 'Ухудшение',
                        shape: 'ellipse',
                        level: 3,
                        value: -child1.weight * child2.weight * child2.costMinus,
                    };
                    nodes.push(minusNode);

                    const minusEdge: Edge = {
                        from: childNode2.id,
                        to: minusNode.id,
                        label: '' + child2.costMinus,
                        physics: false,
                    };
                    edges.push(minusEdge);

                });

            });

            return {
                edges,
                nodes,
            };
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