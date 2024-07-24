const isNotEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0;
}

export const createTable = (columnsArray, dataArray, tableId) => {

    if (!isNotEmptyArray(columnsArray) || !isNotEmptyArray(dataArray || !tableId)) {
        throw new Error('Para a correta execução, precisamos de um array com as colunas, outro com as informações da linha e também o id do elemento tabela selecionada');
    };

    const tableElement = document.getElementById(tableId);
    if (!tableElement || tableElement.nodeName !== 'TABLE') {
        throw new Error('Id informado não corresponde a nenhum elemento table');
    }

    createTableHeader(tableElement, columnsArray);
    createTableBody(tableElement, dataArray, columnsArray);
}

function createTableHeader(tableReference, columnsArray) {

    function createTheadElement(tableReference) {
        const theadElement = document.createElement('thead');
        tableReference.appendChild(theadElement);
        return theadElement;
    }
    const tableHeaderReference = tableReference.querySelector('thead') ?? createTheadElement(tableReference);

    const headerRow = document.createElement('tr');
    ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach(classItem => headerRow.classList.add(classItem));

    for (const tableColumObject of columnsArray) {
        const headerElement = /*html*/ `<th class='text-center'>${tableColumObject.columnLabel}</th>`;
        headerRow.innerHTML += headerElement;
    }

    tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
    function createTbodyElement(tableReference) {
      const tbodyElement = document.createElement("tbody");
      tableReference.appendChild(tbodyElement);
      return tbodyElement;
    }

    const tableBodyReference = tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

    for (const [itemIndex, tableItem] of tableItems.entries()) {
        const tableRow = document.createElement('tr');
        if (itemIndex % 2 === 1 ){
            tableRow.classList.add('bg-blue-200');
        }
        for (const tableColumn of columnsArray) {
            const funcFn = tableColumn.functionFn ?? ((info) => info );
                      (tableRow.innerHTML += /*html*/ `<td class='text-center'>${
                        funcFn(tableItem[tableColumn.accessor])
                      }</td>`);
        }

        tableBodyReference.appendChild(tableRow);
    }
}

