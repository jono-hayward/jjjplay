import { searchAppleMusic } from "./helpers.js";

console.log( await searchAppleMusic( {
  title: 'Pretend (A$AP Rocky)',
  artist: 'Tinashe',
} ) );