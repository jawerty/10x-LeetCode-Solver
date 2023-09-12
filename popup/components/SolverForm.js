import { useState, useEffect } from "react";
import Switch from "react-switch";

import pacman from "../../pacman.svg";

import "../styles/solver-form.scss";

function SolverForm() {
	const [loading, setLoading] = useState(false);
	const [solution, setSolution] = useState();
	const [leetCodeProblemInfo, setLeetCodeProblemInfo] = useState()
		
	const apiUrl = "http://d350-34-143-184-211.ngrok.io"

	useEffect(() => {
		let interval; 

		const fetchCurrentProblemInfo  = (cb) => {
			chrome.runtime.sendMessage({
				type: "get-current-problem"
			}, (response) => {
				if (response) {
					clearInterval(interval)
					console.log("got problem", response)
					setLeetCodeProblemInfo(response)
				}
			})
		}

		interval = setInterval(() => {
			fetchCurrentProblemInfo()
		}, 100);

		return () => {
			clearInterval(interval)
		}
	}, [])

	
	const solve = async () => {
		const getSolutionPrompt = () => {
		return `[INST]
		<<SYS>>
		You are a senior software engineer bot. Your role is to get coding interview problems and solve them using the given programming language.
		Your duties are the following
		- You must follow the directions you're given and ensure every single point in the problem is addressed.
		- You must ensure each example case in the given problem would successfully run
		- You MUST implement each constraint that is given in the problem statement
		- You Do NOT need to address the given follow up at the end of the problem.
		- You will be given the incomplete problem source code. You must complete the source code given using the problem statement.
		- Only respond with the solution written in the given programming language. Remember the solution must be a completed version of the incomplete source code. 
		- Structure your response in markdown code format with the code between 3 back ticks;
		- You must complete the problem in the desired programming language given by the user. ONLY use the programming language given.

		Let me reiterate
		- You must follow the directions you're given and ensure every single point in the problem is addressed.
		- You must ensure each example case in the given problem would successfully run
		- You MUST implement each constraint that is given in the problem statement


		The user will probide the language to solve the problem and the problem in the below:
		LANGUAGE: the desired programming language
		PROBLEM: the problem 
		INCOMPLETE SOURCE CODE: the incomplete source code

		<</SYS>>

		LANGUAGE: ${leetCodeProblemInfo.languageText}
		PROBLEM: ${leetCodeProblemInfo.problemText} 
		INCOMPLETE SOURCE CODE: ${leetCodeProblemInfo.sourceCodeText}
		[/INST]`
		};
		setLoading(true)
		const prompt = getSolutionPrompt()
		console.log("Prompt", prompt)
		try {
			const response = await fetch(apiUrl + "/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					prompt
				})
			})
			const result = await response.json()
			setSolution(result['output']);
	
		} catch(e) {
			console.log(e)
		}
		
		setLoading(false)

	}

	const autoPaste = () => {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {type:"autoPaste", sourceCode: solution});
		});
	}

	const autoType = () => {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {type:"autoType", sourceCode: solution});
		});
	}

	return <div className="solver-form h-100 w-100 flex flex-column">
		{!leetCodeProblemInfo && <div className="solver-form__no-problem-state flex flex-grow justify-center align-center">
			<h2 className="solver-form__no-problem-state__title">There is no leetcode problem to solve!</h2>
		</div>}
		{leetCodeProblemInfo && <div className="solver-form__info">
			<div className="solver-form__info-list flex flex-column">
				<div className="solver-form__info-item">
					<label><b>Language:</b></label>
					<span>{leetCodeProblemInfo.languageText}</span>
				</div>
				<div className="solver-form__info-item">
					<label><b>Problem:</b></label>
					<span dangerouslySetInnerHTML={{ __html: leetCodeProblemInfo.problemText.split("\n").join("<br />") }}></span>
				</div>
				<div className="solver-form__info-item">
					<label><b>Source Code To Complete:</b></label>
					<span dangerouslySetInnerHTML={{ __html: leetCodeProblemInfo.sourceCodeText.split("\n").join("<br />") }}></span>
				</div>
			</div>
		</div>}
		


		{loading && <div className="solver-form__loading flex align-center justify-center w-100">
			<img src={pacman}/>
		</div>}
		{solution && <div className="solver-form__solution w-100 flex flex-column align-center justify-center">
			<h2 className="solver-form__solution-header">Solution:</h2>
			<textarea readOnly value={solution}></textarea>

			<div className="solver-form__options w-100 flex align-center justify-center">
				<button className="solver-form__options-btn" onClick={() => {
					autoPaste()
				}}>
					Auto Paste
				</button>
				<button className="solver-form__options-btn" onClick={() => {
					autoType()
				}}>
					Auto Type (w/ Human Delay)
				</button>
			</div>
		</div>}


		{leetCodeProblemInfo && <div className="solver-form__form-content">
			<button className="solver-form__submit cursor-pointer" onClick={solve}>{(!solution) ? "Solve it" : "Try again"}</button>
		</div>}
	</div>
}

export default SolverForm;