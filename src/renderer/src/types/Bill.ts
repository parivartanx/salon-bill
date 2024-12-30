export interface Bill {
    id?: number;
    employeeId: number;
    productIds: number[];
    subTotal: number;
    discount?: number;
    finalTotal: number;
    date: string;
}