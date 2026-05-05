export function getInitials(name: string | null | undefined): string {
    // if name is empty, return empty string or default value
    if (!name) return "NN";

    // cleaning extra whitespace before/after words, then split by space 
    const words = name.trim().split(/\s+/);

    // if just 1 word (e.g "Akbar"), take first 2 character
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase(); // become "AK"
    }

    // if 2 word or more, take the first letter of the first 2 words
    return (words[0][0] + words[1][0]).toUpperCase();
}