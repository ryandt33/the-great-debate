import axios from "axios";

const call_open_ai = async (prompt) => {
  const openai_api_key = process.env.REACT_APP_OPENAI_API_KEY;
  console.log(openai_api_key);
  const request = {
    model: "gpt-3.5-turbo-0301",
    messages: prompt.messages,
    max_tokens: 2000,
    temperature: 1,
  };

  console.log(request);

  try {
    const res = await axios({
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${openai_api_key}`,
      },
      data: request,
    });
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default call_open_ai;
