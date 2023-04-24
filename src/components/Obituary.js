import AudioPlayer from "./AudioPlayer";
import React from "react";

function Obituary(props) {
  const [isExpanded, setIsExpanded] = React.useState(props.isCardOpen);
  const dateBirthString = props.birth.replace(/-/g, "/");
  const dateDeathString = props.death.replace(/-/g, "/");
  const birthDate = new Date(dateBirthString);
  const deathDate = new Date(dateDeathString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const birthDay = birthDate.getDate();
  const birthMonthIndex = birthDate.getMonth();
  const birthYear = birthDate.getFullYear();

  const deathDay = deathDate.getDate();
  const deathMonthIndex = deathDate.getMonth();
  const deathYear = deathDate.getFullYear();

  const formattedBirthDate = `${monthNames[birthMonthIndex]} ${birthDay}, ${birthYear}`;
  const formattedDeathDate = `${monthNames[deathMonthIndex]} ${deathDay}, ${deathYear}`;

  function toggleContent() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="obituary">
      <div className="obituary-box">
        <img
          src={props.image}
          alt={props.name}
          className="squared"
          onClick={toggleContent}
        />

        <div className="obituary-text">
          <p>{props.name}</p>
          <small>
            {formattedBirthDate} - {formattedDeathDate}
          </small>
          {isExpanded && <p className="content">{props.content}</p>}
          {isExpanded && <AudioPlayer audio={props.audio} />}
        </div>
      </div>
    </div>
  );
}

export default Obituary;
