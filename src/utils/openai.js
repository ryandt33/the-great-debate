import axios from "axios";

const call_open_ai = async (prompt, openai_api_key, model) => {
  const request = {
    model: model,
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
    return res.data.choices[0].message.content.replace(
      /(\r\n|\n|\r)/gm,
      "<br/>"
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default call_open_ai;
