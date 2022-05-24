const possibles = [2,4,8,16,32,64,128,256,512,1024,2046]
const bgCols = ["#eee4da","#eee1c9","#f3b27a","#f69664","#f77c5f","#f75f3b","#edd073","#edcc62","#edc950","#edc53f","#edc22e"]
const textCols = ["#bbada0","#bbada0","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2","#f9f6f2"]

export default function Grid({ grid }) {
    return (
        <div className="grid p-[5px] bg-[#bbada0] rounded-lg" style={{gridTemplateColumns: `repeat(${4},60px)`}}>
            {grid.map(row => row.map(num => {
                return (
                    <div className={`h-[60px] w-[60px] border-[5px] border-[#bbada0] rounded-lg text-center items-center justify-center font-semibold ${num ? "trs" : ""}`} style={{fontSize: 35-(((JSON.stringify(num).length)**2)*0.8), backgroundColor: num ? (num < 2048 ? bgCols[possibles.indexOf(num)] : "#edc22e") : "#cdc1b4", color: num ? (num < 2048 ? textCols[possibles.indexOf(num) ] : "#f9f6f2") : "#bbada0"}}>{num}</div>
                    
                )
            }))}
        </div>
    )
}