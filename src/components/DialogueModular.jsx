import React, { useState, useEffect, useRef } from "react";
import call_open_ai from "../utils/openai";
import steve from "../img/steve.png";
import stephen from "../img/stephen.png";

const Dialogue = () => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [dialogue, setDialogue] = useState([]);
  const [dialogueUpdate, setDialogueUpdate] = useState(null);
  const [td1, setTD1] = useState(false);
  const [td2, setTD2] = useState(false);
  const [topic, setTopic] = useState({
    d1: "",
    d1p: "",
    d1a: "",
    d2: "",
    d2p: "",
    d2a: "",
  });
  const [commenced, setCommenced] = useState(false);
  const [apikey, setApikey] = useState("");
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);

  const [d1, setD1] = useState([]);

  const [d2, setD2] = useState([]);

  useEffect(() => {
    if (commenced) {
      setD1([
        {
          role: "system",
          content: `You are ${topic.d1p} and your opponent is ${topic.d2p}.
                You have the following attitude: ${topic.d1a}. Engage in the debate in this style.
                If you see a prompt from the user that says "----" you should make an opening statement.
                You are in a philosophical debate with another person. You are arguing for the side of "${topic.d1}". 
                As ${topic.d1p}, this is your opinion, you 100% believe it.`,
        },
        {
          role: "user",
          content: "----",
        },
      ]);
      setD2([
        {
          role: "system",
          content: `You are ${topic.d2p} and your opponent is ${topic.d1p}.
          You have the following attitude: ${topic.d2a}. Engage in the debate in this style.
          If you see a prompt from the user that says "----" you should make an opening statement.
          You are in a philosophical debate with another person. You are arguing for the side of "${topic.d2}". 
          As ${topic.d2p}, this is your opinion, you 100% believe it.`,
        },
      ]);
      setTD1(true);
    }
  }, [commenced]);

  useEffect(() => {
    if (dialogueUpdate && active) {
      setDialogue([...dialogue.slice(0, -1), dialogueUpdate]);
      scrollToBottom();

      if (dialogueUpdate.id === 1) {
        setD1([
          ...d1,
          {
            role: "assistant",
            content: dialogueUpdate.text,
          },
        ]);

        setD2([
          ...d2,
          {
            role: "user",
            content: dialogueUpdate.text,
          },
        ]);

        setTD2(true);
      } else {
        setD2([
          ...d2,
          {
            role: "assistant",
            content: dialogueUpdate.text,
          },
        ]);

        setD1([
          ...d1,
          {
            role: "user",
            content: dialogueUpdate.text,
          },
        ]);

        if (count < 5) {
          setTD1(true);
          setCount(count + 1);
        }
      }
    }
  }, [dialogueUpdate]);

  useEffect(() => {
    if (count === 5) {
      setCount(0);
      setActive(false);
    }
  }, [count]);

  useEffect(() => {
    if (td1) {
      setTD1(false);
      setDialogue([...dialogue, { id: 1, text: "..." }]);
      trigger_dialogue_1(d1);
    } else if (td2) {
      setTD2(false);
      setDialogue([...dialogue, { id: 2, text: "..." }]);
      trigger_dialogue_2(d2);
    }
  }, [td1, td2]);

  useEffect(() => {
    if (!active && dialogue.length > 0) {
      setDialogue(dialogue.slice(0, -1));
    }
  }, [active]);

  const token_count = (dialogue, setFunction) => {
    const count = dialogue.reduce((acc, d) => {
      return (acc = acc + d.content.length);
    }, 0);
    console.log("count", count);
    console.log("dialogue", dialogue);

    if (count > 8000) {
      setFunction([dialogue[0], ...dialogue.slice(3, dialogue.length)]);
      return [dialogue[0], ...dialogue.slice(3, dialogue.length)];
    } else return dialogue;
  };

  const trigger_dialogue_1 = async (d1) => {
    const dialogue = token_count(d1, setD1);
    const res = await call_open_ai({ messages: dialogue }, apikey);
    setDialogueUpdate({ id: 1, text: res });
  };

  const trigger_dialogue_2 = async (d2) => {
    const dialogue = token_count(d2, setD2);

    const res = await call_open_ai({ messages: dialogue }, apikey);
    setDialogueUpdate({ id: 2, text: res });
  };

  return (
    <div className="debate">
      <h1>The Great Debate</h1>
      {commenced ? (
        <div>
          {dialogue.map((d, index) => (
            <div key={index}>
              <div className={`${d.id === 1 ? "left" : "right"} text-bubble`}>
                {d.id === 1 && <img src={steve} />}
                <span>{d.text}</span>
                {d.id === 2 && <img src={stephen} />}
              </div>
            </div>
          ))}
          {!active && (
            <div
              className="button"
              onClick={() => {
                setActive(true);
                setTD1(true);
              }}
            >
              Continue the debate!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div style={{ padding: "2rem" }}>
          <h2>The First Debator</h2>
          <input
            type="text"
            placeholder="Opinion of side 1."
            onChange={(e) => {
              setTopic({ ...topic, d1: e.target.value });
            }}
            value={topic.d1}
          />
          <input
            type="text"
            placeholder="Personality of side 1. (e.g. 'Shakespearean Theologian', 'Rick Sanchez from Rick and Morty')"
            onChange={(e) => {
              setTopic({ ...topic, d1p: e.target.value });
            }}
            value={topic.d1p}
          />
          <input
            type="text"
            placeholder="Attitude of side 1. (e.g. 'smugly superior', 'swears a lot', 'respectful and kind')"
            onChange={(e) => {
              setTopic({ ...topic, d1a: e.target.value });
            }}
            value={topic.d1a}
          />
          <br />
          <h2>The Second Debator</h2>
          <input
            type="text"
            placeholder="Opinion of side 2."
            onChange={(e) => {
              setTopic({ ...topic, d2: e.target.value });
            }}
            value={topic.d2}
          />
          <input
            type="text"
            placeholder="Personality of side 2. (e.g. 'Shakespearean Theologian', 'Rick Sanchez from Rick and Morty')"
            onChange={(e) => {
              setTopic({ ...topic, d2p: e.target.value });
            }}
            value={topic.d2p}
          />
          <input
            type="text"
            placeholder="Attitude of side 2. (e.g. 'smugly superior', 'swears a lot', 'respectful and kind')"
            onChange={(e) => {
              setTopic({ ...topic, d2a: e.target.value });
            }}
            value={topic.d2a}
          />
          <br />
          <input
            type="password"
            onChange={(e) => setApikey(e.target.value)}
            value={apikey}
            placeholder="API Key"
          />
          <div
            className="button"
            onClick={() => {
              setCommenced(true);
              setActive(true);
            }}
          >
            Start the debate!
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialogue;
