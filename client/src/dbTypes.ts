export interface Medicine {
    id: number,
    name: string,
    dose: { [key: string]: number },
}

export interface Symptom {
    id: number,
    name: string,
    possibleValues: string[],
}

export interface Patient {
    id: number,
    name: string;
    symptomsAtPriem: {
        [priemDate: string]: {
            [symptomId: number]: string
        }
    },
    medicinesAtPriem: {
        [priemDate: string]: {
            [medicineId: number]: {
                dosa: string,
                price: number
            }
        }
    },
    illness: number,
}

export interface Illness {
    id: number;
    name: string;
    medicines: number[];
    formalization: [
        {
            name: string,
            weight: number,
            childs: [
                {
                    name: string,
                    weight: number,
                    costPlus: number
                    costMinus: number;
                }
            ]
        }
    ];
    efficiency:number,
}

export interface AllData {
    medicines: Medicine[],
    symptoms: Symptom[],
    patients: Patient[],
    illness: Illness[],
}
