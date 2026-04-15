// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TodoList (Lista de Tareas)
 * @notice Cada wallet tiene su propia lista de tareas en la blockchain.
 *
 * Conceptos clave:
 * - msg.sender: la dirección (wallet) de quien llama la función
 * - mapping: como un diccionario → wallet => lista de tareas
 * - struct: un tipo de dato con varios campos agrupados
 * - events: notificaciones que el frontend puede escuchar
 */
contract TodoList {

    // Estructura de una tarea
    struct Todo {
        uint256 id;        // Identificador único
        string  text;      // Descripción de la tarea
        bool    completed; // true = completada, false = pendiente
    }

    // Cada wallet tiene su propio array de tareas
    mapping(address => Todo[]) private _todos;

    // Eventos: el frontend los escucha para actualizar la UI
    event TodoAdded(address indexed owner, uint256 indexed id, string text);
    event TodoToggled(address indexed owner, uint256 indexed id, bool completed);
    event TodoUpdated(address indexed owner, uint256 indexed id, string newText);
    event TodoDeleted(address indexed owner, uint256 indexed id);

    // ── CREATE ──────────────────────────────────────────────────────────────

    /// @notice Crea una nueva tarea
    function addTodo(string calldata text) external {
        require(bytes(text).length > 0, "El texto no puede estar vacio");

        uint256 newId = _todos[msg.sender].length;

        _todos[msg.sender].push(Todo({
            id:        newId,
            text:      text,
            completed: false
        }));

        emit TodoAdded(msg.sender, newId, text);
    }

    // ── READ ────────────────────────────────────────────────────────────────

    /// @notice Devuelve todas las tareas del usuario
    /// @dev Las tareas eliminadas tendrán id=0, text="" y completed=false
    function getTodos() external view returns (Todo[] memory) {
        return _todos[msg.sender];
    }

    // ── UPDATE ──────────────────────────────────────────────────────────────

    /// @notice Cambia el estado: completada ↔ pendiente
    function toggleTodo(uint256 id) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");

        Todo storage todo = _todos[msg.sender][id];
        todo.completed = !todo.completed;

        emit TodoToggled(msg.sender, id, todo.completed);
    }

    /// @notice Edita el texto de una tarea
    function updateTodo(uint256 id, string calldata newText) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");
        require(bytes(newText).length > 0, "El texto no puede estar vacio");

        _todos[msg.sender][id].text = newText;

        emit TodoUpdated(msg.sender, id, newText);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    /// @notice Elimina una tarea (pone sus valores en cero)
    /// @dev Usa `delete` de Solidity que resetea el slot a valores por defecto.
    ///      El frontend debe filtrar tareas donde text == "" para no mostrarlas.
    function deleteTodo(uint256 id) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");

        delete _todos[msg.sender][id];

        emit TodoDeleted(msg.sender, id);
    }
}