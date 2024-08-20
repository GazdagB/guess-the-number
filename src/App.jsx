import { useState, useEffect, useRef } from 'react';
import './App.css';

import { VscDebugRestart } from "react-icons/vsc";



function App() {
  const maxNumberGuess = 100;

  const [randomNumber, setRandomNumber] = useState(null);
  const [playerGuess, setPlayerGuess] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [isWon, setWon] = useState(false);
  const [message, setMessage] = useState("You can take a guess!");
  const [celebrate,setCelebrate] = useState(false)
  const [numberOfGuesses, setNumberOfGuesses] = useState(0);
  const [errMessage,setErrMessage] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    initGame()
  }, []);

  useEffect(() => {
    if (playerGuess !== null) {
      checkWin();
    }
  }, [playerGuess]);

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setCelebrate(false), 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when isWon changes
    }
  }, [celebrate]);

  function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  function checkWin() {
    if (playerGuess === randomNumber) {
      setWon(true);
      setCelebrate(true)
      setMessage("🏆✅ Congrats! You Guessed The right number.");
    } else if (playerGuess > randomNumber) {
      setMessage("🔺 Too High.");
    } else if (playerGuess < randomNumber) {
      setMessage("🔻 Too Low.");
    } else {
      setMessage("Incorrect Input. Please enter a number between 0-100.");
    }
  }

  function initGame(){
    setRandomNumber(getRandomNumber(maxNumberGuess));
    setNumberOfGuesses(0)
    setInputValue("")
    setWon(false)
    setMessage("You can take a guess!")
    setPlayerGuess(null)

  }


  function handleBtnClick() {
    if(validateInput()){
      setPlayerGuess(inputValue * 1);
      incrementGuesses()
      setInputValue("");
    }
    
  }

  function validateInput(){
    if( typeof (inputValue * 1) != "number"){
      setErrMessage("Your input is not a number.")
      return false;
    } else if( inputValue > 100){
      setErrMessage("Your guess can't be higher than 100.")
      return false;
    } else if(inputValue < 0){
      setErrMessage("Yout guess can't be lower than 0.")
      return false; 
    }

    setErrMessage("")
    return true;
  }

  function handleReset(){
    initGame()
  }

  function incrementGuesses(){
    setNumberOfGuesses(numberOfGuesses + 1)
  }

  function handleEnter(key) {
    if (key === "Enter" && validateInput()) {
      setPlayerGuess(inputValue * 1);
      incrementGuesses();
      setInputValue("");
    }
  }

  function handleFocus(){
    inputRef.current.select();
  }

  function checkInput(value){
    if(value * 1 > 100){
      setInputValue(100);
    }else if( value * 1 < 0){
      setInputValue(0)
    }
  }

  return (
    <div className='App'>
      <div className='card'>
    
      
      
        {
          isWon &&
          <>
          {celebrate && <img className='winner-img' src='https://media.tenor.com/yqyHqTYHnBkAAAAM/thumbs-up-90s.gif' />}
          <div className='winner-container'>
            <h2>Well Done! You Guessed it!</h2>
            <div className='results'>
              <p>The Number was: {randomNumber}</p>
              <p>And you guessed it by only {numberOfGuesses} tries</p>
            </div>
            <button onClick={handleReset} className='btn-restart'>Restart</button>
          </div>
          </>
        }
       
       {
        !isWon &&

        <div className='game-container'>
          
          <div className='title-container'>
            <p className='title'>I am thinking of a number between 1-100.</p>
            <p className='title'>Can you guess it?</p>
          </div>
          {errMessage ? <p className='err-message'>{errMessage}</p> : <p>{message}</p>}
          <div className='flex restart-container'>
            <VscDebugRestart className='restart-icon' onClick={handleReset} />
            <div className="input-container">
              <input
                onChange={(e) => { 
                  setInputValue(e.target.value); 
                  checkInput(e.target.value);
                }}
                value={inputValue}
                onKeyDown={(e) => handleEnter(e.key)}
                className='number-input no-arrows'
                type="number"
                maxLength={3}
                max={100}
                ref={inputRef}
                onFocus={handleFocus}
                name="number"
                id="numberInput"
                placeholder='00'
              />
              <button onClick={handleBtnClick} className={`btn-submit ${isWon ? "disabled" : ""}`}>Guess</button>
            </div>
          </div>
          <div>
            <p>Number of Guesses: {numberOfGuesses}</p>
          </div>
        </div>
        }
        
     </div>
  </div>
  );
}

export default App;