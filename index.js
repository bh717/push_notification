const express = require("express");
const cors = require("cors");
const request = require('request');

require('dotenv').config();
const API_KEY = process.env.onesignal_api_key;
const ONESIGNAL_APP_ID = "58565960-d135-41b4-b90b-a139f385b537";
const BASE_URL = "https://onesignal.com/api/v1";


const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


/**
 * OPTIONS BUILDER
 * @param {string} method
 * @param {string} path
 * @param {object} body
 * @returns {object} options
 */
const optionsBuilder = (method, path, body) => {
    return {
        method,
        'url': `${BASE_URL}/${path}`,
        'headers': {
            'Content-Type': 'application/json',   
            'Authorization': `Basic ${API_KEY}`,
        },
        body: body ? JSON.stringify(body) : null,
    };
}

/**
 * CREATE A PUSH NOTIFICATION
 * method: POST
 * Postman: https://www.postman.com/onesignaldevs/workspace/onesignal-api/request/16845437-c4f3498f-fd80-4304-a6c1-a3234b923f2c
 * API Reference: https://documentation.onesignal.com/reference#create-notification
 * path: /notifications
 * @param {object} body
 */

const createNotication = (body) => {
    const options = optionsBuilder("POST","notifications", body);
    console.log(options);
    request(options, (error, response) => {
        if (error) throw new Error(error);
        console.log(response.body);
        viewNotifcation(JSON.parse(response.body).id);
    });
}

/**
 * VIEW NOTIFICATION
 * method: GET
 * Postman: https://www.postman.com/onesignaldevs/workspace/onesignal-api/request/16845437-6c96ecf0-5882-4eac-a386-0d0cabc8ecd2
 * API Reference: https://documentation.onesignal.com/reference#view-notification
 * path: /notifications/{notification_id}?app_id=${ONE_SIGNAL_APP_ID}
 * @param {string} notificationId
 */
const viewNotifcation = (notificationId) => {

    const path = `notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`;
    const options = optionsBuilder("GET", path);
    request(options, (error, response)=> {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

/**
 * RUN THE NODE JS APP
 */
const body = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ['Subscribed Users'],
    data: {
      foo: 'bar',
    },
    contents: {
      en: 'Sample Push Message',
    },
};

app.get("/", async (req, res) => {
    createNotication(body);
});


app.listen(6969, () => {
    console.log("start");
  });