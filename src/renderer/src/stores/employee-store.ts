import { Employee } from '@renderer/types/Employee'
import {create} from 'zustand'

export interface EmployeeStore{
    employees: Employee[]
    addEmployee: (employee: Employee) => Promise<void>
    removeEmployee: (id: number) => Promise<void>
    getEmployee: (id: number) => Employee | undefined
    getAllEmployees: () => Promise<Employee[]>
    updateEmployee: (employee: Employee) => Promise<void>

}

export const useEmployeeStore = create<EmployeeStore>((set,get) => ({
    employees: [],
    updateEmployee: async (employee) => {
        try{
            console.log("update-employee", employee)
            const response = await window.electron.ipcRenderer.invoke('update-employee', employee)
            if(response.success){
                get().getAllEmployees()
            }
        }catch(e){
            console.log("error in update-employee", e);
        }
    },
    addEmployee: async (employee) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('add-employee', employee)
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
    removeEmployee: async(id) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('delete-employee', { id })
            if(response.success){
                set((state) => ({
                    employees: state.employees.filter((employee) => employee.id !== id)
                }))
            }
            

        }catch(e){
            console.log("error in remove-employee", e);
        }
    },
    getEmployee: (id) => {
        console.log("get employee", id)
        return undefined
    },
    getAllEmployees: async() => {
        try {
            const response = await window.electron.ipcRenderer.invoke('get-employees', {})
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