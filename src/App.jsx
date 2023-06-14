import {useState} from 'react'
import Grid from './components/Grid'
import ChangeBackground from './components/ChangeBackground'
import {SaveGrid, LoadGrid, ExportPalette} from './components/fileHandling'

function App({ size }) {
  // States
  const [background_colour, updateBackground] = useState("#eeeeee")
  // Amount of cells in a grid is the size squared.
  const [cellAmount, updateCellAmt] = useState(size ** 2)

  // Using map instead
  const [colours, setColours] = useState(new Map(
      Array.from({ length: cellAmount }, (_, idx) => {
          const xCoord = idx % size
          const yCoord = Math.floor(idx / size)
          return [xCoord + "," + yCoord, {
              userFilled: false,
              colour: "inherit"
          }]
      })
  ))

  // Filled cells Set
  const [filledCells, updateFilledCells] = useState(new Set())

  const handleClearGrid = () => {
    const clear_state = new Map(
      Array.from({ length: cellAmount }, (_, idx) => {
        const xCoord = idx % size
        const yCoord = Math.floor(idx / size)
        return [xCoord + "," + yCoord, {
          userFilled: false,
          colour: "inherit"
        }]
      })
    )
    setColours(clear_state)
    updateFilledCells(new Set())
  }

  return (
    <>
      <nav className="main-menu">
        <h1>Smear</h1>
        <p>A Colour Mixer Webapp!</p>
        <aside className="menu">
          <p className="menu-label">File</p>
          <menu className="menu-list" id="toolbar">
              <li><a onClick={handleClearGrid}>New Grid</a></li>
              <li><SaveGrid gridSettings={colours} /></li>
              <li><LoadGrid loadColours={setColours} loadFilled={updateFilledCells} /></li>
              <li><ExportPalette colourList={colours} /></li>
          </menu>
          <p className="menu-label">Settings</p>
          <menu className="menu-list" id="settings-bar">
              <li><ChangeBackground updater={updateBackground} /></li>
          </menu>
        </aside>
      </nav>
      <div className="work-area" style={{backgroundColor: background_colour}}>
        <Grid size={size}
          colours={colours} 
          setColours={setColours} 
          filledCells={filledCells} 
          updateFilledCells={updateFilledCells}
        />
      </div>
    </>
  )
}

export default App
