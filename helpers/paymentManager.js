import { readFile } from "fs";
import { PdfReader } from "pdfreader";
import {
    readInput
} from "./inquirer.js";
import BillService from "../services/BillService.js";

class PaymentManager {
    pdfToText = [];
    username = '';
    token = '';

    constructor(username, token) {
        this.pdfToText = [];
        this.username = username;
        this.token = token;
    }

    async pdfReader(path) {
        readFile(path, (err, pdfBuffer) => {
            // pdfBuffer contains the file content
          
            new PdfReader().parseBuffer(pdfBuffer, async (err, item) => {
              if (err) console.error("error:", err);
              else if (!item) await this.extractDataFromText();
              else if (item.text) this.pdfToText.push(item.text);
            });
          });
    }
    
    async extractDataFromText() {    
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
    
        for (let i = 0; i < this.pdfToText.length; i++) {
    
            if(this.pdfToText[i] === "Total Percepc. más Otros Pagos  $") {
                obj[propiedades[this.pdfToText[i]]] = this.pdfToText[i - 1];
            } else if(this.pdfToText[i].includes("Quincenal")) {
              obj["Tipo de Recibo"] = "Salario";
              obj["Inicio del Periodo"] = this.pdfToText[i + 1];
              obj["Fin del Periodo"] = this.pdfToText[i + 3];
            } else if(this.pdfToText[i].includes("Otra Periodicidad")){
              obj["Tipo de Recibo"] = "Otros";
              obj["Inicio del Periodo"] = this.pdfToText[i + 1];
              obj["Fin del Periodo"] = this.pdfToText[i + 3];
            }
            else if(this.pdfToText[i].includes("142 - ")) {
              obj["Nombre"] = this.pdfToText[i].replace("142 - ", "");
            } else if(KEYWORDS.includes(this.pdfToText[i])) {
                obj[propiedades[this.pdfToText[i]]] = this.pdfToText[i + 1];
            }   
        }
        console.log(JSON.stringify(obj, null, 2))
        const answer = await readInput('Save bill? (y/n): ');

        if (answer === 'y') {
            const billService = new BillService();

            console.log('jello');

            const numericFields = {
                "Sueldo": "sueldo",
                "I.M.S.S.": "imss",
                "Premio Asistencia": "premioAsistencia",
                "Fondo Ahorro Empleado": "fondoAhorroEmpleado",
                "Premio Puntualidad": "premioPuntualidad",
                "I.S.R.": "isr",
                "Fondo Ahorro Empresa": "fondoAhorroEmpresa",
                "SGMM": "sggm",
                "Fondo Ahorro Trabajador": "fondoAhorroTrabajador",
                "Subtotal": "subtotal",
                "Descuentos": "descuentos",
                "Retenciones": "retenciones",
                "Total": "total",
                "Neto del Recibo": "netoDelRecibo",
                "Total percepcion mas otros pagos": "totalPercepcionMasOtrosPagos" 
            }

            const bill = {
                fechaDePagoIdentifier: obj['Fecha de Pago'],
                nombre: obj['Nombre'],
                tipoDeRecibo: obj['Tipo de Recibo'],
                fechaDePago: new Date(obj['Fecha de Pago']),
                inicioDelPeriodo: new Date(obj['Inicio del Periodo']),
                finDelPeriodo: new Date(obj['Fin del Periodo']),
                username: this.username
            };

            for (const [key, value] of Object.entries(obj)) {
                if (key in numericFields) {
                  bill[numericFields[key]] = parseFloat(value.replace(/,/g, ''));
                }
            }

            console.log(JSON.stringify(bill));

           const data = await billService.createBill(bill, this.token);
           console.log(data);
        }

    }
}

export default PaymentManager;