# Task Manager

A task manager web application built using **Next.js**, **Tailwind CSS**, and **Ant Design**. This app allows users to add, edit, delete, and filter tasks efficiently. The tasks are managed through a backend API built using **Next.js API routes** for seamless server-side integration, and now tasks are also persisted in **local storage** to maintain state across page reloads.

## Features

- **Add Tasks**: Create new tasks with a title, description, and completion status.
- **Edit Tasks**: Update existing tasks by editing their title, description, or completion status.
- **Delete Tasks**: Remove tasks from the list.
- **Task Filtering**: Filter tasks based on their completion status (All, Completed, Pending).
- **Persistent State**: Tasks are stored in **local storage**, so they persist even after a page refresh.
- **Responsive Design**: Fully responsive layout that works seamlessly across devices.
- **Task Modals**: Interactive modals for adding and editing tasks.
- **Error Handling**: Includes error handling for API requests and task management.

## Technologies

- **Frontend**: Next.js, Tailwind CSS, Ant Design
- **Backend**: Next.js API routes (server-side functionality for CRUD operations)
- **State Management**: React `useState` (for local state management)
- **Local Storage**: Tasks are saved to the browser's local storage for persistence.

## Usage

- Add new tasks with titles, descriptions, and completion status.
- Edit existing tasks by clicking on the task card and making changes.
- Delete tasks by clicking the delete button on the task card.
- Filter tasks based on completion status (All, Completed, Uncompleted).
- Tasks will be stored in local storage, so they will persist even after a page refresh.

### Local Storage Integration

- The task list is saved to and loaded from **local storage**. This ensures that tasks are not lost when you refresh or reopen the app. Tasks are persisted even if you close and reopen the browser.

## Demo 
- You can use the demo here: [Task Manager Demo](https://to-do-woodoo.vercel.app/)
