import { Analytics } from '@renderer/types/Analytics'
import { Bill } from '@renderer/types/Bill'
import toast from 'react-hot-toast'
import {create} from 'zustand'

export interface BillStore{
    bills: Bill[],
    analytics:Analytics|null,
    addBill: (bill: Bill) => Promise<void>
    removeBill: (id: number) => Promise<void>
    getBill: (id: number) => Bill | undefined
    getAllBills: () => Promise<Bill[]>
    updateBill: (bill: Bill) => Promise<void>
    analyticsReport:()=> Promise<Analytics | null>
    
}

export const useBillStore = create<BillStore>((set,get) => ({
    bills: [],
    analytics:null,
    analyticsReport: async()=>{
        try{
            const response = await window.electron.ipcRenderer.invoke('analytics')
            const saleReport = await response.data;
            const analyticsReport:Analytics = {
                monthlySales:saleReport.monthlySales,
                todaySales:saleReport.todaySales[0],
                topProducts:saleReport.topProducts,
                totalProducts:saleReport.totalProducts.totalProducts,
                employeeCurrentMonthBill:saleReport.employeeCurrentMonthBill
            }

            console.log("Analytics report",analyticsReport)
            set({analytics:analyticsReport})
            return analyticsReport;
        }catch(e){
            console.log("Error in Analytics store ",e);
            return null;
        }
    },
    addBill: async (bill) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('make-bill', bill)
            if (response.success) {
                set((state) => ({
                    bills: [...state.bills, bill]
                }))
                return;
            }
            toast.error(`Failed ${response.message}`)
        } catch (error) {
            console.log(error);
            toast.error(`Failed ${(error as Error).message}`)
            return;
        }
    },
    removeBill: async(id) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('delete-bill', { id })
            if(response.success){
                get().getAllBills()
            }
            

        }catch(e){
            console.log("error in remove-bill", e);
        }
    },
    getBill: (id) => {
        console.log("get bill", id)
        return undefined
    },
    getAllBills: async() => {
        try {
            const response = await window.electron.ipcRenderer.invoke('bill-history', {})
            if (response.success) {
                const data = response.bills as Bill[]
                set({ bills: response.bills as Bill[] })
                // console.log(data)
                return data
            }
            return [];
        }catch(e){
            console.log("error in get-bills", e);
            return [];
        }
    },
    updateBill: async (bill) => {
        try{
            const response = await window.electron.ipcRenderer.invoke('update-bill', bill)
            if(response.success){
                get().getAllBills()
            }
        }catch(e){
            console.log("error in update-bill", e);
        }
    }
}))