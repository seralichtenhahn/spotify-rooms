#!/usr/bin/env bash

cd functions/token
yarn install
cd ../..
yarn generate
cp .netlify/headers dist/_headers
cp .netlify/redirects dist/_redirects