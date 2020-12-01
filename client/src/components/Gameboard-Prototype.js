import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Gameboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            episode: 0,
            value: 0,
            categories: [],
            category: "",
            question: "",
            answer: ""
        }

        this.handleEpisodeChange = this.handleEpisodeChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.submitEpisode = this.submitEpisode.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
    }
    handleEpisodeChange(e) {
		this.setState({
			episode: e.target.value
		});
    }
    
    handleValueChange(e) {
		this.setState({
			value: e.target.value
		});
    }
    
    handleCategoryChange(e) {
		this.setState({
			category: e.target.value
		});
	}

    submitEpisode() {
        fetch("http://localhost:8081/categories/" + this.state.episode + '/Jeopardy!', {
            method: 'GET'
        })
        .then(res => res.json())
		.then(categoryList => {
            if (!categoryList) return;
            console.log(categoryList[0][0]);
			let categoryDivs = categoryList.map((catObj, i) => 
			<div className="header" key={i}><strong>{catObj[0]}</strong></div>
		);
            console.log(typeof(categoryDivs));
		this.setState({
			categories: categoryDivs
        })
        console.log("State: " + typeof(this.state.categories));
		})
		.catch(err => console.log(err))
    }

    submitQuestion() {
        fetch("http://localhost:8081/getqa/" + this.state.value + '/' + this.state.category + '/' + this.state.episode + '/Jeopardy!/', {
            method: 'GET'
        })
        .then(res => res.json())
		.then(qaList => {
            if (!qaList) return;
            console.log(qaList);
            let q = qaList[0][0];
            let ans = qaList[0][1];
            console.log(q);
			//let qaDivs = qaList.map((qaObj, i) => 
			//<div className="header" key={i}><strong>{qaObj[0]}</strong></div>);

		this.setState({
            question: q,
            answer: ans
        })
		})
		.catch(err => console.log(err))
    }

    render() {
        return (
            <div className="jumbotron">
            <div className="input-container">
                <input type='number' placeholder="Enter Episode Number" onChange={this.handleEpisodeChange} id="episode" className="episode-input"/>
			    <button id="submitSznBtn" className="submit-btn" onClick={this.submitEpisode}>Submit</button>
            </div>

            <div className="header-container">
                <div className="h6">Questions</div>
			    			<div className="headers">
			    				{this.state.categories}
			    			</div>
            </div>

            <div className="input-container">
                <input type='number' placeholder="Enter Question Value" onChange={this.handleValueChange} id="value" className="value-input"/>
                <input type='text' placeholder="Enter Category" onChange={this.handleCategoryChange} id="category" className="category-input"/>
			    <button id="submitQuestionBtn" className="submit-btn" onClick={this.submitQuestion}>Submit</button>
            </div>

            <div >QUESTION: {this.state.question}</div>
            <div >ANSWER: {this.state.answer}</div>

            </div>
        )
    }
}