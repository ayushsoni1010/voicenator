# Voicenator

**Breaking Language Barriers: Real-time Translation and Transcription with Voicenator**

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [Technologies Used](#technologies-used)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

## Introduction

Voicenator is a cutting-edge AI-powered application designed to break down language barriers by offering real-time translation and transcription services. Leveraging the power of Web Speech API, Deepgram, and WebSockets, Voicenator provides seamless speech-to-text and text-to-speech functionalities, making communication easier and more efficient.

## Features

- **Real-time Translation**: Translate speech or text in real-time across multiple languages.
- **Speech-to-Text**: Accurate transcription of spoken words into text using Deepgram.
- **Text-to-Speech**: Convert written text into natural-sounding speech with SpeechSynthesis.
- **Voice Cloning**: Create high-quality AI clones of human voices.
- **AI Dubbing**: Automatically translate and dub videos in multiple languages.
- **Transcription**: Transcribe videos with high accuracy in over 20 languages.
- **AI Avatar**: Generate AI-driven video content.
- **Text-to-Speech API**: Utilize our API for natural-sounding text-to-speech conversions.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

### Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/voicenator.git
   cd voicenator
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```env
   REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key
   REACT_APP_WEB_SOCKET_URL=your_websocket_url
   ```

4. Start the development server:
   ```sh
   npm start
   # or
   yarn start
   ```

## Usage

1. **Real-time Translation**: Select your source and target languages, then start speaking or typing to see instant translations.
2. **Speech-to-Text**: Use the microphone button to start speaking and see your words transcribed in real-time.
3. **Text-to-Speech**: Enter text into the input field and press the play button to hear the speech output.
4. **Voice Cloning, AI Dubbing, and other advanced features**: Navigate through the application menu to access and utilize these functionalities.

## Configuration

### Web Speech API

Voicenator utilizes the Web Speech API for speech recognition and synthesis. Ensure your browser supports this API.

### Deepgram API

Deepgram provides the backend for speech-to-text functionality. Sign up on Deepgram's website to get your API key and add it to your `.env` file.

### WebSockets

WebSockets are used for real-time data transmission. Configure the WebSocket URL in your `.env` file.

## Technologies Used

- **React**: Frontend framework
- **TypeScript**: Static typing for JavaScript
- **Redux**: State management
- **Web Speech API**: Browser API for speech recognition and synthesis
- **Deepgram**: Speech-to-text API
- **Socket.io**: WebSocket library for real-time communication
- **Vite**: Build tool for frontend development

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch:
   ```sh
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add YourFeature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature/YourFeature
   ```
5. Open a pull request

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please reach out to us:

- **Email**: ayushsoni1010.work@gmail.com
- **Website**: https://ayushsoni1010.com

---

Thank you for using Voicenator! We hope this tool makes your communication more effective and breaks down language barriers effortlessly.
