let currentProblemState = null
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.type === "leetcode-solver-problem") {
        currentProblemState = message.data;
    } else if (message.type === "get-current-problem") {
        sendResponse(currentProblemState)
    }

    return true
});