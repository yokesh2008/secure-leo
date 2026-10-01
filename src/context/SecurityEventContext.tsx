import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityEvent } from '../types';

interface SecurityEventContextType {
  events: SecurityEvent[];
  logEvent: (
    type: SecurityEvent['type'],
    component: string,
    message: string,
    severity?: SecurityEvent['severity'],
    details?: Record<string, any>
  ) => void;
  clearEvents: () => void;
  filterSeverity: string;
  setFilterSeverity: (sev: string) => void;
}

const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-1001',
    timestamp: '21:40:12',
    type: 'LAB_STARTED',
    severity: 'info',
    component: 'SANDBOX-MOCK-SQL-01',
    message: 'User initialized SQL Injection vulnerable environment node.',
  },
  {
    id: 'evt-1002',
    timestamp: '21:41:05',
    type: 'AUTH_BYPASS_ATTEMPT',
    severity: 'high',
    component: 'shop.secureleo.local/auth',
    message: 'Tautology payload detected in SQL query generator: "\' OR \'1\'=\'1"',
  },
  {
    id: 'evt-1003',
    timestamp: '21:42:18',
    type: 'VULNERABILITY_DETECTED',
    severity: 'critical',
    component: 'shop.secureleo.local/catalog',
    message: 'Reflected script payload in DOM: <img onerror="alert(1)">',
  },
  {
    id: 'evt-1004',
    timestamp: '21:43:40',
    type: 'REMEDIATION_VIEWED',
    severity: 'info',
    component: 'KNOWLEDGE-BASE',
    message: 'User analyzed parameterized query remediation diff.',
  },
  {
    id: 'evt-1005',
    timestamp: '21:44:55',
    type: 'CHALLENGE_COMPLETED',
    severity: 'low',
    component: 'ACADEMY-ENGINE',
    message: 'Completed "HTTP & Security Headers" knowledge check.',
  },
];

const SecurityEventContext = createContext<SecurityEventContextType | undefined>(undefined);

export const SecurityEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const logEvent = (
    type: SecurityEvent['type'],
    component: string,
    message: string,
    severity: SecurityEvent['severity'] = 'info',
    details?: Record<string, any>
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEvent: SecurityEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      type,
      severity,
      component,
      message,
      details,
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <SecurityEventContext.Provider
      value={{
        events,
        logEvent,
        clearEvents,
        filterSeverity,
        setFilterSeverity,
      }}
    >
      {children}
    </SecurityEventContext.Provider>
  );
};

export const useSecurityEvents = () => {
  const context = useContext(SecurityEventContext);
  if (!context) {
    throw new Error('useSecurityEvents must be used within a SecurityEventProvider');
  }
  return context;
};
