import { useState,useEffect } from "react";
import { useForm } from '@mantine/form';
import "./GamePanel.css";

const AlbumEnum = {
  "midnights": "https://upload.wikimedia.org/wikipedia/en/9/9f/Midnights_-_Taylor_Swift.png",
  "speaknow": "https://upload.wikimedia.org/wikipedia/en/5/5b/Taylor_Swift_-_Speak_Now_%28Taylor%27s_Version%29.png",
  "red": "https://upload.wikimedia.org/wikipedia/en/4/47/Taylor_Swift_-_Red_%28Taylor%27s_Version%29.png",
  "1989" : "https://upload.wikimedia.org/wikipedia/en/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
  "fearless" : "https://upload.wikimedia.org/wikipedia/en/5/5b/Fearless_%28Taylor%27s_Version%29_%282021_album_cover%29_by_Taylor_Swift.png",
  "evermore": "https://upload.wikimedia.org/wikipedia/en/0/0a/Taylor_Swift_-_Evermore.png",
  "folklore" : "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png",
  "lover" : "https://upload.wikimedia.org/wikipedia/en/c/cd/Taylor_Swift_-_Lover.png",
  "reputation" : "https://upload.wikimedia.org/wikipedia/en/f/f2/Taylor_Swift_-_Reputation.png",
  "taylorswift" : "https://upload.wikimedia.org/wikipedia/en/1/1f/Taylor_Swift_-_Taylor_Swift.png"
}

const GamePanel = () => {
    // states
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [isCorrect, setIsCorrect] = useState(null);

    // form hook
    const form = useForm({
        initialValues: {
            answerInput: ''
          }
      });
      
    // useEffect block
    useEffect(() => {
        // Start the fetch operation as soon as the component mounts
        fetch('https://taylorswiftapi.onrender.com/get')
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
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
    

      const handleAnswer = (input) => {
        if(compareStrings(input.answerInput, String(data.song))){
            setIsCorrect(true);
        }
        else{
            setAttemptsLeft(attemptsLeft - 1);
        }
      }

      const hearts = Array.from({ length: attemptsLeft }, (_, index) => (
        <div id = "heart"></div>
      ));

      return (
        <div>
          <div className="heart-container">
            {hearts}
          </div>

          Attempts Left: {attemptsLeft}

          <p className="question">
              Which Taylor Swift song is this quote from?
          </p>

          <img className="albumImage" src={AlbumEnum[`${removeSpaces(data.album.toLowerCase())}`]} alt={"album"}/>

          <p className="quote">Quote: "{data.quote}"</p>
            {(attemptsLeft > 0) ? 
                <form onSubmit={form.onSubmit((input) => handleAnswer(input))}>
                  <input
                      className="answerInput"
                      placeholder="Type your answer here"
                      radius="md"
                      size="md"
                      autoFocus
                      {...form.getInputProps('answerInput')}
                  />
                </form>
                :
                <>No attempts left on this question :(</>
            }

            {isCorrect ? <>CORRECTTTTTTTT!!!!</> : <></>}
        </div>
      );
}

const compareStrings = (str1, str2) => {
    console.log(str1, " ... ", str2)
    // Normalize strings: trim, convert to lowercase, and remove spaces
    const normalize = (str) => {
        // Make sure str is a string
        if (typeof str !== 'string') {
          console.error('Expected a string');
          return ''; // or throw an error, depending on how you want to handle this case
        }
        return str.trim().toLowerCase().replace(/\s/g, '');
      };
      
  
    let s1 = normalize(str1);
    let s2 = normalize(str2);
  
    // Quick check for exact match
    if (s1 === s2) {
      return true;
    }
  
    // Check if strings are off by one character
    function isOneCharOff(s1, s2) {
      if (s1.length !== s2.length) {
        // Check if they are one insertion/deletion off
        let [longer, shorter] = s1.length > s2.length ? [s1, s2] : [s2, s1];
        for (let i = 0; i < longer.length; i++) {
          let shorterWithChar = longer.slice(0, i) + longer.slice(i + 1);
          if (shorterWithChar === shorter) {
            return true;
          }
        }
      } else {
        // Check if they are one replacement off
        let diffs = 0;
        for (let i = 0; i < s1.length; i++) {
          if (s1[i] !== s2[i]) {
            diffs++;
            if (diffs > 1) {
              return false;
            }
          }
        }
        return diffs === 1;
      }
      return false;
    }
  
    // Check if they are one character off
    return isOneCharOff(s1, s2);
  }

const removeSpaces = (str) => {
  return str.replace(/\s+/g, '');
}

export default GamePanel;