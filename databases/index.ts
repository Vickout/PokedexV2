import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const add = async (value: IPokemon) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my-pokemons');
        if (jsonValue !== null) {
            const myPokemons: Array<IPokemon> = JSON.parse(jsonValue);
            await AsyncStorage.setItem('@my-pokemons', JSON.stringify([...myPokemons, value]));
        } else {
            await AsyncStorage.setItem('@my-pokemons', JSON.stringify([value]));
        }
    } catch (error) {
        console.log('error to add ==>', error)
    }
};

export const remove = async (id: number) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my-pokemons');
        if (jsonValue !== null) {
            const myPokemons: Array<IPokemon> = JSON.parse(jsonValue);
            const pokemonRemoved = myPokemons.filter(pokemon => pokemon.id !== id)
            await AsyncStorage.setItem('@my-pokemons', JSON.stringify(pokemonRemoved));
        }
    } catch (error) {
        console.log('error to del ==>', error)
    }
};

export const getAll = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my-pokemons');
        return jsonValue !== null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.log('error to get ==>', error)
    }
};

export const getById = async (id: number) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@my-pokemons');
        if (jsonValue !== null) {
            const myPokemons: Array<IPokemon> = JSON.parse(jsonValue);
            const pokemonFinded = myPokemons.find(pokemon => pokemon.id === id)
            return pokemonFinded;
        }

        return null;
    } catch (error) {
        console.log('error to getById ==>', error)
    }
};

