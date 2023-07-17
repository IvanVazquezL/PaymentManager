import dotenv from 'dotenv';
dotenv.config();
import {
  header,
  readInput,
  menu
} from "./helpers/inquirer.js";
import AuthService from './services/authService.js';
import PaymentManager from './helpers/paymentManager.js';

async function main() {
  const authService = new AuthService();
  header();
  const username = await readInput('Enter username: ');
  const password = await readInput('Enter password: ');

  const data = await authService.login(username, password);

  if(data?.ok) {
    header();
    console.log('Login successful. Access granted.')
  } else {
    return;
  }

  let opt = ''
  const paymentManager = new PaymentManager(username, data.token);

  do {
    opt = await menu();

    switch (opt) {
      case '1':
        const path = await readInput('Give the path of the pdf: ');
        await paymentManager.pdfReader(path);
        break;    
      default:
        break;
    }

  } while(opt !== '0')

    return;
    const array = [];

    readFile("Billing/EneroBonos-2023.pdf", (err, pdfBuffer) => {
        // pdfBuffer contains the file content
      
        new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
          if (err) console.error("error:", err);
          else if (!item) managePayment();
          else if (item.text) array.push(item.text);
        });
      });
      
      function managePayment() {
          console.log(JSON.stringify(array));
      
          const KEYWORDS = [
              "Fecha:",
              "Sueldo",
              "I.M.S.S.",
              "Premio Asistencia",
              "eado",
              "Premio Puntualidad",
              "I.S.R. sp",
              "Empresa",
              "SGMM",
              "ador",
              "Subtotal $",
              "Descuentos $",
              "Retenciones $",
              "Total $",
              "Neto del recibo $",
              "Total Percepc. más Otros Pagos  $",
              "Despensa",
              "Gasolina"
          ];
      
          const propiedades = {
              "Fecha:": "Fecha de Pago",
              "Sueldo": "Sueldo",
              "I.M.S.S.": "I.M.S.S.",
              "Premio Asistencia": "Premio Asistencia",
              "eado": "Fondo Ahorro Empleado",
              "Premio Puntualidad": "Premio Puntualidad",
              "I.S.R. sp": "I.S.R.",
              "Empresa": "Fondo Ahorro Empresa",
              "SGMM": "SGGM",
              "ador": "Fondo Ahorro Trabajador",
              "Subtotal $": "Subtotal",
              "Descuentos $": "Descuentos",
              "Retenciones $": "Retenciones",
              "Total $": "Total",
              "Neto del recibo $": "Neto del Recibo",
              "Total Percepc. más Otros Pagos  $": "Total percepcion mas otros pagos",
              "Despensa": "Despensa",
              "Gasolina": "Gasolina"
          };
      
          const obj = {};
      
          for (let i = 0; i < array.length; i++) {
      
              if(array[i] === "Total Percepc. más Otros Pagos  $") {
                  obj[propiedades[array[i]]] = array[i - 1];
              } else if(array[i].includes("Quincenal")) {
                obj["Tipo de Recibo"] = "Salario";
                obj["Inicio del Periodo"] = array[i + 1];
                obj["Fin del Periodo"] = array[i + 3];
              } else if(array[i].includes("Otra Periodicidad")){
                obj["Tipo de Recibo"] = "Otros";
                obj["Inicio del Periodo"] = array[i + 1];
                obj["Fin del Periodo"] = array[i + 3];
              }
              else if(array[i].includes("142 - ")) {
                obj["Nombre"] = array[i].replace("142 - ", "");
              } else if(KEYWORDS.includes(array[i])) {
                  obj[propiedades[array[i]]] = array[i + 1];
              }   
          }
          console.log(JSON.stringify(obj, null, 2))
      }
}

await main();



