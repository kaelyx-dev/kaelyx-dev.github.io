const colours = {
    "red":       "#ca2d32",
    "green":     "#5ca857",
    "dark-blue":  "#36228e",
    "light-blue": "#6ba8eb",
    "yellow":    "#f8f845",
    "magenta":   "#ca008b",

    "black": "#000",
    "white": "#fff",

    "gray-1":" #444",
    "gray-2":" #666",
    "gray-3":" #888",
    "gray-4":" #aaa",
    "gray-5":" #ccc",
}

export default colour => colours[colour] ? parseColour(colour) : parseColour('red')

const parseColour = colour => ({name: colour, value: colours[colour], text: getContrastFontColour(colours[colour])})

export const getColours = () => Object.entries(colours).map(([k,v]) => ({name: k, value: v, text: getContrastFontColour(value)}))

export const getRandomColour = () => {
    const [name, value] = Object.entries(colours)[Math.floor(Math.random() * 6)]
    return {name, value, text: getContrastFontColour(value)}
}

export const getContrastFontColour = hex => {
  if(!hex) return 'white'
  hex = hex.trim().replace("#", '');
  if (hex.length < 6) hex = [...hex].map(c => c + c).join('');
  let [r, g, b, a = 'ff'] = hex.match(/.{2}/g).map(h => parseInt(h, 16));
  a /= 255;

  if (a < 1) {
    r = Math.round((1 - a) * 255 + a * r);
    g = Math.round((1 - a) * 255 + a * g);
    b = Math.round((1 - a) * 255 + a * b);
  }

  const luminance = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }).reduce((acc, val, i) => acc + val * [0.2126, 0.7152, 0.0722][i], 0);

  const threshold = 0.25;

  const contrastWithWhite = (1.05) / (luminance + 0.05);
  const contrastWithBlack = ((luminance + 0.05) / 0.05) * threshold;

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black';
  }
