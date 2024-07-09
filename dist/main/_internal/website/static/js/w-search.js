const inputElem = document.querySelector("#gemini-request");
const geminiContainerElem = document.querySelector("#gemini-container");

inputElem.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    const userQuestion = document.createElement("p");
    const userQuestionContainer = document.createElement("div");
    userQuestion.innerHTML = inputElem.value;
    userQuestionContainer.className = "user-question";
    userQuestionContainer.append(userQuestion);
    geminiContainerElem.append(userQuestionContainer);

    fetch("/geminicall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: inputElem.value,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        const geminiResponse = document.createElement("p");
        const geminiResponseContainer = document.createElement("div");
        console.log(res);
        res = replaceAsterisks(res);
        console.log(res);
        geminiResponse.innerHTML = res;
        geminiResponseContainer.className = "gemini-response";
        geminiResponseContainer.append(geminiResponse);
        geminiContainerElem.append(geminiResponseContainer);
      });
    inputElem.value = "";
  }
});

const example1 = document.querySelector(".example-1");
const example2 = document.querySelector(".example-2");

function submitForm(text) {
  inputElem.value = text;

  // Create a new keyboard event
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
  });

  // Dispatch the event on the input element
  inputElem.dispatchEvent(event);
}

example1.addEventListener("click", function () {
  submitForm(example1.textContent);
});

example2.addEventListener("click", function () {
  submitForm(example2.textContent);
});

function replaceAsterisks(text) {
  // Step 1: Replace double asterisks ** with a placeholder
  let placeholder = "PLACEHOLDER";
  let result = text.replace(/\*\*/g, placeholder);

  // Step 2: Replace single asterisks * with <br>
  result = result.replace(/\*/g, "<br>");
  // Also replace ## with empty string - ""
  result = result.replace("##", "");

  // Step 3: Replace placeholder with alternating <strong> and </strong> tags
  let strongToggle = true;
  result = result.replace(new RegExp(placeholder, "g"), function () {
    if (strongToggle) {
      strongToggle = false;
      return "<br><strong>";
    } else {
      strongToggle = true;
      return "</strong>";
    }
  });

  return result;
}
