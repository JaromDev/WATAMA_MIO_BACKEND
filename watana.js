// Importar el módulo 'node-fetch' para realizar las solicitudes HTTP
const fetch = require('node-fetch');

// Definir la clase WatanaApi
class WatanaApi {
  // Constructor para inicializar las variables de configuración
  constructor(url,token) {
    this.apiUrl = url;
    this.authToken = token;
  }

  // Método para enviar una solicitud POST y obtener una respuesta
  async sendPostRequest(data) {
    // Comprobar si la URL y el token están configurados
    if (!this.apiUrl || !this.authToken) {
      throw new Error('URL y token no configurados. Por favor, configúralos utilizando el método configure(url, token).');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    return responseData;
  }

  // Método para consultar una carpeta
  async ConsultarCarpeta(data, responseFunc) {
    if (data.operacion !== 'consultar_carpeta') {
      data.operacion = 'consultar_carpeta';
    }

    if (!data.carpeta_codigo) {
      throw new Error('"carpeta_codigo" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }

  async DescargarCarpeta(data, responseFunc) {
    if (data.operacion !== 'descargar_carpeta') {
      data.operacion = 'descargar_carpeta';
    }

    if (!data.carpeta_codigo) {
      throw new Error('"carpeta_codigo" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }

  async EliminarCarpeta(data, responseFunc) {
    if (data.operacion !== 'eliminar_carpeta') {
      data.operacion = 'eliminar_carpeta';
    }

    if (!data.carpeta_codigo) {
      throw new Error('"carpeta_codigo" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }
  // lo añadi recien
  async saveSignedPdf(base64Data, outputFilePath) {
    if (!base64Data) {
      console.error('Error: El archivo firmado no se pudo guardar porque no se recibió ningún dato.');
      return;
    }
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(outputFilePath, pdfBuffer);
    console.log('PDF firmado guardado en:', outputFilePath);
  };
   

  async EnviarCarpeta(data, responseFunc) {
    if (data.operacion !== 'enviar_carpeta') {
      data.operacion = 'enviar_carpeta';
    }

    if (!data.carpeta_codigo) {
      throw new Error('"carpeta_codigo" debe existir');
    }
   
    if(!data.titulo)
      throw new Error('"titulo" debe existir');
   
    if(!data.firmante)
      throw new Error('"firmante" debe existir');
    if(!data.firmante.email)
      throw new Error('"firmante.email" debe existir');
   
    if(!data.archivos)
      throw new Error('"archivos" debe existir');
   
    for(var i = 0; i <= data.archivos.length -1;i++){
       if(!data.archivos[i].nombre)
        throw new Error('"archivos[' + i +'].nombre" debe existir');
      if(!data.archivos[i].zip_base64)
        throw new Error('"archivos[' + i +'].zip_base64" debe existir');
      
    }
    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }

  async ValidarPdf(data, responseFunc) {
    if (data.operacion !== 'validar_pdf') {
      data.operacion = 'validar_pdf';
    }

    if (!data.zip_base64) {
      throw new Error('"zip_base64" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }
  async FirmarPdf(data, responseFunc) {
    if (data.operacion !== 'firmar_pdf') {
      data.operacion = 'firmar_pdf';
    }

    if (!data.zip_base64) {
      throw new Error('"zip_base64" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }
  async SellarPdf(data, responseFunc) {
    if (data.operacion !== 'sellar_pdf') {
      data.operacion = 'sellar_pdf';
    }

    if (!data.zip_base64) {
      throw new Error('"zip_base64" debe existir');
    }

    const responseData = await this.sendPostRequest(data);
    responseFunc(responseData);
  }
}

// Exportar la clase WatanaApi para que esté disponible para su uso en otros archivos
module.exports = WatanaApi;


