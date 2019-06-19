#!/usr/bin/env bash

(cd functions/token && yarn)
(cd functions/refresh && yarn)
yarn generate
cp .netlify/headers dist/_headers
cp .netlify/redirects dist/_redirects