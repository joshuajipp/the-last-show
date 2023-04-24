import React, { useEffect } from "react";
import Header from "./components/Header";
import Obituary from "./components/Obituary";
import AddObituaryModal from "./components/AddObituaryModal";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [obituaries, setObituaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function openModal() {
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
  }

  async function newObituary(newObituary) {
    const res = await fetch(
      "https://gbabcf7lyvz3bdbpmghg2gr3oa0ucixr.lambda-url.ca-central-1.on.aws/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObituary),
      }
    );
    getObituary();
  }

  async function getObituary() {
    const res = await fetch(
      "https://6k5ytemwyfv7y5eke6q3vxlon40rrlsl.lambda-url.ca-central-1.on.aws/",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    setObituaries(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getObituary();
  }, []);

  return (
    <div>
      <AddObituaryModal
        onNew={newObituary}
        showModal={showModal}
        setShowModal={setShowModal}
        closeModal={closeModal}
      />
      <div className="home-page">
        <Header toggleModal={openModal} />

        {isLoading ? (
          <div className="loader"></div>
        ) : obituaries.length > 0 ? (
          <Masonry
            breakpointCols={{
              default: 3,
              1100: 2,
              700: 1,
            }}
            className="masonry-grid"
          >
            {obituaries.map((obituaryItem) => (
              <div key={uuidv4()} className="card-parent">
                <Obituary
                  image={obituaryItem.image_url}
                  name={obituaryItem.name}
                  birth={obituaryItem.birth_date}
                  death={obituaryItem.death_date}
                  content={obituaryItem.text}
                  audio={obituaryItem.mp3_url}
                />
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="no-obituary">
            <p className="no-obituary-text">No Obituaries Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
