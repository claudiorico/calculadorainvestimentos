import { generateReturnArray } from "./src/investimentsGoals";
import { Chart } from "chart.js/auto";
const clearButton = document.getElementById("clear-button");
const formulario = document.getElementById("investiment-form");
const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
let doughnutObjectReference = {};
let progressionObjectReference = {};

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        console.log('error na validação');
        return;
  }

  clearCharts();
  
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


  const returnLastResult = returnArrays[returnArrays.length - 1];
  doughnutObjectReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investido", "Rendimento", "Impostos"],
      datasets: [
        {
          data: [
            formatCurrency(returnLastResult.investedAmount),
            formatCurrency(returnLastResult.totalInterestReturns * (1 - taxRate / 100)),
            formatCurrency(returnLastResult.totalInterestReturns * (taxRate / 100)),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionObjectReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnArrays.map((investimentObject) => investimentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnArrays.map(
            (investimentObject) => investimentObject.investedAmount
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento ",
          data: returnArrays.map(
            (investimentObject) => investimentObject.interestReturns
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function formatCurrency(value){
  return value.toFixed(2);
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 ? true : false;
}

function clearCharts() {
  if (!isObjectEmpty(doughnutObjectReference) && !isObjectEmpty(progressionObjectReference)){
    doughnutObjectReference.destroy();
    progressionObjectReference.destroy();

  }
}

function clearForm() {
    document.getElementById("initial-investiment").value = '';
    document.getElementById("additional-aports").value = '';
    document.getElementById("deadline").value = '';
    document.getElementById("return-rate").value = '';
    document.getElementById("profit-tax").value = '';
    document.getElementById("deadline-period").value = 'monthly';
  document.getElementById("evaluation-period").value = "monthly";

  clearCharts();

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
