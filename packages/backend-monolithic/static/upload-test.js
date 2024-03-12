/** A quick sketch to see if transmission uploading progress works. */

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const statusParagraph = document.getElementById("status-paragraph");
const splitStatus = document.getElementById("split-status");
const splitPercentage = document.getElementById("split-percentage");

statusParagraph.innerHTML = "(ready)";

// eslint-disable-next-line no-undef
document.querySelector("form").addEventListener("submit", async (event) => {
  // Stop the normal submit
  event.preventDefault();

  // Use fetch to post our form data
  const formData = new FormData(event.target);
  let response = await fetch("/transmission", {
    method: "POST",
    body: formData,
  });
  let responseText = await response.text();
  statusParagraph.innerHTML = `${response.status}\n${responseText}`;
  if (!(response.status >= 200 && response.status < 300)) {
    return;
  }

  const createdTransmission = JSON.parse(responseText);
  let ticker = 0;

  // Repeatedly try to get this transmission until it's status is
  // either complete or failed
  while (true) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 500));

    response = await fetch(`/transmission/${createdTransmission._id}`, { method: "GET" });

    responseText = await response.text();

    ticker += 1;
    statusParagraph.innerHTML = `${ticker}\n${response.status}\n${responseText}`;

    const updatedTransmission = JSON.parse(responseText);

    splitStatus.innerHTML = updatedTransmission.splitOperation.status;
    splitPercentage.value = updatedTransmission.splitOperation.percentage;

    if (updatedTransmission.splitOperation.status === "complete") break;
    if (updatedTransmission.splitOperation.status === "failed") break;
  }
});
