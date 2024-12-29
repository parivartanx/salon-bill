import { Employee } from '@renderer/types/Employee'
import {create} from 'zustand'

export interface EmployeeStore{
    employees: Employee[]
    addEmployee: (employee: Employee) => Promise<void>
    removeEmployee: (id: number) => void
    getEmployee: (id: number) => Employee | undefined
    getAllEmployees: () => Promise<Employee[]>

}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    addEmployee: async (employee) => {
        try {
            const response = await window.electronAPI.invoke('add-employee', employee)
            console.log("Response from add-employee", response)
            if (response.success) {
                set((state) => ({
                    employees: [...state.employees, employee]
                }))
                return;
            }
            console.log(response.message);
        } catch (error) {
            console.log(error);
        }
    },
    removeEmployee: (id) => {
        console.log("remove employee", id)
    },
    getEmployee: (id) => {
        console.log("get employee", id)
        return undefined
    },
    getAllEmployees: async() => {
        try {
            const response = await window.electronAPI.invoke('get-employees', {})
            console.log("Response from get-employees", response)
            if (response.success) {
                const data = response.data as Employee[]
                set({ employees: response.data as Employee[] })
                return data
            }
            return [];
        }catch(e){
            console.log("error in get-employees", e);
            return [];
        }
    }
}))