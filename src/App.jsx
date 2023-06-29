import {useState, useRef} from 'react'
import Grid from './components/Grid'
import ChangeBackground from './components/ChangeBackground'
import {SaveGrid, LoadGrid, ExportPalette} from './components/fileHandling'
import Popup from './components/Popup'
import data from './components/App/data.json'

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

  // Reference to Grid component.
  const gridRef = useRef()

  const handleNewGrid = () => {
    updateBackground("#eeeeee")
    gridRef.current.handleClearGrid()
  }

  return (
    <>
      <div className="work-area" style={{backgroundColor: background_colour}}>
        <header id="app-header">
          <h1>Smear</h1>
          <input type="checkbox" id="main-menu-ctrl" className="hidden" aria-hidden />
          <label htmlFor="main-menu-ctrl">
            <a role="button" className="navbar-burger">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </label>
          <nav id="main-menu" className='panel'>
              <aside>
                {/* <p className="menu-label">File</p> */}
                <menu id="toolbar">
                    <li><a className="menu-new" onClick={handleNewGrid}>New Grid</a></li>
                    <li><SaveGrid classes="menu-save" gridSettings={colours} appSettings={{bg_col: background_colour}}/></li>
                    <li><LoadGrid classes="menu-load" loadColours={setColours} loadFilled={updateFilledCells} loadBgColour={updateBackground} /></li>
                    <li><ExportPalette classes="menu-export" colourList={colours} /></li>
                    <li><ChangeBackground classes="menu-changeBg" updater={updateBackground} /></li>
                    <li><Popup name="About" props={data.about} /></li>
                    <li><Popup name="Help" props={data.help} /></li>
                </menu>
              </aside>
            </nav>
        </header>
        <Grid size={size}
          colours={colours} 
          setColours={setColours} 
          filledCells={filledCells} 
          updateFilledCells={updateFilledCells}
          ref={gridRef}
        />
      </div>
    </>
  )
}

export default App
