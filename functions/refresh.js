require("dotenv").config()
const request = require("request")

let headers = {
  "Access-Control-Allow-Origin": "*", // better change this for production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

/**
 * Führt eine Abfrage zu Spotify mit dem Refresh Token aus
 * Gibt die empfangenen Credentials zurück
 * @param {object} event - aws lambda event
 * @param {object} context - context der Funktion
 * @param {function} callback - Rückgabe Funktion
 * @return {request} Post Request
 */
exports.handler = function(event, _context, callback) {
  // Gibt lerren Rückgabewert zurück für Axios CORS check
  if (event.httpMethod === "OPTIONS") {
    return callback(null, {
      statusCode: 204,
      headers
    })
  }

  // Nur POST Requests sind erlaubt
  if (event.httpMethod !== "POST") {
    return callback(null, {
      statusCode: 410,
      headers,
      body: JSON.stringify({
        message: "Method not allowed"
      })
    })
  }

  const payload = JSON.parse(event.body)

  // Fehler falls kein Refresh Token gegeben ist.
  if (!payload.refresh_token) {
    return callback(null, {
      statusCode: 422,
      headers,
      body: JSON.stringify({
        message: "Required information is missing."
      })
    })
  }

  // Client ID und Client Secret werden zu base64 konventiert
  // https://developer.spotify.com/documentation/general/guides/authorization-guide/
  const base64encoded = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")

  // Führt Request zum Spotify auth server durch
  return request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      form: {
        grant_type: "refresh_token",
        refresh_token: payload.refresh_token
      },
      headers: {
        Authorization: "Basic " + base64encoded
      },
      json: true
    },
    function(error, response, body) {
      // Gibt ein Fehler zurück fall der Statuscode nicht 200 ist
      if (!error && response.statusCode === 200) {
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify(body)
        })
      } else {
        return callback(null, {
          statusCode: response.statusCode,
          body: JSON.stringify({
            message: "invalid_token"
          })
        })
      }
    }
  )
}
