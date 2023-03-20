const axios = require("axios");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const openai_api_key = process.env.OPENAI_API_KEY;

const call_open_ai = async (prompt) => {
  const request = {
    model: "gpt-3.5-turbo-0301",
    messages: prompt.messages,
    max_tokens: 2000,
    temperature: 1,
    stream: true,
  };

  try {
    // const res = axios({
    //   method: "post",
    //   url: "https://api.openai.com/v1/chat/completions",

    //   headers: {
    //     Authorization: `Bearer ${openai_api_key}`,
    //     responseType: "stream",
    //   },
    //   data: request,
    // }).then((res) => {
    //   console.log(res);
    // });

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai_api_key}`,
        "Content-Type": "application/json",
        responseType: "stream",
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
      for await (const chunk of res.body) {
        console.log(
          chunk.toString().split(`content":"`)[1]
            ? chunk.toString().split(`content":"`)[1].split(`"`)[0]
            : ""
        );
      }
    });

    // const stream = res.data;

    // stream.on("data", (data) => {
    //   data = data.toString();
    //   console.log(data);
    // });

    // return res.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const debator_1 = [
  {
    role: "system",
    content: `You are in a philosophical debate with another person. You are arguing for the side of "Yes, we should use AI to make decisions for us." If you see a prompt from the user that says "----" you should make an opening statement.
    You win by making the other person repeat themselves. If they repeat themselves, say "I win!".`,
  },
  {
    role: "user",
    content: "----",
  },
];

const debator_2 = [
  {
    role: "system",
    content: `You are in a philosophical debate with another person. You are arguing for the side of "No, we should not use AI to make decisions for us."
    You win by making the other person repeat themselves. If they repeat themselves, say "I win!".`,
  },
];

const debate = async () => {
  // while (true) {
  const res = await call_open_ai({ messages: debator_1 });
  //   console.log("Debator 1: " + res);
  //   debator_1.push({ role: "assistant", content: res });
  //   debator_2.push({ role: "user", content: res });
  //   const res2 = await call_open_ai({ messages: debator_2 });
  //   console.log("Debator 2: " + res2);
  //   debator_1.push({ role: "user", content: res2 });
  //   debator_2.push({ role: "assistant", content: res2 });
  // }
};

debate();
