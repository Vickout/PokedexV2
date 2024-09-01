interface IPokemon {
    id: number;
    name: string;
    order: number;
    abilities: Array<{
        ability: {
            name: string;
            url: string;
        }
    }>
    moves: Array<{
        move: {
            name: string;
            url: string;
        }
    }>
    species: {
        url: string;
    }
    sprites: {
        front_default: string;
        other: {
            "official-artwork": {
                front_default: string;
            };
        }
    };
    stats: Array<{
        base_stat: number;
        stat: {
            name: string;
        }
    }>
    types: Array<{
        type: {
            name: string;
            url: string;
        };
    }>;
}