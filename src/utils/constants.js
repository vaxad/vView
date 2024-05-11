const videos = ["/videos/Chill Eve.mp4","/videos/Japan View.mp4", "/videos/Scenary View.mp4", "/videos/The Kid in You.mp4"]

function generateRandomColor() {
    const red = Math.floor(Math.random() * 200); 
    const green = Math.floor(Math.random() * 200);
    const blue = Math.floor(Math.random() * 200);

    const color = "#" + red.toString(16).padStart(2, '0') + 
                        green.toString(16).padStart(2, '0') + 
                        blue.toString(16).padStart(2, '0');

    return color;
}

function extractVideoTitle(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);

    const titleWithoutExtension = filename.split('.').slice(0, -1).join('.');

    const decodedTitle = decodeURIComponent(titleWithoutExtension);

    return decodedTitle;
}

const skipTime = 10;

export {videos, skipTime, generateRandomColor, extractVideoTitle}