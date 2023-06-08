import {useState} from 'react'
import Grid from './components/Grid'
import {SaveGrid, LoadGrid, ExportPalette} from './components/fileHandling'

function App({ size }) {
  // States
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
        <div className="toolbar" id="toolbar">
            <button onClick={handleClearGrid}>New Grid</button>
            <SaveGrid gridSettings={colours} />
            <LoadGrid loadColours={setColours} loadFilled={updateFilledCells} />
            <ExportPalette colourList={colours} />
        </div>
      </nav>
      <Grid size={size}
        colours={colours} 
        setColours={setColours} 
        filledCells={filledCells} 
        updateFilledCells={updateFilledCells}
      />
    </>
  )
}

export default App
