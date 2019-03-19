require("dotenv").config()
const request = require("request")

let headers = {
  "Access-Control-Allow-Origin": "*", // better change this for production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

exports.handler = function(event, _context, callback) {
  // handle Option requests from axios
  if (event.httpMethod === "OPTIONS") {
    return callback(null, {
      statusCode: 204,
      headers
    })
  }

  // only allow POST requests
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

  // validate the form
  if (!payload.refresh_token) {
    return callback(null, {
      statusCode: 422,
      headers,
      body: JSON.stringify({
        message: "Required information is missing."
      })
    })
  }

  const base64encoded = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")

  console.log(base64encoded)

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
      console.log(body)

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
