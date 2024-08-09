import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Container, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizData();
    }, []);

    const fetchQuizData = async () => {
        setLoading(true);
        setSelectedOption('');
        setResult(null);
        try {
            const response = await axios.get(`https://qz-var.vercel.app/api/user/qz`);
            setQuizData(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setLoading(false);
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(selectedOption);
    };

    // const handleSubmit = () => {
    //     if (selectedOption === quizData.correctAnswer) {
    //         setResult('Correct!');
    //     } else {
    //         setResult('Incorrect! The correct answer was ' + quizData.correctAnswer);
    //     }a
    // };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`https://qz-var.vercel.app/api/user/submitAnswer`, {
                wordId: quizData.wordId,
                selectedOption,
            });
    
            const { correct, correctAnswer } = response.data;
            setResult(correct ? 'Correct!' : `Incorrect! The correct answer was ${correctAnswer}`);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };
    
    

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} className="quiz-container">
                <Typography variant="h4" component="h1" gutterBottom>
                    Varshith's App
                </Typography>
                {quizData ? (
                    <>
                        <Typography variant="h6" component="h2">
                            What is the meaning of the word: <strong>{quizData.word}</strong>?
                        </Typography>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Choose the correct meaning</FormLabel>
                            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                                {quizData.options.map((option, index) => (
                                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                                ))}
                            </RadioGroup>
                            <Button variant="contained" color="primary" onClick={handleSubmit} className="submit-button">
                                Submit
                            </Button>
                            
                            <Button variant="contained" color="secondary" onClick={fetchQuizData}  style={{ marginTop: '20px' }} className="new-question-button">
                                New Question
                            </Button>
                        </FormControl>
                        {result && (
                            <Typography variant="h6" component="p" className="result">
                                {result}
                            </Typography>
                        )}
                    </>
                ) : (
                    <Typography variant="h6" component="p">
                        No quiz data available.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Quiz;
