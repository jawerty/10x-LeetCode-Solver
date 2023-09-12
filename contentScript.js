async function timeout(miliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, miliseconds)
    })
}

function parseCode(code) {

  if (code.indexOf('[PYTHON]') > -1) {
    const start = code.indexOf('[PYTHON]') + '[PYTHON]'.length

    let end = null;
    if (code.indexOf("[/PYTHON]") > -1) {
        end = code.indexOf("[/PYTHON]")
    }

    return (end) ? code.slice(start, end) : code.slice(start);
  } else {
    const codeblock = /```\s*([^]+?.*?[^]+?[^]+?)```/g;
    const match =  codeblock.exec(code)
    if (match) {
    return match[1]
    } else {
    return code
    }
  }
}

window.addEventListener("sendChromeData", async function(evt){
    console.log(evt)

    const { sourceCode, type } = evt.detail;
    console.log("Auto Paste!")

    let parsedSourceCode = parseCode(sourceCode)
    console.log()
    if (type === "autoPaste") {
        window.monaco.editor.getModels()[0].setValue(parsedSourceCode)
    } else if (type === "autoType") {
        let addedChars = ''
        const codeCharSplit = parsedSourceCode.split("")
        while (codeCharSplit.length > 0) {
            let _char = codeCharSplit.shift()
            addedChars += _char

            // randomness to typing
            await timeout(100 + Math.round(Math.random() * 150))
            window.monaco.editor.getModels()[0].setValue(addedChars)
        }

    }
    
    
});
