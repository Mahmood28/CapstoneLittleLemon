import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isWeb = Platform.OS === 'web';
export const db = isWeb ? null : SQLite.openDatabase("little_lemon");

export async function createMenuTableInDBIfNotExisting() {
  if (isWeb) {
    // On web, we'll use AsyncStorage, so no table creation needed
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menu (id integer primary key not null, name text, description text, price real, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function readAllMenuFromDB() {
  if (isWeb) {
    try {
      const menuData = await AsyncStorage.getItem("menuData");
      return menuData ? JSON.parse(menuData) : [];
    } catch (error) {
      return [];
    }
  }
  
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from menu",
        [],
        (_, results) => {
          // var len = results.rows.length;
          // console.log('Number of menu items, len', len);
          resolve(results.rows._array);
        },
        (_, error) => {
          // console.log("Error in getMenuItems: ", error);
          resolve([]); // error => no entries found
        }
      );
    });
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  if (isWeb) {
    try {
      const menuData = await AsyncStorage.getItem("menuData");
      const menu = menuData ? JSON.parse(menuData) : [];
      
      return menu.filter(item => {
        const matchesQuery = !query || item.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(item.category);
        return matchesQuery && matchesCategory;
      });
    } catch (error) {
      return [];
    }
  }
  
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM menu WHERE name LIKE "%${query}%" AND category IN (${activeCategories.map(
          (item) => `'${item}'`
        )})`,
        [],
        (_, results) => {
          var len = results.rows.length;
          // console.log('Number of menu items, len', len);
          // console.log('results.rows._array', results.rows._array);
          resolve(results.rows._array);
        },
        (_, error) => {
          // console.log("Error in filterByQueryAndcategories ", error);
          resolve([]); // error => no entries found
        }
      );
    });
  });
}

export const writeMenuItemToDB = async (menuItem) => {
  if (isWeb) {
    try {
      const menuData = await AsyncStorage.getItem("menuData");
      const menu = menuData ? JSON.parse(menuData) : [];
      
      // Check if item already exists
      const existingIndex = menu.findIndex(item => item.id === menuItem.id);
      if (existingIndex === -1) {
        menu.push(menuItem);
        await AsyncStorage.setItem("menuData", JSON.stringify(menu));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve(error);
    }
  }
  
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR IGNORE INTO menu (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?);",
        [
          menuItem.id,
          menuItem.name,
          menuItem.description,
          menuItem.price,
          menuItem.image,
          menuItem.category,
        ],
        (_, results) => {
          // console.log('Menu Item written: ', menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image, menuItem.category);
          resolve(results);
        },
        (_, error) => {
          console.log("Error in writing Menu Item to the SQLiteDB");
          resolve(error);
        }
      );
    });
  });
};

export const deleteMenuItemsFromDB = async () => {
  if (isWeb) {
    try {
      await AsyncStorage.removeItem("menuData");
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve(error);
    }
  }
  
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM menu;", [], (_, results) => {
        // console.log("Menu Items deleted");
        resolve(results);
      });
    });
  });
};
