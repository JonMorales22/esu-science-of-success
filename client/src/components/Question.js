import React from 'react';

/*
	simple component used to display a question and its contents
	props:
		text - question text
		number - question number
*/

function Question(props){
	return (
		<div className='question'>
			<h2>Question {props.number}</h2>
			<textarea name='trial' rows='10' cols='50' value={props.text} readOnly></textarea>
		</div>
	)
}

export default Question;