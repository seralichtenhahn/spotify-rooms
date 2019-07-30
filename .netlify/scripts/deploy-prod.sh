#!/usr/bin/env bash

yarn generate
cp .netlify/headers dist/_headers
cp .netlify/redirects dist/_redirects