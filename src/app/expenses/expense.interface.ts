export interface IExpense {
    id: number;
    category: string;
    date: Date;
    amount: number;
    currency: string;
    employeeReimburse: boolean;
    description: string;
    reason: string;
    customerCharge: boolean;
    customer: string;
    project: string;
    document: object;
    userId: string;
    approverId: string;
    status: string;
}