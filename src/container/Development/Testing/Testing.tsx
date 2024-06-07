import React from 'react'
import useCounterStore from '../../../store/counterStore'

type Props = {}

export default function Testing({}: Props) {

  const { increment, decrement, counter } = useCounterStore();
  

  return (
    <div className="p-4">Counter zustand : {counter}
        <button title="sss" type="button" onClick={increment}>Click</button>
    </div>
  )
}