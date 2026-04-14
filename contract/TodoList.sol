// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TodoList
 * @notice A multi-user todo list where each wallet has its own list.
 *         Designed for beginners — optimized for clarity, not gas.
 *
 * Key Concepts:
 * - msg.sender: always the wallet that called the function
 * - mapping: dictionary/map to store data (key → value)
 * - struct: custom data type grouping multiple fields
 * - events: broadcast data to the outside world (frontend listens)
 */
contract TodoList {

    // ─── Data Types ───────────────────────────────────────────────────────────

    struct Todo {
        uint256 id;          // index in the user's array
        string  text;        // the task text
        bool    completed;   // done or not
        bool    exists;      // false = was deleted (soft delete)
    }

    // ─── Storage ──────────────────────────────────────────────────────────────

    // wallet address → list of todos
    // Each user only sees their own todos because of msg.sender
    mapping(address => Todo[]) private _todos;

    // ─── Events ───────────────────────────────────────────────────────────────

    event TodoAdded(address indexed owner, uint256 indexed id, string text);
    event TodoToggled(address indexed owner, uint256 indexed id, bool completed);
    event TodoUpdated(address indexed owner, uint256 indexed id, string newText);
    event TodoDeleted(address indexed owner, uint256 indexed id);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    /// @notice Reusable guard: check that a todo exists and hasn't been deleted
    modifier todoExists(uint256 id) {
        require(id < _todos[msg.sender].length, "Todo: index out of range");
        require(_todos[msg.sender][id].exists, "Todo: already deleted");
        _;
    }

    // ─── Write Functions ─────────────────────────────────────────────────────

    /// @notice Create a new todo
    /// @param text The task text (cannot be empty)
    function addTodo(string calldata text) external {
        require(bytes(text).length > 0, "Todo: text cannot be empty");

        uint256 newId = _todos[msg.sender].length;
        _todos[msg.sender].push(Todo({
            id:        newId,
            text:      text,
            completed: false,
            exists:    true
        }));

        emit TodoAdded(msg.sender, newId, text);
    }

    /// @notice Toggle the completed status of a todo (true → false or false → true)
    /// @param id The todo index
    function toggleTodo(uint256 id) external todoExists(id) {
        Todo storage todo = _todos[msg.sender][id];
        todo.completed = !todo.completed;
        emit TodoToggled(msg.sender, id, todo.completed);
    }

    /// @notice Edit the text of an existing todo
    /// @param id The todo index
    /// @param newText The new task text (cannot be empty)
    function updateTodo(uint256 id, string calldata newText) external todoExists(id) {
        require(bytes(newText).length > 0, "Todo: text cannot be empty");
        _todos[msg.sender][id].text = newText;
        emit TodoUpdated(msg.sender, id, newText);
    }

    /// @notice Soft-delete a todo (marks exists=false, index stays the same)
    /// @dev Frontend should filter out todos where exists == false
    /// @param id The todo index
    function deleteTodo(uint256 id) external todoExists(id) {
        _todos[msg.sender][id].exists = false;
        emit TodoDeleted(msg.sender, id);
    }

    // ─── Read Functions ───────────────────────────────────────────────────────

    /// @notice Returns all todos for the caller (including soft-deleted ones)
    /// @dev Frontend should filter out todos where exists == false
    /// @return Array of all todos for msg.sender
    function getTodos() external view returns (Todo[] memory) {
        return _todos[msg.sender];
    }

    /// @notice Returns a single todo by index
    /// @param id The todo index
    /// @return The todo struct
    function getTodo(uint256 id) external view todoExists(id) returns (Todo memory) {
        return _todos[msg.sender][id];
    }

    /// @notice Returns how many todos the caller has (including deleted)
    /// @return Total number of todos (array length)
    function getTodoCount() external view returns (uint256) {
        return _todos[msg.sender].length;
    }

    // ─── Utilities ────────────────────────────────────────────────────────────

    /// @notice Get all active todos for the caller (filters out deleted ones)
    /// @return Array of only non-deleted todos
    function getActiveTodos() external view returns (Todo[] memory) {
        // Count active todos first
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _todos[msg.sender].length; i++) {
            if (_todos[msg.sender][i].exists) {
                activeCount++;
            }
        }

        // Create result array and fill it
        Todo[] memory active = new Todo[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < _todos[msg.sender].length; i++) {
            if (_todos[msg.sender][i].exists) {
                active[index] = _todos[msg.sender][i];
                index++;
            }
        }
        return active;
    }
}
