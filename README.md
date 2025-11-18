# Opty - Back-end

This is the general backend service of Easy Purchase

-----

## 🚀 Getting Started (Local Development)

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites

  * **Python** 3.9+
  * **Poetry** for dependency management
  * **Docker** for containerization

### 2. Initial Configuration

First, set up your local environment variables by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and customize the variables for your environment.

> **Important:** Remember to also add any new environment variables to the configuration model in the `models.py` file.

### 3. Install Dependencies

Use Poetry to install all necessary Python packages. This command reads the `pyproject.toml` file and creates a virtual environment for you.

```bash
poetry install
```

### 4. Run the Application

To run the development server, you can use `poetry run` to execute the script within the correct virtual environment:

```bash
poetry run scripts/dev
```

Alternatively, you can activate the virtual environment first and then run the script directly.

```bash
# On Linux/Mac
source .venv/bin/activate

./script/dev
```

```bash
# On Windows
.venv\Scripts\activate.bat

uvicorn --app-dir easypurchase_backend --host 0.0.0.0 --port 8000 --reload main:app
```

The API should now be running on the specified host and port (e.g., `http://0.0.0.0:8000`).

-----

## 📚 Using the API

Once the application is running, you can access the interactive API documentation (powered by Swagger UI) in your browser:

➡️ **[http://localhost:8000/docs](http://localhost:8000/docs)**

This interface allows you to explore all available endpoints, view their parameters, and test them live.

-----

## 🧪 Running Tests

To run the full suite of automated tests, use the following command:

```bash
poetry run scripts/test
```

-----

## 🐳 Deploying with Docker

This project is designed to be deployed as a Docker container.

### Building the Image

To build the Docker image, run the `build` script with your Docker Hub username:

```bash
DOCKER_USER=your-docker-hub-user scripts/build
```

This will build and tag the image (e.g., `your-docker-hub-user/EasyPurchase:0.0.1`).

> **Note:** The production Docker image exposes the application on port **80**, while the local development server (`scripts/dev`) runs on port **8000**.

-----

## ❤️ Health Check

The application includes a health check endpoint to monitor its status. You can query it using `curl`:

```bash
# Example for a locally running instance
curl -fsS http://localhost:8000/health | jq .
```





# Opty - Front-end

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- Access to the backend (Java API and WebSocket)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/marsheuss/opty-Project-PI-IV.git
cd opty-Project-PI-IV
cd front-end
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the project root based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your settings


**Available environment variables:**

- `APP_PORT`: Port where the development server will run
- `VITE_WS_URL`: WebSocket server URL for real-time communication
- `VITE_JAVA_API_URL`: Java REST API URL

## How to Run

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or the port configured in `APP_PORT`)

### Production Build

```bash
npm run build
```

The build will be generated in the `dist/` folder

### Development Build

```bash
npm run build:dev
```

Creates a build with development settings

### Preview Build

```bash
npm run preview
```

Preview the production build locally

### Linting

```bash
npm run lint
```

Run ESLint to check code quality

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI components (shadcn/ui)
│   ├── ChatMessage.tsx
│   ├── DashboardNav.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ProgressBar.tsx
├── hooks/              # Custom React Hooks
│   ├── useClientChat.ts
│   ├── useSupervisorChat.ts
│   ├── useSupervisorQueue.ts
│   ├── useWebSocket.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utilities and configurations
│   └── utils.ts
├── pages/              # Application pages
│   ├── Index.tsx       # Home page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Onboarding.tsx  # Onboarding process
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Resultados.tsx  # Results page
│   ├── Perfil.tsx      # User profile
│   ├── ChatCliente.tsx # Client chat
│   ├── ChatSupervisor.tsx # Supervisor chat
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

## Available Routes

- `/` - Home page
- `/login` - User authentication
- `/register` - New user registration
- `/onboarding` - Onboarding process
- `/dashboard` - Main dashboard
- `/resultados` - Results visualization
- `/perfil` - User profile
- `/chat/cliente` - Client chat
- `/chat/supervisor/:sessionId?` - Supervisor chat (with optional session ID)

