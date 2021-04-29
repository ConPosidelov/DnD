import React, { useState, useEffect } from 'react'
import './App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const widgetsById = {
  '1': {
    id: '1',
    name: 'Widget 1'
  },
  '2': {
    id: '2',
    name: 'Widget 2'
  },
  '3': {
    id: '3',
    name: 'Widget 3'
  },
  '4': {
    id: '4',
    name: 'Widget 4'
  },
  '5': {
    id: '5',
    name: 'Widget 5'
  }
}

const initialWidgetsOrder = [ '1', '2', '3', '4', '5' ]

const { history } = window

const App = () => {
  const [ widgetsOrder, updateWidgetsOrder ] = useState(initialWidgetsOrder)
  const widgets = widgetsOrder.map(id => widgetsById[id])

  useEffect(() => {
    const loadingWidgetsOrder = (history.state && history.state.prevWidgetsOrder) || initialWidgetsOrder
    updateWidgetsOrder(loadingWidgetsOrder)
  }, [])

  const handleOnDragEnd = res => {
    if (!res.destination) return
    const items = [ ...widgetsOrder ]
    const [ draggableId ] = items.splice(res.source.index, 1)
    items.splice(res.destination.index, 0, draggableId)
    updateWidgetsOrder(items)
    history.pushState({ prevWidgetsOrder: items }, 'page')
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Widgets</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="widgets">
            {provided => (
              <ul
                className="widgets"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {widgets.map(({ id, name }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {provided => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <p>{name}</p>
                        </li>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  )
}

export default App
