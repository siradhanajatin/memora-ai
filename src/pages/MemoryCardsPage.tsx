import React from 'react';
import { MemoryCard } from '../types';
import { MemoryCardsList } from '../components/MemoryCards/MemoryCardsList';

interface Props {
  memoryCards: MemoryCard[];
  onAddCard: (card: MemoryCard) => void;
  onDeleteCard: (id: string) => void;
  onReviewedCard: (id: string) => void;
}

export const MemoryCardsPage: React.FC<Props> = ({
  memoryCards,
  onAddCard,
  onDeleteCard,
  onReviewedCard,
}) => {
  return (
    <MemoryCardsList
      cards={memoryCards}
      onAddCard={onAddCard}
      onDeleteCard={onDeleteCard}
      onReviewedCard={onReviewedCard}
    />
  );
};
