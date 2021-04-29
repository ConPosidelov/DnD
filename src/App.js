import React, { useState, useEffect } from 'react'
import './App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const initialWidgetsById = {
  '1': {
    id: '1',
    name: 'Widget 1',
    checked: false
  },
  '2': {
    id: '2',
    name: 'Widget 2',
    checked: false
  },
  '3': {
    id: '3',
    name: 'Widget 3',
    checked: false
  },
  '4': {
    id: '4',
    name: 'Widget 4',
    checked: false
  },
  '5': {
    id: '5',
    name: 'Widget 5',
    checked: false
  }
}

const initialWidgetsOrder = [ '1', '2', '3', '4', '5' ]

const { history } = window

const App = () => {
  const [ widgetsOrder, updateWidgetsOrder ] = useState(initialWidgetsOrder)
  const [ widgetsById, updateWidgetsById ] = useState(initialWidgetsById)
  const [ isEditable, setEditMode ] = useState(false)
  const [ isAllSelected, setSelected ] = useState(false)
  const widgets = widgetsOrder.map(id => widgetsById[id])

  useEffect(() => {
    const loadingWidgetsOrder =
      (history.state && history.state.prevWidgetsOrder) || initialWidgetsOrder
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

  const checkHandler = id => {
    updateWidgetsById(prev => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked }
    }))
  }

  const selectHandler = () => {
    updateWidgetsById(prev => {
      const res = {}
      console.log('prev1', prev)
      for (let val in prev) {
        res[val] = { ...prev[val], checked: true }
      }
      return res
    })
    setSelected(true)
  }

  const deselectHandler = () => {
    updateWidgetsById(prev => {
      const res = {}
      for (let val in prev) {
        res[val] = { ...prev[val], checked: false }
      }
      return res
    })
    setSelected(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="row">
          <button
            className={isAllSelected ? 'active' : ''}
            onClick={selectHandler}>
            Select All
          </button>
          <button
            className={!isAllSelected ? 'active' : ''}
            onClick={deselectHandler}>
            Deselect All
          </button>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="widgets">
            {provided => (
              <ul
                className={isEditable ? 'widgets editable' : 'widgets'}
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {widgets.map(({ id, name, checked }, index) => {
                  return (
                    <Draggable
                      key={id}
                      isDragDisabled={!checked || !isEditable}
                      draggableId={id}
                      index={index}>
                      {provided => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <span
                            className={
                              checked ? 'checkbox checked' : 'checkbox'
                            }
                            onClick={() => checkHandler(id)}
                          />
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
      <button className="editBtn" onClick={() => setEditMode(prev => !prev)}>
        {!isEditable ? 'Edit widgets' : 'Done'}
      </button>
    </div>
  )
}

export default App
