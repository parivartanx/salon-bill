export interface MonthlySale{
    month:string,
    totalSales:number,
}

export interface TodaySale {
    totalBills:number,
    totalSales:number,
}

export interface TopProduct{
    productName:string,
    totalSold:number,
}

export interface EmployeeCurrentMonthBill{
    employeeName:string,
    totalBillsGenerated: string,
    totalSalesAmount:number
}






export interface Analytics{
    monthlySales:MonthlySale[],
    todaySales:TodaySale,
    topProducts:TopProduct[],
    totalProducts:number,
    employeeCurrentMonthBill:EmployeeCurrentMonthBill[]
}