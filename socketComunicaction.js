function main() {
  //Crear el socket y asignarle la dirección
  const socket = io("http://localhost:5000");

  //Elementos de HTML
  const water_weight_info = document.getElementById("water_weight");
  const water_button = document.getElementById("water_button");
  const food_weight_info = document.getElementById("food_weight");
  const food_button = document.getElementById("food_button");
  const display_info = document.getElementById("display_info");

  // JSON para respuestas (Cliente JS => Arduino)
  // Agregar la info. necesaria
  const messageData = {
    messageType: "response",
    data: {
      dispensar: "",
    },
  };

  //Verificar que el cliente se conecta al socket
  socket.on("connect", () => {
    console.log("conectado al Socket");

    //Creación del JSON para registrar cliente web
    let identifyMessage = {
      messageType: "identify",
      clientType: "webClient",
    };
    //Enviar el JSON al Socket
    emit("message", identifyMessage);
  });

  //Función para servir comida
  food_button.addEventListener("click", () => {
    console.log("Serve food"); //Verificar que se ejecute el EventListener
    messageData["data"]["dispensar"] = "comida";
    socket.emit("message", messageData);
  });

  //Función para servir agua
  water_button.addEventListener("click", () => {
    console.log("Serve water"); //Verificar que se ejecute el EventListener
    messageData["data"]["dispensar"] = "agua";
    socket.emit("message", messageData);
  });

  //Función para mostar los datos recibidos del socket
  socket.on("response", (data) => {
    //Verificar si se encuentran los apartados de agua y comida
    if ("agua" in data && "comida" in data) {
      water_weight_info.innerHTML = `Peso Agua: ${data["agua"]}`;
      food_weight_info.innerHTML = `Peso Comida: ${data["comida"]}`;

      //Mostar la info. del proceso aquí
      //display_info.innerHTML = `Info: ${data[""]}`;
    } else {
      //Si no se encuetran los apartados
      display_info.innerHTML = `Info: No se encuentran los datos`;
    }
  });
}

main();
