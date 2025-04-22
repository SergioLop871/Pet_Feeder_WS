function main() {
  //Crear el socket y asignarle la dirección
  const socket = io("http://localhost:5000");
  const water_weight_info = document.getElementById("water_weight");
  const water_button = document.getElementById("water_button");
  const food_weight_info = document.getElementById("food_weight");
  const food_button = document.getElementById("food_button");

  //Agregar la info. necesaria
  const messageData = { foodWeight: 0, waterWeight: 0 };

  //Varaible para verificar si el servo esta listo para servir nuevamente
  let servoReady;

  //Verificar que el cliente se conecta al socket
  socket.on("connect", () => console.log("conectado al Socket"));

  //Función para servir comida
  food_button.addEventListener("click", () => {
    console.log("Serve food");
    messageData["foodWeight"] += 1;

    //Usar "serve_food" en lugar de "message"
    socket.emit("message", messageData);
  });

  //Función para servir agua
  water_button.addEventListener("click", () => {
    console.log("Serve water");
    messageData["waterWeight"] += 1;

    //Usar "serve_water" en lugar de "message"
    socket.emit("message", messageData);
  });

  //Función para mostar los datos recibidos del socket
  socket.on("response", (data) => {
    water_weight_info.innerHTML = `Peso Agua: ${data["waterWeight"]}`;
    food_weight_info.innerHTML = `Peso Comida: ${data["foodWeight"]}`;
  });
}

main();
