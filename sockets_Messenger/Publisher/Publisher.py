import socket
import json


def main():
    try:
        # Solicităm utilizatorului să introducă IP-ul și portul
        ip_address = input("Introduceți adresa IP: ")
        port = int(input("Introduceți portul: "))

        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        client.connect((ip_address, port))

        client.sendall("publisher".encode('utf-8'))

        send_message(client)
        client.close()
    except ValueError:
        print("Portul introdus nu este valid.")
    except socket.error as e:
        print(f"Eroare la conexiunea cu socket-ul: {e}")
    except Exception as e:
        print(f"Eroare neașteptată: {e}")


def send_message(client):
    try:
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
    except json.JSONDecodeError:
        print("Eroare la serializarea mesajului.")
    except socket.error as e:
        print(f"Eroare la trimiterea mesajului prin socket: {e}")
    except Exception as e:
        print(f"Eroare neașteptată: {e}")


if __name__ == "__main__":
    main()
