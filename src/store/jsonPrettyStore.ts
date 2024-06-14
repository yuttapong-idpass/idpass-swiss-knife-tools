import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// type State = {
//     jsonInput: string 
//     jsonOutput: string
// }

// type Action = {
//     updateInput: (input: State['jsonInput']) => void;
//     updateOutput: (output: State['jsonOutput']) => void;
// }

// const useJsonPrettyStore = create((set) => ({
//     bears: 0,
//     increaseBear: () =>  set((state) => ({ bears: state.bears + 1})) ,
// }));


// export default useJsonPrettyStore;
type JsonState = {
    input: string,
    output: string,
    setJsonInput: (input: string) => void;
    setJsonOutput: (output: string) => void;
}

const useJsonPrettyStore = create<JsonState>()(
    devtools(
        (set) => ({
            input: '',
            output: '',
            setJsonInput: (input) => set(() => ({ input: input }), false, 'jsonInput'),
            setJsonOutput: (output) => set(() => ({ output: output }), false, 'jsonOutput')
        }),
        {
            name: 'jsonPrettyStore',
            serialize: true
        }
    )
    // (set) => ({
    // input: '',
    // output: '',
    // setJsonInput: (input) => set((state) => ({ input: input })),
    // setJsonOutput: (output) => set((state) => ({ output: output }))})
);

export default useJsonPrettyStore;