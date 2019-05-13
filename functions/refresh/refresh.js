/* eslint-disable */
const fetch = require("node-fetch");
const { URLSearchParams } = require("url")

exports.handler = async function(event, context) {
  // Nur POST Requests sind erlaubt
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 410,
      headers,
      body: JSON.stringify({
        message: "Method not allowed"
      })
    }
  }

  try {
    const payload = JSON.parse(event.body)

    // Fehler falls kein Refresh Token gegeben ist.
    if (!payload.refresh_token) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({
          message: "Required information is missing."
        })
      }
    }

    // Client ID und Client Secret werden zu base64 konventiert
    // https://developer.spotify.com/documentation/general/guides/authorization-guide/
    const base64encoded = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")

    const params = new URLSearchParams()
    params.append("grant_type", "refresh_token")
    params.append("refresh_token", payload.refresh_token)

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "post",
      headers: {
        Authorization: "Basic " + base64encoded,
      },
      body: params
    })

    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "invalid_token" }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
