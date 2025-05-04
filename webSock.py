from flask import Flask
from flask_sock import Sock
import json

#Creación de la app y el socket
app = Flask(__name__)
socket = Sock(app)

#Guardar las instancias de websocket (Arduino y cliente JS)
clients = []

@socket.route('/ws')
def websocket(ws): # "ws" es una instancia de websocket para cada cliente que se conecte
    try:
        # Se recibe un primer mensaje cuando el cliente se conecta
        # El primer mensaje contiene el tipo de cliente
        idMsg = ws.receive()

        #Se obtiene los datos del primer mensaje {'type': 'arduino/webClient'}
        clientType = json.loads(idMsg).get("type") 

        # Se guarda la instancia ws para enviar y recibir mensajes
        client = {"ws": ws, "type": clientType}
        clients.append(client)
        print(f"Se ha conectado un nuevo cliente {clientType}: {ws}")
        print(f"\nClientes actuales: \n {clients}")
    
        # Esto se ejecuta mientras la instancia del cliente o arduino este conectada 
        while True:

            # ws.receive() maneja los datos enviados por su mismo "cliente"
            data = ws.receive() 
            if data is None:
                break
            print(f"Mensaje de {clientType}: {data}")

            #Manejar el envio de mensajes, se envian a los otros clientes
            #Si la instancia "ws" actual es el arduino 
            if clientType == "arduino":
                for client in clients:
                    if client["type"] == "webClient":
                        client["ws"].send(data)
            # Si la instancia "ws" actual es un cliente JS
            elif clientType == "webClient":
                for client in clients:
                    if client["type"] == "arduino":
                        client["ws"].send(data)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        clients.remove(client)

#Correr el socket en el puerto 5000, y escuchar a todas las IP
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)




