
console.log("Instructions Loaded")
let currentStep = 0;
const totalSteps = 5;

function showStep(step) {
  for (let i = 0; i < totalSteps; i++) {
    document.getElementById(`step${i}`).classList.remove("active");
  }
  document.getElementById(`step${step}`).classList.add("active");
  updateProgressBar(step);
  updateButtons(step);
}

function updateProgressBar(step) {
  const progress = (step / (totalSteps - 1)) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

function updateButtons(step) {
  if (step === 0) {
    document.getElementById("prevButton").style.visibility = "hidden";
  } else {
    document.getElementById("prevButton").style.visibility = "visible";
  }

  if (step === totalSteps - 1) {
    document.getElementById("nextButton").style.visibility = "hidden";
  } else {
    document.getElementById("nextButton").style.visibility = "visible";
  }
}

function nextStep() {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function skipInstructions() {
  console.log("!!CALLING SKIP INSTRUCTIONS")
  document.getElementById("instructionCard").style.display = "none";
  //setTimeout(()=>{delete document.getElementById("instructionCard")}, 300)
  document.getElementById("popup-special2").style.display = "none";
  if (document.getElementById("popup-special1").childElementCount < 2) {
    document.getElementById("popup-important").style.display = "none"
  }
}

document.getElementById("nextButton").addEventListener("click", nextStep);
document.getElementById("prevButton").addEventListener("click", prevStep);
document
  .getElementById("skip")
  .addEventListener("click", skipInstructions);
document
  .querySelector(".close")
  .addEventListener("click", skipInstructions);
