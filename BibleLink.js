const bookAbbreviations = {
    "Genesis": "Gen",
    "Exodus": "Exod",
    "Leviticus": "Lev",
    "Numbers": "Num",
    "Deuteronomy": "Deut",
    "Joshua": "Josh",
    "Judges": "Judg",
    "Ruth": "Ruth",
    "1 Samuel": "1 Sam",
    "2 Samuel": "2 Sam",
    "1 Kings": "1 Kgs",
    "2 Kings": "2 Kgs",
    "1 Chronicles": "1 Chr",
    "2 Chronicles": "2 Chr",
    "Ezra": "Ezra",
    "Nehemiah": "Neh",
    "Esther": "Esth",
    "Job": "Job",
    "Psalm": "Ps",
    "Proverbs": "Prov",
    "Ecclesiastes": "Eccl",
    "Eccl": "Eccl",
    "Song of Solomon": "Song",
    "Isaiah": "Isa",
    "Jeremiah": "Jer",
    "Lamentations": "Lam",
    "Ezekiel": "Ezek",
    "Daniel": "Dan",
    "Hosea": "Hos",
    "Joel": "Joel",
    "Amos": "Amos",
    "Obadiah": "Obad",
    "Jonah": "Jonah",
    "Micah": "Mic",
    "Nahum": "Nah",
    "Habakkuk": "Hab",
    "Zephaniah": "Zeph",
    "Haggai": "Hag",
    "Zechariah": "Zech",
    "Malachi": "Mal",
    "Matthew": "Matt",
    "Mark": "Mark",
    "Luke": "Luke",
    "John": "John",
    "Acts": "Acts",
    "Romans": "Rom",
    "1 Corinthians": "1 Cor",
    "2 Corinthians": "2 Cor",
    "Galatians": "Gal",
    "Ephesians": "Eph",
    "Philippians": "Phil",
    "Colossians": "Col",
    "1 Thessalonians": "1 Thess",
    "2 Thessalonians": "2 Thess",
    "1 Timothy": "1 Tim",
    "2 Timothy": "2 Tim",
    "Titus": "Titus",
    "Philemon": "Phlm",
    "Hebrews": "Heb",
    "James": "Jas",
    "1 Peter": "1 Pet",
    "2 Peter": "2 Pet",
    "1 John": "1 John",
    "2 John": "2 John",
    "Revelation": "Rev"
}

function writeLink(book, chapter, verse, title = null, embed = false) {

	console.log(`Writing link ${book} ${chapter} ${verse}`);

    const abbreviatedBook = bookAbbreviations[book] || book; // Default to full name if abbreviation not found

	console.log(`Found abbreviated book ${abbreviatedBook}`);

    const formattedChapter = String(chapter);
    const formattedVerse = `${verse}`;
    const linkTitle = title ? `|${title}` : '';

    return `${embed ? '!' : ''}[[${abbreviatedBook} ${formattedChapter}#${formattedVerse}${linkTitle}]]`;
}

function splitAtLastSpace(str) {
    const lastSpaceIndex = str.lastIndexOf(' ');
    return [str.substring(0, lastSpaceIndex), str.substring(lastSpaceIndex + 1)];
}

async function BibleLink(bibleReferencePromise) {
    const bibleReference = (await bibleReferencePromise).toString();
    const [book, chapterVerse] = splitAtLastSpace(bibleReference);
    const [chapter, verseSection] = chapterVerse.split(':');

    const extractVerseNumbers = (chapter, verseSection) => {
        const verseParts = verseSection ? verseSection.split(',') : [];
        const verses = [];

        verseParts.forEach(part => {
            if (part.includes('-')) {
                const [startVerse, endVerse] = part.split('-').map(Number);
                for (let verse = startVerse; verse <= endVerse; verse++) {
                    verses.push(verse);
                }
            } else {
                verses.push(parseInt(part));
            }
        });

        return verses;
    };

    const verseNumbers = extractVerseNumbers(chapter, verseSection);

    const links = verseNumbers.map(verse => writeLink(book, chapter, verse, null, true));

    return `**${writeLink(book, chapter, verseNumbers[0], bibleReference)}**\n` + links.join('\n') + '\n';
}

module.exports = BibleLink;
