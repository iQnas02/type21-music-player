const audio = document.querySelector("#myAudio");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const nextButton = document.getElementById("next-button");
const songTitle = document.getElementById("song-title");
const canvas = document.getElementById("visualizationCanvas");
const canvasCtx = canvas.getContext("2d");

const songs = [

    {src: "ethereal-vistas-191254.mp3", title: "Vistas"},
    {src: "flow-211881.mp3", title: "Flow"},
    {src: "for-her-chill-upbeat-summel-travel-vlog-and-ig-music-royalty-free-use-202298.mp3", title: "royalty chill"},
    {src: "groovy-ambient-funk-201745.mp3", title: "funk"},
    {src: "movement-200697.mp3", title: "movement"},

];
let currentSongIndex = 0;

// Create an AudioContext and an AnalyserNode
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect the audio element to the AudioContext and AnalyserNode
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

playButton.addEventListener("click", () => {
    audio.play();
    audioContext.resume(); // Ensure AudioContext is resumed
});

pauseButton.addEventListener("click", () => {
    audio.pause();
});

nextButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audio.src = songs[currentSongIndex].src;
    songTitle.textContent = songs[currentSongIndex].title;
    audio.play();
});

// Update song title on initial load
songTitle.textContent = songs[currentSongIndex].title;

const visualize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) / 2;

    const numCircles = bufferLength;
    const angleStep = (2 * Math.PI) / numCircles;

    for (let i = 0; i < numCircles; i++) {
        const value = dataArray[i];
        const angle = i * angleStep;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const circleRadius = value / 255 * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, circleRadius, 0, 2 * Math.PI);
        canvasCtx.strokeStyle = `rgb(${value}, 100, 150)`;
        canvasCtx.stroke();

        if (i > 0) {
            const prevAngle = (i - 1) * angleStep;
            const prevX = centerX + Math.cos(prevAngle) * radius;
            const prevY = centerY + Math.sin(prevAngle) * radius;

            canvasCtx.beginPath();
            canvasCtx.moveTo(prevX, prevY);
            canvasCtx.lineTo(x, y);
            canvasCtx.strokeStyle = `rgb(${value}, 100, 150)`;
            canvasCtx.stroke();
        }
    }

    requestAnimationFrame(visualize);
};

visualize();
