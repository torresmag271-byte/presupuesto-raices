const expenseCategories = [
  "Vivienda",
  "Comida",
  "Transporte",
  "Educación",
  "Deportes",
  "Medicina privada",
  "Cuotas de tarjeta de crédito",
  "Streaming",
  "Salidas",
  "Ahorro / Fondo de emergencia",
  "Otros"
];


const expensesContainer =
  document.getElementById("expenses");

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

const totalEgresosEl =
  document.getElementById("totalEgresos");


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



function createExpenses() {

  expenseCategories.forEach((category) => {

    const row =
      document.createElement("div");


    row.className =
      "expense-row";


    const note =
      category === "Ahorro / Fondo de emergencia"
        ? `
          <div style="
            font-size:12px;
            color:#888;
            margin-top:3px;
          ">
            Separar antes de gastar
          </div>
        `
        : "";


    row.innerHTML = `

      <div class="expense-top">

        <div>

          <label>
            ${category}
          </label>

          ${note}

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


    expensesContainer.appendChild(row);

  });

}



function getBudgetData() {

  let grossIncome = 0;


  incomeInputs.forEach((input) => {

    grossIncome +=
      parseMoney(input.value);

  });


  const tithe =
    titheCheckbox.checked
      ? grossIncome * 0.10
      : 0;


  const netIncome =
    grossIncome - tithe;


  let totalExpenses = 0;

  const expenses = [];


  const rows =
    document.querySelectorAll(".expense-row");


  rows.forEach((row, index) => {

    const input =
      row.querySelector(".expense-input");


    const amount =
      parseMoney(input.value);


    totalExpenses += amount;


    const percentage =
      netIncome > 0
        ? Math.round(
            (amount / netIncome) * 100
          )
        : 0;


    expenses.push({

      category:
        expenseCategories[index],

      amount,
      percentage

    });

  });


  const balance =
    netIncome - totalExpenses;


  return {

    grossIncome,
    tithe,
    netIncome,
    totalExpenses,
    balance,
    expenses

  };

}



function calculate() {

  const data =
    getBudgetData();


  const rows =
    document.querySelectorAll(".expense-row");


  rows.forEach((row, index) => {

    const percentage =
      data.expenses[index].percentage;


    const fill =
      row.querySelector(".expense-fill");


    const percentageEl =
      row.querySelector(".expense-percentage");


    percentageEl.textContent =
      `${percentage}%`;


    fill.style.width =
      `${Math.min(percentage, 100)}%`;

  });


  subtotalIngresosEl.textContent =
    formatMoney(data.grossIncome);


  totalDiezmoEl.textContent =
    "- " + formatMoney(data.tithe);


  totalIngresosEl.textContent =
    formatMoney(data.netIncome);


  totalEgresosEl.textContent =
    formatMoney(data.totalExpenses);


  saldoEl.textContent =
    formatMoney(data.balance);


  if (titheCheckbox.checked) {

    titheLine.style.display =
      "flex";

  }

  else {

    titheLine.style.display =
      "none";

  }


  if (data.balance > 0) {

    saldoLabelEl.textContent =
      "Saldo a favor";

  }

  else if (data.balance < 0) {

    saldoLabelEl.textContent =
      "Saldo por cubrir";

  }

  else {

    saldoLabelEl.textContent =
      "Saldo";

  }


  updateReflection(
    data.balance,
    data.netIncome
  );

}



function updateReflection(balance, income) {

  if (income === 0) {

    questionsEl.innerHTML = `

      <p>
        Completá tus ingresos y egresos para comenzar.
      </p>

    `;

    return;

  }


  const marginPercentage =
    (balance / income) * 100;



  // EXCEDENTE

  if (
    balance > 0 &&
    marginPercentage > 5
  ) {

    questionsEl.innerHTML = `

      <p>
        <strong>
          Terminaste el mes con un excedente.
        </strong>
      </p>

      <p>
        Dios no solo nos llama a administrar con fidelidad
        cuando falta, sino también cuando sobra.
      </p>

      <p>
        <strong>
          Conversalo con Dios:
        </strong>
      </p>

      <p>
        <strong>
          ¿Cómo puedo administrar este excedente
          de una manera que honre a Dios?
        </strong>
      </p>

      <p>
        <strong>
          Algunas ideas:
        </strong>
      </p>

      <ul>

        <li>
          Ser generoso y bendecir a alguien.
        </li>

        <li>
          Fortalecer mi ahorro o fondo de emergencia.
        </li>

        <li>
          Prepararme para una necesidad o proyecto futuro.
        </li>

        <li>
          <strong>Invertir con propósito</strong>,
          por ejemplo, campamentos, Corazón por la Misión,
          CA u otros proyectos.
        </li>

      </ul>

    `;

  }



  // EQUILIBRIO

  else if (balance >= 0) {

    questionsEl.innerHTML = `

      <p>
        <strong>
          Lograste mantener un equilibrio entre
          tus ingresos y tus egresos.
        </strong>
      </p>

      <p>
        Es una buena base para seguir creciendo
        en una administración sabia.
      </p>

      <p>
        <strong>
          Conversalo con Dios:
        </strong>
      </p>

      <p>
        <strong>
          ¿Qué pequeño cambio puedo hacer para empezar
          a generar margen en mis finanzas?
        </strong>
      </p>

      <p>
        <strong>
          Algunas ideas:
        </strong>
      </p>

      <ul>

        <li>
          Revisar si hay algún gasto que podría reducir.
        </li>

        <li>
          Planificar mejor alguna compra o gasto
          antes de hacerlo.
        </li>

        <li>
          Comenzar a separar una pequeña cantidad
          para ahorro o imprevistos.
        </li>

        <li>
          Buscar alguna oportunidad para aumentar
          mis ingresos.
        </li>

      </ul>

    `;

  }



  // SALDO POR CUBRIR

  else {

    questionsEl.innerHTML = `

      <p>
        <strong>
          Lo más importante ya ocurrió:
          ordenarte es un paso de fe.
        </strong>
      </p>

      <p>
        Reconocer dónde estamos nos permite comenzar
        a tomar decisiones que nos acerquen
        a una administración más sabia.
      </p>

      <p>
        <strong>
          Conversalo con Dios:
        </strong>
      </p>

      <p>
        <strong>
          ¿Cuál es el próximo paso que puedo dar
          para comenzar a ordenar mis finanzas?
        </strong>
      </p>

      <p>
        <strong>
          Algunas ideas:
        </strong>
      </p>

      <ul>

        <li>
          Identificar cuál es el gasto que hoy
          tiene mayor impacto.
        </li>

        <li>
          Reducir o postergar algún gasto
          que no sea prioritario.
        </li>

       <li>
  Dar un paso de fe y buscar maneras de aumentar mis ingresos:
  buscar un trabajo nuevo, hacer horas extras,
  comenzar un emprendimiento, capacitarme
  o explorar una nueva oportunidad.
</li>

        <li>
          Pedir consejo o ayuda si necesito acompañamiento
          para ordenar mis finanzas.
        </li>

      </ul>

    `;

  }

}



createExpenses();



document.addEventListener(
  "input",
  (event) => {

    if (
      event.target.classList.contains("money")
    ) {

      formatInput(event.target);

      calculate();

    }

  }
);



titheCheckbox.addEventListener(
  "change",
  calculate
);



clearIncomeButton.addEventListener(
  "click",
  () => {

    incomeInputs.forEach((input) => {

      input.value = "";

    });


    titheCheckbox.checked =
      false;


    calculate();

  }
);



clearExpensesButton.addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(".expense-input")
      .forEach((input) => {

        input.value = "";

      });


    calculate();

  }
);



function setCurrentMonth() {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  mesInput.value =
    `${year}-${month}`;

}



setCurrentMonth();



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


  return `${months[Number(month) - 1]} ${year}`;

}



function loadImageAsDataURL(src) {

  return new Promise((resolve, reject) => {

    const img =
      new Image();


    img.onload =
      function () {

        const canvas =
          document.createElement("canvas");


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
          canvas.toDataURL("image/png")
        );

      };


    img.onerror =
      reject;


    img.src =
      src;

  });

}



async function createPDF() {

  const { jsPDF } =
    window.jspdf;


  const doc =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });


  const data =
    getBudgetData();


  const nombre =
    nombreInput.value.trim()
    || "Sin nombre";


  const monthText =
    getMonthName(
      mesInput.value
    );


  const monthFile =
    monthText
      .replace(/\s+/g, "_")
      .replace(/[^\wÀ-ÿ_-]/g, "");


  const compromiso =
    compromisoInput.value.trim();


  const margin =
    18;


  const pageWidth =
    doc.internal.pageSize.getWidth();


  const contentWidth =
    pageWidth - margin * 2;


  let y =
    20;



  function checkPage(space = 12) {

    if (y + space > 270) {

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



  function row(
    label,
    value,
    bold = false
  ) {

    checkPage(8);


    doc.setFont(
      "helvetica",
      bold ? "bold" : "normal"
    );


    doc.setFontSize(
      bold ? 11 : 10
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
        align: "right"
      }
    );


    y += 7;

  }



  function divider() {

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
      lines.length * 5 + 3
    );


    doc.setFont(
      "helvetica",
      bold ? "bold" : "normal"
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
      lines.length * 5 + 2
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



  // CABECERA

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
      align: "center"
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
      align: "center"
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



  // INGRESOS

  title("Ingresos");


  const incomeNames = [
    "Sueldo",
    "Ayuda familiar",
    "Beca",
    "Otros ingresos"
  ];


  incomeInputs.forEach(
    (input, index) => {

      row(
        incomeNames[index],
        formatMoney(
          parseMoney(input.value)
        )
      );

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
      "- " + formatMoney(
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



  // EGRESOS

  title("Egresos");


  const activeExpenses =
    data.expenses.filter(
      expense =>
        expense.amount > 0
    );


  if (
    activeExpenses.length === 0
  ) {

    row(
      "Sin egresos cargados",
      ""
    );

  }

  else {

    activeExpenses.forEach(
      (expense) => {

        row(
          expense.category,
          `${formatMoney(expense.amount)}   ${expense.percentage}%`
        );

      }
    );

  }


  divider();


  row(
    "Total egresos",
    formatMoney(
      data.totalExpenses
    ),
    true
  );


  y += 6;



  // SALDO

  checkPage(20);


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


  let saldoLabel =
    "Saldo";


  if (
    data.balance > 0
  ) {

    saldoLabel =
      "Saldo a favor";

  }

  else if (
    data.balance < 0
  ) {

    saldoLabel =
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
    saldoLabel,
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
      data.balance
    ),
    pageWidth - margin - 6,
    y + 11,
    {
      align: "right"
    }
  );


  y += 28;



  // REFLEXIÓN

  title(
    "Reflexionemos"
  );


  const marginPercentage =
    data.netIncome > 0
      ? (
          data.balance
          / data.netIncome
        ) * 100
      : 0;



  // EXCEDENTE

  if (
    data.netIncome === 0
  ) {

    paragraph(
      "Completá tus ingresos y egresos para comenzar."
    );

  }

  else if (
    data.balance > 0 &&
    marginPercentage > 5
  ) {

    paragraph(
      "Terminaste el mes con un excedente.",
      true
    );


    paragraph(
      "Dios no solo nos llama a administrar con fidelidad cuando falta, sino también cuando sobra."
    );


    paragraph(
      "Conversalo con Dios:",
      true
    );


    paragraph(
      "¿Cómo puedo administrar este excedente de una manera que honre a Dios?",
      true
    );


    paragraph(
      "Algunas ideas:",
      true
    );


    bullet(
      "Ser generoso y bendecir a alguien."
    );


    bullet(
      "Fortalecer mi ahorro o fondo de emergencia."
    );


    bullet(
      "Prepararme para una necesidad o proyecto futuro."
    );


    bullet(
      "Invertir con propósito, por ejemplo, campamentos, Corazón por la Misión, CA u otros proyectos."
    );

  }



  // EQUILIBRIO

  else if (
    data.balance >= 0
  ) {

    paragraph(
      "Lograste mantener un equilibrio entre tus ingresos y tus egresos.",
      true
    );


    paragraph(
      "Es una buena base para seguir creciendo en una administración sabia."
    );


    paragraph(
      "Conversalo con Dios:",
      true
    );


    paragraph(
      "¿Qué pequeño cambio puedo hacer para empezar a generar margen en mis finanzas?",
      true
    );


    paragraph(
      "Algunas ideas:",
      true
    );


    bullet(
      "Revisar si hay algún gasto que podría reducir."
    );


    bullet(
      "Planificar mejor alguna compra o gasto antes de hacerlo."
    );


    bullet(
      "Comenzar a separar una pequeña cantidad para ahorro o imprevistos."
    );


    bullet(
      "Buscar alguna oportunidad para aumentar mis ingresos."
    );

  }



  // SALDO POR CUBRIR

  else {

    paragraph(
      "Lo más importante ya ocurrió: ordenarte es un paso de fe.",
      true
    );


    paragraph(
      "Reconocer dónde estamos nos permite comenzar a tomar decisiones que nos acerquen a una administración más sabia."
    );


    paragraph(
      "Conversalo con Dios:",
      true
    );


    paragraph(
      "¿Cuál es el próximo paso que puedo dar para comenzar a ordenar mis finanzas?",
      true
    );


    paragraph(
      "Algunas ideas:",
      true
    );


    bullet(
      "Identificar cuál es el gasto que hoy tiene mayor impacto."
    );


    bullet(
      "Reducir o postergar algún gasto que no sea prioritario."
    );


    bullet(
  "Dar un paso de fe y buscar maneras de aumentar mis ingresos: buscar un trabajo nuevo, hacer horas extras, comenzar un emprendimiento, capacitarme o explorar una nueva oportunidad."
);


    bullet(
      "Pedir consejo o ayuda si necesito acompañamiento para ordenar mis finanzas."
    );

  }



  // COMPROMISO

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



  // LOGOS

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
      y > 248
    ) {

      doc.addPage();

      y = 245;

    }

    else {

      y =
        Math.max(
          y + 10,
          245
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



  // DESCARGA

  const safeName =
    nombre
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");


  doc.save(
    `Presupuesto_${safeName}_${monthFile}.pdf`
  );

}



downloadBudgetButton.addEventListener(
  "click",
  createPDF
);


calculate();