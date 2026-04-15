# 📜 Smart Contracts del Taller

¡Bienvenido a la carpeta de contratos inteligentes! Si es tu primera vez viendo código de **Solidity**, no te preocupes. Aquí te explicamos qué hace cada archivo en términos sencillos.

## 🧱 ¿Qué es un Smart Contract?
Imagina que es un programa que vive en la blockchain. Una vez que lo "desplegamos" (subimos), nadie puede cambiar su código. Funciona como un contrato digital que se ejecuta automáticamente de forma transparente y segura.

---

## 1. `Storage.sol` (Nivel: Muy Básico)
Este es el hola mundo de los contratos. Sirve para entender cómo la blockchain guarda información.

*   **¿Qué hace?**: Guarda un número en la blockchain.
*   **Funciones clave**:
    *   `store(num)`: Recibe un número y lo guarda. Esto es una **transacción de escritura** (cuesta gas).
    *   `retrieve()`: Te devuelve el número guardado. Esto es una **consulta de lectura** (es gratis).

---

## 2. `TodoList.sol` (Nivel: Intermedio)
Este contrato permite que cada persona tenga su propia lista de tareas privada. Es más avanzado porque usa conceptos fundamentales de Web3:

### Conceptos Importantes:
*   **`struct Todo`**: Es como un objeto que agrupa información (ID, texto, si está completado).
*   **`mapping`**: Es como un diccionario gigante que relaciona una dirección de wallet con su lista de tareas personal.
*   **`msg.sender`**: Es la dirección de la persona que está ejecutando la función en ese momento. Gracias a esto, el contrato sabe qué lista mostrarte sin necesidad de pedirte tu nombre de usuario.
*   **`events`**: Son notificaciones que el contrato envía. El frontend (la página web) escucha estos eventos para actualizar la lista de tareas automáticamente cuando algo cambia.

### Lo que puedes hacer:
1.  **Añadir tarea**: Crea una nueva entrada en tu lista.
2.  **Toggle (Completar)**: Cambia el estado de una tarea entre pendiente y completada.
3.  **Editar**: Permite corregir el texto de una tarea ya creada.
4.  **Eliminar**: Marca una tarea para que no se muestre más (resetea los datos).

---

## 🚀 ¿Cómo probarlos?
La forma más fácil para principiantes es usar [Remix IDE](https://remix.ethereum.org/):
1. Copia el código de estos archivos.
2. Pégalos en Remix.
3. Compila y despliega en la red **Monad Testnet**.

¡Feliz hacking! 💜
