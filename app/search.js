import { searchAppleMusic } from "../../app/helpers";

console.log( await searchAppleMusic( {
  title: 'Pretend (A$AP Rocky)',
  artist: 'Tinashe',
} ) );