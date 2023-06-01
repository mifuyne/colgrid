import {useState, useRef, useEffect} from 'react'

function SaveGrid({ gridSettings }) {
    // Save JSON of the grid
    const file_container = useRef(null)
    const fname = Date.now() + "-smeargrid.json"
    const content = gridSettings
    const fobject = new Blob([JSON.stringify(content, replacer)], {type: "application/json"})

    const saveObject = {
        name: fname,
        blobURL: window.URL.createObjectURL(fobject),
    }

    // Faking the button feature, largely for consistency when styling.
    const handleClick = () => {
        file_container.current.click()
    }

    return (
        <>
            <button onClick={handleClick}>Save Grid</button>
            <a 
                ref={file_container}
                className="hidden"
                href={saveObject.blobURL}
                download={saveObject.name}
                id="saveGrid"
            >Save Grid</a>
        </>
    )
}

function LoadGrid({ loadColours, loadFilled }) {
    // Load JSON of the grid
    const file_loader = useRef(null)
    const [file_name, setFileName] = useState(null)
    const reader = new FileReader()

    // Faking the button feature, largely for consistency when styling.
    const handleClick = () => {
        file_loader.current.click()
    }
    
    const handleLoad = () => {
        reader.readAsText(file_loader.current.files[0])
        setFileName(file_loader.current.files[0].name)
    }

    useEffect(() => {
        reader.addEventListener("load", () => {
            const loaded = JSON.parse(reader.result, reviver)
            const filled = new Set()
            loadColours(loaded)

            Array.from(loaded.entries(), (val) => {
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
            <button onClick={handleClick}>Load Grid</button>
            <input 
                accept="application/json"
                className="hidden" 
                id="loadGrid" 
                ref={file_loader} 
                type="file" 
                onChange={handleLoad}
            ></input>
            <span id="filename">{file_name}</span>
        </>
    )
}

function ExportPalette({ colourList }) {
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
    
    // Faking the button feature, largely for consistency when styling.
    const handleClick = () => {
        palette_container.current.click()
    }

    return (
        <>
            <button onClick={handleClick}>Export Palette</button>
            <a 
                ref={palette_container}
                className="hidden"
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