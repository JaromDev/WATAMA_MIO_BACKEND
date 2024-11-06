// Importar módulos y la clase WatanaApi
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const WatanaApi = require('./watana.js'); // Asegúrate de que la ruta sea correcta

// Función para cargar el PDF de ejemplo
const loadPdf = (filePath) => fs.readFileSync(filePath);

// Función para convertir el PDF a ZIP y luego a Base64
const convertPdfToZipAndBase64 = (pdfBuffer) => {
  const zip = new AdmZip();
  zip.addFile("example.pdf", pdfBuffer);
  return zip.toBuffer().toString('base64');
};

// Función para guardar el PDF firmado directamente si está en base64
const saveSignedPdf = (base64Data, outputFilePath) => {
  if (!base64Data) {
    console.error('Error: El archivo firmado no se pudo guardar porque no se recibió ningún dato.');
    return;
  }
  const pdfBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(outputFilePath, pdfBuffer);
  console.log('PDF firmado guardado en:', outputFilePath);
};

// Función para convertir el ZIP en base64 a PDF y guardarlo en la carpeta 'documentos'
const convertZipToPdf = (zipBase64, outputFilePath) => {
  try {
    const zipBuffer = Buffer.from(zipBase64, 'base64');
    const zip = new AdmZip(zipBuffer);
    const pdfEntry = zip.getEntries().find(entry => entry.entryName.endsWith('.pdf'));

    if (!pdfEntry) throw new Error('No se encontró un archivo PDF en el ZIP.');
    
    fs.writeFileSync(outputFilePath, pdfEntry.getData());
    console.log('PDF extraído y guardado en:', outputFilePath);
  } catch (error) {
    console.error('Error al convertir el ZIP a PDF:', error);
  }
};

// Función principal utilizando WatanaApi
const main = async (endpointUrl, token) => {
  try {
    const watanaApi = new WatanaApi(endpointUrl, token);

    // Ruta al archivo PDF de ejemplo
    const pdfPath = path.join(__dirname, 'documentos', 'example.pdf');
    const pdfBuffer = loadPdf(pdfPath);

    // Convertir PDF a ZIP y luego a Base64
    const base64Zip = convertPdfToZipAndBase64(pdfBuffer);

    // Validación del PDF
    await watanaApi.ValidarPdf({ zip_base64: base64Zip }, (responseData) => {
      console.log('Validación PDF:', responseData);
    });

    // Firma del PDF
    await watanaApi.FirmarPdf({ zip_base64: base64Zip }, (signedPdfResponse) => {
      if (signedPdfResponse && signedPdfResponse.zip_base64) {
        console.log('Firma de PDF exitosa');

        // Ruta de salida para el PDF firmado extraído del ZIP
        const outputPath = path.join(__dirname, 'documentos', 'example_signed.pdf');
        
        // Convertir el ZIP firmado a PDF y guardarlo
        convertZipToPdf(signedPdfResponse.zip_base64, outputPath);
      } else {
        console.error('Error en la firma de PDF:', signedPdfResponse);
      }
    });

  } catch (error) {
    console.error('Error en el proceso:', error);
  }
};

// dezipear a pdf y guardar : enrutarlo
// Llamada a la función principal con el endpoint y el token
const endpointUrl = 'https://api.watana.pe/api/v1/proveedor/7fTRXITTsPszFf51qjyDpHMBrcoFOEWo_aiFg2kDt30';
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjUxOGIyZTA5YThlMDVlNjMyOGNhOWUwNzk4MmMyNmI4ZjU5OWQwOTNhMGQ5NmI0NSJ9.5D8JHAn0YkTt2g4aGbOFthCPmgHQjIF8gBNdqzlylmY';
main(endpointUrl, token);

