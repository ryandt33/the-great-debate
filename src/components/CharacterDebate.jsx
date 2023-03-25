import React, { useState, useEffect, useRef } from "react";
import call_open_ai from "../utils/openai";

const CharacterDebate = ({
  debator_one,
  debator_two,
  debate_style,
  api_key,
  model,
}) => {
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
    d2: "",
  });
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(true);

  const [d1, setD1] = useState([]);

  const [d2, setD2] = useState([]);

  const commenced = true;

  useEffect(() => {
    setD1([
      {
        role: "system",
        content: `You are a ${debator_one.name} and are in a debate with a ${
          debator_two.name
        }. You are arguing "${debator_one.opinion}".
          The ${debator_two.name} is arguing "${debator_two.opinion}". 
          Your attitude is: ${debator_one.attitude}.
          If you see a prompt from the user that says "----" you should make an opening statement.
        ${
          debate_style === "cordial"
            ? `You like and respect your opponent. Be polite and treat them well. The goal is not to win, but to share opinions.`
            : debate_style === "normal"
            ? "This is a normal debate, try to win, but show your response."
            : debate_style === "fierce"
            ? "You actively dislike your opponent. Belittle and shame them to prove your point"
            : "You must swear, belittle and shame your opponent. Use the worst and most offensive language possible."
        }. You talk in the following style: ${debator_one.style}`,
      },
      {
        role: "user",
        content: "----",
      },
    ]);
    setD2([
      {
        role: "system",
        content: `You are a ${debator_two.name} and are in a debate with a ${
          debator_one.name
        }. You are arguing "${debator_two.opinion}".
          The ${debator_one.name} is arguing "${debator_one.opinion}". 
          Your attitude is: ${debator_two.attitude}.
        ${
          debate_style === "cordial"
            ? `You like and respect your opponent. Be polite and treat them well. The goal is not to win, but to share opinions.`
            : debate_style === "normal"
            ? "This is a normal debate, try to win, but show your response."
            : debate_style === "fierce"
            ? "You actively dislike your opponent. Belittle and shame them to prove your point"
            : "You must swear, belittle and shame your opponent. Use the worst and most offensive language possible."
        }.  You talk in the following style: ${debator_two.style}`,
      },
    ]);
    setTD1(true);
  }, []);

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
    if (count === 3) {
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
    const res = await call_open_ai({ messages: dialogue }, api_key, model);
    setDialogueUpdate({ id: 1, text: res });
  };

  const trigger_dialogue_2 = async (d2) => {
    const dialogue = token_count(d2, setD2);

    const res = await call_open_ai({ messages: dialogue }, api_key, model);
    setDialogueUpdate({ id: 2, text: res });
  };

  return (
    <div className="debate">
      <h1>The Great Debate</h1>
      <div>
        {dialogue.map((d, index) => (
          <div key={index}>
            <div className={`${d.id === 1 ? "left" : "right"} text-bubble`}>
              {d.id === 1 && <img src={debator_one.img} />}
              <span>{d.text}</span>
              {d.id === 2 && <img src={debator_two.img} />}
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
    </div>
  );
};

export default CharacterDebate;
