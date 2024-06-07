import React from 'react'
import useCounterStore from '../../../store/counterStore'

type Props = {}

export default function Testing({}: Props) {

  const { increment, decrement, counter } = useCounterStore();
  

  return (
    <div className="p-4">Counter zustand : {counter}
        
                    <div className="col-span-2 bg-secondary h-[45vh] code-panel">
                {diffData.map((item: any, index: number) => (
                  <pre className="flex flex-row" key={index}>
                    {/* <span className={`text-primary p-2 border-r-2`}>
                      {index}
                    </span> */}
                    {/* <span className={`${item.remove ? "remove-color" : ""} text-primary p-2`}>
                      { !item.added && item.value }
                    </span> */}
                    {/* {item.added && (
                      <>
                        <span className={`p-2 border-r-2 ${ item.added ? 'added-color' : 'text-primary' }`}>
                          { item.added ? '+' : ' ' }
                        </span>
                        <span
                          className={`${
                            item.added ? "added-color" : "text-primary"
                          } p-2`}
                        >
                          {item.value}
                        </span>
                      </>
                    )} */}

                    <span
                      className={`${
                        item.added
                          ? "added-color"
                          : item.remove
                          ? "remove-color"
                          : ""
                      } p-2 border-r-2`}
                    >
                      {item.added ? "+" : item.remove ? "-" : " "}
                    </span>
                    <span
                      className={`${
                        item.added
                          ? "added-color"
                          : item.remove
                          ? "remove-color"
                          : "text-primary"
                      } p-2 `}
                    >
                      {item.value}
                    </span>
                  </pre>
                ))}

              </div>
              {/* <div className="col-span-1 bg-secondary h-[45vh] code-panel">
                {diffData.map((item: any, index: number) => (
                  <pre className="flex flex-row" key={index}>
                    {!item.added && (
                      <>
                        <span className={`p-2 border-r-2 ${ item.remove ? 'remove-color' : 'text-primary' }`}>
                          { item.remove ? '-' : ' ' }
                        </span>
                        <span
                          className={`${
                            item.remove ? "remove-color" : "text-primary"
                          } p-2`}
                        >
                          {item.value}
                        </span>
                      </>
                    )}
                  </pre>
                ))}
              </div> */}
        
        
        <button title="sss" type="button" onClick={increment}>Click</button>
    </div>
  )
}