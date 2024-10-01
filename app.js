const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const { generateVideo } = require('./dIdHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const convertSRTtoVTT = (srt) => {
    const lines = srt.split('\n');
    const vtt = ['WEBVTT\n'];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line || !isNaN(line)) continue;
        
        if (line.includes('-->')) {
            line = line.replace(/,/g, '.');
        }

        vtt.push(line);
    }

    return vtt.join('\n');
};



app.post('/generate-video', async (req, res) => {
    try {
        const { resultUrl, subtitleUrl } = await generateVideo(req.body);
        
        let vttUrl = null;
        if (subtitleUrl) {
            const srtResponse = await axios.get(subtitleUrl);
            const srtContent = srtResponse.data;
            const vttContent = convertSRTtoVTT(srtContent);
            console.log('VTT Content:', vttContent);

            vttUrl = `data:text/vtt;charset=utf-8,${encodeURIComponent(vttContent)}`;
        }

        res.json({ videoUrl: resultUrl, subtitleUrl: vttUrl });
    } catch (error) {
        console.error('Error generating video:', error);
        res.status(500).send('Error generating video');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
