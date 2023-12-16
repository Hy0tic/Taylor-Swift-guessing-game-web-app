import { useState,useEffect } from "react";
import { useForm } from '@mantine/form';
import "./GamePanel.css";
import AlbumCover from "../AlbumCover";
import { compareStrings, removeSpaces } from "../utils/StringHelpers";
import LifeIndicator from "./LifeIndicator";


const GamePanel = () => {
    // states
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [isCorrect, setIsCorrect] = useState(null);

    // // form hook
    // const form = useForm({
    //     initialValues: {
    //         answerInput: ''
    //       }
    //   });
      
    // useEffect block
    useEffect(() => {
        // Start the fetch operation as soon as the component mounts
        fetch('https://vrfyzb0h4c.execute-api.us-east-1.amazonaws.com/prod/get',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        })
          .then(response => {
            if (!response.ok) {
              // If response is not ok, throw an error
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setData(data); // Set data from the response
            setIsLoading(false); // Set loading to false since the data is received
          })
          .catch(error => {
            setError(error); // If an error occurs, set the error state
            setIsLoading(false); // Ensure loading is set to false
          });
    
        // The empty dependency array means this effect will only run once on mount
      }, []);

      if (isLoading) {
        return <div className="loading">Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
    

      const handleAnswer = (input) => {
        if(compareStrings(input, String(data.title))){
            setIsCorrect(true);
        }
        else{
            setAttemptsLeft(attemptsLeft - 1);
        }
      }

      const hearts = Array.from({ length: attemptsLeft }, (_, index) => (
        <div id="heart"></div>
      ));
      

      return (
        <div>
          <LifeIndicator attemptsLeft={attemptsLeft}/>

          Attempts Left: {attemptsLeft}

          <p className="question">
              Which Taylor Swift song is this quote from?
          </p>

          <div className="albumImageContainer">
            <img className="albumImage" src={AlbumCover[`${removeSpaces(data.album.toLowerCase())}`]} alt={"albumImage"}/>
          </div>

          <p className="quote">Quote: "{data.quote}"</p>
          
            {(attemptsLeft > 0) ? 
                <>
                  {/* <form onSubmit={form.onSubmit((input) => handleAnswer(input))}>
                    <input
                        className="answerInput"
                        placeholder="Type your answer here"
                        radius="md"
                        size="md"
                        autoFocus
                        {...form.getInputProps('answerInput')}
                    />
                  </form> */}

                  <div className="choice-container">
                    {data.choices.map((choice, index) => (
                      <div className="choice" key={index} onClick={() => handleAnswer(String(choice))}>
                        <div className="choice-text">
                          {choice}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
                :
                <>No attempts left on this question :(</>
            }

            {isCorrect ? <>CORRECTTTTTTTT!!!!</> : <></>}
        </div>
      );
}

export default GamePanel;