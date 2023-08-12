import { create } from 'zustand'

interface PlayerStore {
    ids: string[]
    activeId?: string
    setId: (id: string) => void
    setIds: (ids: string[]) => void
    rest: () => void
}

const usePlayer = create<PlayerStore>(set => ({
    ids: [],
    activeId: undefined,
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids }),
    rest: () => set({ ids: [], activeId: undefined })
}))

export default usePlayer