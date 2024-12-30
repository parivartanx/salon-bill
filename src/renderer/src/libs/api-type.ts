export interface ElectronAPI {
    invoke: (
      channel: string,
      data: unknown
    ) => Promise<{ success: boolean; message: string; data: unknown }>
  }
  
  declare global {
    interface Window {
      electronAPI: ElectronAPI
    }
  }