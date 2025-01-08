export interface Bill {
    id?: number;
    employeeId: number;
    productIds: number[];
    customerName: string | null;
    customerPhone: string | null;
    subTotal: number;
    discount?: number;
    finalTotal: number;
    date: string;
}