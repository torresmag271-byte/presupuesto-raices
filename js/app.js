// ======================================================
// RAICES 8 PWH - MI PRESUPUESTO
// ======================================================


// ------------------------------------------------------
// CATEGORÍAS
// ------------------------------------------------------

const fixedExpenseCategories = [
  "Vivienda",
  "Educación",
  "Deportes",
  "Medicina privada",
  "Cuotas de tarjeta de crédito",
  "Streaming"
];

const variableExpenseCategories = [
  "Comida",
  "Transporte",
  "Salidas",
  "Otros"
];


// ------------------------------------------------------
// ELEMENTOS HTML
// ------------------------------------------------------

const fixedExpensesContainer =
  document.getElementById("fixedExpenses");

const variableExpensesContainer =
  document.getElementById("variableExpenses");

const incomeInputs =
  document.querySelectorAll(".ingreso");

const titheCheckbox =
  document.getElementById("diezmo");

const titheLine =
  document.getElementById("titheLine");

const subtotalIngresosEl =
  document.getElementById("subtotalIngresos");

const totalDiezmoEl =
  document.getElementById("totalDiezmo");

const totalIngresosEl =
  document.getElementById("totalIngresos");

const totalFijosEl =
  document.getElementById("totalFijos");

const totalVariablesEl =
  document.getElementById("totalVariables");

const totalEgresosEl =
  document.getElementById("totalEgresos");

const resultadoMesEl =
  document.getElementById("resultadoMes");

const resultadoMesLabelEl =
  document.getElementById("resultadoMesLabel");

const ahorroInput =
  document.getElementById("ahorro");

const saldoEl =
  document.getElementById("saldo");

const saldoLabelEl =
  document.getElementById("saldoLabel");

const questionsEl =
  document.getElementById("questions");

const clearIncomeButton =
  document.getElementById("clearIncome");

const clearExpensesButton =
  document.getElementById("clearExpenses");

const downloadBudgetButton =
  document.getElementById("downloadBudget");

const nombreInput =
  document.getElementById("nombre");

const mesInput =
  document.getElementById("mes");

const compromisoInput =
  document.getElementById("compromiso");


// ------------------------------------------------------
// FORMATO DE DINERO
// ------------------------------------------------------

function formatMoney(value) {

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);

}


function parseMoney(value) {

  return Number(
    String(value).replace(/\D/g, "")
  ) || 0;

}


function formatInput(input) {

  const rawValue =
    input.value.replace(/\D/g, "");

  if (!rawValue) {

    input.value = "";
    return;

  }

  input.value =
    new Intl.NumberFormat("es-AR")
      .format(Number(rawValue));

}


// ------------------------------------------------------
// CREAR FILAS DE EGRESOS
// ------------------------------------------------------

function createExpenseRow(category, type) {

  const row =
    document.createElement("div");

  row.className =
    `expense-row ${type}-expense`;

  row.dataset.category =
    category;

  row.dataset.type =
    type;

  row.innerHTML = `

    <div class="expense-top">

      <div>
        <label>
          ${category}
        </label>
      </div>

      <input
        type="text"
        class="money expense-input"
        placeholder="$ 0"
      >

    </div>

    <div class="expense-progress">

      <div class="expense-bar">
        <div class="expense-fill"></div>
      </div>

      <span class="expense-percentage">
        0%
      </span>

    </div>

  `;

  return row;

}


function createExpenses() {

  fixedExpenseCategories.forEach(
    category => {

      fixedExpensesContainer.appendChild(
        createExpenseRow(
          category,
          "fixed"
        )
      );

    }
  );


  variableExpenseCategories.forEach(
    category => {

      variableExpensesContainer.appendChild(
        createExpenseRow(
          category,
          "variable"
        )
      );

    }
  );

}


// ------------------------------------------------------
// OBTENER DATOS DEL PRESUPUESTO
// ------------------------------------------------------

function getBudgetData() {

  let grossIncome = 0;

  incomeInputs.forEach(
    input => {

      grossIncome +=
        parseMoney(input.value);

    }
  );


  const tithe =
    titheCheckbox.checked
      ? grossIncome * 0.10
      : 0;


  const netIncome =
    grossIncome - tithe;


  let totalFixedExpenses = 0;
  let totalVariableExpenses = 0;

  const fixedExpenses = [];
  const variableExpenses = [];


  document
    .querySelectorAll(".fixed-expense")
    .forEach(row => {

      const input =
        row.querySelector(".expense-input");

      const amount =
        parseMoney(input.value);

      totalFixedExpenses +=
        amount;

      const percentage =
        netIncome > 0
          ? Math.round(
              (amount / netIncome) * 100
            )
          : 0;

      fixedExpenses.push({

        category:
          row.dataset.category,

        amount,
        percentage

      });

    });


  document
    .querySelectorAll(".variable-expense")
    .forEach(row => {

      const input =
        row.querySelector(".expense-input");

      const amount =
        parseMoney(input.value);

      totalVariableExpenses +=
        amount;

      const percentage =
        netIncome > 0
          ? Math.round(
              (amount / netIncome) * 100
            )
          : 0;

      variableExpenses.push({

        category:
          row.dataset.category,

        amount,
        percentage

      });

    });


  const totalExpenses =
    totalFixedExpenses +
    totalVariableExpenses;


  const monthlyResult =
    netIncome -
    totalExpenses;


  const savings =
    parseMoney(
      ahorroInput.value
    );


  const finalBalance =
    monthlyResult -
    savings;


  return {

    grossIncome,
    tithe,
    netIncome,

    totalFixedExpenses,
    totalVariableExpenses,
    totalExpenses,

    fixedExpenses,
    variableExpenses,

    monthlyResult,
    savings,
    finalBalance

  };

}


// ------------------------------------------------------
// ACTUALIZAR BARRAS
// ------------------------------------------------------

function updateExpenseBars(
  selector,
  expenses
) {

  document
    .querySelectorAll(selector)
    .forEach(
      (row, index) => {

        const percentage =
          expenses[index].percentage;

        const fill =
          row.querySelector(
            ".expense-fill"
          );

        const percentageEl =
          row.querySelector(
            ".expense-percentage"
          );

        percentageEl.textContent =
          `${percentage}%`;

        fill.style.width =
          `${Math.min(
            percentage,
            100
          )}%`;

      }
    );

}


// ======================================================
// REFLEXIONES
// UNA SOLA LÓGICA PARA WEB + PDF
// ======================================================

function getReflection(data) {

  // ----------------------------------------------------
  // SIN INGRESOS
  // ----------------------------------------------------

  if (data.netIncome === 0) {

    return {

      type: "empty",

      title:
        "Completá tus ingresos y egresos para comenzar.",

      paragraphs: [],

      question: "",

      ideas: []

    };

  }


  // ----------------------------------------------------
  // CASO 5 — RESULTADO NEGATIVO
  // ----------------------------------------------------

  if (data.monthlyResult < 0) {

    return {

      type: "negative",

      title:
        "Lo más importante ya ocurrió: ordenarte es un paso de fe.",

      paragraphs: [

        "Reconocer dónde estamos nos permite comenzar a tomar decisiones que nos acerquen a una administración más sabia."

      ],

      question:
        "¿Cuál es el próximo paso que puedo dar para comenzar a ordenar mis finanzas?",

      ideas: [

        "Identificar cuál es el gasto que hoy tiene mayor impacto.",

        "Reducir o postergar algún gasto que no sea prioritario.",

        "Dar un paso de fe y buscar maneras de aumentar mis ingresos: buscar un trabajo nuevo, hacer horas extras, comenzar un emprendimiento, capacitarme o explorar una nueva oportunidad.",

        "Pedir consejo o ayuda si necesito acompañamiento para ordenar mis finanzas."

      ]

    };

  }


  // ----------------------------------------------------
  // CASO 4 — EQUILIBRIO NATURAL
  // ----------------------------------------------------

  if (data.monthlyResult === 0) {

    return {

      type: "equilibrium",

      title:
        "Lograste mantener un equilibrio entre tus ingresos y tus egresos.",

      paragraphs: [

        "Es una buena base para seguir creciendo en una administración sabia."

      ],

      question:
        "¿Qué pequeño cambio puedo hacer para empezar a generar margen en mis finanzas?",

      ideas: [

        "Revisar si hay algún gasto que podría reducir.",

        "Planificar mejor alguna compra o gasto antes de hacerlo.",

        "Comenzar a separar una pequeña cantidad para ahorro o imprevistos.",

        "Buscar alguna oportunidad para aumentar mis ingresos."

      ]

    };

  }


  // ----------------------------------------------------
  // CASO 1 — EXCEDENTE SIN AHORRO
  // ----------------------------------------------------

  if (
    data.monthlyResult > 0 &&
    data.savings === 0
  ) {

    return {

      type: "surplus-no-savings",

      title:
        "¡Terminaste el mes con un excedente!",

      paragraphs: [

        "Dios no solo nos llama a administrar con fidelidad cuando falta, sino también cuando sobra."

      ],

      question:
        "¿Cómo puedo administrar este excedente de una manera que honre a Dios?",

      ideas: [

        "Ser generoso y bendecir a alguien.",

        "Fortalecer o crear un fondo de emergencia.",

        "Prepararme para una necesidad o proyecto futuro.",

        "Invertir con propósito, por ejemplo, campamentos, Corazón por la Misión, Casa Abierta u otros proyectos."

      ]

    };

  }


  // ----------------------------------------------------
  // CASO 3 — AHORRA TODO EL EXCEDENTE
  // ----------------------------------------------------

  if (
    data.monthlyResult > 0 &&
    data.savings === data.monthlyResult
  ) {

    return {

      type: "surplus-all-saved",

      title:
        "¡Tuviste excedente y decidiste ahorrarlo!",

      paragraphs: [

        "Generar margen y decidir qué hacer con él también es parte de una administración sabia.",

        `Separaste ${formatMoney(data.savings)} para ahorro o fondo de emergencia.`

      ],

      question:
        "¿Cómo puedo administrar sabiamente este dinero que decidí guardar?",

      ideas: [

        "Definir para qué estoy ahorrando.",

        "Si es un fondo de emergencia, mantenerlo disponible para cuando realmente lo necesite.",

        "Si es un ahorro que no voy a necesitar en el corto plazo, aprender qué opciones existen para que ese dinero no pierda valor y pueda crecer con el tiempo.",

        "Evaluar si una parte puede ser destinada a algún propósito, proyecto o inversión futura."

      ]

    };

  }


  // ----------------------------------------------------
  // CASO 2 — AHORRO PARCIAL + EXCEDENTE FINAL
  // ----------------------------------------------------

  return {

    type: "surplus-partial-savings",

    title:
      "¡Tuviste un excedente incluso después de haber separado un ahorro!",

    paragraphs: [

      "Dios no solo nos llama a administrar con fidelidad cuando falta, sino también cuando sobra.",

      `Separaste ${formatMoney(data.savings)} para ahorro o fondo de emergencia.`

    ],

    question:
      "¿Cómo puedo administrar este excedente de una manera que honre a Dios?",

    ideas: [

      "Ser generoso y bendecir a alguien.",

      "Pensar cómo administrar el dinero que separaste: aprender qué opciones existen para que no pierda valor y pueda crecer con el tiempo.",

      "Prepararme para una necesidad o proyecto futuro.",

      "Invertir con propósito, por ejemplo, campamentos, Corazón por la Misión, Casa Abierta u otros proyectos."

    ]

  };

}


// ------------------------------------------------------
// MOSTRAR REFLEXIÓN EN LA WEB
// ------------------------------------------------------

function updateReflection(data) {

  const reflection =
    getReflection(data);


  if (reflection.type === "empty") {

    questionsEl.innerHTML = `

      <p>
        ${reflection.title}
      </p>

    `;

    return;

  }


  const paragraphs =
    reflection.paragraphs
      .map(
        paragraph => `
          <p>${paragraph}</p>
        `
      )
      .join("");


  const ideas =
    reflection.ideas
      .map(
        idea => `
          <li>${idea}</li>
        `
      )
      .join("");


  questionsEl.innerHTML = `

    <p>
      <strong>
        ${reflection.title}
      </strong>
    </p>

    ${paragraphs}

    <p>
      <strong>
        Conversalo con Dios:
      </strong>
    </p>

    <p>
      <strong>
        ${reflection.question}
      </strong>
    </p>

    <p>
      <strong>
        Algunas ideas:
      </strong>
    </p>

    <ul>
      ${ideas}
    </ul>

  `;

}


// ------------------------------------------------------
// CALCULAR PRESUPUESTO
// ------------------------------------------------------

function calculate() {

  const data =
    getBudgetData();


  updateExpenseBars(
    ".fixed-expense",
    data.fixedExpenses
  );


  updateExpenseBars(
    ".variable-expense",
    data.variableExpenses
  );


  subtotalIngresosEl.textContent =
    formatMoney(
      data.grossIncome
    );


  totalDiezmoEl.textContent =
    "- " +
    formatMoney(
      data.tithe
    );


  totalIngresosEl.textContent =
    formatMoney(
      data.netIncome
    );


  totalFijosEl.textContent =
    formatMoney(
      data.totalFixedExpenses
    );


  totalVariablesEl.textContent =
    formatMoney(
      data.totalVariableExpenses
    );


  totalEgresosEl.textContent =
    formatMoney(
      data.totalExpenses
    );


  resultadoMesEl.textContent =
    formatMoney(
      data.monthlyResult
    );


  saldoEl.textContent =
    formatMoney(
      data.finalBalance
    );


  // Diezmo

  titheLine.style.display =
    titheCheckbox.checked
      ? "flex"
      : "none";


  // Resultado del mes

  if (data.monthlyResult > 0) {

    resultadoMesLabelEl.textContent =
      "Resultado a favor";

  }

  else if (
    data.monthlyResult < 0
  ) {

    resultadoMesLabelEl.textContent =
      "Resultado por cubrir";

  }

  else {

    resultadoMesLabelEl.textContent =
      "Resultado del mes";

  }


  // Saldo final

  if (data.finalBalance > 0) {

    saldoLabelEl.textContent =
      "Saldo disponible";

  }

  else if (
    data.finalBalance < 0
  ) {

    saldoLabelEl.textContent =
      "Saldo por cubrir";

  }

  else {

    saldoLabelEl.textContent =
      "Saldo disponible";

  }


  updateReflection(data);

}


// ------------------------------------------------------
// CREAR EGRESOS
// ------------------------------------------------------

createExpenses();


// ------------------------------------------------------
// EVENTOS DE DINERO
// ------------------------------------------------------

document.addEventListener(
  "input",
  event => {

    if (
      !event.target.classList.contains(
        "money"
      )
    ) {

      return;

    }


    formatInput(
      event.target
    );


    // --------------------------------------------------
    // VALIDAR AHORRO
    // --------------------------------------------------

    if (
      event.target.id === "ahorro"
    ) {

      const data =
        getBudgetData();

      const savingsEntered =
        parseMoney(
          ahorroInput.value
        );

      const maximumSavings =
        Math.max(
          data.monthlyResult,
          0
        );


      if (
        savingsEntered >
        maximumSavings
      ) {

        alert(
          "No podés ahorrar más que el excedente disponible del mes."
        );


        ahorroInput.value =
          maximumSavings > 0

            ? new Intl.NumberFormat(
                "es-AR"
              ).format(
                maximumSavings
              )

            : "";

      }

    }


    calculate();

  }
);


// ------------------------------------------------------
// DIEZMO
// ------------------------------------------------------

titheCheckbox.addEventListener(
  "change",
  () => {

    const data =
      getBudgetData();


    const maximumSavings =
      Math.max(
        data.monthlyResult,
        0
      );


    if (
      data.savings >
      maximumSavings
    ) {

      ahorroInput.value =
        maximumSavings > 0

          ? new Intl.NumberFormat(
              "es-AR"
            ).format(
              maximumSavings
            )

          : "";

    }


    calculate();

  }
);


// ------------------------------------------------------
// LIMPIAR INGRESOS
// ------------------------------------------------------

clearIncomeButton.addEventListener(
  "click",
  () => {

    incomeInputs.forEach(
      input => {

        input.value = "";

      }
    );


    titheCheckbox.checked =
      false;


    ahorroInput.value =
      "";


    calculate();

  }
);


// ------------------------------------------------------
// LIMPIAR EGRESOS
// ------------------------------------------------------

clearExpensesButton.addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(
        ".expense-input"
      )
      .forEach(
        input => {

          input.value = "";

        }
      );


    // Si al limpiar egresos cambia el excedente,
    // recalculamos normalmente.

    calculate();

  }
);


// ------------------------------------------------------
// MES ACTUAL
// ------------------------------------------------------

function setCurrentMonth() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  mesInput.value =
    `${year}-${month}`;

}


setCurrentMonth();


// ------------------------------------------------------
// NOMBRE DEL MES
// ------------------------------------------------------

function getMonthName(value) {

  if (!value) {

    return "";

  }


  const [year, month] =
    value.split("-");


  const months = [

    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"

  ];


  return (
    `${months[
      Number(month) - 1
    ]} ${year}`
  );

}


// ------------------------------------------------------
// CARGAR LOGOS PARA PDF
// ------------------------------------------------------

function loadImageAsDataURL(src) {

  return new Promise(
    (resolve, reject) => {

      const img =
        new Image();


      img.onload =
        function () {

          const canvas =
            document.createElement(
              "canvas"
            );


          canvas.width =
            img.naturalWidth;

          canvas.height =
            img.naturalHeight;


          const ctx =
            canvas.getContext("2d");


          ctx.drawImage(
            img,
            0,
            0
          );


          resolve(
            canvas.toDataURL(
              "image/png"
            )
          );

        };


      img.onerror =
        reject;


      img.src =
        src;

    }
  );

}


// ======================================================
// PDF
// ======================================================

async function createPDF() {

  const { jsPDF } =
    window.jspdf;


  const doc =
    new jsPDF({

      orientation:
        "portrait",

      unit:
        "mm",

      format:
        "a4"

    });


  const data =
    getBudgetData();


  // MISMA REFLEXIÓN QUE LA WEB

  const reflection =
    getReflection(data);


  const nombre =
    nombreInput.value.trim()
    || "Sin nombre";


  const monthText =
    getMonthName(
      mesInput.value
    );


  const monthFile =
    monthText
      .replace(
        /\s+/g,
        "_"
      )
      .replace(
        /[^\wÀ-ÿ_-]/g,
        ""
      );


  const compromiso =
    compromisoInput.value.trim();


  const margin =
    18;


  const pageWidth =
    doc.internal.pageSize
      .getWidth();


  const pageHeight =
    doc.internal.pageSize
      .getHeight();


  const contentWidth =
    pageWidth -
    margin * 2;


  let y =
    20;


// ------------------------------------------------------
// FUNCIONES PDF
// ------------------------------------------------------

  function checkPage(
    space = 12
  ) {

    if (
      y + space >
      pageHeight - 20
    ) {

      doc.addPage();

      y = 20;

    }

  }


  function title(text) {

    checkPage(15);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(16);

    doc.setTextColor(
      25,
      25,
      25
    );

    doc.text(
      text,
      margin,
      y
    );

    y += 9;

  }


  function subtitle(text) {

    checkPage(10);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(11);

    doc.setTextColor(
      80,
      80,
      80
    );

    doc.text(
      text,
      margin,
      y
    );

    y += 7;

  }


  function row(
    label,
    value,
    bold = false
  ) {

    checkPage(8);

    doc.setFont(
      "helvetica",
      bold
        ? "bold"
        : "normal"
    );

    doc.setFontSize(
      bold
        ? 11
        : 10
    );

    doc.setTextColor(
      35,
      35,
      35
    );

    doc.text(
      label,
      margin,
      y
    );

    doc.text(
      value,
      pageWidth - margin,
      y,
      {
        align:
          "right"
      }
    );

    y += 7;

  }


  function divider() {

    checkPage(8);

    doc.setDrawColor(
      220,
      220,
      220
    );

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 7;

  }


  function paragraph(
    text,
    bold = false
  ) {

    const lines =
      doc.splitTextToSize(
        text,
        contentWidth
      );


    checkPage(
      lines.length * 5 + 4
    );


    doc.setFont(
      "helvetica",
      bold
        ? "bold"
        : "normal"
    );

    doc.setFontSize(10);

    doc.setTextColor(
      55,
      55,
      55
    );

    doc.text(
      lines,
      margin,
      y
    );


    y +=
      lines.length * 5 + 4;

  }


  function bullet(text) {

    const lines =
      doc.splitTextToSize(
        text,
        contentWidth - 7
      );


    checkPage(
      lines.length * 5 + 3
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.setTextColor(
      55,
      55,
      55
    );


    doc.text(
      "•",
      margin,
      y
    );


    doc.text(
      lines,
      margin + 6,
      y
    );


    y +=
      lines.length * 5 + 3;

  }


// ------------------------------------------------------
// CABECERA PDF
// ------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.setTextColor(
    20,
    20,
    20
  );


  doc.text(
    "RAICES 8",
    pageWidth / 2,
    y,
    {
      align:
        "center"
    }
  );


  doc.setTextColor(
    255,
    122,
    0
  );


  doc.setFontSize(18);


  doc.setFont(
    "helvetica",
    "bolditalic"
  );


  doc.text(
    "PWH",
    pageWidth / 2 + 29,
    y
  );


  y += 8;


  doc.setFont(
    "helvetica",
    "bold"
  );


  doc.setFontSize(12);


  doc.setTextColor(
    55,
    55,
    55
  );


  doc.text(
    "Aplicación práctica: Mi Presupuesto",
    pageWidth / 2,
    y,
    {
      align:
        "center"
    }
  );


  y += 12;


  divider();


  row(
    "Nombre",
    nombre,
    true
  );


  row(
    "Mes",
    monthText,
    true
  );


  y += 4;


// ------------------------------------------------------
// INGRESOS PDF
// ------------------------------------------------------

  title(
    "Ingresos"
  );


  const incomeNames = [

    "Ingreso fijo",
    "Ingreso variable",
    "Ayuda familiar",
    "Beca",
    "Otros ingresos"

  ];


  incomeInputs.forEach(
    (input, index) => {

      const amount =
        parseMoney(
          input.value
        );


      if (amount > 0) {

        row(
          incomeNames[index],
          formatMoney(amount)
        );

      }

    }
  );


  divider();


  row(
    "Total de ingresos",
    formatMoney(
      data.grossIncome
    ),
    true
  );


  if (
    titheCheckbox.checked
  ) {

    row(
      "Diezmo (10%)",
      "- " +
      formatMoney(
        data.tithe
      )
    );

  }


  row(
    "Ingresos disponibles",
    formatMoney(
      data.netIncome
    ),
    true
  );


  y += 6;


// ------------------------------------------------------
// EGRESOS PDF
// ------------------------------------------------------

  title(
    "Egresos"
  );


  subtitle(
    "Egresos fijos"
  );


  const activeFixed =
    data.fixedExpenses.filter(
      expense =>
        expense.amount > 0
    );


  if (
    activeFixed.length === 0
  ) {

    row(
      "Sin egresos fijos cargados",
      ""
    );

  }

  else {

    activeFixed.forEach(
      expense => {

        row(
          expense.category,
          `${formatMoney(
            expense.amount
          )}   ${expense.percentage}%`
        );

      }
    );

  }


  row(
    "Total egresos fijos",
    formatMoney(
      data.totalFixedExpenses
    ),
    true
  );


  y += 4;


  subtitle(
    "Egresos variables"
  );


  const activeVariable =
    data.variableExpenses.filter(
      expense =>
        expense.amount > 0
    );


  if (
    activeVariable.length === 0
  ) {

    row(
      "Sin egresos variables cargados",
      ""
    );

  }

  else {

    activeVariable.forEach(
      expense => {

        row(
          expense.category,
          `${formatMoney(
            expense.amount
          )}   ${expense.percentage}%`
        );

      }
    );

  }


  row(
    "Total egresos variables",
    formatMoney(
      data.totalVariableExpenses
    ),
    true
  );


  divider();


  row(
    "Total egresos",
    formatMoney(
      data.totalExpenses
    ),
    true
  );


  y += 6;


// ------------------------------------------------------
// RESULTADO DEL MES PDF
// ------------------------------------------------------

  title(
    "Resultado del mes"
  );


  row(
    "Ingresos disponibles",
    formatMoney(
      data.netIncome
    )
  );


  row(
    "Total egresos",
    "- " +
    formatMoney(
      data.totalExpenses
    )
  );


  row(
    "Resultado del mes",
    formatMoney(
      data.monthlyResult
    ),
    true
  );


  y += 6;


// ------------------------------------------------------
// AHORRO PDF
// ------------------------------------------------------

  title(
    "Ahorro / Fondo de emergencia"
  );


  paragraph(
    "Separar antes de gastar."
  );


  row(
    "Ahorro separado",
    formatMoney(
      data.savings
    ),
    true
  );


  y += 5;


// ------------------------------------------------------
// SALDO FINAL PDF
// ------------------------------------------------------

  checkPage(25);


  doc.setFillColor(
    20,
    20,
    20
  );


  doc.roundedRect(
    margin,
    y,
    contentWidth,
    18,
    3,
    3,
    "F"
  );


  let finalLabel =
    "Saldo disponible";


  if (
    data.finalBalance < 0
  ) {

    finalLabel =
      "Saldo por cubrir";

  }


  doc.setFont(
    "helvetica",
    "bold"
  );


  doc.setFontSize(13);


  doc.setTextColor(
    255,
    255,
    255
  );


  doc.text(
    finalLabel,
    margin + 6,
    y + 11
  );


  doc.setFontSize(15);


  doc.setTextColor(
    255,
    122,
    0
  );


  doc.text(
    formatMoney(
      data.finalBalance
    ),
    pageWidth -
    margin -
    6,
    y + 11,
    {
      align:
        "right"
    }
  );


  y += 28;


// ------------------------------------------------------
// REFLEXIÓN PDF
// MISMO CONTENIDO QUE EN LA WEB
// ------------------------------------------------------

  title(
    "Reflexionemos"
  );


  paragraph(
    reflection.title,
    reflection.type !== "empty"
  );


  if (
    reflection.type !== "empty"
  ) {

    reflection.paragraphs.forEach(
      text => {

        paragraph(text);

      }
    );


    paragraph(
      "Conversalo con Dios:",
      true
    );


    paragraph(
      reflection.question,
      true
    );


    paragraph(
      "Algunas ideas:",
      true
    );


    reflection.ideas.forEach(
      idea => {

        bullet(idea);

      }
    );

  }


// ------------------------------------------------------
// COMPROMISO PDF
// ------------------------------------------------------

  y += 5;


  title(
    "Mi compromiso"
  );


  if (
    compromiso
  ) {

    paragraph(
      compromiso
    );

  }

  else {

    paragraph(
      "_______________________________________________"
    );

    paragraph(
      "_______________________________________________"
    );

  }


// ------------------------------------------------------
// LOGOS PDF
// ------------------------------------------------------

  try {

    const logoPowerhouse =
      await loadImageAsDataURL(
        "img/logo-powerhouse.PNG"
      );


    const logoRaices =
      await loadImageAsDataURL(
        "img/logo-raices.PNG"
      );


    if (
      y >
      pageHeight - 45
    ) {

      doc.addPage();

      y =
        pageHeight - 42;

    }

    else {

      y =
        Math.max(
          y + 10,
          pageHeight - 42
        );

    }


    doc.addImage(
      logoPowerhouse,
      "PNG",
      55,
      y,
      35,
      14
    );


    doc.addImage(
      logoRaices,
      "PNG",
      120,
      y,
      35,
      14
    );

  }

  catch (error) {

    console.log(
      "No se pudieron cargar los logos",
      error
    );

  }


// ------------------------------------------------------
// DESCARGAR PDF
// ------------------------------------------------------

  const safeName =
    nombre
      .replace(
        /\s+/g,
        "_"
      )
      .replace(
        /[^\w-]/g,
        ""
      );


  doc.save(
    `Presupuesto_${safeName}_${monthFile}.pdf`
  );

}


// ------------------------------------------------------
// BOTÓN PDF
// ------------------------------------------------------

downloadBudgetButton.addEventListener(
  "click",
  createPDF
);


// ------------------------------------------------------
// PRIMER CÁLCULO
// ------------------------------------------------------

calculate();
