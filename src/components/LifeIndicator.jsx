import "./LifeIndicator.css";

const LifeIndicator = ({attemptsLeft}) => {
    console.log(attemptsLeft);
    const hearts = Array.from({ length: attemptsLeft }, (_, index) => (
        <div id="heart"></div>
      ));

    return (<div className="heart-container">
        {hearts}
    </div>);
}

export default LifeIndicator;