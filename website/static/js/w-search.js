const inputElem = document.querySelector("#gemini-request");

        inputElem.addEventListener("keydown", (evt) => {
            if (evt.key === 'Enter') {
                const userQuestion = document.createElement("p");
                const userQuestionContainer = document.createElement("div")
                userQuestion.innerHTML = inputElem.value;
                userQuestionContainer.className = "user-question";
                userQuestionContainer.append(userQuestion);
                inputElem.before(userQuestionContainer);

                fetch("/geminicall", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "question": inputElem.value
                    })
                })
                    .then(res => res.text())
                    .then(res => {
                        const geminiResponse = document.createElement("p");
                        const geminiResponseContainer = document.createElement("div")
                        console.log(res)
                        res = replaceAsterisks(res);
                        console.log(res)
                        geminiResponse.innerHTML = res;
                        geminiResponseContainer.className = "gemini-response";
                        geminiResponseContainer.append(geminiResponse);
                        inputElem.before(geminiResponseContainer);
                    })
                inputElem.value = "";
            }
        })

        function replaceAsterisks(text) {
            // Step 1: Replace double asterisks ** with a placeholder
            let placeholder = 'PLACEHOLDER';
            let result = text.replace(/\*\*/g, placeholder);

            // Step 2: Replace single asterisks * with <br>
            result = result.replace(/\*/g, '<br>');

            // Step 3: Replace placeholder with alternating <strong> and </strong> tags
            let strongToggle = true;
            result = result.replace(new RegExp(placeholder, 'g'), function () {
                if (strongToggle) {
                    strongToggle = false;
                    return '<br><strong>';
                } else {
                    strongToggle = true;
                    return '</strong>';
                }
            });

            return result;
        }