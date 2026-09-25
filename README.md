# Hidden Horizon

## AI-Powered Sustainable Tourism Management Platform

Hidden Horizon is a tourism management platform designed to help identify tourism pressure, analyze destination sustainability, and support the redistribution of tourists from overcrowded destinations toward suitable lower-pressure destinations.

The platform provides separate public and government-oriented functionality, including destination discovery, destination and guide verification, tourism pressure analysis, redistribution simulation, AI-generated recommendations, and government decision support.

---

## Project Objectives

- Identify destinations experiencing high tourism pressure.
- Help discover lower-pressure destinations suitable for increased tourism.
- Support sustainable tourist redistribution.
- Analyze economic and environmental impacts of redistribution.
- Provide AI-assisted recommendations for government decision-making.
- Present tourism information through an interactive dashboard.
- Reduce dependence on manual analysis by automatically updating decision-support information.

---

## Main Features

### Public Tourism Features

- Destination discovery
- Destination information
- Destination details
- Tourism-related destination data

###Interactive Destination Map

-Displays destinations using their geographical coordinates
-Interactive map embedded directly into destination details
-Shows latitude and longitude
-Provides direct Get Directions functionality
-Helps travellers understand the location and accessibility of destinations


### Government Features

- Government dashboard
- Destination verification
- Tourism analytics
- Destination Health
- Tourism Pressure Scores
- Redistribution Simulation
- AI Analysis
- Recommended Redistribution
- Government Decision Support

---

## Redistribution Simulation

The government dashboard allows a user to select:

- An overcrowded destination
- A lower-pressure destination
- A visitor redistribution percentage

The system then calculates the redistribution scenario and displays the resulting tourism impact.

The simulation can be tested with different redistribution percentages.

The dashboard updates related decision-support sections automatically after a successful simulation without requiring a browser refresh.

---

## AI Decision Support

The AI analysis evaluates the redistribution scenario using tourism, economic, environmental, and accessibility-related indicators.

The dashboard presents:

- Overcrowding Impact
- Employment Impact
- Local Purchase Impact
- Government Profit Impact
- Water Saving
- Waste Impact
- Pollution Impact
- Accessibility Score

The system also generates an AI recommendation explaining the potential effects of tourist redistribution.

---

## Destination Health

The Destination Health module calculates a tourism pressure score using destination conditions including:

- Current visitor footfall
- Water usage
- Waste generation
- Pollution level

The resulting score is used to classify destinations as:

- HIGH PRESSURE
- MODERATE PRESSURE
- LOW PRESSURE

Higher tourism pressure indicates a greater need for redistribution.

---

## Recommended Redistribution

The recommendation system identifies:

1. A destination with high visitor footfall.
2. Lower-pressure candidate destinations.
3. The most suitable destination for receiving redistributed tourists.

The recommendation considers tourism pressure and destination resource conditions.

---

## Government Decision Support

The Government Decision Support section provides an overall assessment of a redistribution scenario.

It considers:

- Tourism pressure reduction
- Employment impact
- Local economic impact
- Government revenue impact
- Water savings
- Waste impact
- Pollution impact
- Accessibility

The result is presented as an overall assessment score and recommendation level.

---

## Automatic Dashboard Updates

After a successful redistribution simulation, the dashboard automatically refreshes the related analysis components.

The update flow is:

Simulation
→ Backend calculation
→ Updated simulation result
→ AI Analysis refresh
→ Destination Health refresh
→ Recommended Redistribution refresh

A browser refresh is not required.

---

## Technology Stack

### Frontend

- React
- JavaScript
- CSS
- Vite

### Backend

- Python
- FastAPI
- Uvicorn

### Database

- SQLAlchemy
- Relational database

### AI

- AI-generated tourism analysis and recommendations

---

## Project Structure

```text
RescueLens/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── ai.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md

###License
This project was developed as an academic/hackathon project.
