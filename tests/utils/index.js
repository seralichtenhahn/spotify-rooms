import { name, random } from "faker"

export function generateTrack() {
  return {
    title: name.title,
    artist: random.words,
    user: name.firstName,
    score: random.number
  }
}
