# AI Video Meeting Summarizer

An AI-powered web application that processes videos or YouTube links to generate accurate transcriptions, speaker-wise summaries, and key highlights. The system supports different types of content such as meetings, podcasts, lectures, and interviews, helping users quickly extract insights without watching long videos.

---

## Features

- Upload meeting video or audio files
- Paste YouTube video links directly for processing
- Supports multiple content types:
  - Meetings
  - Podcasts
  - Lectures
  - Interviews
- Automatic speech-to-text transcription
- Speaker-aware transcription
- AI-generated concise meeting summaries
- Key moment / highlight clip generation
- Export generated summary as a PDF
- Clean and responsive React-based UI
- FastAPI backend for AI processing

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript
- CSS

### Backend
-  Python
- FastAPI
- OpenAI Whisper (speech-to-text)
- MoviePy (audio/video processing)

---

## How It Works

1. User uploads a video/audio file **or** provides a YouTube link
2. Backend extracts audio from the source
3. Whisper model transcribes speech into text
4. Speaker segments are identified
5. AI generates a structured summary based on the selected content type
6. Important moments are extracted as short clips
7. User can download the summary as a PDF


---

## Getting Started (Local Setup)

### Prerequisites
- Node.js
- Python 3.9+
- pip

---

### Backend Setup (Using Virtual Environment)

#### Step 1: Navigate to backend folder
```bash
cd backend
```
#### Step 2: Create virtual environment
```bash
python -m venv venv
```
#### Step 3: Activate virtual environment 
Windows (PowerShell):
```bash
venv\Scripts\Activate
```
Mac/Linux:
```bash
source venv/bin/activate
```

#### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```
#### Step 5: Run backend server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000  
```
---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### Environment Variables

Create a .env file inside the folder:
```bash
GROQ_API_KEY = your_GROQ_API_KEY_here
HF_TOKEN = your_HF_TOKEN_here
```
---

## Screenshots

### Upload Meeting Video
![Upload Page](screenshots/homePage.png)

### Speaker-wise Transcription, Summary and Generated Highlight Clips
![Result Page](screenshots/summaryPage.jpeg)







