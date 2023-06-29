import {useState, useRef, useEffect} from 'react'

function SaveGrid({ gridSettings, appSettings, classes }) {
    // Save JSON of the grid
    const file_container = useRef(null)
    const fname = Date.now() + "-smeargrid.json"
    const content = {
        grid: gridSettings,
        app_settings: appSettings
    }
    const fobject = new Blob([JSON.stringify(content, replacer, 2)], {type: "application/json"})

    const saveObject = {
        name: fname,
        blobURL: window.URL.createObjectURL(fobject),
    }

    return (
        <>
            <a 
                className={classes}
                ref={file_container}
                href={saveObject.blobURL}
                download={saveObject.name}
                id="saveGrid"
            >Save Grid</a>
        </>
    )
}

function LoadGrid({ loadColours, loadFilled, loadBgColour, classes }) {
    // Load JSON of the grid
    const file_loader = useRef(null)
    // const [file_name, setFileName] = useState(null)
    const reader = new FileReader()
    const [isLoaderOpen, toggleLoader] = useState(false)

    const handleLoaderClick = () => {
    // console.log(`BG Picker should open`)
        toggleLoader(true)
    }

    const handleLoaderClose = () => {
        toggleLoader(false)
    }
    
    const handleLoad = () => {
        reader.readAsText(file_loader.current.files[0])
        handleLoaderClose()
    }

    useEffect(() => {
        reader.addEventListener("load", () => {
            const loaded = JSON.parse(reader.result, reviver)
            const filled = new Set()
            console.log(loaded)
            loadColours(loaded.grid)
            loadBgColour(loaded.app_settings.bg_col)

            Array.from(loaded.grid.entries(), (val) => {
                const [coord, data] = val
                console.log(coord, data.colour)
                if (data.colour !== "inherit") {
                    console.log(coord)
                    filled.add(coord)
                }
            })

            loadFilled(filled)
        })
    })
    
    return (
        <>
            <a onClick={handleLoaderClick} className={classes}>Load Grid</a>
            <div className={"modal " + (isLoaderOpen ? "is-active": "")}>
            <div className="modal-background" onClick={handleLoaderClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                <h2>Select A Grid Save (*.json)</h2>
                </header>
                <section className="modal-card-body">
                    <input 
                        accept="application/json"
                        id="loadGrid" 
                        ref={file_loader} 
                        type="file" 
                    ></input>
                </section>
                <footer className="modal-card-foot">
                <button className="button is-success" onClick={handleLoad}>Load File</button>
                <button className="button" onClick={handleLoaderClose}>Cancel</button>
                </footer>
            </div>
            <button className="modal-close is-large" aria-label='close' onClick={handleLoaderClose}></button>
            </div>
        </>
    )
}

function ExportPalette({ colourList, classes }) {
    // Export all the colours as a .hex file
    const palette_container = useRef(null)
    const fname = Date.now() + "-smeargrid.hex"
    const hex_list = new Set()

    Array.from(colourList.entries(), (val) => {
        const [coord, data] = val
        if (data.colour !== "inherit") {
            let colour_code = data.colour.slice(1, data.colour.length)
            if (colour_code.length === 3) {
                colour_code += colour_code
            }
            hex_list.add(colour_code)
        }
    })

    const set_to_array = [...hex_list]

    const fobject = new Blob([set_to_array.join("\n")], {type: "text/hex"})

    const saveObject = {
        name: fname,
        blobURL: window.URL.createObjectURL(fobject),
    }

    return (
        <>
            <a 
                className={classes}
                ref={palette_container}
                href={saveObject.blobURL}
                download={saveObject.name}
                id="saveHex"
            >Export Palette</a>
        </>
    )
}

export {SaveGrid, LoadGrid, ExportPalette}

// Following code sourced from: https://stackoverflow.com/a/56150320

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}