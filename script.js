document.getElementById('generate-video').addEventListener('click', async () => {
    const response = await fetch('/generate-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "script": {
                "type": "text",
                "input": "These avatars are powered by advanced deep-learning algorithms, enabling them to mimic human-like gestures, lip movements, and facial expressions with remarkable accuracy. Ideal for customer service, marketing, education, and entertainment, D-ID avatars create engaging, personalized experiences across various platforms. By converting text or audio input into dynamic video presentations, these avatars can simulate real-time conversations, making digital communication more immersive than ever before. With applications ranging from virtual assistants to content creation, D-ID avatars redefine how brands and users connect in a virtual world, offering a blend of innovation, creativity, and realism.",
                "subtitles": true
            },
            "source_url": "s3://d-id-images-prod/auth0|662157d0333a7152ea88ae88/img_wA9bpeCeLMv625dY8CMCf/The-average-male-face-image-magnified-by-a-factor-of-3-a-Low-resolution-image-b-the.png"
        })
    }); 

    if (response.ok) {
        const { videoUrl, subtitleUrl } = await response.json();
        const videoElement = document.getElementById('video');
        const videoSource = document.getElementById('video-source');
        const subtitleTrack = document.getElementById('subtitle-track');

        videoSource.src = videoUrl;

        if (subtitleUrl) {
            subtitleTrack.src = subtitleUrl;
            subtitleTrack.kind = "subtitles";
            subtitleTrack.srclang = "en";
            subtitleTrack.label = "English";
        } else {
            subtitleTrack.style.display = 'none';
        }

        videoElement.style.display = 'block';
        videoElement.load(); 
        videoElement.play();
    } else {
        console.error('Failed to generate video');
    }
});
