

export const PlayerBoardPlacement: { [key: number]: { getPlayerBoard: (playerIndex: number, activePlayerIndex: number) => number }} = {  
    // 2 Players    
    2: {
        getPlayerBoard: (playerIndex: number, activePlayerIndex: number): number => {
            return activePlayerIndex === playerIndex ? 0: 2 
        }
    }, 
    3: {
        getPlayerBoard: (playerIndex: number, activePlayerIndex: number): number => {
            if (activePlayerIndex === playerIndex) {
                return 0;
            }

            if (activePlayerIndex === 0) {
                switch(playerIndex) {
                    case 1:
                        return 2;
                    case 2:
                        return 3;
                }
            }

            if (activePlayerIndex === 1) {
                switch(playerIndex) {
                    case 0:
                        return 3;
                    case 2:
                        return 2;
                }
            }

            if (activePlayerIndex === 2) {
                switch(playerIndex) {
                    case 0:
                        return 1;
                    case 1:
                        return 2;
                }
            }

            return -1;
        }
    }, 
    4: {
        getPlayerBoard: (playerIndex: number, activePlayerIndex: number): number => {
            if (activePlayerIndex === playerIndex) {
                return 0;
            }

            if (activePlayerIndex === 0) {
                return playerIndex;
            }

            if (activePlayerIndex === 1) {
                switch(playerIndex) {
                    case 0:
                        return 3;
                    case 2:
                        return 1;
                    case 3:
                        return 2;
                }
            }

            if (activePlayerIndex === 2) {
                switch(playerIndex) {
                    case 0:
                        return 2;
                    case 1:
                        return 3;
                    case 3:
                        return 1;
                }
            }

            if (activePlayerIndex === 3) {
                switch(playerIndex) {
                    case 0:
                        return 1;
                    case 1:
                        return 2;
                    case 2:
                        return 3;
                }
            }

            return -1;
        }
    }
};