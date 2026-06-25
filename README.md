# Announcement Board REST API

A secure, JSON-based REST API for an announcement board. Built with Node.js, Express, and Prisma, featuring JWT authentication and strict data ownership validation.

## ✨ Features

JWT Authentication: Secure login with short-lived Access tokens and rotated Refresh tokens (HttpOnly cookies).

Data Ownership: Users can only update or delete their own announcements.

Public Feed: View, search, sort, and paginate (10 per page) announcements without authentication.

Validation: Strict payload validation using celebrate (Joi).

API Docs: Interactive Swagger UI documentation.

## 🛠 Tech Stack

Backend: Node.js, Express 5

Database: SQLite, Prisma ORM

Security: jsonwebtoken, bcrypt

Validation & Docs: celebrate (Joi), swagger-ui-express

## 🚀 Getting Started

Prerequisites
Node.js (v18+)

npm

## Installation

Clone the repository and navigate to the project folder:

Bash
git clone <repo-url>
cd <project-folder>
Install dependencies:

Bash
npm install
Create a .env file in the root directory and add your variables:

```
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

Run database migrations:

Bash
npx prisma migrate dev
Start the development server:

Bash
npm run dev
The server will start on http://localhost:3000 and redirect to the Swagger API docs.

# Дошка оголошень REST API

Захищений REST API для дошки оголошень. Побудований на Node.js, Express та Prisma з підтримкою JWT-автентифікації та суворим контролем прав власності на дані.

## ✨ Функціонал

JWT Автентифікація: Безпечний вхід через Access-токени та ротацію Refresh-токенів (HttpOnly cookies).

Концепція власності (Ownership): Користувачі можуть оновлювати або видаляти лише власні оголошення.

Публічна стрічка: Перегляд, пошук, сортування та пагінація (по 10 записів) доступні без авторизації.

Валідація: Сувора перевірка вхідних даних за допомогою celebrate (Joi).

Документація: Інтерактивна документація через Swagger UI.

## 🛠 Технології

Бекенд: Node.js, Express 5

База даних: SQLite, Prisma ORM

Безпека: jsonwebtoken, bcrypt

Валідація та Документація: celebrate (Joi), swagger-ui-express

## 🚀 Запуск проекту

Вимоги
Node.js (v18+)

npm

## Встановлення

Клонуйте репозиторій та перейдіть у папку проекту:

Bash
git clone <repo-url>
cd <project-folder>
Встановіть залежності:

Bash
npm install
Створіть файл .env у корені проекту та додайте змінні:

```
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

Виконайте міграції бази даних:

Bash
npx prisma migrate dev
Запустіть сервер у режимі розробки:

Bash
npm run dev
Сервер запуститься на http://localhost:3000 і автоматично перенаправить вас на сторінку документації Swagger.
