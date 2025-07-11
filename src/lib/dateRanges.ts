
export interface DateRange {
    start: string;
    end: string;
  }
  
  /**
   * Returns an ISO yyyy-MM-dd date range of length `lengthDays`,
   * ending `offsetDays` ago.
   *
   *   - getWindow(7)          → [ today-7 … today   ]   (current 7d window)
   *   - getWindow(7,  7)      → [ today-14 … today-7 ]   (previous 7d window)
   *   - getWindow(30)         → [ today-30 … today  ]
   *   - getWindow(30, 30)     → [ today-60 … today-30]
   */
  export function getWindow(lengthDays: number, offsetDays: number = 0): DateRange {
    const now = new Date();
    // compute the window’s end = today - offset
    const end = new Date(now);
    end.setDate(now.getDate() - offsetDays);
    // compute the window’s start = end - length
    const start = new Date(end);
    start.setDate(end.getDate() - lengthDays);
  
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
  
    return {
      start: fmt(start),
      end:   fmt(end),
    };
  }
  