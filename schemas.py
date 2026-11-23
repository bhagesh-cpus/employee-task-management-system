
from pydantic import BaseModel, ConfigDict
from datetime import date


# Employee creation
class EmployeeCreate(BaseModel):
    name: str
    email: str
    department: str
    designation: str


# Employee update
class EmployeeUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    department: str | None = None
    designation: str | None = None


# Employee response
class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    department: str
    designation: str

    model_config = ConfigDict(from_attributes=True)


# Task creation
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    assigned_to: int
    due_date: date
    status: str = "Pending"


# Task update
class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    assigned_to: int | None = None
    due_date: date | None = None
    status: str | None = None


# Task response
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    assigned_to: int
    due_date: date
    status: str

    model_config = ConfigDict(from_attributes=True)

