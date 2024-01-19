import React, { useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

export let db = SQLite.openDatabase('little_lemon');

export const createMenuTableInDBIfNotExisting = async () => {
    console.log('createMenuTableInDBIfNotExisting');
    try {
    db.transaction((tx) => {
        tx.executeSql(
            'create table if not exists menu (id integer primary key not null, name text, description text, price real, image text, category text);'
        );
    })
    } catch (error) {
        console.log('Error in creating Menu Table in the SQLiteDB, error: ', error);
    }
};

// TODO: not nice that "readAllMenuFromDB" is to be implemented in the Home-Screen => try to find a better solution



// export const readAllMenuFromDB = async () => {
//     console.log('In readAllMenuFromDB');

//         db.transaction((tx) => {
//             tx.executeSql(
//                 'select * from menu;',
//                 [],
//                 (_, { rows: { _array } }) => {console.log('content of _array: ', _array); return _array},
//                 (_, error) => {console.log('Error in reading Menu Items from the SQLiteDB');reject(error); return null}
//             )
//         }
//         )
// };

// export const readAllMenuFromDB = async (callBackSetMenuArray) => {
//     console.log('In readAllMenuFromDB');
//     return new Promise(() => {
//         db.transaction((tx) => {
//             tx.executeSql(
//                 'select * from menu;',
//                 [],
//                 (_, { rows: { _array } }) => {callBackSetMenuArray(_array); console.log('content of _array: ', _array); return;},
//                 (_, error) => {console.log('Error in reading Menu Items from the SQLiteDB');reject(error)}
//             )
//         }
//         )
//     }
//     )
// };


// 
export const writeMenuItemToDB = async (menuItem) => {
    console.log('writeMenuItemToDB, item: ', menuItem.name);
        db.transaction((tx) => {
            tx.executeSql(
                'insert into menu (id, name, description, price, image, category) values (?, ?, ?, ?, ?, ?);',
                [menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image, menuItem.category],
                (_, { rows: { _array } }) => console.log('Item written to SQLite DB'),
                (_, error) => {console.log("Error in writeMenuItemToDB error: ", error); }
            )
        }   
        )
};

export const clearAllMenuSQLDB = async () => {
    try {
        db.closeAsync();
        await db.deleteAsync();
    } catch (error) {
        console.log('Error in clearing the SQLiteDB, error: ', error);
    }
}

export const openSQLiteDB = () => {
    db = SQLite.openDatabase('little_lemon');
}