export type EntryCategory = 'shopping' | 'reminder' | 'note' | 'recommendation' | 'todo';

export interface JournalEntry {
  id: string;
  content: string;
  category: EntryCategory;
  timestamp: Date;
}

class JournalStore {
  private entries: JournalEntry[] = [];

  addEntry(entry: { content: string; category: EntryCategory }): JournalEntry {
    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: entry.content,
      category: entry.category,
      timestamp: new Date(),
    };
    
    this.entries.push(newEntry);
    return newEntry;
  }

  getEntries(category?: EntryCategory): JournalEntry[] {
    if (category) {
      return this.entries.filter((entry) => entry.category === category);
    }
    return this.entries;
  }

  getEntry(id: string): JournalEntry | undefined {
    return this.entries.find((entry) => entry.id === id);
  }

  deleteEntry(id: string): boolean {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      this.entries.splice(index, 1);
      return true;
    }
    return false;
  }

  clearAllEntries(): void {
    this.entries = [];
  }

  getEntriesCount(): number {
    return this.entries.length;
  }

  getEntriesByCategory(): Record<EntryCategory, number> {
    const counts: Record<string, number> = {
      shopping: 0,
      reminder: 0,
      note: 0,
      recommendation: 0,
      todo: 0,
    };

    this.entries.forEach((entry) => {
      counts[entry.category]++;
    });

    return counts as Record<EntryCategory, number>;
  }
}

// Singleton instance - persists in server memory during runtime
export const journalStore = new JournalStore();