import { readFile } from "fs";
import { PdfReader } from "pdfreader";

class PaymentManager {
    pdfToText = [];

    constructor() {
        this.pdfToText = [];
    }

    pdfReader(path) {
        readFile(path, (err, pdfBuffer) => {
            // pdfBuffer contains the file content
          
            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
              if (err) console.error("error:", err);
              else if (!item) this.extractDataFromText();
              else if (item.text) this.pdfToText.push(item.text);
            });
          });
    }
    
    extractDataFromText() {    
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
    }
}

export default PaymentManager;