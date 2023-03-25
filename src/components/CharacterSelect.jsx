import React, { useEffect, useState } from "react";
import billionaire from "../img/billionaire.png";
import drunk from "../img/drunk.png";
import emoji from "../img/emoji.png";
import hillbilly from "../img/hillbilly.png";
import hippie from "../img/hippie.png";
import scotsman from "../img/scotsman.png";
import shakespeare from "../img/shakespeare.png";
import child from "../img/child.png";
import karen from "../img/karen.png";
import headmistress from "../img/headmistress.png";
import CharacterDebate from "./CharacterDebate";

const CharacterSelect = () => {
  const characters = [
    {
      name: "Shakespearean Theologian",
      attitude: "Pompous, arrogant, philosophical, witty",
      style: "Shakespearean iambic pentameter",
      opinion: "",
      img: shakespeare,
    },
    {
      name: "Drunkard",
      attitude: "Drunk, rambling, belligerent, enthusiastic",
      style: "Heavily inebriated, slurring speech",
      opinion: "",
      img: drunk,
    },
    {
      name: "Emoji Bot",
      attitude: "Homocidal, murderous, psychotic",
      style: "speaks exclusively in emojis, no words",
      opinion: "",
      img: emoji,
    },
    {
      name: "Child",
      attitude: "Innocent, naive, sweet",
      style: "simple, mundane, direct, childish",
      opinion: "",
      img: child,
    },
    {
      name: "Headmistress",
      attitude: "Prim, proper, uptight, strict, acting for the children",
      style:
        "British, posh, proper, proper English, educated, fascist, authoritarian",
      opinion: "",
      img: headmistress,
    },
    {
      name: "Hillbilly",
      attitude: "Arrogant, cocky, uneducated",
      style: "redneck hillbilly from rural America",
      opinion: "",
      img: hillbilly,
    },
    {
      name: "Hippie",
      attitude: "Peaceful, ambivalent, apathetic, disconnected from reality",
      style: "hippie, incredibly stoned",
      opinion: "",
      img: hippie,
    },
    {
      name: "Scotsman",
      attitude: "fighter, strongman, forceful, witty, hilarious",
      style: "thick Scottish dialect",
      opinion: "",
      img: scotsman,
    },
    {
      name: "Billionaire",
      attitude:
        "filthy rich, greedy, cutthroat, indifferent to the plight of the poor",
      style: "pompous, upper class modern enlgish",
      opinion: "",
      img: billionaire,
    },
    {
      name: "Karen",
      attitude: "entitled, demanding, self-righteous, disrespectful",
      style:
        "demands to speak with the manager, is always right, won't listen to reason",
      opinion: "",
      img: karen,
    },
  ];

  const [character_rows, set_character_rows] = useState([]);
  const [debator_one, set_debator_one] = useState(null);
  const [debator_two, set_debator_two] = useState(null);
  const [debate_style, set_debate_style] = useState("murderous");
  const [commence, set_commence] = useState(false);
  const [api_key, set_api_key] = useState("");
  const [model, set_model] = useState("gpt-3.5-turbo-0301");

  useEffect(() => {
    let count = 0;
    const character_rows = [];

    let row;
    for (const character of characters) {
      if (count === 0) {
        row = [];
        character_rows.push(row);
      }

      row.push(character);
      count = (count + 1) % 5;
    }

    console.log(character_rows);
    set_character_rows(character_rows);
  }, []);

  return !commence ? (
    <div className="character-select">
      <h2>Select your debators</h2>
      {!debator_one || !debator_two
        ? character_rows.map((row) => {
            return (
              <div className="character-select__row">
                {row.map((character, index) => (
                  <div
                    key={index}
                    className="character-select__character"
                    onClick={() => {
                      if (!debator_one) {
                        set_debator_one(character);
                      } else {
                        set_debator_two(character);
                      }
                    }}
                  >
                    <img
                      src={character.img}
                      className="character-select__character__img"
                    />
                    <div className="character-select__character__name">
                      {character.name}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        : ""}

      <div className="player-characters">
        {debator_one ? (
          <div className="player-characters__character">
            <h2>Debator 1</h2>
            <div className="player-characters__character__profile">
              <img src={debator_one.img} />
              <p>{debator_one.name}</p>
            </div>
            <label className="player-characters__opinion">
              The {debator_one.name}'s Opinion:
            </label>
            <textarea
              className="player-characters__input"
              value={debator_one.opinion}
              onChange={(e) => {
                set_debator_one({ ...debator_one, opinion: e.target.value });
              }}
            />
          </div>
        ) : (
          ""
        )}
        {debator_two ? (
          <div className="player-characters__character">
            <h2>Debator 2</h2>
            <div className="player-characters__character__profile">
              <img src={debator_two.img} />
              <p>{debator_two.name}</p>
            </div>
            <label className="player-characters__opinion">
              The {debator_two.name}'s Opinion:
            </label>
            <textarea
              className="player-characters__input"
              value={debator_two.opinion}
              onChange={(e) => {
                set_debator_two({ ...debator_two, opinion: e.target.value });
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {debator_one && debator_two ? (
        <div className="debate-settings">
          <form>
            <label>Debate style:</label>
            <select
              onChange={(e) => {
                set_debate_style(e.target.value);
              }}
              value={debate_style}
            >
              <option value="cordial">Cordial</option>
              <option value="normal"> Normal</option>
              <option value="fierce">Fierce</option>
              <option value="murderous">Murderous</option>
            </select>
            <br />
            <br />
            <label>API Key:</label>
            <input
              className="api-key"
              value={api_key}
              type="password"
              onChange={(e) => {
                set_api_key(e.target.value);
              }}
            ></input>
            <br />
            <br />
            <label>Model:</label>
            <select
              onChange={(e) => {
                set_model(e.target.value);
              }}
              value={model}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-3.5-turbo-0301"> gpt-3.5-turbo-0301</option>
              <option value="gpt-4">gpt-4</option>
              <option value="gpt-4-0314">gpt-4-0314</option>
            </select>
          </form>
          <div
            className="debate-settings__button"
            onClick={() => {
              if (debator_one.opinion && debator_two.opinion && api_key)
                set_commence(true);
            }}
          >
            Start Debate
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <CharacterDebate
      debator_one={debator_one}
      debator_two={debator_two}
      debate_style={debate_style}
      api_key={api_key}
      model={model}
    />
  );
};

export default CharacterSelect;
