// Styling in Grid.css

function Cell({ onColorChange, uid, value }) {
    return (
        <input 
            className="grid-cells" 
            onChange={e => onColorChange(uid, e.target.value)}
            type="color"
            value={value} 
        />
    )
}

export default Cell