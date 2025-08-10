import { Box, Typography, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Person, Starship } from '@/generated/graphql';
import { formatAttributeValue } from '@/utils/game-utils';

interface BattleCardProps {
  card: UseQueryResult<Person | Starship, Error>;
  resourceType: 'people' | 'starships';
  winner: 'left' | 'right' | 'tie' | null;
  gameState: 'idle' | 'loading' | 'playing' | 'showingWinner';
  position: 'left' | 'right';
  isGameLoading: boolean;
}

export function BattleCard({
  card,
  resourceType,
  winner,
  gameState,
  position,
  isGameLoading,
}: BattleCardProps) {
  const attribute = resourceType === 'people' ? 'mass' : 'crew';

  // Determine if this card is the winner or tied
  const isWinner = winner === position;
  const isTie = winner === 'tie';
  const shouldShowChip = gameState === 'showingWinner' && (isWinner || isTie);

  // Get the attribute value for display
  const getAttributeValue = (cardData: Person | Starship) => {
    return resourceType === 'people' ? (cardData as Person).mass : (cardData as Starship).crew;
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        minHeight: 200,
        border: isWinner ? '2px solid' : '1px solid',
        borderColor: isWinner ? 'success.main' : isTie ? 'warning.main' : 'divider',
      }}
    >
      <CardContent>
        {shouldShowChip && (
          <Chip
            label={isWinner ? 'WINNER!' : 'TIE'}
            color={isWinner ? 'success' : 'warning'}
            size="small"
            sx={{ float: 'right' }}
          />
        )}

        {isGameLoading || card.isLoading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}
          >
            <CircularProgress />
          </Box>
        ) : card.data ? (
          <>
            <Typography variant="h5" gutterBottom>
              {card.data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {resourceType === 'people' ? 'Person' : 'Starship'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                {formatAttributeValue(getAttributeValue(card.data), attribute)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
              </Typography>
            </Box>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
