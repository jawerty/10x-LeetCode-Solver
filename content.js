let runSolverInitiated = false
let problemText;
let languageText;
let sourceCodeText;

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript( chrome.runtime.getURL('/contentScript.js'), 'body');


function runSolver() {
	//code to send message to open notification. This will eventually move into my extension logic
	chrome.runtime.sendMessage({type: "leetcode-solver-problem", data: {
		problemText,
		languageText,
		sourceCodeText
	}});
}

const intervalTime = 100;
const interval = setInterval(() => {
	let descriptionElement = document.querySelector("[data-track-load=\"description_content\"]");
	let languageElement = document.querySelector("#editor [id^=\"headlessui-listbox-button\"]");   
	let sourceCodeElement = document.querySelector("#editor .view-lines");

	if (descriptionElement && languageElement) {
		setTimeout(() => {
			descriptionElement = document.querySelector("[data-track-load=\"description_content\"]");
			languageElement = document.querySelector("#editor [id^=\"headlessui-listbox-button\"]");   
			sourceCodeElement = document.querySelector("#editor .view-lines");

			const newLanguageSet = languageText !== languageElement.innerText;
			if (!runSolverInitiated || newLanguageSet) {
				console.log("parsing new source code")
				languageText = languageElement.innerText;
				problemText = descriptionElement.innerText;
				sourceCodeText = sourceCodeElement.innerText;
				runSolver();

				runSolverInitiated = true
			}

		}, 500)

	}
}, intervalTime);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.type === "autoPaste") {
    	window.dispatchEvent(new CustomEvent("sendChromeData", {detail: { sourceCode: message.sourceCode, type: "autoPaste" } }));
    } else if (message.type === "autoType") {
    	window.dispatchEvent(new CustomEvent("sendChromeData", {detail: { sourceCode: message.sourceCode, type: "autoType" } }));
    }

    return true
});


