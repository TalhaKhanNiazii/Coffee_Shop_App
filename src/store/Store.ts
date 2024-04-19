import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {produce} from 'immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
      CoffeeList: CoffeeData,
      BeansList: BeansData,
      FavoritesList: [],
      CartPrice: 0,
      CartList: [],
      OrderHistoryList: [],
      addToCart: (cartItem: any) =>
        set(
          produce(state => {
            let found = false;
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id === cartItem.id) {
                found = true;
                let size = false;
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (state.CartList[i].prices[j].size === cartItem.prices[0]) {
                    size = true;
                    state.CartList[i].prices[j].size = cartItem.prices[0]
                      .quantity++;
                    //Here we added quantity to the CartList.
                    break;
                  }
                  if (size === false) {
                    state.CartList[i].prices.push(cartItem.prices[0]);
                  }
                  state.CartList[i].prices.sort((a: any, b: any) => {
                    if (a.size > b.size) return -1;
                    if (a.size < b.size) return 1;
                    return 0;
                  });
                  break;
                }
              }
              if (found === false) {
                state.CartList.push(cartItem);
              }
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce(state => {
            let totalPrice = 0;
            for (let i = 0; i < state.CartList.length; i++) {
              let tempPrice = 0;
              for (let j = 0; j < state.CartList[i].prices.length; j++) {
                tempPrice +=
                  parseFloat(state.CartList[i].prices[j].price) *
                  state.CartList[i].prices[j].quantity;
              }
              state.CartList[i].ItemPrice = tempPrice.toFixed(2).toString();
              //Here we added ItemPrice to the CartList.
              totalPrice = totalPrice + tempPrice;
            }
            state.CartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavouriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type === 'Coffee') {
              for (let i = 0; i < state.CoffeeList.length; i++) {
                if (state.CoffeeList[i].id === id) {
                  if (state.CoffeeList[i].favourite === false) {
                    state.CoffeeList[i].favourite = true;
                    state.FavoritesList.unshift(state.CoffeeList[i]);
                  }
                  break;
                }
              }
            } else if (type === 'Bean') {
              for (let i = 0; i < state.BeansList.length; i++) {
                if (state.BeansList[i].id === id) {
                  if (state.BeansList[i].favourite === false) {
                    state.BeansList[i].favourite = true;
                    state.FavoritesList.unshift(state.BeansList[i]);
                  }
                  break;
                }
              }
            }
          }),
        ),
      deleteFromFavouriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type === 'Coffee') {
              for (let i = 0; i < state.CoffeeList.length; i++) {
                if (state.CoffeeList[i].id === id) {
                  if (state.CoffeeList[i].favourite === true) {
                    state.CoffeeList[i].favourite = false;
                    // state.FavoritesList = state.FavoritesList.filter((item: any) => item.id!== id);
                    // 1st method of removing elements from the favourites list.
                  }
                  break;
                }
              }
            } else if (type === 'Bean') {
              for (let i = 0; i < state.BeansList.length; i++) {
                if (state.BeansList[i].id === id) {
                  if (state.BeansList[i].favourite === true) {
                    state.BeansList[i].favourite = false;
                    // Similarly we can remove elements from the list by using above filter method.
                  }
                  break;
                }
              }
            }
            // 2nd method of removing elements from the favourites list.
            let spliceIndex = -1;
            for (let i = 0; i < state.FavoritesList.length; i++) {
              if (state.FavoritesList[i].id === id) {
                spliceIndex = i;
                break;
              }
            }
            state.FavoritesList.splice(spliceIndex, 1);
          }),
        ),
    }),
    {name: 'coffee-app', storage: createJSONStorage(() => AsyncStorage)},
  ),
);
