import { generateReturnArray } from "./src/investimentsGoals";
const clearButton = document.getElementById("clear-button");
const formulario = document.getElementById("investiment-form");

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        console.log('error na validação');
        return;
    }
  const startingAmount = Number(
    document.getElementById("initial-investiment").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-aports").value.replace(",", ".")
  );
  const timeAmount = Number(
    document.getElementById("deadline").value.replace(",", ".")
  );
  const timeAmountPeriod = document.getElementById("deadline-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("profit-tax").value.replace(",", ".")
  );

  const returnArrays = generateReturnArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );
  console.log(returnArrays);
}

function clearForm() {
    document.getElementById("initial-investiment").value = '';
    document.getElementById("additional-aports").value = '';
    document.getElementById("deadline").value = '';
    document.getElementById("return-rate").value = '';
    document.getElementById("profit-tax").value = '';
    document.getElementById("deadline-period").value = 'monthly';
    document.getElementById("evaluation-period").value = "monthly";

    const errorElementList = document.querySelectorAll('.error');

    for (let errorElement of errorElementList) {
        errorElement.classList.remove("error");
        errorElement.parentElement.querySelector('p').remove();
    }
}

function validateInput(evt) {
    if (evt.target.value === '') {
        return;
    }

    const { parentElement } = evt.target;
    const grandParentElement = evt.target.parentElement.parentElement;
    const inputValue = evt.target.value.replace(',', '.');

    if ( !parentElement.classList.contains("error") && isNaN(inputValue) || Number(inputValue) < 0 ) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = 'Insira um valor numérico e maior que zero';
        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);

    } else if (parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

for (const formElement of formulario) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

// calculateButton.addEventListener('click', renderProgression);
formulario.addEventListener("submit", renderProgression);
clearButton.addEventListener("click", clearForm);
