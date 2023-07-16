function getAIComplete(button_el) {
  var you = "";
  var chat_history = Array.from(
    document
      .querySelector('[data-testid="conversation-panel-body"]')
      .querySelectorAll("[data-pre-plain-text]")
  )
    .map((row) => traverseRow(row))
    .filter((row) => row !== undefined);

  fetch("http://localhost:5000/api/ai_complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      history: chat_history,
      output_user: you,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      button_el.innerHTML = "AI Complete";
      const predictions = data.predictions[0].content
        .split("\n")
        .map((row) => row.replace("* ", ""));
      let textinput = document.querySelector("[data-testid='compose-box']");
      textinput.style.position = "relative";
      const option_box = document.createElement("div");
      option_box.style = `position: absolute;transform: translateY(-200%);left: 51px;background-color: white;padding: 6px;border: 2px solid black;border-radius: 5px;z-index: 999;display: flex;flex-direction: column;gap: 4px;`;
      const del_button = document.createElement("div");
      del_button.style = `position:absolute;top: -12px;left: -12px;background-color: black;border-radius: 50%;width: 24px;color: white;height: 24px;display: grid;place-items: center;cursor: pointer;`;
      del_button.innerHTML = "X";
      option_box.appendChild(del_button);
      del_button.onclick = () => {
        option_box.remove();
      };
      predictions.forEach((prediction) => {
        const prediction_box = document.createElement("span");
        prediction_box.style = `padding:0.5rem;background-color: rgb(217, 253, 211);color: black; cursor: pointer;-webkit-user-select: all;-ms-user-select: all;user-select: all;`;
        prediction_box.onclick = () => {
          // copy to clipboard
          navigator.clipboard.writeText(prediction);
        };
        prediction_box.innerHTML = prediction;
        option_box.appendChild(prediction_box);
      });
      textinput.appendChild(option_box);
    })
    .catch(console.error);
}

let compose_box = document.querySelector('[data-testid="compose-box"]');
let ai_button = document.createElement("div");
compose_box.appendChild(ai_button);
ai_button.style = `
text-align: center;
margin: 1rem;
`;
let ai_text = document.createElement("span");
ai_text.innerHTML = "AI Complete";
ai_button.appendChild(ai_text);
ai_text.style = `
background-color: blue;
color: white;
padding: 3px 6px;
cursor: pointer;
border-radius: 4px;
`;
ai_text.onclick = () => {
  ai_text.innerHTML = "AI Completing... Please wait...";
  getAIComplete(ai_text);
};

function traverseRow(element) {
  const user = element
    .getAttribute("data-pre-plain-text")
    .split("] ")[1]
    .replace(": ", "")
    .trim();
  if (
    window.getComputedStyle(element.parentNode.parentNode).backgroundColor ===
    "rgb(217, 253, 211)"
  ) {
    you = user;
  }
  const data = {
    user: user,
    text: "",
  };
  traverseDiv(element, 0, data);
  if (data.text !== "") {
    return data;
  }
}

function traverseDiv(element, number, data) {
  if (number === 30) return;
  if (element.hasChildNodes()) {
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        traverseDiv(childNode, number + 1, data);
      } else if (childNode.nodeType === Node.TEXT_NODE) {
        // if (childNode.parentNode.hasAttribute("data-testid")) {
        //   if (childNode.parentNode.getAttribute("data-testid") === "author") {
        //     data.author = childNode.textContent;
        //   }
        // }
        if (childNode.parentNode.parentNode.hasAttribute("dir")) {
          if (childNode.parentNode.parentNode.getAttribute("dir") === "ltr") {
            data.text = childNode.textContent;
          }
        }
      }
    }
  }
}
