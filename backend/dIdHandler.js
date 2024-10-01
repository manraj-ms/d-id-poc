const axios = require('axios');
require('dotenv').config();

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateVideo = async (data) => {
    const response = await axios.post('https://api.d-id.com/talks', data, {
        headers: {
            'Authorization': `Basic ${process.env.D_ID_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    const videoId = response.data.id;
    console.log('Video ID:', videoId);

    let resultUrl = null;
    let subtitleUrl = null;

    while (!resultUrl || !subtitleUrl) {
        console.log('Polling for result_url and subtitle_url...');
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.d-id.com/talks/${videoId}`,
            headers: { 
                'Authorization': `Basic ${process.env.D_ID_API_KEY}`
            }
        };

        try {
            const pollResponse = await axios.request(config);
            const videoData = pollResponse.data;

            if (videoData.result_url) {
                resultUrl = videoData.result_url;
                console.log('Result URL:', resultUrl);
            }

            if (videoData.subtitles_url) {
                subtitleUrl = videoData.subtitles_url;
                console.log('Subtitle URL:', subtitleUrl);
            }
            if (resultUrl && subtitleUrl) {
                return { resultUrl, subtitleUrl };
            }

            await wait(2000);

        } catch (error) {
            console.error('Error while polling:', error);
            throw new Error('Failed to retrieve the result_url or subtitle_url.');
        }
    }
};

module.exports = { generateVideo };
