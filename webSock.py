
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room

#Creación de la app y el socket
app = Flask(__name__)
socket = SocketIO(app, cors_allowed_origins="*")

# Para probar el envio de mensajes
@socket.on("message")
def handle_message(data):
    emit("response", data)
    
# Crear una comunicación con el arduino 
@socket.on("create_room_arduino")
def handle_create_room_arduino():
    # Desde el arduino, al conectarse al socket usar: 
    # client.sendTXT("42[\"create_room_arduino\"]");  // Emite el evento 'create_room_arduino'
    join_room("arduino") #Crea una sala para comunicarse con el arduino

#Manejar la acción de servir comida desde el cliente
@socket.on("serve_food")
def handle_serve_food():
    pass

#Manejar la acción de servir agua desde el cliente
@socket.on("serve_water")
def handle_serve_water():
    pass

#Correr el socket en el puerto 5000, y escuchar a todas las IP
if __name__ == "__main__":
    socket.run(app, host="0.0.0.0", port=5000, debug=True)