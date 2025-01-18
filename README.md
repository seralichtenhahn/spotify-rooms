# Spotify Rooms 🎵

Spotify Rooms is a collaborative listening experience where users can vote on the next song to play—making it more interactive and democratic than Spotify Jams. Built in 2019, this project was ahead of its time.

## 🚀 Features

-	Collaborative Playlists: Users can join a room and suggest songs.
-	Voting System: Let the majority decide the next song in the queue.
-	Real-Time Updates: Changes sync instantly across all users in the room.
-	Customizable Rooms: Set a theme or vibe for your listening session.

## 🛠 First Steps

Follow these steps to get the project up and running:

1. Clone the repository:
```
git clone https://github.com/seralichtenhahn/spotify-rooms.git  
cd spotify-rooms  
```

2. Configure your environment:
- Edit name, description, and author in package.json.
- Copy .env.dist to .env and fill in your API keys.

3. Install dependencies:

```
yarn  
```

## 👩‍💻 Development

This project is built with Nuxt.js. Use the following commands to start developing:

```
# Start a development server with hot reload at localhost:3000  
yarn dev  

# Build for production and start the server  
yarn build  
yarn start  

# Generate a static project  
yarn generate
```

For more details, see the Nuxt.js documentation.

## 🔍 Linting

Keep your code clean and consistent:

```
# Check for SCSS style errors  
yarn lint:scss  

# Fix SCSS style issues automatically  
yarn lint:scss --fix  

# Check for Vue.js issues  
yarn lint:vue  

# Fix Vue.js issues automatically  
yarn lint:vue --fix  

# Run all linting tools  
yarn lint
```

## 🎨 CSS Normalization

The project uses the postcss-normalize plugin, which leverages the browserlist defined in package.json.
You can import normalized CSS using the @import-normalize statement in the global.scss file.

## 📦 Updating Dependencies

Keep your dependencies up-to-date using npm-check-updates:

```
# Check for updates  
ncu  

# Update specific packages  
ncu -u package-name  

# Test after upgrading  
yarn dev
```

⚠️ Avoid updating these packages, as they might introduce breaking changes:
- eslint-config-prettier
- eslint-plugin-prettier
- eslint-plugin-vue
- prettier

## 🕺 About the Project

Spotify Rooms was inspired by a desire to improve collaborative listening experiences. While Spotify Jams offers a basic version of this concept, Spotify Rooms takes it further with a real-time voting system, ensuring everyone in the room gets a say in the music lineup.

Built in 2019, this project predated Spotify Jams by several years and showcases the power of real-time interactivity in music.

## 🛠 Technologies
- Frontend: Nuxt.js, SCSS
- Build Tools: Yarn, CircleCI
- Hosting: Netlify
