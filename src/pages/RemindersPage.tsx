import React from 'react';
import { Reminder } from '../types';
import { RemindersList } from '../components/Reminders/RemindersList';

interface Props {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersPage: React.FC<Props> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  return (
    <RemindersList
      reminders={reminders}
      onToggleReminder={onToggleReminder}
      onAddReminder={onAddReminder}
      onDeleteReminder={onDeleteReminder}
    />
  );
};
