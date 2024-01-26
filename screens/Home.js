import React, { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import debounce from "lodash.debounce";
import { GlobalStateContext } from "../GlobalStateProvider";
import {
  createMenuTableInDBIfNotExisting,
  readAllMenuFromDB,
  writeMenuItemToDB,
  filterByQueryAndCategories,
} from "../MenuDatabase";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const categories = [
  "starters",
  "mains",
  "desserts",
  "drinks",
  "sides",
  "nonalc",
];

const HomeScreen = ({ navigation }) => {
  const [
    state,
    setIsLoadingTrue,
    setIsLoadingFalse,
    setIsOnboardingCompleteTrue,
    setIsOnboardingCompleteFalse,
  ] = React.useContext(GlobalStateContext);
  const [userData, setUserData] = useState({});
  const [menu, setMenu] = useState([]);
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    categories.map(() => false)
  );
  const [searchBarText, setSearchBarText] = useState("");

  const [filterButtons, setFilterButtons] = useState(
    categories.map((category) => {
      return {
        category: category,
        id: categories.indexOf(category),
      };
    })
  );

  const getUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      const data = userDataStr != null ? JSON.parse(userDataStr) : null;
      setUserData(data);
    } catch (error) {
      setIsOnboardingCompleteFalse(); // Handle error of not stored userData - return to OnboardingScreen
      console.log(error);
    }
  };

  const getUserDataWrapper = async () => {
    await getUserData();
    updateHeader();
  };

  const LogoTitle = () => {
    return (
      <Image
        style={{ height: 70, resizeMode: "contain" }}
        source={require("../img/Logo.png")}
        accessible={true}
        accessibilityLabel={"Little Lemon Logo"}
      />
    );
  };

  const AvatarTitle = () => {
    if (userData.avatarImage != null) {
      return (
        <Pressable
          onPress={() => {
            navigation.navigate("Profile");
          }}
          disabled={false}
        >
          <Image
            style={styles.avatarImageSmall}
            resizeMode="cover"
            source={{ uri: userData.avatarImage }}
            accessible={true}
            accessibilityLabel={"Avatar imgage"}
          />
        </Pressable>
      );
    } else {
      let initials = { first: ".", second: "." };
      if (userData.firstname != null && userData.firstname.length > 0) {
        initials.first = userData.firstname[0];
      }
      if (userData.lastname != null && userData.lastname.length > 0) {
        initials.second = userData.lastname[0];
      }
      return (
        <Pressable
          onPress={() => {
            navigation.navigate("Profile");
          }}
          disabled={false}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 40,
              backgroundColor: "#495E57",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {initials.first}
              {initials.second}
            </Text>
          </View>
        </Pressable>
      );
    }
  };

  const updateHeader = () => {
    navigation.setOptions({
      headerTitle: () => <LogoTitle />,
      headerRight: () => <AvatarTitle />,
    });
  };

  const FilterButton = ({ text }) => {
    return (
      <Pressable
        onPress={() => {
          setFilterSelections(
            filterSelections.map((item, index) =>
              index === categories.indexOf(text) ? !item : item
            )
          );
        }}
        style={
          filterSelections[categories.indexOf(text)]
            ? styles.buttonFilterPressed
            : styles.buttonFilterNOTPressed
        }
      >
        <Text
          style={
            filterSelections[categories.indexOf(text)]
              ? styles.buttonTextWhite
              : styles.buttonTextGreen
          }
        >
          {text}
        </Text>
      </Pressable>
    );
  };

  const fetchMenufromAPIAndWriteToSQLiteDB = async () => {
    try {
      const response = await fetch(API_URL);

      const json = await response.json();
      const menujson = await json.menu;

      await createMenuTableInDBIfNotExisting();

      let i = 1;
      menujson.forEach((menuEntry) => {
        writeMenuItemToDB({ id: i, ...menuEntry });
        i++;
      });
    } catch (error) {
      console.log(
        "Error in fetchMenufromAPIAndWriteToSQLiteDB when reading the menu: ",
        error
      );
    }
  };

  const getMenuDataWrapper = async () => {
    await getMenuData();
  };

  const getMenuData = async () => {
    try {
      let menuFromDB = await readAllMenuFromDB();

      // check if menuFromDB is without items, if so then read from API
      if (menuFromDB == null || menuFromDB.length == 0) {
        await fetchMenufromAPIAndWriteToSQLiteDB(); // read menu from API into the SQLite DB
        menuFromDB = await readAllMenuFromDB(); // read menu from SQLite DB into the menu variable
      }
      setMenu(menuFromDB);
    } catch (error) {
      console.log("Error in reading/writing DB-Table: ", error);
    }
  };

  const renderFilterButtonItem = ({ item }) => {
    return <FilterButton text={item.category} />;
  };

  const FlatListFilterButtonSeparator = () => {
    return <Text> </Text>;
  };

  const renderItem = ({ item }) => {
    let imageUri = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
    return (
      <Pressable
        onPress={() => {
          // console.log("button pressed: ", item.id, item.name);
          // TODO: show more info about the menu item pressed on
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            marginTop: 10,
          }}
        >
          <View style={{ flex: 5, marginRight: 10 }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
          <Image
            style={{ flex: 2, resizeMode: "cover", marginTop: 20, marginLeft: 10 }}
            source={{ uri: imageUri }}
            accessible={true}
            accessibilityLabel={item.name}
          />
        </View>
      </Pressable>
    );
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "lightgrey",
          marginTop: 10,
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  };

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  useEffect(() => {
    // this useEffect ensures initial loading of UserData and MenuData
    getUserDataWrapper();
    getMenuDataWrapper();
  }, []);

  useEffect(() => {
    // this useEffect ensures that the menu items will be updated when the filter or query is changed
    (async () => {
      const activeCategories = categories.filter((c, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const filteredMenuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setMenu(filteredMenuItems);
      } catch (e) {
        console.log("In HomeScreen: useEffect [filterSelections], error: ", e);
      }
    })();
  }, [filterSelections, query]);

  useEffect(() => {
    // this useEffect is to ensure that the avatar image will be updated when the userData changes
    updateHeader();
  }, [userData]);

  useFocusEffect(
    // useFocusEffect is to ensure the userData will be updated after returning from the ProfileScreen
    React.useCallback(() => {
      getUserDataWrapper();
      return () => {
        // console.log("In HomeScreen: useFocusEffect cleanup");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer1}>
        <Text style={styles.brandName}>Little Lemon</Text>
        <View style={styles.innerContainer2}>
          <View
            style={{
              flex: 4,
              marginRight: 5,
            }}
          >
            <Text style={styles.cityName}>Chicago</Text>
            <Text style={styles.regularText}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <Image
              style={{
                width: 140,
                height: 140,
                borderRadius: 20,
                resizeMode: "cover",
                marginRight:0,
                paddingRight:0,
              }}
              source={require("../img/Heroimage.png")}
              accessible={true}
              accessibilityLabel={"image showing a menu of food"}
            />
          </View>
        </View>
        <SearchBar
          placeholder="Search"
          placeholderTextColor="#495E57"
          onChangeText={handleSearchChange}
          value={searchBarText}
          containerStyle={styles.searchBarContainer}
          inputStyle={styles.searchBarText}
          inputContainerStyle={styles.searchBarInputContainer}
          searchIcon={{ size: 20, color: "#495E57" }}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "left" }}>
        <Text style={styles.sectionTitle}>Order for Delivery</Text>
        <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: "contain",
            marginLeft: 20,
          }}
          source={require("../img/DeliveryVan.png")}
          accessible={true}
          accessibilityLabel={"icon showing a delivery van"}
        />
      </View>
      <View style={{ height: "auto" }}>
        <FlatList
          horizontal={true}
          data={filterButtons}
          renderItem={renderFilterButtonItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={FlatListFilterButtonSeparator}
        />
      </View>
      <View
        style={{
          borderWidth: 0.8,
          borderRadius: 1,
          borderColor: "lightgrey",
          marginTop: 20,
        }}
      ></View>
      <FlatList
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  innerContainer1: {
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 8,
    alignItems: "left",
    backgroundColor: "#495E57",
  },
  innerContainer2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 0,
    paddingBottom: 0,
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  brandName: {
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10,
    color: "#F4CE14",
    textAlign: "left",
  },
  cityName: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 0,
    marginTop: 0,
    color: "white",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 0,
    marginTop: 10,
    color: "black",
    textAlign: "left",
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 8,
    marginTop: 10,
    color: "black",
    textAlign: "left",
  },
  itemDescription: {
    fontSize: 16,
    paddingLeft: 8,
    marginTop: 10,
    color: "#495E57",
    textAlign: "left",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 8,
    marginTop: 10,
    color: "#495E57",
    textAlign: "left",
  },
  regularText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "white",
    textAlign: "left",
  },
  buttonDisabled: {
    padding: 6,
    borderColor: "grey",
    backgroundColor: "grey",
    borderWidth: 2,
    borderRadius: 6,
    width: 80,
  },
  buttonFilterNOTPressed: {
    padding: 6,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    borderWidth: 2,
    borderRadius: 16,
    width: 80,
    height: 40,
  },
  buttonFilterPressed: {
    padding: 6,
    borderColor: "#495E57",
    backgroundColor: "#495E57",
    borderWidth: 2,
    borderRadius: 16,
    width: 80,
    height: 40,
  },
  buttonTextGreen: {
    color: "#495E57",
    textAlign: "center",
    fontSize: 16,
  },
  buttonTextWhite: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  inputHeadline: {
    fontSize: 11,
    fontWeight: "bold",
    padding: 4,
    marginTop: 10,
    color: "#495E57",
    textAlign: "left",
  },
  inputBox: {
    marginRight: 10,
    marginVertical: 2,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    paddingLeft: 10,
    fontSize: 15,
    color: "#495E57",
    textAlign: "left",
    borderColor: "#495E57",
    backgroundColor: "white",
    width: 280,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#495E57",
    textAlign: "left",
    paddingLeft: 15,
  },
  buttonEnabledLogout: {
    padding: 6,
    borderColor: "#F4CE14",
    backgroundColor: "#F4CE14",
    borderWidth: 2,
    borderRadius: 9,
    width: "100%",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonTextBlack: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  headercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
  },
  headerimage: {
    height: 70,
    marginStart: 10,
  },
  avatarImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  searchBarContainer: {
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 20,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchBarInputContainer: {
    backgroundColor: "#EDEFEE",
    borderRadius: 10,
    height: 35,
  },
  searchBarText: {
    color: "#495E57",
    fontSize: 16,

    margin: 0,
  },
});

export default HomeScreen;
