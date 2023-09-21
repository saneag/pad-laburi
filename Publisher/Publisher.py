import socket
import json


def main():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(("192.168.30.222", 5050))

    client.sendall("publisher".encode('utf-8'))

    send_message(client)
    client.close()


def send_message(client):
    while True:
        topic = input("Introduceți topicul: ")
        title = input("Introduceți titlul postarii: ")
        content = input("Introduceți conținutul postarii: ")

        message = {
            "topic": topic,
            "title": title,
            "message": content
        }

        serialized_message = json.dumps(message)
        client.sendall(serialized_message.encode('utf-8'))

        response = input("Doriti sa mai faceti o postare?: \n 1. Da \n 2. Nu \n")
        if response != "1":
            break


if __name__ == "__main__":
    main()
