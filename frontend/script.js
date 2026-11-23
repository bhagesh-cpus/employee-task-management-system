
const API_URL = "http://127.0.0.1:8001";

let employeesData = [];
let tasksData = [];

// Safely display text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Display form messages
function showMessage(elementId, message, success = true) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.className = success
        ? "text-success mt-2"
        : "text-danger mt-2";
}

// Task status badge
function getStatusBadge(status) {
    if (status === "Completed") {
        return '<span class="badge bg-success">Completed</span>';
    }

    if (status === "In Progress") {
        return '<span class="badge bg-info text-dark">In Progress</span>';
    }

    return '<span class="badge bg-warning text-dark">Pending</span>';
}

// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
}

// Sidebar navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll(".sidebar .nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

// Dashboard counts
function updateDashboardCounts() {
    document.getElementById("totalEmployees").textContent =
        employeesData.length;

    document.getElementById("totalTasks").textContent =
        tasksData.length;

    document.getElementById("pendingTasks").textContent =
        tasksData.filter(task => task.status === "Pending").length;

    document.getElementById("inProgressTasks").textContent =
        tasksData.filter(task => task.status === "In Progress").length;

    document.getElementById("completedTasks").textContent =
        tasksData.filter(task => task.status === "Completed").length;
}

// Populate employee dropdowns
function populateEmployeeDropdowns() {
    const dropdowns = [
        document.getElementById("assignedTo"),
        document.getElementById("updateAssignedTo")
    ];

    dropdowns.forEach(dropdown => {
        if (!dropdown) return;

        const previousValue = dropdown.value;

        dropdown.innerHTML =
            '<option value="">Select Employee</option>';

        employeesData.forEach(employee => {
            dropdown.innerHTML += `
                <option value="${employee.id}">
                    ${escapeHTML(employee.name)}
                </option>
            `;
        });

        if (
            [...dropdown.options].some(
                option => option.value === previousValue
            )
        ) {
            dropdown.value = previousValue;
        }
    });
}

// Display employees
function displayEmployees(employees) {
    const employeeList = document.getElementById("employeeList");

    if (!employeeList) return;

    if (employees.length === 0) {
        employeeList.innerHTML =
            '<p class="text-muted">No employees found.</p>';
        return;
    }

    employeeList.innerHTML = employees.map(employee => `
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">
                    ${escapeHTML(employee.name)}
                </h5>

                <p class="mb-1">
                    <strong>Employee ID:</strong>
                    ${escapeHTML(employee.id)}
                </p>

                <p class="mb-1">
                    <strong>Email:</strong>
                    ${escapeHTML(employee.email)}
                </p>

                <p class="mb-1">
                    <strong>Department:</strong>
                    ${escapeHTML(employee.department)}
                </p>

                <p class="mb-3">
                    <strong>Designation:</strong>
                    ${escapeHTML(employee.designation)}
                </p>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="editEmployee(${Number(employee.id)})">
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteEmployee(${Number(employee.id)})">
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}

// Display tasks
function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="text-muted">No tasks found.</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => {
        const employee = employeesData.find(
            item => String(item.id) === String(task.assigned_to)
        );

        const employeeName = employee
            ? employee.name
            : "Employee not found";

        return `
            <div class="card mb-3 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">
                        ${escapeHTML(task.title)}
                    </h5>

                    <p class="mb-1">
                        <strong>Task ID:</strong>
                        ${escapeHTML(task.id)}
                    </p>

                    <p class="mb-1">
                        <strong>Description:</strong>
                        ${escapeHTML(task.description)}
                    </p>

                    <p class="mb-1">
                        <strong>Assigned To:</strong>
                        ${escapeHTML(employeeName)}
                    </p>

                    <p class="mb-1">
                        <strong>Due Date:</strong>
                        ${escapeHTML(task.due_date)}
                    </p>

                    <p class="mb-3">
                        <strong>Status:</strong>
                        ${getStatusBadge(task.status)}
                    </p>

                    <button
                        class="btn btn-primary btn-sm"
                        onclick="editTask(${Number(task.id)})">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteTask(${Number(task.id)})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// Search employees
function searchEmployees() {
    const searchValue =
        document.getElementById("employeeSearch").value.toLowerCase();

    const filteredEmployees = employeesData.filter(employee =>
        String(employee.name).toLowerCase().includes(searchValue) ||
        String(employee.email).toLowerCase().includes(searchValue) ||
        String(employee.department).toLowerCase().includes(searchValue) ||
        String(employee.designation).toLowerCase().includes(searchValue)
    );

    displayEmployees(filteredEmployees);
}

// Search tasks
function searchTasks() {
    const searchValue =
        document.getElementById("taskSearch").value.toLowerCase();

    const filteredTasks = tasksData.filter(task =>
        String(task.title).toLowerCase().includes(searchValue) ||
        String(task.description).toLowerCase().includes(searchValue) ||
        String(task.status).toLowerCase().includes(searchValue)
    );

    displayTasks(filteredTasks);
}

// Load employees
async function loadEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees/`);

        if (!response.ok) {
            throw new Error("Could not load employees.");
        }

        employeesData = await response.json();

        displayEmployees(employeesData);
        populateEmployeeDropdowns();
        updateDashboardCounts();

    } catch (error) {
        console.error("Employee loading error:", error);
    }
}

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/`);

        if (!response.ok) {
            throw new Error("Could not load tasks.");
        }

        tasksData = await response.json();

        displayTasks(tasksData);
        updateDashboardCounts();

    } catch (error) {
        console.error("Task loading error:", error);
    }
}

// Edit employee
function editEmployee(id) {
    const employee = employeesData.find(
        item => Number(item.id) === Number(id)
    );

    if (!employee) return;

    document.getElementById("updateEmployeeId").value = employee.id;
    document.getElementById("updateName").value = employee.name;
    document.getElementById("updateEmail").value = employee.email;
    document.getElementById("updateDepartment").value = employee.department;
    document.getElementById("updateDesignation").value = employee.designation;

    document.getElementById("employeeForms").scrollIntoView({
        behavior: "smooth"
    });
}

// Edit task
function editTask(id) {
    const task = tasksData.find(
        item => Number(item.id) === Number(id)
    );

    if (!task) return;

    document.getElementById("updateTaskId").value = task.id;
    document.getElementById("updateTaskTitle").value = task.title;
    document.getElementById("updateTaskDescription").value =
        task.description;

    document.getElementById("updateAssignedTo").value = task.assigned_to;
    document.getElementById("updateDueDate").value = task.due_date;
    document.getElementById("updateTaskStatus").value = task.status;

    document.getElementById("taskForms").scrollIntoView({
        behavior: "smooth"
    });
}

// Create employee
document.getElementById("employeeForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const employee = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            department: document.getElementById("department").value,
            designation: document.getElementById("designation").value
        };

        try {
            const response = await fetch(`${API_URL}/employees/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail || "Could not create employee."
                );
            }

            showMessage(
                "employeeMessage",
                "Employee added successfully!"
            );

            this.reset();

            await loadEmployees();
            await loadTasks();

        } catch (error) {
            showMessage("employeeMessage", error.message, false);
        }
    }
);

// Update employee
document.getElementById("updateEmployeeForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const id = document.getElementById("updateEmployeeId").value;

        const employee = {
            name: document.getElementById("updateName").value,
            email: document.getElementById("updateEmail").value,
            department: document.getElementById("updateDepartment").value,
            designation: document.getElementById("updateDesignation").value
        };

        try {
            const response = await fetch(
                `${API_URL}/employees/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(employee)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail || "Could not update employee."
                );
            }

            showMessage(
                "updateEmployeeMessage",
                "Employee updated successfully!"
            );

            this.reset();

            await loadEmployees();
            await loadTasks();

        } catch (error) {
            showMessage("updateEmployeeMessage", error.message, false);
        }
    }
);

// Create task
document.getElementById("taskForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const task = {
            title: document.getElementById("taskTitle").value,
            description: document.getElementById("taskDescription").value,
            assigned_to: Number(
                document.getElementById("assignedTo").value
            ),
            due_date: document.getElementById("dueDate").value,
            status: document.getElementById("taskStatus").value
        };

        try {
            const response = await fetch(`${API_URL}/tasks/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail || "Could not create task."
                );
            }

            showMessage(
                "taskMessage",
                "Task created successfully!"
            );

            this.reset();

            await loadTasks();

        } catch (error) {
            showMessage("taskMessage", error.message, false);
        }
    }
);

// Update task
document.getElementById("updateTaskForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const id = document.getElementById("updateTaskId").value;

        const task = {
            title: document.getElementById("updateTaskTitle").value,
            description: document.getElementById("updateTaskDescription").value,
            assigned_to: Number(
                document.getElementById("updateAssignedTo").value
            ),
            due_date: document.getElementById("updateDueDate").value,
            status: document.getElementById("updateTaskStatus").value
        };

        try {
            const response = await fetch(
                `${API_URL}/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(task)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail || "Could not update task."
                );
            }

            showMessage(
                "updateTaskMessage",
                "Task updated successfully!"
            );

            this.reset();

            await loadTasks();

        } catch (error) {
            showMessage("updateTaskMessage", error.message, false);
        }
    }
);

// Delete employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/employees/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const result = await response.json();
            throw new Error(
                result.detail || "Could not delete employee."
            );
        }

        alert("Employee deleted successfully!");

        await loadEmployees();
        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/tasks/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const result = await response.json();
            throw new Error(
                result.detail || "Could not delete task."
            );
        }

        alert("Task deleted successfully!");

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Search event listeners
document.getElementById("employeeSearch").addEventListener(
    "input",
    searchEmployees
);

document.getElementById("taskSearch").addEventListener(
    "input",
    searchTasks
);

// Start application
async function initializeApp() {
    displayCurrentDate();
    setupNavigation();

    await loadEmployees();
    await loadTasks();
}

initializeApp();

















