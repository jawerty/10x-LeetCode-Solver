# 10x-LeetCode-Solver
A chrome extension that solves leet code problems for you

Build during this live stream in 6 hours -> [Youtube Live Stream](https://youtube.com/live/3cCQ_geKWRk)

# How to use
### 1) Install the packages
Run npm install (or yarn)
```
$ npm install
```

### 3) Load the extension
See [Chrome's developer tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/) on how to start a chrome extension project. You can select this repository as the unpacked extension to run (should work out of the box)

### 3) Run The Colab API

The bot runs off of an API coded in [colab](https://colab.research.google.com/drive/1-G9tuDbC3gdqiaGBmFBdQ2N46rsv-zBX?usp=sharing) that's running flask/ngrok. The API is in front of Code LLama Instruct. You can run the colab here. *Remember you have to copy the ngrok url to the `popup/components/SolverForm.js` file*

Update this url with the new ngrok url from flask
```
	const apiUrl = "http://6bf4-34-143-150-41.ngrok.io"; // change this line
```

