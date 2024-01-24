import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('little_lemon');

export async function createMenuTableInDBIfNotExisting() {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'create table if not exists menu (id integer primary key not null, name text, description text, price real, image text, category text);'
          );
        },
        reject,
        resolve
      );
    });
}

export async function readAllMenuFromDB () {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql('select * from menu', [], 
                (_, results) => {
                    // var len = results.rows.length;
                    // console.log('Number of menu items, len', len);
                    resolve(results.rows._array);
                },
                (_, error) => {
                    console.log("Error in getMenuItems: ",error);
                    resolve([]); // error => no entries found
                });
            });
    });
}

export async function filterByQueryAndCategories(query, activeCategories) {
    // console.log('filterByQueryAndCategories', query, activeCategories);
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
            console.log("Error in filterByQueryAndcategories ", error);
            resolve([]); // error => no entries found
          }
        );
      });
    });
  }
  

export const writeMenuItemToDB = async (menuItem) => {
    // console.log('writeMenuItemToDB, item: ', menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image, menuItem.category);
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT OR IGNORE INTO menu (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?);',
                [menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image, menuItem.category],
                (_, results) => {
                    // console.log('Menu Item written: ', menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image, menuItem.category);
                    resolve(results);
                },
                (_, error) => {
                    console.log('Error in writing Menu Item to the SQLiteDB');
                    resolve(error);
                }
                )
        }
        )
    }
    )
};

export const deleteMenuItemsFromDB = async () => {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM menu;',
                [],
                (_, results) => {
                    console.log('Menu Items deleted');
                    resolve(results);
                }
            )
        }
        )
    }
    )
}
