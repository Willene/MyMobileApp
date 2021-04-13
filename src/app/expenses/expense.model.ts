export class Expense {

    constructor(
    public id: number,
    public category: string,
    public date: Date,
    public amount: number,
    public currency: string,
    public employeeReimburse: boolean,
    public description: string,
    public reason: string,
    public customerCharge: boolean,
    public customer: string,
    public project: string,
    public document: object,
    public userId: string,
    public approverId: string,
    public status: string) {
        
    }
}