import { Bill } from '@renderer/types/Bill'
import {create} from 'zustand'

export interface BillStore{
    bills: Bill[]
    addBill: (bill: Bill) => Promise<void>
    removeBill: (id: number) => Promise<void>
    getBill: (id: number) => Bill | undefined
    getAllBills: () => Promise<Bill[]>
    updateBill: (bill: Bill) => Promise<void>
}

export const useBillStore = create<BillStore>((set,get) => ({
    bills: [],
    addBill: async (bill) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('make-bill', bill)
            if (response.success) {
                console.log("bill added", bill)
                set((state) => ({
                    bills: [...state.bills, bill]
                }))
                return;
            }
            console.log(response.message);
        } catch (error) {
            console.log(error);
            return;
        }
    },
    removeBill: async(id) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('delete-bill', { id })
            console.log("Response from delete-bill", response)
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
            const response = await window.electron.ipcRenderer.invoke('get-bills', {})
            if (response.success) {
                console.log("Get all bills in sucess", response)
                const data = response.data as Bill[]
                set({ bills: response.data as Bill[] })

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
            console.log("update-bill", bill)
            const response = await window.electron.ipcRenderer.invoke('update-bill', bill)
            if(response.success){
                get().getAllBills()
            }
        }catch(e){
            console.log("error in update-bill", e);
        }
    }
}))