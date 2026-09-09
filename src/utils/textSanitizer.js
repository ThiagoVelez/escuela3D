/**
 * Utility to fix malformed text, encoding artifacts and replacement characters (like  or ?)
 * across subjects, user names, grades, and teacher annotations.
 */
export function cleanText(str) {
  if (!str || typeof str !== 'string') return str || '';

  let cleaned = str
    // Fix UTF-8 misdecoded as Latin-1 artifacts
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Â°/g, '°')
    // Common Unicode replacement character (\uFFFD = )
    .replace(/Biolog[\uFFFD\?]a/gi, 'Biología')
    .replace(/BIOLOG[\uFFFD\?]A/g, 'BIOLOGÍA')
    .replace(/G[\uFFFD\?]mez/gi, 'Gómez')
    .replace(/R[\uFFFD\?]os/gi, 'Ríos')
    .replace(/investigaci[\uFFFD\?]n/gi, 'investigación')
    .replace(/Geometr[\uFFFD\?]a/gi, 'Geometría')
    .replace(/Frailej[\uFFFD\?]n/gi, 'Frailejón')
    .replace(/Ma[\uFFFD\?]ana/gi, 'Mañana')
    .replace(/evaluaci[\uFFFD\?]n/gi, 'evaluación')
    .replace(/calificaci[\uFFFD\?]n/gi, 'calificación')
    .replace(/educaci[\uFFFD\?]n/gi, 'educación')
    .replace(/inform[\uFFFD\?]tica/gi, 'informática')
    .replace(/direcci[\uFFFD\?]n/gi, 'dirección')
    .replace(/rector[\uFFFD\?]a/gi, 'rectoría')
    .replace(/acad[\uFFFD\?]mica/gi, 'académica')
    .replace(/matem[\uFFFD\?]ticas/gi, 'matemáticas')
    .replace(/f[\uFFFD\?]sica/gi, 'física')
    .replace(/qu[\uFFFD\?]mica/gi, 'química')
    .replace(/c[\uFFFD\?]lculo/gi, 'cálculo')
    // Fix grade degrees e.g. "10° A" or "10? A" or "10 A" -> "10° A"
    .replace(/\b10[\uFFFD\?\s]*A\b/g, '10° A')
    .replace(/\b10[\uFFFD\?\s]*B\b/g, '10° B')
    .replace(/\b11[\uFFFD\?\s]*A\b/g, '11° A')
    .replace(/\b11[\uFFFD\?\s]*B\b/g, '11° B')
    .replace(/10\s*A\b/g, '10° A')
    .replace(/10\s*B\b/g, '10° B')
    .replace(/11\s*A\b/g, '11° A')
    .replace(/11\s*B\b/g, '11° B')
    // Strip any remaining lone replacement char
    .replace(/\uFFFD/g, '');

  return cleaned;
}

