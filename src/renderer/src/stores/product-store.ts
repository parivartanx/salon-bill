import { Product } from '@renderer/types/Product'
import {create} from 'zustand'

export interface ProductStore{
    products: Product[]
    addProduct: (product: Product) => Promise<void>
    removeProduct: (id: number) => Promise<void>
    getProduct: (id: number) => Product | undefined
    getAllProducts: () => Promise<Product[]>
    updateProduct: (product: Product) => Promise<void>
}


export const useProductStore = create<ProductStore>((set,get) => ({
    products: [],
    addProduct: async (product) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('add-product', product)
            console.log("Response from add-product", response)
            if (response.success) {
                console.log("product added", product)
                set((state) => ({
                    products: [...state.products, product]
                }))
                return;
            }
            console.log(response.message);
        } catch (error) {
            console.log(error);
        }
    },
    removeProduct: async(id) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('delete-product', { id })
            console.log("Response from delete-product", response)
            if(response.success){
                get().getAllProducts()
            }
            

        }catch(e){
            console.log("error in remove-product", e);
        }
    },
    getProduct: (id) => {
        console.log("get product", id)
        return undefined
    },
    getAllProducts: async() => {
        try {
            const response = await window.electron.ipcRenderer.invoke('get-products', {})
            if (response.success) {
                console.log("Get all products in sucess", response)
                const data = response.data as Product[]
                set({ products: response.data as Product[] })

                return data
            }
            return [];
        }catch(e){
            console.log("error in get-products", e);
            return [];
        }
    },
    updateProduct: async(product) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('update-product', product)
            console.log("Response from update-product", response)
            if (response.success) {
                console.log("product updated", product)
                // get().getAllProducts()
                return;
            }
            console.log(response.message);
        } catch (error) {
            console.log(error);
        }
    }
}))