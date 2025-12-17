export class PrivacyService {
  static redactSensitiveData(data: any): any {
    const redacted = JSON.parse(JSON.stringify(data));

    // Redact financial details
    if (redacted.amount) {
      redacted.amount = "[REDACTED]";
    }

    // Redact personal information from descriptions
    if (redacted.description) {
      redacted.description = this.redactText(redacted.description);
    }

    // Redact names and emails
    if (redacted.title) {
      redacted.title = this.redactText(redacted.title);
    }

    return redacted;
  }

  private static redactText(text: string): string {
    const patterns = [
      /\$\d+(?:\.\d{2})?/g, // Dollar amounts
      /\b\d{16}\b/g, // Credit card numbers
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
    ];

    let redacted = text;
    patterns.forEach((pattern) => {
      redacted = redacted.replace(pattern, "[REDACTED]");
    });

    return redacted;
  }
}
