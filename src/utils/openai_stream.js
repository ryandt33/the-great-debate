import axios from "axios";
// const fetch = require("node-fetch");

const call_open_ai = async (prompt, openai_api_key, dialogue, setDialogue) => {
  const request = {
    model: "gpt-3.5-turbo-0301",
    messages: prompt.messages,
    max_tokens: 2000,
    temperature: 1,
  };

  console.log(request);

  try {
    // const res = await axios({
    //   method: "post",
    //   url: "https://api.openai.com/v1/chat/completions",
    //   headers: {
    //     Authorization: `Bearer ${openai_api_key}`,
    //   },
    //   data: request,
    // });
    // return res.data.choices[0].message.content;

    // let text = "";
    // const res = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${openai_api_key}`,
    //     "Content-Type": "application/json",
    //     responseType: "stream",
    //   },
    //   body: JSON.stringify(request),
    // })
    //   .then((response) => {
    //     const reader = response.body.getReader();
    //     return new TextDecoderStream({
    //       start(controller) {
    //         return pump();
    //         function pump() {
    //           return reader.read().then(({ done, value }) => {
    //             // When no more data needs to be consumed, close the stream
    //             if (done) {
    //               controller.close();
    //               return;
    //             }

    //             console.log(value);
    //             console.log(new TextDecoder().decode(value));
    //             // Enqueue the next data chunk into our target stream
    //             console.log(value.toString().split(`content":"`)[1]);
    //             controller.enqueue(value);
    //             return pump();
    //           });
    //         }
    //       },
    //     });
    //   })
    //   // Create a new response out of the stream
    //   .then((stream) => {
    //     const response = new Response(stream);
    //     console.log(response);
    //     return response;
    //   })
    //   // Create an object URL for the response
    //   .then((response) => {
    //     const blob = response.blob();
    //     console.log(blob);
    //     return blob;
    //   })
    //   .then((blob) => URL.createObjectURL(blob))
    //   // Update image
    //   .catch((err) => console.error(err));

    let text = "";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai_api_key}`,
        "Content-Type": "application/json",
        responseType: "stream",
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
      if (!res.body[Symbol.asyncIterator]) {
        res.body[Symbol.asyncIterator] = () => {
          const reader = res.body.getReader();
          return {
            next: () => reader.read(),
          };
        };
      }
      for await (const chunk of res.body) {
        const speaker = dialogue[dialogue.length - 2].id === 1 ? 2 : 1;

        console.log(speaker);

        console.log(chunk);

        text += chunk.toString().split(`content":"`)[1]
          ? chunk.toString().split(`content":"`)[1].split(`"`)[0]
          : "";

        setDialogue([...dialogue.slice(0, -1), { id: speaker, text }]);

        console.log(
          chunk.toString().split(`content":"`)[1]
            ? chunk.toString().split(`content":"`)[1].split(`"`)[0]
            : ""
        );
      }
    });

    console.log("scope done");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default call_open_ai;
