import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap';
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

export default class ChooseGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEpisode: 0,
            seasons: [],
            selectedSeason: 0,
            episodes: [],
            selectedRound: "",
            categories: [],
            headerMessage: "Choose which Jeopardy! board you'd like to play.",
            catNames: [],
            currentQ: "",
            currentAnswer: "",
            answerForm: "",
            playerAnswer: "",
            score: 0,
            currentValue: 0
        }

        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        this.handleEpisodeChange = this.handleEpisodeChange.bind(this);
        this.handleRoundChange = this.handleRoundChange.bind(this);
        this.submitBoard = this.submitBoard.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.overrideCorrect = this.overrideCorrect.bind(this);
        this.pass = this.pass.bind(this);
    }

    componentDidMount() {
        // Send an HTTP request to the server.
        fetch("http://localhost:8081/seasons", {
            method: 'GET' // The type of HTTP request.
        })
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(seasonList => {
                if (!seasonList) return;
                let seasonDivs = seasonList.map((seasonObj, i) =>
                <option value={seasonObj[0]}>Season {seasonObj[0]}</option>
                );

                // Set the state of the seasons list to the value returned by the HTTP response from the server.
                this.setState({
                    seasons: seasonDivs
                })
            })
            .catch(err => console.log(err))	// Print the error if there is one.
    }

    handleSeasonChange(e) {
		this.setState({
			selectedSeason: e.target.value
        });
        console.log(e.target.value);
        fetch("http://localhost:8081/episodes/" + e.target.value, {
            method: 'GET' // The type of HTTP request.
        })
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(episodeList => {
                if (!episodeList) return;
                let episodeDivs = episodeList.map((episodeObj, i) =>
                <option value={episodeObj[0]}>Episode aired on {episodeObj[1]}</option>
                );
                // Set the state of the seasons list to the value returned by the HTTP response from the server.
                this.setState({
                    episodes: episodeDivs
                })
            })
            .catch(err => console.log(err))
    }
    
    handleEpisodeChange(e) {
        this.setState({
			selectedEpisode: e.target.value
        });
    }
    handleRoundChange(e) {
        this.setState({
			selectedRound: e.target.value
        });
    }

    submitBoard() {
        fetch("http://localhost:8081/categories/" + this.state.selectedEpisode + '/' + this.state.selectedRound, {
            method: 'GET'
        })
        .then(res => res.json())
		.then(categoryList => {
            if (!categoryList) return;
            console.log(categoryList[0]);
            let categoryDivs = categoryList.map((catObj, i) => 
            <div className="col-md-2">
                <div className="header" key={i}><strong style={{color: "red"}}>{catObj[0]}</strong></div>
            </div>
            )
            let categoryNames = categoryList.map((catObj, i) =>
            catObj[0]);
		this.setState({
            categories: categoryDivs,
            headerMessage: "Choose a question.",
            catNames: categoryNames,
            score: 0,
            answerForm: ""
        })
		})
		.catch(err => console.log(err))
    }

    submitQuestion(value, catIndex) {
        console.log("Chose question of value " + value + " in category " + this.state.catNames[catIndex]);
        fetch("http://localhost:8081/getqa/" + value + '/' + this.state.catNames[catIndex] + '/' + this.state.selectedEpisode + '/' + this.state.selectedRound + '/', {
            method: 'GET'
        })
        .then(res => res.json())
		.then(qaList => {
            if (!qaList) return;
            console.log(qaList);
            let q = qaList[0][0];
            let ans = qaList[0][1];
            console.log(q);
        
            let answerForm = <div><br></br>
            <div className="row">
            <div className="mx-auto">
                    <div className="input-container">
                        <input type="text" placeholder="Enter your answer" onChange={this.handleAnswerChange}></input>
                        <input type="submit" value="Submit Answer" onClick={this.submitAnswer}></input>
                        <button value="Pass" onClick={this.pass}>Pass</button>
                    </div>
                </div>
            </div>
            </div>;

            console.log("Answer: " + ans);
		this.setState({
            headerMessage: "QUESTION: " + q,
            currentQ: q,
            currentAnswer: ans,
            answerForm: answerForm,
            currentValue: value
        })
		})
		.catch(err => console.log(err))
    }

    pass() {
        let passMessage = <div>
                <br></br>
                <div className="row">
                    <div className="mx-auto">
                        <h3>You passed. The correct answer was "{this.state.currentAnswer}". Pick a new question when you're ready.</h3>
                    </div>
                </div>
                </div>
        this.setState({
            answerForm: passMessage
        })
    }

    handleAnswerChange(e) {
        this.setState({
            playerAnswer: e.target.value
        });
    }

    submitAnswer() {
        console.log("Player's answer: " + this.state.playerAnswer + ". Correct answer: " + this.state.currentAnswer);
        if (this.state.playerAnswer.toLowerCase() === this.state.currentAnswer.toLowerCase()) {
            let correctAnswerMessage = <div>
                <br></br>
                <div className="row">
                    <div className="mx-auto">
                        <h3>Your answer, "{this.state.playerAnswer}" was correct! You earned {this.state.currentValue} points. Pick a new question when you're ready.</h3>
                    </div>
                </div>
                </div>
            let newScore = this.state.score + this.state.currentValue;
            this.setState({
                answerForm: correctAnswerMessage,
                score: newScore
            })
        } else {
            let incorrectAnswerMessage = <div>
                <br></br>
                <div className="row">
                    <div className="mx-auto">
                        <h3>Your answer, "{this.state.playerAnswer}" was incorrect. The correct answer was: {this.state.currentAnswer}. If your answer is actually correct, please click the "Override" button below. You lost {this.state.currentValue} points. Pick a new question when you're ready.</h3>
                        <button onClick={this.overrideCorrect}>Override</button>
                    </div>
                </div>
                </div>
            let newScore = this.state.score - this.state.currentValue;
            this.setState({
                answerForm: incorrectAnswerMessage,
                score: newScore
            })
        }
    }

    overrideCorrect() {
        let newScore = this.state.score + 2 * this.state.currentValue;
        let overriddenAnswerMessage = <div>
                <br></br>
                <div className="row">
                    <div className="mx-auto">
                        <h3>Your answer, "{this.state.playerAnswer}" has now been counted as correct. You earned {this.state.currentValue} points. Pick a new question when you're ready.</h3>
                    </div>
                </div>
                </div>
        this.setState({
            score: newScore,
            answerForm: overriddenAnswerMessage
        })
    }

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <div className="row">
                        <div className="mx-auto">
                            <h1>{this.state.headerMessage}</h1>
                        </div>
                        <br></br>
                    </div>
                    {this.state.answerForm}
                    <br></br>
                    <div className="row">
                        <div className="mx-auto">
                            <p><strong>SCORE: </strong>{this.state.score}</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="mx-auto">
                    <div className="dropdown-container">
			            <select value={this.state.selectedSeason} onChange={this.handleSeasonChange} className="dropdown" id="seasonDropdown">
			            	<option select value> -- select a season -- </option>
			            	{this.state.seasons}
			            </select>
                        <select value={this.state.selectedEpisode} onChange={this.handleEpisodeChange} className="dropdown" id="episodeDropdown">
			            	<option select value> -- select an episode -- </option>
			            	{this.state.episodes}
			            </select>
                        <select value={this.state.selectedRound} onChange={this.handleRoundChange} className="dropdown" id="roundDropdown">
			            	<option select value> -- select a round -- </option>
			            	<option value="Jeopardy!">Jeopardy!</option>
                            <option value="Double Jeopardy!">Double Jeopardy!</option>
                            <option value="Final Jeopardy!">Final Jeopardy!</option>
			            </select>
			            <button className="submit-btn" id="boardSubmitBtn" onClick={this.submitBoard}>Submit</button>
			          </div>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    {this.state.categories}
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2">
                        <button className="submit-btn" ref="0-200" id="0-200-SubmitBtn" onClick={() => this.submitQuestion(200, 0)}>200</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="1-200-SubmitBtn" onClick={() => this.submitQuestion(200, 1)}>200</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="2-200-SubmitBtn" onClick={() => this.submitQuestion(200, 2)}>200</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="3-200-SubmitBtn" onClick={() => this.submitQuestion(200, 3)}>200</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="4-200-SubmitBtn" onClick={() => this.submitQuestion(200, 4)}>200</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="5-200-SubmitBtn" onClick={() => this.submitQuestion(200, 5)}>200</button>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2">
                        <button className="submit-btn" id="0-400-SubmitBtn" onClick={() => this.submitQuestion(400, 0)}>400</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="1-400-SubmitBtn" onClick={() => this.submitQuestion(400, 1)}>400</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="2-400-SubmitBtn" onClick={() => this.submitQuestion(400, 2)}>400</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="3-400-SubmitBtn" onClick={() => this.submitQuestion(400, 3)}>400</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="4-400-SubmitBtn" onClick={() => this.submitQuestion(400, 4)}>400</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="5-400-SubmitBtn" onClick={() => this.submitQuestion(400, 5)}>400</button>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2">
                        <button className="submit-btn" id="0-600-SubmitBtn" onClick={() => this.submitQuestion(600, 0)}>600</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="1-600-SubmitBtn" onClick={() => this.submitQuestion(600, 1)}>600</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="2-600-SubmitBtn" onClick={() => this.submitQuestion(600, 2)}>600</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="3-600-SubmitBtn" onClick={() => this.submitQuestion(600, 3)}>600</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="4-600-SubmitBtn" onClick={() => this.submitQuestion(600, 4)}>600</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="5-600-SubmitBtn" onClick={() => this.submitQuestion(600, 5)}>600</button>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2">
                        <button className="submit-btn" id="0-800-SubmitBtn" onClick={() => this.submitQuestion(800, 0)}>800</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="1-800-SubmitBtn" onClick={() => this.submitQuestion(800, 1)}>800</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="2-800-SubmitBtn" onClick={() => this.submitQuestion(800, 2)}>800</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="3-800-SubmitBtn" onClick={() => this.submitQuestion(800, 3)}>800</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="4-800-SubmitBtn" onClick={() => this.submitQuestion(800, 4)}>800</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="5-800-SubmitBtn" onClick={() => this.submitQuestion(800, 5)}>800</button>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2">
                        <button className="submit-btn" id="0-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 0)}>1000</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="1-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 1)}>1000</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="2-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 2)}>1000</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="3-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 3)}>1000</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="4-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 4)}>1000</button>
                    </div>
                    <div className="col-md-2">
                        <button className="submit-btn" id="5-1000-SubmitBtn" onClick={() => this.submitQuestion(1000, 5)}>1000</button>
                    </div>
                </div>
            </div >
        )
    }


}