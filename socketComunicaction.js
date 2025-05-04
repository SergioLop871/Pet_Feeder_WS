function main() {
  //Crear un nuevo websocket
  let socket = null; // Variable para guardar el socket
  let tryToReconnect = null; // Variable para guardar el timeout de la reconexion y poder borrarlo
  const reconnectInterval = 3000; //Tiempo de espera para reconectar en caso de desconexion

  //Elementos HTML para mostrar info. de pesos y avisos
  const water_weight_info = document.getElementById("water_weight");
  const food_weight_info = document.getElementById("food_weight");
  const display_info = document.getElementById("some_info");
  const water_button = document.getElementById("water_button"); // Boton para dispensar agua
  const food_button = document.getElementById("food_button"); // Boton para dispensar comida

  function connectToWebsocket() {
    // Posibles valores para socket.readyState

    //WebSocket.CONNECTING (0): socket created. connection isn't yet open.
    //WebSocket.OPEN (1): the connection is open and ready to communicate.
    //WebSocket.CLOSING (2): the connection is in the process of closing.
    //WebSocket.CLOSED (3): the connection is closed or couldn't be opened.

    //Si existe un socket y este no esta cerrado
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      console.log("Ya existe una conexion activa o en proceso");
      return;
    }

    //Se crea el nuevo socket
    socket = new WebSocket("ws://localhost:5000/ws");

    //Enviar un primer mensaje al websocket para identificar a este cliente
    socket.onopen = () => {
      console.log("Se ha conectado al websocket");
      socket.send(JSON.stringify({ type: "webClient" }));
      clearTimeout(tryToReconnect);
      tryToReconnect = null;
    };

    // Manejar los mensajes recibidos
    socket.onmessage = (event) => {
      data = JSON.parse(event.data);
      //Manejar los posibles campos del mensaje
      if ("agua" in data) {
        water_weight_info.innerHTML = `Peso Agua: ${data.agua}`;
      } else if ("comida" in data) {
        food_weight_info.innerHTML = `Peso Comida: ${data.comida}`;
      } else if ("info" in data) {
        display_info.innerHTML = `Info: ${data.info}`;
      } else if ("error" in data) {
        display_info.innerHTML = `Info: ${data.error}`;
      }
    };

    //Manejar errores
    socket.onerror = (error) => {
      console.log(`Error en el websocket: ${error}`);
      socket.close(); //Cerrar el socket para activar .onclose() y limpiar memoria
    };

    //Cuando la conexion se cierra (websocket desconectado)
    socket.onclose = () => {
      console.log("Websocket cerrado");
      console.log(
        `Se esta intentara la reconexion en ${
          reconnectInterval / 1000
        } segundos...`
      );
      tryToReconnect = setTimeout(connectToWebsocket, reconnectInterval); //Intentar reconectar
    };
  }

  //Mandar mensajes
  //Función para servir agua
  water_button.addEventListener("click", () => {
    if (socket?.readyState === WebSocket.OPEN) {
      console.log("Serve water");
      socket.send(JSON.stringify({ dispensar: "agua" })); //Se ejecuta solo si el socket esta conectado
    } else {
      console.log("Error: el socket no esta disponible");
    }
  });
  //Función para servir comida
  food_button.addEventListener("click", () => {
    if (socket?.readyState === WebSocket.OPEN) {
      console.log("Serve food");
      socket.send(JSON.stringify({ dispensar: "comida" })); //Se ejecuta solo si el socket esta conectado
    } else {
      console.log("Error: el socket no esta disponible");
    }
  });

  connectToWebsocket(); //Realizar la conexion inicial
}

main();
