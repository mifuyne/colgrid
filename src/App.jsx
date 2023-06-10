import {useState} from 'react'
import Grid from './components/Grid'
import ChangeBackground from './components/ChangeBackground'
import {SaveGrid, LoadGrid, ExportPalette} from './components/fileHandling'

function App({ size }) {
  // States
  // Amount of cells in a grid is the size squared.
  const [bgColour, updateBackground] = useState('#eee')
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
        <menu className="toolbar" id="toolbar">
            <li><button onClick={handleClearGrid}>New Grid</button></li>
            <li><SaveGrid gridSettings={colours} /></li>
            <li><LoadGrid loadColours={setColours} loadFilled={updateFilledCells} /></li>
            <li><ExportPalette colourList={colours} /></li>
            <li><ChangeBackground updater={updateBackground} /></li>
        </menu>
      </nav>
      <div className="work-area" style={{backgroundColor: bgColour}}>
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
