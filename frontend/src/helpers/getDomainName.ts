function getDomainKeyword(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');

    return parts.length > 1 ? parts[1] : null;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

export default getDomainKeyword;